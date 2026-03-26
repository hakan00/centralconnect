import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    airport: { type: String, required: true },
    destination: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    passengers: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Transfer', transferSchema);
