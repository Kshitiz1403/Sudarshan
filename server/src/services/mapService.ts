import config from '@/config';
import axios from 'axios';
import { Service } from 'typedi';

@Service()
export class MapService {
  private readonly apiKey = config.maps.apiKey;

  public getAutoComplete = async (
    input: string,
    location: { latitude: number; longitude: number; radius?: number },
  ) => {
    location.radius = location.radius || 10000;
    const strictBounds = true;
    const l = `${location.latitude}, ${location.longitude}`;
    const query = `input=${input}&location=${l}&radius=${location.radius}&strictbounds=${strictBounds}&key=${this.apiKey}`;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${location.latitude},${location.longitude}&radius=${location.radius}&strictbounds=${strictBounds}&key=${this.apiKey}`;
    console.log(url);

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
      console.log(error);
      throw 'Autocomplete could not be completed';
    }
  };
}
