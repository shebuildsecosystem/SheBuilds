import { Request, Response } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Challenge } from '../models/Challenge';

// Search Users
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, skills, location, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { is_verified: true };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
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
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search Projects
export const searchProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, tech_stack, tags, status, is_grant_eligible, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { is_public: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (tech_stack) {
      const techArray = Array.isArray(tech_stack) ? tech_stack : [tech_stack];
      filter.tech_stack = { $in: techArray };
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagsArray };
    }

    if (status) {
      filter.status = status;
    }

    if (is_grant_eligible !== undefined) {
      filter.is_grant_eligible = is_grant_eligible === 'true';
    }

    const projects = await Project.find(filter)
      .populate('builder_id', 'name username portfolio_slug profile_picture')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Popular Skills
export const getPopularSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(skills);
  } catch (error) {
    console.error('Get popular skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Popular Tech Stack
export const getPopularTechStack = async (req: Request, res: Response): Promise<void> => {
  try {
    const techStack = await Project.aggregate([
      { $unwind: '$tech_stack' },
      { $group: { _id: '$tech_stack', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json(techStack);
  } catch (error) {
    console.error('Get popular tech stack error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Users for Community Page
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, skills, location, sort = 'joined_date' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    let sortOption: any = { joined_date: -1 };
    if (sort === 'name') {
      sortOption = { name: 1 };
    } else if (sort === 'username') {
      sortOption = { username: 1 };
    }

    const users = await User.find(filter)
      .select('-password -email -resetToken -resetTokenExpiry')
      .sort(sortOption)
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
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Analytics Data
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalChallenges,
      totalGrants,
      activeChallenges,
      grantEligibleProjects
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Challenge.countDocuments(),
      Project.countDocuments({ is_grant_eligible: true }),
      Challenge.countDocuments({ is_active: true }),
      Project.countDocuments({ is_grant_eligible: true })
    ]);

    // Get recent activity
    const recentProjects = await Project.find({ is_public: true })
      .populate('builder_id', 'name username')
      .sort({ created_at: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('name username joined_date')
      .sort({ joined_date: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalChallenges,
        totalGrants,
        activeChallenges,
        grantEligibleProjects
      },
      recentActivity: {
        projects: recentProjects,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 