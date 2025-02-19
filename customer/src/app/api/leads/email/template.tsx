import { dateToLocalTimeDateYear } from "@/global";
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

interface LeadsNotificationProps {
  item: string;
  data?: string;
}



export const LeadsNotification = ({
  item,
  data,
}: LeadsNotificationProps) => {
  function transformAndDisplay(response: any) {
    const transformed = {
      "Full Name": response?.full_Name || 'Not Available',
      "Mobile": response?.mobile || 'Not Available',
      "Email": response?.email || 'Not Available',
      "Date of Birth": response?.dob || 'Not Available',
      "Age": response?.age || 'Not Available',
      "Gender": response?.gender || 'Not Available',
      "Annual Income": response?.annualIncome || 'Not Available',
      "Employment Type": response?.employmentType || 'Not Available',
      "Street": response?.street || 'Not Available',
      "Zip Code": response?.zipCode || 'Not Available',
      "City": response?.city || 'Not Available',
      "State": response?.state || 'Not Available',
      "Country": response?.country || 'Not Available',
      "Category": response?.category || 'Not Available',
      "Sub Category": response?.sub_category || 'Not Available',
      "Lead From": response?.lead_from || 'Not Available',
      "Review Status": response?.review_status || 'Not Available',
      "Referral Name": response?.referral_name || 'Not Available',
      "Created By": response?.created_by_name || 'Not Available',
      "Created At": dateToLocalTimeDateYear(response?.created_at) || 'Not Available',
      "Filing Type": response?.filingType || 'Not Available',
      "Loan Type": response?.loanType || 'Not Available',
      "Delay in Payment": response?.delayInPayment || 'Not Available',
      "Insurance Type": response?.insuranceType || 'Not Available',
      "Known Coverage": response?.isKnownCoverage || 'Not Available',
      "Health Condition": response?.healthCondition || 'Not Available',
      "Differently Abled": response?.differentlyAbled || 'Not Available',
      "Lifestyle Habits": response?.lifeStyleHabits || 'Not Available',
      "Income Tax Filed": response?.isIncomeTaxFiled || 'Not Available',
      "Residential Status": response?.residentialStatus || 'Not Available',
      "Status": response?.status || 'Not Available',
      "Comment": response?.comment || 'Not Available',
      "Customer Name": response?.customer_nam || 'Not Available',
    };

    let table = '<table class="table-auto border-collapse border border-gray-300 w-full text-left">';
    table += '<thead><tr class="bg-gray-200"><th class="border border-gray-300 px-4 py-2">Name</th><th class="border border-gray-300 px-4 py-2">Value</th></tr></thead>';
    table += '<tbody>';
    Object.entries(transformed).forEach(([key, value]) => {
      table += `<tr class="border border-gray-300"><td class="border border-gray-300 px-4 py-2">${key}</td><td class="border border-gray-300 px-4 py-2">${value}</td></tr>`;
    });
    table += '</tbody></table>';

    return table;
  }

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

            <Text style={paragraph}>Dear Admin, we got new {item}</Text>

            <div dangerouslySetInnerHTML={{ __html: transformAndDisplay(data) }} />

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

export default LeadsNotification;

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
