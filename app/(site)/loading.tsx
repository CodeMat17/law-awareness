/** Skeleton that mirrors the homepage rhythm so nothing shifts on arrival. */
export default function Loading() {
  return (
    <div className="rail py-16 lg:py-24" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading content</span>
      <div className="max-w-2xl space-y-4">
        <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-12 w-4/5 animate-pulse rounded-xl bg-muted" />
        <div className="h-5 w-3/5 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-hairline bg-muted"
          />
        ))}
      </div>
    </div>
  );
}
