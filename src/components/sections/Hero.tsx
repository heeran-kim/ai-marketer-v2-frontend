import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-center relative">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
          AI-Powered Marketing
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4">
          Boost Your Social Media with AI Captions
        </h1>

        <p className="text-base md:text-lg text-indigo-100 mt-4">
          Let AI analyze your images and generate engaging captions instantly.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
