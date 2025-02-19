import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ApprovedNotifyProps {
  email?: string;
  name?: string;
  password?: string;
}

export const ApprovedNotify = ({
  name, email, password
}: ApprovedNotifyProps) => {

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Row>
              <Column>
                <Img
                  src={`https://e5osher1gwoyuako.public.blob.vercel-storage.com/branding/logo-txwRHvZEfWhT2Q6T7G2o0a3sj4zTpy.png`}
                  width="114"
                  alt="Rxt Logo"
                />
              </Column>
              <Column align="right">
                <Img
                  src={`https://e5osher1gwoyuako.public.blob.vercel-storage.com/branding/financial-health-clinic-7UcisHSHahS0UsxfcCvf1NIdc7VDzy.png`}
                  width="114"
                  alt="Rxt Logo"
                />
              </Column>
            </Row>
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>

            <Text style={paragraph}><strong>Dear {name}</strong></Text>

            <Text style={paragraph}>We’re excited to inform you that your account has been approved. Below are your login credentials to access your account:</Text>

            <Text style={paragraph}>Username: {email}</Text>
            <Text style={paragraph}>Password: <code style={code}>{password}</code></Text>

            <Text style={paragraph}>You can log in at: <Link href="https://partner.rxtn.in/" style={link}>https://partner.rxtn.in/</Link></Text>

            <Text style={paragraph}>For security, please change your password after your first login. If you have any questions or need assistance, feel free to contact us. <br /><Link href="mailto:info@rxtn.in" style={link}>info@rxtn.in</Link> or +91 99623 40067.</Text>

            <Text style={paragraph}>Welcome aboard!</Text>

            <Text style={paragraph}>
              Best regards,<br />
              The RxT Team<br />
            </Text>
            <Link href="https://www.rxtn.in/" style={link}>www.rxtn.in</Link>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Column align="right" style={{ width: "50%", paddingRight: "8px" }}>
              <Link href="https://www.instagram.com/rxt_a_financial_health_clinic/" style={link}><Img width={32} src={`https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/instagram-htfUfU3a62hEPO9WUyJgZqVITaEUbB.png`} /></Link>
            </Column>
            <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
              <Link href="https://www.facebook.com/RxT.Financial.Health.Clinic/" style={link}><Img width={32} src={`https://e5osher1gwoyuako.public.blob.vercel-storage.com/social-icons/facebook-GEKmTUtpy7SY7Mx4XgJKnOQt43S8GL.png`} /></Link>
            </Column>
          </Row>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2025 Returnx Edumode LLP, All Rights Reserved <br />
              3rd Floor, Old No. 47, New, 26, Brindavan St, Extension, <br />West Mambalam, Chennai, Tamil Nadu 600033.
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default ApprovedNotify;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "17px",
  borderRadius: "4px",
  color: "#3c4149",
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};
const paragraphBold = {
  lineHeight: 1.5,
  fontWeight: 'bold',
  color: '#008756',
  fontSize: 14,
};

const container = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  padding: '10px 20px',
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid #008756",
  width: "102px",
};

const link = {
  textDecoration: "underline",
};
