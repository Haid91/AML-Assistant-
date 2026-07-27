import ThemeToggle from './ThemeToggle'

const INDUSTRIES = [
  {
    id: 'banking',
    name: 'Banking',
    desc: 'Retail and corporate banking CDD, EDD, and transaction monitoring.',
    available: true,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'law',
    name: 'Law',
    desc: 'SRA-regulated legal practice AML obligations and client due diligence.',
    available: true,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    id: 'crypto',
    name: 'Crypto',
    desc: 'Digital platforms, wallets, merchant DD, crypto ramps, and payment flows.',
    available: true,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'fintech',
    name: 'Fintech',
    desc: 'EMI / PSP onboarding, e-wallet top-ups, card spend and payment flow monitoring.',
    available: true,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'gambling',
    name: 'Gambling',
    desc: 'Player risk assessment, affordability checks, and behavioural analysis.',
    available: false,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'wealth',
    name: 'Wealth Management',
    desc: 'High-net-worth client onboarding and complex structures.',
    available: false,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'accountant',
    name: 'Accountant / TCSPs',
    desc: 'Trust and company service provider AML controls.',
    available: false,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'msb',
    name: 'MSBs',
    desc: 'Money service business compliance and agent oversight.',
    available: false,
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function IndustrySelect({ user, onSelect }) {
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

      {/* Banner */}
      <div className="bg-slate-300/60 dark:bg-slate-700/60 py-2.5 text-center">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Risk-Based AML Judgement &nbsp;·&nbsp; Training Simulation
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select Your Investigation</h1>
          <p className="text-slate-500 dark:text-slate-400">Choose an industry and complete a realistic AML case simulation</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => ind.available && onSelect(ind.id)}
              disabled={!ind.available}
              className={`relative text-left bg-white dark:bg-slate-800 rounded-2xl p-6 border transition-all ${
                ind.available
                  ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md cursor-pointer'
                  : 'border-slate-200 dark:border-slate-700 opacity-60 cursor-default'
              }`}
            >
              {!ind.available && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${ind.available ? 'bg-slate-800' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {ind.icon}
              </div>
              <p className={`font-bold text-base mb-1.5 ${ind.available ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>{ind.name}</p>
              <p className={`text-xs leading-relaxed ${ind.available ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>{ind.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
