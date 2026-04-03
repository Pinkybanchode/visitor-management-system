const nodemailer = require("nodemailer");
const twilio = require("twilio");

exports.sendPassEmail = async (visitorName, visitorEmail, qrCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `"Visitor System" <${process.env.EMAIL_USER}>`,
      to: visitorEmail,
      subject: "Your Visitor Pass 🎫",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${visitorName},</h2>
          <p>Your visitor pass has been generated successfully.</p>
          
          <p><b>Please show this QR code at the entrance:</b></p>
          
          <img src="cid:qrcode" />
          
          <p>Valid for next 24 hours.</p>
          <br/>
          <p>Thank you!</p>
        </div>
      `,

      attachments: [
        {
          filename: "qrcode.png",
          content: qrCode.replace(/^data:image\/png;base64,/, ""),
          encoding: "base64",
          cid: "qrcode"
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent..");

  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);


exports.sendSMS = async ({ to, message }) => {
  try {
    console.log(client, process.env.TWILIO_PHONE)
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });

    console.log("SMS sent..");
  } catch (error) {
    console.error("SMS error:", error.message);
    throw error;
  }
};