import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    universityName: { type: String, required: true },
    programName: { type: String, required: true },
    intakeTerm: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under-review', 'accepted', 'rejected'],
      default: 'draft'
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);
