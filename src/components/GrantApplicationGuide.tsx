import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Video, 
  Presentation, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  Users, 
  Target, 
  DollarSign,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Award,
  Calendar
} from 'lucide-react';

interface GrantApplicationGuideProps {
  onClose: () => void;
  grantTitle?: string;
}

const GrantApplicationGuide: React.FC<GrantApplicationGuideProps> = ({ onClose, grantTitle }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-martian">
                  Grant Application Guide
                </h2>
                <p className="text-gray-600 font-inter">
                  {grantTitle ? `Complete guide for ${grantTitle}` : 'Complete guide for grant applications'}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Overview */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-amber-800 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Application Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">
                Our grant application process is designed to be comprehensive yet straightforward. 
                It consists of 5 main steps that help us understand your project, team, and vision.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: 1, title: 'Project Selection', icon: Target },
                  { step: 2, title: 'Basic Information', icon: FileText },
                  { step: 3, title: 'Required Materials', icon: Video },
                  { step: 4, title: 'Eligibility & Team', icon: Users },
                  { step: 5, title: 'Final Review', icon: CheckCircle }
                ].map(({ step, title, icon: Icon }) => (
                  <div key={step} className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="text-sm font-medium text-amber-800">{step}</div>
                    <div className="text-xs text-amber-600">{title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required Materials */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Required Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pitch Video */}
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Video className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold text-red-800">Pitch Video</h4>
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-red-700">
                    <p><strong>Duration:</strong> 2-3 minutes maximum</p>
                    <p><strong>Format:</strong> YouTube or Vimeo URL</p>
                    <p><strong>Content must include:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Team introduction (30 seconds)</li>
                      <li>Problem statement and solution (1 minute)</li>
                      <li>Project overview and innovation (1 minute)</li>
                      <li>Expected impact and funding request (30 seconds)</li>
                    </ul>
                  </div>
                </div>

                {/* Presentation */}
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Presentation className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold text-red-800">Presentation (PPT/PDF)</h4>
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-red-700">
                    <p><strong>Length:</strong> 10-15 slides maximum</p>
                    <p><strong>Format:</strong> Google Drive or Dropbox URL</p>
                    <p><strong>Must include:</strong></p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Executive summary (1 slide)</li>
                      <li>Problem and solution (2-3 slides)</li>
                      <li>Market analysis (2 slides)</li>
                      <li>Business model (2 slides)</li>
                      <li>Team and timeline (2 slides)</li>
                      <li>Financial projections (2 slides)</li>
                      <li>Risk assessment (1 slide)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Optional Materials */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Additional Materials (Optional)</h4>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>You may also include:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Demo video of your prototype</li>
                    <li>Technical documentation</li>
                    <li>Market research reports</li>
                    <li>Customer testimonials</li>
                    <li>Press coverage or media mentions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">Team Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Women Leadership</p>
                        <p className="text-sm text-blue-700">Minimum 30% women in leadership roles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Progress Duration</p>
                        <p className="text-sm text-blue-700">Minimum 6 months of project development</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">Project Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Working Prototype</p>
                        <p className="text-sm text-blue-700">Functional prototype or MVP required</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Funding Need</p>
                        <p className="text-sm text-blue-700">Clear justification for grant amount</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Success */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-800">For Your Pitch Video</h4>
                  <ul className="space-y-2 text-sm text-green-700">
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
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Include visual demonstrations if possible</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-green-800">For Your Application</h4>
                  <ul className="space-y-2 text-sm text-green-700">
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
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Provide realistic timelines and milestones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-purple-800">Submit Application</h4>
                    <p className="text-sm text-purple-700">Complete all 5 steps and submit</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-purple-800">Review Process</h4>
                    <p className="text-sm text-purple-700">Applications reviewed by panel</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-purple-800">Announcement</h4>
                    <p className="text-sm text-purple-700">Winners announced publicly</p>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> The review process typically takes 2-4 weeks. 
                    All applicants will be notified of the results via email.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-orange-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800">Application Mistakes</h4>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Incomplete or rushed applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Generic proposals not tailored to the grant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Unrealistic budget or timeline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Missing required materials</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800">Video & Presentation Mistakes</h4>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Poor audio/video quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Too long or too short content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Reading from script without enthusiasm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">✗</span>
                      <span>Technical jargon without explanation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-emerald-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Ready to Apply?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-emerald-700">
                  Now that you understand the application process, you're ready to start your application!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={onClose}
                  >
                    Start Application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={onClose}
                  >
                    Close Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrantApplicationGuide; 