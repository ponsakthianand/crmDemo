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
  Button,
} from "@react-email/components";
import * as React from "react";

interface PasswordRestProps {
  name?: string;
  date?: string;
}

export const PasswordRest = ({
  name, date
}: PasswordRestProps) => {

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

            <Text style={paragraph}>Dear {name}</Text>

            <Text style={paragraph}>We wanted to let you know that your password was successfully changed through your dashboard on {date}.</Text>

            <Text style={paragraph}>If you made this change, no further action is needed. However, if you did not authorize this change, we strongly recommend resetting your password immediately to secure your account.</Text>

            <Text style={paragraph}>To reset your password, please click the link below:</Text>

            <Button style={button} href={'https://partner.rxtn.in/ta/forgot-password'}>
              Reset password
            </Button>

            <Text style={paragraph}>If you have any concerns or need assistance, please contact our support team at <Link href="mailto:info@rxtn.in" style={link}>info@rxtn.in</Link> or +91 99623 40067.</Text>

            <Text style={paragraph}>Your account security is our top priority.</Text>

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

export default PasswordRest;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};
const paragraphBold = {
  lineHeight: 1.5,
  fontWeight: 'bold',
  color: '#673AB7',
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
  borderBottom: "1px solid #673AB7",
  width: "102px",
};

const link = {
  textDecoration: "underline",
};

const button = {
  backgroundColor: "#008755",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};