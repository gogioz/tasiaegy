import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import { getPrograms } from "@/lib/programs";
import { FALLBACK_PROGRAMS } from "@/lib/fallback-data";

export default async function ProgramsPage() {
  let programs = FALLBACK_PROGRAMS;
  try {
    const live = await getPrograms();
    if (live.length > 0) programs = live;
  } catch {
    // Firebase not configured yet.
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-14 max-w-lg">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-navy" />
            <span className="text-xs text-navy">Our Programs</span>
          </div>
          <h1 className="font-display text-3xl italic leading-tight text-charcoal sm:text-4xl">
            Every journey, mapped to a{" "}
            <span className="text-navy">curiosity.</span>
          </h1>
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
      </main>
      <Footer />
    </>
  );
}
