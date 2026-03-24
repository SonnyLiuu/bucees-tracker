const nodemailer = require("nodemailer");
const env = require("../config/env");

const buildMessageText = (text, actionUrl) =>
  [text, actionUrl].filter(Boolean).join("\n\n");

module.exports = async (email, subject, text, actionUrl) => {
  try {
    if (!email) {
      throw new Error("No recipient email specified");
    }

    // Dev mode: print instead of send
    if (!env.isProduction) {
      console.log("\n=== DEV EMAIL BYPASS ===");
      console.log("To:", email);
      console.log("Subject:", subject);
      console.log("Body:", buildMessageText(text, actionUrl));
      console.log("========================\n");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: env.emailService,
      auth: {
        user: env.emailUser,
        pass: env.emailPass,
      },
    });

    await transporter.sendMail({
      from: `"Bucee's Tracker" <${env.emailUser}>`,
      to: email,
      subject,
      text: buildMessageText(text, actionUrl),
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
