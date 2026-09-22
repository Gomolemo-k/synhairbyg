import { Button, Column, Row, Text } from "@react-email/components";
import { render } from "@react-email/render";
import type { ReactElement } from "react";
import type { AbstractIntlMessages } from "use-intl";
import { createTranslator } from "use-intl/core";
import { formatZAR } from "@/lib/format";
import en from "../../../messages/en.json";
import { EmailButton, EmailLayout, MutedText } from "./components";
import { sendRawMail, type SendMailResult } from "./send";
import { SITE_URL } from "./config";

type MailSection = keyof typeof en.Mail;

type Translator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const messages: AbstractIntlMessages = en as unknown as AbstractIntlMessages;

function tFor(module: MailSection): Translator {
  const t = createTranslator({
    locale: "en",
    messages,
    namespace: `Mail.${module}`,
  });
  return t as unknown as Translator;
}

function mailSubject(module: MailSection, values?: Record<string, string | number>) {
  return tFor(module)("subject", values);
}

export type MailItem = {
  name: string;
  qty?: number;
  price?: number;
  url?: string;
};

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export function WelcomeEmail({ name }: { name: string }) {
  const t = tFor("welcome");
  return (
    <EmailLayout preview={t("subject")}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading", { name })}
      </Text>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      <MutedText>{t("note")}</MutedText>
      <EmailButton href={`${SITE_URL}/shop`}>{t("cta")}</EmailButton>
    </EmailLayout>
  );
}

export function VerifyEmail({ name, url }: { name: string; url: string }) {
  const t = tFor("verifyEmail");
  return (
    <EmailLayout preview={t("subject")}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading", { name })}
      </Text>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      <EmailButton href={url}>{t("cta")}</EmailButton>
      <MutedText>{t("expiryNote")}</MutedText>
    </EmailLayout>
  );
}

export function ResetPasswordEmail({ name, url }: { name: string; url: string }) {
  const t = tFor("forgotPassword");
  return (
    <EmailLayout preview={t("subject")}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading", { name })}
      </Text>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      <EmailButton href={url}>{t("cta")}</EmailButton>
      <MutedText>{t("expiryNote")}</MutedText>
    </EmailLayout>
  );
}

export function OrderReadyEmail({
  name,
  orderId,
  items,
  collectionPoint,
}: {
  name: string;
  orderId: string;
  items: MailItem[];
  collectionPoint?: string;
}) {
  const t = tFor("orderReady");
  return (
    <EmailLayout preview={t("subject", { orderId })}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading", { name, orderId })}
      </Text>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      <Row style={{ borderBottom: "1px solid #e9d8d3", padding: "10px 0" }}>
        <Column style={{ fontSize: "13px", fontWeight: 600, color: "#5e2433" }}>
          {t("columnItem")}
        </Column>
        <Column align="right" style={{ fontSize: "13px", fontWeight: 600, color: "#5e2433" }}>
          {t("columnLineTotal")}
        </Column>
      </Row>
      {items.map((item) => (
        <Row key={item.name + item.qty} style={{ padding: "8px 0" }}>
          <Column style={{ fontSize: "14px", color: "#3b2a30" }}>
            {item.name}
            {item.qty ? <span style={{ opacity: 0.6 }}> × {item.qty}</span> : null}
          </Column>
          <Column align="right" style={{ fontSize: "14px", color: "#3b2a30" }}>
            {item.price !== undefined ? formatZAR(item.price * (item.qty ?? 1)) : ""}
          </Column>
        </Row>
      ))}
      {collectionPoint ? (
        <MutedText>{t("collectionPoint", { point: collectionPoint })}</MutedText>
      ) : null}
      <EmailButton href={`${SITE_URL}/track`}>
        {t("cta")}
      </EmailButton>
    </EmailLayout>
  );
}

export function AbandonedCartEmail({
  name,
  items,
  total,
  cartUrl,
}: {
  name: string;
  items: MailItem[];
  total: number;
  cartUrl: string;
}) {
  const t = tFor("abandonedCart");
  return (
    <EmailLayout preview={t("subject")}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading", { name })}
      </Text>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      <Row style={{ borderBottom: "1px solid #e9d8d3", padding: "10px 0" }}>
        <Column style={{ fontSize: "13px", fontWeight: 600, color: "#5e2433" }}>
          {t("columnItem")}
        </Column>
        <Column align="right" style={{ fontSize: "13px", fontWeight: 600, color: "#5e2433" }}>
          {t("columnLineTotal")}
        </Column>
      </Row>
      {items.map((item) => (
        <Row key={item.name + item.qty} style={{ padding: "8px 0" }}>
          <Column style={{ fontSize: "14px", color: "#3b2a30" }}>
            {item.name}
            {item.qty ? <span style={{ opacity: 0.6 }}> × {item.qty}</span> : null}
          </Column>
          <Column align="right" style={{ fontSize: "14px", color: "#3b2a30" }}>
            {item.price !== undefined ? formatZAR(item.price * (item.qty ?? 1)) : ""}
          </Column>
        </Row>
      ))}
      <Row style={{ padding: "12px 0" }}>
        <Column style={{ fontSize: "15px", fontWeight: 600, color: "#3b2a30" }}>
          {t("total")}
        </Column>
        <Column align="right" style={{ fontSize: "15px", fontWeight: 700, color: "#5e2433" }}>
          {formatZAR(total)}
        </Column>
      </Row>
      <EmailButton href={cartUrl}>{t("cta")}</EmailButton>
    </EmailLayout>
  );
}

export function NewsletterEmail({
  items,
  unsubscribeUrl,
}: {
  items: MailItem[];
  unsubscribeUrl: string;
}) {
  const t = tFor("newsletter");
  return (
    <EmailLayout preview={t("subject")}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading")}
      </Text>
      <Text style={{ margin: "0 0 18px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      {items.map((item) => (
        <Row key={item.name} style={{ padding: "10px 0", borderBottom: "1px solid #e9d8d3" }}>
          <Column style={{ fontSize: "14px", color: "#3b2a30" }}>{item.name}</Column>
          <Column style={{ fontSize: "14px", color: "#3b2a30" }}>
            {item.price !== undefined ? formatZAR(item.price) : ""}
          </Column>
          <Column align="right">
            {item.url ? (
              <Button
                href={item.url}
                style={{
                  color: "#5e2433",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                {t("shopNow")}
              </Button>
            ) : null}
          </Column>
        </Row>
      ))}
      <Text style={{ margin: "22px 0 14px", fontSize: "12px", lineHeight: "1.6", color: "#3b2a30", opacity: 0.7 }}>
        {t("unsubscribe")}{" "}
        <a href={unsubscribeUrl} style={{ color: "#5e2433" }}>
          {t("unsubscribeLink")}
        </a>
        {t("unsubscribeNote")}
      </Text>
    </EmailLayout>
  );
}

export function NewsletterWelcomeEmail({
  unsubscribeUrl,
}: {
  unsubscribeUrl: string;
}) {
  const t = tFor("newsletterWelcome");
  return (
    <EmailLayout preview={t("subject")}>
      <Text
        style={{ margin: "0 0 16px", fontSize: "24px", fontWeight: 700, color: "#5e2433" }}
      >
        {t("heading")}
      </Text>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: "1.6", color: "#3b2a30" }}>
        {t("body")}
      </Text>
      <MutedText>
        {t("unsubscribe")}{" "}
        <a href={unsubscribeUrl} style={{ color: "#5e2433" }}>
          {t("unsubscribeLink")}
        </a>
      </MutedText>
    </EmailLayout>
  );
}

// ---------------------------------------------------------------------------
// Sending helpers
// ---------------------------------------------------------------------------

async function sendRendered(
  to: string,
  subject: string,
  email: ReactElement,
): Promise<SendMailResult> {
  const html = await render(email);
  const text = await render(email, { plainText: true });
  return sendRawMail({ to, subject, html, text });
}

export function sendWelcomeEmail(to: string, name: string) {
  return sendRendered(to, mailSubject("welcome"), WelcomeEmail({ name }));
}

export function sendVerificationEmail(to: string, name: string, token: string) {
  const url = `${SITE_URL}/verify-email?token=${encodeURIComponent(token)}`;
  return sendRendered(
    to,
    mailSubject("verifyEmail"),
    VerifyEmail({ name, url }),
  );
}

export function sendResetPasswordEmail(to: string, name: string, token: string) {
  const url = `${SITE_URL}/reset-password?token=${encodeURIComponent(token)}`;
  return sendRendered(
    to,
    mailSubject("forgotPassword"),
    ResetPasswordEmail({ name, url }),
  );
}

export function sendOrderReadyEmail(input: {
  to: string;
  name: string;
  orderId: string;
  items: MailItem[];
  collectionPoint?: string;
}) {
  return sendRendered(
    input.to,
    mailSubject("orderReady", { orderId: input.orderId }),
    OrderReadyEmail({
      name: input.name,
      orderId: input.orderId,
      items: input.items,
      collectionPoint: input.collectionPoint,
    }),
  );
}

export function sendAbandonedCartEmail(input: {
  to: string;
  name: string;
  items: MailItem[];
  total: number;
}) {
  return sendRendered(
    input.to,
    mailSubject("abandonedCart"),
    AbandonedCartEmail({
      name: input.name,
      items: input.items,
      total: input.total,
      cartUrl: `${SITE_URL}/cart`,
    }),
  );
}

export function sendNewsletterEmail(input: {
  to: string;
  items: MailItem[];
  unsubscribeUrl: string;
}) {
  return sendRendered(
    input.to,
    mailSubject("newsletter"),
    NewsletterEmail({ items: input.items, unsubscribeUrl: input.unsubscribeUrl }),
  );
}

export function sendNewsletterWelcomeEmail(input: {
  to: string;
  unsubscribeUrl: string;
}) {
  return sendRendered(
    input.to,
    mailSubject("newsletterWelcome"),
    NewsletterWelcomeEmail({ unsubscribeUrl: input.unsubscribeUrl }),
  );
}