import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const testConnections = async () => {
  console.log('🔍 Testing Environment Variables...\n');

  // 1. Check if variables exist
  console.log('📋 Environment Variables Status:');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
  console.log('REDIS_URL:', process.env.REDIS_URL ? '✅ Set' : '❌ Missing');
  console.log('PORT:', process.env.PORT || '5000 (default)');
  console.log('\n');

  // 2. Test MongoDB Connection
  console.log('🔌 Testing MongoDB Connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully\n');
    await mongoose.disconnect();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message, '\n');
  }

  // 3. Test Redis Connection
  console.log('🔌 Testing Redis Connection...');
  if (process.env.REDIS_URL) {
    const redisClient = createClient({ url: process.env.REDIS_URL });
    
    redisClient.on('error', (err) => {
      console.log('❌ Redis connection failed:', err.message, '\n');
    });

    try {
      await redisClient.connect();
      await redisClient.ping();
      console.log('✅ Redis connected successfully\n');
      await redisClient.quit();
    } catch (error) {
      console.log('❌ Redis connection failed:', error.message, '\n');
    }
  } else {
    console.log('⚠️  Redis URL not set (optional)\n');
  }

  // 4. Test Cloudinary Configuration
  console.log('🔌 Testing Cloudinary Configuration...');
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary configured successfully\n');
  } catch (error) {
    console.log('❌ Cloudinary configuration failed:', error.message, '\n');
  }

  console.log('✨ Test completed!');
  process.exit(0);
};

testConnections();
