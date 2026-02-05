import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Select } from '@/components/ui/select';

const initialState = {
  name: '',
  username: '',
  email: '',
  password: '',
  bio: '',
  location: '',
  timezone: '',
  skills: [],
  interests: [],
  github: '',
  linkedin: '',
  twitter: '',
  portfolio_slug: '',
};

const TIMEZONE_OPTIONS = [
  '',
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney',
];

const LOCATION_OPTIONS = [
  '',
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Bangalore, India',
  'Delhi, India',
  'Mumbai, India',
  'Chennai, India',
  'Hyderabad, India',
  'Pune, India',
  'Kolkata, India',
  'Jaipur, India',
  'Noida, India',
  'Gurgaon, India',
  'Ahmedabad, India',
  'Bengaluru, India',
  'Chandigarh, India',
  'Coimbatore, India',
  'Cochin, India',
  'Singapore',
  'Sydney, Australia',
];

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (tags: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border border-input rounded-md px-2 py-1 bg-background focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag, idx) => (
        <span key={tag + idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-inter flex items-center gap-1">
          {tag}
          <button type="button" aria-label="Remove tag" className="ml-1 text-orange-500 hover:text-orange-700" onClick={() => onChange(value.filter((_, i) => i !== idx))}>
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] border-none outline-none bg-transparent py-1 font-inter text-sm"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagChange = (field: 'skills' | 'interests', tags: string[]) => {
    setForm({ ...form, [field]: tags });
  };

  const handleSelectChange = (field: 'location' | 'timezone', value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills,
        interests: form.interests,
        social_links: {
          github: form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
        },
      };
      await registerUser(payload);
      toast({ title: 'Registration successful', description: 'You can now sign in to your account.' });
      setTimeout(() => navigate('/login'), 800);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err?.response?.data?.message || 'Please check your details and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <div className="relative w-full max-w-3xl">
        {/* Butterfly Accent */}
        <img
          src="/butterfly.webp"
          alt="SheBuilds Butterfly"
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 opacity-80 animate-fade-in-up"
          style={{ zIndex: 2 }}
        />
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-12 pt-16 animate-fade-in-up transition-all duration-700">
          <h1 className="text-4xl font-light text-gray-900 mb-2 font-martian text-center">Create Your SheBuilds Account</h1>
          <p className="text-base text-gray-600 mb-10 font-inter text-center">Join a community of empowered women in tech. Start your journey today!</p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-inter mb-1">Full Name</label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required className="font-inter" autoComplete="name" placeholder="e.g. Jane Doe" />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 font-inter mb-1">Username</label>
                  <Input id="username" name="username" value={form.username} onChange={handleChange} required className="font-inter" autoComplete="username" placeholder="e.g. janedoe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-inter mb-1">Email</label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="font-inter" autoComplete="email" placeholder="e.g. jane@example.com" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-inter mb-1">Password</label>
                  <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="font-inter" autoComplete="new-password" placeholder="At least 6 characters" />
                </div>
                <div>
                  <label htmlFor="portfolio_slug" className="block text-sm font-medium text-gray-700 font-inter mb-1">Portfolio Slug</label>
                  <Input id="portfolio_slug" name="portfolio_slug" value={form.portfolio_slug} onChange={handleChange} required className="font-inter" placeholder="e.g. jane-doe-portfolio" />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 font-inter mb-1 mt-2">Short Bio</label>
                  <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={3} className="font-inter w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" placeholder="Tell us about yourself, your passions, or your journey..." />
                </div>
              </div>
              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 font-inter mb-1">Location</label>
                  <select
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={e => handleSelectChange('location', e.target.value)}
                    className="font-inter w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    {LOCATION_OPTIONS.map(loc => <option key={loc} value={loc}>{loc || 'Select location'}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 font-inter mb-1">Timezone</label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={form.timezone}
                    onChange={e => handleSelectChange('timezone', e.target.value)}
                    className="font-inter w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    {TIMEZONE_OPTIONS.map(tz => <option key={tz} value={tz}>{tz || 'Select timezone'}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 font-inter mb-1">Skills <span className="text-xs text-gray-400">(press Enter or comma to add)</span></label>
                  <TagInput value={form.skills} onChange={tags => handleTagChange('skills', tags)} placeholder="e.g. JavaScript, React, Node.js" />
                </div>
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700 font-inter mb-1">Interests <span className="text-xs text-gray-400">(press Enter or comma to add)</span></label>
                  <TagInput value={form.interests} onChange={tags => handleTagChange('interests', tags)} placeholder="e.g. Web Development, AI/ML" />
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 font-inter mb-1">GitHub</label>
                  <Input id="github" name="github" value={form.github} onChange={handleChange} className="font-inter" placeholder="e.g. https://github.com/janedoe" />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 font-inter mb-1">LinkedIn</label>
                  <Input id="linkedin" name="linkedin" value={form.linkedin} onChange={handleChange} className="font-inter" placeholder="e.g. https://linkedin.com/in/janedoe" />
                </div>
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 font-inter mb-1">Twitter</label>
                  <Input id="twitter" name="twitter" value={form.twitter} onChange={handleChange} className="font-inter" placeholder="e.g. https://twitter.com/janedoe" />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-inter text-base rounded-full mt-4 transition-all duration-300" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600 font-inter">
            Already have an account?{' '}
            <a href="/login" className="text-orange-600 hover:underline font-medium transition-all duration-300">Sign In</a>
          </div>
        </div>
      </div>
      {/* Fade-in animation */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default Register; 