// src/App.tsx (Verified - no changes needed)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/Privacy";
import TermsOfService from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import GrantPrograms from './pages/GrantPrograms';
import GrantDetailPage from './pages/GrantDetail';
import GrantApply from './pages/GrantApply';
import Challenges from './pages/Challenges';
import ChallengeDetailPage from './pages/ChallengeDetail';
import ProgressLogCreate from './pages/ProgressLogCreate';
import ProgressLogs from './pages/ProgressLogs';
import SearchPage from './pages/Search';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import ProfileSetup from './pages/ProfileSetup';
import EditProject from './pages/EditProject';
import Events from './pages/Events';
import Community from './pages/Community';
import Announcements from './pages/Announcements';
import UserGrants from './pages/UserGrants';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
         <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/projects/:projectId/edit" element={<EditProject />} />
          <Route path="/:username/projects" element={<Projects />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/grant-programs" element={<GrantPrograms />} />
          <Route path="/grant-programs/:grantId" element={<GrantDetailPage />} />
          <Route path="/grant-programs/:grantId/apply" element={<GrantApply />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:challengeId" element={<ChallengeDetailPage />} />
          <Route path="/progress-logs/create" element={<ProgressLogCreate />} />
          <Route path="/progress-logs" element={<ProgressLogs />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usergrants" element={<UserGrants />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        
          <Route path=":username" element={<PublicProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;