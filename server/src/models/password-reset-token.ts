import mongoose, { Schema } from 'mongoose';

const PasswordResetToken = new mongoose.Schema(
  {
    userId: Schema.Types.ObjectId,
    token: String,
    token_expiry: Date,
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model('PasswordResetToken', PasswordResetToken);
