"use client";

import { useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { useContent } from "@/contexts/ContentContext";

export function NewsletterForm() {
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

    const success = await subscribeNewsletter(email.trim(), "website");

    if (success) {
      setStatus("success");
      setMessage("Successfully subscribed! Check your email.");
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={content.home.newsletter.placeholder}
          disabled={status === "loading"}
          className="w-full flex-1 rounded-full border border-blue-500/40 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 outline-none ring-1 ring-blue-500/30 transition focus:border-blue-400 focus:ring-blue-400/60 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-600 hover:shadow-blue-500/50 sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Subscribing..." : content.home.newsletter.button}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${status === "success" ? "text-green-400" : status === "error" ? "text-red-400" : "text-slate-400"}`}>
          {message}
        </p>
      )}
      {!message && (
        <p className="text-xs text-slate-400">
          No spam, just the latest stories from The Modern Quill.
        </p>
      )}
    </form>
  );
}

