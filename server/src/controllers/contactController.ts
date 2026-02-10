import { Request, Response } from 'express';
import { emailService } from '../utils/emailService';

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required' });
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Please provide a valid email address' });
      return;
    }

    const sent = await emailService.sendContactEmail(name, email, message);

    if (sent) {
      res.json({ message: 'Your message has been sent successfully. We will get back to you soon!' });
    } else {
      res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
