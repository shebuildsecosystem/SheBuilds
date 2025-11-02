import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '../components/Navbar';

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const UserGrants: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!isLoggedIn) {
      setError('You must be logged in to view your grant applications.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api.get('/grant-applications/my-applications')
      .then(res => {
        setApplications(res.data.applications || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Grant applications error:', err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setError('You must be logged in to view your grant applications.');
        } else if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load your grant applications.');
        }
        setLoading(false);
      });
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/80 hover:bg-orange-50 text-amber-800 font-medium shadow border border-amber-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        <h1 className="text-3xl font-bold mb-6 text-amber-800">My Grant Applications</h1>
        {loading ? (
          <div className="animate-pulse text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : applications.length === 0 ? (
          <div className="text-gray-500">You have not applied for any grants yet.</div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <Card key={app._id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg text-amber-900">{app.project_id?.title || 'Project'}</div>
                  <div className="text-sm text-gray-600">Grant: {app.grant_program_id?.title || '-'}</div>
                  <div className="text-xs text-gray-500 mt-1">Submitted: {new Date(app.submitted_date || app.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <Badge className={`w-fit ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge>
                  <Button size="sm" variant="outline" onClick={() => { setSelected(app); setShowModal(true); }}>View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Details Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg min-w-[320px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 pt-8">
              <h3 className="text-lg font-bold mb-4">View Application</h3>
              <Button size="sm" variant="outline" onClick={() => { setShowModal(false); setSelected(null); }}>✕</Button>
            </div>
            <div className="px-8 py-6 space-y-6">
              <div>
                <div className="font-semibold text-xl text-amber-800 mb-1">{selected.project_id?.title || 'Project'}</div>
                <div className="text-sm text-gray-600 mb-2">Grant: {selected.grant_program_id?.title || '-'}</div>
                <Badge className={`w-fit ${statusColors[selected.status] || 'bg-gray-100 text-gray-700'}`}>{selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}</Badge>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Submitted: {new Date(selected.submitted_date || selected.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500 mb-1">Women Leadership: {selected.women_leadership_percentage}%</div>
                <div className="text-xs text-gray-500 mb-1">Progress Duration: {selected.progress_duration_months} months</div>
                <div className="text-xs text-gray-500 mb-1">Working Prototype: {selected.working_prototype ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Proposal</h5>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.proposal || 'No proposal available'}</div>
              </div>
              {selected.budget_breakdown && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Budget Breakdown</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.budget_breakdown}</div>
                </div>
              )}
              {selected.timeline && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Timeline</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.timeline}</div>
                </div>
              )}
              {selected.expected_impact && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Expected Impact</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.expected_impact}</div>
                </div>
              )}
              {selected.team_details && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Team Details</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.team_details}</div>
                </div>
              )}
              {selected.project_overview && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Project Overview</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.project_overview}</div>
                </div>
              )}
              {selected.roadmap && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Roadmap</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.roadmap}</div>
                </div>
              )}
              {selected.vision_impact && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Vision & Impact</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.vision_impact}</div>
                </div>
              )}
              {selected.why_grant && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Why This Grant</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.why_grant}</div>
                </div>
              )}
              {(selected.pitch_video_url || selected.presentation_url || selected.demo_video_url) && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Media Links</h5>
                  <div className="space-y-2">
                    {selected.pitch_video_url && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Pitch Video:</span>
                        <a href={selected.pitch_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Video</a>
                      </div>
                    )}
                    {selected.presentation_url && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Presentation:</span>
                        <a href={selected.presentation_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Presentation</a>
                      </div>
                    )}
                    {selected.demo_video_url && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Demo Video:</span>
                        <a href={selected.demo_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Demo</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selected.additional_materials && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Additional Materials</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.additional_materials}</div>
                </div>
              )}
              {selected.review_notes && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Review Notes</h5>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">{selected.review_notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGrants; 