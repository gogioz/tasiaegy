import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export default function ProgramCard({
  id,
  tag,
  duration,
  route,
  title,
  summary,
  imageUrl,
}) {
  return (
    <Link
      href={`/programs/${id}`}
      className="group relative block overflow-hidden rounded-[1.75rem]"
    >
      <div className="relative aspect-[16/8.5] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 900px, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between lg:p-8">
        <div>
          <div className="mb-3 flex items-center gap-3 text-xs text-warm-ivory/85">
            <span
              className={clsx(
                "rounded-full px-3 py-1 font-medium",
                tag === "Signature" && "bg-navy text-warm-ivory",
                tag === "New" && "bg-soft-sand text-charcoal"
              )}
            >
              {tag}
            </span>
            <span>{duration}</span>
            <span className="opacity-60">·</span>
            <span>{route}</span>
          </div>
          <h3 className="font-display text-2xl italic text-warm-ivory sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-warm-ivory/80">
            {summary}
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-warm-ivory px-5 py-2.5 text-sm font-medium text-charcoal transition-colors group-hover:bg-navy group-hover:text-warm-ivory">
          Explore this journey
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
