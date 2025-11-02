import mongoose, { Document, Schema } from 'mongoose';

export interface IGrantApplication extends Document {
  application_id: string;
  grant_program_id: mongoose.Types.ObjectId;
  project_id: mongoose.Types.ObjectId;
  applicant_id: mongoose.Types.ObjectId;
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'rejected';
  
  // Basic application info
  proposal: string;
  budget_breakdown: string;
  timeline: string;
  expected_impact: string;
  
  // Team and project details
  team_details: string;
  project_overview: string;
  roadmap: string;
  vision_impact: string;
  why_grant: string;
  
  // Materials
  pitch_video_url: string;
  presentation_url: string;
  demo_video_url: string;
  additional_materials: string;
  
  // Eligibility criteria
  women_leadership_percentage: number;
  working_prototype: boolean;
  progress_duration_months: number;
  
  // Review fields
  review_notes?: string;
  reviewer_id?: mongoose.Types.ObjectId;
  reviewed_date?: Date;
  submitted_date: Date;
}

const grantApplicationSchema = new Schema<IGrantApplication>({
  application_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  grant_program_id: {
    type: Schema.Types.ObjectId,
    ref: 'GrantProgram',
    required: true
  },
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  applicant_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in-review', 'approved', 'rejected'],
    default: 'draft'
  },
  
  // Basic application info
  proposal: {
    type: String,
    required: true,
    maxlength: 5000
  },
  budget_breakdown: {
    type: String,
    required: true,
    maxlength: 2000
  },
  timeline: {
    type: String,
    required: true,
    maxlength: 1000
  },
  expected_impact: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Team and project details
  team_details: {
    type: String,
    required: true,
    maxlength: 2000
  },
  project_overview: {
    type: String,
    required: true,
    maxlength: 2000
  },
  roadmap: {
    type: String,
    required: true,
    maxlength: 2000
  },
  vision_impact: {
    type: String,
    required: true,
    maxlength: 2000
  },
  why_grant: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Materials
  pitch_video_url: {
    type: String,
    required: true
  },
  presentation_url: {
    type: String,
    required: true
  },
  demo_video_url: {
    type: String
  },
  additional_materials: {
    type: String,
    maxlength: 1000
  },
  
  // Eligibility criteria
  women_leadership_percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  working_prototype: {
    type: Boolean,
    required: true
  },
  progress_duration_months: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Review fields
  review_notes: {
    type: String,
    maxlength: 2000
  },
  reviewer_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewed_date: {
    type: Date
  },
  submitted_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
grantApplicationSchema.index({ grant_program_id: 1 });
grantApplicationSchema.index({ project_id: 1 });
grantApplicationSchema.index({ applicant_id: 1 });
grantApplicationSchema.index({ status: 1 });
grantApplicationSchema.index({ submitted_date: -1 });

// Unique compound index to prevent multiple applications for the same project to the same grant program
grantApplicationSchema.index(
  { grant_program_id: 1, project_id: 1 }, 
  { unique: true, partialFilterExpression: { status: { $in: ['draft', 'submitted', 'in-review'] } } }
);

export const GrantApplication = mongoose.model<IGrantApplication>('GrantApplication', grantApplicationSchema);