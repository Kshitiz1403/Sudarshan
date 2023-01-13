import { IDustbin } from '@/interfaces/IDustbin';
import mongoose from 'mongoose';

const Dustbin = new mongoose.Schema(
  {
    location: {
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
    name: String,
    address: String,
    hash: String,
  },
  { timestamps: true },
);

export default mongoose.model<IDustbin & mongoose.Document>('Dustbin', Dustbin);
