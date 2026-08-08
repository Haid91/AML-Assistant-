import { useState, useRef, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import ProfileMenu from './ProfileMenu'
import Logo from './Logo'

const GLOBAL_TOPICS = [
  'KYC / CDD / EDD',
  'Suspicious Activity Reports',
  'Currency Transaction Reports',
  'FATF Recommendations',
  'Bank Secrecy Act (BSA)',
  'Beneficial Ownership',
  'OFAC Sanctions Screening',
  'Politically Exposed Persons',
  'Structuring & Smurfing',
  'Transaction Monitoring',
  'Trade-Based ML (TBML)',
  'Correspondent Banking',
  'Shell Companies',
  'Three Stages of Money Laundering',
]

const AUSTRAC_TOPICS = [
  'What is AUSTRAC',
  'AML/CTF Act 2006',
  'AML/CTF Program (Part A & B)',
  'Suspicious Matter Reports (SMRs)',
  'Threshold Transaction Reports (TTRs)',
  'International Funds Transfer Instructions (IFTIs)',
  'Reporting Entities & Designated Services',
  'Enterprise-Wide Risk Assessment (EWRA)',
  'Ongoing Customer Due Diligence (OCDD)',
  'Digital Currency Exchange (DCE)',
  'Remittance Sector Obligations',
  'Fintel Alliance',
  'Tipping Off Prohibition',
  'AUSTRAC E-Learning Modules',
  'AUSTRAC Enforcement Actions',
]

// The natural order a Tranche 2 business actually moves through — grouped
// and numbered rather than one flat list, so the dropdown reads as a
// sequence of phases instead of an undifferentiated menu.
const TRANCHE2_GROUPS = [
  {
    step: 1,
    title: 'Get started',
    items: [
      ['Eligibility Check', 'onOpenEligibility'],
      ['Setup Guide', 'onOpenSetupGuide'],
      ['Cost', 'onOpenCost'],
      ['AUSTRAC Enrolment', 'onOpenAustracEnrolment'],
    ],
  },
  {
    step: 2,
    title: 'Build your program',
    items: [
      ['Compliance Officer', 'onOpenComplianceOfficer'],
      ['Risk Assessment', 'onOpenRiskAssessment'],
      ['AML Program Draft', 'onOpenProgramBuilder'],
      ['Privacy Act Check', 'onOpenPrivacyCheck'],
    ],
  },
  {
    step: 3,
    title: 'Ongoing compliance',
    items: [
      ['Client Risk Register', 'onOpenClientRiskRegister'],
      ['Compliance Calendar', 'onOpenComplianceCalendar'],
      ['Suspicious Activity Indicators', 'onOpenSuspiciousIndicators'],
      ['Reportable Transaction Check', 'onOpenReportableTransactionCheck'],
      ['Sanctions Screening', 'onOpenSanctionsScreening'],
      ['Ownership Calculator', 'onOpenOwnershipCalculator'],
    ],
  },
  {
    step: 4,
    title: 'Reporting',
    items: [
      ['File an SMR', 'onOpenSmrGuide'],
      ['Draft an SMR', 'onOpenSmrDraft'],
    ],
  },
]

function Tranche2Menu({ handlers, onSelect, dense, columns }) {
  if (columns) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {TRANCHE2_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-1.5 px-2 pb-2 mb-1 border-b border-slate-800">
              <span className="w-4 h-4 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                {group.step}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{group.title}</span>
            </div>
            {group.items.map(([label, key]) => (
              <button
                key={label}
                onClick={() => { onSelect(); handlers[key]?.() }}
                className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-1.5 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {TRANCHE2_GROUPS.map((group, gi) => (
        <div key={group.title} className={gi > 0 ? 'mt-1 pt-1.5 border-t border-slate-800' : ''}>
          <div className="flex items-center gap-1.5 px-3 pt-1 pb-1">
            <span className="w-4 h-4 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
              {group.step}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{group.title}</span>
          </div>
          {group.items.map(([label, key]) => (
            <button
              key={label}
              onClick={() => { onSelect(); handlers[key]?.() }}
              className={`w-full text-left hover:text-white hover:bg-slate-800 rounded-lg transition-colors ${
                dense ? 'text-sm text-slate-400 px-3 py-1.5' : 'text-sm text-slate-300 px-3 py-1.5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ))}
    </>
  )
}

export default function Navbar({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator }) {
  const tranche2Handlers = { onOpenEligibility, onOpenSetupGuide, onOpenCost, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenProgramBuilder, onOpenPrivacyCheck, onOpenClientRiskRegister, onOpenComplianceCalendar, onOpenSuspiciousIndicators, onOpenReportableTransactionCheck, onOpenSanctionsScreening, onOpenOwnershipCalculator, onOpenSmrGuide, onOpenSmrDraft }

  const [topicsOpen, setTopicsOpen] = useState(false)
  const [moreInfoOpen, setMoreInfoOpen] = useState(false)
  const [tranche2Open, setTranche2Open] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileTopicsOpen, setMobileTopicsOpen] = useState(false)
  const [mobileTranche2Open, setMobileTranche2Open] = useState(false)
  const [mobileQuickTranche2Open, setMobileQuickTranche2Open] = useState(false)
  const dropdownRef = useRef(null)
  const moreInfoRef = useRef(null)
  const tranche2Ref = useRef(null)
  const mobileQuickTranche2Ref = useRef(null)

  // Below `lg`, the center link cluster doesn't fit and there's no wrap
  // behavior, so it silently overflows the viewport instead of collapsing —
  // closing the mobile menu on that breakpoint change keeps it from being
  // stuck open behind a now-visible desktop nav if the window gets resized.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = () => setMobileOpen(false)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicsOpen(false)
      }
      if (moreInfoRef.current && !moreInfoRef.current.contains(e.target)) {
        setMoreInfoOpen(false)
      }
      if (tranche2Ref.current && !tranche2Ref.current.contains(e.target)) {
        setTranche2Open(false)
      }
      if (mobileQuickTranche2Ref.current && !mobileQuickTranche2Ref.current.contains(e.target)) {
        setMobileQuickTranche2Open(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex lg:grid lg:grid-cols-[auto_1fr_auto] items-center gap-4">

        {/* Logo */}
        <button onClick={onGoHome} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold tracking-tight text-white">AML</div>
          <span className="font-semibold text-sm text-white">Intel</span>
        </button>

        {/* Center nav cluster — desktop only; below `lg` this doesn't fit
            and there's no wrap behavior, so it silently overflows the
            viewport instead of collapsing (the bug this mobile menu fixes) */}
        <div className="hidden lg:flex items-center justify-center gap-4">
          <button onClick={() => onNavigateSection?.('features')} className="text-[13px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap">What you get</button>
          <button onClick={() => onNavigateSection?.('pricing')} className="text-[13px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap">Pricing</button>

          {/* Topics dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setTopicsOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                topicsOpen
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Topics
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${topicsOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {topicsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[580px] max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6" style={{ zIndex: 9999 }}>
                {/* Arrow tip */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45" />

                <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
                  {/* Global AML */}
                  <div>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-3">Global AML</p>
                    {GLOBAL_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => { setTopicsOpen(false); onStart() }}
                        className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>

                  {/* AUSTRAC */}
                  <div>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-3">AUSTRAC Guidance</p>
                    {AUSTRAC_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => { setTopicsOpen(false); onStart() }}
                        className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <p className="text-xs text-slate-500">29 topics · FATF-aligned · AUSTRAC guidance</p>
                  <button
                    onClick={() => { setTopicsOpen(false); onStart() }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Open assistant →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tranche 2 Setup dropdown */}
          <div className="relative" ref={tranche2Ref}>
            <button
              onClick={() => setTranche2Open((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                tranche2Open
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tranche 2 Setup
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${tranche2Open ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {tranche2Open && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4" style={{ zIndex: 9999 }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45" />
                <Tranche2Menu handlers={tranche2Handlers} onSelect={() => setTranche2Open(false)} columns />
              </div>
            )}
          </div>

          {user?.premium && (
            <button onClick={onOpenComplianceDashboard} className="text-[13px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap">Dashboard</button>
          )}

          <button onClick={onOpenTraining} className="text-[13px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap">Go to Training</button>

          {/* More info dropdown */}
          <div className="relative" ref={moreInfoRef}>
            <button
              onClick={() => setMoreInfoOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                moreInfoOpen
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              More info
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${moreInfoOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreInfoOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2" style={{ zIndex: 9999 }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45" />

                <button
                  onClick={() => {
                    setMoreInfoOpen(false)
                    onOpenAbout?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    setMoreInfoOpen(false)
                    onOpenContact?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Contact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Theme toggle + Auth buttons — desktop only, mirrored inside the
            mobile menu panel below */}
        <div className="hidden lg:flex items-center gap-3 justify-self-end">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={onOpenChat} title="Open AI Assistant" className="rounded-xl overflow-hidden hover:opacity-80 transition-opacity">
                <Logo size={36} />
              </button>
              <ProfileMenu
                user={user}
                variant="dark"
                onGoToTraining={onOpenTraining}
                onOpenSettings={() => onOpenSettings('profile')}
                onSignOut={onSignOut}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSignIn}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={onSignUp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
              >
                Sign up free →
              </button>
            </div>
          )}
        </div>

        {/* Quick-access group — mobile only. Everything else lives in the
            hamburger menu, but these stay directly reachable since they're
            the two most-used links plus the theme toggle. */}
        <div className="lg:hidden ml-auto flex items-center gap-0.5">
          <button
            onClick={onOpenTraining}
            className="text-[11px] font-medium text-slate-300 hover:text-white px-1.5 py-1 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Training
          </button>

          <div className="relative" ref={mobileQuickTranche2Ref}>
            <button
              onClick={() => setMobileQuickTranche2Open((v) => !v)}
              className={`flex items-center gap-0.5 px-1.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
                mobileQuickTranche2Open ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tranche 2
              <svg className={`w-3 h-3 shrink-0 transition-transform duration-200 ${mobileQuickTranche2Open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileQuickTranche2Open && (
              <div className="absolute top-full right-0 mt-3 w-64 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 max-h-[80vh] overflow-y-auto" style={{ zIndex: 9999 }}>
                <Tranche2Menu handlers={tranche2Handlers} onSelect={() => setMobileQuickTranche2Open(false)} />
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-6 py-4 flex flex-col gap-1">
            <button
              onClick={() => { setMobileOpen(false); onNavigateSection?.('features') }}
              className="text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              What you get
            </button>
            <button
              onClick={() => { setMobileOpen(false); onNavigateSection?.('pricing') }}
              className="text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Pricing
            </button>
            {/* Topics accordion */}
            <button
              onClick={() => setMobileTopicsOpen((v) => !v)}
              className="flex items-center justify-between text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Topics
              <svg className={`w-4 h-4 transition-transform duration-200 ${mobileTopicsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileTopicsOpen && (
              <div className="pl-3 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <div>
                  <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold mt-2 mb-1 px-3">Global AML</p>
                  {GLOBAL_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => { setMobileOpen(false); onStart() }}
                      className="w-full text-left text-sm text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] text-blue-400 uppercase tracking-widest font-semibold mt-2 mb-1 px-3">AUSTRAC Guidance</p>
                  {AUSTRAC_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => { setMobileOpen(false); onStart() }}
                      className="w-full text-left text-sm text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tranche 2 Setup accordion */}
            <button
              onClick={() => setMobileTranche2Open((v) => !v)}
              className="flex items-center justify-between text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Tranche 2 Setup
              <svg className={`w-4 h-4 transition-transform duration-200 ${mobileTranche2Open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileTranche2Open && (
              <div className="pl-3 pb-2 flex flex-col">
                <Tranche2Menu handlers={tranche2Handlers} onSelect={() => setMobileOpen(false)} dense />
              </div>
            )}

            {user?.premium && (
              <button
                onClick={() => { setMobileOpen(false); onOpenComplianceDashboard?.() }}
                className="text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => { setMobileOpen(false); onOpenTraining?.() }}
              className="text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Go to Training
            </button>
            <button
              onClick={() => { setMobileOpen(false); onOpenAbout?.() }}
              className="text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => { setMobileOpen(false); onOpenContact?.() }}
              className="text-left text-sm text-slate-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Contact
            </button>

            <div className="border-t border-slate-800 mt-3 pt-4 flex items-center justify-end">
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setMobileOpen(false); onOpenChat?.() }}
                    title="Open AI Assistant"
                    className="rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <Logo size={36} />
                  </button>
                  <ProfileMenu
                    user={user}
                    variant="dark"
                    onGoToTraining={onOpenTraining}
                    onOpenSettings={() => { setMobileOpen(false); onOpenSettings('profile') }}
                    onSignOut={() => { setMobileOpen(false); onSignOut?.() }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setMobileOpen(false); onSignIn?.() }}
                    className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onSignUp?.() }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign up free →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
