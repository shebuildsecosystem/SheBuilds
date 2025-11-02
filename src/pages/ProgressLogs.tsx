import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, Layers, Plus } from 'lucide-react';

interface Project {
  project_id: string;
  title: string;
}

interface ProgressLog {
  log_id: string;
  project_id: string;
  type: string;
  title: string;
  description: string;
  technologies_used: string[];
  hours_spent: number;
  challenges_overcome?: string;
  lessons_learned?: string;
  created_at: string;
  project?: { title: string };
}

const ProgressLogs: React.FC = () => {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Login required', description: 'Please log in to view your progress logs.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchLogs();
    // eslint-disable-next-line
  }, [currentPage, projectFilter, typeFilter]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data.projects || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load your projects.', variant: 'destructive' });
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(projectFilter !== 'all' && { project_id: projectFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
      });
      const response = await api.get(`/progress-logs?${params}`);
      setLogs(response.data.data.logs);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load progress logs.', variant: 'destructive' });
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="px-2 sm:px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-light text-gray-900 font-martian mb-2">Progress Logs</h1>
              <p className="text-base sm:text-lg text-gray-600 font-inter font-light">Track your project milestones, achievements, and learnings.</p>
            </div>
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 text-base font-medium rounded-full font-inter flex items-center gap-2" onClick={() => navigate('/progress-logs/create')}>
              <Plus className="w-5 h-5" /> Add Log
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.project_id} value={project.project_id}>{project.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline/List */}
          <div className="space-y-6">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <Card key={i} className="h-32 animate-pulse bg-white rounded-lg shadow-sm" />
              ))
            ) : logs.length === 0 ? (
              <div className="text-center text-gray-500 font-inter text-lg">No progress logs found.</div>
            ) : (
              logs.map((log) => (
                <Card key={log.log_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-0">
                  <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      <span className="inline-block px-3 py-1 rounded-full font-inter font-medium text-sm bg-orange-100 text-orange-800 capitalize">{log.type}</span>
                      <span className="flex items-center gap-1 text-gray-500 font-inter text-sm"><Layers className="w-4 h-4" />{log.project?.title || ''}</span>
                    </div>
                    <span className="flex items-center gap-1 text-gray-600 font-inter text-sm"><Calendar className="w-4 h-4" />{formatDate(log.created_at)}</span>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 px-6">
                    <h2 className="text-xl font-semibold text-gray-900 font-martian mb-1">{log.title}</h2>
                    <p className="text-gray-700 font-inter mb-2 line-clamp-3">{log.description}</p>
                    <div className="flex flex-wrap gap-2 items-center text-xs mb-2">
                      <span className="flex items-center gap-1 text-amber-700 font-inter"><Clock className="w-4 h-4" />{log.hours_spent} hrs</span>
                      {log.technologies_used && log.technologies_used.length > 0 && (
                        <span className="flex items-center gap-1 text-gray-500 font-inter">Tech: {log.technologies_used.join(', ')}</span>
                      )}
                    </div>
                    {log.challenges_overcome && (
                      <div className="text-xs text-gray-500 font-inter mb-1"><b>Challenges:</b> {log.challenges_overcome}</div>
                    )}
                    {log.lessons_learned && (
                      <div className="text-xs text-gray-500 font-inter"><b>Lessons:</b> {log.lessons_learned}</div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 md:mt-12 gap-4">
            <Button
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="mx-2 md:mx-4 text-gray-700 font-inter">Page {currentPage} of {totalPages}</span>
            <Button
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressLogs; 