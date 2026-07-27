import { useEffect } from "react";
import { usePath } from "./lib/router";
import { profile } from "./content";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Experience } from "./pages/Experience";
import { NotFound } from "./pages/NotFound";

/** Single source of truth for routes — the prerender step reads this too. */
export const pages = {
  "/": { el: Home, title: `${profile.name} · ${profile.role}` },
  "/projects": { el: Projects, title: `Projects · ${profile.name}` },
  "/experience": { el: Experience, title: `Experience · ${profile.name}` },
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
      <Nav />

      {/* Keying on `path` remounts the tree on navigation, which replays every
          `.enter` and re-arms every `.reveal`. The route transition is therefore
          the same choreography as the first load, for no extra code. */}
      <main
        id="main"
        key={path}
        className="mx-auto w-full max-w-[var(--container-col)] px-5 pt-24 pb-20 sm:px-6 sm:pt-28 sm:pb-24"
      >
        <Page />
        <Footer />
      </main>
    </>
  );
}
