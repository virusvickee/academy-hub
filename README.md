# Academy Hub

A modern learning management platform for academies and students.

## Project Structure

```
academy-hub/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and store
│   │   └── test/         # Test files
│   ├── public/           # Static assets
│   └── package.json
└── vercel.json        # Vercel deployment config
```

## Features

- 🎓 Academy Dashboard - Upload and manage PDFs
- 📚 Student Dashboard - Search and view learning materials
- 🔐 Authentication system with role-based access
- ✏️ Full CRUD operations for PDF management
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- ⚡ Fast development with Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
cd frontend
npm run build
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Create `.env` file in the `frontend` directory:

```
VITE_API_URL=your_api_url
```

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **State Management**: Zustand (via store)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## License

MIT
