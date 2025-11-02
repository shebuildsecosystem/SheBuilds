import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getUserProfile, updateUserProfile, uploadFile } from '../lib/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Plus, Trash2, UploadCloud, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MAX_PHOTOS = 6;

// --- Reusable TagInput Component ---
interface TagInputProps { value?: string[]; onChange: (tags: string[]) => void; placeholder: string; }
const TagInput: React.FC<TagInputProps> = ({ value = [], onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!value.includes(newTag)) {
                onChange([...value, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };
    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };
    return (
        <div className="flex flex-wrap items-center gap-2 border rounded-md p-2 bg-background min-h-[40px]">
            {value.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-inter">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 hover:text-red-600 focus:outline-none"><X className="w-3 h-3" /></button>
                </Badge>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-grow bg-transparent outline-none text-sm"
            />
        </div>
    );
};

// --- NEW: Dedicated Image Uploader Component ---
interface ImageUploaderProps {
    existingPhotos: string[];
    onRemoveExisting: (url: string) => void;
    newPhotos: File[];
    onRemoveNew: (index: number) => void;
    onAddPhotos: (files: File[]) => void;
}
const ImageUploader: React.FC<ImageUploaderProps> = ({ existingPhotos, onRemoveExisting, newPhotos, onRemoveNew, onAddPhotos }) => {
    const totalPhotos = existingPhotos.length + newPhotos.length;
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (totalPhotos + files.length > MAX_PHOTOS) {
                alert(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
                return;
            }
            onAddPhotos(files);
        }
    };
    return (
        <FormItem>
            <FormLabel>Your Photos ({totalPhotos}/{MAX_PHOTOS})</FormLabel>
            <FormDescription>Showcase your personality or work with a few photos.</FormDescription>
            <div className="flex flex-wrap gap-4 pt-2">
                {existingPhotos.map(url => (
                    <div key={url} className="relative w-28 h-28 group">
                        <img src={url} className="w-full h-full object-cover rounded-lg border" alt="Existing"/>
                        <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemoveExisting(url)}><X className="w-4 h-4"/></Button>
                    </div>
                ))}
                {newPhotos.map((file, i) => (
                    <div key={i} className="relative w-28 h-28 group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg border" alt="New"/>
                        <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemoveNew(i)}><X className="w-4 h-4"/></Button>
                    </div>
                ))}
                {totalPhotos < MAX_PHOTOS && (
                    <Label htmlFor="photo-upload" className="w-28 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
                        <UploadCloud className="w-8 h-8"/>
                        <span className="text-xs mt-1">Add Photo</span>
                    </Label>
                )}
            </div>
            <FormControl><Input id="photo-upload" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden"/></FormControl>
        </FormItem>
    );
};

// Zod schema for validation
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  themeColor: z.string(),
  musicLinks: z.array(z.object({ value: z.string().url("Must be a valid URL.").or(z.literal("")) })).optional(),
  journey: z.array(z.object({
    date: z.string().min(1, "Date is required."),
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
  })).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  social_links: z.object({
    github: z.string().url().or(z.literal("")).optional(),
    linkedin: z.string().url().or(z.literal("")).optional(),
    twitter: z.string().url().or(z.literal("")).optional(),
    instagram: z.string().url().or(z.literal("")).optional(),
    youtube: z.string().url().or(z.literal("")).optional(),
    calendly: z.string().url("Must be a valid URL.").or(z.literal("")).optional(),
  }).optional(),
  story: z.object({
    type: z.string(),
    text: z.string().optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const colorOptions = [
  { value: 'default', label: 'Default', color: 'bg-amber-400' },
  { value: 'white', label: 'Light', color: 'bg-white border' },
  { value: 'black', label: 'Dark', color: 'bg-black' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
];

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  // Fetch the user profile (raw response)
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(),
  });
  // Extract the actual profile data
  const profile = profileResponse?.data;

  // Set default values to prevent uncontrolled component warnings
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      timezone: '',
      themeColor: 'default',
      musicLinks: [{ value: '' }],
      journey: [{ date: '', title: '', description: '' }],
      skills: [],
      interests: [],
      social_links: { github: '', linkedin: '', twitter: '', instagram: '', youtube: '', calendly: '' },
      story: { type: 'text', text: '' },
    },
  });

  const { fields: musicFields, append: appendMusic, remove: removeMusic } = useFieldArray({
    control: form.control,
    name: "musicLinks",
  });
  const { fields: journeyFields, append: appendJourney, remove: removeJourney } = useFieldArray({
    control: form.control,
    name: "journey",
  });

  // Reset form when profile data is fetched
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        timezone: profile.timezone || '',
        themeColor: profile.themeColor || 'default',
        musicLinks: profile.musicLinks?.map((l: string) => ({ value: l })) || [{ value: '' }],
        journey: profile.journey?.length > 0 ? profile.journey : [{ date: '', title: '', description: '' }],
        skills: profile.skills || [],
        interests: profile.interests || [],
        social_links: profile.social_links || { github: '', linkedin: '', twitter: '', instagram: '', youtube: '', calendly: '' },
        story: profile.story || { type: 'text', text: '' },
      });
      setExistingPhotos(profile.photos || []);
    }
  }, [profile, form]);
  
  // Photo upload and removal handlers
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const totalPhotos = existingPhotos.length + newPhotos.length + files.length;
        if (totalPhotos > MAX_PHOTOS) {
            toast({ title: 'Photo limit reached', description: `You can upload a maximum of ${MAX_PHOTOS} photos.`, variant: 'destructive' });
            return;
        }
        setNewPhotos(prev => [...prev, ...files]);
    }
  };

  const handleRemoveExistingPhoto = (url: string) => setExistingPhotos(prev => prev.filter(p => p !== url));
  const handleRemoveNewPhoto = (index: number) => setNewPhotos(prev => prev.filter((_, i) => i !== index));

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      let uploadedPhotoUrls: string[] = [];
      if (newPhotos.length > 0) {
        const uploadPromises = newPhotos.map(file => uploadFile(file, 'profile-picture'));
        const results = await Promise.all(uploadPromises);
        uploadedPhotoUrls = results.map(res => res.data.image.url);
      }

      const finalPayload = {
        ...data,
        musicLinks: data.musicLinks?.map(link => link.value).filter(Boolean),
        photos: [...existingPhotos, ...uploadedPhotoUrls],
      };
      
      const response = await updateUserProfile(finalPayload);
      
      // Invalidate queries to refetch fresh data elsewhere
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile', response.data.user.username] });

      toast({ title: 'Success', description: 'Your profile has been updated!' });
      navigate(`/${response.data.user.username}`);

    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.message || 'Failed to update profile', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-8"><Skeleton className="h-96 w-full" /></div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold font-sans text-gray-800">Edit Your Profile</h1>
                <p className="text-gray-500 mt-1">This information will be displayed on your public profile.</p>
            </div>
            <Button variant="outline" onClick={() => navigate(`/${profile?.username}`)}>
                <Eye className="w-4 h-4 mr-2"/>
                View Public Profile
            </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Core Info Card */}
            <Card>
              <CardHeader><CardTitle>Core Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                )}/>
                
                {/* THE FIX: Add Location and Timezone fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="e.g., Delhi, India" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="timezone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl><Input placeholder="e.g., Asia/Kolkata" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>
              </CardContent>
            </Card>

            {/* Appearance & Photos Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance & Photos</CardTitle>
                    <CardDescription>Customize your profile's look and feel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Controller control={form.control} name="themeColor" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Theme</FormLabel>
                            <div className="flex flex-wrap gap-4 pt-2">
                                {colorOptions.map(opt => (
                                    <label key={opt.value} className="flex flex-col items-center cursor-pointer gap-2" onClick={() => field.onChange(opt.value)}>
                                        <input type="radio" {...field} value={opt.value} checked={field.value === opt.value} className="hidden" />
                                        <span className={`w-10 h-10 rounded-full border-2 ${opt.color} ${field.value === opt.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}></span>
                                        <span className="text-xs">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </FormItem>
                    )}/>
                    <ImageUploader 
                        existingPhotos={existingPhotos} 
                        newPhotos={newPhotos}
                        onAddPhotos={(files) => setNewPhotos(prev => [...prev, ...files])}
                        onRemoveExisting={handleRemoveExistingPhoto}
                        onRemoveNew={handleRemoveNewPhoto}
                    />
                </CardContent>
            </Card>
            
            {/* Journey & Skills Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Builder Journey & Skills</CardTitle>
                    <CardDescription>Showcase your experience and expertise.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Journey</Label>
                        <FormDescription className="mb-2">Chronicle your most important milestones.</FormDescription>
                        {journeyFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 mb-2 items-start">
                                <Controller control={form.control} name={`journey.${index}.date`} render={({ field }) => <FormItem><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>}/>
                                <Controller control={form.control} name={`journey.${index}.title`} render={({ field }) => <FormItem><FormControl><Input placeholder="Title" {...field} /></FormControl><FormMessage /></FormItem>}/>
                                <Controller control={form.control} name={`journey.${index}.description`} render={({ field }) => <FormItem><FormControl><Input placeholder="Description" {...field} /></FormControl><FormMessage /></FormItem>}/>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeJourney(index)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendJourney({ date: '', title: '', description: '' })}><Plus className="w-4 h-4 mr-2"/>Add Journey Step</Button>
                    </div>
                    <Controller control={form.control} name="skills" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Technical Skills</FormLabel>
                            <FormControl><TagInput {...field} placeholder="Type a skill and press Enter..."/></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <Controller control={form.control} name="interests" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Soft Skills & Interests</FormLabel>
                            <FormControl><TagInput {...field} placeholder="Type an interest and press Enter..."/></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>
            
            {/* Links Card */}
            <Card>
              <CardHeader><CardTitle>Social & Music Links</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="social_links.github" render={({ field }) => ( <FormItem><FormLabel>GitHub</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="social_links.linkedin" render={({ field }) => ( <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="social_links.twitter" render={({ field }) => ( <FormItem><FormLabel>Twitter</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="social_links.instagram" render={({ field }) => ( <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="social_links.youtube" render={({ field }) => ( <FormItem><FormLabel>YouTube</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="social_links.calendly" render={({ field }) => (
                  <FormItem><FormLabel>Cal.com/Calendly Link</FormLabel><FormControl><Input placeholder="https://cal.com/your-link or https://calendly.com/your-link" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <div>
                  <Label className="mb-2 block">Music Links (Spotify Track URLs)</Label>
                  <p className="text-xs text-gray-500 mb-2">
                      Add up to 3 public Spotify track links. Find a song, click "Share", then "Copy Song Link".
                  </p>
                  {musicFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-center">
                      <Controller control={form.control} name={`musicLinks.${index}.value`} render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl><Input placeholder="https://open.spotify.com/track/..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                      )}/>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMusic(index)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                    </div>
                  ))}
                  {musicFields.length < 3 && (
                     <Button type="button" variant="outline" size="sm" onClick={() => appendMusic({ value: '' })}><Plus className="w-4 h-4 mr-2"/>Add Music Link</Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSetup;