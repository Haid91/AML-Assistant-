import { useState } from 'react'
import { API_URL } from '../config'

const TRIAL_DAYS = 7

const PLANS = {
  premium: { name: 'AmlIntel Premium', price: 49.99 },
  professional: { name: 'AmlIntel Professional', price: 69.99 },
}

function getTrialEndDate() {
  const d = new Date()
  d.setDate(d.getDate() + TRIAL_DAYS)
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Checkout({ user, plan, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trialEnd = getTrialEndDate()
  const { name: planName, price: planPrice } = PLANS[plan] || PLANS.premium

  const handleContinue = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan: PLANS[plan] ? plan : 'premium' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans flex flex-col">

      {/* Top bar */}
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

      {/* Main layout */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <p className="text-emerald-500 font-bold text-2xl mb-4">7 day free trial</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{planName}</p>
            <p className="text-slate-900 dark:text-white font-bold text-xl mb-1">${planPrice.toFixed(2)}/month</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">from {trialEnd}</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Due today</span>
              <span className="font-semibold text-slate-900 dark:text-white">$0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Due on {trialEnd}</span>
              <span className="font-semibold text-slate-900 dark:text-white">${planPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">If you don't cancel anytime before then</p>
          </div>
          <div className="px-6 pb-6">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4">{error}</p>
            )}
            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors"
            >
              {loading ? 'Redirecting…' : 'Continue to secure checkout'}
            </button>
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
              You'll enter your card details on Stripe's secure checkout page. 7-day free trial, then ${planPrice.toFixed(2)}/month from {trialEnd}. Cancel anytime.
            </p>
          </div>
          <div className="px-6 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4">
            <p className="text-xs text-slate-400 dark:text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
