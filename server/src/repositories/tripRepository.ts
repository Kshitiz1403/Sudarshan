import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { Service } from 'typedi';
import TripModel from '@/models/trip';
import { IUser } from '@/interfaces/IUser';

@Service()
export class TripRepository {
  constructor() {}

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
    return TripModel.findOneAndUpdate({ _id: id }, { $set: { isCompleted: true } }, { new: true }, (err, doc) => {
      if (err) throw err;
      return doc.toObject();
    });
  };

  public scanQR = async (id: ITrip['_id']) => {
    return TripModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDumped: true, isCompleted: true } },
      { new: true },
      (err, doc) => {
        if (err) throw err;
        return doc.toObject();
      },
    );
  };
}
