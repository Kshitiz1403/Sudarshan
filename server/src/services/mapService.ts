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
      // const data = await (
      //   await this.googleMapAxiosInstance.get(GoogleMapsApiEndpoints.DIRECTIONS, {
      //     params: {
      //       origin: this.getPlace(origin),
      //       destination: this.getPlace(destination),
      //       units: 'metric',
      //       mode: 'walking',
      //       language: 'en',
      //       optimize: optimize_waypoints,
      //       waypoints: waypoints_place,
      //     },
      //   })
      // ).data;

      const data = {
        geocoded_waypoints: [
          {
            geocoder_status: 'OK',
            place_id: 'ChIJkRAxYEy0bTkRP6iOgYh3fJ8',
            types: ['intersection'],
          },
          {
            geocoder_status: 'OK',
            place_id: 'ChIJYXiWHEuxbTkRrbjbg9mvXc8',
            types: ['establishment', 'lawyer', 'point_of_interest'],
          },
        ],
        routes: [
          {
            bounds: {
              northeast: {
                lat: 26.9247603,
                lng: 75.827074,
              },
              southwest: {
                lat: 26.8736796,
                lng: 75.7765841,
              },
            },
            copyrights: 'Map data ©2022',
            legs: [
              {
                distance: {
                  text: '9.2 km',
                  value: 9182,
                },
                duration: {
                  text: '1 hour 56 mins',
                  value: 6973,
                },
                end_address:
                  '60, Baldevji Temple,Hawa Mahal Road,, Hawa Mahal Rd, Malve Nagar, J.D.A. Market, Kanwar Nagar, Jaipur, Rajasthan 302002, India',
                end_location: {
                  lat: 26.923989,
                  lng: 75.827074,
                },
                start_address: 'Ridhi Sidhi Circle, Surya Nagar, Gopal Pura Mode, Jaipur, Rajasthan 302018',
                start_location: {
                  lat: 26.8737025,
                  lng: 75.7765841,
                },
                steps: [
                  {
                    distance: {
                      text: '3 m',
                      value: 3,
                    },
                    duration: {
                      text: '1 min',
                      value: 3,
                    },
                    end_location: {
                      lat: 26.8736796,
                      lng: 75.77660800000001,
                    },
                    html_instructions:
                      'Head <b>southeast</b> on <b>Gopalpura Rd</b>/<wbr/><b>Gopalpura Bypass Rd</b> toward <b>Mansarovar Link Rd</b>/<wbr/><b>Shri Hans Marg</b>',
                    polyline: {
                      points: 'sw_cDsbomMBE',
                    },
                    start_location: {
                      lat: 26.8737025,
                      lng: 75.7765841,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '73 m',
                      value: 73,
                    },
                    duration: {
                      text: '1 min',
                      value: 66,
                    },
                    end_location: {
                      lat: 26.8741804,
                      lng: 75.7770867,
                    },
                    html_instructions: 'Turn <b>left</b> at <b>Ridhi Sidhi Cir</b> onto <b>Abhijit Marg</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'ow_cDybomMUSmAkA',
                    },
                    start_location: {
                      lat: 26.8736796,
                      lng: 75.77660800000001,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 136,
                    },
                    duration: {
                      text: '2 mins',
                      value: 104,
                    },
                    end_location: {
                      lat: 26.8751462,
                      lng: 75.77792,
                    },
                    html_instructions: 'Continue onto <b>Ras Bihari Marg</b>',
                    polyline: {
                      points: 'sz_cDyeomMwAsA_@[iAu@',
                    },
                    start_location: {
                      lat: 26.8741804,
                      lng: 75.7770867,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 143,
                    },
                    duration: {
                      text: '2 mins',
                      value: 108,
                    },
                    end_location: {
                      lat: 26.8746849,
                      lng: 75.77926939999999,
                    },
                    html_instructions: 'Turn <b>right</b> toward <b>60 Feet Rd</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'u``cD_komMZuA\\qAb@eB',
                    },
                    start_location: {
                      lat: 26.8751462,
                      lng: 75.77792,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.8 km',
                      value: 778,
                    },
                    duration: {
                      text: '10 mins',
                      value: 583,
                    },
                    end_location: {
                      lat: 26.881382,
                      lng: 75.7814644,
                    },
                    html_instructions: 'Turn <b>left</b> onto <b>60 Feet Rd</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'w}_cDmsomMmAc@kAi@c@OkA[IAqAWqAWsAMOEqAa@uCm@}A[gF_AqFiA',
                    },
                    start_location: {
                      lat: 26.8746849,
                      lng: 75.77926939999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 106,
                    },
                    duration: {
                      text: '1 min',
                      value: 80,
                    },
                    end_location: {
                      lat: 26.8811448,
                      lng: 75.7825038,
                    },
                    html_instructions:
                      'Turn <b>right</b> onto <b>80 Feet Rd</b><div style="font-size:0.9em">Pass by Atal Hospital (on the right)</div>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'sgacDcapmMXuBTyA',
                    },
                    start_location: {
                      lat: 26.881382,
                      lng: 75.7814644,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.2 km',
                      value: 157,
                    },
                    duration: {
                      text: '2 mins',
                      value: 119,
                    },
                    end_location: {
                      lat: 26.8824987,
                      lng: 75.78296279999999,
                    },
                    html_instructions: 'Turn <b>left</b> toward <b>Govind Marg</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'cfacDsgpmMeASiEgA',
                    },
                    start_location: {
                      lat: 26.8811448,
                      lng: 75.7825038,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.7 km',
                      value: 692,
                    },
                    duration: {
                      text: '9 mins',
                      value: 519,
                    },
                    end_location: {
                      lat: 26.88764,
                      lng: 75.7858191,
                    },
                    html_instructions: 'Turn <b>right</b> onto <b>Govind Marg</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'snacDojpmMD_@N{@@O?GAAACACECSG{CgAQG_Cw@aBc@GCsBi@aA[M@IBKDMCMCWIu@]e@SiCeAKEcBw@',
                    },
                    start_location: {
                      lat: 26.8824987,
                      lng: 75.78296279999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.3 km',
                      value: 288,
                    },
                    duration: {
                      text: '4 mins',
                      value: 214,
                    },
                    end_location: {
                      lat: 26.8871241,
                      lng: 75.7886418,
                    },
                    html_instructions: 'Turn <b>right</b> onto <b>Katarpura Phatak Rd</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'wnbcDk|pmMRaAXmAJm@Je@Lq@Fc@BeAFsD',
                    },
                    start_location: {
                      lat: 26.88764,
                      lng: 75.7858191,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '5 m',
                      value: 5,
                    },
                    duration: {
                      text: '1 min',
                      value: 5,
                    },
                    end_location: {
                      lat: 26.88717,
                      lng: 75.78864639999999,
                    },
                    html_instructions:
                      'Turn <b>left</b> onto <b>Arjun Nagar Phatak Rd</b>/<wbr/><b>Katarpura Phatak Rd</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'okbcD_nqmMIA',
                    },
                    start_location: {
                      lat: 26.8871241,
                      lng: 75.7886418,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.2 km',
                      value: 173,
                    },
                    duration: {
                      text: '2 mins',
                      value: 140,
                    },
                    end_location: {
                      lat: 26.8871876,
                      lng: 75.79037919999999,
                    },
                    html_instructions: 'Turn <b>right</b> onto <b>Katarpura Phatak Rd</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'ykbcDanqmM?_@Ig@E}@?{A@m@Dm@?CBW',
                    },
                    start_location: {
                      lat: 26.88717,
                      lng: 75.78864639999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.3 km',
                      value: 262,
                    },
                    duration: {
                      text: '3 mins',
                      value: 198,
                    },
                    end_location: {
                      lat: 26.8891207,
                      lng: 75.79187069999999,
                    },
                    html_instructions: 'Turn <b>left</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: '}kbcD{xqmMIEGEECOKQQ[UOOw@m@g@g@YUuAy@QKy@c@',
                    },
                    start_location: {
                      lat: 26.8871876,
                      lng: 75.79037919999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 106,
                    },
                    duration: {
                      text: '1 min',
                      value: 78,
                    },
                    end_location: {
                      lat: 26.8893215,
                      lng: 75.7926124,
                    },
                    html_instructions: 'Turn <b>right</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: '_xbcDebrmMZgAFQ?C@C?A?E?AAAACAAAAAAOEs@U',
                    },
                    start_location: {
                      lat: 26.8891207,
                      lng: 75.79187069999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.2 km',
                      value: 159,
                    },
                    duration: {
                      text: '2 mins',
                      value: 120,
                    },
                    end_location: {
                      lat: 26.8898978,
                      lng: 75.7939293,
                    },
                    html_instructions: 'Turn <b>right</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'gybcDyfrmMHa@@GBK@K?IAGAECICIIMMQQUy@_AEKOW',
                    },
                    start_location: {
                      lat: 26.8893215,
                      lng: 75.7926124,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '10 m',
                      value: 10,
                    },
                    duration: {
                      text: '1 min',
                      value: 8,
                    },
                    end_location: {
                      lat: 26.8899873,
                      lng: 75.7939103,
                    },
                    html_instructions: 'Turn <b>left</b> toward <b>Sahakar Marg</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: '{|bcDaormMQB',
                    },
                    start_location: {
                      lat: 26.8898978,
                      lng: 75.7939293,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '66 m',
                      value: 66,
                    },
                    duration: {
                      text: '1 min',
                      value: 63,
                    },
                    end_location: {
                      lat: 26.8902273,
                      lng: 75.794505,
                    },
                    html_instructions: 'Turn <b>right</b> before Shiv Ji Temple',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'm}bcD}nrmMM{@AIAEACACEEECMW',
                    },
                    start_location: {
                      lat: 26.8899873,
                      lng: 75.7939103,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 99,
                    },
                    duration: {
                      text: '1 min',
                      value: 72,
                    },
                    end_location: {
                      lat: 26.891089,
                      lng: 75.7942602,
                    },
                    html_instructions: 'Turn <b>left</b> onto <b>Sahakar Marg</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: '}~bcDsrrmMK@eB\\y@N',
                    },
                    start_location: {
                      lat: 26.8902273,
                      lng: 75.794505,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 127,
                    },
                    duration: {
                      text: '2 mins',
                      value: 103,
                    },
                    end_location: {
                      lat: 26.8911206,
                      lng: 75.7955182,
                    },
                    html_instructions:
                      'Turn <b>right</b> onto <b>Vidhan Sabha Rd</b><div style="font-size:0.9em">Pass by MEDISKY clinic (on the right in 38m)</div>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'idccDcqrmMQuBAI?OAM@O@]@G?GBI@IBK',
                    },
                    start_location: {
                      lat: 26.891089,
                      lng: 75.7942602,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.3 km',
                      value: 316,
                    },
                    duration: {
                      text: '4 mins',
                      value: 234,
                    },
                    end_location: {
                      lat: 26.8936385,
                      lng: 75.79698929999999,
                    },
                    html_instructions: 'Turn <b>left</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'odccD_yrmMkAc@yAy@w@c@]S}Aq@}C}A',
                    },
                    start_location: {
                      lat: 26.8911206,
                      lng: 75.7955182,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 119,
                    },
                    duration: {
                      text: '1 min',
                      value: 87,
                    },
                    end_location: {
                      lat: 26.893134,
                      lng: 75.79804299999999,
                    },
                    html_instructions: 'Turn <b>right</b> onto <b>Pankaj Singhvi Marg</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'gtccDebsmMp@gBr@iB',
                    },
                    start_location: {
                      lat: 26.8936385,
                      lng: 75.79698929999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.3 km',
                      value: 270,
                    },
                    duration: {
                      text: '4 mins',
                      value: 211,
                    },
                    end_location: {
                      lat: 26.8953497,
                      lng: 75.7991657,
                    },
                    html_instructions: 'Turn <b>left</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'aqccDwhsmMyBw@mAg@w@[mAi@mB{@',
                    },
                    start_location: {
                      lat: 26.893134,
                      lng: 75.79804299999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '1.5 km',
                      value: 1503,
                    },
                    duration: {
                      text: '19 mins',
                      value: 1139,
                    },
                    end_location: {
                      lat: 26.9073855,
                      lng: 75.80543990000001,
                    },
                    html_instructions:
                      'Continue onto <b>Janpath</b><div style="font-size:0.9em">Go through 1 roundabout</div>',
                    polyline: {
                      points:
                        '}~ccDyosmMcDqAi@SiDuAcEcBGBEBG@E@E?G?EAE?GCAACAAAAACAACEECGCGAGAI?G?I@GDMcBk@UGs@YkEcBwAm@{@_@mBw@}CsA}GqCiDwAkA]qCkAkAe@SIw@]MGk@UMGs@Y',
                    },
                    start_location: {
                      lat: 26.8953497,
                      lng: 75.7991657,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '29 m',
                      value: 29,
                    },
                    duration: {
                      text: '1 min',
                      value: 21,
                    },
                    end_location: {
                      lat: 26.9074723,
                      lng: 75.80568079999999,
                    },
                    html_instructions: 'Turn <b>right</b> toward <b>Bhagwan Das Rd</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'ejfcD_wtmM@E?A@C?A?AAC?A?A?CAA?AAAAA?AAAAAAACAAA',
                    },
                    start_location: {
                      lat: 26.9073855,
                      lng: 75.80543990000001,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '28 m',
                      value: 28,
                    },
                    duration: {
                      text: '1 min',
                      value: 20,
                    },
                    end_location: {
                      lat: 26.9076876,
                      lng: 75.8055906,
                    },
                    html_instructions: 'Turn <b>left</b> toward <b>Bhagwan Das Rd</b>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: 'ujfcDoxtmMCAEAG?C@E@EDEDCD',
                    },
                    start_location: {
                      lat: 26.9074723,
                      lng: 75.80568079999999,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '40 m',
                      value: 40,
                    },
                    duration: {
                      text: '1 min',
                      value: 30,
                    },
                    end_location: {
                      lat: 26.9079952,
                      lng: 75.8057762,
                    },
                    html_instructions: 'Turn <b>right</b> toward <b>Bhagwan Das Rd</b>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'alfcD}wtmMu@YGK',
                    },
                    start_location: {
                      lat: 26.9076876,
                      lng: 75.8055906,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '1.0 km',
                      value: 1002,
                    },
                    duration: {
                      text: '13 mins',
                      value: 775,
                    },
                    end_location: {
                      lat: 26.916237,
                      lng: 75.8098526,
                    },
                    html_instructions:
                      'Continue onto <b>Bhagwan Das Rd</b><div style="font-size:0.9em">Pass by the park (on the left in 150m)</div>',
                    polyline: {
                      points: '_nfcDcytmMo@UcBo@yCgAmAe@sB{@iDwAWKoCeA}B{@e@SaAa@cBy@cBg@[KiAe@cAa@u@]OGq@YQGCAa@Oe@Q',
                    },
                    start_location: {
                      lat: 26.9079952,
                      lng: 75.8057762,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.7 km',
                      value: 655,
                    },
                    duration: {
                      text: '8 mins',
                      value: 497,
                    },
                    end_location: {
                      lat: 26.9169417,
                      lng: 75.8163809,
                    },
                    html_instructions:
                      'Turn <b>right</b> after Mochi Shoes (on the right)<div style="font-size:0.9em">Pass by The J&amp;K Bank Ltd (on the right in 27m)</div>',
                    maneuver: 'turn-right',
                    polyline: {
                      points: 'oahcDqrumM@c@A_@?[AECk@Es@?EEYE[CQGUg@mCGk@CSAUAYCi@?EASAg@CiAA_@GyAKcFAECoAIc@?a@@aA',
                    },
                    start_location: {
                      lat: 26.916237,
                      lng: 75.8098526,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.9 km',
                      value: 865,
                    },
                    duration: {
                      text: '11 mins',
                      value: 649,
                    },
                    end_location: {
                      lat: 26.9245206,
                      lng: 75.8183596,
                    },
                    html_instructions:
                      'Turn <b>left</b> onto <b>Kishanpole Bazar Rd</b><div style="font-size:0.9em">Pass by Mandir and Pyau Kumawat Kshtriya Samaj (on the left in 230m)</div>',
                    maneuver: 'turn-left',
                    polyline: {
                      points: '{ehcDk{vmM{@Ou@Mg@K]GWEgB[SEo@Kc@IgDm@aCc@s@MsAQcAOaAQkASu@MCAoB[OCiBYcDi@',
                    },
                    start_location: {
                      lat: 26.9169417,
                      lng: 75.8163809,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.9 km',
                      value: 867,
                    },
                    duration: {
                      text: '11 mins',
                      value: 648,
                    },
                    end_location: {
                      lat: 26.9231557,
                      lng: 75.8266972,
                    },
                    html_instructions:
                      'At <b>Choti Chaupar</b>/<wbr/><b>Choti Chopad</b>, take the <b>3rd</b> exit onto <b>Tripolia Bazar</b>',
                    maneuver: 'roundabout-left',
                    polyline: {
                      points: 'guicDwgwmM@G@KCGCECEACCACCCCEAC?CAA?E?C?XcBZoBNkABUh@mEh@eELqABOlAoK\\wBPiANkAFc@E{A',
                    },
                    start_location: {
                      lat: 26.9245206,
                      lng: 75.8183596,
                    },
                    travel_mode: 'WALKING',
                  },
                  {
                    distance: {
                      text: '0.1 km',
                      value: 105,
                    },
                    duration: {
                      text: '1 min',
                      value: 79,
                    },
                    end_location: {
                      lat: 26.923989,
                      lng: 75.827074,
                    },
                    html_instructions:
                      'At <b>Badi Chopad</b>, take the <b>1st</b> exit onto <b>Hawa Mahal Rd</b><div style="font-size:0.9em">Destination will be on the left</div>',
                    maneuver: 'roundabout-left',
                    polyline: {
                      points: 'wlicD{{xmMIKACAAACACAC?EkB[e@I',
                    },
                    start_location: {
                      lat: 26.9231557,
                      lng: 75.8266972,
                    },
                    travel_mode: 'WALKING',
                  },
                ],
                traffic_speed_entry: [],
                via_waypoint: [],
              },
            ],
            overview_polyline: {
              points:
                'sw_cDsbomMBEUSeD_D_@[iAu@x@gDb@eBmAc@oBy@uA]cDo@cBSqAa@uCm@eI{AqFiAXuBTyAeASiEgAD_@PkAAICGYKmDoA_Cw@aBc@{Bm@aA[M@UH[G}FaCoB}@l@oCl@iDJyFIA?_@Ig@E}@@iCDq@BWIEMIa@]kC{BYUuAy@kAo@d@aBAKGIcA[Ji@Bi@EOMW_@g@_AkAOWQBOeAEMKIMWK@_Dl@S_C@kAFc@BKkAc@qC}A{BeA}C}Ap@gBr@iByBw@eCcA{DeBmEeBmJyDMF[BUGKGOYCc@FUyBs@sKkEsUuJkA]qCkA_Bo@_CcAs@Y@E@EAIAIOOUAKFIJu@YGKsCeAgFmB}GsCkIaDeD{A_Cs@sEmBiBs@e@Q@c@A{@KkBW}Ao@yDEi@G}AOkFMiFCoAIc@@cBqB]eEu@oGiAuDq@wCa@gEu@mKcBBSGMMOQGG?C?XcBj@{Dl@cFhCwTn@aEVoBE{AIKCEEQqCe@',
            },
            summary: 'Bhagwan Das Rd',
            warnings: [
              'Walking directions are in beta. Use caution – This route may be missing sidewalks or pedestrian paths.',
            ],
            waypoint_order: [],
          },
        ],
        status: 'OK',
      };

      let totalDistance = 0;
      let totalTime = 0;
      const routes = data['routes'][0];
      const steps = routes['legs'][0]['steps'];
      const coordinatesInPath = this.getCoordinatesInPath(steps);
      const obj = {};
      const points = decode(routes.overview_polyline.points, 5);
      obj['polyline'] = routes.overview_polyline;
      obj['polyline']['path'] = points;
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
