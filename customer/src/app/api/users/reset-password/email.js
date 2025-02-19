import sendgrid from '@sendgrid/mail';
import { render } from "@react-email/components";
import { PasswordRest } from '@/src/app/components/emails/reset-password';

export const ResetPasswordEmail = async (to, subject, date, name) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = await render(<PasswordRest date={date} name={name} />);


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
