import type { WorkflowStatus } from "@/lib/content/types";

/**
 * The moderation queue behind Ask a Question (spec section 37).
 *
 * A submitted question enters this queue as `review` and is never publicly
 * readable from it. Publication is an editorial act: the question is rewritten
 * for privacy, an answer is written, and the result is added to the published
 * content — nothing here flows onto the site by itself.
 *
 * The store is process-local and hangs off `globalThis` so hot reload does not
 * lose it, exactly like the CMS store. Submissions do not survive a restart,
 * and the submission form says so rather than implying a durability that does
 * not exist yet. When Convex lands this becomes a table and only the functions
 * below change.
 */
export interface QuestionSubmission {
  /** Short reference the asker can quote. */
  reference: string;
  question: string;
  topic: string;
  /** State only — never a city, an address or a name. */
  state: string;
  submittedAt: string;
  status: WorkflowStatus;
}

const globalStore = globalThis as unknown as {
  __lawQuestionQueue?: QuestionSubmission[];
};

function queue(): QuestionSubmission[] {
  if (!globalStore.__lawQuestionQueue) globalStore.__lawQuestionQueue = [];
  return globalStore.__lawQuestionQueue;
}

/** Reference the asker can quote. Not a secret, and not an identifier for them. */
function makeReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const salt = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `LQ-${stamp}${salt}`;
}

export function enqueueQuestion(input: {
  question: string;
  topic: string;
  state: string;
}): QuestionSubmission {
  const submission: QuestionSubmission = {
    reference: makeReference(),
    question: input.question,
    topic: input.topic,
    state: input.state,
    submittedAt: new Date().toISOString(),
    // Never `published`. Publication is an editorial decision, not a default.
    status: "review",
  };
  queue().unshift(submission);
  return submission;
}

/** Everything awaiting moderation. Read by the admin, never by a public page. */
export function pendingQuestions(): QuestionSubmission[] {
  return [...queue()];
}

/** How many are waiting, for the admin dashboard. */
export function pendingQuestionCount(): number {
  return queue().length;
}
