import { IUser, IUserDetails } from '@/interfaces/IUser';
import { UserRepository } from '@/repositories/userRepository';
import { resolve } from 'path';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { StorageService } from './storageService';
import { unlink } from 'fs/promises';

@Service()
export default class UserService {
  protected userRepositoryInstance: UserRepository;
  protected storageServiceInstance: StorageService;

  constructor(
    userRepository: UserRepository,
    storageService: StorageService,
    @Inject('logger') private logger: Logger,
  ) {
    this.userRepositoryInstance = userRepository;
    this.storageServiceInstance = storageService;
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
      throw e;
    }
  };

  public uploadProfilePic = async (userId: IUser['_id'], file: any) => {
    try {
      const folderForProfilePhotos = 'profilePics';
      const path = resolve(file.path);
      const fileName = `${folderForProfilePhotos}/${file.filename}`;
      const metaData = { userId };
      const fileType = file.mimetype;

      const { url } = await this.storageServiceInstance.uploadToStore(fileName, path, metaData, fileType);
      unlink(path);
      const userRecord = await this.userRepositoryInstance.addProfileURL(userId, url);

      const user = { ...userRecord };
      Reflect.deleteProperty(user, 'salt');
      Reflect.deleteProperty(user, 'password');
      return { user };
    } catch (e) {
      throw e;
    }
  };
}
