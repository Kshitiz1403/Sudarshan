import { IPasswordResetToken, IPasswordResetTokenInputDTO } from '@/interfaces/IPasswordResetToken';
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

  public getResetPasswordToken = async (resetPasswordToken: IPasswordResetTokenInputDTO['token']) => {
    const doc = await PasswordResetTokenModel.findOne({ token: resetPasswordToken });
    if (doc) return doc.toObject();
    throw 'Invalid Link';
  };

  public markTokenUsed = async (id: IPasswordResetToken['_id']) => {
    await PasswordResetTokenModel.updateOne({ _id: id }, { used: true });
  };
}
