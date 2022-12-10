import config from '@/config';
import Mailer from '@/loaders/mailer';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Inject, Service } from 'typedi';
import { EmailUtilService } from './emailUtilService';

@Service()
export default class EmailService {
  constructor(
    @Inject('emailClient') private emailClient: typeof Mailer,
    @Inject('logger') private logger,
    private mailUtilService: EmailUtilService,
  ) {}

  private SUCCESS = (messageId: string) => {
    return { delivered: 1, messageId, status: 'OK' };
  };

  private ERROR = error => {
    return { delivered: 0, messageId: null, status: 'error', error };
  };

  public sendResetPasswordEmail = async (email: string, link: string, token_expiry: Date) => {
    dayjs.extend(relativeTime);
    const now = dayjs(new Date());
    const expireDate = dayjs(token_expiry);
    const expireTime = expireDate.from(now, true);

    const template = this.mailUtilService.resetPasswordEmailTemplate(expireTime, link);

    const message = this.emailClient.generateMessage({
      html: template.html,
      subject: template.subject,
      text: template.text,
      to: [{ email }],
      sender: config.emails.sender,
    });

    try {
      const messageId = await this.emailClient.sendEmail(message);

      const status = this.SUCCESS(messageId);
      this.logger.info('%o', status);
      return status;
    } catch (e) {
      const status = this.ERROR(e);
      this.logger.error('%o', status);
      return status;
    }
  };
}
