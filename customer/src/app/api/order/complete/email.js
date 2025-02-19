import sendgrid from '@sendgrid/mail';
import { render } from "@react-email/components";
import { PurchaseConfirmationNotify } from '@/src/app/components/emails/purchaseConfirmation';

export const sendProductPurchaseConfirmationEmail = async (to, subject, orderData, name) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = await render(<PurchaseConfirmationNotify orderData={orderData} />);


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
