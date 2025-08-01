import { get, post } from './api';

export interface TestCase {
  id: number;
  name: string;
  description: string;
  test_type: string;
  priority: string;
  steps: TestStep[];
  expected_result: string;
  created_at: string;
  updated_at: string;
}

export interface TestStep {
  step_number: number;
  action: string;
  expected_result: string;
  data: any;
}

export interface GenerateTestsRequest {
  input_source_id: number;
  test_types?: string[];
}

// Test Generation API calls
export const testGenerationService = {
  // Generate test cases from input source
  async generateTestCases(data: GenerateTestsRequest): Promise<TestCase[]> {
    console.log('Making test generation request with data:', data);
    return post('/test-generation/generate', data);
  },

  // Get test cases for an input source
  async getTestCases(inputSourceId: number): Promise<TestCase[]> {
    return get(`/test-generation/input-source/${inputSourceId}`);
  },

  // Generate automation script from test case
  async generateScript(testCaseId: number, framework: string, language: string): Promise<string> {
    return post('/test-generation/script', {
      test_case_id: testCaseId,
      framework,
      language
    });
  },

  // Get all test cases
  async getAllTestCases(): Promise<TestCase[]> {
    return get('/test-generation/test-cases');
  }
}; 