import mongoose, { Document, Schema } from 'mongoose';

export interface IGrant extends Document {
  grant_id: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'applied' | 'in-review' | 'approved' | 'rejected';
  project_id: mongoose.Types.ObjectId;
  builder_id: mongoose.Types.ObjectId;
  review_notes?: string;
  disbursed_date?: Date;
  applied_date: Date;
  reviewed_date?: Date;
  reviewer_id?: mongoose.Types.ObjectId;
  grant_type: 'development' | 'launch' | 'scaling' | 'research';
  impact_summary?: string;
}

const grantSchema = new Schema<IGrant>({
  grant_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `grant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['applied', 'in-review', 'approved', 'rejected'],
    default: 'applied'
  },
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  builder_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review_notes: {
    type: String,
    maxlength: 1000
  },
  disbursed_date: {
    type: Date
  },
  applied_date: {
    type: Date,
    default: Date.now
  },
  reviewed_date: {
    type: Date
  },
  reviewer_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  grant_type: {
    type: String,
    enum: ['development', 'launch', 'scaling', 'research'],
    required: true
  },
  impact_summary: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for better query performance
grantSchema.index({ builder_id: 1 });
grantSchema.index({ project_id: 1 });
grantSchema.index({ status: 1 });
grantSchema.index({ grant_type: 1 });
grantSchema.index({ applied_date: -1 });

// Unique index to prevent multiple grants for the same project
grantSchema.index(
  { project_id: 1 }, 
  { unique: true, partialFilterExpression: { status: { $in: ['applied', 'in-review'] } } }
);

export const Grant = mongoose.model<IGrant>('Grant', grantSchema); 