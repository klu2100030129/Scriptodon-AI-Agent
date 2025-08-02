import { get, post } from './api';

export interface Report {
  id: number;
  name: string;
  report_type: string;
  content: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface GenerateReportData {
  project_id: number;
  report_type: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
  filters?: any;
}

export interface ReportResponse {
  report: Report;
  download_url?: string;
  summary: string;
}

// Reports API calls
export const reportsService = {
  // Generate report
  async generateReport(data: GenerateReportData): Promise<ReportResponse> {
    return post('/reports/generate', data);
  },

  // Get report by ID
  async getReport(id: number): Promise<Report> {
    return get(`/reports/report/${id}`);
  },

  // Get all reports for a project
  async getProjectReports(projectId: number): Promise<Report[]> {
    return get(`/reports/project/${projectId}`);
  },

  // Download report
  async downloadReport(id: number, format: string = 'pdf'): Promise<Blob> {
    const response = await fetch(`http://localhost:8000/api/reports/report/${id}/download?format=${format}`);
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    return response.blob();
  },

  // Export report to different formats
  async exportReport(id: number, format: string): Promise<Blob> {
    const response = await fetch(`http://localhost:8000/api/reports/report/${id}/export?format=${format}`);
    if (!response.ok) {
      throw new Error('Failed to export report');
    }
    return response.blob();
  },

  // Get analytics data
  async getAnalytics(projectId: number): Promise<any> {
    return get(`/reports/analytics/${projectId}`);
  },

  // Get test execution summary
  async getTestExecutionSummary(projectId: number): Promise<any> {
    return get(`/reports/test-execution-summary/${projectId}`);
  },
}; 