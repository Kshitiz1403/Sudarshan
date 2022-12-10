import { IPasswordResetToken, IPasswordResetTokenInputDTO } from '@/interfaces/IPasswordResetToken';
import { Service } from 'typedi';
import PasswordResetTokenModel from '@/models/password-reset-token';
import UserModel from '@/models/user';
import { IUser } from '@/interfaces/IUser';

@Service()
export class PasswordResetTokenRepository {
  constructor() {}

  public createResetToken = async (passwordResetTokenInputDTO: IPasswordResetTokenInputDTO) => {
    // if exists, then overwrite token used status to false and create a new otp + otp_expiry
    // else create a new token

    PasswordResetTokenModel.findOneAndUpdate(
      { userId: passwordResetTokenInputDTO.userId },
      { $set: { ...passwordResetTokenInputDTO, used: false } },
      { upsert: true, new: true },
      (err, doc) => {
        if (err) throw err;
        return doc;
      },
    );
  };

  public getResetPasswordToken = async (email: IUser['email']) => {
    const doc = await UserModel.aggregate([
      {
        $match: {
          email,
        },
      },
      {
        $lookup: {
          from: 'passwordresettokens',
          localField: '_id',
          foreignField: 'userId',
          as: 'passwordresettoken',
          pipeline: [
            {
              $sort: {
                updatedAt: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$passwordresettoken',
        },
      },
    ]);
    if (doc) return doc[0];
    return null;
  };

  public markTokenUsed = async (id: IPasswordResetToken['_id']) => {
    await PasswordResetTokenModel.updateOne({ _id: id }, { used: true });
  };
}
