"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { cn } from "cn";
import { UrgencyPill } from "./legal-help";
import type { TriageQuestion } from "@/lib/content/types";

/**
 * The gating questions at the head of a problem pathway (spec section 35).
 *
 * What this does: it changes **which part of the page to read first**, and says
 * so in those words.
 *
 * What it deliberately does not do: score, classify, diagnose, or tell the
 * reader anything about their legal position. There is no result screen and no
 * outcome — each answer returns a sentence about where to start reading, and
 * the whole pathway below stays visible and complete whether the questions are
 * answered or not. A reader who ignores this component loses nothing.
 *
 * Nothing is transmitted or stored. Answers live in component state for the
 * session and are gone on reload.
 */
export function ProblemTriage({ questions }: { questions: TriageQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const reduce = useReducedMotion();

  const answered = Object.keys(answers).length;

  return (
    <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-ink">Where to start reading</p>
          <p className="mt-2 max-w-2xl text-[0.88rem] leading-relaxed text-muted-foreground">
            These questions change the order this page is best read in. They do
            not assess your situation and they produce no result — everything
            below is here either way.
          </p>
        </div>
        {answered > 0 && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-foreground"
          >
            <RotateCcw className="size-3.5 text-brand-ink" />
            <span className="link-underline">Reset</span>
          </button>
        )}
      </div>

      <div className="mt-7 space-y-7">
        {questions.map((question) => {
          const selected = answers[question.id];
          const answer = question.answers.find(
            (option) => option.value === selected
          );

          return (
            <fieldset key={question.id} className="min-w-0">
              <legend className="text-[0.95rem] font-extrabold text-foreground">
                {question.question}
              </legend>
              {question.help && (
                <p className="mt-1.5 text-[0.83rem] leading-relaxed text-muted-foreground">
                  {question.help}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2.5">
                {question.answers.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setAnswers((current) => {
                          if (isSelected) {
                            const next = { ...current };
                            delete next[question.id];
                            return next;
                          }
                          return { ...current, [question.id]: option.value };
                        })
                      }
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left text-[0.86rem] font-bold transition-colors",
                        isSelected
                          ? "border-primary bg-primary/12 text-foreground"
                          : "border-hairline bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {answer && (
                  <motion.div
                    key={answer.value}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-4 sm:p-5"
                  >
                    <UrgencyPill urgency={answer.urgency} />
                    <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
                      {answer.guidance}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </fieldset>
          );
        })}
      </div>

      <p className="mt-7 border-t border-hairline pt-5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Your answers stay in this browser tab. Nothing is sent anywhere, and
        nothing is kept when you close the page.
      </p>
    </div>
  );
}
