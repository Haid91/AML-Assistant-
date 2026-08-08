import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Navbar from './Navbar'

const INDUSTRIES = [
  { id: 'lawyer', label: 'Lawyer or Conveyancer' },
  { id: 'accountant', label: 'Accountant / Bookkeeper' },
  { id: 'realestate', label: 'Real Estate Agent' },
  { id: 'tcsp', label: 'Trust & Company Service Provider' },
  { id: 'bullion', label: 'Jeweller / Precious Metals Dealer' },
  { id: 'other', label: 'Other / Not sure' },
]

const DOCUMENTS = [
  { id: 'privacyPolicy', label: 'Privacy Policy', tag: 'APP 1' },
  { id: 'collectionNotice', label: 'Collection Notice', tag: 'APP 5' },
  { id: 'dataBreachPlan', label: 'Data Breach Response Plan', tag: 'NDB Scheme' },
  { id: 'retentionSchedule', label: 'Retention & Destruction Schedule', tag: 'APP 11' },
]

const STEP_COUNT = 2

function Nav(props) {
  return (
    <div className="print:hidden">
      <Navbar {...props} />
    </div>
  )
}

function toggle(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

export default function PrivacyPack({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator, onUpgrade, prefill }) {
  const navProps = { user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator }
  const [phase, setPhase] = useState('checking') // checking | form | loading | result
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState(prefill?.industry || null)
  const [documents, setDocuments] = useState(prefill?.missingDocs?.length ? prefill.missingDocs : DOCUMENTS.map((d) => d.id))
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [versions, setVersions] = useState(null)
  const [viewingVersion, setViewingVersion] = useState(null)

  const openHistory = () => {
    setShowHistory(true)
    if (versions !== null) return
    const token = localStorage.getItem('aml_token')
    fetch(`${API_URL}/document-versions?type=privacy`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setVersions(data.versions || []))
      .catch(() => setVersions([]))
  }

  useEffect(() => {
    if (!user?.premium) {
      setPhase('form')
      return
    }
    const token = localStorage.getItem('aml_token')
    fetch(`${API_URL}/privacy-draft`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.draft && !prefill) {
          setDraft(data.draft)
          setPhase('result')
        } else {
          setPhase('form')
        }
      })
      .catch(() => setPhase('form'))
  }, [user?.premium])

  const handleRegenerate = () => {
    if (draft) {
      const i = draft.intake || {}
      setBusinessName(i.businessName || '')
      setIndustry(i.industry || null)
      setDocuments(i.documents?.length ? i.documents : DOCUMENTS.map((d) => d.id))
    }
    setStep(0)
    setError(null)
    setPhase('form')
  }

  const handleSubmit = async () => {
    setPhase('loading')
    setError(null)
    try {
      const token = localStorage.getItem('aml_token')
      const intake = { businessName, industry, documents }
      const res = await fetch(`${API_URL}/privacy-draft`, {
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
      setVersions(null)
      setViewingVersion(null)
      setShowHistory(false)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setPhase('form')
    }
  }

  const canContinue = [
    !!businessName.trim() && !!industry,
    documents.length > 0,
  ]

  if (phase === 'checking') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up to open your Privacy Pack</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Answer a couple of questions and get AI-drafted Privacy Act documents, tailored to your business. Available on Premium.
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Privacy Pack is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Get AI-drafted Privacy Act documents — Privacy Policy, Collection Notice, Data Breach Response Plan, and Retention Schedule — tailored to your business, on the Premium plan.
          </p>
          <ul className="text-left space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            {[
              'Privacy Policy (APP 1)',
              'Collection Notice (APP 5) — worded around AML tipping-off rules',
              'Data Breach Response Plan (NDB Scheme)',
              'Retention & Destruction Schedule (APP 11)',
              'Save and regenerate anytime',
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
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
            Section 6E(1A) of the Privacy Act 1988 binds Tranche 2 reporting entities to the Australian Privacy
            Principles for AML/CTF personal information, regardless of turnover, from 1 July 2026.
          </p>
          <button onClick={onOpenPrivacyCheck} className="text-sm text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
            ← Back to the free Privacy Act check
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
            <h1 className="text-2xl font-bold mb-1">{draft.businessName || 'Your'} Privacy Pack</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">First-pass drafts — review with a qualified professional before use.</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-6">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This is an AI-generated first-pass draft based only on the information you provided. It's a starting point, not legal advice — have it reviewed and finalised by a qualified privacy or legal professional before relying on it or publishing it.
            </p>
          </div>

          {viewingVersion && (
            <div className="print:hidden bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl px-5 py-3 mb-6 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Viewing an older version from {new Date(viewingVersion.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </p>
              <button onClick={() => setViewingVersion(null)} className="text-sm font-semibold text-blue-700 dark:text-blue-300 underline hover:no-underline">
                Back to current →
              </button>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{(viewingVersion || draft).draftText}</pre>
          </div>

          <div className="print:hidden flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigator.clipboard?.writeText((viewingVersion || draft).draftText)}
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
              onClick={handleRegenerate}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={openHistory}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors"
            >
              Version history
            </button>
          </div>

          {showHistory && (
            <div className="print:hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
              <p className="font-semibold text-sm mb-4">Version history</p>
              {versions === null ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
              ) : versions.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">No earlier versions yet — this is your first draft.</p>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-sm font-medium">{v.businessName || 'Untitled'}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(v.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <button onClick={() => setViewingVersion(v)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 shrink-0">
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
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-lg font-bold mb-2">Drafting your Privacy Pack…</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">This can take up to a minute — writing tailored documents.</p>
        </div>
      </div>
    )
  }

  // phase === 'form'
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Nav {...navProps} />
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Your Privacy Pack</h1>
          <p className="text-slate-500 dark:text-slate-400">Answer a couple of questions and get tailored first-pass Privacy Act documents</p>
        </div>

        {step === 0 && (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-8 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Since 1 July 2026, s6E(1A) of the Privacy Act 1988 binds Tranche 2 reporting entities to the Australian
            Privacy Principles for AML/CTF personal information, regardless of turnover.{' '}
            <button onClick={onOpenPrivacyCheck} className="text-orange-600 dark:text-orange-400 font-semibold underline hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
              See the full breakdown and FAQ →
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 mb-6 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">1. Your business</h2>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Business name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Smith & Co Conveyancing"
              className="w-full mb-6 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Industry</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    industry === ind.id
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold mb-1">2. Which documents do you need?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {prefill?.missingDocs?.length ? "Pre-selected from your readiness check — adjust if needed." : 'All four selected by default.'}
            </p>
            <div className="space-y-2">
              {DOCUMENTS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDocuments(toggle(documents, d.id))}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    documents.includes(d.id)
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${documents.includes(d.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                    {documents.includes(d.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {d.label} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">({d.tag})</span>
                </button>
              ))}
            </div>
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
              className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canContinue[step]}
              className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Generate my Privacy Pack →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
