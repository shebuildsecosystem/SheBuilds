import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, DollarSign, ArrowLeft, Users, Target, Clock, CheckCircle, AlertCircle, FileText, Video, Presentation, Upload, Info, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import GrantApplicationGuide from '../components/GrantApplicationGuide';

interface GrantDetail {
  grant_id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: 'open' | 'closed' | 'upcoming' | 'awarded';
  deadline: string;
  requirements: string[];
  sponsor: string;
  application_count: number;
  created_at: string;
  eligibility_criteria?: {
    working_prototype: boolean;
    women_leadership_percentage: number;
    progress_duration_months: number;
    values: string[];
    region: string;
  };
  application_requirements?: {
    team_details: boolean;
    project_overview: boolean;
    roadmap: boolean;
    vision_impact: boolean;
    why_grant: boolean;
  };
}

const GrantDetailPage: React.FC = () => {
  const { grantId } = useParams<{ grantId: string }>();
  const [grant, setGrant] = useState<GrantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    fetchGrant();
    // eslint-disable-next-line
  }, [grantId]);

  const fetchGrant = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/grant-programs/${grantId}`);
      setGrant(response.data.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load grant details. Please try again.',
        variant: 'destructive',
      });
      navigate('/grant-programs');
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

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">Loading grant details...</div>;
  }
  if (!grant) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">Grant not found.</div>;
  }

  const daysRemaining = getDaysRemaining(grant.deadline);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <Navbar />
      <button
        onClick={() => navigate('/grant-programs')}
        className="flex items-center gap-2 self-start mb-4 ml-2 px-4 py-2 rounded-full bg-white/80 hover:bg-orange-50 text-amber-800 font-medium shadow border border-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Grant Programs
      </button>
      
      <div className="w-full max-w-4xl space-y-6">
        {/* Main Grant Card */}
        <Card className="relative shadow-xl border-0 rounded-3xl bg-white/90 animate-fade-in-up overflow-hidden">
          <CardHeader className="pt-10 pb-4 flex flex-col items-center bg-white/80 border-b border-gray-100">
            <CardTitle className="text-3xl font-bold text-gray-900 font-martian mb-1 flex items-center gap-2">
              {grant.title}
            </CardTitle>
            <div className="flex flex-wrap gap-3 items-center mt-2 mb-2">
              <span className="flex items-center gap-1 text-amber-700 font-inter text-base">
                <DollarSign className="w-5 h-5" />₹{grant.amount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-gray-600 font-inter text-base">
                <Calendar className="w-5 h-5" />Deadline: {formatDate(grant.deadline)}
              </span>
              <span className={`px-3 py-1 rounded-full font-inter font-medium text-sm ${
                grant.status === 'open' ? 'bg-green-100 text-green-800' : 
                grant.status === 'closed' ? 'bg-gray-100 text-gray-800' : 
                grant.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                'bg-orange-100 text-orange-800'
              }`}>
                {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 items-center mt-1">
              <span className="flex items-center gap-1 text-gray-500 font-inter text-sm">
                <Users className="w-4 h-4" />{grant.application_count} applications
              </span>
              <span className="text-gray-500 font-inter text-sm">
                Sponsored by <span className="font-semibold text-amber-700">{grant.sponsor}</span>
              </span>
              {daysRemaining > 0 && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {daysRemaining} days remaining
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-8 pb-4 px-6 bg-white/70">
            <div>
              <CardDescription className="text-lg text-gray-700 font-inter mb-4">{grant.description}</CardDescription>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 font-martian mb-2">Category</h3>
              <span className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full font-inter text-sm">{grant.category}</span>
            </div>

            {grant.eligibility_criteria && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 font-martian mb-4">Eligibility Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Women Leadership: {grant.eligibility_criteria.women_leadership_percentage}% minimum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Progress Duration: {grant.eligibility_criteria.progress_duration_months} months minimum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Working Prototype: {grant.eligibility_criteria.working_prototype ? 'Required' : 'Not required'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Region: {grant.eligibility_criteria.region}</span>
                  </div>
                </div>
                {grant.eligibility_criteria.values.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Values Alignment:</h4>
                    <div className="flex flex-wrap gap-2">
                      {grant.eligibility_criteria.values.map((value, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {grant.requirements && grant.requirements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 font-martian mb-2">Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 font-inter">
                  {grant.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {isLoggedIn && grant.status === 'open' && (
              <div className="flex justify-center mt-8">
                <Button 
                  className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter" 
                  onClick={() => navigate(`/grant-programs/${grant.grant_id}/apply`)}
                >
                  Apply for this Grant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Requirements Card */}
        {isLoggedIn && grant.status === 'open' && (
          <Card className="shadow-xl border-0 rounded-3xl bg-white/90 overflow-hidden">
            <CardHeader className="pt-8 pb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <CardTitle className="text-2xl font-bold text-gray-900 font-martian mb-2">
                Application Requirements
              </CardTitle>
              <CardDescription className="text-gray-600 font-inter">
                Complete all required materials to submit your application
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required Materials */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Required Materials
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <Video className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-amber-800">Pitch Video</h5>
                        <p className="text-sm text-amber-700">2-3 minute video introducing your team and project</p>
                        <ul className="text-xs text-amber-600 mt-1 space-y-1">
                          <li>• Team introduction and project overview</li>
                          <li>• Problem statement and solution</li>
                          <li>• Expected impact and funding request</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <Presentation className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-amber-800">Presentation (PPT/PDF)</h5>
                        <p className="text-sm text-amber-700">10-15 slides with comprehensive project details</p>
                        <ul className="text-xs text-amber-600 mt-1 space-y-1">
                          <li>• Executive summary and problem/solution</li>
                          <li>• Market analysis and business model</li>
                          <li>• Team, timeline, and financial projections</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Sections */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Application Sections
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Project Selection & Basic Info</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Team Details & Eligibility</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Project Overview & Roadmap</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Vision, Impact & Grant Justification</span>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Make sure you have all required materials ready before starting your application. 
                  The application process includes 5 steps and requires detailed information about your project, team, and vision.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button 
                  className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 text-base font-medium rounded-full font-inter" 
                  onClick={() => navigate(`/grant-programs/${grant.grant_id}/apply`)}
                >
                  Start Application Process
                </Button>
                <Button 
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 px-6 py-3 text-base font-medium rounded-full font-inter" 
                  onClick={() => setShowGuide(true)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Application Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Tips */}
        {isLoggedIn && grant.status === 'open' && (
          <Card className="shadow-xl border-0 rounded-3xl bg-white/90 overflow-hidden">
            <CardHeader className="pt-8 pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="text-2xl font-bold text-gray-900 font-martian mb-2">
                Application Tips
              </CardTitle>
              <CardDescription className="text-gray-600 font-inter">
                Maximize your chances of success with these helpful tips
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">For Your Pitch Video:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Practice your pitch multiple times before recording</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Ensure good lighting and clear audio quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Keep it concise and focus on key points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Show enthusiasm and confidence in your project</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">For Your Application:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Be specific and provide concrete examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Demonstrate clear understanding of the problem</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Show how the grant will accelerate your project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Highlight your team's unique strengths</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Guide Modal */}
        {showGuide && (
          <GrantApplicationGuide 
            onClose={() => setShowGuide(false)}
            grantTitle={grant?.title}
          />
        )}
      </div>
    </div>
  );
};

export default GrantDetailPage; 