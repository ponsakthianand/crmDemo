import sendgrid from '@sendgrid/mail';
import { render } from '@react-email/components';
import LeadsNotification from './template';
import React from 'react';

export const sendNotificationEmail = async (subject, data, item) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const emailHtml = await render(
    React.createElement(LeadsNotification, { data, item })
  );

  const msg = {
    to: 'returnxtn@gmail.com',
    from: 'info@rxtn.in',
    subject,
    html: emailHtml,
  };

  try {
    await sendgrid.send(msg);
    console.log(`Email sent to returnxtn@gmail.com`);
  } catch (error) {
    console.error(error);
  }
};
