import { useState, useRef, useEffect } from 'react'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const ICONS = {
  training: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.078 12.078 0 0119 15.5v3.5M12 14l-6.16-3.42A12.078 12.078 0 005 15.5v3.5m14 0v-3.5M5 15.5v3.5M12 14v7" />
    </svg>
  ),
  settings: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  signOut: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
}

export default function ProfileMenu({
  user,
  variant = 'adaptive',
  onGoToTraining,
  onOpenSettings,
  onSignOut,
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const dark = variant === 'dark'
  const panel = dark ? 'bg-slate-900 border-slate-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
  const arrow = dark ? 'bg-slate-900 border-slate-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
  const nameText = dark ? 'text-white' : 'text-slate-900 dark:text-white'
  const mutedText = dark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
  const divider = dark ? 'border-slate-800' : 'border-slate-100 dark:border-slate-800'
  const itemClass = dark
    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'

  const item = (text, icon, onClick, danger = false) => (
    <button
      onClick={() => { setOpen(false); onClick?.() }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
        danger ? 'text-red-500 hover:bg-red-500/10' : itemClass
      }`}
    >
      {icon}
      {text}
    </button>
  )

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={user.name}
        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white text-xs font-bold transition-colors shrink-0"
      >
        {initials(user.name)}
      </button>

      {open && (
        <div className={`absolute top-full right-0 mt-3 w-64 border rounded-2xl shadow-2xl overflow-hidden ${panel}`} style={{ zIndex: 9999 }}>
          <div className={`absolute -top-2 right-2.5 w-4 h-4 border-l border-t rotate-45 ${arrow}`} />

          <div className={`relative px-4 py-3.5 border-b ${divider}`}>
            <p className={`text-sm font-semibold truncate ${nameText}`}>{user.name}</p>
            <p className={`text-xs truncate ${mutedText}`}>{user.email}</p>
          </div>

          <div className={`px-2 py-2 border-b ${divider}`}>
            {onGoToTraining && item('Go to Training', ICONS.training, onGoToTraining)}
            {item('Settings', ICONS.settings, onOpenSettings)}
          </div>

          <div className="px-2 py-2">
            {item('Sign out', ICONS.signOut, onSignOut, true)}
          </div>
        </div>
      )}
    </div>
  )
}
