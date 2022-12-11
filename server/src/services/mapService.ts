import config from '@/config';
import { IGoToPlaceInputDTO, IPlace } from '@/interfaces/IPlace';
import axios from 'axios';
import { Service } from 'typedi';
import { decode } from '@googlemaps/polyline-codec';
import { GoogleMapsApiEndpoints } from '@/enums/GoogleMapsApiEndpoints';

const apiKey = config.maps.apiKey;

@Service()
export class MapService {
  public getAutoComplete = async (
    input: string,
    location: { latitude: number; longitude: number; radius?: number },
  ) => {
    location.radius = location.radius || 10000;
    const strictBounds = true;
    try {
      let data = (
        await axios.get(GoogleMapsApiEndpoints.AUTOCOMPLETE, {
          params: {
            input,
            location: `${location.latitude},${location.longitude}`,
            radius: location.radius,
            strictBounds,
            key: apiKey,
          },
        })
      ).data;
      data = Object.values(data)[0];
      const predictions = [];

      data.map(prediction => {
        const obj = {};
        obj['description'] = prediction['description'];
        obj['place_id'] = prediction['place_id'];
        obj['reference'] = prediction['reference'];

        const structured_formatting = {};
        structured_formatting['main_text'] = prediction['structured_formatting']['main_text'];
        structured_formatting['secondary_text'] = prediction['structured_formatting']['secondary_text'];
        obj['structured_formatting'] = structured_formatting;
        obj['terms'] = prediction['terms'];
        predictions.push(obj);
      });

      return { predictions };
    } catch (error) {
      throw 'Autocomplete could not be completed';
    }
  };

  public goToPlace = async ({ origin, destination, waypoints }: IGoToPlaceInputDTO) => {
    if (!this.validatePlace(origin) || !this.validatePlace(destination)) throw 'Please enter valid location';

    if (waypoints && waypoints.length > 9) throw 'Waypoints cannot be more than 9'; // Google cloud charges extra for more than 10 waypoints - https://developers.google.com/maps/documentation/directions/usage-and-billing
    let optimize_waypoints = false;
    let waypoints_place = [];
    if (waypoints && waypoints.length > 0) {
      waypoints_place = this.getPlaces(waypoints);
    }
    if (waypoints_place.length > 0) optimize_waypoints = true;

    const data = (
      await axios.get(GoogleMapsApiEndpoints.DIRECTIONS, {
        params: {
          origin: this.getPlace(origin),
          destination: this.getPlace(destination),
          key: apiKey,
          units: 'metric',
          mode: 'walking',
          language: 'en',
          optimize: optimize_waypoints,
          waypoints: waypoints_place,
        },
      })
    ).data;

    let totalDistance = 0;
    let totalTime = 0;
    const routes = data['routes'][0];
    const obj = {};
    const points = decode(routes.overview_polyline.points, 5);
    obj['overview_polyline'] = routes.overview_polyline;
    obj['overview_polyline']['path'] = points;
    const arr: String[] = [];
    data.geocoded_waypoints.map(waypoint => {
      arr.push(waypoint.place_id);
    });

    obj['waypoints'] = arr;
    obj['waypoint_order'] = routes.waypoint_order;
    routes.legs.map(leg => {
      totalDistance += leg.distance.value;
      totalTime += leg.duration.value;
    });
    obj['distance'] = {
      text: this.meterToKm(totalDistance),
      value: totalDistance,
    };
    obj['duration'] = {
      text: this.secondsToHm(totalTime),
      value: totalTime,
    };
    return obj;
  };

  private validatePlace = (place: IPlace) => {
    if (place.hasOwnProperty('latitude') && place.hasOwnProperty('longitude'))
      return !this.isEmptyValue(place['latitude']) && !this.isEmptyValue(place['longitude']);
    if (place.hasOwnProperty('place_id')) return !this.isEmptyValue(place['place_id']);
    return false;
  };

  private isEmptyValue = v => {
    return v === '' || v === null || v === undefined;
  };

  private secondsToHm = seconds => {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.ceil((seconds % 3600) / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes') : '';
    return hDisplay + mDisplay;
  };

  private meterToKm = meters => {
    meters = Number(meters);
    const km = meters / 1000;
    return km.toFixed(1) + ' km';
  };

  private getPlaces = (places: IPlace[]) => {
    const arr = [];
    places.map(place => {
      const place_id = this.getPlaceId(place.place_id);
      const lat_lng = this.getLatLng(place.latitude, place.longitude);
      if (place_id) arr.push(place_id);
      else if (lat_lng) arr.push(lat_lng);
    });
    return arr;
  };

  private getPlace = (place: IPlace) => {
    if (this.getPlaceId(place.place_id)) return this.getPlaceId(place.place_id);
    if (this.getLatLng(place.latitude, place.longitude)) return this.getLatLng(place.latitude, place.longitude);
    return null;
  };

  private getPlaceId = (placeId: IPlace['place_id']) => {
    if (placeId) return `place_id:${placeId}`;
    return null;
  };
  private getLatLng = (lat: IPlace['latitude'], lng: IPlace['longitude']) => {
    if (lat && lng) return `${lat},${lng}`;
    return null;
  };
}
