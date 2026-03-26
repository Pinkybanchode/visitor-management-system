
import  emailjs  from "@emailjs/browser";

const sendEmail = async (visitorName, email, code) => {
  try {
    console.log("sending email...")
    const templateParams = {
      visitor_name: visitorName,
      email: email,
      qr_code: code,
    };

    await emailjs.send(
      "service_tkp6155",
      "template_ct11r3o",
      templateParams,
      process.env.PUBLIC_KEY
    );

    console.log("Email sent");
  } catch (err) {
    console.error("Email failed", err);
  }
};

export default sendEmail;