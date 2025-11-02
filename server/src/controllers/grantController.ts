import { Request, Response } from 'express';
import { Grant } from '../models/Grant';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { emailService } from '../utils/emailService';

interface AuthRequest extends Request {
  user?: any;
}

// Apply for Grant
export const applyForGrant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { project_id, amount, grant_type, impact_summary } = req.body;

    // Check if project exists and belongs to user
    const project = await Project.findById(project_id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.builder_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to apply for grant for this project' });
      return;
    }

    // Check if project is grant eligible
    if (!project.is_grant_eligible) {
      res.status(400).json({ message: 'Project is not marked as grant eligible' });
      return;
    }

    // Check if this project has already been submitted for a grant
    const existingGrant = await Grant.findOne({
      project_id,
      status: { $in: ['applied', 'in-review'] }
    });

    if (existingGrant) {
      res.status(400).json({ message: 'This project has already been submitted for a grant' });
      return;
    }

    // Create grant application
    const grant = new Grant({
      project_id,
      builder_id: req.user._id,
      amount,
      grant_type,
      impact_summary,
      status: 'applied'
    });

    await grant.save();

    // Send confirmation email
    const user = await User.findById(req.user._id);
    if (user) {
      emailService.sendGrantApplicationEmail(user.email, user.name, project.title).catch(error => {
        console.error('Failed to send grant application email:', error);
      });
    }

    res.status(201).json({
      message: 'Grant application submitted successfully',
      grant
    });
  } catch (error) {
    console.error('Apply for grant error:', error);
    res.status(500).json({ message: 'Server error during grant application' });
  }
};

// Get User's Grants
export const getUserGrants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const grants = await Grant.find({ builder_id: req.user?._id })
      .populate('project_id', 'title description')
      .sort({ applied_date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Grant.countDocuments({ builder_id: req.user?._id });

    res.json({
      grants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user grants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Grant by ID
export const getGrantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const grant = await Grant.findById(id)
      .populate('project_id', 'title description')
      .populate('builder_id', 'name username portfolio_slug');

    if (!grant) {
      res.status(404).json({ message: 'Grant not found' });
      return;
    }

    res.json(grant);
  } catch (error) {
    console.error('Get grant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update Grant Status
export const updateGrantStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    const grant = await Grant.findById(id).populate('project_id builder_id');
    if (!grant) {
      res.status(404).json({ message: 'Grant not found' });
      return;
    }

    // Update grant status
    grant.status = status;
    if (review_notes) grant.review_notes = review_notes;
    if (status === 'approved') {
      grant.reviewed_date = new Date();
      grant.reviewer_id = req.user?._id;
    }

    await grant.save();

    // Send email notification
    if (grant.builder_id && grant.project_id) {
      const user = grant.builder_id as any;
      const project = grant.project_id as any;
      
      if (status === 'approved') {
        emailService.sendGrantApprovalEmail(user.email, user.name, project.title, grant.amount).catch(error => {
          console.error('Failed to send grant approval email:', error);
        });
      }
    }

    res.json({
      message: 'Grant status updated successfully',
      grant
    });
  } catch (error) {
    console.error('Update grant status error:', error);
    res.status(500).json({ message: 'Server error during grant status update' });
  }
};

// Admin: Get All Grants (for admin dashboard)
export const getAllGrants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (status) filter.status = status;

    const grants = await Grant.find(filter)
      .populate('project_id', 'title description')
      .populate('builder_id', 'name username portfolio_slug')
      .sort({ applied_date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Grant.countDocuments(filter);

    res.json({
      grants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all grants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Admin: Delete Grant
export const adminDeleteGrant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const grant = await Grant.findById(id);
    if (!grant) {
      res.status(404).json({ message: 'Grant not found' });
      return;
    }
    await grant.deleteOne();
    res.json({ message: 'Grant deleted successfully' });
  } catch (error) {
    console.error('Admin delete grant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 