/**
 * Options for the Ask a Question form.
 *
 * They live outside `actions.ts` because a `"use server"` module may export
 * only async functions — the server action and the client form both import
 * them from here, so the validated list and the rendered list are one list.
 */

export const askTopics = [
  "Police & criminal",
  "Court",
  "Home & land",
  "Work",
  "Business & contracts",
  "Family",
  "Money & debt",
  "Consumer",
  "Online",
  "Something else",
] as const;

/**
 * State is optional and is the *only* location we accept. It is coarse enough
 * to be useful for context and too coarse to identify anyone.
 */
export const askStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const ASK_MIN_LENGTH = 20;
export const ASK_MAX_LENGTH = 700;
