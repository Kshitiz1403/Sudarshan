import { Inject, Service } from 'typedi';
import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { TripRepository } from '@/repositories/tripRepository';
import { Logger } from 'winston';
import { IUser } from '@/interfaces/IUser';
import totp from 'totp-generator';
import jwt from 'jsonwebtoken';
import { DustbinRepository } from '@/repositories/dustbinRepository';

@Service()
export class TripService {
  protected tripRepositoryInstance: TripRepository;
  protected dustbinRepositoryInstance: DustbinRepository;
  protected logger: Logger;

  constructor(tripRepository: TripRepository, dustbinRepository: DustbinRepository, @Inject('logger') logger: Logger) {
    this.tripRepositoryInstance = tripRepository;
    this.dustbinRepositoryInstance = dustbinRepository;
    this.logger = logger;
  }

  public getAllTrips = async (userId: IUser['_id']) => {
    try {
      this.logger.silly('Getting all trips record');
      const tripsRecord = await this.tripRepositoryInstance.getAllTripsForUser(userId);
      const formatted = tripsRecord.map(trip => {
        let { source, destination } = trip;
        const obj: any = { ...trip };
        let src = { latitude: source['coordinates'][1], longitude: source['coordinates'][0] };
        let end = { latitude: destination['coordinates'][1], longitude: destination['coordinates'][0] };
        obj.source = src;
        obj.destination = end;
        return obj;
      });
      return { trips: formatted };
    } catch (e) {
      throw e;
    }
  };

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

  public scanQR = async (tripId: ITrip['_id'], payload) => {
    this.logger.silly('Updating trip record');
    try {
      const { dustbinId, timeStamp, token } = JSON.parse(payload);
      const hash = await this.dustbinRepositoryInstance.getHashByDustbinId(dustbinId);
      if (!hash) throw 'Dustbin does not exist';
      const otp = this.generateTOTP(hash, timeStamp);
      const decoded = jwt.verify(token, otp, { algorithms: ['HS256'] });
      const weight = +decoded.weight;
      const tripRecord = await this.tripRepositoryInstance.scanQR(tripId, weight);
      if (!tripRecord) throw 'Trip does not exist';

      return tripRecord;
    } catch (e) {
      throw e;
    }
  };

  private generateTOTP = (hash: String, timeStamp: Number) => {
    const token = totp(hash, { timestamp: timeStamp });
    return token;
  };
}
