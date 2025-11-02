import { Request, Response } from 'express';
import { ProgressLog } from '../models/ProgressLog';
import { Project } from '../models/Project';

interface AuthRequest extends Request {
  user?: any;
}

// Create Progress Log
export const createProgressLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { project_id, content, media, impact_summary, is_public } = req.body;

    // Check if project exists and belongs to user
    const project = await Project.findById(project_id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to add progress to this project' });
      return;
    }

    const progressLog = new ProgressLog({
      project_id,
      content,
      media: media || { screenshots: [], videos: [] },
      impact_summary,
      is_public: is_public !== undefined ? is_public : true,
      builder_id: req.user?._id
    });

    await progressLog.save();

    // Add progress log to project
    project.progress_logs.push(progressLog._id as any);
    await project.save();

    res.status(201).json({
      message: 'Progress log created successfully',
      progressLog
    });
  } catch (error) {
    console.error('Create progress log error:', error);
    res.status(500).json({ message: 'Server error during progress log creation' });
  }
};

// Get Project Progress Logs
export const getProjectProgressLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const progressLogs = await ProgressLog.find({ 
      project_id: projectId,
      is_public: true 
    })
      .populate('builder_id', 'name username portfolio_slug profile_picture')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ProgressLog.countDocuments({ 
      project_id: projectId,
      is_public: true 
    });

    res.json({
      progressLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get project progress logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User's Progress Logs
export const getUserProgressLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const progressLogs = await ProgressLog.find({ builder_id: req.user?._id })
      .populate('project_id', 'title description')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ProgressLog.countDocuments({ builder_id: req.user?._id });

    res.json({
      progressLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user progress logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Progress Log by ID
export const getProgressLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const progressLog = await ProgressLog.findById(id)
      .populate('project_id', 'title description')
      .populate('builder_id', 'name username portfolio_slug profile_picture');

    if (!progressLog) {
      res.status(404).json({ message: 'Progress log not found' });
      return;
    }

    res.json(progressLog);
  } catch (error) {
    console.error('Get progress log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Progress Log
export const updateProgressLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const progressLog = await ProgressLog.findById(id);
    if (!progressLog) {
      res.status(404).json({ message: 'Progress log not found' });
      return;
    }

    // Check if user owns the progress log
    if (progressLog.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this progress log' });
      return;
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key !== 'builder_id' && key !== 'log_id' && key !== 'project_id') {
        (progressLog as any)[key] = updateData[key];
      }
    });

    await progressLog.save();

    res.json({
      message: 'Progress log updated successfully',
      progressLog
    });
  } catch (error) {
    console.error('Update progress log error:', error);
    res.status(500).json({ message: 'Server error during progress log update' });
  }
};

// Delete Progress Log
export const deleteProgressLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const progressLog = await ProgressLog.findById(id);
    if (!progressLog) {
      res.status(404).json({ message: 'Progress log not found' });
      return;
    }

    // Check if user owns the progress log
    if (progressLog.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this progress log' });
      return;
    }

    // Remove from project's progress logs
    await Project.findByIdAndUpdate(progressLog.project_id, {
      $pull: { progress_logs: progressLog._id }
    });

    await ProgressLog.findByIdAndDelete(id);

    res.json({ message: 'Progress log deleted successfully' });
  } catch (error) {
    console.error('Delete progress log error:', error);
    res.status(500).json({ message: 'Server error during progress log deletion' });
  }
};

// Get Recent Progress Logs (for homepage feed)
export const getRecentProgressLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const progressLogs = await ProgressLog.find({ is_public: true })
      .populate('project_id', 'title description')
      .populate('builder_id', 'name username portfolio_slug profile_picture')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ProgressLog.countDocuments({ is_public: true });

    res.json({
      progressLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get recent progress logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 