import sendgrid from '@sendgrid/mail';
import { render } from "@react-email/components";
import { SignupNotify } from './signupEmail';

export const sendPartnerSignupEmail = async (to, subject, email, name) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = await render(<SignupNotify name={name} />);


  const msg = {
    to,
    from: 'info@rxtn.in',
    subject,
    html: emailHtml,
  };

  try {
    await sendgrid.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(error);
  }
};
