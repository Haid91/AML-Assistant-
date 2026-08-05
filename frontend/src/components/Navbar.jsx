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

export default function Navbar({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck }) {
  const [topicsOpen, setTopicsOpen] = useState(false)
  const [moreInfoOpen, setMoreInfoOpen] = useState(false)
  const [tranche2Open, setTranche2Open] = useState(false)
  const dropdownRef = useRef(null)
  const moreInfoRef = useRef(null)
  const tranche2Ref = useRef(null)

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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">

        {/* Logo */}
        <button onClick={onGoHome} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold tracking-tight text-white">AML</div>
          <span className="font-semibold text-sm text-white">Intel</span>
        </button>

        {/* Center nav cluster */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => onNavigateSection?.('features')} className="text-[13px] text-slate-300 hover:text-white transition-colors whitespace-nowrap">What you get</button>
          <button onClick={() => onNavigateSection?.('pricing')} className="text-[13px] text-slate-300 hover:text-white transition-colors whitespace-nowrap">Pricing</button>
          <button onClick={onOpenAbout} className="text-[13px] text-slate-300 hover:text-white transition-colors whitespace-nowrap">Real-world experience</button>

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
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2" style={{ zIndex: 9999 }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45" />

                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenEligibility?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Eligibility Check
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenReportableTransactionCheck?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Reportable Transaction Check
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenPrivacyCheck?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Privacy Act Check
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenAustracEnrolment?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  AUSTRAC Enrolment
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenSmrGuide?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  File an SMR
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenSuspiciousIndicators?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Suspicious Activity Indicators
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenComplianceOfficer?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Compliance Officer
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenRiskAssessment?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Risk Assessment
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenSetupGuide?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Setup Guide
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenProgramBuilder?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  AML Program Draft
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenComplianceCalendar?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Compliance Calendar
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenClientRiskRegister?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Client Risk Register
                </button>
                <button
                  onClick={() => {
                    setTranche2Open(false)
                    onOpenCost?.()
                  }}
                  className="w-full text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                >
                  Cost
                </button>
              </div>
            )}
          </div>

          <button onClick={onOpenTraining} className="text-[13px] text-slate-300 hover:text-white transition-colors whitespace-nowrap">Go to Training</button>

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

        {/* Theme toggle + Auth buttons */}
        <div className="flex items-center gap-3 justify-self-end">
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
      </div>
    </nav>
  )
}
