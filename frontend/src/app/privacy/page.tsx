export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
          Legal
        </p>
        <h1 className="font-[family:var(--font-heading)] text-3xl font-semibold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600">
          This is a placeholder privacy policy page. Replace this content with
          your actual policy text before going live.
        </p>
      </header>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed">
        <p>
          We respect your privacy. This space will outline how analytics,
          cookies, and advertising technologies are used on this blog, following
          applicable regulations.
        </p>
      </div>
    </section>
  );
}


