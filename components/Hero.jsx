export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/demo/image/upload/w_1920,q_auto,f_auto,e_sepia:30/samples/landscapes/temple.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/10" />

      <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-6 py-28 lg:px-10">
        <h1 className="max-w-xl font-display text-4xl italic leading-tight text-warm-ivory sm:text-5xl lg:text-6xl">
          Don&apos;t see a country.
          <br />
          Live its story.
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-warm-ivory/80">
          TASIA turns travel on its head. Instead of itineraries that tick off
          sights, we design cultural journeys that answer the questions you
          bring — about history, cuisine, architecture, art and belief —
          guided on the ground by people who have spent their lives studying
          them.
        </p>
      </div>

      {/* torn paper edge into the next section */}
      <div className="absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="h-12 w-full text-warm-ivory"
          fill="currentColor"
        >
          <path d="M0,40 L48,32 L96,44 L144,28 L192,40 L240,24 L288,38 L336,30 L384,42 L432,26 L480,36 L528,44 L576,30 L624,40 L672,26 L720,38 L768,30 L816,42 L864,28 L912,38 L960,32 L1008,44 L1056,28 L1104,38 L1152,30 L1200,42 L1248,26 L1296,38 L1344,32 L1392,44 L1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
