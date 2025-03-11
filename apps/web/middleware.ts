import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { USER_ROLES_ENUMS } from "~/constants/user";
import type { Session } from "~/lib/auth";

const SIGN_IN_PATH = "/sign-in";
const SIGN_UP_PATH = "/register";
const VERIFY_EMAIL_PATH = "/verify-email";

const UN_PROTECTED_API_ROUTES = ["/api/auth/"];
const PROTECTED_ROUTES = ["/dashboard", "/admin", "/profile", "/swipe"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include", // Ensure session fetch works for cross-origin requests
    },
  );

  // If no session, handle unauthenticated redirects
  if (!session) {
    const isAuthPage =
      request.nextUrl.pathname === SIGN_IN_PATH ||
      request.nextUrl.pathname === SIGN_UP_PATH ||
      request.nextUrl.pathname.startsWith(VERIFY_EMAIL_PATH);

    if (isAuthPage) {
      return NextResponse.next(); // Allow auth pages to be accessed
    }
    if (
      PROTECTED_ROUTES.some((route) =>
        request.nextUrl.pathname.startsWith(route),
      )
    ) {
      // Redirect unauthenticated users to sign-in page with a "next" param
      url.searchParams.set("next", request.nextUrl.pathname);
      url.pathname = SIGN_IN_PATH;
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); // Allow auth pages to be accessed
  }

  // If authenticated, prevent access to auth-related pages
  if (
    request.nextUrl.pathname === SIGN_IN_PATH ||
    request.nextUrl.pathname === SIGN_UP_PATH ||
    request.nextUrl.pathname.startsWith(VERIFY_EMAIL_PATH)
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Restrict API actions (POST, PATCH, PUT, DELETE) for unauthorized users
  if (["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
    if (!session)
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to perform this action",
        },
        { status: 403 },
      );
    if (
      request.nextUrl.pathname.includes("/admin") &&
      session.user.role !== "admin"
    )
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to perform this action",
        },
        { status: 403 },
      );
  }

  // API Route Handling
  if (request.nextUrl.pathname.startsWith("/api")) {
    const isUnprotectedRoute = UN_PROTECTED_API_ROUTES.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    );

    if (isUnprotectedRoute) {
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to perform this action",
        },
        { status: 403 },
      );
    }
  }

  // If protected routes exist, restrict unauthorized users
  if (
    PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!([...USER_ROLES_ENUMS] as string[]).includes(session?.user?.role)) {
      return NextResponse.redirect("/403");
    }
  }

  return NextResponse.next();
}

// Improved matcher to exclude additional static assets & service worker files
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sw.js|manifest.json).*)",
  ],
};
