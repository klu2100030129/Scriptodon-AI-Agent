# Scritodon Test Automation Platform - Backend

A FastAPI-based backend for the Scritodon Test Automation Platform that provides AI-powered test case generation and automation script creation.

## Features

### Input Sources
- **Swagger/OpenAPI**: Upload JSON files and generate API test cases
- **Jira Integration**: Connect to Jira and extract user stories for test generation
- **User Prompts**: Generate test cases from natural language descriptions

### Test Generation
- AI-powered test case generation using Gemini API
- Automatic test execution with results tracking
- Support for multiple test scenarios (positive, negative, edge cases)

### Script Output
- Generate Playwright Python automation scripts
- Generate Playwright Selenium automation scripts
- Export scripts for download and execution

### Manual Testing
- Export test cases to CSV for QA teams
- Track manual test execution results
- Integration with existing QA workflows

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (with SQLAlchemy ORM)
- **AI Integration**: Google Gemini API
- **File Handling**: Python multipart
- **API Documentation**: Swagger UI (auto-generated)

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
# Required: Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Jira Configuration
JIRA_SERVER_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your_jira_username
JIRA_API_TOKEN=your_jira_api_token
```

### 3. Run the Application

```bash
python start.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Input Sources

#### Swagger Integration
- `POST /api/input-sources/swagger` - Upload Swagger JSON file
- `POST /api/input-sources/jira` - Create input source from Jira URL
- `POST /api/input-sources/user-prompt` - Create input source from user prompt
- `GET /api/input-sources/` - Get all input sources
- `GET /api/input-sources/{id}` - Get specific input source
- `DELETE /api/input-sources/{id}` - Delete input source

### Test Generation

- `POST /api/test-generation/generate/{input_source_id}` - Generate test cases
- `POST /api/test-generation/execute/{input_source_id}` - Execute test cases
- `GET /api/test-generation/results/{input_source_id}` - Get test results
- `GET /api/test-generation/test-cases/{input_source_id}` - Get test cases

### Script Output

- `POST /api/script-output/generate/{input_source_id}` - Generate automation script
- `GET /api/script-output/scripts/{input_source_id}` - Get scripts for input source
- `GET /api/script-output/download/{script_id}` - Download script file
- `DELETE /api/script-output/scripts/{script_id}` - Delete script

### Manual Testing

- `GET /api/manual-testing/test-cases/{input_source_id}` - Get test cases for manual testing
- `GET /api/manual-testing/export-csv/{input_source_id}` - Export test cases to CSV
- `GET /api/manual-testing/test-results/{input_source_id}` - Get test results
- `GET /api/manual-testing/input-sources` - Get input sources with test counts

## Database Schema

### InputSource
- `id`: Primary key
- `name`: Input source name
- `source_type`: Type (swagger, jira, user_prompt)
- `content`: Source content
- `file_path`: Path to uploaded file (if applicable)
- `jira_url`: Jira URL (for Jira sources)
- `jira_issue_key`: Jira issue key (for Jira sources)
- `swagger_url`: Swagger URL (for Swagger sources)

### TestCase
- `id`: Primary key
- `input_source_id`: Foreign key to InputSource
- `name`: Test case name
- `description`: Test case description
- `test_steps`: Test execution steps
- `expected_result`: Expected outcome
- `status`: Test status (pending, running, passed, failed, error)
- `execution_time`: Execution time in seconds
- `error_message`: Error message if failed

### TestRun
- `id`: Primary key
- `input_source_id`: Foreign key to InputSource
- `name`: Test run name
- `status`: Run status (running, completed, failed)
- `total_tests`: Total number of tests
- `passed_tests`: Number of passed tests
- `failed_tests`: Number of failed tests
- `error_tests`: Number of error tests
- `execution_time`: Total execution time
- `started_at`: Start timestamp
- `completed_at`: Completion timestamp

### Script
- `id`: Primary key
- `input_source_id`: Foreign key to InputSource
- `name`: Script name
- `script_type`: Type (playwright_python, playwright_selenium)
- `content`: Script content
- `file_path`: Path to script file

## Usage Examples

### 1. Upload Swagger File

```bash
curl -X POST "http://localhost:8000/api/input-sources/swagger" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@swagger.json" \
  -F "name=My API"
```

### 2. Generate Test Cases

```bash
curl -X POST "http://localhost:8000/api/test-generation/generate/1"
```

### 3. Execute Tests

```bash
curl -X POST "http://localhost:8000/api/test-generation/execute/1"
```

### 4. Generate Automation Script

```bash
curl -X POST "http://localhost:8000/api/script-output/generate/1" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "script_type=playwright_python"
```

## API Documentation

Once the application is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development

### Project Structure

```
backend/
├── app/
│   ├── core/           # Configuration and database
│   ├── models/         # Database models
│   ├── routers/        # API endpoints
│   ├── schemas/        # Pydantic schemas
│   └── services/       # Business logic
├── uploads/            # File uploads
├── scripts/            # Generated scripts
├── reports/            # Test reports
├── main.py             # FastAPI application
├── start.py            # Startup script
└── requirements.txt    # Dependencies
```

### Adding New Features

1. Create models in `app/models/`
2. Create schemas in `app/schemas/`
3. Create services in `app/services/`
4. Create routers in `app/routers/`
5. Update main.py to include new routers

## Troubleshooting

### Common Issues

1. **Gemini API Key Not Set**: Ensure `GEMINI_API_KEY` is set in `.env`
2. **Database Errors**: Delete `scritodon.db` and restart the application
3. **File Upload Issues**: Ensure `uploads/` directory exists
4. **CORS Errors**: Check `BACKEND_CORS_ORIGINS` in configuration

### Logs

The application logs to console with different levels:
- INFO: General application events
- ERROR: Error messages
- DEBUG: Detailed debugging information

## License

This project is part of the Scritodon Test Automation Platform. 