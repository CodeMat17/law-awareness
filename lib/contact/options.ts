/**
 * Options for the contact form.
 *
 * They live outside `actions.ts` because a `"use server"` module may export
 * only async functions — the server action and the client form both import
 * them from here, so the validated list and the rendered list are one list.
 */

export const contactReasons = [
  "General enquiry",
  "Correction to something we published",
  "Accessibility problem",
  "Press or media enquiry",
  "Partnership or sponsorship",
  "Contribute or work with us",
  "Privacy or data request",
  "Report a problem with the site",
] as const;

export type ContactReason = (typeof contactReasons)[number];

export const MESSAGE_MIN_LENGTH = 30;
export const MESSAGE_MAX_LENGTH = 2000;
