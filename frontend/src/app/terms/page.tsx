export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Legal
        </p>
        <h1 className="font-[family:var(--font-heading)] text-3xl font-semibold text-slate-900">
          Terms of Use
        </h1>
        <p className="text-sm text-slate-600">
          This page gives a simple structure for your website terms. The content
          is a neutral template and must be replaced or expanded by your legal
          advisor so that it matches the laws and regulations that apply in your
          country.
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            State that by accessing or using The Modern Quill, visitors agree to
            be bound by the current version of these Terms of Use. If a visitor
            does not agree, they should not use the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            2. Permitted Use of the Website
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Describe acceptable use of the site and content (for example,
              personal, non‑commercial use, no unlawful activity).
            </li>
            <li>
              Indicate any basic rules that users must follow when interacting
              with the site (for example, no harassment, no misuse of
              interactive features, no attempts to disrupt the service).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            3. Intellectual Property and Content
          </h2>
          <p>
            Explain that the articles, design, and branding of The Modern Quill
            are protected by copyright and other intellectual property rights,
            and that users may use content for personal viewing and reading only
            unless you give written permission for wider reuse. If you accept
            guest posts or third‑party content, clarify how those rights are
            handled.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            4. Disclaimers and Liability
          </h2>
          <p>
            In clear language, say that the information on the site is provided
            for general informational purposes only and is not professional or
            legal advice. Summarize any limitations or exclusions of liability
            that are allowed under your local law and make sure the final text
            is checked by a lawyer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            5. Changes to These Terms
          </h2>
          <p>
            Indicate that you may update these Terms of Use from time to time,
            describe how the new version will be made available, and from which
            date it applies. If your law requires advance notice for important
            changes, include that process here.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            6. Contact Details
          </h2>
          <p>
            Add a short note with an email address or contact form link where
            users can send questions about these terms or other legal matters,
            and confirm that you will respond within a reasonable time in line
            with any regulatory guidance.
          </p>
          <p className="text-xs text-slate-500">
            This template is for layout and structure only and does not replace
            independent legal advice. Always have a qualified professional
            review your final terms before publishing.
          </p>
        </section>
      </div>
    </section>
  );
}
