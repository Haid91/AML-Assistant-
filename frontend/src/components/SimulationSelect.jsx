import ThemeToggle from './ThemeToggle'

const SIMULATIONS = [
  {
    id: 'ownership',
    name: 'Ownership Structure Simulation',
    desc: 'Map UBOs, build structures, and diagnose red flags. Earn XP and climb the leaderboard.',
    available: true,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm6-5h4m-2-2v4m2 4H10m2 2v-4" />
      </svg>
    ),
  },
  {
    id: 'more',
    name: 'More Simulations',
    desc: '',
    available: false,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
]

export default function SimulationSelect({ user, industry, onContinue }) {
  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-slate-950 font-sans flex flex-col">

      {/* Top bar */}
      <header className="px-6 py-3 flex items-center justify-end gap-3 bg-[#f0f0f0] dark:bg-slate-950">
        <span className="text-sm text-slate-700 dark:text-slate-200 font-medium border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1 rounded-full">
          {user?.role === 'mlro' ? 'MLRO Mode' : 'Analyst Mode'}
        </span>
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-300">{user.email || user.name}</span>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 flex flex-col items-center">
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">More industries coming soon</p>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select Your Simulation</h1>
          <p className="text-slate-500 dark:text-slate-400">Gamified mini-games to sharpen specific AML skills</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          {SIMULATIONS.map((sim) => (
            <div
              key={sim.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative ${
                !sim.available ? 'opacity-60' : ''
              }`}
            >
              {!sim.available && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${sim.available ? 'bg-slate-800' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {sim.icon}
              </div>
              <p className={`font-bold text-base leading-snug mb-2 ${sim.available ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {sim.name}
              </p>
              {sim.desc && (
                <p className={`text-xs leading-relaxed ${sim.available ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {sim.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="px-12 py-3.5 bg-indigo-400 hover:bg-indigo-500 text-white rounded-full font-semibold text-sm transition-colors shadow-sm"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
