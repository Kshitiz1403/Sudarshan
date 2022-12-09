import { Types } from 'mongoose';
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  salt: string;
  role: 'admin' | 'user';
  dob: number;
  gender: 'Male' | 'Female' | 'Other';
  weightKG: number;
  heightCM: number;
}

export interface IUserInputDTO {
  email: string;
  password: string;
}

export interface IUserDetails {
  name: IUser['name'];
  dob: IUser['dob'];
  gender: IUser['gender'];
  weightKG: IUser['weightKG'];
  heightCM: IUser['heightCM'];
}
