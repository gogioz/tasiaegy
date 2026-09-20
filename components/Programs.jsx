import ProgramCard from "./ProgramCard";
import { getPrograms } from "@/lib/programs";
import { FALLBACK_PROGRAMS } from "@/lib/fallback-data";

export default async function Programs() {
  let programs = FALLBACK_PROGRAMS;

  try {
    const live = await getPrograms();
    if (live.length > 0) programs = live;
  } catch {
    // Firebase not configured yet — fall back to placeholder programs.
  }

  return (
    <section className="bg-warm-beige/40 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-navy" />
              <span className="text-xs text-navy">Our Programs</span>
            </div>
            <h2 className="max-w-lg font-display text-3xl italic leading-tight text-charcoal sm:text-4xl">
              Stories told over <span className="text-navy">days</span>,
              not minutes.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-charcoal/70">
            Every programme begins as a place and becomes a question. Pick
            the discipline that stirs you — we will map the land to your
            curiosity.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              id={program.id}
              tag={program.tag}
              duration={program.duration}
              route={program.route}
              title={program.title}
              summary={program.summary}
              imageUrl={program.coverImageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
