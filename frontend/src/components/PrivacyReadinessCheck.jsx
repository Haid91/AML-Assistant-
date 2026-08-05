import { useState } from 'react'
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
  {
    id: 'privacyPolicy',
    title: 'Privacy Policy',
    tag: 'APP 1',
    desc: 'A clearly expressed policy covering what personal information you collect, why, how it\'s held, and how someone can access, correct, or complain about it.',
  },
  {
    id: 'collectionNotice',
    title: 'Collection Notice',
    tag: 'APP 5',
    desc: "A notice given when you collect a client's ID for CDD — worded carefully so it doesn't clash with the AML/CTF tipping-off rules.",
  },
  {
    id: 'dataBreachPlan',
    title: 'Data Breach Response Plan',
    tag: 'NDB Scheme',
    desc: 'A plan to assess a suspected breach and, if it qualifies, notify the OAIC and affected individuals — you\'re now inside the Notifiable Data Breaches scheme.',
  },
  {
    id: 'retentionSchedule',
    title: 'Retention & Destruction Schedule',
    tag: 'APP 11',
    desc: 'A rule for keeping CDD and transaction records for the 7 years the AML/CTF Act requires, then securely destroying or de-identifying them.',
  },
]

export default function PrivacyReadinessCheck({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenPrivacyPack, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators }) {
  const [step, setStep] = useState(0)
  const [industry, setIndustry] = useState(null)
  const [reportingEntity, setReportingEntity] = useState(null)
  const [haveDocs, setHaveDocs] = useState({})
  const [result, setResult] = useState(null)

  const restart = () => {
    setStep(0); setIndustry(null); setReportingEntity(null); setHaveDocs({}); setResult(null)
  }

  const answerDoc = (id, has) => {
    const next = { ...haveDocs, [id]: has }
    setHaveDocs(next)
    if (Object.keys(next).length === DOCUMENTS.length) {
      setResult(reportingEntity === 'no' ? 'not-captured' : 'checked')
    }
  }

  const missing = DOCUMENTS.filter((d) => haveDocs[d.id] === false)
  const haveCount = DOCUMENTS.filter((d) => haveDocs[d.id] === true).length

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label || 'your industry'

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

      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        {!result && (
          <>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
                Free — no signup required
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Are you ready for the Privacy Act?</h1>
              <p className="text-slate-500 dark:text-slate-400">
                From 1 July 2026, Tranche 2 reporting entities lose the small business exemption. Answer a few quick questions to see where you stand.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
              ))}
            </div>

            {step === 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">1. What is your industry?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => { setIndustry(ind.id); setStep(1) }}
                      className={`text-left p-4 rounded-xl border transition-colors ${
                        industry === ind.id
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <p className="font-semibold text-sm">{ind.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold mb-2">2. Do you provide a designated service under the AML/CTF Act?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  If you do, you're a reporting entity, and the Privacy Act now applies to the client information you handle for AML — regardless of your turnover.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => { setReportingEntity('yes'); setStep(2) }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 font-semibold text-sm transition-colors"
                  >
                    Yes, I'm a reporting entity
                  </button>
                  <button
                    onClick={() => { setReportingEntity('no'); setStep(2) }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 font-semibold text-sm transition-colors"
                  >
                    No / not sure
                  </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                  Not sure if you're captured?{' '}
                  <button onClick={onOpenEligibility} className="text-orange-600 dark:text-orange-400 font-semibold underline hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                    Take the full AML compliance check
                  </button>.
                </p>
                <button onClick={() => setStep(0)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold mb-1">3. Which of these do you already have in place?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Answer all four to see your result ({Object.keys(haveDocs).length}/4)</p>
                <div className="space-y-3 mb-6">
                  {DOCUMENTS.map((d) => (
                    <div key={d.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                      <p className="font-semibold text-sm mb-1">{d.title} <span className="text-orange-600 dark:text-orange-400 font-bold text-xs">({d.tag})</span></p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{d.desc}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => answerDoc(d.id, true)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${haveDocs[d.id] === true ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'}`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => answerDoc(d.id, false)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${haveDocs[d.id] === false ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-200 dark:border-slate-700 hover:border-orange-400'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
              </div>
            )}
          </>
        )}

        {result === 'not-captured' && (
          <div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
              <p className="font-bold mb-1">This check is for AML/CTF reporting entities</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The Privacy Act small-business exemption removal specifically applies to businesses providing a designated service under the AML/CTF Act. If you're not sure whether that's you, the full eligibility check can confirm it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={onOpenEligibility} className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm transition-colors">
                Take the full AML compliance check →
              </button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Start again →</button>
          </div>
        )}

        {result === 'checked' && (
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
              Privacy readiness: {haveCount} of {DOCUMENTS.length}
            </span>

            {missing.length === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 mb-6">
                <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">All four core privacy documents are in place</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">
                  As {industryLabel.toLowerCase()}, you're likely an APP entity for your AML/CTF handling — and it sounds like you've already covered the essentials. Worth a periodic review as your business changes.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                  You are likely an APP entity for your AML/CTF handling, and {missing.length === DOCUMENTS.length ? 'none of the four core privacy documents are' : `${missing.length} of the four core privacy documents ${missing.length === 1 ? 'is' : 'are'} not`} in place yet.
                </h1>
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-6 mb-6">
                  <p className="font-semibold text-sm mb-3">What you still need</p>
                  <ul className="space-y-3">
                    {missing.map((d) => (
                      <li key={d.id} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span><span className="font-semibold text-slate-900 dark:text-white">{d.title} ({d.tag}):</span> {d.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 mb-6">
                  <p className="font-bold text-blue-700 dark:text-blue-300 mb-1">Generate the {missing.length} document{missing.length === 1 ? '' : 's'} you're missing</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                    AmlIntel Premium drafts these for you — prefilled from your industry, grounded in the same Privacy Act requirements above.
                  </p>
                  <button
                    onClick={() => onOpenPrivacyPack?.({ industry, missingDocs: missing.map((d) => d.id) })}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    Open your Privacy Pack →
                  </button>
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={onOpenSetupGuide} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors">
                See the full setup guide
              </button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Check another business →</button>
          </div>
        )}

        {result && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8">
            This is general information based on your answers, not legal advice. Confirm how the Australian Privacy Principles apply to your specific business with a qualified adviser.
          </p>
        )}
      </div>
    </div>
  )
}
