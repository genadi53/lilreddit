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
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

  // Gmail
  // const gmailTransport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
  //   nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: process.env.GMAIL_USER,
  //       pass: process.env.GMAIL_PASS,
  //     },
  //     tls: {
  //       rejectUnauthorized: false,
  //     },
  //   });

  const mainOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  await transport.sendMail(mainOptions, function (err) {
    if (err) {
      console.log(err);
      throw err;
    } else console.log("*** New Email Was Send! ***");
  });
};
