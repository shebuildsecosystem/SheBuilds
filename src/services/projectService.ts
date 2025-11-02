import api from '@/lib/api';
import { 
  Project, 
  CreateProjectData, 
  ProjectFilters,
  PaginatedResponse,
  ApiResponse,
  FileUploadResponse 
} from '@/types/api';

export class ProjectService {
  /**
   * Get projects with optional filtering and pagination
   */
  async getProjects(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get<ApiResponse<PaginatedResponse<Project>>>(
      `/projects?${params.toString()}`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch projects');
    }
    
    return response.data.data;
  }

  /**
   * Get single project by ID
   */
  async getProject(id: string): Promise<Project> {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Project not found');
    }
    
    return response.data.data;
  }

  /**
   * Create new project
   */
  async createProject(dat