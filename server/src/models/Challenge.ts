import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  challenge_id: string;
  title: string;
  theme: string;
  duration: number; // in days
  start_date: Date;
  end_date: Date;
  prizes?: {
    first_place?: number;
    second_place?: number;
    third_place?: number;
    special_mentions?: number;
  };
  sponsors?: string[];
  rules: string[];
  submission_requirements: string[];
  participants: mongoose.Types.ObjectId[];
  winners: mongoose.Types.ObjectId[];
  is_active: boolean;
  max_participants?: number;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const challengeSchema = new Schema<IChallenge>({
  challenge_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  theme: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  prizes: {
    first_place: {
      type: Number,
      min: 0
    },
    second_place: {
      type: Number,
      min: 0
    },
    third_place: {
      type: Number,
      min: 0
    },
    special_mentions: {
      type: Number,
      min: 0
    }
  },
  sponsors: [{
    type: String,
    trim: true
  }],
  rules: [{
    type: String,
    required: true,
    trim: true
  }],
  submission_requirements: [{
    type: String,
    required: true,
    trim: true
  }],
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  winners: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  max_participants: {
    type: Number,
    min: 1
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better query performance
challengeSchema.index({ is_active: 1 });
challengeSchema.index({ start_date: 1 });
challengeSchema.index({ end_date: 1 });
challengeSchema.index({ created_by: 1 });
challengeSchema.index({ participants: 1 });

// Virtual for checking if challenge is currently running
challengeSchema.virtual('is_running').get(function() {
  const now = new Date();
  return this.start_date <= now && this.end_date >= now;
});

// Virtual for checking if challenge is upcoming
challengeSchema.virtual('is_upcoming').get(function() {
  const now = new Date();
  return this.start_date > now;
});

// Virtual for checking if challenge is completed
challengeSchema.virtual('is_completed').get(function() {
  const now = new Date();
  return this.end_date < now;
});

export const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema); 