import { Types } from 'mongoose';

export interface IDustbin {
  _id: Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [Number, Number];
  };
  address: String;
}

export interface IDustbinRangeInputDTO {
  minLatitude: Number;
  minLongitude: Number;
  maxLatitude: Number;
  maxLongitude: Number;
}
