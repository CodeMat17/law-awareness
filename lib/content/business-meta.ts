import type { EditorialMeta, SourceReference } from "./types";

/**
 * Editorial stamp shared by every Phase 3 seed record.
 *
 * `review` is fixed at `educational` here deliberately: nothing in the seed has
 * been through a human legal review, and `reviewed` may only ever be set by a
 * named person through the CMS. Keeping the default in one function means no
 * business record can quietly claim a credibility it does not have.
 */
export const BUSINESS_REVIEWED = "2026-08-14";

export function businessMeta(source?: SourceReference): EditorialMeta {
  return {
    status: "published",
    review: "educational",
    lastReviewed: BUSINESS_REVIEWED,
    ...(source ? { source } : {}),
  };
}
