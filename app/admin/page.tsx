import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeedPanel } from "@/components/admin/seed-panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { collections, getCollection, siteSections } from "@/lib/cms/collections";
import { getCms, isCmsPersistent } from "@/lib/cms/repository";
import { canPerform, getCurrentEditor } from "@/lib/cms/auth";
import { pendingQuestions } from "@/lib/legal-help/questions";

export default async function AdminDashboard() {
  const cms = getCms();
  const [editor, counts, queue, activity] = await Promise.all([
    getCurrentEditor(),
    cms.listCollectionsSummary(),
    cms.reviewQueue(6),
    cms.recentActivity(8),
  ]);
  const submissions = pendingQuestions();

  const totals = counts.reduce(
    (sum, entry) => ({
      total: sum.total + entry.total,
      published: sum.published + entry.published,
      pending: sum.pending + entry.draft + entry.review,
      archived: sum.archived + entry.archived,
    }),
    { total: 0, published: 0, pending: 0, archived: 0 }
  );

  return (
    <div className="px-4 py-7 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <header>
        <p className="text-eyebrow text-brand-ink">Dashboard</p>
        <h1 className="text-h1 mt-3 text-foreground">
          {editor ? `Good to see you, ${editor.name.split(" ")[0]}` : "Editorial"}
        </h1>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Everything published on Law Awareness TV is managed here. Legal content
          moves through draft, review and published — nothing reaches readers
          without passing through review.
        </p>
      </header>

      <div className="mt-8 empty:hidden">
        <SeedPanel
          persistent={isCmsPersistent()}
          // An empty database and an unreachable one look the same from here,
          // so the count is the test: no records anywhere means nothing to
          // work on, whatever the reason.
          seeded={totals.total > 0}
          canSeed={canPerform(editor, "admin")}
        />
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total records", value: totals.total },
          { label: "Published", value: totals.published },
          { label: "Awaiting review", value: totals.pending },
          { label: "Archived", value: totals.archived },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-hairline bg-card p-5"
          >
            <dt className="text-[0.78rem] font-bold text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="mt-2 text-[1.8rem] leading-none font-extrabold text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section>
          <h2 className="text-h3 text-foreground">Editorial queue</h2>
          <p className="mt-1.5 text-[0.85rem] text-muted-foreground">
            Records in draft or review, most recently touched first.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-hairline bg-card">
            {queue.length === 0 ? (
              <p className="px-4 py-10 text-center sm:px-5 text-[0.88rem] text-muted-foreground">
                Nothing is waiting. Every record is published or archived.
              </p>
            ) : (
              <ul className="divide-y divide-hairline">
                {queue.map((record) => {
                  const definition = getCollection(record.collection);
                  return (
                    <li key={`${record.collection}-${record.id}`}>
                      <Link
                        href={`/admin/${record.collection}/${record.id}`}
                        className="group flex items-center gap-4 px-4 py-4 transition-colors sm:px-5 hover:bg-muted"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.92rem] font-bold text-foreground">
                            {record.title}
                          </span>
                          <span className="text-[0.76rem] text-muted-foreground">
                            {definition?.singular ?? record.collection}
                          </span>
                        </span>
                        <StatusBadge status={record.status} />
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-h3 text-foreground">Recent activity</h2>
          <p className="mt-1.5 text-[0.85rem] text-muted-foreground">
            An audit trail of every change made in this session.
          </p>
          <div className="mt-5 rounded-2xl border border-hairline bg-card p-5">
            {activity.length === 0 ? (
              <p className="py-6 text-center text-[0.88rem] text-muted-foreground">
                No changes yet.
              </p>
            ) : (
              <ol className="space-y-4">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.85rem] leading-snug text-foreground">
                        <span className="font-bold">{entry.actor}</span>{" "}
                        {entry.action}{" "}
                        <span className="font-semibold">{entry.title}</span>
                      </span>
                      <time
                        dateTime={entry.at}
                        className="text-[0.74rem] text-muted-foreground"
                      >
                        {new Date(entry.at).toLocaleString("en-NG")}
                      </time>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>

      {/* Reader submissions. These are not records yet: publishing one is an
          editorial act that rewrites it for privacy and attaches an answer. */}
      <section className="mt-10">
        <h2 className="text-h3 text-foreground">Question moderation</h2>
        <p className="mt-1.5 max-w-2xl text-[0.85rem] leading-relaxed text-muted-foreground">
          Questions submitted through Ask a Question. Nothing here is public,
          and nothing becomes public by itself — publishing one means rewriting
          it for privacy, writing a general answer, and creating a record in
          Public questions. Submissions live in the running server and do not
          survive a restart.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-hairline bg-card">
          {submissions.length === 0 ? (
            <p className="px-4 py-10 text-center sm:px-5 text-[0.88rem] text-muted-foreground">
              No questions are waiting.
            </p>
          ) : (
            <ul className="divide-y divide-hairline">
              {submissions.map((submission) => (
                <li key={submission.reference} className="px-4 py-4 sm:px-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[0.75rem] font-extrabold text-brand-ink">
                      {submission.reference}
                    </span>
                    <span className="text-[0.75rem] font-semibold text-muted-foreground">
                      {submission.topic} · {submission.state}
                    </span>
                    <time
                      dateTime={submission.submittedAt}
                      className="text-[0.74rem] text-muted-foreground"
                    >
                      {new Date(submission.submittedAt).toLocaleString("en-NG")}
                    </time>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-foreground">
                    {submission.question}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Laid out as the site is laid out. Someone who has just been asked to
          "put the new podcast episode up" should find it by recognising the
          part of the site it belongs to, without knowing what the CMS calls
          its content types. */}
      <section className="mt-10">
        <h2 className="text-h3 text-foreground">Everything you can edit</h2>
        <p className="mt-1.5 max-w-2xl text-[0.85rem] leading-relaxed text-muted-foreground">
          Grouped by the part of the site each one appears on, in the order the
          site&rsquo;s own menu runs.
        </p>

        <div className="mt-6 space-y-8">
          {siteSections.map((section) => {
            const inSection = collections.filter(
              (collection) => collection.section === section.id
            );
            if (inSection.length === 0) return null;

            return (
              <div key={section.id}>
                <h3 className="text-caption border-b border-hairline pb-2.5 text-brand-ink">
                  {section.label}
                </h3>
                <p className="mt-2.5 text-[0.83rem] text-muted-foreground">
                  {section.description}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {inSection.map((collection) => {
                    const summary = counts.find(
                      (entry) => entry.collection === collection.id
                    );
                    return (
                      <Link
                        key={collection.id}
                        href={`/admin/${collection.id}`}
                        className="group rounded-2xl border border-hairline bg-card p-5 transition-colors hover:border-primary/45"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-h4 text-foreground">
                            {collection.label}
                          </h4>
                          <span className="text-[0.75rem] font-bold text-muted-foreground">
                            {summary?.total ?? 0}
                          </span>
                        </div>
                        <p className="mt-2 text-[0.83rem] leading-relaxed text-muted-foreground">
                          {collection.description}
                        </p>
                        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.74rem] font-semibold text-muted-foreground">
                          <span>{summary?.published ?? 0} published</span>
                          <span>{summary?.review ?? 0} in review</span>
                          <span>{summary?.draft ?? 0} draft</span>
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
