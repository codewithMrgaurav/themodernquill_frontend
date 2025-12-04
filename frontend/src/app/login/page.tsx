"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            {t.login.badge}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t.login.title}
          </h1>
          <p className="text-sm text-slate-600">
            {t.login.subtitle}
          </p>
        </header>
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
          <form className="space-y-6" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                <svg
                  className="h-4 w-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t.login.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t.login.emailPlaceholder}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-amber-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.login.button}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}


