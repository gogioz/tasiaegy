import Navbar from "@/components/Navbar";
import AboutTabs from "@/components/AboutTabs";
import Footer from "@/components/Footer";

export default function WhyTasiaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <div className="mx-auto max-w-3xl px-6 pt-8 text-center lg:px-10">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-navy" />
            <span className="text-xs text-navy">Why TASIA</span>
          </div>
          <h1 className="font-display text-3xl italic text-charcoal sm:text-4xl">
            A modern myth, built on real ground.
          </h1>
        </div>
        <AboutTabs />
      </main>
      <Footer />
    </>
  );
}
