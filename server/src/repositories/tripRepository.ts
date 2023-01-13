import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { Service } from 'typedi';
import TripModel from '@/models/trip';

@Service()
export class TripRepository {
  constructor() {}

  public getAllTripsForUser = async (userId: ITrip['userId']) => {
    try {
      const docs = await TripModel.find({ userId });
      if (!docs || docs.length == 0) return null;
      return docs.map(doc => doc.toObject());
    } catch (e) {
      throw e;
    }
  };

  public createTrip = async (startTripInputDTO: ITripStartInputDTO) => {
    try {
      const { userId, dustbinId, distanceMeter, source, destination } = startTripInputDTO;
      const tripRecord = await TripModel.create({
        userId,
        dustbinId,
        distanceMeter,
        source: {
          coordinates: [source.longitude, source.latitude],
        },
        destination: {
          coordinates: [destination.longitude, destination.latitude],
        },
      });
      if (tripRecord) return tripRecord.toObject();
      return null;
    } catch (e) {
      throw 'Trip cannot be created';
    }
  };

  public endTrip = async (id: ITrip['_id']) => {
    try {
      return TripModel.findOneAndUpdate({ _id: id }, { $set: { isCompleted: true } }, { new: true }, (err, doc) => {
        if (err) throw err;
        return doc.toObject();
      });
    } catch (e) {
      throw e;
    }
  };

  public scanQR = async (id: ITrip['_id'], weight: Number) => {
    try {
      return TripModel.findOneAndUpdate(
        { _id: id },
        { $set: { isDumped: true, isCompleted: true, weightKG: weight } },
        { new: true },
        (err, doc) => {
          if (err) throw err;
          return doc;
        },
      ).lean();
    } catch (e) {
      throw e;
    }
  };
}
