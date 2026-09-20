"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import Image from "next/image";
import clsx from "clsx";

// Build a smooth curved path through a series of points using a
// Catmull-Rom-to-Bezier conversion, so the line "flows" through every
// marker rather than being made of straight segments.
function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// Rough (straight-line) cumulative distance along the marker points, used
// only to decide when each stop should be considered "reached" by the
// line — doesn't need to be exact-arc-length accurate for that purpose.
function cumulativeFractions(points) {
  if (points.length < 2) return points.map(() => 0);
  const dist = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    dist.push(dist[i - 1] + Math.hypot(dx, dy));
  }
  const total = dist[dist.length - 1] || 1;
  return dist.map((d) => d / total);
}

export default function JourneyPath({ stops }) {
  const uid = useId();
  const containerRef = useRef(null);
  const markerRefs = useRef([]);
  const maskPathRef = useRef(null);

  const [path, setPath] = useState("");
  const [points, setPoints] = useState([]);
  const [pathLength, setPathLength] = useState(0);
  const [progress, setProgress] = useState(0);

  // Measure marker positions and (re)build the curve whenever layout changes.
  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const pts = markerRefs.current
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
          };
        })
        .filter(Boolean);
      setPoints(pts);
      setPath(smoothPath(pts));
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 400);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [stops]);

  // Once the curve's `d` is in the DOM, measure its real length so we can
  // drive the "drawing" animation with stroke-dasharray/offset.
  useEffect(() => {
    if (!path || !maskPathRef.current) return;
    try {
      setPathLength(maskPathRef.current.getTotalLength());
    } catch {
      setPathLength(0);
    }
  }, [path]);

  // Track scroll progress through this section: 0 = section not yet
  // reached, 1 = fully scrolled past.
  useEffect(() => {
    let raf = null;

    function computeProgress() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const p =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);
      setProgress(Math.min(1, Math.max(0, p)));
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        computeProgress();
        raf = null;
      });
    }

    computeProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const fractions = useMemo(() => cumulativeFractions(points), [points]);

  const maskId = `journey-reveal-${uid}`;

  return (
    <div ref={containerRef} className="relative">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <mask id={maskId}>
            <rect x="-20%" y="-20%" width="140%" height="140%" fill="black" />
            {path && pathLength > 0 && (
              <path
                ref={maskPathRef}
                d={path}
                fill="none"
                stroke="white"
                strokeWidth="24"
                strokeLinecap="round"
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength * (1 - progress),
                  transition: "stroke-dashoffset 0.25s linear",
                }}
              />
            )}
          </mask>
        </defs>

        {/* faint full path — always visible, shows the whole route ahead */}
        {path && (
          <path
            d={path}
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2"
            strokeDasharray="1 12"
            strokeLinecap="round"
            opacity="0.25"
          />
        )}

        {/* animated path — only the "walked" portion shows brighter,
            revealed by the mask as the user scrolls */}
        {path && (
          <path
            d={path}
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2.5"
            strokeDasharray="1 12"
            strokeLinecap="round"
            mask={`url(#${maskId})`}
          />
        )}

        {points.map((p, i) => {
          const reached = progress >= fractions[i] - 0.03;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={reached ? 6 : 5}
              className={clsx(
                "transition-all duration-300",
                reached ? "fill-navy stroke-navy" : "fill-warm-ivory stroke-navy"
              )}
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div className="flex flex-col gap-16 sm:gap-24">
        {stops.map((stop, i) => {
          const reached = progress >= (fractions[i] ?? 0) - 0.05;
          return (
            <div
              key={stop.id ?? stop.day ?? i}
              className={clsx(
                "flex flex-col items-center gap-6 sm:flex-row sm:gap-10",
                i % 2 === 1 && "sm:flex-row-reverse"
              )}
            >
              <div
                className="relative w-full max-w-sm shrink-0 sm:w-1/2 transition-all duration-700 ease-out"
                style={{
                  opacity: reached ? 1 : 0.35,
                  transform: reached ? "translateY(0)" : "translateY(28px)",
                }}
              >
                <div className="relative aspect-[4/2] overflow-hidden rounded-[1.75rem]">
                  <Image
                    src={stop.image}
                    alt={stop.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 400px, 90vw"
                  />
                  <span
                    ref={(el) => (markerRefs.current[i] = el)}
                    className="absolute left-1/2 top-full h-px w-px -translate-x-1/2 -translate-y-1/2"
                    aria-hidden
                  />
                </div>
              </div>

              <div
                className="max-w-3xl text-left transition-all duration-700 ease-out sm:text-left"
                style={{
                  opacity: reached ? 1 : 0.35,
                  transform: reached ? "translateY(0)" : "translateY(14px)",
                }}
              >
                {(stop.eyebrow || stop.day != null) && (
                  <p className="text-xs text-navy">
                    {stop.eyebrow ?? `Day ${stop.day}`}
                  </p>
                )}
                <h3 className="font-display text-5xl italic text-charcoal">
                  {stop.title}
                </h3>
                <p className="mt-3 text-xl leading-relaxed text-charcoal/70">
                  {stop.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
