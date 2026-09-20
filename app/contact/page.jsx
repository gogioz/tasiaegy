import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, AtSign } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="mb-14 max-w-lg">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-navy" />
            <span className="text-xs text-navy">Contact Us</span>
          </div>
          <h1 className="font-display text-3xl italic leading-tight text-charcoal sm:text-4xl">
            Tell us the question your{" "}
            <span className="text-navy">next trip</span> should answer.
          </h1>
        </div>

        <div className="grid gap-14 lg:grid-cols-2">
          <form className="flex flex-col gap-5">
            <div>
              <label className="text-xs text-charcoal/60">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-navy"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs text-charcoal/60">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-navy"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-charcoal/60">
                What are you curious about?
              </label>
              <textarea
                name="message"
                rows={5}
                className="mt-1 w-full rounded-xl border border-charcoal/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-navy"
                placeholder="Tell us about the journey you're imagining..."
              />
            </div>
            <button
              type="submit"
              className="mt-2 self-start rounded-full bg-navy px-8 py-3 text-sm font-medium text-warm-ivory transition-colors hover:bg-navy-dark"
            >
              Send inquiry
            </button>
          </form>

          <div className="space-y-6 text-sm text-charcoal/75">
            <div className="flex items-start gap-4">
              <Phone size={18} className="mt-0.5 text-navy" />
              <div>
                <p className="text-charcoal">Phone</p>
                <p className="mt-1">+1 555 018 4402</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={18} className="mt-0.5 text-navy" />
              <div>
                <p className="text-charcoal">Email</p>
                <p className="mt-1">wander@tasia.travel</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <AtSign size={18} className="mt-0.5 text-navy" />
              <div>
                <p className="text-charcoal">Social</p>
                <p className="mt-1">@tasia.travel</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
