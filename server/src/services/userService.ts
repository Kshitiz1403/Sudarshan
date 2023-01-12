import { IUser, IUserDetails } from '@/interfaces/IUser';
import { UserRepository } from '@/repositories/userRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export default class UserService {
  protected userRepositoryInstance: UserRepository;

  constructor(userRepository: UserRepository, @Inject('logger') private logger: Logger) {
    this.userRepositoryInstance = userRepository;
  }

  public getUserDetails = async (userId: IUser['_id']) => {
    try {
      const userRecord = await this.userRepositoryInstance.findUser(userId);
      userRecord.password = undefined;
      userRecord.salt = undefined;
      return userRecord;
    } catch (e) {
      throw e;
    }
  };

  public isProfileComplete = async (userId: IUser['_id']) => {
    try {
      const isProfileComplete = await this.userRepositoryInstance.isProfileComplete(userId);
      return { isProfileComplete };
    } catch (e) {
      throw e;
    }
  };

  public completeDetails = async (userId: IUser['_id'], userInputDTO: IUserDetails) => {
    try {
      const userRecord = await this.userRepositoryInstance.completeDetails(userId, userInputDTO);
      const user = { ...userRecord };
      Reflect.deleteProperty(user, 'salt');
      Reflect.deleteProperty(user, 'password');
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  };
}
