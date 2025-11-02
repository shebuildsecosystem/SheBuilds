import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import { 
  FileText, 
  Video, 
  Presentation, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Info,
  ExternalLink,
  Calendar,
  DollarSign,
  Users,
  Target,
  Clock
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
}

interface GrantProgram {
  _id: string;
  title: string;
  description: string;
  grant_amount: number;
  currency: string;
  eligibility_criteria: {
    working_prototype: boolean;
    women_leadership_percentage: number;
    progress_duration_months: number;
    values: string[];
    region: string;
  };
  application_requirements: {
    team_details: boolean;
    project_overview: boolean;
    roadmap: boolean;
    vision_impact: boolean;
    why_grant: boolean;
  };
  important_dates: {
    deadline: string;
  };
}

interface ApplicationData {
  project_id: string; // Keep as project_id for API compatibility
  proposal: string;
  budget_breakdown: string;
  timeline: string;
  expected_impact: string;
  team_details: string;
  project_overview: string;
  roadmap: string;
  vision_impact: string;
  why_grant: string;
  pitch_video_url: string;
  presentation_url: string;
  demo_video_url: string;
  additional_materials: string;
  women_leadership_percentage: number;
  working_prototype: boolean;
  progress_duration_months: number;
}

const GrantApply: React.FC = () => {
  const { grantId } = useParams<{ grantId: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(5);
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [grantProgram, setGrantProgram] = useState<GrantProgram | null>(null);
  const [existingApplications, setExistingApplications] = useState<any[]>([]);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    project_id: '',
    proposal: '',
    budget_breakdown: '',
    timeline: '',
    expected_impact: '',
    team_details: '',
    project_overview: '',
    roadmap: '',
    vision_impact: '',
    why_grant: '',
    pitch_video_url: '',
    presentation_url: '',
    demo_video_url: '',
    additional_materials: '',
    women_leadership_percentage: 0,
    working_prototype: false,
    progress_duration_months: 0
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requirementsMet, setRequirementsMet] = useState({
    project_selected: false,
    basic_info_complete: false,
    materials_uploaded: false,
    eligibility_met: false,
    final_review: false
  });

  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast({ title: 'Login required', description: 'Please log in to apply for a grant.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    
    // Only fetch data once when component mounts
    fetchData();
  }, [isLoggedIn]); // Only depend on isLoggedIn

  useEffect(() => {
    if (grantProgram && Object.keys(applicationData).length > 0) {
      validateRequirements();
    }
  }, [grantProgram]); // Only depend on grantProgram to prevent infinite loops

  // Validate requirements when grant program loads
  useEffect(() => {
    if (grantProgram) {
      validateRequirements();
    }
  }, [grantProgram]);

  const fetchData = async (retryCount = 0) => {
    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) {
      console.log('Request already in progress, skipping...');
      return;
    }
    
    isFetchingRef.current = true;
    
    try {
      setLoading(true);
      
      console.log('Fetching data for grant application...');
      
      const [projectsResponse, grantResponse, applicationsResponse] = await Promise.all([
        api.get('/projects/my-projects'),
        api.get(`/grant-programs/${grantId}`),
        api.get('/grant-applications/my-applications')
      ]);
      
      console.log('Data fetched successfully');
      console.log('Grant ID from URL:', grantId);
      console.log('Applications count:', applicationsResponse.data.applications?.length || 0);
      
      // Handle different possible response structures
      let projects = [];
      if (projectsResponse.data.data && projectsResponse.data.data.projects) {
        projects = projectsResponse.data.data.projects;
      } else if (projectsResponse.data.projects) {
        projects = projectsResponse.data.projects;
      } else if (Array.isArray(projectsResponse.data)) {
        projects = projectsResponse.data;
      }
      
      console.log('Extracted projects:', projects);
      setProjects(projects);
      setGrantProgram(grantResponse.data);
      setExistingApplications(applicationsResponse.data.applications || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      
      // Handle rate limiting with retry logic
      if (error?.response?.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
        
        setTimeout(() => {
          fetchData(retryCount + 1);
        }, delay);
        return;
      }
      
      let errorMessage = 'Failed to load required data.';
      if (error?.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const validateRequirements = () => {
    try {
      const newRequirements = {
        project_selected: !!(applicationData.project_id && isProjectEligible(applicationData.project_id)),
        basic_info_complete: !!(applicationData.proposal && applicationData.budget_breakdown && applicationData.timeline && applicationData.expected_impact),
        materials_uploaded: !!(applicationData.pitch_video_url && applicationData.presentation_url),
        eligibility_met: !!(
          typeof applicationData.women_leadership_percentage === 'number' && 
          applicationData.women_leadership_percentage >= (grantProgram?.eligibility_criteria?.women_leadership_percentage || 60) && 
          typeof applicationData.progress_duration_months === 'number' &&
          applicationData.progress_duration_months >= (grantProgram?.eligibility_criteria?.progress_duration_months || 6)
        ),
        final_review: !!(applicationData.team_details && applicationData.project_overview && applicationData.roadmap && applicationData.vision_impact && applicationData.why_grant)
      };
      setRequirementsMet(newRequirements);
    } catch (error) {
      console.error('Error in validateRequirements:', error);
      // Set default requirements to prevent infinite loops
      setRequirementsMet({
        project_selected: false,
        basic_info_complete: false,
        materials_uploaded: false,
        eligibility_met: false,
        final_review: false
      });
    }
  };

  const updateApplicationData = (field: keyof ApplicationData, value: any) => {
    // Ensure we're only updating with valid string/number values
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      setApplicationData(prev => ({ ...prev, [field]: value }));
      // Trigger validation after a short delay to avoid excessive calls
      if (grantProgram) {
        setTimeout(() => validateRequirements(), 100);
      }
    }
  };

  // Clear selected project if it becomes ineligible
  React.useEffect(() => {
    if (applicationData.project_id && !isProjectEligible(applicationData.project_id)) {
      setApplicationData(prev => ({ ...prev, project_id: '' }));
      toast({
        title: 'Project Not Eligible',
        description: 'The selected project is not eligible for this grant program. Please select a different project.',
        variant: 'destructive',
      });
    }
  }, [existingApplications, applicationData.project_id]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if a project is eligible for this grant program
  const isProjectEligible = (projectId: string) => {
    // Check if this project has already been submitted to this grant program
    const existingApplication = existingApplications.find(app => {
      // Handle both string IDs and populated objects
      const appProjectId = typeof app.project_id === 'object' ? app.project_id._id : app.project_id;
      const appGrantId = typeof app.grant_program_id === 'object' ? app.grant_program_id._id : app.grant_program_id;
      
      // Convert both IDs to strings for comparison
      const appProjectIdStr = String(appProjectId);
      const appGrantIdStr = String(appGrantId);
      const currentGrantIdStr = String(grantId);
      
      return (
        appProjectIdStr === projectId && 
        appGrantIdStr === currentGrantIdStr &&
        ['draft', 'submitted', 'in-review'].includes(app.status)
      );
    });
    
    return !existingApplication;
  };

  // Get the reason why a project is not eligible
  const getProjectIneligibilityReason = (projectId: string) => {
    const existingApplication = existingApplications.find(app => {
      // Handle both string IDs and populated objects
      const appProjectId = typeof app.project_id === 'object' ? app.project_id._id : app.project_id;
      const appGrantId = typeof app.grant_program_id === 'object' ? app.grant_program_id._id : app.grant_program_id;
      
      // Convert both IDs to strings for comparison
      const appProjectIdStr = String(appProjectId);
      const appGrantIdStr = String(appGrantId);
      const currentGrantIdStr = String(grantId);
      
      return appProjectIdStr === projectId && appGrantIdStr === currentGrantIdStr;
    });
    
    if (existingApplication) {
      switch (existingApplication.status) {
        case 'draft':
          return 'Already has a draft application';
        case 'submitted':
          return 'Already submitted to this grant program';
        case 'in-review':
          return 'Application is currently under review';
        case 'approved':
          return 'Application was already approved';
        case 'rejected':
          return 'Application was previously rejected';
        default:
          return 'Already applied to this grant program';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!requirementsMet.project_selected || !requirementsMet.basic_info_complete || 
        !requirementsMet.materials_uploaded || !requirementsMet.eligibility_met || !requirementsMet.final_review) {
      toast({ title: 'Incomplete Application', description: 'Please complete all required sections before submitting.', variant: 'destructive' });
      return;
    }

    // Additional validation to ensure selected project is eligible
    if (!isProjectEligible(applicationData.project_id)) {
      toast({ 
        title: 'Project Not Eligible', 
        description: 'The selected project is not eligible for this grant program. Please select a different project.', 
        variant: 'destructive' 
      });
      return;
    }

    // Additional validation for required fields
    const requiredFields = [
      'project_id', 'proposal', 'budget_breakdown', 'timeline', 'expected_impact',
      'team_details', 'project_overview', 'roadmap', 'vision_impact', 'why_grant',
      'pitch_video_url', 'presentation_url'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = applicationData[field as keyof ApplicationData];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      toast({ 
        title: 'Missing Required Fields', 
        description: `Please complete: ${missingFields.join(', ')}`, 
        variant: 'destructive' 
      });
      return;
    }

    // Validate field lengths (matching server validation)
    if (applicationData.proposal.trim().length < 100) {
      toast({ 
        title: 'Proposal Too Short', 
        description: 'Proposal must be at least 100 characters long', 
        variant: 'destructive' 
      });
      return;
    }

    if (applicationData.proposal.trim().length > 5000) {
      toast({ 
        title: 'Proposal Too Long', 
        description: 'Proposal must be less than 5000 characters', 
        variant: 'destructive' 
      });
      return;
    }

    if (applicationData.budget_breakdown.trim().length < 50) {
      toast({ 
        title: 'Budget Breakdown Too Short', 
        description: 'Budget breakdown must be at least 50 characters long', 
        variant: 'destructive' 
      });
      return;
    }

    if (applicationData.timeline.trim().length < 20) {
      toast({ 
        title: 'Timeline Too Short', 
        description: 'Timeline must be at least 20 characters long', 
        variant: 'destructive' 
      });
      return;
    }

    // Validate numeric fields
    if (applicationData.women_leadership_percentage < 0 || applicationData.women_leadership_percentage > 100) {
      toast({ 
        title: 'Invalid Women Leadership Percentage', 
        description: 'Percentage must be between 0 and 100', 
        variant: 'destructive' 
      });
      return;
    }

    if (applicationData.progress_duration_months < 0) {
      toast({ 
        title: 'Invalid Progress Duration', 
        description: 'Progress duration must be a positive number', 
        variant: 'destructive' 
      });
      return;
    }

    // Validate URL formats
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(applicationData.pitch_video_url.trim())) {
      toast({ 
        title: 'Invalid Pitch Video URL', 
        description: 'Pitch video URL must be a valid URL starting with http:// or https://', 
        variant: 'destructive' 
      });
      return;
    }

    if (!urlRegex.test(applicationData.presentation_url.trim())) {
      toast({ 
        title: 'Invalid Presentation URL', 
        description: 'Presentation URL must be a valid URL starting with http:// or https://', 
        variant: 'destructive' 
      });
      return;
    }

    // Validate ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(applicationData.project_id)) {
      toast({ 
        title: 'Invalid Project ID', 
        description: 'Please select a valid project', 
        variant: 'destructive' 
      });
      return;
    }

    if (!objectIdRegex.test(grantId || '')) {
      toast({ 
        title: 'Invalid Grant Program ID', 
        description: 'Invalid grant program reference', 
        variant: 'destructive' 
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare the data for submission
      const submissionData = {
        grant_program_id: grantId,
        project_id: applicationData.project_id,
        proposal: applicationData.proposal.trim(),
        budget_breakdown: applicationData.budget_breakdown.trim(),
        timeline: applicationData.timeline.trim(),
        expected_impact: applicationData.expected_impact.trim(),
        team_details: applicationData.team_details.trim(),
        project_overview: applicationData.project_overview.trim(),
        roadmap: applicationData.roadmap.trim(),
        vision_impact: applicationData.vision_impact.trim(),
        why_grant: applicationData.why_grant.trim(),
        pitch_video_url: applicationData.pitch_video_url.trim(),
        presentation_url: applicationData.presentation_url.trim(),
        demo_video_url: applicationData.demo_video_url.trim() || undefined,
        additional_materials: applicationData.additional_materials.trim() || undefined,
        women_leadership_percentage: Number(applicationData.women_leadership_percentage),
        working_prototype: Boolean(applicationData.working_prototype),
        progress_duration_months: Number(applicationData.progress_duration_months)
      };

      console.log('Submitting application data:', submissionData);
      console.log('Data validation check:', {
        hasGrantProgramId: !!submissionData.grant_program_id,
        hasProjectId: !!submissionData.project_id,
        proposalLength: submissionData.proposal.length,
        budgetLength: submissionData.budget_breakdown.length,
        timelineLength: submissionData.timeline.length,
        hasExpectedImpact: !!submissionData.expected_impact,
        hasTeamDetails: !!submissionData.team_details,
        hasProjectOverview: !!submissionData.project_overview,
        hasRoadmap: !!submissionData.roadmap,
        hasVisionImpact: !!submissionData.vision_impact,
        hasWhyGrant: !!submissionData.why_grant,
        hasPitchVideo: !!submissionData.pitch_video_url,
        hasPresentation: !!submissionData.presentation_url,
        womenLeadership: submissionData.women_leadership_percentage,
        workingPrototype: submissionData.working_prototype,
        progressDuration: submissionData.progress_duration_months
      });

      // Additional validation check
      const validationIssues = [];
      if (submissionData.proposal.length < 100) validationIssues.push('Proposal too short');
      if (submissionData.proposal.length > 5000) validationIssues.push('Proposal too long');
      if (submissionData.budget_breakdown.length < 50) validationIssues.push('Budget breakdown too short');
      if (submissionData.timeline.length < 20) validationIssues.push('Timeline too short');
      if (!/^https?:\/\/.+/.test(submissionData.pitch_video_url)) validationIssues.push('Invalid pitch video URL');
      if (!/^https?:\/\/.+/.test(submissionData.presentation_url)) validationIssues.push('Invalid presentation URL');
      if (submissionData.women_leadership_percentage < 0 || submissionData.women_leadership_percentage > 100) validationIssues.push('Invalid women leadership percentage');
      if (submissionData.progress_duration_months < 0) validationIssues.push('Invalid progress duration');
      if (!/^[0-9a-fA-F]{24}$/.test(submissionData.project_id)) validationIssues.push('Invalid project ID');
      if (!/^[0-9a-fA-F]{24}$/.test(submissionData.grant_program_id)) validationIssues.push('Invalid grant program ID');

      if (validationIssues.length > 0) {
        console.error('Validation issues found:', validationIssues);
        toast({ 
          title: 'Validation Issues', 
          description: validationIssues.join(', '), 
          variant: 'destructive' 
        });
        return;
      }
      
      await api.post('/grant-applications', submissionData);
      toast({ title: 'Application submitted', description: 'Your grant application has been submitted successfully!' });
      setTimeout(() => navigate('/grant-programs'), 1500);
    } catch (error: any) {
      console.error('Submission error:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      
      // Try to get more detailed error information
      let errorMessage = 'Please try again.';
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Handle validation errors array
        errorMessage = error.response.data.errors.join(', ');
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({ title: 'Submission failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Application Progress</h3>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full -translate-y-1/2 z-10 transition-all duration-500"
          style={{ width: `${(currentStep - 1) * 25}%` }}
        ></div>
        
        {/* Step Indicators */}
        {[
          { step: 1, title: 'Project Selection', icon: '🎯' },
          { step: 2, title: 'Basic Info', icon: '📝' },
          { step: 3, title: 'Materials', icon: '📁' },
          { step: 4, title: 'Eligibility', icon: '✅' },
          { step: 5, title: 'Review', icon: '📋' }
        ].map((item, index) => (
          <div key={item.step} className="flex flex-col items-center relative z-20">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300
              ${currentStep >= item.step 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-400 border-2 border-gray-300'
              }
            `}>
              {currentStep > item.step ? '✓' : item.icon}
            </div>
            <span className={`
              text-xs font-medium mt-2 text-center max-w-20
              ${currentStep >= item.step ? 'text-amber-700' : 'text-gray-500'}
            `}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current Step Display */}
      <div className="text-center mt-6">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full font-medium">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );

  const renderRequirementsChecklist = () => (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-amber-600" />
        Application Requirements Checklist
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            key: 'project_selected',
            title: 'Project Selection',
            description: 'Eligible project selected for this grant program',
            icon: '🎯'
          },
          {
            key: 'basic_info_complete',
            title: 'Basic Information',
            description: 'Proposal, budget, timeline, and impact details',
            icon: '📝'
          },
          {
            key: 'materials_uploaded',
            title: 'Required Materials',
            description: 'Pitch video and presentation uploaded',
            icon: '📁'
          },
          {
            key: 'eligibility_met',
            title: 'Eligibility Criteria',
            description: 'Women leadership and progress requirements met',
            icon: '✅'
          },
          {
            key: 'final_review',
            title: 'Final Review',
            description: 'All sections completed and reviewed',
            icon: '📋'
          }
        ].map((item) => (
          <div 
            key={item.key}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-3
              ${requirementsMet[item.key as keyof typeof requirementsMet]
                ? 'bg-green-50 border-green-200 shadow-md'
                : 'bg-white/80 border-gray-200'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${requirementsMet[item.key as keyof typeof requirementsMet]
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {requirementsMet[item.key as keyof typeof requirementsMet] ? '✓' : item.icon}
            </div>
            <div className="flex-1">
              <h4 className={`
                font-semibold text-sm
                ${requirementsMet[item.key as keyof typeof requirementsMet]
                  ? 'text-green-800'
                  : 'text-gray-700'
                }
              `}>
                {item.title}
              </h4>
              <p className={`
                text-xs mt-1
                ${requirementsMet[item.key as keyof typeof requirementsMet]
                  ? 'text-green-600'
                  : 'text-gray-500'
                }
              `}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 pt-4 border-t border-amber-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-amber-700">
            {Object.values(requirementsMet).filter(Boolean).length} of {Object.keys(requirementsMet).length} completed
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(Object.values(requirementsMet).filter(Boolean).length / Object.keys(requirementsMet).length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Project Selection</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the project you want to apply with for this grant. Make sure your project aligns with the grant's requirements and objectives.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Project Selection Rules:</strong>
          <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
            <li>Only your own projects are shown below</li>
            <li>Each project can only be submitted once per grant program</li>
            <li>Projects with existing applications (draft, submitted, in-review) are disabled</li>
            <li>Approved or rejected applications cannot be resubmitted</li>
            <li>Make sure your project meets the grant's eligibility criteria</li>
          </ul>
        </AlertDescription>
      </Alert>

      {projects.length > 0 && projects.filter(p => isProjectEligible(p._id)).length === 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>No Eligible Projects Available</strong><br />
            All your projects have already been submitted to this grant program. Here's what you can do:
            <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
              <li>Create a new project in your portfolio</li>
              <li>Wait for the review process to complete on existing applications</li>
              <li>Apply to a different grant program with your existing projects</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <label className="block text-gray-700 font-semibold mb-3">Select Your Project *</label>
        <Select value={applicationData.project_id} onValueChange={(value) => updateApplicationData('project_id', value)}>
          <SelectTrigger className="w-full h-12 text-left">
            <SelectValue placeholder="Choose a project to apply with..." />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {projects.length === 0 ? (
              <SelectItem value="" disabled>
                <div className="flex flex-col items-center py-4">
                  <div className="text-gray-400 mb-2">No projects found</div>
                  <div className="text-xs text-gray-400 text-center">
                    You need to create a project first before applying for grants
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/create-project')}
                    className="mt-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Create Project
                  </Button>
                </div>
              </SelectItem>
            ) : (
              <>
                {/* Eligible Projects Section */}
                {projects.filter(p => isProjectEligible(p._id)).length > 0 ? (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border-b border-green-200">
                      Available for This Grant ({projects.filter(p => isProjectEligible(p._id)).length})
                    </div>
                    {projects.filter(p => isProjectEligible(p._id)).map((project) => (
                      <SelectItem 
                        key={project._id} 
                        value={project._id} 
                        className="py-3 hover:bg-green-50"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {project.title}
                            </span>
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              Available
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {project.category} • {project.status}
                          </span>
                          <span className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {project.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                ) : projects.length > 0 && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 border-b border-orange-200">
                    No Available Projects
                  </div>
                )}
                
                {/* Ineligible Projects Section */}
                {projects.filter(p => !isProjectEligible(p._id)).length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border-b border-red-200 mt-2">
                      Already Applied to This Grant ({projects.filter(p => !isProjectEligible(p._id)).length})
                    </div>
                    {projects.filter(p => !isProjectEligible(p._id)).map((project) => {
                      const ineligibilityReason = getProjectIneligibilityReason(project._id);
                      const existingApplication = existingApplications.find(app => 
                        app.project_id === project._id && 
                        app.grant_program_id === grantId
                      );
                      
                      return (
                        <SelectItem 
                          key={project._id} 
                          value={project._id} 
                          className="py-3 opacity-60 cursor-not-allowed hover:bg-gray-50"
                          disabled={true}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-400 line-through">
                                {project.title}
                              </span>
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-600 border-red-300">
                                {existingApplication?.status === 'submitted' ? 'Submitted' : 
                                 existingApplication?.status === 'in-review' ? 'In Review' :
                                 existingApplication?.status === 'approved' ? 'Approved' :
                                 existingApplication?.status === 'rejected' ? 'Rejected' : 'Not Eligible'}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-400">
                              {project.category} • {project.status}
                            </span>
                            {ineligibilityReason && (
                              <div className="flex items-start gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-red-500">
                                  {ineligibilityReason}
                                </span>
                              </div>
                            )}
                                                         {existingApplication && (
                               <div className="text-xs text-gray-400 mt-1">
                                 Applied on: {new Date(existingApplication.submitted_date || existingApplication.createdAt || existingApplication.created_at).toLocaleDateString()}
                               </div>
                             )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </SelectContent>
        </Select>
        
        {/* Show summary of eligible vs ineligible projects */}
        {projects.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Project Eligibility Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter(p => isProjectEligible(p._id)).length}
                </div>
                <div className="text-sm text-green-700 font-medium">Available</div>
                <div className="text-xs text-green-600">Ready to apply</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {projects.filter(p => !isProjectEligible(p._id)).length}
                </div>
                <div className="text-sm text-red-700 font-medium">Already Applied</div>
                <div className="text-xs text-red-600">Cannot reuse</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-700 font-medium">Your Projects</div>
                <div className="text-xs text-gray-600">In your portfolio</div>
              </div>
            </div>
            {projects.filter(p => isProjectEligible(p._id)).length === 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">No eligible projects found</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  All your projects have already been submitted to this grant program. You cannot proceed with this application.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {applicationData.project_id && (
        <Card className={`${isProjectEligible(applicationData.project_id) ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg flex items-center gap-2 ${isProjectEligible(applicationData.project_id) ? 'text-green-800' : 'text-red-800'}`}>
              {isProjectEligible(applicationData.project_id) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              Selected Project
              {!isProjectEligible(applicationData.project_id) && (
                <Badge variant="destructive" className="ml-2">
                  Not Eligible
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Project:</span>
                <span className="ml-2 text-gray-900">{projects.find(p => p._id === applicationData.project_id)?.title}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Category:</span>
                <span className="ml-2 text-gray-900">{projects.find(p => p._id === applicationData.project_id)?.category}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <Badge variant="outline" className="ml-2">
                  {projects.find(p => p._id === applicationData.project_id)?.status}
                </Badge>
              </div>
              {!isProjectEligible(applicationData.project_id) && (
                <>
                  <div>
                    <span className="font-semibold text-red-700">Reason:</span>
                    <span className="ml-2 text-red-600">
                      {getProjectIneligibilityReason(applicationData.project_id)}
                    </span>
                  </div>
                  {(() => {
                    const existingApplication = existingApplications.find(app => {
                      // Handle both string IDs and populated objects
                      const appProjectId = typeof app.project_id === 'object' ? app.project_id._id : app.project_id;
                      const appGrantId = typeof app.grant_program_id === 'object' ? app.grant_program_id._id : app.grant_program_id;
                      
                      return String(appProjectId) === applicationData.project_id && String(appGrantId) === grantId;
                    });
                    if (existingApplication) {
                      return (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="font-semibold text-red-800">Application History</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium text-red-700">Status:</span>
                              <Badge 
                                variant="secondary" 
                                className="ml-2 text-xs bg-red-200 text-red-700 border-red-400"
                              >
                                {existingApplication.status === 'submitted' ? 'Submitted' : 
                                 existingApplication.status === 'in-review' ? 'In Review' :
                                 existingApplication.status === 'approved' ? 'Approved' :
                                 existingApplication.status === 'rejected' ? 'Rejected' : 'Draft'}
                              </Badge>
                            </div>
                                                         <div>
                               <span className="font-medium text-red-700">Applied on:</span>
                               <span className="ml-2 text-red-600">
                                 {new Date(existingApplication.submitted_date || existingApplication.createdAt || existingApplication.created_at).toLocaleDateString()}
                               </span>
                             </div>
                            {existingApplication.status === 'rejected' && existingApplication.review_notes && (
                              <div>
                                <span className="font-medium text-red-700">Review Notes:</span>
                                <p className="mt-1 text-red-600 text-xs">
                                  {existingApplication.review_notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </>
              )}
              <div>
                <span className="font-semibold text-gray-700">Description:</span>
                <p className="mt-1 text-gray-600 text-sm">
                  {projects.find(p => p._id === applicationData.project_id)?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Grant Program Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Amount:</span>
            <span className="text-amber-800 font-semibold">
              {grantProgram?.currency} {grantProgram?.grant_amount?.toLocaleString() || grantProgram?.grant_amount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Women Leadership:</span>
            <span className="text-amber-800 font-semibold">
              {grantProgram?.eligibility_criteria?.women_leadership_percentage || 60}% minimum
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Progress Duration:</span>
            <span className="text-amber-800 font-semibold">
              {grantProgram?.eligibility_criteria?.progress_duration_months || 6} months minimum
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Deadline:</span>
            <span className="text-amber-800 font-semibold">
              {grantProgram?.important_dates?.deadline ? new Date(grantProgram.important_dates.deadline).toLocaleDateString() : 'Not specified'}
            </span>
          </div>
        </div>
        
        {/* View Existing Applications Button */}
        {existingApplications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  You have {existingApplications.length} existing application{existingApplications.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/usergrants')}
                className="text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                View Applications
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Step 2: Basic Information</strong><br />
          Provide the essential information about your grant application. Be detailed and specific in your responses.
        </AlertDescription>
      </Alert>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Project Proposal *</label>
        <Textarea 
          value={applicationData.proposal} 
          onChange={e => updateApplicationData('proposal', e.target.value)} 
          rows={6} 
          required 
          className="font-inter" 
          placeholder="Describe your project in detail, including the problem it solves, your solution, and why it deserves this grant. Include your team's expertise and the innovative aspects of your approach..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500">Minimum 100 characters required, maximum 5000 characters</p>
          <span className={`text-sm ${applicationData.proposal.length < 100 ? 'text-red-500' : applicationData.proposal.length > 4500 ? 'text-orange-500' : 'text-green-500'}`}>
            {applicationData.proposal.length}/5000
          </span>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Budget Breakdown *</label>
        <Textarea 
          value={applicationData.budget_breakdown} 
          onChange={e => updateApplicationData('budget_breakdown', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Provide a detailed breakdown of how you plan to use the grant money. Include categories like: Development tools, Hosting, Marketing, Team expenses, etc. with specific amounts..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500">Minimum 50 characters required, maximum 2000 characters</p>
          <span className={`text-sm ${applicationData.budget_breakdown.length < 50 ? 'text-red-500' : applicationData.budget_breakdown.length > 1800 ? 'text-orange-500' : 'text-green-500'}`}>
            {applicationData.budget_breakdown.length}/2000
          </span>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Project Timeline *</label>
        <Input 
          value={applicationData.timeline} 
          onChange={e => updateApplicationData('timeline', e.target.value)} 
          required 
          className="font-inter" 
          placeholder="e.g., 6 months with milestones: Month 1-2: Development, Month 3-4: Testing, Month 5-6: Launch & Marketing"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500">Minimum 20 characters required, maximum 1000 characters</p>
          <span className={`text-sm ${applicationData.timeline.length < 20 ? 'text-red-500' : applicationData.timeline.length > 900 ? 'text-orange-500' : 'text-green-500'}`}>
            {applicationData.timeline.length}/1000
          </span>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Expected Impact *</label>
        <Textarea 
          value={applicationData.expected_impact} 
          onChange={e => updateApplicationData('expected_impact', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Describe the impact you expect to make with this project. Include metrics, target audience, social/economic benefits, and long-term vision..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Step 3: Required Materials</strong><br />
          Upload your pitch video and presentation. These materials are crucial for the evaluation process.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-600" />
              Pitch Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input 
                value={applicationData.pitch_video_url} 
                onChange={e => updateApplicationData('pitch_video_url', e.target.value)} 
                placeholder="https://youtube.com/watch?v=..." 
                className="font-inter"
              />
              {applicationData.pitch_video_url && !/^https?:\/\/.+/.test(applicationData.pitch_video_url) && (
                <p className="text-sm text-red-500 mt-1">URL must start with http:// or https://</p>
              )}
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Requirements:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>2-3 minutes maximum</li>
                  <li>Clear audio and video quality</li>
                  <li>Team introduction and project overview</li>
                  <li>Problem statement and solution</li>
                  <li>Expected impact and funding request</li>
                </ul>
                <p className="mt-2 text-blue-600"><strong>Tip:</strong> Use YouTube, Vimeo, or similar video hosting platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Presentation className="w-5 h-5 text-amber-600" />
              Presentation (PPT/PDF)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input 
                value={applicationData.presentation_url} 
                onChange={e => updateApplicationData('presentation_url', e.target.value)} 
                placeholder="https://drive.google.com/file/d/..." 
                className="font-inter"
              />
              {applicationData.presentation_url && !/^https?:\/\/.+/.test(applicationData.presentation_url) && (
                <p className="text-sm text-red-500 mt-1">URL must start with http:// or https://</p>
              )}
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Requirements:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>10-15 slides maximum</li>
                  <li>Executive summary</li>
                  <li>Problem and solution</li>
                  <li>Market analysis</li>
                  <li>Business model</li>
                  <li>Team and timeline</li>
                  <li>Financial projections</li>
                </ul>
                <p className="mt-2 text-blue-600"><strong>Tip:</strong> Use Google Drive, Dropbox, or similar file sharing platforms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Additional Materials (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input 
              value={applicationData.demo_video_url} 
              onChange={e => updateApplicationData('demo_video_url', e.target.value)} 
              placeholder="Demo video URL (optional)" 
              className="font-inter"
            />
            <Textarea 
              value={applicationData.additional_materials} 
              onChange={e => updateApplicationData('additional_materials', e.target.value)} 
              rows={3} 
              className="font-inter" 
              placeholder="Any additional materials, links, or notes you'd like to include..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Step 4: Eligibility & Team Information</strong><br />
          Confirm your eligibility and provide detailed team information.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-inter mb-2">Women Leadership Percentage *</label>
          <Input 
            type="number" 
            min="0" 
            max="100" 
            value={applicationData.women_leadership_percentage} 
            onChange={e => updateApplicationData('women_leadership_percentage', parseInt(e.target.value))} 
            className="font-inter"
          />
          <p className="text-sm text-gray-500 mt-1">
            Required: {grantProgram?.eligibility_criteria?.women_leadership_percentage || 60}% minimum
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-inter mb-2">Progress Duration (months) *</label>
          <Input 
            type="number" 
            min="0" 
            value={applicationData.progress_duration_months} 
            onChange={e => updateApplicationData('progress_duration_months', parseInt(e.target.value))} 
            className="font-inter"
          />
          <p className="text-sm text-gray-500 mt-1">
            Required: {grantProgram?.eligibility_criteria?.progress_duration_months || 6} months minimum
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="working_prototype" 
          checked={applicationData.working_prototype} 
          onCheckedChange={(checked) => updateApplicationData('working_prototype', checked)}
        />
        <label htmlFor="working_prototype" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          We have a working prototype
        </label>
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Team Details *</label>
        <Textarea 
          value={applicationData.team_details} 
          onChange={e => updateApplicationData('team_details', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Describe your team members, their roles, expertise, and relevant experience. Include their backgrounds and how they contribute to the project..."
        />
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Project Overview *</label>
        <Textarea 
          value={applicationData.project_overview} 
          onChange={e => updateApplicationData('project_overview', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Provide a comprehensive overview of your project, including the technology stack, architecture, and key features..."
        />
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Development Roadmap *</label>
        <Textarea 
          value={applicationData.roadmap} 
          onChange={e => updateApplicationData('roadmap', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Detail your development roadmap with specific milestones, deliverables, and timelines for each phase..."
        />
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Vision & Impact *</label>
        <Textarea 
          value={applicationData.vision_impact} 
          onChange={e => updateApplicationData('vision_impact', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Describe your long-term vision for the project and the broader impact you aim to achieve in your industry or community..."
        />
      </div>

      <div>
        <label className="block text-gray-700 font-inter mb-2">Why This Grant? *</label>
        <Textarea 
          value={applicationData.why_grant} 
          onChange={e => updateApplicationData('why_grant', e.target.value)} 
          rows={4} 
          required 
          className="font-inter" 
          placeholder="Explain why you need this specific grant, how it will accelerate your project, and what makes you the right candidate for this funding..."
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Step 5: Final Review & Submission</strong><br />
          Review your application and submit. Make sure all information is accurate and complete.
        </AlertDescription>
      </Alert>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-green-800 mb-4">Application Summary</h4>
          <div className="space-y-3 text-sm">
            <div><strong>Project:</strong> {projects.find(p => p._id === applicationData.project_id)?.title}</div>
            <div><strong>Proposal Length:</strong> {applicationData.proposal.length} characters</div>
            <div><strong>Women Leadership:</strong> {applicationData.women_leadership_percentage}%</div>
            <div><strong>Progress Duration:</strong> {applicationData.progress_duration_months} months</div>
            <div><strong>Working Prototype:</strong> {applicationData.working_prototype ? 'Yes' : 'No'}</div>
            <div><strong>Pitch Video:</strong> {applicationData.pitch_video_url ? 'Uploaded' : 'Missing'}</div>
            <div><strong>Presentation:</strong> {applicationData.presentation_url ? 'Uploaded' : 'Missing'}</div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Before submitting, please ensure:</strong>
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>All required fields are completed</li>
            <li>Your pitch video and presentation are uploaded and accessible</li>
            <li>Your team meets the eligibility criteria</li>
            <li>All information is accurate and up-to-date</li>
            <li>You have reviewed your application thoroughly</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <Checkbox id="final_confirmation" required />
        <label htmlFor="final_confirmation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          I confirm that all information provided is accurate and complete
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    try {
      if (!grantProgram) {
        return <div className="text-center py-8">Loading grant program details...</div>;
      }
      
      switch (currentStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4();
        case 5: return renderStep5();
        default: return renderStep1();
      }
    } catch (error) {
      console.error('Error rendering step:', error);
      return <div className="text-center py-8 text-red-600">Error loading form. Please refresh the page.</div>;
    }
  };

  if (loading || !grantProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Application Form</h2>
            <p className="text-gray-600 text-center max-w-md">
              Please wait while we load the grant program details and your projects...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/grant-programs`)}
          className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-white/90 hover:bg-white text-amber-800 font-medium shadow-lg border border-amber-200 transition-all duration-200 hover:shadow-xl hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Grant Program
        </button>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 rounded-3xl bg-white/95 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <CardHeader className="pt-12 pb-8 flex flex-col items-center bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <div className="text-center space-y-3">
              <CardTitle className="text-4xl font-bold text-gray-900 font-martian">
                Grant Application
              </CardTitle>
              <p className="text-lg text-gray-600 font-inter max-w-2xl">
                Complete your application for <span className="font-semibold text-amber-800">{grantProgram?.title || 'Grant Program'}</span>
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-4"></div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-10 pb-10 px-8 lg:px-12">
            {/* Progress Indicator */}
            <div className="mb-10">
              {renderStepIndicator()}
            </div>

            {/* Requirements Checklist */}
            <div className="mb-10">
              {grantProgram && renderRequirementsChecklist()}
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                {renderCurrentStep()}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                  className="flex items-center gap-3 px-8 py-3 rounded-full border-2 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex items-center gap-3 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={submitting || !Object.values(requirementsMet).every(Boolean)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrantApply; 