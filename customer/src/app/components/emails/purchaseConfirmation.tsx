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
  Hr,
} from "@react-email/components";
import * as React from "react";

interface PurchaseConfirmationNotifyProps {
  orderData?: any;
}

export const PurchaseConfirmationNotify = ({
  orderData,
}: PurchaseConfirmationNotifyProps) => {

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

            <Section style={informationTable}>
              <Row style={informationTableRow}>
                <Column colSpan={2}>
                  <Section>
                    <Row>
                      <Column style={informationTableColumn}>
                        <Text style={informationTableLabel}>INVOICE DATE</Text>
                        <Text style={informationTableValue}>{dateToLocalTimeDateYear(orderData.createdAt)}</Text>
                      </Column>
                    </Row>

                    <Row>
                      <Column style={informationTableColumn}>
                        <Text style={informationTableLabel}>ORDER ID</Text>
                        <Link
                          style={{
                            ...informationTableValue,
                            color: "#15c",
                            textDecoration: "underline",
                            textTransform: "uppercase",
                          }}
                        >
                          {orderData.orderId}
                        </Link>
                      </Column>
                    </Row>
                  </Section>
                </Column>
                <Column style={informationTableColumn} colSpan={2}>
                  <Text style={informationTableLabel}>BILLED TO</Text>
                  <Text style={informationTableValue}>
                    {orderData.userInfo.name}
                  </Text>
                  <Text style={informationTableValue}>{orderData.userInfo.email}</Text>
                  <Text style={informationTableValue}>{orderData.userInfo.phone}</Text>
                </Column>
              </Row>
            </Section>
          </Section>
          <Section style={productTitleTable}>
            <Text style={productsTitle}>Order Detail</Text>
          </Section>
          <Section>
            {orderData?.cart?.map((product: any, index: number) => (
              <Row>
                <Column style={{ paddingLeft: "22px" }}>
                  <Text style={productTitle}>{product.title}</Text>
                  <Text style={productDescription}>{product.category}</Text>
                </Column>

                <Column style={productPriceWrapper} align="right">
                  <Text style={productPrice}>₹{product.salePrice}</Text>
                </Column>
              </Row>
            ))}
          </Section>
          <Hr style={productPriceLine} />
          <Section align="right">
            <Row>
              <Column style={tableCell} align="right">
                <Text style={productPriceTotal}>TOTAL</Text>
              </Column>
              <Column style={productPriceVerticalLine} />
              <Column style={productPriceLargeWrapper}>
                <Text style={productPriceLarge}>₹{orderData.amount / 100}</Text>
              </Column>
            </Row>
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

export default PurchaseConfirmationNotify;

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

const tableCell = { display: "table-cell" };

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "14px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "12px",
};

const informationTableValue = {
  fontSize: "14px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0",
  textAlign: "center" as const,
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "14px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = { fontSize: "14px", fontWeight: "600", ...resetText };

const productDescription = {
  fontSize: "14px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const productLink = {
  fontSize: "14px",
  color: "rgb(0,112,201)",
  textDecoration: "none",
};

const divisor = {
  marginLeft: "4px",
  marginRight: "4px",
  color: "rgb(51,51,51)",
  fontWeight: 200,
};

const productPriceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "12px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const productPrice = {
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

const productPriceLineBottom = { margin: "0 0 75px 0" };

const block = { display: "block" };

const ctaTitle = {
  display: "block",
  margin: "15px 0 0 0",
};

const ctaText = { fontSize: "24px", fontWeight: "500" };

const walletWrapper = { display: "table-cell", margin: "10px 0 0 0" };

const walletLink = { color: "rgb(0,126,255)", textDecoration: "none" };

const walletImage = {
  display: "inherit",
  paddingRight: "8px",
  verticalAlign: "middle",
};

const walletBottomLine = { margin: "65px 0 20px 0" };

const footerText = {
  fontSize: "14px",
  color: "rgb(102,102,102)",
  margin: "0",
  lineHeight: "auto",
  marginBottom: "16px",
};

const footerTextCenter = {
  fontSize: "14px",
  color: "rgb(102,102,102)",
  margin: "20px 0",
  lineHeight: "auto",
  textAlign: "center" as const,
};

const footerLink = { color: "rgb(0,115,255)" };

const footerIcon = { display: "block", margin: "40px 0 0 0" };

const footerLinksWrapper = {
  margin: "8px 0 0 0",
  textAlign: "center" as const,
  fontSize: "14px",
  color: "rgb(102,102,102)",
};

const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "14px",
  color: "rgb(102,102,102)",
};

const walletLinkText = {
  fontSize: "14px",
  fontWeight: "400",
  textDecoration: "none",
};
