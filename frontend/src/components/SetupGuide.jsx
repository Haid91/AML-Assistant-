import {
  UserPlus, ShieldCheck, Search, FileText, UserCheck, Send, GraduationCap,
  CalendarCheck, Clock, Calendar, Calculator, Scale, Home, Building, Gem,
} from 'lucide-react'
import Navbar from './Navbar'

const STEPS = [
  {
    id: 'enrol',
    title: 'Enrol with AUSTRAC',
    journeyLabel: 'Enrol',
    icon: UserPlus,
    whatItInvolves: 'Enrol your business as a reporting entity through AUSTRAC Online before providing any designated service, using your ABN and a description of the services you provide.',
    whyItMatters: 'Enrolment registers you with the regulator and is a legal prerequisite to lawfully providing designated services under the AML/CTF Act.',
    ifMissed: 'Providing designated services while unenrolled is itself a contravention — AUSTRAC can pursue civil penalties even before considering your program\'s adequacy.',
  },
  {
    id: 'officer',
    title: 'Appoint an AML/CTF Compliance Officer',
    journeyLabel: 'Officer',
    icon: ShieldCheck,
    whatItInvolves: 'Designate a suitably senior person — often called the MLRO — with real authority to make account/matter decisions, escalate suspicious activity, and report to leadership.',
    whyItMatters: 'AUSTRAC expects a named, accountable individual, not a shared or undefined responsibility — every other obligation below routes through this role.',
    ifMissed: 'Without a designated compliance officer, suspicious matters have no clear escalation path — a common finding behind AUSTRAC enforcement actions against firms with "compliance in name only".',
  },
  {
    id: 'risk-assessment',
    title: 'Conduct an Enterprise-Wide Risk Assessment (EWRA)',
    journeyLabel: 'Risk Assessment',
    icon: Search,
    whatItInvolves: 'Assess your money laundering and terrorism financing risk across every customer type, service, delivery channel, and jurisdiction you deal with — not just your highest-risk service line.',
    whyItMatters: 'Your entire AML/CTF Program should be risk-based and built on this assessment — skipping or under-scoping it undermines everything that follows.',
    ifMissed: 'A Program that isn\'t grounded in a real risk assessment is one of the first things an independent reviewer or AUSTRAC will flag as inadequate.',
  },
  {
    id: 'program',
    title: 'Draft your AML/CTF Program (Part A & B)',
    journeyLabel: 'Program',
    icon: FileText,
    whatItInvolves: 'Part A covers governance and your risk-based framework; Part B covers your customer identification (KYC/CDD) procedures, including when Enhanced Due Diligence applies.',
    whyItMatters: 'This is the document AUSTRAC and any independent reviewer will actually examine — it needs to reflect how your firm really operates, not a generic template.',
    ifMissed: 'Operating without an approved Program is a core contravention of the AML/CTF Act, with penalties calculated per contravention.',
  },
  {
    id: 'cdd',
    title: 'Implement Customer Identification (CDD/EDD)',
    journeyLabel: 'CDD / EDD',
    icon: UserCheck,
    whatItInvolves: 'Put your Part B procedures into practice — verify identity, understand beneficial ownership, and apply proportionate scrutiny, looking through nominee structures to real owners.',
    whyItMatters: 'This is where most real-world AML failures happen — not in the paperwork, but in day-to-day onboarding decisions.',
    ifMissed: 'Weak CDD is the most common root cause behind the AUSTRAC enforcement cases already on the public record — including cases with penalties in the hundreds of millions.',
  },
  {
    id: 'monitoring',
    title: 'Ongoing Monitoring & SMR Reporting',
    journeyLabel: 'Monitoring',
    icon: Send,
    whatItInvolves: 'Monitor transactions or matters on an ongoing basis for red flags, and know how to file a Suspicious Matter Report (SMR) with AUSTRAC when required.',
    whyItMatters: 'The SMR threshold is "reasonable grounds to suspect" — a materially lower bar than proof — and the obligation is ongoing, not one-off.',
    ifMissed: 'Failing to report a suspicious matter within the statutory timeframe is itself a reportable contravention, independent of the underlying activity.',
  },
  {
    id: 'training',
    title: 'Train your staff',
    journeyLabel: 'Training',
    icon: GraduationCap,
    whatItInvolves: 'Ensure everyone involved in delivering designated services has role-appropriate AML/CTF training, from the point your business becomes a reporting entity — not phased in gradually.',
    whyItMatters: 'An untrained team is the most common source of missed red flags in practice.',
    ifMissed: 'AUSTRAC expects evidence of training as part of your Program — its absence undermines your ability to demonstrate the Program is actually operating.',
  },
  {
    id: 'review',
    title: 'Independent Review & Annual Obligations',
    journeyLabel: 'Review',
    icon: CalendarCheck,
    whatItInvolves: 'Schedule an independent review of your Program at least every 3 years (sooner for a newly implemented program), and keep records for 7 years.',
    whyItMatters: 'A Program that\'s never independently checked tends to drift from how the business actually operates.',
    ifMissed: 'An overdue or absent independent review is a standard gap identified in AUSTRAC compliance assessments, and poor record-keeping can independently breach the Act.',
  },
]

const SECTOR_CARDS = [
  { id: 'accountant', label: 'Accountants', desc: 'Which services are covered, and CDD for accounting clients.', icon: Calculator },
  { id: 'lawyer', label: 'Legal & Conveyancing', desc: 'Trust accounts and company/trust formation obligations.', icon: Scale },
  { id: 'realestate', label: 'Real Estate Agents', desc: 'Property sale obligations and buyer/seller identification.', icon: Home },
  { id: 'tcsp', label: 'Conveyancers & TCSPs', desc: 'Company formation, nominee arrangements, and red flags.', icon: Building },
  { id: 'bullion', label: 'Jewellers & Dealers', desc: 'Cash thresholds and red flags for precious metals dealers.', icon: Gem },
]

const CONSULTANT_LOW = 1500
const CONSULTANT_HIGH = 4000
const PREMIUM_MONTHLY = 49.99

export default function SetupGuide({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenEligibility, onOpenProgramBuilder, onOpenSectorGuide, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans scroll-smooth">
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
        onOpenReportableTransactionCheck={onOpenReportableTransactionCheck}
        onOpenComplianceDashboard={onOpenComplianceDashboard}
        onOpenSmrDraft={onOpenSmrDraft}
        onOpenSanctionsScreening={onOpenSanctionsScreening}
      />

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-12">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              AML/CTF Compliance Guide
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AML/CTF compliance guide for Australian businesses</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-6">
              If you provide a designated service under the AML/CTF Act 2006 — managing client funds, buying or selling real estate, forming companies and trusts, and more — you're likely a reporting entity captured by the Tranche 2 reforms, in force since 1 July 2026. Not sure that's you?{' '}
              <button onClick={onOpenEligibility} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Take the free 30-second eligibility check →
              </button>
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 6 min read</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Updated July 2026</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Based on AUSTRAC guidance</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <p className="font-semibold text-sm mb-4">The compliance journey</p>
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <a key={step.id} href={`#${step.id}`} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{i + 1}. {step.journeyLabel}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline + sidebar */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Every obligation, step by step</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">What each obligation involves, why it matters, and what happens if you miss it.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_260px] gap-10 items-start">
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.id} id={step.id} className={`relative px-6 py-6 scroll-mt-24 ${i !== STEPS.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <span className="w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
                      <h3 className="font-bold text-base">{step.title}</h3>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-5 sm:pl-12">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">What it involves</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.whatItInvolves}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Why it matters</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.whyItMatters}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">If missed</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.ifMissed}</p>
                    </div>
                  </div>
                  {step.id === 'enrol' && (
                    <button
                      onClick={onOpenAustracEnrolment}
                      className="mt-4 sm:ml-12 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors"
                    >
                      See the full step-by-step walkthrough →
                    </button>
                  )}
                  {step.id === 'monitoring' && (
                    <button
                      onClick={onOpenSmrGuide}
                      className="mt-4 sm:ml-12 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors"
                    >
                      See the full SMR filing walkthrough →
                    </button>
                  )}
                  {step.id === 'officer' && (
                    <button
                      onClick={onOpenComplianceOfficer}
                      className="mt-4 sm:ml-12 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors"
                    >
                      See the full appointment guide →
                    </button>
                  )}
                  {step.id === 'risk-assessment' && (
                    <button
                      onClick={onOpenRiskAssessment}
                      className="mt-4 sm:ml-12 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors"
                    >
                      Assess your risk →
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="hidden lg:block sticky top-24">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <p className="font-semibold text-sm mb-1">On this guide</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3 mt-4">Overview</p>
              <div className="space-y-2.5">
                {STEPS.map((step, i) => (
                  <a key={step.id} href={`#${step.id}`} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <span className="w-5 h-5 rounded-full border border-orange-300 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {step.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sector guides */}
      <div className="bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Guides for your sector</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Designated services, CDD guidance, and red flags specific to your industry.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SECTOR_CARDS.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => onOpenSectorGuide?.(s.id)}
                  className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-sm mb-1.5">{s.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{s.desc}</p>
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">Read guide →</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats + CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6 mb-6 grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">$36.4M</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">per contravention for a body corporate (100,000 penalty units)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">$7.28M</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">per contravention for an individual (20,000 penalty units)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">$364</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">per penalty unit, effective 1 July 2026</p>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-white mb-2">You've seen the obligations. Now simplify the work.</p>
            <p className="text-slate-400 text-sm">
              Generate a tailored AML/CTF Program draft with AmlIntel Premium — ${PREMIUM_MONTHLY}/mo, versus the ${CONSULTANT_LOW.toLocaleString()}–${CONSULTANT_HIGH.toLocaleString()}/year a compliance consultant typically costs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button onClick={user ? onOpenProgramBuilder : onSignUp} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
              Draft your AML/CTF Program →
            </button>
            <button onClick={onOpenEligibility} className="px-6 py-3 border border-slate-600 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
              Free eligibility check
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-8">
          Educational guidance only — not legal advice. Consult a qualified AML/CTF professional for advice specific to your firm.
        </p>
      </div>
    </div>
  )
}
