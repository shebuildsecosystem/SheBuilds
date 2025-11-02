import { Request, Response } from 'express';
import { Challenge } from '../models/Challenge';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { emailService } from '../utils/emailService';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

// Create Challenge (Admin only)
export const createChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      theme, 
      duration, 
      start_date, 
      end_date, 
      prizes, 
      sponsors, 
      rules, 
      submission_requirements,
      max_participants 
    } = req.body;

    const challenge = new Challenge({
      title,
      theme,
      duration,
      start_date,
      end_date,
      prizes,
      sponsors,
      rules,
      submission_requirements,
      max_participants,
      created_by: req.user?._id
    });

    await challenge.save();

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Server error during challenge creation' });
  }
};

// Get All Challenges
export const getChallenges = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { is_active: true };

    if (status) {
      const now = new Date();
      if (status === 'upcoming') {
        filter.start_date = { $gt: now };
      } else if (status === 'running') {
        filter.start_date = { $lte: now };
        filter.end_date = { $gte: now };
      } else if (status === 'completed') {
        filter.end_date = { $lt: now };
      }
    }

    const challenges = await Challenge.find(filter)
      .populate('created_by', 'name username')
      .sort({ start_date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Challenge.countDocuments(filter);

    res.json({
      challenges,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Challenge by ID
export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id)
      .populate('created_by', 'name username')
      .populate('participants', 'name username portfolio_slug profile_picture')
      .populate('winners', 'title description');

    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register for Challenge
export const registerForChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    // Check if challenge is active
    if (!challenge.is_active) {
      res.status(400).json({ message: 'Challenge is not active' });
      return;
    }

    // Check if user is already registered
    if (challenge.participants.includes(req.user?._id)) {
      res.status(400).json({ message: 'Already registered for this challenge' });
      return;
    }

    // Check max participants
    if (challenge.max_participants && challenge.participants.length >= challenge.max_participants) {
      res.status(400).json({ message: 'Challenge is full' });
      return;
    }

    // Add user to participants
    challenge.participants.push(req.user?._id);
    await challenge.save();

    // Send confirmation email
    const user = await User.findById(req.user?._id);
    if (user) {
      emailService.sendChallengeRegistrationEmail(user.email, user.name, challenge.title).catch(error => {
        console.error('Failed to send challenge registration email:', error);
      });
    }

    res.json({
      message: 'Successfully registered for challenge',
      challenge
    });
  } catch (error) {
    console.error('Register for challenge error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Submit Project to Challenge
export const submitProjectToChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { challengeId } = req.params;
    const { projectId } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    // Check if user is registered for challenge
    if (!challenge.participants.includes(req.user?._id)) {
      res.status(400).json({ message: 'Not registered for this challenge' });
      return;
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if project belongs to user
    if (project.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to submit this project' });
      return;
    }

    // Convert challengeId to ObjectId
    const challengeObjectId = new Types.ObjectId(challengeId);
    if (!project.submitted_to_challenges.includes(challengeObjectId)) {
      project.submitted_to_challenges.push(challengeObjectId);
      await project.save();
    }

    res.json({
      message: 'Project submitted to challenge successfully',
      project
    });
  } catch (error) {
    console.error('Submit project to challenge error:', error);
    res.status(500).json({ message: 'Server error during submission' });
  }
};

// Admin: Update Challenge
export const updateChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'created_by' && key !== 'challenge_id') {
        (challenge as any)[key] = updateData[key];
      }
    });

    await challenge.save();

    res.json({
      message: 'Challenge updated successfully',
      challenge
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ message: 'Server error during challenge update' });
  }
};

// Admin: Set Challenge Winners
export const setChallengeWinners = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { winnerProjectIds } = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }

    // Validate that projects were submitted to this challenge
    const submittedProjects = await Project.find({
      _id: { $in: winnerProjectIds },
      submitted_to_challenges: challenge._id
    });

    if (submittedProjects.length !== winnerProjectIds.length) {
      res.status(400).json({ message: 'Some projects were not submitted to this challenge' });
      return;
    }

    challenge.winners = winnerProjectIds;
    await challenge.save();

    res.json({
      message: 'Challenge winners set successfully',
      challenge
    });
  } catch (error) {
    console.error('Set challenge winners error:', error);
    res.status(500).json({ message: 'Server error during winner selection' });
  }
};

// Admin: Delete Challenge
export const adminDeleteChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }
    await challenge.deleteOne();
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Admin delete challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User's Challenges
export const getUserChallenges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const challenges = await Challenge.find({
      participants: req.user?._id,
      is_active: true
    })
      .populate('created_by', 'name username')
      .sort({ start_date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Challenge.countDocuments({
      participants: req.user?._id,
      is_active: true
    });

    res.json({
      challenges,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 