import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import Navbar from './Navbar'

const SOURCE_LABELS = {
  dfat: 'DFAT Consolidated List (Australia)',
  ofac: 'OFAC SDN List (United States)',
}

function confidenceBand(score) {
  if (score >= 0.7) return { label: 'Strong match', className: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30' }
  if (score >= 0.45) return { label: 'Possible match', className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' }
  return { label: 'Weak match', className: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600' }
}

function Nav(props) {
  return (
    <div className="print:hidden">
      <Navbar {...props} />
    </div>
  )
}

export default function SanctionsScreening({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onUpgrade }) {
  const navProps = { user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft }

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null) // { query, matches, listsStatus }

  const [watchlist, setWatchlist] = useState(null) // null = not loaded yet
  const [monitorState, setMonitorState] = useState('idle') // idle | loading | done | error

  const loadWatchlist = async () => {
    const token = localStorage.getItem('aml_token')
    try {
      const res = await fetch(`${API_URL}/sanctions-watchlist`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setWatchlist(res.ok ? data.watchlist : [])
    } catch {
      setWatchlist([])
    }
  }

  useEffect(() => {
    if (user?.premium) loadWatchlist()
  }, [user?.premium])

  const handleScreen = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    setMonitorState('idle')
    try {
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/sanctions-screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setResult(null)
        return
      }
      setResult(data)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleMonitor = async () => {
    if (!result) return
    setMonitorState('loading')
    try {
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/sanctions-watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: result.query }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMonitorState('error')
        setError(data.error || 'Could not add to your monitored names.')
        return
      }
      setMonitorState('done')
      loadWatchlist()
    } catch {
      setMonitorState('error')
    }
  }

  const handleRemoveWatch = async (id) => {
    const token = localStorage.getItem('aml_token')
    setWatchlist((prev) => prev.filter((w) => w.id !== id))
    try {
      await fetch(`${API_URL}/sanctions-watchlist/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    } catch {
      loadWatchlist()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Nav {...navProps} />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up to screen names</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Check a customer name against the DFAT and OFAC public sanctions lists. Available on Premium.
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
        <Nav {...navProps} />
        <div className="max-w-md mx-auto px-8 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Sanctions Screening is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Check a customer name against Australia's DFAT Consolidated List and the US OFAC SDN List — fuzzy-matched against name variants and aliases, not just exact spelling.
          </p>
          <ul className="text-left space-y-3 mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            {[
              'Matches against both primary names and known aliases',
              'Lists refreshed automatically, with the exact source date always shown',
              'Ranked by match confidence, not just a yes/no result',
              'Optional ongoing monitoring — get emailed if a name you\'re watching gets a new match',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={onUpgrade} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
            Upgrade to Premium — $49.99/mo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Nav {...navProps} />
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Sanctions Screening</h1>
          <p className="text-slate-500 dark:text-slate-400">Check a name against the DFAT and OFAC public sanctions lists</p>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 mb-8">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            This screens against a copy of the DFAT and OFAC lists that AmlIntel refreshes automatically — it is not a live query to either regulator, and results can include false positives or miss alias/transliteration variants. Treat any match as a prompt to investigate, not a final determination, and verify anything consequential directly against the official lists before acting on it.
          </p>
        </div>

        <form onSubmit={handleScreen} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name to screen"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
          >
            {loading ? 'Screening…' : 'Screen name →'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 mb-6 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <p className="text-sm font-semibold">
                {result.matches.length === 0
                  ? `No matches for "${result.query}"`
                  : `${result.matches.length} match${result.matches.length === 1 ? '' : 'es'} for "${result.query}"`}
              </p>
              {monitorState === 'done' ? (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Monitoring this name
                </span>
              ) : (
                <button
                  onClick={handleMonitor}
                  disabled={monitorState === 'loading'}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  {monitorState === 'loading' ? 'Adding…' : 'Monitor this name going forward →'}
                </button>
              )}
            </div>

            {result.matches.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-500 dark:text-slate-400 mb-8">
                No entries in the DFAT or OFAC lists closely match this name. This doesn't guarantee the customer is unlisted — always corroborate with your standard CDD process.
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {result.matches.map((m, i) => {
                  const band = confidenceBand(m.score)
                  return (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="font-semibold text-sm">{m.primary_name}</p>
                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${band.className}`}>{band.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                        {SOURCE_LABELS[m.source] || m.source} · {m.entry_type}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {m.aliases?.length > 0 && (
                          <p className="sm:col-span-2"><span className="text-slate-400 dark:text-slate-500">Known aliases:</span> {m.aliases.join(', ')}</p>
                        )}
                        {m.dob && <p><span className="text-slate-400 dark:text-slate-500">DOB:</span> {m.dob}</p>}
                        {m.nationality && <p><span className="text-slate-400 dark:text-slate-500">Nationality:</span> {m.nationality}</p>}
                        {m.program_or_reference && <p className="sm:col-span-2"><span className="text-slate-400 dark:text-slate-500">Reference:</span> {m.program_or_reference}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {result.listsStatus?.length > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center mb-10">
                {result.listsStatus.map((s) => (
                  <span key={s.source} className="inline-block mr-4">
                    {SOURCE_LABELS[s.source] || s.source} dated {s.list_updated_at ? new Date(s.list_updated_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : 'unknown'}
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        {watchlist?.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
            <p className="text-sm font-semibold mb-1">Your monitored names ({watchlist.length})</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Unlike the Client Risk Register, this does store the actual name you enter — only add someone here if you want AmlIntel to keep checking them against updated sanctions lists. Re-checked daily; you'll get an email if a new match appears.
            </p>
            <div className="space-y-2">
              {watchlist.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{w.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {w.lastCheckedAt ? `Last checked ${new Date(w.lastCheckedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Not yet checked'}
                      {' · '}
                      {w.lastMatchCount > 0 ? (
                        <span className="text-red-600 dark:text-red-400 font-semibold">{w.lastMatchCount} match{w.lastMatchCount === 1 ? '' : 'es'}</span>
                      ) : 'Clear'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveWatch(w.id)}
                    className="shrink-0 text-xs font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
