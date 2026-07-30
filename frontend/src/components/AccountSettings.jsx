import { useState } from 'react'
import { API_URL } from '../config'

const TABS = [
  { id: 'profile', label: 'Personal details' },
  { id: 'password', label: 'Password' },
  { id: 'subscription', label: 'Subscription' },
]

function ProfileTab({ user, onUpdateUser }) {
  const [name, setName] = useState(user?.name || '')
  const [status, setStatus] = useState(null) // { type: 'ok'|'error', text }
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setStatus({ type: 'error', text: 'Name is required.' }); return }
    setLoading(true)
    setStatus(null)
    try {
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Something went wrong.' })
      } else {
        onUpdateUser(data.user)
        setStatus({ type: 'ok', text: 'Your details have been updated.' })
      }
    } catch {
      setStatus({ type: 'error', text: 'Unable to connect to the server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Full name</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setStatus(null) }}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email address</label>
        <input
          value={user?.email || ''}
          disabled
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed"
        />
      </div>

      {status && (
        <div className={`rounded-xl px-4 py-3 text-sm border ${
          status.type === 'ok'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400'
        }`}>
          {status.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold text-sm text-white transition-colors"
      >
        {loading ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}

function PasswordTab() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.current || !form.next) { setStatus({ type: 'error', text: 'Please fill in all fields.' }); return }
    if (form.next.length < 6) { setStatus({ type: 'error', text: 'New password must be at least 6 characters.' }); return }
    if (form.next !== form.confirm) { setStatus({ type: 'error', text: 'New passwords do not match.' }); return }
    setLoading(true)
    setStatus(null)
    try {
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Something went wrong.' })
      } else {
        setStatus({ type: 'ok', text: 'Your password has been updated.' })
        setForm({ current: '', next: '', confirm: '' })
      }
    } catch {
      setStatus({ type: 'error', text: 'Unable to connect to the server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Current password</label>
        <input
          type="password"
          name="current"
          value={form.current}
          onChange={handleChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">New password</label>
        <input
          type="password"
          name="next"
          value={form.next}
          onChange={handleChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Confirm new password</label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
        />
      </div>

      {status && (
        <div className={`rounded-xl px-4 py-3 text-sm border ${
          status.type === 'ok'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400'
        }`}>
          {status.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-semibold text-sm text-white transition-colors"
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}

function SubscriptionTab({ user, onUpgrade, onDowngrade }) {
  return (
    <div className="max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
      {user?.premium ? (
        <>
          <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wider mb-1">Current plan</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">AmlIntel Premium</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">$49.99/month · billed to {user?.email}</p>
          <button
            onClick={onDowngrade}
            className="w-full py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 transition-colors"
          >
            Cancel subscription
          </button>
        </>
      ) : (
        <>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Current plan</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">Free</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Upgrade to unlock the AI compliance co-pilot.</p>
          <button
            onClick={onUpgrade}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm text-white transition-colors"
          >
            Upgrade to Premium — $49.99/mo
          </button>
        </>
      )}
    </div>
  )
}

export default function AccountSettings({ user, initialTab = 'profile', onBack, onUpdateUser, onUpgrade, onDowngrade }) {
  const [tab, setTab] = useState(initialTab)

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <div className="px-8 py-4 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to AmlIntel
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Account settings</h1>

        <div className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-700">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && <ProfileTab user={user} onUpdateUser={onUpdateUser} />}
        {tab === 'password' && <PasswordTab />}
        {tab === 'subscription' && <SubscriptionTab user={user} onUpgrade={onUpgrade} onDowngrade={onDowngrade} />}
      </div>
    </div>
  )
}
