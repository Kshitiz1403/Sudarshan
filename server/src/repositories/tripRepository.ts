import { ITripStartInputDTO } from '@/interfaces/ITrip';
import { Service } from 'typedi';
import TripModel from '@/models/trip';

@Service()
export class TripRepository {
  constructor() {}

  public createTrip = async (startTripInputDTO: ITripStartInputDTO) => {
    try {
      const trip = await TripModel.create({ ...startTripInputDTO });
      if (trip) return trip.toObject();
      return null;
    } catch (e) {
      throw 'Trip cannot be created';
    }
  };
}
