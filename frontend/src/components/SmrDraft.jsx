import { useState } from 'react'
import { API_URL } from '../config'
import Navbar from './Navbar'

const TYPOLOGIES = [
  { id: 'structuring', label: 'Structuring / smurfing', desc: 'Transactions kept below reporting thresholds' },
  { id: 'layering', label: 'Layering', desc: 'Moving funds through multiple accounts/entities' },
  { id: 'rapidmovement', label: 'Rapid, unexplained fund movement', desc: null },
  { id: 'sourceoffunds', label: 'Unexplained source of funds', desc: null },
  { id: 'behavioural', label: 'Behavioural red flags', desc: 'Evasive, nervous, inconsistent story' },
  { id: 'other', label: 'Other', desc: null },
]

const CUSTOMER_TYPES = ['Individual', 'Company / trust']
const RISK_RATINGS = ['Low', 'Medium', 'High', 'Unknown']
const YES_NO_UNSURE = ['Yes', 'No', 'Unsure']

const RED_FLAGS = [
  'Structuring below reporting threshold',
  'Inconsistent with known business/income',
  'Reluctance to provide information',
  'Unusual urgency',
  'Third-party involvement',
  'Complex or unnecessary transaction structure',
  'Involves a jurisdiction with high ML/TF risk',
]

const STEP_COUNT = 3

function toggle(list, item) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

function Nav(props) {
  return (
    <div className="print:hidden">
      <Navbar {...props} />
    </div>
  )
}

export default function SmrDraft({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onUpgrade }) {
  const navProps = { user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard }

  // Every SMR is a separate incident — unlike Program/Privacy there's no
  // single "current" one to resume, so this always starts at the form.
  const [phase, setPhase] = useState('form') // form | loading | result
  const [step, setStep] = useState(0)
  const [typology, setTypology] = useState(null)
  const [concernDescription, setConcernDescription] = useState('')
  const [terrorismFinancing, setTerrorismFinancing] = useState(null)
  const [customerType, setCustomerType] = useState(null)
  const [riskRating, setRiskRating] = useState(null)
  const [pepOrSanctions, setPepOrSanctions] = useState(null)
  const [priorSmr, setPriorSmr] = useState(null)
  const [transactionDetails, setTransactionDetails] = useState('')
  const [redFlags, setRedFlags] = useState([])
  const [additionalContext, setAdditionalContext] = useState('')
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [pastDrafts, setPastDrafts] = useState(null)
  const [viewingDraft, setViewingDraft] = useState(null)

  const openHistory = () => {
    setShowHistory(true)
    if (pastDrafts !== null) return
    const token = localStorage.getItem('aml_token')
    fetch(`${API_URL}/document-versions?type=smr`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPastDrafts(data.versions || []))
      .catch(() => setPastDrafts([]))
  }

  const resetForm = () => {
    setStep(0)
    setTypology(null)
    setConcernDescription('')
    setTerrorismFinancing(null)
    setCustomerType(null)
    setRiskRating(null)
    setPepOrSanctions(null)
    setPriorSmr(null)
    setTransactionDetails('')
    setRedFlags([])
    setAdditionalContext('')
    setDraft(null)
    setError(null)
    setViewingDraft(null)
    setPhase('form')
  }

  const handleSubmit = async () => {
    setPhase('loading')
    setError(null)
    try {
      const token = localStorage.getItem('aml_token')
      const intake = {
        typology, concernDescription, terrorismFinancing,
        customerType, riskRating, pepOrSanctions, priorSmr,
        transactionDetails, redFlags, additionalContext,
      }
      const res = await fetch(`${API_URL}/smr-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ intake }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setPhase('form')
        return
      }
      setDraft(data.draft)
      setPhase('result')
      setPastDrafts(null)
      setViewingDraft(null)
      setShowHistory(false)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setPhase('form')
    }
  }

  const canContinue = [
    !!typology && !!concernDescription.trim() && terrorismFinancing !== null,
    !!customerType && !!riskRating && !!pepOrSanctions && !!priorSmr,
    !!transactionDetails.trim(),
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up to draft an SMR</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Answer a few questions about the matter and get a first-pass Suspicious Matter Report narrative. Available on Premium.
          </p>
          <button onClick={onSignUp} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
            Sign up free →
          </button>
        </div>
      </div>
    )
  }

  if (!user.premium) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
        <div className="max-w-md mx-auto px-8 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">SMR Draft is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Get an AI-drafted first-pass Suspicious Matter Report narrative — Concern, Customer Profiling, and Suspicious Activity — on the Premium plan.
          </p>
          <ul className="text-left space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            {[
              'Follows the exact structure AUSTRAC expects',
              'Correct filing deadline stated automatically',
              'Never asks for your client\'s real identity — placeholders only',
              'Save and revisit every past draft',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={onUpgrade} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors mb-6">
            Upgrade to Premium — $49.99/mo
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'result' && draft) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
          <div className="print:hidden mb-8">
            <h1 className="text-2xl font-bold mb-1">SMR Draft</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">First-pass narrative — review and complete with a qualified professional before filing.</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-6">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This is an AI-generated first-pass draft based only on the information you provided. Bracketed placeholders mark every spot needing real identifying detail this tool never collected. It's a starting point, not legal advice — have it reviewed and completed by a qualified AML/CTF professional before filing anything with AUSTRAC.
            </p>
          </div>

          {viewingDraft && (
            <div className="print:hidden bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl px-5 py-3 mb-6 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Viewing a past draft from {new Date(viewingDraft.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </p>
              <button onClick={() => setViewingDraft(null)} className="text-sm font-semibold text-blue-700 dark:text-blue-300 underline hover:no-underline">
                Back to latest draft →
              </button>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{(viewingDraft || draft).draftText}</pre>
          </div>

          <div className="print:hidden flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigator.clipboard?.writeText((viewingDraft || draft).draftText)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors"
            >
              Copy to clipboard
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={resetForm}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Draft another SMR
            </button>
            <button
              onClick={openHistory}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors"
            >
              Past drafts
            </button>
          </div>

          {showHistory && (
            <div className="print:hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
              <p className="font-semibold text-sm mb-4">Past drafts</p>
              {pastDrafts === null ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
              ) : pastDrafts.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">No earlier drafts yet — this is your first one.</p>
              ) : (
                <div className="space-y-2">
                  {pastDrafts.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-sm font-medium">{v.businessName || 'Untitled matter'}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(v.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <button onClick={() => setViewingDraft(v)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 shrink-0">
                        View →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
        <div className="max-w-md mx-auto px-6 pt-32 text-center">
          <div className="w-10 h-10 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-lg font-bold mb-2">Drafting your SMR narrative…</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">This can take up to a minute.</p>
        </div>
      </div>
    )
  }

  // phase === 'form'
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Nav {...navProps} />
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Draft an SMR</h1>
          <p className="text-slate-500 dark:text-slate-400">Answer a few questions and get a first-pass narrative in AUSTRAC's expected format</p>
        </div>

        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5 mb-8">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="font-semibold text-sm text-red-700 dark:text-red-300 mb-1">Don't enter your client's real name, date of birth, or ID numbers</p>
            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
              This tool only needs the shape of what happened, not who it happened to — describe the customer as "the customer" throughout. The draft will mark every spot that needs a real identifying detail with a placeholder, which you fill in yourself after copying it.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 mb-6 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">1. The concern</h2>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Typology</label>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {TYPOLOGIES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTypology(t.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    typology === t.id
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {t.label}
                  {t.desc && <span className="block text-xs text-slate-400 dark:text-slate-500 font-normal mt-0.5">{t.desc}</span>}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">What triggered the suspicion?</label>
            <textarea
              value={concernDescription}
              onChange={(e) => setConcernDescription(e.target.value)}
              placeholder="Describe what happened — no client names, just the activity."
              rows={4}
              className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Does this relate to suspected terrorism financing?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTerrorismFinancing(true)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${terrorismFinancing === true ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                Yes — 24 hour deadline
              </button>
              <button
                onClick={() => setTerrorismFinancing(false)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${terrorismFinancing === false ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                No — 3 business days
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold mb-4">2. Customer profile</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Metadata only — same as the Client Risk Register, no identifying detail.</p>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Customer type</label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {CUSTOMER_TYPES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCustomerType(c)}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${customerType === c ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Risk rating</label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {RISK_RATINGS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskRating(r)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${riskRating === r ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">PEP or sanctions relevant?</label>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {YES_NO_UNSURE.map((o) => (
                <button
                  key={o}
                  onClick={() => setPepOrSanctions(o)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${pepOrSanctions === o ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  {o}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Prior SMR filed on this customer?</label>
            <div className="grid grid-cols-3 gap-2">
              {YES_NO_UNSURE.map((o) => (
                <button
                  key={o}
                  onClick={() => setPriorSmr(o)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${priorSmr === o ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold mb-4">3. Suspicious activity</h2>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Transaction pattern / amounts</label>
            <textarea
              value={transactionDetails}
              onChange={(e) => setTransactionDetails(e.target.value)}
              placeholder="e.g. 4 cash deposits of $9,500 each over 6 days, total $38,000"
              rows={3}
              className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Red flags observed (select all that apply)</label>
            <div className="space-y-2 mb-6">
              {RED_FLAGS.map((f) => (
                <button
                  key={f}
                  onClick={() => setRedFlags(toggle(redFlags, f))}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    redFlags.includes(f)
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${redFlags.includes(f) ? 'bg-orange-600 border-orange-600' : 'border-slate-300 dark:border-slate-600'}`}>
                    {redFlags.includes(f) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {f}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Anything else worth including? (optional)</label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any other context that doesn't fit above"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              ← Back
            </button>
          )}
          {step < STEP_COUNT - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canContinue[step]}
              className="flex-1 px-5 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canContinue[step]}
              className="flex-1 px-5 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Generate my draft →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
