import { useState, useEffect, useRef } from "react";

// ---------- Claude API helpers ----------
// Calls our own backend, which holds the Anthropic API key server-side and
// forwards the request — the browser never sees the key.
async function askClaude(messages, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1500,
          messages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      if (text) return text;
    } catch (e) {
      if (attempt === maxRetries) throw e;
    }
  }
  throw new Error("No response");
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  return JSON.parse(clean.slice(start, end + 1));
}

// ---------- Config ----------
const SECTORS = [
  { id: "banking", label: "Retail banking", note: "Accounts, cards, mule networks" },
  { id: "gambling", label: "Pubs, clubs & casinos", note: "EGMs, chip cashing, TITO" },
  { id: "remittance", label: "Remittance & fintech", note: "Cross-border, structuring" },
  { id: "tranche2", label: "Legal & real estate (Tranche 2)", note: "Trust accounts, property" },
];

const LEVELS = [
  { id: "analyst", label: "Analyst", note: "Clearer indicators" },
  { id: "senior", label: "Senior analyst", note: "Mixed signals, red herrings" },
  { id: "mlro", label: "MLRO delegate", note: "Ambiguous, defensible-call cases" },
];

const DECISIONS = [
  { id: "nfa", label: "No further action", desc: "Activity explained, close the alert" },
  { id: "monitor", label: "Continue monitoring", desc: "Not reportable yet, set review" },
  { id: "smr", label: "File SMR", desc: "Suspicion formed — draft the narrative" },
];

const MAX_QUESTIONS = 5;

// Typology pools per sector — a random pick per case prevents repetitive scenarios
const TYPOLOGIES = {
  banking: [
    "structuring cash deposits below the $10k TTR threshold",
    "money mule account receiving and rapidly forwarding scam proceeds",
    "cuckoo smurfing via third-party cash deposits matching expected remittances",
    "invoice fraud / business email compromise proceeds through a business account",
    "sudden high-value activity inconsistent with a low-income profile",
    "rapid movement of funds through newly opened accounts (pass-through)",
  ],
  gambling: [
    "loading EGMs with cash and cashing out with minimal play (cleansing)",
    "chip purchases with cash and redemption by cheque with little gambling",
    "third parties collecting winnings on behalf of the actual gambler",
    "structuring buy-ins across multiple visits or venues",
    "refining — exchanging small denominations for large via gaming activity",
  ],
  remittance: [
    "structuring international transfers across multiple days or senders",
    "fan-out remittances to many unrelated beneficiaries in high-risk corridors",
    "trade-based value transfer with invoices inconsistent with goods",
    "use of multiple sender identities with shared contact details",
    "offsetting / hawala-style settlement patterns",
  ],
  tranche2: [
    "unexplained third-party funds passing through a solicitor's trust account",
    "property purchase with layered deposits from unrelated accounts",
    "rapid resale of property at a loss with no commercial rationale",
    "client refusing source-of-funds evidence for a large conveyancing deposit",
    "use of a company or trust structure obscuring the beneficial owner of a purchase",
  ],
};

// Probability the case is actually legitimate (false positive), by difficulty
const FP_RATE = { analyst: 0.2, senior: 0.35, mlro: 0.45 };

// ---------- Prompts ----------
function casePrompt(sector, level, typology, isLegit) {
  const ambiguity = {
    analyst: "Indicators should be reasonably clear once the analyst looks at the pattern. 1 mild red herring at most.",
    senior: "Mix genuine indicators with 1-2 plausible red herrings (e.g. a cash-intensive but legitimate occupation). The pattern should require joining 2+ data points.",
    mlro: "Make it a defensible-call case: the visible data alone should NOT settle it. The deciding evidence must only be reachable through well-targeted enquiries. Include competing innocent and suspicious explanations.",
  }[level.id];

  return `You are the scenario engine for an Australian AML/CTF investigation training simulator used by financial crime analysts. Generate ONE realistic training case.

Sector: ${sector.label}. Difficulty: ${level.label}.

${isLegit
  ? `GROUND TRUTH FOR THIS CASE: the activity is LEGITIMATE. It should superficially resemble "${typology}" (which is why the alert fired), but a genuine innocent explanation exists and must be discoverable through good enquiries (e.g. verifiable business income, documented inheritance, expected remittance pattern, genuine gambling win). Set hiddenGroundTruth.isSuspicious to false.`
  : `GROUND TRUTH FOR THIS CASE: the activity IS suspicious. Typology: "${typology}". Set hiddenGroundTruth.isSuspicious to true.`}

Ambiguity calibration: ${ambiguity}

Rules:
- Australian context: AUD, Australian suburbs, fictional entity names, AUSTRAC/SMR framing.
- The alertReason must be plausible from the visible transactions alone — a transaction monitoring system could realistically have fired on it.
- Amounts, dates, and references must be internally consistent, in date order, and quantitatively consistent with the typology (e.g. structuring amounts sit just under $10,000; pass-through debits shortly follow credits).
- Fictional people and businesses only. Educational red-flag level detail only — show what an analyst would see in the data, never operational laundering instructions.
- Vary names, suburbs, and amounts freely so repeated cases feel distinct. Variety seed: ${Math.floor(Math.random() * 100000)}.

Respond with ONLY a JSON object, no markdown fences, no preamble:
{
  "caseRef": "e.g. FCU-2026-XXXX",
  "title": "short case title",
  "alertReason": "why the alert fired (1-2 sentences)",
  "customer": { "name": "", "type": "individual|business", "occupation": "", "tenure": "", "profileNotes": "2-3 sentences of KYC profile" },
  "transactions": [ { "date": "DD Mon", "desc": "", "channel": "", "amount": "e.g. +$9,500" } ],
  "hiddenGroundTruth": { "isSuspicious": true/false, "typology": "name or 'none — legitimate'", "explanation": "what is actually going on, 2-3 sentences" }
}
Include 6-10 transactions. Make hiddenGroundTruth consistent with the visible data.`;
}

function answerPrompt(caseData, history, question) {
  return `You are simulating an Australian bank's internal systems and staff for AML investigation training. The trainee analyst is investigating this case:

${JSON.stringify({ ...caseData, hiddenGroundTruth: caseData.hiddenGroundTruth })}

Prior information requests and responses:
${history.map((h) => `Q: ${h.q}\nA: ${h.a}`).join("\n") || "(none)"}

The analyst now requests: "${question}"

Respond in character as the relevant source (branch notes, CDD file, open-source check, account history, venue CCTV log, etc.). 2-5 sentences, factual tone. Reveal information consistent with hiddenGroundTruth — helpful questions get genuinely useful answers; vague questions get limited answers. Never reveal hiddenGroundTruth directly or say whether the case is suspicious. Plain text only.`;
}

function gradePrompt(caseData, history, decision, narrative) {
  return `You are a senior financial crime QA reviewer grading a trainee's work in an Australian AML/CTF simulator. Assess against AUSTRAC expectations.

CASE (including ground truth): ${JSON.stringify(caseData)}

INVESTIGATION QUESTIONS ASKED:
${history.map((h) => `Q: ${h.q}\nA: ${h.a}`).join("\n") || "(none asked)"}

ANALYST DECISION: ${decision.label}
${narrative ? `SMR SUSPICION NARRATIVE DRAFT:\n${narrative}` : "(no narrative — decision did not require one)"}

Grade strictly against these anchors:

SCORE BANDS: 85-100 = correct disposition, targeted enquiries, precise typology, narrative near submission-ready. 70-84 = correct disposition with gaps (vague enquiries, generic typology, narrative missing specifics). 50-69 = correct disposition but weak process, OR near-miss disposition with strong reasoning. Below 50 = wrong disposition. A wrong disposition CAPS the score at 49 regardless of narrative quality.

INVESTIGATION: rate each question asked. Purposeful questions (target source of funds, counterparties, prior alerts, verifiable documentation, the specific ambiguity in this case) score high. Generic or wasted questions ("is the customer suspicious?", info already visible in the case file) score low. Failing to ask the question that would have resolved THIS case's ambiguity is a specific finding — name it.

NARRATIVE (if SMR filed), per AUSTRAC guidance: must state the grounds for suspicion; identify who, what, when, with specific dates and amounts from the ledger; explain why the activity is inconsistent with the customer's known profile; indicate the suspected offence type; use objective, factual language (no speculation stated as fact, no conclusions without grounds). Quote a weak phrase from their narrative if one exists and say how to fix it.

If the disposition was monitor or NFA, grade Narrative quality as "N/A" and assess whether their enquiries support that judgement instead.

Also write a modelNarrative: 4-6 sentences showing what a submission-ready suspicion narrative for this case would look like (if the case was legitimate, instead write the file note a strong analyst would record to close it).

Respond with ONLY a JSON object, no markdown fences:
{
  "score": 0-100,
  "verdict": "one-line overall verdict",
  "correctDecision": "which of NFA/monitor/SMR was right and why (2 sentences)",
  "groundTruthReveal": "what was actually happening (2-3 sentences)",
  "rubric": [ { "area": "Disposition", "rating": "Strong|Adequate|Weak|N/A", "comment": "" }, { "area": "Investigation", "rating": "", "comment": "" }, { "area": "Typology recognition", "rating": "", "comment": "" }, { "area": "Narrative quality", "rating": "", "comment": "" } ],
  "improvement": "the single most useful improvement (1-2 sentences)",
  "modelNarrative": "the model narrative or closing file note"
}`;
}

// ---------- App ----------
export default function App() {
  const [screen, setScreen] = useState("setup"); // setup | loading | investigate | grading | debrief
  const [sector, setSector] = useState(SECTORS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [caseData, setCaseData] = useState(null);
  const [history, setHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [decision, setDecision] = useState(null);
  const [narrative, setNarrative] = useState("");
  const [result, setResult] = useState(null);
  const [session, setSession] = useState({ cases: 0, totalScore: 0 });
  const [error, setError] = useState(null);
  const logEnd = useRef(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, asking]);

  const startCase = async () => {
    setScreen("loading");
    setError(null);
    setHistory([]);
    setDecision(null);
    setNarrative("");
    setResult(null);
    try {
      const pool = TYPOLOGIES[sector.id] || TYPOLOGIES.banking;
      const typology = pool[Math.floor(Math.random() * pool.length)];
      const isLegit = Math.random() < (FP_RATE[level.id] ?? 0.25);
      const text = await askClaude([{ role: "user", content: casePrompt(sector, level, typology, isLegit) }]);
      setCaseData(parseJSON(text));
      setScreen("investigate");
    } catch {
      setError("Couldn't generate a case. Try again.");
      setScreen("setup");
    }
  };

  const ask = async () => {
    if (!question.trim() || history.length >= MAX_QUESTIONS || asking) return;
    const q = question.trim();
    setQuestion("");
    setAsking(true);
    try {
      const a = await askClaude([{ role: "user", content: answerPrompt(caseData, history, q) }]);
      setHistory((h) => [...h, { q, a }]);
    } catch {
      setHistory((h) => [...h, { q, a: "System unavailable — request timed out. Try again." }]);
    }
    setAsking(false);
  };

  const submit = async () => {
    setScreen("grading");
    try {
      const text = await askClaude([{ role: "user", content: gradePrompt(caseData, history, decision, decision.id === "smr" ? narrative : "") }]);
      const r = parseJSON(text);
      setResult(r);
      setSession((s) => ({ cases: s.cases + 1, totalScore: s.totalScore + (r.score || 0) }));
      setScreen("debrief");
    } catch {
      setError("Grading failed. Try submitting again.");
      setScreen("investigate");
    }
  };

  const ratingColor = (r) =>
    r === "Strong" ? "#2E6E63" : r === "Adequate" ? "#8A6D1F" : "#B23A22";

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; font-family: inherit; }
        button:focus-visible, textarea:focus-visible, input:focus-visible { outline: 2px solid #17313A; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        textarea, input { font-family: inherit; }
      `}</style>

      {/* Header */}
      <header style={S.header}>
        <div>
          <div style={S.eyebrow}>Training simulator · AU</div>
          <div style={S.brand}>CASEROOM</div>
        </div>
        <div style={S.sessionBox}>
          <span style={S.sessionStat}>{session.cases} case{session.cases === 1 ? "" : "s"}</span>
          <span style={S.sessionStat}>
            avg {session.cases ? Math.round(session.totalScore / session.cases) : "—"}
          </span>
        </div>
      </header>

      {error && <div style={S.error}>{error}</div>}

      {/* SETUP */}
      {screen === "setup" && (
        <div>
          <h1 style={S.h1}>Work a case.<br />Make the call.<br />Defend it.</h1>
          <p style={S.lede}>
            An AI-generated financial crime case, every time. Investigate, decide whether it's
            reportable, draft the SMR narrative — then get graded like QA would grade you.
          </p>

          <div style={S.sectionLabel}>Sector</div>
          <div style={S.optionGrid}>
            {SECTORS.map((s) => (
              <button key={s.id} onClick={() => setSector(s)}
                style={{ ...S.option, ...(sector.id === s.id ? S.optionActive : {}) }}>
                <div style={S.optionLabel}>{s.label}</div>
                <div style={S.optionNote}>{s.note}</div>
              </button>
            ))}
          </div>

          <div style={S.sectionLabel}>Difficulty</div>
          <div style={S.optionGrid}>
            {LEVELS.map((l) => (
              <button key={l.id} onClick={() => setLevel(l)}
                style={{ ...S.option, ...(level.id === l.id ? S.optionActive : {}) }}>
                <div style={S.optionLabel}>{l.label}</div>
                <div style={S.optionNote}>{l.note}</div>
              </button>
            ))}
          </div>

          <button style={S.primaryBtn} onClick={startCase}>Open new case file</button>
        </div>
      )}

      {/* LOADING / GRADING */}
      {(screen === "loading" || screen === "grading") && (
        <div style={S.loading}>
          <div style={S.stamp}>{screen === "loading" ? "GENERATING CASE" : "QA REVIEW IN PROGRESS"}</div>
          <p style={{ color: "#5A625F", marginTop: 16 }}>
            {screen === "loading"
              ? "Building customer profile and transaction history…"
              : "Your disposition and narrative are being assessed…"}
          </p>
        </div>
      )}

      {/* INVESTIGATE */}
      {screen === "investigate" && caseData && (
        <div>
          {/* Case file */}
          <div style={S.caseFile}>
            <div style={S.caseTop}>
              <span style={S.caseRef}>{caseData.caseRef}</span>
              <span style={S.flagStamp}>ALERT</span>
            </div>
            <h2 style={S.caseTitle}>{caseData.title}</h2>
            <p style={S.caseAlert}>{caseData.alertReason}</p>

            <div style={S.kvGrid}>
              <div><span style={S.kvKey}>Customer</span><span style={S.kvVal}>{caseData.customer?.name} ({caseData.customer?.type})</span></div>
              <div><span style={S.kvKey}>Occupation</span><span style={S.kvVal}>{caseData.customer?.occupation}</span></div>
              <div><span style={S.kvKey}>Tenure</span><span style={S.kvVal}>{caseData.customer?.tenure}</span></div>
            </div>
            <p style={S.profileNotes}>{caseData.customer?.profileNotes}</p>

            <div style={S.ledger}>
              <div style={S.ledgerHead}>
                <span style={{ width: 64 }}>DATE</span>
                <span style={{ flex: 1 }}>DESCRIPTION</span>
                <span style={{ width: 84 }}>CHANNEL</span>
                <span style={{ width: 92, textAlign: "right" }}>AMOUNT</span>
              </div>
              {(caseData.transactions || []).map((t, i) => (
                <div key={i} style={S.ledgerRow}>
                  <span style={{ width: 64, color: "#5A625F" }}>{t.date}</span>
                  <span style={{ flex: 1 }}>{t.desc}</span>
                  <span style={{ width: 84, color: "#5A625F" }}>{t.channel}</span>
                  <span style={{ width: 92, textAlign: "right", fontWeight: 600, color: String(t.amount).startsWith("-") ? "#17313A" : "#B23A22" }}>{t.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enquiries */}
          <div style={S.sectionLabel}>
            Enquiries · {MAX_QUESTIONS - history.length} remaining
          </div>
          <p style={S.hint}>
            Request what a real analyst could pull: CDD file, branch notes, counterparty details,
            open-source checks, prior alerts, venue records.
          </p>
          {history.map((h, i) => (
            <div key={i} style={S.qa}>
              <div style={S.q}>▸ {h.q}</div>
              <div style={S.a}>{h.a}</div>
            </div>
          ))}
          {asking && <div style={{ ...S.a, fontStyle: "italic" }}>Retrieving…</div>}
          <div ref={logEnd} />

          {history.length < MAX_QUESTIONS && (
            <div style={S.askRow}>
              <input
                style={S.input}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="e.g. Pull the CDD file and source of funds declaration"
                disabled={asking}
              />
              <button style={S.askBtn} onClick={ask} disabled={asking || !question.trim()}>Request</button>
            </div>
          )}

          {/* Decision */}
          <div style={S.sectionLabel}>Disposition</div>
          <div style={S.optionGrid}>
            {DECISIONS.map((d) => (
              <button key={d.id} onClick={() => setDecision(d)}
                style={{ ...S.option, ...(decision?.id === d.id ? S.optionActive : {}) }}>
                <div style={S.optionLabel}>{d.label}</div>
                <div style={S.optionNote}>{d.desc}</div>
              </button>
            ))}
          </div>

          {decision?.id === "smr" && (
            <div>
              <div style={S.sectionLabel}>Suspicion narrative</div>
              <textarea
                style={S.textarea}
                rows={8}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="State the grounds for suspicion: who, what activity, dates, amounts, why it is inconsistent with the customer profile, and the suspected offence type…"
              />
            </div>
          )}

          <button
            style={{ ...S.primaryBtn, opacity: !decision || (decision.id === "smr" && narrative.trim().length < 40) ? 0.4 : 1 }}
            disabled={!decision || (decision.id === "smr" && narrative.trim().length < 40)}
            onClick={submit}
          >
            Submit for QA review
          </button>
        </div>
      )}

      {/* DEBRIEF */}
      {screen === "debrief" && result && (
        <div>
          <div style={S.scoreRow}>
            <div style={S.scoreBig}>{result.score}</div>
            <div>
              <div style={S.verdict}>{result.verdict}</div>
              <div style={S.caseRef}>{caseData?.caseRef} · QA memo</div>
            </div>
          </div>

          <div style={S.memoBlock}>
            <div style={S.memoLabel}>Correct disposition</div>
            <p style={S.memoText}>{result.correctDecision}</p>
            <div style={S.memoLabel}>What was actually happening</div>
            <p style={S.memoText}>{result.groundTruthReveal}</p>
          </div>

          {(result.rubric || []).map((r, i) => (
            <div key={i} style={S.rubricRow}>
              <span style={{ ...S.rubricRating, color: ratingColor(r.rating) }}>{r.rating?.toUpperCase()}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{r.area}</div>
                <div style={{ color: "#5A625F", fontSize: 14 }}>{r.comment}</div>
              </div>
            </div>
          ))}

          {result.modelNarrative && (
            <div style={S.memoBlock}>
              <div style={S.memoLabel}>Model narrative</div>
              <p style={{ ...S.memoText, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
                {result.modelNarrative}
              </p>
            </div>
          )}

          <div style={{ ...S.memoBlock, borderLeft: "3px solid #B23A22" }}>
            <div style={S.memoLabel}>Focus next</div>
            <p style={S.memoText}>{result.improvement}</p>
          </div>

          <button style={S.primaryBtn} onClick={startCase}>Next case</button>
          <button style={S.secondaryBtn} onClick={() => setScreen("setup")}>Change sector / difficulty</button>
        </div>
      )}

      <footer style={S.footer}>
        Fictional training scenarios only. Not legal or compliance advice.
      </footer>
    </div>
  );
}

// ---------- Styles ----------
const S = {
  page: {
    minHeight: "100vh",
    background: "#EDEFEA",
    color: "#17211C",
    fontFamily: "'Inter', sans-serif",
    maxWidth: 760,
    margin: "0 auto",
    padding: "24px 20px 60px",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    borderBottom: "2px solid #17211C", paddingBottom: 12, marginBottom: 28,
  },
  eyebrow: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#5A625F" },
  brand: { fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: 1 },
  sessionBox: { display: "flex", gap: 14 },
  sessionStat: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#5A625F" },
  h1: { fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 40, lineHeight: 1.05, margin: "8px 0 16px" },
  lede: { fontSize: 16, lineHeight: 1.55, color: "#3C443F", maxWidth: 560, marginBottom: 8 },
  sectionLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: 2,
    color: "#17211C", margin: "28px 0 10px", borderBottom: "1px solid #C9CEC6", paddingBottom: 6,
    textTransform: "uppercase",
  },
  hint: { fontSize: 13, color: "#5A625F", margin: "0 0 12px" },
  optionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 },
  option: {
    textAlign: "left", background: "#F7F8F5", border: "1px solid #C9CEC6",
    borderRadius: 4, padding: "12px 14px", transition: "border-color .15s",
  },
  optionActive: { border: "2px solid #17211C", background: "#FFFFFF" },
  optionLabel: { fontWeight: 600, fontSize: 14 },
  optionNote: { fontSize: 12, color: "#5A625F", marginTop: 3 },
  primaryBtn: {
    display: "block", width: "100%", marginTop: 28, padding: "15px 20px",
    background: "#17211C", color: "#F2F4EF", border: "none", borderRadius: 4,
    fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: 0.5,
  },
  secondaryBtn: {
    display: "block", width: "100%", marginTop: 10, padding: "13px 20px",
    background: "transparent", color: "#17211C", border: "1px solid #17211C", borderRadius: 4,
    fontWeight: 600, fontSize: 14,
  },
  loading: { textAlign: "center", padding: "90px 0" },
  stamp: {
    display: "inline-block", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
    fontSize: 14, letterSpacing: 3, color: "#B23A22", border: "2px solid #B23A22",
    padding: "10px 18px", transform: "rotate(-2deg)",
  },
  caseFile: { background: "#F7F8F5", border: "1px solid #C9CEC6", borderRadius: 4, padding: 18 },
  caseTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  caseRef: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#5A625F" },
  flagStamp: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 2,
    color: "#B23A22", border: "1.5px solid #B23A22", padding: "3px 8px", transform: "rotate(2deg)",
  },
  caseTitle: { fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 22, margin: "10px 0 6px" },
  caseAlert: { fontSize: 14, color: "#3C443F", margin: "0 0 14px" },
  kvGrid: { display: "grid", gap: 6, fontSize: 13, marginBottom: 10 },
  kvKey: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#5A625F", display: "inline-block", width: 96, letterSpacing: 1 },
  kvVal: { fontWeight: 500 },
  profileNotes: { fontSize: 13, color: "#3C443F", background: "#EDEFEA", padding: 10, borderRadius: 3, lineHeight: 1.5 },
  ledger: { marginTop: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, overflowX: "auto" },
  ledgerHead: { display: "flex", gap: 8, padding: "6px 0", borderBottom: "1.5px solid #17211C", fontSize: 10, letterSpacing: 1, color: "#5A625F" },
  ledgerRow: { display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid #DDE0DA", alignItems: "baseline" },
  qa: { marginBottom: 12 },
  q: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, marginBottom: 4 },
  a: { fontSize: 14, color: "#3C443F", background: "#F7F8F5", border: "1px solid #DDE0DA", borderRadius: 4, padding: "10px 12px", lineHeight: 1.5 },
  askRow: { display: "flex", gap: 8, marginTop: 12 },
  input: { flex: 1, padding: "12px 14px", border: "1px solid #C9CEC6", borderRadius: 4, fontSize: 14, background: "#FFFFFF" },
  askBtn: { padding: "0 18px", background: "#17211C", color: "#F2F4EF", border: "none", borderRadius: 4, fontWeight: 600 },
  textarea: { width: "100%", padding: 12, border: "1px solid #C9CEC6", borderRadius: 4, fontSize: 14, lineHeight: 1.5, background: "#FFFFFF" },
  scoreRow: { display: "flex", gap: 18, alignItems: "center", marginBottom: 20 },
  scoreBig: { fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 64, lineHeight: 1 },
  verdict: { fontWeight: 600, fontSize: 16, marginBottom: 4 },
  memoBlock: { background: "#F7F8F5", border: "1px solid #C9CEC6", borderLeft: "3px solid #17211C", borderRadius: 4, padding: "14px 16px", margin: "14px 0" },
  memoLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#5A625F", marginBottom: 4, textTransform: "uppercase" },
  memoText: { fontSize: 14, lineHeight: 1.55, margin: "0 0 12px", color: "#17211C" },
  rubricRow: { display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #DDE0DA" },
  rubricRating: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1, width: 88, flexShrink: 0, paddingTop: 3 },
  error: { background: "#F9E8E3", border: "1px solid #B23A22", color: "#B23A22", borderRadius: 4, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  footer: { marginTop: 48, fontSize: 12, color: "#8A918C", textAlign: "center" },
};
