import sendgrid from '@sendgrid/mail';
import { render } from "@react-email/components";
import { PartnerSignupEmail } from '@/components/emails/signup-partners';

export const sendPartnerSignupEmail = async (to, subject, password, email, name) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = await render(<PartnerSignupEmail password={password} email={email} name={name} />);


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
