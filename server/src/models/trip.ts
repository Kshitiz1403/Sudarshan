import { ITrip } from '@/interfaces/ITrip';
import mongoose from 'mongoose';

const SourceSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const Trip = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    dustbinId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    source: {
      type: SourceSchema,
      required: true,
    },
    destination: {
      latitude: Number,
      longitude: Number,
    },
    isDumped: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    weightKG: Number,
    distanceMeter: Number,
  },
  { timestamps: true },
);

export default mongoose.model<ITrip & mongoose.Document>('Trip', Trip);
