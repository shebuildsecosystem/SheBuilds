import mongoose, { Document, Schema } from 'mongoose';

export interface IProgressLog extends Document {
  log_id: string;
  project_id: mongoose.Types.ObjectId;
  date: Date;
  content: string;
  media: {
    screenshots: string[];
    videos: string[];
  };
  impact_summary?: string;
  builder_id: mongoose.Types.ObjectId;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

const progressLogSchema = new Schema<IProgressLog>({
  log_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  media: {
    screenshots: [{
      type: String,
      trim: true
    }],
    videos: [{
      type: String,
      trim: true
    }]
  },
  impact_summary: {
    type: String,
    maxlength: 500
  },
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
progressLogSchema.index({ project_id: 1 });
progressLogSchema.index({ builder_id: 1 });
progressLogSchema.index({ date: -1 });
progressLogSchema.index({ is_public: 1 });

export const ProgressLog = mongoose.model<IProgressLog>('ProgressLog', progressLogSchema); 