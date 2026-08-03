import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ExternalLink, ClipboardList, AlertTriangle, XCircle, HelpCircle, BookOpen } from 'lucide-react'
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

const FORM_PARTS = [
  {
    part: 'Part C — the suspicious person',
    detail: "Full name, address, date of birth, country of citizenship, occupation, and whatever ID documents you used to verify them. Can't identify them? A physical description and anything else you have still goes here.",
  },
  {
    part: 'Part D — other parties',
    detail: "Anyone else connected to the matter — joint or authorised signatories, or a customer who's actually the victim (identity fraud, for example) rather than the suspect. Victims belong in Part D, not Part C.",
  },
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

const COMMON_MISTAKES = [
  {
    title: 'Being too vague',
    detail: '"Client seemed suspicious" won\'t cut it. Name the specific behaviour — an unusual transaction size, documents that don\'t line up, evasiveness when asked routine questions.',
  },
  {
    title: 'Missing the deadline',
    detail: "The 24-hour and 3-business-day clocks start the moment you form the suspicion, not once you've finished investigating. Give whoever files your SMRs a way to hear about suspicions immediately.",
  },
  {
    title: 'Mixing up victim and suspect',
    detail: "A customer who's been defrauded isn't the suspicious person — their details go in Part D. The person actually behind the activity goes in Part C.",
  },
  {
    title: 'Burying details in free text',
    detail: "If you've got a description but no verified ID for the suspicious person, that still belongs in Part C — not tucked into a free-text field where it's easy to miss.",
  },
  {
    title: 'Waiting for certainty before filing',
    detail: 'You only need reasonable grounds to suspect, not proof. Reporting in good faith is legally protected, so when in doubt, file.',
  },
]

const CASE_STUDIES = [
  {
    title: 'Drug syndicate dismantled',
    detail: 'An SMR helped investigators identify individuals and financial transactions connected to a drug syndicate, and establish the links between its members. Two people were convicted.',
  },
  {
    title: 'Wanted fugitive identified',
    detail: 'SMRs flagged an offender running multiple bank accounts under a false name and moving large, unexplained sums domestically and overseas. He turned out to be wanted internationally for cybercrime and fraud, and was later convicted.',
  },
  {
    title: 'Identity-fraud syndicate uncovered',
    detail: 'A criminal syndicate used fraudulently obtained identities to open more than 60 bank accounts across Australian institutions and laundered an estimated $2.5 million offshore. Suspicious reporting was part of what unravelled it.',
  },
]

const FAQ = [
  {
    q: 'What if I file and it turns out to be nothing?',
    a: "You're protected. AUSTRAC doesn't penalise entities for reporting in good faith, even if the matter turns out to be unrelated to crime. It's far safer to report and be wrong than to stay silent on a genuine suspicion.",
  },
  {
    q: 'Can I hold off filing until I have more information?',
    a: 'No — the clock starts when you form the suspicion, not when your investigation is complete. File with what you know now, then submit an update if something material comes to light afterward.',
  },
  {
    q: 'Do I have to end the client relationship after filing?',
    a: "Not automatically. Filing an SMR doesn't require you to offboard the customer. Consider whether the ongoing risk calls for enhanced due diligence, and talk to your compliance officer or a legal adviser if you're unsure.",
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

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
          <p className="font-semibold text-sm mb-4">Where suspicious-person details actually go on the form</p>
          <div className="space-y-4">
            {FORM_PARTS.map((item) => (
              <div key={item.part}>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{item.part}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
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

        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Common mistakes to avoid</h2>
          <ul className="space-y-3">
            {COMMON_MISTAKES.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                <span><span className="font-semibold text-slate-800 dark:text-slate-100">{item.title}:</span> {item.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">What you can and can't say once you're filing</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5">
              <p className="font-semibold text-sm text-red-700 dark:text-red-300 mb-3">You must not</p>
              <ul className="space-y-2">
                {[
                  'Tell the customer you have filed an SMR about them',
                  'Tell the customer you are thinking about filing one',
                  'Warn the customer that their behaviour raised suspicion',
                  "Discuss it with anyone who doesn't need to know for compliance purposes",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 leading-relaxed">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5">
              <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-3">You can</p>
              <ul className="space-y-2">
                {[
                  'Discuss it with your AML/CTF compliance officer',
                  'Discuss it with colleagues who genuinely need to know',
                  'Discuss it with your legal adviser, in confidence',
                  'Discuss it with AUSTRAC itself',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
            These rules exist because tipping off a suspect gives them the chance to destroy evidence, move funds, or disappear before an investigation can act. Treat it as seriously as the filing deadline itself.
          </p>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-bold">Real cases SMRs have helped crack</h2>
          </div>
          <div className="space-y-3">
            {CASE_STUDIES.map((item) => (
              <div key={item.title} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <p className="font-semibold text-sm mb-1.5">{item.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <a
            href="https://www.austrac.gov.au/business/core-guidance/reporting/suspicious-matter-reports-smrs/smr-case-study-examples"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mt-3 transition-colors"
          >
            Published case studies via AUSTRAC <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-bold">Frequently asked questions</h2>
          </div>
          <div className="space-y-5">
            {FAQ.map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-sm mb-1.5">{item.q}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Related guidance</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <button onClick={onOpenComplianceOfficer} className="text-left text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-2xl px-5 py-4 transition-colors">
              Appoint & notify your Compliance Officer →
            </button>
            <button onClick={onOpenAustracEnrolment} className="text-left text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-2xl px-5 py-4 transition-colors">
              Not enrolled with AUSTRAC yet? →
            </button>
            <button onClick={onOpenRiskAssessment} className="text-left text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-2xl px-5 py-4 transition-colors">
              Run a quick risk assessment →
            </button>
            <button onClick={onOpenSetupGuide} className="text-left text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-2xl px-5 py-4 transition-colors">
              See the full Setup Guide →
            </button>
          </div>
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
