/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getGrantPrograms, getUserGrantApplications } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, DollarSign, Users, Award, ExternalLink, ArrowRight, Star, Clock, MapPin, Filter, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface GrantProgram {
  _id: string;
  program_id: string;
  title: string;
  subtitle?: string;
  description: string;
  grant_amount: number;
  currency: 'INR' | 'USD';
  total_projects_funded: number;
  disbursement_phases: number;
  perks: string[];
  eligibility_criteria: {
    working_prototype: boolean;
    women_leadership_percentage: number;
    progress_duration_months: number;
    values: string[];
    region: string;
  };
  important_dates: {
    applications_open: string;
    deadline: string;
    winners_announced: string;
  };
  status: 'draft' | 'active' | 'closed' | 'completed';
  is_featured: boolean;
  tags: string[];
  cover_image?: string;
  external_link?: string;
  applications_count: number;
  created_at: string;
}

const GrantPrograms = () => {
  const navigate = useNavigate();
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch grant programs
        const params: any = {};
        if (statusFilter) {
          params.status = statusFilter;
        }
        const programsResponse = await getGrantPrograms(params);
        setGrantPrograms(programsResponse.data?.programs || []);
        
        // Fetch user applications if logged in
        if (isLoggedIn) {
          try {
            const applicationsResponse = await getUserGrantApplications();
            setUserApplications(applicationsResponse.data?.applications || []);
          } catch (err) {
            console.error('Failed to fetch user applications:', err);
            setUserApplications([]);
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load grant programs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, isLoggedIn]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isApplicationOpen = (program: GrantProgram) => {
    const now = new Date();
    const openDate = new Date(program.important_dates.applications_open);
    const deadline = new Date(program.important_dates.deadline);
    return now >= openDate && now <= deadline;
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const hasUserApplied = (grantProgramId: string) => {
    if (!isLoggedIn) return false;
    return userApplications.some(app => app.grant_program_id === grantProgramId);
  };

  const getUserApplicationStatus = (grantProgramId: string) => {
    if (!isLoggedIn) return null;
    const application = userApplications.find(app => app.grant_program_id === grantProgramId);
    return application?.status || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-96 border-gray-100">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4 font-martian">Grant Programs</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-amber-800 hover:bg-amber-900 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredPrograms = grantPrograms.filter(p => p.is_featured);
  const regularPrograms = grantPrograms.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative py-20 px-6 bg-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container mx-auto max-w-6xl text-center">
          <div className="mb-6">
            <Award className="w-12 h-12 mx-auto mb-4 text-amber-600" />
          </div>
          <p className="text-sm text-gray-500 mb-4 font-inter tracking-wide uppercase">
            Funding Opportunities
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight font-martian">
            Grant Programs
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-inter">
            Empowering women-led projects with funding and resources to build the future.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">{grantPrograms.length}</div>
              <div className="text-gray-600 text-sm">Active Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">{featuredPrograms.length}</div>
              <div className="text-gray-600 text-sm">Featured Grants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">₹5L+</div>
              <div className="text-gray-600 text-sm">Total Disbursed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 mb-12 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">Filter Programs</h2>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  >
                    <option value="">All Programs</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Programs */}
          {featuredPrograms.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-5 h-5 text-amber-600" />
                <h2 className="text-2xl font-light text-gray-900 font-martian">Featured Programs</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPrograms.map((program) => (
                  <Card key={program._id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white shadow-md rounded-2xl overflow-hidden transform hover:-translate-y-1">
                    {program.cover_image && (
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={program.cover_image} 
                          alt={program.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-amber-600 text-white border-0 hover:bg-amber-600 shadow-lg backdrop-blur-sm">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        {hasUserApplied(program._id) && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-green-600 text-white border-0 shadow-lg backdrop-blur-sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Applied
                            </Badge>
                          </div>
                        )}
                        <div className={`absolute ${hasUserApplied(program._id) ? 'top-12 left-4' : 'top-4 left-4'}`}>
                          <Badge className={`${getStatusColor(program.status)} shadow-lg backdrop-blur-sm`}>
                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                          </Badge>
                        </div>
                        {isApplicationOpen(program) && (
                          <div className="absolute bottom-4 left-4">
                            <Badge className="bg-green-600 text-white border-0 shadow-lg backdrop-blur-sm">
                              <Clock className="w-3 h-3 mr-1" />
                              {getDaysRemaining(program.important_dates.deadline)} days left
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-amber-700 transition-colors mb-2 leading-tight">
                          {program.title}
                        </h3>
                        {program.subtitle && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {program.subtitle}
                          </p>
                        )}
                      </div>

                      <p className="text-gray-600 line-clamp-2 leading-relaxed mb-6 text-sm">
                        {program.description}
                      </p>
                      
                      {/* Grant Amount Highlight */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6 border border-amber-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-green-700">
                                {formatCurrency(program.grant_amount, program.currency)}
                              </div>
                              <div className="text-xs text-gray-600">per project</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-blue-700">
                              {program.total_projects_funded}
                            </div>
                            <div className="text-xs text-gray-600">projects funded</div>
                          </div>
                        </div>
                      </div>

                      {/* Key Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <span>{program.eligibility_criteria.region} based</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3" />
                          </div>
                          <span>{program.eligibility_criteria.women_leadership_percentage}% women/non-binary leadership</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-3 h-3" />
                          </div>
                          <span>Deadline: {formatDate(program.important_dates.deadline)}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {program.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {program.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-white border-gray-200 hover:bg-gray-50">
                              {tag}
                            </Badge>
                          ))}
                          {program.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-white border-gray-200">
                              +{program.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {isApplicationOpen(program) ? (
                          hasUserApplied(program._id) ? (
                            <Button 
                              variant="outline" 
                              className="w-full border-green-200 bg-green-50 text-green-700 h-11 rounded-lg font-medium"
                              disabled
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Applied
                            </Button>
                          ) : (
                            <Button 
                              className="w-full bg-amber-800 hover:bg-amber-900 text-white group h-11 rounded-lg font-medium"
                              onClick={() => navigate(`/grant-programs/${program._id}/apply`)}
                            >
                              Apply Now
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          )
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-200 h-11 rounded-lg"
                            disabled
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Applications Closed
                          </Button>
                        )}
                        
                        {program.external_link && (
                          <Button 
                            variant="ghost" 
                            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-11 rounded-lg"
                            onClick={() => window.open(program.external_link, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Learn More
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Programs */}
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-8 font-martian">
              {featuredPrograms.length > 0 ? 'All Programs' : 'Grant Programs'}
            </h2>
            
            {regularPrograms.length === 0 && grantPrograms.length === 0 ? (
              <div className="text-center py-20">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-gray-600 mb-3 font-martian">No Grant Programs Available</h3>
                <p className="text-gray-500">Check back soon for new opportunities!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPrograms.map((program) => (
                  <Card key={program._id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-sm rounded-xl overflow-hidden transform hover:-translate-y-0.5">
                    {program.cover_image && (
                      <div className="relative h-44 overflow-hidden">
                        <img 
                          src={program.cover_image} 
                          alt={program.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <Badge className={`${getStatusColor(program.status)} shadow-md backdrop-blur-sm`}>
                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                          </Badge>
                        </div>
                        {hasUserApplied(program._id) && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-green-600 text-white border-0 shadow-md backdrop-blur-sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Applied
                            </Badge>
                          </div>
                        )}
                        {isApplicationOpen(program) && (
                          <div className={`absolute ${hasUserApplied(program._id) ? 'top-10 left-3' : 'top-3 left-3'}`}>
                            <Badge className="bg-green-600 text-white border-0 shadow-md backdrop-blur-sm">
                              <Clock className="w-3 h-3 mr-1" />
                              Open
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-amber-700 transition-colors mb-1 leading-tight">
                          {program.title}
                        </h3>
                        {program.subtitle && (
                          <p className="text-sm text-gray-600">
                            {program.subtitle}
                          </p>
                        )}
                      </div>

                      <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-4">
                        {program.description}
                      </p>
                      
                      {/* Grant Details */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-green-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-green-700 text-sm">
                                {formatCurrency(program.grant_amount, program.currency)}
                              </div>
                              <div className="text-xs text-gray-600">per project</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-blue-700 text-sm">
                              {program.total_projects_funded}
                            </div>
                            <div className="text-xs text-gray-600">projects</div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{program.eligibility_criteria.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(program.important_dates.deadline)}</span>
                        </div>
                        {isApplicationOpen(program) && (
                          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{getDaysRemaining(program.important_dates.deadline)} days left</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {program.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {program.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-200 bg-white">
                              {tag}
                            </Badge>
                          ))}
                          {program.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-200 bg-white">
                              +{program.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {isApplicationOpen(program) ? (
                          hasUserApplied(program._id) ? (
                            <Button 
                              variant="outline" 
                              className="w-full border-green-200 bg-green-50 text-green-700 h-10 rounded-lg font-medium"
                              disabled
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Applied
                            </Button>
                          ) : (
                            <Button 
                              className="w-full bg-amber-800 hover:bg-amber-900 text-white group h-10 rounded-lg font-medium"
                              onClick={() => navigate(`/grant-programs/${program._id}/apply`)}
                            >
                              Apply Now
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          )
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-200 h-10 rounded-lg"
                            disabled
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Closed
                          </Button>
                        )}
                        
                        {program.external_link && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 h-9 rounded-lg"
                            onClick={() => window.open(program.external_link, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            Learn More
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GrantPrograms; 