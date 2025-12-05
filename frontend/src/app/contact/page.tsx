"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/contexts/ContentContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const { content } = useContent();
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-12">
      <div className="w-full space-y-8">
        {/* Header Section - Centered */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg">
            <svg
              className="h-8 w-8 text-white"
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
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              {content.contact.badge}
            </p>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              {t.contact.title}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
              {t.contact.subtitle}
            </p>
          </div>
        </header>

        {/* Form Card - Centered with engaging design */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10">
            <form className="space-y-6" noValidate>
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {t.contact.name}
                </label>
                <input
                  id="name"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder={content.contact.form.namePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <svg
                    className="h-4 w-4 text-blue-600"
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
                  {t.contact.email}
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder={content.contact.form.emailPlaceholder}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
                  placeholder={content.contact.form.messagePlaceholder}
                />
              </div>

              <button
                type="button"
                className="group w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-sky-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  {t.contact.sendMessage}
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 grid gap-4 text-center sm:grid-cols-3">
            {content.contact.info.map((info, index) => {
              const icons = {
                email: "📧",
                time: "⏱️",
                support: "💬",
              };
              const colors = {
                email: "from-blue-50 to-blue-100 text-blue-900 text-blue-700",
                response: "from-emerald-50 to-emerald-100 text-emerald-900 text-emerald-700",
                support: "from-purple-50 to-purple-100 text-purple-900 text-purple-700",
              };
              const colorClasses = colors[info.type as keyof typeof colors] || colors.email;
              const [bgColor, textColor, valueColor] = colorClasses.split(" ");

              return (
                <div
                  key={index}
                  className={`rounded-xl bg-gradient-to-br ${bgColor} p-4`}
                >
                  <div className="mb-2 text-2xl">
                    {icons[info.icon as keyof typeof icons] || "📧"}
                  </div>
                  <p className={`text-xs font-semibold ${textColor}`}>
                    {info.label}
                  </p>
                  <p className={`text-xs ${valueColor}`}>{info.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


