import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { BlockComposer } from "@/components/admin/block-composer";
import { RecordEditor } from "@/components/admin/record-editor";
import { StatusBadge } from "@/components/admin/status-badge";
import { VisibilityPanel } from "@/components/admin/visibility-panel";
import { WorkflowControls } from "@/components/admin/workflow-controls";
import { siteBackedCollections } from "@/lib/content/convex-repository";
import { blockDefinitions } from "@/lib/cms/blocks";
import { getCollection } from "@/lib/cms/collections";
import { getCms } from "@/lib/cms/repository";
import { getCurrentEditor, canPerform } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export default async function RecordPage({
  params,
}: PageProps<"/admin/[collection]/[id]">) {
  const { collection: collectionId, id } = await params;

  const definition = getCollection(collectionId);
  if (!definition) notFound();

  const [record, editor] = await Promise.all([
    getCms().get(definition.id, id),
    getCurrentEditor(),
  ]);
  if (!record) notFound();

  return (
    <div className="px-4 py-7 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <Link
        href={`/admin/${definition.id}`}
        className="inline-flex items-center gap-1.5 text-[0.82rem] font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {definition.label}
      </Link>

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-eyebrow text-brand-ink">{definition.singular}</p>
          <h1 className="text-h2 mt-3 text-foreground">{record.title}</h1>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.78rem] text-muted-foreground">
            <span>ID {record.id}</span>
            <span>
              Updated {new Date(record.updatedAt).toLocaleString("en-NG")}
            </span>
            {record.publicHref && (
              <Link
                href={record.publicHref}
                className="inline-flex items-center gap-1 font-bold text-brand-ink link-underline"
              >
                Public page
                <ExternalLink className="size-3" />
              </Link>
            )}
          </p>
        </div>
        <StatusBadge status={record.status} className="shrink-0" />
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <div className="space-y-6">
          <RecordEditor
            collectionId={definition.id}
            fields={definition.fields}
            record={record}
            canEdit={canPerform(editor, "author")}
          />

          {definition.hasBlocks && (
            <BlockComposer
              collectionId={definition.id}
              recordId={record.id}
              blocks={record.blocks ?? []}
              canEdit={canPerform(editor, "author")}
              // A platform document renders through the numbered policy layout,
              // which has nowhere to put a card grid - so it is offered only
              // the block that layout can actually draw.
              allowed={
                record.fields.layout === "policy"
                  ? ["policySection"]
                  : blockDefinitions
                      .filter((block) => block.type !== "policySection")
                      .map((block) => block.type)
              }
            />
          )}
        </div>

        <div className="space-y-6">
          <VisibilityPanel
            status={record.status}
            publicHref={record.publicHref}
            collectionLabel={definition.label}
            appearsOn={definition.appearsOn}
            siteBacked={siteBackedCollections.has(definition.id)}
          />

          <WorkflowControls
            collectionId={definition.id}
            recordId={record.id}
            status={record.status}
            canPublish={canPerform(editor, "editor")}
            // The standing pages are routes the site links to by name.
            // Deleting one leaves the links pointing at a 404, so the option
            // is not offered - archiving takes it off the site instead.
            canDelete={canPerform(editor, "admin") && !definition.fixed}
          />

          {definition.hasReviewMeta && (
            <section className="rounded-2xl border border-primary/25 bg-primary/8 p-5">
              <h2 className="text-caption text-brand-ink">
                Editorial standard
              </h2>
              <ul className="mt-3 space-y-2.5 text-[0.82rem] leading-relaxed text-muted-foreground">
                <li>
                  Mark a record <strong className="text-foreground">Reviewed</strong>{" "}
                  only when a named person has actually reviewed it.
                </li>
                <li>
                  Keep official legal text and plain-language explanation clearly
                  apart. Never present a summary as statutory text.
                </li>
                <li>
                  Cite only instruments you have verified. Do not invent
                  citations, judgments or regulatory deadlines.
                </li>
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
