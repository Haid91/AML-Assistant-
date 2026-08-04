import { useState } from 'react'
import { Send } from 'lucide-react'
import { API_URL } from '../config'
import Navbar from './Navbar'

const CONTACT_EMAIL = 'support@amlintel.com.au'

export default function Contact({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sendState, setSendState] = useState('idle') // idle | loading | sent | error
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('Please fill in all fields.')
      return
    }
    setSendState('loading')
    setError('')
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setSendState('error')
        return
      }
      setSendState('sent')
    } catch {
      setError('Unable to connect to the server. Please try again.')
      setSendState('error')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Navbar
        user={user}
        onGoHome={onGoHome}
        onNavigateSection={onNavigateSection}
        onStart={onStart}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onOpenChat={onOpenChat}
        onOpenTraining={onOpenTraining}
        onSignOut={onSignOut}
        onOpenSettings={onOpenSettings}
        onOpenAbout={onOpenAbout}
        onOpenCost={onOpenCost}
        onOpenSetupGuide={onOpenSetupGuide}
        onOpenEligibility={onOpenEligibility}
        onOpenProgramBuilder={onOpenProgramBuilder}
        onOpenAustracEnrolment={onOpenAustracEnrolment}
        onOpenSmrGuide={onOpenSmrGuide}
        onOpenComplianceOfficer={onOpenComplianceOfficer}
        onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators}
      />

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-3">Contact us</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in touch</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10">
            Have a question about AML/CTF compliance or AmlIntel? We're here to help. Send us a message and we'll respond within 1 business day.
          </p>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm mb-0.5">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-orange-600 dark:text-orange-400 hover:underline">{CONTACT_EMAIL}</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 5.108-3.867 9.28-9 9.28S3 17.108 3 12s3.867-9.28 9-9.28 9 4.172 9 9.28z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm mb-0.5">Free eligibility check</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Not sure if you need AML/CTF compliance?{' '}
                <button onClick={onOpenEligibility} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Check for free</button>
                {' '}— no login required.
              </p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          {sendState === 'sent' ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold mb-1.5">Message sent</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Thanks for reaching out — we'll get back to you within 1 business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your name"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  placeholder="e.g. Question about Tranche 2 compliance"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={handleChange('message')}
                  placeholder="Tell us how we can help…"
                  rows={5}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sendState === 'loading'}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sendState === 'loading' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
