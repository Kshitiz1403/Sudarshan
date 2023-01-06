import { ITrip } from '@/interfaces/ITrip';
import mongoose from 'mongoose';

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
      type: {
        type: 'String',
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    destination: {
      type: {
        type: 'String',
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
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
