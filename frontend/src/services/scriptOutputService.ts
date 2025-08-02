import { get, post, postFormData } from './api';

export interface Script {
  id: number;
  name: string;
  description: string;
  script_type: string;
  framework: string;
  content: string;
  test_case_id: number;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface GenerateScriptData {
  test_case_id: number;
  script_type: string;
  framework: string;
  additional_config?: any;
}

export interface ScriptResponse {
  script: Script;
  download_url?: string;
  execution_instructions: string;
}

// Script Output API calls
export const scriptOutputService = {
  // Generate script from test case
  async generateScript(data: GenerateScriptData): Promise<ScriptResponse> {
    return post('/script-output/generate', data);
  },

  // Get script by ID
  async getScript(id: number): Promise<Script> {
    return get(`/script-output/script/${id}`);
  },

  // Get all scripts for a project
  async getProjectScripts(projectId: number): Promise<Script[]> {
    return get(`/script-output/project/${projectId}`);
  },

  // Get scripts by test case
  async getScriptsByTestCase(testCaseId: number): Promise<Script[]> {
    return get(`/script-output/test-case/${testCaseId}`);
  },

  // Download script
  async downloadScript(id: number): Promise<Blob> {
    const response = await fetch(`http://localhost:8000/api/script-output/script/${id}/download`);
    if (!response.ok) {
      throw new Error('Failed to download script');
    }
    return response.blob();
  },

  // Execute script
  async executeScript(id: number): Promise<any> {
    return post(`/script-output/script/${id}/execute`, {});
  },

  // Update script
  async updateScript(id: number, data: Partial<Script>): Promise<Script> {
    return post(`/script-output/script/${id}`, data);
  },

  // Export script to different formats
  async exportScript(id: number, format: string): Promise<Blob> {
    const response = await fetch(`http://localhost:8000/api/script-output/script/${id}/export?format=${format}`);
    if (!response.ok) {
      throw new Error('Failed to export script');
    }
    return response.blob();
  },
}; 