import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAnnouncements } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Megaphone, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    name: string;
  };
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAnnouncements();
      setAnnouncements(response.data?.announcements || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load announcements');
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-amber-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 font-martian">Announcements</h1>
          </div>
          <p className="text-gray-600 font-inter">
            Stay updated with the latest news and important updates from SheBuilds
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements Yet</h3>
            <p className="text-gray-600">Check back later for updates and important news.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <Card 
                key={announcement._id} 
                className="border-amber-100 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white"
                onClick={() => {
                  setSelectedAnnouncement(announcement);
                  setShowAnnouncementDialog(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 font-inter">
                      {announcement.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex-shrink-0 ml-2">
                      Announcement
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(announcement.created_at)}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{formatTime(announcement.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed font-inter line-clamp-3">
                      {announcement.message}
                    </p>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Click to read more
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Announcement Detail Dialog */}
        {showAnnouncementDialog && selectedAnnouncement && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-0 min-w-[320px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-8 pt-8 pb-0 border-b border-amber-100">
                <h3 className="text-lg font-bold mb-4">Announcement Details</h3>
              </div>
              <div className="px-8 py-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <div className="text-xl font-semibold text-amber-800">{selectedAnnouncement.title}</div>
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
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(selectedAnnouncement.created_at)}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {formatTime(selectedAnnouncement.created_at)}
                      </div>
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
    </div>
  );
};

export default Announcements; 