import { Service } from 'typedi';
import { IDustbin, IDustbinRangeInputDTO } from '@/interfaces/IDustbin';
import { ILatLng, IPlace } from '@/interfaces/IPlace';
import DustbinModel from '@/models/dustbin';

@Service()
export class DustbinRepository {
  constructor() {}

  public findDustbinById = async (id: IDustbin['_id']) => {
    try {
      const dustbin = await DustbinModel.findById(id);
      if (dustbin) {
        const dustbinRecord = dustbin.toJSON();
        return dustbinRecord;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  public createDustbinAtLocation = async (coordinates: ILatLng, address: IDustbin['address']) => {
    try {
      const dustbin = await DustbinModel.create({
        location: { coordinates: [coordinates.longitude, coordinates.latitude] },
        address,
      });
      if (dustbin) {
        return dustbin.toObject();
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  public findDustbinsInRange = async ({
    minLatitude,
    minLongitude,
    maxLatitude,
    maxLongitude,
  }: IDustbinRangeInputDTO) => {
    try {
      return DustbinModel.find({
        location: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [minLongitude, minLatitude],
                  [maxLongitude, minLatitude],
                  [maxLongitude, maxLatitude],
                  [minLongitude, maxLatitude],
                  [minLongitude, minLatitude],
                ],
              ],
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
