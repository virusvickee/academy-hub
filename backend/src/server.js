import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import './config/cloudinary.js';
import authRoutes from './routes/authRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Academy Hub API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      pdfs: {
        upload: 'POST /api/pdfs/upload',
        myPdfs: 'GET /api/pdfs/my-pdfs',
        search: 'GET /api/pdfs/search',
        update: 'PUT /api/pdfs/:id',
        delete: 'DELETE /api/pdfs/:id'
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    res.status(500).json({ message: 'Something went wrong!' });
  } else {
    res.status(500).json({
      message: 'Something went wrong!',
      error: err.message,
      stack: err.stack
    });
  }
});

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
