# Architecture

Phases 1 to 6 of `LAW_BUILD_SPEC.md`: the premium foundation, the editorial CMS,
the legal-knowledge system, the Business & Enterprise section, the media
network, Legal Help, and the professional/advanced layer — case law, the
Constitution Explorer, law versioning, and accounts.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (no `any`) ·
Tailwind CSS v4 · shadcn/ui on `@base-ui/react` · Framer Motion · next-themes ·
Lucide · Google Nunito only.

## Colour architecture (70 / 20 / 10)

Defined once in `app/globals.css`, for both themes.

| Share | Role | Tokens |
| --- | --- | --- |
| 70% | Foundation — page and card surfaces, body text | `--background`, `--foreground`, `--card`, `--popover` |
| 20% | Support — secondary surfaces, nav, borders, muted text | `--secondary`, `--muted`, `--surface`, `--forest`, `--border`, `--hairline` |
| 10% | Signature brass — CTAs, active nav, links, live indicators, key statistics, focus rings | `--primary`, `--brand`, `--brand-ink`, `--ring` |

Light is a warm bone paper over deep green-black ink; dark inverts to a deep
green-black ground. `--brand-ink` is the brass tuned for **text on the page
background** — use it wherever brass is a foreground colour, and `--primary`
wherever brass is a surface.

No component hard-codes a text colour. The only place a colour literal appears
outside `globals.css` is `viewport.themeColor` in `app/layout.tsx`.

## Typography

Nunito only, loaded through `next/font/google` as `--font-nunito` and mapped to
`--font-sans`, `--font-heading` and `--font-mono`. The editorial scale
(`.text-display`, `.text-h1`…`.text-caption`, `.text-eyebrow`) is fluid and
defined in `globals.css`, so headings never need per-component size classes.

## Motion

`lib/motion.ts` holds the whole vocabulary: three speeds (fast micro,
medium content, cinematic hero), shared easing, and the reveal/stagger
variants. `components/site/reveal.tsx` wraps scroll-triggered entrances.
Every animated component calls `useReducedMotion()`, and `globals.css` neutralises
animation globally under `prefers-reduced-motion`.

## Data seam

```
app/(site)/*      →  lib/content/repository.ts  →  lib/content/data.ts
                                                 →  lib/content/knowledge.ts
                                                 →  lib/content/business.ts
                                                 →  lib/content/compliance.ts
                                                 →  lib/content/enterprise.ts
                                                 →  lib/content/media.ts
                                                 →  lib/content/legal-help.ts
app/admin/*       →  lib/cms/repository.ts      →  (same seed, mutable)
                     lib/cms/auth.ts
```

One seam is not a repository: Ask a Question writes through
`lib/legal-help/actions.ts` into `lib/legal-help/questions.ts`, a moderation
queue that no public page reads.

No page, section or component imports content data directly; everything goes
through `getContent()` or `getCms()`. `lib/content/types.ts` is the contract.

### Wiring Convex

1. Mirror `lib/content/types.ts` in the Convex schema. `WorkflowStatus` and
   `ReviewStatus` map to union fields; `EditorialMeta` is an embedded object.
2. Add `ConvexContentRepository implements ContentRepository` and
   `ConvexCmsRepository implements CmsRepository`.
3. Return them from `getContent()` and `getCms()` when
   `NEXT_PUBLIC_CONVEX_URL` is set. Nothing else changes.
4. Server actions in `lib/cms/actions.ts` keep their validation; only the
   repository call inside each one is swapped for a Convex mutation.

### Authentication and authorization (Clerk + Convex)

Clerk answers *who is this*; Convex answers *what may they do*. A Clerk session
on its own grants nothing — the role is a row in the Convex `users` table that
an admin has to write. A visitor who signs up on the public site therefore
cannot reach the CMS by signing up alone.

Roles are `viewer < author < editor < admin`. Publishing and archiving require
`editor`; deleting and role administration require `admin`.

There are three layers, and only the last is a security boundary:

| Layer | File | Enforces |
| --- | --- | --- |
| Proxy | `proxy.ts` | A session exists for `/admin(.*)`. No role check — a proxy cannot query Convex. |
| Render | `app/admin/layout.tsx` | Redirects: no session → `/sign-in`, session but no role → `/no-access`. |
| Data | `convex/model/roles.ts` | `requireRole(ctx, minimum)` inside every privileged Convex function. |

The first two produce good redirects; a client can call Convex directly, so the
third is the one that actually protects data. Every privileged Convex function
must call `requireRole` — it throws rather than returning null, so a forgotten
check fails closed.

Next.js 16 renamed the `middleware` file convention to `proxy`. Clerk's helper
is still `clerkMiddleware()`; only the file and export names changed.

`lib/cms/auth.ts` is the Next-side seam. `getEditorSession()` resolves the Clerk
session, exchanges it for a Convex token from the JWT template named `convex`,
and reads `api.users.current`. It is wrapped in React `cache`, so the admin
layout and the page beneath it share one round trip. `getCurrentEditor()`,
`requireRole()` and `canPerform()` keep their original signatures, so every
admin page and server action already routes through them unchanged.

Identity is mirrored into Convex by `api.users.store`, called from the client on
sign-in (`components/convex-client-provider.tsx`) rather than by a Clerk
webhook — no public endpoint, no signing secret, and it runs with the user's own
token, so it can only ever write that user's own row. It never writes `role`.

It runs once per browsing session rather than once per page load, keyed by the
Clerk subject in `sessionStorage` — a write on every load of every signed-in
reader was the most frequently called function in the application, and the
second call in a session almost never changes anything. A profile edited in
Clerk mid-session lands on the reader's next session.

`users.setRole` refuses to demote you out of your own admin role, and refuses to
remove the last admin, so the CMS cannot be locked out of itself.

### Read cost

Convex bills documents read, so a function that reads more than it returns is
the thing to watch. Four rules hold the line, and new functions should follow
them:

1. **Resolve, don't scan.** A record addressed by route is read through
   `by_collection_href` (`content.publishedByHref`), not by fetching the
   collection and searching it in memory. `updateFields` keeps a page's
   `publicHref` equal to its `path` field so that index stays true.
2. **Project what lists render.** `listByCollection` and `reviewQueue` return
   `CmsRecordSummary` — titles, statuses and review metadata, no `fields` or
   `blocks`. The body of a record crosses the wire when one is opened, through
   `getRecord`.
3. **Bound the queue.** `reviewQueue` takes `limit` from each status through
   `by_status_updated` in descending order, so it costs twice what it shows
   however much unpublished work exists.
4. **Count on write.** The dashboard's per-collection counts come from
   `contentCounters`, maintained by `create`, `setStatus`, `remove` and `seed`.
   `content.recountCollections` rebuilds them from the records; a deployment
   with no counter rows at all falls back to counting directly, so counts are
   never silently wrong. Seeding finalises with a rebuild — re-running Seed on
   an already-seeded deployment is the way to populate counters for the first
   time.

On the public side every Convex read is wrapped in `unstable_cache` tagged with
`contentTag(collection)`, which `revalidateFor` fires on publish. An uncached
public read makes every render of that route a fresh database read.

### First-run setup

1. `npx convex dev` — creates the deployment and regenerates `convex/_generated`
   (commit it; the checked-in copy is a loosely typed placeholder until this
   runs, because codegen could not reach a deployment).
2. In the Clerk dashboard, create a JWT template named **convex** with the
   default claims.
3. `npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<slug>.clerk.accounts.dev`
   — `convex/auth.config.ts` is evaluated by Convex, so this must be set on the
   Convex deployment, not only in `.env.local`.
4. `npx convex env set CMS_BOOTSTRAP_ADMIN_EMAILS you@example.com` — grants
   `admin` to those addresses the first time they sign in. Without it there is
   no way to create the first admin, because granting a role already requires
   one. It applies only at row creation, so it cannot re-escalate an account an
   admin has deliberately demoted.
5. Sign in, then manage everyone else at `/admin/users`.

## CMS

The admin UI is generic. `lib/cms/collections.ts` declares each collection and
its fields; `app/admin/[collection]` and `app/admin/[collection]/[id]` render
lists and edit forms from those declarations. Adding a content type to the CMS
means adding a definition and a seed mapper — not new screens.

Editorial guarantees enforced in `lib/cms/actions.ts`:

- Required fields, number fields and select options are validated server-side.
- A record cannot be marked **Reviewed** without a named reviewer.
- Only `published` records are returned by the public repository.

Writes are held in a process-local store (hung off `globalThis` so hot reload
does not lose them) and reset on restart. The banner in the admin shell says so.

## Editorial rules encoded in the content

`lib/content/data.ts` and `lib/content/knowledge.ts` reference only real,
well-known Nigerian instruments —
the 1999 Constitution (as amended), CAMA 2020, the Nigeria Data Protection Act
2023, the FCCPA 2018, the Cybercrimes Act 2015, ACJA 2015, the Labour Act, the
Land Use Act 1978 and the Copyright Act 2022 — described in general terms. No
judgment, citation, credential or regulatory deadline is invented. Everything
carries `review: "educational"`.

## SEO

Metadata API in `app/layout.tsx` with per-page overrides, Organization JSON-LD,
`app/sitemap.ts`, `app/robots.ts` (which excludes `/admin`), and the
file-convention OG image at `app/opengraph-image.jpg` with alt text alongside.

## Routes

- `/` — homepage (static)
- `/know-the-law` — library hub (static)
- `/know-the-law/[category]` — subject area (SSG over every category)
- `/know-the-law/[category]/[slug]` — law explainer (SSG). A category/slug
  mismatch is a 404 rather than a page contradicting its own breadcrumb
- `/your-rights`, `/your-rights/[slug]` — situation-first rights guides (SSG)
- `/stay-safe`, `/stay-safe/[slug]` — prevention guides, including the
  Before You Sign series (SSG)
- `/glossary`, `/glossary/[term]` — Law in Plain Language (SSG)
- `/business` — Business & Enterprise hub (static)
- `/business/guides`, `/business/guides/[slug]` — Before You Do This (SSG)
- `/business/health-check` — the legal health check (static shell, client tool)
- `/business/compliance`, `/business/compliance/[slug]` — Compliance Centre and
  the "What applies to my company?" profiler (SSG)
- `/business/regulatory-watch` — Regulatory Watch (dynamic: it reads `?topic=`)
- `/business/regulatory-watch/[slug]` — one update (SSG)
- `/business/legal-calendar` — the compliance calendar (static)
- `/business/contracts`, `/business/contracts/[slug]` — Contract Knowledge
  Centre (SSG)
- `/business/industries`, `/business/industries/[slug]` — industry hubs (SSG)
- `/business/ceo`, `/business/ceo/[slug]` — Law for CEOs (SSG)
- `/watch`, `/watch/[slug]` — the video hub and video pages (SSG)
- `/watch/series/[slug]` — one programme (SSG). The static `series` segment
  wins over `[slug]`, so no media item may take the slug `series`
- `/listen`, `/listen/[slug]` — the podcast network and episode pages (SSG)
- `/listen/series/[slug]` — one show, with its seasons (SSG)
- `/live` — the schedule: on air, upcoming, archive (static)
- `/live/[slug]` — one session, before and after it airs (SSG)
- `/search` — full search with filters, highlighting and recent searches
  (dynamic: it reads `?q=`)
- `/admin`, `/admin/[collection]`, `/admin/[collection]/[id]` — CMS,
  `force-dynamic`, never indexed

Every detail route sets `dynamicParams = false`. Metadata streaming means a
`notFound()` reached after the response has begun streaming returns 200 with
not-found UI - a soft 404. Since all published records are prerendered, letting
the router reject unknown params instead gives a real 404 status. Revisit this
when content is read from Convex at request time.

- `/legal-help` — the Legal Help hub (static)
- `/legal-help/problem` — the situation chooser (static). The static `problem`
  segment owns the pathways, so no pathway can collide with `legal-aid`
- `/legal-help/problem/[slug]` — one pathway (SSG)
- `/legal-help/legal-aid` — the referral architecture, one anchored block per
  route (static). Referral references resolve to `#slug` on this page
- `/lawyers`, `/lawyers/[slug]` — the directory and profiles (SSG). A listing
  that is not `verified` sets `robots: noindex` on its own page
- `/ask`, `/ask/[slug]` — the moderated public Q&A and answered questions (SSG).
  `/ask` is static and posts to a server action

- `/cases` — the Case Law Explorer, filterable on court, subject, issue and
  year (static)
- `/cases/[slug]` — one decided case (SSG)
- `/constitution` — the Constitution Explorer: section search plus the chapter
  index (static)
- `/constitution/[chapter]` — one chapter, section by section (SSG over all
  eight). The segment is `chapter-<numeral>`; `parseChapterSlug()` in
  `components/site/constitution.tsx` is the only place that shape is decoded
- `/know-the-law/amendments` — the amendment tracker. The static segment wins
  over `[category]`, so no law category may take the slug `amendments`
- `/account` — saved library and quiz history (static shell, client data)
- `/account/notifications` — followed topics, the alert feed and notification
  preferences (static shell, client data)
- `/business-account` — organization profile, team, monitored topics and
  shared resources (static shell, client data)

The three account routes are deliberately NOT protected in `proxy.ts`. They are
readable pages that are simply empty without a session, and the protection that
matters is in Convex, where every account function keys on the caller's own
Clerk subject and never accepts an owner id as an argument. They all set
`robots: { index: false }`.

## Professional and advanced (Phase 6)

### Case law: the type has no citation field

`CaseRecord` in `lib/content/types.ts` deliberately omits `citation` and
`judge`. Spec section 29 lists both, and both are declined on purpose: a
law-report volume and page, and the composition of a panel, are exactly the
details that cannot be reproduced from memory without risking a reference that
leads nowhere — and a plausible citation that leads nowhere is worse than no
citation at all. `whereToFindIt` tells the reader how to locate the reported
judgment instead.

The constraint is enforced by the *shape of the type*, not by a convention, so a
future editor cannot add one carelessly. The explorer says so in the UI as well:
`CaseSummaryNotice` appears on the hub and on every case page. Adding
citations later is a legitimate change — it needs a verification process behind
it, and a `ReviewStatus` of `reviewed` with a named human, not a code change.

Every record also carries `doesNotSettle`. A case summary without it is how a
decision ends up cited for something it never decided.

### Constitution Explorer: two panes, not a disclaimer

`ConstitutionSection` has no `officialText` field either. `SectionPanel`
renders every section as a labelled split — what the section is and where its
text lives on one side, our plain-language explanation on the other — so spec
section 30's requirement that the distinction "remain obvious" is structural
rather than something a writer has to remember.

### Law versioning: years, not commencement dates

`LawVersion.effective` is a year. A precise commencement date is easy to state
confidently and easy to get wrong, and a wrong one will be relied on.
`getCurrentVersion()` returns `null` rather than falling back to the first
version, so a record that does not say what is in force cannot be made to say
it. Superseded versions are never removed — a reader holding an old copy of an
Act needs to see where it sits.

### Accounts: what is stored, and what is not

| Table | Holds |
| --- | --- |
| `bookmarks` | Saved items, denormalised so a bookmark survives the target being unpublished or renamed |
| `topicFollows` | Followed alert topics, personal or organization-scoped |
| `notificationPrefs` | Channel and category switches. No row means the defaults in `convex/model/preferences.ts` |
| `notificationReads` | Read state only |
| `quizAttempts` | One row per finished attempt, never overwritten |
| `organizations`, `orgMembers` | Business accounts and their teams |

**There is no notifications table.** The feed is derived at request time by
`buildNotificationFeed()` in `lib/content/notifications.ts`, from published
content. That was chosen over writing a row per user per event so that an alert
can never survive the correction, retitling or withdrawal of the thing it was
about — on a platform about the law, that is the failure that matters. The cost
is that the feed cannot reach further back than the content window.

Filtering by follows and preferences happens on the client, so the server builds
one feed for everyone and never has to be told who is asking.

Defaults: in-app on, **email off**, newsletter off. Signing in to read about the
law is not consent to be mailed.

Organization queries return an empty result to a non-member rather than
throwing, so a wrong id reveals nothing — not even whether the organization
exists.

## Legal-knowledge system (Phase 2)

### Where the content lives

`lib/content/knowledge.ts` holds the categories, law entries, rights guides,
Stay Safe guides and glossary; `lib/content/data.ts` re-exports them, so every
existing importer — the CMS included — is untouched. The split is about file
size, nothing else.

### Official text vs plain language

The spec requires the two to be visibly separate. The platform **does not
reproduce or invent statutory wording**, so `ProvisionSplit`
(`components/site/knowledge.tsx`) renders each provision as two panes: the left
names the instrument and citation where the official text lives, the right is
labelled as our explanation. A summary can never be mistaken for the law, and no
wording has to be fabricated to fill a pane. Section numbers appear only where
they are long-settled and unambiguous (the Constitution, Land Use Act ss. 1 and
22); elsewhere a provision is cited by instrument and topic.

### Derived rather than stored

- `LawCategory.entryCount` is computed in the repository from published
  entries, so a category can never claim more explainers than exist. Areas with
  none render as *In preparation* — a real empty state, not a hidden route.
- `featuredRights` is derived from `rightGuides`, so a card and its page cannot
  drift apart.

### The content graph

Records carry `RelatedRefs` — slugs only, so the CMS can persist them as plain
strings. `getRelated()` resolves them into `RelatedItem[]`, dropping anything
unpublished or unresolved rather than rendering a dead link. Every detail page
ends with `RelatedContent`, which is how a law entry reaches its rights guide,
business guide, article, media item and glossary terms.

### Search

`getSearchDocuments()` builds one index over every published type. The header
overlay (`buildSearchIndex()`) projects the same documents down to title, group
and href, so the two can never disagree. `/search` adds type filters, match
highlighting and recent searches — the last kept in `localStorage` and read
through `useSyncExternalStore`, which keeps the server and hydrated renders
consistent without a setState-in-effect cascade.

### Hub filtering without shipping cards to the client

`FilterGrid` is the only client component in the hubs. The page renders each
card as a server component and passes it as a `node`; `FilterGrid` decides which
nodes are shown. Filtering is instant and no card code ships as client JS.

---

## Project decisions and conventions

### Decisions already settled — do not re-open

| Decision | Value |
| --- | --- |
| Palette | Deep green + brass. 70/20/10 is an **application ratio** across surfaces and text, not three brand colours |
| Content policy | Real, well-known Nigerian instruments only, described generally, badged `educational`. No invented citations, judgments, deadlines or credentials |
| Official text | Never reproduced or invented — cited, and linked where a source URL exists |
| Auth + data | Clerk + Convex, **not to be applied until explicitly confirmed**. Seams are ready |
| Font | Nunito only |
| Themes | Light and dark only |

### Hero background — settled after three iterations

Two approaches were built and rejected as looking common: (1) a ledger grid with
blurred colour glows, and (2) an animated SVG line system of sweeping curves,
travelling beams and pulsing nodes.

What landed is **architectural depth** (`components/site/hero-backdrop.tsx`): one
monumental brass arc, two concentric hairlines, a single slow travelling
highlight, deep radial vignetting, and layered translucent panels.

**Do not reintroduce grids, meshes, particle fields or scattered nodes into the
hero.** `bg-ledger` remains in use elsewhere and is fine there.

### Page chrome and horizontal containment

The update stripe and header are **fixed**, not sticky, and live in one wrapper
in `app/(site)/layout.tsx`. Sticky depended on the whole ancestor chain staying
free of scroll containers, clipping and transforms, and on the document never
growing wider than the viewport; a page that overflows horizontally drags the
pinned bars out of alignment. Fixed positioning against the viewport has none of
those dependencies.

`--chrome-h` in `globals.css` is the single source of truth for the height of
that chrome (it grows at `lg` with the header). The layout spacer, the sticky
asides on knowledge pages, `scroll-padding-top` on `html` and the `scroll-mt` on
anchored blocks all derive from it, so nothing can drift out of sync with the
bars.

Horizontal overflow is contained structurally rather than page by page:
`main`, `Section` and the footer all set `overflow-x: clip` (clip, never hidden -
hidden creates a scroll container and breaks sticky on mobile engines), the hero
sets `overflow-clip`, and grid children that can be squeezed carry `min-w-0`.
No page can widen the document, so the viewport cannot pan sideways into empty
background.

### Three implementation notes worth keeping

- Tailwind v4 compiles `translate-x-*` to the standalone CSS `translate`
  property, so panel offsets do not collide with Framer Motion's
  `transform`-based animations. This would break on v3.
- `next dev` refuses to start a second instance. A dev server is usually already
  running on **port 3001**.
- ESLint's `react-hooks/set-state-in-effect` rule is on. Reading browser storage
  on mount belongs in `useSyncExternalStore`, not in an effect.

## Business & Enterprise (Phase 3)

Spec sections 17–27. The section is first-class, as the spec requires: it has its
own hub, its own content types, its own CMS collections, and its own place in the
search index and the content graph.

### Where the content lives

Split by subject, and for file size:

| File | Holds |
| --- | --- |
| `lib/content/business.ts` | The 13 business areas, and the Before You Do This guides |
| `lib/content/compliance.ts` | Compliance Centre topics, health-check questions, profiler questions, alert topics, calendar entries |
| `lib/content/enterprise.ts` | Regulatory Watch, contract types, industry hubs, CEO briefings |
| `lib/content/business-meta.ts` | The one editorial stamp every Phase 3 record carries |

`lib/content/data.ts` re-exports all of it, so the CMS and every existing
importer keep a single import surface.

### One spine, three views

`ComplianceArea` ids (`ca-1`…`ca-12`, in `data.ts`) are the spine. A
`ComplianceTopic`, a `HealthCheckQuestion` and a `CalendarEntry` each carry an
`areaId` pointing at one. That is why the Compliance Centre, the health check and
the calendar cannot drift apart — they are three views of the same twelve areas,
not three hand-maintained lists.

The profiler works the same way: each `ProfileOption` names the area ids it makes
relevant, and the repository turns those into topics.

### Editorial rules specific to this section

These are the constraints the spec imposes, and where each is enforced:

- **No invented deadlines.** Spec section 24 forbids hard-coding legal deadlines
  without a maintained source and review process. So `CalendarEntry` has no date
  field at all: it carries a `cadence` and a `trigger`, and
  `/business/legal-calendar` opens by explaining why, rather than burying it.
  A date that is wrong is more dangerous than one the reader knows to check.
- **Reporting separated from explanation.** Spec section 22. `RegulatoryUpdate`
  stores `report` and `explanation` as separate fields, and
  `ReportAndExplanation` renders them as two labelled panes. The structure makes
  the separation impossible to lose in editing.
- **No contract templates.** Spec section 25. The Contract Knowledge Centre
  explains what a clause does and what to check in the wording. There is no model
  wording anywhere in it, and `ClauseTable` carries that disclaimer at the point
  of use, not only in the footer.
- **The health check is not an opinion.** Spec section 19. It produces a
  readiness picture, says so on the question screen, beside the result and under
  it, and never tells a reader that an obligation does or does not apply.
  "Not sure" scores as high attention: not knowing *is* the exposure.
- **The profiler is a reading list.** Spec section 18. It surfaces topics
  commonly relevant to a business of the shape described, and states that
  obligations depend on circumstances and need professional verification.

Instruments named are real and well-known — CAMA 2020, the NDP Act 2023, the
FCCPA 2018, the Labour Act, the Pension Reform Act 2014, the Employee's
Compensation Act 2010, the Copyright Act 2022, the Trade Marks Act, the
Cybercrimes Act 2015, the Land Use Act 1978, the Arbitration and Mediation Act
2023, the Money Laundering (Prevention and Prohibition) Act 2022 and the Nigeria
Startup Act 2022 — and each is described only in general terms. No threshold,
fee, penalty figure or commencement date appears anywhere in the seed.

### Derived rather than stored

The Phase 2 principle, continued:

- `BusinessGuide.checklistCount` is derived from `checklist.length` in
  `business.ts`, so a card cannot promise a different number of steps than the
  page delivers.
- Hub headings that state a count read it from the data (`areas.length`,
  `topics.length`, `contracts.length`), so no headline can outrun the content.
  The homepage health-check preview was changed to do the same — it previously
  hard-coded "Fifteen areas" against twelve.
- Industry hubs resolve their compliance topics from slugs and drop anything
  unresolved, exactly as `getRelated()` does.

### Client components

Three, and no more. `HealthCheck` and `BusinessProfiler` are interactive by
nature; `FilterGrid` was already there and still receives server-rendered cards
as nodes. Both new components take a **projection** of the content rather than
the records themselves — the health check receives `{areaId, slug, title,
summary}` per topic, so twelve full compliance topics never reach the browser.

Neither stores or transmits anything. Answers live in component state for the
session and are gone on reload; saved assessments belong with accounts in Phase 6.

### The content graph

`RelatedRefs` gained `compliance`, `contracts`, `industries`, `briefings` and
`updates`; `RelatedKind` and `SearchType` gained the matching members.
`getRelated()` resolves them the same way as Phase 2 — unresolved or unpublished
references are dropped rather than rendered as dead links — and
`getSearchDocuments()` indexes all five new types, so business content is
searchable on arrival rather than as a follow-up.

### CMS

Five collections added (`compliance-topics`, `contracts`, `industries`,
`ceo-briefings`, `regulatory-updates`) as declarations plus seed mappers, with no
new admin screens — which is the property the generic CMS was built for.

Two field-level notes carry editorial intent into the admin UI: the
`regulatory-updates` "when it takes effect" field tells editors to describe the
position in words rather than state an unverified commencement date, and
`compliance-topics.areaId` explains that it is the spine shared with the health
check and the calendar.

---

## Where the build stands

**Phase 1 is complete**: design system, breaking-updates ticker, header with
desktop section panels and full-screen mobile menu, search overlay (⌘K), hero,
the full homepage flow, footer, loading/error/404 states, sitemap, robots and OG
metadata. Plus the editorial CMS at `/admin`, which was added on top of Phase 1.

**Phase 2 is complete**: Know the Law hub, category pages and law explainers
with the official-text / plain-language split; Your Rights hub and guides; Stay
Safe with the Before You Sign series; the glossary; `/search`; the related
content graph; and source, review and amendment metadata on every knowledge
page. `app/sitemap.ts` reads detail routes from the repository.

**Phase 3 is complete**: the business hub, the 13 subsections, Before You Do This
guides, the Legal Health Check, the Compliance Centre with the "What applies to
my company?" profiler, Regulatory Watch with topic filtering and law-change alert
topics, the business legal calendar, the Contract Knowledge Centre, 12 industry
hubs and Law for CEOs — plus five new CMS collections, sitemap and search
coverage, and the content graph extended across all of it.

**Phase 6 is complete**: the Case Law Explorer with 18 decided cases filterable
on four axes and the court ladder; the Constitution Explorer with 39 sections
across eight chapter pages; law versioning and the amendment tracker over nine
instruments; regulatory alerts you can actually follow; user accounts with a
saved library, quiz history and notification preferences; and business accounts
with teams, monitored topics and shared resources — plus two new CMS
collections (`cases`, `law-histories`), sitemap and search coverage, and both
new content types wired into the graph in each direction.

**Phase 4 is complete**: the Watch hub with programmes and a featured film, the
Listen podcast network with shows and seasons, the Live schedule with on-air,
upcoming and archived states, video, episode, series and event pages, chapters
and written records throughout, a real player that mounts when a record carries
a source, plus a `media-series` CMS collection, sitemap and search coverage, and
media woven into the content graph in both directions.

**Phase 5 is complete**: the Legal Help hub, 13 "I have a legal problem"
pathways with their triage, the referral architecture across 7 real
institutions, the lawyer directory with six-axis filtering and profile pages,
and the moderated public Q&A with a working submission action — plus four new
CMS collections, a moderation queue surfaced in the admin, sitemap and search
coverage, and legal help woven into the content graph in both directions.

`yarn build`, `yarn lint` and `tsc --noEmit` are all clean.

## Media (Phase 4)

Spec sections 32, 33 and 34.

### Where the content lives

`lib/content/media.ts`, re-exported through `data.ts` like every other phase.
It holds six series, six videos, five podcast episodes and three live events.

### Two axes, not one

`MediaKind` (`video` / `podcast` / `live`) decides **which hub and route** an
item lives on. `MediaFormat` (explainer, interview, documentary, webinar, short,
broadcast, episode, audio explainer, live session) describes **what it is**.
Keeping them apart is why a documentary and a four-minute short share `/watch`
without the route having to know the difference, and why adding a genre never
touches routing.

`MediaDetail extends MediaItem`, so `mediaItems` is a widening of the same
records rather than a second copy — the homepage and the CMS were untouched by
everything this phase added.

### Editorial rules specific to media

These are the constraints this section imposes on itself, and where each lives:

- **Transcripts are not verbatim capture.** The platform cannot publish a
  word-for-word record of speech it has not captured, so `TranscriptCue.text` is
  a written record, in our words, of what an item covers at that point.
  `Transcript` (`components/site/media.tsx`) says exactly that in a panel above
  the cues — the same move `ProvisionSplit` makes for statutory wording, for the
  same reason: a summary must never be mistaken for the thing itself.
- **No invented people.** Spec rule 23 forbids inventing professional
  credentials, so `MediaContributor` records the platform's own editorial desk
  and the role it played. `ContributorList` states that individual presenters
  and guests are named only once an item is recorded and the credit confirmed —
  the same discipline that leaves `reviewedBy` empty until a real human reviews
  something.
- **No engagement numbers.** Spec section 32 asks for "most watched" and "most
  listened". A view count on a platform that has not launched is a claim about
  the world, so `trending` is an editorial flag and the Watch hub says under its
  heading that no view counts are published.
- **No player that does nothing.** `MediaSource` is optional. When a record
  carries one, `MediaPlayer` mounts a real `<video>`/`<audio>` element with
  chapter seeking. When it does not, `MediaStage` states plainly when the item
  becomes playable, and everything else on the page — chapters, written record,
  related law — is complete and readable. An honest availability state, not
  placeholder UI (spec rule 28).
- **Sessions say what they will not answer.** `SessionPolicies` renders the
  question policy, attendance and archive policy on every live page, because a
  session that takes audience questions has to be explicit that it answers them
  as general education and not as advice on anyone's case.

### Derived rather than stored

The principle continued from Phases 2 and 3:

- Chapter and cue timecodes are formatted from `startSeconds`, so a label can
  never drift from the offset it seeks to.
- Hub headings read their counts from the data (`videos.length`,
  `series.length`, the live schedule's own states).
- The featured item is `find(featured) ?? first`, so a hub cannot lead with a
  film it no longer has.
- Media topics come from `getMediaTopics()`, which unions the topics actually in
  use rather than a hand-kept list beside them.
- The live schedule orders by `liveStatus`, not by comparing the clock at build
  time to `scheduledFor` — a prerendered schedule that read the clock would
  disagree with the page it links to.
- `SeriesView` only renders a season heading when that season has items in it.

### The player

`components/site/media-player.tsx` is the only new client component. It keeps
the browser's native controls, which are already keyboard accessible and respect
the viewer's caption and playback-rate settings, and adds the one thing they
lack: chapter seeking. Nothing in the current seed carries a source, so it does
not ship to any page yet.

### One view, two hubs

Watch and Listen render series through the same `SeriesView`; the split between
them is the route and the vocabulary, not the structure. `/watch/series/[slug]`
and `/listen/series/[slug]` each reject a strand of the wrong kind with a 404
rather than rendering a page that contradicts its own breadcrumb — the rule the
law explainers already follow for category/slug mismatches.

### The content graph

`getRelated()` resolves live events by slug alongside videos and episodes, so an
archived session is referenceable from a law entry exactly as a film is. Media
references were added in both directions: nine knowledge and safety records now
point at the media that covers them.

Two pre-existing references were repaired while doing it — `consumer-protection-fccpa`
and `business-partnership` listed media slugs under `articles:`, which
`getRelated()` was silently dropping.

### Search

Videos, episodes, live sessions and series are all indexed under the existing
`media` search type, so no new filter chip appears on `/search` and the header
overlay picks them up unchanged.

### Known gaps outside Phase 4 scope

Links still pointing at routes later phases own: `/constitution/chapter-iv`,
`/law-and-society/[slug]` (referenced by article cross-references),
`/legal-help/legal-aid`, `/lawyers`, `/cases`, `/quizzes`, `/resources`, and the
account entries in the navigation and footer. These resolve as the phases that
own them land. Every `/business/*`, `/watch/*`, `/listen/*` and `/live/*` link
in the codebase resolves as of Phase 4.

---

## Legal Help (Phase 5)

Spec sections 35, 36 and 37.

### Where the content lives

`lib/content/legal-help.ts`, re-exported through `data.ts` like every other
phase. It holds 7 referral routes, 13 problem pathways, 14 directory listings
and 7 answered questions.

### The hardest constraint in the phase, and how it was resolved

Spec section 36 wants a lawyer directory. Spec rule 23 forbids inventing
professional credentials, and section 36 itself requires verification to be
"backed by an actual administrative process". That process does not exist yet,
so there are no verified practitioners to publish.

Inventing a page of plausible lawyers would have been the easy read of rule 29
("use realistic structured mock data") and the wrong one: a fabricated
practitioner is a fabricated credential, and someone would eventually try to
instruct one. What ships instead is the **whole directory architecture over
practice-shaped listings**:

- `LawyerListing.displayName` is a practice and a location — "Employment and
  labour — Lagos" — never a person.
- `listingStatus` is `sample` on every seeded record, badged on every card and
  on every profile, not once at the top of the hub. A reader arriving at a
  profile from search has not seen the hub.
- A profile that is not `verified` sets `robots: { index: false }` on itself and
  is excluded from `app/sitemap.ts`.
- `credentials` is empty, and the profile renders an explicit "nothing has been
  verified for this listing" state rather than hiding the section.
- `VerificationPanel` states what a verified listing will require and what the
  directory will never do, and appears on both the hub and every profile.

The filters, facets, profile structure and empty states are all real, so the
administrative process has something finished to publish into. Changing one
record's `listingStatus` to `verified` is the whole switch.

### Editorial rules specific to this section

- **Pathways do not diagnose.** Spec section 35. `ProblemTriage` has no result
  screen, no score and no classification. An answer returns one sentence about
  *where to start reading*, and the entire pathway below stays visible and
  complete whether the questions are answered or not. A reader who ignores it
  loses nothing.
- **Urgency describes the situation, not the person.** `ProblemUrgency` renders
  as "Usually moves fast" / "Time matters" / "Take it in order" — time, never
  seriousness. The platform does not rank one person's problem against another's.
- **No contact details for institutions.** Every referral route is a real body,
  and none carries an address, telephone number, fee, eligibility threshold or
  processing time. `ReferralRoute.howToFind` says where to confirm current
  details instead. An address that is wrong sends someone on a journey they
  cannot afford to waste.
- **Every route states its limits.** `limits` is a required field and renders as
  its own labelled block, because knowing what a route *does not* do is what
  stops weeks being lost at the wrong door.
- **Questions never publish themselves.** Spec section 37. `submitQuestion`
  writes to a moderation queue with `status: "review"` and no path from there to
  a public page — publishing means an editor rewrites for privacy, writes an
  answer, and creates a record in the `questions` collection.
- **Privacy is enforced server-side.** The action rejects (rather than silently
  strips) email addresses, phone numbers and URLs, because someone who believes
  they sent their number should be told they did not. State is the only location
  accepted, and it is optional.
- **No practitioner speaks who has not spoken.** `PublicQuestion.lawyerNote` is
  absent throughout the seed, and the question page renders an explicit empty
  state saying so — the same discipline `reviewedBy` and `MediaContributor`
  already follow.

### The submission path

```
components/site/ask-form.tsx   (client)
  → lib/legal-help/actions.ts  ("use server": validates, never publishes)
    → lib/legal-help/questions.ts (process-local queue on globalThis)
      → app/admin  (Question moderation section — read only, never public)
```

`lib/legal-help/ask-options.ts` exists because a `"use server"` module may
export only async functions. The action and the form import the topic and state
lists from it, so the validated list and the rendered list are one list.

The queue is process-local and resets on restart, exactly like the CMS store,
and the form says so rather than implying a permanence that is not there.

### Derived rather than stored

The principle continued from Phases 2, 3 and 4:

- `DirectoryFacets` is computed from the listings, so a filter option cannot
  exist without a listing behind it. Experience is the one facet ordered by
  seniority rather than alphabetically.
- Problem categories come from `getProblemCategories()`, which unions the
  categories actually in use — the chooser cannot offer an empty group.
- Hub headings read their counts from the data (`problems.length`,
  `routes.length`, `facets.states.length`).
- The Legal Help hub leads with pathways whose `urgency` is `immediate`, ordered
  from the records rather than from a hand-kept list.
- `getReferralRoutesFor()` resolves a pathway's routes in the order the pathway
  lists them and drops anything unresolved, exactly as `getRelated()` does.

### Two client components

`ProblemTriage` and `AskForm` are interactive by nature. `FacetGrid` is a third
piece of client code but the same trick as `FilterGrid`: the page renders each
listing card as a server component and hands it over as a `node`, so no card
code ships as client JS. It exists alongside `FilterGrid` rather than replacing
it — the hubs filter on one axis, the directory on six.

### The content graph

`RelatedRefs` gained `problems`, `questions` and `referrals`; `RelatedKind` and
`SearchType` gained the matching members. A referral reference resolves to
`/legal-help/legal-aid#slug`, which is why every `ReferralDetail` carries an id
and `scroll-mt`.

Search indexes pathways on the reader's own words for the situation rather than
on legal vocabulary they may not have, and referral routes are indexed under the
`problem` type so no extra filter chip appears on `/search`.

### CMS

Four collections added (`legal-problems`, `referral-routes`, `lawyer-listings`,
`questions`) as declarations plus seed mappers, with no new admin screens. Three
field-level notes carry the editorial intent into the admin UI: `listingStatus`
explains that "Verified" requires the administrative process, `askedBy` requires
a pseudonymous attribution, and `lawyerNote` must stay empty unless a named
practitioner wrote it.

The moderation queue is surfaced on the admin dashboard as a read-only section.
It is deliberately not a collection: a submission is not a record until an
editor makes one.

### Known gaps outside Phase 5 scope

Links still pointing at routes later phases own: `/constitution/chapter-iv`,
`/law-and-society/[slug]`, `/cases`, `/quizzes`, `/resources`, `/about`,
`/contact`, and the account entries in the navigation and footer. Every
`/legal-help/*`, `/lawyers/*` and `/ask/*` link in the codebase resolves as of
Phase 5.
