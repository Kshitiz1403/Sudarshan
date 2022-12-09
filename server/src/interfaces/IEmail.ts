export interface IEmail {
  sender: string;
  to: [{ email: string; displayName?: string }];
  subject: string;
  text: string;
  html: string;
}

export interface IEmailTemplate {
  subject: IEmail['subject'];
  text: IEmail['text'];
  html: IEmail['html'];
}
