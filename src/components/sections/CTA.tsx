import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-center">
      <h2 className="text-5xl font-extrabold">
        Get Started with AKA AI Marketer
      </h2>
      <p className="mt-6 text-xl text-gray-200">
        Automate your social media with AI-powered promotions.
      </p>
      <div className="mt-10">
        <Link
          href="/login"
          className="px-12 py-5 bg-white text-indigo-700 font-bold text-xl rounded-full shadow-lg
                              hover:shadow-2xl hover:scale-110 transition-transform duration-200"
        >
          Sign Up Now
        </Link>
      </div>
    </section>
  );
}
