import { useState, useEffect } from 'react'
import Navbar from './Navbar'

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Realistic case guidance',
    desc: 'Get structured answers on KYC, CDD, EDD, SARs, and CTRs — built around real regulatory requirements across multiple jurisdictions and industries.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'FATF-aligned framework',
    desc: 'Every response is grounded in FATF 40 Recommendations, BSA requirements, EU AML Directives, and FinCEN guidance — the global regulatory standard.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI compliance co-pilot',
    desc: 'Ask anything — red flags, structuring, PEPs, OFAC sanctions, beneficial ownership, correspondent banking, trade-based money laundering, and more.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Built for compliance teams',
    desc: 'Designed for AML analysts, BSA officers, compliance managers, and MLROs who need fast, accurate regulatory answers without searching through dense guidance documents.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM9 7h1" />
      </svg>
    ),
    title: 'Tranche 2 program setup',
    desc: 'A free step-by-step guide to standing up your AML/CTF program — AUSTRAC enrolment, appointing a compliance officer, your risk assessment, and Part A/B drafting — plus dedicated training scenarios for lawyers, accountants, real estate agents, and TCSPs now captured by Tranche 2, in force since 1 July 2026.',
    span: true,
  },
]

const ENFORCEMENT_CASES = [
  {
    entity: 'Commonwealth Bank',
    year: '2018',
    amount: '$700M',
    desc: 'Penalty for over 53,000 contraventions of the AML/CTF Act, including failures to report threshold transactions on time and inadequate ongoing customer due diligence.',
  },
  {
    entity: 'Westpac',
    year: '2020',
    amount: '$1.3B',
    desc: "Australia's largest ever civil penalty, for over 23 million breaches including failures to report international funds transfers and inadequate monitoring of transactions linked to child exploitation risks.",
  },
  {
    entity: 'Crown Resorts',
    year: '2023',
    amount: '$450M',
    desc: 'Penalty for failing to properly assess and manage money laundering risk across its casino operations, including inadequate customer due diligence on high-risk patrons.',
  },
]

const SECTORS = [
  {
    id: 'lawyer',
    title: 'Legal',
    desc: 'Lawyers, solicitors & conveyancers',
    bullets: [
      'Designated services include property settlements, trust account management, and company/trust formation',
      'CDD required before or during retainer, with EDD for high-risk matters',
      'Legal professional privilege doesn\'t exempt AML/CTF reporting obligations',
    ],
  },
  {
    id: 'realestate',
    title: 'Real Estate',
    desc: 'Agents, property managers & auctioneers',
    bullets: [
      'Buying or selling real property on a client\'s behalf is a designated service',
      'Verify source of funds for high-value or cash-heavy transactions',
      'Watch for red flags like third-party payments and rapid on-sales',
    ],
  },
  {
    id: 'accountant',
    title: 'Accountants',
    desc: 'Accountants, tax & BAS agents, bookkeepers',
    bullets: [
      'Managing client funds or financial assets brings you into scope',
      'CDD failures in company formation are a common first-year finding',
      'Dedicated Accountant & TCSP training scenarios available in AmlIntel',
    ],
  },
  {
    id: 'tcsp',
    title: 'Conveyancers & TCSPs',
    desc: 'Trust & company service providers',
    bullets: [
      'Forming, operating, or managing companies and trusts is a designated service',
      'Must look through nominee directors and opaque structures to identify beneficial owners',
      'Registered office and nominee services carry elevated ML/TF risk',
    ],
  },
  {
    id: 'bullion',
    title: 'Jewellers & Bullion Dealers',
    desc: 'Precious metals & stones dealers',
    bullets: [
      'High-value cash transactions in precious metals/stones are designated services',
      'Threshold transaction reporting applies to qualifying cash transactions',
      'Structuring (splitting transactions to avoid reporting) is a key red flag',
    ],
  },
]

const REG_FAQS = [
  {
    q: 'Who needs to comply with AUSTRAC AML/CTF regulations?',
    a: 'Any business providing a "designated service" under the AML/CTF Act 2006 is a reporting entity. This has always covered banks, remittance providers, and casinos, and since the Tranche 2 reforms came into force on 1 July 2026, it now also covers lawyers and conveyancers, accountants, real estate agents, trust and company service providers, and dealers in precious metals and stones.',
  },
  {
    q: 'What happens if I don\'t comply?',
    a: 'AUSTRAC can take civil and criminal enforcement action. Maximum penalties are up to $36.4 million per contravention for companies and $7.28 million for individuals. Non-compliance also carries reputational and operational risk — AUSTRAC has pursued major enforcement actions against Australian banks and casinos for AML/CTF program failures.',
  },
  {
    q: 'Do I need a lawyer to set up my AML/CTF program?',
    a: 'Not necessarily — AUSTRAC provides free guidance, and many businesses build a compliant program using guides like AmlIntel\'s setup walkthrough. That said, this is educational guidance, not legal advice, and firms with complex structures or higher-risk client bases should get advice from a qualified AML/CTF professional.',
  },
]

export default function LandingPage({ user, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenSectorGuide, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onGoHome, onNavigateSection, scrollTarget, onScrollHandled }) {
  const [camsOpen, setCamsOpen] = useState(false)

  useEffect(() => {
    if (!scrollTarget) return
    const el = document.getElementById(scrollTarget)
    el?.scrollIntoView({ behavior: 'smooth' })
    onScrollHandled?.()
  }, [scrollTarget, onScrollHandled])

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
      />

      {/* CAMS strip */}
      <div className="bg-violet-950/70 border-b border-violet-800/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="py-2 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-violet-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="text-xs text-violet-300 font-medium">
              CAMS certification prep material also available — free preview,{' '}
              <button
                onClick={() => setCamsOpen(v => !v)}
                className="inline-flex items-center gap-1 text-violet-100 font-semibold hover:text-white transition-colors"
              >
                full access with Premium
                <svg
                  className={`w-4 h-4 text-violet-400 transition-transform duration-200 ${camsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </p>
          </div>

          {camsOpen && (
            <div className="pb-4 pt-1 grid sm:grid-cols-2 gap-x-12 gap-y-1.5">
              {[
                '258 exam-style MCQs across 4 ACAMS chapters — first 6 free per chapter, rest with Premium',
                'Sourced from real CAMS exam question banks and reviewed by a CAMS-certified AML professional',
                'Chapter 1 — Risks & Methods of ML and Terrorist Financing',
                'Chapter 2 — International AML/CFT Standards (FATF, Palermo, Vienna)',
                'Chapter 3 — AML/CFT Compliance Programmes (CDD, EDD, PEPs, EWRA)',
                'Chapter 4 — Conducting & Responding to Investigations (SARs, MLATs)',
                'Detailed answer explanations for every question',
                'Covers FATF 40 Recommendations, EU AMLDs, BSA, AUSTRAC & more',
                'Progress tracking — resume where you left off',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                  <span className="text-xs text-violet-200">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="text-center pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 inline-block"></span>
            AUSTRAC guidance · FATF-aligned · BSA compliant · For compliance professionals
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Risk-based AML<br />
            <span className="text-blue-600">compliance assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            An intelligent knowledge base that puts you inside KYC, transaction monitoring, and sanctions investigations — with instant, regulation-backed answers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors text-sm"
            >
              {user ? 'Open Assistant →' : 'Get started free →'}
            </button>
            {!user && (
              <button
                onClick={onSignIn}
                className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm text-center"
              >
                Sign in
              </button>
            )}
            {user && (
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm text-center"
              >
                See features
              </a>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">
            Fictional scenarios for educational purposes only. Not legal advice.
          </p>
        </div>
      </section>

      {/* Choose your path */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">AML professional?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
              Case simulations, CAMS exam prep, and an AI assistant grounded in FATF, BSA, and AUSTRAC guidance.
            </p>
            <button onClick={() => onNavigateSection?.('features')} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              See what's inside →
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7">
            <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Tranche 2 business?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
              Lawyers, accountants, real estate agents, and more now need an AML/CTF program. Find out if this applies to you.
            </p>
            <button onClick={onOpenEligibility} className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors">
              Check if this applies to you →
            </button>
          </div>
        </div>
      </section>

      {/* Cost of non-compliance */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-widest font-medium mb-3">The cost of getting it wrong</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Non-compliance is expensive</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              AUSTRAC has a track record of major enforcement action against businesses with inadequate AML/CTF programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {ENFORCEMENT_CASES.map((c) => (
              <div key={c.entity} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{c.amount}</p>
                <p className="font-semibold text-sm mb-1">{c.entity} · {c.year}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
              Maximum civil penalties are now up to <strong>$36.4 million per contravention</strong> for companies and <strong>$7.28 million</strong> for individuals (100,000 / 20,000 penalty units at $364/unit, effective 1 July 2026).
            </p>
            <button
              onClick={onOpenEligibility}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Check if this applies to you →
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-medium mb-3">What you get</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for AML compliance</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Built around real regulatory frameworks — from FATF recommendations to BSA requirements to AUSTRAC guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 rounded-2xl p-7 transition-colors group shadow-sm ${f.span ? 'md:col-span-2' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for your Tranche 2 sector */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-medium mb-3">Built for your sector</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tailored to Tranche 2 industries</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Guidance and training scoped to the designated services your industry actually provides.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {SECTORS.map((s) => (
              <div key={s.title} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col">
                <h3 className="font-semibold text-lg mb-0.5">{s.title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{s.desc}</p>
                <ul className="space-y-2.5 mb-5 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onOpenSectorGuide?.(s.id)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors text-left"
                >
                  View sector guide →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-medium mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Free */}
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 flex flex-col">
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-3">Free</p>
              <div className="mb-2 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">/forever</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">All Analyst & MLRO training, no card required.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'All Analyst & MLRO training modules, every industry',
                  'Ownership Structure Simulation',
                  'CAMS exam prep — 6 of 20 questions per chapter',
                  'AUSTRAC e-learning overview',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onSignIn}
                className="w-full py-3 border border-slate-300 dark:border-slate-500 rounded-xl text-slate-800 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Sign in to start
              </button>
            </div>

            {/* Premium */}
            <div className="relative bg-white dark:bg-slate-700 border-2 border-slate-900 dark:border-slate-400 rounded-2xl p-8 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-3">Premium</p>
              <div className="mb-1 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$49.99</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">/month</span>
              </div>
              <p className="text-orange-500 text-sm font-semibold mb-6">7-day free trial. Cancel anytime.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'AI compliance co-pilot trained on FATF, AUSTRAC & global regulations',
                  'Full SMR/SAR drafting assistance',
                  'Full CAMS exam prep — all 20 questions per chapter',
                  'Personalised FATF & AUSTRAC compliance mapping',
                  'Unlimited questions — no daily cap',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className="w-full py-3.5 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-800 dark:hover:bg-white transition-colors"
              >
                Start 7-day free trial
              </button>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">Free for 7 days, then $49.99/month.</p>
            </div>

            {/* Team */}
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 flex flex-col">
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-3">Team</p>
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Custom</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1">Customise a package for your financial crime compliance team.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Premium',
                  'Team admin dashboard',
                  'Custom onboarding & training sessions',
                  'Dedicated compliance advisor',
                  'Volume licensing',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 border border-slate-300 dark:border-slate-500 rounded-xl text-slate-800 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                Contact sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Compliance Officer Experience */}
      <section id="experience" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-blue-600 uppercase tracking-widest font-medium mb-3">Real-world experience</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built on the compliance desk</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              The guidance in this assistant isn't just from regulation documents — it's shaped by the real-time judgement calls made by compliance professionals in the field.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-12 mb-6">
            <div className="text-7xl leading-none text-blue-600/25 font-serif mb-2 select-none">"</div>
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-slate-200 mb-10">
              The questions analysts ask in the middle of a live investigation are never in the textbook. This tool is shaped by years of real casework — the red flags that actually matter, the SMRs that hold up under scrutiny, and the judgement calls that protect your organisation.
            </blockquote>
            <div className="flex items-center gap-4 border-t border-slate-800 pt-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0 tracking-tight">
                CO
              </div>
              <div>
                <p className="font-semibold text-sm text-white">Senior Compliance Officer</p>
                <p className="text-xs text-slate-400 mt-0.5">10+ years · AML/CTF · AUSTRAC regulated entities · Financial crime investigations · FATF typologies</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                stat: '10+',
                label: 'Years in AML compliance',
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
              <div key={item.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <p className="text-2xl font-bold text-blue-600 mb-1">{item.stat}</p>
                <p className="font-semibold text-sm mb-2">{item.label}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory FAQ */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-medium mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common questions</h2>
          </div>
          <div className="space-y-4">
            {REG_FAQS.map((f) => (
              <div key={f.q} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-6">
                <h3 className="font-semibold text-sm mb-2">{f.q}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-600 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to explore AML compliance?</h2>
            <p className="text-blue-100 mb-10 text-sm leading-relaxed max-w-lg mx-auto">
              Get instant answers on KYC, SARs, FATF, sanctions screening, beneficial ownership, and more.
            </p>
            <button
              onClick={onStart}
              className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              {user ? 'Open AmlIntel →' : 'Sign up free →'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span>© 2026 AmlIntel</span>
            </div>
            <div className="flex gap-6">
              <span>For educational purposes only</span>
              <span>·</span>
              <span>Not legal advice</span>
              <span>·</span>
              <span>FATF-aligned · AUSTRAC guidance</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
