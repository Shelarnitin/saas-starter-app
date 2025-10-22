import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/register",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes
  if (isPublicRoute(req)) return NextResponse.next();

  // Await the auth() call since it's async in your version
  const { userId } = await auth();

  // Redirect unauthenticated users
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Continue to the requested route
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
  ],
};
