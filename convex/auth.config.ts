/**
 * Tells Convex which JWTs to trust. `CLERK_JWT_ISSUER_DOMAIN` is the Frontend
 * API URL of the Clerk instance (https://<slug>.clerk.accounts.dev in
 * development, the custom domain in production) and must be set on the Convex
 * deployment itself - `npx convex env set CLERK_JWT_ISSUER_DOMAIN ...` - not
 * just in .env.local, because this file is evaluated by Convex, not by Next.
 *
 * `applicationID` matches the name of the JWT template created in the Clerk
 * dashboard, which must be called "convex" and use the default claims.
 */
const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
