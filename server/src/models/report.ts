import { IReport } from '@/interfaces/IReport';
import mongoose from 'mongoose';

const Report = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    tripId: mongoose.Types.ObjectId,
    calories: Number,
    'distance(KM)': Number,
    'time(S)': Number,
    'speed(KMH)': Number,
    'trash(KG)': Number,
  },
  { timestamps: true },
);

export default mongoose.model<IReport & mongoose.Document>('Report', Report);
