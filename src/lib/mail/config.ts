import "server-only";

export const MAIL_FROM =
  process.env.MAIL_FROM ?? "SynHairbyG <noreply@synhairbyg.co.za>";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";