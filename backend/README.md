# Academy Hub Backend

Node.js + Express + MongoDB backend for Academy Hub.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
   - MongoDB URI
   - JWT Secret
   - Cloudinary credentials

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### PDFs
- `POST /api/pdfs/upload` - Upload PDF (Academy only)
- `GET /api/pdfs/my-pdfs` - Get my PDFs (Academy only)
- `GET /api/pdfs/search` - Search PDFs
- `PUT /api/pdfs/:id` - Update PDF (Academy only)
- `DELETE /api/pdfs/:id` - Delete PDF (Academy only)

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (PDF storage)
- Multer (File upload)
