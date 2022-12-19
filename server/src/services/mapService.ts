import config from '@/config';
import { IGoToPlaceInputDTO, IPlace } from '@/interfaces/IPlace';
import axios, { AxiosInstance } from 'axios';
import { Inject, Service } from 'typedi';
import { decode } from '@googlemaps/polyline-codec';
import { GeoDistance, GoogleMapsApiEndpoints } from '@/enums/MapsEnums';
import { Logger } from 'winston';
import { writeFileSync } from 'fs';

interface CartesianInputDTO {
  origin: { x1: number; y1: number };
  destination: { x2: number; y2: number };
}
interface TwoPointsCartesianInputDTO {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
interface IIntersectionInputDTO {
  origin: { x1: number; y1: number };
  destination: { x2: number; y2: number };
  center: { g: number; f: number };
}
interface IIntersectionItem {
  x: number;
  y: number;
}
interface ICenter {
  g: number;
  f: number;
}
type IIntersection = IIntersectionItem[];

@Service()
export class MapService {
  protected googleMapAxiosInstance: AxiosInstance;
  protected apiKey: string;
  protected logger: Logger;

  constructor(@Inject('logger') logger: Logger) {
    this.logger = logger;
    this.apiKey = config.maps.apiKey;
    this.googleMapAxiosInstance = axios.create({ params: { key: this.apiKey } });
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
      const coordinatesInPath = this.getCoordinatesInPath(steps);
      const obj = {};
      const points = decode(routes.overview_polyline.points, 5);
      const coords = points.map(point => {
        return { latitude: point[0], longitude: point[1] };
      });
      obj['polyline'] = routes.overview_polyline;
      obj['polyline']['path'] = coords;
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
    } catch (e) {
      this.logger.error(e);
      throw 'Trip info could not be found';
    }
  };

  public getCoordinatesInPath = steps => {
    const validGeoCoordinateCenters = [];
    const step = steps[0];
    const validCircleCenters: ICenter[] = [];
    const { start_location, end_location } = step;
    // Approximation works for small distances
    const { x: x1, y: y1, z: z1 } = this.getCartesian(start_location.lat, start_location.lng);
    const { x: x2, y: y2, z: z2 } = this.getCartesian(end_location.lat, end_location.lng);
    const history = new Set();
    this.recursiveRoots(
      { origin: { x1, y1 }, destination: { x2, y2 }, center: { g: x1, f: y1 } },
      history,
      validCircleCenters,
    );
    validCircleCenters.map(center => {
      const { lat, lng } = this.getLatLngFromCartesian({ x: center.g, y: center.f, z: z2 });
      validGeoCoordinateCenters.push({ lat, lng });
    });
    // steps.map(step => {
    //   const validCircleCenters: ICenter[] = [];
    //   const { start_location, end_location } = step;
    //   // Approximation works for small distances
    //   const { x: x1, y: y1, z: z1 } = this.getCartesian(start_location.lat, start_location.lng);
    //   const { x: x2, y: y2, z: z2 } = this.getCartesian(end_location.lat, end_location.lng);
    //   const history = new Set();
    //   this.recursiveRoots(
    //     { origin: { x1, y1 }, destination: { x2, y2 }, center: { g: x1, f: y1 } },
    //     history,
    //     validCircleCenters,
    //   );
    //   validCircleCenters.map(center => {
    //     const { lat, lng } = this.getLatLngFromCartesian({ x: center.g, y: center.f, z: z2 });
    //     validGeoCoordinateCenters.push({ lat, lng });
    //   });
    // });
    return validGeoCoordinateCenters;
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

  private recursiveRoots = (
    { origin, destination, center }: IIntersectionInputDTO,
    history: Set<any>,
    validCircleCenters: ICenter[],
  ) => {
    const { x1, y1 } = origin;
    const { x2, y2 } = destination;
    const [root1, root2] = this.getIntersectionPointsBetweenLineAndCircle({ origin, destination, center });
    if (!history.has(JSON.stringify({ g: root1.x, f: root1.y })) && this.isValidRoot({ x1, x2, y1, y2 }, root1)) {
      const new_center = { g: root1.x, f: root1.y };
      validCircleCenters.push(new_center);
      history.add(JSON.stringify(new_center));
      this.recursiveRoots({ origin, destination, center: new_center }, history, validCircleCenters);
    }
    if (!history.has(JSON.stringify({ g: root2.x, f: root2.y })) && this.isValidRoot({ x1, x2, y1, y2 }, root2)) {
      const new_center = { g: root2.x, f: root2.y };
      validCircleCenters.push(new_center);
      history.add(JSON.stringify(new_center));
      this.recursiveRoots({ origin, destination, center: new_center }, history, validCircleCenters);
    }
  };

  private;

  private isValidRoot = (line_end_points: TwoPointsCartesianInputDTO, root: { x: number; y: number }) => {
    const distanceFromOneSide = this.distanceBetweenTwoPoints({
      x1: root.x,
      y1: root.y,
      x2: line_end_points.x1,
      y2: line_end_points.y1,
    });

    const distanceFromOtherSide = this.distanceBetweenTwoPoints({
      x1: root.x,
      y1: root.y,
      x2: line_end_points.x2,
      y2: line_end_points.y2,
    });

    const lengthOfLineSegment = this.distanceBetweenTwoPoints({
      x1: line_end_points.x1,
      y1: line_end_points.y1,
      x2: line_end_points.x2,
      y2: line_end_points.y2,
    });

    if (distanceFromOneSide > lengthOfLineSegment || distanceFromOtherSide > lengthOfLineSegment) return false;
    return true;
  };
  private getIntersectionPointsBetweenLineAndCircle = ({
    origin,
    destination,
    center,
  }: IIntersectionInputDTO): IIntersection => {
    /**
     * @TODO
     */
    const radius = 0.05; //temporary value, tuning parameter -> radius to be set to 50 meters wafter conversion from miles
    const m = this.slope({ origin, destination });
    const c = this.y_intercept({ origin, destination });
    const { g, f } = center;
    console.log(origin);
    console.log(destination);
    console.log('m', m);
    console.log('c', c);
    console.log('%o', center);
    // x^2 (1 + m^2)  + x (2mc + 2fm + 2g) + 2fc + R + c^2 = 0
    const [x_value_1, x_value_2] = this.quadratic(
      1 + Math.pow(m, 2),
      2 * m * c + 2 * f * m + 2 * g,
      2 * f * c + Math.pow(c, 2) + radius,
    );
    const y_value_1 = this.getYFromXInLine(x_value_1, m, c);
    const y_value_2 = this.getYFromXInLine(x_value_2, m, c);
    console.log(x_value_1);
    console.log(x_value_2);
    return [
      { x: x_value_1, y: y_value_1 },
      { x: x_value_2, y: y_value_2 },
    ];
  };

  private getYFromXInLine = (x, slope, y_intercept) => {
    return slope * x + y_intercept;
  };

  private quadratic(a: number, b: number, c: number) {
    var result = (-1 * b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    var result2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    return [result, result2];
  }

  private slope = ({ origin, destination }: CartesianInputDTO) => {
    return (destination.y2 - origin.y1) / (destination.x2 - origin.x1);
  };

  private y_intercept = ({ origin, destination }: CartesianInputDTO) => {
    return destination.y2 - destination.x2 * this.slope({ origin, destination });
  };

  private getCartesian = (lat, lng) => {
    // https://stackoverflow.com/questions/1185408/converting-from-longitude-latitude-to-cartesian-coordinates

    (lat = this.degrees_to_radians(lat)), (lng = this.degrees_to_radians(lng));
    const x = GeoDistance.RADIUS_OF_EARTH * Math.cos(lat) * Math.cos(lng);
    const y = GeoDistance.RADIUS_OF_EARTH * Math.cos(lat) * Math.sin(lng);
    const z = GeoDistance.RADIUS_OF_EARTH * Math.sin(lat);
    return { x, y, z };
  };

  private getLatLngFromCartesian = ({ x, y, z }) => {
    // https://stackoverflow.com/questions/1185408/converting-from-longitude-latitude-to-cartesian-coordinates
    const r = Math.sqrt(x * x + y * y + z * z);
    const lat = this.radians_to_degrees(Math.asin(z / r));
    const lon = this.radians_to_degrees(Math.atan2(y, x));
    return { lat, lng: lon };
  };

  private degrees_to_radians = degrees => {
    const pi = Math.PI;
    return degrees * (pi / 180);
  };

  private radians_to_degrees = radians => {
    const pi = Math.PI;
    return radians * (180 / pi);
  };

  private distanceBetweenTwoPoints = ({ x1, x2, y1, y2 }: TwoPointsCartesianInputDTO) => {
    const a = y2 - y1;
    const b = x2 - x1;
    return Math.sqrt(a * a + b * b);
  };
}
