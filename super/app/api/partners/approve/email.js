import sendgrid from '@sendgrid/mail';
import { render } from "@react-email/components";
import ApprovedNotify from '@/components/emails/partner-approval';
import SupendeddNotify from '@/components/emails/partner-suspended';

export const sendApprovalEmail = async (to, subject, password, email, name, status) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailTemplate = status === 'approved' ? await render(<ApprovedNotify password={password} email={email} name={name} />) : await render(<SupendeddNotify password={password} email={email} name={name} />);
  const emailHtml = emailTemplate;


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
