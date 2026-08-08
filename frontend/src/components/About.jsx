import Navbar from './Navbar'

const FEATURES = [
  {
    title: 'Realistic case guidance',
    desc: 'Get structured answers on KYC, CDD, EDD, SARs, and CTRs — built around real regulatory requirements across multiple jurisdictions and industries.',
  },
  {
    title: 'FATF-aligned framework',
    desc: 'Every response is grounded in FATF 40 Recommendations, BSA requirements, EU AML Directives, and FinCEN guidance — the global regulatory standard.',
  },
  {
    title: 'AI compliance assistant',
    desc: 'Ask anything — red flags, structuring, PEPs, OFAC sanctions, beneficial ownership, correspondent banking, trade-based money laundering, and more.',
  },
  {
    title: 'Built for compliance teams',
    desc: 'Designed for AML analysts, BSA officers, compliance managers, and MLROs who need fast, accurate regulatory answers without searching through dense guidance documents.',
  },
]

export default function About({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator }) {
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
        onOpenSanctionsScreening={onOpenSanctionsScreening}
        onOpenOwnershipCalculator={onOpenOwnershipCalculator}
      />

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About AmlIntel</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
          An AI-powered AML compliance assistant and training platform for analysts, MLROs, and compliance teams —
          built around real regulatory frameworks, not generic AI advice.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 pb-16 space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-2">Who it's for</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            AML analysts, MLROs, BSA officers, and compliance managers who need fast, accurate regulatory answers
            without digging through dense guidance documents — whether you're investigating a case, drafting an
            SMR/SAR, or preparing for the CAMS exam. It's also built for firms now captured by Australia's
            Tranche 2 reforms, in force since 1 July 2026 — lawyers and conveyancers, accountants, real estate
            agents, trust and company service providers, and dealers in precious metals and stones — who are
            standing up an AML/CTF program for the first time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">How it works</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The AI assistant is powered by Anthropic's Claude and grounded in FATF 40 Recommendations, the Bank
            Secrecy Act, EU AML Directives, FinCEN guidance, and AUSTRAC's AML/CTF Act — so answers are structured
            and regulation-backed rather than generic. Alongside the assistant, AmlIntel includes realistic case
            simulations across Banking, Law, Crypto, Fintech, and Accountant & TCSP for both Analyst and MLRO
            roles, an Ownership Structure Simulation for practising UBO/beneficial-ownership analysis, and a full
            CAMS Sixth Edition exam-prep module.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Built on the compliance desk</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            The guidance in this assistant isn't just from regulation documents — it's shaped by the real-time
            judgement calls made by compliance professionals in the field.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 mb-6">
            <div className="text-6xl leading-none text-blue-600/25 font-serif mb-2 select-none">"</div>
            <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-slate-200 mb-8">
              The questions analysts ask in the middle of a live investigation are never in the textbook. This tool
              is shaped by years of real casework — the red flags that actually matter, the SMRs that hold up under
              scrutiny, and the judgement calls that protect your organisation.
            </blockquote>
            <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0 tracking-tight text-white">
                CO
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Senior Compliance Officer</p>
                <p className="text-xs text-slate-400 mt-0.5">AML/CTF · AUSTRAC regulated entities · Financial crime investigations · FATF typologies</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                stat: 'Multi-sector',
                label: 'AML compliance experience',
                desc: 'Front-line experience across banking, remittance, fintech, and digital asset sectors.',
              },
              {
                stat: 'AUSTRAC',
                label: 'Regulatory expertise',
                desc: 'Hands-on knowledge of AUSTRAC reporting obligations, AML/CTF programs, and enforcement outcomes.',
              },
              {
                stat: 'Live cases',
                label: 'Investigation background',
                desc: 'Guidance shaped by real SMR decisions, transaction monitoring reviews, and customer due diligence investigations.',
              },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <p className="text-2xl font-bold text-blue-600 mb-1">{item.stat}</p>
                <p className="font-semibold text-sm mb-2">{item.label}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Setting up your AML/CTF program</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            If your firm has been captured by the Tranche 2 reforms, AmlIntel has two things to help you get
            started: a free step-by-step setup guide covering enrolment, appointing a compliance officer, your
            risk assessment, and drafting your Part A & B program — and dedicated Accountant & TCSP training
            scenarios covering the CDD failures that most commonly trip up newly regulated firms, like nominee
            director red flags and opaque company formation requests.
          </p>
          <button
            onClick={onOpenSetupGuide}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View the setup guide →
          </button>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Why AmlIntel</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Generic AI tools don't know the difference between an SMR and a SAR, or when a foreign PEP requires
            mandatory EDD. AmlIntel is purpose-built for compliance work — every response and every training
            scenario is grounded in real frameworks across multiple jurisdictions and industries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">What you get</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-4 border-t border-slate-200 dark:border-slate-800">
          Fictional scenarios for educational purposes only. Not legal advice.
        </p>
      </div>

      {/* CTA */}
      {!user && (
        <div className="max-w-3xl mx-auto px-6 pb-20 flex items-center justify-center gap-3">
          <button
            onClick={onSignUp}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Sign up free →
          </button>
          <button
            onClick={onSignIn}
            className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  )
}
