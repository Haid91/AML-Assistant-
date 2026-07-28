import { useState } from 'react'

const TRIAL_DAYS = 7

function getTrialEndDate() {
  const d = new Date()
  d.setDate(d.getDate() + TRIAL_DAYS)
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Checkout({ user, onBack, onSuccess }) {
  const [tab, setTab] = useState('card')
  const [form, setForm] = useState({ name: user?.name || '', number: '', expiry: '', cvv: '', country: 'Australia', postcode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trialEnd = getTrialEndDate()

  const handleChange = (e) => {
    const { name, value } = e.target
    let v = value
    if (name === 'number') v = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    if (name === 'expiry') {
      v = value.replace(/\D/g, '').slice(0, 4)
      if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2)
    }
    if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 4)
    setForm((p) => ({ ...p, [name]: v }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (tab === 'card') {
      if (!form.name.trim()) { setError('Please enter the name on your card.'); return }
      if (form.number.replace(/\s/g, '').length < 16) { setError('Please enter a valid 16-digit card number.'); return }
      if (!form.expiry || form.expiry.length < 7) { setError('Please enter a valid expiry date.'); return }
      if (!form.cvv || form.cvv.length < 3) { setError('Please enter a valid CVV.'); return }
      if (!form.postcode.trim()) { setError('Please enter your postcode.'); return }
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 1800)
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
      <div className="flex-1 flex items-start justify-center px-6 py-8 gap-8 max-w-4xl mx-auto w-full">

        {/* Left — plan summary */}
        <div className="w-80 shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <p className="text-emerald-500 font-bold text-2xl mb-4">7 day free trial</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">AmlIntel Premium</p>
            <p className="text-slate-900 dark:text-white font-bold text-xl mb-1">$49.99/month</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">from {trialEnd}</p>
          </div>
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
              <span>Qty: 1</span>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total</span>
              <span className="font-semibold text-slate-900 dark:text-white">$0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Due on {trialEnd}</span>
              <span className="font-semibold text-slate-900 dark:text-white">$49.99</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">If you don't cancel anytime before then</p>
          </div>
          <div className="px-6 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4">
            <p className="text-xs text-slate-400 dark:text-slate-500">{user?.email}</p>
          </div>
        </div>

        {/* Right — payment form */}
        <div className="flex-1 min-w-0">

          {/* Payment method tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setTab('card')}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all ${
                tab === 'card' ? 'border-emerald-500 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Card</span>
            </button>
            <button
              onClick={() => setTab('paypal')}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all ${
                tab === 'paypal' ? 'border-emerald-500 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 21H4L6 9h5.5c2.5 0 4.5 1.5 4 4.5C14.8 17.5 11.5 21 7.5 21z" fill="#003087"/>
                <path d="M10 16H6.5L8 9h4c2 0 3.5 1 3 3.5C14.5 15 12 16 10 16z" fill="#009cde"/>
              </svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">PayPal</span>
            </button>
          </div>

          {tab === 'paypal' ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">You will be redirected to PayPal to complete your payment.</p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Processing…' : 'Continue to PayPal'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name on card */}
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1.5">Name on card</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Card details */}
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1.5">Card details</label>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-emerald-400 transition-colors">
                  <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <input
                      name="number"
                      value={form.number}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pr-32"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">VISA</span>
                      <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">MC</span>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">AMEX</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <input
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="MM / YY"
                      className="px-4 py-3 text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-r border-slate-100 dark:border-slate-700"
                    />
                    <input
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      placeholder="CVV"
                      className="px-4 py-3 text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Country & Postcode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1.5">Country</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white transition-colors"
                  >
                    {['Australia', 'New Zealand', 'United Kingdom', 'United States', 'Canada', 'Singapore', 'Hong Kong'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1.5">Postcode</label>
                  <input
                    name="postcode"
                    value={form.postcode}
                    onChange={handleChange}
                    placeholder="2000"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500">We collect this information to prevent fraud and secure your payment.</p>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors"
              >
                {loading ? 'Processing…' : 'Start your free trial'}
              </button>

              <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                7-day free trial, then $49.99/month from {trialEnd}. Cancel anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
