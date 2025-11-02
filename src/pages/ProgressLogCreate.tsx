import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Project {
  project_id: string;
  title: string;
}

const ProgressLogCreate: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [type, setType] = useState('milestone');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [hours, setHours] = useState('');
  const [challenges, setChallenges] = useState('');
  const [lessons, setLessons] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Login required', description: 'Please log in to add a progress log.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data.projects || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load your projects.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !type || !title || !description || !technologies || !hours) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/progress-logs', {
        project_id: selectedProject,
        type,
        title,
        description,
        technologies_used: technologies.split(',').map(t => t.trim()).filter(Boolean),
        hours_spent: Number(hours),
        challenges_overcome: challenges,
        lessons_learned: lessons,
      });
      toast({ title: 'Progress log added', description: 'Your progress log has been created.' });
      setTimeout(() => navigate('/progress-logs'), 1500);
    } catch (error: any) {
      toast({ title: 'Submission failed', description: error?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <Navbar />
      <Card className="w-full max-w-2xl shadow-xl border-0 rounded-3xl bg-white/90 animate-fade-in-up overflow-hidden">
        <CardHeader className="pt-10 pb-4 flex flex-col items-center bg-white/80 border-b border-gray-100">
          <CardTitle className="text-3xl font-bold text-gray-900 font-martian mb-1">Add Progress Log</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-4 px-6 bg-white/70">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Select Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject} disabled={loading || projects.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? 'Loading projects...' : 'Select your project'} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.project_id} value={project.project_id}>{project.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {projects.length === 0 && !loading && (
                <p className="text-sm text-gray-500 mt-2">You have no projects. <span className="text-amber-700 cursor-pointer underline" onClick={() => navigate('/projects/create')}>Add a project</span> first.</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required className="font-inter" placeholder="E.g. Completed User Authentication" />
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Description</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required className="font-inter" placeholder="Describe what you accomplished or learned..." />
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Technologies Used (comma separated)</label>
              <Input value={technologies} onChange={e => setTechnologies(e.target.value)} required className="font-inter" placeholder="E.g. React, Node.js, MongoDB" />
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Hours Spent</label>
              <Input value={hours} onChange={e => setHours(e.target.value)} required className="font-inter" type="number" min="0" step="0.1" placeholder="E.g. 8" />
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Challenges Overcome (optional)</label>
              <Textarea value={challenges} onChange={e => setChallenges(e.target.value)} rows={2} className="font-inter" placeholder="Describe any challenges you overcame..." />
            </div>
            <div>
              <label className="block text-gray-700 font-inter mb-2">Lessons Learned (optional)</label>
              <Textarea value={lessons} onChange={e => setLessons(e.target.value)} rows={2} className="font-inter" placeholder="Share any lessons learned..." />
            </div>
            <div className="flex justify-center mt-8">
              <Button type="submit" className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter" disabled={submitting || loading || projects.length === 0}>
                {submitting ? 'Submitting...' : 'Add Log'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressLogCreate; 