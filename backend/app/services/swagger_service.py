import json
import requests
from typing import Dict, Any, List

class SwaggerService:
    def fetch_swagger_from_url(self, url: str) -> Dict[str, Any]:
        """Fetch Swagger/OpenAPI specification from URL"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Try to parse as JSON
            swagger_data = response.json()
            
            # Validate the fetched data
            if not self.validate_swagger(swagger_data):
                raise ValueError("Invalid Swagger/OpenAPI specification")
            
            return swagger_data
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch Swagger from URL: {str(e)}")
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON response from URL: {str(e)}")
        except Exception as e:
            raise Exception(f"Error processing Swagger URL: {str(e)}")

    def validate_swagger(self, swagger_data: Dict[str, Any]) -> bool:
        """Validate if the data is a valid Swagger/OpenAPI specification"""
        try:
            # Check for required fields
            if not isinstance(swagger_data, dict):
                return False
            
            # Check for OpenAPI version
            if 'openapi' in swagger_data:
                return True
            
            # Check for Swagger version
            if 'swagger' in swagger_data:
                return True
            
            # Check for info and paths (basic validation)
            if 'info' in swagger_data and 'paths' in swagger_data:
                return True
            
            return False
        except Exception:
            return False

    def extract_endpoints(self, swagger_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract endpoints from Swagger/OpenAPI specification"""
        endpoints = []
        
        try:
            paths = swagger_data.get('paths', {})
            
            for path, methods in paths.items():
                for method, details in methods.items():
                    if method.upper() in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
                        endpoint = {
                            'path': path,
                            'method': method.upper(),
                            'summary': details.get('summary', ''),
                            'description': details.get('description', ''),
                            'parameters': details.get('parameters', []),
                            'responses': details.get('responses', {})
                        }
                        endpoints.append(endpoint)
            
            return endpoints
        except Exception:
            return []

    def generate_test_cases_from_swagger(self, swagger_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate test cases from Swagger specification"""
        endpoints = self.extract_endpoints(swagger_data)
        test_cases = []
        
        for endpoint in endpoints:
            test_case = {
                'title': f"Test {endpoint['method']} {endpoint['path']}",
                'description': endpoint.get('summary', f"Test {endpoint['method']} endpoint"),
                'steps': f"1. Send {endpoint['method']} request to {endpoint['path']}\n2. Verify response status\n3. Validate response body",
                'expected_result': f"Should return appropriate status code and response for {endpoint['method']} {endpoint['path']}"
            }
            test_cases.append(test_case) 