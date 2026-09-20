# LAW AWARENESS TV --- PREMIUM WEB PLATFORM BUILD SPECIFICATION

## 1. Project Vision

Build a premium, mobile-first Nigerian legal-awareness, public legal
education, business legal-risk awareness, compliance education, and
legal-media platform.

The platform must make Nigerian law understandable, practical, engaging,
searchable, and useful to:

-   Everyday citizens
-   Entrepreneurs and founders
-   Small and medium-sized businesses
-   Corporate organizations
-   CEOs, executives, HR and compliance teams
-   Legal professionals and students
-   Journalists and educators
-   Young people and digital users

The platform must not feel like a conventional law firm website or a
boring legal document archive.

Its core promise is:

> **Know the Law. Know Your Rights. Protect What Matters.**

The experience should answer four questions:

1.  What does the law say?
2.  What does it mean in real life?
3.  What should I do or avoid?
4.  When should I seek qualified legal help?

For businesses:

1.  What laws apply to my business?
2.  What legal risks could affect my company?
3.  What should my company do to remain compliant?
4.  When should management involve a lawyer or specialist?

The final product should feel like a serious national digital platform
rather than a simple informational website.

------------------------------------------------------------------------

# 2. Product Positioning

Position the platform as:

**A Nigerian digital legal education, awareness, compliance and
legal-media platform.**

The product has five major audience pillars:

### Citizens

Rights, responsibilities, practical legal guides, safety, explainers and
access to legal-help information.

### Business & Enterprise

Business law, compliance awareness, contracts, employment, data
protection, intellectual property, tax/regulatory awareness, corporate
governance and risk prevention.

### Professionals

Case law, legislation, legal developments, research resources,
regulatory updates and professional education.

### Media & Education

Live streaming, podcasts, interviews, documentaries, legal explainers,
webinars and educational programming.

### Legal Help

Guided legal-problem navigation, lawyer discovery/referrals, public Q&A
and resources explaining when professional advice may be appropriate.

------------------------------------------------------------------------

# 3. Technology Stack

Use:

-   Next.js with App Router
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Framer Motion
-   next-themes
-   Lucide React icons
-   Google Nunito font only
-   Server Components by default
-   Client Components only where interactivity requires them
-   Modern responsive CSS
-   Accessible semantic HTML
-   Optimized Next.js Image
-   Modern data fetching patterns
-   Strong TypeScript typing

### Mandatory TypeScript Rule

**Never use `any`.**

Use explicit interfaces, types, generics, discriminated unions and safe
type guards.

Avoid unnecessary type assertions.

------------------------------------------------------------------------

# 4. Typography

Use **only Google Nunito** throughout the application.

Do not introduce:

-   Inter
-   Roboto
-   Poppins
-   Montserrat
-   Arial
-   system fallback fonts as a design choice

Nunito should create a modern, approachable, intelligent and premium
personality.

Use an intentional typography scale:

-   Display / Hero
-   H1
-   H2
-   H3
-   H4
-   Body
-   Small
-   Caption
-   Metadata

Typography should remain highly readable on mobile.

------------------------------------------------------------------------

# 5. Theme System

Use `next-themes`.

Only two application modes are permitted:

-   Light
-   Dark

Do not provide additional themes.

The theme system must be comprehensive.

### Critical Theme Requirement

**ALL text must respect the active theme.**

Never hard-code text colours such as:

-   `text-white`
-   `text-black`
-   fixed gray text colours

unless the value is specifically part of an intentionally theme-aware
component and remains accessible in both modes.

Prefer semantic CSS variables:

-   `--background`
-   `--foreground`
-   `--card`
-   `--card-foreground`
-   `--primary`
-   `--primary-foreground`
-   `--secondary`
-   `--secondary-foreground`
-   `--muted`
-   `--muted-foreground`
-   `--accent`
-   `--accent-foreground`
-   `--border`
-   `--input`
-   `--ring`
-   `--destructive`

All headings, paragraphs, metadata, labels, links, buttons, icons,
badges and navigation elements must derive their visual colour from
theme-aware tokens.

No component should become unreadable when switching themes.

------------------------------------------------------------------------

# 6. Premium Colour Architecture

Use a deliberate **70 / 20 / 10 colour system**.

### 70% --- Foundation

The dominant background/surface family.

It should create visual calm and allow content to breathe.

### 20% --- Supporting Layer

Cards, secondary surfaces, borders, muted areas, navigation surfaces and
supporting UI.

### 10% --- Signature Accent

A distinctive premium legal/technology accent used sparingly for:

-   Primary CTAs
-   Active navigation
-   Important highlights
-   Live indicators
-   Key statistics
-   Links
-   Focus states
-   Selected categories
-   Important legal alerts

The colour palette must be unique and sophisticated rather than looking
like a generic blue legal website.

Avoid excessive gradients.

Gradients may be used selectively for premium hero artwork, accent glows
and featured sections.

Maintain strong contrast and WCAG accessibility.

------------------------------------------------------------------------

# 7. Global Visual Direction

The visual language should be:

-   Premium
-   Intelligent
-   Authoritative
-   Modern
-   Human
-   Trustworthy
-   Editorial
-   Cinematic
-   Engaging
-   Calm
-   Professional
-   Nigerian in context without becoming visually stereotypical

Avoid:

-   Generic corporate templates
-   Excessive glassmorphism
-   Excessive rounded cards
-   Cheap-looking gradients
-   Clutter
-   Huge walls of text
-   Overuse of icons
-   Stock-lawyer clichés
-   Gavel-heavy visual identity
-   Excessive animation

Use strong hierarchy, whitespace, editorial layouts, subtle depth and
carefully controlled motion.

------------------------------------------------------------------------

# 8. Global Navigation

Desktop navigation:

-   Logo
-   Home
-   Know the Law
-   Your Rights
-   Business & Enterprise
-   Stay Safe
-   Legal Help
-   Law & Society
-   Watch & Listen
-   Search
-   Theme toggle
-   Primary CTA

Suggested primary CTA:

**Ask a Legal Question**

Secondary utility options may include:

-   Sign In
-   Business
-   Live

### Mobile Navigation

Use a premium mobile-first navigation system.

Recommended:

-   Logo
-   Search
-   Theme toggle
-   Menu button

The mobile menu should use a polished full-screen or large-sheet
navigation experience.

Do not overcrowd the header.

------------------------------------------------------------------------

# 9. Breaking-Updates Scrolling Headline Stripe

A signature feature must appear **above the main navigation**.

Purpose:

Show:

-   Legal updates
-   Regulatory alerts
-   New laws
-   Court developments
-   Important public notices
-   New episodes
-   Upcoming live streams
-   Business compliance alerts
-   Public safety/legal alerts

Example:

`LEGAL UPDATE  •  New regulatory development explained  •  BUSINESS ALERT  •  Upcoming legal education session  •  LIVE THIS WEEK`

Requirements:

-   Horizontally scrolling marquee
-   Smooth infinite loop
-   Framer Motion animation
-   Pause on hover
-   Pause when appropriate for accessibility
-   Keyboard accessible
-   Touch-friendly on mobile
-   Do not move excessively fast
-   Respect `prefers-reduced-motion`
-   Each headline can be clickable
-   Important items can have category badges
-   Include subtle separators

The stripe should feel like a premium news terminal rather than a
distracting ticker.

------------------------------------------------------------------------

# 10. Homepage

The homepage must immediately communicate authority, usefulness and
modernity.

## Hero Section

Create a premium, cinematic hero.

Primary message:

**Know the Law. Know Your Rights. Protect What Matters.**

Supporting message:

Understand Nigerian law, protect yourself, protect your business, and
know when professional legal help may be necessary.

Primary CTA:

**Explore the Law**

Secondary CTA:

**I Have a Legal Problem**

Additional business CTA:

**Protect My Business**

### Hero Composition

Use:

-   Large editorial typography
-   Premium visual composition
-   Subtle motion
-   Layered background treatment
-   Legal/document-inspired visual elements
-   Abstract Nigerian civic/public-interest visual language
-   Floating information cards
-   Subtle animated lines or data motifs
-   Carefully controlled accent glow

Do not make the hero look like a SaaS landing page.

The hero must feel like the front page of a serious national knowledge
platform.

------------------------------------------------------------------------

# 11. Homepage Content Flow

Recommended order:

1.  Breaking updates ticker
2.  Main navigation
3.  Premium hero
4.  Issue finder
5.  Live now section
6.  Featured legal rights
7.  Know the law
8.  Business & Enterprise
9.  Legal safety
10. Latest legal developments
11. Case law / Constitution
12. Watch & Listen
13. Law in Plain Language
14. Business legal health check
15. Lawyer/legal-help section
16. Quizzes / learning
17. Newsletter
18. Footer

The exact order may be adjusted based on UX testing.

------------------------------------------------------------------------

# 12. "What Do You Need to Know?" Issue Finder

Create a visually engaging issue-selection interface.

Categories:

-   Police
-   Arrest & Bail
-   Property
-   Work
-   Family
-   Business
-   Contracts
-   Online Safety
-   Money & Debt
-   Consumer Rights
-   Traffic
-   Land
-   Court
-   Other

When selected, guide the user toward relevant content.

The experience should feel like:

**Tell us what happened → Understand the law → Know what to do → Find
relevant resources → Know when to seek legal help.**

------------------------------------------------------------------------

# 13. Know the Law

Create a comprehensive legal knowledge system.

Categories should include:

-   Constitution
-   Criminal Law
-   Civil Law
-   Human Rights
-   Family Law
-   Employment & Labour
-   Land & Property
-   Business & Corporate
-   Consumer Protection
-   Cybercrime & Digital Rights
-   Traffic & Road Safety
-   Police & Law Enforcement
-   Immigration
-   Tax
-   Electoral Law
-   Environmental Law
-   Education
-   Public Health
-   Financial Law
-   Media & Entertainment
-   Intellectual Property

The architecture must support expansion.

------------------------------------------------------------------------

# 14. Individual Law Pages

Every law/explanation page should provide:

-   Title
-   Category
-   Short summary
-   What the law covers
-   Who it affects
-   Plain-language explanation
-   Important provisions
-   Real-life examples
-   What you should do
-   What you should not do
-   Common misconceptions
-   Related laws
-   Related rights
-   Related articles
-   Related videos
-   Related podcasts
-   When to contact a lawyer
-   Official/source references
-   Section references
-   Amendment information
-   Last reviewed date
-   Editorial/legal review status

Use a clear distinction between:

**Official legal text**

and

**Plain-language explanation**

Do not misrepresent summaries as statutory text.

------------------------------------------------------------------------

# 15. Your Rights

Create a major rights-focused hub.

Topics:

-   Fundamental rights
-   Police encounters
-   Arrest and detention
-   Bail
-   Freedom of expression
-   Privacy
-   Property rights
-   Workplace rights
-   Tenant/landlord issues
-   Consumer rights
-   Digital rights
-   Family-related rights
-   Court rights
-   Rights during investigations

Use situation-first content.

Example:

**What to know if the police stop you**

instead of only:

**Police Powers Act**

------------------------------------------------------------------------

# 16. Stay Safe

This should be practical legal-risk prevention.

Sections:

-   Police encounters
-   Arrest and detention
-   Contracts
-   Land/property
-   Employment
-   Online scams
-   Cybercrime
-   Social media
-   Business partnerships
-   Borrowing/lending
-   Buying property
-   Signing documents
-   Consumer transactions

Feature:

## Before You Sign

A recurring educational series explaining:

-   What to look for
-   Important clauses
-   Red flags
-   Questions to ask
-   When to stop and seek professional advice

------------------------------------------------------------------------

# 17. Business & Enterprise

This must be a first-class section, not a subsection.

Purpose:

Make the platform highly valuable to entrepreneurs, SMEs, companies and
corporate organizations.

Subsections:

-   Start a Business
-   Running a Business
-   Employment & HR
-   Contracts
-   Tax & Regulatory
-   Data Protection
-   Intellectual Property
-   Corporate Governance
-   Consumer Protection
-   Debt & Recovery
-   Disputes & Litigation
-   Business Compliance
-   Industry Regulations

------------------------------------------------------------------------

# 18. Business Legal Knowledge

Create:

**What Laws Apply to My Business?**

Allow users to select:

-   Business type
-   Industry
-   Number of employees
-   Online/offline
-   Customer data collected
-   Whether they employ staff
-   Whether they use contractors
-   Whether they sell products/services
-   Whether they operate regulated activities

Then surface relevant educational topics.

Never present this as definitive legal advice.

Always explain that regulatory obligations depend on circumstances and
should be professionally verified where necessary.

------------------------------------------------------------------------

# 19. Business Legal Health Check

Create an interactive assessment.

Possible areas:

-   Business structure
-   Registration
-   Contracts
-   Employment
-   Payroll
-   Tax
-   Data protection
-   Intellectual property
-   Consumer protection
-   Licensing
-   Regulatory requirements
-   Record keeping
-   Corporate governance
-   Dispute prevention
-   Insurance/risk management

Output:

**Business Legal Readiness**

Example categories:

-   Strong
-   Needs Attention
-   High Attention

Then provide:

-   Identified areas
-   Educational resources
-   Suggested actions
-   Relevant laws
-   Relevant checklists
-   When to consult a qualified professional

This is an educational risk-awareness tool, not a legal opinion.

------------------------------------------------------------------------

# 20. Business "Before You Do This" Guides

Create practical guides:

-   Before hiring an employee
-   Before signing a supplier contract
-   Before entering a partnership
-   Before borrowing money
-   Before buying land/property
-   Before collecting customer data
-   Before launching an online business
-   Before terminating an employee
-   Before using another person's brand/content
-   Before entering a major commercial agreement
-   Before expanding into a regulated industry

Each guide should have:

-   Situation
-   Key legal considerations
-   Common mistakes
-   Red flags
-   Checklist
-   Relevant laws
-   When to involve a lawyer

------------------------------------------------------------------------

# 21. Company Compliance Centre

Create a dedicated compliance knowledge centre.

Topics:

-   Corporate obligations
-   Employment
-   Tax awareness
-   Data protection
-   Consumer protection
-   Industry regulation
-   Licensing
-   Record keeping
-   Corporate governance
-   Reporting
-   Contracts
-   Intellectual property

Include:

**What applies to my company?**

as a major entry point.

------------------------------------------------------------------------

# 22. Regulatory Watch

Create a high-value business feature.

Each update should answer:

-   What changed?
-   Who is affected?
-   When does it take effect?
-   What does it mean?
-   What should businesses consider?
-   What should individuals know?
-   What is the official source?
-   Has implementation guidance changed?

Clearly separate:

**News reporting**

from

**Legal explanation**

------------------------------------------------------------------------

# 23. Law Change Alerts

Allow users to follow topics such as:

-   Employment
-   Tax
-   Data Protection
-   Corporate Law
-   Consumer Protection
-   Technology Law
-   Intellectual Property
-   Financial Regulation
-   Labour
-   Real Estate

Users can receive notifications when new relevant content is published.

------------------------------------------------------------------------

# 24. Business Legal Calendar

Create a compliance-awareness calendar.

Features:

-   Upcoming dates
-   Regulatory events
-   Educational reminders
-   Business compliance topics
-   Add-to-calendar
-   Reminder preferences

Do not hard-code legal deadlines without a maintained source and review
process.

------------------------------------------------------------------------

# 25. Contract Knowledge Centre

Educational contract library.

Topics:

-   Employment agreements
-   NDA
-   Service agreements
-   Consultancy agreements
-   Partnership agreements
-   Shareholder agreements
-   Supplier agreements
-   Lease agreements
-   Distribution agreements
-   Terms & Conditions
-   Privacy policies

Each item should explain:

-   What it is
-   Why it matters
-   When it is commonly used
-   Important clauses
-   Common mistakes
-   Warning signs
-   When legal review is appropriate

Generic templates must never be presented as universally suitable legal
documents.

------------------------------------------------------------------------

# 26. Law for CEOs

Create an executive-level content section.

Content should be concise and strategic.

Example topics:

-   Five legal risks every CEO should monitor
-   What a new data regulation could mean for your company
-   Employment-law issues management should understand
-   Contract risks executives overlook
-   Corporate governance essentials
-   Regulatory developments affecting your industry

This section should make corporate decision-makers take the platform
seriously.

------------------------------------------------------------------------

# 27. Industry Legal Hubs

Create industry-specific hubs.

Examples:

-   Technology
-   Hospitality
-   Media
-   Real Estate
-   Construction
-   Education
-   Healthcare
-   Financial Services
-   NGOs
-   Retail
-   Manufacturing
-   Entertainment
-   Agriculture

Each hub should surface:

-   Relevant laws
-   Regulations
-   Compliance topics
-   Recent updates
-   Guides
-   Case studies
-   Videos
-   Podcasts
-   Checklists

------------------------------------------------------------------------

# 28. Law & Society

Editorial/current-affairs section.

Include:

-   Legal news
-   Supreme Court developments
-   New legislation
-   Regulations
-   Reforms
-   Public-interest cases
-   Legal policy
-   Human-rights developments
-   Important court decisions

Every story must clearly indicate whether it is:

-   News
-   Analysis
-   Legal explainer
-   Opinion
-   Educational content

------------------------------------------------------------------------

# 29. Case Law Explorer

Create a searchable case-law experience.

Filters:

-   Court
-   Year
-   Subject
-   Judge
-   Case number
-   Legal issue

Each case page can contain:

-   Case title
-   Court
-   Date
-   Citation
-   Legal issue
-   Background
-   Decision
-   Key principle
-   Plain-language explanation
-   Related laws
-   Related cases
-   Source document

Do not fabricate judgments, citations or legal holdings.

------------------------------------------------------------------------

# 30. Constitution Explorer

Create an interactive Constitution experience.

Features:

-   Search
-   Chapters
-   Sections
-   Original/official text
-   Plain-language explanation
-   Related rights
-   Related cases
-   Related articles

The distinction between official text and educational interpretation
must remain obvious.

------------------------------------------------------------------------

# 31. Law in Plain Language

Create a signature glossary/explainer system.

Examples:

-   Bail
-   Affidavit
-   Injunction
-   Habeas corpus
-   Subpoena
-   Fundamental rights
-   Limitation period
-   Probate
-   Power of attorney
-   Defamation
-   Negligence
-   Trespass

Each entry:

-   Simple definition
-   Example
-   Why it matters
-   Related law
-   Related articles

------------------------------------------------------------------------

# 32. Watch & Listen

Create a premium media hub.

Content types:

-   Live streams
-   Recorded broadcasts
-   Interviews
-   Legal explainers
-   Short videos
-   Webinars
-   Documentaries
-   Podcasts
-   Audio explainers

Create strong visual media cards.

Use:

-   Featured video
-   Latest episodes
-   Trending
-   Most watched
-   Most listened
-   Topic collections

------------------------------------------------------------------------

# 33. Live Streaming

Build the architecture for live events.

Features:

-   LIVE NOW indicator
-   Video player
-   Event title
-   Description
-   Speaker profiles
-   Live Q&A
-   Moderated questions
-   Related laws
-   Related articles
-   Live chat where appropriate
-   Event schedule
-   Registration/reminders
-   Post-event archive

After a stream ends, convert the event into an on-demand content page.

------------------------------------------------------------------------

# 34. Podcast

Create a proper podcast system.

Each episode:

-   Cover art
-   Title
-   Description
-   Host
-   Guests
-   Topics
-   Audio player
-   Transcript
-   Chapters
-   Related laws
-   Related articles
-   Related questions

Support episode collections and seasons.

------------------------------------------------------------------------

# 35. Legal Help

Create:

**I Have a Legal Problem**

as one of the strongest product experiences.

Example flow:

Police arrested me → Are you currently detained? → Educational
information → Important rights → What to do → What to avoid → Relevant
law → Relevant resources → When to seek professional help → Find legal
help

Other problem categories:

-   Land/property
-   Employment
-   Business dispute
-   Contract
-   Family
-   Debt
-   Police
-   Consumer
-   Online issue
-   Court
-   Criminal matter

Do not diagnose a user's legal position.

Do not represent automated guidance as legal advice.

------------------------------------------------------------------------

# 36. Lawyer Directory

Create a structured lawyer/legal professional directory where
appropriate.

Filters:

-   State
-   City
-   Practice area
-   Language
-   Experience
-   Availability

Profiles may contain:

-   Name
-   Professional photograph
-   Practice areas
-   Location
-   Biography
-   Languages
-   Professional credentials
-   Verification status
-   Consultation information

Verification must be backed by an actual administrative process.

------------------------------------------------------------------------

# 37. Ask a Lawyer / Public Q&A

Allow questions to be submitted.

Flow:

Question → Moderation → General legal-information response → Relevant
law → Relevant educational resources → Lawyer response where available

Questions should not automatically become public without moderation.

Include privacy protections.

------------------------------------------------------------------------

# 38. Legal Quizzes

Create interactive quizzes.

Examples:

-   Know Your Rights
-   Employment Law
-   Business Law
-   Contract Basics
-   Online Safety
-   Consumer Rights
-   Police Encounters
-   Constitution

Include:

-   Score
-   Explanation
-   Relevant law
-   Recommended reading

Make quizzes visually engaging rather than academic-looking.

------------------------------------------------------------------------

# 39. Legal Checklists

Create downloadable/printable checklists.

Examples:

-   Starting a business
-   Hiring staff
-   Signing a contract
-   Buying property
-   Collecting customer information
-   Handling an employee dispute
-   Preparing for regulatory review
-   Protecting intellectual property

------------------------------------------------------------------------

# 40. Resource Centre

Resources may include:

-   Guides
-   Checklists
-   Educational PDFs
-   Legal reference material
-   Official links
-   Glossary
-   Videos
-   Podcasts
-   Templates where legally appropriate

Every resource should have metadata and review status.

------------------------------------------------------------------------

# 41. Search

Search must be one of the strongest platform features.

Search across:

-   Laws
-   Sections
-   Articles
-   Rights
-   Business guides
-   Regulations
-   Cases
-   Videos
-   Podcasts
-   Glossary
-   Resources
-   Lawyers where enabled

Support:

-   Autocomplete
-   Recent searches
-   Suggested searches
-   Filters
-   Category filtering
-   Search result highlighting
-   Mobile-friendly search

Create a polished search overlay.

------------------------------------------------------------------------

# 42. User Accounts

Optional account system should support:

-   Saved articles
-   Saved laws
-   Saved cases
-   Saved videos
-   Saved podcasts
-   Followed topics
-   Alert preferences
-   Learning progress
-   Quiz history
-   Compliance interests

------------------------------------------------------------------------

# 43. Business Accounts

Organization accounts should support:

-   Organization profile
-   Saved resources
-   Followed regulations/topics
-   Legal updates
-   Compliance-awareness dashboard
-   Team members
-   Shared resources
-   Alerts
-   Training content

Do not expose private organization data publicly.

------------------------------------------------------------------------

# 44. Corporate Plans

Design the architecture for:

### Free

-   Public legal information
-   Articles
-   Basic law library
-   Videos
-   Podcasts
-   Basic guides

### Business

-   Regulatory alerts
-   Compliance resources
-   Checklists
-   Saved resources
-   Compliance calendar
-   Business legal education

### Enterprise

-   Organization dashboard
-   Multiple users
-   Topic monitoring
-   Advanced alerts
-   Training content
-   Corporate webinars
-   Organization learning resources

Do not implement payments unless explicitly required.

------------------------------------------------------------------------

# 45. Newsletter

Create a premium newsletter system.

Possible editions:

**The Legal Brief**

For general audiences.

**The Business Legal Brief**

For entrepreneurs and organizations.

**Regulatory Watch**

For legal/compliance professionals.

Allow users to select interests.

------------------------------------------------------------------------

# 46. Footer

Premium footer structure:

### Explore

-   Know the Law
-   Your Rights
-   Business & Enterprise
-   Stay Safe
-   Law & Society

### Media

-   Watch
-   Listen
-   Live
-   Podcasts

### Business

-   Business Legal Health Check
-   Compliance Centre
-   Regulatory Watch
-   Legal Academy

### Help

-   Legal Help
-   Ask a Question
-   Lawyer Directory
-   Contact

### Platform

-   About
-   Editorial Policy
-   Legal Disclaimer
-   Privacy
-   Terms
-   Accessibility

Include newsletter signup and social links where available.

------------------------------------------------------------------------

# 47. Animation System

Use Framer Motion throughout the interface, but with restraint.

Animations should include:

-   Hero entrance
-   Section reveals
-   Card hover
-   Navigation transitions
-   Search overlay
-   Mobile menu
-   Modal transitions
-   Filter transitions
-   Ticker motion
-   Content loading transitions
-   Page transitions where appropriate
-   Media-player transitions
-   Progress animations

Use consistent motion principles.

Recommended:

-   Fast micro-interactions
-   Medium content transitions
-   Slow cinematic hero transitions

Always respect:

`prefers-reduced-motion`

When reduced motion is enabled, disable non-essential movement.

------------------------------------------------------------------------

# 48. Mobile-First Requirement

Design mobile first.

Primary target:

-   Small phones
-   Large phones
-   Tablets
-   Laptops
-   Large desktops

Do not simply shrink the desktop design.

Mobile UX must have:

-   Comfortable tap targets
-   Sticky actions where appropriate
-   Bottom navigation where useful
-   Horizontal scroll areas only when intentional
-   Optimized typography
-   Fast search
-   Easy content scanning
-   Accessible menus
-   Media controls
-   No horizontal overflow

------------------------------------------------------------------------

# 49. Responsive Breakpoints

Use Tailwind's responsive system.

Design intentionally for:

-   Mobile
-   Small tablet
-   Tablet
-   Laptop
-   Desktop
-   Large desktop

Do not build separate desktop/mobile applications.

------------------------------------------------------------------------

# 50. Accessibility

Target WCAG 2.2 AA.

Requirements:

-   Keyboard navigation
-   Focus indicators
-   Screen-reader labels
-   Semantic HTML
-   Proper heading hierarchy
-   Form labels
-   Accessible modals
-   Accessible navigation
-   Sufficient colour contrast
-   Reduced motion support
-   Accessible media controls
-   Captions/transcripts where applicable

Never rely on colour alone to communicate meaning.

------------------------------------------------------------------------

# 51. Performance

Target excellent Lighthouse scores.

Priorities:

-   Server Components
-   Image optimization
-   Responsive images
-   Lazy loading
-   Dynamic imports where appropriate
-   Minimal client JavaScript
-   Optimized fonts
-   Avoid unnecessary libraries
-   Avoid layout shifts
-   Proper metadata
-   Streaming/server rendering where useful

Do not sacrifice accessibility or SEO for visual effects.

------------------------------------------------------------------------

# 52. SEO

Build SEO into the architecture.

Use:

-   Metadata API
-   Open Graph metadata
-   Twitter/X metadata
-   Canonical URLs
-   Structured data
-   Breadcrumbs
-   Article schema
-   Video schema
-   Podcast schema where appropriate
-   FAQ schema only when appropriate
-   Organization schema
-   Person schema where appropriate
-   Sitemap
-   Robots configuration

Every law/article/case/resource page should have unique metadata.

------------------------------------------------------------------------

# 53. Content Credibility System

Every legal-information page should communicate credibility.

Include:

-   Source
-   Last reviewed
-   Reviewed by
-   Legal reference
-   Amendment status
-   Content type
-   Disclaimer

Possible status:

-   Educational
-   Reviewed
-   Updated
-   Archived

Never imply that an automatically generated explanation is
professionally reviewed unless it actually is.

------------------------------------------------------------------------

# 54. Legal Disclaimer Architecture

The platform must clearly communicate that:

-   General educational content is not automatically legal advice.
-   Laws can change.
-   Circumstances matter.
-   Users should obtain qualified professional advice where necessary.
-   Official sources should be checked for authoritative legal text.
-   Automated tools must not be presented as lawyers.

Do not bury the disclaimer only in the footer.

Use contextual notices where necessary.

------------------------------------------------------------------------

# 55. Content Management Architecture

Design the system so editors can manage:

-   Laws
-   Articles
-   News
-   Rights
-   Business guides
-   Regulations
-   Cases
-   Videos
-   Podcasts
-   Live events
-   Glossary
-   FAQs
-   Quizzes
-   Checklists
-   Lawyers
-   Alerts
-   News ticker items

Each content type should have:

-   Draft
-   Review
-   Published
-   Archived

Legal content should support review workflows.

------------------------------------------------------------------------

# 56. Law Versioning

The architecture should support:

-   Original law
-   Amendments
-   Current version
-   Effective dates
-   Historical versions
-   What changed?
-   Related amendment
-   Previous version

Never overwrite historical legal information without preserving its
history.

------------------------------------------------------------------------

# 57. Editorial Design Principles

Use an editorial hierarchy similar to a premium digital publication.

Important stories should feel important.

Use:

-   Large feature cards
-   Split layouts
-   Editorial grids
-   Featured stories
-   Pull quotes
-   Statistics
-   Timelines
-   Highlight blocks
-   Related-content rails

Avoid repetitive 3-column card grids everywhere.

------------------------------------------------------------------------

# 58. Components

Build reusable components such as:

-   SiteHeader
-   UpdateTicker
-   MobileMenu
-   ThemeToggle
-   SearchCommand
-   HeroSection
-   IssueFinder
-   SectionHeader
-   ContentCard
-   LawCard
-   RightsCard
-   BusinessGuideCard
-   AlertCard
-   NewsCard
-   VideoCard
-   PodcastCard
-   LiveCard
-   LawyerCard
-   QuizCard
-   ChecklistCard
-   GlossaryCard
-   LegalDisclaimer
-   SourceReference
-   ReviewBadge
-   ComplianceScore
-   ProgressBar
-   FilterBar
-   Breadcrumbs
-   NewsletterForm
-   SiteFooter

Keep components composable and reusable.

------------------------------------------------------------------------

# 59. Suggested Route Structure

Use a clean App Router structure.

``` text
/
 /know-the-law
 /know-the-law/[slug]
 /your-rights
 /your-rights/[slug]
 /business
 /business/[slug]
 /business/health-check
 /business/compliance
 /business/regulatory-watch
 /business/legal-calendar
 /stay-safe
 /stay-safe/[slug]
 /law-and-society
 /law-and-society/[slug]
 /cases
 /cases/[slug]
 /constitution
 /constitution/[slug]
 /glossary
 /glossary/[term]
 /watch
 /watch/[slug]
 /listen
 /listen/[slug]
 /live
 /live/[slug]
 /legal-help
 /legal-help/problem
 /lawyers
 /lawyers/[slug]
 /ask
 /quizzes
 /quizzes/[slug]
 /resources
 /resources/[slug]
 /about
 /contact
 /search
 /account
 /business-account
```

Route names may be adjusted during implementation for SEO and UX.

------------------------------------------------------------------------

# 60. Data Model Principles

The data layer should support relationships between:

-   Laws
-   Sections
-   Amendments
-   Rights
-   Articles
-   Cases
-   Regulations
-   Businesses
-   Industries
-   Guides
-   Videos
-   Podcasts
-   Live events
-   Glossary terms
-   Resources
-   Questions
-   Lawyers
-   Alerts
-   Users
-   Organizations

Important relationships:

`Law → Rights`

`Law → Business Topics`

`Law → Articles`

`Law → Cases`

`Law → Videos`

`Law → Podcasts`

`Regulation → Industry`

`Regulation → Business Type`

`Article → Law`

`Article → Case`

`Video → Law`

`Podcast → Law`

This relationship model will make the platform powerful and highly
discoverable.

------------------------------------------------------------------------

# 61. Content Recommendation

On every content page, surface relevant content.

Example:

A Data Protection article should show:

-   Related law
-   Related business guide
-   Related checklist
-   Related case
-   Related video
-   Related podcast
-   Related glossary terms
-   Regulatory updates

Create a content graph rather than isolated pages.

------------------------------------------------------------------------

# 62. Notifications

Architecture should support:

-   Breaking legal updates
-   Regulatory alerts
-   New podcast
-   New video
-   Live event reminders
-   Followed topic updates
-   Business alerts
-   Newsletter

Users must control notification preferences.

------------------------------------------------------------------------

# 63. Admin Dashboard

Prepare for a future admin platform.

Admin areas:

-   Dashboard
-   Content
-   Laws
-   Cases
-   Regulations
-   Articles
-   Media
-   Live events
-   Questions
-   Lawyers
-   Users
-   Organizations
-   Alerts
-   Newsletter
-   Taxonomy
-   Editorial review
-   Analytics

Admin UI should use the same premium design language.

------------------------------------------------------------------------

# 64. Security

Implement secure defaults.

Requirements:

-   Input validation
-   Output sanitization
-   Authentication protection
-   Authorization
-   Rate limiting where necessary
-   Secure file handling
-   Safe HTML rendering
-   CSRF protection where applicable
-   Secure headers
-   No sensitive information in client logs
-   No exposed secrets
-   Environment variables for secrets

------------------------------------------------------------------------

# 65. AI Legal Information Assistant

Plan an advanced future feature:

**Legal Awareness Assistant**

It should answer educational questions using approved platform content
and authoritative sources.

It must:

-   Cite relevant sources
-   Show related laws
-   Explain uncertainty
-   Avoid claiming to be a lawyer
-   Avoid definitive personalized legal conclusions
-   Encourage professional help for high-risk situations
-   Respect privacy
-   Never fabricate law

The architecture should allow retrieval-augmented generation over the
platform's approved legal knowledge base.

------------------------------------------------------------------------

# 66. Nigerian Context

The platform must be deeply relevant to Nigeria.

Support content taxonomy around:

-   Federal law
-   State-level legal information
-   Nigerian institutions
-   Courts
-   Regulators
-   Business environment
-   Citizens' everyday experiences
-   Entrepreneurs
-   SMEs
-   Corporate organizations

Potential language support in a future phase:

-   English
-   Nigerian Pidgin
-   Igbo
-   Yoruba
-   Hausa

Do not machine-translate sensitive legal content without appropriate
review.

------------------------------------------------------------------------

# 67. Premium UX Details

Add carefully selected premium details:

-   Smooth page transitions
-   Subtle cursor interactions on desktop
-   Magnetic CTA only where useful
-   Hover image scaling
-   Animated underlines
-   Soft card elevation
-   Editorial section dividers
-   Scroll progress on long articles
-   Sticky article navigation
-   Reading time
-   Share controls
-   Copy-link interaction
-   Save/bookmark interaction
-   Related-content rails
-   Smart empty states
-   Skeleton loaders
-   Beautiful error states
-   404 experience

Do not allow visual effects to compromise usability.

------------------------------------------------------------------------

# 68. Hero and Media Imagery

Use authentic, high-quality imagery.

Avoid generic smiling lawyer stock photographs.

Preferred visual themes:

-   Nigerian civic life
-   Courts
-   Business environments
-   Entrepreneurs
-   Workplaces
-   Technology
-   Public institutions
-   Documents
-   Education
-   Community
-   Responsible digital life

Use image overlays and crops that remain readable in both themes.

------------------------------------------------------------------------

# 69. Homepage Engagement Strategy

The homepage should answer:

**Why should I care?**

within seconds.

Use clear entry points:

### For Everyone

**Understand your rights.**

### For Entrepreneurs

**Protect your business.**

### For Companies

**Stay aware of legal and regulatory risk.**

### For Professionals

**Track legal developments.**

### For Learners

**Learn law in plain language.**

### For Viewers

**Watch and listen.**

------------------------------------------------------------------------

# 70. Content Tone

Content UX should be:

-   Clear
-   Direct
-   Intelligent
-   Human
-   Practical
-   Non-condescending
-   Non-alarmist

Avoid unnecessary legal jargon.

When jargon is necessary, explain it immediately.

------------------------------------------------------------------------

# 71. Development Phases

Build in phases to avoid an unstable monolithic implementation.

## Phase 1 --- Premium Foundation

Implement:

-   Next.js project
-   TypeScript
-   Tailwind
-   shadcn/ui
-   Nunito
-   next-themes
-   Light/dark themes
-   Theme tokens
-   Responsive shell
-   Header
-   Update ticker
-   Mobile menu
-   Footer
-   Hero
-   Homepage
-   Core animations
-   SEO foundation
-   Accessibility foundation

Do not move forward until the visual foundation is polished.

## Phase 2 --- Legal Knowledge

Implement:

-   Know the Law
-   Law categories
-   Law detail pages
-   Your Rights
-   Stay Safe
-   Glossary
-   Search
-   Related content
-   Sources/review metadata

## Phase 3 --- Business & Enterprise

Implement:

-   Business hub
-   Business guides
-   Legal Health Check
-   Compliance Centre
-   Regulatory Watch
-   Business Calendar
-   Contract Knowledge Centre
-   Industry hubs
-   Law for CEOs

## Phase 4 --- Media

Implement:

-   Watch
-   Podcasts
-   Live
-   Video pages
-   Audio pages
-   Event pages
-   Transcripts
-   Media relationships

## Phase 5 --- Legal Help

Implement:

-   I Have a Legal Problem
-   Lawyer directory
-   Ask a Question
-   Legal-help flows
-   Referral architecture

## Phase 6 --- Professional/Advanced

Implement:

-   Case Law Explorer
-   Constitution Explorer
-   Law versioning
-   Amendment tracking
-   Regulatory alerts
-   User accounts
-   Bookmarks
-   Notifications
-   Business accounts

## Phase 7 --- Advanced Intelligence

Implement:

-   AI legal-information assistant
-   Personalized learning
-   Advanced recommendations
-   Compliance dashboards
-   Organization analytics
-   Advanced search

------------------------------------------------------------------------

# 72. Build Rules for Claude Code

Claude Code must:

1.  Inspect the existing project before changing anything.
2.  Preserve working functionality.
3.  Never rewrite unrelated code.
4.  Never use `any`.
5.  Keep components modular.
6.  Prefer server components.
7.  Use client components only when needed.
8.  Use Framer Motion for meaningful motion.
9.  Respect reduced-motion preferences.
10. Use only Nunito.
11. Use only Light and Dark themes.
12. Make every colour theme-aware.
13. Never hard-code theme-breaking text colours.
14. Avoid accessibility regressions.
15. Avoid horizontal overflow.
16. Test mobile layouts continuously.
17. Maintain SEO metadata.
18. Keep loading states polished.
19. Use semantic HTML.
20. Maintain consistent spacing and typography.
21. Avoid unnecessary dependencies.
22. Do not invent legal facts.
23. Do not invent statutes, case citations, regulatory requirements or
    professional credentials.
24. Clearly separate sample/demo content from verified legal content.
25. Build reusable primitives before duplicating UI.
26. Keep business features first-class.
27. Maintain the premium visual quality across every route.
28. Do not create generic placeholder UI that looks unfinished.
29. Use realistic structured mock data during frontend development.
30. Keep legal disclaimers visible where appropriate.

------------------------------------------------------------------------

# 73. Definition of Done

A phase is complete only when:

-   Mobile layout is polished
-   Tablet layout is polished
-   Desktop layout is polished
-   Light mode is polished
-   Dark mode is polished
-   All text remains readable in both themes
-   Animations are smooth
-   Reduced motion works
-   Keyboard navigation works
-   Core pages have metadata
-   No TypeScript errors
-   No `any`
-   No obvious console errors
-   No horizontal overflow
-   Images are optimized
-   Loading states exist
-   Empty states exist
-   Error states exist
-   Navigation works
-   Links work
-   Accessibility fundamentals pass
-   Lighthouse performance is strong
-   UI feels like one coherent premium product

------------------------------------------------------------------------

# 74. Final Product Standard

The final application should feel like a combination of:

-   A premium digital publication
-   A national legal knowledge platform
-   A public legal education service
-   A business legal-risk awareness platform
-   A professional legal information resource
-   A modern streaming/podcast network

It must not feel like:

-   A static law library
-   A law firm's brochure
-   A basic blog
-   A government portal
-   A generic SaaS dashboard

The experience should make a citizen think:

**"This helps me understand the law."**

An entrepreneur:

**"This helps me avoid legal mistakes."**

A company:

**"This helps us stay aware of legal and regulatory risk."**

A professional:

**"This is a useful legal-information platform."**

And a viewer:

**"This is a serious media platform I want to follow."**

------------------------------------------------------------------------

# 75. Core Brand Experience

Every major interaction should reinforce three principles:

## KNOW

Understand Nigerian law and legal concepts.

## PROTECT

Reduce avoidable legal mistakes and understand rights, responsibilities
and risks.

## ACT

Know the next sensible step and when professional legal assistance may
be appropriate.

Across all of these, the media layer should continuously educate
through:

**WATCH. LISTEN. LEARN.**

The final product should be visually exceptional, technically robust,
highly accessible, mobile-first, SEO-friendly, fast, trustworthy and
scalable.
