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

  public completeDetails = async (userId: IUser['_id'], userInputDTO: IUserDetails) => {
    try {
      const userRecord = await this.userRepositoryInstance.completeDetails(userId, userInputDTO);
      const user = { ...userRecord };
      Reflect.deleteProperty(user, 'salt');
      Reflect.deleteProperty(user, 'password');
      return user;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  };
}
