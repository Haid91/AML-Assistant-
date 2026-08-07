import Navbar from './Navbar'

const LAST_UPDATED = '7 August 2026'

export default function PrivacyPolicy({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenTermsOfService }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Navbar
        user={user}
        onGoHome={onGoHome}
        onNavigateSection={onNavigateSection}
        onStart={onStart}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onOpenChat={onOpenChat}
        onOpenTraining={onOpenTraining}
        onSignOut={onSignOut}
        onOpenSettings={onOpenSettings}
        onOpenAbout={onOpenAbout}
        onOpenContact={onOpenContact}
        onOpenCost={onOpenCost}
        onOpenSetupGuide={onOpenSetupGuide}
        onOpenEligibility={onOpenEligibility}
        onOpenProgramBuilder={onOpenProgramBuilder}
        onOpenAustracEnrolment={onOpenAustracEnrolment}
        onOpenSmrGuide={onOpenSmrGuide}
        onOpenComplianceOfficer={onOpenComplianceOfficer}
        onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators}
        onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceCalendar={onOpenComplianceCalendar}
        onOpenClientRiskRegister={onOpenClientRiskRegister}
        onOpenReportableTransactionCheck={onOpenReportableTransactionCheck}
        onOpenComplianceDashboard={onOpenComplianceDashboard}
        onOpenSmrDraft={onOpenSmrDraft}
      />

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          AmlIntel is operated by <strong>Haider Shahid (ABN 78 745 780 870)</strong>, trading as AmlIntel ("we", "us",
          "our"). This policy covers how we handle personal information about <em>you</em>, as a user of this site —
          it's separate from the Privacy Pack tool, which drafts a Privacy Policy for <em>your own</em> business.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
          We comply with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
        </p>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-10 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          This is a first draft, written to reasonably reflect what the product actually collects and does with it.
          It has not been reviewed by a lawyer — treat it as a starting point, not a finished legal document, until
          it has been.
        </div>

        <div className="space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Information we collect</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Account details:</strong> name, email address, and a securely hashed password (we never store your password in plain text).</li>
              <li><strong>Business information you enter:</strong> details you type into tools like Program Builder, Privacy Pack, and the AI Assistant — used to generate drafts and responses relevant to your business.</li>
              <li><strong>Content you generate:</strong> drafted documents, chat messages, compliance calendar dates, and CAMS mock exam scores, stored so you can come back to them.</li>
              <li><strong>Client Risk Register entries:</strong> metadata only — risk rating, CDD type, and review dates. The tool is designed so you shouldn't enter client names, dates of birth, or identity document numbers.</li>
              <li><strong>Payment information:</strong> handled entirely by Stripe. AmlIntel never receives or stores your card number — we only keep a Stripe customer/subscription reference.</li>
              <li><strong>Free tools:</strong> the no-signup tools (Eligibility Check, Reportable Transaction Check, and similar) don't require an account and don't send your answers to our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. How we use it</h2>
            <p>We use your information to: provide and maintain your account and saved data; generate AI responses and drafted documents relevant to your business; process your subscription; send transactional emails (password resets, contact-form replies); and improve the Service. We don't sell your personal information, and we don't run advertising or ad-tracking on this site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Who we share it with</h2>
            <p className="mb-3">We share data with a small number of service providers who help us run AmlIntel, each acting only on our instructions:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Anthropic</strong> — the AI provider that generates chat responses and drafted documents. Relevant business details and conversation content are sent to Anthropic's API to generate a response. Under Anthropic's commercial API terms, this data is not used to train their models, and is automatically deleted from their systems within 30 days.</li>
              <li><strong>Stripe</strong> — processes subscription payments. Card details go directly to Stripe; we don't see or store them.</li>
              <li><strong>Resend</strong> — sends transactional email (password resets, contact-form replies).</li>
              <li><strong>Supabase</strong> and <strong>Render</strong> — host our database and application infrastructure.</li>
            </ul>
            <p className="mt-3">We don't share your information with anyone else, except where required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Cookies &amp; local storage</h2>
            <p>
              AmlIntel doesn't use tracking or advertising cookies. Your browser's local storage is used to keep you
              signed in (a session token) and to remember your light/dark theme preference — this stays on your
              device and isn't shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">5. Overseas disclosure</h2>
            <p>
              Some of the service providers listed above are based, or store and process data, outside Australia —
              including Anthropic and Resend (United States) and Stripe (global infrastructure including the United
              States). By using the related features (the AI Assistant, document drafting, email, and payments),
              your information may be disclosed overseas as a result. We take reasonable steps to ensure these
              providers handle your data consistently with the Australian Privacy Principles, including through
              their own commercial data-processing terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">6. Data breaches</h2>
            <p>
              We comply with the Notifiable Data Breaches scheme under the Privacy Act 1988 (Cth). If a data breach
              occurs that is likely to result in serious harm, we will assess it promptly and notify affected
              individuals and the Office of the Australian Information Commissioner (OAIC) as required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">7. Data retention</h2>
            <p>
              We retain your account and associated data for as long as your account is active. If you delete your
              account, we delete your personal information, except where we're required to retain it (for example,
              billing records) for legal or accounting purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">8. Security</h2>
            <p>
              Passwords are hashed, not stored in plain text. Data is transmitted over HTTPS. No online service can
              guarantee perfect security, but we take reasonable steps to protect your information against
              unauthorised access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">9. Your rights</h2>
            <p className="mb-3">
              AmlIntel handles personal information in line with the Australian Privacy Principles under the
              Privacy Act 1988 (Cth). You can access, correct, or request deletion of your personal information at
              any time — most of this is available directly in your account settings, or you can{' '}
              <button onClick={onOpenContact} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">contact us</button>.
            </p>
            <p>
              If you believe we've mishandled your personal information, you can also lodge a complaint with the{' '}
              <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Office of the Australian Information Commissioner (OAIC)
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">10. Children's privacy</h2>
            <p>AmlIntel is a business compliance tool and isn't intended for use by anyone under 18 years of age. We don't knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">11. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be reflected by updating the "Last
              updated" date above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">12. Contact</h2>
            <p>
              Questions about this policy or your data?{' '}
              <button onClick={onOpenContact} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Get in touch</button>,
              or see the{' '}
              <button onClick={onOpenTermsOfService} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Terms of Service</button>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
