import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import LegalGuide from '../models/LegalGuide.js';
import Tour from '../models/Tour.js';

dotenv.config();
await connectDB();

await Promise.all([Tour.deleteMany(), LegalGuide.deleteMany()]);

await Tour.insertMany([
  {
    title: 'Prague Orientation Walk',
    city: 'Prague',
    duration: '2 hours',
    category: 'orientation',
    description: 'Introductory walking route covering transport cards, public offices, and student areas.'
  },
  {
    title: 'Historic Core Tour',
    city: 'Prague',
    duration: '3 hours',
    category: 'culture',
    description: 'Guided route covering Old Town, Charles Bridge, and local customs.'
  },
  {
    title: 'Metro & Tram Essentials',
    city: 'Prague',
    duration: '1 hour',
    category: 'transport',
    description: 'Practical guide for daily commuting and ticket validation.'
  }
]);

await LegalGuide.insertMany([
  {
    title: 'Police Registration Basics',
    category: 'registration',
    summary: 'Understand the first legal registration steps and the core documents to prepare.',
    details: 'Prepare your passport, tenancy confirmation, visa documents, and booking receipt before visiting the local authority office.',
    estimatedTime: '1 to 2 business days'
  },
  {
    title: 'Residence Guidance',
    category: 'residence',
    summary: 'A practical overview for residence extensions, deadlines, and local compliance.',
    details: 'Review your permit timeline early, verify insurance coverage, and collect translated documentation before submitting the request.',
    estimatedTime: '2 to 4 weeks'
  },
  {
    title: 'Document Verification',
    category: 'documents',
    summary: 'Learn how to validate translated, notarized, and apostilled documents correctly.',
    details: 'Check whether your institution needs certified translations, apostilles, or local notarization before using any foreign document.',
    estimatedTime: '3 to 7 business days'
  }
]);

console.log('Seed complete');
await mongoose.connection.close();
