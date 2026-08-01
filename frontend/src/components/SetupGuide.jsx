import { useState } from 'react'

const STEPS = [
  {
    title: 'Determine if you\'re a reporting entity',
    summary: 'Work out whether the designated services you provide are captured by the AML/CTF Act 2006, including the Tranche 2 expansion now in force.',
    detail: 'Tranche 2 obligations came into force on 1 July 2026, with AUSTRAC enrolment required by 29 July 2026 — both dates have now passed. Tranche 2 brought lawyers and conveyancers, accountants, real estate agents, trust and company service providers (TCSPs), and dealers in precious metals and stones into scope for the first time. If you provide any of the designated services listed under the Act — for example, managing client funds, buying or selling real property on a client\'s behalf, or forming/managing companies and trusts — you\'re likely a reporting entity and everything below applies to you now.',
    why: 'Getting this wrong in either direction is costly: operating without a required program risks enforcement action, while over-building a program you don\'t need wastes time and money.',
  },
  {
    title: 'Enrol with AUSTRAC',
    summary: 'Enrol your business as a reporting entity through AUSTRAC Online before you start providing designated services.',
    detail: 'Enrolment is a prerequisite step, not the end goal — it registers your business with the regulator but doesn\'t by itself satisfy your obligations. You\'ll need your ABN, business details, and a description of the designated services you provide.',
    why: 'You should have an approved AML/CTF Program in place around the same time as enrolment — a gap between enrolling and having a working program is a common first-year finding during independent reviews.',
  },
  {
    title: 'Appoint an AML/CTF Compliance Officer',
    summary: 'Designate a suitably senior, qualified person — often called the MLRO — who is responsible for your AML/CTF Program.',
    detail: 'This person needs enough seniority and authority to make account/matter decisions, escalate suspicious activity, and report to your partners or board. In a small firm this is often a partner or director; it should not be someone without real decision-making authority.',
    why: 'AUSTRAC expects a named, accountable individual — not a shared or undefined responsibility — and this role is central to every other step below.',
  },
  {
    title: 'Conduct an Enterprise-Wide Risk Assessment (EWRA)',
    summary: 'Assess your money laundering and terrorism financing risk across your customer types, services, delivery channels, and jurisdictions.',
    detail: 'Cover every designated service you provide — it\'s a common gap to assess only your highest-risk service line (e.g. company formation) while leaving others (e.g. bookkeeping) unassessed. Your EWRA should be revisited whenever you launch a new service, enter a new jurisdiction, or experience a significant change in your client base.',
    why: 'Your entire AML/CTF Program should be risk-based and built on this assessment — skipping or under-scoping it undermines everything that follows.',
  },
  {
    title: 'Draft your AML/CTF Program (Part A & Part B)',
    summary: 'Part A covers your governance and risk-based framework; Part B covers your customer identification (KYC/CDD) procedures.',
    detail: 'Part A should reflect your actual EWRA findings, not a generic template — it needs to set out your risk appetite, escalation procedures, and the compliance officer\'s role. Part B needs to specify exactly what identification evidence you collect for different customer types and risk levels, including when Enhanced Due Diligence applies (e.g. PEPs, high-risk jurisdictions, unusual structures).',
    why: 'This is the document AUSTRAC and any independent reviewer will actually examine — a program that doesn\'t match how your firm really operates is a bigger problem than having no program at all.',
  },
  {
    title: 'Implement CDD/EDD procedures',
    summary: 'Put your Part B procedures into practice: verify identity, understand beneficial ownership, and apply proportionate scrutiny.',
    detail: 'For TCSPs and company formation agents specifically, this means looking through every company or trust structure to the natural persons who ultimately own or control it — never accepting a nominee, an intermediary, or an unnamed "beneficiary class" as the end of the inquiry.',
    why: 'This is where most real-world AML failures happen — not in the paperwork, but in day-to-day client onboarding decisions.',
  },
  {
    title: 'Set up ongoing monitoring & SMR reporting',
    summary: 'Monitor transactions or matters on an ongoing basis for red flags, and know how to file a Suspicious Matter Report (SMR) with AUSTRAC when required.',
    detail: 'The SMR threshold is "reasonable grounds to suspect" — a materially lower bar than proof. You don\'t need a confession or certainty; an unexplained, undocumented pattern that doesn\'t add up is often enough on its own.',
    why: 'Reporting obligations are ongoing and proactive — they don\'t pause because a client is longstanding or because you\'d rather not raise it.',
  },
  {
    title: 'Train your staff and schedule an independent review',
    summary: 'Ensure everyone involved in delivering designated services has role-appropriate AML/CTF training, and schedule an independent review of your Program.',
    detail: 'Training isn\'t phased in gradually — it applies from the point you become a reporting entity. Independent review is required at least every 3 years, but for a newly implemented program, reviewing earlier (12-18 months) is a good way to catch implementation gaps before they compound.',
    why: 'An untrained team is the most common source of missed red flags, and a program that\'s never independently checked tends to drift from how the business actually operates.',
  },
]

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AML</div>
      <span className="font-semibold text-sm">Intel</span>
    </button>
  )
}

export default function SetupGuide({ onGoHome, onSignUp, onOpenTraining, user }) {
  const [openStep, setOpenStep] = useState(0)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <BackButton onClick={onGoHome} />
        <button onClick={onGoHome} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          ← Back to home
        </button>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">
        <div className="flex flex-col items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Tranche 2 obligations now in force
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            AML/CTF setup guide
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Setting up your AML/CTF program</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          A practical, step-by-step walkthrough for lawyers, accountants, real estate agents, TCSPs, and
          dealers in precious metals & stones now captured by the Tranche 2 reforms — in force since
          1 July 2026, with AUSTRAC enrolment required by 29 July 2026.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 pb-12 space-y-3">
        {STEPS.map((step, i) => {
          const isOpen = openStep === i
          return (
            <div key={step.title} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenStep(isOpen ? -1 : i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="flex-1 font-semibold text-sm">{step.title}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 bg-white dark:bg-slate-900">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{step.summary}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{step.detail}</p>
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Why it matters</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.why}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <p className="font-semibold mb-1">Want help with a specific step?</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Ask the AI assistant for guidance tailored to your firm, or practise real Accountant & TCSP scenarios in Training.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={user ? onOpenTraining : onSignUp}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {user ? 'Practise Accountant & TCSP scenarios →' : 'Sign up free →'}
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-5">
          Educational guidance only — not legal advice. Consult a qualified AML/CTF professional for advice specific to your firm.
        </p>
      </div>
    </div>
  )
}
