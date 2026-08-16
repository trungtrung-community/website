import { Collection } from "@/components/sections/Collection";
import { Crossing } from "@/components/sections/Crossing";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Join } from "@/components/sections/Join";
import { Journey } from "@/components/sections/Journey";
import { Note } from "@/components/sections/Note";
import { Principles } from "@/components/sections/Principles";
import { Tracks } from "@/components/sections/Tracks";

/**
 * The walk.
 *
 * Section order follows the arc docs/01 gives the journey itself — arrive,
 * settle, be let deeper, go out, leave — and the kora rail threads them
 * together. Each section renders its own segment of that rail, so adding or
 * reordering a section here needs no other change.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Tracks />
        <Journey />
        <Crossing />
        <Collection />
        <Principles />
        <Note />
        <Join />
      </main>
      <Footer />
    </>
  );
}
