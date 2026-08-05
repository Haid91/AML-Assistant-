import { useState } from 'react'
import Navbar from './Navbar'

const INDUSTRIES = [
  { id: 'lawyer', label: 'Lawyer or Conveyancer', desc: 'Lawyers, solicitors, and licensed conveyancers providing designated services like property settlements and trust or company services' },
  { id: 'accountant', label: 'Accountant / Bookkeeper', desc: 'Accountants, tax agents, BAS agents, and bookkeepers providing designated services' },
  { id: 'realestate', label: 'Real Estate Agent', desc: 'Real estate agents, property managers, and auctioneers involved in property transactions' },
  { id: 'tcsp', label: 'Trust & Company Service Provider', desc: 'Firms that form, manage, or provide registered office/nominee services for companies and trusts' },
  { id: 'bullion', label: 'Jeweller / Precious Metals Dealer', desc: 'Dealers in precious metals, precious stones, and high-value jewellery transactions' },
  { id: 'other', label: 'Other / Not sure', desc: "Not listed above, or you're not sure which category applies" },
]

const SERVICES = [
  { id: 'trust', label: 'Managing client trust accounts', desc: 'Holding or managing money on behalf of clients in trust' },
  { id: 'realestate', label: 'Buying or selling real estate', desc: "Assisting clients with purchase or sale of real property" },
  { id: 'formation', label: 'Company/trust formation', desc: 'Establishing, operating, or managing companies, trusts, or other legal structures' },
  { id: 'assets', label: 'Managing financial assets', desc: "Managing client bank accounts, securities, or other financial assets" },
  { id: 'transactions', label: 'Arranging transactions', desc: 'Organising contributions for the creation, operation, or management of a company' },
]

const OBLIGATIONS = [
  'Enrol with AUSTRAC (deadline was 29 July 2026)',
  'Have an AML/CTF Program in place (Part A & Part B)',
  'Conduct customer due diligence (CDD)',
  'Appoint an AML/CTF Compliance Officer',
  'Conduct an ML/TF risk assessment (EWRA)',
  'Train employees on AML/CTF obligations',
  'Monitor transactions and file SMRs when required',
  'Keep records for 7 years',
]

export default function EligibilityCheck({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard }) {
  const [step, setStep] = useState(0)
  const [industry, setIndustry] = useState(null)
  const [services, setServices] = useState([])
  const [australia, setAustralia] = useState(null)
  const [result, setResult] = useState(null)

  const toggleService = (id) => {
    setServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const restart = () => {
    setStep(0); setIndustry(null); setServices([]); setAustralia(null); setResult(null)
  }

  const checkEligibility = (australiaAnswer) => {
    setAustralia(australiaAnswer)
    if (australiaAnswer === 'no') {
      setResult('not-au')
    } else if (industry === 'other' && services.length === 0) {
      setResult('unsure')
    } else {
      setResult('in-scope')
    }
  }

  const industryLabel = INDUSTRIES.find((i) => i.id === industry)?.label || 'your industry'
  const industryArticle = /^[aeiou]/i.test(industryLabel) ? 'an' : 'a'

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
        onOpenProgramBuilder={onOpenProgramBuilder}
        onOpenAustracEnrolment={onOpenAustracEnrolment}
        onOpenSmrGuide={onOpenSmrGuide}
        onOpenComplianceOfficer={onOpenComplianceOfficer}
        onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators}
        onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceCalendar={onOpenComplianceCalendar}
        onOpenClientRiskRegister={onOpenClientRiskRegister}
        onOpenReportableTransactionCheck={onOpenReportableTransactionCheck}
        onOpenComplianceDashboard={onOpenComplianceDashboard}
      />

      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        {!result && (
          <>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-full mb-5">
                Free — no signup required
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Do you need AML/CTF compliance?</h1>
              <p className="text-slate-500 dark:text-slate-400">Answer 3 quick questions to find out (30 seconds)</p>
            </div>

            <div className="flex items-center gap-2 mb-10">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
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
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">{ind.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ind.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold mb-1">2. Which services do you provide?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select all that apply. These are "designated services" under the AML/CTF Act.</p>
                <div className="space-y-2 mb-6">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                        services.includes(s.id)
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${services.includes(s.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                        {services.includes(s.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{s.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(0)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
                  <button onClick={() => setStep(2)} className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold mb-4">3. Does your business operate in Australia?</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => checkEligibility('yes')}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => checkEligibility('no')}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 font-semibold text-sm transition-colors"
                  >
                    No
                  </button>
                </div>
                <button onClick={() => setStep(1)} className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Back</button>
              </div>
            )}
          </>
        )}

        {result === 'in-scope' && (
          <div>
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6 mb-6">
              <p className="font-bold text-red-700 dark:text-red-400 mb-1">Your business likely needs AML/CTF compliance</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                As {industryArticle} {industryLabel.toLowerCase()}, you're likely covered by the Tranche 2 reforms, in force since <strong>1 July 2026</strong> — AUSTRAC enrolment was required by <strong>29 July 2026</strong>.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
              <p className="font-semibold mb-4">Your likely obligations</p>
              <ul className="space-y-2.5">
                {OBLIGATIONS.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-6">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Non-compliance penalties can reach up to <strong>$36.4 million per contravention</strong> for companies (100,000 penalty units) and <strong>$7.28 million</strong> for individuals (20,000 penalty units), at $364 per penalty unit effective 1 July 2026.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={onOpenProgramBuilder} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
                Draft my AML/CTF Program →
              </button>
              <button onClick={onOpenSetupGuide} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
                See the setup guide
              </button>
              <button onClick={onSignUp} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors">
                Sign up free
              </button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Check another business →</button>
          </div>
        )}

        {result === 'not-au' && (
          <div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
              <p className="font-bold mb-1">This check is for Australian businesses</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                AUSTRAC's AML/CTF Act and the Tranche 2 reforms apply to businesses operating in Australia. If you operate under a different regulator (e.g. the UK's MLR 2017 or the US BSA), the AI assistant can still help — it's grounded in FATF, BSA, EU AML Directives, and FinCEN guidance too.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={onSignUp} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">Sign up free →</button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Check another business →</button>
          </div>
        )}

        {result === 'unsure' && (
          <div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
              <p className="font-bold mb-1">We can't tell for sure from this alone</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Since you didn't select a listed Tranche 2 category or any designated services, whether AML/CTF obligations apply depends on the specific services your business provides. The AI assistant can walk through your specific situation, or start with the setup guide's first step, which covers how to determine reporting-entity status.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <button onClick={onOpenSetupGuide} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
                See the setup guide →
              </button>
              <button onClick={onSignUp} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-colors">
                Ask the AI assistant
              </button>
            </div>
            <button onClick={restart} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Check another business →</button>
          </div>
        )}

        {result && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8">
            This check is based on public AUSTRAC guidance and does not constitute legal advice. Please consult a licensed professional for confirmation.
          </p>
        )}
      </div>
    </div>
  )
}
