import { useState, useMemo } from 'react'
import Navbar from './Navbar'

const UBO_THRESHOLD = 25

function clampPercent(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
}

function newOwner() {
  return { id: crypto.randomUUID(), type: 'individual', name: '', entityRef: '', percent: '', hasControl: false }
}

function newEntity(name = '') {
  return { id: crypto.randomUUID(), name, owners: [] }
}

// Recursively resolves every individual's effective ownership of the target
// (entities[0]) — the sum, across every path from that individual up to the
// target, of the product of percentages along each path. A cycle guard stops
// an entity that (directly or indirectly) owns itself from infinite-looping.
function computeEffectiveOwnership(entities) {
  const target = entities[0]
  if (!target) return []
  const entityById = Object.fromEntries(entities.map((e) => [e.id, e]))
  const totals = new Map()

  function walk(entity, multiplier, visited) {
    if (!entity || visited.has(entity.id)) return
    const nextVisited = new Set(visited)
    nextVisited.add(entity.id)
    for (const owner of entity.owners) {
      const ownerFraction = clampPercent(owner.percent) / 100
      if (ownerFraction <= 0) continue
      const contribution = multiplier * ownerFraction
      if (owner.type === 'individual') {
        const key = owner.name.trim()
        if (!key) continue
        // Individuals are matched by name — the same real person entered via
        // multiple ownership paths correctly sums here. If two DIFFERENT
        // people share a name, this would wrongly merge them, so every
        // contributing entity is tracked per name and surfaced in the UI —
        // a merge from >1 entity is visible and auditable, not silent.
        const existing = totals.get(key) || { percent: 0, hasControl: false, sources: [] }
        existing.percent += contribution
        existing.hasControl = existing.hasControl || !!owner.hasControl
        existing.sources.push({ entityName: entity.name.trim() || 'Unnamed entity', percent: contribution * 100 })
        totals.set(key, existing)
      } else if (owner.type === 'entity' && owner.entityRef) {
        walk(entityById[owner.entityRef], contribution, nextVisited)
      }
    }
  }

  walk(target, 1, new Set())

  return [...totals.entries()]
    .map(([name, { percent, hasControl, sources }]) => ({
      name,
      percent: percent * 100,
      hasControl,
      sources,
      isUbo: percent * 100 >= UBO_THRESHOLD - 1e-9 || hasControl,
    }))
    .sort((a, b) => b.percent - a.percent)
}

export default function OwnershipCalculator({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator, onUpgrade }) {
  const [entities, setEntities] = useState(() => [newEntity('Target business')])
  const [copied, setCopied] = useState(false)

  const navProps = { user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onOpenReportableTransactionCheck, onOpenComplianceDashboard, onOpenSmrDraft, onOpenSanctionsScreening, onOpenOwnershipCalculator }

  const results = useMemo(() => computeEffectiveOwnership(entities), [entities])

  const updateEntity = (entityId, fn) => {
    setEntities((prev) => prev.map((e) => (e.id === entityId ? fn(e) : e)))
  }

  const addEntity = () => setEntities((prev) => [...prev, newEntity(`Holding entity ${prev.length}`)])
  const removeEntity = (entityId) => {
    setEntities((prev) =>
      prev
        .filter((e) => e.id !== entityId)
        .map((e) => ({ ...e, owners: e.owners.filter((o) => o.entityRef !== entityId) }))
    )
  }

  const addOwner = (entityId) => updateEntity(entityId, (e) => ({ ...e, owners: [...e.owners, newOwner()] }))
  const removeOwner = (entityId, ownerId) =>
    updateEntity(entityId, (e) => ({ ...e, owners: e.owners.filter((o) => o.id !== ownerId) }))
  const updateOwner = (entityId, ownerId, fields) =>
    updateEntity(entityId, (e) => ({
      ...e,
      owners: e.owners.map((o) => (o.id === ownerId ? { ...o, ...fields } : o)),
    }))

  const summaryText = useMemo(() => {
    const lines = ['BENEFICIAL OWNERSHIP CALCULATION', '']
    for (const r of results) {
      lines.push(
        `${r.name}: ${r.percent.toFixed(1)}% effective ownership${r.hasControl ? ' (also holds control)' : ''} — ${r.isUbo ? 'UBO' : 'Not a UBO'}`
      )
      if (r.sources.length > 1) {
        lines.push(`  combined from: ${r.sources.map((s) => `${s.entityName} (${s.percent.toFixed(1)}%)`).join(', ')}`)
      }
    }
    lines.push('', `UBO threshold: ${UBO_THRESHOLD}% effective ownership, or control regardless of %.`)
    lines.push('Self-assessment tool — verify complex structures with a qualified professional.')
    return lines.join('\n')
  }, [results])

  const handleCopy = () => {
    navigator.clipboard?.writeText(summaryText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
        <Navbar {...navProps} />
        <div className="max-w-md mx-auto px-6 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-3">Sign up for the Beneficial Ownership Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Map a real client's ownership structure and get an instant UBO determination. Available on Premium.
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
          <h1 className="text-2xl font-bold mb-2">Ownership Calculator is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Map a real client's ownership structure — individuals, holding companies, multiple layers — and get an instant effective-ownership and UBO determination.
          </p>
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

      <div className="max-w-5xl mx-auto px-6 pt-14 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Beneficial Ownership Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
            Build the ownership structure — individuals, and holding entities if there are multiple layers — and get each individual's effective ownership and UBO status instantly. Nothing you enter here is saved or sent to our servers.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Entities */}
          <div className="space-y-5">
            {entities.map((entity, entityIdx) => (
              <div key={entity.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    value={entity.name}
                    onChange={(e) => updateEntity(entity.id, (en) => ({ ...en, name: e.target.value }))}
                    placeholder={entityIdx === 0 ? 'Target business name' : 'Holding entity name'}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-semibold"
                  />
                  {entityIdx === 0 ? (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shrink-0">Target</span>
                  ) : (
                    <button onClick={() => removeEntity(entity.id)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg p-2 shrink-0" aria-label="Remove entity">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  {entity.owners.map((owner) => (
                    <div key={owner.id} className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-700 rounded-xl p-3">
                      <select
                        value={owner.type}
                        onChange={(e) => updateOwner(entity.id, owner.id, { type: e.target.value, entityRef: '', name: '' })}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="individual">Individual</option>
                        <option value="entity">Another entity</option>
                      </select>

                      {owner.type === 'individual' ? (
                        <input
                          value={owner.name}
                          onChange={(e) => updateOwner(entity.id, owner.id, { name: e.target.value })}
                          placeholder="Full name"
                          className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                        />
                      ) : (
                        <select
                          value={owner.entityRef}
                          onChange={(e) => updateOwner(entity.id, owner.id, { entityRef: e.target.value })}
                          className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                        >
                          <option value="">Select entity…</option>
                          {entities.filter((e) => e.id !== entity.id).map((e) => (
                            <option key={e.id} value={e.id}>{e.name || 'Unnamed entity'}</option>
                          ))}
                        </select>
                      )}

                      <div className="flex items-center gap-1">
                        <input
                          type="number" min="0" max="100" step="0.1"
                          value={owner.percent}
                          onChange={(e) => updateOwner(entity.id, owner.id, { percent: e.target.value })}
                          onBlur={(e) => {
                            if (e.target.value === '') return
                            const clamped = clampPercent(e.target.value)
                            if (String(clamped) !== e.target.value) updateOwner(entity.id, owner.id, { percent: String(clamped) })
                          }}
                          placeholder="%"
                          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={owner.hasControl}
                          onChange={(e) => updateOwner(entity.id, owner.id, { hasControl: e.target.checked })}
                        />
                        Has control (director/trustee)
                      </label>

                      <button onClick={() => removeOwner(entity.id, owner.id)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg p-1.5 ml-auto" aria-label="Remove owner">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {entity.owners.length === 0 && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 py-2">No owners added yet.</p>
                  )}
                </div>

                <button onClick={() => addOwner(entity.id)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  + Add owner
                </button>
              </div>
            ))}

            <button onClick={addEntity} className="px-4 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
              + Add a holding entity (for multi-layer structures)
            </button>
          </div>

          {/* Results */}
          <div className="lg:sticky lg:top-24 space-y-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Beneficial owners</p>
            {results.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">Add owners to the target business to see results.</p>
            )}
            {results.map((r) => (
              <div
                key={r.name}
                className={`rounded-xl border p-4 ${r.isUbo ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${r.isUbo ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {r.isUbo ? 'UBO' : 'Not a UBO'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.percent.toFixed(1)}% effective ownership{r.hasControl ? ' · has control' : ''}
                </p>
                {r.sources.length > 1 && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-600/60">
                    Combined from {r.sources.length} paths — {r.sources.map((s) => `${s.entityName} (${s.percent.toFixed(1)}%)`).join(', ')}. If these are different people who share a name, rename one to keep them separate.
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={handleCopy}
              disabled={results.length === 0}
              className="w-full flex items-center justify-center gap-1.5 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 rounded-xl font-semibold text-sm transition-colors"
            >
              {copied ? 'Copied!' : 'Copy summary'}
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              UBO threshold: {UBO_THRESHOLD}% effective ownership, or control regardless of %.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-12">
          Self-assessment tool, not legal advice — verify complex or high-risk structures with a qualified AML/CTF professional. Nothing entered on this page is saved or sent to our servers; it exists only in your browser for this session.
        </p>
      </div>
    </div>
  )
}
