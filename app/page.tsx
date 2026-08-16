import { Collection } from "@/components/sections/Collection";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Join } from "@/components/sections/Join";
import { Journey } from "@/components/sections/Journey";
import { Note } from "@/components/sections/Note";
import { Principles } from "@/components/sections/Principles";
import { Tracks } from "@/components/sections/Tracks";
import { RailMotion } from "@/components/rail/RailMotion";
import { StructuredData } from "@/components/StructuredData";

/**
 * The walk.
 *
 * Why comes second, directly after the hero. Thosam asked the page to reflect
 * Sinek — people buy why you do it, and what you do proves what you believe —
 * so the reason arrives before the feature list and every section after it
 * reads as evidence. The rest still follows the arc docs/01 gives the journey
 * itself: settle, be let deeper, go out, leave.
 *
 * The kora rail threads the sections together. Each renders its own segment and
 * they stack into one unbroken line, so adding or reordering a section here
 * needs no other change at all.
 *
 * RailMotion renders nothing. It is mounted once, finds the rail by class and
 * drives it, so no section has to become a client component.
 *
 * StructuredData renders nothing visible either — one JSON-LD script, built
 * from the same content/site.ts the sections read, so the machine-readable
 * version of the page can never drift from the page.
 */
export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Note />
        <Tracks />
        <Journey />
        <Collection />
        <Principles />
        <Faq />
        <Join />
      </main>
      <Footer />
      <RailMotion />
    </>
  );
}
