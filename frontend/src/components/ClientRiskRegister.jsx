import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Navbar from './Navbar'

const RISK_RATINGS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

const CDD_TYPES = [
  { id: 'standard', label: 'Standard CDD' },
  { id: 'edd', label: 'Enhanced CDD' },
]

const RISK_BADGE_CLS = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

const CASE_STATUS_LABELS = { none: 'No case', open: 'Investigation open', closed: 'Investigation closed' }
const CASE_STATUS_CLS = {
  none: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  closed: 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300',
}
// What the action button does/shows for the entry's current case_status —
// none -> open -> closed -> open (reopen), never back to "no case" from the
// UI, since "no case" just means one was never started.
const CASE_STATUS_ACTION = {
  none: { next: 'open', label: 'Open a case' },
  open: { next: 'closed', label: 'Close case' },
  closed: { next: 'open', label: 'Reopen' },
}

function formatDateTime(isoStr) {
  return new Date(isoStr).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// `new Date('YYYY-MM-DD')` parses the string as UTC midnight, then local
// getters (used below and by toLocaleDateString) read it back in local
// time — off by a day for any user west of UTC. Parsing the components
// directly builds a local-midnight Date instead.
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysUntil(dateStr) {
  const now = new Date()
  const target = parseLocalDate(dateStr)
  return Math.floor((target - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)
}

function formatDate(dateStr) {
  return parseLocalDate(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function reviewBadge(nextReviewDate) {
  if (!nextReviewDate) return { label: 'Not set', cls: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' }
  const days = daysUntil(nextReviewDate)
  if (days < 0) return { label: 'Overdue', cls: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' }
  if (days <= 30) return { label: 'Due soon', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' }
  return { label: 'On track', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' }
}

const EMPTY_FORM = { referenceLabel: '', riskRating: 'low', cddType: 'standard', onboardedDate: '', nextReviewDate: '', notes: '' }

export default function ClientRiskRegister({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onUpgrade }) {
  const [phase, setPhase] = useState('checking') // checking | dashboard
  const [entries, setEntries] = useState([])
  const [statusFilter, setStatusFilter] = useState('active')
  const [riskFilter, setRiskFilter] = useState('all')
  const [caseFilter, setCaseFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [expandedEntryId, setExpandedEntryId] = useState(null)
  const [caseNotesByEntry, setCaseNotesByEntry] = useState({})
  const [noteDraftByEntry, setNoteDraftByEntry] = useState({})
  const [noteBusyId, setNoteBusyId] = useState(null)
  const [noteError, setNoteError] = useState(null)

  const navProps = { user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening }

  const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('aml_token')}` })

  useEffect(() => {
    if (!user?.premium) { setPhase('dashboard'); return }
    fetch(`${API_URL}/client-risk-entries`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {})
      .finally(() => setPhase('dashboard'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.premium])

  const startAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setError(null) }
  const startEdit = (entry) => {
    setForm({
      referenceLabel: entry.referenceLabel, riskRating: entry.riskRating, cddType: entry.cddType,
      onboardedDate: entry.onboardedDate || '', nextReviewDate: entry.nextReviewDate || '', notes: entry.notes || '',
    })
    setEditingId(entry.id)
    setShowForm(true)
    setError(null)
  }
  const cancelForm = () => { setShowForm(false); setEditingId(null); setError(null) }

  const submitForm = async () => {
    if (!form.referenceLabel.trim()) { setError('A reference label is required.'); return }
    setError(null)
    try {
      const url = editingId ? `${API_URL}/client-risk-entries/${editingId}` : `${API_URL}/client-risk-entries`
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          referenceLabel: form.referenceLabel.trim(),
          riskRating: form.riskRating,
          cddType: form.cddType,
          onboardedDate: form.onboardedDate || null,
          nextReviewDate: form.nextReviewDate || null,
          notes: form.notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      if (editingId) {
        setEntries((prev) => prev.map((e) => (e.id === editingId ? data.entry : e)))
      } else {
        setEntries((prev) => [...prev, data.entry])
      }
      setShowForm(false)
      setEditingId(null)
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
  }

  const patchEntry = async (id, fields) => {
    setBusyId(id)
    try {
      const res = await fetch(`${API_URL}/client-risk-entries/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(fields) })
      const data = await res.json()
      if (res.ok) setEntries((prev) => prev.map((e) => (e.id === id ? data.entry : e)))
    } finally {
      setBusyId(null)
    }
  }

  const deleteEntry = async (id) => {
    setBusyId(id)
    try {
      const res = await fetch(`${API_URL}/client-risk-entries/${id}`, { method: 'DELETE', headers: authHeaders() })
      if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id))
    } finally {
      setBusyId(null)
    }
  }

  const toggleCaseNotes = (entryId) => {
    if (expandedEntryId === entryId) { setExpandedEntryId(null); return }
    setExpandedEntryId(entryId)
    setNoteError(null)
    if (caseNotesByEntry[entryId]) return
    fetch(`${API_URL}/client-risk-entries/${entryId}/case-notes`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setCaseNotesByEntry((prev) => ({ ...prev, [entryId]: data.notes || [] })))
      .catch(() => {})
  }

  const submitNote = async (entryId) => {
    const text = (noteDraftByEntry[entryId] || '').trim()
    if (!text) return
    setNoteBusyId(entryId)
    setNoteError(null)
    try {
      const res = await fetch(`${API_URL}/client-risk-entries/${entryId}/case-notes`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ note: text }),
      })
      const data = await res.json()
      if (!res.ok) { setNoteError(data.error || 'Something went wrong.'); return }
      setCaseNotesByEntry((prev) => ({ ...prev, [entryId]: [...(prev[entryId] || []), data.note] }))
      setNoteDraftByEntry((prev) => ({ ...prev, [entryId]: '' }))
    } catch {
      setNoteError('Network error. Please check your connection and try again.')
    } finally {
      setNoteBusyId(null)
    }
  }

  const removeNote = async (entryId, noteId) => {
    setNoteBusyId(noteId)
    try {
      const res = await fetch(`${API_URL}/client-risk-entries/${entryId}/case-notes/${noteId}`, { method: 'DELETE', headers: authHeaders() })
      if (res.ok) setCaseNotesByEntry((prev) => ({ ...prev, [entryId]: (prev[entryId] || []).filter((n) => n.id !== noteId) }))
    } finally {
      setNoteBusyId(null)
    }
  }

  const filtered = entries.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false
    if (riskFilter !== 'all' && e.riskRating !== riskFilter) return false
    if (caseFilter !== 'all' && (e.caseStatus || 'none') !== caseFilter) return false
    return true
  })

  const activeCount = entries.filter((e) => e.status === 'active').length
  const overdueCount = entries.filter((e) => e.status === 'active' && e.nextReviewDate && daysUntil(e.nextReviewDate) < 0).length
  const highRiskCount = entries.filter((e) => e.status === 'active' && e.riskRating === 'high').length
  const openCaseCount = entries.filter((e) => e.caseStatus === 'open').length

  if (phase === 'checking') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar {...navProps} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar {...navProps} />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up for the Client Risk Register</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Track risk ratings and CDD review dates across your client base — a running register, not a one-time document. Available on Premium.
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
        <Navbar {...navProps} />
        <div className="max-w-md mx-auto px-8 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Client Risk Register is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Track risk ratings, CDD type, and review dates across your active client base, with at-a-glance status on who's overdue for review.
          </p>
          <ul className="text-left space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            {[
              'Risk rating and CDD/EDD tracking per client',
              'Overdue / due-soon review status at a glance',
              'Filter by risk rating and active/offboarded status',
              'Metadata only — no identity documents stored',
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
      <Navbar {...navProps} />

      <div className="max-w-4xl mx-auto px-6 pt-14 pb-20">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Client Risk Register</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
              Track risk ratings and CDD review dates across your client base. Metadata only — don't enter client names, dates of birth, or ID numbers here.
            </p>
          </div>
          <button onClick={startAdd} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors shrink-0">
            + Add client
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{activeCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Active clients</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Overdue for review</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{highRiskCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">High risk</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{openCaseCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Open investigations</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 mb-6">
            <p className="font-semibold mb-1">{editingId ? 'Edit client' : 'Add client'}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
              A matter number, initials, or internal reference — not the client's name, date of birth, or ID number.
            </p>
            {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-2.5 mb-4 text-sm text-red-700 dark:text-red-300">{error}</div>}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Reference label</label>
                <input
                  type="text" value={form.referenceLabel} onChange={(e) => setForm((f) => ({ ...f, referenceLabel: e.target.value }))}
                  placeholder="e.g. Matter #1042"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Risk rating</label>
                <select value={form.riskRating} onChange={(e) => setForm((f) => ({ ...f, riskRating: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
                  {RISK_RATINGS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">CDD type</label>
                <select value={form.cddType} onChange={(e) => setForm((f) => ({ ...f, cddType: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
                  {CDD_TYPES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Onboarded date</label>
                <input type="date" value={form.onboardedDate} onChange={(e) => setForm((f) => ({ ...f, onboardedDate: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Next review due</label>
                <input type="date" value={form.nextReviewDate} onChange={(e) => setForm((f) => ({ ...f, nextReviewDate: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={submitForm} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
                {editingId ? 'Save changes' : 'Add client'}
              </button>
              <button onClick={cancelForm} className="px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {['active', 'offboarded', 'all'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFilter === s ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {['all', 'low', 'medium', 'high'].map((r) => (
              <button key={r} onClick={() => setRiskFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${riskFilter === r ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                {r === 'all' ? 'All risk' : r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {['all', 'none', 'open', 'closed'].map((c) => (
              <button key={c} onClick={() => setCaseFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${caseFilter === c ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                {c === 'all' ? 'All cases' : c === 'none' ? 'No case' : c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-10">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-10">No entries match these filters.</p>
          )}
          {filtered.map((entry) => {
            const badge = reviewBadge(entry.nextReviewDate)
            return (
              <div key={entry.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{entry.referenceLabel}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${RISK_BADGE_CLS[entry.riskRating]}`}>{entry.riskRating}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      {CDD_TYPES.find((c) => c.id === entry.cddType)?.label}
                    </span>
                    {entry.status === 'offboarded' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">Offboarded</span>
                    )}
                    {entry.caseStatus && entry.caseStatus !== 'none' && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CASE_STATUS_CLS[entry.caseStatus]}`}>{CASE_STATUS_LABELS[entry.caseStatus]}</span>
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
                  {entry.onboardedDate && <span>Onboarded {formatDate(entry.onboardedDate)}</span>}
                  {entry.nextReviewDate && <span>Next review {formatDate(entry.nextReviewDate)}</span>}
                  {entry.lastReviewDate && <span>Last reviewed {formatDate(entry.lastReviewDate)}</span>}
                </div>
                {entry.notes && <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{entry.notes}</p>}
                <div className="flex items-center gap-2 flex-wrap">
                  <button disabled={busyId === entry.id} onClick={() => patchEntry(entry.id, { lastReviewDate: todayIso() })} className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
                    Mark reviewed today
                  </button>
                  <button disabled={busyId === entry.id} onClick={() => patchEntry(entry.id, { status: entry.status === 'active' ? 'offboarded' : 'active' })} className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
                    {entry.status === 'active' ? 'Mark offboarded' : 'Reactivate'}
                  </button>
                  <button disabled={busyId === entry.id} onClick={() => patchEntry(entry.id, { caseStatus: CASE_STATUS_ACTION[entry.caseStatus || 'none'].next })} className="px-3 py-1.5 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/10 disabled:opacity-50 transition-colors">
                    {CASE_STATUS_ACTION[entry.caseStatus || 'none'].label}
                  </button>
                  <button onClick={() => toggleCaseNotes(entry.id)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Case notes {caseNotesByEntry[entry.id] ? `(${caseNotesByEntry[entry.id].length})` : ''} {expandedEntryId === entry.id ? '▲' : '▼'}
                  </button>
                  <button onClick={() => startEdit(entry)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Edit
                  </button>
                  <button disabled={busyId === entry.id} onClick={() => deleteEntry(entry.id)} className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors">
                    Delete
                  </button>
                </div>

                {expandedEntryId === entry.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                      Unlike the register's own Notes field, these entries can't be edited once saved — only removed. Don't enter client names, dates of birth, or identity document numbers here either.
                    </p>
                    {noteError && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-2.5 mb-3 text-sm text-red-700 dark:text-red-300">{noteError}</div>}
                    {caseNotesByEntry[entry.id] === undefined && (
                      <p className="text-xs text-slate-400 dark:text-slate-500">Loading…</p>
                    )}
                    {caseNotesByEntry[entry.id]?.length === 0 && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">No case notes yet.</p>
                    )}
                    <div className="space-y-2 mb-3">
                      {(caseNotesByEntry[entry.id] || []).map((n) => (
                        <div key={n.id} className="flex items-start justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl px-3 py-2">
                          <div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-0.5">{formatDateTime(n.createdAt)}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{n.note}</p>
                          </div>
                          <button disabled={noteBusyId === n.id} onClick={() => removeNote(entry.id, n.id)} className="text-slate-400 hover:text-red-500 disabled:opacity-50 shrink-0 text-sm leading-none px-1">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2">
                      <textarea
                        value={noteDraftByEntry[entry.id] || ''}
                        onChange={(e) => setNoteDraftByEntry((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                        rows={2}
                        placeholder="What did you do, and when?"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                      />
                      <button disabled={noteBusyId === entry.id || !(noteDraftByEntry[entry.id] || '').trim()} onClick={() => submitNote(entry.id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors shrink-0">
                        Add note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          This is general information, not legal advice. Review frequency by risk tier is a matter for your own risk-based approach — this register tracks the dates you set, it doesn't prescribe them. Don't enter client names, dates of birth, or identity document numbers in any field.
        </p>
      </div>
    </div>
  )
}
