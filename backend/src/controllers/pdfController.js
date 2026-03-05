import Pdf from '../models/Pdf.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// Escape regex metacharacters
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const uploadPdf = async (req, res) => {
  try {
    const { subjectName, className, schoolName } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let result;
    try {
      // Upload to Cloudinary as image type for better PDF viewing
      result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        folder: 'academy-hub-pdfs',
        format: 'pdf',
        flags: 'attachment:false'
      });
    } finally {
      // Always cleanup temp file
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error('Failed to delete temp file:', unlinkError);
      }
    }

    const pdf = await Pdf.create({
      fileName: file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      subjectName,
      className,
      schoolName,
      uploadedBy: req.user.id
    });

    res.status(201).json(pdf);
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    console.error('Get PDFs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchPdfs = async (req, res) => {
  try {
    const { subject, className, school } = req.query;
    const query = {};

    if (subject) {
      query.subjectName = { $regex: escapeRegex(subject), $options: 'i' };
    }
    if (className) {
      query.className = { $regex: escapeRegex(className), $options: 'i' };
    }
    if (school) {
      query.schoolName = { $regex: escapeRegex(school), $options: 'i' };
    }

    const pdfs = await Pdf.find(query).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    console.error('Search PDFs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName, className, schoolName } = req.body;

    const pdf = await Pdf.findOne({ _id: id, uploadedBy: req.user.id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    if (subjectName !== undefined) pdf.subjectName = subjectName;
    if (className !== undefined) pdf.className = className;
    if (schoolName !== undefined) pdf.schoolName = schoolName;

    await pdf.save();
    res.json(pdf);
  } catch (error) {
    console.error('Update PDF error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await Pdf.findOne({ _id: id, uploadedBy: req.user.id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(pdf.publicId, { resource_type: 'image', invalidate: true });

    await pdf.deleteOne();
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
