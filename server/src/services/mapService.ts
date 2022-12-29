import config from '@/config';
import { IDataGoPlace, IGoToPlaceInputDTO, ILatLng, IPlace } from '@/interfaces/IPlace';
import axios, { AxiosInstance } from 'axios';
import { Inject, Service } from 'typedi';
import { decode } from '@googlemaps/polyline-codec';
import { GeoDistance, GoogleMapsApiEndpoints } from '@/enums/MapsEnums';
import { Logger } from 'winston';
import { DustbinRepository } from '@/repositories/dustbinRepository';
import { IDustbin } from '@/interfaces/IDustbin';

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

  public goToPlace = async ({ origin, destination }: IGoToPlaceInputDTO) => {
    if (!this.validatePlace(origin) || !this.validatePlace(destination)) throw 'Please enter valid location';

    try {
      const data = await (
        await this.googleMapAxiosInstance.get(GoogleMapsApiEndpoints.DIRECTIONS, {
          params: {
            origin: this.getPlace(origin),
            destination: this.getPlace(destination),
            units: 'metric',
            mode: 'walking',
            language: 'en',
          },
        })
      ).data;

      const transformedData = this.transformDataFromGoToPlace(data, false);

      const coordinates = transformedData.polyline.path;

      const { minLatitude, minLongitude, maxLatitude, maxLongitude } = this.getMinMaxPoints(coordinates);

      const dustbins = await this.dustbinRepositoryInstance.findDustbinsInRange({
        maxLatitude,
        maxLongitude,
        minLatitude,
        minLongitude,
      });

      const waypoints = await this.getWayPointsForDustbins(origin, destination, dustbins);
      transformedData.dustbins = waypoints;

      return transformedData;
    } catch (e) {
      this.logger.error(e);
      throw 'Trip info could not be found';
    }
  };

  private getWayPointsForDustbins = async (start: IPlace, end: IPlace, dustbins: IDustbin[]) => {
    const requests = dustbins.map(dustbin => {
      const [longitude, latitude] = dustbin.location.coordinates;
      const optimizeWaypoints = false; // Google cloud charges extra for more than 10 waypoints - https://developers.google.com/maps/documentation/directions/usage-and-billing
      const request = this.googleMapAxiosInstance.get(GoogleMapsApiEndpoints.DIRECTIONS, {
        params: {
          origin: this.getPlace(start),
          destination: this.getPlace(end),
          units: 'metric',
          mode: 'walking',
          language: 'en',
          optimize: optimizeWaypoints,
          waypoints: this.getLatLng(latitude, longitude),
        },
      });
      return request.then(request => {
        const data = request.data;
        const generatedData = this.transformDataFromGoToPlace(data, true, dustbin._id);
        return generatedData;
      });
    });
    return Promise.all(requests);
  };

  private transformDataFromGoToPlace = (data, isWaypoint: boolean, id?: IDataGoPlace['_id']): IDataGoPlace => {
    let obj: IDataGoPlace = {};
    const routes = data['routes'][0];

    if (id) obj._id = id;

    if (!isWaypoint) {
      const start_address = routes['legs'][0]['start_address'];
      const end_address = routes['legs'][0]['end_address'];

      const start_location = routes['legs'][0]['start_location'];
      const end_location = routes['legs'][0]['end_location'];

      obj.start_address = start_address;
      obj.start_location = start_location;

      obj.end_address = end_address;
      obj.end_location = end_location;
    } else {
      const start_address = routes['legs'][0]['start_address'];
      const start_location = routes['legs'][0]['start_location'];

      const dustbin_address = routes['legs'][0]['end_address'];
      const dustbin_location = routes['legs'][0]['end_location'];

      const end_address = routes['legs'][1]['end_address'];
      const end_location = routes['legs'][1]['end_location'];

      obj.start_address = start_address;
      obj.start_location = start_location;
      obj.dustbin_address = dustbin_address;
      obj.dustbin_location = dustbin_location;
      obj.end_address = end_address;
      obj.end_location = end_location;
    }
    const points = decode(routes.overview_polyline.points, 5);
    const coordinates = points.map(point => ({ latitude: point[0], longitude: point[1] }));
    obj.polyline = routes.overview_polyline;
    obj.polyline.path = coordinates;
    let totalDistance = 0;
    let totalTime = 0;
    // https://developers.google.com/maps/documentation/directions/get-directions#influence-routes-with-stopover-and-pass-through-points

    // Any waypoints based route has legs i.e. wherever user will stop. No waypoint routes will have only 1 element in the legs array.
    routes.legs.map(leg => {
      totalDistance += leg.distance.value;
      totalTime += leg.duration.value;
    });
    obj.distance = {
      text: this.meterToKm(totalDistance),
      value: totalDistance,
    };

    obj.duration = {
      text: this.secondsToHm(totalTime),
      value: totalTime,
    };
    return obj;
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
      arr.push(this.getPlace(place));
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
