import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { UserRepository } from '@/repositories/userRepository';
import { Logger } from 'winston';
import { PasswordResetTokenRepository } from '@/repositories/passwordResetTokenRepository';
import EmailService from './emailService';
import { IPasswordResetToken } from '@/interfaces/IPasswordResetToken';

@Service()
export default class AuthService {
  protected userRepositoryInstance: UserRepository;
  protected passwordResetRepositoryInstance: PasswordResetTokenRepository;
  protected emailServiceInstance: EmailService;

  constructor(
    userRepository: UserRepository,
    @Inject('logger') private logger: Logger,
    passwordResetTokenRepository: PasswordResetTokenRepository,
    emailService: EmailService,
  ) {
    this.userRepositoryInstance = userRepository;
    this.passwordResetRepositoryInstance = passwordResetTokenRepository;
    this.emailServiceInstance = emailService;
  }

  public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      const { salt, hashedPassword } = await this.hashPassword(userInputDTO.password);

      this.logger.silly('Creating user db record');
      const userRecord = await this.userRepositoryInstance.createUser(
        userInputDTO,
        salt.toString('hex'),
        hashedPassword,
      );

      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      /**
       * @TODO
       const refreshTokenRecord = await this.generateRefreshToken(userRecord);
 
       this.logger.silly('Sending welcome email');
       this.mailServiceInstance.sendWelcomeEmail(userRecord.email, userRecord.name);
       * 
       */

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
       */
      const user = { ...userRecord };
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  public async signIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userRecord = await this.userRepositoryInstance.findUserByEmail(email);
    if (!userRecord) {
      throw new Error('User not registered');
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user = { ...userRecord };
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  public forgotPassword = async (email: IUserInputDTO['email']) => {
    const getPasswordResetExpiryDuration = () => {
      const now = new Date();
      const exp = new Date(now);
      exp.setTime(exp.getTime() + 1000 * 60 * 30); // 30 minutes from now
      return exp;
    };

    const token = randomBytes(48).toString('hex');
    const token_expiry = getPasswordResetExpiryDuration();

    const user = await this.userRepositoryInstance.findUserByEmail(email);

    if (!user) return 'Check your email for password reset instructions';

    const password_reset_token = await this.passwordResetRepositoryInstance.createResetToken({
      userId: user._id,
      token: token,
      token_expiry: token_expiry,
    });

    const reset_link = `https://${config.host}/reset/${token}`;

    this.emailServiceInstance.sendResetPasswordEmail(user.email, reset_link, token_expiry);

    return 'Check your email for password reset instructions';
  };

  public checkValidResetToken = (token: IPasswordResetToken) => {
    this.logger.silly('Checking reset token');

    return 'Valid Reset Link';
  };

  public resetPassword = async (token: IPasswordResetToken, newPassword: string) => {
    try {
      const { salt, hashedPassword } = await this.hashPassword(newPassword);

      this.logger.silly('Updating user db record');
      const userId = token['userId'];
      const userRecord = this.userRepositoryInstance.updatePasswordByUsername(
        userId,
        salt.toString('hex'),
        hashedPassword,
      );
      await this.passwordResetRepositoryInstance.markTokenUsed(token._id);

      const user = await userRecord;
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user };
    } catch (e) {
      throw new Error(e);
    }
  };

  private hashPassword = async (password: string) => {
    const salt = randomBytes(32);

    this.logger.silly('Hashing password');
    const hashedPassword = await argon2.hash(password, { salt });

    return { salt, hashedPassword };
  };

  private generateToken(user: IUser) {
    const today = new Date();
    const exp = new Date(today);
    exp.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 15); //15 days

    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    const token = jwt.sign(
      {
        role: user.role,
        userId: user._id,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
    return token;
  }
}
