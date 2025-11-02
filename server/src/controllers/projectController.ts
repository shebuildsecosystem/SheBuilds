import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { ProgressLog } from '../models/ProgressLog';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// Create Project
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      category,
      tags, 
      tech_stack, 
      status, 
      startDate,
      endDate,
      location,
      teamSize,
      budget,
      objectives,
      challenges,
      impact,
      website,
      github,
      linkedin,
      is_public, 
      is_grant_eligible,
      media 
    } = req.body;

    const project = new Project({
      title,
      description,
      category,
      tags: tags || [],
      tech_stack: tech_stack || [],
      status: status || 'idea',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      teamSize: teamSize || 1,
      budget: budget || 0,
      objectives,
      challenges,
      impact,
      website,
      github,
      linkedin,
      is_public: is_public !== undefined ? is_public : true,
      is_grant_eligible: is_grant_eligible || false,
      media: media || {
        images: [],
        videos: [],
        demos: [],
        youtube_links: [],
        pdf_links: []
      },
      builder_id: req.user?._id
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error during project creation' });
  }
};

// Get All Projects (with filters)
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, tags, tech_stack, is_grant_eligible, builder_id, page = 1, limit = 10 } = req.query;

    const filter: any = { is_public: true };

    if (status) filter.status = status;
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (tech_stack) filter.tech_stack = { $in: Array.isArray(tech_stack) ? tech_stack : [tech_stack] };
    if (is_grant_eligible !== undefined) filter.is_grant_eligible = is_grant_eligible === 'true';
    if (builder_id) filter.builder_id = builder_id;

    const skip = (Number(page) - 1) * Number(limit);

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
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('builder_id', 'name username portfolio_slug profile_picture')
      .populate('team_members', 'name username portfolio_slug profile_picture');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Project
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user owns the project
    if (project.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this project' });
      return;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'builder_id' && key !== 'project_id') {
        (project as any)[key] = updateData[key];
      }
    });

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error during project update' });
  }
};

// Delete Project
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user owns the project
    if (project.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this project' });
      return;
    }

    // Delete associated progress logs
    await ProgressLog.deleteMany({ project_id: id });

    await Project.findByIdAndDelete(id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error during project deletion' });
  }
};

// Get User's Projects
export const getUserProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // First, try to find the user by username if userId looks like a username
    let user;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      // If userId is not a MongoDB ObjectId, treat it as username
      user = await User.findOne({ username: userId });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
    }

    const projects = await Project.find({ 
      builder_id: user ? user._id : userId,
      is_public: true 
    })
      .populate('builder_id', 'name username portfolio_slug profile_picture')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments({ 
      builder_id: user ? user._id : userId,
      is_public: true 
    });

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
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Current User's Projects
export const getMyProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    console.log('Fetching projects for user:', req.user._id);

    const projects = await Project.find({ 
      builder_id: req.user._id
    })
      .populate('builder_id', 'name username portfolio_slug profile_picture')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Project.countDocuments({ 
      builder_id: req.user._id
    });

    console.log(`Found ${projects.length} projects for user ${req.user._id}`);

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
    console.error('Get my projects error:', error);
    res.status(500).json({ 
      message: 'Server error during project fetch',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 