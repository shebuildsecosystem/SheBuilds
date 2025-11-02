import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, uploadFile, deleteUserProfile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader as DialogHeaderUI, DialogTitle, DialogFooter as DialogFooterUI } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { Github, Linkedin, Twitter, MapPin, Globe, User2, Star, Heart, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SectionHeader = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon className="w-5 h-5 text-amber-600" />
    <h2 className="text-lg font-semibold text-gray-800 font-inter">{children}</h2>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile();
        setProfile(res.data);
      } catch (err: any) {
        toast({ title: 'Failed to load profile', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  // Form setup
  const form = useForm({
    defaultValues: {
      name: profile?.name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      timezone: profile?.timezone || '',
      skills: profile?.skills?.join(', ') || '',
      interests: profile?.interests?.join(', ') || '',
      github: profile?.social_links?.github || '',
      linkedin: profile?.social_links?.linkedin || '',
      twitter: profile?.social_links?.twitter || '',
      profile_picture: profile?.profile_picture || '',
      cover_image: profile?.cover_image || '',
    },
    values: profile ? undefined : {},
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        timezone: profile.timezone || '',
        skills: profile.skills?.join(', ') || '',
        interests: profile.interests?.join(', ') || '',
        github: profile.social_links?.github || '',
        linkedin: profile.social_links?.linkedin || '',
        twitter: profile.social_links?.twitter || '',
        profile_picture: profile.profile_picture || '',
        cover_image: profile.cover_image || '',
      });
      setPreviewUrl(profile.profile_picture || null);
      setCoverPreviewUrl(profile.cover_image || null);
    }
  }, [profile]);

  const onSubmit = async (data: any) => {
    try {
      const updateData = {
        ...data,
        skills: data.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        interests: data.interests.split(',').map((s: string) => s.trim()).filter(Boolean),
        social_links: {
          github: data.github,
          linkedin: data.linkedin,
          twitter: data.twitter,
        },
      };
      await updateUserProfile(updateData);
      toast({ title: 'Profile updated', description: 'Your profile has been updated.' });
      setEditOpen(false);
      // Refresh profile
      const res = await getUserProfile();
      setProfile(res.data);
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUserProfile();
      toast({ title: 'Profile deleted', description: 'Your profile has been deleted.' });
      // Log out and redirect
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.response?.data?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Show local preview
      setPreviewUrl(URL.createObjectURL(file));
      const res = await uploadFile(file, 'profile-picture');
      const url = res.data?.image?.url;
      if (url) {
        form.setValue('profile_picture', url);
        setPreviewUrl(url);
      } else {
        setUploadError('Failed to upload image.');
      }
    } catch (err: any) {
      setUploadError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    setCoverUploadError(null);
    try {
      setCoverPreviewUrl(URL.createObjectURL(file));
      const res = await uploadFile(file, 'cover-image');
      const url = res.data?.image?.url;
      if (url) {
        form.setValue('cover_image', url);
        setCoverPreviewUrl(url);
      } else {
        setCoverUploadError('Failed to upload image.');
      }
    } catch (err: any) {
      setCoverUploadError('Failed to upload image.');
    } finally {
      setCoverUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">Loading profile...</div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">No profile data found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-2 py-8 md:px-6 md:py-16">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 self-start mb-4 ml-2 px-4 py-2 rounded-full bg-white/80 hover:bg-orange-50 text-amber-800 font-medium shadow border border-amber-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
      <Card className="relative w-full max-w-2xl shadow-xl border-0 rounded-3xl bg-white/90 animate-fade-in-up overflow-hidden">
        {/* Banner/Cover */}
        <div className="h-32 md:h-40 w-full bg-gradient-to-r from-amber-200 to-orange-100 relative flex items-end justify-center">
          {/* Cover image overlay */}
          {profile.cover_image && (
            <img
              src={profile.cover_image}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover rounded-t-3xl z-0"
              style={{ opacity: 0.85 }}
            />
          )}
          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2 z-10">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg bg-white">
              {profile.profile_picture ? (
                <AvatarImage src={profile.profile_picture} alt={profile.name} />
              ) : (
                <AvatarFallback className="text-3xl">{profile.name ? profile.name[0] : '?'}</AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
        <CardHeader className="pt-20 pb-4 flex flex-col items-center bg-white/80 border-b border-gray-100">
          <CardTitle className="text-3xl font-bold text-gray-900 font-martian mb-1 flex items-center gap-2">
            {profile.name}
            {profile.is_verified && (
              <span className="ml-2 flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-inter"><CheckCircle2 className="w-4 h-4" />Verified</span>
            )}
          </CardTitle>
          <p className="text-base text-gray-500 font-inter flex items-center gap-1"><User2 className="w-4 h-4" />@{profile.username}</p>
          <p className="text-sm text-gray-400 font-inter mt-1 flex items-center gap-1"><Mail className="w-4 h-4" />{profile.email}</p>
          <p className="text-sm text-gray-400 font-inter mt-1">Joined {profile.joined_date ? new Date(profile.joined_date).toLocaleDateString() : ''}</p>
          {profile.portfolio_slug && (
            <a
              href={`/${profile.portfolio_slug}`}
              className="text-amber-700 hover:underline font-inter text-sm mt-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          )}
          {/* Project Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-base font-medium rounded-full font-inter" onClick={() => navigate('/projects/create')}>
              Add a Project
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 px-8 py-3 text-base font-medium font-inter" onClick={() => navigate(`/${profile.username}/projects`)}>
              Go to Projects
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 px-8 py-3 text-base font-medium font-inter" onClick={() => navigate('/grant-programs')}>
              Go to Grant Programs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-8 pb-4 px-6 bg-white/70">
          {/* Bio */}
          <div className="mb-2">
            <SectionHeader icon={Star}>Bio</SectionHeader>
            <div className="rounded-xl bg-orange-50/60 px-4 py-3 text-gray-700 font-inter min-h-[48px]">
              {profile.bio ? profile.bio : <span className="text-gray-400">No bio provided.</span>}
            </div>
          </div>
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionHeader icon={MapPin}>Location</SectionHeader>
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-gray-800 font-inter min-h-[32px]">
                {profile.location || <span className="text-gray-400">Not specified</span>}
              </div>
            </div>
            <div>
              <SectionHeader icon={Globe}>Timezone</SectionHeader>
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-gray-800 font-inter min-h-[32px]">
                {profile.timezone || <span className="text-gray-400">Not specified</span>}
              </div>
            </div>
          </div>
          {/* Skills & Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SectionHeader icon={Star}>Skills</SectionHeader>
              <div className="rounded-xl bg-amber-50/60 border border-amber-100 px-3 py-3 min-h-[48px] flex flex-wrap gap-2 items-start">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string, idx: number) => (
                    <span key={skill + idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-inter shadow-sm border border-amber-200 whitespace-nowrap">{skill}</span>
                  ))
                ) : (
                  <span className="text-gray-400">No skills listed</span>
                )}
              </div>
            </div>
            <div>
              <SectionHeader icon={Heart}>Interests</SectionHeader>
              <div className="rounded-xl bg-amber-50/60 border border-amber-100 px-3 py-3 min-h-[48px] flex flex-wrap gap-2 items-start">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest: string, idx: number) => (
                    <span key={interest + idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-inter shadow-sm border border-amber-200 whitespace-nowrap">{interest}</span>
                  ))
                ) : (
                  <span className="text-gray-400">No interests listed</span>
                )}
              </div>
            </div>
          </div>
          {/* Social Links */}
          <div>
            <SectionHeader icon={User2}>Social Links</SectionHeader>
            <div className="flex flex-wrap gap-4 items-center min-h-[32px]">
              {profile.social_links?.github && (
                <a
                  href={profile.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-gray-700 hover:text-black transition-colors"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 group-hover:text-[#333] group-hover:scale-110 transition-transform" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
              {profile.social_links?.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-gray-700 hover:text-[#0A66C2] transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 group-hover:text-[#0A66C2] group-hover:scale-110 transition-transform" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {profile.social_links?.twitter && (
                <a
                  href={profile.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1 text-gray-700 hover:text-[#1DA1F2] transition-colors"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5 group-hover:text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {!(profile.social_links?.github || profile.social_links?.linkedin || profile.social_links?.twitter) && (
                <span className="text-gray-400 text-sm">No social links</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-3 justify-end bg-white/80 border-t border-gray-100 px-6 py-4">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-amber-700 hover:bg-amber-800 text-white font-inter rounded-full shadow-md px-6 py-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
              <DialogHeaderUI className="bg-amber-50 px-6 py-4 border-b border-amber-100">
                <DialogTitle className="text-xl font-bold text-amber-900">Edit Profile</DialogTitle>
              </DialogHeaderUI>
              <div className="bg-white max-h-[80vh] overflow-y-auto px-6 py-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField name="name" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="bio" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="location" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="timezone" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="skills" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills (comma separated)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="interests" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests (comma separated)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="github" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="linkedin" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="twitter" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {/* Profile picture upload */}
                    <div className="flex flex-col gap-2">
                      <label className="font-medium text-sm">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-amber-200 bg-white">
                          {previewUrl ? (
                            <AvatarImage src={previewUrl} alt="Profile preview" />
                          ) : (
                            <AvatarFallback className="text-xl">{form.watch('name')?.[0] || '?'}</AvatarFallback>
                          )}
                        </Avatar>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                          disabled={uploading}
                        />
                      </div>
                      {uploading && <span className="text-xs text-amber-600">Uploading...</span>}
                      {uploadError && <span className="text-xs text-red-600">{uploadError}</span>}
                    </div>
                    {/* Cover image upload */}
                    <div className="flex flex-col gap-2 mt-4">
                      <label className="font-medium text-sm">Cover Image</label>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-16 rounded-xl overflow-hidden border-2 border-amber-200 bg-white flex items-center justify-center">
                          {coverPreviewUrl ? (
                            <img src={coverPreviewUrl} alt="Cover preview" className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-xs text-gray-400">No cover</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileChange}
                          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                          disabled={coverUploading}
                        />
                      </div>
                      {coverUploading && <span className="text-xs text-amber-600">Uploading...</span>}
                      {coverUploadError && <span className="text-xs text-red-600">{coverUploadError}</span>}
                    </div>
                    <DialogFooterUI className="gap-2 mt-4 flex justify-end">
                      <Button type="submit" variant="default" className="bg-amber-700 hover:bg-amber-800 text-white font-inter rounded-full px-6 py-2">Save</Button>
                      <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="rounded-full">Cancel</Button>
                    </DialogFooterUI>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="text-amber-700 border-amber-300 hover:bg-orange-50 font-inter rounded-full shadow-md px-6 py-2" onClick={() => navigate('/profile-setup')}>
            Edit Portfolio
          </Button>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="rounded-full shadow-md px-6 py-2">Delete Profile</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
              <DialogHeaderUI className="bg-red-50 px-6 py-4 border-b border-red-100">
                <DialogTitle className="text-xl font-bold text-red-900">Delete Profile</DialogTitle>
              </DialogHeaderUI>
              <div className="px-6 py-6 bg-white">
                <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete your profile? This action cannot be undone.</p>
                <DialogFooterUI className="gap-2 flex justify-end">
                  <Button variant="destructive" onClick={handleDelete} className="rounded-full px-6 py-2" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
                  <Button variant="ghost" onClick={() => setDeleteOpen(false)} className="rounded-full">Cancel</Button>
                </DialogFooterUI>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default Profile; 