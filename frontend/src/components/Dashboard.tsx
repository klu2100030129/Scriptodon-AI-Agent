import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface InputSource {
  id: number;
  name: string;
  source_type: string;
  content: string;
  created_at: string;
}

interface TestCase {
  id: number;
  title: string;
  description: string;
  steps: string;
  expected_result: string;
  status: string;
}

interface TestRun {
  id: number;
  name: string;
  status: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
}

interface Script {
  id: number;
  name: string;
  script_type: string;
  created_at: string;
  download_url: string;
}

const Dashboard: React.FC = () => {
  const [inputSources, setInputSources] = useState<InputSource[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInputSource, setSelectedInputSource] = useState<number | null>(null);

  // Form states
  const [swaggerFile, setSwaggerFile] = useState<File | null>(null);
  const [swaggerName, setSwaggerName] = useState('');
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [swaggerUrlName, setSwaggerUrlName] = useState('');
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraIssueKey, setJiraIssueKey] = useState('');
  const [jiraName, setJiraName] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [userPromptName, setUserPromptName] = useState('');

  // Load input sources on component mount
  useEffect(() => {
    loadInputSources();
  }, []);

  useEffect(() => {
    console.log('selectedInputSource changed to:', selectedInputSource);
  }, [selectedInputSource]);

  const loadInputSources = async () => {
    try {
      setLoading(true);
      const sources = await apiService.getInputSources();
      setInputSources(sources);
      setError(null);
    } catch (err) {
      setError(`Failed to load input sources: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwaggerUpload = async () => {
    if (!swaggerFile || !swaggerName) {
      setError('Please select a file and provide a name');
      return;
    }

    try {
      setLoading(true);
      await apiService.createSwaggerSource(swaggerFile, swaggerName);
      setSwaggerFile(null);
      setSwaggerName('');
      await loadInputSources();
      setError(null);
    } catch (err) {
      setError(`Failed to upload Swagger file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwaggerUrlUpload = async () => {
    if (!swaggerUrl || !swaggerUrlName) {
      setError('Please provide both URL and name');
      return;
    }

    try {
      setLoading(true);
      await apiService.createSwaggerSourceFromUrl(swaggerUrlName, swaggerUrl);
      setSwaggerUrl('');
      setSwaggerUrlName('');
      await loadInputSources();
      setError(null);
    } catch (err) {
      setError(`Failed to upload Swagger from URL: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJiraSubmit = async () => {
    if (!jiraUrl || !jiraIssueKey || !jiraName) {
      setError('Please fill in all Jira fields');
      return;
    }

    try {
      setLoading(true);
      await apiService.createJiraSource(jiraUrl, jiraIssueKey, jiraName);
      setJiraUrl('');
      setJiraIssueKey('');
      setJiraName('');
      await loadInputSources();
      setError(null);
    } catch (err) {
      setError(`Failed to create Jira source: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPromptSubmit = async () => {
    if (!userPrompt || !userPromptName) {
      setError('Please provide both name and content');
      return;
    }

    try {
      setLoading(true);
      await apiService.createUserPromptSource({
        name: userPromptName,
        source_type: 'user_prompt',
        content: userPrompt,
      });
      setUserPrompt('');
      setUserPromptName('');
      await loadInputSources();
      setError(null);
    } catch (err) {
      setError(`Failed to create user prompt source: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCases = async (inputSourceId: number) => {
    try {
      setLoading(true);
      await apiService.generateTestCases(inputSourceId);
      await loadTestCases(inputSourceId);
      setError(null);
    } catch (err) {
      setError(`Failed to generate test cases: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTestCases = async (inputSourceId: number) => {
    try {
      setLoading(true);
      const result = await apiService.executeTestCases(inputSourceId);
      await loadTestRuns(inputSourceId);
      alert(`Test execution completed!\nPassed: ${result.summary.passed}\nFailed: ${result.summary.failed}`);
      setError(null);
    } catch (err) {
      setError(`Failed to execute test cases: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadTestCases = async (inputSourceId: number) => {
    try {
      console.log('Setting selectedInputSource to:', inputSourceId);
      setSelectedInputSource(inputSourceId);
      const cases = await apiService.getTestCases(inputSourceId);
      setTestCases(cases);
      console.log('Test cases loaded, selectedInputSource is now:', inputSourceId);
    } catch (err) {
      setError(`Failed to load test cases: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const loadTestRuns = async (inputSourceId: number) => {
    try {
      setSelectedInputSource(inputSourceId);
      const runs = await apiService.getTestRuns(inputSourceId);
      setTestRuns(runs);
    } catch (err) {
      setError(`Failed to load test runs: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleExportCSV = async (inputSourceId: number) => {
    try {
      setLoading(true);
      const result = await apiService.exportTestCasesCSV(inputSourceId);
      apiService.downloadCSV(result.content, result.filename);
      setError(null);
    } catch (err) {
      setError(`Failed to export CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadScripts = async (inputSourceId: number) => {
    try {
      setSelectedInputSource(inputSourceId);
      const scriptsData = await apiService.getScripts(inputSourceId);
      setScripts(scriptsData);
    } catch (err) {
      console.error('Failed to load scripts:', err);
    }
  };

  const handleGenerateScript = async (inputSourceId: number, scriptType: string) => {
    try {
      setLoading(true);
      const result = await apiService.generateAutomationScript(inputSourceId, scriptType);
      alert(`Script generated successfully!\nScript ID: ${result.script_id}`);
      await loadScripts(inputSourceId);
      setError(null);
    } catch (err) {
      setError(`Failed to generate script: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadScript = async (scriptId: number, filename: string) => {
    try {
      const blob = await apiService.downloadScript(scriptId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Failed to download script: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteInputSource = async (inputSourceId: number) => {
    if (window.confirm('Are you sure you want to delete this input source? This will also delete all associated test cases, test runs, and scripts.')) {
      try {
        setLoading(true);
        await apiService.deleteInputSource(inputSourceId);
        await loadInputSources();
        setError(null);
      } catch (err) {
        setError(`Failed to delete input source: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTestCase = async (testCaseId: number, inputSourceId: number) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      try {
        setLoading(true);
        await apiService.deleteTestCase(testCaseId);
        await loadTestCases(inputSourceId);
        setError(null);
      } catch (err) {
        setError(`Failed to delete test case: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTestRun = async (testRunId: number, inputSourceId: number) => {
    console.log('Attempting to delete test run:', testRunId, 'for input source:', inputSourceId);
    if (window.confirm('Are you sure you want to delete this test run?')) {
      try {
        setLoading(true);
        console.log('Calling deleteTestRun API...');
        await apiService.deleteTestRun(testRunId);
        console.log('Test run deleted successfully, reloading test runs...');
        await loadTestRuns(inputSourceId);
        setError(null);
        console.log('Test runs reloaded successfully');
      } catch (err) {
        console.error('Error deleting test run:', err);
        setError(`Failed to delete test run: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteScript = async (scriptId: number, inputSourceId: number) => {
    console.log('Attempting to delete script:', scriptId, 'for input source:', inputSourceId);
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        setLoading(true);
        console.log('Calling deleteScript API...');
        await apiService.deleteScript(scriptId);
        console.log('Script deleted successfully, reloading scripts...');
        await loadScripts(inputSourceId);
        setError(null);
        console.log('Scripts reloaded successfully');
      } catch (err) {
        console.error('Error deleting script:', err);
        setError(`Failed to delete script: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Scriptodon Test Automation Platform
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Input Sources Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Input Sources</h2>

          {/* Swagger Upload */}
          <div className="mb-6 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">Upload Swagger File</h3>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={swaggerName}
                  onChange={(e) => setSwaggerName(e.target.value)}
                  className="border rounded px-3 py-2 w-64"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Swagger JSON:</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setSwaggerFile(e.target.files?.[0] || null)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <button
                onClick={handleSwaggerUpload}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>

          {/* Swagger URL Upload */}
          <div className="mb-6 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">Upload Swagger from URL</h3>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={swaggerUrlName}
                  onChange={(e) => setSwaggerUrlName(e.target.value)}
                  className="border rounded px-3 py-2 w-64"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Swagger URL:</label>
                <input
                  type="url"
                  value={swaggerUrl}
                  onChange={(e) => setSwaggerUrl(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="https://petstore.swagger.io/v2/swagger.json"
                />
              </div>
              <button
                onClick={handleSwaggerUrlUpload}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload from URL'}
              </button>
            </div>
          </div>

          {/* Jira Integration */}
          <div className="mb-6 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">Jira Integration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                  type="text"
                  value={jiraName}
                  onChange={(e) => setJiraName(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jira URL:</label>
                <input
                  type="url"
                  value={jiraUrl}
                  onChange={(e) => setJiraUrl(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="https://your-domain.atlassian.net"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issue Key:</label>
                <input
                  type="text"
                  value={jiraIssueKey}
                  onChange={(e) => setJiraIssueKey(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="PROJECT-123"
                />
              </div>
            </div>
            <button
              onClick={handleJiraSubmit}
              disabled={loading}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Jira Source'}
            </button>
          </div>

          {/* User Prompt */}
          <div className="mb-6 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">User Prompt</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Name:</label>
              <input
                type="text"
                value={userPromptName}
                onChange={(e) => setUserPromptName(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Content:</label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="border rounded px-3 py-2 w-full h-24"
                placeholder="Enter your test requirements..."
              />
            </div>
            <button
              onClick={handleUserPromptSubmit}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User Prompt'}
            </button>
          </div>

          {/* Input Sources List */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Existing Input Sources</h3>
            <div className="grid gap-4">
              {inputSources.map((source) => (
                <div key={source.id} className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{source.name}</h4>
                      <p className="text-sm text-gray-600">
                        Type: {source.source_type} | Created: {new Date(source.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateTestCases(source.id)}
                        disabled={loading}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                      >
                        Generate Tests
                      </button>
                      <button
                        onClick={() => handleExecuteTestCases(source.id)}
                        disabled={loading}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                      >
                        Execute Tests
                      </button>
                      <button
                        onClick={() => handleExportCSV(source.id)}
                        disabled={loading}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
                      >
                        Export CSV
                      </button>
                      <button
                        onClick={async () => {
                          await handleGenerateScript(source.id, 'playwright_python');
                          await loadScripts(source.id);
                        }}
                        disabled={loading}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 disabled:opacity-50"
                      >
                        Generate Script
                      </button>
                      <button
                        onClick={() => handleDeleteInputSource(source.id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Cases Section */}
        {testCases.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Test Cases</h2>
            <div className="grid gap-4">
              {testCases.map((testCase) => (
                <div key={testCase.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{testCase.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                      <div className="text-sm">
                        <p><strong>Steps:</strong> {testCase.steps}</p>
                        <p><strong>Expected Result:</strong> {testCase.expected_result}</p>
                        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${
                          testCase.status === 'passed' ? 'bg-green-100 text-green-800' :
                          testCase.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{testCase.status}</span></p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedInputSource) {
                          handleDeleteTestCase(testCase.id, selectedInputSource);
                        } else {
                          setError('No input source selected');
                        }
                      }}
                      disabled={loading}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Runs Section */}
        {testRuns.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Test Runs</h2>
            <div className="grid gap-4">
              {testRuns.map((testRun) => (
                <div key={testRun.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{testRun.name}</h4>
                      <div className="text-sm text-gray-600">
                        <p>Status: {testRun.status}</p>
                        <p>Total: {testRun.total_tests} | Passed: {testRun.passed_tests} | Failed: {testRun.failed_tests}</p>
                        <p>Success Rate: {testRun.total_tests > 0 ? ((testRun.passed_tests / testRun.total_tests) * 100).toFixed(1) : 0}%</p>
                      </div>
                    </div>
                    <button
                      id={`delete-testrun-${testRun.id}`}
                      onClick={() => {
                        console.log('Delete test run button clicked for test run:', testRun.id);
                        alert(`Attempting to delete test run ${testRun.id} for input source ${selectedInputSource}`);
                        if (selectedInputSource) {
                          handleDeleteTestRun(testRun.id, selectedInputSource);
                        } else {
                          setError('No input source selected');
                        }
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-2 relative z-10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scripts Section */}
        {scripts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Generated Scripts</h2>
            <div className="grid gap-4">
              {scripts.map((script) => (
                <div key={script.id} className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{script.name}</h4>
                      <p className="text-sm text-gray-600">
                        Type: {script.script_type} | Created: {new Date(script.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadScript(script.id, `${script.name}.py`)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Download Script
                      </button>
                      <button
                        id={`delete-script-${script.id}`}
                        onClick={() => {
                          console.log('Delete script button clicked for script:', script.id);
                          alert(`Attempting to delete script ${script.id} for input source ${selectedInputSource}`);
                          if (selectedInputSource) {
                            handleDeleteScript(script.id, selectedInputSource);
                          } else {
                            setError('No input source selected');
                          }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 relative z-10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;