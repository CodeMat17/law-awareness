"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { cn } from "cn";
import type { QuizQuestion } from "@/lib/content/types";

/**
 * The quiz player.
 *
 * One question at a time, answered before the explanation appears — a quiz that
 * shows the reasoning only after a commitment teaches more than one that lets
 * the reader read ahead.
 *
 * A signed-out reader is stored nothing: the score lives in this component and
 * disappears with the page. A signed-in reader has the finished attempt added
 * to their own quiz history (spec section 42) — the attempt only, never the
 * individual answers, which are nobody else's business.
 */
export function QuizPlayer({
  questions,
  quizSlug,
  quizTitle,
}: {
  questions: QuizQuestion[];
  quizSlug: string;
  quizTitle: string;
}) {
  const { isAuthenticated } = useConvexAuth();
  const record = useMutation(api.library.recordQuizAttempt);
  // Completion is a state transition, and React may run an effect twice in
  // development. The ref makes the write happen once per finished run.
  const recorded = useRef(false);
  const reduce = useReducedMotion();
  const groupId = useId();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answered = chosen !== null;
  const correct = answered && chosen === question.answer;

  function choose(option: number) {
    if (answered) return;
    setChosen(option);
    if (option === question.answer) setScore((value) => value + 1);
  }

  function next() {
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setChosen(null);
  }

  useEffect(() => {
    if (!done || recorded.current || !isAuthenticated) return;
    recorded.current = true;
    void record({
      quizSlug,
      quizTitle,
      score,
      total: questions.length,
    });
  }, [done, isAuthenticated, record, quizSlug, quizTitle, score, questions.length]);

  function restart() {
    recorded.current = false;
    setIndex(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
        <p className="text-eyebrow text-brand-ink">Finished</p>
        <p className="text-h2 mt-3 text-foreground">
          {score} of {questions.length}
        </p>
        <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
          {percent >= 80
            ? "Strong. The gaps that remain are the ones worth reading up on — the explanations above each said where."
            : percent >= 50
              ? "A reasonable base, with real gaps. Work through the guides on the subjects you missed rather than retaking straight away."
              : "Worth slowing down. Read the guides on this subject first — the quiz is a check, not a course."}
        </p>
        <p className="mt-5 text-[0.85rem] leading-relaxed text-muted-foreground">
          A score here means you recognised a general statement of the law. It
          does not tell you anything about your own situation.
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCcw className="size-4" />
          Start again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="text-eyebrow text-brand-ink">
          Question {index + 1} of {questions.length}
        </p>
        <p className="text-[0.8rem] font-bold text-muted-foreground">
          {score} correct
        </p>
      </div>

      <div
        aria-hidden
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <fieldset className="mt-6" aria-describedby={`${groupId}-prompt`}>
        <legend className="sr-only">Question {index + 1}</legend>
        <p
          id={`${groupId}-prompt`}
          className="text-h4 text-foreground"
        >
          {question.prompt}
        </p>

        <ul className="mt-5 space-y-2.5">
          {question.options.map((option, optionIndex) => {
            const isAnswer = optionIndex === question.answer;
            const isChosen = optionIndex === chosen;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => choose(optionIndex)}
                  disabled={answered}
                  aria-pressed={isChosen}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border p-4 text-left text-[0.9rem] leading-relaxed transition-colors",
                    !answered &&
                      "border-hairline bg-surface text-foreground hover:border-primary/45",
                    answered &&
                      isAnswer &&
                      "border-primary/50 bg-primary/10 text-foreground",
                    answered &&
                      isChosen &&
                      !isAnswer &&
                      "border-destructive/50 bg-destructive/8 text-foreground",
                    answered &&
                      !isAnswer &&
                      !isChosen &&
                      "border-hairline bg-surface text-muted-foreground"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-extrabold",
                      answered && isAnswer
                        ? "border-primary bg-primary text-primary-foreground"
                        : answered && isChosen
                          ? "border-destructive bg-destructive text-background"
                          : "border-hairline text-muted-foreground"
                    )}
                  >
                    {answered && isAnswer ? (
                      <Check className="size-3" strokeWidth={3} />
                    ) : answered && isChosen ? (
                      <X className="size-3" strokeWidth={3} />
                    ) : (
                      String.fromCharCode(65 + optionIndex)
                    )}
                  </span>
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <AnimatePresence mode="wait">
        {answered && (
          <motion.div
            key={question.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mt-5 rounded-xl border border-hairline bg-surface p-4 sm:p-5"
          >
            <p
              className={cn(
                "text-caption",
                correct ? "text-brand-ink" : "text-destructive"
              )}
            >
              {correct ? "Correct" : "Not quite"}
            </p>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 border-t border-hairline pt-5">
        <button
          type="button"
          onClick={next}
          disabled={!answered}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {isLast ? "See your score" : "Next question"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
