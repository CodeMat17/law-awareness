"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "cn";

const EDITIONS = [
  {
    id: "legal-brief",
    name: "The Legal Brief",
    detail: "Rights, explainers and everyday law",
  },
  {
    id: "business-brief",
    name: "The Business Legal Brief",
    detail: "For founders, SMEs and operators",
  },
  {
    id: "regulatory-watch",
    name: "Regulatory Watch",
    detail: "For legal and compliance professionals",
  },
] as const;

type EditionId = (typeof EDITIONS)[number]["id"];

/**
 * Newsletter signup with edition selection. Submission is intentionally local
 * until the Convex mutation and Clerk identity are wired in - the success state
 * is honest about what has happened.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<EditionId[]>(["legal-brief"]);
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();

  const toggle = (id: EditionId) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || selected.length === 0) return;
    setSubmitted(true);
  };

  return (
    <div className="rounded-3xl border border-hairline bg-card p-6 sm:p-9 lg:p-12">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/18 text-brand-ink">
              <Check className="size-5" />
            </span>
            <h3 className="text-h3 mt-5 text-foreground">
              Your preferences are set
            </h3>
            <p className="mt-2 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
              We have recorded {selected.length} edition
              {selected.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-foreground">{email}</span>.
              You can change or unsubscribe from any edition at any time.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-5 text-[0.85rem] font-bold text-brand-ink link-underline"
            >
              Change my selection
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14"
          >
            <div>
              <p className="text-eyebrow text-brand-ink">Newsletter</p>
              <h2 className="text-h2 mt-3.5 text-foreground">
                Legal awareness, in your inbox
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                Choose the editions that match how you use the law — as a
                citizen, as a business, or as a professional tracking change.
              </p>
            </div>

            <div>
              <fieldset>
                <legend className="text-caption text-muted-foreground">
                  Choose your editions
                </legend>
                <div className="mt-3 space-y-2.5">
                  {EDITIONS.map((edition) => {
                    const isOn = selected.includes(edition.id);
                    return (
                      <label
                        key={edition.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                          isOn
                            ? "border-primary/60 bg-primary/8"
                            : "border-hairline bg-surface hover:border-primary/35"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isOn}
                          onChange={() => toggle(edition.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 inline-flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-colors",
                            isOn
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          )}
                        >
                          {isOn && <Check className="size-3" strokeWidth={3} />}
                        </span>
                        <span>
                          <span className="block text-[0.9rem] font-bold text-foreground">
                            {edition.name}
                          </span>
                          <span className="block text-[0.8rem] text-muted-foreground">
                            {edition.detail}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-hairline bg-background px-4 text-[0.92rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
                />
                <button
                  type="submit"
                  disabled={selected.length === 0}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Subscribe
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-[0.75rem] text-muted-foreground">
                We use your address only to send the editions you selected.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
