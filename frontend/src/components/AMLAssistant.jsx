import { useState, useRef, useEffect } from 'react'
import Navbar from './Navbar'
import { API_URL } from '../config'

const SUGGESTIONS = [
  'Explain the difference between Source of Funds and Source of Wealth.',
  'What are the FATF requirements for verifying beneficial ownership?',
  'List the typical red flags for trade-based money laundering.',
  'Help me draft an SMR/SAR narrative for a structuring case.',
]

function PremiumGate({ onBack, onSignOut, onUpgrade }) {
  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">AI Assistant is Premium</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          The AI-powered AML compliance assistant is available on the Premium plan. Upgrade to get instant, regulation-backed answers on KYC, SMRs/SARs, FATF, sanctions, and AUSTRAC guidance.
        </p>
        <ul className="text-left space-y-3 mb-8 bg-white border border-slate-200 rounded-2xl p-5">
          {[
            'AI Co-Pilot trained on FATF, AUSTRAC & global regulations',
            'AI Live Transaction Monitoring guidance',
            'Full SMR/SAR investigation workflow',
            'Access to all CDD scenarios across industries',
            'Personalised FATF & AUSTRAC compliance mapping',
            'Unlimited questions — no daily cap',
          ].map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
              <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <button onClick={onUpgrade} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-colors mb-3">
          Upgrade to Premium — $49.99/mo
        </button>
        <p className="text-xs text-slate-400 mb-6">7-day free trial · cancel anytime</p>
        <div className="flex items-center justify-center gap-4">
          {onBack && <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">← Back to home</button>}
          {onSignOut && <button onClick={onSignOut} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Sign out</button>}
        </div>
      </div>
    </div>
  )
}

function newSession() {
  return { id: crypto.randomUUID(), title: 'New Chat', messages: [], createdAt: Date.now() }
}

function sessionTitle(session) {
  const first = session.messages.find((m) => m.role === 'user')
  if (!first) return 'New Chat'
  return first.text.length > 40 ? first.text.slice(0, 40) + '…' : first.text
}

function groupSessions(sessions) {
  const now = Date.now()
  const today = [], yesterday = [], older = []
  for (const s of sessions) {
    const age = now - s.createdAt
    if (age < 86400000) today.push(s)
    else if (age < 172800000) yesterday.push(s)
    else older.push(s)
  }
  return { today, yesterday, older }
}

export default function AMLAssistant({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onOpenSuspiciousIndicators, onOpenPrivacyCheck, onOpenComplianceCalendar, onOpenClientRiskRegister, onUpgrade }) {
  const storageKey = `aml_chats_${user?.id || 'guest'}`

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    return [newSession()]
  })
  const [currentId, setCurrentId] = useState(() => sessions[0]?.id)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const currentSession = sessions.find((s) => s.id === currentId) || sessions[0]
  const messages = currentSession?.messages || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sessions))
  }, [sessions])

  if (!user?.premium) {
    return <PremiumGate onBack={onGoHome} onSignOut={onSignOut} onUpgrade={onUpgrade} />
  }

  const updateSession = (id, msgs) => {
    setSessions((prev) =>
      prev.map((s) => s.id === id ? { ...s, messages: msgs, title: sessionTitle({ ...s, messages: msgs }) } : s)
    )
  }

  const sendToAPI = async (text, msgs, sessionId) => {
    try {
      const history = msgs.map((m) => ({ role: m.role, text: m.text }))
      const token = localStorage.getItem('aml_token')
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      const replyText = res.ok ? data.reply : (data.error || 'Something went wrong. Please try again.')
      const reply = { id: Date.now() + 1, role: 'assistant', text: replyText }
      const next = [...msgs, reply]
      updateSession(sessionId, next)
    } catch {
      const errMsg = { id: Date.now() + 1, role: 'assistant', text: 'Unable to connect to the server. Please make sure the backend is running.' }
      updateSession(sessionId, [...msgs, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = (text) => {
    if (!text.trim() || loading) return
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() }
    const next = [...messages, userMsg]
    updateSession(currentId, next)
    setInput('')
    setLoading(true)
    sendToAPI(text.trim(), next, currentId)
    inputRef.current?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleNewChat = () => {
    const s = newSession()
    setSessions((prev) => [s, ...prev])
    setCurrentId(s.id)
    setInput('')
    inputRef.current?.focus()
  }

  const handleSelectSession = (id) => {
    setCurrentId(id)
    setInput('')
  }

  const handleDeleteSession = (e, id) => {
    e.stopPropagation()
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (next.length === 0) {
        const fresh = newSession()
        setCurrentId(fresh.id)
        return [fresh]
      }
      if (id === currentId) setCurrentId(next[0].id)
      return next
    })
  }

  const roleLabel = user?.role === 'mlro' ? 'MLRO Mode' : 'Analyst Mode'
  const { today, yesterday, older } = groupSessions(sessions)

  return (
    <div className="flex flex-col h-screen bg-[#f0f0f0] dark:bg-slate-950 font-sans overflow-hidden transition-colors">
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
        onOpenContact={onOpenContact}
        onOpenCost={onOpenCost}
        onOpenSetupGuide={onOpenSetupGuide}
        onOpenEligibility={onOpenEligibility}
        onOpenProgramBuilder={onOpenProgramBuilder}
        onOpenAustracEnrolment={onOpenAustracEnrolment}
        onOpenSmrGuide={onOpenSmrGuide}
        onOpenComplianceOfficer={onOpenComplianceOfficer}
        onOpenRiskAssessment={onOpenRiskAssessment}
        onOpenSuspiciousIndicators={onOpenSuspiciousIndicators}
        onOpenPrivacyCheck={onOpenPrivacyCheck}
        onOpenComplianceCalendar={onOpenComplianceCalendar}
        onOpenClientRiskRegister={onOpenClientRiskRegister}
      />

      <div className="flex flex-1 min-h-0">

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Chats</p>
            <button onClick={() => setSidebarOpen(false)} className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          <div className="px-3 pt-3 pb-2">
            <button onClick={handleNewChat} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium transition-colors border border-indigo-200 dark:border-indigo-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {[{ label: 'Today', items: today }, { label: 'Yesterday', items: yesterday }, { label: 'Older', items: older }].map(({ label, items }) =>
              items.length > 0 ? (
                <div key={label} className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1.5">{label}</p>
                  {items.map((s) => (
                    <div key={s.id} onClick={() => handleSelectSession(s.id)}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors mb-0.5 ${
                        s.id === currentId
                          ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      <span className="text-xs flex-1 truncate">{sessionTitle(s)}</span>
                      <button onClick={(e) => handleDeleteSession(e, s.id)} className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded text-slate-400 hover:text-red-500 transition-all shrink-0">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </div>

          <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 px-2">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        <header className="shrink-0 bg-[#f0f0f0] dark:bg-slate-950 px-5 py-3 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            )}
          </div>

          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 rounded-full">
            {roleLabel}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l1.5 1.5M12 2v2M19 3l-1.5 1.5M2 12h2M20 12h2M5 21l1.5-1.5M12 20v2M19 21l-1.5-1.5M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">AmlIntel</h1>
              <p className="text-[10px] text-slate-400 mb-3 tracking-wide">Powered by Anthropic</p>
              <p className="text-slate-500 dark:text-slate-400 text-center text-base leading-relaxed mb-10 max-w-sm">
                Specialised in FATF, FIU and global regulatory requirements. Ask anything AML, KYC or sanctions related.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-10">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} disabled={loading}
                    className="text-left px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-all shadow-sm leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Co-Pilot provides regulatory training guidance, not legal advice.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l1.5 1.5M12 2v2M19 3l-1.5 1.5M2 12h2M20 12h2M5 21l1.5-1.5M12 20v2M19 21l-1.5-1.5M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l1.5 1.5M12 2v2M19 3l-1.5 1.5M2 12h2M20 12h2M5 21l1.5-1.5M12 20v2M19 21l-1.5-1.5M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                      <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="shrink-0 px-4 pb-5 pt-3">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm px-4 py-3 gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about FATF, KYC, sanctions, SMR/SAR drafting..."
                className="flex-1 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none bg-transparent"
                disabled={loading}
              />
              <button type="button" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
              <button type="submit" disabled={!input.trim() || loading}
                className="shrink-0 w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}
