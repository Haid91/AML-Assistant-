import { useState, useMemo } from 'react'

const INDUSTRIES = [
  { id: 'lawyers', label: 'Lawyers & Conveyancers' },
  { id: 'accountants', label: 'Accountants' },
  { id: 'realestate', label: 'Real Estate Agents' },
  { id: 'tcsp', label: 'Trust & Company Service Providers' },
  { id: 'bullion', label: 'Dealers in Precious Metals & Stones' },
  { id: 'other', label: 'Other Tranche 2 Professionals' },
]

const PREMIUM_MONTHLY = 49.99
const CONSULTANT_LOW = 1500
const CONSULTANT_HIGH = 4000

const NEEDS = [
  { id: 'assistant', label: 'AI compliance assistant', desc: 'Ask questions and draft SMR/SAR narratives instantly' },
  { id: 'cams', label: 'Full CAMS exam prep', desc: 'All 20 questions per chapter, not just the free preview' },
  { id: 'unlimited', label: 'Unlimited daily questions', desc: 'No daily cap on assistant usage' },
]

const FAQS = [
  {
    q: 'How much does AmlIntel cost?',
    a: 'The core training platform — Analyst and MLRO case simulations across Banking, Law, Crypto, and Fintech, plus the Ownership Structure Simulation — is free. Premium adds the AI compliance assistant and full CAMS exam prep for $49.99/month, with a 7-day free trial.',
  },
  {
    q: 'What do I get for free?',
    a: 'All Analyst and MLRO training modules across every industry, a 6-of-20 question preview per CAMS chapter, and the Beginner-level Ownership Structure Simulation scenarios — no credit card required.',
  },
  {
    q: 'Is this cheaper than a compliance consultant or training course?',
    a: `For most individuals, yes. A private AML/CTF training course or part-time consultant commonly runs $${CONSULTANT_LOW.toLocaleString()}–$${CONSULTANT_HIGH.toLocaleString()} per year. AmlIntel Premium is $${(PREMIUM_MONTHLY * 12).toFixed(2)}/year per person — this is an illustrative comparison, not a quote.`,
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

export default function CostCalculator({ onGoHome, onSignUp, onSignIn }) {
  const [industry, setIndustry] = useState('lawyers')
  const [people, setPeople] = useState(1)
  const [needs, setNeeds] = useState([])

  const toggleNeed = (id) => {
    setNeeds((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]))
  }

  const needsPremium = needs.length > 0
  const plan = needsPremium ? 'Premium' : 'Free'

  const { annualTotal, monthlyEquivalent } = useMemo(() => {
    if (!needsPremium) return { annualTotal: 0, monthlyEquivalent: 0 }
    const total = PREMIUM_MONTHLY * 12 * people
    return { annualTotal: total, monthlyEquivalent: total / 12 }
  }, [needsPremium, people])

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label || 'Lawyers & Conveyancers'

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
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-8 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3v8a1 1 0 01-1 1H10a1 1 0 01-1-1V10m6 0H9m6 0V6a1 1 0 00-1-1h-4a1 1 0 00-1 1v4" />
          </svg>
          Cost calculator
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">What will AML compliance training actually cost you?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Adjust a few details to see your recommended plan and estimated annual cost with AmlIntel.
        </p>
      </div>

      {/* Calculator */}
      <div className="max-w-4xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="font-semibold">Tell us about your needs</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
            >
              {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">People who need access</label>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-0.5 rounded-lg">{people}</span>
            </div>
            <input
              type="range" min="1" max="20" value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>20+</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Do you need any of these?</label>
            <div className="space-y-2">
              {NEEDS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => toggleNeed(n.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                    needs.includes(n.id)
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${needs.includes(n.id) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 dark:border-slate-600'}`}>
                      {needs.includes(n.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{n.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recommended plan</p>
              <span className="inline-block text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-500/20 px-3 py-1 rounded-full">{plan}</span>
            </div>
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <div className="mb-1 mt-3 flex items-end gap-1.5">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">${annualTotal.toFixed(2)}</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm mb-1">/ year</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
            {needsPremium ? `$${monthlyEquivalent.toFixed(2)} / month equivalent` : 'No cost, no card required'}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-5">
            Based on {people} {people === 1 ? 'person' : 'people'} in {industryLabel}{needsPremium ? '' : ' on the Free plan'}.
          </p>

          {needsPremium && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold mb-3">Cost breakdown</p>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
                <span>Premium subscription × {people}</span>
                <span>${annualTotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2 flex justify-between text-sm font-bold">
                <span>Estimated annual total</span>
                <span>${annualTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">AmlIntel</p>
                <p className="text-sm font-bold">${annualTotal.toFixed(2)} / year</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Private consultant / course</p>
                <p className="text-sm font-bold">${CONSULTANT_LOW.toLocaleString()}–${CONSULTANT_HIGH.toLocaleString()} / year</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Illustrative example only — not a quote or market guarantee.</p>
          </div>

          <ul className="space-y-2 mb-6">
            {[
              'All Analyst & MLRO training modules',
              'Ownership Structure Simulation',
              needsPremium ? 'AI compliance assistant, unlimited questions' : '6-of-20 CAMS questions per chapter',
              needsPremium && 'Full CAMS exam prep — all 20 questions',
            ].filter(Boolean).map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onSignUp}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              {needsPremium ? 'Start free trial →' : 'Sign up free →'}
            </button>
            <button
              onClick={onSignIn}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition-colors"
            >
              Sign in
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-3">
            Indicative estimate, not a quote. For full details, see the <button onClick={onGoHome} className="text-orange-500 hover:text-orange-400 underline">pricing section</button>.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold mb-5">Common questions</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <p className="font-semibold mb-1.5">{f.q}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
