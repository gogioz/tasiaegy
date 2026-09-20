import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGalleryItems, getCountries } from "@/lib/gallery";
import { EGYPT_PLACES } from "@/lib/egypt-places-seed";
import { withTransform } from "@/lib/cloudinary";

export default async function GalleryPage() {
  let items = EGYPT_PLACES;
  try {
    const live = await getGalleryItems();
    if (live.length > 0) items = live;
  } catch {
    // Firebase not configured yet.
  }

  const countries = getCountries(items);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="mb-16 max-w-lg">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-navy" />
            <span className="text-xs text-navy">Gallery</span>
          </div>
          <h1 className="font-display text-2xl italic leading-tight text-charcoal sm:text-4xl">
            Every place a <span className="text-navy">chapter</span> in a
            longer story.
          </h1>
        </div>

        <div className="flex flex-wrap gap-6">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/gallery/${country.slug}`}
              className="group relative block w-full max-w-xs overflow-hidden rounded-[1.75rem] sm:w-72"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={withTransform(
                    country.coverImageUrl,
                    "e_trim",
                    "c_pad,ar_3:4,b_rgb:f9f2e9,q_auto,f_auto"
                  )}
                  alt={country.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 640px) 288px, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h2 className="font-display text-2xl italic text-warm-ivory">
                  {country.name}
                </h2>
                <p className="mt-1 text-sm text-warm-ivory/80">
                  {country.count} {country.count === 1 ? "place" : "places"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
