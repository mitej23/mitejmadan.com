import { PageHead } from "../components/PageHead";
import { PhotoGrid } from "../components/PhotoGrid";
import { photos } from "../content";

export function Photos() {
  return (
    <>
      {/* The grid runs wider than the rest of the site; the header stays in the
          normal measure so the page still reads as the same publication. */}
      <div className="max-w-[var(--container-col)]">
        <PageHead
          title="Photos"
          lede={`Recently picked up a camera. ${photos.length} frames I'm happy with so far — mostly water, weather, and whatever the light was doing.`}
        />
      </div>

      <div className="mt-9">
        <PhotoGrid />
      </div>
    </>
  );
}
