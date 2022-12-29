import { IDustbin } from '@/interfaces/IDustbin';
import { ILatLng } from '@/interfaces/IPlace';
import { DustbinRepository } from '@/repositories/dustbinRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export default class DustbinService {
  protected dustbinRepositoryInstance: DustbinRepository;

  constructor(dustbinRepository: DustbinRepository, @Inject('logger') private logger: Logger) {
    this.dustbinRepositoryInstance = dustbinRepository;
  }

  public addDustbin = async (location: ILatLng, name: IDustbin['name'], address: IDustbin['address']) => {
    try {
      this.logger.silly('Creating dustbin record');

      const dustbinRecord = await this.dustbinRepositoryInstance.createDustbinAtLocation(location, name, address);
      return dustbinRecord;
    } catch (error) {
      throw error;
    }
  };
}
