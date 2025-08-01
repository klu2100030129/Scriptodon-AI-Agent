import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Link, 
  Image, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Calendar,
  FileJson
} from 'lucide-react';
import { inputSourcesService, InputSource } from '../services/inputSourcesService';
import { testGenerationService, TestCase } from '../services/testGenerationService';

const InputSources: React.FC = () => {
  const [activeSource, setActiveSource] = useState('swagger');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inputSources, setInputSources] = useState<InputSource[]>([]);

  // Form states for different input types
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [swaggerFile, setSwaggerFile] = useState<File | null>(null);
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [projectName, setProjectName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [generatingTests, setGeneratingTests] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing input sources on component mount
  useEffect(() => {
    const loadInputSources = async () => {
      try {
        setIsLoading(true);
        const projectId = 1; // Default project ID for demo
        const sources = await inputSourcesService.getProjectInputSources(projectId);
        setInputSources(sources);
      } catch (err) {
        console.error('Failed to load input sources:', err);
        setError('Failed to load input sources. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInputSources();
  }, []);

  const inputTypes = [
    { id: 'swagger', label: 'Swagger/OpenAPI', icon: Link, description: 'Import API documentation' },
    { id: 'jira', label: 'Jira Story', icon: FileText, description: 'Import user stories and requirements' },
    { id: 'figma', label: 'Figma Design', icon: Image, description: 'Import UI designs and wireframes' },
    { id: 'prompt', label: 'User Prompt', icon: MessageSquare, description: 'Describe requirements manually' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        setError('Only JSON files are accepted for Swagger uploads');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSwaggerFile(file);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        setError('Only JSON files are accepted for Swagger uploads');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSwaggerFile(file);
      setError(null);
    }
  };

  const handleSwaggerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const projectId = 1; // Default project ID for demo
      const result = await inputSourcesService.createSwaggerSource({
        url: swaggerUrl || undefined,
        file: swaggerFile || undefined,
        project_id: projectId,
      });

      setSuccess('Swagger source created successfully!');
      setInputSources(prev => [...prev, result]);
      setSwaggerUrl('');
      setSwaggerFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Swagger source');
    } finally {
      setLoading(false);
    }
  };

  const handleJiraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const projectId = 1; // Default project ID for demo
      const result = await inputSourcesService.createJiraSource({
        issue_url: jiraUrl,
        api_token: jiraToken,
        project_id: projectId,
      });

      setSuccess('Jira source created successfully!');
      setInputSources(prev => [...prev, result]);
      setJiraUrl('');
      setJiraToken('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Jira source');
    } finally {
      setLoading(false);
    }
  };

  const handleFigmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const projectId = 1; // Default project ID for demo
      const result = await inputSourcesService.createFigmaSource({
        file_url: figmaUrl,
        access_token: figmaToken,
        project_id: projectId,
      });

      setSuccess('Figma source created successfully!');
      setInputSources(prev => [...prev, result]);
      setFigmaUrl('');
      setFigmaToken('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create Figma source');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const projectId = 1; // Default project ID for demo
      const result = await inputSourcesService.createPromptSource({
        project_name: projectName,
        requirements: requirements,
        project_id: projectId,
      });

      setSuccess('Prompt source created successfully!');
      setInputSources(prev => [...prev, result]);
      setProjectName('');
      setRequirements('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create prompt source');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSource = (source: InputSource) => {
    // For now, just show the content in an alert
    // In a real app, you'd want to show this in a modal or separate page
    const content = source.content ? JSON.stringify(JSON.parse(source.content), null, 2) : 'No content';
    alert(`Input Source: ${source.name}\n\nContent:\n${content}`);
  };

  const handleDeleteSource = async (sourceId: number) => {
    if (window.confirm('Are you sure you want to delete this input source?')) {
      try {
        await inputSourcesService.deleteInputSource(sourceId);
        setInputSources(prev => prev.filter(source => source.id !== sourceId));
        setSuccess('Input source deleted successfully!');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete input source');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const testBackend = async () => {
    try {
      console.log('Testing backend connectivity...');
      const response = await fetch('http://127.0.0.1:8000/api/test-generation/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend test failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Backend test response:', data);
      return true;
    } catch (err) {
      console.error('Backend test failed:', err);
      return false;
    }
  };

  const handleGenerateTests = async () => {
    try {
      if (inputSources.length === 0) {
        setError('No input sources available. Please create an input source first.');
        return;
      }

      setGeneratingTests(true);
      setError(null);
      setSuccess(null);

      // First, test backend connectivity
      const backendWorking = await testBackend();
      if (!backendWorking) {
        throw new Error('Backend is not accessible. Please ensure the backend server is running.');
      }
      console.log('Backend is accessible');

      // Use the first available input source for demo
      const inputSource = inputSources[0];
      console.log('Generating tests for input source:', inputSource);
      
      const testCases = await testGenerationService.generateTestCases({
        input_source_id: inputSource.id,
        test_types: ['api'] // Default to API tests
      });

      console.log('Generated test cases:', testCases);
      
      // Validate and normalize test cases structure
      const normalizedTestCases = Array.isArray(testCases) ? testCases.map(testCase => ({
        id: testCase.id || Math.random(),
        name: testCase.name || 'Test Case',
        description: testCase.description || 'Generated test case',
        test_type: testCase.test_type || 'api',
        priority: testCase.priority || 'medium',
        steps: Array.isArray(testCase.steps) ? testCase.steps : [],
        expected_result: testCase.expected_result || 'Test passes',
        created_at: testCase.created_at || new Date().toISOString(),
        updated_at: testCase.updated_at || new Date().toISOString()
      })) : [];
      
      setTestCases(normalizedTestCases);
      setSuccess(`Successfully generated ${normalizedTestCases.length} test cases!`);
    } catch (err) {
      console.error('Test generation error:', err);
      console.error('Error type:', typeof err);
      console.error('Error object:', err);
      
      let errorMessage = 'Failed to generate test cases. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('message' in err) {
          errorMessage = String(err.message);
        } else if ('detail' in err) {
          errorMessage = String(err.detail);
        } else {
          errorMessage = JSON.stringify(err);
        }
      }
      
      setError(errorMessage);
    } finally {
      setGeneratingTests(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading input sources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Input Sources</h1>
        <p className="text-gray-600">Choose your input source to generate automated tests</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {/* Source Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {inputTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setActiveSource(type.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSource === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 ${
                activeSource === type.id ? 'text-blue-600' : 'text-gray-600'
              }`} />
              <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeSource === 'swagger' && (
          <form onSubmit={handleSwaggerSubmit}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Swagger/OpenAPI Import</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
                <input
                  type="url"
                  value={swaggerUrl}
                  onChange={(e) => setSwaggerUrl(e.target.value)}
                  placeholder="https://api.example.com/swagger.json"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-center text-gray-500 py-4">— OR —</div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {swaggerFile ? `Selected: ${swaggerFile.name}` : 'Drop your Swagger JSON file here or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mb-3">Only JSON files are accepted</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json"
                  onChange={handleFileSelect}
                  id="swagger-file"
                />
                <label htmlFor="swagger-file" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  Browse Files
                </label>
              </div>
              <button
                type="submit"
                disabled={loading || (!swaggerUrl && !swaggerFile)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Swagger Source'}
              </button>
            </div>
          </form>
        )}

        {activeSource === 'jira' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Jira Story Import</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jira Issue URL</label>
                <input
                  type="url"
                  placeholder="https://yourcompany.atlassian.net/browse/PROJ-123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                <input
                  type="password"
                  placeholder="Your Jira API token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeSource === 'figma' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Figma Design Import</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Figma File URL</label>
                <input
                  type="url"
                  placeholder="https://www.figma.com/file/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
                <input
                  type="password"
                  placeholder="Your Figma access token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeSource === 'prompt' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Input</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements Description</label>
                <textarea
                  rows={8}
                  placeholder="Describe the functionality you want to test. Include user flows, API endpoints, UI elements, and expected behaviors..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={testBackend}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Test Backend
          </button>
          <button 
            onClick={handleGenerateTests}
            disabled={generatingTests || inputSources.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generatingTests ? 'Generating...' : 'Generate Tests'}
          </button>
        </div>
      </div>

      {/* Created Input Sources Display */}
      {inputSources.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Created Input Sources</h2>
          <div className="grid gap-4">
            {inputSources.map((source) => (
              <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileJson className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{source.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{source.source_type}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(source.created_at)}</span>
                        </div>
                        {source.url && (
                          <div className="flex items-center space-x-1">
                            <Link className="w-3 h-3" />
                            <span>URL provided</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewSource(source)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSource(source.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {source.content && (
                  <div className="mt-3">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                        View Content Preview
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {source.content.length > 200 
                            ? `${source.content.substring(0, 200)}...` 
                            : source.content}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Test Cases Display */}
      {testCases.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Test Cases</h2>
          <div className="grid gap-4">
            {testCases.map((testCase, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{testCase.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="capitalize">{testCase.test_type}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        testCase.priority === 'high' ? 'bg-red-100 text-red-800' :
                        testCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {testCase.priority}
                      </span>
                    </div>
                  </div>
                </div>
                {testCase.steps && Array.isArray(testCase.steps) && testCase.steps.length > 0 && (
                  <div className="mt-3">
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                        View Test Steps
                      </summary>
                      <div className="mt-2 space-y-2">
                        {testCase.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="p-3 bg-gray-50 rounded-md">
                            <div className="font-medium text-gray-900">Step {step.step_number}</div>
                            <div className="text-sm text-gray-700 mt-1">{step.action}</div>
                            <div className="text-sm text-gray-600 mt-1">Expected: {step.expected_result}</div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSources;