import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ArrowLeft, Gift } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ChallengeDetail {
  challenge_id: string;
  title: string;
  description: string;
  category: string;
  status: 'upcoming' | 'active' | 'completed';
  prize_pool: number;
  start_date: string;
  end_date: string;
  participant_count: number;
  requirements: string[];
  sponsor: string;
  judging_criteria: string[];
  created_at: string;
}

const ChallengeDetailPage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/challenges/${challengeId}`);
      setChallenge(response.data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load challenge details. Please try again.',
        variant: 'destructive',
      });
      navigate('/challenges');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleJoinChallenge = async () => {
    if (!isLoggedIn) {
      toast({ title: 'Login required', description: 'Please log in to join this challenge.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    setJoining(true);
    try {
      await api.post(`/challenges/${challengeId}/register`);
      toast({ title: 'Joined!', description: 'You have successfully joined this challenge.' });
      setJoined(true);
    } catch (error: any) {
      toast({ title: 'Could not join', description: error?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <Navbar />
      <button
        onClick={() => navigate('/challenges')}
        className="flex items-center gap-2 self-start mb-4 ml-2 px-4 py-2 rounded-full bg-white/80 hover:bg-orange-50 text-amber-800 font-medium shadow border border-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Challenges
      </button>
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">Loading challenge details...</div>
      ) : !challenge ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">Challenge not found.</div>
      ) : (
        <Card className="relative w-full max-w-2xl shadow-xl border-0 rounded-3xl bg-white/90 animate-fade-in-up overflow-hidden">
          <CardHeader className="pt-10 pb-4 flex flex-col items-center bg-white/80 border-b border-gray-100">
            <CardTitle className="text-3xl font-bold text-gray-900 font-martian mb-1 flex items-center gap-2">
              {challenge.title}
            </CardTitle>
            <div className="flex flex-wrap gap-3 items-center mt-2 mb-2">
              <span className={`px-3 py-1 rounded-full font-inter font-medium text-sm ${challenge.status === 'active' ? 'bg-green-100 text-green-800' : challenge.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>{challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}</span>
              <span className="flex items-center gap-1 text-amber-700 font-inter text-base"><Gift className="w-5 h-5" />Prize: ₹{challenge.prize_pool.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-gray-600 font-inter text-base"><Calendar className="w-5 h-5" />{formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}</span>
            </div>
            <div className="flex flex-wrap gap-3 items-center mt-1">
              <span className="flex items-center gap-1 text-gray-500 font-inter text-sm"><Users className="w-4 h-4" />{challenge.participant_count} participants</span>
              <span className="text-gray-500 font-inter text-sm">Sponsored by <span className="font-semibold text-amber-700">{challenge.sponsor}</span></span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-8 pb-4 px-6 bg-white/70">
            <div>
              <CardDescription className="text-lg text-gray-700 font-inter mb-4">{challenge.description}</CardDescription>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 font-martian mb-2">Requirements</h3>
              <ul className="list-disc pl-6 text-gray-700 font-inter">
                {challenge.requirements && challenge.requirements.length > 0 ? challenge.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                )) : <li>No specific requirements listed.</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 font-martian mb-2">Category</h3>
              <span className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full font-inter text-sm">{challenge.category}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 font-martian mb-2">Judging Criteria</h3>
              <ul className="list-disc pl-6 text-gray-700 font-inter">
                {challenge.judging_criteria && challenge.judging_criteria.length > 0 ? challenge.judging_criteria.map((crit, idx) => (
                  <li key={idx}>{crit}</li>
                )) : <li>No judging criteria listed.</li>}
              </ul>
            </div>
            {isLoggedIn && (challenge.status === 'active' || challenge.status === 'upcoming') && (
              <div className="flex justify-center mt-8">
                <Button
                  className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter"
                  onClick={handleJoinChallenge}
                  disabled={joining || joined}
                >
                  {joined ? 'You have joined!' : (joining ? 'Joining...' : 'Join Challenge')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengeDetailPage; 