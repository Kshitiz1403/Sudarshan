import { Inject, Service } from 'typedi';
import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { TripRepository } from '@/repositories/tripRepository';
import { Logger } from 'winston';
import { IUser } from '@/interfaces/IUser';

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

  public endTrip = async (userId: IUser['_id'], id: ITrip['_id']) => {
    try {
      this.logger.silly('Updating trip record');

      const tripRecord = await this.tripRepositoryInstance.endTrip(id);

      return tripRecord;
    } catch (e) {
      throw e;
    }
  };

  public scanQR = async (id: ITrip['_id'], payload) => {
    this.logger.silly('Updating trip record');
    try {
      console.log(payload)
      const tripRecord = await this.tripRepositoryInstance.scanQR(id);
      
      return tripRecord;
    } catch (e) {
      throw e;
    }
  };
}
