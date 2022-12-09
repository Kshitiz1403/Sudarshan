import { IPasswordResetTokenInputDTO } from '@/interfaces/IPasswordResetToken';
import { Service } from 'typedi';
import PasswordResetTokenModel from '@/models/password-reset-token';

@Service()
export class PasswordResetTokenRepository {
  constructor() {}

  public createResetToken = async (passwordResetTokenInputDTO: IPasswordResetTokenInputDTO) => {
    const doc = await PasswordResetTokenModel.create({ ...passwordResetTokenInputDTO });
    if (doc) return doc.toObject();
    return null;
  };
}
