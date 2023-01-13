import { Types } from 'mongoose';
import { IUser } from './IUser';

export interface IReport {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tripId: Types.ObjectId;
  calories: Number;
  'distance(KM)': Number;
  'time(S)': Number;
  'speed(KMH)': Number;
  'trash(KG)': Number;
  userFeedback: Number;
}

export interface IReportInputDTO {
  userId: IUser['_id'];
  tripId: IReport['tripId'];
  calories: IReport['calories'];
  'distance(KM)': Number;
  'time(S)': IReport['time(S)'];
  'speed(KMH)': IReport['speed(KMH)'];
  'trash(KG)': IReport['trash(KG)'];
}
