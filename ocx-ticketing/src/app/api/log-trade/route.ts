import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * POST /api/log-trade — Ghi email vào file log khi user bấm "Đổi liền" (for fun).
 * File: log/trade-requests.log (trong thư mục project; production có thể dùng /tmp).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }

    const logDir = path.join(process.cwd(), "log");
    const logFile = path.join(logDir, "trade-requests.log");
    const line = `[${new Date().toISOString()}] ${email}\n`;

    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(logFile, line);
    } catch (err) {
      // Trên môi trường read-only (vd Vercel) có thể ghi vào /tmp
      const fallback = path.join("/tmp", "trade-requests.log");
      try {
        fs.appendFileSync(fallback, line);
      } catch {
        console.error("[log-trade]", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[log-trade]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
