/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from 'axios';

const BASE_URL = 'https://api.shebuildsecosystem.com/api';

// Initialize jwtToken from localStorage if present
let jwtToken: string | null = localStorage.getItem('token');

export function setToken(token: string | null) {
  jwtToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

function getAuthHeaders() {
  return jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  if (jwtToken) {
    Object.assign(config.headers ?? {}, getAuthHeaders());
  }
  return config;
});

// --- AUTH ---
export async function registerUser(data: any) {
  return api.post('/auth/register', data);
}

export async function loginUser(data: any) {
  return api.post('/auth/login', data);
}

export async function logoutUser() {
  return api.post('/auth/logout');
}

export async function forgotPassword(email: string) {
  return api.post('/password-reset/request', { email });
}

export async function resetPassword(token: string, newPassword: string) {
  return api.post('/password-reset/reset', { token, newPassword });
}

// --- USER ---
export async function getUserProfile() {
  return api.get('/auth/me');
}

export async function updateUserProfile(data: any) {
  return api.put('/auth/profile', data);
}

export async function getPublicUserProfile(username: string) {
  console.log('Calling getPublicUserProfile with username:', username);
  const response = await api.get(`/profile/${username}`);
  console.log('getPublicUserProfile response:', response.data);
  return response;
}

// --- USER DELETE ---
export async function deleteUserProfile() {
  return api.delete('/auth/profile');
}

// --- PROJECTS ---
export async function getProjects(params?: any) {
  return api.get('/projects', { params });
}

export async function getUserProjects(username: string, params?: any) {
  return api.get(`/projects/user/${username}`, { params });
}

export async function createProject(data: any) {
  return api.post('/projects', data);
}

export async function getProjectDetails(projectId: string) {
  return api.get(`/projects/${projectId}`);
}

export async function updateProject(projectId: string, data: any) {
  return api.put(`/projects/${projectId}`, data);
}

export async function deleteProject(projectId: string) {
  return api.delete(`/projects/${projectId}`);
}

// --- GRANTS (DEPRECATED - Use Grant Programs instead) ---
// These functions are kept for backward compatibility but now use grant-programs endpoints
export async function getGrants(params?: any) {
  return api.get('/grant-programs', { params });
}

export async function applyForGrant(data: any) {
  return api.post('/grant-programs', data);
}

export async function getGrantDetails(grantId: string) {
  return api.get(`/grant-programs/${grantId}`);
}

// Admin: Update grant status
export async function updateGrantStatus(grantId: string, data: any) {
  return api.put(`/grant-programs/${grantId}/status`, data);
}

// --- CHALLENGES ---
export async function getChallenges(params?: any) {
  return api.get('/challenges', { params });
}

export async function createChallenge(data: any) {
  return api.post('/challenges', data);
}

export async function getChallengeDetails(challengeId: string) {
  return api.get(`/challenges/${challengeId}`);
}

// Admin: Update challenge
export async function updateChallenge(challengeId: string, data: any) {
  return api.put(`/challenges/${challengeId}`, data);
}

export async function registerForChallenge(challengeId: string) {
  return api.post(`/challenges/${challengeId}/register`);
}

export async function submitChallengeEntry(challengeId: string, data: any) {
  return api.post(`/challenges/${challengeId}/submit`, data);
}

// --- PROGRESS LOGS ---
export async function getProgressLogs(params?: any) {
  return api.get('/progress-logs', { params });
}

export async function createProgressLog(data: any) {
  return api.post('/progress-logs', data);
}

// --- FILE UPLOAD ---
/**
 * Upload a file. For profile pictures, set type = 'profile-picture'.
 * @param file File to upload
 * @param type 'profile-picture' | undefined
 */
export async function uploadFile(file: File, type?: 'profile-picture' | 'cover-image' | 'story' | 'event-image') {
  const formData = new FormData();
  if (type === 'profile-picture') {
    formData.append('profile_picture', file);
    return api.post('/upload/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
  } else if (type === 'cover-image') {
    formData.append('cover_image', file);
    return api.post('/upload/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
  } else if (type === 'story') {
    formData.append('story', file);
    return api.post('/upload/story', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
  } else if (type === 'event-image') {
    formData.append('event_image', file);
    return api.post('/upload/event-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
  } else {
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
  }
}

// --- SEARCH ---
export async function searchUsers(params: any) {
  return api.get('/search/users', { params });
}

export async function searchProjects(params: any) {
  return api.get('/search/projects', { params });
}

// --- ANALYTICS ---
export async function getPopularSkills() {
  return api.get('/search/skills/popular');
}

export async function getPlatformStats() {
  return api.get('/analytics/platform-stats');
}

export async function getAdminAnalytics() {
  return api.get('/search/analytics');
}

// --- ADMIN USER MANAGEMENT ---
export async function getAllUsers(params?: any) {
  return api.get('/auth/admin/users', { params });
}

// --- COMMUNITY ---
export async function getCommunityUsers(params?: { page?: number; limit?: number; skills?: string; location?: string; sort?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.skills) searchParams.append('skills', params.skills);
  if (params?.location) searchParams.append('location', params.location);
  if (params?.sort) searchParams.append('sort', params.sort);
  
  return api.get(`/search/users/all?${searchParams.toString()}`);
}

export async function updateUserRole(userId: string, data: { is_admin?: boolean; is_verified?: boolean }) {
  return api.put(`/auth/admin/users/${userId}`, data);
}

export async function deleteUser(userId: string) {
  return api.delete(`/auth/admin/users/${userId}`);
}

// --- CONTACT ---
export async function submitContactForm(data: { name: string; email: string; message: string }) {
  return api.post('/contact', data);
}

// --- ERROR HANDLING ---
// You can add global error handling here if needed

export async function adminDeleteGrant(grantId: string) {
  return api.delete(`/grant-programs/${grantId}`);
}

export async function adminDeleteChallenge(challengeId: string) {
  return api.delete(`/challenges/${challengeId}`);
} 

export async function getAnnouncements() {
  return api.get('/announcements');
}

export async function createAnnouncement(data: { title: string; message: string }) {
  return api.post('/announcements', data);
}

export async function deleteAnnouncement(id: string) {
  return api.delete(`/announcements/${id}`);
}

// --- EVENTS ---
export async function getEvents(params?: any) {
  return api.get('/events', { params });
}

export async function getEventDetails(eventId: string) {
  return api.get(`/events/${eventId}`);
}

export async function createEvent(data: any) {
  return api.post('/events', data);
}

export async function updateEvent(eventId: string, data: any) {
  return api.put(`/events/${eventId}`, data);
}

export async function deleteEvent(eventId: string) {
  return api.delete(`/events/${eventId}`);
}

export async function registerForEvent(eventId: string) {
  return api.post(`/events/${eventId}/register`);
}

// --- GRANT PROGRAMS ---
export async function getGrantPrograms(params?: { status?: string; featured?: boolean; page?: number; limit?: number }) {
  return api.get('/grant-programs', { params });
}

export async function getGrantProgram(programId: string) {
  return api.get(`/grant-programs/${programId}`);
}

export async function createGrantProgram(data: any) {
  return api.post('/grant-programs', data);
}

export async function updateGrantProgram(programId: string, data: any) {
  return api.put(`/grant-programs/${programId}`, data);
}

export async function deleteGrantProgram(programId: string) {
  return api.delete(`/grant-programs/${programId}`);
}

export async function getGrantProgramStats() {
  return api.get('/grant-programs/admin/stats');
}

export async function toggleGrantProgramFeatured(programId: string) {
  return api.patch(`/grant-programs/${programId}/featured`);
}

// --- GRANT APPLICATIONS ---
export async function getUserGrantApplications(params?: any) {
  return api.get('/grant-applications/my-applications', { params });
}

export async function getGrantApplicationById(applicationId: string) {
  return api.get(`/grant-applications/${applicationId}`);
}

// Admin: Get all grant applications
export async function getAllGrantApplications(params?: any) {
  return api.get('/grant-applications', { params });
}

// Admin: Update grant application status
export async function updateGrantApplicationStatus(applicationId: string, data: { status: string; review_notes?: string }) {
  return api.put(`/grant-applications/${applicationId}/status`, data);
}

// Admin: Delete grant application
export async function deleteGrantApplication(applicationId: string) {
  return api.delete(`/grant-applications/${applicationId}`);
}

// Helper function to handle event registration with external links
export async function handleEventRegistration(eventId: string, externalLink?: string) {
  if (externalLink) {
    window.open(externalLink, '_blank');
    return { message: 'Opening external registration link' };
  }
  
  const response = await registerForEvent(eventId);
  return response.data;
} 