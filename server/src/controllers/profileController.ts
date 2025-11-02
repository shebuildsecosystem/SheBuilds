import { Request, Response } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Grant } from '../models/Grant';
import { Challenge } from '../models/Challenge';
import { ProgressLog } from '../models/ProgressLog';

interface AuthRequest extends Request {
  user?: any;
}

export const getFullPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Fetch related data
    const [projects, grants, challenges, progress_logs] = await Promise.all([
      Project.find({ builder_id: user._id, is_public: true }),
      Grant.find({ builder_id: user._id }),
      Challenge.find({ participants: user._id }),
      ProgressLog.find({ builder_id: user._id, is_public: true })
    ]);

    res.json({
      user,
      projects,
      grants,
      challenges,
      progress_logs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as any).message });
  }
};

export const setupOrUpdateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id || req.body.userId; // support both auth and manual for now
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const update: any = {};
    const fields = [
      'name', 'bio', 'photos', 'musicLinks', 'journey', 'skills', 'interests', 'social_links', 'story', 'themeColor'
    ];
    fields.forEach(field => {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as any).message });
  }
}; 