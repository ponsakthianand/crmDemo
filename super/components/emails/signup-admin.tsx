import { PaddingIcon } from "@radix-ui/react-icons";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { text } from "stream/consumers";

interface PlaidVerifyIdentityEmailProps {
  password?: string;
  email?: string;
  name?: string;
}

export const PlaidVerifyIdentityEmail = ({
  password, email, name
}: PlaidVerifyIdentityEmailProps) => {
  return <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://e5osher1gwoyuako.public.blob.vercel-storage.com/branding/logo-txwRHvZEfWhT2Q6T7G2o0a3sj4zTpy.png`}
          width="212"
          alt="Plaid"
          style={logo}
        />
        <Heading style={secondary}>
          Hello {name}, <br />Welcome to The RxT Core Team 🎉
        </Heading>
        <Section style={codeContainer}>
          <Text style={code}>Login url: <Link href="https://super.rxtn.in">super.rxtn.in</Link></Text>
          <Text style={code}>Email: {email}</Text>
        </Section>
        <Text style={tertiary}>Your auto-generated password</Text>
        <Section style={codeContainer}>
          <Text style={code}>{password}</Text>
        </Section>
        <Text style={paragraph}>Not expecting this email?</Text>
        <Text style={paragraph}>
          Contact{" "}
          <Link href="mailto:info@rxt.in" style={link}>
            info@rxt.in
          </Link>
        </Text>
      </Container>
      <Text style={footer}>&copy; All rights reserved</Text>
    </Body>
  </Html>
};

PlaidVerifyIdentityEmail.PreviewProps = {
  password: "144833",
} as PlaidVerifyIdentityEmailProps;

export default PlaidVerifyIdentityEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginTop: "20px",
  maxWidth: "500px",
  margin: "0 auto",
  padding: "40px 20px 40px",
  boxShadow: "0px 3px 10px 0px #e2e2e2",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "15px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "20px",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  padding: "20px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Bold",
  fontSize: "20px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
