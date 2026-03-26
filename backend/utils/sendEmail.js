const nodemailer = require("nodemailer");

exports.sendPassEmail = async (visitorName, visitorEmail, qrCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
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
          
          <img src="${qrCode}" width="200" />
          
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
