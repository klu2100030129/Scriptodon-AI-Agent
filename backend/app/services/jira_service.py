import requests
from typing import Dict, Any, Optional, List
import json
from app.core.config import settings

class JiraService:
    def __init__(self):
        self.base_url = settings.JIRA_SERVER_URL
        self.username = settings.JIRA_USERNAME
        self.api_token = settings.JIRA_API_TOKEN

    async def fetch_jira_issue(self, jira_url: str, issue_key: str) -> str:
        """Fetch Jira issue content"""
        try:
            # If we have Jira credentials, use the API
            if self.base_url and self.username and self.api_token:
                return await self._fetch_via_api(issue_key)
            else:
                # Fallback to public URL (limited functionality)
                return await self._fetch_via_public_url(jira_url, issue_key)
        except Exception as e:
            raise Exception(f"Failed to fetch Jira issue: {str(e)}")

    async def _fetch_via_api(self, issue_key: str) -> str:
        """Fetch issue via Jira REST API"""
        url = f"{self.base_url}/rest/api/3/issue/{issue_key}"
        auth = (self.username, self.api_token)
        
        response = requests.get(url, auth=auth)
        response.raise_for_status()
        
        issue_data = response.json()
        return self._parse_jira_issue(issue_data)

    async def _fetch_via_public_url(self, jira_url: str, issue_key: str) -> str:
        """Fetch issue via public URL (basic implementation)"""
        # This is a simplified implementation
        # In a real scenario, you might need to scrape the page or use a different approach
        return f"""
        Jira Issue: {issue_key}
        URL: {jira_url}
        
        Note: This is a placeholder implementation. 
        For full functionality, configure Jira API credentials in the .env file.
        
        To get the actual issue content, you would need to:
        1. Set JIRA_SERVER_URL in .env
        2. Set JIRA_USERNAME in .env  
        3. Set JIRA_API_TOKEN in .env
        """

    def _parse_jira_issue(self, issue_data: Dict[str, Any]) -> str:
        """Parse Jira issue data into readable content"""
        fields = issue_data.get('fields', {})
        
        content = f"""
        Issue Key: {issue_data.get('key', 'N/A')}
        Summary: {fields.get('summary', 'N/A')}
        Description: {fields.get('description', 'N/A')}
        Status: {fields.get('status', {}).get('name', 'N/A')}
        Priority: {fields.get('priority', {}).get('name', 'N/A')}
        Assignee: {fields.get('assignee', {}).get('displayName', 'N/A')}
        Reporter: {fields.get('reporter', {}).get('displayName', 'N/A')}
        Created: {fields.get('created', 'N/A')}
        Updated: {fields.get('updated', 'N/A')}
        """
        
        return content

    def validate_jira_url(self, url: str) -> bool:
        """Validate Jira URL format"""
        return 'atlassian.net' in url or 'jira.com' in url

    def extract_issue_key_from_url(self, url: str) -> Optional[str]:
        """Extract issue key from Jira URL"""
        try:
            # Common patterns for Jira URLs
            if '/browse/' in url:
                return url.split('/browse/')[-1]
            elif '/issues/' in url:
                return url.split('/issues/')[-1]
            else:
                # Try to find a pattern like PROJECT-123
                import re
                match = re.search(r'([A-Z]+-\d+)', url)
                return match.group(1) if match else None
        except Exception:
            return None

    def parse_jira_content(self, jira_data: Dict[str, Any]) -> str:
        """Parse Jira issue data into a structured format for test generation"""
        content = f"""
        Issue: {jira_data.get('key', 'N/A')}
        Summary: {jira_data.get('summary', 'N/A')}
        Description: {jira_data.get('description', 'N/A')}
        Type: {jira_data.get('issue_type', 'N/A')}
        Status: {jira_data.get('status', 'N/A')}
        Priority: {jira_data.get('priority', 'N/A')}
        Assignee: {jira_data.get('assignee', 'N/A')}
        Reporter: {jira_data.get('reporter', 'N/A')}
        Created: {jira_data.get('created', 'N/A')}
        Updated: {jira_data.get('updated', 'N/A')}
        """
        return content

    def generate_jira_test_cases(self, jira_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate test cases from Jira issue data"""
        test_cases = []
        
        # Generate test case based on issue type
        issue_type = jira_data.get('issue_type', '').lower()
        summary = jira_data.get('summary', '')
        description = jira_data.get('description', '')
        
        if 'bug' in issue_type:
            # Generate bug reproduction test case
            test_case = {
                'title': f"Reproduce Bug: {summary}",
                'description': f"Test case to reproduce the bug described in {jira_data.get('key', '')}",
                'steps': f"1. Navigate to the affected functionality\n2. Perform the steps that cause the bug\n3. Verify the bug occurs\n4. Document the bug behavior",
                'expected_result': "Bug should be reproducible and documented"
            }
            test_cases.append(test_case)
        
        elif 'story' in issue_type or 'task' in issue_type:
            # Generate acceptance test cases
            acceptance_test = {
                'title': f"Acceptance Test: {summary}",
                'description': f"Acceptance test for user story {jira_data.get('key', '')}",
                'steps': f"1. Review the user story requirements\n2. Execute the acceptance criteria\n3. Verify all requirements are met\n4. Document any issues found",
                'expected_result': "All acceptance criteria should be satisfied"
            }
            test_cases.append(acceptance_test)
        
        return test_cases 