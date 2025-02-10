import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "~/lib/auth";

const SIGN_IN_PATH = "/sign-in";
const SIGN_UP_PATH = "/register";
const VERIFY_EMAIL_PATH = "/verify-email";



const UN_PROTECTED_API_ROUTES = ["/api/auth/*"];
// const PROTECTED_ROUTES = ["/dashboard", "/admin", "/profile"];

// function isAuthorized(roles: string[], allowedRoles: string[]) {
//     return roles.some((role) => allowedRoles.includes(role));
// }

export async function middleware(request: NextRequest) {
    const url = new URL(request.url);
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                //get the cookie from the request
                cookie: request.headers.get("cookie") || "",
            },
        }
    );
    if (!session) {
        if (request.nextUrl.pathname === SIGN_IN_PATH || request.nextUrl.pathname === SIGN_UP_PATH || request.nextUrl.pathname.startsWith(VERIFY_EMAIL_PATH)) {
            return NextResponse.next();
        }
        // if the user is not authenticated and tries to access a page other than the sign-in page, redirect them to the sign-in page
        url.searchParams.set("next", request.url);
        url.pathname = SIGN_IN_PATH;
        return NextResponse.redirect(url);
    }
    if (session) {
        // if the user is already authenticated and tries to access the sign-in page, redirect them to the home page
        if (
            request.nextUrl.pathname === SIGN_IN_PATH ||
            request.nextUrl.pathname === SIGN_UP_PATH

        ) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        // if the user is already authenticated
    }
    if (request.method === "POST") {
        if (!session) {
            return NextResponse.json({
                status: "error",
                message: "You are not authorized to perform this action",
            }, {
                status: 403,
            })
        }
    }
    if (request.nextUrl.pathname.startsWith("/api")) {
        if (
            UN_PROTECTED_API_ROUTES.some((route) =>
                new RegExp(route.replace(/\*/g, ".*")).test(request.nextUrl.pathname)
            )
        ) {
            return NextResponse.next();
        }
        if (!session) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "You are not authorized to perform this action",
                },
                {
                    status: 403,
                }
            );
        }

    }
    // if (PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))) {
    //     if (!isAuthorized(session.user.other_roles || [], ["brand", "customer", "influencer"])) {
    //         return NextResponse.redirect("/403");
    //     }
    // }

    return NextResponse.next();
}
// the following code has been copied from https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.manifest (manifest file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
