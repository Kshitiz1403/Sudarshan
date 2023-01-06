import { Types } from 'mongoose';
import { ILatLng } from './IPlace';

export interface ITrip {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  dustbinId: Types.ObjectId;
  source: ILatLng;
  dustbinLocation: ILatLng;
  destination: ILatLng;
  isDumped: boolean;
  isCompleted: boolean;
  weightKG: number;
  distanceMeter: number;
}

export interface ITripStartInputDTO extends Omit<ITrip, '_id' | 'isDumped' | 'weightKG' | 'isDumped' | 'isCompleted'> {}
