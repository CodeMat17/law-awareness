"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { medium } from "@/lib/motion";
import type {
  ComplianceArea,
  HealthCheckQuestion,
  ReadinessBand,
} from "@/lib/content/types";

/**
 * The Business Legal Health Check (spec section 19).
 *
 * It is an educational risk-awareness tool. It produces a *readiness picture*, never a legal opinion, and it never tells a
 * reader that something does or does not apply to them - only which areas are
 * worth understanding and where a professional should be involved.
 *
 * Nothing is transmitted or stored. The answers live in component state for the
 * length of the session and are gone on reload; saved assessments belong with
 * accounts in Phase 6.
 */

type Answer = "yes" | "partly" | "no" | "unsure";

const answerOptions: { value: Answer; label: string; score: number }[] = [
  { value: "yes", label: "Yes", score: 1 },
  { value: "partly", label: "Partly", score: 0.5 },
  { value: "no", label: "No", score: 0 },
  { value: "unsure", label: "Not sure", score: 0 },
];

/** A single answer maps to a band. "Not sure" is treated as high attention:
 *  not knowing is itself the exposure this tool is trying to surface. */
function bandFor(answer: Answer): ReadinessBand {
  if (answer === "yes") return "strong";
  if (answer === "partly") return "attention";
  return "high-attention";
}

const bandCopy: Record<
  ReadinessBand,
  { label: string; dot: string; chip: string }
> = {
  strong: {
    label: "Strong",
    dot: "bg-chart-2",
    chip: "bg-chart-2/15 text-foreground",
  },
  attention: {
    label: "Needs attention",
    dot: "bg-chart-1",
    chip: "bg-chart-1/15 text-foreground",
  },
  "high-attention": {
    label: "High attention",
    dot: "bg-chart-4",
    chip: "bg-chart-4/18 text-foreground",
  },
};

export interface HealthCheckTopicRef {
  areaId: string;
  slug: string;
  title: string;
  summary: string;
}

interface HealthCheckProps {
  questions: HealthCheckQuestion[];
  areas: ComplianceArea[];
  /** One Compliance Centre topic per area, used to build the result links. */
  topics: HealthCheckTopicRef[];
}

export function HealthCheck({ questions, areas, topics }: HealthCheckProps) {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const current = questions[index];
  const areaFor = (areaId: string) => areas.find((area) => area.id === areaId);
  const topicFor = (areaId: string) =>
    topics.find((topic) => topic.areaId === areaId);

  const result = useMemo(() => {
    const rows = questions.map((question) => {
      const answer = answers[question.id];
      const option = answerOptions.find((item) => item.value === answer);
      const area = areas.find((item) => item.id === question.areaId);
      return {
        question,
        answer,
        band: answer ? bandFor(answer) : ("high-attention" as ReadinessBand),
        score: option?.score ?? 0,
        weight: area?.weight ?? 1,
        area,
      };
    });

    const weightTotal = rows.reduce((sum, row) => sum + row.weight, 0);
    const scored = rows.reduce((sum, row) => sum + row.score * row.weight, 0);
    const percentage = weightTotal > 0 ? Math.round((scored / weightTotal) * 100) : 0;

    const overall: ReadinessBand =
      percentage >= 80 ? "strong" : percentage >= 50 ? "attention" : "high-attention";

    return {
      rows,
      percentage,
      overall,
      needsWork: rows.filter((row) => row.band !== "strong"),
    };
  }, [answers, questions, areas]);

  function answer(value: Answer) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      setSubmitted(true);
    }
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setSubmitted(false);
  }

  /* ---------------------------------------------------------------------- */
  /* Result                                                                  */
  /* ---------------------------------------------------------------------- */

  if (submitted) {
    const overall = bandCopy[result.overall];

    return (
      <div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={medium}
          className="rounded-2xl border border-hairline bg-card p-6 sm:p-8"
        >
          <p className="text-eyebrow text-brand-ink">Business legal readiness</p>

          <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
            <p className="text-display text-foreground">{result.percentage}%</p>
            <span
              className={cn(
                "mb-2 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8rem] font-extrabold",
                overall.chip
              )}
            >
              <span aria-hidden className={cn("size-2 rounded-full", overall.dot)} />
              {overall.label}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
            This is a readiness picture across {total} areas, based only on what
            you told us. It is not an assessment of your legal obligations, and
            it does not tell you what applies to your business.
          </p>

          <div
            role="img"
            aria-label={`Readiness ${result.percentage} per cent, ${overall.label}`}
            className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <motion.div
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </motion.div>

        <div className="mt-8">
          <h3 className="text-h3 text-foreground">Area by area</h3>
          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
            Each area links to the Compliance Centre topic that explains it, so
            you can read about the ones you flagged rather than all of them.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {result.rows.map((row) => {
              const band = bandCopy[row.band];
              const topic = topicFor(row.question.areaId);
              const body = (
                <>
                  <span className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2.5">
                      {row.area && (
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-brand-ink">
                          <Icon
                            name={row.area.icon}
                            className="size-4"
                            strokeWidth={1.9}
                          />
                        </span>
                      )}
                      <span className="text-[0.92rem] leading-snug font-extrabold text-foreground">
                        {row.area?.name ?? "Area"}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold tracking-wide uppercase",
                        band.chip
                      )}
                    >
                      <span aria-hidden className={cn("size-1.5 rounded-full", band.dot)} />
                      {band.label}
                    </span>
                  </span>
                  <span className="mt-3 block text-[0.85rem] leading-relaxed text-muted-foreground">
                    {topic?.summary ?? row.question.prompt}
                  </span>
                </>
              );

              return (
                <li key={row.question.id}>
                  {topic ? (
                    <Link
                      href={`/business/compliance/${topic.slug}`}
                      className="block h-full rounded-xl border border-hairline bg-card p-4 transition-colors hover:border-primary/45"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="h-full rounded-xl border border-hairline bg-card p-4">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {result.needsWork.length > 0 && (
          <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:p-6">
            <p className="text-eyebrow text-brand-ink">Where to start</p>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
              You flagged {result.needsWork.length} of {total} areas. These are
              the topics worth reading first — none of this is a determination
              that anything applies to your business.
            </p>
            <ul className="mt-5 space-y-2.5">
              {result.needsWork.map((row) => {
                const topic = topicFor(row.question.areaId);
                if (!topic) return null;
                return (
                  <li key={row.question.id}>
                    <Link
                      href={`/business/compliance/${topic.slug}`}
                      className="group inline-flex items-center gap-2 text-[0.9rem] font-bold text-foreground"
                    >
                      <span className="link-underline">{topic.title}</span>
                      <ArrowRight className="size-3.5 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={restart}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            <RotateCcw className="size-4 text-brand-ink" />
            Start again
          </button>
          <Link
            href="/business/compliance"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the Compliance Centre
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/lawyers"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
          >
            Speak to a lawyer
          </Link>
        </div>

      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Questions                                                               */
  /* ---------------------------------------------------------------------- */

  const area = areaFor(current.areaId);
  const selected = answers[current.id];

  return (
    <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-eyebrow text-brand-ink">
          Question {index + 1} of {total}
        </p>
        {area && (
          <span className="inline-flex items-center gap-2 text-[0.8rem] font-bold text-muted-foreground">
            <Icon name={area.icon} className="size-4 text-brand-ink" strokeWidth={1.9} />
            {area.name}
          </span>
        )}
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Health check progress"
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${(index / total) * 100}%` }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-h3 mt-7 text-foreground">{current.prompt}</h2>
        {current.help && (
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
            {current.help}
          </p>
        )}

        <fieldset className="mt-7">
          <legend className="sr-only">{current.prompt}</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => answer(option.value)}
                aria-pressed={selected === option.value}
                className={cn(
                  "flex h-12 items-center justify-between rounded-xl border px-4 text-[0.92rem] font-bold transition-colors",
                  selected === option.value
                    ? "border-primary/50 bg-primary/15 text-brand-ink"
                    : "border-hairline bg-background text-foreground hover:border-primary/40"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </motion.div>

      <div className="mt-7 flex items-center justify-between gap-4 border-t border-hairline pt-5">
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="inline-flex items-center gap-2 text-[0.85rem] font-bold text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="size-4 text-brand-ink" />
          Back
        </button>
        {answeredCount === total && (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            See your readiness
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>

    </div>
  );
}
