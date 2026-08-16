import { faq, launch, site } from "@/content/site";

/**
 * The JSON-LD graph, so a crawler can read the page as facts rather than as
 * prose it has to infer from.
 *
 * Every string comes from content/site.ts. Nothing is written here, because a
 * wording change must never mean touching a component — and because a claim
 * that appears only in metadata is a claim nobody proofreads.
 *
 * What is deliberately absent matters as much as what is here:
 *
 *   - no aggregateRating. There are no ratings. Inventing them is the single
 *     fastest way to earn a manual action.
 *   - no SearchAction. There is no site search to point it at.
 *   - no downloadUrl or installUrl until launch.status flips. The app has not
 *     shipped, and this reads the same one switch every call to action does,
 *     so the store links appear everywhere at once or nowhere at all.
 *
 * FAQPage is included knowing Google retired FAQ rich results for almost every
 * site in 2023, so it will not draw an expanded snippet. It stays because it is
 * ten lines and it is what assistant answers read.
 */
export function StructuredData() {
  const base = `https://${site.domain}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: site.name,
        url: `${base}/`,
        description: site.description,
        logo: `${base}/icon.png`,
        sameAs: ["https://github.com/trungtrung-community"],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: site.name,
        url: `${base}/`,
        description: site.description,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "MobileApplication",
        "@id": `${base}/#app`,
        name: site.name,
        description: site.description,
        applicationCategory: "EducationalApplication",
        applicationSubCategory: "Language learning",
        operatingSystem: "iOS, Android",
        // The interface is English; the subject is Tibetan. They are different
        // claims and both are load-bearing for anyone searching either way.
        inLanguage: "en",
        about: {
          "@type": "Language",
          name: "Tibetan",
          alternateName: "Lhasa Tibetan",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": `${base}/#organization` },
        ...(launch.status === "launched" && launch.appStoreUrl
          ? { downloadUrl: launch.appStoreUrl }
          : {}),
      },
      {
        "@type": "FAQPage",
        "@id": `${base}/#faq`,
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escaping "<" is what stops a copy string containing one from closing
      // the script tag early and spilling the rest of the graph into the page.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
