import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // ❌ No token
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const { role } = payload;
    const pathname = req.nextUrl.pathname;

    // 🔐 Admin routes
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 🔐 Manager routes
    if (
      pathname.startsWith("/manager") &&
      !["manager", "admin"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 🔐 Driver routes
    if (
      pathname.startsWith("/driver") &&
      !["driver", "manager", "admin"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
