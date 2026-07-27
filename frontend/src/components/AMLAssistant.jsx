import { useState, useRef, useEffect } from 'react'

const QUICK_QUESTIONS = [
  { section: 'Global AML', questions: [
    'What is AML?',
    '3 stages of money laundering',
    'What is KYC?',
    'What is a SAR?',
    'What is a CTR?',
    'AML red flags',
    'What is FATF?',
    'What is a PEP?',
    'What is structuring?',
    'Beneficial ownership',
  ]},
  { section: 'AUSTRAC Guidance', questions: [
    'What is AUSTRAC?',
    'What is the AML/CTF Act?',
    'What is an AML/CTF Program?',
    'What is an SMR?',
    'What is a TTR?',
    'What is an IFTI?',
    'What is a reporting entity?',
    'What is an EWRA?',
    'What is OCDD?',
    'Digital currency exchange AML',
    'Remittance sector obligations',
    'Tipping off prohibition',
    'AUSTRAC e-learning modules',
    'AUSTRAC enforcement actions',
    'Fintel Alliance',
  ]},
]

const WELCOME = {
  id: 0,
  role: 'assistant',
  text: `Welcome to the AML Compliance Assistant — covering global AML frameworks and AUSTRAC guidance.

GLOBAL AML:
• AML fundamentals, the 3 stages of money laundering
• KYC / CDD / EDD requirements
• SARs, CTRs, red flags, FATF, OFAC, PEPs
• Beneficial ownership, structuring, TBML

AUSTRAC & AUSTRALIAN AML/CTF:
• AML/CTF Act 2006 and AML/CTF Program (Part A & Part B)
• Suspicious Matter Reports (SMRs)
• Threshold Transaction Reports (TTRs)
• International Funds Transfer Instructions (IFTIs)
• Reporting entities, designated services, EWRA, OCDD
• Digital Currency Exchange (DCE), Remittance sector
• Tipping off prohibition, enforcement actions, Fintel Alliance
• AUSTRAC e-learning modules

Ask me anything or select a topic from the sidebar.

Disclaimer: For educational purposes only. Always consult a qualified compliance professional for legal advice.`,
}

function PremiumGate({ onBack, onSignOut, user }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Assistant is Premium</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The AI-powered AML compliance assistant is available on the Premium plan. Upgrade to get instant, regulation-backed answers on KYC, SARs, FATF, sanctions, and AUSTRAC guidance — with no daily cap.
        </p>
        <ul className="text-left space-y-3 mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          {[
            'AI Co-Pilot trained on FATF, AUSTRAC & global regulations',
            'Live transaction monitoring guidance',
            'Full SMR/SAR investigation workflow',
            'Unlimited questions — no daily cap',
            'Access to all CDD scenarios across industries',
          ].map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
              <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-colors mb-3">
          Upgrade to Premium — $49.99/mo
        </button>
        <p className="text-xs text-slate-500 mb-6">7-day free trial · cancel anytime</p>
        <div className="flex items-center justify-center gap-4">
          {onBack && (
            <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              ← Back to home
            </button>
          )}
          {onSignOut && (
            <button onClick={onSignOut} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AMLAssistant({ onBack, onSignOut, user, onOpenTraining }) {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)

  if (!user?.premium) {
    return <PremiumGate onBack={onBack} onSignOut={onSignOut} user={user} />
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: data.reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Unable to connect to the server. Please make sure the backend is running on port 3000.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !loading) sendMessage(input.trim())
  }

  const handleNewChat = () => {
    setMessages([WELCOME])
    setInput('')
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                AML
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">AML Assistant</p>
                <p className="text-xs text-slate-400">Compliance Knowledge Base</p>
              </div>
            </div>
            <button
              onClick={handleNewChat}
              className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
            >
              + New Chat
            </button>
            {onOpenTraining && (
              <button
                onClick={onOpenTraining}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors text-slate-300 mt-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Training Modules
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {QUICK_QUESTIONS.map((group) => (
              <div key={group.section}>
                <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-1">{group.section}</p>
                <div className="flex flex-col gap-0.5">
                  {group.questions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="text-left text-xs px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-slate-400">Knowledge base active</span>
            </div>
          </div>
        </aside>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="shrink-0 px-5 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
              title="Toggle sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200 text-xs"
                title="Back to home"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </button>
            )}
            <div>
              <h1 className="text-sm font-semibold">AML Compliance Assistant</h1>
              <p className="text-xs text-slate-400">Anti-Money Laundering Knowledge Base</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-600/40 flex items-center justify-center text-xs font-semibold text-blue-300">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-400 hidden sm:block">{user.name}</span>
              </div>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
                title="Sign out"
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  A
                </div>
              )}
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-800 text-slate-100 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                A
              </div>
              <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="shrink-0 px-4 pb-4 pt-3 border-t border-slate-800 bg-slate-900">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about AML compliance, KYC, SARs, FATF..."
              className="flex-1 bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none text-slate-100 placeholder-slate-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-colors"
            >
              Send
            </button>
          </form>
          <p className="text-xs text-slate-600 text-center mt-2">
            For educational purposes only — consult a qualified compliance professional for legal advice.
          </p>
        </div>
      </div>
    </div>
  )
}
