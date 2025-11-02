import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  project_id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  tech_stack: string[];
  status: 'idea' | 'in-progress' | 'completed';
  startDate?: Date;
  endDate?: Date;
  location?: string;
  teamSize?: number;
  budget?: number;
  objectives?: string;
  challenges?: string;
  impact?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  media: {
    images: string[];
    videos: string[];
    demos: string[];
    youtube_links: string[];
    pdf_links: string[];
  };
  is_grant_eligible: boolean;
  progress_logs: mongoose.Types.ObjectId[];
  team_members: mongoose.Types.ObjectId[];
  submitted_to_challenges: mongoose.Types.ObjectId[];
  builder_id: mongoose.Types.ObjectId;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

const projectSchema = new Schema<IProject>({
  project_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  tech_stack: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['idea', 'in-progress', 'completed', 'draft'],
    default: 'idea'
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  teamSize: {
    type: Number,
    required: false,
    default: 1
  },
  budget: {
    type: Number,
    required: false,
    default: 0
  },
  objectives: {
    type: String,
    required: false,
    trim: true
  },
  challenges: {
    type: String,
    required: false,
    trim: true
  },
  impact: {
    type: String,
    required: false,
    trim: true
  },
  website: {
    type: String,
    required: false,
    trim: true
  },
  github: {
    type: String,
    required: false,
    trim: true
  },
  linkedin: {
    type: String,
    required: false,
    trim: true
  },
  media: {
    images: [{
      type: String,
      trim: true
    }],
    videos: [{
      type: String,
      trim: true
    }],
    demos: [{
      type: String,
      trim: true
    }],
    youtube_links: [{
      type: String,
      trim: true
    }],
    pdf_links: [{
      type: String,
      trim: true
    }]
  },
  is_grant_eligible: {
    type: Boolean,
    default: false
  },
  progress_logs: [{
    type: Schema.Types.ObjectId,
    ref: 'ProgressLog'
  }],
  team_members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  submitted_to_challenges: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  builder_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  is_public: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better query performance
projectSchema.index({ builder_id: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ is_grant_eligible: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ tech_stack: 1 });
projectSchema.index({ is_public: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema); 