import { useState, useRef, useEffect } from 'react'

const SUGGESTED = [
  "What's included in Free vs Premium?",
  'How does the 7-day trial work?',
  'What can I use without signing up?',
  'How do I get started?',
]

const FAQS = [
  {
    keywords: ['free', 'premium', 'difference', 'plan', 'included', 'compare', 'compares', 'cost'],
    answer: "Free ($0, no card required) gets you every Analyst & MLRO training case across every industry, the Ownership Structure Simulation, the first 6 CAMS exam-prep questions in every chapter, and the AUSTRAC e-learning overview. Premium ($49.99/mo, 7-day free trial) adds the AI compliance assistant, AI-drafted AML/CTF Program and Privacy Act documents, the full CAMS question bank plus timed mock exams, the Compliance Calendar, the Client Risk Register, and unlimited questions.",
  },
  {
    keywords: ['trial', '7 day', 'seven day', 'free trial', 'card', 'credit card'],
    answer: "Premium comes with a 7-day free trial through Stripe Checkout — a card is required to start it, but you won't be charged until the trial ends. Cancel anytime before then from Account Settings and you pay nothing. After the trial it's $49.99/month.",
  },
  {
    keywords: ['no signup', 'without signing up', 'without account', 'no account', 'without registering', 'free tool', 'no sign'],
    answer: "Several tools need no signup at all: the Eligibility Check, the Privacy Act Check, the Cost Calculator, the Setup Guide, the AUSTRAC Enrolment guide, the SMR filing guide, the Compliance Officer guide, the Risk Assessment tool, the Suspicious Activity Indicators guide, and the industry Sector Guides.",
  },
  {
    keywords: ['training', 'cams', 'exam prep', 'case', 'simulation', 'module', 'question bank'],
    answer: "Every Analyst & MLRO case simulation, across Banking, Law, Crypto, Fintech, and Accountant & TCSP, is completely free. CAMS exam prep gives you the first 6 questions free in every chapter (258 questions across all 4 chapters total) — Premium unlocks the rest, plus timed, scored mock exams modelled on the real CAMS exam's length and passing benchmark.",
  },
  {
    keywords: ['ai assistant', 'chat', 'ask question', 'chatbot', 'ai chat'],
    answer: "The AI compliance assistant (Premium) gives instant, regulation-backed answers on KYC, SMRs/SARs, FATF, sanctions, AUSTRAC guidance, and more. If you've used Program Builder, it's also aware of your saved business profile, so answers can be specific to your industry and services.",
  },
  {
    keywords: ['program builder', 'aml/ctf program', 'part a', 'part b', 'draft program', 'ctf program'],
    answer: 'Program Builder (Premium) asks a few questions about your business — industry, services, staff size, client types — and drafts a first-pass AML/CTF Program (Part A and Part B). You can save it and regenerate anytime as your business changes.',
  },
  {
    keywords: ['privacy', 'privacy act', 'privacy policy', 'privacy pack', 'collection notice', 'data breach'],
    answer: "The free Privacy Act Check tells you which of the four core documents you're missing (Privacy Policy, Collection Notice, Data Breach Response Plan, Retention & Destruction Schedule). Privacy Pack (Premium) then drafts whichever ones you need.",
  },
  {
    keywords: ['mock exam', 'practice exam', 'cams exam', 'timed exam', 'pass mark', 'passing score'],
    answer: 'Premium mock exams come in two lengths: Quick (40 questions, 70 minutes) and Full-length (120 questions, 210 minutes) — modelled on the real CAMS exam\'s length and passing benchmark, with your score history saved across attempts.',
  },
  {
    keywords: ['compliance calendar', 'deadline', 'due date', 'reminder', 'annual compliance report', 'acr'],
    answer: "The Compliance Calendar (Premium) tracks your recurring AML/CTF obligations — program and risk assessment review, independent evaluation, staff training refreshers, privacy policy review, and your Annual Compliance Report due date — with at-a-glance status on what's overdue.",
  },
  {
    keywords: ['client risk', 'risk register', 'cdd', 'client review', 'client base'],
    answer: "The Client Risk Register (Premium) tracks risk ratings, CDD type, and review dates across your active client base. It's metadata only — reference labels you choose, not client names, dates of birth, or ID numbers.",
  },
  {
    keywords: ['sign up', 'get started', 'how do i start', 'begin', 'register', 'create account'],
    answer: "Click \"Sign up free\" to create an account and start on the free tier straight away — no card needed. You can upgrade to Premium and start the 7-day trial whenever you're ready.",
  },
  {
    keywords: ['cancel', 'billing', 'manage subscription', 'unsubscribe', 'refund', 'downgrade'],
    answer: 'You can manage or cancel your subscription anytime from Account Settings → Billing. Cancelling stops future charges — you keep access until the end of your current billing period.',
  },
  {
    keywords: ['legal advice', 'is this legal', 'accurate', 'guarantee', 'lawyer'],
    answer: "AmlIntel's training content and AI-drafted documents are grounded in real regulatory frameworks, but nothing on the site is legal advice. Always have a qualified professional review anything before relying on or submitting it.",
  },
  {
    keywords: ['contact', 'support', 'human', 'talk to someone', 'real person'],
    answer: "You can reach us via the Contact page — find it under \"More info\" in the top navigation.",
  },
]

function matchFaq(text) {
  const lower = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const faq of FAQS) {
    const score = faq.keywords.reduce((n, kw) => (lower.includes(kw) ? n + 1 : n), 0)
    if (score > bestScore) { bestScore = score; best = faq }
  }
  return best
}

const FALLBACK = "I don't have an answer for that — try one of the questions above, or reach us via the Contact page under \"More info\" in the top navigation."

export default function SiteHelpWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const ask = (text) => {
    const q = text.trim()
    if (!q) return
    const match = matchFaq(q)
    const answer = match?.answer || FALLBACK
    setMessages((prev) => [...prev, { role: 'user', text: q }, { role: 'bot', text: answer }])
    setInput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
      {isOpen && (
        <div className="mb-3 w-[340px] max-w-[calc(100vw-2.5rem)] h-[480px] max-h-[calc(100vh-7rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.17 0-2.29-.2-3.31-.566L3 21l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">AmlIntel Guide</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Site & plan guidance</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Got questions about how AmlIntel works? Ask about free vs Premium, the trial, or any specific feature.
                </p>
                <div className="space-y-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      className="w-full text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-slate-100 dark:border-slate-700 p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about free vs Premium..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 min-w-0"
              />
              <button type="submit" disabled={!input.trim()} className="shrink-0 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </form>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2 leading-snug">
              General guidance about AmlIntel's plans and features — not compliance or legal advice.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl flex items-center justify-center transition-colors"
        aria-label={isOpen ? 'Close help' : 'Open help'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.17 0-2.29-.2-3.31-.566L3 21l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  )
}
