import express from 'express';
import multer from 'multer';
import { uploadPdf, getMyPdfs, searchPdfs, updatePdf, deletePdf } from '../controllers/pdfController.js';
import { auth, isAcademy } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return cb(new Error('File must have .pdf extension'));
    }
    cb(null, true);
  }
});

router.post('/upload', auth, isAcademy, upload.single('pdf'), uploadPdf);
router.get('/my-pdfs', auth, isAcademy, getMyPdfs);
router.get('/search', auth, searchPdfs);
router.put('/:id', auth, isAcademy, updatePdf);
router.delete('/:id', auth, isAcademy, deletePdf);

export default router;
