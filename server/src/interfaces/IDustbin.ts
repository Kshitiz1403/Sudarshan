import { Types } from 'mongoose';

export interface IDustbin {
  _id: Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  name: String;
  address: String;
  hash: String;
}

export interface IDustbinRangeInputDTO {
  minLatitude: number;
  minLongitude: number;
  maxLatitude: number;
  maxLongitude: number;
}
