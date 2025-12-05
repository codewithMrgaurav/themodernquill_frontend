"use client";

import { useContent } from "@/contexts/ContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Note: For better SEO, consider converting to server component or using generateMetadata

export default function AboutPage() {
  const { content } = useContent();
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          {content.about.badge}
        </p>
        <h1 className="font-[family:var(--font-heading)] text-4xl font-semibold text-slate-900 sm:text-5xl">
          {t.about.title}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
          {t.about.subtitle}
        </p>
      </header>

      {/* Mission Section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-8 ring-1 ring-blue-100">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          {content.about.mission.title}
        </h2>
        <p className="text-base leading-relaxed text-slate-700">
          {content.about.mission.content}
        </p>
      </div>

      {/* Who We Are Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          {content.about.whoWeAre.title}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {content.about.whoWeAre.engineers.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {content.about.whoWeAre.engineers.description}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <svg
                className="h-6 w-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {content.about.whoWeAre.doctors.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {content.about.whoWeAre.doctors.description}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-base leading-relaxed text-slate-700">
            {content.about.whoWeAre.otherProfessionals}
          </p>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          {content.about.whatWeOffer.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.about.whatWeOffer.features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="mb-2 font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Commitment Section */}
      <div className="rounded-2xl bg-slate-900 p-8 text-white">
        <h2 className="mb-4 text-2xl font-semibold">
          {content.about.commitment.title}
        </h2>
        <p className="text-base leading-relaxed text-slate-200">
          {content.about.commitment.content}
        </p>
      </div>

      {/* Connect Section */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          {content.about.community.title}
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          {content.about.community.description}
        </p>
        <a
          href="/contact"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {content.about.community.cta}
        </a>
      </div>
    </section>
  );
}


