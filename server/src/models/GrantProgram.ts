import mongoose, { Document, Schema } from 'mongoose';

export interface IGrantProgram extends Document {
  program_id: string;
  title: string;
  subtitle?: string;
  description: string;
  grant_amount: number;
  currency: 'INR' | 'USD';
  total_projects_funded: number;
  disbursement_phases: number;
  perks: string[];
  eligibility_criteria: {
    working_prototype: boolean;
    women_leadership_percentage: number;
    progress_duration_months: number;
    values: string[];
    region: string;
  };
  application_requirements: {
    team_details: boolean;
    project_overview: boolean;
    roadmap: boolean;
    vision_impact: boolean;
    why_grant: boolean;
    screenshots_demo: boolean;
  };
  important_dates: {
    applications_open: Date;
    deadline: Date;
    winners_announced: Date;
  };
  status: 'draft' | 'active' | 'closed' | 'completed';
  is_featured: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  applications_count: number;
  approved_applications_count: number;
  tags: string[];
  cover_image?: string;
  external_link?: string;
}

const grantProgramSchema = new Schema<IGrantProgram>({
  program_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  subtitle: {
    type: String,
    maxlength: 300
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  grant_amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'USD'
  },
  total_projects_funded: {
    type: Number,
    required: true,
    min: 1
  },
  disbursement_phases: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  perks: [{
    type: String,
    maxlength: 200
  }],
  eligibility_criteria: {
    working_prototype: {
      type: Boolean,
      default: true
    },
    women_leadership_percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 66
    },
    progress_duration_months: {
      type: Number,
      required: true,
      min: 0,
      default: 6
    },
    values: [{
      type: String,
      maxlength: 100
    }],
    region: {
      type: String,
      required: true,
      default: 'India'
    }
  },
  application_requirements: {
    team_details: {
      type: Boolean,
      default: true
    },
    project_overview: {
      type: Boolean,
      default: true
    },
    roadmap: {
      type: Boolean,
      default: true
    },
    vision_impact: {
      type: Boolean,
      default: true
    },
    why_grant: {
      type: Boolean,
      default: true
    },
    screenshots_demo: {
      type: Boolean,
      default: true
    }
  },
  important_dates: {
    applications_open: {
      type: Date,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    winners_announced: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'completed'],
    default: 'draft'
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  applications_count: {
    type: Number,
    default: 0
  },
  approved_applications_count: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  cover_image: {
    type: String
  },
  external_link: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
grantProgramSchema.index({ status: 1 });
grantProgramSchema.index({ is_featured: 1 });
grantProgramSchema.index({ 'important_dates.deadline': 1 });
grantProgramSchema.index({ created_by: 1 });
grantProgramSchema.index({ tags: 1 });

export const GrantProgram = mongoose.model<IGrantProgram>('GrantProgram', grantProgramSchema); 