import { Types } from 'mongoose';

export interface IPasswordResetToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: String;
  token_expiry: Date;
  createdAt: Date;
  updatedAt: Date;
  used: Boolean;
}

export interface IPasswordResetTokenInputDTO {
  userId: Types.ObjectId;
  token: String;
  token_expiry: Date;
}
