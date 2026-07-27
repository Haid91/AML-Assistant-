import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

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

const CAMS_MODULES = [
  {
    id: 'cams1', number: 'Chapter 1', isExam: true,
    title: 'Risks and Methods of ML & Terrorist Financing',
    tags: ['CAMS Prep'], sector: 'CAMS', premium: true,
    shortDesc: 'The three-stage ML cycle, key typologies, terrorist financing distinctions, predicate offences, and detection indicators.',
    fullScenario: `CAMS EXAM PREP — Chapter 1\n\nRisks and Methods of Money Laundering & Terrorist Financing\n\nThis chapter covers:\n• The three-stage ML cycle: placement, layering, integration\n• Key ML typologies (trade-based ML, real estate, shell companies)\n• Terrorist financing vs. money laundering\n• Predicate offences\n• Red flags and detection indicators`,
    steps: [
      {
        id: 1, title: 'The Three Stages',
        question: "Which of the following BEST describes the placement stage of money laundering?",
        options: [
          { text: 'Introducing illegal proceeds into the financial system for the first time — e.g., depositing drug-sale cash into a bank account', correct: true, feedback: 'Correct. Placement is the first and most vulnerable stage — physically moving cash into the financial system carries the highest detection risk. Common methods include cash deposits, currency exchanges, and smurfing.' },
          { text: 'Converting illegal funds into other instruments to create a complex audit trail', correct: false, feedback: 'This describes layering — the second stage, where criminals distance funds from their source through multiple transactions, wire transfers, or asset conversions.' },
          { text: 'Reinvesting laundered funds into the legitimate economy through property or investments', correct: false, feedback: 'This describes integration — the final stage where laundered funds re-enter the economy and are indistinguishable from legitimate wealth.' },
          { text: 'Using shell companies to obscure the beneficial owner of criminal proceeds', correct: false, feedback: 'Shell companies are primarily a layering technique used to create corporate distance between the criminal and the funds.' },
        ],
      },
      {
        id: 2, title: 'Layering Techniques',
        question: "A drug trafficker deposits $500,000 into a café account, then wires it through five shell company accounts across three jurisdictions before converting the balance to gold bullion. The wire transfer phase is an example of:",
        options: [
          { text: 'Layering — creating complex, cross-jurisdictional transaction chains to distance funds from their criminal origin', correct: true, feedback: 'Correct. Layering is designed to obscure the audit trail. Multiple wire transfers through multiple jurisdictions and entities are among the most common layering techniques because they exploit correspondent banking relationships and jurisdictional complexity.' },
          { text: 'Placement — the first entry of funds into the financial system', correct: false, feedback: 'Placement already occurred when the funds entered the café account. The wire transfer phase comes after initial placement.' },
          { text: 'Integration — re-entering the legitimate economy', correct: false, feedback: 'Integration would occur when the gold bullion is sold and proceeds used for legitimate purchases. The wire transfer phase is still separating funds from their criminal source.' },
          { text: 'Trade-based money laundering (TBML)', correct: false, feedback: 'TBML involves manipulating trade documents (invoices, letters of credit). Wire transfers through shell companies are a different layering technique.' },
        ],
      },
      {
        id: 3, title: 'ML vs. Terrorist Financing',
        question: "Which statement MOST accurately describes the PRIMARY distinction between money laundering and terrorist financing?",
        options: [
          { text: 'Money laundering generates proceeds from crime and seeks to legitimise them; terrorist financing may use legitimately sourced funds directed toward illegal activity', correct: true, feedback: 'Correct. This is the fundamental distinction. ML is always proceeds-driven (funds come FROM crime). TF can use clean money directed TO illegal purposes — making it harder to detect through traditional financial profiling.' },
          { text: 'Terrorist financing always involves larger sums than money laundering', correct: false, feedback: 'Incorrect. TF operations are often low-cost — the 9/11 attacks cost approximately $400,000–$500,000. Transaction size is not a reliable distinguisher.' },
          { text: 'Money laundering requires an international element; terrorist financing is purely domestic', correct: false, feedback: 'Both ML and TF can be domestic or international. The cross-border element is not what distinguishes them.' },
          { text: 'Terrorist financing is only conducted through informal value transfer systems like hawala', correct: false, feedback: 'TF uses many channels including formal banking, charities, cash couriers, and digital assets — not exclusively hawala.' },
        ],
      },
      {
        id: 4, title: 'Trade-Based ML',
        question: "A company consistently over-invoices imports from a related foreign supplier by 40%, pays the inflated amounts through the banking system, and the surplus is refunded to an offshore account. This is BEST described as:",
        options: [
          { text: 'Trade-based money laundering (TBML) — using the international trade system to transfer value and obscure its origin', correct: true, feedback: 'Correct. TBML is one of the most difficult typologies to detect because it exploits the complexity of international trade. Over-invoicing, under-invoicing, multiple invoicing, and falsely described goods are all TBML techniques.' },
          { text: 'Real estate laundering — using property to convert and clean criminal proceeds', correct: false, feedback: 'Real estate laundering involves purchasing property with criminal proceeds. This scenario involves trade transactions, not property.' },
          { text: 'Loan-back scheme — using criminal funds disguised as a loan repayment', correct: false, feedback: 'Loan-back schemes involve criminals lending themselves their own criminal proceeds through a shell company, then "repaying" the loan to create legitimate-looking income.' },
          { text: 'Structuring — breaking transactions into smaller amounts to avoid reporting thresholds', correct: false, feedback: 'Structuring involves splitting cash transactions below reporting thresholds. This scenario involves inflated trade invoices — a different method.' },
        ],
      },
      {
        id: 5, title: 'Structuring / Smurfing',
        question: "An individual makes 11 cash deposits of $9,100 over three weeks across four branches, totalling $100,100. This practice is BEST described as:",
        options: [
          { text: 'Structuring (smurfing) — deliberately splitting transactions to stay below reporting thresholds', correct: true, feedback: 'Correct. Structuring is illegal in most jurisdictions regardless of whether the underlying funds are criminal. Deliberately fragmenting transactions to avoid regulatory reporting is itself a criminal offence (31 USC §5324 in the US; s.140 of the AML/CTF Act in Australia).' },
          { text: 'Integration — using the deposits to fund legitimate purchases', correct: false, feedback: 'Integration occurs when laundered funds re-enter the economy. The deposits described suggest placement/layering, not the final integration stage.' },
          { text: 'Layering — moving funds through complex transaction chains', correct: false, feedback: 'Layering typically involves converting funds through multiple institutions or jurisdictions. The pattern here is specifically about avoiding a reporting threshold — the defining characteristic of structuring.' },
          { text: 'Normal business activity — small businesses often deposit daily takings across branches', correct: false, feedback: 'While possible, 11 deposits across four branches each just below the reporting threshold, totalling $100,100, creates reasonable grounds for suspicion and warrants investigation.' },
        ],
      },
      {
        id: 6, title: 'Predicate Offences',
        question: "Under the FATF Recommendations, which of the following is classified as a predicate offence for money laundering?",
        options: [
          { text: 'All serious offences — including drug trafficking, corruption, fraud, tax crimes, and human trafficking. FATF recommends a broad approach covering all serious crimes', correct: true, feedback: 'Correct. FATF Recommendation 3 requires ML to apply to all serious offences. FATF specifically designates categories including drug trafficking, organised crime, terrorism, human trafficking, corruption, fraud, tax crimes, counterfeiting, cybercrime, and environmental crime.' },
          { text: 'Only drug trafficking — the original focus of AML frameworks at their establishment', correct: false, feedback: 'While AML frameworks originally focused on drug proceeds (the 1988 Vienna Convention), FATF has progressively expanded the predicate offence scope. Tax crimes and corruption were not added until 2012.' },
          { text: 'Only offences that cross international borders', correct: false, feedback: 'FATF does not require an international element. Domestic predicate offences are equally covered.' },
          { text: 'Only offences punishable by more than 10 years imprisonment', correct: false, feedback: 'FATF allows jurisdictions to define serious offences by penalty thresholds or designated category lists. The 10-year threshold is one permitted option, not the only one.' },
        ],
      },
    ],
  },
  {
    id: 'cams2', number: 'Chapter 2', isExam: true,
    title: 'International AML/CFT Standards',
    tags: ['CAMS Prep'], sector: 'CAMS', premium: true,
    shortDesc: 'FATF 40 Recommendations, grey/black lists, Basel Committee guidance, Wolfsberg Principles, and the Egmont Group.',
    fullScenario: `CAMS EXAM PREP — Chapter 2\n\nInternational AML/CFT Standards\n\nThis chapter covers:\n• FATF's 40 Recommendations and their structure\n• FATF grey list / black list\n• Basel Committee on Banking Supervision AML guidance\n• Wolfsberg Group — private banking and correspondent banking principles\n• Egmont Group — FIU intelligence exchange\n• Key international conventions (Vienna, Palermo, UN Security Council Resolutions)`,
    steps: [
      {
        id: 1, title: 'FATF Mandate',
        question: "The Financial Action Task Force (FATF) was established in 1989 with which PRIMARY mandate?",
        options: [
          { text: 'To set global standards and promote effective implementation of legal, regulatory, and operational measures to combat ML, TF, and proliferation financing', correct: true, feedback: 'Correct. FATF is an intergovernmental policy-making body — it does not prosecute. It develops standards (the 40 Recommendations) and assesses compliance through mutual evaluations. Its 2012 mandate was expanded to include proliferation financing.' },
          { text: 'To prosecute money launderers across member jurisdictions', correct: false, feedback: 'FATF does not prosecute individuals. Prosecution remains the exclusive domain of national law enforcement and judiciary.' },
          { text: 'To fund national financial intelligence units (FIUs)', correct: false, feedback: 'FATF does not fund FIUs. The Egmont Group, not FATF, provides the international network for FIU cooperation.' },
          { text: 'To manage the global list of sanctioned individuals and entities', correct: false, feedback: 'Sanctions lists are maintained by national authorities (OFAC, OFSI) and international bodies (UN Security Council). FATF manages grey/black lists for jurisdictions, not individual sanctions.' },
        ],
      },
      {
        id: 2, title: 'FATF Grey List',
        question: "A country placed on the FATF 'grey list' (Jurisdictions Under Increased Monitoring) indicates that:",
        options: [
          { text: 'The country has identified strategic AML/CFT deficiencies and has committed to an action plan to address them under FATF oversight', correct: true, feedback: 'Correct. Grey-listed countries work WITH FATF on remediation. Financial institutions must apply enhanced due diligence to these jurisdictions but are not required to terminate relationships.' },
          { text: 'All transactions with that country must be terminated immediately', correct: false, feedback: 'Grey listing requires EDD — not prohibition. FATF Recommendation 19 requires EDD for relationships with grey-listed jurisdictions, not blanket prohibition.' },
          { text: 'The country has no functional AML laws or FIU in place', correct: false, feedback: 'Grey listing can apply to jurisdictions that have AML frameworks but face deficiencies in specific areas. A total absence of AML framework is more characteristic of black-listed jurisdictions.' },
          { text: 'The country poses no elevated risk — grey listing is a routine assessment category', correct: false, feedback: 'Grey listing does indicate elevated risk and triggers EDD obligations. It is not a neutral category.' },
        ],
      },
      {
        id: 3, title: 'FATF Recommendation 10: CDD',
        question: "According to FATF Recommendation 10, financial institutions must apply Customer Due Diligence (CDD) in which circumstances?",
        options: [
          { text: 'When establishing business relationships, conducting occasional transactions at or above thresholds, when suspecting ML/TF, or when doubting previously obtained identification information', correct: true, feedback: 'Correct. FATF R.10 specifies these four CDD trigger events. The occasional transaction threshold is €15,000 (approximately USD 15,000) or above. Simplified CDD may apply in low-risk situations; enhanced CDD applies to high-risk situations.' },
          { text: 'Only when establishing new customer relationships — ongoing monitoring is voluntary', correct: false, feedback: 'Ongoing monitoring (including periodic CDD refresh) is mandatory under FATF R.10. The obligation includes ensuring transactions are consistent with the institution\'s knowledge of the customer.' },
          { text: 'Only for high-risk customers, PEPs, and those involving cross-border transactions', correct: false, feedback: 'CDD applies to all customers. The level of CDD (simplified, standard, enhanced) varies by risk, but the obligation applies universally.' },
          { text: 'Only when instructed by the national supervisor following an audit finding', correct: false, feedback: 'CDD is a proactive legal obligation — not a reactive response to regulatory instruction.' },
        ],
      },
      {
        id: 4, title: 'Wolfsberg Group',
        question: "The Wolfsberg Group is BEST described as:",
        options: [
          { text: 'An association of leading global banks that develops financial crime risk management frameworks and guidance for the private sector', correct: true, feedback: 'Correct. The Wolfsberg Group (formed in 2000) consists of 13 global banks. It produces non-binding guidance such as the Correspondent Banking Due Diligence Questionnaire (CBDDQ), Trade Finance Principles, and Anti-Bribery and Corruption Principles. It is industry-led, not regulatory.' },
          { text: 'A sub-committee of the Basel Committee on Banking Supervision', correct: false, feedback: 'The Wolfsberg Group is independent of the Basel Committee. It is an industry body, not a regulatory or supervisory authority.' },
          { text: 'A FATF monitoring body responsible for assessing member countries', correct: false, feedback: 'Mutual evaluations are conducted by FATF and its regional bodies (FSRBs) — not the Wolfsberg Group.' },
          { text: 'The UN agency responsible for countering terrorist financing', correct: false, feedback: 'UN counter-terrorism functions are handled by bodies such as the CTC and UNODC. Wolfsberg is a private banking industry association.' },
        ],
      },
      {
        id: 5, title: 'Egmont Group',
        question: "The Egmont Group's PRIMARY function in the international AML framework is to:",
        options: [
          { text: 'Facilitate secure and rapid exchange of financial intelligence between member Financial Intelligence Units (FIUs) worldwide', correct: true, feedback: 'Correct. The Egmont Group (established 1995) connects FIUs across 166+ member jurisdictions. It operates the Egmont Secure Web (ESW) for encrypted FIU-to-FIU intelligence sharing. It does not regulate financial institutions or set AML standards.' },
          { text: 'Enforce sanctions against countries that fail FATF mutual evaluations', correct: false, feedback: 'Enforcement is conducted by national governments and the UN Security Council. The Egmont Group facilitates FIU cooperation — it has no enforcement powers.' },
          { text: 'Set international accounting standards for AML compliance reporting', correct: false, feedback: 'Accounting standards are developed by the IASB and FASB. Egmont focuses exclusively on FIU-to-FIU intelligence exchange.' },
          { text: 'Train national law enforcement officers in financial investigation methodology', correct: false, feedback: 'Training is offered by many organisations (UNODC, ILEA, ACAMS), but the Egmont Group\'s primary mandate is FIU intelligence exchange, not training.' },
        ],
      },
      {
        id: 6, title: 'Correspondent Banking',
        question: "Under FATF Recommendation 13, financial institutions are PROHIBITED from entering into correspondent banking relationships with:",
        options: [
          { text: 'Shell banks — banks incorporated in jurisdictions where they have no physical presence and are not affiliated with a regulated financial group', correct: true, feedback: 'Correct. FATF R.13 explicitly prohibits correspondent relationships with shell banks. This prohibition exists because shell banks lack effective supervision and AML controls.' },
          { text: 'Any bank headquartered in a FATF grey-listed jurisdiction', correct: false, feedback: 'Grey listing triggers EDD obligations — not prohibition. Institutions may maintain relationships with grey-listed jurisdictions under enhanced scrutiny.' },
          { text: 'Any foreign bank that has not undergone a FATF mutual evaluation', correct: false, feedback: 'The obligation is to assess the respondent\'s own AML controls — not to verify whether their jurisdiction has been formally evaluated.' },
          { text: 'Banks that have filed SARs in the prior 12 months', correct: false, feedback: 'SAR filings are a compliance positive. Sharing SAR filing history is generally prohibited by confidentiality rules.' },
        ],
      },
    ],
  },
  {
    id: 'cams3', number: 'Chapter 3', isExam: true,
    title: 'AML/CFT Compliance Programs',
    tags: ['CAMS Prep'], sector: 'CAMS', premium: true,
    shortDesc: 'The four pillars of an AML program, CDD/EDD, beneficial ownership, PEPs, EWRA, and suspicious activity identification.',
    fullScenario: `CAMS EXAM PREP — Chapter 3\n\nAML/CFT Compliance Programs\n\nThis chapter covers:\n• Four pillars of an effective AML/CFT compliance program\n• Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD)\n• Beneficial ownership — definition and thresholds\n• Politically Exposed Persons (PEPs) — identification and treatment\n• Enterprise-Wide Risk Assessment (EWRA)\n• Identifying and escalating suspicious activity`,
    steps: [
      {
        id: 1, title: 'The Four Pillars',
        question: "The four core elements (pillars) of an effective AML compliance program as recognised by US regulators and ACAMS are:",
        options: [
          { text: 'Policies and procedures, a designated compliance officer, ongoing employee training, and independent testing (audit)', correct: true, feedback: 'Correct. These four pillars are embedded in the US Bank Secrecy Act regulatory framework and cited by the OCC, FinCEN, FDIC, and Federal Reserve. They have been adopted globally as the baseline AML program architecture. A fifth pillar — CDD — was formally added to US regulations in 2018.' },
          { text: 'Risk assessment, transaction monitoring, SAR filing, and customer screening', correct: false, feedback: 'These are important AML activities but not the four foundational pillars. The pillars describe the structural framework — not specific operational functions.' },
          { text: 'CDD, EDD, ongoing monitoring, and sanctions screening', correct: false, feedback: 'These are components of the customer management lifecycle, not the four program pillars.' },
          { text: 'Governance, detection, investigation, and reporting', correct: false, feedback: 'This is a logical operational sequence but not the established four-pillar framework.' },
        ],
      },
      {
        id: 2, title: 'EDD Triggers',
        question: "Under a risk-based approach, Enhanced Due Diligence (EDD) is MOST appropriate for which of the following situations?",
        options: [
          { text: 'A foreign Politically Exposed Person (PEP) opening a private banking relationship with expected high-value asset management', correct: true, feedback: 'Correct. PEPs represent elevated ML/corruption risk. FATF R.12 specifically requires EDD for PEPs. Private banking adds additional risk. EDD for PEPs must include senior management approval, source-of-wealth/funds verification, and enhanced ongoing monitoring.' },
          { text: 'A domestic retail customer opening a standard current account with a salary direct deposit', correct: false, feedback: 'Standard CDD applies. Low-risk customers (domestic, identifiable, standard product, consistent purpose) warrant simplified or standard CDD — not EDD.' },
          { text: 'A small local business applying for a basic trade finance facility with documented invoices', correct: false, feedback: 'Trade finance can present risk, but a small local business with documented invoices is not automatically an EDD trigger without additional risk indicators.' },
          { text: 'An existing customer making a one-off transaction above €15,000 for a property purchase', correct: false, feedback: 'A one-off threshold transaction triggers CDD — not automatically EDD. Whether EDD is required depends on the customer\'s overall risk rating and the transaction context.' },
        ],
      },
      {
        id: 3, title: 'Beneficial Ownership',
        question: "Under most global AML frameworks (FATF R.24/25), beneficial ownership typically covers natural persons who:",
        options: [
          { text: 'Own or control 25% or more of a legal entity, OR exercise effective control over the entity regardless of ownership percentage', correct: true, feedback: 'Correct. The 25% threshold is standard internationally (FATF, EU AMLD, US FinCEN). However, the "control" prong is equally important — a person owning less than 25% but exercising effective control as CEO or senior officer must also be identified.' },
          { text: 'Own any shares in a legal entity, regardless of percentage', correct: false, feedback: 'A 0% threshold is impractical for large public companies with thousands of shareholders. The 25% threshold (with a control prong) is the global standard.' },
          { text: 'Only the registered directors of a legal entity', correct: false, feedback: 'Directors may or may not be beneficial owners. Beneficial ownership looks through the corporate structure to the natural person(s) who ultimately own or control — which may differ from registered directors.' },
          { text: 'Only foreign nationals — domestic shareholders are generally exempt', correct: false, feedback: 'Beneficial ownership requirements apply to all legal entities regardless of owner nationality. There is no domestic exemption under FATF standards.' },
        ],
      },
      {
        id: 4, title: 'PEP Identification',
        question: "Which of the following is MOST accurately classified as a Politically Exposed Person (PEP) under FATF Recommendation 12?",
        options: [
          { text: 'A current serving cabinet minister in a foreign government', correct: true, feedback: 'Correct. FATF R.12 defines PEPs as individuals entrusted with prominent public functions — including heads of state or government, senior politicians, senior government officials, senior judicial/military officials, senior SOE executives, and senior party officials. Foreign PEPs require mandatory EDD.' },
          { text: 'A senior manager at a large multinational private corporation', correct: false, feedback: 'Corporate executives of private entities are not PEPs under FATF standards. PEP status relates to public function, not corporate seniority.' },
          { text: 'A retired judge who left the bench 18 months ago', correct: false, feedback: 'Former PEPs present a nuanced question — FATF requires institutions to consider risk on a case-by-case basis for former PEPs considering the nature of the role, jurisdiction risk, and time since leaving office.' },
          { text: 'A senior police officer in a low-corruption jurisdiction', correct: false, feedback: 'Senior law enforcement officials can be PEPs per FATF guidance, but a current foreign cabinet minister is the clearest and highest-risk example of a PEP.' },
        ],
      },
      {
        id: 5, title: 'EWRA',
        question: "When should an Enterprise-Wide Risk Assessment (EWRA) be reviewed or updated?",
        options: [
          { text: 'When there are significant changes to the business — including new products, customer segments, delivery channels, technology, or material regulatory changes', correct: true, feedback: 'Correct. The EWRA is a living document. Trigger events include new products/services, new geographic markets, new customer segments, new technology (e.g., digital onboarding), significant ownership changes, and material regulatory developments. Most regulators also expect minimum periodic review (typically annual or biennial) even without trigger events.' },
          { text: 'Only on a fixed three-year schedule aligned with FATF mutual evaluation cycles', correct: false, feedback: 'FATF mutual evaluations are country-level assessments, not a driver for institutional EWRA schedules.' },
          { text: 'Only following a regulatory examination or enforcement action', correct: false, feedback: 'A reactive-only approach is itself a compliance deficiency. The EWRA should proactively reflect current risk.' },
          { text: 'Every five years, in line with FATF\'s Technology Sub-Group review cycle', correct: false, feedback: 'There is no five-year EWRA cycle linked to any FATF body. This is not a recognised standard.' },
        ],
      },
      {
        id: 6, title: 'Suspicious Activity — Red Flags',
        question: "Which of the following is the MOST reliable red flag indicating potential money laundering?",
        options: [
          { text: 'A customer\'s transaction pattern is inconsistent with their stated business purpose, income profile, or prior account activity — and they are unable or unwilling to provide a satisfactory explanation', correct: true, feedback: 'Correct. The core principle of suspicion is unexplained inconsistency — a gap between what is known about a customer and what is observed in their transactions. Unexplained wealth, cash volumes, or counterparties are the most reliable red flags because they require investigative response rather than mechanical rule-matching.' },
          { text: 'A customer deposits large amounts of cash into their account', correct: false, feedback: 'Cash deposits are a risk indicator, not a definitive red flag. Cash is normal for many legitimate businesses. The key question is whether cash volume is consistent with the customer\'s stated business.' },
          { text: 'A customer conducts multiple transactions in a single day', correct: false, feedback: 'Multiple daily transactions are common in legitimate business and personal banking. Activity frequency alone is not a red flag without further context.' },
          { text: 'A customer requests wire transfers to foreign accounts', correct: false, feedback: 'International transfers are normal for international business and personal remittances. Geography alone is not a red flag.' },
        ],
      },
    ],
  },
  {
    id: 'cams4', number: 'Chapter 4', isExam: true,
    title: 'Conducting and Responding to Investigations',
    tags: ['CAMS Prep'], sector: 'CAMS', premium: true,
    shortDesc: 'SAR/STR drafting, filing timelines, tipping-off prohibition, safe harbour protection, and law enforcement cooperation.',
    fullScenario: `CAMS EXAM PREP — Chapter 4\n\nConducting and Responding to Investigations\n\nThis chapter covers:\n• Identifying suspicious activity and internal escalation\n• SAR/STR content standards and filing timelines\n• Tipping-off prohibition and safe harbour protection\n• Responding to law enforcement requests and court orders\n• Internal investigation procedures and documentation\n• Account action decisions following SAR filing`,
    steps: [
      {
        id: 1, title: 'SAR Content Standards',
        question: "Which element is MOST critical to the quality and usefulness of a Suspicious Activity Report (SAR/STR)?",
        options: [
          { text: 'A clear, factual narrative explaining what activity was observed, why it is suspicious, when it occurred, and how it was detected — supported by specific transaction details', correct: true, feedback: 'Correct. FinCEN and AUSTRAC guidance consistently identify the narrative as the most valuable part of an SAR. A high-quality narrative uses specific dates, amounts, and counterparties; explains the detection mechanism; describes investigation steps; includes any customer explanation; and states why that explanation was accepted or rejected.' },
          { text: 'The customer\'s full credit history and financial statements', correct: false, feedback: 'Credit history is not a standard SAR requirement. While financial context is relevant, the SAR narrative and transaction data are the core components.' },
          { text: 'Confirmation that the customer has been notified of the filing', correct: false, feedback: 'This would be a tipping-off violation. In virtually all jurisdictions, notifying a subject that an SAR has been filed is a criminal offence.' },
          { text: 'A recommendation for specific law enforcement action', correct: false, feedback: 'SARs are intelligence reports — not prosecutorial recommendations. The institution reports what it knows and suspects; law enforcement determines what action to take.' },
        ],
      },
      {
        id: 2, title: 'SAR Filing Timeline',
        question: "Under US Bank Secrecy Act regulations, a financial institution must file a SAR within how many calendar days of initially detecting a reportable suspicious transaction?",
        options: [
          { text: '30 calendar days from initial detection, extendable to 60 days if the subject is unidentified at the time of detection', correct: true, feedback: 'Correct. 31 CFR §1020.320 requires SAR filing within 30 days. The 60-day extension applies only when the subject is initially unidentified. For continuing suspicious activity, continuing SARs should be filed every 90 days. Note: Australia (AUSTRAC) requires reporting within 3 business days of forming a suspicion.' },
          { text: '7 business days from the date the transaction occurred', correct: false, feedback: '7 business days is not a US BSA SAR filing timeline. 30 calendar days from detection is the standard.' },
          { text: '15 calendar days from initial detection with no extension permitted', correct: false, feedback: 'Not a recognised SAR timeline under US or most international frameworks.' },
          { text: '90 days from the date of the suspicious transaction', correct: false, feedback: '90 days applies to continuing SAR filing on ongoing suspicious activity — not the initial filing deadline.' },
        ],
      },
      {
        id: 3, title: 'Tipping Off',
        question: "After filing an SAR, a customer calls asking why their account is restricted. An employee says: 'Your account was flagged for suspicious activity and we\'ve reported it to regulators.' This response is:",
        options: [
          { text: 'A criminal tipping-off offence — disclosing that an SAR has been filed or that the account was flagged for suspicious activity is prohibited by law in virtually all jurisdictions', correct: true, feedback: 'Correct. Tipping off is a criminal offence (31 USC §5318(g)(2) in the US; s.123 of the AML/CTF Act in Australia; s.333A of POCA in the UK). The correct response is a neutral statement such as "there is a security review on your account." Staff should not be told about the SAR — only that a compliance hold exists.' },
          { text: 'Acceptable if the customer provides a satisfactory explanation during the call', correct: false, feedback: 'The tipping-off prohibition is absolute — not conditioned on the customer\'s explanation. No response justifies disclosing an SAR filing.' },
          { text: 'Acceptable because the restriction already alerts the customer to the investigation', correct: false, feedback: 'The account restriction itself does not constitute tipping off. Tipping off occurs at the point of explicit disclosure — confirming the SAR or investigation crosses the line.' },
          { text: 'Required as a matter of procedural fairness to the customer', correct: false, feedback: 'There is no right of notification for SAR subjects. The purpose of SAR confidentiality is to preserve law enforcement intelligence integrity.' },
        ],
      },
      {
        id: 4, title: 'Safe Harbour',
        question: "The 'safe harbour' protection under US and most international AML laws protects financial institutions from civil liability when they:",
        options: [
          { text: 'File SARs in good faith, even if the reported activity subsequently proves not to be criminal', correct: true, feedback: 'Correct. Safe harbour (31 USC §5318(g)(3)) protects institutions and employees from civil liability for SAR disclosures made in good faith. Without it, institutions might face defamation or breach-of-confidentiality claims. The protection requires good faith — fraudulent or malicious SARs are not protected.' },
          { text: 'Decline high-risk customers without documenting the reason', correct: false, feedback: 'Safe harbour relates specifically to SAR filing — not to customer declination decisions. De-risking decisions have their own documentation requirements.' },
          { text: 'Cooperate with law enforcement voluntarily without first obtaining a court order', correct: false, feedback: 'Voluntary law enforcement cooperation is generally permitted. Safe harbour specifically addresses the civil liability risk arising from SAR filings.' },
          { text: 'Apply EDD retroactively to existing customers without notice', correct: false, feedback: 'Retroactive EDD is a CDD governance matter. Safe harbour is specifically about immunity from civil claims arising from SAR filings.' },
        ],
      },
      {
        id: 5, title: 'Law Enforcement Requests',
        question: "Law enforcement presents a valid grand jury subpoena for a customer\'s transaction records. The institution should:",
        options: [
          { text: 'Consult legal counsel, comply with the subpoena, and NOT notify the customer — grand jury secrecy rules prohibit disclosure', correct: true, feedback: 'Correct. Grand jury subpoenas carry secrecy obligations — notifying the customer would violate grand jury rules and could constitute obstruction of justice. The institution should: verify the subpoena is facially valid; involve legal counsel; produce records within the required timeframe; and log the production.' },
          { text: 'Notify the customer before releasing any records — privacy regulations require advance notice', correct: false, feedback: 'Grand jury secrecy (Fed. R. Crim. P. 6(e)) and tipping-off principles prohibit customer notification for legally compelled production.' },
          { text: 'Refuse to produce records — a search warrant is required, not a subpoena', correct: false, feedback: 'A grand jury subpoena is a valid legal instrument for compelling document production from third parties. Refusal to comply can be criminal contempt.' },
          { text: 'File a new SAR to report the fact that law enforcement has presented a subpoena', correct: false, feedback: 'Receipt of a grand jury subpoena alone is not a suspicious transaction requiring an SAR.' },
        ],
      },
      {
        id: 6, title: 'Account Action Post-SAR',
        question: "An SAR has been filed on a high-value customer. Which account action approach is MOST appropriate?",
        options: [
          { text: 'Apply a debit restriction proportionate to the suspicious funds while awaiting law enforcement direction, document the rationale, and coordinate further action with legal counsel', correct: true, feedback: 'Correct. Account action after SAR filing is within the institution\'s risk management authority. A debit restriction does not constitute tipping off. Document the decision carefully — the decision-making process may later be scrutinised by law enforcement or regulators.' },
          { text: 'Immediately close the account and return funds to the customer', correct: false, feedback: 'Immediate closure and return of funds risks tipping off the customer and potentially facilitating money laundering by returning suspicious funds. Closure decisions should involve legal counsel and, where appropriate, law enforcement guidance.' },
          { text: 'Take no action — FinCEN/AUSTRAC will instruct you after receiving the SAR', correct: false, feedback: 'FIUs do not proactively instruct institutions on account action after receiving SARs. They disseminate intelligence to law enforcement. The institution must exercise its own risk management judgment.' },
          { text: 'Close the account without explanation and refuse to confirm or deny the reason', correct: false, feedback: 'An unexplained abrupt closure may expose the institution to legal challenge. A "security review" holding position while coordinating with legal counsel is more defensible.' },
        ],
      },
    ],
  },
]

const TAG_STYLE = {
  Escalation: 'bg-amber-100 text-amber-700 border border-amber-200',
  Regulatory: 'bg-pink-100 text-pink-700 border border-pink-200',
  Premium: 'bg-indigo-100 text-indigo-600 border border-indigo-200',
  'CAMS Prep': 'bg-violet-100 text-violet-700 border border-violet-200',
  'In Progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  Completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
}

export default function Training({ user, onBack, onSignOut, onOpenChat, onUpgrade }) {
  const isPremium = user?.premium || false
  const [activeRole, setActiveRole] = useState(user?.role || 'analyst')
  const cases = activeRole === 'mlro' ? MLRO_CASES : activeRole === 'cams' ? CAMS_MODULES : ANALYST_CASES

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
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans flex flex-col">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setActiveCase(null)}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to modules
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{activeCase.number} {activeCase.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i < activeStep ? 'bg-blue-600' : i === activeStep ? 'bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">{activeStep + 1}/{total}</span>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 grid grid-cols-5 gap-6 items-start">
          {/* Scenario panel */}
          <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sticky top-20">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">{activeCase.isExam ? 'Chapter Overview' : 'Case Briefing'}</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">{activeCase.fullScenario}</p>
          </div>

          {/* Step panel */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{activeCase.isExam ? `Question ${activeStep + 1} of ${total}` : `Step ${activeStep + 1} of ${total}`} — {step.title}</p>
              <p className="text-slate-900 dark:text-white font-semibold text-base leading-snug mb-5">{step.question}</p>

              <div className="space-y-2">
                {step.options.map((opt, i) => {
                  let cls = 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer'
                  if (showFeedback) {
                    if (i === selected) cls = opt.correct ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-900 dark:text-red-300'
                    else if (opt.correct) cls = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400'
                    else cls = 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 cursor-default'
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
                <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${chosen.correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'}`}>
                  <p className="font-semibold mb-1">{chosen.correct ? '✓ Correct' : '✗ Incorrect'}</p>
                  {chosen.feedback}
                </div>
              )}
            </div>

            {showFeedback && (
              <button
                onClick={handleNext}
                className={`w-full py-3 text-white rounded-xl font-semibold text-sm transition-colors ${activeCase.isExam ? 'bg-violet-600 hover:bg-violet-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {activeStep < total - 1 ? (activeCase.isExam ? 'Next Question →' : 'Next Step →') : (activeCase.isExam ? 'Complete Module ✓' : 'Complete Case ✓')}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── Dashboard view ── */
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Home
            </button>
          )}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AML</div>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">AML Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-semibold text-blue-700">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">{user.name}</span>
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
          <ThemeToggle />
          {onSignOut && (
            <button onClick={onSignOut} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Sign out
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeRole === 'mlro' ? 'MLRO' : activeRole === 'cams' ? 'CAMS Certification Prep' : 'Analyst'} Training Modules
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {activeRole === 'mlro'
                ? 'Review escalated cases from analysts. Sign off, send back with conditions, or escalate to SAR / DAML.'
                : activeRole === 'cams'
                ? 'Exam-style MCQ questions based on the ACAMS CAMS Sixth Edition Study Guide. Premium required.'
                : 'Investigative training for AML case analysis and decision-making.'}
            </p>
          </div>

          {/* Role switcher */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm shrink-0">
            <button
              onClick={() => setActiveRole('analyst')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeRole === 'analyst'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Analyst
            </button>
            <button
              onClick={() => setActiveRole('mlro')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeRole === 'mlro'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              MLRO
            </button>
            <button
              onClick={() => setActiveRole('cams')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeRole === 'cams'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              CAMS Prep
            </button>
          </div>
        </div>

        {/* Industry pill */}
        <div className={`w-full rounded-full py-2 text-center text-xs font-semibold uppercase tracking-widest mb-6 ${activeRole === 'cams' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' : 'bg-slate-300/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'}`}>
          {activeRole === 'cams' ? 'ACAMS CAMS Certification — 6th Edition' : 'Banking'}
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
                className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col relative ${locked ? 'opacity-60' : ''}`}
              >
                {locked && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400">
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

                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-2">{c.number} {c.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed flex-1 mb-5">{c.shortDesc}</p>

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
                      <button onClick={() => startCase(c)} className="text-sm text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Continue</button>
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
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-6">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Free plan: locked to Banking</p>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-5">
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
