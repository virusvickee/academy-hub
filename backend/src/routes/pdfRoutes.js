import express from 'express';
import multer from 'multer';
import { uploadPdf, getMyPdfs, searchPdfs, updatePdf, deletePdf } from '../controllers/pdfController.js';
import { auth, isAcademy } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, isAcademy, upload.single('pdf'), uploadPdf);
router.get('/my-pdfs', auth, isAcademy, getMyPdfs);
router.get('/search', auth, searchPdfs);
router.put('/:id', auth, isAcademy, updatePdf);
router.delete('/:id', auth, isAcademy, deletePdf);

export default router;
