# Academy Hub - Educational Platform

A full-stack MERN application for educational institutions and students to manage and access learning materials.

## 📋 Overview

This platform enables **Academies** to upload and manage educational PDFs with metadata, while **Students** can search, filter, and preview these materials. Built with performance optimization using Redis caching for faster PDF loading.

## 🎯 Features

### Academy Users
- ✅ Register and login with email/password
- ✅ Upload PDF files with metadata (subject name, class name, school name)
- ✅ Full CRUD operations (Create, Read, Update, Delete) on uploaded PDFs
- ✅ View and manage all uploaded materials

### Student Users
- ✅ Register and login with email/password
- ✅ Search PDFs by subject, class, and school
- ✅ Advanced filtering capabilities
- ✅ PDF preview functionality
- ✅ Download educational materials

### Performance & Security
- ⚡ Redis caching for optimized PDF loading speed
- 🔐 JWT-based authentication
- 🛡️ Role-based access control
- 📦 Cloud storage integration (Cloudinary)
- 🚀 Production-ready deployment

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Zustand** - State management
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Redis** - Caching layer
- **JWT** - Authentication
- **Multer** - File uploads
- **Cloudinary** - File storage

## 📁 Project Structure

```
academy-hub/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components (Login, Register, Dashboards)
│   │   ├── hooks/        # Custom React hooks (useAuth)
│   │   ├── lib/          # API client and utilities
│   │   └── test/         # Test files
│   └── package.json
├── backend/              # Express backend
│   ├── src/
│   │   ├── config/       # Database and service configs
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── server.js     # Entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd academy-hub
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional for caching)
REDIS_URL=your_redis_url
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

Create `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Development

**Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🌐 Deployment

### Live Demo
🔗 **Live Application**: [https://academy-hub-new.vercel.app](https://academy-hub-new.vercel.app)

**Deployment Stack:**
- **Frontend**: Vercel
- **Backend**: Render (https://academy-hub-2rnz.onrender.com)
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary
- **Caching**: Redis

### Deploy Backend (Render)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables from `.env`

### Deploy Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect GitHub repository to Vercel for automatic deployments.

3. Set environment variable:
   - `VITE_API_URL`: Your Render backend URL

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### PDF Management (Academy)
- `POST /api/pdfs/upload` - Upload PDF with metadata
- `GET /api/pdfs/my-pdfs` - Get academy's uploaded PDFs
- `PUT /api/pdfs/:id` - Update PDF metadata
- `DELETE /api/pdfs/:id` - Delete PDF

### PDF Search (Student)
- `GET /api/pdfs/search?subject=&className=&school=` - Search PDFs

## 🧪 Testing

```bash
cd frontend
npm run test
```

## 📝 User Flow

### Academy Workflow
1. Register with email and password (role: academy)
2. Login to dashboard
3. Upload PDF files with:
   - Subject name
   - Class name
   - School name
4. View, edit, or delete uploaded materials

### Student Workflow
1. Register with email and password (role: student)
2. Login to dashboard
3. Search PDFs using filters:
   - Subject
   - Class
   - School
4. Preview and download materials

## 🎨 UI Features

- Modern, responsive design
- Smooth animations and transitions
- Intuitive navigation
- Real-time feedback with toast notifications
- Loading states and error handling
- PDF preview modal

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based access control
- Input validation
- Rate limiting
- Helmet security headers

## ⚡ Performance Optimization

- Redis caching for frequently accessed PDFs
- Lazy loading components
- Optimized bundle size with Vite
- CDN delivery for static assets
- Efficient database queries with indexing

## 📧 Contact

For questions or issues, please contact via email or create an issue in the repository.

## 📄 License

MIT
