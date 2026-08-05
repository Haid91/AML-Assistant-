import Navbar from './Navbar'

const LAST_UPDATED = '3 August 2026'

export default function TermsOfService({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenPrivacyPolicy }) {
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
      />

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-10 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          This is a first draft of AmlIntel's own Terms of Service, written to reasonably reflect how the service
          actually works. It has not been reviewed by a lawyer — treat it as a starting point, not a finished legal
          document, until it has been.
        </div>

        <div className="space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Who these terms apply to</h2>
            <p>
              These terms govern your use of AmlIntel (the "Service"), operated as an Australian business. By
              creating an account or using the Service, you agree to these terms. If you don't agree, don't use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. What AmlIntel is — and isn't</h2>
            <p className="mb-3">
              AmlIntel is an AI-assisted AML/CTF and Privacy Act compliance education and drafting tool. It provides
              regulatory training guidance, generates draft compliance documents based on information you provide,
              and offers exam preparation content.
            </p>
            <p>
              <strong>AmlIntel does not provide legal advice.</strong> AI-generated content — including drafted
              AML/CTF Programs, Privacy Act documents, and chat responses — is a starting point, not a substitute
              for review by a qualified AML/CTF or privacy professional. You're responsible for having any document
              you intend to rely on reviewed before you rely on it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Accounts</h2>
            <p>
              You need an account to access most features. You're responsible for keeping your login credentials
              confidential and for all activity under your account. Tell us if you believe your account has been
              compromised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Subscriptions &amp; billing</h2>
            <p className="mb-3">
              Premium is a recurring monthly subscription billed via Stripe. By subscribing, you authorise recurring
              charges to your payment method until you cancel. AmlIntel never sees or stores your card details —
              Stripe handles payment processing directly.
            </p>
            <p>
              You can cancel at any time from your account settings; cancelling stops future renewals, and your
              Premium access continues until the end of the billing period you've already paid for. We don't
              provide prorated refunds for partial billing periods, except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">5. Acceptable use</h2>
            <p>
              Don't use the Service to break the law, to attempt to access other users' accounts or data, to
              interfere with the Service's operation, or to resell or redistribute the Service itself. Free,
              no-signup tools are provided for individual use in assessing your own circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">6. Your content, and content we generate for you</h2>
            <p>
              You own the business information you enter and the documents AmlIntel generates for you. You grant us
              a licence to process that information solely to provide the Service — including sending relevant
              details to our AI provider to generate responses and drafts, as described in the{' '}
              <button onClick={onOpenPrivacyPolicy} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Privacy Policy</button>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">7. Disclaimer &amp; limitation of liability</h2>
            <p className="mb-3">
              The Service, including all AI-generated content, is provided "as is" without warranties of accuracy,
              completeness, or fitness for a particular regulatory outcome. Regulatory requirements change, and
              AI-generated drafts can contain errors — you're responsible for independent verification before
              relying on any output for compliance purposes.
            </p>
            <p>
              To the maximum extent permitted by law, AmlIntel is not liable for any loss arising from your use of
              the Service, including reliance on AI-generated guidance or documents. Nothing in these terms excludes
              any guarantee, right, or remedy you have under the Australian Consumer Law that can't lawfully be
              excluded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">8. Termination</h2>
            <p>
              You can stop using the Service and delete your account at any time. We may suspend or terminate
              accounts that breach these terms, including abusive use of AI features or attempts to circumvent
              subscription limits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">9. Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the Service after an update means you
              accept the revised terms. Material changes will be reflected by updating the "Last updated" date above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">10. Governing law</h2>
            <p>
              These terms are governed by the laws of Australia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">11. Contact</h2>
            <p>
              Questions about these terms?{' '}
              <button onClick={onOpenContact} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Get in touch</button>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
