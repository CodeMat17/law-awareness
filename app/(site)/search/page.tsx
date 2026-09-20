import type { Metadata } from "next";
import { PageHeader } from "@/components/site/knowledge";
import { SearchResults } from "@/components/site/search-results";
import { getContent } from "@/lib/content/repository";
import { searchSuggestions } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Search — Law Awareness TV",
  description:
    "Search laws, rights guides, Stay Safe guides, business guides, coverage, media and the plain-language glossary.",
  alternates: { canonical: "/search" },
};

export default async function SearchPage(props: PageProps<"/search">) {
  const [{ q }, documents] = await Promise.all([
    props.searchParams,
    getContent().getSearchDocuments(),
  ]);

  const initialQuery = typeof q === "string" ? q : "";

  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: "Search" }]}
        eyebrow="Search"
        title="Search the whole platform"
        lede="Laws, rights guides, Stay Safe guides, business guides, coverage, media and plain language — in one index."
      />

      <div className="rail py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <SearchResults
            documents={documents}
            suggestions={searchSuggestions}
            initialQuery={initialQuery}
          />
        </div>
      </div>
    </>
  );
}
