import { profile } from "../content";
import { LocalTime } from "./LocalTime";
import { Socials } from "./Socials";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <Reveal
      as="footer"
      className="mt-20 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-rule pt-6 sm:mt-24"
    >
      <p className="text-[13px] text-ink-3">
        {profile.location} · <LocalTime /> local
      </p>
      <div className="ml-auto -mr-2">
        <Socials variant="row" />
      </div>
    </Reveal>
  );
}
