import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class Mail {
    private readonly defaultFrom = '"Thuê Sân Online" <no-reply@thuesan.vn>';

  constructor(private readonly mailerService: MailerService) {}

  send<T>(to: string, subject: string, template: string, context?: T,from: string = this.defaultFrom) {
    const options = {
      from,
      to,
      subject,
      template: process.cwd() + '/src/mail/templates/' + template,
      context,
    } as ISendMailOptions;
    return this.mailerService.sendMail(options);
  }
  
}
