import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { emailService } from '../utils/emailService';

interface AuthRequest extends Request {
  user?: any;
}

// Generate JWT Token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
};

// Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password, portfolio_slug, bio, location, timezone, skills, interests, social_links } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { portfolio_slug }]
    });

    if (existingUser) {
      res.status(400).json({ message: 'User with this email, username, or portfolio slug already exists' });
      return;
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
      portfolio_slug,
      bio,
      location,
      timezone,
      skills: skills || [],
      interests: interests || [],
      social_links: social_links || {}
    });

    await user.save();

    // Send welcome email
    emailService.sendWelcomeEmail(user.email, user.name).catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        username: user.username,
        email: user.email,
        portfolio_slug: user.portfolio_slug,
        is_verified: user.is_verified,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user._id as string);

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        username: user.username,
        email: user.email,
        portfolio_slug: user.portfolio_slug,
        is_verified: user.is_verified,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get Current User
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      name, bio, location, timezone, 
      skills, interests, social_links, 
      profile_picture, cover_image, photos, 
      journey, musicLinks, story, themeColor 
    } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // --- THE FIX: Robustly update all fields ---
    // Use `!== undefined` to allow clearing fields with empty arrays/strings
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (timezone !== undefined) user.timezone = timezone;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;
    if (social_links !== undefined) user.social_links = { ...user.social_links, ...social_links };
    if (profile_picture !== undefined) user.profile_picture = profile_picture;
    if (cover_image !== undefined) user.cover_image = cover_image;
    if (photos !== undefined) user.photos = photos;
    if (journey !== undefined) user.journey = journey;
    if (musicLinks !== undefined) user.musicLinks = musicLinks;
    if (themeColor !== undefined) user.themeColor = themeColor;

    // THE FIX: Add timestamp logic for the 24h story feature
    if (story !== undefined) {
      if (story.text || story.url) {
        user.story = {
          ...story,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
        };
      } else {
        // Clear the story if empty content is sent
        user.story = null;
      }
    }

    await user.save();

    // THE FIX: Return a consistent, clean user object
    const updatedUser = user.toObject();
    delete (updatedUser as any).password;
    delete (updatedUser as any).resetToken;
    delete (updatedUser as any).resetTokenExpiry;

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// Delete User Profile
export const deleteProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await user.deleteOne();
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error during profile deletion' });
  }
};

// Get User by Portfolio Slug
export const getUserBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const user = await User.findOne({ portfolio_slug: slug }).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: List all users
export const adminListUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    const users = await User.find(filter)
      .select('-password')
      .sort({ joined_date: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Update user role (is_admin, is_verified)
export const adminUpdateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { is_admin, is_verified } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (typeof is_admin === 'boolean') user.is_admin = is_admin;
    if (typeof is_verified === 'boolean') user.is_verified = is_verified;
    await user.save();
    res.json({
      message: 'User updated successfully',
      user: {
        user_id: user.user_id,
        name: user.name,
        username: user.username,
        email: user.email,
        is_verified: user.is_verified,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: Delete any user
export const adminDeleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 