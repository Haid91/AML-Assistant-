import { useState, useMemo } from 'react'
import { API_URL } from '../config'
import Navbar from './Navbar'

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

const FEATURES = [
  'AI-drafted AML/CTF Program (Part A & B)',
  'AI compliance assistant for CDD, EDD & SMR guidance',
  'Free Eligibility Check & Setup Guide',
  'Unlimited questions — no daily cap',
]

const FAQS = [
  {
    q: 'How much does AmlIntel cost?',
    a: `Premium is $${PREMIUM_MONTHLY}/month per person, with a 7-day free trial. It includes the AI compliance assistant for CDD, EDD, and SMR guidance, plus AI-drafted AML/CTF Program generation.`,
  },
  {
    q: 'What do I get for free?',
    a: 'The Eligibility Check and Setup Guide are both free — no card required. Premium adds the AI compliance assistant and AI-drafted AML/CTF Program generation.',
  },
  {
    q: 'Is this cheaper than a compliance consultant?',
    a: `For most small teams, yes. A private AML/CTF consultant commonly runs $${CONSULTANT_LOW.toLocaleString()}–$${CONSULTANT_HIGH.toLocaleString()} per year. This is an illustrative comparison, not a quote — larger teams should compare against per-seat Premium pricing directly.`,
  },
]

export default function CostCalculator({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard }) {
  const [industry, setIndustry] = useState('lawyers')
  const [people, setPeople] = useState(3)
  const [activeClients, setActiveClients] = useState(40)
  const [email, setEmail] = useState('')
  const [sendState, setSendState] = useState('idle') // idle | loading | sent | error
  const [sendError, setSendError] = useState('')

  const { annualTotal, monthlyEquivalent } = useMemo(() => {
    const total = PREMIUM_MONTHLY * 12 * people
    return { annualTotal: total, monthlyEquivalent: total / 12 }
  }, [people])

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label || 'Lawyers & Conveyancers'
  const savings = CONSULTANT_LOW - annualTotal

  const handleSendEstimate = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setSendError('Please enter your email address.'); return }
    setSendState('loading')
    setSendError('')
    try {
      const res = await fetch(`${API_URL}/email-estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), industry, people }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error || 'Something went wrong. Please try again.')
        setSendState('error')
        return
      }
      setSendState('sent')
    } catch {
      setSendError('Unable to connect to the server. Please try again.')
      setSendState('error')
    }
  }

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

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-8 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3v8a1 1 0 01-1 1H10a1 1 0 01-1-1V10m6 0H9m6 0V6a1 1 0 00-1-1h-4a1 1 0 00-1 1v4" />
          </svg>
          Cost calculator
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Estimate your AML/CTF compliance cost</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Tell us about your firm to see your recommended plan and estimated annual cost with AmlIntel.
        </p>
      </div>

      {/* Calculator */}
      <div className="max-w-4xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6 items-start">
        {/* Left: firm details */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="font-semibold">Tell us about your firm</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Business type</label>
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
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">People in your firm</label>
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
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Used to estimate per-seat Premium cost.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Total active clients</label>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-0.5 rounded-lg">{activeClients}</span>
            </div>
            <input
              type="range" min="1" max="500" value={activeClients}
              onChange={(e) => setActiveClients(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>500+</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">For context only — doesn't affect price.</p>
          </div>
        </div>

        {/* Right: recommended plan */}
        <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recommended plan</p>
              <span className="inline-block text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-500/20 px-3 py-1 rounded-full">Premium</span>
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
            ${monthlyEquivalent.toFixed(2)} / month equivalent
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-5">
            Based on {people} {people === 1 ? 'person' : 'people'} in {industryLabel} and {activeClients} active clients.
          </p>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold mb-3">Cost breakdown</p>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
              <span>Annual subscription × {people}</span>
              <span>${annualTotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2 flex justify-between text-sm font-bold">
              <span>Estimated annual total</span>
              <span>${annualTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">AmlIntel Premium</p>
                <p className="text-sm font-bold">${annualTotal.toFixed(2)} / year</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Traditional consultant</p>
                <p className="text-sm font-bold">${CONSULTANT_LOW.toLocaleString()}–${CONSULTANT_HIGH.toLocaleString()} / year</p>
              </div>
            </div>
            {savings > 0 && (
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mt-2">
                You save at least ${savings.toFixed(2)} / year
              </p>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Illustrative example only — not a quote or market guarantee.</p>
          </div>

          <ul className="space-y-2 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={onSignUp}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Start free trial →
            </button>
            <button
              onClick={onOpenEligibility}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Book free compliance check
            </button>
          </div>

          <div className="border-t border-orange-200 dark:border-orange-500/20 pt-4">
            {sendState === 'sent' ? (
              <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Estimate sent to {email}.
              </p>
            ) : (
              <form onSubmit={handleSendEstimate}>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email this estimate
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSendError('') }}
                    placeholder="Work email address"
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={sendState === 'loading'}
                    className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    {sendState === 'loading' ? 'Sending…' : 'Send'}
                  </button>
                </div>
                {sendError && <p className="text-xs text-red-500 dark:text-red-400 mt-2">{sendError}</p>}
              </form>
            )}
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-4">
            Indicative estimate in AUD, not a quote. For exact plan details, see the{' '}
            <button onClick={() => onNavigateSection?.('pricing')} className="text-orange-500 hover:text-orange-400 underline">pricing section</button>.
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
