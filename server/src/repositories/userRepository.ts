import { IUser, IUserDetails, IUserInputDTO } from '@/interfaces/IUser';
import UserModel from '@/models/user';
import { Service } from 'typedi';

@Service()
export class UserRepository {
  constructor() {}

  public findUserByEmail = async (email: IUser['email']) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user){
          const userRecord = user.toObject();
          return userRecord;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  public createUser = async (userInputDTO: IUserInputDTO, salt: IUser['salt'], password: IUser['password']) => {
    try {
      return await UserModel.create({
        ...userInputDTO,
        salt,
        password,
      });
    } catch (error) {
      throw 'User cannot be created';
    }
  };

  public completeDetails = async (userId: IUser['_id'], userInputDTO: IUserDetails) => {
    try {
      const status = await UserModel.updateOne({ _id: userId }, { ...userInputDTO });
      return userInputDTO;
    } catch (error) {
      throw error;
    }
  };

  private deleteSensitiveInfo = (user: IUser) => {
    Reflect.deleteProperty(user, 'salt');
    Reflect.deleteProperty(user, 'password');
  };
}
