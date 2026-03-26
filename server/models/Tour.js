import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    city: { type: String, required: true },
    duration: { type: String, required: true },
    category: { type: String, enum: ['orientation', 'culture', 'food', 'transport'], required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Tour', tourSchema);
