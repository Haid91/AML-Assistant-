import { useState, useMemo } from 'react'
import { Copy, Check, Gauge } from 'lucide-react'
import Navbar from './Navbar'

const WEIGHT_RANK = { low: 1, medium: 2, high: 3 }
const WEIGHT_LABEL = { low: 'Low', medium: 'Medium', high: 'High' }

const CATEGORIES = [
  {
    id: 'customer',
    title: 'Customer types',
    factors: [
      { id: 'individual-retail', label: 'Individual retail clients', weight: 'low' },
      { id: 'known-longstanding', label: 'Long-standing clients with a known, stable profile', weight: 'low' },
      { id: 'non-resident', label: 'Non-resident or overseas clients', weight: 'medium' },
      { id: 'hnw', label: 'High-net-worth individuals', weight: 'medium' },
      { id: 'pep', label: 'Politically exposed persons (PEPs)', weight: 'high' },
      { id: 'cash-intensive', label: 'Cash-intensive businesses', weight: 'high' },
      { id: 'opaque-ownership', label: 'Companies or trusts with complex or opaque ownership', weight: 'high' },
    ],
  },
  {
    id: 'service',
    title: 'Products / designated services',
    factors: [
      { id: 'advisory-only', label: 'Standard advisory or professional services only', weight: 'low' },
      { id: 'managing-funds', label: 'Managing client funds or trust accounts', weight: 'medium' },
      { id: 'formation', label: 'Company or trust formation', weight: 'medium' },
      { id: 'real-estate', label: 'Real estate transactions', weight: 'medium' },
      { id: 'nominee', label: 'Nominee director/shareholder or registered office services', weight: 'high' },
      { id: 'large-cash', label: 'Large cash transactions (e.g. precious metals/stones)', weight: 'high' },
    ],
  },
  {
    id: 'channel',
    title: 'Delivery channels',
    factors: [
      { id: 'face-to-face', label: 'Face-to-face onboarding', weight: 'low' },
      { id: 'known-referral', label: 'Referral from a known, trusted source', weight: 'low' },
      { id: 'online', label: 'Non-face-to-face / online onboarding', weight: 'medium' },
      { id: 'unverified-intermediary', label: 'Onboarding via an unverified intermediary', weight: 'high' },
    ],
  },
  {
    id: 'jurisdiction',
    title: 'Foreign jurisdictions',
    factors: [
      { id: 'domestic', label: 'Domestic clients and transactions only', weight: 'low' },
      { id: 'low-risk-overseas', label: 'Overseas clients/transactions in low-risk jurisdictions', weight: 'medium' },
      { id: 'high-risk-jurisdiction', label: 'Clients/transactions involving FATF grey-listed or high-risk jurisdictions', weight: 'high' },
    ],
  },
]

function ratingStyles(rating) {
  if (rating === 'high') return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30' }
  if (rating === 'medium') return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/30' }
  return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30' }
}

export default function RiskAssessmentTool({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator }) {
  const [selected, setSelected] = useState({})
  const [copied, setCopied] = useState(false)

  const toggle = (factorId) => {
    setSelected((prev) => ({ ...prev, [factorId]: !prev[factorId] }))
  }

  const results = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const chosen = cat.factors.filter((f) => selected[f.id])
      const rating = chosen.length ? chosen.reduce((max, f) => (WEIGHT_RANK[f.weight] > WEIGHT_RANK[max] ? f.weight : max), 'low') : 'low'
      return { ...cat, chosen, rating }
    })
  }, [selected])

  const overallRating = results.reduce((max, r) => (WEIGHT_RANK[r.rating] > WEIGHT_RANK[max] ? r.rating : max), 'low')
  const overallStyles = ratingStyles(overallRating)

  const summaryText = useMemo(() => {
    const lines = [`ENTERPRISE-WIDE RISK ASSESSMENT — SELF-ASSESSMENT SUMMARY`, '', `Overall rating: ${WEIGHT_LABEL[overallRating]}`, '']
    for (const r of results) {
      lines.push(`${r.title}: ${WEIGHT_LABEL[r.rating]}`)
      if (r.chosen.length) {
        for (const f of r.chosen) lines.push(`  — ${f.label} (${WEIGHT_LABEL[f.weight]})`)
      } else {
        lines.push('  — No elevated risk factors selected')
      }
      lines.push('')
    }
    lines.push('This is a self-assessment starting point, not a substitute for a properly documented, professionally reviewed EWRA.')
    return lines.join('\n')
  }, [results, overallRating])

  const handleCopy = () => {
    navigator.clipboard?.writeText(summaryText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        onOpenCost={onOpenCost}
        onOpenSetupGuide={onOpenSetupGuide}
        onOpenEligibility={onOpenEligibility}
        onOpenProgramBuilder={onOpenProgramBuilder}
        onOpenAustracEnrolment={onOpenAustracEnrolment}
        onOpenSmrGuide={onOpenSmrGuide}
        onOpenComplianceOfficer={onOpenComplianceOfficer}
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

      <div className="max-w-4xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
            Free — no signup required
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Assess your ML/TF risk</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
            Select what applies to your business across AUSTRAC's four standard risk-factor categories to get an instant, self-assessed risk rating.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Checklists */}
          <div className="space-y-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h2 className="font-bold text-base mb-3">{cat.title}</h2>
                <div className="space-y-2">
                  {cat.factors.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggle(f.id)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-colors ${
                        selected[f.id]
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${selected[f.id] ? 'bg-orange-500 border-orange-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {selected[f.id] && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="flex-1 text-slate-700 dark:text-slate-300">{f.label}</span>
                      <span className={`text-xs font-semibold shrink-0 ${ratingStyles(f.weight).text}`}>{WEIGHT_LABEL[f.weight]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className={`rounded-2xl border p-6 ${overallStyles.bg} ${overallStyles.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className={`w-5 h-5 ${overallStyles.text}`} />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Overall rating</p>
              </div>
              <p className={`text-3xl font-bold ${overallStyles.text}`}>{WEIGHT_LABEL[overallRating]}</p>
            </div>

            <div className="space-y-2">
              {results.map((r) => {
                const s = ratingStyles(r.rating)
                return (
                  <div key={r.id} className={`rounded-xl border p-4 ${s.bg} ${s.border}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.title}</p>
                      <span className={`text-xs font-bold ${s.text}`}>{WEIGHT_LABEL[r.rating]}</span>
                    </div>
                    {r.chosen.length > 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        {r.chosen.map((f) => f.label).join(', ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-1.5 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy summary'}
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              A self-assessment starting point — not a substitute for a professionally reviewed EWRA.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-center mt-12">
          <p className="text-lg font-bold text-white mb-2">What's next</p>
          <p className="text-slate-400 text-sm mb-6">Your Program Draft's risk assessment section can build on what you selected here.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => onOpenProgramBuilder()} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
              Draft your AML/CTF Program →
            </button>
            <button onClick={onOpenSetupGuide} className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors">
              See the full Setup Guide
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8">
          Educational guidance only — not legal advice. Consult a qualified AML/CTF professional to review your actual risk assessment.
        </p>
      </div>
    </div>
  )
}
