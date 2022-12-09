import config from '@/config';
import { IEmail } from '@/interfaces/IEmail';
import { EmailClient, EmailMessage, SendEmailResult } from '@azure/communication-email';

const connectionString = config.emails.azure_connection_string;
const emailClient = new EmailClient(connectionString);

const generateMessage = (emailMessage: IEmail): EmailMessage => {
  const { sender, subject, text, html, to } = emailMessage;

  return {
    sender,
    content: {
      subject,
      plainText: text,
      html,
    },
    recipients: {
      to,
    },
  };
};

const sendEmail = async (message: EmailMessage) => {
  const { messageId } = await emailClient.send(message);
  return messageId;
};

const checkStatus = async (messageId: SendEmailResult['messageId']) => {
  return await emailClient.getSendStatus(messageId);
};

export default { generateMessage, sendEmail, checkStatus };
