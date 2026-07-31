import { useState, useEffect } from 'react'
import OwnershipDiagram from './OwnershipDiagram'
import { OWNERSHIP_SCENARIOS } from '../data/ownershipScenarios'

const CATEGORIES = [
  { id: 'trusts',     title: 'Trusts' },
  { id: 'funds',      title: 'Funds & Listed' },
  { id: 'ltd',        title: 'Ltd / LLC / Holdcos' },
  { id: 'charities',  title: 'Charities & HNWI' },
]

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

function BackButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium mb-6 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </button>
  )
}

export default function OwnershipSimulation({ user, onBack }) {
  const [difficulty, setDifficulty] = useState('Beginner')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [progress, setProgress] = useState({})
  const [activeScenario, setActiveScenario] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(`aml_prog_ownership_${user?.id || 'guest'}`)
    if (saved) try { setProgress(JSON.parse(saved)) } catch {}
  }, [user?.id])

  const save = (p) => {
    setProgress(p)
    localStorage.setItem(`aml_prog_ownership_${user?.id || 'guest'}`, JSON.stringify(p))
  }

  const scenariosFor = (catId, diff) => OWNERSHIP_SCENARIOS.filter((s) => s.category === catId && s.difficulty === diff)

  const startScenario = (s, fromStep) => {
    const step = fromStep != null ? fromStep : (progress[s.id]?.step || 0)
    setActiveScenario(s)
    setActiveStep(step)
    setSelected(null)
    setShowFeedback(false)
  }

  const restart = (s, e) => {
    e?.stopPropagation()
    save({ ...progress, [s.id]: { step: 0, completed: false } })
    startScenario(s, 0)
  }

  const handleAnswer = (i) => {
    if (showFeedback) return
    setSelected(i)
    setShowFeedback(true)
  }

  const handleNext = () => {
    const next = activeStep + 1
    if (next >= activeScenario.steps.length) {
      save({ ...progress, [activeScenario.id]: { step: 0, completed: true } })
      setActiveScenario(null)
    } else {
      save({ ...progress, [activeScenario.id]: { step: next, completed: false } })
      setActiveStep(next)
      setSelected(null)
      setShowFeedback(false)
    }
  }

  /* ── Active scenario view (diagram + questions) ── */
  if (activeScenario) {
    const step = activeScenario.steps[activeStep]
    const chosen = selected != null ? step.options[selected] : null
    const total = activeScenario.steps.length

    return (
      <div className="min-h-screen bg-[#0e0e0e] font-sans text-white flex flex-col">
        <header className="shrink-0 bg-[#151515] border-b border-slate-800 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setActiveScenario(null)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to scenarios
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{activeScenario.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i < activeStep ? 'bg-indigo-500' : i === activeStep ? 'bg-indigo-400' : 'bg-slate-700'}`} />
            ))}
            <span className="text-xs text-slate-500 ml-1">{activeStep + 1}/{total}</span>
          </div>
        </header>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 grid grid-cols-5 gap-6 items-start">
          {/* Diagram panel */}
          <div className="col-span-2 bg-[#1a1a1a] rounded-2xl border border-slate-700/40 p-5 sticky top-20">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4">Ownership Structure</p>
            <OwnershipDiagram nodes={activeScenario.diagram.nodes} edges={activeScenario.diagram.edges} />
          </div>

          {/* Question panel */}
          <div className="col-span-3 space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl border border-slate-700/40 p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Question {activeStep + 1} of {total} — {step.title}</p>
              <p className="text-white font-semibold text-base leading-snug mb-5">{step.question}</p>

              <div className="space-y-2">
                {step.options.map((opt, i) => {
                  let cls = 'bg-[#232323] border-slate-700/60 text-slate-200 hover:border-indigo-500/50 hover:bg-indigo-500/10 cursor-pointer'
                  if (showFeedback) {
                    if (i === selected) cls = opt.correct ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-red-500/10 border-red-500/50 text-red-300'
                    else if (opt.correct) cls = 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400/80'
                    else cls = 'bg-[#1c1c1c] border-slate-800 text-slate-500 cursor-default'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-snug transition-all ${cls}`}
                    >
                      {opt.text}
                    </button>
                  )
                })}
              </div>

              {showFeedback && chosen && (
                <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${chosen.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
                  <p className="font-semibold mb-1">{chosen.correct ? '✓ Correct' : '✗ Incorrect'}</p>
                  {chosen.feedback}
                </div>
              )}
            </div>

            {showFeedback && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {activeStep < total - 1 ? 'Next Question →' : 'Complete Scenario ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── Scenario list view (per category + difficulty) ── */
  if (selectedCategory) {
    const cat = CATEGORIES.find((c) => c.id === selectedCategory)
    const scenarios = scenariosFor(selectedCategory, difficulty)

    return (
      <div className="min-h-screen bg-[#0e0e0e] font-sans text-white">
        <div className="px-8 pt-8 pb-4">
          <BackButton onClick={() => setSelectedCategory(null)}>Categories</BackButton>
          <h1 className="text-3xl font-bold text-white mb-1">{cat.title}</h1>
          <p className="text-slate-400 text-sm">{difficulty} · {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
          {scenarios.length === 0 && (
            <div className="bg-[#1a1a1a] border border-slate-700/40 rounded-2xl px-6 py-8 text-center col-span-2">
              <p className="text-slate-400 text-sm">No {difficulty.toLowerCase()} scenarios in this category yet — check back soon.</p>
            </div>
          )}
          {scenarios.map((s) => {
            const prog = progress[s.id]
            const inProgress = prog && !prog.completed && prog.step > 0
            const completed = prog?.completed

            return (
              <div key={s.id} className="bg-[#1a1a1a] border border-slate-700/40 rounded-2xl px-6 py-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold bg-[#2a2a2a] border border-slate-600/50 text-white px-3 py-1 rounded-full">{difficulty}</span>
                  {completed && <span className="text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full">Completed</span>}
                  {inProgress && !completed && <span className="text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full">In Progress</span>}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.shortDesc}</p>
                </div>
                <div className="flex justify-end gap-3 mt-1">
                  {inProgress && (
                    <button onClick={(e) => restart(s, e)} className="text-sm text-slate-400 hover:text-white font-medium transition-colors">Restart</button>
                  )}
                  <button
                    onClick={() => startScenario(s)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-semibold transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {completed ? 'Retake' : inProgress ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Category picker view ── */
  return (
    <div className="min-h-screen bg-[#0e0e0e] font-sans text-white">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <BackButton onClick={onBack}>Dashboard</BackButton>

        <h1 className="text-3xl font-bold text-white mb-1">Ownership Structure Simulation</h1>
        <p className="text-slate-400 text-sm">Pick a category and difficulty, then diagnose the structure.</p>
      </div>

      {/* Difficulty toggle */}
      <div className="px-8 mt-6 mb-8">
        <div className="flex items-center bg-[#1c1c1c] border border-slate-700/40 rounded-full p-1 max-w-xl">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all ${
                difficulty === d
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
        {CATEGORIES.map((cat) => {
          const scenarios = scenariosFor(cat.id, difficulty)
          const comingSoon = scenarios.length === 0

          return (
            <div
              key={cat.id}
              className={`bg-[#1a1a1a] border border-slate-700/40 rounded-2xl px-6 py-5 flex flex-col gap-5 relative ${comingSoon ? 'opacity-60' : ''}`}
            >
              {comingSoon && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold bg-[#2a2a2a] border border-slate-600/50 text-slate-400 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold bg-[#2a2a2a] border border-slate-600/50 text-white px-3 py-1 rounded-full">
                  {difficulty}
                </span>
                {!comingSoon && (
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className="w-8 h-8 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">{cat.title}</h3>
                <p className="text-slate-500 text-sm">
                  {comingSoon ? 'Coming soon' : `${scenarios.length} scenario${scenarios.length !== 1 ? 's' : ''} · click Play to start`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
