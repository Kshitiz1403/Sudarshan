import { IDustbin } from '@/interfaces/IDustbin';
import { ILatLng } from '@/interfaces/IPlace';
import { DustbinRepository } from '@/repositories/dustbinRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import crypto from 'crypto';
import base32 from 'hi-base32';

@Service()
export default class DustbinService {
  protected dustbinRepositoryInstance: DustbinRepository;

  constructor(dustbinRepository: DustbinRepository, @Inject('logger') private logger: Logger) {
    this.dustbinRepositoryInstance = dustbinRepository;
  }

  public addDustbin = async (location: ILatLng, name: IDustbin['name'], address: IDustbin['address']) => {
    try {
      this.logger.silly('Creating dustbin record');
      const hash = this.generateHash();

      const dustbinRecord = await this.dustbinRepositoryInstance.createDustbinAtLocation(location, name, address, hash);
      return dustbinRecord;
    } catch (error) {
      throw error;
    }
  };

  /**@TODO to be removed */
  public scanQR = async data => {
    try {
      return 'Accepted';
    } catch (error) {}
  };

  private generateHash = () => {
    const bytes = crypto.randomBytes(10).toString('hex');
    const hash = base32.encode(new Buffer(bytes));
    return hash;
  };
}
