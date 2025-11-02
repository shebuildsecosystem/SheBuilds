import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  image: string;
  image_public_id?: string;
  date: Date;
  location: string;
  capacity: number;
  registered_participants: number;
  registration_required: boolean;
  external_registration_link?: string;
  is_active: boolean;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  image: {
    type: String,
    required: true
  },
  image_public_id: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  registered_participants: {
    type: Number,
    default: 0,
    min: 0
  },
  registration_required: {
    type: Boolean,
    default: true
  },
  external_registration_link: {
    type: String,
    required: false,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for efficient queries
EventSchema.index({ date: 1, is_active: 1 });
EventSchema.index({ created_by: 1 });

export default mongoose.model<IEvent>('Event', EventSchema); 