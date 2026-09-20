"use server";

import {
  ASK_MAX_LENGTH,
  ASK_MIN_LENGTH,
  askStates,
  askTopics,
} from "./ask-options";
import { enqueueQuestion } from "./questions";

/**
 * The Ask a Question submission action (spec section 37).
 *
 * Validation runs on the server, so the privacy guarantees hold no matter what
 * the client sends. The action never publishes: it places the question in the
 * moderation queue and returns a reference.
 */

export interface AskResult {
  ok: boolean;
  message: string;
  /** Present only on success. */
  reference?: string;
}

/**
 * Patterns that carry contact or identity information.
 *
 * A question is rejected rather than quietly stripped, because someone who
 * believes they sent their number should be told they did not. Moderation
 * catches the rest; this catches the obvious cases before a human sees them.
 */
const contactPatterns: { pattern: RegExp; message: string }[] = [
  {
    pattern: /[\w.+-]+@[\w-]+\.[\w.]+/,
    message:
      "Please remove the email address. Questions are answered publicly, so nothing that identifies you can be included.",
  },
  {
    pattern: /(?:\+?234|0)\d[\d\s-]{8,}/,
    message:
      "Please remove the phone number. Questions are answered publicly, so nothing that identifies you can be included.",
  },
  {
    pattern: /https?:\/\/\S+/i,
    message:
      "Please remove the link and describe the situation in words instead.",
  },
];

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Places a question in the moderation queue. Nothing is published here. */
export async function submitQuestion(
  _previous: AskResult | null,
  formData: FormData
): Promise<AskResult> {
  const question = field(formData, "question");
  const topic = field(formData, "topic");
  const state = field(formData, "state");
  const understood = field(formData, "understood");

  if (question.length < ASK_MIN_LENGTH) {
    return {
      ok: false,
      message: `Please write a little more — at least ${ASK_MIN_LENGTH} characters, so the question can be answered usefully.`,
    };
  }
  if (question.length > ASK_MAX_LENGTH) {
    return {
      ok: false,
      message: `Please shorten the question to ${ASK_MAX_LENGTH} characters or fewer.`,
    };
  }
  if (!(askTopics as readonly string[]).includes(topic)) {
    return { ok: false, message: "Please choose a topic." };
  }
  if (state.length > 0 && !(askStates as readonly string[]).includes(state)) {
    return { ok: false, message: "Please choose a state from the list." };
  }
  if (understood !== "yes") {
    return {
      ok: false,
      message:
        "Please confirm you understand that answers are general legal information, not advice on your situation.",
    };
  }

  for (const { pattern, message } of contactPatterns) {
    if (pattern.test(question)) return { ok: false, message };
  }

  const submission = enqueueQuestion({
    question,
    topic,
    state: state || "Not stated",
  });

  return {
    ok: true,
    message:
      "Received. A person will read it before anything happens to it, and it is published only if it can be answered as general information.",
    reference: submission.reference,
  };
}
