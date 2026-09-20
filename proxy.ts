import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Next.js 16 renamed the `middleware` file convention to `proxy`. Clerk's
 * helper is still called `clerkMiddleware()` - only the file and export names
 * changed, so it is mounted here unchanged.
 *
 * This layer enforces *authentication* only: it guarantees that anything under
 * /admin has a signed-in user, and sends everyone else to sign in. It
 * deliberately does not check roles. Roles live in Convex, which cannot be
 * queried from here, and a proxy is meant to be cheap and CDN-deployable.
 * The role gate is in app/admin/layout.tsx, and the real one - the check the
 * user cannot bypass - is in the Convex functions themselves.
 */
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) {
    // Redirects to the sign-in page with a return URL when there is no
    // session, rather than throwing a 404 or a bare 401.
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /**
     * Everything except Next internals and static assets. Without the negative
     * lookahead this would run on CSS, JS and images too, which is both
     * wasteful and a good way to accidentally break asset loading.
     */
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
