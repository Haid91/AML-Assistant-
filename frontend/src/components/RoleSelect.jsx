export default function RoleSelect({ user, onSelectRole }) {
  const roles = [
    {
      id: 'analyst',
      title: 'Analyst',
      desc: 'Entry-level investigator running CDD, EDD and case assessments.',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'mlro',
      title: 'MLRO',
      desc: 'Review escalated cases, sign-off decisions, SAR / DAML considerations.',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center px-6 font-sans">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
          AML
        </div>
        <span className="font-semibold text-sm text-slate-800 dark:text-white">AML Assistant</span>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choose your role</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Select how you want to sign in to AML Assistant</p>
        </div>

        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="w-full flex items-center gap-4 bg-slate-300/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/50 dark:border-slate-700 hover:border-slate-400/50 dark:hover:border-slate-600 rounded-2xl px-5 py-5 text-left transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-base leading-tight">{role.title}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5 leading-snug">{role.desc}</p>
              </div>
              <svg
                className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0 transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          You can switch roles anytime from your profile menu.
        </p>
      </div>
    </div>
  )
}
