export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Legal
        </p>
        <h1 className="font-[family:var(--font-heading)] text-3xl font-semibold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600">
          This page explains in simple terms how we collect, use, and protect
          information on The Modern Quill. It is a structured template only and
          must be reviewed and updated by your legal advisor to meet the
          specific requirements of your country&#39;s laws and regulations.
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            1. Overview
          </h2>
          <p>
            The Modern Quill is an informational blog platform. We collect
            limited information so that we can operate the website, understand
            how it is used, and, if you choose, send you updates or respond to
            your enquiries. This policy describes, at a high level, the types of
            information that may be processed and the main purposes for which it
            is used.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            2. Information You Collect
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-semibold">Contact information</span> (for
              example, name and email address) that visitors provide when they
              fill in a form, subscribe to a newsletter, or contact you.
            </li>
            <li>
              <span className="font-semibold">Technical and usage data</span>{" "}
              such as IP address, browser type, pages visited, and approximate
              location, which may be collected automatically through server logs
              and analytics tools.
            </li>
            <li>
              <span className="font-semibold">Cookie data</span> and similar
              identifiers that help remember preferences and measure how the
              website is used.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            3. How You Use This Information
          </h2>
          <p>
            Information is generally used to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>operate, maintain, and secure the website;</li>
            <li>respond to messages or support requests you send us;</li>
            <li>
              send optional email updates or newsletters if you choose to
              receive them; and
            </li>
            <li>
              analyse aggregated visit data to understand which content is most
              useful and to improve the site.
            </li>
          </ul>
          <p>
            The specific legal bases (for example, consent or legitimate
            interests) depend on the jurisdiction in which you operate and
            should be confirmed in your final policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            4. Cookies and Analytics
          </h2>
          <p>
            The website may use cookies and similar technologies to remember
            user preferences and to measure traffic and performance (for
            example, via privacy‑compliant analytics tools). Your final policy
            should describe which tools you use, how long cookies last, and how
            visitors can disable or manage them in their browser or through a
            consent banner if required by local law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            5. Data Sharing and Retention
          </h2>
          <p>
            Basic information may be shared with trusted service providers such
            as hosting companies, email delivery services, or analytics
            providers, strictly for operating and improving the website. You
            should specify in your final policy which providers you use, the
            safeguards in place, and how long different categories of data are
            stored before being deleted or anonymised.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            6. Your Rights and Contact
          </h2>
          <p>
            Depending on your local law, visitors may have rights such as
            requesting access to their information, asking for corrections, or
            requesting deletion where appropriate. You should clearly set out
            those rights for your jurisdiction and provide a contact email or
            form address where people can raise privacy questions or requests.
          </p>
          <p className="text-xs text-slate-500">
            This template is for design and structure only and does not
            constitute legal advice. Always obtain professional legal review
            before publishing your final privacy policy.
          </p>
        </section>
      </div>
    </section>
  );
}


