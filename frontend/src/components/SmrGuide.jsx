import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ExternalLink, ClipboardList, AlertTriangle } from 'lucide-react'
import Navbar from './Navbar'

const STORAGE_KEY = 'aml_smr_progress'

const ESSENTIAL_ELEMENTS = [
  'Who — full name, address, date of birth, country of citizenship, occupation, ABN if applicable, and the ID documents used to verify them',
  'What — the transaction(s) or activity involved',
  'Where — the location or channel the activity occurred through',
  'When — dates and times of the relevant activity',
  "Why — the specific facts, behaviours, or circumstances that triggered your suspicion, described factually, not speculatively",
  'How — how the activity was carried out',
]

const STEPS = [
  {
    title: 'Confirm you have reasonable grounds to suspect',
    what: '"Reasonable grounds to suspect" is a materially lower bar than proof. You don\'t need a confession or certainty — an unexplained, undocumented pattern that doesn\'t add up is often enough on its own.',
    tip: null,
  },
  {
    title: 'Avoid tipping off the customer',
    what: 'While you prepare the report, be discreet in any further dealings with the customer. Do not disclose, hint at, or change your behaviour toward them in a way that could reveal your suspicion.',
    tip: null,
  },
  {
    title: 'Log in to AUSTRAC Online',
    what: 'Use your reporting entity credentials to log in to AUSTRAC Online.',
    tip: null,
  },
  {
    title: 'Go to Transaction Reporting → Create/Amend Reports → SMR',
    what: 'From the transaction reporting menu, select the option to create a new report and choose SMR as the report type.',
    tip: null,
  },
  {
    title: 'Complete the six essential elements',
    what: 'Work through Who, What, Where, When, Why, and How — see the checklist above for exactly what each needs.',
    tip: null,
  },
  {
    title: 'Submit before your deadline',
    what: "Don't delay to investigate further. File the SMR with the information you have now, then submit an update to AUSTRAC if you learn something materially new afterward.",
    tip: null,
  },
  {
    title: 'Keep your records',
    what: 'Retain your SMR and the records that supported it for 7 years.',
    tip: null,
  },
]

export default function SmrGuide({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment }) {
  const [checked, setChecked] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setChecked(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const toggleStep = (i) => {
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const completedCount = STEPS.filter((_, i) => checked[i]).length

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
        onOpenComplianceOfficer={onOpenComplianceOfficer}
        onOpenRiskAssessment={onOpenRiskAssessment}
      />

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
            Free — no signup required
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">File a Suspicious Matter Report, step by step</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            A walkthrough of the real SMR process — deadlines, what an effective report needs, and what to watch out for.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">24 hours</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">From forming a suspicion of terrorism financing.</p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">3 business days</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">From forming a suspicion of any other matter — money laundering, fraud, etc.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5 mb-8">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-red-700 dark:text-red-300 mb-1">Tipping off is a criminal offence</p>
            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
              Disclosing to anyone that you have lodged, are lodging, or intend to lodge an SMR is a criminal offence carrying imprisonment. This covers direct disclosure, hints, and any change in behaviour toward the customer that could alert them — not just telling them outright.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="font-semibold text-sm">Before you start — the 6 essential elements</p>
          </div>
          <ul className="space-y-2">
            {ESSENTIAL_ELEMENTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://www.austrac.gov.au/industry-and-business/obligations-and-guidance/your-amlctf-program/reporting-us/suspicious-matter-reports"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl px-5 py-4 mb-10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
        >
          <div>
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">This is where you'll actually file it</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">AmlIntel guides you through the process — filing itself happens on AUSTRAC's own site.</p>
          </div>
          <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        </a>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">The 7 steps</h2>
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{completedCount} / {STEPS.length} done</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3 mb-10">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`border rounded-2xl p-5 transition-colors ${
                checked[i]
                  ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <button onClick={() => toggleStep(i)} className="flex items-start gap-3 w-full text-left">
                {checked[i] ? (
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold text-sm mb-1.5 ${checked[i] ? 'text-slate-500 dark:text-slate-400 line-through' : ''}`}>
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.what}</p>
                  {step.tip && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{step.tip}</p>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-center">
          <p className="text-lg font-bold text-white mb-2">What's next</p>
          <p className="text-slate-400 text-sm mb-6">Review the rest of your ongoing obligations, or get your AML/CTF Program drafted if you haven't already.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onOpenProgramBuilder} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
              Draft your AML/CTF Program →
            </button>
            <button onClick={onOpenSetupGuide} className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors">
              See the full Setup Guide
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8">
          Educational guidance only — not legal advice, and not a substitute for AUSTRAC's own instructions. Consult a qualified AML/CTF professional for advice specific to your firm.
        </p>
      </div>
    </div>
  )
}
