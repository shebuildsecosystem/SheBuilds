/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { getEvents, deleteEvent, getUserProfile, createEvent, updateEvent, uploadFile, handleEventRegistration } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  image_public_id?: string;
  date: string;
  location: string;
  capacity: number;
  registered_participants: number;
  registration_required: boolean;
  external_registration_link?: string;
  is_active: boolean;
  created_by: {
    username: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    image_public_id: '',
    date: '',
    location: '',
    capacity: '',
    registration_required: true,
    external_registration_link: '',
    is_active: true
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchEvents();
    checkAdminStatus();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents({ active: true });
      setEvents(response.data.events || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const response = await getUserProfile();
      setIsAdmin(response.data.is_admin || false);
    } catch (err) {
      console.error('Failed to check admin status:', err);
    }
  };

  const handleCreateEvent = async () => {
    if (formData.registration_required && !formData.external_registration_link.trim()) {
      toast({ title: 'Error', description: 'External Registration Link is required when registration is required.', variant: 'destructive' });
      return;
    }
    try {
      await createEvent({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      setShowCreateDialog(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    if (formData.registration_required && !formData.external_registration_link.trim()) {
      toast({ title: 'Error', description: 'External Registration Link is required when registration is required.', variant: 'destructive' });
      return;
    }

    try {
      await updateEvent(selectedEvent._id, {
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      setShowEditDialog(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteEvent(eventId);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      image_public_id: '',
      date: '',
      location: '',
      capacity: '',
      registration_required: true,
      external_registration_link: '',
      is_active: true
    });
    setSelectedEvent(null);
    setImageFile(null);
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      image: event.image,
      image_public_id: (event as any).image_public_id || '',
      date: event.date.split('T')[0], // Convert to YYYY-MM-DD format
      location: event.location,
      capacity: event.capacity.toString(),
      registration_required: event.registration_required,
      external_registration_link: (event as any).external_registration_link || '',
      is_active: event.is_active
    });
    setShowEditDialog(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const response = await uploadFile(file, 'event-image');
      setFormData({
        ...formData,
        image: response.data.image.url,
        image_public_id: response.data.image.public_id
      });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 font-martian">
            Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter">
            Join our community events, workshops, and meetups to connect, learn, and grow together.
          </p>
          
          {isAdmin && (
            <div className="mt-8">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to create a new event.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Event title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Event description"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Event location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                          placeholder="Maximum participants"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">Event Image</Label>
                      <div className="space-y-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          }}
                          disabled={uploadingImage}
                        />
                        {formData.image && (
                          <div className="mt-2">
                            <img 
                              src={formData.image} 
                              alt="Event preview" 
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        {uploadingImage && (
                          <div className="text-sm text-gray-500">Uploading image...</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="registration_required"
                          checked={formData.registration_required}
                          onCheckedChange={(checked) => setFormData({ ...formData, registration_required: checked })}
                        />
                        <Label htmlFor="registration_required">Registration Required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                    </div>
                    {formData.registration_required && (
                      <div>
                        <Label htmlFor="external_link">External Registration Link *</Label>
                        <Input
                          id="external_link"
                          type="url"
                          value={formData.external_registration_link}
                          onChange={(e) => setFormData({ ...formData, external_registration_link: e.target.value })}
                          placeholder="https://forms.google.com/example or any external registration link"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Users will be redirected to this link for registration.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent}>Create Event</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {error ? (
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchEvents} className="mt-4">Retry</Button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No events found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  {!event.is_active && (
                    <Badge className="absolute top-2 right-2 bg-gray-500">Inactive</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="font-martian">{event.title}</CardTitle>
                  <CardDescription className="font-inter line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      Max participants {event.capacity}
                    </div>
                    {event.registration_required && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Registration required
                      </div>
                    )}
                    {event.external_registration_link && (
                      <div className="flex items-center text-sm text-blue-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        External registration link available
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4 pt-4 border-t">
                    {event.registration_required && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={async () => {
                          try {
                            const result = await handleEventRegistration(event._id, event.external_registration_link);
                            if (result.message) {
                              toast({
                                title: "Success",
                                description: result.message,
                              });
                              if (!event.external_registration_link) {
                                fetchEvents(); // Refresh to update participant count
                              }
                            }
                          } catch (err: any) {
                            toast({
                              title: "Error",
                              description: err.response?.data?.message || "Failed to register for event",
                              variant: "destructive",
                            });
                          }
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Register
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(event)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update the event details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Maximum participants"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-image">Event Image</Label>
                <div className="space-y-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                    disabled={uploadingImage}
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Event preview" 
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="text-sm text-gray-500">Uploading image...</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-registration_required"
                    checked={formData.registration_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, registration_required: checked })}
                  />
                  <Label htmlFor="edit-registration_required">Registration Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="edit-is_active">Active</Label>
                </div>
              </div>
              {formData.registration_required && (
                <div>
                  <Label htmlFor="edit-external_link">External Registration Link *</Label>
                  <Input
                    id="edit-external_link"
                    type="url"
                    value={formData.external_registration_link}
                    onChange={(e) => setFormData({ ...formData, external_registration_link: e.target.value })}
                    placeholder="https://forms.google.com/example or any external registration link"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Users will be redirected to this link for registration.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateEvent}>Update Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Events; 