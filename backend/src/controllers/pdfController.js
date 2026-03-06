import Pdf from '../models/Pdf.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import redisClient from '../config/redis.js';

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
      result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'raw',
        folder: 'academy-hub-pdfs'
      });
    } finally {
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

    // Clear search cache
    try {
      const keys = await redisClient.keys('search:*');
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {}

    res.status(201).json(pdf);
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyPdfs = async (req, res) => {
  try {
    const cacheKey = `mypdfs:${req.user.id}`;
    
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {}

    const pdfs = await Pdf.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    
    try {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(pdfs));
    } catch (err) {}

    res.json(pdfs);
  } catch (error) {
    console.error('Get PDFs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchPdfs = async (req, res) => {
  try {
    const { subject, className, school } = req.query;
    const cacheKey = `search:${subject || ''}:${className || ''}:${school || ''}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {}

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
    
    try {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(pdfs));
    } catch (err) {}

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

    // Clear cache
    try {
      const keys = await redisClient.keys('*');
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {}

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

    await cloudinary.uploader.destroy(pdf.publicId, { resource_type: 'raw' });
    await pdf.deleteOne();

    // Clear cache
    try {
      const keys = await redisClient.keys('*');
      if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {}

    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
