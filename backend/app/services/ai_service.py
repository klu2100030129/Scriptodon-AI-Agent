import requests
import json
from app.core.config import settings
from typing import List, Dict, Any
import asyncio

class AIService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.site_url = settings.OPENROUTER_SITE_URL
        self.site_name = settings.OPENROUTER_SITE_NAME
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "qwen/qwen-2.5-72b-instruct:free"

    async def generate_test_cases(self, input_content: str, source_type: str) -> List[Dict[str, Any]]:
        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            # Return sample test cases when API key is not configured
            return self._get_sample_test_cases(input_content, source_type)
        
        prompt = self._build_test_case_prompt(input_content, source_type)
        
        try:
            response = await self._make_openrouter_request(prompt)
            return self._parse_test_cases_response(response)
        except Exception as e:
            raise Exception(f"Error generating test cases: {str(e)}")

    async def generate_automation_script(self, test_cases: List[Dict], script_type: str) -> str:
        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            # Return sample script when API key is not configured
            return self._get_sample_script(test_cases, script_type)
        
        prompt = self._build_script_prompt(test_cases, script_type)
        
        try:
            response = await self._make_openrouter_request(prompt)
            return response
        except Exception as e:
            raise Exception(f"Error generating automation script: {str(e)}")

    def _get_sample_test_cases(self, input_content: str, source_type: str) -> List[Dict[str, Any]]:
        """Return sample test cases when API key is not configured"""
        return [
            {
                "title": f"Sample Test Case for {source_type}",
                "description": f"Generated test case based on {source_type} input",
                "steps": "1. Load the application\n2. Navigate to the feature\n3. Perform the test action\n4. Verify the expected result",
                "expected_result": "The feature should work as expected"
            },
            {
                "title": f"Edge Case Test for {source_type}",
                "description": f"Test edge cases for {source_type} functionality",
                "steps": "1. Test with invalid input\n2. Test with boundary values\n3. Test error handling\n4. Verify error messages",
                "expected_result": "Application should handle errors gracefully"
            }
        ]

    def _get_sample_script(self, test_cases: List[Dict], script_type: str) -> str:
        """Return sample automation script when API key is not configured"""
        if script_type == "playwright_python":
            return '''from playwright.sync_api import sync_playwright
import time

def test_sample_functionality():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # Navigate to the application
            page.goto("http://localhost:3000")
            
            # Wait for page to load
            page.wait_for_load_state("networkidle")
            
            # Sample test steps
            print("Running sample test case...")
            
            # Add your test steps here
            # Example: page.click("button")
            # Example: page.fill("input", "test data")
            
            print("Test completed successfully!")
            
        except Exception as e:
            print(f"Test failed: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    test_sample_functionality()'''
        else:
            return '''# Sample Selenium script
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_sample_functionality():
    driver = webdriver.Chrome()
    
    try:
        # Navigate to the application
        driver.get("http://localhost:3000")
        
        # Sample test steps
        print("Running sample test case...")
        
        # Add your test steps here
        # Example: driver.find_element(By.ID, "button").click()
        
        print("Test completed successfully!")
        
    except Exception as e:
        print(f"Test failed: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    test_sample_functionality()'''

    async def _make_openrouter_request(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": self.site_url,
            "X-Title": self.site_name,
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        try:
            response = requests.post(
                url=self.base_url,
                headers=headers,
                data=json.dumps(data)
            )
            response.raise_for_status()
            
            result = response.json()
            return result['choices'][0]['message']['content']
        except requests.exceptions.RequestException as e:
            raise Exception(f"OpenRouter API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected response format from OpenRouter: {str(e)}")

    def _build_test_case_prompt(self, input_content: str, source_type: str) -> str:
        base_prompt = f"""
        Generate comprehensive test cases based on the following {source_type} input.
        Return the response as a JSON array with the following structure:
        [
            {{
                "title": "Test case title",
                "description": "Test case description",
                "steps": "Step 1. Do this\\nStep 2. Do that\\nStep 3. Verify this",
                "expected_result": "Expected outcome"
            }}
        ]
        
        Input content:
        {input_content}
        """
        return base_prompt

    def _build_script_prompt(self, test_cases: List[Dict], script_type: str) -> str:
        test_cases_text = json.dumps(test_cases, indent=2)
        
        if script_type == "playwright_python":
            framework = "Playwright with Python"
        elif script_type == "playwright_selenium":
            framework = "Playwright with Selenium"
        else:
            framework = "Playwright with Python"
        
        prompt = f"""
        Generate an automation script using {framework} based on the following test cases.
        The script should be complete and executable.
        
        Test cases:
        {test_cases_text}
        
        Generate a complete Python script that can run these test cases.
        """
        return prompt

    def _parse_test_cases_response(self, response_text: str) -> List[Dict[str, Any]]:
        try:
            # Try to extract JSON from the response
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
            else:
                # Fallback: return a simple test case
                return [{
                    "title": "Generated Test Case",
                    "description": "Test case generated from input",
                    "steps": "1. Execute the test\n2. Verify results",
                    "expected_result": "Test should pass"
                }]
        except json.JSONDecodeError:
            # Fallback: return a simple test case
            return [{
                "title": "Generated Test Case",
                "description": "Test case generated from input",
                "steps": "1. Execute the test\n2. Verify results",
                "expected_result": "Test should pass"
            }] 