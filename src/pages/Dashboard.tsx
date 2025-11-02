import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Layers, Gift, Target, BookOpen, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Login required', description: 'Please log in to view your dashboard.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [profileRes, projectsRes, grantsRes, challengesRes, logsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/projects'),
        api.get('/grant-programs'),
        api.get('/challenges'),
        api.get('/progress-logs'),
      ]);
      setStats({
        user: profileRes.data,
        projects: projectsRes.data.data.projects.length,
        grants: grantsRes.data.data.grants.length,
        challenges: challengesRes.data.data.challenges.length,
        logs: logsRes.data.data.logs.length,
      });
      setRecentLogs(logsRes.data.data.logs.slice(0, 5));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load dashboard data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-light text-gray-900 font-martian mb-8">Dashboard</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <Card className="bg-orange-50 border-0">
                <CardHeader className="flex flex-col items-center">
                  <Layers className="w-7 h-7 text-amber-700 mb-2" />
                  <CardTitle className="text-lg font-martian">Projects</CardTitle>
                  <div className="text-3xl font-bold text-amber-800">{stats.projects}</div>
                </CardHeader>
              </Card>
              <Card className="bg-orange-50 border-0">
                <CardHeader className="flex flex-col items-center">
                  <Gift className="w-7 h-7 text-amber-700 mb-2" />
                  <CardTitle className="text-lg font-martian">Grants</CardTitle>
                  <div className="text-3xl font-bold text-amber-800">{stats.grants}</div>
                </CardHeader>
              </Card>
              <Card className="bg-orange-50 border-0">
                <CardHeader className="flex flex-col items-center">
                  <Target className="w-7 h-7 text-amber-700 mb-2" />
                  <CardTitle className="text-lg font-martian">Challenges</CardTitle>
                  <div className="text-3xl font-bold text-amber-800">{stats.challenges}</div>
                </CardHeader>
              </Card>
              <Card className="bg-orange-50 border-0">
                <CardHeader className="flex flex-col items-center">
                  <BookOpen className="w-7 h-7 text-amber-700 mb-2" />
                  <CardTitle className="text-lg font-martian">Logs</CardTitle>
                  <div className="text-3xl font-bold text-amber-800">{stats.logs}</div>
                </CardHeader>
              </Card>
            </div>
            {/* Recent Activity */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-martian font-semibold text-gray-900">Recent Progress Logs</h2>
                <Button variant="ghost" onClick={() => navigate('/progress-logs')}>View All</Button>
              </div>
              {recentLogs.length === 0 ? (
                <div className="text-gray-500 font-inter">No recent logs.</div>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map(log => (
                    <Card key={log.log_id} className="bg-white border-0 shadow-sm">
                      <CardContent className="py-3 px-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="font-martian text-lg text-gray-900">{log.title}</div>
                            <div className="text-xs text-gray-500 font-inter">{log.type} • {log.project?.title || ''}</div>
                          </div>
                          <div className="text-xs text-gray-500 font-inter">{new Date(log.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="text-gray-700 font-inter mt-1 line-clamp-2">{log.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 text-base font-medium rounded-full font-inter flex items-center gap-2" onClick={() => navigate('/projects/create')}>
                <Plus className="w-5 h-5" /> Add Project
              </Button>
              <Button className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 text-base font-medium rounded-full font-inter flex items-center gap-2" onClick={() => navigate('/progress-logs/create')}>
                <Plus className="w-5 h-5" /> Add Log
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 