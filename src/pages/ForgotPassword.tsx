import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast({ title: 'Reset email sent', description: 'Check your inbox for password reset instructions.' });
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      toast({ title: 'Request failed', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <div className="relative w-full max-w-md">
        {/* Butterfly Accent */}
        <img
          src="/butterfly.webp"
          alt="SheBuilds Butterfly"
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 opacity-80 animate-fade-in-up"
          style={{ zIndex: 2 }}
        />
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-10 pt-16 animate-fade-in-up transition-all duration-700">
          <h1 className="text-3xl font-light text-gray-900 mb-2 font-martian text-center">Forgot Password?</h1>
          <p className="text-base text-gray-600 mb-8 font-inter text-center">Enter your email and we'll send you a link to reset your password.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-inter mb-1">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="font-inter"
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-inter text-base rounded-full transition-all duration-300" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600 font-inter">
            Remembered your password?{' '}
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

export default ForgotPassword; 