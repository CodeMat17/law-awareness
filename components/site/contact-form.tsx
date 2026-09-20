"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Send } from "lucide-react";
import { cn } from "cn";
import { submitMessage, type ContactResult } from "@/lib/contact/actions";
import {
  contactReasons,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
} from "@/lib/contact/options";

/**
 * The contact form.
 *
 * Unlike Ask a Question, this one takes a name and an email, because we reply
 * to it. The panel above the fields says plainly what this channel is not —
 * confidential, privileged, or a route to advice on an individual matter —
 * because that is the misunderstanding a contact form on a law platform
 * invites.
 */
export function ContactForm() {
  const [result, formAction] = useActionState<ContactResult | null, FormData>(
    submitMessage,
    null
  );
  const [length, setLength] = useState(0);
  const nameId = useId();
  const emailId = useId();
  const reasonId = useId();
  const messageId = useId();
  const consentId = useId();

  const tooShort = length > 0 && length < MESSAGE_MIN_LENGTH;
  const remaining = MESSAGE_MAX_LENGTH - length;

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
          <Check className="size-5" strokeWidth={2.4} />
        </span>
        <p className="text-h4 mt-5 text-foreground">Message received</p>
        <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
          {result.message}
        </p>
        {result.reference && (
          <p className="mt-5 text-[0.85rem] text-muted-foreground">
            Reference{" "}
            <span className="font-mono font-extrabold text-foreground">
              {result.reference}
            </span>
            . Keep it if you want to refer to this message later.
          </p>
        )}
      </div>
    );
  }

  const invalid = (field: ContactResult["field"]) =>
    result && !result.ok && result.field === field;

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-hairline bg-card p-5 sm:p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={nameId}
            className="text-[0.88rem] font-extrabold text-foreground"
          >
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={invalid("name") ? true : undefined}
            className="mt-2 h-11 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.9rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 aria-invalid:border-destructive"
          />
        </div>
        <div>
          <label
            htmlFor={emailId}
            className="text-[0.88rem] font-extrabold text-foreground"
          >
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={invalid("email") ? true : undefined}
            className="mt-2 h-11 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.9rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 aria-invalid:border-destructive"
          />
          <p className="mt-2 text-[0.78rem] text-muted-foreground">
            Used to reply to you, and for nothing else.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor={reasonId}
          className="text-[0.88rem] font-extrabold text-foreground"
        >
          What is this about?
        </label>
        <select
          id={reasonId}
          name="reason"
          required
          defaultValue=""
          aria-invalid={invalid("reason") ? true : undefined}
          className="mt-2 h-11 w-full rounded-xl border border-hairline bg-surface px-3 text-[0.88rem] font-semibold text-foreground outline-none transition-colors focus-visible:border-primary/60 aria-invalid:border-destructive sm:max-w-sm"
        >
          <option value="" disabled>
            Choose a reason
          </option>
          {contactReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <label
          htmlFor={messageId}
          className="text-[0.95rem] font-extrabold text-foreground"
        >
          Your message
        </label>
        <p className="mt-1.5 text-[0.83rem] leading-relaxed text-muted-foreground">
          If you are pointing at something we published, include the page
          address. Please leave out case details and documents — this is not a
          confidential channel.
        </p>
        <textarea
          id={messageId}
          name="message"
          rows={6}
          maxLength={MESSAGE_MAX_LENGTH}
          required
          onChange={(event) => setLength(event.target.value.length)}
          aria-invalid={invalid("message") ? true : undefined}
          className="mt-3 w-full rounded-xl border border-hairline bg-surface p-4 text-[0.92rem] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 aria-invalid:border-destructive"
        />
        <p
          className={cn(
            "mt-2 text-[0.78rem] font-semibold",
            tooShort ? "text-brand-ink" : "text-muted-foreground"
          )}
        >
          {tooShort
            ? `${MESSAGE_MIN_LENGTH - length} more characters needed`
            : `${remaining} characters left`}
        </p>
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
          I understand that this is not a confidential or privileged channel,
          that writing here creates no lawyer-client relationship, and that Law
          Awareness TV cannot advise on my individual legal situation.
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
        While the platform runs without its database, messages live in the
        running server and do not survive a restart — we would rather say that
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
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}
