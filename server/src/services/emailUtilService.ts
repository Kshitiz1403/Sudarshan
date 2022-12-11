import { IEmailTemplate } from '@/interfaces/IEmail';
import { Service } from 'typedi';

@Service()
export class EmailUtilService {
  public resetPasswordEmailTemplate = (otp_expiry: string, otp: string): IEmailTemplate => {
    return {
      subject: 'Reset your password - Sudarshan',

      text: `Need to reset your password?
      Use your secret code!
      
      ${otp}
      
This link is only valid for the next ${otp_expiry}.
      
      If you did not forget your password, you can ignore this email.`,

      html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><title>Reset Password Email Template</title><meta name="description" content="Reset Password Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin:0;background-color:#f2f3f8" leftmargin="0"><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);font-family:'Open Sans',sans-serif"><tr><td><table style="background-color:#f2f3f8;max-width:670px;margin:0 auto" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px">&nbsp;</td></tr><tr><td style="text-align:center"><img width="200" src="https://sudarshanstorage.blob.core.windows.net/store/logo-2x.png" title="logo" alt="logo"></td></tr><tr><td style="height:20px">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff;border-radius:3px;text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06)"><tr><td style="height:40px">&nbsp;</td></tr><tr><td style="padding:0 35px"><h1 style="color:#1e1e2d;font-weight:500;margin:0;font-size:32px;font-family:Rubik,sans-serif">You have requested to reset your password</h1><span style="display:inline-block;vertical-align:middle;margin:29px 0 26px;border-bottom:1px solid #cecece;width:100px"></span><p style="color:#455056;font-size:15px;line-height:24px;margin:0">Need to reset your password?<br>Use your secret code!<br><p><h2>${otp}</h2></p>This link is only valid for the next &nbsp<span style="font-size:18px">${otp_expiry}</span>.<br><br>If you did not forget your password, you can ignore this email.</p></td></tr><tr><td style="height:40px">&nbsp;</td></tr></table></td><tr><td style="height:20px">&nbsp;</td></tr><tr><td style="text-align:center"></td></tr><tr><td style="height:80px">&nbsp;</td></tr></table></td></tr></table></body></html>`,
    };
  };
}
