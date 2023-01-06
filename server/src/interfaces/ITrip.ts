import { Types } from 'mongoose';
import { ILatLng } from './IPlace';

export interface ITrip {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  dustbinId: Types.ObjectId;
  source: {
    type: 'Point';
    coordinates: [number, number];
  };
  destination: {
    type: 'Point';
    coordinates: [number, number];
  };
  isDumped: boolean;
  isCompleted: boolean;
  weightKG: number;
  distanceMeter: number;
}
export interface ITripStartInputDTO {
  userId: ITrip['userId'];
  dustbinId: ITrip['dustbinId'];
  source: ILatLng;
  destination: ILatLng;
  distanceMeter: number;
}