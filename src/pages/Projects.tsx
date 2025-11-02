/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Calendar, MapPin, Users, Target, ArrowLeft } from 'lucide-react';
import { api, getUserProjects } from '@/lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  visibility: 'public' | 'private';
  tags: string[];
  location: string;
  teamSize: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  console.log('Username from params:', username);
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const currentUser = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        sortBy,
        sortOrder: 'desc'
      });

      let response;
      if (username) {
        console.log('Fetching projects for username:', username);
        // Fetch user-specific projects
        response = await getUserProjects(username, params);
        console.log('User projects response:', response.data);
        // Also fetch user profile for display
        try {
          const profileResponse = await api.get(`/profile/${username}`);
          setUserProfile(profileResponse.data.user);
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
      } else {
        console.log('Fetching all projects');
        // Fetch all projects
        response = await api.get(`/projects?${params}`);
      }
      
      // Map builder_id to user for compatibility
      const projects = response.data.projects.map((p: any) => ({
        ...p,
        user: p.builder_id
      }));
      setProjects(projects);
      setTotalPages(response.data.pagination?.pages || response.data.totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Content */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Project Actions Section */}
          {!username && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              {isLoggedIn && (
                <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter" onClick={handleCreateProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start a Project
                </Button>
              )}
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 px-8 py-3 text-base font-medium font-inter" onClick={() => navigate('/community')}>
                Explore Community
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            {username && userProfile && (
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(`/${username}`)}
                  className="mb-4 text-gray-600 hover:text-gray-900 font-inter"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Portfolio
                </Button>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {userProfile.profile_picture && (
                    <img 
                      src={userProfile.profile_picture} 
                      alt={userProfile.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-200"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 font-inter">
                      {userProfile.name || userProfile.username}
                    </h2>
                    <p className="text-gray-600 font-inter">@{userProfile.username}</p>
                  </div>
                </div>
              </div>
            )}
            <h1 className="text-6xl md:text-7xl font-light mb-8 text-gray-900 leading-tight font-martian">
              {username ? `${userProfile?.name || username}'s Projects` : 'Projects'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-inter font-light">
              {username 
                ? `Discover and explore innovation projects by ${userProfile?.name || username}`
                : 'Discover and explore innovation projects from our community'
              }
            </p>
            {!isLoggedIn && !username && (
              <Button 
                onClick={handleCreateProject}
                className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="social-impact">Social Impact</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSortBy('updatedAt');
                }}
                className="flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms.'
                  : username 
                    ? `${userProfile?.name || username} hasn't shared any projects yet.`
                    : 'Start by creating your first project to showcase your innovation.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && !username && (
                <Button 
                  onClick={handleCreateProject}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card 
                  key={project._id} 
                  className="group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer bg-white border border-gray-100 hover:border-gray-200 relative overflow-hidden hover:-translate-y-1"
                  onClick={() => handleViewProject(project._id)}
                >
                  {/* Edit button for owner */}
                  {currentUser && project.user && currentUser._id === project.user._id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4 z-10 font-inter opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/projects/${project._id}/edit`);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  
                  <CardHeader className="pb-4 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <CardTitle className="text-xl font-semibold line-clamp-2 font-inter text-gray-900 group-hover:text-amber-800 transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge className={`${getStatusColor(project.status)} font-medium shrink-0`}>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3 font-inter text-gray-600 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Project Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 font-inter">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium">{project.location || 'Remote'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 font-inter">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium">{project.teamSize} team member{project.teamSize !== 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 font-inter">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium">Started {formatDate(project.startDate)}</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    {project.category && (
                      <div className="pt-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </Badge>
                      </div>
                    )}

                    {/* Tags */}
                    {project.tags.length > 0 && (
                      <div className="pt-2 border-t border-gray-50">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Author Info */}
                    {project.user && (
                      <div className="pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-800">
                              {project.user.name ? project.user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.user.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">@{project.user.username || 'user'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="font-inter"
                >
                  Previous
                </Button>
                
                <div className="flex items-center px-4">
                  <span className="text-sm text-gray-600 font-inter">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="font-inter"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects; 