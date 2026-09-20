import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyPath from "@/components/JourneyPath";
import { getGalleryItems, slugify } from "@/lib/gallery";
import { EGYPT_PLACES } from "@/lib/egypt-places-seed";

export default async function CountryGalleryPage({ params }) {
  const { country: countrySlug } = await params;

  let items = EGYPT_PLACES;
  try {
    const live = await getGalleryItems();
    if (live.length > 0) items = live;
  } catch {
    // Firebase not configured yet.
  }

  const countryItems = items.filter(
    (item) => slugify(item.country || "Egypt") === countrySlug
  );

  if (countryItems.length === 0) {
    notFound();
  }

  const countryName = countryItems[0].country || "Egypt";

  const stops = countryItems.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description,
    image: item.url,
  }));

  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-3xl px-6 pt-16 text-center lg:px-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-navy"
          >
            <ArrowLeft size={16} />
            All countries
          </Link>
{/* 
          <h1 className="mt-6 font-display text-4xl italic leading-tight text-charcoal sm:text-5xl">
            {countryName}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
            {stops.length} places, one story.
          </p> */}
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <JourneyPath stops={stops} />
        </section>
      </main>
      <Footer />
    </>
  );
}
