import { useState, useEffect, useRef } from 'react'
import Navbar from './Navbar'

// Mirrors the real 8-step order in SetupGuide.jsx — first 5 shown here as a
// worked example (illustrative progress, not tied to a real account).
const HERO_SETUP_STEPS = [
  { label: 'Enrol with AUSTRAC', status: 'done' },
  { label: 'Appoint an AML/CTF Compliance Officer', status: 'done' },
  { label: 'Enterprise-wide risk assessment', status: 'done' },
  { label: 'Draft your AML/CTF Program', status: 'active' },
  { label: 'Implement CDD / EDD', status: 'todo' },
]

const HERO_INDUSTRIES = [
  { label: 'Banking', soon: false },
  { label: 'Law', soon: false },
  { label: 'Crypto', soon: false },
  { label: 'Fintech', soon: false },
  { label: 'Accountant / TCSP', soon: false },
  { label: 'Gambling', soon: true },
]

const HERO_CAMS_CHAPTERS = [
  { title: 'Ch.1 — Risks & Methods of ML/TF', count: 65 },
  { title: 'Ch.2 — International AML/CFT Standards', count: 61 },
  { title: 'Ch.3 — Compliance Programs', count: 63 },
  { title: 'Ch.4 — Investigations & Response', count: 69 },
]

function CountUp({ to, decimals = 0, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) { setValue(to); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1100
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(to * eased)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.unobserve(el)
        }
      })
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [to])

  return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>
}

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
    title: 'AI compliance assistant',
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

export default function LandingPage({ user, onStart, onStartTrial, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenSectorGuide, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenTermsOfService, onOpenPrivacyPolicy, onGoHome, onNavigateSection, scrollTarget, onScrollHandled }) {
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
        onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceCalendar={onOpenComplianceCalendar}
        onOpenClientRiskRegister={onOpenClientRiskRegister}
        onOpenReportableTransactionCheck={onOpenReportableTransactionCheck}
        onOpenComplianceDashboard={onOpenComplianceDashboard}
        onOpenSmrDraft={onOpenSmrDraft}
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
      <style>{`
        @keyframes heroReveal { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes heroPulse {
          0% { box-shadow: 0 0 0 0 rgba(234,88,12,.45); }
          70% { box-shadow: 0 0 0 7px rgba(234,88,12,0); }
          100% { box-shadow: 0 0 0 0 rgba(234,88,12,0); }
        }
        .hero-reveal { opacity: 0; animation: heroReveal .6s cubic-bezier(.2,.8,.2,1) forwards; }
        .hero-pulse-dot { animation: heroPulse 2.2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal, .hero-pulse-dot { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-500/10 border-b border-orange-100 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 text-xs sm:text-sm font-semibold text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0 hero-pulse-dot"></span>
        AML/CTF obligations for Tranche 2 entities are now in force — enrolment, program, and reporting duties apply from day one.
      </div>

      <section className="relative overflow-hidden pt-16 pb-20 px-6">
        <div
          className="absolute inset-0 -z-10 hidden dark:block"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize: '22px 22px', WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 78% 30%, black 0%, transparent 72%)', maskImage: 'radial-gradient(ellipse 65% 60% at 78% 30%, black 0%, transparent 72%)' }}
        />
        <div
          className="absolute inset-0 -z-10 dark:hidden"
          style={{ backgroundImage: 'radial-gradient(rgba(15,23,42,.06) 1px, transparent 1px)', backgroundSize: '22px 22px', WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 78% 30%, black 0%, transparent 72%)', maskImage: 'radial-gradient(ellipse 65% 60% at 78% 30%, black 0%, transparent 72%)' }}
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="hero-reveal text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-4" style={{ animationDelay: '.02s' }}>
              For accountants, lawyers, real estate agents &amp; jewellers
            </p>
            <h1 className="hero-reveal text-4xl md:text-5xl font-bold leading-[1.08] tracking-tight mb-6" style={{ animationDelay: '.1s' }}>
              Your AML/CTF program, <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-300 dark:decoration-blue-500/50 decoration-[3px] underline-offset-4">built and defensible</span> — not just explained
            </h1>
            <p className="hero-reveal text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg" style={{ animationDelay: '.19s' }}>
              AmlIntel walks Tranche 2 businesses through every obligation AUSTRAC now requires — enrolment, risk assessment, your Program, staff training, ongoing monitoring — with an AI compliance assistant on hand for the questions that don't fit a template. <strong className="text-slate-700 dark:text-slate-200">Free to start, no card required.</strong>
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center gap-4 mb-7" style={{ animationDelay: '.27s' }}>
              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors text-sm"
              >
                {user?.premium ? 'Open Assistant →' : 'Start your free trial →'}
              </button>
              <button
                onClick={onOpenSetupGuide}
                className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm text-center"
              >
                See the setup checklist ↓
              </button>
            </div>
            <div className="hero-reveal flex flex-wrap gap-2" style={{ animationDelay: '.35s' }}>
              {['Accountants & bookkeepers', 'Legal & conveyancing', 'Real estate agents', 'Conveyancers & TCSPs', 'Jewellers & bullion dealers'].map((p) => (
                <span key={p} className="text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full px-3 py-1.5">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-reveal bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1" style={{ animationDelay: '.19s' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <p className="font-bold text-sm">Your Tranche 2 setup</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">3 of 8 complete</p>
            </div>
            <div className="flex items-center gap-3 px-5 pt-4">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '37.5%' }} />
              </div>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">37%</p>
            </div>
            <div className="py-2">
              {HERO_SETUP_STEPS.map((step) => (
                <div key={step.label} className="grid grid-cols-[22px_1fr_auto] items-center gap-3 px-5 py-2.5 border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.status === 'done' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : step.status === 'active' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.status === 'done' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : step.status === 'active' ? '4' : '5'}
                  </span>
                  <span className={`text-sm font-semibold ${step.status === 'todo' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>{step.label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                    step.status === 'done' ? 'text-emerald-600 dark:text-emerald-400'
                    : step.status === 'active' ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 hero-pulse-dot" />}
                    {step.status === 'done' ? 'Done' : step.status === 'active' ? 'In progress' : 'Not started'}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={onOpenSetupGuide} className="w-full text-left px-5 py-3.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
              → Full 8-step checklist &amp; AI drafting inside
            </button>
          </div>
        </div>
      </section>

      {/* Beyond the checklist */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold mb-2">Beyond the checklist</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 max-w-md">Practise the judgement calls, not just the paperwork</h2>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg flex flex-col">
              <div className="px-5 py-4">
                <p className="font-bold text-sm">Case simulations by industry</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 px-5 pb-4 border-b border-slate-200 dark:border-slate-700 leading-relaxed">
                Realistic CDD, red-flag, and escalation scenarios — graded, with regulation-backed feedback on every answer.
              </p>
              <div className="grid grid-cols-2 gap-2 px-5 py-4">
                {HERO_INDUSTRIES.map((ind) => (
                  <div key={ind.label} className={`flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${ind.soon ? 'opacity-50' : 'hover:border-blue-400 dark:hover:border-blue-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ind.soon ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                    {ind.label}
                    {ind.soon && <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Soon</span>}
                  </div>
                ))}
              </div>
              <button onClick={onOpenTraining} className="mt-auto w-full text-left px-5 py-3.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                → Free for every Analyst &amp; MLRO module
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 shadow-sm hover:shadow-lg flex flex-col">
              <div className="flex items-center justify-between px-5 py-4">
                <p className="font-bold text-sm">CAMS certification prep</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">258 questions</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 px-5 pb-4 border-b border-slate-200 dark:border-slate-700 leading-relaxed">
                All four exam chapters, with worked explanations — the first 6 questions per chapter free, full bank with Premium.
              </p>
              <div className="py-1">
                {HERO_CAMS_CHAPTERS.map((c) => (
                  <div key={c.title} className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-slate-100 dark:border-slate-700/60 last:border-0 hover:bg-blue-50/60 dark:hover:bg-blue-500/5 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{c.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{c.count} questions</p>
                    </div>
                    <span className="text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-2.5 py-1 whitespace-nowrap">6 free</span>
                  </div>
                ))}
              </div>
              <button onClick={onOpenTraining} className="mt-auto w-full text-left px-5 py-3.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                → Sourced &amp; reviewed by a CAMS-certified professional
              </button>
            </div>

          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-6 mt-14 pt-10 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-2xl font-bold"><CountUp to={8} suffix=" steps" /></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[22ch] leading-relaxed mt-1">From AUSTRAC enrolment to your first Suspicious Matter Report — the whole program, in order.</p>
            </div>
            <div>
              <p className="text-2xl font-bold"><CountUp to={258} suffix=" Qs" /></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[22ch] leading-relaxed mt-1">CAMS certification exam prep included, across all four exam chapters.</p>
            </div>
            <div>
              <p className="text-2xl font-bold"><CountUp to={36.4} decimals={1} prefix="$" suffix="M" /></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[22ch] leading-relaxed mt-1">Maximum civil penalty per contravention for a company under the AML/CTF Act.</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-10">
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

      {/* Compliance Dashboard preview */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-medium mb-3">Premium</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">One screen for your whole compliance status</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Your AML/CTF Program, Privacy Pack, Staff Induction, Client Risk Register, Compliance Calendar and CAMS prep — rolled up into a single Dashboard, so you always know what's done and what still needs attention.
            </p>
          </div>

          {/* Browser-chrome frame around a static preview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono">amlintel.com/dashboard</span>
            </div>

            <div className="p-5 sm:p-7 pointer-events-none select-none">
              <div className="flex items-center justify-between mb-5">
                <p className="text-base font-bold">Compliance Dashboard</p>
                <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full px-2.5 py-1">Sample data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-5">
                <div className="flex sm:flex-col items-center justify-center gap-2 sm:border-r sm:border-slate-200 sm:dark:border-slate-700 sm:pr-5">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center relative shrink-0" style={{ background: 'conic-gradient(#2563eb 259deg, rgb(226 232 240) 259deg 360deg)' }}>
                    <div className="absolute inset-2 rounded-full bg-slate-50 dark:bg-slate-900" />
                    <span className="relative text-lg font-extrabold">72%</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 text-center">Overall readiness</span>
                </div>
                <div className="grid grid-cols-3 gap-4 content-center">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1">Documents</dt>
                    <dd className="text-sm font-bold">2 / 2</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1">Needs attention</dt>
                    <dd className="text-sm font-bold text-red-600 dark:text-red-400">1 overdue</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1">CAMS readiness</dt>
                    <dd className="text-sm font-bold">68%</dd>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { title: 'AML/CTF Program', pill: 'Draft ready', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
                  { title: 'Client Risk Register', pill: '1 overdue', cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
                  { title: 'Staff Induction', pill: 'Not done', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
                ].map((c) => (
                  <div key={c.title} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3.5">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${c.cls}`}>{c.pill}</span>
                    <p className="text-xs font-semibold">{c.title}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                {[
                  { name: 'CDD review — Matter 2026-014', when: '10d overdue', cls: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
                  { name: 'Staff AML/CTF Training Refresher', when: 'Due in 31d', cls: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
                ].map((d, i) => (
                  <div key={d.name} className={`flex items-center gap-3 px-4 py-2.5 text-xs ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700' : ''}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${d.dot}`} />
                    <span className="font-semibold flex-1 truncate">{d.name}</span>
                    <span className={`font-bold whitespace-nowrap ${d.cls}`}>{d.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button onClick={onStartTrial} className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors text-sm">
              Try Premium free →
            </button>
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
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Free</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Get started with training</p>
              <div className="mb-2 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">/month</span>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-xs mb-7">No credit card required</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'All Analyst & MLRO training modules, every industry',
                  'Ownership Structure Simulation',
                  'CAMS exam prep — the first 6 questions free in every chapter',
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
                className="w-full py-3 border border-slate-300 dark:border-slate-500 rounded-full text-slate-800 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Try it free
              </button>
            </div>

            {/* Premium */}
            <div className="relative bg-white dark:bg-slate-700 border-2 border-blue-600 rounded-2xl p-8 flex flex-col overflow-hidden">
              <span className="absolute top-4 -right-9 rotate-45 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-10 py-1">
                Most Popular
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Premium</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">For working compliance professionals</p>
              <div className="mb-1 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$49.99</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">/month</span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">7-day free trial · cancel anytime</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'AI compliance assistant trained on FATF, AUSTRAC & global regulations — aware of your business profile',
                  'AI-drafted AML/CTF Program (Part A & B)',
                  'AI-drafted Privacy Act documents (Privacy Policy, Collection Notice, Data Breach Plan, Retention Schedule)',
                  'AI-drafted first-pass Suspicious Matter Report (SMR) narratives',
                  'Full CAMS exam prep — 258 questions plus timed, scored mock exams',
                  'Compliance Calendar — track your recurring AUSTRAC & Privacy Act deadlines',
                  'Client Risk Register — ongoing CDD review tracking',
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
                onClick={onStartTrial}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-sm transition-colors"
              >
                Start free trial →
              </button>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">Free for 7 days, then $49.99/month.</p>
            </div>

            {/* Team */}
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 flex flex-col opacity-60">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-slate-900 dark:text-white text-lg">Team</p>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 rounded-full px-2 py-0.5">Coming soon</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Multi-office / large teams</p>
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-7">Custom</p>
              <ul className="space-y-3 mb-8 flex-1">
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
              <button
                disabled
                className="w-full py-3 border border-slate-300 dark:border-slate-500 rounded-full text-slate-400 dark:text-slate-400 font-semibold text-sm cursor-not-allowed"
              >
                Coming soon
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Privacy Act Check promo */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-widest font-medium mb-3">Tranche 2 · Privacy Act</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Are you ready for the Privacy Act?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              From 1 July 2026, Tranche 2 reporting entities lose the Privacy Act's small business exemption — regardless of turnover. Most firms are missing at least one of four core documents.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-12">
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { title: 'Privacy Policy', tag: 'APP 1' },
                { title: 'Collection Notice', tag: 'APP 5' },
                { title: 'Data Breach Response Plan', tag: 'NDB Scheme' },
                { title: 'Retention & Destruction Schedule', tag: 'APP 11' },
              ].map((d) => (
                <div key={d.title} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-full px-2 py-0.5 shrink-0">{d.tag}</span>
                  <span className="text-sm font-medium text-slate-200">{d.title}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800 pt-8">
              <p className="text-sm text-slate-400 max-w-sm">
                Answer a few quick questions to see which of these you already have — free, no signup required.
              </p>
              <button
                onClick={onOpenPrivacyCheck}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
              >
                Take the Privacy Act check →
              </button>
            </div>
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
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span>For educational purposes only</span>
              <span>·</span>
              <span>Not legal advice</span>
              <span>·</span>
              <span>FATF-aligned · AUSTRAC guidance</span>
              <span>·</span>
              <button onClick={onOpenTermsOfService} className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</button>
              <span>·</span>
              <button onClick={onOpenPrivacyPolicy} className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
