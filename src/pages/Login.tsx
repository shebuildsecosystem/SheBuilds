import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser, setToken, getUserProfile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await loginUser({ email, password });
      setToken(res.data.token);
      // Fetch user profile to get is_admin
      try {
        const profileRes = await getUserProfile();
        const isAdmin = profileRes.data?.is_admin;
        if (typeof isAdmin !== 'undefined') {
          localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');
        } else {
          localStorage.removeItem('is_admin');
        }
      } catch {
        localStorage.removeItem('is_admin');
      }
      toast({ title: 'Login successful', description: `Welcome, ${res.data.user.name}!` });
      navigate('/'); // Redirect to home or dashboard
    } catch (err: any) {
      toast({ title: 'Login failed', description: err?.response?.data?.message || 'Invalid credentials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Butterfly Accent */}
        <img
          src="/butterfly.webp"
          alt="SheBuilds Butterfly"
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 opacity-80 animate-fade-in-up"
          style={{ zIndex: 2 }}
        />
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 pt-16 animate-fade-in-up transition-all duration-700">
          <h1 className="text-4xl font-light text-gray-900 mb-2 font-martian text-center">Sign In to SheBuilds</h1>
          <p className="text-base text-gray-600 mb-8 font-inter text-center">Empowering women in tech. Welcome back to your community!</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-inter mb-1">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="font-inter"
              autoComplete="email"
            />
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-inter mb-1 mt-4">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="font-inter"
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1">
              <a href="/forgot-password" className="text-sm text-orange-600 hover:underline font-inter font-medium transition-all duration-300">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-inter text-base rounded-full mt-6 transition-all duration-300" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600 font-inter">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-orange-600 hover:underline font-medium transition-all duration-300">Get Started</a>
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

export default Login; 