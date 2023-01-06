import { Inject, Service } from 'typedi';
import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { TripRepository } from '@/repositories/tripRepository';
import { Logger } from 'winston';

@Service()
export class TripService {
  protected tripRepositoryInstance: TripRepository;
  protected logger: Logger;

  constructor(tripRepository: TripRepository, @Inject('logger') logger: Logger) {
    this.tripRepositoryInstance = tripRepository;
    this.logger = logger;
  }

  public startTrip = async (startTripInputDTO: ITripStartInputDTO) => {
    try {
      this.logger.silly('Creating trip record');

      const tripRecord = await this.tripRepositoryInstance.createTrip(startTripInputDTO);
      return tripRecord;
    } catch (e) {
      throw e;
    }
  };
}
