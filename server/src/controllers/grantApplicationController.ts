import { Request, Response } from 'express';
import { GrantApplication } from '../models/GrantApplication';
import { GrantProgram } from '../models/GrantProgram';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { emailService } from '../utils/emailService';

interface AuthRequest extends Request {
  user?: any;
}

// Submit Grant Application
export const submitGrantApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      grant_program_id,
      project_id,
      proposal,
      budget_breakdown,
      timeline,
      expected_impact,
      team_details,
      project_overview,
      roadmap,
      vision_impact,
      why_grant,
      pitch_video_url,
      presentation_url,
      demo_video_url,
      additional_materials,
      women_leadership_percentage,
      working_prototype,
      progress_duration_months
    } = req.body;

    // Validate required fields
    if (!grant_program_id || !project_id || !proposal || !budget_breakdown || !timeline || !expected_impact) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if grant program exists and is active
    const grantProgram = await GrantProgram.findById(grant_program_id);
    if (!grantProgram) {
      res.status(404).json({ message: 'Grant program not found' });
      return;
    }

    if (grantProgram.status !== 'active') {
      res.status(400).json({ message: 'Grant program is not accepting applications' });
      return;
    }

    // Check if deadline has passed
    if (new Date() > grantProgram.important_dates.deadline) {
      res.status(400).json({ message: 'Application deadline has passed' });
      return;
    }

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

    // Check if user has already applied for this grant program
    const existingUserApplication = await GrantApplication.findOne({
      grant_program_id,
      applicant_id: req.user._id,
      status: { $in: ['draft', 'submitted', 'in-review'] }
    });

    if (existingUserApplication) {
      res.status(400).json({ message: 'You have already applied for this grant program' });
      return;
    }

    // Check if this project has already been submitted to this grant program
    const existingProjectApplication = await GrantApplication.findOne({
      grant_program_id,
      project_id,
      status: { $in: ['draft', 'submitted', 'in-review'] }
    });

    if (existingProjectApplication) {
      res.status(400).json({ message: 'This project has already been submitted to this grant program' });
      return;
    }

    // Validate eligibility criteria
    if (women_leadership_percentage < grantProgram.eligibility_criteria.women_leadership_percentage) {
      res.status(400).json({ 
        message: `Women leadership percentage must be at least ${grantProgram.eligibility_criteria.women_leadership_percentage}%` 
      });
      return;
    }

    if (progress_duration_months < grantProgram.eligibility_criteria.progress_duration_months) {
      res.status(400).json({ 
        message: `Progress duration must be at least ${grantProgram.eligibility_criteria.progress_duration_months} months` 
      });
      return;
    }

    if (grantProgram.eligibility_criteria.working_prototype && !working_prototype) {
      res.status(400).json({ message: 'Working prototype is required for this grant program' });
      return;
    }

    // Create grant application
    const grantApplication = new GrantApplication({
      grant_program_id,
      project_id,
      applicant_id: req.user._id,
      status: 'submitted',
      proposal,
      budget_breakdown,
      timeline,
      expected_impact,
      team_details,
      project_overview,
      roadmap,
      vision_impact,
      why_grant,
      pitch_video_url,
      presentation_url,
      demo_video_url,
      additional_materials,
      women_leadership_percentage,
      working_prototype,
      progress_duration_months
    });

    await grantApplication.save();

    // Update grant program applications count
    await GrantProgram.findByIdAndUpdate(grant_program_id, {
      $inc: { applications_count: 1 }
    });

    // Send confirmation email
    const user = await User.findById(req.user._id);
    if (user) {
      emailService.sendGrantApplicationEmail(user.email, user.name, project.title).catch(error => {
        console.error('Failed to send grant application email:', error);
      });
    }

    res.status(201).json({
      message: 'Grant application submitted successfully',
      application: grantApplication
    });
  } catch (error: any) {
    console.error('Submit grant application error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors,
        details: error.errors 
      });
      return;
    }
    
    // Handle other specific errors
    if (error.code === 11000) {
      res.status(400).json({ message: 'Duplicate application detected' });
      return;
    }
    
    res.status(500).json({ 
      message: 'Server error during grant application submission',
      error: error.message 
    });
  }
};

// Get User's Grant Applications
export const getUserGrantApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const applications = await GrantApplication.find({ applicant_id: req.user?._id })
      .populate('grant_program_id', 'title grant_amount currency')
      .populate('project_id', 'title description')
      .sort({ submitted_date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await GrantApplication.countDocuments({ applicant_id: req.user?._id });

    res.json({
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user grant applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Grant Application by ID
export const getGrantApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await GrantApplication.findById(id)
      .populate('grant_program_id', 'title grant_amount currency eligibility_criteria')
      .populate('project_id', 'title description')
      .populate('applicant_id', 'name username');

    if (!application) {
      res.status(404).json({ message: 'Grant application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    console.error('Get grant application by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get All Grant Applications
export const getAllGrantApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, grant_program_id } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (status) filter.status = status;
    if (grant_program_id) filter.grant_program_id = grant_program_id;

    const applications = await GrantApplication.find(filter)
      .populate('grant_program_id', 'title grant_amount currency')
      .populate('project_id', 'title description')
      .populate('applicant_id', 'name username')
      .sort({ submitted_date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await GrantApplication.countDocuments(filter);

    res.json({
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all grant applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update Grant Application Status
export const updateGrantApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    const application = await GrantApplication.findById(id);
    if (!application) {
      res.status(404).json({ message: 'Grant application not found' });
      return;
    }

    application.status = status;
    if (review_notes) application.review_notes = review_notes;
    if (status === 'approved' || status === 'rejected') {
      application.reviewed_date = new Date();
      application.reviewer_id = req.user._id;
    }

    await application.save();

    // If approved, update grant program approved count
    if (status === 'approved') {
      await GrantProgram.findByIdAndUpdate(application.grant_program_id, {
        $inc: { approved_applications_count: 1 }
      });
    }

    res.json({
      message: 'Grant application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update grant application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Admin: Delete Grant Application
export const deleteGrantApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const application = await GrantApplication.findById(id);
    if (!application) {
      res.status(404).json({ message: 'Grant application not found' });
      return;
    }
    await application.deleteOne();
    res.json({ message: 'Grant application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as any).message });
  }
}; 