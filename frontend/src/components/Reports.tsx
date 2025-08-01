import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp,
  FileText,
  ExternalLink,
  Filter
} from 'lucide-react';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');

  const reportData = {
    totalTests: 247,
    passedTests: 189,
    failedTests: 32,
    skippedTests: 26,
    coverage: 87,
    avgExecutionTime: '12.5',
  };

  const recentReports = [
    {
      id: 'RPT-001',
      name: 'Weekly Test Summary',
      type: 'Summary Report',
      generated: '2 hours ago',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      id: 'RPT-002',
      name: 'API Test Results',
      type: 'Detailed Report',
      generated: '1 day ago',
      format: 'CSV',
      size: '847 KB',
    },
    {
      id: 'RPT-003',
      name: 'UI Test Coverage',
      type: 'Coverage Report',
      generated: '2 days ago',
      format: 'HTML',
      size: '1.2 MB',
    },
  ];

  const integrations = [
    { name: 'Jira', status: 'connected', lastSync: '5 minutes ago' },
    { name: 'GitHub', status: 'connected', lastSync: '1 hour ago' },
    { name: 'Slack', status: 'disconnected', lastSync: 'Never' },
    { name: 'Teams', status: 'connected', lastSync: '30 minutes ago' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Test execution reports and performance analytics</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{reportData.totalTests}</p>
            <p className="text-sm text-gray-600 mt-1">Total Tests</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{reportData.passedTests}</p>
            <p className="text-sm text-gray-600 mt-1">Passed</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{reportData.failedTests}</p>
            <p className="text-sm text-gray-600 mt-1">Failed</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{reportData.skippedTests}</p>
            <p className="text-sm text-gray-600 mt-1">Skipped</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{reportData.coverage}%</p>
            <p className="text-sm text-gray-600 mt-1">Coverage</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{reportData.avgExecutionTime}s</p>
            <p className="text-sm text-gray-600 mt-1">Avg Time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Report Generation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Generate Report</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Test Execution Summary</option>
                <option>Detailed Test Results</option>
                <option>Coverage Report</option>
                <option>Performance Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="format" value="pdf" className="mr-2" defaultChecked />
                  PDF
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" value="csv" className="mr-2" />
                  CSV
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" value="html" className="mr-2" />
                  HTML
                </label>
              </div>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {integrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{integration.name}</p>
                      <p className="text-sm text-gray-600">Last sync: {integration.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      integration.status === 'connected' 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-gray-700 bg-gray-100'
                    }`}>
                      {integration.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.format}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>Generated {report.generated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="px-3 py-1 text-blue-600 hover:text-blue-700">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;