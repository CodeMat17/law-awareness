import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { siteBackedCollections } from "@/lib/content/convex-repository";
import { RecordCreator } from "@/components/admin/record-creator";
import { getCollection } from "@/lib/cms/collections";
import { canPerform, getCurrentEditor } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

/**
 * Add a record to any collection.
 *
 * This route sits alongside `[id]`, and the static segment wins - so a record
 * whose id is literally "new" would be unreachable here. Ids are derived from
 * slugs, so that is a name no record acquires by accident.
 */
export default async function NewRecordPage({
  params,
}: PageProps<"/admin/[collection]/new">) {
  const { collection: collectionId } = await params;

  const definition = getCollection(collectionId);
  if (!definition) notFound();

  // The form is guarded here as well as in the action: an author who cannot
  // create should not be shown a form that will refuse them at the end of it.
  // A fixed collection has no New button anywhere; someone reaching this URL
  // by hand or from a bookmark gets the list rather than a form that would be
  // refused on submit.
  if (definition.fixed) redirect(`/admin/${definition.id}`);

  const editor = await getCurrentEditor();
  if (!canPerform(editor, "author")) redirect(`/admin/${definition.id}`);

  return (
    <div className="px-4 py-7 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <Link
        href={`/admin/${definition.id}`}
        className="inline-flex items-center gap-1.5 text-[0.82rem] font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {definition.label}
      </Link>

      <header className="mt-5 max-w-3xl">
        <p className="text-eyebrow text-brand-ink">New</p>
        <h1 className="text-h2 mt-3 text-foreground">{definition.singular}</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
          {definition.description}
        </p>
        <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Where it shows: </strong>
          {definition.appearsOn}
        </p>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <RecordCreator
          collectionId={definition.id}
          singular={definition.singular}
          fields={definition.fields}
          canPublish={canPerform(editor, "editor")}
        />

        <section className="rounded-2xl border border-primary/25 bg-primary/8 p-5">
          {/* Said before the form is filled in, not after it is submitted: the
              point of the warning is to save the work, not to explain where it
              went. */}
          {!siteBackedCollections.has(definition.id) && (
            <p className="mb-4 flex items-start gap-2 border-b border-primary/25 pb-4 text-[0.85rem] leading-relaxed text-foreground">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand-ink" />
              <span>
                <strong>Heads up:</strong> the public site still renders{" "}
                {definition.label.toLowerCase()} from the built-in content, so
                what you add here is stored but will not appear on the site yet.
              </span>
            </p>
          )}
          <h2 className="text-caption text-brand-ink">What happens next</h2>
          <ul className="mt-3 space-y-2.5 text-[0.82rem] leading-relaxed text-muted-foreground">
            <li>
              This is saved as a{" "}
              <strong className="text-foreground">draft</strong>. Nothing
              reaches readers until someone moves it through review and
              publishes it.
            </li>
            <li>
              The web address is made from the title automatically, and a
              number is added if that address is already taken. Open the record
              from the confirmation to see it.
            </li>
            {definition.hasBlocks && (
              <li>
                The page body is composed after the record exists, on its own
                screen.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
