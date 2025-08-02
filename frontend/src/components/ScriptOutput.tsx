import React, { useState } from 'react';
import { 
  Code, 
  Download, 
  Copy, 
  Play, 
  Settings,
  FileText,
  CheckCircle
} from 'lucide-react';

const ScriptOutput: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState('playwright');
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  const frameworks = [
    { id: 'playwright', name: 'Playwright', description: 'Modern web testing framework' },
    { id: 'selenium', name: 'Selenium', description: 'Classic web automation tool' },
  ];

  const languages = [
    { id: 'python', name: 'Python', description: 'Recommended for data analysis' },
    { id: 'javascript', name: 'JavaScript', description: 'Native web language' },
  ];

  const sampleScript = `# Generated Test Script - User Login Flow
import pytest
from playwright.sync_api import Page, expect

class TestUserLogin:
    
    def test_login_with_valid_credentials(self, page: Page):
        """Test successful login with valid credentials"""
        # Navigate to login page
        page.goto("https://example.com/login")
        
        # Fill login form
        page.fill('[data-testid="email"]', "user@example.com")
        page.fill('[data-testid="password"]', "password123")
        
        # Click login button
        page.click('[data-testid="login-button"]')
        
        # Verify successful login
        expect(page).to_have_url("https://example.com/dashboard")
        expect(page.locator('[data-testid="welcome-message"]')).to_be_visible()
    
    def test_login_with_invalid_credentials(self, page: Page):
        """Test login failure with invalid credentials"""
        # Navigate to login page
        page.goto("https://example.com/login")
        
        # Fill login form with invalid data
        page.fill('[data-testid="email"]', "invalid@example.com")
        page.fill('[data-testid="password"]', "wrongpassword")
        
        # Click login button
        page.click('[data-testid="login-button"]')
        
        # Verify error message
        expect(page.locator('[data-testid="error-message"]')).to_be_visible()
        expect(page.locator('[data-testid="error-message"]')).to_contain_text("Invalid credentials")`;

  const generatedFiles = [
    { name: 'test_user_login.py', size: '2.4 KB', type: 'Test Script', status: 'generated' },
    { name: 'test_user_profile.py', size: '1.8 KB', type: 'Test Script', status: 'generated' },
    { name: 'conftest.py', size: '1.2 KB', type: 'Configuration', status: 'generated' },
    { name: 'requirements.txt', size: '0.3 KB', type: 'Dependencies', status: 'generated' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Script Output</h1>
        <p className="text-gray-600">Generated automation scripts ready for execution</p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Framework</label>
            <div className="space-y-2">
              {frameworks.map((framework) => (
                <label key={framework.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="framework"
                    value={framework.id}
                    checked={selectedFramework === framework.id}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{framework.name}</p>
                    <p className="text-sm text-gray-600">{framework.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
            <div className="space-y-2">
              {languages.map((language) => (
                <label key={language.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={language.id}
                    checked={selectedLanguage === language.id}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{language.name}</p>
                    <p className="text-sm text-gray-600">{language.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generated Files */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Generated Files</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {generatedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                    <p className="text-xs text-gray-600">{file.type} • {file.size}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Script Preview */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Script Preview</h2>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Config</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                <code>{sampleScript}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Configure</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Project</span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          <Play className="w-4 h-4" />
          <span>Run Tests</span>
        </button>
      </div>
    </div>
  );
};

export default ScriptOutput;