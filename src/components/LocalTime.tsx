import { useEffect, useState } from "react";
import { profile } from "../content";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: profile.timezone,
});

/**
 * Mumbai wall-clock time. A small signal that a person is behind the page.
 *
 * Starts as a placeholder rather than a value: this page is prerendered at build
 * time, so any clock baked into the HTML would ship frozen at whenever the build
 * ran. The real time lands on mount, and tabular figures keep the width fixed so
 * nothing shifts when it does.
 */
export function LocalTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();

    // Align to the top of the next minute, then tick minutely — otherwise the
    // display can sit up to a full minute stale.
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return <span className="tnum">{now ?? "--:--"}</span>;
}
