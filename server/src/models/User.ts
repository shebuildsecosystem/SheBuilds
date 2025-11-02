import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  user_id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  cover_image?: string;
  location?: string;
  timezone?: string;
  skills: string[];
  interests: string[];
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    personal_site?: string;
    calendly?: string;
  };
  portfolio_slug: string;
  joined_date: Date;
  is_verified: boolean;
  is_admin: boolean;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  photos: string[]; // up to 5 images
  story?: {
    type: string; // 'image', 'video', 'text'
    url: string;
    text: string;
    created_at: Date;
    expires_at: Date;
  } | null;
  themeColor: string;
  journey: { date: string; title: string; description: string }[];
  musicLinks: string[];
}

const userSchema = new Schema<IUser>({
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profile_picture: {
    type: String,
    default: null
  },
  cover_image: {
    type: String,
    default: null
  },
  location: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  social_links: {
    github: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    personal_site: {
      type: String,
      trim: true
    },
    calendly: {
      type: String,
      trim: true
    }
  },
  portfolio_slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  joined_date: {
    type: Date,
    default: Date.now
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  photos: [{
    type: String,
    trim: true
  }], // up to 5 images
  story: {
    type: Object,
    default: null
  },
  themeColor: {
    type: String,
    default: 'default',
    enum: ['default', 'white', 'black', 'purple', 'blue', 'pink']
  },
  journey: [
    {
      date: { type: String },
      title: { type: String },
      description: { type: String }
    }
  ],
  musicLinks: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 