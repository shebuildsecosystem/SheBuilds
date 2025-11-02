import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  created_at: Date;
  created_by: mongoose.Types.ObjectId;
}

const announcementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  created_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema); 