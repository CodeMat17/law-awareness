"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Send } from "lucide-react";
import { cn } from "cn";
import { submitQuestion, type AskResult } from "@/lib/legal-help/actions";
import {
  ASK_MAX_LENGTH,
  ASK_MIN_LENGTH,
  askStates,
  askTopics,
} from "@/lib/legal-help/ask-options";

/**
 * Ask a Question (spec section 37).
 *
 * The form submits to a server action that validates and queues; nothing here
 * publishes anything. The counter and the privacy checkbox exist to make the
 * two rules that matter — keep it general, keep yourself out of it — visible at
 * the moment of writing rather than in a policy elsewhere.
 */
export function AskForm() {
  const [result, formAction] = useActionState<AskResult | null, FormData>(
    submitQuestion,
    null
  );
  const [length, setLength] = useState(0);
  const questionId = useId();
  const topicId = useId();
  const stateId = useId();
  const consentId = useId();

  const tooShort = length > 0 && length < ASK_MIN_LENGTH;
  const remaining = ASK_MAX_LENGTH - length;

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
          <Check className="size-5" strokeWidth={2.4} />
        </span>
        <p className="text-h4 mt-5 text-foreground">Your question is queued</p>
        <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
          {result.message}
        </p>
        {result.reference && (
          <p className="mt-5 text-[0.85rem] text-muted-foreground">
            Reference{" "}
            <span className="font-mono font-extrabold text-foreground">
              {result.reference}
            </span>
            . Keep it if you want to refer to this question later.
          </p>
        )}
        <p className="mt-5 border-t border-primary/20 pt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
          Moderation is a person reading it, not a queue that empties itself.
          Questions that identify someone, or that ask for advice on a live
          matter, are not published — and asking here does not create a
          lawyer-client relationship or a confidential channel.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-hairline bg-card p-5 sm:p-7"
    >
      <div>
        <label
          htmlFor={questionId}
          className="text-[0.95rem] font-extrabold text-foreground"
        >
          Your question
        </label>
        <p className="mt-1.5 text-[0.83rem] leading-relaxed text-muted-foreground">
          Ask it generally — &ldquo;what does the law say about…&rdquo; rather
          than &ldquo;what should I do about my case&rdquo;. Leave out names,
          addresses, phone numbers, case numbers and anything that identifies
          you or anyone else.
        </p>
        <textarea
          id={questionId}
          name="question"
          rows={5}
          maxLength={ASK_MAX_LENGTH}
          required
          onChange={(event) => setLength(event.target.value.length)}
          placeholder="What does the law say about…"
          className="mt-3 w-full rounded-xl border border-hairline bg-surface p-4 text-[0.92rem] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60"
        />
        <p
          className={cn(
            "mt-2 text-[0.78rem] font-semibold",
            tooShort ? "text-brand-ink" : "text-muted-foreground"
          )}
        >
          {tooShort
            ? `${ASK_MIN_LENGTH - length} more characters needed`
            : `${remaining} characters left`}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={topicId}
            className="text-[0.88rem] font-extrabold text-foreground"
          >
            Topic
          </label>
          <select
            id={topicId}
            name="topic"
            required
            defaultValue=""
            className="mt-2 h-11 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.88rem] font-semibold text-foreground outline-none transition-colors focus-visible:border-primary/60"
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {askTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor={stateId}
            className="text-[0.88rem] font-extrabold text-foreground"
          >
            State <span className="font-semibold text-muted-foreground">(optional)</span>
          </label>
          <select
            id={stateId}
            name="state"
            defaultValue=""
            className="mt-2 h-11 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.88rem] font-semibold text-foreground outline-none transition-colors focus-visible:border-primary/60"
          >
            <option value="">Prefer not to say</option>
            {askStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[0.78rem] text-muted-foreground">
            State is the only location we accept. Some law is state law, which
            is why it helps.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3 rounded-xl border border-hairline bg-surface p-4">
        <input
          id={consentId}
          name="understood"
          type="checkbox"
          value="yes"
          required
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <label
          htmlFor={consentId}
          className="text-[0.85rem] leading-relaxed text-muted-foreground"
        >
          I understand that any answer is general legal information, not advice
          on my situation, that it creates no lawyer-client relationship, and
          that my question may be published in edited form without my name.
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
        <SubmitButton />
        <AnimatePresence mode="wait">
          {result && !result.ok && (
            <motion.p
              key={result.message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="flex items-start gap-2 text-[0.83rem] font-semibold text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {result.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-5 text-[0.78rem] leading-relaxed text-muted-foreground">
        Submissions are held for moderation and are not published automatically.
        While the platform runs without its database, the queue lives in the
        running server and does not survive a restart — we would rather say that
        than imply a permanence that is not there yet.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[0.9rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <Send className="size-4" />
      {pending ? "Sending…" : "Send for moderation"}
    </button>
  );
}
