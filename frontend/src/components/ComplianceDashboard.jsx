import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Navbar from './Navbar'

// `new Date('YYYY-MM-DD')` parses the string as UTC midnight, then every
// getter/setter below reads/writes it in local time — off by a day for any
// user west of UTC. Parsing the components directly builds a local-midnight
// Date instead, matching what the date input actually shows.
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addYears(dateStr, years) {
  const d = parseLocalDate(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return d
}

function addMonths(dateStr, months) {
  const d = parseLocalDate(dateStr)
  d.setMonth(d.getMonth() + months)
  return d
}

function daysUntil(date) {
  const now = new Date()
  return Math.floor((date - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)
}

function formatDate(date) {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Mirrors ComplianceCalendar.jsx's ACR due-date logic — Tranche 2 entities'
// first reporting period is 1 Jul 2026 - 30 Jun 2027, so the first Annual
// Compliance Report is never due before 30 September 2027.
function currentAcrDueInfo() {
  const today = new Date()
  let fyEndYear = 2027
  let due = new Date(fyEndYear, 8, 30)
  while (today > due) {
    fyEndYear += 1
    due = new Date(fyEndYear, 8, 30)
  }
  return { dueDate: due, fyEndYear }
}

// Same four recurring obligations tracked on the Compliance Calendar page —
// kept in sync with ComplianceCalendar.jsx's ITEMS array.
const CHECKLIST_ITEMS = [
  { key: 'programReviewDate', title: 'AML/CTF Program & Risk Assessment Review', cycleFn: (d) => addYears(d, 3), dueSoonDays: 90 },
  { key: 'independentEvalDate', title: 'Independent Evaluation of Your Program', cycleFn: (d) => addYears(d, 3), dueSoonDays: 90 },
  { key: 'staffTrainingDate', title: 'Staff AML/CTF Training Refresher', cycleFn: (d) => addMonths(d, 12), dueSoonDays: 30 },
  { key: 'privacyReviewDate', title: 'Privacy Policy Review', cycleFn: (d) => addMonths(d, 12), dueSoonDays: 30 },
]

const ICONS = {
  program: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  privacy: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  induction: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11 8v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
  register: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  cams: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
}

function StatusCard({ icon, pill, title, meta, barPct, linkLabel, onClick }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor">{icon}</svg>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${pill.cls}`}>{pill.label}</span>
      </div>
      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{meta}</p>
      {barPct != null && (
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mt-0.5">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${barPct}%` }} />
        </div>
      )}
      <button onClick={onClick} className="mt-auto pt-1 text-left text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
        {linkLabel} →
      </button>
    </div>
  )
}

export default function ComplianceDashboard({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenPrivacyPack, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenSmrDraft, onOpenSanctionsScreening, onUpgrade }) {
  const [phase, setPhase] = useState('checking') // checking | dashboard
  const [programDraft, setProgramDraft] = useState(null)
  const [privacyDraft, setPrivacyDraft] = useState(null)
  const [clientEntries, setClientEntries] = useState([])
  const [checklist, setChecklist] = useState({})
  const [examAttempts, setExamAttempts] = useState([])
  const [inductionDone, setInductionDone] = useState(false)

  const navProps = { user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenSmrDraft, onOpenSanctionsScreening }

  useEffect(() => {
    if (!user?.premium) { setPhase('dashboard'); return }
    const token = localStorage.getItem('aml_token')
    const headers = { Authorization: `Bearer ${token}` }

    const prog = localStorage.getItem(`aml_prog_${user?.id || 'guest'}`)
    if (prog) {
      try {
        const parsed = JSON.parse(prog)
        setInductionDone(!!parsed?.induction1?.completed)
      } catch { /* ignore */ }
    }

    Promise.all([
      fetch(`${API_URL}/program-draft`, { headers }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/privacy-draft`, { headers }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/client-risk-entries`, { headers }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/compliance-checklist`, { headers }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_URL}/mock-exam-attempts`, { headers }).then((r) => r.json()).catch(() => ({})),
    ]).then(([p, pv, cr, cc, ea]) => {
      setProgramDraft(p.draft || null)
      setPrivacyDraft(pv.draft || null)
      setClientEntries(cr.entries || [])
      setChecklist(cc.checklist || {})
      setExamAttempts(ea.attempts || [])
    }).finally(() => setPhase('dashboard'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.premium])

  if (phase === 'checking') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user?.premium) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar {...navProps} />
        <div className="max-w-md mx-auto px-8 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Compliance Dashboard is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            One screen that rolls up your AML/CTF Program, Privacy Pack, Staff Induction, Client Risk Register, Compliance Calendar and CAMS prep — so you can see what's done and what still needs attention.
          </p>
          <button onClick={onUpgrade} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors mb-6">
            Upgrade to Premium — $49.99/mo
          </button>
        </div>
      </div>
    )
  }

  const acr = currentAcrDueInfo()
  const acrLodged = checklist.acrLodgedYear === acr.fyEndYear
  const acrDays = acrLodged ? null : daysUntil(acr.dueDate)

  const checklistDeadlines = CHECKLIST_ITEMS.map((item) => {
    const value = checklist[item.key]
    const dueDate = value ? item.cycleFn(value) : null
    const days = dueDate ? daysUntil(dueDate) : null
    return { title: item.title, dueDate, days, dueSoonDays: item.dueSoonDays, started: !!value }
  })

  const overdueClients = clientEntries.filter((e) => e.status !== 'offboarded' && e.nextReviewDate && daysUntil(parseLocalDate(e.nextReviewDate)) < 0)
  const activeClients = clientEntries.filter((e) => e.status !== 'offboarded')

  const latestExam = examAttempts[0] || null
  const examPct = latestExam ? Math.round((latestExam.score / latestExam.total) * 100) : null

  // Calendar-sourced deadlines (ACR + any checklist item started at least
  // once) kept separate from client-review deadlines so each status card
  // only reflects its own tool — the combined list below is only for the
  // page-wide "Upcoming deadlines" panel and overview stats.
  const calendarRows = []
  if (!acrLodged) {
    calendarRows.push({ name: 'Annual Compliance Report', sub: 'AUSTRAC — fixed annual deadline', days: acrDays })
  }
  checklistDeadlines.forEach((d) => {
    if (d.started) calendarRows.push({ name: d.title, sub: 'Compliance Calendar', days: d.days })
  })
  calendarRows.sort((a, b) => a.days - b.days)

  const clientRows = overdueClients
    .map((c) => ({ name: `CDD review — ${c.referenceLabel}`, sub: 'Client Risk Register', days: daysUntil(parseLocalDate(c.nextReviewDate)) }))
    .sort((a, b) => a.days - b.days)

  const deadlineRows = [...calendarRows, ...clientRows].sort((a, b) => a.days - b.days)

  // Overall readiness: how many of the 6 tracked areas are in a "green" state.
  const scores = [
    !!programDraft,
    !!privacyDraft,
    inductionDone,
    activeClients.length > 0 && overdueClients.length === 0,
    acrLodged && checklistDeadlines.every((d) => d.days == null || d.days > d.dueSoonDays),
    !!latestExam && latestExam.passed,
  ]
  const readinessPct = Math.round((scores.filter(Boolean).length / scores.length) * 100)
  const ringDeg = Math.round((readinessPct / 100) * 360)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Navbar {...navProps} />

      <div className="max-w-5xl mx-auto px-6 pt-14 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Compliance Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
            Everything you've set up so far, and what still needs attention.
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex sm:flex-col items-center justify-center gap-3 sm:border-r sm:border-slate-200 sm:dark:border-slate-700 sm:pr-6">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center relative shrink-0"
              style={{ background: `conic-gradient(#2563eb ${ringDeg}deg, rgb(226 232 240) ${ringDeg}deg 360deg)` }}
            >
              <div className="absolute inset-[10px] rounded-full bg-slate-50 dark:bg-slate-800" />
              <span className="relative text-2xl font-extrabold">{readinessPct}%</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">Overall readiness</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 content-center">
            <div>
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1.5">Documents drafted</dt>
              <dd className="text-lg font-bold tabular-nums">{(programDraft ? 1 : 0) + (privacyDraft ? 1 : 0)} <span className="text-xs font-medium text-slate-400">/ 2</span></dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1.5">Needs attention</dt>
              <dd className={`text-lg font-bold tabular-nums ${deadlineRows.filter((d) => d.days < 0).length > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{deadlineRows.filter((d) => d.days < 0).length} overdue</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1.5">Next deadline</dt>
              <dd className={`text-lg font-bold tabular-nums ${deadlineRows.length && deadlineRows[0].days < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                {deadlineRows.length ? (deadlineRows[0].days < 0 ? `${Math.abs(deadlineRows[0].days)}d overdue` : `${deadlineRows[0].days}d`) : '—'}{' '}
                <span className="text-xs font-medium text-slate-400">{deadlineRows.length ? deadlineRows[0].name : 'none tracked'}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1.5">Staff induction</dt>
              <dd className="text-lg font-bold">{inductionDone ? 'Complete' : 'Not done'}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1.5">Client reviews overdue</dt>
              <dd className={`text-lg font-bold tabular-nums ${overdueClients.length ? 'text-red-600 dark:text-red-400' : ''}`}>{overdueClients.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-1.5">CAMS readiness</dt>
              <dd className="text-lg font-bold tabular-nums">{examPct != null ? `${examPct}%` : 'Not attempted'}</dd>
            </div>
          </div>
        </div>

        <h2 className="text-xs uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-3">Your compliance tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <StatusCard
            icon={ICONS.program}
            pill={programDraft ? { label: 'Draft ready', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' } : { label: 'Not started', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }}
            title="AML/CTF Program"
            meta={programDraft ? `Drafted for ${programDraft.businessName || 'your business'}. Version history available.` : 'AI-drafted Part A & B program document.'}
            linkLabel={programDraft ? 'Review draft' : 'Start drafting'}
            onClick={onOpenProgramBuilder}
          />
          <StatusCard
            icon={ICONS.privacy}
            pill={privacyDraft ? { label: 'Draft ready', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' } : { label: 'Not started', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }}
            title="Privacy Act Pack"
            meta={privacyDraft ? `Policy, collection notice & breach plan drafted.` : 'AI-drafted Privacy Act document set.'}
            linkLabel={privacyDraft ? 'Review draft' : 'Start drafting'}
            onClick={() => onOpenPrivacyPack?.()}
          />
          <StatusCard
            icon={ICONS.induction}
            pill={inductionDone ? { label: 'Complete', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' } : { label: 'Not done', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' }}
            title="Staff Induction"
            meta={inductionDone ? 'You’ve completed the AML/CTF awareness module.' : 'A 15-question awareness module covering red flags, escalation, and tipping-off.'}
            linkLabel={inductionDone ? 'Retake' : 'Start module'}
            onClick={onOpenTraining}
          />
          <StatusCard
            icon={ICONS.register}
            pill={overdueClients.length ? { label: `${overdueClients.length} overdue`, cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' } : activeClients.length ? { label: 'On track', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' } : { label: 'Empty', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }}
            title="Client Risk Register"
            meta={activeClients.length ? `${activeClients.length} active client${activeClients.length === 1 ? '' : 's'} on file.${overdueClients.length ? ` ${overdueClients.length} review${overdueClients.length === 1 ? '' : 's'} overdue.` : ''}` : 'Track risk ratings and CDD review dates.'}
            linkLabel="Open register"
            onClick={onOpenClientRiskRegister}
          />
          <StatusCard
            icon={ICONS.calendar}
            pill={calendarRows.some((d) => d.days < 0) ? { label: 'Overdue item', cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' } : calendarRows.length ? { label: `${calendarRows.length} tracked`, cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' } : { label: 'Not started', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }}
            title="Compliance Calendar"
            meta={calendarRows.length ? `Next: ${calendarRows[0].name}, ${calendarRows[0].days < 0 ? `${Math.abs(calendarRows[0].days)}d overdue` : `due in ${calendarRows[0].days}d`}.` : 'Track your recurring AUSTRAC & Privacy Act deadlines.'}
            linkLabel="View calendar"
            onClick={onOpenComplianceCalendar}
          />
          <StatusCard
            icon={ICONS.cams}
            pill={latestExam ? { label: latestExam.passed ? 'Passing' : 'Below pass mark', cls: latestExam.passed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' } : { label: 'Not attempted', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }}
            title="CAMS Exam Prep"
            meta={latestExam ? `Last mock exam: ${latestExam.score}/${latestExam.total} (${examPct}%).` : '258 questions plus timed, scored mock exams.'}
            barPct={examPct}
            linkLabel={latestExam ? 'Resume study' : 'Start studying'}
            onClick={onOpenTraining}
          />
        </div>

        <h2 className="text-xs uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500 mb-3">Upcoming deadlines</h2>
        {deadlineRows.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-500 dark:text-slate-400">
            Nothing tracked yet. Set your last-completed dates on the{' '}
            <button onClick={onOpenComplianceCalendar} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Compliance Calendar</button>
            {' '}and add clients to the{' '}
            <button onClick={onOpenClientRiskRegister} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Client Risk Register</button>
            {' '}to see deadlines here.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            {deadlineRows.slice(0, 6).map((d, i) => {
              const dotCls = d.days < 0 ? 'bg-red-500' : d.days <= 30 ? 'bg-amber-500' : 'bg-emerald-500'
              return (
                <div key={i} className={`flex items-center gap-3.5 px-5 py-3.5 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700' : ''}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dotCls}`} />
                  <span className="text-sm font-semibold flex-1 min-w-0 truncate">{d.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{d.sub}</span>
                  <span className={`text-xs font-bold whitespace-nowrap ${d.days < 0 ? 'text-red-600 dark:text-red-400' : d.days <= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {d.days < 0 ? `${Math.abs(d.days)}d overdue` : `Due in ${d.days}d`}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
