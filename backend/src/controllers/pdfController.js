import Pdf from '../models/Pdf.js';
import { v2 as cloudinary } from 'cloudinary';

export const uploadPdf = async (req, res) => {
  try {
    const { subjectName, className, schoolName } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw',
      folder: 'academy-hub-pdfs'
    });

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const searchPdfs = async (req, res) => {
  try {
    const { subject, className, school } = req.query;
    const query = {};

    if (subject) query.subjectName = { $regex: subject, $options: 'i' };
    if (className) query.className = { $regex: className, $options: 'i' };
    if (school) query.schoolName = { $regex: school, $options: 'i' };

    const pdfs = await Pdf.find(query).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

    pdf.subjectName = subjectName || pdf.subjectName;
    pdf.className = className || pdf.className;
    pdf.schoolName = schoolName || pdf.schoolName;

    await pdf.save();
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    await cloudinary.uploader.destroy(pdf.publicId, { resource_type: 'raw' });

    await pdf.deleteOne();
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
