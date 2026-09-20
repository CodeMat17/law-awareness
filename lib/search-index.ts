import { getContent } from "@/lib/content/repository";
import type { SearchEntry } from "@/components/site/search-overlay";

/**
 * Builds the header overlay's index from published content on the server.
 *
 * The overlay is the quick path; `/search` reads the same documents with their
 * summaries and filters. Small enough today to ship whole. When the library
 * grows this becomes a route handler and the overlay's props stay unchanged.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const documents = await getContent().getSearchDocuments();
  return documents.map((document) => ({
    id: document.id,
    title: document.title,
    group: document.group,
    href: document.href,
  }));
}

export const searchSuggestions = [
  "police stopped me",
  "my landlord",
  "hiring staff",
  "data protection",
  "bail",
  "faulty product",
  "before you sign",
  "employment contract",
];
