import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../config'
import { CAMS_MODULES, seededShuffle } from './Training'

const FORMATS = {
  quick: { key: 'quick', label: 'Quick Mock', questionsPerChapter: 10, durationMinutes: 70 },
  full: { key: 'full', label: 'Full-Length Mock Exam', questionsPerChapter: 30, durationMinutes: 210 },
}

// ACAMS' own certification page states the CAMS exam is 120 questions / 210
// minutes with a passing scaled score of 75, commonly expressed as ~62.5%
// raw-correct — that benchmark is mirrored here, independently verified,
// not asserted to be an official ACAMS product or affiliated with ACAMS.
const PASS_THRESHOLD = 0.625

function buildExamQuestions(formatKey, seed) {
  const format = FORMATS[formatKey]
  const pool = []
  CAMS_MODULES.forEach((chapter) => {
    const shuffledSteps = seededShuffle(chapter.steps, `${seed}::${chapter.id}`)
    shuffledSteps.slice(0, format.questionsPerChapter).forEach((step) => {
      const options = seededShuffle(step.options, `${seed}::${chapter.id}::${step.id}`)
      pool.push({
        id: `${chapter.id}-${step.id}`,
        chapterId: chapter.id,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        title: step.title,
        question: step.question,
        options,
      })
    })
  })
  return seededShuffle(pool, `${seed}::order`)
}

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

function BackButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </button>
  )
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}

export default function CamsMockExam({ user, onBack, onUpgrade }) {
  const [phase, setPhase] = useState('checking') // checking | signin | paywall | intro | exam | results
  const [attempts, setAttempts] = useState([])
  const [formatKey, setFormatKey] = useState('full')
  const [examSeed, setExamSeed] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [result, setResult] = useState(null)
  const [reviewFilter, setReviewFilter] = useState('incorrect')
  const submittedRef = useRef(false)

  const storageKey = `aml_mock_exam_${user?.id || 'guest'}`

  useEffect(() => {
    if (!user) { setPhase('signin'); return }
    if (!user.premium) { setPhase('paywall'); return }

    const token = localStorage.getItem('aml_token')
    fetch(`${API_URL}/mock-exam-attempts`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setAttempts(data.attempts || []))
      .catch(() => {})
      .finally(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            const durationMs = FORMATS[parsed.formatKey].durationMinutes * 60000
            if (Date.now() - parsed.startedAt < durationMs) {
              setFormatKey(parsed.formatKey)
              setExamSeed(parsed.seed)
              setQuestions(buildExamQuestions(parsed.formatKey, parsed.seed))
              setAnswers(parsed.answers || {})
              setFlagged(parsed.flagged || {})
              setStartedAt(parsed.startedAt)
              setCurrentIndex(parsed.currentIndex || 0)
              submittedRef.current = false
              setPhase('exam')
              return
            }
            localStorage.removeItem(storageKey)
          } catch { localStorage.removeItem(storageKey) }
        }
        setPhase('intro')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.premium])

  useEffect(() => {
    if (phase !== 'exam') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'exam' || !startedAt) return
    localStorage.setItem(storageKey, JSON.stringify({ formatKey, seed: examSeed, startedAt, answers, flagged, currentIndex }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, formatKey, examSeed, startedAt, answers, flagged, currentIndex])

  const durationMs = FORMATS[formatKey].durationMinutes * 60000
  const remainingMs = startedAt ? Math.max(0, durationMs - (now - startedAt)) : durationMs

  const computeResults = () => {
    let score = 0
    const chapterBreakdown = {}
    questions.forEach((q, i) => {
      const chosenIdx = answers[i]
      const chosenOpt = chosenIdx != null ? q.options[chosenIdx] : null
      const correct = !!chosenOpt?.correct
      if (correct) score++
      if (!chapterBreakdown[q.chapterId]) chapterBreakdown[q.chapterId] = { title: q.chapterTitle, number: q.chapterNumber, correct: 0, total: 0 }
      chapterBreakdown[q.chapterId].total++
      if (correct) chapterBreakdown[q.chapterId].correct++
    })
    const total = questions.length
    const passed = total > 0 && score / total >= PASS_THRESHOLD
    return { score, total, passed, chapterBreakdown }
  }

  const handleSubmit = async () => {
    if (submittedRef.current) return
    submittedRef.current = true
    const res = computeResults()
    setResult(res)
    setPhase('results')
    localStorage.removeItem(storageKey)
    try {
      const token = localStorage.getItem('aml_token')
      await fetch(`${API_URL}/mock-exam-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score: res.score, total: res.total, chapterBreakdown: res.chapterBreakdown }),
      })
      const r2 = await fetch(`${API_URL}/mock-exam-attempts`, { headers: { Authorization: `Bearer ${token}` } })
      const d2 = await r2.json()
      setAttempts(d2.attempts || [])
    } catch { /* attempt still shown locally even if save fails */ }
  }

  useEffect(() => {
    if (phase === 'exam' && remainingMs <= 0) handleSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, phase])

  const startExam = (key) => {
    const seed = crypto.randomUUID()
    setFormatKey(key)
    setExamSeed(seed)
    setQuestions(buildExamQuestions(key, seed))
    setAnswers({})
    setFlagged({})
    setCurrentIndex(0)
    setStartedAt(Date.now())
    setResult(null)
    setReviewFilter('incorrect')
    submittedRef.current = false
    setPhase('exam')
  }

  const selectAnswer = (optIndex) => setAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }))
  const toggleFlag = () => setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }))
  const answeredCount = Object.keys(answers).length

  /* ── Checking ── */
  if (phase === 'checking') return <Shell><div /></Shell>

  /* ── Sign in / paywall ── */
  if (phase === 'signin') {
    return (
      <Shell>
        <BackButton onClick={onBack}>Back to Training</BackButton>
        <div className="max-w-md mx-auto text-center pt-16">
          <h1 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Sign up to take the Mock Exam</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Timed, scored CAMS practice exams are available on Premium.</p>
        </div>
      </Shell>
    )
  }

  if (phase === 'paywall') {
    return (
      <Shell>
        <BackButton onClick={onBack}>Back to Training</BackButton>
        <div className="max-w-md mx-auto text-center pt-16">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Mock Exam is Premium</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Timed, scored practice exams modelled on the real CAMS exam's length and passing benchmark — Quick (40 questions) or Full-length (120 questions), with score history across every attempt.
          </p>
          <button onClick={onUpgrade} className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors">
            Upgrade to Premium — $49.99/mo
          </button>
        </div>
      </Shell>
    )
  }

  /* ── Intro / format selection ── */
  if (phase === 'intro') {
    const best = attempts.reduce((m, a) => Math.max(m, a.total ? Math.round((a.score / a.total) * 100) : 0), 0)
    return (
      <Shell>
        <BackButton onClick={onBack}>Back to Training</BackButton>
        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-white">CAMS Mock Exam</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Modelled on the real CAMS exam's length, timing, and passing benchmark (120 questions / 210 minutes / ~62.5% to pass) — not an official ACAMS product, and not affiliated with or endorsed by ACAMS.
          </p>
        </div>

        {attempts.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-8 flex flex-wrap items-center gap-6 justify-center text-center">
            <div>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{best}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Best score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{attempts.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attempts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{new Date(attempts[0].createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last attempt</p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {Object.values(FORMATS).map((f) => (
            <div key={f.key} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col">
              <p className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{f.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {f.questionsPerChapter * 4} questions · {f.durationMinutes} minutes
              </p>
              <button
                onClick={() => startExam(f.key)}
                className="mt-auto py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                Begin →
              </button>
            </div>
          ))}
        </div>
      </Shell>
    )
  }

  /* ── Exam-taking ── */
  if (phase === 'exam' && questions.length > 0) {
    const q = questions[currentIndex]
    const chosen = answers[currentIndex]
    const isFlagged = !!flagged[currentIndex]
    const low = remainingMs < 5 * 60 * 1000

    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans flex flex-col">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center gap-4 sticky top-0 z-10 flex-wrap">
          <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">{FORMATS[formatKey].label}</p>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 shrink-0" />
          <p className="text-sm text-slate-500 dark:text-slate-400 shrink-0">{answeredCount} of {questions.length} answered</p>
          <div className={`ml-auto flex items-center gap-1.5 text-sm font-mono font-semibold shrink-0 ${low ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
            {formatTime(remainingMs / 1000)}
          </div>
          <button
            onClick={() => (answeredCount < questions.length ? setShowSubmitConfirm(true) : handleSubmit())}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            Submit Exam
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-6 w-full flex-1">
          {/* Question navigator */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {questions.map((_, i) => {
              const state = i === currentIndex ? 'current' : flagged[i] ? 'flagged' : answers[i] != null ? 'answered' : 'unanswered'
              const cls = {
                current: 'bg-violet-600 text-white ring-2 ring-violet-400 ring-offset-1 dark:ring-offset-slate-900',
                flagged: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700',
                answered: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
                unanswered: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700',
              }[state]
              return (
                <button key={q.id + i} onClick={() => setCurrentIndex(i)} className={`w-8 h-8 rounded-lg text-[11px] font-semibold transition-colors ${cls}`}>
                  {i + 1}
                </button>
              )
            })}
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                Question {currentIndex + 1} of {questions.length} · {q.chapterNumber}
              </span>
              <button onClick={toggleFlag} className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isFlagged ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                <svg className="w-3.5 h-3.5" fill={isFlagged ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18M3 4h13l-2 4 2 4H3" />
                </svg>
                {isFlagged ? 'Flagged' : 'Flag for review'}
              </button>
            </div>

            <p className="text-slate-900 dark:text-white font-medium mb-6 leading-relaxed">{q.question}</p>

            <div className="space-y-2.5 mb-8">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  data-testid="exam-option"
                  onClick={() => selectAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-relaxed transition-colors ${
                    chosen === i
                      ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-20">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
              <p className="font-bold text-slate-900 dark:text-white mb-2">
                {questions.length - answeredCount} question{questions.length - answeredCount === 1 ? '' : 's'} unanswered
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Unanswered questions will be marked incorrect. Submit anyway?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Keep going
                </button>
                <button onClick={() => { setShowSubmitConfirm(false); handleSubmit() }} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  /* ── Results ── */
  if (phase === 'results' && result) {
    const pct = Math.round((result.score / result.total) * 100)
    const reviewQuestions = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q, i }) => reviewFilter === 'all' || !q.options[answers[i]]?.correct)

    return (
      <Shell>
        <BackButton onClick={onBack}>Back to Training</BackButton>

        <div className={`rounded-3xl p-8 md:p-10 text-center mb-8 mt-4 ${result.passed ? 'bg-emerald-600' : 'bg-slate-800'}`}>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">{FORMATS[formatKey].label}</p>
          <p className="text-5xl font-bold text-white mb-2">{pct}%</p>
          <p className="text-white/90 font-semibold mb-1">{result.score} of {result.total} correct</p>
          <p className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold ${result.passed ? 'bg-white text-emerald-700' : 'bg-white/10 text-white border border-white/30'}`}>
            {result.passed ? 'PASS' : 'BELOW PASS MARK'}
          </p>
          <p className="text-white/60 text-xs mt-4">Practice benchmark only — modelled on ACAMS' ~62.5% passing mark, not a guarantee of real exam grading.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.values(result.chapterBreakdown).map((c) => (
            <div key={c.number} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">{c.number}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2 leading-snug">{c.title}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{c.correct}/{c.total}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <button onClick={() => startExam(formatKey)} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-colors">
            Retake →
          </button>
          <button onClick={() => setPhase('intro')} className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Choose a different format
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Question review</h2>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            {['incorrect', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setReviewFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${reviewFilter === f ? 'bg-violet-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {f === 'incorrect' ? 'Incorrect only' : 'All questions'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-10">
          {reviewQuestions.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Nothing to review — every question was answered correctly.</p>
          ) : (
            reviewQuestions.map(({ q, i }) => {
              const chosenIdx = answers[i]
              const chosenOpt = chosenIdx != null ? q.options[chosenIdx] : null
              const correctOpt = q.options.find((o) => o.correct)
              return (
                <div key={q.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Question {i + 1} · {q.chapterNumber}</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-3 leading-relaxed">{q.question}</p>
                  {chosenOpt ? (
                    <p className={`text-sm mb-2 ${chosenOpt.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      Your answer: {chosenOpt.text}
                    </p>
                  ) : (
                    <p className="text-sm mb-2 text-red-600 dark:text-red-400">Not answered</p>
                  )}
                  {!chosenOpt?.correct && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">Correct answer: {correctOpt?.text}</p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
                    {correctOpt?.feedback}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </Shell>
    )
  }

  return <Shell><div /></Shell>
}
