import { Eye, AlertTriangle, ArrowRight } from 'lucide-react'
import Navbar from './Navbar'
import { SECTORS } from './SectorGuide'

const WORKED_EXAMPLES = {
  accountant: {
    title: 'Structured trust account deposits',
    concern: "Reasonable grounds to suspect structuring designed to avoid the AUD $10,000 Threshold Transaction Report obligation under Section 43 of the AML/CTF Act 2006.",
    customerProfiling: 'Sole-trader landscaping client, engaged since 2023, with declared annual turnover of around $140,000. No prior reports on file.',
    suspiciousActivity: 'Over an eight-week period the client made nine separate cash deposits into the firm\'s trust account, each between $8,200 and $9,700 and totalling $78,000 — well above anything seen in the two years prior. Asked about the source, the client described the funds only as "private jobs," could not produce invoices, and asked that the balance be moved to a newly incorporated entity with no trading history.',
    indicatorRefs: [
      "Instructions to move funds through the practice's trust account with no underlying commercial rationale",
      "Client's declared income or business activity doesn't match the volume of funds passing through their accounts",
    ],
  },
  lawyer: {
    title: 'Cash-funded settlement with a silent third party',
    concern: 'Reasonable grounds to suspect the source of settlement funds is being deliberately obscured, potentially engaging money laundering offences under Part 10.2 of the Criminal Code Act 1995 (Cth).',
    customerProfiling: 'Client instructed the firm on a residential purchase; retainer commenced four weeks before scheduled settlement.',
    suspiciousActivity: 'Days before settlement, the client asked for the deposit to be paid directly by a third party not named on the contract, described only as "a family friend helping out." The client could not explain the relationship further and grew reluctant to answer follow-up questions about where those funds actually came from.',
    indicatorRefs: [
      'Client is reluctant to explain the source of settlement funds or provides vague, unverifiable answers',
      "Instructions come from a third party who isn't a party to the matter, with no clear authority",
    ],
  },
  realestate: {
    title: 'Rapid resale at an inflated price',
    concern: 'Reasonable grounds to suspect the purchase and rapid on-sale of a property is being used to layer funds of uncertain origin.',
    customerProfiling: 'Buyer is a company incorporated four weeks before the offer was made; sole director is an overseas national with no prior property dealings known to the agency.',
    suspiciousActivity: "The buyer offered 28% above the agent's appraisal with no negotiation, settled in full via a single international wire transfer from an account not held in the buyer's name, and relisted the property for resale within three weeks of settlement at a price close to the original offer.",
    indicatorRefs: [
      'Rapid on-sale of a property shortly after purchase, at a price inconsistent with market movement',
      'Settlement funds arrive from a third party or an entity unrelated to the named purchaser',
    ],
  },
  tcsp: {
    title: 'Nominee director request with no rationale',
    concern: 'Reasonable grounds to suspect the requested structure is intended to obscure beneficial ownership.',
    customerProfiling: 'New client requesting company formation services — first engagement with the firm.',
    suspiciousActivity: 'The client asked the firm to appoint a nominee director and use the firm\'s own address as the registered office, declined to explain the commercial reason for the arrangement, and asked for the paperwork to be completed "quickly and quietly" with the actual controller\'s name kept off all public filings.',
    indicatorRefs: [
      'Client requests a nominee director or shareholder with no credible commercial reason',
      'Client requests services be conducted with unusual secrecy or urgency',
    ],
  },
  bullion: {
    title: 'Structured bullion purchases',
    concern: 'Reasonable grounds to suspect deliberate structuring of cash purchases to avoid the AUD $10,000 Threshold Transaction Report obligation.',
    customerProfiling: 'Walk-in customer with no prior purchase history at the business; provided a driver\'s licence as identification.',
    suspiciousActivity: 'The customer made four separate gold bullion purchases across five days, each paid in cash and each between $8,400 and $9,600 — $34,600 in total. Each time she said the purchase was "a gift," but bought identical items on every visit and gave an address that didn\'t match her identification.',
    indicatorRefs: [
      'Customer makes several purchases just under the reporting threshold in a short period (structuring)',
      "Unusual requests for anonymity or reluctance to provide identification",
    ],
  },
}

const CROSS_INDUSTRY_FLAGS = [
  'Reluctance or evasiveness when asked routine, low-stakes questions about the source of funds',
  'Transactions structured to sit just under a reporting threshold, especially several in short succession',
  'Unexplained urgency or pressure to complete a transaction quickly, with no clear commercial reason',
  "Funds arriving from, or being sent to, a third party who isn't connected to the customer or the matter",
  "A customer's declared occupation or income doesn't match the volume or pattern of their transactions",
  'Use of cash where the customer\'s circumstances make cash an unusual or impractical choice',
  'Requests for unusual secrecy, or to bypass standard identification and documentation steps',
  'A pattern of activity that only really makes sense if its purpose is to move or obscure funds, not the stated one',
]

export default function SuspiciousActivityIndicators({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenPrivacyCheck, onOpenComplianceCalendar }) {
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
        onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceCalendar={onOpenComplianceCalendar}
      />

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5">
            Free — no signup required
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Suspicious Activity Indicators</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            The behavioural and transactional patterns that actually warrant a closer look — general indicators, plus what to watch for in your specific sector.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-10">
          <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            One indicator on its own is rarely conclusive — it's usually the combination, or the absence of a plausible explanation, that turns an observation into a genuine suspicion. Use these as prompts to look closer, not as an automatic reporting trigger.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-bold mb-4">Cross-industry indicators</h2>
          <ul className="space-y-2.5">
            {CROSS_INDUSTRY_FLAGS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-bold mb-5">By industry</h2>
          <div className="space-y-5">
            {Object.entries(SECTORS).map(([key, sector]) => {
              const Icon = sector.icon
              const example = WORKED_EXAMPLES[key]
              return (
                <div key={sector.label} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-sm">{sector.label}</p>
                  </div>
                  <ul className="space-y-2">
                    {sector.redFlags.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {example && (
                    <div className="mt-4 border-l-4 border-orange-300 dark:border-orange-500/50 bg-orange-50/50 dark:bg-orange-500/5 rounded-r-xl pl-4 pr-4 py-3">
                      <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-2">Worked example — {example.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-2">
                        <span className="font-semibold not-italic text-slate-700 dark:text-slate-200">Concern: </span>{example.concern}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-2">
                        <span className="font-semibold not-italic text-slate-700 dark:text-slate-200">Customer profiling: </span>{example.customerProfiling}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-3">
                        <span className="font-semibold not-italic text-slate-700 dark:text-slate-200">Suspicious activity: </span>{example.suspiciousActivity}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Indicators present:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {example.indicatorRefs.map((ref) => (
                          <span key={ref} className="text-xs text-orange-700 dark:text-orange-400 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-500/30 rounded-full px-2.5 py-1">
                            {ref.length > 60 ? ref.slice(0, 57) + '…' : ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <button
            onClick={onOpenSetupGuide}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors mt-5"
          >
            Full CDD &amp; EDD guidance by sector in the Setup Guide <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-5 mb-10">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-red-700 dark:text-red-300 mb-1">Spotting a red flag isn't the same as reasonable grounds to suspect</p>
            <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
              These indicators tell you where to look — whether they add up to a reportable suspicion depends on the full picture. Once you're at that point, our{' '}
              <button onClick={onOpenSmrGuide} className="underline font-semibold hover:text-red-700 dark:hover:text-red-300 transition-colors">
                SMR filing guide
              </button>{' '}
              walks through the reasonable-grounds threshold, deadlines, and the filing process itself.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <p className="font-semibold mb-1">Not sure where you stand?</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Take the free eligibility check, or get a first-pass AML/CTF Program drafted for your business.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onOpenEligibility} className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 rounded-xl font-semibold text-sm transition-colors">
              Free eligibility check
            </button>
            <button onClick={onOpenProgramBuilder} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
              Draft your AML/CTF Program →
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">
          Educational guidance only — not legal advice, and not an exhaustive list. Consult a qualified AML/CTF professional for advice specific to your firm.
        </p>
      </div>
    </div>
  )
}
