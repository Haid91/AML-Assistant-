import { useState } from 'react'
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
    a: `Premium is a flat $${PREMIUM_MONTHLY}/month, with a 7-day free trial — one subscription covers your firm's AML/CTF compliance work, regardless of how many people are on your team. It includes the AI compliance assistant for CDD, EDD, and SMR guidance, plus AI-drafted AML/CTF Program generation.`,
  },
  {
    q: 'What do I get for free?',
    a: 'The Eligibility Check and Setup Guide are both free — no card required. Premium adds the AI compliance assistant and AI-drafted AML/CTF Program generation.',
  },
  {
    q: 'Is this cheaper than a compliance consultant?',
    a: `For most Tranche 2 firms, yes — a private AML/CTF consultant commonly runs $${CONSULTANT_LOW.toLocaleString()}–$${CONSULTANT_HIGH.toLocaleString()} per year, while AmlIntel Premium is a flat $${(PREMIUM_MONTHLY * 12).toFixed(2)}/year no matter your team size. This is an illustrative comparison, not a quote.`,
  },
]

export default function CostCalculator({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening }) {
  const [industry, setIndustry] = useState('lawyers')
  const [people, setPeople] = useState(3)
  const [activeClients, setActiveClients] = useState(40)
  const [email, setEmail] = useState('')
  const [sendState, setSendState] = useState('idle') // idle | loading | sent | error
  const [sendError, setSendError] = useState('')

  // Flat regardless of team size — one Premium subscription (one login, run
  // by the Compliance Officer) covers the firm's AML/CTF compliance work,
  // the same way a single engaged consultant would. `people` and
  // `activeClients` are both context-only inputs that personalize the copy
  // without scaling the price — multiplying per head would make the
  // estimate balloon past typical consultant fees for any team bigger than
  // 2-3 people, which defeats the entire "cheaper than a consultant" pitch.
  const annualTotal = PREMIUM_MONTHLY * 12
  const monthlyEquivalent = PREMIUM_MONTHLY

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
        onOpenSmrDraft={onOpenSmrDraft}
        onOpenSanctionsScreening={onOpenSanctionsScreening}
      />

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-8 text-center">
        <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-medium mb-3">Cost calculator</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">What does AML/CTF compliance actually cost?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Tell us about your firm and we'll show you the Premium price against a typical consultant's.
        </p>
      </div>

      {/* Calculator */}
      <div className="max-w-4xl mx-auto px-6 pb-16 grid md:grid-cols-5 gap-6 items-start">
        {/* Left: firm details */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Tell us about your firm</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Business type</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
            >
              {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">People in your firm</label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{people}</span>
            </div>
            <input
              type="range" min="1" max="20" value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>20+</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">For context only — one AmlIntel subscription covers your whole firm, regardless of team size.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Total active clients</label>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{activeClients}</span>
            </div>
            <input
              type="range" min="1" max="500" value={activeClients}
              onChange={(e) => setActiveClients(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>500+</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">For context only — doesn't affect price.</p>
          </div>
        </div>

        {/* Right: recommended plan */}
        <div className="md:col-span-3 bg-white dark:bg-slate-800 border-2 border-blue-600 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-lg">Premium</p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">Recommended</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">
            For {industryLabel.toLowerCase()} of any size
          </p>

          <div className="mb-1 flex items-end gap-1.5">
            <span className="text-5xl font-bold text-slate-900 dark:text-white">${annualTotal.toFixed(2)}</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm mb-1.5">/ year</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            ${monthlyEquivalent.toFixed(2)}/month, billed however suits you — flat, whether it's {people} {people === 1 ? 'person' : 'people'} or twenty.
          </p>

          <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-5 mb-6">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              ${savings > 0 ? savings.toFixed(0) : '0'}+ saved
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              per year against a traditional consultant, who typically charges ${CONSULTANT_LOW.toLocaleString()}–${CONSULTANT_HIGH.toLocaleString()} for {industryLabel.toLowerCase()} of this size.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Illustrative example only — not a quote or market guarantee.</p>
          </div>

          <ul className="space-y-2 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={onSignUp}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
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

          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
            {sendState === 'sent' ? (
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Estimate sent to {email}.
              </p>
            ) : (
              <form onSubmit={handleSendEstimate}>
                <p className="text-sm font-semibold mb-2">Email this estimate</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSendError('') }}
                    placeholder="Work email address"
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
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
            <button onClick={() => onNavigateSection?.('pricing')} className="text-blue-600 dark:text-blue-400 hover:underline">pricing section</button>.
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
