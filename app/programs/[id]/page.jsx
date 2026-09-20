import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyPath from "@/components/JourneyPath";
import { getProgram } from "@/lib/programs";
import { FALLBACK_PROGRAMS } from "@/lib/fallback-data";

export default async function ProgramJourneyPage({ params }) {
  const { id } = await params;

  let program = null;
  try {
    program = await getProgram(id);
  } catch {
    // Firebase not configured yet.
  }
  if (!program) {
    program = FALLBACK_PROGRAMS.find((p) => p.id === id) ?? null;
  }

  if (!program) {
    notFound();
  }

  const stops = program.itinerary ?? [];

  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-4xl px-6 pt-16 text-center lg:px-10">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-navy"
          >
            <ArrowLeft size={16} />
            All programs
          </Link>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-navy">
            <span className="rounded-full bg-warm-beige px-3 py-1 font-medium text-charcoal">
              {program.tag}
            </span>
            <span className="text-charcoal/60">
              {program.duration} · {program.route}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl italic leading-tight text-charcoal sm:text-5xl">
            {program.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
            {program.summary}
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
          {stops.length > 0 ? (
            <JourneyPath stops={stops} />
          ) : (
            <p className="text-center text-sm text-charcoal/60">
              The day-by-day itinerary for this journey is coming soon.
            </p>
          )}
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-24 text-center lg:px-10">
          <p className="font-display text-2xl italic text-charcoal">
            Ready to live this story?
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-navy px-8 py-3 text-sm font-medium text-warm-ivory transition-colors hover:bg-navy-dark"
          >
            Start your journey
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
