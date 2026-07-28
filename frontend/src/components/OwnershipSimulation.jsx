import { useState } from 'react'

const CATEGORIES = [
  { id: 'trusts',     title: 'Trusts' },
  { id: 'funds',      title: 'Funds & Listed' },
  { id: 'ltd',        title: 'Ltd / LLC / Holdcos' },
  { id: 'charities',  title: 'Charities & HNWI' },
]

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

export default function OwnershipSimulation({ user, onBack }) {
  const [difficulty, setDifficulty] = useState('Beginner')

  return (
    <div className="min-h-screen bg-[#0e0e0e] font-sans text-white">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-1">Ownership Structure Simulation</h1>
        <p className="text-slate-400 text-sm">Pick a category and difficulty. 15 scenarios each.</p>
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
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#1a1a1a] border border-slate-700/40 rounded-2xl px-6 py-5 flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold bg-[#2a2a2a] border border-slate-600/50 text-white px-3 py-1 rounded-full">
                {difficulty}
              </span>
              <button className="w-8 h-8 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1.5">{cat.title}</h3>
              <p className="text-slate-500 text-sm">15 scenarios · click Play to start</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
