import mongoose from 'mongoose';

const legalRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestType: {
      type: String,
      enum: ['police-record', 'residence-guidance', 'document-check'],
      required: true
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['submitted', 'in-review', 'resolved'],
      default: 'submitted'
    }
  },
  { timestamps: true }
);

export default mongoose.model('LegalRequest', legalRequestSchema);
