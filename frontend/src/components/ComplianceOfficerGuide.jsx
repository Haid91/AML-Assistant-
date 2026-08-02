import { useState } from 'react'
import { ShieldCheck, ExternalLink, AlertTriangle, Copy, Check } from 'lucide-react'
import Navbar from './Navbar'

const REQUIREMENTS = [
  'Management level — a real position of seniority within the business, not a junior or administrative role',
  '"Fit and proper" — assessed on competence, judgement, and integrity',
  'Genuine authority, resources, and capacity to actually perform the role — a substantive appointment, not a title',
  'Independence from undue influence, with unfettered access to senior management and the information needed to do the job',
]

const WHO_NOT_TO_APPOINT = [
  'A junior staff member with no real authority to make decisions or escalate concerns',
  'Someone whose other duties create a conflict (e.g. they\'d effectively be reviewing their own transactions or decisions)',
  'A placeholder appointment made only to tick the enrolment box, with no intention of them actually doing the role',
]

const TEMPLATE = `AML/CTF COMPLIANCE OFFICER — APPOINTMENT NOTICE

Business name: [Business Name]
ABN: [ABN]

This notice confirms the appointment of:

Name: [Full Name]
Position: AML/CTF Compliance Officer
Reports to: [Senior Manager / Board]
Effective date: [DD/MM/YYYY]

Authority and responsibilities:
[Name] is appointed with the authority to make AML/CTF-related decisions, escalate suspicious activity, implement and oversee the business's AML/CTF Program, and report directly to [senior management / the board] without undue influence from other parts of the business.

Approved by:
Name: [Approver Name]
Position: [Position]
Signature: _______________________
Date: [DD/MM/YYYY]

Note: This appointment must also be notified to AUSTRAC within 14 days via AUSTRAC Online.`

export default function ComplianceOfficerGuide({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenRiskAssessment }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(TEMPLATE)
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
        onOpenRiskAssessment={onOpenRiskAssessment}
      />

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
            Free — no signup required
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Appoint your AML/CTF Compliance Officer</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            What AUSTRAC actually requires of the role, and how to notify them once you've made the appointment.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="font-semibold text-sm">What AUSTRAC requires of this role</p>
          </div>
          <ul className="space-y-2">
            {REQUIREMENTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-1">Who this shouldn't be</p>
            <ul className="space-y-1.5 mt-2">
              {WHO_NOT_TO_APPOINT.map((item) => (
                <li key={item} className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">— {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6 mb-8">
          <p className="font-semibold text-sm text-red-700 dark:text-red-300 mb-2">Don't forget to notify AUSTRAC</p>
          <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
            Appointing your Compliance Officer internally isn't enough on its own — you must also notify AUSTRAC of the appointment within <strong>14 days</strong>, via an online form in AUSTRAC Online. If your Compliance Officer later leaves or becomes ineligible, you must appoint a replacement and notify AUSTRAC again.
          </p>
        </div>

        <a
          href="https://www.austrac.gov.au/industry-and-business/obligations-and-guidance/your-amlctf-program/develop-your-amlctf-programs/step-1-establish-your-governance-framework/amlctf-compliance-officer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl px-5 py-4 mb-10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
        >
          <div>
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">Read AUSTRAC's full guidance on this role</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Notification itself happens on AUSTRAC's own site.</p>
          </div>
          <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        </a>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Appointment notice template</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{TEMPLATE}</pre>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">A starting point to customise — not legal advice.</p>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-center">
          <p className="text-lg font-bold text-white mb-2">What's next</p>
          <p className="text-slate-400 text-sm mb-6">Assess your risk, then get your AML/CTF Program drafted.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onOpenRiskAssessment} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
              Assess your risk →
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
