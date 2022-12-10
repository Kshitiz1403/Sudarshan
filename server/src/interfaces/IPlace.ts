import { RequireExactlyOne } from '.';

interface PlaceItem {
  latitude?: number;
  longitude?: number;
  place_id?: string;
}

export type IPlace = RequireExactlyOne<PlaceItem, ('latitude' & 'longitude')| 'place_id'>;

export interface IGoToPlaceInputDTO {
  origin: IPlace;
  destination: IPlace;
  waypoints?: IPlace[];
}
