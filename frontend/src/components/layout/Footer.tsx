"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/contexts/ContentContext";

export function Footer() {
  const { t } = useLanguage();
  const { content } = useContent();
  return (
    <div className="mt-12 border-t border-orange-200/30 bg-gradient-to-br from-slate-950 via-slate-900 via-orange-950/20 to-slate-950 text-slate-100">
      <footer className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-orange-300 ring-1 ring-orange-500/30">
              {content.footer.about.badge}
            </p>
            <h2 className="text-lg font-bold uppercase tracking-wide text-white">
              {content.footer.about.title}
            </h2>
            <p className="text-base leading-relaxed text-slate-300">
              {content.footer.about.description}
            </p>
          </div>
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-lg font-bold uppercase tracking-wide text-white">
              {content.footer.popularTopics.title}
            </h2>
            <div className="grid grid-cols-2 gap-3 text-base text-slate-300 sm:grid-cols-3">
              {content.footer.popularTopics.topics.map((topic, index) => {
                const topicSlug = topic.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    key={index}
                    href={`/category/${topicSlug}`}
                    className="group rounded-lg px-3 py-2 text-base font-medium text-slate-300 transition-all hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-amber-500/10 hover:text-orange-300 hover:shadow-md"
                  >
                    {topic}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-wide text-white">
              {content.footer.newsletter.title}
            </h2>
            <p className="text-base leading-relaxed text-slate-300">
              {content.footer.newsletter.description}
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={content.footer.newsletter.placeholder}
                className="w-full rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 outline-none ring-2 ring-transparent backdrop-blur-sm transition-all focus:border-orange-400/50 focus:bg-slate-800/70 focus:ring-orange-400/30"
              />
              <button
                type="button"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-6 py-3 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-600 hover:via-orange-500 hover:to-amber-600 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {content.footer.newsletter.button}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700/50 pt-6 text-sm text-slate-400 sm:flex-row">
          <span className="text-base">
            © {new Date().getFullYear()} The Modern Quill. {t.footer.copyright}
          </span>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-base font-medium text-slate-400 transition-all hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-amber-500/10 hover:text-orange-300 hover:px-3 hover:py-1 hover:rounded-lg"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-base font-medium text-slate-400 transition-all hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-amber-500/10 hover:text-orange-300 hover:px-3 hover:py-1 hover:rounded-lg"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

