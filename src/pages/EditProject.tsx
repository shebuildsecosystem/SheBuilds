import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { api, getUserProfile } from '@/lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

interface EditProjectForm {
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
  objectives: string;
  challenges: string;
  impact: string;
  technologies: string[];
  budget: number;
  website?: string;
  github?: string;
  linkedin?: string;
  media: {
    images: string[];
    videos: string[];
    demos: string[];
    youtube_links: string[];
    pdf_links: string[];
  };
}

const EditProject: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const [formData, setFormData] = useState<EditProjectForm | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newYoutubeLink, setNewYoutubeLink] = useState('');
  const [newPdfLink, setNewPdfLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    'technology',
    'healthcare',
    'education',
    'environment',
    'social-impact',
    'business',
    'other'
  ];

  const locations = [
 
    'Mumbai, Maharashtra, India',
    'Delhi, India',
    'Bangalore, Karnataka, India',
    'Hyderabad, Telangana, India',
    'Chennai, Tamil Nadu, India',
    'Kolkata, West Bengal, India',
    'Pune, Maharashtra, India',
    'Ahmedabad, Gujarat, India',
    'Jaipur, Rajasthan, India',
    'Surat, Gujarat, India',
    'Lucknow, Uttar Pradesh, India',
    'Kanpur, Uttar Pradesh, India',
    'Nagpur, Maharashtra, India',
    'Indore, Madhya Pradesh, India',
    'Thane, Maharashtra, India',
    'Bhopal, Madhya Pradesh, India',
    'Visakhapatnam, Andhra Pradesh, India',
    'Pimpri-Chinchwad, Maharashtra, India',
    'Patna, Bihar, India',
    'Vadodara, Gujarat, India',
    'Ghaziabad, Uttar Pradesh, India',
    'Ludhiana, Punjab, India',
    'Agra, Uttar Pradesh, India',
    'Nashik, Maharashtra, India',
    'Faridabad, Haryana, India',
    'Meerut, Uttar Pradesh, India',
    'Rajkot, Gujarat, India',
    'Kalyan-Dombivali, Maharashtra, India',
    'Vasai-Virar, Maharashtra, India',
    'Varanasi, Uttar Pradesh, India',
    'Srinagar, Jammu & Kashmir, India',
    'Aurangabad, Maharashtra, India',
    'Dhanbad, Jharkhand, India',
    'Amritsar, Punjab, India',
    'Allahabad, Uttar Pradesh, India',
    'Ranchi, Jharkhand, India',
    'Howrah, West Bengal, India',
    'Coimbatore, Tamil Nadu, India',
    'Jabalpur, Madhya Pradesh, India',
    'Gwalior, Madhya Pradesh, India',
    'Vijayawada, Andhra Pradesh, India',
    'Jodhpur, Rajasthan, India',
    'Madurai, Tamil Nadu, India',
    'Raipur, Chhattisgarh, India',
    'Kota, Rajasthan, India',
    'Guwahati, Assam, India',
    'Chandigarh, India',
    'Solapur, Maharashtra, India',
    'Hubli-Dharwad, Karnataka, India',
    'Bareilly, Uttar Pradesh, India',
    'Moradabad, Uttar Pradesh, India',
    'Mysore, Karnataka, India',
    'Gurgaon, Haryana, India',
    'Aligarh, Uttar Pradesh, India',
    'Jalandhar, Punjab, India',
    'Tiruchirappalli, Tamil Nadu, India',
    'Bhubaneswar, Odisha, India',
    'Salem, Tamil Nadu, India',
    'Warangal, Telangana, India',
    'Guntur, Andhra Pradesh, India',
    'Bhiwandi, Maharashtra, India',
    'Saharanpur, Uttar Pradesh, India',
    'Gorakhpur, Uttar Pradesh, India',
    'Bikaner, Rajasthan, India',
    'Amravati, Maharashtra, India',
    'Noida, Uttar Pradesh, India',
    'Jamshedpur, Jharkhand, India',
    'Bhilai, Chhattisgarh, India',
    'Cuttack, Odisha, India',
    'Firozabad, Uttar Pradesh, India',
    'Kochi, Kerala, India',
    'Nellore, Andhra Pradesh, India',
    'Bhavnagar, Gujarat, India',
    'Dehradun, Uttarakhand, India',
    'Durgapur, West Bengal, India',
    'Asansol, West Bengal, India',
    'Rourkela, Odisha, India',
    'Nanded, Maharashtra, India',
    'Kolhapur, Maharashtra, India',
    'Ajmer, Rajasthan, India',
    'Akola, Maharashtra, India',
    'Gulbarga, Karnataka, India',
    'Jamnagar, Gujarat, India',
    'Ujjain, Madhya Pradesh, India',
    'Loni, Uttar Pradesh, India',
    'Siliguri, West Bengal, India',
    'Jhansi, Uttar Pradesh, India',
    'Ulhasnagar, Maharashtra, India',
    'Jammu, Jammu & Kashmir, India',
    'Sangli-Miraj & Kupwad, Maharashtra, India',
    'Mangalore, Karnataka, India',
    'Erode, Tamil Nadu, India',
    'Belgaum, Karnataka, India',
    'Ambattur, Tamil Nadu, India',
    'Tirunelveli, Tamil Nadu, India',
    'Malegaon, Maharashtra, India',
    'Gaya, Bihar, India',
    'Jalgaon, Maharashtra, India',
    'Udaipur, Rajasthan, India',
    'Maheshtala, West Bengal, India',
    'Tirupur, Tamil Nadu, India',
    'Davanagere, Karnataka, India',
    'Kozhikode, Kerala, India',
    'Akbarpur, Uttar Pradesh, India',
    'Kurnool, Andhra Pradesh, India',
    'Bokaro Steel City, Jharkhand, India',
    'Rajpur Sonarpur, West Bengal, India',
    'Bhatpara, West Bengal, India',
    'Pimpri, Maharashtra, India',
    'Parbhani, Maharashtra, India',
    'Patiala, Punjab, India',
    'Bhilwara, Rajasthan, India',
    'Panipat, Haryana, India',
    'Darbhanga, Bihar, India',
    'Bally, West Bengal, India',
    'Aizawl, Mizoram, India',
    'Dewas, Madhya Pradesh, India',
    'Ichalkaranji, Maharashtra, India',
    'Karnal, Haryana, India',
    'Bathinda, Punjab, India',
    'Jalna, Maharashtra, India',
    'Eluru, Andhra Pradesh, India',
    'Barasat, West Bengal, India',
    'Kirari Suleman Nagar, Delhi, India',
    'Purnia, Bihar, India',
    'Satna, Madhya Pradesh, India',
    'Mau, Uttar Pradesh, India',
    'Sonipat, Haryana, India',
    'Farrukhabad, Uttar Pradesh, India',
    'Sagar, Madhya Pradesh, India',
    'Rourkela, Odisha, India',
    'Durg, Chhattisgarh, India',
    'Imphal, Manipur, India',
    'Ratlam, Madhya Pradesh, India',
    'Hapur, Uttar Pradesh, India',
    'Anantapur, Andhra Pradesh, India',
    'Arrah, Bihar, India',
    'Karimnagar, Telangana, India',
    'Etawah, Uttar Pradesh, India',
    'Ambernath, Maharashtra, India',
    'North Dumdum, West Bengal, India',
    'Bharatpur, Rajasthan, India',
    'Begusarai, Bihar, India',
    'New Delhi, Delhi, India',
    'Gandhidham, Gujarat, India',
    'Baranagar, West Bengal, India',
    'Tiruvottiyur, Tamil Nadu, India',
    'Puducherry, Puducherry, India',
    'Sikar, Rajasthan, India',
    'Thoothukkudi, Tamil Nadu, India',
    'Rewa, Madhya Pradesh, India',
    'Mirzapur, Uttar Pradesh, India',
    'Raichur, Karnataka, India',
    'Pali, Rajasthan, India',
    'Ramagundam, Telangana, India',
    'Haridwar, Uttarakhand, India',
    'Vijayanagaram, Andhra Pradesh, India',
    'Katihar, Bihar, India',
    'Nagercoil, Tamil Nadu, India',
    'Sri Ganganagar, Rajasthan, India',
    'Karawal Nagar, Delhi, India',
    'Mango, Jharkhand, India',
    'Thanjavur, Tamil Nadu, India',
    'Bulandshahr, Uttar Pradesh, India',
    'Uluberia, West Bengal, India',
    'Murwara, Madhya Pradesh, India',
    'Sambhal, Uttar Pradesh, India',
    'Singrauli, Madhya Pradesh, India',
    'Nadiad, Gujarat, India',
    'Secunderabad, Telangana, India',
    'Naihati, West Bengal, India',
    'Yamunanagar, Haryana, India',
    'Bidhan Nagar, West Bengal, India',
    'Pallavaram, Tamil Nadu, India',
    'Bidar, Karnataka, India',
    'Munger, Bihar, India',
    'Panchkula, Haryana, India',
    'Burhanpur, Madhya Pradesh, India',
    'Raurkela Industrial Township, Odisha, India',
    'Kharagpur, West Bengal, India',
    'Dindigul, Tamil Nadu, India',
    'Gandhinagar, Gujarat, India',
    'Hospet, Karnataka, India',
    'Nangloi Jat, Delhi, India',
    'Malda, West Bengal, India',
    'Ongole, Andhra Pradesh, India',
    'Deoghar, Jharkhand, India',
    'Chapra, Bihar, India',
    'Haldia, West Bengal, India',
    'Khandwa, Madhya Pradesh, India',
    'Nandyal, Andhra Pradesh, India',
    'Chittoor, Andhra Pradesh, India',
    'Morena, Madhya Pradesh, India',
    'Amroha, Uttar Pradesh, India',
    'Anand, Gujarat, India',
    'Bhind, Madhya Pradesh, India',
    'Bhalswa Jahangir Pur, Delhi, India',
    'Madhyamgram, West Bengal, India',
    'Bhiwani, Haryana, India',
    'Berhampore, West Bengal, India',
    'Ambala, Haryana, India',
    'Fatehpur, Uttar Pradesh, India',
    'Mira Bhayandar, Maharashtra, India',
    'Raebareli, Uttar Pradesh, India',
    'Jorhat, Assam, India',
    'Alappuzha, Kerala, India',
    'Bahraich, Uttar Pradesh, India',
    'Phusro, Jharkhand, India',
    'Vellore, Tamil Nadu, India',
    'Mehsana, Gujarat, India',
    'Jalpaiguri, West Bengal, India',
    'Bharuch, Gujarat, India',
    'Auraiya, Uttar Pradesh, India',
    'Bulandshahr, Uttar Pradesh, India',
    'Nalgonda, Telangana, India',
    'Baran, Rajasthan, India',
    'Tirupati, Andhra Pradesh, India',
    'Kamarhati, West Bengal, India',
    'Sasaram, Bihar, India',
    'Hajipur, Bihar, India',
    'Bhagalpur, Bihar, India',
    'Adityapur, Jharkhand, India',
    'Alwar, Rajasthan, India',
    'Tadepalligudem, Andhra Pradesh, India',
    'Satara, Maharashtra, India',
    'Latur, Maharashtra, India',
    'Hazaribagh, Jharkhand, India',
    'Kishanganj, Bihar, India',
    'Nagaon, Assam, India',
    'Sasaram, Bihar, India',
    'Hajipur, Bihar, India',
    'Bhagalpur, Bihar, India',
    'Adityapur, Jharkhand, India',
    'Alwar, Rajasthan, India',
    'Tadepalligudem, Andhra Pradesh, India',
    'Satara, Maharashtra, India',
    'Latur, Maharashtra, India',
    'Hazaribagh, Jharkhand, India',
    'Kishanganj, Bihar, India',
    'Nagaon, Assam, India',
    'Other'
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${projectId}`);
        const project = response.data.project || response.data;

        // --- FIX: Client-side authorization check ---
        if (isLoggedIn) {
          const currentUserRes = await getUserProfile();
          if (project.builder_id?._id !== currentUserRes.data._id) {
            toast({
              title: 'Unauthorized',
              description: "You don't have permission to edit this project.",
              variant: 'destructive',
            });
            navigate('/projects');
            return;
          }
        }
        
        setFormData({
          title: project.title || '',
          description: project.description || '',
          category: project.category || '',
          status: project.status || 'draft',
          visibility: project.visibility || 'public',
          tags: project.tags || [],
          location: project.location || '',
          teamSize: project.teamSize || 1,
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
          objectives: project.objectives || '',
          challenges: project.challenges || '',
          impact: project.impact || '',
          technologies: project.technologies || [],
          budget: project.budget || 0,
          website: project.website || '',
          github: project.github || '',
          linkedin: project.linkedin || '',
          media: project.media || {
            images: [],
            videos: [],
            demos: [],
            youtube_links: [],
            pdf_links: []
          },
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load project for editing.',
          variant: 'destructive',
        });
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchProject();
  }, [projectId, navigate, isLoggedIn]);

  const handleInputChange = (field: keyof EditProjectForm, value: any) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : prev);
  };

  const handleAddTag = () => {
    if (formData && newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (formData) {
      handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    }
  };

  const handleAddTechnology = () => {
    if (formData && newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      handleInputChange('technologies', [...formData.technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    if (formData) {
      handleInputChange('technologies', formData.technologies.filter(tech => tech !== techToRemove));
    }
  };

  const handleAddYoutubeLink = () => {
    if (formData && newYoutubeLink.trim() && !formData.media.youtube_links.includes(newYoutubeLink.trim())) {
      const updatedMedia = {
        ...formData.media,
        youtube_links: [...formData.media.youtube_links, newYoutubeLink.trim()]
      };
      handleInputChange('media', updatedMedia);
      setNewYoutubeLink('');
    }
  };

  const handleRemoveYoutubeLink = (linkToRemove: string) => {
    if (formData) {
      const updatedMedia = {
        ...formData.media,
        youtube_links: formData.media.youtube_links.filter(link => link !== linkToRemove)
      };
      handleInputChange('media', updatedMedia);
    }
  };

  const handleAddPdfLink = () => {
    if (formData && newPdfLink.trim() && !formData.media.pdf_links.includes(newPdfLink.trim())) {
      const updatedMedia = {
        ...formData.media,
        pdf_links: [...formData.media.pdf_links, newPdfLink.trim()]
      };
      handleInputChange('media', updatedMedia);
      setNewPdfLink('');
    }
  };

  const handleRemovePdfLink = (linkToRemove: string) => {
    if (formData) {
      const updatedMedia = {
        ...formData.media,
        pdf_links: formData.media.pdf_links.filter(link => link !== linkToRemove)
      };
      handleInputChange('media', updatedMedia);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    try {
      setSaving(true);
      
      // Map frontend form data to backend API format
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        tech_stack: formData.technologies, // Map technologies to tech_stack
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        teamSize: formData.teamSize,
        budget: formData.budget,
        objectives: formData.objectives,
        challenges: formData.challenges,
        impact: formData.impact,
        website: formData.website,
        github: formData.github,
        linkedin: formData.linkedin,
        is_public: formData.visibility === 'public', // Map visibility to is_public
        is_grant_eligible: false, // Default value
        media: formData.media
      };

      await api.put(`/projects/${projectId}`, projectData);
      toast({
        title: 'Success',
        description: 'Project updated successfully!',
      });
      navigate(`/projects/${projectId}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4 font-martian">Sign in Required</h1>
            <p className="text-lg text-gray-600 mb-8 font-inter">You need to be signed in to edit a project.</p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !formData) {
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
              onClick={() => navigate(`/projects/${projectId}`)}
              className="mb-6 text-gray-600 hover:text-gray-900 font-inter"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
            <h1 className="text-6xl md:text-7xl font-light mb-8 text-gray-900 leading-tight font-martian">
              Edit Project
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl font-inter font-light">
              Update your project details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-martian">Basic Information</CardTitle>
                <CardDescription className="font-inter">Edit your project information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-inter">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter your project title"
                      className="font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-inter">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="font-inter">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-inter">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project in detail..."
                    rows={4}
                    className="font-inter"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-inter">Location</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSize" className="font-inter">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      min="1"
                      value={formData.teamSize}
                      onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                      className="font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="font-inter">Budget (USD)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                      placeholder="0"
                      className="font-inter"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="font-inter">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="font-inter">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="font-inter"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tags and Technologies */}
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-martian">Tags & Technologies</CardTitle>
                <CardDescription className="font-inter">Edit tags and technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-inter">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="font-inter">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="font-inter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline" className="font-inter">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-inter">Technologies Used</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="font-inter">
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Add a technology..."
                      className="font-inter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                    />
                    <Button type="button" onClick={handleAddTechnology} variant="outline" className="font-inter">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Project Details */}
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-martian">Project Details</CardTitle>
                <CardDescription className="font-inter">Edit project goals and impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="objectives" className="font-inter">Project Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    placeholder="What are the main goals of your project?"
                    rows={3}
                    className="font-inter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenges" className="font-inter">Challenges & Solutions</Label>
                  <Textarea
                    id="challenges"
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    placeholder="What challenges did you face and how did you solve them?"
                    rows={3}
                    className="font-inter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact" className="font-inter">Expected Impact</Label>
                  <Textarea
                    id="impact"
                    value={formData.impact}
                    onChange={(e) => handleInputChange('impact', e.target.value)}
                    placeholder="What impact do you expect your project to have?"
                    rows={3}
                    className="font-inter"
                  />
                </div>
              </CardContent>
            </Card>
            {/* Links */}
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-martian">Links</CardTitle>
                <CardDescription className="font-inter">Edit project links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="font-inter">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://your-project.com"
                      className="font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="font-inter">GitHub</Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.github || ''}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="font-inter">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.linkedin || ''}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="font-inter"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-martian">Media & Resources</CardTitle>
                <CardDescription className="font-inter">Edit videos, photos, and documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* YouTube Links */}
                <div className="space-y-2">
                  <Label className="font-inter">YouTube Videos</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.media.youtube_links.map((link, index) => (
                      <Badge key={index} variant="secondary" className="font-inter">
                        {link}
                        <button
                          type="button"
                          onClick={() => handleRemoveYoutubeLink(link)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newYoutubeLink}
                      onChange={(e) => setNewYoutubeLink(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="font-inter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddYoutubeLink())}
                    />
                    <Button type="button" onClick={handleAddYoutubeLink} variant="outline" className="font-inter">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 font-inter">Add YouTube video links to showcase your project</p>
                </div>

                {/* PDF Links */}
                <div className="space-y-2">
                  <Label className="font-inter">PDF Documents (Google Drive)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.media.pdf_links.map((link, index) => (
                      <Badge key={index} variant="secondary" className="font-inter">
                        {link}
                        <button
                          type="button"
                          onClick={() => handleRemovePdfLink(link)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newPdfLink}
                      onChange={(e) => setNewPdfLink(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view"
                      className="font-inter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPdfLink())}
                    />
                    <Button type="button" onClick={handleAddPdfLink} variant="outline" className="font-inter">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 font-inter">Add Google Drive PDF links (make sure they're set to public)</p>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl font-martian">Settings</CardTitle>
                <CardDescription className="font-inter">Edit project visibility and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-inter">Public Project</Label>
                    <p className="text-sm text-gray-600 font-inter">Make your project visible to the community</p>
                  </div>
                  <Switch
                    checked={formData.visibility === 'public'}
                    onCheckedChange={(checked) => handleInputChange('visibility', checked ? 'public' : 'private')}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="submit"
                disabled={saving}
                className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;