import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerifyEmail = async (email, verifyUrl) => {
  const { data, error } = await resend.emails.send({
    from: "Shrink.It <verify@shrinkit.co.in>",
    to: email,
    subject: "Verify Email to access your account",
    html: `<p>Click this link below to verify:</p>
    <br>
    <a href=${verifyUrl}>Verify your Email</a>
    `,
  });

  if (error) {
    return console.log(error);
  }
  console.log({ data });
};

export { sendVerifyEmail };
