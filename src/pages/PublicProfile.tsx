import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getPublicUserProfile, getUserProfile } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Github, Linkedin, Twitter, Eye, BookOpen, Rocket, Computer, Sparkles, Music, Pencil, X, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// --- Type Definitions for API Data ---

/** Defines the structure for social media links. */
interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  calendly?: string;
}

/** A structured journey log entry. */
interface JourneyLog {
  _id: string;
  date: string;
  title: string;
  description: string;
  tags?: string[];
}

/** The legacy progress log format. */
interface ProgressLog {
  _id:string;
  createdAt: string;
  content: string;
}

/** A combined type to gracefully handle both new and legacy log formats. */
type CombinedLog = Partial<JourneyLog> & Partial<ProgressLog>;

/** A user's project. */
interface Project {
  _id: string;
  title: string;
  description: string;
  cover_image?: string;
  project_url?: string;
  tags?: string[];
}

/** The main user profile structure. */
interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  cover_image?: string;
  skills?: string[];
  social_links?: SocialLinks;
  portfolio_slug?: string;
  themeColor?: keyof typeof THEMES;
  photos?: string[];
  musicLinks?: string[];
  journey?: JourneyLog[];
}

/** The complete data structure returned by the public profile API endpoint. */
interface ProfileData {
  user: User;
  projects: Project[];
  progress_logs: ProgressLog[];
}


// --- Reusable Icon Components ---
const icons = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
};

// --- THEME DEFINITIONS ---
const THEMES = {
  default: { // Amber/Orange Theme
    bg: "from-orange-50 via-amber-50 to-white",
    card: "bg-white/80 border-amber-100 backdrop-blur-sm",
    textHeader: "text-gray-800",
    textBody: "text-gray-600",
    textAccent: "text-amber-700",
    button: "bg-amber-200 hover:bg-amber-300 text-amber-900 border border-amber-300",
    socialBg: "bg-amber-100",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    timelineDot: "bg-amber-400",
  },
  purple: { // Purple Theme
    bg: "from-purple-50 via-fuchsia-50 to-white",
    card: "bg-white/80 border-purple-100 backdrop-blur-sm",
    textHeader: "text-indigo-900",
    textBody: "text-gray-600",
    textAccent: "text-purple-600",
    button: "bg-purple-200 hover:bg-purple-300 text-purple-900 border border-purple-300",
    socialBg: "bg-purple-100",
    badge: "bg-purple-100 text-purple-800 border-purple-200",
    timelineDot: "bg-purple-400",
  },
  pink: {
    bg: "from-pink-50 via-fuchsia-50 to-white",
    card: "bg-white/80 border-pink-100 backdrop-blur-sm",
    textHeader: "text-pink-900",
    textBody: "text-gray-600",
    textAccent: "text-pink-600",
    button: "bg-pink-200 hover:bg-pink-300 text-pink-900 border border-pink-300",
    socialBg: "bg-pink-100",
    badge: "bg-pink-100 text-pink-800 border-pink-200",
    timelineDot: "bg-pink-400",
  },
  blue: { bg: "from-blue-50 via-cyan-50 to-white", card: "bg-white/80 border-blue-100", textHeader: "text-blue-900", textBody: "text-gray-600", textAccent: "text-blue-600", button: "bg-blue-200 hover:bg-blue-300 text-blue-900 border border-blue-300", socialBg: "bg-blue-100", badge: "bg-blue-100 text-blue-800 border-blue-200", timelineDot: "bg-blue-400" },
  black: {
    bg: "from-gray-900 via-black to-gray-800",
    card: "bg-gray-800/80 border-gray-700 backdrop-blur-sm",
    textHeader: "text-gray-100",
    textBody: "text-gray-400",
    textAccent: "text-amber-400",
    button: "bg-gray-700 hover:bg-gray-600 text-amber-400 border border-gray-600",
    socialBg: "bg-gray-700",
    badge: "bg-gray-700 text-gray-200 border-gray-600",
    timelineDot: "bg-amber-500",
  },
  white: { bg: "from-gray-100 via-white to-gray-50", card: "bg-white/90 border-gray-200", textHeader: "text-gray-800", textBody: "text-gray-600", textAccent: "text-gray-900", button: "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300", socialBg: "bg-gray-100", badge: "bg-gray-200 text-gray-800 border-gray-300", timelineDot: "bg-gray-400" },
};

type Theme = typeof THEMES.default;

// --- Reusable Helper Components ---
const StatCard = ({ icon: Icon, label, value, theme }: { icon: React.ElementType, label:string, value: string | number, theme: Theme }) => (
  <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1 border cursor-pointer hover:shadow-lg')}>
    <div className={cn("mb-3 flex items-center justify-center w-12 h-12 rounded-full border", theme.socialBg, theme.textAccent)}>
      <Icon className={cn("w-7 h-7", theme.textAccent)} />
    </div>
    <div className={cn("text-3xl font-bold mb-1", theme.textHeader)}>
      {value}
    </div>
    <div className={cn("text-xs font-bold tracking-widest uppercase mt-1", theme.textBody)}>
      {label}
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message }: { icon: React.ElementType, message: string }) => (
  <div className="flex flex-grow flex-col items-center justify-center text-center py-8">
    <Icon className="w-10 h-10 mb-3 text-gray-400" />
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

const MusicPlayer = ({ url, themeKey }: { url: string, themeKey: keyof typeof THEMES }) => {
  const getEmbedUrl = (spotifyUrl: string, theme: keyof typeof THEMES): string | null => {
    try {
      const urlObj = new URL(spotifyUrl);
      if (urlObj.hostname !== 'open.spotify.com') return null;
      const pathParts = urlObj.pathname.split('/');
      if (pathParts[1] === 'track' && pathParts[2]) {
        const isDark = theme === 'black';
        return `https://open.spotify.com/embed/track/${pathParts[2]}?theme=${isDark ? '1' : '0'}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(url, themeKey);

  if (!embedUrl) {
    return (
      <div className={cn("rounded-xl p-3 text-xs text-center opacity-70", THEMES[themeKey].socialBg, THEMES[themeKey].textBody)}>
        Invalid Spotify Link
      </div>
    );
  }

  return (
    <iframe
      style={{ borderRadius: '12px' }}
      src={embedUrl}
      width="100%"
      height="80"
      frameBorder="0"
      allowFullScreen={false}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title={`Spotify Player for ${url}`}
    ></iframe>
  );
};

// --- Skeleton Component ---
const PublicProfileSkeleton = () => (
    <main className="min-h-screen bg-gray-50 font-inter px-4 md:px-12 lg:px-24 pt-12 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">
            <aside className="h-fit lg:sticky lg:top-8">
                <Skeleton className="w-full h-40 rounded-t-3xl"/>
                <div className="bg-white/90 rounded-b-3xl p-8 pt-20 flex flex-col items-center gap-6 -mt-16 relative">
                    <Skeleton className="w-32 h-32 rounded-2xl absolute -top-16 border-4 border-white"/>
                    <div className="flex flex-col items-center w-full pt-16">
                        <Skeleton className="h-7 w-48 mt-2" />
                        <Skeleton className="h-5 w-32 mt-2" />
                        <Skeleton className="h-4 w-40 mt-1" />
                        <Skeleton className="h-10 w-32 mt-4 rounded-full" />
                        <Skeleton className="h-12 w-full mt-4" />
                    </div>
                    <div className="flex gap-4 justify-center mt-2">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <Skeleton className="w-10 h-10 rounded-lg" />
                    </div>
                </div>
            </aside>
            <section className="flex flex-col gap-8">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
            </section>
        </div>
    </main>
);

// --- Main Profile Component ---
const PublicProfile: React.FC = () => {
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showWorksModal, setShowWorksModal] = useState(false);
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const { data: profileData, isLoading, isError, error } = useQuery<ProfileData, Error>({
      queryKey: ['publicProfile', username],
      queryFn: () => getPublicUserProfile(username!).then(res => res.data),
      enabled: !!username,
    });

    console.log('URL username param:', username);
    console.log('Profile data:', profileData);
    console.log('Is loading:', isLoading);
    console.log('Is error:', isError);
    const { data: currentUserData } = useQuery<{username: string}, Error>({
      queryKey: ['currentUser'],
      queryFn: () => getUserProfile().then(res => res.data),
      enabled: isLoggedIn,
    });

    const isOwner = useMemo(() => currentUserData?.username === profileData?.user?.username, [currentUserData, profileData]);

    if (isLoading) return <PublicProfileSkeleton />;
    if (isError || !profileData) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen text-red-500 bg-gray-50">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p>{error?.message || 'This user does not exist or has not set up their profile.'}</p>
          <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
        </div>
      );
    }

    const { user, projects, progress_logs } = profileData;
    console.log('User data in PublicProfile:', user);
    console.log('User username:', user?.username);
    
    const themeKey = user.themeColor && THEMES[user.themeColor] ? user.themeColor : 'default';
    const theme = THEMES[themeKey];
    const allPhotos = user.photos || [];

    const journeyLogs: CombinedLog[] = user.journey && user.journey.length > 0 ? user.journey : progress_logs;

    return (
      <>
        <main className={cn("min-h-screen bg-gradient-to-br font-inter relative overflow-x-hidden px-2 sm:px-4 md:px-8 pt-8 pb-8 transition-colors duration-500", theme.bg)}>
          {/* Back Button */}
          <div className="max-w-7xl mx-auto mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className={cn("text-gray-600 hover:text-gray-900 font-inter", theme.textBody)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(120px,auto)] gap-6"
            style={{ gridAutoFlow: 'dense' }}
          >
            {/* Profile Card */}
            <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col items-center col-span-full sm:col-span-2 row-span-2 transition-all duration-200 hover:-translate-y-1 border')}>
              <div className="w-full h-28 sm:h-32 rounded-t-2xl overflow-hidden -mx-6 -mt-6">
                {user?.cover_image && <img src={user.cover_image} alt="Cover" className="w-full h-full object-cover" /> }
              </div>
              <div className="relative w-full flex flex-col items-center mt-[-64px] z-10">
                <div className={cn("w-28 h-28 rounded-2xl border-4 overflow-hidden shadow-lg flex items-center justify-center", theme.card, "border-white")}>
                   <img src={user?.profile_picture || "/placeholder.svg"} alt={user?.name} className="w-full h-full object-cover"/>
                </div>
                 {isOwner && (
                  <button onClick={() => navigate('/profile-setup')} className={cn("absolute bottom-0 right-[calc(50%-60px)] w-8 h-8 flex items-center justify-center rounded-full shadow-md border-2 z-20 transition-all", themeKey === 'black' ? 'bg-amber-400 border-gray-800 hover:bg-amber-300' : 'bg-white border-white hover:bg-gray-100')} title="Edit Profile">
                    <Pencil className={cn("w-4 h-4", themeKey === 'black' ? 'text-gray-900' : 'text-gray-700')} />
                  </button>
                )}
              </div>
              <div className="pt-4 pb-2 px-2 w-full flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-500 font-medium">Available for work</span>
                </div>
                <h1 className={cn("text-3xl font-extrabold mb-1", theme.textHeader)}>{user?.name || 'No Name'}</h1>
                <p className={cn("text-lg font-mono", theme.textAccent)}>@{user?.username}</p>
                {user?.portfolio_slug && <p className={cn("text-xs mt-1", theme.textBody)}>shebuildsecosystem.com/{user.portfolio_slug}</p>}
                <p className={cn("text-base mt-3 mb-4", theme.textBody)}>{user?.bio}</p>
                <div className="flex gap-3 justify-center mt-auto">
                    {user?.social_links?.github && <a href={user.social_links.github} className={cn("rounded-lg p-2 transition-colors", theme.socialBg, theme.textAccent)} title="GitHub" target="_blank" rel="noopener noreferrer">{icons.github}</a>}
                    {user?.social_links?.linkedin && <a href={user.social_links.linkedin} className={cn("rounded-lg p-2 transition-colors", theme.socialBg, theme.textAccent)} title="LinkedIn" target="_blank" rel="noopener noreferrer">{icons.linkedin}</a>}
                    {user?.social_links?.twitter && <a href={user.social_links.twitter} className={cn("rounded-lg p-2 transition-colors", theme.socialBg, theme.textAccent)} title="Twitter" target="_blank" rel="noopener noreferrer">{icons.twitter}</a>}
                </div>
              </div>
            </div>

            <div className="col-span-1 row-span-1">
              <button 
                onClick={() => {
                  console.log('User object:', user);
                  console.log('User username:', user?.username);
                  console.log('User username type:', typeof user?.username);
                  if (user?.username) {
                    const url = '/' + user.username + '/projects';
                    console.log('Navigating to:', url);
                    navigate(url);
                  }
                }}
                className="w-full h-full transition-transform duration-200 hover:scale-105 focus:outline-none"
                title={`View ${user?.name || user?.username}'s projects`}
                disabled={!user?.username}
              >
                <StatCard icon={Rocket} label="Projects" value={projects?.length || 0} theme={theme} />
              </button>
            </div>
            <div className="col-span-1 row-span-1">
              <div 
                className="w-full h-full cursor-pointer"
                title="Progress logs coming soon!"
              >
                <StatCard icon={BookOpen} label="Progress" value={journeyLogs?.length || 0} theme={theme} />
              </div>
            </div>

            <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col col-span-full sm:col-span-2 transition-all duration-200 hover:-translate-y-1 border')}>
              <h3 className={cn("text-base font-semibold mb-3 flex items-center gap-2", theme.textHeader)}><Computer className="w-5 h-5 opacity-80" /> Tech Stack</h3>
              {user?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">{user.skills.map((skill) => <Badge key={skill} variant="secondary" className={cn("font-medium", theme.badge)}>{skill}</Badge>)}</div>
              ) : <EmptyState icon={Computer} message="No skills listed." />}
            </div>
            
            <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col col-span-full sm:col-span-2 transition-all duration-200 hover:-translate-y-1 border')}>
                <h3 className={cn("text-base font-semibold mb-3 flex items-center gap-2", theme.textHeader)}><Rocket className="w-5 h-5 opacity-80" /> Works Gallery</h3>
                {projects?.length > 0 ? (
                    <div className="flex-grow grid grid-cols-3 gap-3 mb-4">
                        {projects.slice(0, 3).map((project) => (
                           <button
                             key={project._id}
                             onClick={() => setShowWorksModal(true)}
                             className="relative aspect-square rounded-lg overflow-hidden group border-2 border-transparent hover:border-current transition-all duration-300 focus:border-current focus:outline-none"
                           >
                            {project.cover_image ? (
                              <>
                                <img src={project.cover_image} alt={project.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                    <span className="text-white text-xs font-bold text-center w-full truncate">{project.title}</span>
                                </div>
                              </>
                            ) : (
                              <div className={cn("flex items-center justify-center w-full h-full p-2 text-center transition-colors", theme.socialBg, "group-hover:opacity-80")}>
                                <span className={cn("text-xs font-semibold", theme.textHeader)}>{project.title}</span>
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                ) : <EmptyState icon={Rocket} message="No works to show yet." />}
                <div className="flex gap-2 mt-auto">
                  <Button onClick={() => setShowWorksModal(true)} className={cn("flex-1", theme.button)}>View All Works</Button>
                  <Button 
                    onClick={() => {
                      console.log('User object in button:', user);
                      console.log('User username in button:', user?.username);
                      console.log('User username type in button:', typeof user?.username);
                      if (user?.username) {
                        const url = '/' + user.username + '/projects';
                        console.log('Navigating to from button:', url);
                        navigate(url);
                      }
                    }} 
                    className={cn("flex-1", theme.button)}
                    variant="outline"
                    disabled={!user?.username}
                  >
                    View Projects
                  </Button>
                </div>
            </div>
            
            <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col col-span-full sm:col-span-2 justify-between transition-all duration-200 hover:-translate-y-1 border')}>
                <h3 className={cn("text-base font-semibold flex items-center gap-2 mb-4", theme.textHeader)}><Sparkles className={cn("w-5 h-5", theme.textAccent)} /> Contact & Online Presence</h3>
                <div className={cn("rounded-2xl p-4 flex flex-col items-center text-center shadow-inner", theme.card, "border")}>
                    <p className={cn("text-lg font-bold mb-1", theme.textHeader)}>Let's Work Together</p>
                    <p className={cn("text-xs mb-4", theme.textBody)}>Interested in collaborating? Reach out!</p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <a href={`mailto:${user?.email || ''}`} className={cn("flex-1 rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2", theme.button)}>Email Me</a>
                        <Button asChild className={cn("flex-1", theme.button)} disabled={!user?.social_links?.calendly}>
                          <a href={user?.social_links?.calendly} target="_blank" rel="noopener noreferrer">Schedule a Call</a>
                        </Button>
                    </div>
                </div>
            </div>

            <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col col-span-full sm:col-span-2 transition-all duration-200 hover:-translate-y-1 border')}>
              <h3 className={cn("text-lg font-bold flex items-center gap-3 mb-6", theme.textHeader)}><BookOpen className="w-5 h-5 opacity-80" /> Builder Journey</h3>
              {journeyLogs?.length > 0 ? (
                <div className="relative space-y-4 max-h-[350px] overflow-y-auto pr-3 -mr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {journeyLogs.map((log, idx) => (
                    <div key={log._id} className="relative flex items-start group pl-6">
                      <div className={cn("absolute left-0 top-1 w-4 h-4 rounded-full border-2 z-10 transition-all", theme.timelineDot, themeKey === 'black' ? 'border-amber-400 bg-amber-400' : 'border-white shadow-sm', "group-hover:scale-110")} />
                      {idx < journeyLogs.length - 1 && <div className={cn("absolute left-[7px] top-4 w-0.5 h-full", themeKey === 'black' ? 'bg-gray-700' : 'bg-gray-200')} />}
                      <div className="flex-1">
                        <p className={cn("text-xs mb-1", theme.textBody)}>
                          {new Date(log.date || log.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <h4 className={cn("font-semibold text-sm leading-tight mb-2", theme.textHeader)}>{log.title || 'Progress Update'}</h4>
                        <p className={cn("text-sm leading-relaxed", theme.textBody)}>{log.description || log.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyState icon={BookOpen} message="No journey documented yet." />}
            </div>

            <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col col-span-full sm:col-span-2 transition-all duration-200 hover:-translate-y-1 border')}>
              <h3 className={cn("text-base font-semibold flex items-center gap-2 mb-4", theme.textHeader)}><Eye className="w-5 h-5 opacity-80" /> Photo Gallery <Badge variant="secondary" className={cn(theme.badge, "ml-2")}>{allPhotos.length}</Badge></h3>
              {allPhotos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {allPhotos.slice(0, 4).map((photo, idx) => (
                      <button key={idx} onClick={() => setShowPhotoModal(true)} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={photo} alt={`Gallery photo ${idx + 1}`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                  {allPhotos.length > 4 && <Button onClick={() => setShowPhotoModal(true)} className={cn("mt-auto w-full", theme.button)}>View All Photos</Button>}
                </>
              ) : <EmptyState icon={Eye} message="No photos uploaded yet." />}
            </div>

            {/* --- MODIFIED: Professional Current Vibes Section --- */}
            {user.musicLinks && user.musicLinks.length > 0 && (
              <div className={cn('rounded-2xl', theme.card, 'p-6 flex flex-col col-span-full sm:col-span-2 transition-all duration-200 hover:-translate-y-1 border')}>
                <h3 className={cn("text-base font-semibold flex items-center gap-2 mb-4", theme.textHeader)}><Music className="w-5 h-5 opacity-80" /> Current Vibes</h3>
                <div className="flex flex-col space-y-4 flex-grow justify-around">
                    {user.musicLinks.slice(0, 3).map((link, idx) => (
                        <MusicPlayer key={idx} url={link} themeKey={themeKey} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <AnimatePresence>
          {showPhotoModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowPhotoModal(false)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.19, 1.0, 0.22, 1.0] }}
                className={cn("relative rounded-2xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto", theme.card, themeKey === 'black' ? 'bg-gray-900' : 'bg-white')} 
                onClick={e => e.stopPropagation()}
              >
                <Button onClick={() => setShowPhotoModal(false)} variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full z-10"><X className="w-5 h-5" /></Button>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allPhotos.map((photo, idx) => <motion.img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="rounded-lg object-cover w-full h-48 shadow-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} />)}
                </div>
              </motion.div>
            </motion.div>
          )}

          {showWorksModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowWorksModal(false)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.19, 1.0, 0.22, 1.0] }}
                className={cn("relative rounded-2xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto", theme.card, themeKey === 'black' ? 'bg-gray-900' : 'bg-white')} 
                onClick={e => e.stopPropagation()}
              >
                <Button onClick={() => setShowWorksModal(false)} variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full z-10"><X className="w-5 h-5" /></Button>
                <h3 className={cn("text-2xl font-bold mb-6", theme.textHeader)}>All Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map(project => (
                    <motion.div key={project._id} className={cn("rounded-xl p-4 border flex flex-col group", theme.card)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      {project.cover_image && <div className="aspect-video rounded-md overflow-hidden mb-4"><img src={project.cover_image} alt={project.title} className="w-full h-full object-cover"/></div>}
                      <h4 className={cn("font-bold text-lg", theme.textHeader)}>{project.title}</h4>
                      <p className={cn("text-sm mt-1 mb-3 flex-grow", theme.textBody)}>{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags?.map(tag => <Badge key={tag} variant="secondary" className={cn(theme.badge, "font-normal")}>{tag}</Badge>)}
                      </div>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className={cn("mt-4 text-sm font-semibold flex items-center gap-1 transition-colors", theme.textAccent, "hover:underline")}>
                          View Project <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
};

export default PublicProfile;