import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all events (public)
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {};
    if (active !== undefined) {
      query.is_active = active === 'true';
    }

    const events = await Event.find(query)
      .populate('created_by', 'username first_name last_name')
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single event (public)
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('created_by', 'username first_name last_name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create event (admin only)
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user?.is_admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const {
      title,
      description,
      image,
      image_public_id,
      date,
      location,
      capacity,
      registration_required = true,
      external_registration_link,
      is_active = true
    } = req.body;

    // Validate required fields
    if (!title || !description || !image || !date || !location || !capacity) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate capacity
    const capacityNum = Number(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return res.status(400).json({ message: 'Capacity must be a positive number' });
    }

    // Validate date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const event = new Event({
      title,
      description,
      image,
      image_public_id,
      date: eventDate,
      location,
      capacity: capacityNum,
      registration_required,
      external_registration_link,
      is_active,
      created_by: user._id
    });

    await event.save();
    
    const populatedEvent = await Event.findById(event._id)
      .populate('created_by', 'username first_name last_name');

    return res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update event (admin only)
export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { eventId } = req.params;
    
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updateData = req.body;
    
    // Validate and convert date string to Date object if provided
    if (updateData.date) {
      const eventDate = new Date(updateData.date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.date = eventDate;
    }

    // Validate and convert capacity to number if provided
    if (updateData.capacity !== undefined) {
      const capacityNum = Number(updateData.capacity);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        return res.status(400).json({ message: 'Capacity must be a positive number' });
      }
      updateData.capacity = capacityNum;
    }

    // If updating image, delete old image from Cloudinary if it exists
    if (updateData.image && event.image_public_id) {
      try {
        const { uploadService } = await import('../utils/uploadService');
        await uploadService.deleteFile(event.image_public_id);
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue with update even if old image deletion fails
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    ).populate('created_by', 'username first_name last_name');

    return res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete event (admin only)
export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { eventId } = req.params;
    
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete image from Cloudinary if it exists
    if (event.image_public_id) {
      try {
        const { uploadService } = await import('../utils/uploadService');
        await uploadService.deleteFile(event.image_public_id);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Continue with event deletion even if image deletion fails
      }
    }

    await Event.findByIdAndDelete(eventId);
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Register for event (authenticated users)
export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { eventId } = req.params;

    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.is_active) {
      return res.status(400).json({ message: 'Event is not active' });
    }

    // If event has external registration link, redirect to it
    if (event.external_registration_link) {
      return res.json({ 
        message: 'External registration required',
        external_link: event.external_registration_link,
        redirect: true
      });
    }

    if (event.registered_participants >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Check if user is already registered (you might want to create a separate registration model)
    // For now, we'll just increment the count
    event.registered_participants += 1;
    await event.save();

    return res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    console.error('Error registering for event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 