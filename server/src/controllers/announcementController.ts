import { Request, Response } from 'express';
import { Announcement } from '../models/Announcement';

interface AuthRequest extends Request {
  user?: any;
}

// List all announcements (public)
export const listAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const announcements = await Announcement.find()
      .populate('created_by', 'name username')
      .sort({ created_at: -1 });
    res.json({ announcements });
  } catch (error) {
    console.error('List announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create announcement
export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, message } = req.body;
    const announcement = new Announcement({
      title,
      message,
      created_by: req.user?._id,
    });
    await announcement.save();
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete announcement
export const deleteAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      res.status(404).json({ message: 'Announcement not found' });
      return;
    }
    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 