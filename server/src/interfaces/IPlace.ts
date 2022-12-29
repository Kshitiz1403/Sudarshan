import { Types } from 'mongoose';
import { RequireExactlyOne } from '.';

interface PlaceItem {
  latitude?: number;
  longitude?: number;
  place_id?: string;
}

export interface ILatLng {
  latitude: number;
  longitude: number;
}

export type IPlace = RequireExactlyOne<PlaceItem, ('latitude' & 'longitude') | 'place_id'>;

export interface IGoToPlaceInputDTO {
  origin: IPlace;
  destination: IPlace;
  waypoints?: IPlace[];
}

interface IBaseDataGoPlace {
  _id?: Types.ObjectId;
  start_address?: String;
  end_address?: String;
  dustbin_address?: String;
  polyline?: {
    points?: String;
    path?: { latitude: number; longitude: number }[];
  };
  distance?: { text?: String; value?: number };
  duration?: { text?: String; value?: number };
}

export interface IDataGoPlace extends IBaseDataGoPlace {
  dustbins?: IBaseDataGoPlace[];
}
