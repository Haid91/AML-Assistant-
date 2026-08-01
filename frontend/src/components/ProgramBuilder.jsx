import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const INDUSTRIES = [
  { id: 'lawyer', label: 'Lawyer or Conveyancer' },
  { id: 'accountant', label: 'Accountant / Bookkeeper' },
  { id: 'realestate', label: 'Real Estate Agent' },
  { id: 'tcsp', label: 'Trust & Company Service Provider' },
  { id: 'bullion', label: 'Jeweller / Precious Metals Dealer' },
  { id: 'other', label: 'Other / Not sure' },
]

const SERVICES = [
  { id: 'trust', label: 'Managing client trust accounts' },
  { id: 'realestate', label: 'Buying or selling real estate' },
  { id: 'formation', label: 'Company/trust formation' },
  { id: 'assets', label: 'Managing financial assets' },
  { id: 'transactions', label: 'Arranging transactions' },
]

const STAFF_SIZES = ['1-5', '6-20', '21-50', '50+']

const CLIENT_TYPES = [
  { id: 'individuals', label: 'Individuals' },
  { id: 'companies', label: 'Companies / trusts' },
  { id: 'hnw', label: 'High-net-worth individuals' },
  { id: 'overseas', label: 'Overseas / international clients' },
]

const DELIVERY_CHANNELS = [
  { id: 'faceface', label: 'Face-to-face' },
  { id: 'online', label: 'Online / remote' },
  { id: 'referral', label: 'Referral / intermediary-based' },
]

const STEP_COUNT = 5

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AML</div>
      <span className="font-semibold text-sm">Intel</span>
    </button>
  )
}

function Nav({ onGoHome }) {
  return (
    <nav className="print:hidden border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
      <BackButton onClick={onGoHome} />
      <button onClick={onGoHome} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        ← Back to home
      </button>
    </nav>
  )
}

function toggle(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}

export default function ProgramBuilder({ user, onGoHome, onSignUp, onUpgrade, onOpenTraining }) {
  const [phase, setPhase] = useState('checking') // checking | form | loading | result
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState(null)
  const [services, setServices] = useState([])
  const [staffSize, setStaffSize] = useState(null)
  const [clientTypes, setClientTypes] = useState([])
  const [deliveryChannels, setDeliveryChannels] = useState([])
  const [hasComplianceOfficer, setHasComplianceOfficer] = useState(null)
  const [hasRiskAssessment, setHasRiskAssessment] = useState(null)
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.premium) {
      setPhase('form')
      return
    }
    const token = localStorage.getItem('aml_token')
    fetch(`${API_URL}/program-draft`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.draft) {
          setDraft(data.draft)
          setPhase('result')
        } else {
          setPhase('form')
        }
      })
      .catch(() => setPhase('form'))
  }, [user?.premium])

  const prefillFromDraft = (d) => {
    const i = d.intake || {}
    setBusinessName(i.businessName || '')
    setIndustry(i.industry || null)
    setServices(i.services || [])
    setStaffSize(i.staffSize || null)
    setClientTypes(i.clientTypes || [])
    setDeliveryChannels(i.deliveryChannels || [])
    setHasComplianceOfficer(!!i.hasComplianceOfficer)
    setHasRiskAssessment(!!i.hasRiskAssessment)
  }

  const handleRegenerate = () => {
    if (draft) prefillFromDraft(draft)
    setStep(0)
    setError(null)
    setPhase('form')
  }

  const handleSubmit = async () => {
    setPhase('loading')
    setError(null)
    try {
      const token = localStorage.getItem('aml_token')
      const intake = { businessName, industry, services, staffSize, clientTypes, deliveryChannels, hasComplianceOfficer, hasRiskAssessment }
      const res = await fetch(`${API_URL}/program-draft`, {
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
    } catch {
      setError('Network error. Please check your connection and try again.')
      setPhase('form')
    }
  }

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label

  const canContinue = [
    !!businessName.trim() && !!industry,
    services.length > 0,
    !!staffSize && clientTypes.length > 0,
    deliveryChannels.length > 0,
    hasComplianceOfficer !== null && hasRiskAssessment !== null,
  ]

  if (phase === 'checking') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav onGoHome={onGoHome} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav onGoHome={onGoHome} />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up to draft your AML/CTF Program</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Answer a few questions about your business and get a first-pass AML/CTF Program draft, tailored to your answers. Available on Premium.
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
        <Nav onGoHome={onGoHome} />
        <div className="max-w-md mx-auto px-8 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">AML Program Draft is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Get an AI-drafted first-pass AML/CTF Program (Part A & B), tailored to your business, on the Premium plan.
          </p>
          <ul className="text-left space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            {[
              'Draft Part A — governance & risk-based framework',
              'Draft Part B — customer identification procedures',
              'Tailored to your industry, services, and client base',
              'Save and regenerate anytime',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <Nav onGoHome={onGoHome} />
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
          <div className="print:hidden mb-8">
            <h1 className="text-2xl font-bold mb-1">{draft.businessName || 'Your'} AML/CTF Program Draft</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">First-pass draft — review with a qualified professional before use.</p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-6">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This is an AI-generated first-pass draft based only on the information you provided. It's a starting point, not legal advice — have it reviewed and finalised by a qualified AML/CTF professional before relying on it or submitting anything to AUSTRAC.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{draft.draftText}</pre>
          </div>

          <div className="print:hidden flex flex-wrap gap-3">
            <button
              onClick={() => navigator.clipboard?.writeText(draft.draftText)}
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
          </div>

          {draft.intake?.industry === 'accountant' && (
            <div className="print:hidden mt-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm mb-1">Now train your team</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Practise real Accountant &amp; TCSP CDD scenarios — nominee directors, opaque company formation, and the red flags that trip up newly regulated firms.</p>
              </div>
              <button onClick={onOpenTraining} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
                Practise Accountant &amp; TCSP scenarios →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav onGoHome={onGoHome} />
        <div className="max-w-md mx-auto px-6 pt-32 text-center">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-lg font-bold mb-2">Drafting your AML/CTF Program…</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">This can take up to a minute — writing a tailored Part A &amp; B document.</p>
        </div>
      </div>
    )
  }

  // phase === 'form'
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Nav onGoHome={onGoHome} />
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Draft your AML/CTF Program</h1>
          <p className="text-slate-500 dark:text-slate-400">Answer a few questions and get a tailored first-pass Part A &amp; B draft</p>
        </div>

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
            <h2 className="text-lg font-bold mb-4">2. Designated services you provide</h2>
            <div className="space-y-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServices(toggle(services, s.id))}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    services.includes(s.id)
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${services.includes(s.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                    {services.includes(s.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold mb-4">3. Team &amp; client base</h2>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Staff size</label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {STAFF_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setStaffSize(size)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    staffSize === size
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Client types (select all that apply)</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {CLIENT_TYPES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClientTypes(toggle(clientTypes, c.id))}
                  className={`text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    clientTypes.includes(c.id)
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold mb-4">4. How you deliver services</h2>
            <div className="space-y-2">
              {DELIVERY_CHANNELS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDeliveryChannels(toggle(deliveryChannels, d.id))}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    deliveryChannels.includes(d.id)
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${deliveryChannels.includes(d.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                    {deliveryChannels.includes(d.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold mb-4">5. Where you're starting from</h2>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Do you already have an AML/CTF Compliance Officer appointed?</label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setHasComplianceOfficer(true)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${hasComplianceOfficer === true ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                Yes
              </button>
              <button
                onClick={() => setHasComplianceOfficer(false)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${hasComplianceOfficer === false ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                No
              </button>
            </div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Have you already completed a risk assessment (EWRA)?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasRiskAssessment(true)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${hasRiskAssessment === true ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                Yes
              </button>
              <button
                onClick={() => setHasRiskAssessment(false)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-colors ${hasRiskAssessment === false ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                No
              </button>
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
              Generate my draft →
            </button>
          )}
        </div>

        {industryLabel && step === STEP_COUNT - 1 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">
            Drafting for {businessName || 'your business'} — {industryLabel.toLowerCase()}.
          </p>
        )}
      </div>
    </div>
  )
}
