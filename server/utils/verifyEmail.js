import nodemailer from "nodemailer";

const sendVerifyEmail = async (email, verifyUrl) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: email,
    subject: "Verify your Email",
    html: `<p>Click this link below to verify:</p>
    <br>
    <a href=${verifyUrl}>Verify your Email</a>
    `,
  };

  const response = await transporter.sendMail(mailOptions);
  console.log(response);
};

export { sendVerifyEmail };
