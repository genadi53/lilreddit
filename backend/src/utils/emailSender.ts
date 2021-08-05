import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (to: string, subject: string, html: string) => {
  //   const testAccount = await nodemailer.createTestAccount();
  //   console.log(testAccount);

  // MailTrap
  const transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a17975b8d293ab",
        pass: "78023f90ad1142",
      },
    });

  // Gmail
  const gmailTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kotka5353@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

  const mainOptions = {
    from: "kotka5353@mail.com",
    to,
    subject,
    html,
  };

  await transport.sendMail(mainOptions, , function (err, success) {
    if (err) {
      console.log(err);
      throw err;
    } else console.log("*** New Email Was Send! ***");
  });
};
