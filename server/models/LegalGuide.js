import mongoose from 'mongoose';

const legalGuideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    details: { type: String, default: '' },
    estimatedTime: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('LegalGuide', legalGuideSchema);
