import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast({ title: 'Password reset', description: 'You can now sign in with your new password.' });
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      toast({ title: 'Reset failed', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <div className="relative w-full max-w-md">
        {/* Butterfly Accent */}
        <img
          src="/butterfly.png"
          alt="SheBuilds Butterfly"
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 opacity-80 animate-fade-in-up"
          style={{ zIndex: 2 }}
        />
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-10 pt-16 animate-fade-in-up transition-all duration-700">
          <h1 className="text-3xl font-light text-gray-900 mb-2 font-martian text-center">Reset Password</h1>
          <p className="text-base text-gray-600 mb-8 font-inter text-center">Enter your new password below to reset your account password.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 font-inter mb-1">New Password</label>
              <Input
                id="newPassword"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="font-inter"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-inter text-base rounded-full transition-all duration-300" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600 font-inter">
            Back to{' '}
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

export default ResetPassword; 