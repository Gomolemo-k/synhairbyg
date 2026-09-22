import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import en from "../../../messages/en.json";

const PLUM = "#5e2433";
const ROSE = "#9d6f7c";
const CHARCOAL = "#3b2a30";
const WARMWHITE = "#faf5f2";
const BLUSH = "#f7ece9";

const common = en.Mail.common;
const year = new Date().getFullYear();

export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: PLUM,
        color: WARMWHITE,
        borderRadius: "999px",
        padding: "14px 28px",
        fontSize: "15px",
        fontWeight: 600,
        textDecoration: "none",
        display: "inline-block",
      }}
    >
      {children}
    </Button>
  );
}

export function EmailLayout({
  preview,
  children,
}: {
  preview?: string;
  children: ReactNode;
}) {
  return (
    <Html>
      <Head />
      {preview ? <Preview>{preview}</Preview> : null}
      <Body
        style={{
          backgroundColor: BLUSH,
          fontFamily:
            "-apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: WARMWHITE,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Section style={{ backgroundColor: PLUM, padding: "28px 32px" }}>
            <Text
              style={{
                margin: 0,
                color: WARMWHITE,
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              {common.brandName}
            </Text>
          </Section>
          <Section style={{ padding: "28px 32px" }}>{children}</Section>
          <Section
            style={{
              padding: "18px 32px",
              borderTop: `1px solid ${ROSE}33`,
              backgroundColor: "#fbf4f1",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.6",
                color: CHARCOAL,
                opacity: 0.7,
              }}
            >
              {common.footerCopyright.replace("{year}", String(year))}
              <br />
              {common.footerContact}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function MutedText({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Text
      style={{ margin: "0 0 14px", fontSize: "14px", lineHeight: "1.6", color: CHARCOAL, opacity: 0.75 }}
    >
      {children}
    </Text>
  );
}