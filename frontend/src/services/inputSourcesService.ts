import { get, post, postFormData, del } from './api';

export interface InputSource {
  id: number;
  name: string;
  source_type: string;
  content: string;
  url?: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSwaggerSourceData {
  url?: string;
  file?: File;
  project_id: number;
}

export interface CreateJiraSourceData {
  issue_url: string;
  api_token: string;
  project_id: number;
}

export interface CreateFigmaSourceData {
  file_url: string;
  access_token: string;
  project_id: number;
}

export interface CreatePromptSourceData {
  project_name: string;
  requirements: string;
  project_id: number;
}

// Input Sources API calls
export const inputSourcesService = {
  // Create Swagger/OpenAPI source
  async createSwaggerSource(data: CreateSwaggerSourceData): Promise<InputSource> {
    const formData = new FormData();
    formData.append('project_id', data.project_id.toString());
    
    if (data.url) {
      formData.append('url', data.url);
    }
    if (data.file) {
      formData.append('file', data.file);
    }
    
    return postFormData('/input-sources/swagger', formData);
  },

  // Create Jira source
  async createJiraSource(data: CreateJiraSourceData): Promise<InputSource> {
    const formData = new FormData();
    formData.append('issue_url', data.issue_url);
    formData.append('api_token', data.api_token);
    formData.append('project_id', data.project_id.toString());
    
    return postFormData('/input-sources/jira', formData);
  },

  // Create Figma source
  async createFigmaSource(data: CreateFigmaSourceData): Promise<InputSource> {
    const formData = new FormData();
    formData.append('file_url', data.file_url);
    formData.append('access_token', data.access_token);
    formData.append('project_id', data.project_id.toString());
    
    return postFormData('/input-sources/figma', formData);
  },

  // Create prompt source
  async createPromptSource(data: CreatePromptSourceData): Promise<InputSource> {
    const formData = new FormData();
    formData.append('project_name', data.project_name);
    formData.append('requirements', data.requirements);
    formData.append('project_id', data.project_id.toString());
    
    return postFormData('/input-sources/prompt', formData);
  },

  // Get input source by ID
  async getInputSource(id: number): Promise<InputSource> {
    return get(`/input-sources/${id}`);
  },

  // Get all input sources for a project
  async getProjectInputSources(projectId: number): Promise<InputSource[]> {
    return get(`/input-sources/project/${projectId}`);
  },

  // Delete input source
  async deleteInputSource(id: number): Promise<void> {
    return del(`/input-sources/${id}`);
  },
}; 