import Link from "next/link";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  ExternalLink,
  Signpost,
} from "lucide-react";
import type { WorkflowStatus } from "@/lib/content/types";

/**
 * Says plainly whether this record is reachable by a reader.
 *
 * Three things have to be true for a record to be on the site, and until now
 * the admin showed only one of them. A published record in a collection the
 * site does not read yet looks identical to a live one, which is how an
 * editor ends up hunting for a video that was never going to appear.
 *
 * `appearsOn` answers the other half of that question. The record's own route
 * says where the record is; it does not say which part of the site lists it,
 * and an editor looking for a newly published video needs to be told it comes
 * out on Watch rather than left to work it out from a URL.
 */
export function VisibilityPanel({
  status,
  publicHref,
  collectionLabel,
  appearsOn,
  siteBacked,
}: {
  status: WorkflowStatus;
  publicHref?: string;
  collectionLabel: string;
  /** Where this collection surfaces on the public site, in the site's words. */
  appearsOn: string;
  /** Whether the public site reads this collection from the CMS at all. */
  siteBacked: boolean;
}) {
  const published = status === "published";

  const tone = !siteBacked
    ? "warning"
    : published
      ? "live"
      : "pending";

  const styles = {
    warning: "border-primary/40 bg-primary/10",
    live: "border-hairline bg-card",
    pending: "border-hairline bg-card",
  }[tone];

  return (
    <section className={`rounded-2xl border p-5 ${styles}`}>
      <h2 className="text-caption text-brand-ink">On the site</h2>

      {!siteBacked ? (
        <>
          <p className="mt-3 flex items-start gap-2 text-[0.85rem] leading-relaxed text-foreground">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand-ink" />
            <span>
              <strong>Not on the site yet.</strong> The public pages still
              render {collectionLabel.toLowerCase()} from the built-in content,
              so records added here are stored but not published to readers —
              whatever their status below.
            </span>
          </p>
          <p className="mt-2.5 pl-6 text-[0.78rem] leading-relaxed text-muted-foreground">
            Your work is saved and will appear once this collection is wired to
            the site.
          </p>
        </>
      ) : published ? (
        <p className="mt-3 flex items-start gap-2 text-[0.85rem] leading-relaxed text-foreground">
          <CircleCheck className="mt-0.5 size-4 shrink-0 text-brand-ink" />
          <span>
            <strong>Live.</strong> A reader can open this now
            {publicHref && (
              <>
                {" at "}
                <Link
                  href={publicHref}
                  className="font-bold text-brand-ink link-underline"
                >
                  {publicHref}
                  <ExternalLink className="ml-1 inline size-3" />
                </Link>
              </>
            )}
            .
          </span>
        </p>
      ) : (
        <p className="mt-3 flex items-start gap-2 text-[0.85rem] leading-relaxed text-foreground">
          <CircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>
            <strong>Not visible to readers.</strong> This record is{" "}
            {status === "draft" ? "a draft" : status}. Publish it below to put
            it on the site
            {publicHref && (
              <>
                {", at "}
                <span className="font-semibold text-foreground">
                  {publicHref}
                </span>
              </>
            )}
            .
          </span>
        </p>
      )}

      <p className="mt-4 flex items-start gap-2 border-t border-hairline pt-3.5 text-[0.78rem] leading-relaxed text-muted-foreground">
        <Signpost className="mt-0.5 size-3.5 shrink-0" />
        <span>
          <strong className="text-foreground">Where it shows: </strong>
          {appearsOn}
        </span>
      </p>
    </section>
  );
}
