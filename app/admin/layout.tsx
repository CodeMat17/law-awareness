import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminShell } from "@/components/admin/admin-shell";
import { canPerform, getEditorSession, isAuthConfigured } from "@/lib/cms/auth";
import { collections } from "@/lib/cms/collections";
import { getCms } from "@/lib/cms/repository";

export const metadata: Metadata = {
  title: "Editorial CMS",
  robots: { index: false, follow: false },
};

/** Admin always renders per request - never prerendered, never cached. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await getEditorSession();

  // Fails closed, and distinguishes the two reasons access is refused. The
  // proxy has already required a session for /admin, so the anonymous branch
  // is only reachable if that ever stops matching - it is kept as a backstop.
  if (session.status === "anonymous") redirect("/sign-in?redirect_url=/admin");
  if (session.status === "no-role") redirect("/no-access");

  const { editor } = session;

  const counts = await getCms().listCollectionsSummary();

  const sidebar = (
    <>
      <AdminNav collections={collections} counts={counts} />

      <div className="mt-auto border-t border-hairline p-4">
        <p className="text-[0.85rem] font-bold text-foreground">{editor.name}</p>
        <p className="text-[0.75rem] text-muted-foreground capitalize">
          {editor.role}
        </p>
        <div className="mt-3 flex flex-col items-start gap-2">
          {canPerform(editor, "admin") && (
            <Link
              href="/admin/users"
              className="py-0.5 text-[0.78rem] font-bold text-brand-ink link-underline"
            >
              People &amp; access
            </Link>
          )}
          <Link
            href="/"
            className="py-0.5 text-[0.78rem] font-bold text-brand-ink link-underline"
          >
            View the public site
          </Link>
          <SignOutButton redirectUrl="/">
            <button
              type="button"
              className="cursor-pointer py-0.5 text-[0.78rem] font-bold text-muted-foreground link-underline"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </>
  );

  return (
    <AdminShell sidebar={sidebar}>
      {!isAuthConfigured() && (
        <div className="flex items-start gap-3 border-b border-primary/30 bg-primary/10 px-4 py-3 sm:px-5 lg:px-8">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand-ink" />
          <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
            <span className="font-bold text-foreground">Preview mode.</span> No
            authentication provider is configured and content is held in memory,
            so edits reset when the server restarts. Connect Clerk and Convex to
            make this durable.
          </p>
        </div>
      )}
      {children}
    </AdminShell>
  );
}
