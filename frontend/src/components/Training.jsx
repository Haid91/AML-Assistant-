import { useState, useEffect } from 'react'

const ANALYST_CASES = [
  {
    id: 'a1', number: 'Part 1',
    title: "End-to-End: Cash-Intensive Business",
    tags: ['Escalation'], sector: 'Banking', premium: false,
    shortDesc: "Using the KYC document pack, complete each assessment tab by extracting and recording key information from the client's CDD documents.",
    fullScenario: `Carlo Esposito (DOB: 12 April 1974, Australian citizen) has applied for a business transaction account for his sole trader operation "Carlo's Café & Restaurant" (ABN: 67 234 891 045), based in Newtown, Sydney.

Expected monthly turnover: $45,000 in cash, $30,000 via EFTPOS.
Account purpose: pay suppliers, staff wages, and ATO obligations.

Documents provided so far:
• Australian passport (current)
• Recent electricity bill (2 months old)
• ABN registration certificate

Work through each CDD step to complete the onboarding review.`,
    steps: [
      {
        id: 1, title: 'Document Review',
        question: "Carlo has provided his passport, an electricity bill, and his ABN certificate. His ASIC extract confirms he is the sole proprietor. What is MISSING from his CDD document pack?",
        options: [
          { text: 'Source of funds declaration and 3–6 months of business bank statements', correct: true, feedback: 'Correct. Identity verification is satisfied, but for a cash-intensive business you must also understand source of funds. Bank statements establish the expected transaction profile and let you verify the declared revenue is consistent with prior activity — essential for calibrating ongoing monitoring.' },
          { text: 'Nothing — passport, address proof, and ABN are sufficient for standard CDD', correct: false, feedback: 'Incorrect. These satisfy the identity requirement but not source of funds. Without business bank statements you cannot establish an expected transaction profile or assess whether the declared cash volume is plausible.' },
          { text: 'A police clearance certificate', correct: false, feedback: 'Incorrect. Police clearance certificates are not a standard AML/CTF CDD requirement under AUSTRAC guidance. CDD focuses on identity, beneficial ownership, and source of funds.' },
          { text: 'A reference letter from an existing bank customer', correct: false, feedback: 'Incorrect. Reference letters are not an AML/CTF regulatory requirement. They may appear in some private banking contexts but have no basis in the AML/CTF Act or AUSTRAC Rules.' },
        ],
      },
      {
        id: 2, title: 'Risk Factor Assessment',
        question: "Carlo's café handles $45,000/month in physical cash. Onboarding is face-to-face. He is an Australian citizen with a current address. Which risk factor is MOST elevated?",
        options: [
          { text: 'Customer risk — sole trader with limited financial history', correct: false, feedback: 'Partially correct, but not the dominant factor. Sole traders are common and not inherently high-risk. Limited financial history warrants scrutiny but is secondary here.' },
          { text: 'Product/service risk — large volume of physical cash transactions', correct: true, feedback: 'Correct. Cash is the primary vehicle for the placement stage of money laundering — it is anonymous, untraceable, and easily commingled with legitimate revenue. $45,000/month in cash from a single small business represents meaningful exposure and drives the need for enhanced cash-deposit monitoring.' },
          { text: 'Geographic risk — Newtown, Sydney', correct: false, feedback: 'Incorrect. Geographic risk in AML relates primarily to cross-border jurisdictions and FATF grey/black-listed countries — not domestic suburban locations.' },
          { text: 'Channel risk — face-to-face branch onboarding', correct: false, feedback: 'Incorrect — face-to-face onboarding actually REDUCES channel risk because you can physically verify ID documents. Remote/digital onboarding carries higher channel risk.' },
        ],
      },
      {
        id: 3, title: 'CDD Decision',
        question: "You collected all documents including 6 months of business bank statements showing consistent café revenue. No adverse media, no PEP/sanctions match. What is the appropriate CDD decision?",
        options: [
          { text: 'Approve — Standard CDD, rate MEDIUM risk, set a cash-deposit monitoring alert just below the $10,000 TTR threshold', correct: true, feedback: 'Correct. The risk is MEDIUM (elevated by cash volumes, mitigated by face-to-face onboarding, verified financial history, no adverse indicators). Standard CDD applies. A monitoring alert for deposits approaching $10,000 is the proportionate control for a legitimate cash-intensive business.' },
          { text: 'Decline — cash businesses are too high-risk to onboard', correct: false, feedback: 'Incorrect. A blanket refusal of cash businesses is disproportionate and inconsistent with a risk-based approach. Cash businesses are lawful. Your obligation is to apply appropriate controls, not to exclude an entire category of legitimate customers.' },
          { text: 'Apply EDD and require senior management sign-off', correct: false, feedback: 'Incorrect. EDD and senior management approval are reserved for HIGH or MEDIUM-HIGH risk customers — PEPs, high-risk jurisdiction customers, complex structures. A sole trader café with verified documentation rates MEDIUM, not MEDIUM-HIGH.' },
          { text: 'Approve with no additional monitoring', correct: false, feedback: 'Incorrect. No monitoring for a cash-intensive business is a compliance failure. AUSTRAC expects transaction monitoring rules calibrated to the customer\'s risk profile.' },
        ],
      },
      {
        id: 4, title: 'Monitoring Setup',
        question: "What is the most appropriate transaction monitoring rule to apply to Carlo's account?",
        options: [
          { text: 'Flag any single cash deposit at or approaching $9,500 for manual review — alert to possible structuring below the $10,000 TTR threshold', correct: true, feedback: 'Correct. Setting the alert below $10,000 detects structuring — the deliberate splitting of cash to avoid the TTR obligation. Manual review lets an analyst determine whether the pattern is suspicious or consistent with normal business operations.' },
          { text: 'Flag only if total monthly cash deposits exceed $200,000', correct: false, feedback: 'Incorrect. For a business with declared cash income of $45,000/month, a $200,000 monthly threshold is far too high. The monitoring rule must be calibrated to the customer\'s declared transaction profile.' },
          { text: 'No monitoring required — the business model explains all cash deposits', correct: false, feedback: 'Incorrect. Ongoing transaction monitoring is a legal obligation under AUSTRAC regardless of how legitimate a business appears at onboarding. Customer circumstances can change.' },
          { text: 'Refer all cash deposits over $1,000 to the MLRO', correct: false, feedback: 'Incorrect. For a business depositing $45,000/month in cash, a $1,000 trigger creates constant alerts and overwhelms the MLRO. Effective monitoring requires calibrated, risk-proportionate rules.' },
        ],
      },
    ],
  },
  {
    id: 'a2', number: 'Part 2',
    title: "End-to-End: Cash-Intensive Business",
    tags: ['Escalation'], sector: 'Banking', premium: false,
    shortDesc: "Assess a customer from initial trigger through investigation and reporting considerations.",
    fullScenario: `THREE MONTHS LATER — Monitoring Alert Triggered

Carlo's account (opened in Part 1) has triggered a transaction monitoring alert.

Alert details:
• 11 cash deposits over the past 4 weeks
• Deposited by 7 different individuals at 4 different branches
• Total: $98,200
• No single deposit exceeded $9,800
• Account balance: $97,400 (almost no withdrawals)

Your task: work through the investigation, make a recommendation, and determine reporting obligations.`,
    steps: [
      {
        id: 1, title: 'Pattern Recognition',
        question: "What does this transaction pattern most likely indicate?",
        options: [
          { text: 'Structuring / smurfing — deliberate splitting of cash to avoid the $10,000 TTR threshold', correct: true, feedback: 'Correct. This is a textbook structuring pattern: multiple deposits from different individuals across different branches, each kept below $10,000 but totalling nearly $100,000. Amounts consistently just below the threshold strongly indicate deliberate avoidance of the TTR obligation — a criminal offence under s.140 of the AML/CTF Act.' },
          { text: 'Normal business operations — café staff depositing daily takings', correct: false, feedback: 'This is the explanation Carlo may offer and must be investigated — but 7 different depositors across 4 branches with amounts consistently below $9,800 goes well beyond typical daily-takings deposits from a small café. The pattern demands investigation.' },
          { text: 'A seasonal uptick increasing café revenue', correct: false, feedback: 'Possible, but a seasonal explanation does not account for why 7 different individuals are depositing at 4 separate branches, or why almost none of the funds have been withdrawn (unlike genuine business revenue flowing to suppliers and wages).' },
          { text: 'A new catering contract generating higher revenue', correct: false, feedback: 'A new contract could explain higher deposits, but not the multi-depositor, multi-branch pattern or the near-zero withdrawals. Genuine business revenue cycles through the account; this balance sits undisturbed.' },
        ],
      },
      {
        id: 2, title: 'Investigation Steps',
        question: "Before escalating to the MLRO, what should you do first?",
        options: [
          { text: 'Contact Carlo for an explanation, document his response precisely, and review his full account history and prior monitoring records', correct: true, feedback: 'Correct. Gather all available information before escalating. Document exactly what Carlo says and when. Review whether earlier alerts were dismissed. Check whether depositors can be identified from branch records. A well-documented investigation file strengthens the MLRO\'s decision and any subsequent SMR.' },
          { text: 'Immediately freeze the account', correct: false, feedback: 'Premature. Freezing without MLRO authorisation and without first gathering information is disproportionate. It may also alert Carlo before an SMR is lodged, creating a tipping-off risk.' },
          { text: 'Lodge an SMR immediately — the pattern is clearly suspicious', correct: false, feedback: 'Possible but premature without a documented investigation file. The MLRO should review the case. Carlo\'s explanation may partially resolve or intensify the suspicion — either way it belongs in the SMR.' },
          { text: 'Close the account without explanation', correct: false, feedback: 'Incorrect. Abrupt closure without explanation creates a tipping-off risk. Account action should be coordinated with the MLRO after the investigation is complete.' },
        ],
      },
      {
        id: 3, title: 'Evaluating the Explanation',
        question: "Carlo says his staff deposited takings because he had a shoulder injury. He provides a medical certificate dated 3 weeks ago — but deposits began 4 weeks ago. What is your decision?",
        options: [
          { text: 'Escalate to MLRO — the certificate explains at most 3 of the 4 weeks, and the multi-branch, multi-depositor pattern remains unexplained', correct: true, feedback: 'Correct. The explanation is plausible for part of the period but does not account for the week before the injury, the 4-branch pattern, or why 7 different people made deposits. The MLRO must make the SMR decision; present the full file including Carlo\'s explanation and the gap in the timeline.' },
          { text: 'Accept the explanation and close the alert', correct: false, feedback: 'Incorrect. The explanation does not fully account for the pattern. Closing the alert without MLRO involvement would be a material compliance failure if this is genuine money laundering.' },
          { text: 'Lodge an SMR immediately without further review', correct: false, feedback: 'Premature. You have received a partial explanation that the MLRO must assess. Bypass the MLRO and you risk lodging an incomplete SMR or making a unilateral decision that should sit with the MLRO.' },
          { text: 'Request a second medical certificate to verify the injury', correct: false, feedback: 'Disproportionate. A second certificate won\'t resolve the key questions: why multiple branches, why 7 depositors, and why did the pattern start a week before the injury? Escalate to the MLRO with the existing file.' },
        ],
      },
      {
        id: 4, title: 'Reporting Obligations',
        question: "Each deposit was under $10,000 but the total is $98,200. Are TTRs required?",
        options: [
          { text: 'No — TTRs apply per-transaction to physical currency of $10,000+. An SMR is the correct vehicle for the suspicious structured pattern.', correct: true, feedback: 'Correct. The TTR obligation is per-transaction — none of the 11 deposits individually met the $10,000 threshold. However, deliberately structuring to stay below the threshold is itself suspicious and reportable via SMR. The SMR is the appropriate report for this case.' },
          { text: 'Yes — the $98,200 monthly total triggers the TTR threshold on an aggregate basis', correct: false, feedback: 'Incorrect. The TTR threshold applies per individual transaction, not to monthly aggregates. Aggregate rules would defeat the purpose of the structuring offence, which is specifically aimed at this kind of sub-threshold splitting.' },
          { text: 'Yes — structuring requires retroactive TTRs for deposits above $5,000', correct: false, feedback: 'Incorrect. There is no $5,000 TTR threshold in Australian law, and TTRs are not filed retroactively for deposits that did not meet the $10,000 threshold at the time. The SMR is the correct instrument for structured activity.' },
          { text: 'No reporting is required until law enforcement formally investigates', correct: false, feedback: 'Incorrect. Reporting obligations under the AML/CTF Act are independent of law enforcement action. The SMR obligation arises when there are reasonable grounds to suspect — not when police have opened an investigation.' },
        ],
      },
    ],
  },
]

const MLRO_CASES = [
  {
    id: 'm1', number: '1.',
    title: "MLRO Escalations: SAR Approval — Confirmed Third-Party Cash Layering",
    tags: ['Regulatory'], sector: 'Banking', premium: false,
    shortDesc: "Analyst has escalated a strong ML case: a retail customer receiving structured third-party cash deposits across multiple branches.",
    fullScenario: `ANALYST ESCALATION — For MLRO Review & Sign-off

Customer: Maria Chen (age 30, retail banking)
Occupation declared: Part-time café worker
Annual income declared: ~$28,000/year
Account tenure: 14 months (basic savings account)

Alert summary — past 90 days:
• 23 cash deposits from 7 different individuals
• Deposited at 4 different branches across Sydney
• Total received: $187,400
• No single deposit exceeded $9,800
• Account withdrawals: Nil — full balance remains

Analyst assessment: Strong indicators of deliberate third-party structuring to avoid the TTR threshold. Income profile is grossly inconsistent with deposit volumes.

Your task: Review the escalation, make an SMR sign-off decision, and manage next steps.`,
    steps: [
      {
        id: 1, title: 'SMR Assessment',
        question: "As MLRO, what is your initial assessment of the analyst's escalation?",
        options: [
          { text: 'The escalation is well-founded — the pattern strongly suggests deliberate third-party structuring. Reasonable grounds to suspect clearly exist.', correct: true, feedback: 'Correct. The pattern is unambiguous: 23 deposits from 7 individuals at 4 branches, all below $10,000, totalling $187,400 — approximately 6.7× the customer\'s declared annual income — with zero withdrawals. The "reasonable grounds to suspect" threshold for an SMR is clearly met.' },
          { text: 'Premature — café workers sometimes receive cash wages and the amounts aren\'t unusual', correct: false, feedback: 'Incorrect. $187,400 in 90 days is 6.7× the declared annual income of $28,000. The multi-depositor, multi-branch pattern with no withdrawals cannot be explained by normal wage receipts.' },
          { text: 'Request more information before making any decision', correct: false, feedback: 'Partially valid as a secondary step, but the pattern as described already meets the reasonable-grounds threshold. Additional information can improve the quality of the SMR — it should not delay the decision when suspicion is already well-founded.' },
          { text: 'Close the case — no proof of criminal intent means no SMR', correct: false, feedback: 'Incorrect. The SMR threshold is "reasonable grounds to suspect" — not proof. You do not need a confession or forensic evidence. The pattern, the income disparity, and the nil-withdrawal balance collectively meet that threshold.' },
        ],
      },
      {
        id: 2, title: 'Pre-SMR Information',
        question: "Before authorising the SMR, what additional information do you require?",
        options: [
          { text: 'Identity of the 7 depositors (from branch records), full account history prior to the 90-day alert period, any prior monitoring alerts, and whether Maria has been contacted for an explanation', correct: true, feedback: 'Correct. A high-quality SMR includes all available intelligence. Knowing who the depositors are significantly improves AUSTRAC\'s ability to use the report. Prior account history establishes whether this is a new pattern. Any explanation from Maria must be included and assessed — even if ultimately rejected.' },
          { text: 'A certified copy of Maria\'s most recent tax return', correct: false, feedback: 'Not proportionate. Tax records are not a standard pre-SMR requirement. The income inconsistency is already evident from the declared income on file. Requesting a tax return could also alert Maria to the investigation.' },
          { text: 'Confirmation from the branch manager that deposits look suspicious', correct: false, feedback: 'Incorrect. The MLRO makes the SMR decision independently. You do not need a branch manager\'s subjective assessment — and involving additional people increases tipping-off risk.' },
          { text: 'A court order authorising the investigation', correct: false, feedback: 'Incorrect. SMRs require no court authorisation. Court orders relate to law enforcement actions. The obligation to lodge an SMR arises under the AML/CTF Act when the suspicion threshold is met.' },
        ],
      },
      {
        id: 3, title: 'Account Restriction',
        question: "While the SMR is being prepared, should you restrict Maria's account?",
        options: [
          { text: 'Yes — apply a debit restriction to prevent withdrawal of the $187,400 while the SMR is lodged and under AUSTRAC review. Document the decision and rationale.', correct: true, feedback: 'Correct. Once an SMR is lodged, the risk is that funds are withdrawn before AUSTRAC or law enforcement can act. A debit restriction is proportionate, within the bank\'s contractual and regulatory rights, and does not require court authorisation. Document the decision carefully.' },
          { text: 'No — restricting the account could alert Maria and trigger a tipping-off concern', correct: false, feedback: 'This reflects a real tension but the balance tilts toward restriction in a case this strong. Account restrictions do not constitute tipping off under the AML/CTF Act. Tipping off is specifically about disclosing that an SMR has been lodged or that an investigation is underway — a "security review" restriction does not cross that line.' },
          { text: 'Close the account immediately', correct: false, feedback: 'Premature. Abrupt account closure — especially without explanation — can alert Maria and her associates. A targeted debit restriction is more proportionate and less likely to tip off.' },
          { text: 'No action — AUSTRAC will instruct you once they receive the SMR', correct: false, feedback: 'Incorrect. AUSTRAC does not proactively direct reporting entities on account actions after receiving SMRs. AUSTRAC disseminates intelligence to law enforcement — law enforcement decides whether to seek court orders. A reporting entity should take proportionate protective steps within its own authority.' },
        ],
      },
      {
        id: 4, title: 'Tipping Off Management',
        question: "Maria calls customer service asking why she cannot access her account. What do you instruct staff to say?",
        options: [
          { text: '"There is a security review on your account — our compliance team will be in touch within 2–3 business days." Staff told only that there is a "compliance hold."', correct: true, feedback: 'Correct. This is truthful, does not disclose the existence of an SMR or investigation, and is not materially misleading. Critically, staff must not be told about the SMR — only that a compliance hold exists — so they cannot inadvertently disclose more than they should.' },
          { text: '"Your account has been flagged for suspicious activity and is under investigation."', correct: false, feedback: 'This is a tipping-off violation. Disclosing that the account was flagged for suspicious activity communicates that an investigation is underway — a criminal offence under s.123 of the AML/CTF Act, carrying up to 2 years imprisonment.' },
          { text: '"We are unable to provide any information about your account."', correct: false, feedback: 'Technically avoids tipping off but is likely to alarm Maria and may prompt her to seek legal advice immediately. A measured "security review" explanation achieves the same objective with less risk.' },
          { text: '"AUSTRAC has placed a hold following a report we submitted."', correct: false, feedback: 'A serious tipping-off violation on two counts: it discloses that an SMR was submitted, and falsely implies AUSTRAC has taken direct action. This exposes both the bank and the individual employee to criminal liability.' },
        ],
      },
    ],
  },
  {
    id: 'm2', number: '2.',
    title: "MLRO Escalations: Foreign PEP Onboarding — Deputy Minister",
    tags: ['Regulatory', 'Premium'], sector: 'Banking', premium: true,
    shortDesc: "Analyst escalates onboarding of a deputy minister from a high-corruption jurisdiction who wants to open a private banking account.",
  },
  {
    id: 'm3', number: '3.',
    title: "MLRO Escalations: Adverse Media Match — Foreign Bribery Allegation",
    tags: ['Regulatory', 'Premium'], sector: 'Banking', premium: true,
    shortDesc: "Analyst dismisses a credible adverse-media match linking a customer to a foreign bribery investigation. Review and make the final MLRO determination.",
  },
  {
    id: 'm4', number: '4.',
    title: "MLRO Report to the Board — AML Effectiveness Review",
    tags: ['Regulatory'], sector: 'Banking', premium: false,
    shortDesc: "Structured Board-level MLRO report template covering governance, EWRA, CDD/EDD metrics, transaction monitoring, and SMR reporting statistics.",
    fullScenario: `ANNUAL MLRO BOARD REPORT — Guided Walkthrough

This simulation guides you through completing a Board-level AML Effectiveness Review — the structured annual report an MLRO presents to the Board of Directors under AUSTRAC's Part A program requirements.

Period: January – December [current year]
MLRO: [Your name]

Work through each section to understand what the Board expects and what AUSTRAC auditors will look for during a compliance examination.`,
    steps: [
      {
        id: 1, title: 'Section 1: Governance',
        question: "The governance section must confirm the AML/CTF Program has been independently reviewed. What is the mandatory minimum review frequency under AUSTRAC's AML/CTF Rules?",
        options: [
          { text: 'At least every 3 years — or sooner if significant changes occur to the business, designated services, or regulatory environment', correct: true, feedback: 'Correct. AUSTRAC\'s AML/CTF Rules require Part A to be independently reviewed at minimum every 3 years. "Independent" means by someone not responsible for day-to-day AML management — typically internal audit, an external compliance firm, or an AML legal practitioner. The review must assess effectiveness, not merely document that controls exist.' },
          { text: 'Annually — AUSTRAC requires a full independent review each financial year', correct: false, feedback: 'Incorrect. Annual independent review is best practice and recommended by AUSTRAC, but the mandatory minimum is every 3 years. Your Board report should note when the last review occurred and when the next is scheduled.' },
          { text: 'Only when a significant breach has occurred or AUSTRAC contacts you', correct: false, feedback: 'Incorrect. The independent review obligation is proactive and scheduled — not triggered by breaches. Waiting for a breach or regulatory contact before reviewing the program is itself a compliance failure.' },
          { text: 'Every 5 years — in line with the FATF mutual evaluation cycle', correct: false, feedback: 'Incorrect. FATF mutual evaluations are country-level assessments of national AML regimes, not reporting-entity requirements. AUSTRAC\'s Part A review obligation is every 3 years.' },
        ],
      },
      {
        id: 2, title: 'Section 2: Risk Assessment',
        question: "The business launched a new mobile banking app this year. Must the EWRA be updated?",
        options: [
          { text: 'Yes — a new technology product and delivery channel triggers an EWRA review under the "new technology risk" dimension of AUSTRAC\'s 6 risk factors', correct: true, feedback: 'Correct. The EWRA must be reviewed when significant changes occur, including new products, new channels, or new technology. A mobile app is a new delivery channel — it may enable remote account opening with limited face-to-face verification, introducing new identity fraud and channel risk that must be assessed and documented.' },
          { text: 'No — the EWRA only needs updating every 2 years regardless of business changes', correct: false, feedback: 'Incorrect. The 2-year minimum applies in the absence of significant changes. A material change — new product, new customer segment, new technology — requires an immediate EWRA review.' },
          { text: 'No — technology risk is the IT department\'s responsibility', correct: false, feedback: 'Incorrect. AML/CTF risk from new technology products is squarely within EWRA scope. The AML/CTF Program must assess how new technology changes the ML/TF risk profile — including whether new verification methods are adequate.' },
          { text: 'Only if the app enables international transfers', correct: false, feedback: 'Incorrect. Even a domestic-only mobile app introduces new technology risk (digital identity fraud, account takeover) and new channel risk (fully remote). Both must be assessed regardless of whether international transfers are available.' },
        ],
      },
      {
        id: 3, title: 'Section 3: CDD Findings',
        question: "An internal audit found 3 high-risk customers were onboarded without documented MLRO sign-off. How do you present this to the Board?",
        options: [
          { text: 'Disclose transparently: number of cases, root cause, immediate remediation (retrospective MLRO review of all 3), and control improvement to prevent recurrence', correct: true, feedback: 'Correct. The Board\'s governance role requires accurate reporting — including compliance failures. Disclosing the finding with root cause and remediation demonstrates a mature compliance function. Concealing it from the Board would be a governance failure, and if discovered by AUSTRAC in an examination it would be treated more seriously than the underlying gap.' },
          { text: 'Do not include it — internal audit findings are confidential and managed separately', correct: false, feedback: 'Incorrect. Internal audit findings that represent material AML/CTF compliance gaps must be reported to the Board. Withholding material findings undermines Board governance and, if discovered by AUSTRAC, constitutes a separate compliance failure.' },
          { text: 'Note that 3 cases were "under administrative review" without specifying the missing MLRO sign-off', correct: false, feedback: 'Incorrect. Vague language prevents the Board from exercising genuine oversight. The Board needs accurate information to assess whether the AML/CTF program is effective.' },
          { text: 'Remediate the cases and report to the Board that all high-risk onboarding was completed correctly', correct: false, feedback: 'Incorrect. Retrospectively fixing the cases and then reporting them as compliant is misleading. The Board must know a gap existed, how it was discovered, and what was done to prevent recurrence.' },
        ],
      },
      {
        id: 4, title: 'Section 4: SMR Statistics',
        question: "Your institution lodged 14 SMRs this year (up from 9 last year). A Board member asks whether this means the AML program is getting worse. How do you respond?",
        options: [
          { text: 'Not necessarily — an increase can mean better detection: improved monitoring, stronger analyst training, or new typologies identified. SMR quality and outcomes matter as much as volume.', correct: true, feedback: 'Correct. SMR volume is not a direct proxy for program failure. An institution that has never lodged an SMR may have an ineffective detection system. An increase can indicate better monitoring rules, improved analyst training, or an industry-wide increase in a financial crime typology. Discuss quality of investigations alongside volume.' },
          { text: 'Yes — more SMRs means more money laundering is occurring, which means the program is failing to prevent it', correct: false, feedback: 'Incorrect. AML programs are designed to detect and report suspicious activity — not prevent all money laundering. More SMRs can indicate a more effective detection system, not a failing one. The distinction between detection and prevention is fundamental.' },
          { text: 'The increase is irrelevant — AUSTRAC does not benchmark SMR volumes', correct: false, feedback: 'Partially incorrect. While AUSTRAC does not publish per-institution SMR benchmarks, AUSTRAC examiners do form views on whether reporting volume is consistent with a reporting entity\'s customer base and risk profile. Dramatic drops in SMRs without explanation attract scrutiny.' },
          { text: 'Raise the internal suspicion threshold next year to reduce SMR volumes', correct: false, feedback: 'Incorrect and potentially unlawful. Artificially raising the threshold to reduce SMR numbers suppresses legitimate reporting. The "reasonable grounds to suspect" threshold is set by the AML/CTF Act — it cannot be overridden by internal policy to manage statistics.' },
        ],
      },
    ],
  },
]

const TAG_STYLE = {
  Escalation: 'bg-amber-100 text-amber-700 border border-amber-200',
  Regulatory: 'bg-pink-100 text-pink-700 border border-pink-200',
  Premium: 'bg-indigo-100 text-indigo-600 border border-indigo-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  Completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
}

export default function Training({ user, onBack, onSignOut, onOpenChat, onUpgrade }) {
  const role = user?.role || 'analyst'
  const isPremium = user?.premium || false
  const cases = role === 'mlro' ? MLRO_CASES : ANALYST_CASES

  const [progress, setProgress] = useState({})
  const [activeCase, setActiveCase] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(`aml_prog_${user?.id || 'guest'}`)
    if (saved) try { setProgress(JSON.parse(saved)) } catch {}
  }, [user?.id])

  const save = (p) => {
    setProgress(p)
    localStorage.setItem(`aml_prog_${user?.id || 'guest'}`, JSON.stringify(p))
  }

  const startCase = (c, fromStep) => {
    const step = fromStep != null ? fromStep : (progress[c.id]?.step || 0)
    setActiveCase(c)
    setActiveStep(step)
    setSelected(null)
    setShowFeedback(false)
  }

  const restart = (c, e) => {
    e?.stopPropagation()
    save({ ...progress, [c.id]: { step: 0, completed: false } })
    startCase(c, 0)
  }

  const handleAnswer = (i) => {
    if (showFeedback) return
    setSelected(i)
    setShowFeedback(true)
  }

  const handleNext = () => {
    const next = activeStep + 1
    if (next >= activeCase.steps.length) {
      save({ ...progress, [activeCase.id]: { step: 0, completed: true } })
      setActiveCase(null)
    } else {
      save({ ...progress, [activeCase.id]: { step: next, completed: false } })
      setActiveStep(next)
      setSelected(null)
      setShowFeedback(false)
    }
  }

  /* ── Case simulation view ── */
  if (activeCase) {
    const step = activeCase.steps[activeStep]
    const chosen = selected != null ? step.options[selected] : null
    const total = activeCase.steps.length

    return (
      <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setActiveCase(null)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to modules
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{activeCase.number} {activeCase.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i < activeStep ? 'bg-blue-600' : i === activeStep ? 'bg-blue-400' : 'bg-slate-200'}`} />
            ))}
            <span className="text-xs text-slate-400 ml-1">{activeStep + 1}/{total}</span>
          </div>
        </header>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 grid grid-cols-5 gap-6 items-start">
          {/* Scenario panel */}
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sticky top-20">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Case Briefing</p>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{activeCase.fullScenario}</p>
          </div>

          {/* Step panel */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Step {activeStep + 1} of {total} — {step.title}</p>
              <p className="text-slate-900 font-semibold text-base leading-snug mb-5">{step.question}</p>

              <div className="space-y-2">
                {step.options.map((opt, i) => {
                  let cls = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                  if (showFeedback) {
                    if (i === selected) cls = opt.correct ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-red-50 border-red-400 text-red-900'
                    else if (opt.correct) cls = 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    else cls = 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-snug transition-all ${cls}`}
                    >
                      {opt.text}
                    </button>
                  )
                })}
              </div>

              {showFeedback && chosen && (
                <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${chosen.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                  <p className="font-semibold mb-1">{chosen.correct ? '✓ Correct' : '✗ Incorrect'}</p>
                  {chosen.feedback}
                </div>
              )}
            </div>

            {showFeedback && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {activeStep < total - 1 ? 'Next Step →' : 'Complete Case ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── Dashboard view ── */
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Home
            </button>
          )}
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AML</div>
            <span className="text-sm font-semibold text-slate-800">AML Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-semibold text-blue-700">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-500 hidden sm:block">{user.name}</span>
            </div>
          )}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              AI Assistant
            </button>
          )}
          {onSignOut && (
            <button onClick={onSignOut} className="text-xs text-slate-400 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Sign out
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {role === 'mlro' ? 'MLRO' : 'Analyst'} Training Modules
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {role === 'mlro'
              ? 'Review escalated cases from analysts. Sign off, send back with conditions, or escalate to SAR / DAML.'
              : 'Investigative training for AML case analysis and decision-making.'}
          </p>
        </div>

        {/* Industry pill */}
        <div className="w-full bg-slate-300/60 rounded-full py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
          Banking
        </div>

        {/* Case grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cases.map((c) => {
            const prog = progress[c.id]
            const inProgress = prog && !prog.completed && prog.step > 0
            const completed = prog?.completed
            const locked = c.premium && !isPremium

            return (
              <div
                key={c.id}
                className={`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col relative ${locked ? 'opacity-60' : ''}`}
              >
                {locked && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.tags.filter(t => t !== 'Premium').map((t) => (
                    <span key={t} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLE[t]}`}>{t}</span>
                  ))}
                  {inProgress && <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLE['In Progress']}`}>In Progress</span>}
                  {completed && <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLE['Completed']}`}>Completed</span>}
                  {locked && <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLE['Premium']}`}>Premium</span>}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2">{c.number} {c.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-5">{c.shortDesc}</p>

                <div className="flex items-center justify-end gap-3">
                  {locked ? (
                    <>
                      <span className="text-xs text-indigo-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        Unlock with Premium
                      </span>
                      <button onClick={onUpgrade} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold transition-colors">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        Upgrade to Unlock
                      </button>
                    </>
                  ) : inProgress ? (
                    <>
                      <button onClick={() => startCase(c)} className="text-sm text-slate-700 font-medium hover:text-blue-600 transition-colors">Continue</button>
                      <button onClick={(e) => restart(c, e)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restart
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startCase(c, 0)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {completed ? 'Retake' : 'Start'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Premium upsell banner */}
        {!isPremium && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <p className="font-bold text-slate-900 mb-1">Free plan: locked to Banking</p>
            <p className="text-slate-600 text-sm mb-5">
              Want access to <strong>Law</strong>, <strong>Crypto</strong>, <strong>Fintech</strong> and other industry modules? Upgrade to <strong>Premium</strong> to unlock every track, switch between industries anytime, and resume any case files you've already started in other modules.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button onClick={onUpgrade} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-sm transition-colors">
                Upgrade to Premium — $49.99/mo
              </button>
              <span className="text-sm text-slate-500">7-day free trial · cancel anytime</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
