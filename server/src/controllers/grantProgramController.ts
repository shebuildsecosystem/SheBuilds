import { Request, Response } from 'express';
import { GrantProgram } from '../models/GrantProgram';
import { Grant } from '../models/Grant';
import { uploadService } from '../utils/uploadService';

interface AuthRequest extends Request {
  user?: any;
}

// Get all grant programs (public)
export const getAllGrantPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, featured, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    // By default, show all programs
    
    if (featured === 'true') {
      filter.is_featured = true;
    }

    const programs = await GrantProgram.find(filter)
      .populate('created_by', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await GrantProgram.countDocuments(filter);

    res.json({
      programs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all grant programs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single grant program (public)
export const getGrantProgram = async (req: Request, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;
    
    const program = await GrantProgram.findOne({ 
      $or: [{ _id: programId }, { program_id: programId }] 
    }).populate('created_by', 'name username');

    if (!program) {
      res.status(404).json({ message: 'Grant program not found' });
      return;
    }

    // Get application count for this program
    const applicationsCount = await Grant.countDocuments({ 
      grant_program_id: program._id 
    });

    res.json({
      program: {
        ...program.toObject(),
        applications_count: applicationsCount
      }
    });
  } catch (error) {
    console.error('Get grant program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create grant program (admin only)
export const createGrantProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      subtitle,
      description,
      grant_amount,
      currency,
      total_projects_funded,
      disbursement_phases,
      perks,
      eligibility_criteria,
      application_requirements,
      important_dates,
      tags,
      cover_image,
      external_link
    } = req.body;

    if (!req.user?.is_admin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const program = new GrantProgram({
      title,
      subtitle,
      description,
      grant_amount,
      currency,
      total_projects_funded,
      disbursement_phases,
      perks,
      eligibility_criteria,
      application_requirements,
      important_dates,
      tags,
      cover_image,
      external_link,
      created_by: req.user._id
    });

    await program.save();

    res.status(201).json({
      message: 'Grant program created successfully',
      program
    });
  } catch (error) {
    console.error('Create grant program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update grant program (admin only)
export const updateGrantProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;
    const updateData = req.body;

    if (!req.user?.is_admin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const program = await GrantProgram.findOne({ 
      $or: [{ _id: programId }, { program_id: programId }] 
    });

    if (!program) {
      res.status(404).json({ message: 'Grant program not found' });
      return;
    }

    // Add updated_by field
    updateData.updated_by = req.user._id;

    const updatedProgram = await GrantProgram.findByIdAndUpdate(
      program._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('created_by', 'name username');

    res.json({
      message: 'Grant program updated successfully',
      program: updatedProgram
    });
  } catch (error) {
    console.error('Update grant program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete grant program (admin only)
export const deleteGrantProgram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;

    if (!req.user?.is_admin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const program = await GrantProgram.findOne({ 
      $or: [{ _id: programId }, { program_id: programId }] 
    });

    if (!program) {
      res.status(404).json({ message: 'Grant program not found' });
      return;
    }

    // Check if there are any applications for this program
    const applicationsCount = await Grant.countDocuments({ 
      grant_program_id: program._id 
    });

    if (applicationsCount > 0) {
      res.status(400).json({ 
        message: 'Cannot delete grant program with existing applications' 
      });
      return;
    }

    await program.deleteOne();

    res.json({ message: 'Grant program deleted successfully' });
  } catch (error) {
    console.error('Delete grant program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get grant program statistics (admin only)
export const getGrantProgramStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.is_admin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const [totalPrograms, activePrograms, totalApplications, totalApproved] = await Promise.all([
      GrantProgram.countDocuments(),
      GrantProgram.countDocuments({ status: 'active' }),
      Grant.countDocuments(),
      Grant.countDocuments({ status: 'approved' })
    ]);

    // Get programs with most applications
    const popularPrograms = await GrantProgram.aggregate([
      {
        $lookup: {
          from: 'grants',
          localField: '_id',
          foreignField: 'grant_program_id',
          as: 'applications'
        }
      },
      {
        $project: {
          title: 1,
          applications_count: { $size: '$applications' }
        }
      },
      {
        $sort: { applications_count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      stats: {
        totalPrograms,
        activePrograms,
        totalApplications,
        totalApproved
      },
      popularPrograms
    });
  } catch (error) {
    console.error('Get grant program stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle featured status (admin only)
export const toggleFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { programId } = req.params;

    if (!req.user?.is_admin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const program = await GrantProgram.findOne({ 
      $or: [{ _id: programId }, { program_id: programId }] 
    });

    if (!program) {
      res.status(404).json({ message: 'Grant program not found' });
      return;
    }

    program.is_featured = !program.is_featured;
    program.updated_by = req.user._id;
    await program.save();

    res.json({
      message: `Grant program ${program.is_featured ? 'featured' : 'unfeatured'} successfully`,
      program
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload grant program cover image (admin only)
export const uploadCoverImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.is_admin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const result = await uploadService.uploadGrantProgramCover(req.file);
    
    res.json({
      message: 'Cover image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload cover image error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
}; 