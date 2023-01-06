import { ITripStartInputDTO } from '@/interfaces/ITrip';
import { Service } from 'typedi';
import TripModel from '@/models/trip';

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
}
