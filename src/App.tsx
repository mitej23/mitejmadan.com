import { useEffect } from "react";
import { usePath } from "./lib/router";
import { profile } from "./content";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { HeroWash } from "./components/HeroWash";
import { Overworld } from "./components/Overworld";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Experience } from "./pages/Experience";
import { Photos } from "./pages/Photos";
import { NotFound } from "./pages/NotFound";

/**
 * Single source of truth for routes — the prerender step reads this too.
 * `wide` opts a page out of the 39rem measure; only the photo grid needs it.
 */
export const pages = {
  "/": { el: Home, title: `${profile.name} · ${profile.role}` },
  "/projects": { el: Projects, title: `Projects · ${profile.name}` },
  "/experience": { el: Experience, title: `Experience · ${profile.name}` },
  "/photos": { el: Photos, title: `Photos · ${profile.name}`, wide: true },
} as const;

export function App() {
  const path = usePath();
  const match = pages[path as keyof typeof pages];
  const Page = match?.el ?? NotFound;

  useEffect(() => {
    document.title = match?.title ?? `Not found · ${profile.name}`;
  }, [match]);

  return (
    <>
      {/* Everything the pixelate filter applies to lives in here. It cannot be
          <html>: Chromium computes a filter on the root element but never paints
          it, and filtering the root would also make it the containing block for
          our fixed overlays. */}
      <div id="site">
        <Nav />
        {path === "/" && <HeroWash />}

      {/* Keying on `path` remounts the tree on navigation, which replays every
          `.enter` and re-arms every `.reveal`. The route transition is therefore
          the same choreography as the first load, for no extra code. */}
        <main
          id="main"
          key={path}
          className={`mx-auto w-full px-5 pt-24 pb-20 sm:px-6 sm:pt-28 sm:pb-24 ${
          match && "wide" in match && match.wide
              ? "max-w-[54rem]"
              : "max-w-[var(--container-col)]"
          }`}
        >
          <Page />
          <Footer />
        </main>
      </div>

      <Overworld />
    </>
  );
}
