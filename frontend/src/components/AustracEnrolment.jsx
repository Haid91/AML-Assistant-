import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ExternalLink, ClipboardList } from 'lucide-react'
import Navbar from './Navbar'

const STORAGE_KEY = 'aml_enrolment_progress'

const BEFORE_YOU_START = [
  'Your ABN (plus ACN, AFSL, or ACLN if any of these apply to your business)',
  'Your legal business name, structure (company, partnership, sole trader, trust), and registered address',
  'A list of every designated service your business actually provides',
  "Your appointed AML/CTF Compliance Officer's name and contact details",
  "A senior manager's name and contact details",
  '12 months of earnings information — only if your reporting entity group earns $100 million or more per year',
]

const STEPS = [
  {
    title: 'Create your AUSTRAC Online account',
    what: 'Go to AUSTRAC Online and create a user account for yourself. This becomes your login for the enrolment form and all future AUSTRAC correspondence.',
    tip: 'Use a work email you check regularly — AUSTRAC sends account and enrolment updates here.',
  },
  {
    title: 'Start the Business Profile Form (ABPF)',
    what: 'From your AUSTRAC Online account, start the AUSTRAC Business Profile Form — this is the actual enrolment application for your business.',
    tip: "Takes about 30 minutes if you have your information ready. You can save and return within 14 days — after that, your progress is lost and you'll need to start again.",
  },
  {
    title: 'Enter your business details',
    what: 'Legal business name, ABN/ACN, business structure, and registered address.',
    tip: null,
  },
  {
    title: 'Select your designated services',
    what: 'Select every designated service your business provides — this determines which obligations apply to you, so be thorough and accurate rather than under- or over-selecting.',
    tip: null,
  },
  {
    title: 'Enter key personnel details',
    what: 'Name and contact details for your AML/CTF Compliance Officer and a senior manager with authority over your AML/CTF Program.',
    tip: "This should be who you've actually appointed, not a placeholder — the same person from Setup Guide step 2.",
  },
  {
    title: 'Review and submit',
    what: 'Check every section for accuracy before submitting.',
    tip: 'Incorrect information must be corrected within 14 days of any change, so it\'s worth getting right the first time.',
  },
  {
    title: 'Save your confirmation',
    what: "After submitting, you'll receive a receipt number and an AUSTRAC Account Number (AAN). Keep both — the AAN is your business's permanent identifier with AUSTRAC.",
    tip: null,
  },
]

export default function AustracEnrolment({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators }) {
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
        onOpenSmrGuide={onOpenSmrGuide}
        onOpenComplianceOfficer={onOpenComplianceOfficer}
        onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators}
      />

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
            Free — no signup required
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Enrol with AUSTRAC, step by step</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            A walkthrough of the real AUSTRAC Business Profile Form process — what to have ready, and what each step actually asks for.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="font-semibold text-sm">Before you start</p>
          </div>
          <ul className="space-y-2">
            {BEFORE_YOU_START.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://www.austrac.gov.au/new-austrac/enrol-us/enrol-us-overview"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl px-5 py-4 mb-10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
        >
          <div>
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">This is where you'll actually enrol</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">AmlIntel guides you through the process — enrolment itself happens on AUSTRAC's own site.</p>
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

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-10">
          <p className="font-semibold text-sm mb-3">After you submit</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              AUSTRAC generally takes 5–10 business days to process your enrolment.
            </li>
            <li className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              Enrolment alone doesn't complete your obligations — you should have your AML/CTF Program in place around the same time.
            </li>
            <li className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              Keep your details current — you must update AUSTRAC within 14 days of any change to your enrolled information.
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-center">
          <p className="text-lg font-bold text-white mb-2">What's next</p>
          <p className="text-slate-400 text-sm mb-6">Once you're enrolled, get your AML/CTF Program drafted and see the rest of your obligations.</p>
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
