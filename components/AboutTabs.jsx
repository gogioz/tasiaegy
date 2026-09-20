"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

const TABS = [
  { key: "vision", label: "Vision" },
  { key: "impact", label: "Impact" },
  { key: "why", label: "Why" },
];

const CONTENT = {
  vision: {
    eyebrow: "About Us",
    heading: "Beyond What you",
    highlight: "see.",
    body: (
      <>
        <p>
          TASIA is a cultural travel brand that creates meaningful journeys
          across Egypt and beyond, connecting travelers with the history,
          cultures, and human stories that shaped the world we know today.
        </p>
        <p className="mt-4">
          We go beyond conventional tourism to transform places, heritage,
          and ancient traces into immersive experiences of discovery,
          knowledge, and connection.
        </p>
        <p className="mt-6 font-medium text-charcoal">Our Philosophy</p>
        <p className="mt-2">
          We believe every trace of humanity carries a story. A monument, a
          city, an ancient object, a tradition, or a work of art is more
          than a remnant of the past — it is evidence of humanity&apos;s
          timeless attempt to understand life, nature, society, and the
          universe.
        </p>
        <p className="mt-4">
          TASIA sees travel as a journey through places, time, cultures, and
          human thought — one that begins with discovering the world and
          ultimately leads us closer to understanding ourselves.
        </p>
      </>
    ),
  },
  impact: {
    eyebrow: "About Us",
    heading: "What makes us",
    highlight: "Different.",
    body: (
      <ul className="mt-2 space-y-3">
        <li>We go beyond sightseeing.</li>
        <li>
          While traditional tourism focuses on what travelers see, TASIA
          focuses on what they understand, feel, and take away from it.
        </li>
        <li>
          We transform monuments, landscapes, traditions, and historical
          traces into stories that reveal how people lived, thought,
          created, and understood their world.
        </li>
        <li>
          Every journey is designed to move from observation to
          understanding.
        </li>
      </ul>
    ),
  },
  why: {
    eyebrow: "About Us",
    heading: "Why choose",
    highlight: "TASIA?",
    body: (
      <>
        <p>
          Because we believe the most valuable souvenir is not something you
          bring home — it is something you understand.
        </p>
        <p className="mt-4 font-medium text-charcoal">
          Our journeys combine:
        </p>
        <ul className="mt-2 space-y-2">
          <li>Personalized itineraries shaped around each traveler</li>
          <li>Cultural depth beyond conventional tourist narratives</li>
          <li>Expert knowledge delivered through meaningful storytelling</li>
          <li>
            Authentic experiences that bring travelers closer to local
            cultures
          </li>
          <li>Immersive journeys designed to create lasting impressions</li>
        </ul>
        <p className="mt-6 font-medium text-charcoal">
          Thoughtful service from the first step to the last:
        </p>
        <ul className="mt-2 space-y-2">
          <li>Seamless airport reception &amp; assistance</li>
          <li>Handpicked accommodation &amp; private transportation</li>
          <li>Expert Egyptologist guides</li>
          <li>Curated cultural &amp; authentic local experiences</li>
          <li>Personalized support throughout your journey</li>
          <li>Professional travel photography</li>
        </ul>
      </>
    ),
  },
};

export default function AboutTabs() {
  const [active, setActive] = useState("vision");
  const content = CONTENT[active];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-16 flex justify-center">
        <div className="flex rounded-full bg-warm-beige p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={clsx(
                "rounded-full px-8 py-3 text-sm font-medium transition-colors",
                active === tab.key
                  ? "bg-navy text-warm-ivory"
                  : "text-charcoal/70 hover:text-charcoal"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-charcoal/15" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
            <Image
              src="https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto,e_sepia:20/samples/people/kitchen-bar.jpg"
              alt="An Egyptologist studying ancient hieroglyphs by torchlight"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 400px, 90vw"
            />
            <div className="absolute bottom-5 left-5 rounded-xl bg-charcoal/80 px-5 py-3 text-warm-ivory backdrop-blur-sm">
              <p className="font-display text-2xl italic">7,000</p>
              <p className="mt-1 max-w-[10rem] text-xs leading-snug text-warm-ivory/80">
                years of story, told in the present tense
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-navy" />
            <span className="text-xs text-navy">{content.eyebrow}</span>
          </div>
          <h2 className="font-display text-3xl italic leading-tight text-charcoal sm:text-4xl">
            {content.heading} <span className="text-navy">{content.highlight}</span>
          </h2>
          <div className="mt-6 max-w-lg text-sm leading-relaxed text-charcoal/75">
            {content.body}
          </div>
        </div>
      </div>
    </section>
  );
}
