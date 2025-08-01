# Scritodon Frontend

This is the React frontend for the Scritodon AI-powered testing platform.

## Features

- Dashboard with overview and statistics
- Input Sources management
- Test Generation with AI
- Script Output viewing
- Manual Testing interface
- Reports and analytics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Development

The frontend is built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios for API calls

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── InputSources.tsx
│   ├── ManualTesting.tsx
│   ├── Reports.tsx
│   ├── ScriptOutput.tsx
│   ├── Sidebar.tsx
│   └── TestGeneration.tsx
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## API Integration

The frontend connects to the backend API running on `http://localhost:8000`. The Vite configuration includes a proxy to forward `/api` requests to the backend. 