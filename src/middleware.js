import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Use `jose` for JWT verification

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const token = cookies.get("token")?.value; // Retrieve token from cookies

  // Public routes
  const PUBLIC_PATHS = [
    "/",
    "/login",
    "/shipper/register",
    "/superadmin/register",
    "/trucker/register",
  ];

  // If no token and trying to access a protected route, redirect to login
  if (!token && !PUBLIC_PATHS.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If there is a token, verify it using `jose`
  if (token) {
    try {
      // Convert secret to Uint8Array (jose requires it)
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);

      // Verify JWT
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role;

      // Redirect logged-in users away from public paths
      if (PUBLIC_PATHS.includes(nextUrl.pathname)) {
        const redirectPath =
          userRole === "shipper"
            ? "/shipper/dashboard"
            : userRole === "trucker"
            ? "/trucker/dashboard"
            : userRole === "admin"
            ? "/superadmin/dashboard"
            : null;

        if (redirectPath) {
          return NextResponse.redirect(new URL(redirectPath, req.url));
        }
      }

      // Restrict users from accessing unauthorized routes
      const ROLE_PATHS = {
        shipper: "/shipper",
        trucker: "/trucker",
        admin: "/superadmin",
      };

      // Ensure users can only access their respective routes
      for (const [role, path] of Object.entries(ROLE_PATHS)) {
        if (userRole !== role && nextUrl.pathname.startsWith(path)) {
          return NextResponse.redirect(
            new URL(`/${userRole}/dashboard`, req.url)
          );
        }
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to relevant pages, excluding API routes and static assets
export const config = {
  matcher: [
    "/((?!api/|_next/|static/|favicon.ico).*)", // Exclude API calls & Next.js internals
  ],
};
