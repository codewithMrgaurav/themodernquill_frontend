"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/contexts/ContentContext";
import { useApi } from "@/contexts/ApiContext";

function NewsletterFormFooterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { subscribeNewsletter } = useApi();
  const { content } = useContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      setMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    const success = await subscribeNewsletter(email.trim(), "footer");

    if (success) {
      setStatus("success");
      setMessage("Successfully subscribed!");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } else {
      setStatus("error");
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={content.footer.newsletter.placeholder}
        disabled={status === "loading"}
        className="w-full rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 outline-none ring-2 ring-transparent backdrop-blur-sm transition-all focus:border-blue-400/50 focus:bg-slate-800/70 focus:ring-blue-400/30 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-500 px-6 py-3 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:via-blue-600 hover:to-sky-600 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === "loading" ? "Subscribing..." : content.footer.newsletter.button}
      </button>
      {message && (
        <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const { content } = useContent();
  return (
    <div className="mt-12 border-t border-blue-500/30 bg-gradient-to-br from-slate-950 via-slate-900 via-blue-950/20 to-slate-950 text-slate-100">
      <footer className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/20 to-sky-500/20 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300 ring-1 ring-blue-500/30">
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
                    className="group rounded-lg px-3 py-2 text-base font-medium text-slate-300 transition-all hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-sky-500/10 hover:text-blue-300 hover:shadow-md"
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
            <NewsletterFormFooterSection />
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700/50 pt-6 text-sm text-slate-400 sm:flex-row">
          <span className="text-base">
            © {new Date().getFullYear()} The Modern Quill. {t.footer.copyright}
          </span>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-base font-medium text-slate-400 transition-all hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-sky-500/10 hover:text-blue-300 hover:px-3 hover:py-1 hover:rounded-lg"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-base font-medium text-slate-400 transition-all hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-sky-500/10 hover:text-blue-300 hover:px-3 hover:py-1 hover:rounded-lg"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

