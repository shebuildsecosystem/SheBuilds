import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Users, Globe, Github, Linkedin, Target, Zap, Award } from 'lucide-react';
import { api, getUserProfile } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// FIX: Updated interface to exactly match the API response structure
interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  is_public: boolean;
  tags: string[];
  location: string;
  teamSize: number;
  startDate: string;
  endDate?: string;
  objectives: string;
  challenges: string;
  impact: string;
  tech_stack: string[];
  budget: number;
  website?: string;
  github?: string;
  linkedin?: string;
  media?: {
    images: string[];
    videos: string[];
    demos: string[];
    youtube_links: string[];
    pdf_links: string[];
  };
  createdAt: string;
  updatedAt: string;
  builder_id: {
    _id: string;
    name: string;
    username: string;
    profile_picture?: string;
    portfolio_slug?: string;
  };
}

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${projectId}`);
      const projectData = response.data.project || response.data;
      setProject(projectData);

      if (isLoggedIn && projectData.builder_id?._id) {
        try {
          const currentUserRes = await getUserProfile();
          const currentUserId = currentUserRes.data._id;
          setIsOwner(currentUserId === projectData.builder_id._id);
        } catch (authError) {
          console.error("Could not verify user ownership:", authError);
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
      
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project. Please try again.",
        variant: "destructive",
      });
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    try {
      setDeleting(true);
      await api.delete(`/projects/${project._id}`);
      
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
      
      navigate('/projects');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
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
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "Date not specified";
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLocation = (location: string) => {
    if (!location) return 'No location specified';
    
    // Check if it's an Indian location
    if (location.includes(', India')) {
      const parts = location.split(', ');
      if (parts.length >= 3) {
        // Format: "City, State, India"
        const city = parts[0];
        const state = parts[1];
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{city}</span>
            <span className="text-sm text-gray-600">{state}, India</span>
          </div>
        );
      } else if (parts.length === 2) {
        // Format: "City, India"
        const city = parts[0];
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{city}</span>
            <span className="text-sm text-gray-600">India</span>
          </div>
        );
      }
    }
    
    // For other locations, return as is
    return <span className="font-medium text-gray-900">{location}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4 font-martian">Project Not Found</h1>
            <p className="text-lg text-gray-600 mb-8 font-inter">The project you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate('/projects')}
              className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter"
            >
              Back to Projects
            </Button>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
              className="mb-6 text-gray-600 hover:text-gray-900 font-inter"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-6xl md:text-7xl font-light mb-4 text-gray-900 leading-tight font-martian">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {project.category
                      ? project.category.charAt(0).toUpperCase() + project.category.slice(1).replace('-', ' ')
                      : "Uncategorized"}
                  </Badge>
                  {/* FIX: Handle is_public boolean from API */}
                  {project.is_public === false && (
                    <Badge variant="outline">Private</Badge>
                  )}
                </div>
              </div>
              
              {isOwner && (
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/projects/${project._id}/edit`)}
                    className="font-inter"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 font-inter">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{project.title}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteProject}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete Project'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-2xl font-martian">About This Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-inter leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Objectives */}
              {project.objectives && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-2xl font-martian flex items-center">
                      <Target className="w-6 h-6 mr-2" />
                      Project Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-inter leading-relaxed">
                      {project.objectives}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Challenges */}
              {project.challenges && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-2xl font-martian flex items-center">
                      <Zap className="w-6 h-6 mr-2" />
                      Challenges & Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-inter leading-relaxed">
                      {project.challenges}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Impact */}
              {project.impact && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-2xl font-martian flex items-center">
                      <Award className="w-6 h-6 mr-2" />
                      Expected Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-inter leading-relaxed">
                      {project.impact}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl font-martian">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start text-sm font-inter">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      {formatLocation(project.location)}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 font-inter">
                    <Users className="w-4 h-4 mr-2" />
                    {project.teamSize || 1} team member{project.teamSize !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 font-inter">
                    <Calendar className="w-4 h-4 mr-2" />
                    {project.startDate ? `Started ${formatDate(project.startDate)}` : 'Start date not specified'}
                  </div>
                  
                  {project.endDate && (
                    <div className="flex items-center text-sm text-gray-600 font-inter">
                      <Calendar className="w-4 h-4 mr-2" />
                      Ended {formatDate(project.endDate)}
                    </div>
                  )}
                  
                  {project.budget > 0 && (
                    <div className="flex items-center text-sm text-gray-600 font-inter">
                      <span className="font-semibold">Budget:</span>
                      <span className="ml-2">{formatCurrency(project.budget)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* FIX: Changed technologies to tech_stack */}
              {(project.tech_stack?.length ?? 0) > 0 && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-martian">Tech Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="font-inter">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {(project.tags?.length ?? 0) > 0 && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-martian">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="font-inter">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Links */}
              {(project.website || project.github || project.linkedin) && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-martian">Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.website && (
                      <a 
                        href={project.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-inter"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-inter"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    )}
                    {project.linkedin && (
                      <a 
                        href={project.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-inter"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Media */}
              {project.media && (project.media.youtube_links?.length > 0 || project.media.pdf_links?.length > 0) && (
                <Card className="border border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-xl font-martian">Media & Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* YouTube Videos */}
                    {project.media.youtube_links?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 font-inter mb-2">YouTube Videos</h4>
                        <div className="space-y-2">
                          {project.media.youtube_links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-red-600 hover:text-red-800 font-inter"
                            >
                              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              Watch Video {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PDF Documents */}
                    {project.media.pdf_links?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 font-inter mb-2">PDF Documents</h4>
                        <div className="space-y-2">
                          {project.media.pdf_links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-inter"
                            >
                              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                              </svg>
                              View Document {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Creator Info */}
              <Card className="border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl font-martian">Created by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    {/* FIX: Display creator's avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={project.builder_id.profile_picture} alt={project.builder_id.name} />
                      <AvatarFallback>{project.builder_id.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      {/* FIX: Link to creator's public profile */}
                      <a 
                        href={project.builder_id.portfolio_slug ? `/${project.builder_id.portfolio_slug}` : '#'} 
                        className="font-semibold text-gray-900 font-inter hover:underline"
                      >
                        {project.builder_id.name}
                      </a>
                      <p className="text-sm text-gray-600 font-inter">@{project.builder_id.username}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;