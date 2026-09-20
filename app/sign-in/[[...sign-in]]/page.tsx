import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/**
 * Optional catch-all so Clerk can own the sub-paths it needs for multi-step
 * flows (factor-one, factor-two, SSO callback) without extra route files.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <SignIn />
    </div>
  );
}
