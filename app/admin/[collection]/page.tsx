import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Plus } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { CollectionFilters } from "@/components/admin/collection-filters";
import { canPerform, getCurrentEditor } from "@/lib/cms/auth";
import { getCollection } from "@/lib/cms/collections";
import { getCms, type CmsListFilters } from "@/lib/cms/repository";
import type { WorkflowStatus } from "@/lib/content/types";

export const dynamic = "force-dynamic";

const STATUSES: (WorkflowStatus | "all")[] = [
  "all",
  "draft",
  "review",
  "published",
  "archived",
];

function parseStatus(value: string | undefined): WorkflowStatus | "all" {
  return STATUSES.includes(value as WorkflowStatus | "all")
    ? (value as WorkflowStatus | "all")
    : "all";
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps<"/admin/[collection]">) {
  const { collection: collectionId } = await params;
  const search = await searchParams;

  const definition = getCollection(collectionId);
  if (!definition) notFound();

  const statusParam = Array.isArray(search.status)
    ? search.status[0]
    : search.status;
  const queryParam = Array.isArray(search.q) ? search.q[0] : search.q;

  const filters: CmsListFilters = {
    status: parseStatus(statusParam),
    query: queryParam,
  };

  const [records, editor] = await Promise.all([
    getCms().list(definition.id, filters),
    getCurrentEditor(),
  ]);
  const canCreate = canPerform(editor, "author") && !definition.fixed;
  const isFiltered =
    (filters.status ?? "all") !== "all" || Boolean(filters.query?.trim());

  return (
    <div className="px-4 py-7 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-brand-ink">Content</p>
          <h1 className="text-h1 mt-3 text-foreground">{definition.label}</h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            {definition.description}
          </p>
          <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Where it shows: </strong>
            {definition.appearsOn}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <p className="text-[0.82rem] font-bold text-muted-foreground">
            {records.length} {records.length === 1 ? "record" : "records"}
          </p>
          {canCreate && (
            <Link
              href={`/admin/${definition.id}/new`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.85rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              New {definition.singular.toLowerCase()}
            </Link>
          )}
        </div>
      </header>

      <CollectionFilters
        collectionId={definition.id}
        status={filters.status ?? "all"}
        query={filters.query ?? ""}
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-card">
        {records.length === 0 ? (
          // An empty collection and an over-narrow filter are different
          // problems, and offering "clear filters" to someone who has not set
          // any is no help at all.
          <div className="px-5 py-16 text-center">
            <p className="text-[0.95rem] font-bold text-foreground">
              {isFiltered
                ? "Nothing matches these filters"
                : `No ${definition.label.toLowerCase()} yet`}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-[0.85rem] text-muted-foreground">
              {isFiltered
                ? "Try clearing the search, or switching the status filter back to all."
                : definition.fixed
                  ? "These pages are set up with the site. If none are listed, ask a developer to restore them."
                  : `Create the first ${definition.singular.toLowerCase()} to get started. It is saved as a draft.`}
            </p>
            {isFiltered ? (
              <Link
                href={`/admin/${definition.id}`}
                className="mt-5 inline-block text-[0.85rem] font-bold text-brand-ink link-underline"
              >
                Clear filters
              </Link>
            ) : (
              canCreate && (
                <Link
                  href={`/admin/${definition.id}/new`}
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.85rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Plus className="size-4" />
                  New {definition.singular.toLowerCase()}
                </Link>
              )
            )}
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {records.map((record) => (
              <li key={record.id} className="relative">
                <div className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted sm:items-center sm:gap-4 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[0.95rem] font-bold text-foreground">
                      <Link
                        href={`/admin/${definition.id}/${record.id}`}
                        className="line-clamp-2 after:absolute after:inset-0 sm:truncate"
                      >
                        {record.title}
                      </Link>
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] text-muted-foreground">
                      {record.subtitle && <span>{record.subtitle}</span>}
                      {record.lastReviewed && (
                        <span>Reviewed {record.lastReviewed}</span>
                      )}
                      {record.reviewedBy && <span>by {record.reviewedBy}</span>}
                    </p>
                    {/* On a phone the badge sits under the title instead of
                        competing with it for the same row. */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 sm:hidden">
                      <StatusBadge status={record.status} />
                      {record.publicHref && record.status === "published" && (
                        <Link
                          href={record.publicHref}
                          className="relative z-10 inline-flex items-center gap-1 text-[0.75rem] font-bold text-muted-foreground"
                        >
                          View
                          <ExternalLink className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {record.publicHref && record.status === "published" && (
                    <Link
                      href={record.publicHref}
                      className="relative z-10 hidden shrink-0 items-center gap-1 text-[0.75rem] font-bold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    >
                      View
                      <ExternalLink className="size-3" />
                    </Link>
                  )}
                  <span className="hidden shrink-0 sm:block">
                    <StatusBadge status={record.status} />
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground sm:mt-0" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
