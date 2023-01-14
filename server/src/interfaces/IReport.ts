import { Types } from 'mongoose';
import { IUser } from './IUser';

export interface IReport {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tripId: Types.ObjectId;
  calories: number;
  'distance(KM)': number;
  'time(S)': number;
  'speed(KMH)': number;
  'trash(KG)': number;
  userFeedback: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReportInputDTO {
  userId: IUser['_id'];
  tripId: IReport['tripId'];
  calories: IReport['calories'];
  'distance(KM)': IReport['distance(KM)'];
  'time(S)': IReport['time(S)'];
  'speed(KMH)': IReport['speed(KMH)'];
  'trash(KG)': IReport['trash(KG)'];
}
