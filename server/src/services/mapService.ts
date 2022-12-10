import config from '@/config';
import { IGoToPlaceInputDTO, IPlace } from '@/interfaces/IPlace';
import { Client, UnitSystem, Language } from '@googlemaps/google-maps-services-js';
import { TravelMode } from '@googlemaps/google-maps-services-js/dist/common';
import axios from 'axios';
import { Service } from 'typedi';

@Service()
export class MapService {
  private readonly apiKey = config.maps.apiKey;

  private client = new Client({});

  public getAutoComplete = async (
    input: string,
    location: { latitude: number; longitude: number; radius?: number },
  ) => {
    location.radius = location.radius || 10000;
    const strictBounds = true;
    const l = `${location.latitude}, ${location.longitude}`;
    const query = `input=${input}&location=${l}&radius=${location.radius}&strictbounds=${strictBounds}&key=${this.apiKey}`;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${location.latitude},${location.longitude}&radius=${location.radius}&strictbounds=${strictBounds}&key=${this.apiKey}`;

    try {
      let data = await (await axios.get(url)).data;
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

    let optimize_waypoints = false;
    let waypoints_place = [];
    if (waypoints && waypoints.length > 0) {
      waypoints_place = this.getPlaces(waypoints);
    }
    if (waypoints_place.length > 0) optimize_waypoints = true;

    const data = (
      await this.client.directions({
        params: {
          origin: this.getPlace(origin),
          destination: this.getPlace(destination),
          key: this.apiKey,
          units: UnitSystem.metric,
          mode: TravelMode.walking,
          language: Language.en,
          optimize: optimize_waypoints,
          waypoints: waypoints_place,
        },
      })
    ).data;
    let totalDistance = 0;
    let totalTime = 0;
    const routes = data['routes'][0];
    const obj = {};
    obj['overview_polyline'] = routes.overview_polyline;
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
