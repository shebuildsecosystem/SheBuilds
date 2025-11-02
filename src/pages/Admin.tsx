/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getUserProfile, getGrantPrograms, updateGrantStatus, getAllUsers, updateUserRole, deleteUser as apiDeleteUser, getAdminAnalytics, adminDeleteGrant, getAnnouncements, createAnnouncement, deleteAnnouncement, getEvents, createEvent, updateEvent, deleteEvent, createGrantProgram, updateGrantProgram, deleteGrantProgram, getGrantProgramStats, toggleGrantProgramFeatured, getAllGrantApplications, updateGrantApplicationStatus, getProjectDetails, deleteGrantApplication } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '../components/ImageUpload.tsx';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { User, Users, Award, Briefcase, Activity, PieChart as PieIcon, Megaphone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Simple tag input for array fields
function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 bg-white">
      {value.map((tag, idx) => (
        <span key={tag + idx} className="bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-xs flex items-center gap-1">
          {tag}
          <button type="button" className="ml-1 text-amber-700 hover:text-red-600" onClick={() => onChange(value.filter((_, i) => i !== idx))}>&times;</button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[80px] border-none outline-none py-1 px-2 text-sm bg-transparent"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'grants' | 'users' | 'announcements' | 'events' | 'grant-programs' | 'grant-applications'>('grants');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grants, setGrants] = useState<any[]>([]);
  const [grantsLoading, setGrantsLoading] = useState(false);
  const [grantsError, setGrantsError] = useState<string | null>(null);
  const { toast } = useToast();



  // Grant Program creation form state
  const grantProgramForm = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      grant_amount: '',
      currency: 'USD',
      total_projects_funded: '',
      disbursement_phases: 1,
      status: 'active',
      perks: [],
      eligibility_criteria: {
        working_prototype: true,
        women_leadership_percentage: 66,
        progress_duration_months: 6,
        values: [],
        region: 'India'
      },
      application_requirements: {
        team_details: true,
        project_overview: true,
        roadmap: true,
        vision_impact: true,
        why_grant: true,
        screenshots_demo: true
      },
      important_dates: {
        applications_open: '',
        deadline: '',
        winners_announced: ''
      },
      tags: [],
      cover_image: '',
      external_link: ''
    },
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);



  // Tag input state for grant program form
  const [perksTags, setPerksTags] = useState<string[]>([]);
  const [valuesTags, setValuesTags] = useState<string[]>([]);
  const [tagsTags, setTagsTags] = useState<string[]>([]);



  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Announcements state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  // Grant Programs state
  const [grantPrograms, setGrantPrograms] = useState<any[]>([]);
  const [grantProgramsLoading, setGrantProgramsLoading] = useState(false);
  const [grantProgramsError, setGrantProgramsError] = useState<string | null>(null);
  const [showCreateGrantProgram, setShowCreateGrantProgram] = useState(false);
  const [editingGrantProgram, setEditingGrantProgram] = useState<string | null>(null);
  const [grantProgramStats, setGrantProgramStats] = useState<any>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);
  const [createAnnouncementError, setCreateAnnouncementError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);

  // Events state
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createEventError, setCreateEventError] = useState<string | null>(null);

  // Grant Applications state
  const [grantApplications, setGrantApplications] = useState<any[]>([]);
  const [grantApplicationsLoading, setGrantApplicationsLoading] = useState(false);
  const [grantApplicationsError, setGrantApplicationsError] = useState<string | null>(null);
  const [grantApplicationsFilter, setGrantApplicationsFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile and check admin status
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile();
        // Assume is_admin flag in user profile (customize as needed)
        setIsAdmin(res.data?.is_admin || false);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    getAdminAnalytics()
      .then(res => setAnalytics(res.data))
      .catch(() => setAnalyticsError('Failed to load analytics'))
      .finally(() => setAnalyticsLoading(false));
  }, []);



  // Fetch all grants (admin) - using grant applications data
  useEffect(() => {
    if (activeTab === 'grants' && isAdmin) {
      setGrantsLoading(true);
      setGrantsError(null);
      getAllGrantApplications()
        .then(res => setGrants(res.data?.applications || []))
        .catch((error) => {
          console.error('Error fetching grants:', error);
          setGrantsError(error?.response?.data?.message || 'Failed to load grants');
        })
        .finally(() => setGrantsLoading(false));
    }
  }, [activeTab, isAdmin]);



  // Fetch all users (admin)
  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      setUsersLoading(true);
      setUsersError(null);
      getAllUsers()
        .then(res => setUsers(res.data?.users || []))
        .catch(() => setUsersError('Failed to load users'))
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab, isAdmin]);

  // Fetch all announcements
  useEffect(() => {
    if (activeTab === 'announcements' && isAdmin) {
      setAnnouncementsLoading(true);
      setAnnouncementsError(null);
      getAnnouncements()
        .then(res => setAnnouncements(res.data?.announcements || []))
        .catch(() => setAnnouncementsError('Failed to load announcements'))
        .finally(() => setAnnouncementsLoading(false));
    }
  }, [activeTab, isAdmin]);

  // Fetch all grant programs
  useEffect(() => {
    if (activeTab === 'grant-programs' && isAdmin) {
      setGrantProgramsLoading(true);
      setGrantProgramsError(null);
      getGrantPrograms()
        .then(res => setGrantPrograms(res.data?.programs || []))
        .catch(() => setGrantProgramsError('Failed to load grant programs'))
        .finally(() => setGrantProgramsLoading(false));
    }
  }, [activeTab, isAdmin]);

  // Fetch all events
  useEffect(() => {
    if (activeTab === 'events' && isAdmin) {
      setEventsLoading(true);
      setEventsError(null);
      getEvents()
        .then(res => setEvents(res.data?.events || []))
        .catch(() => setEventsError('Failed to load events'))
        .finally(() => setEventsLoading(false));
    }
  }, [activeTab, isAdmin]);

  // Fetch all grant applications
  useEffect(() => {
    if (activeTab === 'grant-applications' && isAdmin) {
      setGrantApplicationsLoading(true);
      setGrantApplicationsError(null);
      getAllGrantApplications()
        .then(res => setGrantApplications(res.data?.applications || []))
        .catch((error) => {
          console.error('Error fetching grant applications:', error);
          setGrantApplicationsError(error?.response?.data?.message || 'Failed to load grant applications');
        })
        .finally(() => setGrantApplicationsLoading(false));
    }
  }, [activeTab, isAdmin]);

  const handleGrantStatusChange = async (grantId: string, newStatus: string) => {
    try {
      await updateGrantApplicationStatus(grantId, { status: newStatus });
      toast({ title: 'Grant application status updated', description: `Status set to ${newStatus}` });
      // Refresh grants
      setGrantsLoading(true);
      getAllGrantApplications()
        .then(res => setGrants(res.data?.applications || []))
        .catch((error) => {
          console.error('Error fetching grants:', error);
          setGrantsError(error?.response?.data?.message || 'Failed to load grants');
        })
        .finally(() => setGrantsLoading(false));
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    }
  };



  const handleCreateGrantProgram = async (data: any) => {
    setCreating(true);
    setCreateError(null);
    try {
      const payload = {
        ...data,
        grant_amount: Number(data.grant_amount),
        total_projects_funded: Number(data.total_projects_funded),
        disbursement_phases: Number(data.disbursement_phases),
        perks: perksTags,
        eligibility_criteria: {
          ...data.eligibility_criteria,
          values: valuesTags
        },
        tags: tagsTags,
        cover_image: uploadedImageUrl || data.cover_image,
        important_dates: {
          applications_open: new Date(data.important_dates.applications_open),
          deadline: new Date(data.important_dates.deadline),
          winners_announced: new Date(data.important_dates.winners_announced)
        }
      };
      
      if (editingGrantProgram) {
        // Update existing grant program
        await updateGrantProgram(editingGrantProgram, payload);
        toast({ title: 'Grant Program updated', description: 'The grant program has been updated.' });
      } else {
        // Create new grant program
        await createGrantProgram(payload);
        toast({ title: 'Grant Program created', description: 'The grant program has been created.' });
      }
      
      setShowCreateGrantProgram(false);
      setEditingGrantProgram(null);
      grantProgramForm.reset();
      setPerksTags([]);
      setValuesTags([]);
      setTagsTags([]);
      setUploadedImageUrl('');
      // Refresh grant programs
      setGrantProgramsLoading(true);
      getGrantPrograms()
        .then(res => setGrantPrograms(res.data?.programs || []))
        .catch(() => setGrantProgramsError('Failed to load grant programs'))
        .finally(() => setGrantProgramsLoading(false));
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || `Failed to ${editingGrantProgram ? 'update' : 'create'} grant program`);
    } finally {
      setCreating(false);
    }
  };



  // Fetch project details by ID
  const fetchProjectDetails = async (projectId: string | null | undefined) => {
    setProjectLoading(true);
    setSelectedProject(null);
    try {
      if (!projectId) {
        setSelectedProject(null);
        setProjectLoading(false);
        return;
      }
      function hasObjectId(obj: any): obj is { _id: string } {
        return obj && typeof obj === 'object' && '_id' in obj && typeof obj._id === 'string';
      }
      let resolvedProjectId: string;
      if (hasObjectId(projectId)) {
        resolvedProjectId = projectId._id;
      } else {
        resolvedProjectId = projectId as string;
      }
      const response = await getProjectDetails(resolvedProjectId);
      if (response.data && response.data.project) {
        setSelectedProject(response.data.project);
      } else if (response.data && response.data.data) {
        setSelectedProject(response.data.data);
      } else if (response.data && response.data._id && response.data.title) {
        setSelectedProject(response.data);
      } else {
        setSelectedProject(null);
      }
    } catch (err) {
      setSelectedProject(null);
    } finally {
      setProjectLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Access denied: Admins only</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center py-8 px-2 md:px-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 self-start mb-4 ml-2 px-4 py-2 rounded-full bg-white/80 hover:bg-orange-50 text-amber-800 font-medium shadow border border-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-amber-800">Admin Dashboard</h1>
        {/* Analytics Section */}
        <div className="mb-8">
          {analyticsLoading ? (
            <div>Loading analytics...</div>
          ) : analyticsError ? (
            <div className="text-red-600">{analyticsError}</div>
          ) : analytics ? (
            <div className="w-full flex flex-col lg:flex-row gap-8 fade-in">
              {/* Bar Chart for Stats */}
              <div className="flex-1 bg-amber-50 rounded-2xl shadow p-4 flex flex-col items-center justify-center min-w-[260px] min-h-[300px]">
                <div className="flex items-center gap-2 mb-2">
                  <PieIcon className="text-amber-500" />
                  <span className="font-martian text-lg text-amber-800">Platform Stats</span>
                </div>
                {analytics.stats.totalUsers + analytics.stats.totalProjects + analytics.stats.totalGrants + analytics.stats.grantEligibleProjects === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-amber-700 opacity-70">
                    <PieIcon className="w-10 h-10 mb-2" />
                    <span className="font-inter">No stats available yet.</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={[
                        { name: 'Users', value: analytics.stats.totalUsers },
                        { name: 'Projects', value: analytics.stats.totalProjects },
                        { name: 'Grants', value: analytics.stats.totalGrants },
                        { name: 'Grant-Eligible', value: analytics.stats.grantEligibleProjects },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-inter)', fill: '#b45309', fontSize: 12 }} />
                      <YAxis tick={{ fontFamily: 'var(--font-inter)', fill: '#b45309', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: '#fde68a' }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#f59e42" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Pie Charts for Breakdown */}
              <div className="flex-1 flex flex-col gap-6 min-w-[260px] min-h-[300px]">
                <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-amber-500" />
                    <span className="font-martian text-lg text-amber-800">Project Breakdown</span>
                  </div>
                  {(analytics.stats.totalProjects === 0 && analytics.stats.grantEligibleProjects === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-amber-700 opacity-70">
                      <Award className="w-10 h-10 mb-2" />
                      <span className="font-inter">No project data yet.</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Projects', value: analytics.stats.totalProjects },
                            { name: 'Grant-Eligible', value: analytics.stats.grantEligibleProjects },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          innerRadius={30}
                          fill="#f59e42"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          <Cell key="projects" fill="#fbbf24" />
                          <Cell key="grant-eligible" fill="#f59e42" />
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
              </div>
                <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="text-amber-500" />
                    <span className="font-martian text-lg text-amber-800">Challenge Breakdown</span>
              </div>
                  {(analytics.stats.totalChallenges === 0 && analytics.stats.activeChallenges === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-amber-700 opacity-70">
                      <Activity className="w-10 h-10 mb-2" />
                      <span className="font-inter">No challenge data yet.</span>
              </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Challenges', value: analytics.stats.totalChallenges },
                            { name: 'Active', value: analytics.stats.activeChallenges },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          innerRadius={30}
                          fill="#f59e42"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          <Cell key="challenges" fill="#fbbf24" />
                          <Cell key="active" fill="#f59e42" />
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
              </div>
              </div>
            </div>
          ) : null}
          {/* Recent Activity */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 fade-in">
              <div className="bg-white border border-amber-100 rounded-lg p-4 min-h-[180px] flex flex-col">
                <div className="font-semibold mb-2 text-amber-800 flex items-center gap-2"><User className="w-4 h-4 text-amber-500" />Recent Users</div>
                {analytics.recentActivity.users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-amber-700 opacity-70">
                    <User className="w-8 h-8 mb-2" />
                    <span className="font-inter">No recent users yet.</span>
                  </div>
                ) : (
                <ul className="text-sm">
                  {analytics.recentActivity.users.map((user: any) => (
                      <li key={user._id} className="mb-2 flex items-center gap-2">
                        <span className="inline-block w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700 font-martian">{user.name[0]}</span>
                        <span>{user.name} <span className="text-gray-500">(@{user.username})</span></span>
                        <span className="ml-auto text-xs text-gray-400">{new Date(user.joined_date).toLocaleDateString()}</span>
                      </li>
                  ))}
                </ul>
                )}
              </div>
              <div className="bg-white border border-amber-100 rounded-lg p-4 min-h-[180px] flex flex-col">
                <div className="font-semibold mb-2 text-amber-800 flex items-center gap-2"><Briefcase className="w-4 h-4 text-amber-500" />Recent Projects</div>
                {analytics.recentActivity.projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-amber-700 opacity-70">
                    <Briefcase className="w-8 h-8 mb-2" />
                    <span className="font-inter">No recent projects yet.</span>
                  </div>
                ) : (
                <ul className="text-sm">
                  {analytics.recentActivity.projects.map((project: any) => (
                      <li key={project._id} className="mb-2 flex items-center gap-2">
                        <span className="inline-block w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 font-martian">{project.title[0]}</span>
                        <span>{project.title} <span className="text-gray-500">by {project.builder_id?.name || '-'}</span></span>
                      </li>
                  ))}
                </ul>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 mb-6">
          <Button variant={activeTab === 'grants' ? 'default' : 'outline'} onClick={() => setActiveTab('grants')}>Grants</Button>
          <Button variant={activeTab === 'grant-programs' ? 'default' : 'outline'} onClick={() => setActiveTab('grant-programs')}>Grant Programs</Button>
          <Button variant={activeTab === 'grant-applications' ? 'default' : 'outline'} onClick={() => setActiveTab('grant-applications')}>Grant Applications</Button>
          <Button variant={activeTab === 'users' ? 'default' : 'outline'} onClick={() => setActiveTab('users')}>Users</Button>
          <Button variant={activeTab === 'announcements' ? 'default' : 'outline'} onClick={() => setActiveTab('announcements')}>Announcements</Button>
          <Button variant={activeTab === 'events' ? 'default' : 'outline'} onClick={() => setActiveTab('events')}>Events</Button>
        </div>
        <div>
          {activeTab === 'grants' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Grants Management</h2>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-gray-600">
                {grantsLoading ? (
                  <div>Loading grants...</div>
                ) : grantsError ? (
                  <div className="text-red-600">{grantsError}</div>
                ) : grants.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Grant Applications Yet</h3>
                    <p className="text-gray-500">Grant applications will appear here once users start applying for grants.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-2">Project</th>
                        <th className="py-2 pr-2">Applicant</th>
                        <th className="py-2 pr-2">Grant Program</th>
                        <th className="py-2 pr-2">Amount</th>
                        <th className="py-2 pr-2">Status</th>
                        <th className="py-2 pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grants.map(grant => (
                        <tr key={grant._id} className="border-b hover:bg-amber-100/40">
                          <td className="py-2 pr-2">{grant.project_id?.title || '-'}</td>
                          <td className="py-2 pr-2">{grant.applicant_id?.name || '-'}</td>
                          <td className="py-2 pr-2">{grant.grant_program_id?.title || '-'}</td>
                          <td className="py-2 pr-2">
                            {grant.grant_program_id?.currency} {grant.grant_program_id?.grant_amount?.toLocaleString() || '-'}
                          </td>
                          <td className="py-2 pr-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              grant.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                              grant.status === 'in-review' ? 'bg-yellow-100 text-yellow-700' :
                              grant.status === 'approved' ? 'bg-green-100 text-green-700' :
                              grant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-2 pr-2">
                            <select
                              value={grant.status}
                              onChange={e => handleGrantStatusChange(grant._id, e.target.value)}
                              className="border rounded px-2 py-1 mr-2"
                            >
                              <option value="submitted">Submitted</option>
                              <option value="in-review">In Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this grant application?')) {
                                try {
                                  await deleteGrantApplication(grant._id);
                                  setGrants(grants => grants.filter(g => g._id !== grant._id));
                                  toast({ title: 'Grant application deleted', description: 'The grant application has been removed.' });
                                } catch {
                                  toast({ title: 'Delete failed', description: 'Could not delete grant application.', variant: 'destructive' });
                                }
                              }
                            }}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}


          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-gray-600">
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : usersError ? (
                  <div className="text-red-600">{usersError}</div>
                ) : users.length === 0 ? (
                  <div>No users found.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-2">Name</th>
                        <th className="py-2 pr-2">Username</th>
                        <th className="py-2 pr-2">Email</th>
                        <th className="py-2 pr-2">Admin</th>
                        <th className="py-2 pr-2">Verified</th>
                        <th className="py-2 pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className="border-b hover:bg-amber-100/40">
                          <td className="py-2 pr-2">{user.name}</td>
                          <td className="py-2 pr-2">{user.username}</td>
                          <td className="py-2 pr-2">{user.email}</td>
                          <td className="py-2 pr-2">
                            <input type="checkbox" checked={user.is_admin} onChange={async e => {
                              try {
                                const res = await updateUserRole(user._id, { is_admin: e.target.checked });
                                const updatedUser = res.data.user;
                                setUsers(users => users.map(u => u._id === user._id ? { ...u, is_admin: updatedUser.is_admin } : u));
                                toast({ title: 'User updated', description: `Admin status is now ${updatedUser.is_admin ? 'admin' : 'not admin'}.` });
                              } catch {
                                toast({ title: 'Update failed', description: 'Could not update admin status.', variant: 'destructive' });
                              }
                            }} />
                          </td>
                          <td className="py-2 pr-2">
                            <input type="checkbox" checked={user.is_verified} onChange={async e => {
                              try {
                                const res = await updateUserRole(user._id, { is_verified: e.target.checked });
                                const updatedUser = res.data.user;
                                setUsers(users => users.map(u => u._id === user._id ? { ...u, is_verified: updatedUser.is_verified } : u));
                                toast({ title: 'User updated', description: `Verification status is now ${updatedUser.is_verified ? 'verified' : 'not verified'}.` });
                              } catch {
                                toast({ title: 'Update failed', description: 'Could not update verification status.', variant: 'destructive' });
                              }
                            }} />
                          </td>
                          <td className="py-2 pr-2">
                            <Button size="sm" variant="destructive" onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                try {
                                  await apiDeleteUser(user._id);
                                  setUsers(users => users.filter(u => u._id !== user._id));
                                  toast({ title: 'User deleted', description: 'User has been deleted.' });
                                } catch {
                                  toast({ title: 'Delete failed', description: 'Could not delete user.', variant: 'destructive' });
                                }
                              }
                            }}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activeTab === 'announcements' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Announcements</h2>
                <Button className="bg-amber-700 hover:bg-amber-800 text-white" onClick={() => setShowCreateAnnouncement(true)}>
                  + New Announcement
                </Button>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-gray-600">
                {announcementsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <span className="ml-3">Loading announcements...</span>
                  </div>
                ) : announcementsError ? (
                  <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-red-600">⚠️</span>
                      <span className="ml-2">{announcementsError}</span>
                    </div>
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Announcements Yet</h3>
                    <p className="text-gray-500">Create your first announcement to get started.</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
                    {announcements.map((a, index) => (
                      <div key={a._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                        <div className="p-5" onClick={() => {
                          setSelectedAnnouncement(a);
                          setShowAnnouncementDialog(true);
                        }}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                  #{announcements.length - index}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                                {a.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 ml-3">
                              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                {new Date(a.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                            {a.message}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <span>👤</span>
                              <span>{a.created_by?.name || 'Admin'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>🕒</span>
                              <span>{new Date(a.created_at).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-5 pb-4">
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this announcement?')) {
                                deleteAnnouncement(a._id).then(() => {
                                  setAnnouncements(announcements => announcements.filter(x => x._id !== a._id));
                                  toast({ title: 'Announcement deleted', description: 'The announcement has been removed.' });
                                }).catch(() => {
                                  toast({ title: 'Delete failed', description: 'Could not delete announcement.', variant: 'destructive' });
                                });
                              }
                            }}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Create Announcement Modal */}
              {showCreateAnnouncement && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-0 min-w-[320px] max-w-lg w-full">
                    <div className="px-8 pt-8 pb-0 border-b border-amber-100">
                      <h3 className="text-lg font-bold mb-4">New Announcement</h3>
                    </div>
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                      const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                      setCreatingAnnouncement(true);
                      setCreateAnnouncementError(null);
                      try {
                        const res = await createAnnouncement({ title, message });
                        setAnnouncements(announcements => [res.data.announcement, ...announcements]);
                        setShowCreateAnnouncement(false);
                        toast({ title: 'Announcement posted' });
                      } catch (err: any) {
                        setCreateAnnouncementError(err?.response?.data?.message || 'Failed to post announcement');
                      } finally {
                        setCreatingAnnouncement(false);
                      }
                    }}>
                      <div className="px-8 py-4 max-h-[80vh] overflow-y-auto space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title *</label>
                          <input name="title" required maxLength={200} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Message *</label>
                          <textarea name="message" required maxLength={2000} rows={5} className="w-full border rounded px-3 py-2" />
                        </div>
                        {createAnnouncementError && <div className="text-red-600 text-sm">{createAnnouncementError}</div>}
                      </div>
                      <div className="px-8 pb-6 pt-2 flex gap-2 justify-end border-t border-amber-100">
                        <Button type="button" variant="outline" onClick={() => setShowCreateAnnouncement(false)} disabled={creatingAnnouncement}>Cancel</Button>
                        <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={creatingAnnouncement}>{creatingAnnouncement ? 'Posting...' : 'Post'}</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Announcement Detail Dialog */}
              {showAnnouncementDialog && selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-0 min-w-[320px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="px-8 pt-8 pb-0 border-b border-amber-100">
                      <h3 className="text-lg font-bold mb-4">Announcement Details</h3>
                    </div>
                    <div className="px-8 py-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <div className="text-lg font-semibold text-amber-800">{selectedAnnouncement.title}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                          <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg border">
                            {selectedAnnouncement.message}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                          <div>
                            <span className="font-medium">Posted by:</span> {selectedAnnouncement.created_by?.name || 'Admin'}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(selectedAnnouncement.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-8 pb-6 pt-2 flex gap-2 justify-end border-t border-amber-100">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAnnouncementDialog(false);
                          setSelectedAnnouncement(null);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Events</h2>
                <Button className="bg-amber-700 hover:bg-amber-800 text-white" onClick={() => setShowCreateEvent(true)}>
                  + New Event
                </Button>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-gray-600">
                {eventsLoading ? (
                  <div>Loading events...</div>
                ) : eventsError ? (
                  <div className="text-red-600">{eventsError}</div>
                ) : events.length === 0 ? (
                  <div>No events found.</div>
                ) : (
                  <div className="grid gap-4">
                    {events.map(event => (
                      <div key={event._id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-amber-800 text-lg">{event.title}</div>
                            <div className="text-gray-700 mt-1">{event.description}</div>
                            <div className="text-sm text-gray-500 mt-2">
                              <div>Date: {new Date(event.date).toLocaleDateString()}</div>
                              <div>Location: {event.location}</div>
                              <div>Capacity: {event.registered_participants}/{event.capacity}</div>
                              <div>Status: {event.is_active ? 'Active' : 'Inactive'}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 md:mt-0">
                            <Button size="sm" variant="outline" onClick={() => {
                              // TODO: Implement edit functionality
                              toast({ title: 'Edit functionality coming soon' });
                            }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              if (window.confirm('Delete this event?')) {
                                try {
                                  await deleteEvent(event._id);
                                  setEvents(events => events.filter(x => x._id !== event._id));
                                  toast({ title: 'Event deleted' });
                                } catch {
                                  toast({ title: 'Delete failed', description: 'Could not delete event.', variant: 'destructive' });
                                }
                              }
                            }}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Create Event Modal */}
              {showCreateEvent && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-0 min-w-[320px] max-w-lg w-full">
                    <div className="px-8 pt-8 pb-0 border-b border-amber-100">
                      <h3 className="text-lg font-bold mb-4">New Event</h3>
                    </div>
                    <div className="px-8 py-4 max-h-[80vh] overflow-y-auto">
                      <form onSubmit={async e => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                        const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
                        const image = (form.elements.namedItem('image') as HTMLInputElement).value;
                        const date = (form.elements.namedItem('date') as HTMLInputElement).value;
                        const location = (form.elements.namedItem('location') as HTMLInputElement).value;
                        const capacity = (form.elements.namedItem('capacity') as HTMLInputElement).value;
                        const registration_required = (form.elements.namedItem('registration_required') as HTMLInputElement).checked;
                        const is_active = (form.elements.namedItem('is_active') as HTMLInputElement).checked;
                        const external_link = (form.elements.namedItem('external_link') as HTMLInputElement).value;
                        
                        // Validate required fields
                        if (!title.trim() || !description.trim() || !image.trim() || !date || !location.trim() || !capacity) {
                          setCreateEventError('All required fields must be filled');
                          return;
                        }
                        
                        // Validate image URL
                        try {
                          new URL(image);
                        } catch {
                          setCreateEventError('Please enter a valid image URL');
                          return;
                        }
                        
                        // Validate capacity
                        const capacityNum = parseInt(capacity);
                        if (isNaN(capacityNum) || capacityNum <= 0) {
                          setCreateEventError('Capacity must be a positive number');
                          return;
                        }
                        
                        // Validate external link
                        if (!external_link.trim()) {
                          setCreateEventError('External Registration Link is required');
                          return;
                        }
                        
                        setCreatingEvent(true);
                        setCreateEventError(null);
                        try {
                          console.log('Creating event with data:', { 
                            title, 
                            description, 
                            image, 
                            date, 
                            location, 
                            capacity: parseInt(capacity),
                            registration_required,
                            is_active,
                            external_link
                          });
                          const res = await createEvent({ 
                            title, 
                            description, 
                            image, 
                            date, 
                            location, 
                            capacity: parseInt(capacity),
                            registration_required,
                            is_active,
                            external_link
                          });
                          setEvents(events => [res.data, ...events]);
                          setShowCreateEvent(false);
                          toast({ title: 'Event created' });
                        } catch (err: any) {
                          console.error('Error creating event:', err);
                          console.error('Error response:', err?.response?.data);
                          setCreateEventError(err?.response?.data?.message || 'Failed to create event');
                        } finally {
                          setCreatingEvent(false);
                        }
                      }} id="create-event-form" className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title *</label>
                          <input name="title" required maxLength={200} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description *</label>
                          <textarea name="description" required maxLength={2000} rows={3} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Image URL *</label>
                          <input name="image" required type="url" placeholder="https://example.com/image.jpg" className="w-full border rounded px-3 py-2" />
                          <p className="text-xs text-gray-500 mt-1">Enter a valid image URL (e.g., https://example.com/image.jpg)</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date *</label>
                            <input name="date" required type="date" className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Capacity *</label>
                            <input name="capacity" required type="number" min="1" className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Location *</label>
                          <input name="location" required maxLength={200} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input name="registration_required" type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Registration Required</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input name="is_active" type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Active</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">External Registration Link *</label>
                          <input name="external_link" type="url" required className="w-full border rounded px-3 py-2" />
                        </div>
                        {createEventError && <div className="text-red-600 text-sm">{createEventError}</div>}
                      </form>
                    </div>
                    <div className="px-8 pb-6 pt-2 flex gap-2 justify-end border-t border-amber-100">
                      <Button type="button" variant="outline" onClick={() => setShowCreateEvent(false)} disabled={creatingEvent}>Cancel</Button>
                      <Button type="submit" form="create-event-form" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={creatingEvent}>{creatingEvent ? 'Creating...' : 'Create'}</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'grant-programs' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Grant Programs Management</h2>
                <Button className="bg-amber-700 hover:bg-amber-800 text-white" onClick={() => setShowCreateGrantProgram(true)}>
                  + Create Grant Program
                </Button>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-gray-600">
                {grantProgramsLoading ? (
                  <div>Loading grant programs...</div>
                ) : grantProgramsError ? (
                  <div className="text-red-600">{grantProgramsError}</div>
                ) : grantPrograms.length === 0 ? (
                  <div>No grant programs found.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-2">Title</th>
                        <th className="py-2 pr-2">Amount</th>
                        <th className="py-2 pr-2">Projects Funded</th>
                        <th className="py-2 pr-2">Status</th>
                        <th className="py-2 pr-2">Featured</th>
                        <th className="py-2 pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grantPrograms.map(program => (
                        <tr key={program._id} className="border-b hover:bg-amber-100/40">
                          <td className="py-2 pr-2">{program.title}</td>
                          <td className="py-2 pr-2">{program.currency} {program.grant_amount}</td>
                          <td className="py-2 pr-2">{program.total_projects_funded}</td>
                          <td className="py-2 pr-2">
                            <select
                              value={program.status}
                              onChange={async (e) => {
                                try {
                                  await updateGrantProgram(program._id, { status: e.target.value });
                                  setGrantPrograms(programs => programs.map(p => 
                                    p._id === program._id ? { ...p, status: e.target.value } : p
                                  ));
                                  toast({ title: 'Status updated', description: 'Grant program status updated.' });
                                } catch {
                                  toast({ title: 'Update failed', description: 'Could not update status.', variant: 'destructive' });
                                }
                              }}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="closed">Closed</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-2 pr-2">
                            <span className={`px-2 py-1 rounded text-xs ${program.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              {program.is_featured ? 'Featured' : 'Not Featured'}
                            </span>
                          </td>
                          <td className="py-2 pr-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={async () => {
                                try {
                                  await toggleGrantProgramFeatured(program._id);
                                  setGrantPrograms(programs => programs.map(p => 
                                    p._id === program._id ? { ...p, is_featured: !p.is_featured } : p
                                  ));
                                  toast({ title: 'Status updated', description: 'Featured status updated.' });
                                } catch {
                                  toast({ title: 'Update failed', description: 'Could not update featured status.', variant: 'destructive' });
                                }
                              }}
                            >
                              {program.is_featured ? 'Unfeature' : 'Feature'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="ml-2"
                              onClick={() => {
                                // Set editing state
                                setEditingGrantProgram(program._id);
                                // Populate form with existing data
                                grantProgramForm.reset({
                                  title: program.title,
                                  subtitle: program.subtitle || '',
                                  description: program.description,
                                  grant_amount: program.grant_amount.toString(),
                                  currency: program.currency,
                                  total_projects_funded: program.total_projects_funded.toString(),
                                  disbursement_phases: program.disbursement_phases,
                                  status: program.status,
                                  eligibility_criteria: program.eligibility_criteria,
                                  application_requirements: program.application_requirements,
                                  important_dates: {
                                    applications_open: program.important_dates.applications_open.split('T')[0],
                                    deadline: program.important_dates.deadline.split('T')[0],
                                    winners_announced: program.important_dates.winners_announced.split('T')[0]
                                  },
                                  tags: program.tags,
                                  cover_image: program.cover_image || '',
                                  external_link: program.external_link || ''
                                });
                                setPerksTags(program.perks || []);
                                setValuesTags(program.eligibility_criteria.values || []);
                                setTagsTags(program.tags || []);
                                setUploadedImageUrl('');
                                setShowCreateGrantProgram(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="ml-2"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this grant program?')) {
                                  try {
                                    await deleteGrantProgram(program._id);
                                    setGrantPrograms(programs => programs.filter(p => p._id !== program._id));
                                    toast({ title: 'Program deleted', description: 'Grant program has been deleted.' });
                                  } catch {
                                    toast({ title: 'Delete failed', description: 'Could not delete grant program.', variant: 'destructive' });
                                  }
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Create Grant Program Modal */}
              {showCreateGrantProgram && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-0 min-w-[320px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="px-8 pt-8 pb-0 border-b border-amber-100">
                      <h3 className="text-lg font-bold mb-4">{editingGrantProgram ? 'Edit Grant Program' : 'New Grant Program'}</h3>
                    </div>
                    <div className="px-8 py-4">
                      <form onSubmit={grantProgramForm.handleSubmit(handleCreateGrantProgram)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title *</label>
                            <input {...grantProgramForm.register('title', { required: true })} className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Subtitle</label>
                            <input {...grantProgramForm.register('subtitle')} className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description *</label>
                          <textarea {...grantProgramForm.register('description', { required: true })} rows={4} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Grant Amount *</label>
                            <input {...grantProgramForm.register('grant_amount', { required: true })} type="number" min="0" className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Currency</label>
                            <select {...grantProgramForm.register('currency')} className="w-full border rounded px-3 py-2">
                              <option value="USD">USD</option>
                              <option value="INR">INR</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Total Projects Funded *</label>
                            <input {...grantProgramForm.register('total_projects_funded', { required: true })} type="number" min="1" className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select {...grantProgramForm.register('status')} className="w-full border rounded px-3 py-2">
                              <option value="active">Active</option>
                              <option value="draft">Draft</option>
                              <option value="closed">Closed</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Disbursement Phases</label>
                            <input {...grantProgramForm.register('disbursement_phases', { required: true })} type="number" min="1" className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Perks</label>
                          <TagInput value={perksTags} onChange={setPerksTags} placeholder="Add perks (press Enter)" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Women Leadership % *</label>
                            <input {...grantProgramForm.register('eligibility_criteria.women_leadership_percentage', { required: true })} type="number" min="0" max="100" className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Progress Duration (months) *</label>
                            <input {...grantProgramForm.register('eligibility_criteria.progress_duration_months', { required: true })} type="number" min="0" className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Values</label>
                          <TagInput value={valuesTags} onChange={setValuesTags} placeholder="Add values (press Enter)" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Applications Open *</label>
                            <input {...grantProgramForm.register('important_dates.applications_open', { required: true })} type="date" className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Deadline *</label>
                            <input {...grantProgramForm.register('important_dates.deadline', { required: true })} type="date" className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Winners Announced *</label>
                            <input {...grantProgramForm.register('important_dates.winners_announced', { required: true })} type="date" className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tags</label>
                          <TagInput value={tagsTags} onChange={setTagsTags} placeholder="Add tags (press Enter)" />
                        </div>
                        <div>
                          <ImageUpload
                            onImageUpload={setUploadedImageUrl}
                            currentImageUrl={grantProgramForm.watch('cover_image')}
                            label="Cover Image"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">External Link *</label>
                          <input {...grantProgramForm.register('external_link')} type="url" required className="w-full border rounded px-3 py-2" />
                        </div>
                        {createError && <div className="text-red-600 text-sm">{createError}</div>}
                        <div className="flex gap-2 justify-end">
                          <Button type="button" variant="outline" onClick={() => {
                            setShowCreateGrantProgram(false);
                            setEditingGrantProgram(null);
                            grantProgramForm.reset();
                            setPerksTags([]);
                            setValuesTags([]);
                            setTagsTags([]);
                            setUploadedImageUrl('');
                          }} disabled={creating}>Cancel</Button>
                          <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={creating}>{creating ? (editingGrantProgram ? 'Updating...' : 'Creating...') : (editingGrantProgram ? 'Update' : 'Create')}</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'grant-applications' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Grant Applications Management</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={grantApplicationsFilter}
                    onChange={(e) => setGrantApplicationsFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Applications</option>
                    <option value="submitted">Submitted</option>
                    <option value="in-review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-gray-600">
                {/* Summary Stats */}
                {grantApplications.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{grantApplications.filter(app => app.status === 'submitted').length}</div>
                      <div className="text-sm text-gray-600">Submitted</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{grantApplications.filter(app => app.status === 'in-review').length}</div>
                      <div className="text-sm text-gray-600">In Review</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">{grantApplications.filter(app => app.status === 'approved').length}</div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">{grantApplications.filter(app => app.status === 'rejected').length}</div>
                      <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                  </div>
                )}
                
                {grantApplicationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <span className="ml-3">Loading grant applications...</span>
                  </div>
                ) : grantApplicationsError ? (
                  <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-red-600">⚠️</span>
                      <span className="ml-2">{grantApplicationsError}</span>
                    </div>
                  </div>
                ) : grantApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Grant Applications Yet</h3>
                    <p className="text-gray-500">Grant applications will appear here once users start applying.</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
                    {grantApplications
                      .filter(app => grantApplicationsFilter === 'all' || app.status === grantApplicationsFilter)
                      .map((application, index) => (
                      <div key={application._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                  #{grantApplications.length - index}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  application.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                                  application.status === 'in-review' ? 'bg-yellow-100 text-yellow-700' :
                                  application.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                                {application.project_id?.title || 'Project Title Not Available'}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 ml-3">
                              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                {new Date(application.submitted_date || application.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Applicant:</span>
                              <div className="text-gray-900">{application.applicant_id?.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">@{application.applicant_id?.username || 'unknown'}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Grant Program:</span>
                              <div className="text-gray-900">{application.grant_program_id?.title || 'Unknown Program'}</div>
                              <div className="text-xs text-gray-500">
                                {application.grant_program_id?.currency} {application.grant_program_id?.grant_amount?.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Women Leadership:</span>
                              <div className="text-gray-900">{application.women_leadership_percentage}%</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Progress Duration:</span>
                              <div className="text-gray-900">{application.progress_duration_months} months</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Working Prototype:</span>
                              <div className="text-gray-900">{application.working_prototype ? 'Yes' : 'No'}</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Proposal Preview:</span>
                            <div className="text-gray-600 text-sm mt-1 line-clamp-3 bg-gray-50 p-3 rounded">
                              {application.proposal || 'No proposal available'}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span>👤</span>
                                <span>{application.applicant_id?.name || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>📅</span>
                                <span>{new Date(application.submitted_date || application.created_at).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowApplicationDialog(true);
                                  if (application.project_id?._id || application.project_id) fetchProjectDetails(application.project_id?._id || application.project_id);
                                }}
                              >
                                View Details
                              </Button>
                              {(application.project_id?._id || (typeof application.project_id === 'string' && application.project_id)) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2"
                                  onClick={() => {
                                    const pid = application.project_id?._id || application.project_id;
                                    navigate(`/projects/${pid}`);
                                  }}
                                >
                                  View Project
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grant Application Detail Dialog */}
          {showApplicationDialog && selectedApplication && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-0 min-w-[320px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-8 pt-8 pb-0 border-b border-amber-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold mb-4">View Application</h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setShowApplicationDialog(false);
                        setSelectedApplication(null);
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <div className="space-y-6">
                    {/* Header Section */}
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-semibold text-amber-800">
                          {selectedApplication.project_id?.title || 'Project Title Not Available'}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedApplication.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                          selectedApplication.status === 'in-review' ? 'bg-yellow-100 text-yellow-700' :
                          selectedApplication.status === 'approved' ? 'bg-green-100 text-green-700' :
                          selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Applicant:</span>
                          <div className="text-gray-900">{selectedApplication.applicant_id?.name || 'Unknown'}</div>
                          <div className="text-gray-500">@{selectedApplication.applicant_id?.username || 'unknown'}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Grant Program:</span>
                          <div className="text-gray-900">{selectedApplication.grant_program_id?.title || 'Unknown Program'}</div>
                          <div className="text-gray-500">
                            {selectedApplication.grant_program_id?.currency} {selectedApplication.grant_program_id?.grant_amount?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-gray-700">
                        <div>Submitted: {new Date(selectedApplication.submitted_date || selectedApplication.createdAt).toLocaleDateString()}</div>
                        <div>Women Leadership: {selectedApplication.women_leadership_percentage}%</div>
                        <div>Progress Duration: {selectedApplication.progress_duration_months} months</div>
                        <div>Working Prototype: {selectedApplication.working_prototype ? 'Yes' : 'No'}</div>
                      </div>
                    </div>

                    {/* Proposal Section */}
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Proposal</h5>
                      <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.proposal || 'No proposal available'}</div>
                    </div>
                    {selectedApplication.budget_breakdown && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Budget Breakdown</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.budget_breakdown}</div>
                      </div>
                    )}
                    {selectedApplication.timeline && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Timeline</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.timeline}</div>
                      </div>
                    )}
                    {selectedApplication.expected_impact && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Expected Impact</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.expected_impact}</div>
                      </div>
                    )}
                    {selectedApplication.team_details && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Team Details</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.team_details}</div>
                      </div>
                    )}
                    {selectedApplication.project_overview && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Project Overview</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.project_overview}</div>
                      </div>
                    )}
                    {selectedApplication.roadmap && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Roadmap</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.roadmap}</div>
                      </div>
                    )}
                    {selectedApplication.vision_impact && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Vision & Impact</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.vision_impact}</div>
                      </div>
                    )}
                    {selectedApplication.why_grant && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Why This Grant</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.why_grant}</div>
                      </div>
                    )}
                    {(selectedApplication.pitch_video_url || selectedApplication.presentation_url || selectedApplication.demo_video_url) && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Media Links</h5>
                        <div className="space-y-2">
                          {selectedApplication.pitch_video_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Pitch Video:</span>
                              <a href={selectedApplication.pitch_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Video</a>
                            </div>
                          )}
                          {selectedApplication.presentation_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Presentation:</span>
                              <a href={selectedApplication.presentation_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Presentation</a>
                            </div>
                          )}
                          {selectedApplication.demo_video_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Demo Video:</span>
                              <a href={selectedApplication.demo_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Demo</a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedApplication.additional_materials && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Additional Materials</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.additional_materials}</div>
                      </div>
                    )}
                    {selectedApplication.review_notes && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Review Notes</h5>
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selectedApplication.review_notes}</div>
                      </div>
                    )}
                  </div>
                </div>
                {/* {projectLoading ? (
                  <div className="py-8 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div><span className="ml-3">Loading project details...</span></div>
                ) : selectedProject ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-bold mb-4 text-amber-800">Project Details</h4>
                    <Card className="mb-4 border border-gray-100">
                      <CardHeader>
                        <CardTitle className="text-xl font-martian">{selectedProject.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Description:</span> {selectedProject.description}</div>
                        {selectedProject.objectives && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Objectives:</span> {selectedProject.objectives}</div>}
                        {selectedProject.impact && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Expected Impact:</span> {selectedProject.impact}</div>}
                        {selectedProject.challenges && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Challenges:</span> {selectedProject.challenges}</div>}
                        {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                          <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Tech Stack:</span> {selectedProject.tech_stack.join(', ')}</div>
                        )}
                        {selectedProject.tags && selectedProject.tags.length > 0 && (
                          <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Tags:</span> {selectedProject.tags.join(', ')}</div>
                        )}
                        <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Category:</span> {selectedProject.category}</div>
                        <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Status:</span> {selectedProject.status}</div>
                        <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Team Size:</span> {selectedProject.teamSize || 1}</div>
                        {selectedProject.startDate && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Start Date:</span> {selectedProject.startDate}</div>}
                        {selectedProject.endDate && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">End Date:</span> {selectedProject.endDate}</div>}
                        {selectedProject.budget && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Budget:</span> {selectedProject.budget}</div>}
                        {selectedProject.website && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Website:</span> <a href={selectedProject.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{selectedProject.website}</a></div>}
                        {selectedProject.github && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">GitHub:</span> <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{selectedProject.github}</a></div>}
                        {selectedProject.linkedin && <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">LinkedIn:</span> <a href={selectedProject.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{selectedProject.linkedin}</a></div>}
                        {selectedProject.media && selectedProject.media.images && selectedProject.media.images.length > 0 && (
                          <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Images:</span> {selectedProject.media.images.map((img: string, idx: number) => <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">Image {idx+1}</a>)}</div>
                        )}
                        {selectedProject.media && selectedProject.media.videos && selectedProject.media.videos.length > 0 && (
                          <div className="mb-2 text-gray-700 font-inter"><span className="font-semibold">Videos:</span> {selectedProject.media.videos.map((vid: string, idx: number) => <a key={idx} href={vid} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">Video {idx+1}</a>)}</div>
                        )}
                      </CardContent>
                    </Card>
                    {selectedProject && selectedProject._id && (
                      <div className="flex justify-end mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/projects/${selectedProject._id}`)}
                        >
                          View Full Project
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-8">No project details available.</div>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Admin; 