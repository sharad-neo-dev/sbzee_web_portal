import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Sbzee",
  description:
    "Learn about Sbzee's mission to bring the daily power of fruits & vegetables to everyone with freshness, science and sustainability.",
  alternates: { canonical: "https://sbzee.com/about" },
};

export default function AboutPage() {
  return (
    <div className=" bg-gray-50 section-padding">
      <div className="container-custom">
        <header className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            About Sbzee
          </h1>
          <p className="text-gray-600">
            We are on a mission to make seasonal fruits and vegetables the easy,
            everyday choice — for better health, taste, and a sustainable
            future.
          </p>
        </header>

        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6">
          {/* <div>
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Sbzee started with a simple belief: nature already gives us what
              our bodies need. By eating with the seasons, we get peak taste and
              peak nutrition — and support local growers and a healthier planet.
            </p>
          </div> */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              At Sbzee, we believe that fresh, healthy food shouldn’t be a
              luxury—it should be a part of everyday life. That’s why we bring
              you farm-fresh fruits and vegetables, sourced directly from
              trusted farmers and suppliers, ensuring every bite is packed with
              natural freshness and nutrition. We understand your time is
              valuable. With doorstep delivery, you can skip the long queues and
              crowded markets—your essentials arrive right at your home, exactly
              when you need them. Our team follows strict quality checks and
              hygiene standards, ensuring that every product you receive is
              safe, fresh, and reliable. And because we value affordability, we
              make sure you get the best quality at the most reasonable
              prices—so you never have to compromise between value and
              freshness.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To redefine the grocery and fresh produce experience in India by
              making healthy, reliable, and fresh food choices accessible to
              every family—at just a click.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              Sbzee is more than just a grocery delivery app—it’s a promise to
              simplify your everyday living. Backed by JVFPL’s values of
              innovation, integrity, and customer-first thinking, we’re on a
              mission to deliver trust, freshness, and convenience to your
              doorstep—one family at a time.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">What We Do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Promote seasonal eating for everyday life.</li>
              <li>Share science-backed tips and simple guides.</li>
              <li>Help you build healthy, joyful food habits.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
            <ul className="grid md:grid-cols-3 gap-4 text-gray-700">
              <li className="bg-gray-50 rounded-xl p-4">Freshness</li>
              <li className="bg-gray-50 rounded-xl p-4">Simplicity</li>
              <li className="bg-gray-50 rounded-xl p-4">Sustainability</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
