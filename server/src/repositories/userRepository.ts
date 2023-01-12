import { IUser, IUserDetails, IUserInputDTO } from '@/interfaces/IUser';
import UserModel from '@/models/user';
import { Service } from 'typedi';

@Service()
export class UserRepository {
  constructor() {}

  public findUser = async (id: IUser['_id']) => {
    try {
      const user = await UserModel.findById(id);
      if (user) {
        const userRecord = user.toJSON();
        return userRecord;
      }
      return null;
    } catch (e) {
      throw e;
    }
  };

  public findUserByEmail = async (email: IUser['email']) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
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
      const user = await UserModel.create({
        ...userInputDTO,
        salt,
        password,
      });
      if (user) {
        return user.toObject();
      }
      return null;
    } catch (error) {
      throw 'User cannot be created';
    }
  };

  public isProfileComplete = async (userId: IUser['_id']) => {
    try {
      const record = await UserModel.findById(userId);
      const userRecord = record.toObject();
      return userRecord.isProfileCompleted;
    } catch (error) {
      throw error;
    }
  };

  public completeDetails = async (userId: IUser['_id'], userInputDTO: IUserDetails) => {
    return UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { ...userInputDTO, isProfileCompleted: true } },
      { new: true },
      (err, doc) => {
        if (err) throw err;
        return doc
      },
    ).lean();
  };

  public updatePasswordById = async (userId: IUser['_id'], salt: IUser['salt'], password: IUser['password']) => {
    return UserModel.findOneAndUpdate({ _id: userId }, { $set: { salt, password } }, { new: true }, (err, doc) => {
      if (err) throw err;
      return doc.toObject();
    });
  };

  private deleteSensitiveInfo = (user: IUser) => {
    Reflect.deleteProperty(user, 'salt');
    Reflect.deleteProperty(user, 'password');
  };
}
