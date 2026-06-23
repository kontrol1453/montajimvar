import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL gerekli." }, { status: 400 });
    }

    // Normalise URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    // Validate URL format
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Geçersiz URL formatı." }, { status: 400 });
    }

    // Fetch the page
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Sayfa yüklenemedi (HTTP ${response.status}).` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script/style tags for cleaner text extraction
    $("script, style, nav, footer, header").remove();

    // Extract company name: og:title > meta title > h1
    const companyName =
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $('meta[name="twitter:title"]').attr("content")?.trim() ||
      $("title").first().text().trim() ||
      $("h1").first().text().trim() ||
      "";

    // Extract description
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="twitter:description"]').attr("content")?.trim() ||
      "";

    // Extract phone numbers (Turkish formats: +90 5xx, 0 5xx, 0212, etc.)
    const bodyText = $("body").text();
    const phoneRegexes = [
      /(\+?90?[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{2}[-.\s]?[0-9]{2})/g,
      /(0[-.\s]?[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{2}[-.\s]?[0-9]{2})/g,
    ];
    const phones = new Set<string>();
    for (const regex of phoneRegexes) {
      const matches = bodyText.match(regex);
      if (matches) {
        matches.forEach((p) => phones.add(p.trim()));
      }
    }

    // Also look in <a href="tel:..."> tags
    $('a[href^="tel:"]').each((_, el) => {
      const tel = $(el).attr("href")?.replace("tel:", "").trim();
      if (tel) phones.add(tel);
    });

    // Extract email addresses
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = new Set<string>();
    const emailMatches = bodyText.match(emailRegex);
    if (emailMatches) {
      emailMatches.forEach((e) => {
        // Filter out common false positives
        if (
          !e.includes("example.com") &&
          !e.includes("domain.com") &&
          !e.includes("@" + new URL(targetUrl).hostname) &&
          !e.endsWith(".png") &&
          !e.endsWith(".jpg") &&
          !e.endsWith(".svg") &&
          e.split("@").length === 2
        ) {
          emails.add(e.trim());
        }
      });
    }

    // Also look in mailto links
    $('a[href^="mailto:"]').each((_, el) => {
      const mailto = $(el).attr("href")?.replace("mailto:", "").split("?")[0].trim();
      if (mailto && mailto.includes("@")) emails.add(mailto);
    });

    // Extract logo URL
    const logo =
      $('meta[property="og:image"]').attr("content")?.trim() ||
      $('meta[name="twitter:image"]').attr("content")?.trim() ||
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "";

    // Extract address
    const address =
      $('meta[name="og:street-address"]').attr("content")?.trim() ||
      $('meta[property="og:locality"]').attr("content")?.trim() ||
      "";

    const phone = phones.size > 0 ? Array.from(phones)[0] : "";
    const email = emails.size > 0 ? Array.from(emails)[0] : "";

    return NextResponse.json({
      success: true,
      data: {
        companyName: companyName || extractDomainName(targetUrl),
        description: description.slice(0, 2000),
        phone,
        email,
        logo: logo.startsWith("http") ? logo : logo ? new URL(logo, targetUrl).href : "",
        address,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Sayfa yanıt vermedi (8 saniye aşımı)." },
        { status: 504 }
      );
    }
    console.error("Sayfa bilgi çekme hatası:", error);
    return NextResponse.json(
      { error: "Sayfa bilgileri alınamadı." },
      { status: 500 }
    );
  }
}

function extractDomainName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname.split(".")[0] || hostname;
  } catch {
    return url;
  }
}
