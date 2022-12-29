import config from '@/config';
import { IGoToPlaceInputDTO, ILatLng, IPlace } from '@/interfaces/IPlace';
import axios, { AxiosInstance } from 'axios';
import { Inject, Service } from 'typedi';
import { decode, encode } from '@googlemaps/polyline-codec';
import { GeoDistance, GoogleMapsApiEndpoints } from '@/enums/MapsEnums';
import { Logger } from 'winston';
import { DustbinRepository } from '@/repositories/dustbinRepository';

@Service()
export class MapService {
  protected googleMapAxiosInstance: AxiosInstance;
  protected apiKey: string;
  protected logger: Logger;
  protected dustbinRepositoryInstance: DustbinRepository;

  constructor(@Inject('logger') logger: Logger, dustbinRepository: DustbinRepository) {
    this.logger = logger;
    this.apiKey = config.maps.apiKey;
    this.googleMapAxiosInstance = axios.create({ params: { key: this.apiKey } });
    this.dustbinRepositoryInstance = dustbinRepository;
  }

  public getAutoComplete = async (
    input: string,
    location: { latitude: number; longitude: number; radius?: number },
  ) => {
    location.radius = location.radius || 10000;
    const strictBounds = true;
    try {
      if (!input) return { predictions: [] };
      let data = await (
        await this.googleMapAxiosInstance.get(GoogleMapsApiEndpoints.AUTOCOMPLETE, {
          params: {
            input,
            location: `${location.latitude},${location.longitude}`,
            radius: location.radius,
            strictBounds,
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
      this.logger.error(error);
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

    try {
      const data = await (
        await this.googleMapAxiosInstance.get(GoogleMapsApiEndpoints.DIRECTIONS, {
          params: {
            origin: this.getPlace(origin),
            destination: this.getPlace(destination),
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
      const steps = routes['legs'][0]['steps'];
      const obj = {};
      const points = decode(routes.overview_polyline.points, 5);
      const coordinates = points.map(point => {
        return { latitude: point[0], longitude: point[1] };
      });

      const { minLatitude, minLongitude, maxLatitude, maxLongitude } = this.getMinMaxPoints(coordinates);

      const dustbins = await this.dustbinRepositoryInstance.findDustbinsInRange({
        maxLatitude,
        maxLongitude,
        minLatitude,
        minLongitude,
      });
      const dustbinPoints = dustbins.map(dustbin => {
        return {
          _id: dustbin._id,
          address: dustbin.address,
          latitude: dustbin.location.coordinates[1],
          longitude: dustbin.location.coordinates[0],
        };
      });

      obj['dustbins'] = dustbinPoints;
      obj['polyline'] = routes.overview_polyline;
      obj['polyline']['path'] = coordinates;
      //   const arr: String[] = [];
      //   data.geocoded_waypoints.map(waypoint => {
      //     arr.push(waypoint.place_id);
      //   });
      //
      //   obj['waypoints'] = arr;
      //   obj['waypoint_order'] = routes.waypoint_order;
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
    } catch (e) {
      this.logger.error(e);
      throw 'Trip info could not be found';
    }
  };

  private getMinMaxPoints = (coordinates: ILatLng[]) => {
    let delta = 0.0005;
    let maxLatitude = -10000;
    let minLatitude = 10000; //some arbitrary big value

    let maxLongitude = -10000;
    let minLongitude = 10000; //some arbitrary big value
    coordinates.map(coord => {
      maxLatitude = Math.max(maxLatitude, coord.latitude + delta);
      minLatitude = Math.min(minLatitude, coord.latitude - delta);

      maxLongitude = Math.max(maxLongitude, coord.longitude + delta);
      minLongitude = Math.min(minLongitude, coord.longitude - delta);
    });

    return { minLatitude, minLongitude, maxLatitude, maxLongitude };
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
