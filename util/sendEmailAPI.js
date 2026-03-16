const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    if (!email) {
      throw new Error("No recipient email specified");
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("\n===DEV EMAIL BYPASS===");
      console.log("To: ", email);
      console.log("Subject: ", subject);
      console.log("Body: ", text);
      console.log("======================\n");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
