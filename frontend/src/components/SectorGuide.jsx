import { Calculator, Scale, Home, Building, Gem } from 'lucide-react'
import Navbar from './Navbar'

const SECTORS = {
  accountant: {
    label: 'Accountants & Bookkeepers',
    tagline: 'Which services are covered, and CDD for accounting clients',
    icon: Calculator,
    overview: "Accountants, tax agents, BAS agents, and bookkeepers are captured by Tranche 2 when they provide designated services — most commonly managing client funds, forming companies and trusts, or arranging financial transactions on a client's behalf. Standard compliance and tax work alone doesn't trigger obligations; it's the designated services layered on top that do.",
    services: [
      "Managing a client's funds, accounts, or other financial assets",
      'Forming, operating, or managing a company or trust for a client',
      'Acting as a formation agent, or providing registered office/nominee director services',
      'Arranging for another person to carry out a designated service',
      'Managing client money in a trust or controlled account',
    ],
    cdd: [
      'Verify the identity of the client and, for entities, the natural persons who beneficially own or control it',
      'Escalate to EDD where a company/trust formation involves nominee directors or unclear ultimate ownership',
      "Reassess risk when a longstanding client's activity changes materially from their known profile",
      'Keep CDD current — this is an ongoing obligation, not a one-time onboarding check',
      "Don't treat an existing professional relationship as a substitute for documented CDD",
    ],
    redFlags: [
      'Client requests company formation with a nominee director and no clear reason for the arrangement',
      "Instructions to move funds through the practice's trust account with no underlying commercial rationale",
      "Client's declared income or business activity doesn't match the volume of funds passing through their accounts",
      'Reluctance to provide documentation on the source of capital injected into a new entity',
      'Requests to backdate documents or restructure ownership shortly before a reporting obligation would apply',
      'Client operates a cash-intensive business with turnover inconsistent with lodged returns',
    ],
  },
  lawyer: {
    label: 'Legal & Conveyancing',
    tagline: 'Conveyancing, trust accounts, and company/trust formation obligations',
    icon: Scale,
    overview: 'Lawyers, solicitors, and licensed conveyancers are captured by Tranche 2 when they provide designated services — most commonly property settlements, trust account management, and forming or managing companies and trusts on a client\'s behalf. Legal professional privilege does not exempt these obligations.',
    services: [
      "Managing client funds or trust accounts on a client's behalf",
      'Buying or selling real property for a client (conveyancing/settlement)',
      'Forming, operating, or managing a company or trust',
      'Acting as a formation agent or providing a registered office/nominee service',
      'Arranging or managing finance for property or business transactions',
    ],
    cdd: [
      'Verify identity and source of funds before or during the retainer — not after settlement',
      'Apply Enhanced Due Diligence for cash-funded property matters, overseas clients, or PEPs',
      'Look through any company or trust structure to the natural persons who ultimately own or control it',
      'Don\'t accept "business income" or an unnamed "beneficiary class" as a complete source-of-funds explanation',
      'Document your CDD decisions in the file, not just the identity documents collected',
    ],
    redFlags: [
      'Client is reluctant to explain the source of settlement funds or provides vague, unverifiable answers',
      'Cash-funded property purchase with no mortgage, particularly at an unusual price relative to market value',
      'Client requests urgency or secrecy around a company/trust formation with no clear commercial reason',
      "Instructions come from a third party who isn't a party to the matter, with no clear authority",
      'Repeated small transactions structured to sit just under reporting or scrutiny thresholds',
      'Beneficial ownership structure is unusually layered or routes through multiple offshore jurisdictions',
    ],
  },
  realestate: {
    label: 'Real Estate Agents',
    tagline: 'Property sale obligations and buyer/seller identification',
    icon: Home,
    overview: 'Real estate agents, property managers, and auctioneers are captured by Tranche 2 when they facilitate the buying or selling of real property. High-value, cash-heavy, or overseas-buyer transactions carry particular ML/TF risk in this sector.',
    services: [
      'Acting for a buyer or seller in the sale of real property',
      'Facilitating a real property transaction as an auctioneer',
      'Arranging finance or acting as an intermediary in a property transaction',
      'Managing rental trust accounts (where this extends into designated-service territory)',
    ],
    cdd: [
      "Verify the identity of both the buyer and seller you're acting for, not just your direct client",
      'Ask about source of funds for the purchase — particularly for cash or rapid all-cash settlements',
      'Apply Enhanced Due Diligence for overseas buyers, PEPs, or purchases through a company/trust structure',
      "Check whether the purchasing entity's beneficial owners have been identified, not just the entity's name",
      "Flag and query third-party deposit or settlement payments that don't match the named purchaser",
    ],
    redFlags: [
      'Buyer pays a significant deposit or full purchase price in cash with no financing',
      'Rapid on-sale of a property shortly after purchase, at a price inconsistent with market movement',
      'Purchase price is notably above or below market value with no clear explanation',
      'Settlement funds arrive from a third party or an entity unrelated to the named purchaser',
      'Buyer is reluctant to provide standard identification or source-of-funds documentation',
      'Property purchased through a newly formed company or trust with opaque ownership',
    ],
  },
  tcsp: {
    label: 'Conveyancers & TCSPs',
    tagline: 'Company formation, nominee arrangements, and registered office services',
    icon: Building,
    overview: 'Trust and company service providers are captured by Tranche 2 when they form, operate, or manage companies and trusts, or provide registered office, nominee director, or nominee shareholder services. This sector carries elevated ML/TF risk because it\'s a common vehicle for obscuring beneficial ownership.',
    services: [
      'Forming a company or trust on behalf of a client',
      'Acting as, or arranging for another person to act as, a nominee director or shareholder',
      'Providing a registered office or business address for a company',
      'Providing company secretarial or trustee services',
      'Managing client funds in the course of company or trust administration',
    ],
    cdd: [
      'Always identify the natural persons behind a structure — never accept a nominee arrangement as the end of the inquiry',
      'Apply Enhanced Due Diligence to any structure involving multiple layers, offshore jurisdictions, or bearer-style arrangements',
      'Understand and document the actual purpose of the structure, not just its legal form',
      'Reassess beneficial ownership whenever directors, shareholders, or trustees change',
      "Decline or exit arrangements where beneficial ownership can't reasonably be established",
    ],
    redFlags: [
      'Client requests a nominee director or shareholder with no credible commercial reason',
      'Ownership structure is unusually layered across multiple jurisdictions with no clear business purpose',
      'Client is unwilling or unable to identify the ultimate beneficial owner',
      'Rapid changes to directors, shareholders, or registered office shortly after formation',
      'Structure is used to receive funds from, or send funds to, high-risk or unrelated jurisdictions',
      'Client requests services be conducted with unusual secrecy or urgency',
    ],
  },
  bullion: {
    label: 'Jewellers & Bullion Dealers',
    tagline: 'Cash thresholds and red flags for precious metals dealers',
    icon: Gem,
    overview: 'Dealers in precious metals, precious stones, and high-value jewellery are captured by Tranche 2 for qualifying cash transactions. This sector is a well-established money-laundering typology target because high-value, portable goods can convert cash into an easily transportable store of value.',
    services: [
      'Selling precious metals, precious stones, or high-value jewellery where a cash threshold applies',
      'Buying back precious metals or stones from customers for cash',
      'Accepting large cash payments (or a series of related payments) for qualifying goods',
    ],
    cdd: [
      'Verify customer identity for any transaction that meets or approaches the reporting threshold',
      'Watch for transactions deliberately structured to sit just under the threshold',
      'Ask about source of funds for large or unusual cash purchases',
      'File a Threshold Transaction Report (TTR) for qualifying cash transactions of AUD $10,000 or more',
      'Keep records of identity verification and transaction details for the full retention period',
    ],
    redFlags: [
      'Customer makes several purchases just under the reporting threshold in a short period (structuring)',
      'Customer is indifferent to price, quality, or resale value — inconsistent with a genuine purchase',
      "Payment offered in cash when the customer's apparent means don't support it",
      'Customer requests the transaction be split across multiple invoices or receipts',
      'Unusual requests for anonymity or reluctance to provide identification',
      'Repeat buy-back transactions with no clear personal use or investment rationale',
    ],
  },
}

function Section({ title, items }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function SectorGuide({ sector, user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment }) {
  const data = SECTORS[sector] || SECTORS.accountant
  const Icon = data.icon

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
      />
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-2.5">
        <button onClick={onOpenSetupGuide} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          ← Back to setup guide
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Icon className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-full uppercase tracking-wide">
            Sector Guide
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{data.label}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base mb-2">{data.tagline}</p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">{data.overview}</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <Section title="Which designated services bring you into scope" items={data.services} />
        <Section title="CDD & EDD guidance" items={data.cdd} />
        <Section title="Common red flags" items={data.redFlags} />

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
          Educational guidance only — not legal advice. Consult a qualified AML/CTF professional for advice specific to your firm.
        </p>
      </div>
    </div>
  )
}
