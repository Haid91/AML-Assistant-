import { useState, useRef, useEffect } from 'react'

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
]


const GLOBAL_TOPICS = [
  'KYC / CDD / EDD',
  'Suspicious Activity Reports',
  'Currency Transaction Reports',
  'FATF Recommendations',
  'Bank Secrecy Act (BSA)',
  'Beneficial Ownership',
  'OFAC Sanctions Screening',
  'Politically Exposed Persons',
  'Structuring & Smurfing',
  'Transaction Monitoring',
  'Trade-Based ML (TBML)',
  'Correspondent Banking',
  'Shell Companies',
  'Three Stages of Money Laundering',
]

const AUSTRAC_TOPICS = [
  'What is AUSTRAC',
  'AML/CTF Act 2006',
  'AML/CTF Program (Part A & B)',
  'Suspicious Matter Reports (SMRs)',
  'Threshold Transaction Reports (TTRs)',
  'International Funds Transfer Instructions (IFTIs)',
  'Reporting Entities & Designated Services',
  'Enterprise-Wide Risk Assessment (EWRA)',
  'Ongoing Customer Due Diligence (OCDD)',
  'Digital Currency Exchange (DCE)',
  'Remittance Sector Obligations',
  'Fintel Alliance',
  'Tipping Off Prohibition',
  'AUSTRAC E-Learning Modules',
  'AUSTRAC Enforcement Actions',
]

export default function LandingPage({ user, onStart, onSignIn, onSignUp, onOpenChat, onSignOut }) {
  const [topicsOpen, setTopicsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold tracking-tight">
              AML
            </div>
            <span className="font-semibold text-sm">AML Assistant</span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap">What you get</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap">Pricing</a>
            <a href="#experience" className="text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap">Real-world experience</a>
          </div>

          {/* Topics dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setTopicsOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                topicsOpen
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Topics
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${topicsOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {topicsOpen && (
              <div className="absolute top-full right-0 mt-3 w-[580px] max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6" style={{ zIndex: 9999 }}>
                {/* Arrow tip */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45" />

                <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                  {/* Global AML */}
                  <div>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-3">Global AML</p>
                    {GLOBAL_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => { setTopicsOpen(false); onStart() }}
                        className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  {/* AUSTRAC */}
                  <div>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-3">AUSTRAC Guidance</p>
                    {AUSTRAC_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => { setTopicsOpen(false); onStart() }}
                        className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <p className="text-xs text-slate-500">29 topics · FATF-aligned · AUSTRAC guidance</p>
                  <button
                    onClick={() => { setTopicsOpen(false); onStart() }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Open assistant →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={onOpenChat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
              >
                Open Assistant →
              </button>
              <button
                onClick={onSignOut}
                className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSignIn}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={onSignUp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
              >
                Sign up free →
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
            AUSTRAC guidance · FATF-aligned · BSA compliant · For compliance professionals
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Risk-based AML<br />
            <span className="text-blue-600">compliance assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            An intelligent knowledge base that puts you inside KYC, transaction monitoring, and sanctions investigations — with instant, regulation-backed answers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors text-sm"
            >
              {user ? 'Open Assistant →' : 'Get started free →'}
            </button>
            {!user && (
              <button
                onClick={onSignIn}
                className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-600 hover:text-slate-900 transition-colors text-sm text-center"
              >
                Sign in
              </button>
            )}
            {user && (
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3.5 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-600 hover:text-slate-900 transition-colors text-sm text-center"
              >
                See features
              </a>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-6">
            Fictional scenarios for educational purposes only. Not legal advice.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-blue-600 uppercase tracking-widest font-medium mb-3">What you get</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for AML compliance</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Built around real regulatory frameworks — from FATF recommendations to BSA requirements to AUSTRAC guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-7 transition-colors group shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-blue-600 uppercase tracking-widest font-medium mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500 text-sm">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Free */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col">
              <p className="font-bold text-slate-900 text-lg mb-3">Free</p>
              <div className="mb-2 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500 text-sm mb-1">/forever</span>
              </div>
              <p className="text-slate-500 text-sm mb-7">Try the assistant and core investigative workflow at no cost.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'One free CDD scenario',
                  'Core 3-stage workflow (KYC, EWRA, Reporting)',
                  'AUSTRAC e-learning overview',
                  'Sanctions & PEP screening guidance',
                  'Industry glossary and FATF reference panels',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onSignIn}
                className="w-full py-3 border border-slate-300 rounded-xl text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Sign in to start
              </button>
            </div>

            {/* Premium */}
            <div className="relative bg-white border-2 border-slate-900 rounded-2xl p-8 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="bg-slate-900 text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              </div>
              <p className="font-bold text-slate-900 text-lg mb-3">Premium</p>
              <div className="mb-1 flex items-end gap-1">
                <span className="text-4xl font-bold text-slate-900">$49.99</span>
                <span className="text-slate-500 text-sm mb-1">/month</span>
              </div>
              <p className="text-orange-500 text-sm font-semibold mb-6">7-day free trial. Cancel anytime.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'AI Co-Pilot trained on FATF, AUSTRAC & global regulations',
                  'AI Live Transaction Monitoring guidance',
                  'Full SMR/SAR investigation workflow',
                  'Access to all CDD scenarios across industries',
                  'Personalised FATF & AUSTRAC compliance mapping',
                  'Unlimited questions — no daily cap',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                Start 7-day free trial
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">Free for 7 days, then $49.99/month.</p>
            </div>

            {/* Team */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col">
              <p className="font-bold text-slate-900 text-lg mb-3">Team</p>
              <p className="text-4xl font-bold text-slate-900 mb-4">Custom</p>
              <p className="text-slate-500 text-sm mb-8 flex-1">Customise a package for your financial crime compliance team.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Premium',
                  'Team admin dashboard',
                  'Custom onboarding & training sessions',
                  'Dedicated compliance advisor',
                  'Volume licensing',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 border border-slate-300 rounded-xl text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors">
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
            <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
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
              <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-2xl font-bold text-blue-600 mb-1">{item.stat}</p>
                <p className="font-semibold text-sm mb-2">{item.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
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
              {user ? 'Open AML Assistant →' : 'Sign up free →'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span>© 2026 AML Assistant</span>
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
