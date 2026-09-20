"use server";

import { enqueueMessage } from "./messages";
import {
  contactReasons,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
} from "./options";

/**
 * The contact submission action.
 *
 * Validation runs on the server, so the rules hold no matter what the client
 * sends. Unlike Ask a Question, this form deliberately *does* take a name and
 * an email — it is a private channel to the team, not a public Q&A — so the
 * response copy is careful to say that it is still not confidential or
 * privileged.
 */

export interface ContactResult {
  ok: boolean;
  message: string;
  /** Present only on success. */
  reference?: string;
  /** Field to focus and mark invalid, where the failure belongs to one. */
  field?: "name" | "email" | "reason" | "message" | "understood";
}

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Deliberately permissive: enough to catch a typo, not to police addresses. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Places a message in the contact inbox. Nothing is published here. */
export async function submitMessage(
  _previous: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const reason = field(formData, "reason");
  const message = field(formData, "message");
  const understood = field(formData, "understood");

  if (name.length < 2) {
    return { ok: false, field: "name", message: "Please tell us your name." };
  }
  if (name.length > 120) {
    return { ok: false, field: "name", message: "Please shorten the name." };
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return {
      ok: false,
      field: "email",
      message: "Please check the email address — we reply to it.",
    };
  }
  if (!(contactReasons as readonly string[]).includes(reason)) {
    return {
      ok: false,
      field: "reason",
      message: "Please choose what this is about.",
    };
  }
  if (message.length < MESSAGE_MIN_LENGTH) {
    return {
      ok: false,
      field: "message",
      message: `Please write a little more — at least ${MESSAGE_MIN_LENGTH} characters, so we can route it to the right person.`,
    };
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      field: "message",
      message: `Please shorten the message to ${MESSAGE_MAX_LENGTH} characters or fewer.`,
    };
  }
  if (understood !== "yes") {
    return {
      ok: false,
      field: "understood",
      message:
        "Please confirm you understand that this is not a confidential channel and that we cannot advise on your legal situation.",
    };
  }

  const entry = enqueueMessage({ name, email, reason, message });

  return {
    ok: true,
    message:
      "Received. A person reads every message. We answer general and editorial enquiries as quickly as we can, and we do not answer requests for advice on an individual legal matter.",
    reference: entry.reference,
  };
}
