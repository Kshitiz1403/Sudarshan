import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: true,
    },

    password: String,

    salt: String,

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    weightKG: {
      type: Number,
    },
    heightCM: {
      type: Number,
    },
    profileImage: {
      type: String,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
