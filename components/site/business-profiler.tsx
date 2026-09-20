"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { medium } from "@/lib/motion";
import type { ProfileQuestion } from "@/lib/content/types";

/**
 * "What laws apply to my business?" (spec section 18).
 *
 * The spec is explicit that this must never be presented as definitive legal
 * advice, so the component is deliberately framed as a *reading list*: it
 * surfaces educational topics that are commonly relevant to a business shaped
 * the way the reader described, and says in terms that obligations depend on
 * circumstances and should be professionally verified.
 *
 * It never says an obligation applies, never names a threshold, and stores
 * nothing.
 */

export interface ProfilerTopic {
  areaId: string;
  slug: string;
  title: string;
  summary: string;
  icon: string;
}

interface BusinessProfilerProps {
  questions: ProfileQuestion[];
  topics: ProfilerTopic[];
}

export function BusinessProfiler({ questions, topics }: BusinessProfilerProps) {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === questions.length;

  /** Areas implied by the answers, de-duplicated, in the topics' own order. */
  const suggested = useMemo(() => {
    const areaIds = new Set<string>();
    for (const question of questions) {
      const value = answers[question.id];
      if (!value) continue;
      const option = question.options.find((item) => item.value === value);
      option?.areas.forEach((areaId) => areaIds.add(areaId));
    }
    return topics.filter((topic) => areaIds.has(topic.areaId));
  }, [answers, questions, topics]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
      <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
        <ol className="space-y-8">
          {questions.map((question, questionIndex) => (
            <li key={question.id}>
              <p className="text-eyebrow text-muted-foreground">
                {String(questionIndex + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[1rem] leading-snug font-extrabold text-foreground">
                {question.label}
              </p>
              {question.help && (
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {question.help}
                </p>
              )}

              <fieldset className="mt-4">
                <legend className="sr-only">{question.label}</legend>
                <div
                  className={cn(
                    "grid gap-2.5",
                    question.kind === "boolean" ? "sm:grid-cols-2" : "sm:grid-cols-2"
                  )}
                >
                  {question.options.map((option) => {
                    const active = answers[question.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [question.id]: option.value,
                          }))
                        }
                        className={cn(
                          "flex h-12 items-center rounded-xl border px-4 text-left text-[0.9rem] font-bold transition-colors",
                          active
                            ? "border-primary/50 bg-primary/15 text-brand-ink"
                            : "border-hairline bg-background text-foreground hover:border-primary/40"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        {answeredCount > 0 && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="mt-8 inline-flex items-center gap-2 text-[0.85rem] font-bold text-foreground"
          >
            <RotateCcw className="size-3.5 text-brand-ink" />
            <span className="link-underline">Clear answers</span>
          </button>
        )}
      </div>

      <aside className="lg:sticky lg:top-[calc(var(--chrome-h)+1.5rem)] lg:self-start">
        <div className="rounded-2xl border border-hairline bg-surface p-6">
          <p className="text-eyebrow text-brand-ink">Topics worth reading</p>

          {suggested.length === 0 ? (
            <p className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
              Answer the questions and we will point you at the areas of business
              law that most often matter for a business shaped like yours.
            </p>
          ) : (
            <>
              <p
                aria-live="polite"
                className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground"
              >
                {suggested.length} topics, based on {answeredCount} of{" "}
                {questions.length} answers
                {complete ? "." : " so far."}
              </p>

              <ul className="mt-5 space-y-2.5">
                {suggested.map((topic, index) => (
                  <motion.li
                    key={topic.slug}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...medium,
                      delay: reduce ? 0 : Math.min(index * 0.03, 0.2),
                    }}
                  >
                    <Link
                      href={`/business/compliance/${topic.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-hairline bg-card p-3.5 transition-colors hover:border-primary/45"
                    >
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-brand-ink">
                        <Icon name={topic.icon} className="size-4" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.88rem] leading-snug font-extrabold text-foreground">
                          {topic.title}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <Link
                href="/business/health-check"
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Run the health check
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}

        </div>
      </aside>
    </div>
  );
}
