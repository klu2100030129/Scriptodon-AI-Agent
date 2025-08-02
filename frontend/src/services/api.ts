// API Base URL - Use environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin);

// Generic HTTP functions for use by service files
export const get = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const post = async <T>(endpoint: string, data?: any): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const postFormData = async <T>(endpoint: string, formData: FormData): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const del = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// API Service for connecting to the Scriptodon Backend
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic fetch method with error handling
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.fetchApi('/health');
  }

  // Input Sources API
  async getInputSources(): Promise<any[]> {
    return this.fetchApi('/api/input-sources/');
  }

  async getInputSource(id: number): Promise<any> {
    return this.fetchApi(`/api/input-sources/${id}`);
  }

  async createSwaggerSource(file: File, name: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const url = `${this.baseUrl}/api/input-sources/swagger`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createSwaggerSourceFromUrl(name: string, swaggerUrl: string): Promise<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('swagger_url', swaggerUrl);

    const url = `${this.baseUrl}/api/input-sources/swagger-url`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createJiraSource(jiraUrl: string, jiraIssueKey: string, name: string): Promise<any> {
    const formData = new FormData();
    formData.append('jira_url', jiraUrl);
    formData.append('jira_issue_key', jiraIssueKey);
    formData.append('name', name);

    const url = `${this.baseUrl}/api/input-sources/jira`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async createUserPromptSource(data: {
    name: string;
    source_type: 'user_prompt';
    content: string;
  }): Promise<any> {
    return this.fetchApi('/api/input-sources/user-prompt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteInputSource(id: number): Promise<{ message: string }> {
    return this.fetchApi(`/api/input-sources/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteTestCase(testCaseId: number): Promise<{ message: string }> {
    return this.fetchApi(`/api/test-generation/test-cases/${testCaseId}`, {
      method: 'DELETE',
    });
  }

  async deleteTestRun(testRunId: number): Promise<{ message: string }> {
    console.log('API: Deleting test run with ID:', testRunId);
    const result = await this.fetchApi<{ message: string }>(`/api/test-generation/test-runs/${testRunId}`, {
      method: 'DELETE',
    });
    console.log('API: Test run deletion result:', result);
    return result;
  }

  async deleteScript(scriptId: number): Promise<{ message: string }> {
    console.log('API: Deleting script with ID:', scriptId);
    const result = await this.fetchApi<{ message: string }>(`/api/script-output/scripts/${scriptId}`, {
      method: 'DELETE',
    });
    console.log('API: Script deletion result:', result);
    return result;
  }

  // Test Generation API
  async generateTestCases(inputSourceId: number): Promise<any> {
    return this.fetchApi(`/api/test-generation/generate/${inputSourceId}`, {
      method: 'POST',
    });
  }

  async executeTestCases(inputSourceId: number): Promise<any> {
    return this.fetchApi(`/api/test-generation/execute/${inputSourceId}`, {
      method: 'POST',
    });
  }

  async getTestCases(inputSourceId: number): Promise<any[]> {
    return this.fetchApi(`/api/test-generation/test-cases/${inputSourceId}`);
  }

  async getTestRuns(inputSourceId: number): Promise<any[]> {
    return this.fetchApi(`/api/test-generation/test-runs/${inputSourceId}`);
  }

  // Script Output API
  async generateAutomationScript(inputSourceId: number, scriptType: string): Promise<any> {
    return this.fetchApi(`/api/script-output/generate/${inputSourceId}?script_type=${scriptType}`, {
      method: 'POST',
    });
  }

  async executeAutomationScript(scriptId: number): Promise<any> {
    return this.fetchApi(`/api/script-output/execute/${scriptId}`, {
      method: 'POST',
    });
  }

  async getScripts(inputSourceId: number): Promise<any[]> {
    return this.fetchApi(`/api/script-output/scripts/${inputSourceId}`);
  }

  async downloadScript(scriptId: number): Promise<Blob> {
    const url = `${this.baseUrl}/api/script-output/download/${scriptId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  }

  // Manual Testing API
  async getManualTestCases(inputSourceId: number): Promise<any> {
    return this.fetchApi(`/api/manual-testing/manual-test-cases/${inputSourceId}`);
  }

  async updateTestCaseStatus(testCaseId: number, status: string): Promise<any> {
    return this.fetchApi(`/api/manual-testing/update-test-case-status/${testCaseId}?status=${status}`, {
      method: 'POST',
    });
  }

  async exportTestCasesCSV(inputSourceId: number): Promise<any> {
    return this.fetchApi(`/api/manual-testing/test-cases/${inputSourceId}/csv`);
  }

  async exportTestRunsCSV(inputSourceId: number): Promise<any> {
    return this.fetchApi(`/api/manual-testing/test-runs/${inputSourceId}/csv`);
  }

  // Utility method to download CSV
  downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

// Create a singleton instance
export const apiService = new ApiService(); 