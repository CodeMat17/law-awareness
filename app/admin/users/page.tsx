import { redirect } from "next/navigation";
import { UserRoles } from "@/components/admin/user-roles";
import { canPerform, getCurrentEditor } from "@/lib/cms/auth";

export const metadata = {
  title: "People & access",
  robots: { index: false, follow: false },
};

/**
 * Role administration. Without this screen the only way to hold a role would
 * be the bootstrap env var, so RBAC would not actually be administrable.
 */
export default async function UsersPage() {
  const editor = await getCurrentEditor();

  // Admin-only, and a non-admin editor is a legitimate signed-in user rather
  // than an intruder - so they get the no-access page, not a 404.
  if (!canPerform(editor, "admin")) redirect("/no-access");

  return (
    <div className="px-4 py-7 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <header>
        <p className="text-eyebrow text-brand-ink">Access</p>
        <h1 className="text-h1 mt-3 text-foreground">People &amp; access</h1>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Anyone who signs in appears here, with no role and no access to the
          CMS until one is granted. Roles are cumulative — each includes
          everything the role below it can do.
        </p>
      </header>

      <UserRoles currentUserId={editor!.id} />
    </div>
  );
}
