import { useState } from 'react'
import Navbar from './Navbar'

export default function ReportableTransactionCheck({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenSmrDraft }) {
  const [step, setStep] = useState(0)
  const [cash, setCash] = useState(null)
  const [international, setInternational] = useState(null)
  const [suspicious, setSuspicious] = useState(null)
  const [terrorism, setTerrorism] = useState(null)
  const [result, setResult] = useState(null)

  const restart = () => {
    setStep(0); setCash(null); setInternational(null); setSuspicious(null); setTerrorism(null); setResult(null)
  }

  const finish = (terrorismAnswer) => {
    if (terrorismAnswer !== undefined) setTerrorism(terrorismAnswer)
    setResult('checked')
  }

  const obligations = []
  if (cash === 'yes') {
    obligations.push({
      key: 'ttr',
      name: 'Threshold Transaction Report (TTR)',
      due: 'Within 10 business days of the transaction',
      desc: 'Triggered by a physical cash transaction of A$10,000 or more in a single transaction (or two or more transactions you have reasonable grounds to believe are related, structured to avoid the threshold).',
    })
  }
  if (international === 'yes') {
    obligations.push({
      key: 'ifti',
      name: 'International Funds Transfer Instruction (IFTI) report',
      due: 'Within 10 business days of sending or receiving the instruction',
      desc: 'Triggered by any instruction to transfer money into or out of Australia — there is no minimum dollar threshold.',
    })
  }
  if (suspicious === 'yes') {
    obligations.push({
      key: 'smr',
      name: 'Suspicious Matter Report (SMR)',
      due: terrorism === 'yes' ? 'Within 24 hours of forming the suspicion' : 'Within 3 business days of forming the suspicion',
      desc: 'Triggered by reasonable grounds to suspect the transaction relates to money laundering, terrorism financing, or another serious offence — regardless of the dollar amount.',
    })
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
        onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators}
        onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceCalendar={onOpenComplianceCalendar}
        onOpenClientRiskRegister={onOpenClientRiskRegister}
        onOpenSmrDraft={onOpenSmrDraft}
      />

      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        {!result && (
          <>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-full mb-5">
                Free — no signup required
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Is this transaction reportable?</h1>
              <p className="text-slate-500 dark:text-slate-400">Answer a few questions about a specific transaction to see which AUSTRAC reports it triggers.</p>
            </div>

            <div className="flex items-center gap-2 mb-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              ))}
            </div>

            {step === 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2">1. Is it a cash transaction of A$10,000 or more?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Physical currency — a single transaction, or two or more you have reasonable grounds to believe are related.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setCash('yes'); setStep(1) }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => { setCash('no'); setStep(1) }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold mb-2">2. Does it involve an international funds transfer?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Sending or receiving an instruction to transfer money into or out of Australia — any amount.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => { setInternational('yes'); setStep(2) }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => { setInternational('no'); setStep(2) }}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                  >
                    No
                  </button>
                </div>
                <button onClick={() => setStep(0)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold mb-2">3. Do you suspect it's related to a serious offence?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Reasonable grounds to suspect money laundering, terrorism financing, or another serious offence — regardless of amount.
                </p>
                {suspicious !== 'yes' ? (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setSuspicious('yes')}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => { setSuspicious('no'); finish() }}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-3">Does the suspicion specifically relate to terrorism financing?</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">This changes the filing deadline — 24 hours for terrorism financing, 3 business days for everything else.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => finish('yes')} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors">
                        Yes — terrorism financing
                      </button>
                      <button onClick={() => finish('no')} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors">
                        No — other serious offence
                      </button>
                    </div>
                  </div>
                )}
                <button onClick={() => setStep(1)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
              </div>
            )}
          </>
        )}

        {result === 'checked' && (
          <div>
            {obligations.length === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 mb-6">
                <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">No reporting obligation triggered by this transaction alone</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">
                  Based on your answers, this specific transaction doesn't meet the cash threshold, isn't an international transfer, and hasn't raised a suspicion. Your ongoing CDD and transaction-monitoring obligations still apply regardless.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                  This transaction triggers {obligations.length} report{obligations.length === 1 ? '' : 's'}
                </h1>
                <div className="space-y-3 mb-6">
                  {obligations.map((o) => (
                    <div key={o.key} className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-5">
                      <p className="font-bold text-orange-700 dark:text-orange-400 mb-1">{o.name}</p>
                      <p className="text-sm text-orange-600 dark:text-orange-300 mb-2">Due: {o.due}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{o.desc}</p>
                    </div>
                  ))}
                </div>
                {suspicious === 'yes' && (
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 mb-6">
                    <p className="font-bold text-blue-700 dark:text-blue-300 mb-1">Filing an SMR?</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">See the full filing walkthrough — content, tipping-off rules, and how to lodge it.</p>
                    <button onClick={onOpenSmrGuide} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
                      View the SMR guide →
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={onOpenSuspiciousIndicators} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors">
                Suspicious activity indicators
              </button>
              <button onClick={onSignUp} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors">
                Sign up free
              </button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Check another transaction →</button>
          </div>
        )}

        {result && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8">
            This is general information based on your answers, not legal advice. A transaction can trigger more than one report — confirm your specific reporting obligations with a qualified adviser.
          </p>
        )}
      </div>
    </div>
  )
}
