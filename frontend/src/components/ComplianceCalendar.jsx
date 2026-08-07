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

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(date) {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Tranche 2 entities' first AUSTRAC reporting period is 1 July 2026 – 30 June
// 2027, so their first Annual Compliance Report is never due before 30
// September 2027 — verified via AUSTRAC's Annual Compliance Reports guidance.
// After that, the same 1 July–30 September lodgement window recurs each year.
function currentAcrDueInfo() {
  const today = new Date()
  let fyEndYear = 2027
  let due = new Date(fyEndYear, 8, 30)
  while (today > due) {
    fyEndYear += 1
    due = new Date(fyEndYear, 8, 30)
  }
  return { dueDate: due, fyEndYear, fyLabel: `FY${fyEndYear - 1}–${fyEndYear}` }
}

const ITEMS = [
  {
    key: 'programReviewDate',
    title: 'AML/CTF Program & Risk Assessment Review',
    citation: 'AUSTRAC minimum',
    desc: 'AUSTRAC’s guidance sets a minimum of reviewing your risk assessment and AML/CTF program at least once every 3 years — sooner after a material change to your business, services, or risk profile.',
    cycleFn: (d) => addYears(d, 3),
    dueSoonDays: 90,
  },
  {
    key: 'independentEvalDate',
    title: 'Independent Evaluation of Your Program',
    citation: 'AUSTRAC minimum',
    desc: 'A review by someone not involved in day-to-day compliance operation of your program. AUSTRAC sets a minimum of at least once every 3 years.',
    cycleFn: (d) => addYears(d, 3),
    dueSoonDays: 90,
  },
  {
    key: 'staffTrainingDate',
    title: 'Staff AML/CTF Training Refresher',
    citation: 'Recommended — no fixed AUSTRAC interval',
    desc: 'AUSTRAC requires "regular and sustained" training but sets no single mandated interval — frequency should match each role’s risk. A 12-month refresher is common practice for higher-risk roles; adjust to your own risk-based approach.',
    cycleFn: (d) => addMonths(d, 12),
    dueSoonDays: 30,
  },
  {
    key: 'privacyReviewDate',
    title: 'Privacy Policy Review',
    citation: 'APP 1.3 — recommended cadence',
    desc: 'APP 1.3 requires your privacy policy stay clearly expressed and up to date, but sets no fixed review interval. Reviewing at least annually, or after a business change, is common practice.',
    cycleFn: (d) => addMonths(d, 12),
    dueSoonDays: 30,
  },
]

function badgeFor(days, dueSoonDays) {
  if (days == null) return { label: 'Not yet started', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }
  if (days < 0) return { label: 'Overdue', cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' }
  if (days <= dueSoonDays) return { label: 'Due soon', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' }
  return { label: 'On track', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' }
}

function ItemCard({ item, value, onChange, onMarkToday, onSave, saving }) {
  const dueDate = value ? item.cycleFn(value) : null
  const days = dueDate ? daysUntil(dueDate) : null
  const badge = badgeFor(days, item.dueSoonDays)

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
      </div>
      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">{item.citation}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{item.desc}</p>
      {dueDate && (
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
          Next due: <span className="font-semibold">{formatDate(dueDate)}</span>
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-xs text-slate-400 dark:text-slate-500 shrink-0">Last done</label>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200"
        />
        <button
          onClick={onSave}
          disabled={saving}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onMarkToday}
          disabled={saving}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          Mark done today
        </button>
      </div>
    </div>
  )
}

export default function ComplianceCalendar({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceDashboard, onOpenSmrDraft, onUpgrade }) {
  const [phase, setPhase] = useState('checking') // checking | dashboard
  const [checklist, setChecklist] = useState({})
  const [savingKey, setSavingKey] = useState(null)

  useEffect(() => {
    if (!user?.premium) { setPhase('dashboard'); return }
    const token = localStorage.getItem('aml_token')
    fetch(`${API_URL}/compliance-checklist`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setChecklist(data.checklist || {}))
      .catch(() => {})
      .finally(() => setPhase('dashboard'))
  }, [user?.id, user?.premium])

  const saveField = async (key, value) => {
    setSavingKey(key)
    try {
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/compliance-checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [key]: value }),
      })
      const data = await res.json()
      if (res.ok) setChecklist(data.checklist || {})
    } finally {
      setSavingKey(null)
    }
  }

  const setLocal = (key, value) => setChecklist((prev) => ({ ...prev, [key]: value }))

  const acr = currentAcrDueInfo()
  const acrLodged = checklist.acrLodgedYear === acr.fyEndYear
  const acrDays = acrLodged ? null : daysUntil(acr.dueDate)
  const acrBadge = acrLodged
    ? { label: 'Lodged', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' }
    : badgeFor(acrDays, 30)

  if (phase === 'checking') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar
          user={user} onGoHome={onGoHome} onNavigateSection={onNavigateSection} onStart={onStart}
          onSignIn={onSignIn} onSignUp={onSignUp} onOpenChat={onOpenChat} onOpenTraining={onOpenTraining}
          onSignOut={onSignOut} onOpenSettings={onOpenSettings} onOpenAbout={onOpenAbout} onOpenContact={onOpenContact}
          onOpenCost={onOpenCost} onOpenSetupGuide={onOpenSetupGuide} onOpenEligibility={onOpenEligibility}
          onOpenProgramBuilder={onOpenProgramBuilder} onOpenAustracEnrolment={onOpenAustracEnrolment}
          onOpenComplianceOfficer={onOpenComplianceOfficer} onOpenRiskAssessment={onOpenRiskAssessment}
          onOpenSuspiciousIndicators={onOpenSuspiciousIndicators} onOpenPrivacyCheck={onOpenPrivacyCheck}
          onOpenComplianceDashboard={onOpenComplianceDashboard}
          onOpenSmrDraft={onOpenSmrDraft}
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar
          user={user} onGoHome={onGoHome} onNavigateSection={onNavigateSection} onStart={onStart}
          onSignIn={onSignIn} onSignUp={onSignUp} onOpenChat={onOpenChat} onOpenTraining={onOpenTraining}
          onSignOut={onSignOut} onOpenSettings={onOpenSettings} onOpenAbout={onOpenAbout} onOpenContact={onOpenContact}
          onOpenCost={onOpenCost} onOpenSetupGuide={onOpenSetupGuide} onOpenEligibility={onOpenEligibility}
          onOpenProgramBuilder={onOpenProgramBuilder} onOpenAustracEnrolment={onOpenAustracEnrolment}
          onOpenComplianceOfficer={onOpenComplianceOfficer} onOpenRiskAssessment={onOpenRiskAssessment}
          onOpenSuspiciousIndicators={onOpenSuspiciousIndicators} onOpenPrivacyCheck={onOpenPrivacyCheck}
          onOpenComplianceDashboard={onOpenComplianceDashboard}
          onOpenSmrDraft={onOpenSmrDraft}
        />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up for the Compliance Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Track your recurring AML/CTF and Privacy Act obligations — program review, independent evaluation, staff training, and your Annual Compliance Report. Available on Premium.
          </p>
          <button onClick={onSignUp} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
            Sign up free →
          </button>
        </div>
      </div>
    )
  }

  if (!user.premium) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar
          user={user} onGoHome={onGoHome} onNavigateSection={onNavigateSection} onStart={onStart}
          onSignIn={onSignIn} onSignUp={onSignUp} onOpenChat={onOpenChat} onOpenTraining={onOpenTraining}
          onSignOut={onSignOut} onOpenSettings={onOpenSettings} onOpenAbout={onOpenAbout} onOpenContact={onOpenContact}
          onOpenCost={onOpenCost} onOpenSetupGuide={onOpenSetupGuide} onOpenEligibility={onOpenEligibility}
          onOpenProgramBuilder={onOpenProgramBuilder} onOpenAustracEnrolment={onOpenAustracEnrolment}
          onOpenComplianceOfficer={onOpenComplianceOfficer} onOpenRiskAssessment={onOpenRiskAssessment}
          onOpenSuspiciousIndicators={onOpenSuspiciousIndicators} onOpenPrivacyCheck={onOpenPrivacyCheck}
          onOpenComplianceDashboard={onOpenComplianceDashboard}
          onOpenSmrDraft={onOpenSmrDraft}
        />
        <div className="max-w-md mx-auto px-8 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Compliance Calendar is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Track every recurring AML/CTF and Privacy Act obligation your business has — program review, independent evaluation, staff training, privacy policy review, and your Annual Compliance Report — with due dates and status at a glance.
          </p>
          <ul className="text-left space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            {[
              'Program & risk assessment review (AUSTRAC: every 3 years)',
              'Independent evaluation (AUSTRAC: every 3 years)',
              'Staff training refresher reminders',
              'Annual Compliance Report due date',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={onUpgrade} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors mb-6">
            Upgrade to Premium — $49.99/mo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Navbar
        user={user} onGoHome={onGoHome} onNavigateSection={onNavigateSection} onStart={onStart}
        onSignIn={onSignIn} onSignUp={onSignUp} onOpenChat={onOpenChat} onOpenTraining={onOpenTraining}
        onSignOut={onSignOut} onOpenSettings={onOpenSettings} onOpenAbout={onOpenAbout} onOpenContact={onOpenContact}
        onOpenCost={onOpenCost} onOpenSetupGuide={onOpenSetupGuide} onOpenEligibility={onOpenEligibility}
        onOpenProgramBuilder={onOpenProgramBuilder} onOpenAustracEnrolment={onOpenAustracEnrolment}
        onOpenComplianceOfficer={onOpenComplianceOfficer} onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators} onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceDashboard={onOpenComplianceDashboard}
        onOpenSmrDraft={onOpenSmrDraft}
      />

      <div className="max-w-4xl mx-auto px-6 pt-14 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Compliance Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
            The recurring AML/CTF and Privacy Act obligations your business has, once you're up and running — not just the one-time setup.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {ITEMS.map((item) => (
            <ItemCard
              key={item.key}
              item={item}
              value={checklist[item.key]}
              onChange={(v) => setLocal(item.key, v)}
              onSave={() => saveField(item.key, checklist[item.key] || null)}
              onMarkToday={() => { setLocal(item.key, todayIso()); saveField(item.key, todayIso()) }}
              saving={savingKey === item.key}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
            <p className="font-semibold text-slate-900 dark:text-white">Annual Compliance Report ({acr.fyLabel})</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${acrBadge.cls}`}>{acrBadge.label}</span>
          </div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">AUSTRAC — fixed annual deadline</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            Reporting entities must lodge an Annual Compliance Report covering the financial year just ended (1 July – 30 June), within the window that closes 30 September. Your first Tranche 2 reporting period is 1 July 2026 – 30 June 2027.
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
            Due date: <span className="font-semibold">{formatDate(acr.dueDate)}</span>
          </p>
          {acrLodged ? (
            <button
              onClick={() => saveField('acrLodgedYear', null)}
              disabled={savingKey === 'acrLodgedYear'}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              Undo — not yet lodged
            </button>
          ) : (
            <button
              onClick={() => saveField('acrLodgedYear', acr.fyEndYear)}
              disabled={savingKey === 'acrLodgedYear'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Mark {acr.fyLabel} as lodged
            </button>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-10">
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Keep your AUSTRAC enrolment details current</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            If your business structure, key personnel, or other enrolment details change, AUSTRAC requires you to update your enrolment within 14 days of the change — this isn't a periodic reminder, just a standing rule to keep in mind.
          </p>
          <button onClick={onOpenAustracEnrolment} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold transition-colors">
            View the AUSTRAC Enrolment guide →
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          This is general information, not legal advice. The AUSTRAC-mandated items above reflect published minimums; staff training and privacy policy review cadences are recommended practice, not fixed legal requirements. Confirm your specific obligations with a qualified adviser.
        </p>
      </div>
    </div>
  )
}
