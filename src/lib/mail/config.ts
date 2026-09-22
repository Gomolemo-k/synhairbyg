import "server-only";

export const MAIL_FROM =
  process.env.MAIL_FROM ?? "SynHairbyG <noreply@synhairbyg.co.za>";

function resolveSiteUrl(): string {
  const raw = process.env.SITE_URL ?? "http://localhost:3000";
  const clean = raw.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(clean);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return clean;
    }
  } catch {
    return "https://www.synhairbyg.co.za";
  }
  return "https://www.synhairbyg.co.za";
}

export const SITE_URL = resolveSiteUrl();