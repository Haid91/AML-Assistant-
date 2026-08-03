import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import OwnershipSimulation from './OwnershipSimulation'
import Navbar from './Navbar'

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
    tags: ['Regulatory'], sector: 'Banking', premium: false,
    shortDesc: "Analyst escalates onboarding of a deputy minister from a high-corruption jurisdiction who wants to open a private banking account.",
    fullScenario: `ANALYST ESCALATION — For MLRO Review & Onboarding Decision\n\nProspective client: Hon. Ibrahim Toure (age 52)\nPosition: Deputy Minister for Infrastructure, Republic of Kaslund (FATF grey-listed jurisdiction, Transparency International CPI rank: 142/180)\nService requested: Private banking relationship — investment account, initial funding £2.1M\n\nAnalyst findings:\n• Confirmed foreign PEP via World-Check and internal screening — current office holder\n• Declared source of wealth: "inheritance, salary, and business interests"\n• Declared annual ministerial salary: approximately £38,000/year equivalent\n• No supporting documentation provided for the £2.1M initial funding\n• Introduced by an existing private banking client (a Kaslund-based businessman)\n• No adverse media identified beyond standard PEP designation\n\nYour task: assess the CDD requirements, source-of-wealth evidence, and make the onboarding determination.`,
    steps: [
      {
        id: 1, title: 'PEP Classification',
        question: "What is the correct CDD classification for Hon. Ibrahim Toure?",
        options: [
          { text: "Foreign PEP requiring mandatory Enhanced Due Diligence — foreign PEP status alone triggers EDD regardless of transaction size, adverse media, or the individual's seniority within government", correct: true, feedback: "Correct. FATF Recommendation 12 and most national frameworks (including the UK MLR 2017 and the US BSA) require EDD for ALL foreign PEPs as a mandatory baseline — unlike domestic PEPs, where EDD is risk-based and only required when additional risk factors are present. A deputy minister squarely meets the 'prominent public function' definition." },
          { text: "Domestic PEP — lower risk since he is not a foreign national to his own government", correct: false, feedback: "Incorrect. 'Foreign PEP' is defined relative to the bank's own jurisdiction, not the individual's home government. A Kaslund government official opening an account at a UK or similarly-jurisdictioned bank is a foreign PEP to that bank, triggering the higher mandatory EDD standard." },
          { text: "Standard customer — a deputy minister is not senior enough to qualify as a PEP", correct: false, feedback: "Incorrect. FATF's PEP definition covers individuals 'entrusted with a prominent public function,' which explicitly includes deputy ministers, senior civil servants, and heads of state-owned enterprises — not only heads of state or cabinet ministers." },
          { text: "Simplified due diligence, since he was introduced by an existing trusted private banking client", correct: false, feedback: "Incorrect. An introducer's standing does not reduce or substitute for the mandatory EDD obligation attached to foreign PEP status. Introductions can create a false sense of comfort that must not override statutory CDD requirements." },
        ],
      },
      {
        id: 2, title: 'Source of Wealth Verification',
        question: "The declared salary (~£38,000/year) is grossly inconsistent with the requested £2.1M funding. What must the bank obtain before accepting the funds?",
        options: [
          { text: "Documented evidence of lifetime wealth accumulation — inheritance documentation, business ownership records and valuations, property sale evidence, or other legitimate income sufficient to plausibly explain the £2.1M, not just the source of this specific transfer", correct: true, feedback: "Correct. Source of wealth (how the customer accumulated their overall net worth) is distinct from source of funds (where this specific transaction's money came from) and is a mandatory EDD element for PEPs. A ministerial salary alone cannot explain £2.1M — the bank needs documented evidence covering the full gap, e.g. probate records for inheritance, audited accounts for business interests, or title deeds for property sales." },
          { text: "Accept his self-declaration of 'inheritance, salary, and business interests' as sufficient given his official position", correct: false, feedback: "Incorrect. Self-declarations carry no evidentiary weight, and official position does not exempt a PEP from documentary verification — if anything, the elevated corruption risk associated with prominent public officials makes documentary evidence more important, not less." },
          { text: "Ask only for evidence of where the specific £2.1M transfer originated, without needing to explain his broader wealth", correct: false, feedback: "Incorrect. This describes source-of-funds verification only. PEP EDD requires source-of-wealth verification — understanding the full picture of how the customer's overall net worth was accumulated — which is a materially higher bar than tracing a single transaction." },
          { text: "Rely on the introducer's personal vouching that Mr Toure's wealth is legitimate", correct: false, feedback: "Incorrect. A third party's assurance is not documentary evidence and cannot substitute for the bank's own independent verification obligation under EDD requirements for foreign PEPs." },
        ],
      },
      {
        id: 3, title: 'Approval Authority',
        question: "Who must approve establishing this relationship?",
        options: [
          { text: "Senior management — FATF Recommendation 12 and equivalent national requirements mandate senior management approval before establishing or continuing a business relationship with a PEP, in addition to (not instead of) the MLRO's own AML sign-off", correct: true, feedback: "Correct. PEP relationships require a distinct governance control: senior management approval, separate from and in addition to standard MLRO/compliance sign-off. This ensures accountability sits with individuals who can weigh the reputational and regulatory risk of the relationship, not just the technical AML assessment." },
          { text: "Branch-level manager sign-off is sufficient given the account has already passed PEP screening", correct: false, feedback: "Incorrect. Passing an initial screening check is not the same as completing the EDD and approval process. Branch-level sign-off does not meet the senior management approval standard required specifically for PEP relationships." },
          { text: "No special approval is required beyond the standard new-account opening process, since the PEP flag was already logged in the system", correct: false, feedback: "Incorrect. Logging the PEP flag is a screening step, not an approval step. A distinct, documented senior management decision to accept the PEP relationship is a mandatory control, not an optional extra." },
          { text: "The introducer's endorsement, combined with the analyst's recommendation, is sufficient for onboarding", correct: false, feedback: "Incorrect. Neither an external introducer nor the escalating analyst has the authority to approve a PEP relationship. This decision must sit with senior management as a distinct governance step." },
        ],
      },
      {
        id: 4, title: 'Ongoing Monitoring',
        question: "Assuming the relationship is approved, what ongoing obligations apply going forward?",
        options: [
          { text: "Enhanced ongoing monitoring, at least annual relationship review, updated source-of-wealth evidence whenever new significant funds are introduced, and continued PEP treatment for a defined period after he leaves office (commonly 12 months or longer given Kaslund's elevated corruption risk)", correct: true, feedback: "Correct. PEP status doesn't end at onboarding — it requires sustained enhanced monitoring for the life of the relationship, periodic re-review (more frequent than standard customers), and continued vigilance even after the individual leaves public office, since former officials retain corruption-related risk for a meaningful period." },
          { text: "Standard periodic review, the same as any other private banking customer, since the enhanced checks were already completed at onboarding", correct: false, feedback: "Incorrect. EDD is not a one-time onboarding exercise for PEPs — ongoing enhanced monitoring is a continuing, separate obligation for the life of the relationship, reflecting the sustained elevated risk PEPs present." },
          { text: "No further monitoring is needed once the initial source-of-wealth documentation has been verified and accepted", correct: false, feedback: "Incorrect. Verified source of wealth at onboarding does not eliminate ongoing risk — new transactions, changes in his official role, or emerging adverse media all require continued vigilance through enhanced ongoing monitoring." },
          { text: "PEP status automatically expires once the account has been open for 12 months, reverting him to standard customer treatment", correct: false, feedback: "Incorrect. There is no automatic 12-month expiry while a PEP remains in office. Even after leaving office, most frameworks require continued PEP-level treatment for a risk-based minimum period — it does not lapse simply due to account tenure." },
        ],
      },
    ],
  },
  {
    id: 'm3', number: '3.',
    title: "MLRO Escalations: Adverse Media Match — Foreign Bribery Allegation",
    tags: ['Regulatory'], sector: 'Banking', premium: false,
    shortDesc: "Analyst dismisses a credible adverse-media match linking a customer to a foreign bribery investigation. Review and make the final MLRO determination.",
    fullScenario: `QUALITY ASSURANCE REVIEW — Escalated to MLRO\n\nCustomer: Henderson Okafor Trading Ltd (existing corporate customer, 3 years' relationship)\nBeneficial owner: Mr. Daniel Okafor\nAccount activity: Import/export trade finance facility, average monthly turnover £340,000\n\nTrigger: Quarterly adverse media re-screening identified a Reuters article (published 6 weeks ago) naming Daniel Okafor as a person of interest in an ongoing US DOJ Foreign Corrupt Practices Act (FCPA) investigation into bribery of customs officials in West Africa, allegedly to expedite the customer's shipments.\n\nAnalyst's original assessment (now under review): "Media report is unverified allegation, no charges filed, customer has good payment history — no further action required, alert closed."\n\nYour task: review the analyst's dismissal and determine the appropriate MLRO response.`,
    steps: [
      {
        id: 1, title: 'Reviewing the Dismissal',
        question: "Was the analyst's decision to close the alert without further action appropriate?",
        options: [
          { text: "No — a credible adverse media hit from a reputable source naming the beneficial owner in an active DOJ FCPA investigation cannot be dismissed on 'no charges filed' alone; a documented EDD assessment must be completed before the alert can be closed", correct: true, feedback: "Correct. The absence of formal charges or a conviction does not eliminate ML/predicate-offence risk — investigations can take years, and reporting entities are expected to act on reasonable suspicion, not wait for judicial outcomes. A Reuters report is a reputable-source hit that requires a documented EDD review, not a same-day dismissal." },
          { text: "Yes — since no charges have been filed, the allegation remains unproven and requires no action", correct: false, feedback: "Incorrect. 'No charges filed' describes the status of a criminal proceeding, not the AML risk assessment threshold. SAR/SMR obligations are triggered by reasonable grounds to suspect — a materially lower bar than criminal proof — so an unproven allegation from a credible source still requires investigation." },
          { text: "Yes — the customer's good payment history is a strong mitigating factor that outweighs the media report", correct: false, feedback: "Incorrect. Payment history reflects account conduct, not the legitimacy of the underlying trade activity or the source of the beneficial owner's wealth. A customer can maintain perfect repayment behaviour while the underlying business is implicated in bribery — the two are not connected." },
          { text: "Yes — since this is a US DOJ matter, it falls outside the bank's domestic AML obligations", correct: false, feedback: "Incorrect. Foreign bribery and corruption are FATF-designated predicate offences for money laundering globally. A foreign investigation is highly relevant to a bank's own AML risk assessment of the customer relationship, regardless of which jurisdiction is prosecuting." },
        ],
      },
      {
        id: 2, title: 'EDD Steps Required',
        question: "What EDD steps must be undertaken given this finding?",
        options: [
          { text: "Obtain further detail from public DOJ court filings, assess whether the trade finance transactions correlate with the alleged scheme's timeline and counterparties, review the relationship for other red flags, and escalate to senior management/legal for a broader FCPA exposure and sanctions assessment", correct: true, feedback: "Correct. A proper EDD response pulls together all available intelligence — public court records, internal transaction correlation, and legal input on exposure — rather than relying on the media report in isolation. This gives the MLRO an evidence-based picture to decide whether reasonable grounds to suspect exist." },
          { text: "Contact the customer directly and ask whether the allegations are true, relying on their response", correct: false, feedback: "Incorrect as a sole step. A self-declaration from the subject of an active investigation has no evidentiary value on its own. Direct customer contact might eventually form part of a broader EDD process, but it cannot substitute for independent verification, and doing it prematurely risks tipping off if an SAR becomes likely." },
          { text: "Wait for the DOJ investigation's outcome before taking any further action", correct: false, feedback: "Incorrect. AML obligations operate on an ongoing, proactive basis — waiting years for a criminal outcome while continuing an unassessed high-risk relationship is inconsistent with the bank's obligation to manage ML risk in real time." },
          { text: "Rely on the existing three-year-old KYC file without further investigation, since the relationship was previously approved", correct: false, feedback: "Incorrect. A new, material risk indicator (the adverse media hit) requires a fresh, targeted review — historic KYC approval does not remain valid in the face of new adverse information; this is precisely what ongoing monitoring and periodic re-screening exist to catch." },
        ],
      },
      {
        id: 3, title: 'SAR Threshold',
        question: "Does the adverse media alone create a reasonable-grounds-to-suspect SAR obligation?",
        options: [
          { text: "Adverse media alone is a risk indicator, not automatically sufficient — but combined with an EDD review that reveals corroborating factors, reasonable grounds to suspect can be established; the MLRO must complete the EDD assessment before making the final SAR determination", correct: true, feedback: "Correct. Adverse media is a trigger for investigation, not an automatic SAR requirement in isolation. The correct sequence is: investigate first (EDD), then assess whether the complete picture — media plus internal findings — meets the suspicion threshold. Filing reflexively on media alone, or dismissing it outright, are both premature." },
          { text: "No SAR is ever required based on adverse media alone, under any circumstances", correct: false, feedback: "Incorrect. While media alone rarely meets the threshold without further investigation, dismissing it as categorically irrelevant is wrong — credible adverse media is one of the most common SAR triggers globally precisely because it often correlates with real underlying activity once investigated." },
          { text: "SAR filing is automatically required the moment any adverse media appears, without further investigation", correct: false, feedback: "Incorrect. Filing immediately on unverified media without any internal assessment produces low-quality, poorly-substantiated SARs and skips the EDD process that regulators expect. The correct approach is investigate first, then decide." },
          { text: "SAR filing is entirely at the MLRO's discretion regardless of the EDD findings", correct: false, feedback: "Incorrect. The SAR obligation is a legal threshold test (reasonable grounds to suspect), not a discretionary judgement call once that threshold is met. The MLRO's role is to apply the EDD findings against that legal standard, not to decide freely." },
        ],
      },
      {
        id: 4, title: 'Final Determination and Account Action',
        question: "The EDD review finds that several trade finance shipments coincide with dates and counterparties named in the DOJ court filings, but there's no direct evidence funds moved through this account. What should the MLRO decide?",
        options: [
          { text: "File an SAR — reasonable grounds to suspect are met given the correlation between account activity and the alleged scheme, even without direct evidence of illicit funds moving through this specific account; consider enhanced monitoring or relationship exit, and provide corrective feedback on the original premature closure", correct: true, feedback: "Correct. SAR obligations do not require proof that illicit funds passed through the account — reasonable grounds to suspect a connection to criminal conduct is sufficient. The transaction-timeline correlation with the alleged bribery scheme is a strong corroborating factor. The MLRO should also use this case to reinforce proper EDD/escalation practice with the analyst who closed it prematurely." },
          { text: "No SAR is needed since there is no direct evidence that illicit funds moved through this specific account", correct: false, feedback: "Incorrect. Requiring direct proof of illicit fund movement sets far too high a bar — the legal threshold is reasonable grounds to suspect, and a documented correlation between the customer's trade finance activity and an active bribery investigation clearly meets that standard." },
          { text: "Close the account immediately without filing an SAR", correct: false, feedback: "Incorrect. Exiting the relationship does not discharge the SAR obligation — if reasonable grounds to suspect exist, the SAR must be filed regardless of whether the bank also chooses to end the relationship. Closing without reporting also risks tipping off if not carefully managed." },
          { text: "Take no action, since the correlation could be coincidental and the bank has no duty to investigate a customer's unrelated business dealings", correct: false, feedback: "Incorrect. Once a bank becomes aware of a credible, corroborated link between its customer's transactions and a bribery scheme, it cannot treat that information as irrelevant — this is exactly the kind of finding the SAR regime exists to capture, and ignoring it after investigation would itself be a compliance failure." },
        ],
      },
    ],
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

const LAW_ANALYST_CASES = [
  {
    id: 'la1', number: 'Part 1',
    title: 'SRA CDD: Cash-Funded Property Purchase',
    tags: ['Escalation'], sector: 'Law', premium: false,
    shortDesc: 'A foreign national from a grey-listed jurisdiction is purchasing a £1.2M London property in cash. Work through SRA/LSAG CDD requirements for a regulated legal practice.',
    fullScenario: `NEW CLIENT MATTER — For CDD Review

Client: Viktor Sokolov (DOB: 14 March 1971, Ukrainian national, resident UAE)
Matter: Purchase of residential property — 14 Whitmore Gardens, Chelsea
Purchase price: £1,200,000 — CASH (no mortgage)
Instructing solicitor: Partner, Property Department

Documents provided so far:
• UAE driving licence (current)
• Utility bill from Dubai (6 months old)
• Claims source of funds is "business income" from a UAE trading company
• No further documentation provided

Work through each CDD step before the firm can proceed.`,
    steps: [
      {
        id: 1, title: 'Client Risk Rating',
        question: "What CDD level applies to Viktor Sokolov before the firm can proceed?",
        options: [
          { text: 'Enhanced Due Diligence (EDD) — a cash-funded property purchase by a foreign national from a higher-risk jurisdiction requires EDD as a minimum', correct: true, feedback: 'Correct. The SRA/LSAG guidance identifies cash-funded property purchases as a high-risk indicator. Foreign nationals from higher-risk jurisdictions add further risk. EDD is mandatory and must include source-of-funds verification, source-of-wealth evidence, and senior management sign-off before accepting the matter.' },
          { text: 'Standard CDD — a driving licence and utility bill are sufficient', correct: false, feedback: 'Incorrect. Identity verification is only one element of CDD. Standard CDD does not satisfy the EDD requirement triggered by: (1) cash-funded property, (2) foreign national from a higher-risk jurisdiction, and (3) no source-of-funds documentation.' },
          { text: 'Simplified CDD — UAE is a reputable financial centre', correct: false, feedback: 'Incorrect. Simplified CDD applies only where risk factors are demonstrably low. A cash-funded £1.2M property purchase by a foreign national with undocumented funds cannot be assessed as low-risk.' },
          { text: 'No CDD required — property purchases are not designated high-risk by the SRA', correct: false, feedback: 'Incorrect. The legal sector is covered by the UK Money Laundering Regulations 2017. Cash-funded property transactions are one of the highest-risk services solicitors provide and a primary ML vector in the UK legal sector.' },
        ],
      },
      {
        id: 2, title: 'Source of Funds',
        question: "Viktor says his source of funds is 'business income' from a UAE trading company. What evidence must the firm obtain?",
        options: [
          { text: 'Audited or signed management accounts, 6–12 months of corporate bank statements, and details of the trade and ownership structure of the UAE entity', correct: true, feedback: 'Correct. "Business income" is one of the highest-risk source-of-funds declarations — it is vague and frequently used to conceal beneficial ownership of criminal proceeds. The LSAG guidance requires contemporaneous documentary evidence showing funds accumulating consistently with the declared business activity.' },
          { text: 'A signed client declaration confirming the funds are not from criminal activity', correct: false, feedback: 'Incorrect. Self-declarations have no evidentiary value. A money launderer would simply sign the declaration. The obligation is to verify the source of funds — not to accept the client\'s word.' },
          { text: 'A bank reference letter confirming the account balance', correct: false, feedback: 'Partially helpful for confirming funds exist, but a balance confirmation does not explain source of funds. The origin of the funds — not just their current location — must be established.' },
          { text: 'Nothing — solicitors are not responsible for verifying how clients earned their money', correct: false, feedback: 'Incorrect. Under the Money Laundering Regulations 2017 and SRA AML practice note, solicitors must take reasonable steps to verify source of funds for property transactions. Failure constitutes a breach of the Regulations and may constitute criminal facilitation.' },
        ],
      },
      {
        id: 3, title: 'PEP Screen Hit',
        question: "Your PEP screening tool flags Viktor Sokolov as a former Ukrainian deputy minister who left office 4 years ago. What do you do?",
        options: [
          { text: 'Treat Viktor as a PEP — obtain senior management sign-off, verify source of wealth (not just source of funds), and apply enhanced ongoing monitoring for the matter', correct: true, feedback: 'Correct. UK MLR 2017 require PEP treatment for at least 12 months after leaving office. The SRA/LSAG recommends a risk-based assessment for former PEPs for considerably longer — especially where the jurisdiction carries elevated corruption risk. Source of wealth (accumulated over career) must also be verified.' },
          { text: 'Ignore the hit — he left office 4 years ago', correct: false, feedback: 'Incorrect. Former PEPs do not automatically revert to standard status. UK MLR 2017 Reg.35(14) requires PEP treatment for at least 12 months post-office. A former deputy minister from a high-corruption jurisdiction likely retains elevated risk well beyond that period.' },
          { text: 'Decline the matter immediately', correct: false, feedback: 'Premature. PEP status triggers EDD — not automatic declination. Many PEPs have entirely legitimate wealth. The obligation is to conduct enhanced due diligence and make an informed decision.' },
          { text: 'Refer to the MLRO who can decide without additional EDD information', correct: false, feedback: 'Partially correct — the MLRO must be informed and sign off. However, the MLRO must be provided with a full EDD file including source of wealth documentation, not make a decision in the absence of it.' },
        ],
      },
      {
        id: 4, title: 'Proceed or Report?',
        question: "Viktor provides company bank statements showing consistent cash deposits into his UAE company over 24 months, but cannot explain the origin of the cash. How do you proceed?",
        options: [
          { text: 'Escalate to the MLRO — unexplained cash means source of funds cannot be verified. The MLRO must decide whether to decline and consider whether a Suspicious Activity Report is required before any further steps on the matter', correct: true, feedback: 'Correct. The "consent" SAR regime under POCA 2002 is critical here. If the MLRO suspects ML, an SAR must be filed with the NCA and consent obtained (or the moratorium period allowed to pass) BEFORE doing anything further. Proceeding while an SAR is pending could constitute facilitation of money laundering.' },
          { text: 'Proceed — the bank statements satisfy source-of-funds requirements', correct: false, feedback: 'Incorrect. Bank statements show the movement of funds — not their origin. Unexplained cash deposits into a UAE company are themselves a red flag for ML placement. The origin of those cash deposits must be explained.' },
          { text: 'Request a second opinion from the instructing partner and proceed if satisfied', correct: false, feedback: 'Incorrect. The MLRO function operates independently of the instructing partner. Partners cannot override the MLRO\'s assessment. Commercial relationships must not override AML compliance — this is a classic pressure point in legal practice.' },
          { text: 'Return the client\'s documents and close the file without informing anyone', correct: false, feedback: 'Incorrect and potentially criminal. If the firm has formed a suspicion of ML, closing the file without reporting may constitute "failing to disclose" under POCA 2002 s.330. The MLRO must assess whether an SAR obligation exists.' },
        ],
      },
    ],
  },
  {
    id: 'la2', number: 'Part 2',
    title: 'SRA Monitoring: Sub-Threshold Cash Payments to Client Account',
    tags: ['Escalation'], sector: 'Law', premium: false,
    shortDesc: 'Finance flags multiple sub-threshold cash deposits into the firm\'s client account from 7 different individuals. Investigate and determine your reporting obligations.',
    fullScenario: `FINANCE TEAM ALERT — For CDD/Monitoring Review\n\nClient matter: Litigation funding — commercial dispute (Client: Meridian Consulting Group Ltd)\nMatter type: Client account holds settlement funds pending distribution\n\nAlert: Finance flags the following pattern over 3 weeks:\n• 7 bank transfers into the firm's client account\n• Senders: 7 different individuals, none listed as parties to the litigation or known associates of the client\n• Amounts: each between £8,200–£9,600 (consistently below the firm's internal £10,000 review threshold)\n• Total received: £61,800\n• No instruction on file explaining why third parties would be funding this client's litigation costs\n\nYour task: investigate the pattern and determine the firm's reporting obligations.`,
    steps: [
      {
        id: 1, title: 'Initial Assessment',
        question: "What does this payment pattern most likely indicate?",
        options: [
          { text: 'Structuring — the pattern of 7 payments from unrelated third parties, each calibrated just below the internal review threshold, is consistent with deliberate structuring to avoid detection, and warrants investigation regardless of whether the underlying litigation is legitimate', correct: true, feedback: 'Correct. Multiple unrelated senders, each transferring an amount just below a known review threshold, totalling nearly £62,000, is a textbook structuring pattern. The legitimacy of the litigation itself is a separate question from the legitimacy of how it is being funded — both must be assessed.' },
          { text: 'Normal litigation funding, since commercial disputes are often funded by third parties without formal documentation', correct: false, feedback: 'Incorrect. Legitimate third-party litigation funding is typically arranged through a small number of identifiable, professional funders with clear documentation — not 7 unrelated individuals each sending amounts calibrated just under a review threshold.' },
          { text: 'The amounts are too small individually to be significant and do not warrant further review', correct: false, feedback: 'Incorrect. Reviewing amounts in isolation misses the pattern. It is the aggregate — 7 similarly-sized payments from unrelated senders totalling £61,800 — that creates the red flag, not any single transaction.' },
          { text: 'The pattern is coincidental, since threshold-adjacent payments happen often in commercial matters', correct: false, feedback: 'Incorrect. A single threshold-adjacent payment could be coincidental; seven, from seven different unrelated senders, in three weeks, is a pattern that requires investigation rather than being dismissed as chance.' },
        ],
      },
      {
        id: 2, title: 'Client File Review',
        question: "What should be reviewed first before escalating?",
        options: [
          { text: "The matter file and CDD records — check whether third-party litigation funders were disclosed at matter inception, whether the client explained the funding structure, and cross-reference the 7 senders against any known parties, then request an explanation from the fee earner/client if the file doesn't already account for this", correct: true, feedback: 'Correct. Before escalating externally, the firm should exhaust its own internal information — the matter file may already explain the arrangement (in which case the alert can be closed with documented rationale), or it may confirm there is no legitimate explanation on record, strengthening the case for further investigation.' },
          { text: 'Immediately file an SAR without any internal review', correct: false, feedback: "Incorrect. Filing before completing a basic internal review produces a low-quality, poorly-substantiated report and skips a step that might either resolve the alert legitimately or significantly strengthen it. Internal file review comes first." },
          { text: "Contact the client's opposing party in the litigation for information", correct: false, feedback: "Incorrect and inappropriate. The opposing party has no role in the firm's CDD process and contacting them risks breaching client confidentiality and potentially tipping off, entirely aside from being the wrong source of information." },
          { text: 'Contact the 7 senders directly to verify their identity before consulting the file', correct: false, feedback: "Incorrect sequencing. The firm should first establish what its own file says, including whether the client has already provided an explanation, before reaching out to third parties — premature outreach also raises tipping-off risk if suspicion is already forming." },
        ],
      },
      {
        id: 3, title: 'Consent SAR Before Proceeding',
        question: 'The client instructs the firm to distribute the settlement funds (including the unexplained third-party payments) to the client\'s nominated account next week. What must happen first?',
        options: [
          { text: 'If, after investigation, the fee earner/MLRO forms reasonable grounds to suspect the third-party payments may be proceeds of crime, a consent SAR (DAML) must be filed with the NCA and the distribution must not proceed until consent is granted or the moratorium period expires', correct: true, feedback: 'Correct. Proceeding with a distribution that includes funds the firm reasonably suspects may be criminal proceeds risks a POCA 2002 s.328 arrangement offence. A consent SAR (Defence Against Money Laundering) must be filed, and the firm must wait for NCA consent or the moratorium to lapse before completing the distribution.' },
          { text: 'Proceed with the distribution as instructed, since the client is contractually entitled to their settlement funds', correct: false, feedback: 'Incorrect. Client entitlement under the underlying litigation does not override the firm\'s independent statutory obligation under POCA. If reasonable grounds to suspect exist regarding the source of the third-party funds, the firm cannot proceed without consent, regardless of the client\'s instructions.' },
          { text: 'Delay the distribution indefinitely without filing anything, until the client provides a satisfactory explanation', correct: false, feedback: "Incorrect. Indefinitely withholding funds without filing an SAR does not discharge the firm's reporting obligation and leaves the firm in an unresolved position. If suspicion exists, the correct step is to file the consent SAR — not to sit on the funds unreported." },
          { text: "Distribute only the 'clean' portion of the funds (the original settlement) and hold back the unexplained third-party payments without escalating", correct: false, feedback: "Incorrect. Once suspicious funds have commingled with the client account balance, selectively releasing a 'clean' portion without a proper SAR assessment does not resolve the underlying suspicion and is not a recognised way to discharge the reporting obligation." },
        ],
      },
      {
        id: 4, title: 'Final Determination',
        question: "The client says the third-party payments are from 'family and friends supporting the litigation' but cannot provide names matching the senders, and declines to explain further. How do you proceed?",
        options: [
          { text: 'Escalate to the MLRO with a full investigation summary recommending an SAR — an unverifiable, vague explanation combined with a classic structuring pattern and no supporting documentation meets the reasonable-grounds-to-suspect threshold', correct: true, feedback: "Correct. A vague explanation that cannot be reconciled with the actual sender names, combined with the structuring pattern already identified, is precisely the kind of unresolved red flag that meets the SAR threshold. The MLRO must now decide on filing and on whether the firm can continue acting for the client." },
          { text: "Accept the explanation since litigation funding by friends and family is a plausible arrangement", correct: false, feedback: "Incorrect. Plausibility in the abstract is not the test — the client's account cannot be reconciled with the actual sender identities, and the explanation offered does not resolve that gap. An unverifiable explanation does not neutralise a structuring red flag." },
          { text: "Proceed with the distribution and simply note the client's explanation on the file", correct: false, feedback: "Incorrect. Noting an unverified explanation on file does not discharge the firm's SAR obligation if reasonable grounds to suspect remain. The explanation must be assessed, not just recorded, before deciding whether to proceed." },
          { text: 'Refuse to accept any further payments but distribute the funds already received without reporting', correct: false, feedback: "Incorrect. Refusing further payments is a reasonable protective step but does not address the SAR obligation attached to the funds already received. If suspicion is not resolved, those funds still require an SAR before distribution." },
        ],
      },
    ],
  },
]

const LAW_MLRO_CASES = [
  {
    id: 'lm1', number: '1.',
    title: 'MLRO: Consent SAR — Offshore SPV Property Purchase',
    tags: ['Regulatory'], sector: 'Law', premium: false,
    shortDesc: 'A BVI-registered SPV with no trading history seeks to purchase a £3.2M London commercial property in cash. The beneficial owner has adverse media linking him to a Nigerian regulatory investigation.',
    fullScenario: `ESCALATION FROM PROPERTY TEAM — For MLRO Decision

Fee earner: Junior associate, property department
Matter: Purchase of commercial property — 88 Canary Wharf Office Suite, London
Purchase price: £3,200,000 — CASH (offshore wire from Cayman Islands SPV)
Client entity: Nexus Holdings Ltd (BVI registered, incorporated 4 months ago)
Declared beneficial owner: Mr K. Okonkwo (Nigerian national, UK resident)

Escalation triggers:
• No source-of-funds documentation after three formal requests
• BVI SPV incorporated 4 months ago — no trading history, no apparent business rationale
• Adverse media: Mr Okonkwo linked to a Nigerian SEC investigation (settled, no conviction)
• Wire originates from a Cayman Islands trust account — no documentation provided

Your task: make the MLRO determination and manage the consent SAR process.`,
    steps: [
      {
        id: 1, title: 'SAR Assessment',
        question: "As MLRO, what is your initial assessment?",
        options: [
          { text: 'Reasonable grounds to suspect exist — the combination of an offshore SPV, adverse media, unexplained source of funds, and refusal to provide documentation meets the POCA s.330 disclosure threshold', correct: true, feedback: 'Correct. The POCA 2002 threshold is "reasonable grounds to suspect" — not proof. Multiple indicators (fresh offshore SPV, adverse media, no source-of-funds evidence after three requests, Cayman wire with no documentation) collectively and individually support the suspicion threshold.' },
          { text: 'No SAR required — the adverse media was settled without conviction', correct: false, feedback: 'Incorrect. A settled regulatory matter without conviction does not eliminate ML risk. The lack of conviction is one factor — the combination of all indicators here creates reasonable grounds to suspect regardless of the outcome of the Nigerian regulatory matter.' },
          { text: 'Wait for the source-of-funds documents before forming a view', correct: false, feedback: 'Incorrect. Three requests have been made and ignored. Continuing to wait is itself a red flag — legitimate clients provide documentation. The facts as they stand already meet the disclosure threshold.' },
          { text: 'The fee earner should have declined this matter at intake — the MLRO has no role now', correct: false, feedback: 'Incorrect. The MLRO is responsible for the firm\'s SAR decisions throughout the client lifecycle — including at the point of escalation. The MLRO must now determine whether to file an SAR and how to manage the matter going forward.' },
        ],
      },
      {
        id: 2, title: 'Consent SAR Process',
        question: "You decide to file an SAR with the NCA. Can the firm continue work on the property matter while the SAR is under review?",
        options: [
          { text: 'No — once an SAR is filed, the firm must halt all work on the matter until NCA consent is given or the 7-day moratorium period expires without refusal', correct: true, feedback: 'Correct. Under POCA 2002, if a "consent SAR" (also known as a DAML — Defence Against Money Laundering) is filed, the firm must not proceed with the transaction until: (a) the NCA grants consent, or (b) the initial 7-day moratorium expires without refusal, or (c) the extended 31-day moratorium (if refused) expires. Proceeding before consent constitutes a criminal offence.' },
          { text: 'Yes — the SAR is advisory only; the firm can continue while awaiting a response', correct: false, feedback: 'Incorrect. A consent/DAML SAR has a specific legal effect: it triggers moratorium periods during which the transaction must be halted. Proceeding is a criminal offence under POCA s.328 (arrangement offence).' },
          { text: 'Yes — provided the fee earner is not told about the SAR', correct: false, feedback: 'Incorrect on both counts. The work must stop regardless of whether the fee earner knows about the SAR. Additionally, you can inform the fee earner that there is a "compliance hold" — just not the specifics of the SAR (to avoid tipping off).' },
          { text: 'No — the firm must immediately close the file and return all client funds', correct: false, feedback: 'Incorrect. Returning client funds during the moratorium period could itself constitute facilitating money laundering if the funds are proceeds of crime. The firm holds the funds and waits for NCA direction.' },
        ],
      },
      {
        id: 3, title: 'Tipping Off Risk',
        question: "The client\'s solicitor calls your front desk asking for a progress update on the property matter. What do you instruct staff to say?",
        options: [
          { text: '"The matter is subject to an internal compliance review — we will be in touch once that is resolved." Staff told only there is a compliance hold; no mention of the NCA or any report.', correct: true, feedback: 'Correct. Tipping off is a criminal offence under POCA 2002 s.333A. Disclosing that an SAR has been made, or that an NCA investigation is underway, carries up to 5 years imprisonment. A neutral "compliance review" explanation is truthful, does not disclose the SAR, and is not materially misleading.' },
          { text: '"We have filed a report with the NCA and are awaiting their response."', correct: false, feedback: 'A serious tipping-off violation. Disclosing the existence of an SAR and NCA involvement constitutes the offence under POCA s.333A. This exposes both the firm and the individual to criminal liability.' },
          { text: '"We cannot proceed — we suspect the funds may be connected to financial crime."', correct: false, feedback: 'Tipping off — disclosing the reason for the hold (suspicion of financial crime) reveals that an investigation is underway, which is the essence of the tipping-off offence.' },
          { text: 'Refuse to take the call and return no communications until the NCA responds.', correct: false, feedback: 'Not ideal — a complete refusal to communicate may itself alarm the client. A measured "compliance review" explanation manages the situation without disclosure.' },
        ],
      },
      {
        id: 4, title: 'Post-SAR Matter Closure',
        question: "The NCA grants consent after 4 days. However, during the moratorium period, new intelligence emerges: the BVI company is linked to a Zambian corruption investigation. What do you do?",
        options: [
          { text: 'File a second SAR with the new intelligence and do not proceed until further consent is obtained — NCA consent for the original SAR does not cover new suspicious circumstances', correct: true, feedback: 'Correct. NCA consent is granted in respect of the specific information in the original SAR. Material new intelligence constitutes a new disclosure obligation. The firm must file a second SAR and obtain further consent or allow the moratorium to expire before proceeding. This is a frequently misunderstood aspect of the consent regime.' },
          { text: 'Proceed — the NCA already granted consent and that covers all risks', correct: false, feedback: 'Incorrect. NCA consent covers the transaction as described in the original SAR. Materially new suspicious information creates a fresh obligation to disclose. Proceeding with knowledge of a Zambian corruption link without disclosing it could constitute a separate money laundering offence.' },
          { text: 'Proceed but note the new intelligence on the file for future reference', correct: false, feedback: 'Incorrect. Noting the intelligence on file does not discharge the SAR obligation triggered by the new information. The MLRO must assess whether to file a further SAR.' },
          { text: 'Decline the matter and close the file — no further SAR is needed', correct: false, feedback: 'Declining the matter is one option, but a further SAR may still be required. POCA s.330 creates a continuing obligation — the new intelligence about a corruption investigation is reportable regardless of whether the firm continues to act.' },
        ],
      },
    ],
  },
  {
    id: 'lm2', number: '2.',
    title: 'MLRO: Firm-Wide AML Risk Assessment — Annual Review',
    tags: ['Regulatory'], sector: 'Law', premium: false,
    shortDesc: 'Complete the firm\'s annual MLRO report covering practice area risk, SAR statistics, CDD quality, and training compliance across all fee-earner teams.',
    fullScenario: `FIRM-WIDE AML RISK ASSESSMENT — Guided Walkthrough\n\nThis simulation guides you through completing the firm's annual MLRO report to the Partnership Board — the structured review required under the UK Money Laundering Regulations 2017 (Reg. 18) and SRA Standards.\n\nPeriod: January – December [current year]\nMLRO: [Your name]\nFirm: 140-partner commercial practice with Property, Corporate, Litigation, and Private Client departments\n\nWork through each section to understand what the Board expects and what an SRA AML inspection would examine.`,
    steps: [
      {
        id: 1, title: 'Section 1: Practice-Area Risk',
        question: "Which practice area should be assessed as highest AML risk in the firm-wide risk assessment, and why?",
        options: [
          { text: 'Property — cash-funded purchases, offshore corporate buyers, and the ability to move large sums through the client account make conveyancing/commercial property consistently the highest-risk practice area identified by SRA thematic reviews and LSAG guidance', correct: true, feedback: 'Correct. SRA thematic reviews and LSAG risk guidance consistently identify property work as the highest-risk legal practice area — it combines high transaction values, cash and offshore funding, anonymous corporate structures, and the ability to launder funds through a completed, legitimate-looking asset purchase.' },
          { text: 'Litigation, since disputes can involve large settlement sums passing through the client account', correct: false, feedback: 'Settlement funds do carry some risk, but litigation as a whole carries lower structural ML risk than property — settlements are typically tied to a court process or negotiated agreement with more inherent transparency than a property purchase funded by an unverified third party.' },
          { text: 'Private Client, since wills and probate work rarely involve significant fund movements', correct: false, feedback: "Incorrect — this actually argues against Private Client being highest risk, not for it. Wills and probate generally involve lower transactional ML risk precisely because large, opaque fund movements are uncommon in that practice area." },
          { text: 'Corporate, since M&A transactions are already heavily diligenced by other advisers involved in the deal', correct: false, feedback: "Incorrect. While M&A deals do involve other advisers, this does not eliminate the law firm's own independent AML obligations, and corporate structuring risk (shell companies, opaque ownership) is real — but it is still assessed as lower than property risk in most firm-wide risk assessments." },
        ],
      },
      {
        id: 2, title: 'Section 2: SAR Statistics',
        question: "The firm filed 6 SARs this year, down from 11 last year, entirely from the Property department. How should this be presented to the Board?",
        options: [
          { text: 'Present the raw numbers alongside context — investigate and explain the decline, and confirm whether other departments are appropriately identifying and escalating red flags, since zero SARs from Litigation, Corporate, and Private Client across a full year may itself indicate under-reporting rather than genuinely lower risk', correct: true, feedback: "Correct. A declining SAR count is not inherently good news — it requires explanation. Equally important: if only one department out of four is generating any SARs at all, the Board needs to know whether that reflects genuinely concentrated risk, or a detection gap in the other three departments that needs addressing through training or awareness." },
          { text: 'Report the number without further analysis, since a decline in SARs is inherently a positive sign', correct: false, feedback: "Incorrect. A raw number without analysis tells the Board nothing about whether the decline reflects improved controls, reduced transaction volume, or a detection failure. Presenting it without context fails the Board's governance oversight role." },
          { text: 'Assume the decline proves the AML programme is working effectively and requires no further comment', correct: false, feedback: 'Incorrect. This is an unsupported assumption. Fewer SARs can equally indicate weaker detection as it can indicate better upfront deterrence — the MLRO must investigate which explanation actually applies before presenting a conclusion to the Board.' },
          { text: 'Recommend no changes, since Property remains the only department that has ever filed SARs historically', correct: false, feedback: "Incorrect. Historical concentration in one department is itself a finding worth Board attention — it should prompt a review of whether Litigation, Corporate, and Private Client fee earners are adequately trained to recognise and escalate red flags in their own practice areas." },
        ],
      },
      {
        id: 3, title: 'Section 3: CDD Sampling',
        question: 'A file review sample of 40 matters found 5 (12.5%) with incomplete source-of-funds documentation for property purchases. What is the appropriate response?',
        options: [
          { text: 'Report the finding transparently to the Board with root-cause analysis, remediate the identified files, and implement a control improvement such as mandatory supervisor sign-off before matters proceed to completion', correct: true, feedback: "Correct. A 12.5% gap rate in the firm's highest-risk practice area is a material finding. Transparent Board reporting, retrospective remediation of the specific files, and a forward-looking control improvement together demonstrate the mature compliance response an SRA inspection would expect to see." },
          { text: 'Since it is only 12.5%, note it informally without a formal remediation plan', correct: false, feedback: 'Incorrect. 12.5% represents 1 in 8 files failing a core CDD requirement in the highest-risk practice area — this is a material gap requiring a documented, formal remediation plan, not an informal note.' },
          { text: 'Exclude the finding from the Board report since it reflects poorly on the department', correct: false, feedback: 'Incorrect and a serious governance failure. Withholding material compliance findings from the Board undermines its oversight function, and if later discovered by the SRA, would be treated far more seriously than the underlying documentation gap itself.' },
          { text: 'Retroactively mark the files as compliant without obtaining the missing documentation', correct: false, feedback: 'Incorrect and improper. Marking files as compliant without actually obtaining the required documentation misrepresents the firm\'s compliance position and does nothing to address the actual underlying gap — the documentation must genuinely be obtained.' },
        ],
      },
      {
        id: 4, title: 'Section 4: Training Compliance',
        question: 'Fee-earner AML training completion is at 87% firm-wide, with the lowest completion (68%) in the Corporate department. What should the MLRO recommend?',
        options: [
          { text: 'Report the gap to the Board, mandate 100% completion with a firm deadline, and consider linking completion to appraisal or performance processes', correct: true, feedback: 'Correct. The UK MLR 2017 requires all relevant employees to receive AML training. A persistent departmental shortfall — particularly in Corporate, which handles complex cross-border ownership structures — is a genuine compliance risk that the Board must formally address with a clear deadline and accountability mechanism.' },
          { text: 'Accept 87% as an acceptable industry-standard completion rate requiring no further action', correct: false, feedback: 'Incorrect. There is no regulatory basis for treating anything below 100% as acceptable — the MLR 2017 training obligation applies to all relevant employees, and an untrained fee earner represents a real compliance and detection gap, not a rounding error.' },
          { text: 'Address it informally with department heads without giving the Board visibility of the gap', correct: false, feedback: 'Incorrect. Training compliance is a Board-level governance matter under Reg. 18, particularly where one department is materially behind. Handling it informally without Board visibility denies the Board its oversight function.' },
          { text: 'Extend the training completion deadline again without escalating the recurring shortfall', correct: false, feedback: 'Incorrect. Repeatedly extending deadlines without escalation allows a compliance gap to persist indefinitely. A recurring shortfall in the same department is exactly the kind of pattern that warrants formal escalation and a firm deadline, not another extension.' },
        ],
      },
    ],
  },
]

const CRYPTO_ANALYST_CASES = [
  {
    id: 'ca1', number: 'Part 1',
    title: 'Crypto Exchange: High-Value Customer KYC',
    tags: ['Escalation'], sector: 'Crypto', premium: false,
    shortDesc: 'A self-employed consultant wants to purchase £50,000 in Bitcoin. Work through KYC tier requirements, source-of-funds verification, and wallet screening obligations.',
    fullScenario: `NEW CUSTOMER — KYC REVIEW

Customer: James Whitfield (DOB: 22 July 1988, British national)
Occupation: Self-employed IT consultant
Request: Purchase £50,000 in Bitcoin (BTC) — single transaction
Account type: Individual retail — remote/digital onboarding

Documents submitted so far:
• UK driving licence (current)
• One month bank statement showing £52,000 balance
• No source-of-funds documentation
• No source-of-wealth documentation

Your task: complete the KYC assessment and determine what is required before funds can be accepted.`,
    steps: [
      {
        id: 1, title: 'KYC Tier',
        question: "What KYC tier applies to a customer requesting a £50,000 single Bitcoin purchase on a UK-registered crypto exchange?",
        options: [
          { text: 'Enhanced Due Diligence (EDD) — a single transaction of £50,000 significantly exceeds standard thresholds and requires source-of-funds and source-of-wealth documentation before the transaction is processed', correct: true, feedback: 'Correct. Under the UK MLR 2017 (as applied to cryptoasset businesses registered with the FCA), transactions of this size require EDD. The FCA\'s guidance on cryptoasset AML requires firms to apply enhanced scrutiny to high-value transactions. Source of funds and source of wealth are both required for a £50,000 single purchase.' },
          { text: 'Standard CDD — a driving licence and bank statement are sufficient for any transaction', correct: false, feedback: 'Incorrect. Standard CDD covers lower-value transactions. A £50,000 single transaction is well above the standard KYC threshold for most UK crypto exchanges. Source-of-funds verification is specifically required at this level.' },
          { text: 'No KYC required — cryptocurrency purchases are not subject to AML regulations in the UK', correct: false, feedback: 'Incorrect. The UK has required cryptoasset businesses to register with the FCA under the MLR 2017 since January 2020. These businesses are fully subject to AML obligations including KYC, CDD/EDD, ongoing monitoring, and SAR filing.' },
          { text: 'Simplified CDD — the customer has a UK driving licence which is a reliable government-issued document', correct: false, feedback: 'Incorrect. The level of CDD is determined by the risk of the transaction, not just the quality of the identity document. A £50,000 cash-equivalent purchase of cryptocurrency requires EDD regardless of the quality of the ID provided.' },
        ],
      },
      {
        id: 2, title: 'Source of Funds',
        question: "James says his funds are from his IT consultancy business. The bank statement shows a single lump-sum credit of £51,500 two weeks ago labelled 'BACS transfer'. What further evidence is required?",
        options: [
          { text: 'Details of the consultancy contract or invoice, the name of the paying client, and evidence the BACS transfer originated from a legitimate business payment (e.g., the client\'s company name matching a verifiable business)', correct: true, feedback: 'Correct. A single large BACS credit is a red flag for pass-through funds — money passed through an account to distance it from its source. The firm must verify that the BACS credit originated from a legitimate consulting engagement, not from a third party laundering funds through James\'s account. Asking for the contract and the paying client\'s identity is proportionate EDD.' },
          { text: 'No further evidence — the bank statement proves the funds exist in his account', correct: false, feedback: 'Incorrect. A bank statement proves the balance, not the source. A single large deposit labelled only "BACS transfer" does not demonstrate source of funds — it raises further questions about where the funds originated.' },
          { text: 'A letter from his accountant confirming he is self-employed', correct: false, feedback: 'Partially helpful for confirming employment status, but does not verify source of funds for this specific transaction. An accountant\'s letter confirming self-employment does not explain where this particular £50,000 came from.' },
          { text: 'A full 12 months of personal bank statements', correct: false, feedback: 'Useful context, but the specific priority is understanding the BACS transfer that funded this purchase. Twelve months of statements would show broader financial profile but may not identify the source of this specific lump sum.' },
        ],
      },
      {
        id: 3, title: 'Wallet Screening',
        question: "James provides a destination Bitcoin wallet address for the purchased BTC. What screening should the exchange conduct on this wallet before sending funds?",
        options: [
          { text: 'Screen the destination wallet against blockchain analytics tools (e.g., Chainalysis, Elliptic) to assess whether it is linked to illicit activity, sanctions, mixers, darknet markets, or high-risk exchanges', correct: true, feedback: 'Correct. Blockchain analytics is a core AML control for crypto exchanges. Sending BTC to a wallet linked to sanctions, mixers, or darknet markets exposes the exchange to regulatory liability. FCA guidance and FATF Recommendation 16 (the "Travel Rule") both require exchanges to screen counterparty wallets and, above threshold, collect beneficiary information.' },
          { text: 'No wallet screening is needed — once the customer is KYC\'d, their wallet is automatically considered safe', correct: false, feedback: 'Incorrect. Customer KYC and wallet screening are separate controls. A verified customer may send funds to a third-party wallet controlled by a criminal or a sanctioned entity. Destination wallet screening is a mandatory AML control.' },
          { text: 'Only check the wallet against the OFAC SDN list — no other screening is required', correct: false, feedback: 'Sanctions screening is important but insufficient. The OFAC SDN list covers sanctioned individuals but not the full range of illicit wallet activity. Blockchain analytics tools provide much richer risk signals including mixer usage, darknet market exposure, and theft-linked addresses.' },
          { text: 'Ask James to confirm the wallet is his own — a self-certification is sufficient', correct: false, feedback: 'Incorrect. Self-certifications have no evidentiary value in wallet screening. The AML obligation is to objectively verify the risk profile of the destination wallet using blockchain analytics — not to rely on the customer\'s representation.' },
        ],
      },
      {
        id: 4, title: 'Ongoing Monitoring Rule',
        question: "James has been onboarded. What is the most appropriate transaction monitoring rule for his account going forward?",
        options: [
          { text: 'Flag any transaction exceeding £10,000 for manual review, alert on rapid buy-sell cycling within 24 hours, and trigger review if BTC is immediately transferred to a high-risk wallet or mixing service after purchase', correct: true, feedback: 'Correct. Effective crypto exchange monitoring must capture: (1) high-value transaction alerts calibrated to the customer\'s declared profile, (2) rapid cycling (buy-immediately-sell patterns that suggest layering), and (3) post-purchase wallet risk — where the customer sends purchased crypto to high-risk addresses. All three are distinct layering signals in the crypto environment.' },
          { text: 'No monitoring needed — James has passed KYC and the account is verified', correct: false, feedback: 'Incorrect. KYC is a point-in-time control. Ongoing monitoring is a separate, continuous obligation under the UK MLR 2017. Customer risk profiles can change, and monitoring detects behaviours that were not apparent at onboarding.' },
          { text: 'Flag only if monthly trading volume exceeds £500,000', correct: false, feedback: 'Incorrect. A £500,000 monthly threshold would miss significant red flags for a customer whose declared income is from an IT consultancy. Monitoring thresholds must be calibrated to the customer\'s declared risk profile, not set arbitrarily high.' },
          { text: 'Flag all transactions regardless of size for manual review', correct: false, feedback: 'Incorrect. Flagging every transaction for manual review is operationally unsustainable and does not represent a risk-based approach. Effective monitoring applies calibrated rules that focus analyst attention on genuinely anomalous behaviour.' },
        ],
      },
    ],
  },
  {
    id: 'ca2', number: 'Part 2',
    title: 'Crypto Exchange: Privacy Coin Rapid-Cycling Alert',
    tags: ['Escalation'], sector: 'Crypto', premium: false,
    shortDesc: 'A monitoring alert detects a customer rapidly converting fiat to BTC, then immediately swapping to Monero via a mixing service and withdrawing — with zero account balance retained. Investigate and report.',
    fullScenario: `MONITORING ALERT — CRYPTO EXCHANGE\n\nCustomer: Account #CX-51092 (verified UK individual, 6 months' tenure)\nTrigger: Rapid-cycling and privacy-coin conversion rule\n\nTransaction pattern — past 48 hours:\n• 3 separate fiat deposits via bank transfer, totalling £42,000\n• Each deposit immediately used to purchase Bitcoin (BTC)\n• Within minutes of each BTC purchase, funds converted to Monero (XMR) via a third-party swap service\n• XMR immediately withdrawn to an external wallet\n• Account balance after each cycle: £0 (fully cycled out)\n• No prior similar activity on this account\n• Customer's declared purpose at onboarding: "long-term Bitcoin investment"\n\nYour task: assess the pattern and determine next steps.`,
    steps: [
      {
        id: 1, title: 'Pattern Recognition',
        question: "What does this transaction pattern most likely indicate?",
        options: [
          { text: 'Rapid layering using a privacy coin — converting fiat to BTC and immediately swapping to Monero before withdrawal is a classic layering technique, and the complete cycling to zero balance sharply contradicts the customer\'s stated "long-term investment" purpose', correct: true, feedback: "Correct. Monero uses ring signatures and stealth addresses specifically to obscure transaction trails. Converting immediately and fully cycling out to zero balance, three times in 48 hours, is inconsistent with any genuine investment strategy and matches a deliberate layering typology designed to break the audit trail." },
          { text: 'Normal profit-taking behaviour, since crypto traders often move between coins', correct: false, feedback: 'Incorrect. Genuine trading between coins does not typically involve immediately converting 100% of a fresh deposit through a privacy coin and withdrawing to zero balance within minutes — that pattern has no legitimate trading rationale, only a detection-evasion one.' },
          { text: 'The customer diversifying into privacy coins for legitimate financial privacy reasons', correct: false, feedback: 'Legitimate privacy interest does not typically manifest as immediate full-cycle conversion-and-withdrawal repeated three times in two days on freshly deposited fiat — that pattern is materially different from someone simply holding privacy coins as part of a portfolio.' },
          { text: 'Arbitrage trading between BTC and XMR markets', correct: false, feedback: 'Arbitrage trading exploits price differences and typically involves round-trip trades that return to the original asset or currency, not a one-way conversion followed by full withdrawal off-platform — this pattern shows no round-trip characteristic at all.' },
        ],
      },
      {
        id: 2, title: 'Risk Factors',
        question: "Which factor makes this pattern MOST significant from an AML perspective?",
        options: [
          { text: 'The use of Monero specifically — as a privacy coin, once converted and withdrawn the exchange (and any blockchain analytics tool) permanently loses visibility into where the funds go, meaning this is a deliberate detection-evasion technique, not just an unusual trading choice', correct: true, feedback: 'Correct. Unlike BTC, which is traceable on a public ledger, Monero transactions cannot be traced using standard blockchain analytics. Choosing to route funds through XMR specifically, immediately after each deposit, is the single most significant indicator here — it is the mechanism that breaks the audit trail permanently.' },
          { text: 'The £42,000 total amount, which is unusually large for a crypto account', correct: false, feedback: '£42,000 is a moderate amount by crypto trading standards and is not, on its own, an unusual sum. The amount is a secondary factor compared to the deliberate use of a privacy coin to sever traceability.' },
          { text: "The use of a third-party swap service, which is inherently suspicious", correct: false, feedback: 'Third-party swap services are commonly used for entirely legitimate purposes and are not inherently suspicious in isolation. It is the combination with the rapid full-cycle pattern and privacy-coin conversion that creates the red flag, not the swap service alone.' },
          { text: "The account's 6-month tenure, which is unusually long for this kind of activity", correct: false, feedback: 'An established 6-month account is generally a lower baseline risk factor, which actually makes the sudden change in behaviour notable by contrast — but the tenure itself is not the primary red flag; the privacy-coin routing is.' },
        ],
      },
      {
        id: 3, title: 'Investigation Steps',
        question: "Before escalating to the MLRO, what should you do?",
        options: [
          { text: 'Document the full transaction chain, check whether the swap service itself is a known high-risk/mixing-adjacent service, review the customer\'s full account history for any prior similar patterns, and prepare an escalation summary — avoiding customer outreach given tipping-off risk if an SAR becomes likely', correct: true, feedback: "Correct. A thorough investigation file — full transaction chain, swap service risk assessment, and account history — gives the MLRO what's needed to make an informed SAR decision. Customer outreach should generally be held back at this stage, since directly asking about a suspected layering pattern risks tipping off if an SAR is likely to follow." },
          { text: 'Contact the customer immediately to ask why they converted to Monero', correct: false, feedback: "Incorrect. Direct outreach about a suspected deliberate layering pattern, before the investigation and SAR assessment is complete, creates a real tipping-off risk — the analyst should build the investigation file first and let the MLRO decide on next steps, including whether outreach is appropriate." },
          { text: "Take no action, since XMR transactions can't be traced anyway so investigation is pointless", correct: false, feedback: "Incorrect. The inability to trace funds on-chain after conversion is exactly why the pre-conversion activity (deposits, BTC purchases, timing, swap service used) must be thoroughly documented now — this is the analyst's best opportunity to capture evidence before it becomes untraceable." },
          { text: 'Automatically close the account before completing an investigation', correct: false, feedback: "Incorrect. Account closure is a decision for the MLRO to make after reviewing a completed investigation, not a default first action — premature closure also risks alerting the customer before the SAR assessment is finished." },
        ],
      },
      {
        id: 4, title: 'SAR and Account Action',
        question: "Your investigation confirms the swap service has been flagged in industry threat intelligence as commonly used for laundering ransomware proceeds. What is the appropriate escalation?",
        options: [
          { text: 'Escalate immediately to the MLRO recommending an SAR — the combination of rapid full-cycle layering, deliberate privacy-coin conversion, and a swap service linked to known illicit proceeds meets the reasonable-grounds-to-suspect threshold; recommend a hold on any further transactions pending the MLRO\'s determination', correct: true, feedback: "Correct. Each individual factor strengthens the case, and together they clearly meet the suspicion threshold: the layering pattern, the privacy-coin routing chosen specifically to break traceability, and now a corroborated link between the swap service and ransomware proceeds. Immediate escalation with a recommended transaction hold is the appropriate response." },
          { text: 'Wait for a second occurrence before escalating', correct: false, feedback: "Incorrect. The threshold for escalation is reasonable grounds to suspect, which is already met by this single pattern combined with the threat-intelligence corroboration — waiting for repetition unnecessarily delays a required report and allows further potential laundering activity." },
          { text: 'Escalate but recommend no account restriction, since the funds have already left the platform', correct: false, feedback: "Incorrect. While the specific cycled funds have left the platform, a hold on further transactions protects against continued use of the account for the same purpose and is a standard, proportionate protective step while the MLRO reviews the case." },
          { text: 'Handle informally by emailing the customer a warning about privacy coin use', correct: false, feedback: "Incorrect and inappropriate. Directly warning the customer about privacy-coin conversion at this stage would tip them off to the investigation. This matter requires formal escalation to the MLRO, not informal customer contact." },
        ],
      },
    ],
  },
]

const CRYPTO_MLRO_CASES = [
  {
    id: 'cm1', number: '1.',
    title: 'MLRO: SAR Filing — Sanctioned Wallet Exposure',
    tags: ['Regulatory'], sector: 'Crypto', premium: false,
    shortDesc: 'Blockchain analytics flags that a customer\'s destination wallet has 12% indirect exposure to an OFAC-sanctioned mixer. The customer has £185,000 in pending withdrawals. Make the MLRO determination.',
    fullScenario: `COMPLIANCE ALERT — FOR MLRO REVIEW

Customer: Account #CR-88204 (verified UK individual, 14 months' tenure)
Trigger: Post-transaction blockchain analytics alert

Alert details:
• Customer withdrew 2.8 BTC (approximately £98,000) yesterday
• Destination wallet: 1Fx9GN... (self-custodied, customer-declared)
• Blockchain analytics (Chainalysis) risk score: HIGH
• Indirect exposure to OFAC-sanctioned Tornado Cash mixer: 12%
• Customer has a further £185,000 in pending BTC withdrawal requests

No prior alerts. No adverse media. Customer has made no unusual statements.

Your task: assess the OFAC exposure, make the SAR decision, and determine account action on the pending withdrawals.`,
    steps: [
      {
        id: 1, title: 'OFAC Exposure Assessment',
        question: "Blockchain analytics shows 12% indirect exposure to a sanctioned mixer. Does this create an OFAC sanctions violation?",
        options: [
          { text: 'Not necessarily a direct violation — indirect exposure requires risk-based assessment. However, 12% indirect exposure to a sanctioned entity is material and requires enhanced scrutiny, customer outreach, and escalation to compliance counsel', correct: true, feedback: 'Correct. OFAC\'s "50% rule" relates to entities owned 50%+ by sanctioned persons — not to transaction exposure percentages. 12% indirect exposure via a mixer does not automatically constitute a sanctions violation, but it is a material risk indicator. OFAC has published guidance on virtual currency suggesting firms should use blockchain analytics to assess sanctions risk. This level of exposure warrants customer outreach, legal review, and an SAR.' },
          { text: 'Yes — any exposure to a sanctioned entity automatically constitutes an OFAC violation requiring immediate account termination', correct: false, feedback: 'Incorrect. Indirect blockchain exposure to sanctioned entities is not automatically a violation. OFAC enforcement focuses on direct transactions with sanctioned persons/entities. However, it is a significant red flag requiring investigation.' },
          { text: 'No — 12% is below the 50% beneficial ownership threshold so no action is needed', correct: false, feedback: 'Incorrect. The 50% rule relates to beneficial ownership of sanctioned entities — not to transaction exposure percentages in blockchain analytics. These are distinct concepts. 12% indirect exposure to a sanctioned mixer is a material AML risk flag regardless of the 50% rule.' },
          { text: 'Yes — the transaction must be reversed and funds returned immediately', correct: false, feedback: 'Incorrect. Reversing an already-completed blockchain transaction is technically impossible. The obligation is to investigate, report if suspicious, and take prospective account action on pending transactions.' },
        ],
      },
      {
        id: 2, title: 'Pending Withdrawals Decision',
        question: "While you investigate, what should happen to the £185,000 in pending BTC withdrawal requests?",
        options: [
          { text: 'Place a hold on pending withdrawals, conduct wallet screening on the destination addresses, and await legal counsel review before releasing any further funds', correct: true, feedback: 'Correct. The hold is proportionate and within the exchange\'s rights under its terms of service. Releasing further funds to the same or similar high-risk wallet before completing the investigation could compound potential OFAC exposure or facilitate continued ML. Screen each destination wallet before making any release decision.' },
          { text: 'Release all pending withdrawals immediately — blocking would alert the customer to the investigation', correct: false, feedback: 'Incorrect. Releasing funds before completing the investigation risks facilitating further ML or sanctions exposure. A "security review" delay is not tipping off — it is proportionate risk management.' },
          { text: 'Permanently block all withdrawals and freeze the account immediately', correct: false, feedback: 'Permanent blocking before completing the investigation is disproportionate. A temporary hold pending investigation and legal review is more defensible and less likely to expose the exchange to a wrongful blocking claim if the customer has a legitimate explanation.' },
          { text: 'Process withdrawals under £10,000 only — large withdrawals are the only real risk', correct: false, feedback: 'Incorrect. The risk is the destination wallet\'s sanctions exposure, not the withdrawal size. Processing sub-£10,000 withdrawals to the same sanctioned-linked wallet compounds the exposure.' },
        ],
      },
      {
        id: 3, title: 'SAR Filing',
        question: "After customer outreach, the customer says: 'I used a coin swap service to get better rates — I don\'t know anything about Tornado Cash.' Does this explanation affect the SAR decision?",
        options: [
          { text: 'The explanation should be included in the SAR narrative and assessed — but it does not remove the obligation to file if reasonable grounds to suspect still exist after considering it', correct: true, feedback: 'Correct. Customer explanations must be documented and considered — they may reduce or intensify suspicion. In this case, using a "coin swap service" without due diligence on its sanctions exposure is itself a red flag. The customer\'s ignorance of Tornado Cash does not change the objective blockchain analytics result. File the SAR including the customer\'s explanation.' },
          { text: 'Accept the explanation and close the investigation — the customer was not aware of the sanctioned entity', correct: false, feedback: 'Incorrect. Lack of customer awareness does not remove the exchange\'s AML/sanctions obligations. The exchange itself has an independent obligation to report suspicious activity — that obligation is not discharged by accepting a customer\'s explanation of ignorance.' },
          { text: 'File the SAR without including the customer\'s explanation — it might weaken the report', correct: false, feedback: 'Incorrect. FinCEN and the FCA both emphasise that high-quality SARs include all relevant information — including exculpatory information. Including the customer\'s explanation strengthens the SAR\'s credibility and gives law enforcement a complete picture.' },
          { text: 'No SAR is needed — sanctions exposure is an OFAC matter, not an AML matter', correct: false, feedback: 'Incorrect. Sanctions exposure and ML risk overlap — use of mixing services to obscure transaction trails is a classic ML technique. Both may give rise to SAR obligations under the MLRA/BSA, independently of any OFAC reporting.' },
        ],
      },
      {
        id: 4, title: 'Account Action',
        question: "After filing the SAR, what is the appropriate long-term account action?",
        options: [
          { text: 'Exit the customer relationship with appropriate notice — the ongoing risk profile of a customer routing funds through sanctioned-linked mixers is incompatible with the exchange\'s risk appetite, regardless of intent', correct: true, feedback: 'Correct. Even if the customer\'s intent was not malicious, a customer who routes funds through services with material sanctions exposure creates unacceptable regulatory risk for the exchange. Customer exit is the proportionate long-term action, following appropriate notice and ensuring the exit itself doesn\'t tip off or facilitate further ML.' },
          { text: 'Continue the relationship with no changes — the SAR has discharged the exchange\'s obligations', correct: false, feedback: 'Incorrect. An SAR discharges the reporting obligation at a point in time — it does not prevent the ongoing risk from materialising. Continuing a relationship with elevated sanctions exposure after becoming aware of it could be viewed as wilful blindness.' },
          { text: 'Continue but reduce the customer\'s withdrawal limits permanently', correct: false, feedback: 'Reducing limits without exiting may not sufficiently manage the risk if the fundamental issue is the customer\'s choice of counterparty wallets. It also fails to address the SAR trigger appropriately.' },
          { text: 'Freeze all funds indefinitely and await law enforcement instruction', correct: false, feedback: 'The exchange does not have legal authority to freeze funds indefinitely without a court order. Compliance holds pending investigation are permissible — indefinite freezes are not.' },
        ],
      },
    ],
  },
  {
    id: 'cm2', number: '2.',
    title: 'MLRO: Travel Rule Compliance — Inbound Transfer from Unhosted Wallet',
    tags: ['Regulatory'], sector: 'Crypto', premium: false,
    shortDesc: 'A corporate customer receives a large BTC transfer from an unhosted wallet with no counterparty information. Assess Travel Rule obligations and determine whether the exchange can credit the funds.',
    fullScenario: `COMPLIANCE QUERY — FOR MLRO DETERMINATION\n\nCustomer: Meridian Digital Assets Ltd (corporate customer, VASP-to-VASP and self-custody transacting, 8 months' tenure)\nTransaction: Inbound transfer of 15.2 BTC (approximately £520,000)\n\nTransfer details:\n• Originating wallet: unhosted (self-custodied, non-custodial) wallet — no originating VASP\n• No originator name, address, or account number provided (not obtainable from an unhosted wallet by the sending side)\n• Transaction value well above the FATF Travel Rule threshold\n• Customer states the funds are "proceeds from a private OTC sale of digital assets"\n• No documentation of the OTC counterparty provided yet\n\nYour task: assess the Travel Rule obligations and determine whether the exchange can credit the incoming funds.`,
    steps: [
      {
        id: 1, title: 'Travel Rule Applicability',
        question: "Does FATF Recommendation 16 (the Travel Rule) require originator information for this inbound transfer?",
        options: [
          { text: "Yes in principle — FATF R.16 requires VASPs to obtain and hold required originator/beneficiary information above the threshold, but this applies VASP-to-VASP; where the originator is an unhosted wallet with no VASP counterparty, the receiving VASP cannot obtain that information from a sending institution and must instead apply its own risk-based controls", correct: true, feedback: "Correct. The Travel Rule's data-transmission mechanism assumes a sending VASP on the other end. When the originator is an unhosted wallet, there is no sending institution to transmit the information — the obligation doesn't disappear, it shifts to the receiving VASP applying enhanced, risk-based scrutiny of its own." },
          { text: 'No, the Travel Rule only applies to fiat wire transfers, not crypto transactions', correct: false, feedback: "Incorrect. FATF extended the Travel Rule to virtual assets specifically through the 2019 update to Recommendation 16, requiring VASPs to collect and transmit originator/beneficiary information for qualifying virtual asset transfers, just as with traditional wire transfers." },
          { text: 'No, transfers from unhosted wallets are entirely exempt from any AML scrutiny', correct: false, feedback: 'Incorrect. Unhosted wallet transfers are not exempt from scrutiny — if anything, FATF guidance identifies unhosted wallet interactions as a heightened-risk category requiring additional due diligence precisely because standard VASP-to-VASP data sharing is unavailable.' },
          { text: 'Yes, and the transfer must be automatically rejected since no originator VASP exists', correct: false, feedback: 'Incorrect. Automatic rejection is not the required response — FATF guidance expects a risk-based assessment (enhanced due diligence on the receiving side) rather than a blanket rejection of all unhosted-wallet transfers, which would be commercially unworkable and is not what the standard requires.' },
        ],
      },
      {
        id: 2, title: 'Missing Originator Information',
        question: "Since no originator information can be obtained from the sending unhosted wallet, what should the exchange do?",
        options: [
          { text: "Apply enhanced due diligence on the receiving end — verify the customer's identity (already known), request documentation supporting the claimed OTC sale, and conduct blockchain analytics on the originating wallet address to assess its risk profile, before deciding whether to credit the funds", correct: true, feedback: "Correct. This is the standard risk-based response to unhosted-wallet Travel Rule gaps: since originator information can't be transmitted, the receiving VASP compensates with its own enhanced controls — verifying the beneficiary (its own customer) thoroughly and independently assessing the origin and risk of the funds through blockchain analytics and supporting documentation." },
          { text: "Automatically credit the funds since the customer's identity is already verified", correct: false, feedback: "Incorrect. Beneficiary identity verification alone does not address the originator-information gap or assess the risk of the funds themselves — a £520,000 transfer from an unhosted wallet warrants independent assessment of the funds' origin before crediting, not automatic acceptance." },
          { text: 'Automatically reject the transfer since Travel Rule information is missing, with no further assessment', correct: false, feedback: "Incorrect. Automatic rejection without any risk assessment is disproportionate and not what FATF guidance requires — the correct response is a risk-based enhanced due diligence process, which may or may not conclude that the funds can be credited." },
          { text: 'Ask the customer to resend the funds through a licensed VASP instead', correct: false, feedback: "Incorrect. This is not something the exchange can retrospectively control — the funds have already been sent from an unhosted wallet. The exchange must assess and decide on the transfer as received, through its own EDD process." },
        ],
      },
      {
        id: 3, title: 'Risk-Based Crediting Decision',
        question: "Blockchain analytics shows the originating wallet has no adverse exposure (no sanctions, mixer, or darknet market links) but also no identifiable history — it's a newly created wallet funded once before this transfer. What is the appropriate decision?",
        options: [
          { text: 'Place a temporary hold on the funds pending receipt of the requested OTC counterparty documentation — a clean-but-unknown wallet with no prior history is not conclusive evidence of legitimacy for a transfer of this size', correct: true, feedback: "Correct. 'No adverse hits' is reassuring but not the same as 'verified legitimate' — a brand-new wallet with a single prior funding event provides no meaningful history to assess. For over £500,000, a proportionate response is to hold the funds pending the documentation already requested, rather than either crediting immediately or rejecting outright." },
          { text: 'Credit the funds immediately since blockchain analytics found no adverse hits', correct: false, feedback: "Incorrect. Absence of known adverse links is a necessary but not sufficient basis for crediting a transfer of this size — a wallet with no meaningful transaction history provides limited assurance on its own, and the requested supporting documentation should still be obtained first." },
          { text: 'Reject the transfer and terminate the customer relationship outright', correct: false, feedback: "Incorrect and premature. There is no adverse finding yet that would justify relationship termination — the appropriate step at this stage is a hold pending further documentation, not an outright rejection or exit before the investigation is complete." },
          { text: 'Credit the funds but flag the account for review in 12 months', correct: false, feedback: "Incorrect. A 12-month deferred review does not address the immediate question of whether this specific £520,000 transfer should be credited now — the decision on this transaction needs to be made before, not after, crediting the funds." },
        ],
      },
      {
        id: 4, title: 'SAR Consideration',
        question: "Meridian provides a signed OTC agreement, but it names a counterparty that cannot be independently verified to exist (no corporate registration found in any searched jurisdiction). How do you proceed?",
        options: [
          { text: 'This is a significant red flag — escalate to file an SAR, as an unverifiable counterparty for a £520,000 transaction combined with the unhosted-wallet origin and lack of independent corroboration meets reasonable grounds to suspect; maintain the hold on funds and consider whether to continue the relationship pending the outcome', correct: true, feedback: "Correct. A signed agreement naming a counterparty that appears not to exist in any searchable corporate registry is a serious red flag, not a resolution of the earlier concerns — it suggests the supporting documentation itself may be fabricated. This combination of factors meets the reasonable-grounds-to-suspect threshold and warrants an SAR." },
          { text: 'Accept the signed agreement as sufficient evidence and release the funds', correct: false, feedback: "Incorrect. A signed document is not evidence of legitimacy if the named counterparty cannot be independently verified to exist — accepting it at face value here would mean crediting funds based on documentation that itself raises new suspicion." },
          { text: 'Ask Meridian for a second, different explanation without escalating', correct: false, feedback: "Incorrect. Repeatedly requesting alternative explanations without escalating internally delays the required SAR assessment and risks tipping off the customer that their documentation has failed verification." },
          { text: "Release the funds since the customer provided documentation, however unverifiable, and further checking exceeds the exchange's obligations", correct: false, feedback: "Incorrect. Providing documentation that fails basic verification does not discharge the exchange's due diligence obligations — quite the opposite, an unverifiable counterparty is exactly the kind of finding that should trigger escalation and an SAR, not closure of the inquiry." },
        ],
      },
    ],
  },
]

const FINTECH_ANALYST_CASES = [
  {
    id: 'fa1', number: 'Part 1',
    title: 'E-Wallet: Money Mule Account Pattern',
    tags: ['Escalation'], sector: 'Fintech', premium: false,
    shortDesc: 'A 22-year-old\'s e-wallet account receives 14 P2P transfers from 12 different senders within 9 days of opening, with 100% immediately forwarded to a single external bank account. Investigate.',
    fullScenario: `MONITORING ALERT — E-WALLET ACCOUNT

Customer: Sophie Clarke (DOB: 3 February 2001, UK national)
Account type: Personal e-wallet (EMI-regulated)
Account age: 11 days

Alert: Velocity and pattern monitoring triggered

Transaction pattern — past 9 days:
• 14 incoming P2P transfers from 12 different senders
• Total received: £8,750 (average: £625 per transfer)
• 100% of funds immediately forwarded to a single external bank account
• No card spend, no merchant payments, no ATM withdrawals
• Customer age: 22 — newly joined, no previous relationship

Your task: analyse the alert and determine next steps.`,
    steps: [
      {
        id: 1, title: 'Pattern Recognition',
        question: "What does this transaction pattern most likely indicate?",
        options: [
          { text: 'Money mule activity — the account is being used as a pass-through to receive funds from multiple sources and forward them to a single recipient, consistent with a first-party or third-party mule arrangement', correct: true, feedback: 'Correct. This is a classic mule account pattern: multiple senders, immediate forwarding to a single recipient, zero normal retail spending, and a newly opened account. Young account holders (18–25) are disproportionately targeted for mule recruitment — often via social media with promises of "easy money for holding funds." The pattern warrants immediate investigation.' },
          { text: 'Normal P2P payment activity — young people frequently split bills and expenses via digital wallets', correct: false, feedback: 'Bill-splitting activity involves both incoming and outgoing payments to/from multiple contacts, and normal retail spending. This pattern shows exclusively incoming transfers from 12 different senders all forwarded 100% to one recipient with zero retail spend — which is inconsistent with normal bill-splitting behaviour.' },
          { text: 'A small business using a personal account to collect customer payments', correct: false, feedback: 'Possible, but a legitimate small business would typically have card spend, supplier payments, and variable outgoing patterns — not 100% pass-through to a single recipient. The absence of any retail or business spending is inconsistent with a genuine business operation.' },
          { text: 'A student receiving regular financial support from family members', correct: false, feedback: 'Family support typically involves a small number of regular senders (parents) and normal spending behaviour. 12 different senders with 100% immediate forwarding and zero personal spending is inconsistent with family support.' },
        ],
      },
      {
        id: 2, title: 'Risk Factors',
        question: "Which combination of factors makes this account MOST suspicious?",
        options: [
          { text: 'New account (11 days) + young customer (22) + multiple unrelated senders + 100% pass-through with zero personal spending + forwarding to a single unrelated bank account', correct: true, feedback: 'Correct. Each factor in isolation could be innocuous — but the combination is highly indicative of mule activity. Account age (criminals use newly opened accounts to avoid profiling), customer age (prime mule recruitment demographic), multiple senders (aggregating proceeds from multiple criminal sources), and zero personal use (the account exists only to move money, not to support the holder\'s finances).' },
          { text: 'The customer is 22 years old and female', correct: false, feedback: 'Age is a risk factor in context — not in isolation. Gender is not a risk factor for mule activity. The pattern of transactions, not demographic characteristics, drives the assessment.' },
          { text: 'The account is 11 days old', correct: false, feedback: 'Account age is one risk factor but not the most significant in isolation. The complete pattern — new account + multiple senders + 100% forwarding + zero personal use — is what creates the overall assessment.' },
          { text: 'The transfers average £625 — just below the £1,000 alert threshold', correct: false, feedback: 'The average transfer value is a factor, but average size is less significant than the overall pattern. No single red flag here is as significant as the combination of all indicators.' },
        ],
      },
      {
        id: 3, title: 'Investigation Steps',
        question: "Before escalating to the MLRO, what investigation steps should you take?",
        options: [
          { text: 'Review Sophie\'s full account history, document all sender IDs and transaction details, check whether the destination bank account has appeared on prior alerts, and contact Sophie for an explanation — documenting her response precisely', correct: true, feedback: 'Correct. Customer outreach is appropriate before escalation to allow Sophie to provide context (she may be unaware she is being used as a mule). However, her response must be documented precisely and assessed critically. The destination bank account should be checked — if it appears in multiple mule alerts, that significantly strengthens the case. All findings should go into a well-documented escalation file.' },
          { text: 'Immediately freeze the account and file an SAR without contacting Sophie', correct: false, feedback: 'Premature. While the pattern is suspicious, freezing without investigation denies Sophie the opportunity to provide an explanation (she may be a victim). The MLRO must make the account action and SAR decision with a complete investigation file — not a raw alert.' },
          { text: 'Close the account without any investigation', correct: false, feedback: 'Account closure without investigation is disproportionate and may expose the firm to wrongful termination claims. It also fails the compliance purpose — an unexplained account closure without an SAR may mean suspicious activity goes unreported to law enforcement.' },
          { text: 'Do nothing — the amounts are below £10,000 so no reporting is required', correct: false, feedback: 'Incorrect on two counts. (1) The SAR/STR threshold is not monetary — it is based on reasonable grounds to suspect, regardless of amount. (2) Structuring below thresholds is itself a red flag, not an exemption.' },
        ],
      },
      {
        id: 4, title: 'SAR and Account Action',
        question: "Sophie explains she was approached on Instagram and told she could earn £200 by letting someone use her account to 'test a payment system.' She cooperated but now feels uncomfortable. What do you do?",
        options: [
          { text: 'Escalate to the MLRO with Sophie\'s explanation — she may be a victim of mule recruitment. File an SAR including her account of events; apply an account restriction; consider signposting her to resources (e.g., Stop Scams UK)', correct: true, feedback: 'Correct. Sophie\'s explanation is consistent with third-party mule recruitment — a significant fraud and ML problem. As a victim, she warrants some care in how the firm handles the exit. The SAR remains mandatory regardless of her victim status — the criminal activity still took place through her account. The MLRO makes the final decision on account action and exit.' },
          { text: 'No SAR needed — Sophie is a victim, not a criminal', correct: false, feedback: 'Incorrect. The SAR obligation is based on the suspicious activity in the account — not on the account holder\'s culpability. Criminal funds moved through Sophie\'s account regardless of her intent. The SAR helps law enforcement identify the criminal network recruiting mules.' },
          { text: 'Accept Sophie\'s explanation and restore the account to full service', correct: false, feedback: 'Incorrect. Sophie\'s account has been used for money laundering regardless of her awareness. Restoring full service exposes the firm to continued risk. At minimum, enhanced monitoring is required; in most cases, exit is appropriate.' },
          { text: 'Report Sophie to police immediately — she admitted participating in the scheme', correct: false, feedback: 'The firm\'s obligation is to file an SAR with the FIU (NCA in the UK) — not to directly report to police. Law enforcement determines how to act on the intelligence. Additionally, Sophie\'s victim status should be considered — this is a nuanced situation requiring MLRO judgement.' },
        ],
      },
    ],
  },
  {
    id: 'fa2', number: 'Part 2',
    title: 'PSP: High Chargeback Rate — Card-Not-Present Fraud Signal',
    tags: ['Escalation'], sector: 'Fintech', premium: false,
    shortDesc: 'A business customer processing £385,000 in card-not-present payments has an 8.2% chargeback rate. Investigate the ML and fraud risk and determine reporting obligations.',
    fullScenario: `MERCHANT MONITORING ALERT — PAYMENT SERVICE PROVIDER\n\nMerchant customer: Skyline Electronics Direct Ltd\nBusiness type: Online electronics retailer (card-not-present, e-commerce only)\nAccount tenure: 5 months\nMonthly processing volume: £385,000 (card-not-present transactions)\n\nAlert: Chargeback rate monitoring\n• Chargeback rate: 8.2% (industry average for electronics e-commerce: 0.5–1%; card scheme "excessive" threshold: typically 1.5–2%)\n• Chargeback reason codes: predominantly "fraudulent transaction — cardholder does not recognise"\n• Average transaction value: £850 (high-ticket items — laptops, phones)\n• Shipping addresses: high concentration to freight-forwarding addresses (goods reshipped internationally)\n• Merchant's own fraud controls: minimal (no AVS or CVV enforcement configured)\n\nYour task: assess the fraud and ML risk and determine the appropriate response.`,
    steps: [
      {
        id: 1, title: 'Pattern Recognition',
        question: "What does this chargeback pattern most likely indicate?",
        options: [
          { text: 'Card-not-present (CNP) fraud — likely stolen card data used to purchase high-value electronics, shipped to freight-forwarding addresses for resale or export, a common "card testing and cash-out" typology; the 8.2% rate is 8–16x the industry average and dominated by "fraudulent transaction" codes', correct: true, feedback: 'Correct. The combination of a chargeback rate far above industry norms, reason codes specifically indicating cardholder-unrecognised fraud (not product disputes or returns), high-ticket items, and shipment to freight-forwarding addresses is a textbook signature of stolen-card cash-out fraud, not a legitimate retail issue.' },
          { text: "Normal customer dissatisfaction with product quality", correct: false, feedback: 'Incorrect. Product-quality disputes would show reason codes like "not as described" or "defective merchandise" — the reason codes here are overwhelmingly "fraudulent transaction, cardholder does not recognise," which points to unauthorised card use, not buyer dissatisfaction.' },
          { text: 'Seasonal returns from a legitimate electronics retailer', correct: false, feedback: 'Incorrect. Returns are processed as refunds by the merchant, not chargebacks initiated by cardholders disputing a transaction they say they never made. The reason codes and the freight-forwarding shipping pattern are inconsistent with ordinary seasonal returns.' },
          { text: "The merchant's own accounting error in processing refunds", correct: false, feedback: "Incorrect. An accounting error would not produce cardholder-initiated fraud disputes at 8x the industry average, nor would it correlate with a specific shipping pattern to freight-forwarding addresses — this is a fraud signal, not a bookkeeping issue." },
        ],
      },
      {
        id: 2, title: 'Investigation Steps',
        question: "What should the PSP review to assess whether this is fraud only, or also a money laundering risk?",
        options: [
          { text: "Review whether the merchant itself may be complicit in a collusive scheme (processing fraudulent transactions and receiving payouts before chargebacks catch up), check the merchant's payout account and beneficial ownership for links to other flagged merchants, and assess whether the freight-forwarding pattern indicates an organised card-testing fraud ring using this merchant as a laundering vector", correct: true, feedback: "Correct. Beyond just the cardholder-level fraud, the PSP needs to assess merchant-level risk — a merchant that receives stolen-card proceeds as payouts (whether knowingly complicit or grossly negligent) is itself functioning as a laundering vector for those proceeds. This requires reviewing beneficial ownership, payout patterns, and links to other flagged merchant accounts." },
          { text: 'Only review individual cardholder disputes one at a time with no merchant-level analysis', correct: false, feedback: 'Incorrect. Reviewing disputes individually misses the pattern entirely — the AML-relevant question is whether the merchant account itself is being used to process and cash out stolen-card proceeds, which only becomes visible at the aggregate, merchant level.' },
          { text: 'Assume it is purely a fraud issue for the card schemes to handle, with no AML relevance to the PSP', correct: false, feedback: "Incorrect. Proceeds of card fraud being processed and paid out through a merchant account is itself a money laundering typology — the PSP has its own independent AML obligations here, separate from (and in addition to) the card schemes' fraud management programs." },
          { text: 'Contact the freight-forwarding companies directly to request customer identities', correct: false, feedback: 'Incorrect and not the PSP\'s role. Freight forwarders are third parties with no CDD relationship to the PSP — the investigation should focus on the merchant account, its beneficial ownership, and its payout patterns, which are within the PSP\'s own visibility and authority.' },
        ],
      },
      {
        id: 3, title: 'Fraud vs. ML Reporting Obligations',
        question: "The PSP confirms this pattern is consistent with a merchant either complicit in, or grossly negligent in preventing, CNP fraud used to launder proceeds from stolen card data. What reporting obligation applies?",
        options: [
          { text: 'Both a fraud escalation AND a SAR/STR obligation likely apply — report to the relevant card scheme fraud programs, and separately assess whether the pattern meets the SAR threshold for money laundering, since proceeds of card fraud being processed and paid out through the merchant account is an ML typology in its own right', correct: true, feedback: "Correct. These are two distinct, non-substitutable obligations. Card scheme reporting addresses the fraud/chargeback compliance side; the SAR/STR obligation addresses the separate legal requirement to report suspected money laundering. A firm that only does one has not discharged the other." },
          { text: 'Only the card scheme needs to be notified, since this is fraud not money laundering', correct: false, feedback: 'Incorrect. Fraud and money laundering are not mutually exclusive — proceeds of fraud being processed through a merchant account and paid out squarely meets the definition of a predicate-offence-linked SAR trigger, independent of any card scheme reporting.' },
          { text: "No reporting is needed since the merchant hasn't been proven complicit", correct: false, feedback: 'Incorrect. The SAR/STR threshold is reasonable grounds to suspect — not proof of complicity. Whether the merchant is knowingly involved or grossly negligent, the pattern of proceeds moving through the account meets the reporting threshold either way.' },
          { text: "Only law enforcement needs to be contacted directly, bypassing the PSP's own SAR obligation", correct: false, feedback: 'Incorrect. The correct channel for suspected money laundering is the SAR/STR filed with the relevant FIU, not direct, informal contact with law enforcement — the FIU then determines how to disseminate the intelligence.' },
        ],
      },
      {
        id: 4, title: 'Account Action',
        question: "What account action is most appropriate while the investigation and any SAR process proceed?",
        options: [
          { text: "Suspend the merchant's ability to process new transactions and hold payouts while completing the investigation, given the scale of the pattern and the risk that continued processing perpetuates fraud losses and potential ML exposure", correct: true, feedback: "Correct. An 8.2% chargeback rate on £385,000 monthly volume, tied to a suspected fraud/laundering scheme, represents ongoing and escalating risk. Suspending new transaction processing and holding payouts is a proportionate protective step while the investigation and any SAR determination proceed — allowing continued processing would compound both the fraud losses and the PSP's own regulatory exposure." },
          { text: 'Continue normal processing, since chargebacks are a normal cost of doing business in e-commerce', correct: false, feedback: 'Incorrect. An 8–16x deviation from industry-average chargeback rates, combined with fraud-specific reason codes and a suspicious shipping pattern, is well beyond "normal cost of business" — continuing unrestricted processing here would expose the PSP to compounding fraud losses and ML risk.' },
          { text: "Only reduce the merchant's processing limit by half as a partial measure", correct: false, feedback: 'Incorrect. A partial limit reduction does not adequately address a pattern this severe — it still allows a substantial volume of suspected fraud/laundering activity to continue processing while the investigation is ongoing.' },
          { text: 'Terminate the merchant relationship immediately without completing the SAR assessment first', correct: false, feedback: "Incorrect. While termination may ultimately be the right outcome, it should follow (or at minimum proceed alongside) the SAR assessment — jumping straight to termination without completing that assessment risks losing the opportunity to properly document and report the suspected activity." },
        ],
      },
    ],
  },
]

const FINTECH_MLRO_CASES = [
  {
    id: 'fm1', number: '1.',
    title: 'MLRO: Account Farm — Organised Money Mule Ring',
    tags: ['Regulatory'], sector: 'Fintech', premium: false,
    shortDesc: 'The fraud team identifies a cluster of 23 e-wallet accounts opened within 5 days sharing device fingerprints, overlapping IPs, and £195,000 in aggregated pass-through activity. Make the MLRO determination.',
    fullScenario: `COMPLIANCE ESCALATION — FOR MLRO REVIEW

Source: Fraud analytics team — device and network clustering

Cluster summary:
• 23 e-wallet accounts opened across 5 days (Tuesday to Saturday)
• 19 accounts used the same selfie ID verification session (possible ID reuse)
• All accounts share overlapping IP addresses across 3 ISPs
• All accounts received funds from a single payments company (Apex Pay Ltd)
• Funds immediately forwarded onward to various MSB accounts
• Aggregated volume: £195,000 across 10 days
• No account shows any normal retail or personal spending

Your task: make the SAR and account action determinations for the cluster.`,
    steps: [
      {
        id: 1, title: 'SAR Filing Strategy',
        question: "How should the firm file SARs for this 23-account cluster?",
        options: [
          { text: 'File a single SAR covering all 23 accounts as a connected network, with a detailed narrative explaining the device/IP clustering, the common funding source (Apex Pay Ltd), and the aggregated £195,000 in suspicious activity', correct: true, feedback: 'Correct. A single, well-structured SAR covering the network is more useful to law enforcement than 23 isolated SARs. It communicates the organised nature of the scheme and allows law enforcement to see the full picture. The narrative must clearly connect all accounts, explain the linking evidence, and include the aggregated transaction data.' },
          { text: 'File 23 separate SARs — one per account — as each account is technically a separate legal subject', correct: false, feedback: 'While technically permissible, 23 isolated SARs are significantly less useful to law enforcement than a single connected SAR. FinCEN and the NCA both prefer that reporting entities identify and flag networks of related subjects in a single report or linked series of reports.' },
          { text: 'File no SAR — the individual account balances are too small to be material', correct: false, feedback: 'Incorrect. The SAR threshold is based on suspicion — not transaction size. £195,000 in aggregated suspicious activity through what appears to be an organised mule ring is clearly reportable. Failing to report would be a material compliance failure.' },
          { text: 'Wait until law enforcement contacts the firm before filing any SARs', correct: false, feedback: 'Incorrect. SAR obligations are proactive — the firm files when it forms a suspicion, not when law enforcement arrives. Waiting for law enforcement contact before reporting is a reactive posture inconsistent with AML obligations.' },
        ],
      },
      {
        id: 2, title: 'Account Action — All 23 Accounts',
        question: "What account action should be taken across all 23 accounts while the SAR is being prepared?",
        options: [
          { text: 'Apply an immediate hold on all 23 accounts simultaneously — preventing further funds from being received or forwarded while the SAR is filed', correct: true, feedback: 'Correct. A simultaneous hold is critical — if accounts are frozen one at a time, the network may detect the pattern and move remaining funds before the remaining accounts are frozen. Coordinated simultaneous holds are best practice for cluster enforcement. Document the decision and rationale carefully.' },
          { text: 'Freeze accounts one at a time, starting with the highest-balance account', correct: false, feedback: 'Sequential freezing gives the account farm operators time to drain remaining accounts once the first freeze is detected. Simultaneous action on all connected accounts is essential for effective disruption of an organised scheme.' },
          { text: 'Do not freeze accounts until the SAR is filed and the NCA responds', correct: false, feedback: 'Waiting for NCA response before taking account action allows funds to continue flowing. Account action (hold) can and should be taken before and during the SAR process — it does not require NCA consent for mule accounts where the firm is protecting itself from facilitating further ML.' },
          { text: 'Close all accounts immediately and return funds to the senders', correct: false, feedback: 'Returning funds to the senders may return proceeds of crime to criminals (since the senders — Apex Pay Ltd — may themselves be part of the scheme). Account closure should follow the SAR process, not precede it, and funds should be held pending any law enforcement direction.' },
        ],
      },
      {
        id: 3, title: 'Apex Pay Ltd — Third Party',
        question: "Apex Pay Ltd was the common funding source for all 23 accounts. What additional steps should the MLRO take regarding this entity?",
        options: [
          { text: 'Include Apex Pay Ltd in the SAR narrative as a linked entity, review all other accounts that have received funds from Apex Pay Ltd, and consider notifying your FIU liaison if Apex Pay Ltd appears to be a significant ML node', correct: true, feedback: 'Correct. The discovery of a common funding source is valuable intelligence that should be captured in the SAR and used to identify further potentially suspicious accounts across the platform. Law enforcement may not have visibility of Apex Pay Ltd as a node — your SAR intelligence may be highly actionable for them.' },
          { text: 'Contact Apex Pay Ltd directly to inform them of the suspicious activity', correct: false, feedback: 'This would be a tipping-off risk if Apex Pay Ltd is itself involved in or aware of the scheme. Even if they are not, directly contacting the subject of an SAR or a linked entity about suspicious activity investigations is not appropriate without legal counsel guidance.' },
          { text: 'No action regarding Apex Pay Ltd — your SAR obligation covers only your own customers', correct: false, feedback: 'Incorrect. While the SAR covers your direct relationship, including information about the third-party funding source is both permissible and strongly encouraged. SARs containing third-party intelligence are significantly more useful to law enforcement.' },
          { text: 'Terminate your commercial relationship with Apex Pay Ltd immediately without filing an SAR about them', correct: false, feedback: 'If Apex Pay Ltd is itself a suspicious actor, ending the relationship without filing an SAR may leave law enforcement without critical intelligence. Additionally, abrupt termination without an SAR may constitute "failure to disclose" if the relationship itself is suspicious.' },
        ],
      },
      {
        id: 4, title: 'Systemic Control Response',
        question: "This account farm exploited your digital onboarding process. What systemic control improvement should the MLRO recommend to the Board?",
        options: [
          { text: 'Implement device fingerprinting + network IP clustering at onboarding to flag accounts created from shared devices or IPs; add velocity rules for accounts receiving funds from a single corporate sender within 30 days of opening', correct: true, feedback: 'Correct. The account farm exploited gaps in your onboarding detection — specifically, the ability to open multiple accounts using shared devices or IPs without triggering a review. Device fingerprinting and network clustering are now standard fintech AML controls. The MLRO should escalate this as a control gap to the Board and recommend immediate enhancement of the onboarding risk engine.' },
          { text: 'Stop accepting new customers for 6 months while the investigation is completed', correct: false, feedback: 'A blanket onboarding freeze is disproportionate and commercially damaging. The response should be targeted control improvements — not a suspension of normal business operations.' },
          { text: 'Require all new customers to visit a branch in person to prevent digital fraud', correct: false, feedback: 'This eliminates the fintech business model and is disproportionate. Enhanced digital controls (biometric verification, device fingerprinting, liveness checks) can achieve comparable risk mitigation without abandoning digital onboarding.' },
          { text: 'The existing controls were adequate — this was an unusual event that cannot be prevented', correct: false, feedback: 'Incorrect. Account farming is a well-documented and growing fintech ML threat. The FATF, FCA, and multiple national FIUs have published typologies on account farm patterns. Claiming this was unforeseeable misrepresents the known risk landscape.' },
        ],
      },
    ],
  },
  {
    id: 'fm2', number: '2.',
    title: 'MLRO: Regulatory Examination — FCA AML Supervisory Visit',
    tags: ['Regulatory'], sector: 'Fintech', premium: false,
    shortDesc: 'The FCA has notified an upcoming supervisory visit focusing on your EMI\'s transaction monitoring and SAR quality. Prepare the MLRO response file and rehearse the key examination areas.',
    fullScenario: `REGULATORY EXAMINATION PREP — Guided Walkthrough\n\nThis simulation guides you through preparing for an FCA AML supervisory visit — a structured examination process EMIs (Electronic Money Institutions) and payment firms undergo under the FCA's AML/CTF supervisory remit.\n\nNotification received: The FCA has confirmed a 2-day on-site supervisory visit in 6 weeks, with a stated focus on: (1) transaction monitoring effectiveness, and (2) SAR/SMR quality and timeliness.\n\nMLRO: [Your name]\nFirm: Mid-sized EMI providing e-money accounts and card issuing to consumers and SMEs\n\nWork through each section to understand what the FCA will examine and how to prepare an effective response file.`,
    steps: [
      {
        id: 1, title: 'Section 1: Pre-Visit Preparation',
        question: "What should be the MLRO's first priority in the 6 weeks before the visit?",
        options: [
          { text: 'Conduct an internal gap analysis against the stated focus areas — pull a sample of recent alerts and SARs, assess whether monitoring rules are properly calibrated and whether SARs meet quality/timeliness standards, and remediate any gaps found before the FCA arrives', correct: true, feedback: 'Correct. The FCA has told you exactly what it will focus on. The most effective use of the preparation window is to self-audit against those two areas now, so any gaps are already identified and being remediated by the time examiners arrive — rather than being discovered live during the visit.' },
          { text: 'Focus primarily on tidying policy documents and org charts, since those are what regulators typically review first', correct: false, feedback: "Incorrect. While documentation matters, the FCA has explicitly flagged transaction monitoring effectiveness and SAR quality as the focus — an internal gap analysis of actual operational performance in those two areas is a far higher-value use of the preparation time than polishing static documents." },
          { text: "Wait until the FCA's visit to see what they focus on before preparing anything", correct: false, feedback: "Incorrect. The firm has already been told the two focus areas — waiting to react during the visit itself wastes the six-week preparation window and risks the FCA discovering unremediated gaps live." },
          { text: 'Delegate all preparation to external counsel without internal review', correct: false, feedback: "Incorrect. External counsel can support the process, but the MLRO cannot delegate away ownership of understanding the firm's actual operational performance — the FCA will expect the MLRO personally to have a detailed, first-hand grasp of the monitoring and SAR findings." },
        ],
      },
      {
        id: 2, title: 'Section 2: Transaction Monitoring Effectiveness',
        question: "The FCA will likely ask how the firm demonstrates its transaction monitoring rules are 'effective' rather than just 'present.' What evidence should the MLRO prepare?",
        options: [
          { text: 'Evidence of rule calibration and tuning — alert volumes, false-positive rates, periodic rule reviews based on typology trends, above/below-the-line testing, and examples of how monitoring rules have actually led to genuine SAR filings', correct: true, feedback: "Correct. 'Effectiveness' is demonstrated through evidence that the system is actively tuned and produces real outcomes — not just that it exists. FCA examiners specifically probe for false-positive management, periodic recalibration, and a track record connecting alerts to real SAR filings, which together show the system is doing genuine risk-based work." },
          { text: "A copy of the monitoring system's vendor brochure describing its features", correct: false, feedback: "Incorrect. A vendor brochure describes theoretical capability, not how the firm has actually configured, tuned, and operated the system. The FCA is examining the firm's own governance and use of the tool, not the vendor's marketing material." },
          { text: 'The total number of alerts generated last year, with no further analysis', correct: false, feedback: 'Incorrect. A raw alert count says nothing about quality — a high alert volume with an unmanaged false-positive rate and no rule tuning actually suggests weaker, not stronger, monitoring effectiveness.' },
          { text: 'A statement that the system was purchased from a reputable vendor and is therefore presumed effective', correct: false, feedback: "Incorrect. Effectiveness cannot be presumed from vendor reputation — the FCA's supervisory approach specifically requires firms to demonstrate ongoing, evidenced calibration and outcome-tracking of their own monitoring programme." },
        ],
      },
      {
        id: 3, title: 'Section 3: SAR Quality and Timeliness',
        question: "A sample review finds that while all SARs were filed within regulatory timeframes, several narratives are generic and lack transaction-level detail. What should the MLRO do before the visit?",
        options: [
          { text: 'Treat this as a genuine finding requiring remediation — timeliness alone does not satisfy FCA expectations; review and strengthen the SAR drafting process, and be prepared to discuss the gap transparently with examiners along with the remediation plan', correct: true, feedback: 'Correct. Regulators consistently respond far better to firms that self-identify issues with a credible fix already underway than to issues examiners discover themselves. Timeliness is only one dimension of SAR quality — narratives without specific transaction detail are far less useful to the NCA and are a genuine finding, not a minor stylistic issue.' },
          { text: 'Since all SARs were filed on time, no further action is needed before the visit', correct: false, feedback: 'Incorrect. Timeliness and quality are separate dimensions. A SAR filed on time but lacking transaction-level detail still represents a quality gap that the FCA would flag, and leaving it unaddressed before the visit misses a clear opportunity for self-remediation.' },
          { text: 'Avoid raising this internally to prevent drawing attention to it before the FCA visit', correct: false, feedback: "Incorrect. Suppressing a known finding internally does not make it disappear — it only ensures the firm is unprepared if the FCA's own sample review finds the same gap, which is a far worse outcome than proactive remediation." },
          { text: 'Retroactively rewrite historical SAR narratives to add missing detail before the visit', correct: false, feedback: "Incorrect and improper. Rewriting historical SARs after the fact would misrepresent the contemporaneous record submitted to the NCA. The correct response is to fix the process going forward and be transparent about the historical gap, not alter past records." },
        ],
      },
      {
        id: 4, title: 'Section 4: During the Visit',
        question: "During the visit, an examiner asks a direct question about a specific SAR where the MLRO knows the firm's response could have been faster. How should the MLRO respond?",
        options: [
          { text: 'Answer honestly and directly, explaining what happened, why there was a delay, and what has since been done to prevent recurrence', correct: true, feedback: 'Correct. FCA examiners consistently report that firms who are transparent about weaknesses and demonstrate credible remediation are treated far more favourably than firms who appear evasive or defensive. Misleading a regulator during a supervisory visit is itself a serious — and potentially separately actionable — regulatory matter, well beyond the underlying timing issue.' },
          { text: "Minimise the delay and suggest it was within acceptable tolerances even if it wasn't", correct: false, feedback: "Incorrect. Misrepresenting facts to a regulator during a supervisory visit is a serious matter in its own right, independent of the underlying issue — and examiners are typically well-placed to test claims against the firm's own records." },
          { text: 'Redirect the conversation to other, stronger areas of the AML programme', correct: false, feedback: "Incorrect. Deflecting a direct examiner question reads as evasiveness and typically prompts further, more skeptical scrutiny — a direct, honest answer to the specific question asked is the better approach." },
          { text: 'Decline to answer and refer the examiner to written correspondence after the visit', correct: false, feedback: "Incorrect. Declining to answer a direct question the MLRO can answer, during an on-site visit specifically about this topic, is unlikely to be well-received and does not serve the firm's interests — cooperative, direct engagement is the expected standard." },
        ],
      },
    ],
  },
]

const ACCOUNTANT_ANALYST_CASES = [
  {
    id: 'aa1', number: 'Part 1',
    title: 'Company Formation: Opaque Offshore Structure Request',
    tags: ['Escalation'], sector: 'Accountant', premium: false,
    shortDesc: 'An intermediary asks the firm to incorporate a company with a nominee director and refuses to disclose the ultimate beneficial owner. Work through the TCSP CDD requirements.',
    fullScenario: `NEW CLIENT INSTRUCTION — For CDD Review\n\nClient: Mr. Andrew Pearce (acting as intermediary/introducer)\nService requested: Incorporate "Meridian Trading Solutions Pty Ltd" and arrange for a nominee director and nominee shareholder\nStated purpose: "International trading company for a client who values privacy"\n\nDetails provided so far:\n• Mr. Pearce says he is acting on behalf of an undisclosed overseas principal\n• He requests the firm's own staff member act as nominee director\n• Mr. Pearce declines to name the beneficial owner, citing "client confidentiality"\n• Initial capital: $50,000 to be wired from an account in a jurisdiction not yet disclosed\n\nYour task: assess the CDD requirements before agreeing to provide this company formation and nominee service.`,
    steps: [
      {
        id: 1, title: 'Initial CDD Assessment',
        question: 'What is the correct first step before agreeing to provide this service?',
        options: [
          { text: "Identify and verify the ultimate beneficial owner behind Mr. Pearce's undisclosed principal — as a Tranche 2 TCSP, the firm must identify the beneficial owner of any company it helps form, and cannot rely on an intermediary's refusal to disclose that information", correct: true, feedback: 'Correct. Trust and company service providers are squarely captured by the 2024 Tranche 2 reforms specifically because company formation is a recognised ML vector for concealing beneficial ownership. The firm cannot proceed without identifying the natural person(s) who ultimately own or control the new company.' },
          { text: 'Proceed with incorporation since Mr. Pearce himself has been identified', correct: false, feedback: "Incorrect. Identifying the intermediary who is making the request does not satisfy the obligation to identify the beneficial owner of the company being formed — Mr. Pearce is acting on someone else's behalf, and that someone else is who must be identified." },
          { text: 'Ask AUSTRAC for permission to proceed without knowing the beneficial owner', correct: false, feedback: "Incorrect. AUSTRAC does not grant case-by-case exemptions from beneficial ownership identification — this is a fundamental, non-waivable CDD requirement, not something a regulator can pre-approve around." },
          { text: 'Proceed since client confidentiality legally prevents disclosure of the beneficial owner', correct: false, feedback: 'Incorrect. Professional confidentiality obligations do not override the statutory requirement to identify beneficial owners before providing designated services — this is a common misunderstanding that does not hold up under the AML/CTF Act.' },
        ],
      },
      {
        id: 2, title: 'Beneficial Ownership Look-Through',
        question: "Mr. Pearce eventually says the principal is 'a Cayman Islands trust,' but declines to name the trustee, settlor, or beneficiaries. Is this sufficient to proceed?",
        options: [
          { text: 'No — naming a trust without identifying its settlor, trustee, and beneficiaries does not satisfy beneficial ownership requirements; the firm must look through the trust to the natural persons in each role, exactly as for any trust structure', correct: true, feedback: 'Correct. A trust is not a natural person and cannot itself be a UBO. Regardless of where the trust is established, the firm must identify the settlor, trustee(s), and beneficiaries — the same look-through principle that applies to every trust structure.' },
          { text: 'Yes — once a legal entity or arrangement is named, no further look-through is required', correct: false, feedback: 'Incorrect. Naming an entity or arrangement is only the first step — beneficial ownership rules specifically require looking through legal structures to the natural persons who ultimately control or benefit from them.' },
          { text: 'Yes — offshore trusts administered by regulated professional trustees are exempt from look-through', correct: false, feedback: 'Incorrect. There is no such exemption. Professional or regulated trustee status does not remove the requirement to identify the settlor, trustee, and beneficiaries.' },
          { text: 'No, but only because the Cayman Islands is a higher-risk jurisdiction — a trust in a low-risk jurisdiction would not need look-through', correct: false, feedback: 'Incorrect. Jurisdiction affects the risk rating and depth of EDD applied, but the requirement to look through any trust to its settlor, trustee, and beneficiaries applies regardless of jurisdiction.' },
        ],
      },
      {
        id: 3, title: 'Nominee Director Risk',
        question: "What is the specific AML risk of the firm's own staff member acting as nominee director for an undisclosed principal?",
        options: [
          { text: 'The arrangement would place the firm in a position of exercising legal control over a company on behalf of someone it cannot identify — this is a classic mechanism for concealing beneficial ownership, and the firm itself would be facilitating it', correct: true, feedback: 'Correct. Nominee director arrangements are legitimate when the underlying principal is known and verified — the risk here is specifically that the firm would be lending its own legal control to a structure built around an undisclosed owner, which is precisely the opacity beneficial ownership rules exist to prevent.' },
          { text: 'There is no real risk provided the staff member is experienced and trustworthy', correct: false, feedback: "Incorrect. The risk does not depend on the staff member's personal trustworthiness — it depends on whether the underlying principal has been identified, which at this point it has not." },
          { text: 'Nominee director arrangements are illegal, so this cannot be discussed further regardless of disclosure', correct: false, feedback: 'Incorrect. Nominee arrangements are legal and common in many jurisdictions when the principal is properly identified and disclosed — the issue here is specifically the lack of disclosure, not the nominee mechanism itself.' },
          { text: 'The risk only materialises if the company later becomes insolvent', correct: false, feedback: 'Incorrect. The AML risk exists at the point the firm agrees to act for an unidentified principal — it does not depend on any future financial outcome of the company.' },
        ],
      },
      {
        id: 4, title: 'Final Decision',
        question: "Mr. Pearce says that if the firm won't provide the nominee director service without disclosure, he'll take his business elsewhere. How should the firm respond?",
        options: [
          { text: 'Decline to provide the company formation and nominee director service — the firm cannot discharge its CDD obligations without identifying the beneficial owner, and the risk of facilitating concealment of ownership outweighs the loss of this engagement', correct: true, feedback: 'Correct. No commercial pressure can override the firm\'s statutory obligation to identify beneficial owners. Losing the engagement is the correct and lawful outcome when a client or intermediary refuses to provide required CDD information.' },
          { text: 'Proceed reluctantly and apply Enhanced Due Diligence after the company has been formed', correct: false, feedback: 'Incorrect. EDD is applied to manage elevated risk on an identified customer — it cannot substitute for the baseline requirement to identify the beneficial owner before providing the service in the first place.' },
          { text: 'Proceed, but document Mr. Pearce\'s refusal on file as protection for the firm', correct: false, feedback: "Incorrect. Documenting a refusal does not discharge the firm's CDD obligation — the firm would still be providing company formation and nominee services to an unidentified principal, which is the substantive problem." },
          { text: 'Refer Mr. Pearce to a different firm without further consideration', correct: false, feedback: 'Incorrect as a complete response. Simply passing the client along does not address whether the firm should itself consider the pattern (refusal to identify a beneficial owner for a nominee arrangement) as a red flag warranting internal escalation.' },
        ],
      },
    ],
  },
  {
    id: 'aa2', number: 'Part 2',
    title: 'Accountant: Unexplained Cash Income on Tax Return',
    tags: ['Escalation'], sector: 'Accountant', premium: false,
    shortDesc: 'A long-standing bookkeeping client wants a sudden $186,000 in cash deposits recorded as "consulting income" with no supporting documentation. Investigate before lodging the return.',
    fullScenario: `ONGOING CLIENT — For Review\n\nClient: Marcus Webb, sole trader, "Webb Handyman Services"\nService: Bookkeeping and annual tax return preparation, 4 years' engagement\nHistorical declared income: ~$45,000/year (cash and card payments from small residential jobs)\n\nThis year's activity:\n• 18 cash deposits totalling $186,000 over 6 months\n• Marcus says the deposits are for "a big consulting contract" but provides no invoices, contracts, or client names\n• He asks you to record the amount as "consulting income" on his tax return\n• When pressed for details, Marcus becomes evasive and says "just put it through, I'll get you the paperwork later"\n\nYour task: assess whether you can prepare and lodge this return as instructed.`,
    steps: [
      {
        id: 1, title: "Assessing the Request",
        question: "What is the immediate concern with Marcus's request?",
        options: [
          { text: "The $186,000 in cash deposits is grossly inconsistent with his declared business history, and he has provided no verifiable documentation — recording it as 'consulting income' without supporting evidence risks the firm facilitating the disguising of the funds' true origin", correct: true, feedback: "Correct. Deposits over four times Marcus's typical annual income, described only verbally and with no supporting invoices or client details, is a clear inconsistency that must be resolved before the firm processes the figures — regardless of the eventual tax treatment." },
          { text: "There is no concern, since the income will be reported and taxed either way", correct: false, feedback: "Incorrect. Paying tax on funds does not establish that they are legitimately earned — this is a common misconception. The AML concern is about the unexplained origin of the funds, which tax payment does not resolve." },
          { text: "This is only a concern if it is later found the consulting contract didn't exist", correct: false, feedback: "Incorrect. The concern arises now, from the pattern itself — an unusually large, undocumented cash inflow inconsistent with the client's history — not retrospectively if the story is later disproven." },
          { text: "This is not an AML concern since accountants are only responsible for tax compliance", correct: false, feedback: "Incorrect. As a Tranche 2 reporting entity, the firm has AML/CTF obligations that are distinct from, and in addition to, its tax compliance responsibilities under the Tax Practitioners Board." },
        ],
      },
      {
        id: 2, title: 'Documentation Standard',
        question: 'What should the firm require before including this income on the return?',
        options: [
          { text: "Verifiable supporting documentation — contracts, invoices, correspondence, or bank records from the paying parties — sufficient to substantiate that the cash genuinely originates from the consulting work described", correct: true, feedback: "Correct. The firm needs independent, verifiable evidence connecting the cash to the stated consulting work — not just Marcus's account of events. This is standard source-of-funds verification applied to an unusual and unexplained income pattern." },
          { text: "A signed statement from Marcus confirming the funds are legitimate", correct: false, feedback: "Incorrect. Self-declarations carry no independent evidentiary value — a client attempting to disguise the source of funds would simply sign such a statement." },
          { text: "Nothing further — cash income is common for sole traders in this line of work", correct: false, feedback: "Incorrect. While cash income is common for handyman services generally, $186,000 is more than four times Marcus's typical annual income and described as an entirely different type of work ('consulting') — this specific pattern warrants documentation regardless of how common cash income is in general." },
          { text: "Only bank statements showing the deposits", correct: false, feedback: "Incorrect. Bank statements confirm the deposits occurred but say nothing about where the cash actually came from — the firm needs evidence of the underlying source, not just the movement of funds." },
        ],
      },
      {
        id: 3, title: 'Client Refuses Documentation',
        question: "Marcus says he 'doesn't keep paperwork like that' and insists the firm lodge the return as-is. What should the firm do?",
        options: [
          { text: 'Decline to lodge the return as instructed and escalate internally for an AML assessment — reasonable grounds to suspect may be forming given the unexplained, undocumented, and inconsistent cash income', correct: true, feedback: "Correct. An unresolved, undocumented, and materially inconsistent income pattern that the client refuses to substantiate is exactly the kind of red flag that requires internal escalation to assess whether an SMR is warranted — the firm should not simply process the figures as given." },
          { text: "Lodge the return anyway, since accurate record-keeping is the client's legal responsibility, not the accountant's", correct: false, feedback: "Incorrect. While clients are responsible for their own records, the firm has independent professional and AML obligations that are not discharged simply by shifting responsibility to the client." },
          { text: "Lodge the return but note internally that documentation is outstanding", correct: false, feedback: "Incorrect. Merely noting the gap on file does not address the underlying suspicion — if reasonable grounds to suspect are forming, the firm needs to actively assess and potentially report, not just document the shortfall." },
          { text: "Terminate the client relationship immediately without further assessment", correct: false, feedback: "Incorrect as an immediate first step. The firm should complete an internal AML assessment — including considering whether an SMR is required — before deciding on the future of the relationship, rather than exiting without that assessment." },
        ],
      },
      {
        id: 4, title: 'SMR Consideration',
        question: 'After internal review, there is no plausible explanation for the cash income pattern. What is the appropriate next step?',
        options: [
          { text: "Escalate to the firm's AML/CTF compliance officer to assess whether reasonable grounds to suspect exist and whether an SMR should be filed with AUSTRAC — the unexplained, undocumented, and inconsistent cash pattern is a recognised red flag for placement-stage money laundering", correct: true, feedback: 'Correct. This pattern — a sudden, large, undocumented cash inflow wildly inconsistent with declared income, with no plausible explanation provided despite being asked — meets the reasonable-grounds-to-suspect threshold and should be escalated for an SMR determination.' },
          { text: 'Report the matter to the ATO instead of AUSTRAC', correct: false, feedback: 'Incorrect. Suspicious matter reporting for AML/CTF purposes goes to AUSTRAC, Australia\'s financial intelligence unit — not the ATO, which is a separate regulator with a different mandate.' },
          { text: "Confront Marcus directly and demand a full explanation before taking any other action", correct: false, feedback: 'Incorrect. Directly confronting the client before completing the internal escalation risks tipping off, and the correct sequence is to escalate internally to the compliance officer first, who can then determine the appropriate next steps.' },
          { text: "Simply decline to act for Marcus in future, with no reporting", correct: false, feedback: 'Incorrect. Ending the relationship does not discharge the obligation to assess and, if warranted, report reasonable grounds to suspect — declining to act further is a separate decision from the SMR consideration.' },
        ],
      },
    ],
  },
]

const ACCOUNTANT_MLRO_CASES = [
  {
    id: 'am1', number: '1.',
    title: 'MLRO: TCSP Review — Unverified Change of Director',
    tags: ['Regulatory'], sector: 'Accountant', premium: false,
    shortDesc: 'An existing TCSP client\'s sole director changes to an unverified individual who won\'t respond to identity requests. Assess the company-takeover risk and make the MLRO determination.',
    fullScenario: `ANALYST ESCALATION — For MLRO Review\n\nClient: Ashford Group Holdings Ltd (existing TCSP client, 2 years' engagement — the firm provides registered office and company secretarial services)\nTrigger: Annual company statement lodgement reveals the sole director has changed to a newly-appointed individual, Mr. Rahim Osei, who has no prior connection to the company on file\n\nAnalyst findings:\n• Mr. Osei was appointed director 3 weeks ago via a resolution signed by the previous director, who has since resigned\n• The firm has never met or verified Mr. Osei's identity\n• The company's registered address (provided by the firm) has received no other correspondence for Mr. Osei\n• A request to Mr. Osei for identity documents has gone unanswered for 2 weeks\n• The company's bank signatories have not yet been updated to reflect the change\n\nYour task: determine the appropriate MLRO response.`,
    steps: [
      {
        id: 1, title: 'Assessing the Change',
        question: 'What is the primary concern raised by this change in directorship?',
        options: [
          { text: 'An unverified individual has been appointed sole director and has not responded to identity verification requests — this is a classic pattern for company takeover fraud or installing a nominee to obscure control, and the firm cannot continue providing services to an unverified controller', correct: true, feedback: 'Correct. The combination of a sudden, unexplained director change, no prior connection to the company, and non-response to identity requests is a well-documented company-takeover/hijacking pattern — the firm must treat this as a serious CDD failure requiring immediate action, not routine corporate housekeeping.' },
          { text: 'Minimal concern, since director changes are a routine corporate event', correct: false, feedback: 'Incorrect. While director changes are routine on their face, the unresponsiveness to identity verification combined with no prior connection to the company and the departing director\'s resignation make this pattern materially different from routine succession.' },
          { text: "Concern only if the company's bank accounts show unusual activity", correct: false, feedback: "Incorrect. The CDD failure itself — an unverified individual now controlling the company — is the immediate issue, independent of whether transaction activity has yet occurred through the firm's or bank's visibility." },
          { text: "Concern only because Mr. Osei's name is unfamiliar to the firm", correct: false, feedback: 'Incorrect and an inappropriate basis for concern. The actual issue is the total absence of verification and the non-response to requests — not the individual\'s identity or name itself.' },
        ],
      },
      {
        id: 2, title: 'Ongoing Service Provision',
        question: "The firm continues to provide registered office and secretarial services while awaiting Mr. Osei's response. Is this appropriate?",
        options: [
          { text: 'Ongoing services should be paused or restricted until identity is verified — continuing to service a company controlled by an unverified individual risks facilitating whatever purpose the change in control serves', correct: true, feedback: 'Correct. Continuing to lend the firm\'s registered office and company secretarial services to a company with an unverified controller — especially one not responding to verification requests — creates real exposure to facilitating fraud or laundering. Services should be paused pending resolution.' },
          { text: "Appropriate, since the firm's TCSP services don't involve directly handling the company's funds", correct: false, feedback: "Incorrect. TCSP obligations — including registered office and company secretarial roles — carry AML/CTF responsibilities for the company's controllers regardless of whether the firm directly handles client funds." },
          { text: 'Appropriate — simply flag the file for review at next year\'s annual statement', correct: false, feedback: 'Incorrect. This is not a routine annual-review matter; the pattern warrants immediate escalation and action, not deferral to the next scheduled review cycle.' },
          { text: "Appropriate, since the signed resignation resolution is sufficient legal documentation of the change", correct: false, feedback: "Incorrect. The legal formality of a resolution documenting the director change does not satisfy the firm's own, separate CDD obligation to independently verify the new director's identity." },
        ],
      },
      {
        id: 3, title: 'Identifying the Typology',
        question: 'What specific typology should the MLRO consider given this pattern?',
        options: [
          { text: "Company takeover ('hijacking') fraud — control of a company is fraudulently transferred, often via forged resolutions or exploiting a registered agent's processes, to misuse the company's credit history, bank accounts, or legal identity before the fraud is detected", correct: true, feedback: 'Correct. This is a well-documented typology specifically targeting companies with registered agents and TCSPs — a dormant or under-monitored company is taken over via a fraudulent director change, then used to establish credit, open accounts, or conduct transactions under a legitimate-looking corporate identity.' },
          { text: 'Standard succession planning that has simply not yet been finalised', correct: false, feedback: 'Incorrect. This framing dismisses the specific red flags present — no prior connection to the company, non-response to verification, and the previous director\'s resignation — which are inconsistent with ordinary planned succession.' },
          { text: 'Tax avoidance through a change in beneficial tax residency', correct: false, feedback: "Incorrect. Nothing in the facts relates to tax residency — the pattern concerns unverified control of the company, not a tax planning arrangement." },
          { text: "A data entry error by the previous director when lodging the annual statement", correct: false, feedback: 'Incorrect. A data entry error would not explain the pattern of non-response to identity verification requests over multiple weeks, combined with the previous director\'s resignation.' },
        ],
      },
      {
        id: 4, title: 'MLRO Determination',
        question: 'After 4 weeks of no response from Mr. Osei, what should the MLRO decide?',
        options: [
          { text: 'Terminate the registered office/company secretarial engagement and file an SMR — the combination of an unverified new controller, non-response to repeated CDD requests, and the company-takeover fraud profile meets reasonable grounds to suspect', correct: true, feedback: 'Correct. After a month of unresolved, unverified control and no cooperation with identity requests, the firm has both a CDD failure it cannot cure and a pattern consistent with a recognised fraud typology — termination and an SMR are the appropriate outcomes.' },
          { text: 'Wait a further 3 months before taking any action', correct: false, feedback: 'Incorrect. Four weeks of non-response to a straightforward identity verification request, combined with the other red flags, already supports a decision — further delay is not warranted and extends the firm\'s exposure.' },
          { text: 'Terminate the engagement but do not file an SMR since no funds have moved through the firm', correct: false, feedback: 'Incorrect. The SMR obligation is based on reasonable grounds to suspect, not on whether funds have specifically moved through the firm — the unresolved CDD failure and takeover-fraud pattern already meet that threshold.' },
          { text: 'Continue the engagement but require Mr. Osei to provide ID before next year\'s annual statement', correct: false, feedback: 'Incorrect. This inappropriately extends an unresolved, unverified control situation for up to a year — the firm needs to resolve or exit the relationship now, not defer verification to the next compliance cycle.' },
        ],
      },
    ],
  },
  {
    id: 'am2', number: '2.',
    title: 'MLRO: First-Year AML/CTF Program Implementation Review',
    tags: ['Regulatory'], sector: 'Accountant', premium: false,
    shortDesc: 'Walk through your firm\'s first annual review of its AML/CTF Program since becoming an AUSTRAC reporting entity under the 2024 Tranche 2 reforms.',
    fullScenario: `FIRST-YEAR AML/CTF PROGRAM REVIEW — Guided Walkthrough\n\nThis simulation guides you through your firm's first annual review of its AML/CTF Program since becoming a reporting entity under the 2024 Tranche 2 reforms.\n\nFirm: 12-partner accounting and company secretarial practice, newly enrolled with AUSTRAC this year\nMLRO: [Your name] (newly appointed AML/CTF Compliance Officer)\n\nWork through each section to understand what a first-year review should cover.`,
    steps: [
      {
        id: 1, title: 'Section 1: Enrolment & Governance',
        question: 'The firm enrolled with AUSTRAC 8 months ago, but the AML/CTF Program was only formally approved by the partners 2 months ago. Is this a concern for the review?',
        options: [
          { text: 'Yes — the firm should have had an approved Program in place before providing any designated services as a reporting entity; the gap should be documented as a finding, with client work conducted in that window reviewed retrospectively for compliance', correct: true, feedback: 'Correct. Enrolling with AUSTRAC without an approved AML/CTF Program already in place leaves a period where designated services were provided without the required governance framework — this is exactly the kind of implementation gap a first-year review exists to catch and remediate.' },
          { text: 'No concern, since enrolment itself demonstrates the firm\'s intent to comply', correct: false, feedback: 'Incorrect. Enrolment is a registration step, not a substitute for having an approved, operational AML/CTF Program — the intent to comply doesn\'t address the fact that services were provided during an 8-month gap without one.' },
          { text: 'No concern, since AUSTRAC allows a 12-month grace period after enrolment before a program is required', correct: false, feedback: 'Incorrect. There is no blanket grace period of this kind — reporting entities are expected to have their Program in place to govern the designated services they provide.' },
          { text: 'Only relevant if a client complaint was received during the gap period', correct: false, feedback: 'Incorrect. The governance gap is a compliance finding in its own right, independent of whether any client complaint happened to arise during that window.' },
        ],
      },
      {
        id: 2, title: 'Section 2: Risk Assessment Coverage',
        question: "The firm's EWRA covers its company formation and registered office services but doesn't address its bookkeeping and tax return services. Is this adequate?",
        options: [
          { text: 'No — the EWRA must cover all designated services within the AML/CTF obligation, including bookkeeping/tax services where they involve activities captured by the Tranche 2 reforms, not just company formation and registered office work', correct: true, feedback: 'Correct. An Enterprise-Wide Risk Assessment that only covers some of the firm\'s in-scope services leaves a genuine gap — every designated service the firm provides needs to be assessed, even if the resulting risk rating and controls differ by service line.' },
          { text: 'Adequate, since bookkeeping is inherently lower risk and can be excluded from the EWRA', correct: false, feedback: 'Incorrect. A risk-based approach means applying proportionate controls to lower-risk services — it does not mean omitting them from the risk assessment altogether.' },
          { text: 'Adequate, since tax services are already regulated separately by the Tax Practitioners Board', correct: false, feedback: "Incorrect. TPB regulation is a separate, parallel professional obligation — it doesn't substitute for the firm's own AML/CTF risk assessment of services that fall within its Tranche 2 obligations." },
          { text: 'Adequate as long as company formation is covered, since it is the highest-risk service', correct: false, feedback: 'Incorrect. All in-scope designated services need EWRA coverage — covering only the highest-risk one leaves other in-scope services unassessed.' },
        ],
      },
      {
        id: 3, title: 'Section 3: Staff Training Completion',
        question: '6 of the firm\'s 12 partners and 3 of 8 support staff have completed AML/CTF training. What should the first-year review recommend?',
        options: [
          { text: 'Mandate 100% completion with a firm deadline — with only half of partners and roughly a third of support staff trained, this is a material gap for a firm in its first year of the obligation and should be escalated with a clear remediation timeline', correct: true, feedback: 'Correct. AML/CTF training is a mandatory obligation for relevant employees, not a gradual rollout — a completion rate this low, particularly among partners who make client-acceptance decisions, is a significant first-year finding requiring a firm deadline.' },
          { text: 'Accept the current completion rate since it is the first year and staff are still adjusting', correct: false, feedback: 'Incorrect. The training obligation applies from the point the firm becomes a reporting entity — it is not phased in gradually to allow for an adjustment period.' },
          { text: 'Recommend training only for the 6 partners who haven\'t completed it, since support staff don\'t need AML training', correct: false, feedback: "Incorrect. Support staff involved in delivering designated services also need training appropriate to their role — the gap among support staff is a finding too, not just among partners." },
          { text: 'Note the gap informally without a partner-level deadline', correct: false, feedback: 'Incorrect. Given the scale of the shortfall — roughly half of partners and two-thirds of support staff untrained — this warrants formal escalation with a firm deadline, not an informal note.' },
        ],
      },
      {
        id: 4, title: 'Section 4: Independent Review Scheduling',
        question: "When should the firm schedule its first independent review of the AML/CTF Program?",
        options: [
          { text: 'Within 3 years of the program\'s approval at the latest — but given this is a newly implemented program in a newly regulated sector, an earlier review (e.g. 12-18 months) is prudent to catch implementation gaps like the ones already found here, rather than waiting the full 3 years', correct: true, feedback: 'Correct. The 3-year mark is a maximum, not a target — for a brand-new program in a sector still adjusting to first-time AML/CTF obligations, bringing the independent review forward is a sensible way to catch and fix implementation gaps early rather than letting them persist for years.' },
          { text: 'Exactly 3 years from AUSTRAC enrolment, regardless of when the Program was approved', correct: false, feedback: "Incorrect anchor point. The review cycle should be tied to the Program's approval and implementation, not the enrolment date, and 3 years is the maximum interval — not a fixed target to aim for regardless of circumstances." },
          { text: 'No independent review is required for firms below a certain size', correct: false, feedback: 'Incorrect. There is no size-based exemption from the independent review requirement — it applies to reporting entities regardless of firm size.' },
          { text: 'Only if AUSTRAC specifically requests one', correct: false, feedback: "Incorrect. Scheduling periodic independent review is a proactive obligation on the reporting entity — it is not contingent on AUSTRAC making a specific request." },
        ],
      },
    ],
  },
]

const CASES_BY_INDUSTRY = {
  banking: { analyst: ANALYST_CASES, mlro: MLRO_CASES },
  law:     { analyst: LAW_ANALYST_CASES,    mlro: LAW_MLRO_CASES    },
  crypto:  { analyst: CRYPTO_ANALYST_CASES, mlro: CRYPTO_MLRO_CASES },
  fintech: { analyst: FINTECH_ANALYST_CASES, mlro: FINTECH_MLRO_CASES },
  accountant: { analyst: ACCOUNTANT_ANALYST_CASES, mlro: ACCOUNTANT_MLRO_CASES },
}

const INDUSTRY_LABELS = {
  banking: 'Banking',
  law:     'Law',
  crypto:  'Crypto',
  fintech: 'Fintech',
  accountant: 'Accountant / TCSPs',
}

const CAMS_MODULES = [
  {
    id: 'cams1', number: 'Chapter 1', isExam: true,
    title: 'Risks and Methods of ML & Terrorist Financing',
    tags: ['CAMS Prep'], sector: 'CAMS', premium: true,
    shortDesc: 'The three-stage ML cycle, key typologies, terrorist financing distinctions, predicate offences, and detection indicators.',
    fullScenario: `CAMS EXAM PREP — Chapter 1\n\nRisks and Methods of Money Laundering & Terrorist Financing\n\n20 exam-style questions covering:\n• The three-stage ML cycle: placement, layering, integration\n• Key typologies: TBML, real estate, loan-back, round-tripping, hawala, cuckoo smurfing\n• Terrorist financing vs. money laundering\n• Predicate offences\n• Casinos, virtual assets, gatekeepers, NPOs, cyber-enabled ML`,
    steps: [
      {
        id: 1, title: 'Placement Stage',
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
        id: 3, title: 'Integration Stage',
        question: "Which of the following BEST describes the integration stage of money laundering?",
        options: [
          { text: 'Reinvesting laundered funds into the legitimate economy — purchasing property, luxury goods, or stakes in legitimate businesses so proceeds appear indistinguishable from lawful wealth', correct: true, feedback: 'Correct. Integration is the final stage. Once funds have been placed and layered, they re-enter the economy as apparently legitimate assets. Detection at this stage is most difficult because the funds have already been distanced from their criminal origin.' },
          { text: 'Introducing illegal cash into the financial system through bank deposits', correct: false, feedback: 'This describes placement — the first stage. Integration is the final stage where already-laundered funds re-enter the legitimate economy.' },
          { text: 'Wiring funds through multiple shell company accounts across jurisdictions', correct: false, feedback: 'This describes layering — the second stage. Integration occurs after funds have already been distanced from their criminal source.' },
          { text: 'Converting cash to cryptocurrency to obscure the audit trail', correct: false, feedback: 'Converting cash to cryptocurrency is a layering technique. Integration involves using already-laundered funds to purchase legitimate assets or investments.' },
        ],
      },
      {
        id: 4, title: 'ML vs. Terrorist Financing',
        question: "Which statement MOST accurately describes the PRIMARY distinction between money laundering and terrorist financing?",
        options: [
          { text: 'Money laundering generates proceeds from crime and seeks to legitimise them; terrorist financing may use legitimately sourced funds directed toward illegal activity', correct: true, feedback: 'Correct. This is the fundamental distinction. ML is always proceeds-driven (funds come FROM crime). TF can use clean money directed TO illegal purposes — making it harder to detect through traditional financial profiling.' },
          { text: 'Terrorist financing always involves larger sums than money laundering', correct: false, feedback: 'Incorrect. TF operations are often low-cost — the 9/11 attacks cost approximately $400,000–$500,000. Transaction size is not a reliable distinguisher.' },
          { text: 'Money laundering requires an international element; terrorist financing is purely domestic', correct: false, feedback: 'Both ML and TF can be domestic or international. The cross-border element is not what distinguishes them.' },
          { text: 'Terrorist financing is only conducted through informal value transfer systems like hawala', correct: false, feedback: 'TF uses many channels including formal banking, charities, cash couriers, and digital assets — not exclusively hawala.' },
        ],
      },
      {
        id: 5, title: 'Trade-Based ML',
        question: "A company consistently over-invoices imports from a related foreign supplier by 40%, pays the inflated amounts through the banking system, and the surplus is refunded to an offshore account. This is BEST described as:",
        options: [
          { text: 'Trade-based money laundering (TBML) — using the international trade system to transfer value and obscure its origin', correct: true, feedback: 'Correct. TBML is one of the most difficult typologies to detect because it exploits the complexity of international trade. Over-invoicing, under-invoicing, multiple invoicing, and falsely described goods are all TBML techniques. The FATF identifies TBML as one of the three main ML methods globally.' },
          { text: 'Real estate laundering — using property to convert and clean criminal proceeds', correct: false, feedback: 'Real estate laundering involves purchasing property with criminal proceeds. This scenario involves trade transactions, not property.' },
          { text: 'Loan-back scheme — using criminal funds disguised as a loan repayment', correct: false, feedback: 'Loan-back schemes involve criminals lending themselves their own criminal proceeds through a shell company, then "repaying" the loan to create legitimate-looking income.' },
          { text: 'Structuring — breaking transactions into smaller amounts to avoid reporting thresholds', correct: false, feedback: 'Structuring involves splitting cash transactions below reporting thresholds. This scenario involves inflated trade invoices — a different method.' },
        ],
      },
      {
        id: 6, title: 'Structuring / Smurfing',
        question: "An individual makes 11 cash deposits of $9,100 over three weeks across four branches, totalling $100,100. This practice is BEST described as:",
        options: [
          { text: 'Structuring (smurfing) — deliberately splitting transactions to stay below reporting thresholds', correct: true, feedback: 'Correct. Structuring is illegal in most jurisdictions regardless of whether the underlying funds are criminal. Deliberately fragmenting transactions to avoid regulatory reporting is itself a criminal offence (31 USC §5324 in the US; s.140 of the AML/CTF Act in Australia).' },
          { text: 'Integration — using the deposits to fund legitimate purchases', correct: false, feedback: 'Integration occurs when laundered funds re-enter the economy. The deposits described suggest placement/layering, not the final integration stage.' },
          { text: 'Layering — moving funds through complex transaction chains', correct: false, feedback: 'Layering typically involves converting funds through multiple institutions or jurisdictions. The pattern here is specifically about avoiding a reporting threshold — the defining characteristic of structuring.' },
          { text: 'Normal business activity — small businesses often deposit daily takings across branches', correct: false, feedback: 'While possible, 11 deposits across four branches each just below the reporting threshold, totalling $100,100, creates reasonable grounds for suspicion and warrants investigation.' },
        ],
      },
      {
        id: 7, title: 'Predicate Offences',
        question: "Under the FATF Recommendations, which of the following is classified as a predicate offence for money laundering?",
        options: [
          { text: 'All serious offences — including drug trafficking, corruption, fraud, tax crimes, and human trafficking. FATF recommends a broad approach covering all serious crimes', correct: true, feedback: 'Correct. FATF Recommendation 3 requires ML to apply to all serious offences. FATF specifically designates categories including drug trafficking, organised crime, terrorism, human trafficking, corruption, fraud, tax crimes, counterfeiting, cybercrime, and environmental crime.' },
          { text: 'Only drug trafficking — the original focus of AML frameworks at their establishment', correct: false, feedback: 'While AML frameworks originally focused on drug proceeds (the 1988 Vienna Convention), FATF has progressively expanded the predicate offence scope. Tax crimes and corruption were not added until 2012.' },
          { text: 'Only offences that cross international borders', correct: false, feedback: 'FATF does not require an international element. Domestic predicate offences are equally covered.' },
          { text: 'Only offences punishable by more than 10 years imprisonment', correct: false, feedback: 'FATF allows jurisdictions to define serious offences by penalty thresholds or designated category lists. The 10-year threshold is one permitted option, not the only one.' },
        ],
      },
      {
        id: 8, title: 'Loan-Back Scheme',
        question: "In a loan-back scheme, a criminal typically:",
        options: [
          { text: 'Places criminal proceeds with a financial institution or shell company, then borrows against those same funds, repaying the "loan" with criminal proceeds to create the appearance of legitimate debt repayment', correct: true, feedback: 'Correct. The loan-back technique creates a paper trail that makes criminal proceeds appear to be legitimate loan repayments. The "lender" (a shell company controlled by the criminal) appears to provide a legitimate service, while the "repayments" integrate criminal funds into the financial system as apparently legitimate transactions.' },
          { text: 'Uses multiple bank accounts to split deposits below reporting thresholds', correct: false, feedback: 'This describes structuring/smurfing — a different technique. The loan-back scheme specifically creates a fictitious lending arrangement.' },
          { text: 'Purchases property below market value and resells at a profit to generate apparent capital gain', correct: false, feedback: 'This describes a form of real estate laundering. The loan-back scheme involves a fictitious lending arrangement, not property transactions.' },
          { text: 'Transfers criminal proceeds through a series of offshore accounts to obscure their origin', correct: false, feedback: 'This describes layering through wire transfers. The loan-back scheme specifically uses a lending structure to legitimise the funds.' },
        ],
      },
      {
        id: 9, title: 'Real Estate ML',
        question: "Which of the following is MOST commonly associated with real estate money laundering?",
        options: [
          { text: 'Purchasing property with cash or through shell companies — often using anonymous ownership structures — to convert criminal proceeds into apparently legitimate assets', correct: true, feedback: 'Correct. Real estate is one of the most heavily exploited ML sectors globally. Key characteristics: all-cash purchases (avoiding bank scrutiny), use of shell companies and nominee owners (concealing beneficial ownership), rapid resale or rental income (integration), and geographic concentration in high-value markets.' },
          { text: 'Using a solicitor\'s client account to hold funds temporarily before business payment', correct: false, feedback: 'While law firm client accounts are exploited for ML, this describes a specific vector (gatekeepers/legal professionals) rather than the primary real estate ML method.' },
          { text: 'Renting property to criminal associates at below-market rates', correct: false, feedback: 'Below-market rentals may involve tax evasion or undeclared income, but they are not the primary ML method associated with real estate. The primary concern is cash-funded purchases concealing beneficial ownership.' },
          { text: 'Mortgaging criminal proceeds through a bank and defaulting deliberately', correct: false, feedback: 'This describes mortgage fraud, which is a predicate offence, but not the primary real estate ML method. The primary concern is cash purchases that avoid the financial system entirely.' },
        ],
      },
      {
        id: 10, title: 'Shell Companies',
        question: "The PRIMARY AML risk associated with shell companies and nominee structures is:",
        options: [
          { text: 'They allow beneficial owners to conceal their identity behind a corporate structure, making it extremely difficult to identify the natural person ultimately controlling or benefiting from criminal funds', correct: true, feedback: 'Correct. Shell companies create a "corporate veil" that separates the apparent owner from the true beneficial owner. They are central to ML typologies because they provide apparent legitimacy, cross-border flexibility, and difficulty of attribution. FATF Recommendations 24 and 25 specifically address the need for beneficial ownership transparency for legal persons and arrangements.' },
          { text: 'They are incorporated in offshore jurisdictions and therefore pay no tax', correct: false, feedback: 'Tax avoidance or evasion may be a consequence, but the PRIMARY AML risk is the concealment of beneficial ownership — not the tax treatment. Many legitimate businesses use offshore structures for valid commercial reasons.' },
          { text: 'They can employ large numbers of people without AML obligations', correct: false, feedback: 'Employment capacity is not an AML risk factor. The AML risk is specifically the ability to conceal the identity of the persons controlling or benefiting from the entity.' },
          { text: 'They must be registered with securities regulators and therefore attract scrutiny', correct: false, feedback: 'Shell companies specifically avoid regulatory registration requirements. The risk is precisely the lack of transparency and scrutiny — not increased registration obligations.' },
        ],
      },
      {
        id: 11, title: 'Bulk Cash Smuggling',
        question: "Bulk cash smuggling refers to:",
        options: [
          { text: 'Physically transporting large quantities of currency across borders — typically concealed in vehicles, luggage, or cargo — to move criminal proceeds outside the regulated financial system', correct: true, feedback: 'Correct. Bulk cash smuggling avoids the AML controls of the formal financial system entirely. It is the primary ML method for drug trafficking organisations in many jurisdictions. FATF estimates that the majority of drug proceeds in some regions are moved via bulk cash smuggling rather than through the banking system.' },
          { text: 'Using multiple small deposits across different branches to avoid Currency Transaction Reports', correct: false, feedback: 'This describes structuring/smurfing — a technique used within the financial system. Bulk cash smuggling involves physically moving currency outside the financial system.' },
          { text: 'Moving funds electronically through multiple correspondent banks to obscure the trail', correct: false, feedback: 'This describes electronic layering via wire transfers — a different technique. Bulk cash smuggling involves the physical movement of currency.' },
          { text: 'Using trade invoices to transfer value across borders', correct: false, feedback: 'This describes trade-based money laundering (TBML). Bulk cash smuggling specifically involves physical currency, not paper-based value transfer.' },
        ],
      },
      {
        id: 12, title: 'Hawala / Informal Value Transfer',
        question: "Hawala and similar Informal Value Transfer Systems (IVTS) are used for ML/TF because they:",
        options: [
          { text: 'Transfer value across borders based on trust networks and offsetting debt settlement — with minimal or no paper trail and no movement of physical currency across borders', correct: true, feedback: 'Correct. In a hawala transaction, a sender gives funds to a broker (hawaladar) in one country, who contacts a counterpart in the destination country to pay the recipient — settling the debt separately through goods, counter-transfers, or cash. The absence of a formal paper trail makes hawala attractive to ML/TF actors, though it is also used for legitimate low-cost international remittances.' },
          { text: 'It is a formal banking channel with lower fees than SWIFT wire transfers', correct: false, feedback: 'Hawala operates entirely outside the formal banking system. Its appeal is the absence of formal documentation and regulatory oversight, not lower banking fees.' },
          { text: 'It requires identity verification at both sending and receiving ends under AML regulations', correct: false, feedback: 'The defining characteristic of hawala is the opposite — traditionally, minimal or no formal identity verification. However, many jurisdictions now require IVTS operators to register and apply CDD.' },
          { text: 'It is exclusively used for legitimate remittances and presents no ML risk', correct: false, feedback: 'While hawala has deep historical roots in legitimate international remittances, it presents significant ML/TF risk specifically because of its informal, trust-based nature and minimal documentation.' },
        ],
      },
      {
        id: 13, title: 'Casino ML',
        question: "Casinos present unique AML risks primarily because they:",
        options: [
          { text: 'Allow criminals to convert cash into chips, conduct minimal play, and redeem chips for a casino cheque — effectively washing criminal cash through an apparent gambling transaction', correct: true, feedback: 'Correct. The chip conversion technique is a classic casino ML method that combines placement (cash for chips) and integration (chips redeemed as apparent gambling proceeds). Casinos are also vulnerable to structuring (multiple sub-threshold transactions), smurfing (multiple players pooling chips), and infiltration of gambling revenue reporting. FATF designated casinos as DNFBPs subject to AML obligations.' },
          { text: 'Are required to file Currency Transaction Reports for all transactions over $10,000, which attracts criminals', correct: false, feedback: 'CTR requirements are a compliance control, not a risk. The risk arises from the ability to convert cash into a new form (chips) that is redeemable as apparent gambling proceeds — circumventing CTR visibility.' },
          { text: 'Operate exclusively online and therefore cannot verify customer identity', correct: false, feedback: 'Land-based casinos also present significant ML risk. Online casinos have different (often enhanced) KYC requirements. The ML risk is not limited to the online channel.' },
          { text: 'Are not subject to AML regulations in any jurisdiction', correct: false, feedback: 'Casinos are subject to AML regulations as DNFBPs under FATF Recommendation 22. Most major jurisdictions require casino operators to apply CDD, report suspicious transactions, and maintain transaction records.' },
        ],
      },
      {
        id: 14, title: 'Cyber-Enabled ML',
        question: "Which of the following is an example of cyber-enabled money laundering?",
        options: [
          { text: 'Using proceeds from ransomware attacks to purchase cryptocurrency, cycling through multiple wallets and mixing services, then converting to fiat through a lightly regulated exchange', correct: true, feedback: 'Correct. Cyber-enabled ML combines predicate cybercrime (ransomware) with cryptocurrency-based layering (multiple wallets, mixing services) and integration through exchanges. The speed and pseudonymity of cryptocurrency make it attractive for layering cyber-crime proceeds. FATF\'s 2021 guidance on virtual assets specifically identifies this typology.' },
          { text: 'Hacking a bank\'s systems to reduce a customer\'s loan balance', correct: false, feedback: 'This describes cyber fraud or embezzlement — a predicate offence, not money laundering itself. ML would be the subsequent process of disguising the fraudulent proceeds.' },
          { text: 'Using social media to recruit individuals to act as money mules', correct: false, feedback: 'Mule recruitment is a social engineering technique related to the overall ML scheme, but it is not itself cyber-enabled ML. The ML activity is the subsequent movement of funds through mule accounts.' },
          { text: 'Installing ATM skimmers to steal card data and make fraudulent withdrawals', correct: false, feedback: 'ATM fraud is a predicate offence. The ML component would be the laundering of the fraudulently obtained cash — not the card data theft itself.' },
        ],
      },
      {
        id: 15, title: 'Round-Tripping',
        question: "Round-tripping as a money laundering technique involves:",
        options: [
          { text: 'Moving funds out of a country disguised as a foreign investment, cycling them through one or more offshore jurisdictions, and reintroducing them as apparent foreign direct investment to give criminal proceeds a legitimate origin', correct: true, feedback: 'Correct. Round-tripping exploits the appearance of cross-border investment. A company or individual moves criminal proceeds offshore, then reintroduces them as a "foreign investor" — giving the funds a legitimate-sounding international origin. This technique is well-documented in jurisdictions with significant illicit capital flight.' },
          { text: 'Making multiple small cash deposits in a circular pattern across different banks', correct: false, feedback: 'This describes structuring/smurfing. Round-tripping specifically involves moving funds offshore and reintroducing them as apparent foreign investment — not cash deposit patterns.' },
          { text: 'Purchasing and reselling the same physical asset multiple times to inflate its apparent value', correct: false, feedback: 'This describes asset price inflation — a different technique often used in real estate ML. Round-tripping involves funds moving offshore and returning as apparent foreign investment.' },
          { text: 'Using a hawala network to simultaneously transfer funds in both directions', correct: false, feedback: 'Bilateral hawala transfers are a different technique. Round-tripping specifically involves the movement of funds abroad and their reintroduction as apparent foreign capital.' },
        ],
      },
      {
        id: 16, title: 'Red Flags',
        question: "A customer pays for a high-value luxury vehicle entirely in cash and declines to explain the origin of the funds. Under a risk-based approach, this should be treated as:",
        options: [
          { text: 'A red flag requiring documentation, customer outreach for an explanation, and MLRO escalation if the explanation is unsatisfactory', correct: true, feedback: 'Correct. Cash payment for a high-value asset is a classic placement/integration indicator. The customer\'s unwillingness to explain the source of funds intensifies the suspicion. Most jurisdictions require dealers in high-value goods to apply AML controls including CDD and suspicious activity reporting — and all financial institutions and DNFBPs should treat this pattern as a red flag requiring investigation.' },
          { text: 'Normal behaviour — wealthy customers frequently prefer to pay in cash', correct: false, feedback: 'While some legitimate customers pay in cash, the combination of a high-value all-cash purchase and refusal to explain source of funds is a red flag that cannot be dismissed on the basis of wealth alone. The obligation is to verify, not to assume legitimacy.' },
          { text: 'Acceptable since cash is legal tender in all jurisdictions', correct: false, feedback: 'Legal tender status does not suspend AML obligations. High-value cash transactions are specifically identified as high-risk in FATF guidance and most national AML regulations.' },
          { text: 'A low-risk transaction because the purchase is for a tangible physical asset', correct: false, feedback: 'High-value tangible assets (luxury goods, vehicles, property, art) are frequently used for ML integration precisely because they are tangible and can be resold. Physical asset purchases are a recognised ML risk — not a mitigating factor.' },
        ],
      },
      {
        id: 17, title: 'Virtual Assets',
        question: "FATF Recommendation 15 was updated in 2019 to address virtual assets primarily because:",
        options: [
          { text: 'Virtual assets present ML/TF risks due to speed of cross-border transfers, pseudonymity, and the ability to obscure transaction trails through mixing services and privacy coins', correct: true, feedback: 'Correct. FATF R.15 requires countries to apply AML/CFT regulations to Virtual Asset Service Providers (VASPs), including registration/licensing, CDD, record-keeping, SAR filing, and the Travel Rule (R.16). The risks are real but so are the opportunities — blockchain analytics can trace transactions in ways impossible with cash.' },
          { text: 'Virtual assets are fully anonymous and untraceable in all circumstances', correct: false, feedback: 'Most public blockchains are pseudonymous, not fully anonymous. Blockchain analytics tools (Chainalysis, Elliptic) can often trace and attribute transactions. Privacy coins (Monero, Zcash) offer stronger anonymity but are not universally untraceable.' },
          { text: 'FATF wanted to prohibit the use of cryptocurrency globally', correct: false, feedback: 'FATF does not seek to prohibit virtual assets — it seeks to regulate them. R.15 extends the existing AML framework to the virtual asset sector, not eliminate it.' },
          { text: 'Virtual asset service providers were already fully regulated in all FATF member jurisdictions', correct: false, feedback: 'The 2019 update specifically addressed regulatory gaps — many jurisdictions had no VASP regulation. The update drove significant new regulatory activity in jurisdictions that had not yet regulated the sector.' },
        ],
      },
      {
        id: 18, title: 'Gatekeepers',
        question: "In the AML context, 'gatekeepers' refers to:",
        options: [
          { text: 'Professionals such as lawyers, accountants, real estate agents, and trust and company service providers (TCSPs) who — wittingly or unwittingly — assist ML by providing access to the financial system or legitimate-appearing corporate structures', correct: true, feedback: 'Correct. Gatekeepers are designated as DNFBPs under FATF Recommendations 22 and 23 precisely because they provide professional services that can be exploited for ML. Key risks: lawyers holding client account funds, accountants structuring shell company arrangements, real estate agents facilitating cash purchases. Criminal liability for "wilful blindness" applies in many jurisdictions.' },
          { text: 'Bank compliance officers who screen transactions before they are processed', correct: false, feedback: 'Compliance officers are AML practitioners, not gatekeepers in the FATF sense. The gatekeeper concept specifically refers to professionals in regulated non-financial sectors who provide access to the financial system.' },
          { text: 'FATF assessors who evaluate member countries\' AML systems', correct: false, feedback: 'FATF assessors are part of the mutual evaluation framework — they are not gatekeepers. Gatekeepers are private sector professionals who can inadvertently enable ML.' },
          { text: 'Regulators who approve new financial products before market launch', correct: false, feedback: 'Product approvers are regulators — not gatekeepers in the AML sense. The gatekeeper concept is specific to private sector professionals providing access to the financial system or legitimate-appearing structures.' },
        ],
      },
      {
        id: 19, title: 'Non-Profit Organisations',
        question: "Terrorist financiers may exploit non-profit organisations (NPOs) primarily to:",
        options: [
          { text: 'Divert donated funds to terrorist groups under the guise of charitable activity, or use NPO bank accounts to move funds internationally with reduced scrutiny', correct: true, feedback: 'Correct. NPO exploitation for TF was highlighted in the 9/11 Commission Report. FATF Recommendation 8 specifically addresses NPO risks. The key vulnerabilities: cross-border fund flows with humanitarian cover, limited AML oversight in many jurisdictions, and the ability to collect funds from many donors without individual attribution. FATF does not require NPOs to apply AML controls but requires countries to protect the sector from TF abuse.' },
          { text: 'Launder large quantities of drug proceeds through charitable donation matching programs', correct: false, feedback: 'While NPO structures can be used for ML, the PRIMARY identified risk in FATF guidance is TF — the diversion of (often legitimately donated) funds to terrorist groups — not drug money laundering.' },
          { text: 'Avoid paying tax on criminal income by claiming charitable deductions', correct: false, feedback: 'Tax evasion through fraudulent charitable deductions is a fraud/predicate offence concern, not the primary TF risk associated with NPOs.' },
          { text: 'Access government grants that can be redirected to criminal purposes', correct: false, feedback: 'While government grant fraud is a predicate offence, the FATF-identified TF risk for NPOs is the exploitation of genuine charitable donations and international fund transfer capabilities — not government grant access.' },
        ],
      },
      {
        id: 20, title: 'Cuckoo Smurfing',
        question: "'Cuckoo smurfing' is BEST described as:",
        options: [
          { text: 'A technique where criminal funds are deposited into the bank accounts of unwitting third parties who are expecting legitimate funds from overseas — using innocent account holders as unknowing conduits', correct: true, feedback: 'Correct. In cuckoo smurfing, a criminal intercepts a legitimate overseas transfer expectation: an individual expects money from abroad; instead of the legitimate remitter sending funds, the criminal deposits equivalent criminal cash into the target\'s local account, while the "legitimate" equivalent funds are moved by the criminal\'s overseas network. The account holder receives the expected amount and has no knowledge they have received criminal proceeds.' },
          { text: 'Using multiple couriers (smurfs) to make deposits below the reporting threshold at different branches', correct: false, feedback: 'This describes standard smurfing. Cuckoo smurfing is distinct — it specifically exploits legitimate international fund transfer expectations to launder criminal cash through unknowing account holders.' },
          { text: 'Using shell companies to nest criminal funds within layers of legitimate corporate structures', correct: false, feedback: 'Shell company layering is a different technique. Cuckoo smurfing specifically targets individual account holders who are expecting legitimate overseas payments.' },
          { text: 'Converting criminal cash into casino chips and redeeming them as winnings', correct: false, feedback: 'This is the casino chip conversion technique. Cuckoo smurfing is specifically about exploiting legitimate international payment expectations to deposit criminal cash into unknowing recipients\' accounts.' },
        ],
      },
      {
        id: 21, title: 'Broker-Dealer Red Flags', selectCount: 2,
        question: "A customer opens a corporate account with a broker-dealer on behalf of several beneficial owners, with a stated long-term investment goal. The customer deposits $25.5 million into the account and three days later transfers $5 million to an overseas bank. Shortly thereafter, the customer begins making numerous purchases of pesos. The compliance officer receives a query regarding the movement of funds. Within a month of account opening, the customer depletes the account. Which two red flags should prompt the firm's compliance officer to take action?",
        options: [
          { text: 'The new account deposit is $25.5 million', correct: false },
          { text: 'A corporate account is opened on behalf of several beneficial owners', correct: false },
          { text: 'The compliance officer receives the query regarding the movement of funds', correct: true },
          { text: "The customer's stated investment goal is not reflective of account activity", correct: true },
        ],
        explanation: "The size of the deposit and having multiple beneficial owners aren't inherently suspicious on their own. What matters is the mismatch: an outside query about the fund movements, and activity (rapid overseas transfers, peso purchases, full depletion within a month) that contradicts the account's stated long-term investment purpose — a classic sign the stated purpose is a cover story.",
      },
      {
        id: 22, title: 'Casino Chip Structuring', selectCount: 2,
        question: "A customer brings $15,000 worth of chips into a casino and plays various games. The customer redeems all the remaining chips and requests a wire transfer of the proceeds to an unrelated third party. What are two red flags that indicate money laundering?",
        options: [
          { text: 'Customer redeeming all remaining chips', correct: false },
          { text: 'Playing various games before cashing out', correct: false },
          { text: 'Bringing $15,000 worth of chips into the casino', correct: true },
          { text: 'Requesting a wire transfer to an unrelated third party', correct: true },
        ],
        explanation: "A large cash-equivalent buy-in ($15,000, near common reporting thresholds) combined with a payout directed to someone who isn't the customer are the two elements that don't fit ordinary gambling behaviour. Playing games and redeeming chips are what every gambler does — the size of the buy-in and the third-party payout are what warrant scrutiny.",
      },
      {
        id: 23, title: 'Unusual Account Activity', selectCount: 2,
        question: "In the summer, an institution identifies AML concerns regarding a customer's account activity. The customer, an ice cream parlor, has deposited a lot of checks drawn on banks in foreign countries, sent a large number of high-dollar international wires to different countries, made cash deposits of a few hundred dollars every few days, and written multiple checks for a few hundred dollars to the same dozen payees every two weeks. Which two transaction types warrant investigation?",
        options: [
          { text: 'Regular cash deposits', correct: false },
          { text: 'The wires to foreign countries', correct: true },
          { text: 'Repeated checks to the same payees', correct: false },
          { text: 'Checks drawn on banks in foreign countries', correct: true },
        ],
        explanation: "A small seasonal ice cream parlor has no plausible business reason to be sending high-dollar international wires or receiving foreign-drawn checks — those two patterns are completely inconsistent with the stated business. The small recurring cash deposits and repeat local payee checks are exactly what you'd expect from a real neighbourhood business.",
      },
      {
        id: 24, title: 'Accountants Laundering Money', selectCount: 3,
        question: "Which three methods are commonly used by an accountant to launder money?",
        options: [
          { text: 'Representing a client in court', correct: false },
          { text: 'Understating income to take a tax loss', correct: false },
          { text: 'Overstating income to hide excess cash', correct: true },
          { text: 'Acting as a conduit for transferring cash between accounts', correct: true },
          { text: 'Acting as a designee for someone who wishes to hide their identity', correct: true },
        ],
        explanation: "Accountants who launder money misuse the trust and access their role gives them: inflating declared income to explain away illicit cash, moving money between accounts on a client's behalf, and standing in as a nominee to hide the real owner's identity. Representing clients in court is a legal function, not a financial one, and understating income to reduce tax is evasion — a different crime, not a laundering technique in itself.",
      },
      {
        id: 25, title: 'Broker-Dealer Physical Certificates', selectCount: 2,
        question: "What are two reasons physical securities certificates present a money laundering risk to broker-dealers?",
        options: [
          { text: 'The trade information on a physical certificate can be easily altered', correct: false },
          { text: 'Physical certificates do not expire and may be held by the owner for perpetuity', correct: false },
          { text: 'There is little information readily available to the broker confirming the source of the funds', correct: true },
          { text: 'Physical certificates may be provided to nominees for deposit or settled in off-market transactions', correct: true },
        ],
        explanation: "Physical certificates sit outside the electronic clearing system, so a broker has limited visibility into who really funded the purchase and can be handed to a nominee or settled off-market — both of which break the audit trail a broker would normally rely on to understand a transaction's origin.",
      },
      {
        id: 26, title: 'Trade-Based ML — Silk Flowers', selectCount: 2,
        question: "An automotive parts company in South America sends multiple $500,000 wire transfers per week to a company in Asia referencing payment for silk flower shipments. Research reveals the receiving company is registered in the British Virgin Islands with no available ownership information. What are two red flags that indicate trade-based money laundering?",
        options: [
          { text: 'The transaction involves the use of front (or shell) companies', correct: true },
          { text: 'The packaging is inconsistent with the commodity or shipping method', correct: false },
          { text: 'Significant discrepancies appear between the description of the commodity on the bill of lading and the invoice', correct: false },
          { text: "The type of commodity being shipped appears inconsistent with the exporter or importer's regular business activities", correct: true },
        ],
        explanation: "An automotive parts company has no business reason to be paying for silk flower shipments — the stated trade purpose doesn't match either party's actual business. Combined with an offshore recipient whose beneficial ownership can't be established, this is a textbook case of trade documentation being used purely as a wire-transfer justification.",
      },
      {
        id: 27, title: 'PEP-Linked Corporate Structure', selectCount: 2,
        question: "A corporate services provider in an EU country has a prospect from an African country who deals in oil and gas. The prospect intends to develop an oil terminal in his home country with a $75 million loan secured by a third party — a trust formed in a Caribbean island with a holding company based in a European secrecy haven. A young woman is presented as the ultimate beneficial owner, having gained her wealth through a fitness studio in her home country. What are two red flags that could indicate money laundering or financing of terrorism?",
        options: [
          { text: 'A loan worth $75 million with a third-party guarantor', correct: false },
          { text: "The guarantor company's ownership structure is overly complex", correct: true },
          { text: 'The prospect wishes to have a corporate structure with a holding company in an EU country', correct: false },
          { text: 'The ultimate beneficial owner is a young woman who has gained her wealth through a small business', correct: true },
        ],
        explanation: "A stated source of wealth (a single fitness studio) that couldn't plausibly generate the funds behind a $75 million secured loan is a glaring mismatch, and stacking a Caribbean trust behind a secrecy-haven holding company deliberately obscures who is really guaranteeing the deal. A loan with a guarantor and an EU holding company are unremarkable on their own.",
      },
      {
        id: 28, title: 'Precious Metals Risk', selectCount: 2,
        question: "Which two aspects of precious metals pose the highest risk of money laundering?",
        options: [
          { text: 'Some precious metals can be formed into other objects, making them easier to transport', correct: true },
          { text: 'Precious metals have high intrinsic value in a relatively compact form and are easy to convert into currency', correct: true },
          { text: 'The value of precious metals can be inflated easily, making it easy to increase the amount of money laundered', correct: false },
          { text: 'Precious metals can be readily used in many high-tech commercial applications, making them all the more valuable', correct: false },
        ],
        explanation: "The two features that matter for laundering are portability and liquidity: metal melted or reshaped into everyday objects moves across borders without drawing attention, and its high value-to-weight ratio means it converts back to cash quickly almost anywhere in the world. Industrial demand and price inflation don't make an asset easier to launder — they're separate market dynamics.",
      },
      {
        id: 29, title: 'Trade-Based ML — Transshipment', selectCount: 2,
        question: "A periodic review of a small household goods business reveals multiple shipments of goods to a country classified by the bank as high risk. The goods were transshipped through another country before reaching their final destination, and recent shipment volumes are far larger than in the business's 10-year history. The unit price of the goods is now three times higher than before, though the buyer and payment originator are unchanged. Which two red flags indicate potential trade-based money laundering?",
        options: [
          { text: 'The shipments of the same goods are now going to a different location', correct: false },
          { text: 'The goods are transshipped through one or more jurisdictions for no apparent economic reason', correct: true },
          { text: "The size of the shipments appears inconsistent with the exporter's previous business activities", correct: true },
          { text: 'The goods are shipped to a jurisdiction that the bank classifies as high risk for money laundering activities', correct: false },
        ],
        explanation: "Routing goods through an extra country adds cost and time with no commercial upside — a classic sign the shipment is being used to layer value rather than move product efficiently. A sudden jump to volumes and unit prices far outside a decade of established trading history is the other clear anomaly. The destination being high-risk and buyer/originator staying the same are context, not red flags on their own.",
      },
      {
        id: 30, title: 'Art Auction Red Flags', selectCount: 2,
        question: "An auction house dealing in fine art and antiques sells a well-known painting for $12 million to an agent bidding on behalf of a group of investors. The same painting sold at auction ten years earlier for $5 million. Payment is received via wire transfer from an offshore account held by the investor group, with no beneficial ownership information available for the account. What are two money laundering red flags?",
        options: [
          { text: 'The payment is received via wire transfer', correct: false },
          { text: 'An agent bids on the painting for a group of investors', correct: false },
          { text: 'The painting has more than doubled its value in ten years', correct: false },
          { text: 'Payment is received from an account in an offshore jurisdiction', correct: true },
          { text: 'There is no beneficial ownership information available for the account', correct: true },
        ],
        explanation: "An offshore account paying for a $12 million painting, with no way to identify who actually owns it, is the core problem — together the two facts strip the auction house of any ability to know who its real counterparty is. Wire transfers and agent bidding are routine in the art trade, and price appreciation over a decade is unremarkable for a well-known work.",
      },
      {
        id: 31, title: 'Real Estate — Anonymous Buyers',
        question: "A UK real estate agent has three foreign clients interested in purchasing an apartment building valued at £30 million as an investment property. The clients are not willing to have their names provided to the bank, and want the purchase made in the names of three private companies for privacy reasons, with funds wired into an account held by another private company. Which red flag should stop the agent from taking this further?",
        options: [
          { text: 'The clients are foreign', correct: false, feedback: "Foreign buyers are routine in international real estate investment on their own — nationality alone isn't a red flag." },
          { text: 'The clients have the funds necessary to fund a £30 million purchase', correct: false, feedback: 'Having sufficient funds is a prerequisite for any legitimate purchase, not a warning sign by itself.' },
          { text: 'The clients are not willing to have their names provided to the bank', correct: true, feedback: "Correct. Buying through corporate structures for legitimate privacy or tax reasons happens all the time — that alone isn't disqualifying. Refusing outright to let the bank know who the real buyers are removes the ability to ever establish beneficial ownership, which is the one requirement no legitimate transaction should need to avoid." },
          { text: 'The clients want the purchase made in the names of the private companies', correct: false, feedback: 'Structuring a purchase through corporate ownership is common and legitimate, provided the beneficial owners behind those companies can still be identified.' },
        ],
      },
      {
        id: 32, title: 'Casino Risk — The Customer', selectCount: 2,
        question: "When implementing a risk-based approach related to casinos, which two risks are related to the customer as an individual?",
        options: [
          { text: 'Transfers between customers', correct: false },
          { text: 'Casual (walk-in) customers', correct: true },
          { text: 'Improper use of third parties as customers', correct: true },
          { text: 'Customer from a high-risk country', correct: false },
          { text: 'Use of casino deposit accounts by the customer', correct: false },
        ],
        explanation: "The individual-customer-level risks are about who is actually gambling: a casual, unidentified walk-in gives you no relationship history to assess, and a third party gambling on someone else's behalf hides the true beneficiary. Transfers between customers and deposit account use are transactional/product risks, and country risk is a geographic factor.",
      },
      {
        id: 33, title: 'Front Companies', selectCount: 2,
        question: "Why do organized crime groups often use front companies?",
        options: [
          { text: 'Because front companies generally charge higher prices than legitimate companies, so profit margins are higher', correct: false },
          { text: 'Because they can use the company\'s bank accounts to commingle deposits with those of legal businesses', correct: true },
          { text: 'Because using multiple front companies can make it easier to control an entire sector of the economy', correct: true },
          { text: 'Because front companies are generally subject to lighter due diligence requirements by banks and other financial services providers', correct: false },
        ],
        explanation: "A front company's value to organized crime is that its legitimate-looking revenue lets criminal cash blend in unnoticed inside a normal-looking business bank account, and owning several of them across a sector gives the group real economic leverage and cover. Front companies don't get lighter due diligence just for existing, and undercutting on price would actually draw attention rather than avoid it.",
      },
      {
        id: 34, title: 'Online Gambling Red Flags', selectCount: 2,
        question: "Which two are red-flag indicators of possible money laundering through online gambling?",
        options: [
          { text: 'The player is identified as a politically exposed person (PEP)', correct: true },
          { text: 'The player opens several accounts under the same name using different IP addresses', correct: false },
          { text: 'The customer uses their credit card to fund an online gambling account', correct: false },
          { text: 'The player deposits small amounts of funds into their online gambling account', correct: false },
          { text: 'The customer logs on to the account from multiple countries', correct: true },
        ],
        explanation: "A PEP brings elevated corruption/bribery risk regardless of channel, and logging in from multiple countries in short succession is inconsistent with normal personal use and can indicate account sharing or layering across jurisdictions. Small deposits and ordinary card funding are unremarkable, low-risk behaviour on their own.",
      },
      {
        id: 35, title: 'Insurance Company Laundering Methods', selectCount: 2,
        question: "Which two methods are typically used to launder money using insurance companies?",
        options: [
          { text: 'The policy holder overpays the policy and moves the funds out despite paying early withdrawal penalties', correct: true },
          { text: 'The policy holder enters a sibling as a beneficiary of the insurance policy rather than themselves', correct: false },
          { text: 'The policy holder purchases a bond and redeems it at a discount prior to its full term', correct: false },
          { text: 'The policy holder uses an offshore company to pay the insurance installments', correct: true },
        ],
        explanation: "Willingly eating an early-withdrawal penalty only makes sense if the goal isn't investment return but simply getting funds back out with a legitimate-looking insurance transaction attached to them — and routing premium payments through an offshore company adds a layer of distance between the true payer and the policy. Naming a family member as beneficiary is completely normal, as is discount bond redemption.",
      },
      {
        id: 36, title: 'Accountant — New Client Red Flags', selectCount: 2,
        question: "A prospective client walks into an accounting firm wanting to incorporate a company. The accountant feels uncomfortable after the meeting. Which two observations warrant escalation to the compliance officer?",
        options: [
          { text: 'The prospective client presents confusing details about the proposed business and has very little knowledge about the proposed business activity', correct: true },
          { text: 'The prospective client is able to provide source of funds and source of wealth documents', correct: false },
          { text: 'The prospective client exhibits confidence when speaking to the accountant when providing personal details', correct: false },
          { text: 'The principal activities of the proposed company are importing and exporting new furniture', correct: false },
          { text: 'The prospective client is unable to provide information about the beneficial owners', correct: true },
        ],
        explanation: "Someone forming a company they can't coherently describe, and who can't or won't identify who actually owns it, are the two signs that the real purpose of the structure is being concealed. Providing source-of-funds documentation, presenting confidently, and running an unremarkable trading business are all what you'd expect from a genuine client.",
      },
      {
        id: 37, title: 'Unusual Customer Identification', selectCount: 2,
        question: "A training department is preparing awareness training for unusual customer identification scenarios. Which two indicators should be included?",
        options: [
          { text: "The customer's name and home address cannot be verified", correct: true },
          { text: 'The customer opens the account in the name of a family member who begins making large deposits', correct: false },
          { text: 'The customer requests payment of proceeds to an unrelated third party', correct: false },
          { text: 'The customer frequently exchanges small bills for large bills', correct: false },
          { text: "The customer's internet protocol (IP) address does not match the identifying information provided during online registration", correct: true },
        ],
        explanation: "Both indicators go directly to whether the person opening the account is who they claim to be: an unverifiable name and address is a basic identification failure, and an IP address inconsistent with the stated location during online registration suggests the applicant isn't where — or who — they say they are. The other options are transaction-pattern red flags, not identification red flags.",
      },
      {
        id: 38, title: 'Securities Industry Risk Factors', selectCount: 2,
        question: "Which two factors specific to the securities industry increase its exposure to money laundering risk?",
        options: [
          { text: 'The practice of brokerage firms maintaining securities as nominees', correct: true },
          { text: 'The complexity of the securities business', correct: false },
          { text: 'The speed of the transactions', correct: true },
          { text: 'The link to sanctioned countries', correct: false },
          { text: 'The increase of sector-specific guidance', correct: false },
        ],
        explanation: "Holding securities in nominee name obscures the real beneficial owner from view, and the speed at which trades execute and settle gives compliance staff very little time to intervene before value has already moved. General business complexity and any link to sanctioned countries are risk considerations in principle, but they aren't the specific structural features that make securities uniquely exploitable.",
      },
      {
        id: 39, title: 'Human Trafficking — New Business Account', selectCount: 2,
        question: "A new business opened an account at a bank. After a month of activity, the account is referred to AML Investigations for potential human trafficking activity. Which two red flags most likely triggered the referral?",
        options: [
          { text: 'Trade in large volumes conducted with countries that are part of the diamond pipeline', correct: false },
          { text: 'Multiple purchases of virtual currency at or just below the reporting threshold', correct: false },
          { text: 'Conducting the business\'s transactions online without visiting a branch', correct: false },
          { text: 'Several lodging and food payments made on the same day at unusual hours for a business', correct: true },
          { text: "Several cash deposits along the country's border that are quickly withdrawn by third parties", correct: true },
        ],
        explanation: "Payments for lodging and food at odd hours, on a business account, point to housing and feeding people rather than running a normal business — a recognised human trafficking indicator. Cash deposited near a border and immediately withdrawn by third parties suggests funds are moving between people, not through a legitimate commercial supply chain. Diamond trade, virtual currency, and online-only banking aren't specific to trafficking.",
      },
      {
        id: 40, title: 'Luxury Real Estate Red Flags', selectCount: 2,
        question: "Red flags for potential money laundering in real estate include completing luxury real estate purchases:",
        options: [
          { text: 'using the proceeds from selling a prior property or liquidating investments to make an all-cash purchase', correct: false },
          { text: 'using loans backed by cash or certificates of deposit', correct: false },
          { text: 'in the names of unrelated third parties', correct: true },
          { text: 'using shell companies or trusts for privacy, tax planning, or asset protection', correct: true },
        ],
        explanation: "Titling a luxury property to someone with no real connection to the actual buyer, or hiding ownership behind a shell company or trust, are what break the link between the money and its true owner — the essence of laundering through real estate. Selling a prior property to fund a new one and loans secured against cash deposits both have obvious, traceable legitimate explanations.",
      },
      {
        id: 41, title: 'Real Estate Business — Enhanced Due Diligence',
        question: "A bank account is established for a new business customer. The business was established five years ago with an address in another state. The business website contains few details other than stating it is a real estate business. One principal has an international telephone number and appears to be living in another country. The other principal works out of a recreational vehicle. What warrants enhanced due diligence in this scenario?",
        options: [
          { text: 'Shell company', correct: true, feedback: "Correct. A business with almost no operational footprint — a bare-bones website, a principal reachable only by international number, another operating out of a vehicle rather than any fixed premises — is the profile of a shell entity used to hold and move funds rather than run a real business." },
          { text: 'Human trafficker', correct: false, feedback: "There's no indicator here connecting to human trafficking specifically — no mention of housing, transport, or payment patterns tied to controlling other people's movement." },
          { text: 'Politically exposed person', correct: false, feedback: "Nothing in the scenario indicates either principal holds a prominent public function — the concern here is the business's lack of substance, not political exposure." },
          { text: 'Money laundering through real estate', correct: false, feedback: "The business is described as being in real estate, but there's no actual property transaction described — the red flag is the shell-like nature of the business itself, not a specific real estate deal." },
        ],
      },
      {
        id: 42, title: 'STR Focus — Multi-Jurisdiction Transfer',
        question: "A branch manager for a small community bank has a new customer who deposits four EUR 50,000 checks into one account. Shortly thereafter, the customer goes to another branch and asks to transfer all but EUR 1,500 to three accounts in different foreign jurisdictions. Which suspicious activity should be the focus of the suspicious transaction report?",
        options: [
          { text: 'The customer opened the account with four large checks', correct: false, feedback: 'Large opening deposits by check are unusual but not the central concern here — checks are traceable instruments in their own right.' },
          { text: 'The customer goes to a different branch to make this transaction', correct: false, feedback: 'Using a different branch is a minor behavioural detail, not the substance of the suspicious pattern.' },
          { text: 'The customer transfers almost all of the funds out of the account', correct: false, feedback: "Depleting an account is consistent with the broader pattern but doesn't capture what makes the destination of the funds suspicious." },
          { text: 'The customer asks to transfer funds to accounts in three different foreign jurisdictions', correct: true, feedback: "Correct. Splitting large funds across three separate foreign jurisdictions immediately after a large deposit is a classic layering pattern — it's the destination and fragmentation of the funds, not simply that the account is being emptied, that should anchor the STR." },
        ],
      },
      {
        id: 43, title: 'Black Market Peso Exchange',
        question: "Which method to launder money through deposit-taking institutions is closely associated with international trade?",
        options: [
          { text: 'Forming a shell company', correct: false, feedback: 'Shell companies support many laundering methods but are not specifically tied to the trade-goods exchange mechanism this question is pointing at.' },
          { text: 'Using Black Market Peso Exchange', correct: true, feedback: "Correct. The Black Market Peso Exchange launders drug proceeds by using them to buy US goods for export to Latin America, which are then sold locally for pesos — directly exploiting the international trade system to move value without ever formally transferring the original dollars." },
          { text: 'Structuring cash deposits/withdrawals', correct: false, feedback: 'Structuring is a domestic reporting-threshold evasion technique, not one specifically built around international trade.' },
          { text: 'Investing in legitimate businesses with illicit funds', correct: false, feedback: 'This describes integration in general terms — it is not the trade-specific mechanism the question is asking about.' },
        ],
      },
      {
        id: 44, title: 'Crowdfunding Red Flags',
        question: "The compliance officer at a crowdfunding website is in charge of monitoring new crowdfunding projects. Recently, the number of crowdfunding projects has significantly increased. Which red flag indicates the highest anti-money laundering risk?",
        options: [
          { text: 'Those with the largest number of donors', correct: false, feedback: 'A large number of individual small donors is actually a normal sign of a genuinely popular, organic campaign.' },
          { text: 'Projects that get funding within days of their start', correct: false, feedback: 'Fast funding alone is common for well-promoted or high-profile legitimate campaigns.' },
          { text: 'Projects with the highest monetary success threshold', correct: false, feedback: 'An ambitious funding goal is not inherently suspicious — plenty of legitimate projects set high targets.' },
          { text: 'Projects that start and close and are fully funded within a very short period', correct: true, feedback: "Correct. A campaign that opens, hits its full funding target, and closes almost immediately doesn't follow the normal, gradual pattern of organic donor interest — it looks far more like pre-arranged funds being pushed through the platform in bulk." },
        ],
      },
      {
        id: 45, title: 'Charity Cash Withdrawals — Terrorist Financing',
        question: "A bank has maintained an account for a European charity for several years. The charity provides clothing to persons in need in various countries with active terrorists' cells. Which action by the charity indicates possible terrorist financing?",
        options: [
          { text: 'The charity frequently withdraws cash from the bank', correct: true, feedback: "Correct. Frequent cash withdrawals break the paper trail right at the point where funds leave the regulated system — for a charity operating in areas with active terrorist activity, that's exactly the pattern that would let donated funds be diverted without a way to verify how they were ultimately used." },
          { text: 'The charity has branch locations located in various countries', correct: false, feedback: 'Having branches in multiple countries is normal for an international charity and is not, by itself, suspicious.' },
          { text: 'The charity receives cash donations primarily from European countries', correct: false, feedback: 'Receiving donations from the charity\'s home region is unremarkable and expected for a European-based charity.' },
          { text: 'The charity maintains a bank account for non-business-related expenses', correct: false, feedback: 'A charity having a separate account for administrative or overhead expenses is standard organisational practice.' },
        ],
      },
      {
        id: 46, title: 'Restaurant — Privately-Owned ATM',
        question: "A popular restaurant in town has begun depositing less cash than it has in prior years. In a review of the customer's accounts, you notice that credit card receipts have increased with no explanation. The account officer discovers that the restaurant has installed a privately-owned automated teller machine (ATM) onsite and has begun construction of a patio dining area. Which red flag should trigger additional investigation?",
        options: [
          { text: 'Privately-owned ATM', correct: true, feedback: "Correct. A privately-owned ATM lets cash be introduced into the financial system disguised as ATM withdrawal fees and reimbursements — it's a well-documented placement technique, and it directly explains why the restaurant's own cash deposits have dropped while credit card receipts rose with no clear business reason." },
          { text: 'Lower cash deposits', correct: false, feedback: 'Lower cash deposits are the symptom, not the underlying red flag — the privately-owned ATM is what explains the shift.' },
          { text: 'Increased credit card receipts', correct: false, feedback: "An increase in card receipts on its own could have several innocent explanations — it's only suspicious in combination with the ATM installation." },
          { text: 'Construction of the new patio dining area', correct: false, feedback: 'Restaurant renovations are a routine business investment and not a money laundering indicator in themselves.' },
        ],
      },
      {
        id: 47, title: 'Insurance Premium Paid With Money Orders',
        question: "A compliance officer at an insurance company has been reviewing the transaction activity of several clients. Which transaction is considered a red flag for potential money laundering?",
        options: [
          { text: 'A client paid the quarterly life insurance premium using money orders from two different banks', correct: true, feedback: "Correct. Paying an ordinary recurring premium with money orders sourced from two separate banks is an unusual and roundabout way to pay a routine bill — it suggests an effort to break up and obscure the source of the payment rather than simply writing a check or using a direct debit." },
          { text: 'A client from a high-risk jurisdiction recently purchased property insurance for a real-estate development', correct: false, feedback: 'Purchasing property insurance for a real development is a normal, expected transaction for that type of asset, regardless of the client\'s jurisdiction.' },
          { text: 'A corporation owns several affiliates and recently opened separate group life insurance policies for each of the affiliates', correct: false, feedback: 'Separate group policies per affiliate is standard corporate insurance structuring, not a laundering indicator.' },
          { text: 'A client established a $100,000 charitable annuity with a non-profit organization that provides health and safety assistance internationally', correct: false, feedback: 'A charitable annuity of this kind is a legitimate, well-documented philanthropic and estate-planning product.' },
        ],
      },
      {
        id: 48, title: 'Human Trafficking — Same-Day Withdrawals',
        question: "A bank compliance officer has implemented enhanced monitoring rules that have identified some unusual activity that may be indicative of human trafficking. Which red flag should prompt additional transactional review?",
        options: [
          { text: 'Wire transfer activity from countries with significant migrant populations', correct: false, feedback: 'Wire activity from countries with large migrant populations reflects normal remittance patterns for many legitimate customers.' },
          { text: 'Cash deposits that occur in cities where the customer resides and conducts business', correct: false, feedback: "Cash deposits in a customer's own home city and business area are exactly what you'd expect from ordinary local commerce." },
          { text: 'Cash deposits that occur in cities where the customer does not reside or conduct business', correct: false, feedback: "Deposits in an unfamiliar city are worth noting, but on their own they don't complete the trafficking pattern — what happens to the funds next is what matters." },
          { text: 'Cash deposits that occur in cities where the customer does not reside or conduct business followed by same-day withdrawals', correct: true, feedback: "Correct. Deposits made far from the customer's home base, immediately withdrawn the same day, matches the pattern of collecting proceeds from victims across multiple locations and rapidly moving the cash out before it can be traced — a recognised human trafficking financial indicator." },
        ],
      },
      {
        id: 49, title: 'Annuities and Money Laundering',
        question: "Which insurance product is particularly vulnerable to money laundering?",
        options: [
          { text: 'Annuity', correct: true, feedback: "Correct. Annuities accept large lump-sum premiums and can later be surrendered or structured to pay out to a different party — that combination of large up-front cash-like investment and flexible payout terms is exactly what makes them attractive for legitimising large sums quickly." },
          { text: 'Casualty', correct: false, feedback: 'Casualty insurance indemnifies against loss or damage — it does not involve large investment-style premiums that could be exploited the same way.' },
          { text: 'Collateral', correct: false, feedback: '"Collateral" is not itself an insurance product category — this option does not describe a real insurance line.' },
          { text: 'Regulated pension', correct: false, feedback: 'Regulated pensions are typically subject to strict withdrawal and access rules precisely because they are designed for long-term retirement savings, not liquidity.' },
        ],
      },
      {
        id: 50, title: 'Cash Couriers',
        question: "Which method do terrorist financiers use to move funds without leaving an audit trail?",
        options: [
          { text: 'Extortion', correct: false, feedback: 'Extortion is a method of raising funds in the first place — it does not describe how funds are subsequently moved.' },
          { text: 'Cash couriers', correct: true, feedback: "Correct. Physically carrying cash across borders leaves no electronic or paper record at all — FATF identifies cash couriers as one of the most persistent methods terrorist financiers use precisely because it sidesteps the financial system's monitoring entirely." },
          { text: 'Casa de cambio', correct: false, feedback: 'A casa de cambio is a currency exchange business — using one still generates a transaction record, unlike physically moving cash.' },
          { text: 'Virtual currency', correct: false, feedback: 'Virtual currency transactions are typically recorded on a public blockchain, which is traceable — it is not a genuinely audit-trail-free method.' },
        ],
      },
      {
        id: 51, title: 'Undisclosed LLC Ownership',
        question: "A bank located in Arizona is considering a loan application for a new client. The collateral for the loan is a property in Florida. The loan will be in the name of a limited liability company (LLC) whose ownership is not disclosed to the bank. The LLC was established by a New York-based attorney. The loan will be repaid by the LLC in monthly wire transfers of $9,000, which is more than the required monthly payment. Which aspect indicates the potential for money laundering?",
        options: [
          { text: "The LLC's ownership is not disclosed to the bank", correct: true, feedback: "Correct. Not knowing who actually owns and controls the borrowing entity is the fundamental problem — everything else about the loan (out-of-state collateral, an out-of-area attorney, slightly overpaid installments) is secondary to the fact that the bank has no way to identify who it's really lending to or who benefits from the arrangement." },
          { text: 'The collateral, a property in Florida, is not located in Arizona', correct: false, feedback: 'Out-of-state collateral is common in commercial lending and is not unusual on its own.' },
          { text: 'The repayment in the amount of $9,000 indicates potential structuring', correct: false, feedback: 'Structuring specifically involves staying under a reporting threshold — an amount above the required payment does not itself indicate structuring.' },
          { text: "The attorney associated with the account is outside the bank's lending area", correct: false, feedback: 'Using an attorney from another state to set up an entity is common and not inherently suspicious.' },
        ],
      },
      {
        id: 52, title: 'Front Companies — Economic Consequence',
        question: "What is a major economic consequence of money laundering through the use of front companies?",
        options: [
          { text: 'Placing more emphasis on manufacturing', correct: false, feedback: 'Laundering through front companies has no particular tendency to boost genuine manufacturing activity.' },
          { text: 'Weakening of the legitimate private sector', correct: true, feedback: "Correct. Front companies can afford to undercut real businesses because their goal isn't profit — they're happy to operate at a loss to launder funds, which distorts competition and drives genuinely productive, tax-paying businesses out of the market over time." },
          { text: 'Creating a more competitive pricing environment', correct: false, feedback: "Any pricing effect from front companies is distortive rather than genuinely competitive — it undermines fair competition rather than improving it." },
          { text: 'Aligning management principles between criminal enterprises and legitimate businesses', correct: false, feedback: 'This is not a recognised or meaningful economic consequence of front-company laundering.' },
        ],
      },
      {
        id: 53, title: 'Bakery — Multiple Accounts',
        question: "A bank maintains a relationship with a customer who owns a small bakery business. Which customer action indicates potential money laundering?",
        options: [
          { text: 'The customer continually makes regular cash deposits', correct: false, feedback: 'Regular cash deposits are entirely expected for a cash-based retail business like a bakery.' },
          { text: 'The customer has multiple bank accounts at several locations', correct: true, feedback: "Correct. A single small bakery has no obvious operational need for multiple accounts spread across different locations — that pattern is more consistent with structuring transactions across accounts or obscuring the true flow of funds than with running one storefront business." },
          { text: 'The customer purchased property insurance that is twice the value of the business', correct: false, feedback: 'Over-insuring an asset is a business or valuation decision — it does not, by itself, indicate laundering.' },
          { text: 'The customer recently wired a large amount to a foreign jurisdiction where family is located', correct: false, feedback: 'Sending funds to family abroad is a common and explainable personal transaction.' },
        ],
      },
      {
        id: 54, title: 'Casino Chip Redemption Method',
        question: "Which method is used to launder money in casinos?",
        options: [
          { text: 'Purchase chips with cash and play at a table', correct: false, feedback: 'Actually gambling with the chips exposes the funds to real loss risk — it is not the laundering method itself.' },
          { text: 'Purchase chips with cash and redeem for cash', correct: false, feedback: "Redeeming for cash simply returns the funds in the same form — it doesn't change or legitimise their appearance in any useful way." },
          { text: 'Purchase chips with cash and redeem for a check', correct: true, feedback: "Correct. Converting cash into chips and redeeming them for a casino cheque gives the funds the appearance of legitimate gambling winnings, complete with an official-looking payment instrument from a regulated business — a well-known integration technique." },
          { text: 'Purchase chips with cash and sell to another person for cash', correct: false, feedback: 'Selling chips peer-to-peer for cash just moves cash between two people — it does not achieve the same legitimising effect as a casino-issued cheque.' },
        ],
      },
      {
        id: 55, title: 'Real Estate — Nominee Purchaser',
        question: "Which red flag indicates high potential for money laundering in a real estate purchase?",
        options: [
          { text: 'The purchaser is a nominee', correct: true, feedback: "Correct. A nominee purchaser is, by definition, someone standing in for the real buyer — that arrangement exists specifically to hide who actually controls and benefits from the property, which is the single clearest indicator of a laundering attempt through real estate." },
          { text: 'The purchaser had a previous bankruptcy', correct: false, feedback: 'A past bankruptcy is a credit history fact and is not inherently connected to money laundering.' },
          { text: 'The purchaser owns a cash intensive business', correct: false, feedback: 'Owning a cash-intensive business is a risk factor worth noting for enhanced due diligence, but it is not as direct an indicator as a nominee arrangement.' },
          { text: 'The purchaser is not a resident where the property is located', correct: false, feedback: "Out-of-area buyers are extremely common in real estate investment and are not, by themselves, a strong red flag." },
        ],
      },
      {
        id: 56, title: 'New Restaurant — Uniform Cash Deposits', selectCount: 2,
        question: "A bank employee recently opened an account for a new restaurant. Daily cash deposits over a three-month period are close to $9,500. What are two red flags that indicate possible money laundering or terrorist financing?",
        options: [
          { text: 'The restaurant is located in a different city', correct: false },
          { text: 'The daily cash deposits are so close in amount', correct: true },
          { text: 'It is a new account that has daily cash deposits', correct: true },
          { text: 'The new account demonstrates a steady flow of income', correct: false },
        ],
        explanation: "Deposits that consistently land just under a common reporting threshold ($10,000) is a hallmark of deliberate structuring, and seeing that pattern immediately from a brand-new account — with no track record to judge it against — compounds the concern. A new restaurant simply making daily cash deposits, or being in a different city, isn't unusual on its own for a genuine cash-intensive business.",
      },
      {
        id: 57, title: 'Terrorist Groups — Revenue Diversification', selectCount: 2,
        question: "Which two methods have terrorist groups used to diversify their revenue stream and to fund their operations?",
        options: [
          { text: 'Human trafficking', correct: true },
          { text: 'Engaging in civil conflict', correct: false },
          { text: 'Smuggling cultural artifacts', correct: true },
          { text: 'Engaging in wire transfer activity', correct: false },
        ],
        explanation: "Human trafficking and looted-antiquities smuggling are both documented, standalone revenue streams that terrorist organisations have exploited to fund operations independent of donations. Civil conflict is a condition terrorist groups operate within, not itself a funding method, and wire transfers are simply a payment channel, not a source of revenue.",
      },
      {
        id: 58, title: 'MSB Wire Remittance Laundering',
        question: "Which method is used to launder money via wire remittances sent through a bureau de change or money services business?",
        options: [
          { text: 'A customer in country A makes a weekly small wire transfer to the bank account of an individual in country B', correct: false, feedback: 'A small, consistent, ongoing personal remittance is a normal pattern for supporting family abroad.' },
          { text: 'A customer in country A makes frequent wire transfers to a single customer in country B that are slightly under the legal reporting threshold', correct: true, feedback: "Correct. Repeatedly sending transfers to the same recipient, each one kept just under the reporting threshold, is textbook structuring applied to the remittance channel — the consistency of the amount relative to the threshold is what gives it away." },
          { text: 'A large number of wire transfers are sent from a large number of senders in country A to a large number of recipients in country B during a two-week period', correct: false, feedback: 'Many senders paying many unrelated recipients over a normal window is consistent with an MSB simply doing high volumes of ordinary remittance business.' },
          { text: 'A customer in country A receives four small wire transfers from four different individuals located in country B on the same day, with the aggregate falling below the legal reporting threshold', correct: false, feedback: "Multiple unrelated small senders paying one recipient is a less classic pattern than the same sender/recipient pair repeatedly transacting just under the threshold." },
        ],
      },
      {
        id: 59, title: 'Even-Dollar Wire Transfers',
        question: "A client is a wholesale auto business that operates as a used car lot and regularly ships vehicles internationally. In a four-month period, the client received wires totaling $1,250,000 from a dealer in Benin in West Africa, all in increments of $50,000. Dock shipping receipts identify the vehicles but cannot easily be tied to the wires received. What is the suspicious behavior?",
        options: [
          { text: 'The dock shipping receipts match the vehicles', correct: false, feedback: 'The receipts matching the vehicles they describe is expected — the concern is that they can\'t be tied to the wires, not that they\'re internally inconsistent.' },
          { text: 'Vehicles are regularly shipped internationally', correct: false, feedback: 'International vehicle export is the normal business of a wholesale used car exporter.' },
          { text: 'Wires received are in large, even dollar amounts', correct: true, feedback: "Correct. Genuine commercial trade payments almost always reflect a specific invoice total, down to the cent — a series of perfectly round $50,000 wires suggests the payments are unrelated to any actual priced transaction and are instead being used simply to move a target amount of money." },
          { text: 'Account debits are payable to transport companies', correct: false, feedback: "Paying transport companies is entirely consistent with actually running a vehicle export business." },
        ],
      },
      {
        id: 60, title: 'Precious Metals Dealer — No Background',
        question: "A high-volume dealer of precious metals and stones in a high-risk jurisdiction is approached by a new customer interested in selling gold worth $200,000. The customer was referred by a longtime family friend of the dealer and provides no indication of background or business purpose for the sale. The dealer agrees to make the purchase based solely on the reference. What is the money laundering red flag?",
        options: [
          { text: 'The customer was referred by a longtime friend of the dealer', correct: false, feedback: 'A personal referral might explain how the relationship started, but it says nothing about the legitimacy of the funds behind a $200,000 sale.' },
          { text: 'The precious metals dealer is operating in a high-risk jurisdiction', correct: false, feedback: 'Jurisdictional risk is background context that should raise the general level of caution, but it is not the specific red flag in this transaction.' },
          { text: 'A new customer is selling gold worth $200,000 to a high-volume dealer', correct: false, feedback: 'A large gold sale to a high-volume dealer is, by itself, a plausible ordinary transaction for that kind of business.' },
          { text: 'The customer provides no background information or business purpose for the transaction', correct: true, feedback: "Correct. Accepting a $200,000 transaction on the strength of a personal introduction alone, with zero explanation of where the gold came from or why it's being sold, means the dealer has done no meaningful due diligence at all — that absence of any explanation is the actual red flag, not the referral itself." },
        ],
      },
      {
        id: 61, title: 'Prepaid Card Loading',
        question: "A bank sells reloadable open-loop prepaid cards to both customers and non-customers. What is a red flag associated with these cards that may indicate money laundering?",
        options: [
          { text: 'A bank customer historically purchases several prepaid cards near year-end', correct: false, feedback: 'A recurring seasonal pattern (e.g. holiday gift cards) from an established customer has an obvious, benign explanation.' },
          { text: 'A non-bank customer regularly loads large amounts of cash onto several prepaid cards', correct: true, feedback: "Correct. A non-customer — someone the bank has no ongoing relationship with or visibility into — repeatedly loading large cash sums onto multiple cards is a way to convert bulk cash into a portable, spendable, and easily transportable instrument with minimal identification requirements." },
          { text: 'A non-bank customer consistently uses the bank to obtain cash advances using a prepaid card', correct: false, feedback: 'Taking cash advances against a card is ordinary card usage and not inherently suspicious.' },
          { text: 'A bank customer routinely purchases five prepaid cards in small even-dollar amounts on a monthly basis', correct: false, feedback: "Small, modest recurring purchases by a known customer don't carry the same weight as large, anonymous cash loading." },
        ],
      },
      {
        id: 62, title: 'Highest-Risk Product',
        question: "Which product is considered to be of highest money laundering risk?",
        options: [
          { text: 'Credit cards', correct: false, feedback: 'Credit card spending is closely tracked and tied to specific merchants, giving it a strong transaction trail.' },
          { text: 'Savings accounts', correct: false, feedback: 'Ordinary savings accounts are low-velocity, well-documented, and don\'t offer the cross-border speed that makes laundering easy.' },
          { text: 'Time deposit accounts', correct: false, feedback: 'Time deposits are locked in for a fixed term, which limits their usefulness for quickly moving or layering funds.' },
          { text: 'International wire transfers', correct: true, feedback: "Correct. International wires move large sums quickly across jurisdictions and correspondent banking chains, often with limited visibility into the ultimate originator or beneficiary — that combination of speed, cross-border reach, and reduced transparency is why wires are consistently rated the highest-risk product." },
        ],
      },
      {
        id: 63, title: 'Steel Exporter — Understated Value',
        question: "A bank provides trade financing for a company whose primary export is steel. Which action by the company indicates possible money laundering?",
        options: [
          { text: 'The company often deals with foreign currency exchanges', correct: false, feedback: 'Dealing in foreign currency is a routine part of running an international export business.' },
          { text: 'The company regularly understates the value of goods exported', correct: true, feedback: "Correct. Deliberately understating the export value on trade documents is a classic trade-based money laundering technique — it lets the difference between the real and declared value be settled separately outside the formal trade payment, moving value across borders without it showing up in the trade financing itself." },
          { text: "The company frequently sells above or below its competitors' price", correct: false, feedback: 'Pricing that varies from competitors could simply reflect normal market positioning or negotiating leverage.' },
          { text: 'The company frequently transfers funds to other bank accounts located in other jurisdictions', correct: false, feedback: 'Moving funds between accounts in different jurisdictions is common for a business with genuinely international operations.' },
        ],
      },
      {
        id: 64, title: 'Tutoring Account — Same-Day Transfer',
        question: "A new accounts representative recently opened an account for an individual whose stated employment is tutoring students. Which customer action indicates possible money laundering?",
        options: [
          { text: 'Continually making weekly small cash deposits', correct: false, feedback: 'Small, steady cash deposits are plausible for someone paid in cash for tutoring sessions.' },
          { text: 'Periodically initiating wire transfers to another account owned by a relative', correct: false, feedback: 'Occasional transfers to a family member\'s account is an ordinary personal financial pattern.' },
          { text: 'Transferring all funds to another bank on the same day of large cash deposits', correct: true, feedback: "Correct. A large cash deposit that is immediately transferred out in full, the same day, is completely inconsistent with a tutor's modest expected income — the rapid pass-through pattern (deposit then instant transfer-out) is a classic sign the account is just being used as a conduit." },
          { text: 'Opening a savings account and making frequent transfers from the checking account', correct: false, feedback: 'Moving money between one\'s own checking and savings accounts is routine personal money management.' },
        ],
      },
      {
        id: 65, title: "Attorney's Trust Account — Cash Withdrawals",
        question: "A bank has opened a new account for a well-known attorney to manage client funds. During the first six months, bank staff observe the account receives multiple deposits via wire transfer. They also observe that the attorney withdraws cash, makes payments to various people, and transfers funds to the law firm's account online. What is considered a red flag for potential money laundering in this situation?",
        options: [
          { text: 'Withdrawing cash', correct: true, feedback: "Correct. A client trust account is meant to hold funds on behalf of clients for specific legal purposes — cash withdrawals from that account break the traceable link between the money coming in and what it's actually being used for, which is exactly the kind of activity a trust account shouldn't normally show." },
          { text: 'Making payment to various people', correct: false, feedback: 'Paying out to various parties can be entirely legitimate — settlements, disbursements, and third-party payments are routine trust account activity.' },
          { text: 'Receiving multiple deposits via wire transfer', correct: false, feedback: 'Wire transfers into a trust account are a normal, traceable way for clients to fund matters the attorney is handling.' },
          { text: "Transferring funds to his law firm's account online", correct: false, feedback: "Moving earned fees from a trust account to the firm's own operating account is standard, well-documented legal practice." },
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
      {
        id: 7, title: 'Vienna Convention 1988',
        question: "The 1988 UN Convention Against Illicit Traffic in Narcotic Drugs and Psychotropic Substances (Vienna Convention) was significant in the AML context primarily because:",
        options: [
          { text: 'It was the first international treaty to require signatory countries to criminalise drug-money laundering and allow seizure of drug proceeds — establishing the concept of predicate offences and laying the foundation for modern AML frameworks', correct: true, feedback: 'Correct. The Vienna Convention marked the beginning of international AML cooperation. It required signatory states to criminalise drug money laundering and introduced concepts of predicate offences, asset confiscation, and international cooperation that underpin all subsequent AML frameworks including the FATF 40 Recommendations.' },
          { text: 'It established the FATF and its 40 Recommendations', correct: false, feedback: 'FATF was established in 1989 by the G7 Paris Summit — separate from and following the Vienna Convention. The Convention focused on drug trafficking; FATF developed the broader AML standard framework.' },
          { text: 'It criminalised all forms of tax evasion internationally for the first time', correct: false, feedback: 'Tax crimes as ML predicate offences were not added to the FATF framework until the 2012 revision. The Vienna Convention focused solely on drug trafficking proceeds.' },
          { text: 'It prohibited the use of hawala and all informal value transfer systems', correct: false, feedback: 'The Vienna Convention did not address informal value transfer systems. Its focus was the criminalisation of drug-money laundering and international cooperation for seizure and confiscation.' },
        ],
      },
      {
        id: 8, title: 'Palermo Convention 2000',
        question: "The UN Convention Against Transnational Organised Crime (Palermo Convention, 2000) built upon the Vienna Convention primarily by:",
        options: [
          { text: 'Extending ML criminalisation beyond drug trafficking to all serious crime proceeds, and establishing obligations for international cooperation, extradition, and mutual legal assistance between signatory countries', correct: true, feedback: 'Correct. The Palermo Convention was transformative — it broadened the predicate offence base from drug trafficking to all serious crimes, required states to criminalise participation in organised criminal groups, and established robust international cooperation obligations including extradition and mutual legal assistance (MLA).' },
          { text: 'Introducing mandatory beneficial ownership registers for all companies worldwide', correct: false, feedback: 'Beneficial ownership registers are addressed in FATF Recommendation 24 and EU AMLD directives — not the Palermo Convention. Palermo focused on ML criminalisation scope and international cooperation.' },
          { text: 'Replacing the FATF 40 Recommendations with legally binding treaty obligations', correct: false, feedback: 'The FATF Recommendations remain non-binding international standards. Palermo is a treaty — but it did not replace or override FATF standards; the two instruments are complementary.' },
          { text: 'Creating Interpol as the coordinating body for cross-border financial investigations', correct: false, feedback: 'Interpol was established in 1923 — long before the Palermo Convention. The Convention established MLA frameworks and cooperation obligations but did not create Interpol.' },
        ],
      },
      {
        id: 9, title: 'FATF Mutual Evaluations',
        question: "FATF mutual evaluations (4th Round methodology) assess member countries across which two dimensions?",
        options: [
          { text: 'Technical compliance (whether laws and regulations exist to meet FATF standards) and effectiveness (whether the AML/CFT system is producing real-world outcomes) — both dimensions introduced in the 4th Round methodology adopted in 2013', correct: true, feedback: 'Correct. This two-dimensional approach was a landmark change from the 3rd Round which focused primarily on technical compliance. Effectiveness is assessed against 11 Immediate Outcomes covering areas such as FIU analysis quality, investigation, prosecution, confiscation, and supervision. A country can have perfect laws on paper but still fail on effectiveness.' },
          { text: 'Only technical compliance — effectiveness is assessed separately by the IMF through the FSAP', correct: false, feedback: 'While the IMF FSAP addresses some AML effectiveness questions, FATF mutual evaluations assess both technical compliance AND effectiveness as an integrated methodology.' },
          { text: 'Criminal prosecution statistics and ML conviction rates only', correct: false, feedback: 'Prosecutions and convictions are one Immediate Outcome (IO.7), but evaluations assess 11 Immediate Outcomes across the full AML/CFT system — not prosecution data alone.' },
          { text: 'The size of each country\'s FIU and the number of STRs filed annually', correct: false, feedback: 'SAR/STR volume is relevant evidence for some Immediate Outcomes but is not a standalone assessment dimension. Volume without quality or actionability data is not a reliable effectiveness metric.' },
        ],
      },
      {
        id: 10, title: 'Risk-Based Approach (R.1)',
        question: "Under FATF Recommendation 1, the risk-based approach (RBA) requires financial institutions to:",
        options: [
          { text: 'Identify, assess, and understand their ML/TF risks, and apply measures commensurate with those risks — using more rigorous controls where risks are higher and permitting simplified measures where risks are demonstrably lower', correct: true, feedback: 'Correct. The RBA is the cornerstone of modern AML. It replaced the rules-based compliance model with a proportionate, risk-sensitive approach. The RBA allows institutions to allocate compliance resources where risks are greatest — rather than applying identical controls uniformly. The institutional risk assessment underpins CDD decisions, monitoring intensity, and resource allocation.' },
          { text: 'Apply identical AML controls uniformly to all customers and products regardless of assessed risk', correct: false, feedback: 'A uniform approach is a rules-based (not risk-based) model. The RBA specifically requires differentiation based on assessed risk — otherwise high-risk relationships receive the same treatment as low-risk ones.' },
          { text: 'Focus exclusively on high-risk customers and ignore low-risk relationships entirely', correct: false, feedback: 'The RBA requires attention across the risk spectrum. Simplified CDD applies to genuinely low-risk relationships — but this is a reduced level of diligence, not zero. Monitoring continues at all risk levels.' },
          { text: 'Let regulators determine the risk rating of each customer before the institution applies controls', correct: false, feedback: 'The RBA specifically places risk assessment responsibility on the institution. Regulatory pre-approval of customer risk ratings is not a standard AML framework element.' },
        ],
      },
      {
        id: 11, title: 'FATF Travel Rule (R.16)',
        question: "FATF Recommendation 16, known as the 'Travel Rule', requires:",
        options: [
          { text: 'Originating financial institutions to transmit accurate originator and beneficiary information alongside wire transfers — enabling counterparty institutions and FIUs to identify parties to electronic fund transfers', correct: true, feedback: 'Correct. R.16 requires that wire transfers of USD/EUR 1,000 or more include complete originator information (name, account number, address/ID number) and beneficiary information. In 2019, FATF extended the Travel Rule to virtual asset transfers — requiring VASPs to collect and transmit the same information for crypto transactions.' },
          { text: 'Airlines and customs authorities to collect financial data from travellers carrying more than $10,000 in cash', correct: false, feedback: 'Cross-border cash declarations are addressed in FATF R.32 (Cash Couriers) — not R.16. The Travel Rule applies specifically to electronic fund transfers.' },
          { text: 'All wire transfers to be reviewed by the national FIU before settlement', correct: false, feedback: 'FIU pre-approval of wire transfers is not a standard AML requirement. The Travel Rule is about information transmission between financial institutions — not FIU pre-clearance.' },
          { text: 'Financial institutions to obtain law enforcement approval for cross-border transfers above $50,000', correct: false, feedback: 'No FATF standard requires law enforcement approval for wire transfers. The Travel Rule requires information transmission between institutions — not law enforcement authorisation.' },
        ],
      },
      {
        id: 12, title: 'FATF R.20 — Suspicious Transactions',
        question: "FATF Recommendation 20 on Suspicious Transaction Reports (STRs/SARs) requires financial institutions to report:",
        options: [
          { text: 'Promptly to the FIU when there is reasonable suspicion or reasonable grounds to suspect that funds are proceeds of crime or linked to TF — regardless of the transaction amount', correct: true, feedback: 'Correct. R.20 does not set a monetary threshold for STR filing — the trigger is suspicion, not amount. This is distinct from currency transaction reporting (which uses a threshold). Small transactions can be highly suspicious; large ones may be entirely legitimate. The STR obligation extends to both attempted and completed transactions.' },
          { text: 'Only for cash transactions above the applicable reporting threshold', correct: false, feedback: 'Currency Transaction Reports (CTRs) apply to cash transactions above a threshold. STRs are triggered by suspicion regardless of amount — mixing these two obligations is a common conceptual error.' },
          { text: 'Only after law enforcement has confirmed that a criminal investigation is underway', correct: false, feedback: 'The STR obligation is triggered by the institution\'s own suspicion — not by a law enforcement tip. Requiring law enforcement confirmation before filing would undermine the proactive intelligence-gathering purpose of the STR regime.' },
          { text: 'Only for transactions involving foreign counterparties or high-risk jurisdictions', correct: false, feedback: 'Domestic transactions can be equally suspicious. Geography is a risk factor, not a threshold for the STR obligation.' },
        ],
      },
      {
        id: 13, title: 'FATF R.24 — Beneficial Ownership',
        question: "FATF Recommendation 24 requires countries to ensure that beneficial ownership information for legal persons is:",
        options: [
          { text: 'Adequate, accurate, and current — and available to competent authorities on a timely basis through mechanisms such as central registers, company filing obligations, or collection by financial institutions', correct: true, feedback: 'Correct. R.24 (significantly revised in 2022) takes a multi-pronged approach — countries may use any combination of central registers, company-level record-keeping, or financial institution collection. The key requirements are that information is accurate, kept current, and can be accessed quickly by law enforcement and FIUs. The 2022 revision strengthened requirements following widespread criticism of nominee and bearer share misuse.' },
          { text: 'Only publicly listed companies are required to disclose beneficial ownership — private companies are exempt', correct: false, feedback: 'Listed companies are actually lower-risk for beneficial ownership transparency because shares are publicly traded. R.24 is primarily concerned with unlisted private companies, partnerships, and trusts where beneficial ownership is most easily concealed.' },
          { text: 'All company directors must undergo FATF-certified AML training before appointment', correct: false, feedback: 'Director AML training is not a FATF beneficial ownership requirement. R.24 focuses on identification and verification of beneficial owners — not training of corporate officers.' },
          { text: 'Legal persons must file annual SAR summaries alongside their beneficial ownership information', correct: false, feedback: 'Beneficial ownership reporting and SAR filing are separate obligations. Companies are not required to file SARs — that obligation falls on regulated financial institutions and DNFBPs.' },
        ],
      },
      {
        id: 14, title: 'EU 6th AML Directive (6AMLD)',
        question: "The EU Sixth Anti-Money Laundering Directive (6AMLD, implemented December 2020) was notable primarily for:",
        options: [
          { text: 'Introducing criminal liability for legal persons (companies) — not just natural persons — for ML offences, and extending the list of predicate offences to include cybercrime and environmental crime', correct: true, feedback: 'Correct. 6AMLD harmonised the definition of ML across EU member states and crucially extended criminal liability to corporations — meaning legal entities can now be criminally prosecuted for ML, not just individuals. The extended predicate offence list (including cybercrime and environmental crime) reflects the reality of modern financial crime.' },
          { text: 'Creating a unified EU Financial Intelligence Unit to coordinate ML investigations across all member states', correct: false, feedback: 'There is no single EU FIU — member states maintain national FIUs. 6AMLD did not create a unified FIU; it focused on criminal liability harmonisation.' },
          { text: 'Repealing the 5th AMLD beneficial ownership register requirements', correct: false, feedback: '6AMLD did not repeal 5AMLD\'s beneficial ownership requirements. The two directives addressed different aspects — 5AMLD tightened beneficial ownership; 6AMLD focused on criminal liability harmonisation and predicate offence scope.' },
          { text: 'Extending ML obligations exclusively to virtual asset service providers', correct: false, feedback: 'VASP obligations were introduced by 5AMLD. 6AMLD focused on criminal liability harmonisation — not exclusively VASPs.' },
        ],
      },
      {
        id: 15, title: 'FATF-Style Regional Bodies (FSRBs)',
        question: "FATF-Style Regional Bodies (FSRBs) such as the APG, MONEYVAL, and GIABA primarily:",
        options: [
          { text: 'Conduct mutual evaluations and provide AML/CFT technical assistance to member jurisdictions — extending the reach of FATF global standards to non-FATF member countries through regional assessment and capacity-building', correct: true, feedback: 'Correct. The FATF and its 9 FSRBs together cover 205+ jurisdictions. FSRBs operate under a memorandum of understanding with FATF and conduct mutual evaluations using the same 4th Round methodology. They identify deficiencies, monitor action plans, and provide training and technical assistance — significantly broadening the global AML architecture beyond FATF\'s 39 members.' },
          { text: 'Are direct decision-making bodies that can independently amend the FATF 40 Recommendations', correct: false, feedback: 'Only FATF members can amend the Recommendations through the FATF plenary. FSRBs implement and assess against existing standards — they do not set them.' },
          { text: 'Are law enforcement agencies with authority to arrest and extradite financial criminals', correct: false, feedback: 'FSRBs are policy and assessment bodies — they have no law enforcement authority. Criminal jurisdiction remains with national authorities.' },
          { text: 'Are funded exclusively by World Bank development grants', correct: false, feedback: 'FSRBs have diverse funding models — member government contributions, FATF grants, and multilateral development bank support. They are not exclusively World Bank-funded.' },
        ],
      },
      {
        id: 16, title: 'Proliferation Financing',
        question: "Proliferation financing, as addressed by FATF Recommendation 7, refers to:",
        options: [
          { text: 'Financial support for the development, acquisition, manufacture, possession, or deployment of weapons of mass destruction (WMDs) and their delivery systems — countered through targeted financial sanctions implementation', correct: true, feedback: 'Correct. FATF added proliferation financing to its mandate following UN Security Council resolutions targeting WMD programmes. R.7 requires countries to implement targeted financial sanctions without delay against UN-listed proliferators — particularly those linked to North Korea and Iranian WMD programmes. The 2012 FATF mandate expansion formally recognised proliferation financing as a distinct threat alongside ML and TF.' },
          { text: 'The spread of ML techniques from one criminal network to another through criminal learning', correct: false, feedback: 'The spread of ML methods is a typologies concern — not the subject of FATF R.7. Proliferation financing specifically concerns WMD-related funding.' },
          { text: 'State-sponsored investment in rapid domestic financial market expansion', correct: false, feedback: 'State investment policy is not an AML/CFT concern. Proliferation financing is the funding of WMD development — a national security concern addressed through financial sanctions.' },
          { text: 'The rapid increase in cryptocurrency use for drug financing globally', correct: false, feedback: 'Crypto-asset risks are addressed in FATF R.15. Proliferation financing is specifically about WMD funding — a distinct and separately classified risk category.' },
        ],
      },
      {
        id: 17, title: 'DNFBPs',
        question: "'Designated Non-Financial Businesses and Professions' (DNFBPs) under FATF Recommendations 22 and 23 include:",
        options: [
          { text: 'Casinos, real estate agents, dealers in precious metals and stones, lawyers, notaries, other independent legal professionals, accountants, and trust and company service providers (TCSPs) — when conducting specific higher-risk activities', correct: true, feedback: 'Correct. FATF identified these sectors as vulnerable to ML abuse even though they are not traditional financial institutions. The trigger for DNFBP AML obligations is activity-based: a lawyer is only a DNFBP when acting in specific financial/corporate capacities (e.g., managing client funds, forming companies) — not in all professional contexts such as litigation.' },
          { text: 'All non-financial businesses including retailers, manufacturers, and wholesalers', correct: false, feedback: 'DNFBP status is sector- and activity-specific — not a general classification for all non-financial businesses. Retail shops and manufacturers are not DNFBPs under FATF standards.' },
          { text: 'Only law firms and accounting practices — casinos and real estate agents are covered by separate legislation', correct: false, feedback: 'Casinos and real estate agents are explicitly named as DNFBPs in FATF Recommendations 22 and 23. They are subject to the same AML obligations as legal professionals when conducting covered activities.' },
          { text: 'Technology companies providing payment infrastructure to banks', correct: false, feedback: 'Payment infrastructure providers are regulated as financial institutions under FATF R.14 or R.15 — not as DNFBPs. DNFBPs are specifically professional and commercial sectors, not technology providers.' },
        ],
      },
      {
        id: 18, title: 'Basel Committee AML Guidance',
        question: "The Basel Committee on Banking Supervision's AML guidelines are significant because they:",
        options: [
          { text: 'Set supervisory expectations for banks\' group-wide AML risk management — including governance, CDD standards for correspondent banking, and sound management of financial crime risk across banking groups operating in multiple jurisdictions', correct: true, feedback: 'Correct. The Basel Committee guidelines complement FATF standards by providing prudential supervisory guidance specifically for banking supervisors. They address the AML/CFT expectations that banking supervisors should enforce, group-wide AML programme management, and the treatment of financial crime risk within the broader risk management framework of banks.' },
          { text: 'Replace the FATF 40 Recommendations with legally binding capital requirements for AML compliance', correct: false, feedback: 'Basel Committee guidelines are not legally binding and do not replace FATF standards. They are prudential guidance for banking supervisors — complementing, not replacing, the FATF framework.' },
          { text: 'Create a mandatory global AML supervisory college for all G20 banking groups', correct: false, feedback: 'There is no mandatory global AML supervisory college. The Basel Committee provides guidance — it does not establish binding supervisory structures.' },
          { text: 'Require all banks to implement AI-based transaction monitoring systems by a specified date', correct: false, feedback: 'The Basel Committee does not mandate specific monitoring technologies. Technology choices are at the institution\'s discretion — the obligation is effective monitoring, not a particular technical approach.' },
        ],
      },
      {
        id: 19, title: 'UNCAC and ML',
        question: "The UN Convention Against Corruption (UNCAC, 2003) is relevant to AML because:",
        options: [
          { text: 'Corruption is a designated ML predicate offence under FATF standards, and UNCAC requires signatory countries to criminalise bribery, embezzlement, and trading in influence — creating ML exposure for any proceeds derived from corrupt acts', correct: true, feedback: 'Correct. UNCAC and AML are deeply interconnected. Once corruption proceeds exist, ML laws apply to any effort to disguise or use those funds. The linkage makes anti-corruption and AML enforcement mutually reinforcing — identifying corrupt officials often leads to ML investigations, and vice versa. UNCAC also requires international asset recovery cooperation, relevant when corrupt proceeds have been moved abroad.' },
          { text: 'UNCAC replaced all prior FATF anti-corruption guidance with stronger legally binding treaty obligations', correct: false, feedback: 'UNCAC is a treaty and is legally binding on signatories, but it did not replace FATF standards. The two frameworks coexist and reinforce each other.' },
          { text: 'UNCAC created a global asset recovery fund that financial institutions must contribute to proportionally', correct: false, feedback: 'There is no mandatory asset recovery fund under UNCAC. The Convention requires cooperation in returning stolen assets to their countries of origin — through governmental bilateral and multilateral processes.' },
          { text: 'UNCAC grants full immunity from AML obligations to public officials acting in their official capacity', correct: false, feedback: 'UNCAC contains no such immunity. In fact, it specifically requires the criminalisation of corruption by public officials and creates obligations for state-level accountability.' },
        ],
      },
      {
        id: 20, title: 'Mutual Legal Assistance (MLA)',
        question: "Under international AML conventions, in which circumstance may a country legitimately refuse a Mutual Legal Assistance (MLA) request from another signatory country?",
        options: [
          { text: 'When the requested action would violate fundamental legal principles of the requested country — such as constitutional rights, bank secrecy protections not subject to judicial override, or dual criminality requirements where the underlying conduct is not a crime in the requested state', correct: true, feedback: 'Correct. MLA refusal grounds are defined in bilateral MLA treaties and relevant conventions. Common permitted grounds include: dual criminality (the act must be a crime in both states), fundamental legal principles, and national security. The trend internationally is toward narrowing refusal grounds to facilitate cross-border financial crime cooperation.' },
          { text: 'Any time a country disagrees with the investigative strategy being pursued by the requesting state', correct: false, feedback: 'Disagreement with investigation strategy is not a recognised MLA refusal ground. Refusal grounds are specific and limited — not available for policy disagreement.' },
          { text: 'When the requesting country has a larger GDP — smaller countries can refuse larger ones on proportionality grounds', correct: false, feedback: 'GDP differential is not an MLA refusal ground. MLA obligations are reciprocal and bilateral — not based on economic size.' },
          { text: 'When the SAR underlying the request was filed more than six months before the MLA request', correct: false, feedback: 'There is no time limitation on MLA requests based on SAR filing dates. MLA timelines are governed by statutes of limitations for the underlying offences — not SAR filing dates.' },
        ],
      },
      {
        id: 21, title: 'OFAC Blocking Requirements', selectCount: 3,
        question: "One key aspect of OFAC's extraterritorial reach includes the blocking of certain non-US-initiated transactions for or through the US for the benefit of a restricted person or entity. Under which three circumstances are US banks required to block transactions?",
        options: [
          { text: 'The transactions are to, or go through, a blocked entity', correct: true },
          { text: 'Those that are by, or on behalf of, a blocked individual or entity', correct: true },
          { text: 'Those that are by or on behalf of a blocked individual and a licensed entity', correct: false },
          { text: 'Those that are in connection with a transaction in which a blocked individual or entity has an interest', correct: true },
          { text: 'Those that are in connection with a transaction in which a blocked individual or entity has no interest', correct: false },
        ],
        explanation: "The blocking obligation is triggered by any nexus to a blocked party — as sender, recipient, or anyone with an interest in the funds — regardless of how indirect that nexus is. A licensed entity being involved doesn't create an exception, and if a blocked party genuinely has no interest at all, there's nothing to block.",
      },
      {
        id: 22, title: 'Who OFAC Regulations Apply To', selectCount: 2,
        question: "OFAC-issued regulations apply to which entities?",
        options: [
          { text: 'Intermediaries transacting with US banks', correct: false },
          { text: 'Foreign banks with US customers', correct: false },
          { text: 'Foreign subsidiaries of US banks', correct: true },
          { text: 'US branches of a foreign bank', correct: true },
        ],
        explanation: "OFAC jurisdiction follows US ownership and US territory: a foreign subsidiary is still part of a US bank's corporate structure, and any branch physically operating in the US is subject to US law regardless of its foreign parent. Simply transacting with a US bank, or a foreign bank merely having US customers, doesn't by itself pull the whole institution under OFAC.",
      },
      {
        id: 23, title: 'USA PATRIOT Act Extraterritorial Reach', selectCount: 3,
        question: "Which statements regarding the USA PATRIOT Act best describe key aspects that have extraterritorial reach?",
        options: [
          { text: 'It allows the US Attorney General to subpoena records from a foreign bank with US correspondent accounts, including those located outside the US', correct: true },
          { text: 'It allows foreign banks to voluntarily designate a registered agent in the US to accept service of subpoenas', correct: false },
          { text: 'It allows the Secretary of the Treasury to order a US financial institution to close a correspondent account when a subpoena has not been responded to by a foreign bank in a timely manner', correct: true },
          { text: 'It obliges the government to trace the origin of the funds when a seizure of assets occurs in a correspondent account opened and maintained for a foreign bank in the US', correct: false },
          { text: 'It allows federal banking supervisors to require records of the identity of the owners of a foreign bank from a financial institution operating in the US', correct: true },
        ],
        explanation: "The extraterritorial teeth of the Act are the subpoena power reaching records held entirely outside the US, the ability to force closure of a US correspondent account as leverage when a foreign bank stonewalls a subpoena, and the requirement that US institutions can be made to produce ownership records for a foreign correspondent. Foreign banks don't get to opt into a voluntary registered-agent arrangement, and seizure doesn't require the government to trace fund origin first — that's a different (forfeiture) process.",
      },
      {
        id: 24, title: 'Types of Economic Sanctions', selectCount: 3,
        question: "Which are common types of economic sanctions?",
        options: [
          { text: 'Targeted sanctions', correct: true },
          { text: 'Technological sanctions', correct: false },
          { text: 'SWIFT network sanctions', correct: false },
          { text: 'Sectoral sanctions', correct: true },
          { text: 'Comprehensive sanctions', correct: true },
        ],
        explanation: "Sanctions regimes are generally built around three standard designs: targeted (specific individuals/entities), sectoral (specific industries), and comprehensive (an entire country or regime). 'Technological' and 'SWIFT network' sanctions aren't recognised categories on their own — removal from SWIFT is a specific enforcement measure, not a sanctions type.",
      },
      {
        id: 25, title: '5th EU AML Directive', selectCount: 2,
        question: "Which are requirements of the Fifth AML Directive of the European Union (EU)?",
        options: [
          { text: 'Promoting the record-keeping obligations of banks to the maximum amount of data necessary for AML/CFT investigation purposes', correct: false },
          { text: 'Extending AML/CFT rules to entities that provide virtual currency services', correct: true },
          { text: 'Broadening the criteria for assessing high-risk third countries', correct: true },
          { text: 'Developing a variant approach in the strategy for the treatment of organised crime and terrorism threats', correct: false },
          { text: 'Providing information access to Financial Intelligence Units according to the differences in the nature of their functions, competences, and powers', correct: false },
        ],
        explanation: "5AMLD's two headline changes were bringing virtual asset service providers into the regulated AML perimeter for the first time, and widening how a country gets assessed as high-risk beyond the narrower criteria in earlier directives. Record-keeping and FIU information access were addressed by other directives/instruments, not the specific 5AMLD headline requirements.",
      },
      {
        id: 26, title: 'OFAC Rules for US-Related Persons', selectCount: 2,
        question: "What are the rules imposed by the Office of Foreign Assets Control (OFAC) for legal entities and persons related to the US?",
        options: [
          { text: 'Any foreign corporation is also penalized if it conducts transactions with sanctioned countries under OFAC rules', correct: false },
          { text: 'A subsidiary of a US legal entity, formally registered in a foreign country, is exempt from OFAC rules', correct: false },
          { text: 'A foreign individual visiting the US for a short vacation is obligated to follow OFAC rules', correct: true },
          { text: "The head office of a foreign legal entity with a branch in the US does not need to comply with OFAC rules", correct: false },
          { text: 'Nationals of the US must comply with OFAC rules, regardless of where they are located in the world', correct: true },
        ],
        explanation: "OFAC jurisdiction is anchored two ways: by nationality (US persons must comply anywhere in the world) and by physical presence (anyone physically in the US, even a short-term visitor, is subject to US law while there). A US-owned foreign subsidiary is not automatically exempt, and a US branch's foreign head office doesn't escape scrutiny just because it sits offshore.",
      },
      {
        id: 27, title: 'FATF and FSRB Roles', selectCount: 2,
        question: "Which statements relate to the mandate, roles, and responsibilities of the Financial Action Task Force (FATF) and the FATF-Style Regional Bodies (FSRBs)?",
        options: [
          { text: 'FATF member countries cannot be members of an FSRB at the same time', correct: false },
          { text: 'FSRBs have the right to develop standards with which their member countries are bound to comply', correct: false },
          { text: 'FSRBs play an essential role in identifying and addressing AML technical assistance needs for their individual member countries', correct: true },
          { text: 'In the process of setting standards, FATF will only consider inputs from its member countries as part of the consultation process', correct: false },
          { text: 'FATF and FSRBs are free-standing organisations that share the common goals of combating money laundering and the financing of terrorism and proliferation', correct: true },
        ],
        explanation: "FSRBs and FATF are separate, independently governed bodies working toward the same goal — FSRBs support their region by identifying where members need technical assistance, but they don't set binding standards of their own (that remains FATF's role) or restrict FATF's consultation to member countries only. Dual FATF/FSRB membership is also common, not prohibited.",
      },
      {
        id: 28, title: 'Egmont Group Cooperation Principles', selectCount: 2,
        question: "Which principles of the Egmont Group of Financial Intelligence Units (FIUs) are aimed at maximizing cooperation between FIUs to more effectively combat money laundering?",
        options: [
          { text: 'Information exchange should take place informally, without too many formal prerequisites', correct: true },
          { text: 'FIU cooperation should always be channelled through designated intermediaries', correct: false },
          { text: 'Formal Egmont Group membership requirements ensure a high commitment of the eligible FIUs', correct: false },
          { text: "It is within an FIU's authority to sign Memoranda of Understanding independently", correct: true },
        ],
        explanation: "Egmont's whole model is built on speed and directness: FIUs exchange information informally rather than through bureaucratic layers, and each FIU has the standing authority to enter MOUs with counterparts on its own — no need to route everything through intermediaries. Membership requirements are a gatekeeping mechanism, not a cooperation-maximizing principle in themselves.",
      },
      {
        id: 29, title: 'Purposes of FSRBs', selectCount: 2,
        question: "What are the primary purposes of Financial Action Task Force (FATF)-Style Regional Bodies?",
        options: [
          { text: 'Imposing special measures for non-cooperative jurisdictions', correct: false },
          { text: 'Providing expertise and input in FATF policy-making', correct: true },
          { text: 'Providing due diligence for foreign correspondent banks', correct: false },
          { text: 'Promoting effective implementation of FATF Recommendations', correct: true },
          { text: 'Acting as a prudential regulatory body for financial institutions', correct: false },
        ],
        explanation: "FSRBs exist to bridge FATF's global standards into their region — feeding regional expertise back into FATF's policy process, and driving practical implementation of the Recommendations among their members. They don't perform due diligence for banks, act as a prudential regulator, or impose sanctions-style special measures themselves.",
      },
      {
        id: 30, title: 'EU AMLD and Local Regulations', selectCount: 2,
        question: "What is the relationship between the EU Anti-Money Laundering Directives (AMLD) and local AML regulations in EU member states?",
        options: [
          { text: 'Local AML laws and regulations override the requirements of the EU AMLD', correct: false },
          { text: 'Local AML regulations may impose additional or more stringent requirements than the EU AMLD', correct: true },
          { text: 'The EU AMLD provide a framework that member countries must implement through local AML regulations', correct: true },
          { text: 'The EU AMLD and local AML regulations are separate and unrelated legal frameworks', correct: false },
          { text: 'The EU AMLD and local AML regulations must have identical requirements', correct: false },
        ],
        explanation: "EU directives (unlike regulations) don't apply directly — each member state must transpose them into its own national law, and is free to go further than the directive's floor if it chooses. That's why AML rules can differ in strictness across EU countries even though they all trace back to the same directive.",
      },
      {
        id: 31, title: "FATF's 11 Immediate Outcomes", selectCount: 3,
        question: "Which of the following are included in the 11 Immediate Outcomes outlined in the FATF methodology for assessing the effectiveness of AML/CFT/CPF systems during mutual evaluations?",
        options: [
          { text: 'International cooperation provides actionable information to use against criminals', correct: true },
          { text: 'Supervisors regulate financial institutions and non-bank financial institutions and their risk-based AML/CFT programs', correct: true },
          { text: 'Financial intelligence information is collected by authorities and shared with FATF for further investigation', correct: false },
          { text: 'Those convicted of money laundering offenses are denied access to basic banking services', correct: false },
          { text: 'Money laundering offenses are investigated and criminally prosecuted', correct: true },
        ],
        explanation: "The 11 Immediate Outcomes test real-world effectiveness, not paper compliance — whether international cooperation actually produces usable intelligence, whether supervisors genuinely regulate on a risk basis, and whether ML is actually investigated and prosecuted. Financial intelligence is shared with domestic authorities and other FIUs, not routed to FATF itself, and there's no outcome about permanently debanking convicted launderers.",
      },
      {
        id: 32, title: 'Persons Bound by OFAC', selectCount: 3,
        question: "Which persons must always comply with all Office of Foreign Assets Control (OFAC) regulations?",
        options: [
          { text: 'US citizens regardless of location', correct: true },
          { text: 'Non-US financial institutions that offer accounts in USD regardless of location', correct: false },
          { text: 'Merchants that offer US-origin goods for sale regardless of location', correct: false },
          { text: 'US incorporated entities and their foreign branches', correct: true },
          { text: 'Permanent US resident aliens regardless of location', correct: true },
        ],
        explanation: "OFAC's core jurisdictional anchors are nationality and residency status (US citizens and permanent resident aliens, wherever they are) and US corporate incorporation (including foreign branches of US entities). Merely offering USD-denominated accounts or selling US-origin goods doesn't by itself bring a foreign business under OFAC's direct jurisdiction — though it can still expose them to secondary sanctions risk.",
      },
      {
        id: 33, title: 'Role of FSRBs', selectCount: 3,
        question: "The role of FATF-style regional bodies (FSRBs) is to:",
        options: [
          { text: 'coordinate technical assistance for members in their FSRB jurisdiction', correct: true },
          { text: 'identify and address any gaps in the AML/CFT policies for members outside of their FSRB jurisdiction', correct: false },
          { text: 'identify and address current financial crime trends through the issuance of typologies originating in members outside of their FSRB jurisdiction', correct: false },
          { text: 'set and amend the FATF 40 Recommendations for members in their FSRB jurisdiction', correct: false },
          { text: 'offer mutual evaluation and follow-up processes for members in their FSRB jurisdiction', correct: true },
          { text: 'provide AML/CFT technical assistance needed by members in their FSRB jurisdiction', correct: true },
        ],
        explanation: "Every genuine FSRB function is scoped to its own region: coordinating and providing technical assistance to its own members, and running mutual evaluations and follow-up for those same members. FSRBs don't set or amend the FATF 40 Recommendations themselves — that authority stays with FATF — and their typology/gap work is about their own membership, not members of other regions.",
      },
      {
        id: 34, title: 'Wolfsberg — Correspondent Banking Training', selectCount: 2,
        question: "A financial institution's compliance officer is developing targeted role-specific training for staff managing correspondent banking relationships, aligned with the Wolfsberg Group's Principles. Which key messages are important to include?",
        options: [
          { text: 'Funds used in the financing of terrorism and associated activities do not necessarily always come from criminal activity', correct: true },
          { text: 'The respondent has sole responsibility for reporting suspicious activities regardless of the jurisdictions involved', correct: false },
          { text: 'The correspondent and the respondent pose the same risk to each other, so the level of due diligence would be the same', correct: false },
          { text: 'Tier 1 banks can be subject to simplified due diligence provided enhanced due diligence is undertaken on the Directors', correct: false },
          { text: "Through the sharing of information, financial institutions can help combat and fight against terrorism", correct: true },
        ],
        explanation: "Two Wolfsberg messages matter most for correspondent banking staff: terrorist financing doesn't require criminal proceeds — legitimately sourced funds can still be diverted to terrorism, so 'clean money' isn't automatically low-risk. And information sharing between institutions is a genuine tool against terrorist financing, not just a compliance formality. Suspicious activity reporting is never the respondent's responsibility alone, and correspondent/respondent risk is never assumed to be symmetric.",
      },
      {
        id: 35, title: 'Sanctions Awareness Without a Regime', selectCount: 2,
        question: "How can awareness be raised within countries that do not have sanctions regulatory regimes?",
        options: [
          { text: 'Restrict trade between countries that have robust AFC and sanctions regulatory regimes and those that do not', correct: false },
          { text: 'AFC and sanctions-related seminars, webinars, and trainings within these countries', correct: true },
          { text: 'Enforcement and pecuniary fines against these countries', correct: false },
          { text: 'Bilateral conversations and cooperation between governments', correct: true },
        ],
        explanation: "Building capability in a country with no sanctions regime is a cooperative, capacity-building exercise — direct training and government-to-government dialogue — not a punitive one. Fining a country that has no regime to begin with, or restricting trade with it, doesn't build the regulatory capacity that's actually missing.",
      },
      {
        id: 36, title: "FATF's Mandate and Objectives", selectCount: 2,
        question: "Which of the following are part of the Financial Action Task Force's (FATF's) mandate and objectives?",
        options: [
          { text: 'Coordinating international cooperation among FATF members to effectively combat human trafficking', correct: false },
          { text: 'Setting standards for combating money laundering and the financing of terrorism and proliferation among FATF members', correct: true },
          { text: "Describing national-level money laundering and financing of terrorism and proliferation vulnerabilities to share among FATF members", correct: false },
          { text: 'Enforcing money laundering and financing of terrorism and proliferation controls in cooperation with local financial regulators', correct: false },
          { text: 'Promoting effective implementation of legal, regulatory, and operational measures for combating money laundering and the financing of terrorism and proliferation', correct: true },
        ],
        explanation: "FATF's core mandate is standard-setting and promoting implementation of those standards — it is a policy body, not an enforcement one. It doesn't coordinate operational anti-trafficking work, enforce controls directly with local regulators, or catalogue individual country vulnerabilities as a stated objective (that's closer to what a national risk assessment does).",
      },
      {
        id: 37, title: 'FATF Rec. 22 — Obliged Entities', selectCount: 4,
        question: "Per FATF Recommendation 22, which obliged entities or gatekeepers may be required to perform customer due diligence (CDD)?",
        options: [
          { text: 'Notaries involved in real estate transactions', correct: true },
          { text: 'Casino security guards', correct: false },
          { text: 'Accountants and auditors', correct: true },
          { text: 'Real estate agents', correct: true },
          { text: 'City court judges', correct: false },
          { text: 'Dealers in precious metals and stones', correct: true },
        ],
        explanation: "Recommendation 22 extends CDD obligations to designated non-financial businesses and professions (DNFBPs) — notaries, accountants/auditors, real estate agents, and precious metals/stones dealers all fall within this list because their services can be exploited to move or hide value. Casino security and court judges perform operational/judicial roles, not customer-facing gatekeeper functions, so they aren't captured.",
      },
      {
        id: 38, title: 'USA PATRIOT Act — Correspondent Onboarding', selectCount: 2,
        question: "The USA PATRIOT Act on correspondent banking requires US financial institutions that onboard new non-US financial institutions to address which of the following?",
        options: [
          { text: 'Determine under a risk-based approach if correspondent accounts require enhanced due diligence (EDD) measures', correct: true },
          { text: 'Close correspondent accounts that the foreign banks allow other financial institutions to use', correct: false },
          { text: "Ascertain the identity of the owners of the accounts that reside in the US", correct: false },
          { text: "Perform scrutiny for possible money laundering by obtaining information of the foreign bank's AML program", correct: true },
          { text: 'Implement monitoring activities in a reasonable manner only for inbound transactions', correct: false },
        ],
        explanation: "Onboarding a foreign correspondent means risk-rating the relationship to decide whether EDD is warranted, and specifically scrutinizing the foreign bank's own AML program before relying on it. 'Nested' correspondent use by other institutions isn't automatically disqualifying, and monitoring obligations cover both inbound and outbound activity — not inbound only.",
      },
      {
        id: 39, title: "OFAC's Extraterritorial Reach", selectCount: 3,
        question: "Identify three key aspects of OFAC sanctions that have extraterritorial reach.",
        options: [
          { text: 'Restricting travel by US citizens to certain countries', correct: false },
          { text: 'Economic and trade sanctions based on US foreign policy', correct: true },
          { text: 'Freezing foreign assets under US jurisdiction', correct: true },
          { text: 'Blocking people on the Specially Designated Nationals and Blocked Persons List', correct: true },
        ],
        explanation: "OFAC's extraterritorial reach operates through its foreign-policy sanctions programs, its ability to freeze assets anywhere they touch US jurisdiction, and the SDN List, which blocks designated persons wherever they're found. Travel restrictions for US citizens are a State Department / immigration matter, not an OFAC sanctions tool.",
      },
      {
        id: 40, title: 'Fourth EU Money Laundering Directive', selectCount: 3,
        question: "Which three statements are true about the Fourth EU Directive on Money Laundering?",
        options: [
          { text: 'It updates European Community legislation to be further in line with the Financial Action Task Force (FATF) 40 Recommendations', correct: true },
          { text: 'It repeats the definition of a politically exposed person from previous directives', correct: false },
          { text: 'It repeats the customer due diligence requirements of the previous directives but adds more detail — for example, a specific requirement to identify the beneficial owner, plus ongoing monitoring requirements', correct: true },
          { text: 'It includes new definitions for correspondent relationships and senior management', correct: true },
        ],
        explanation: "4AMLD's contribution was tightening and modernizing what came before it: aligning more closely with the (then-updated) FATF standards, adding explicit beneficial-ownership identification and ongoing monitoring to CDD, and defining terms like correspondent relationships and senior management for the first time. It didn't simply repeat the earlier PEP definition — it broadened PEP coverage as part of the same update.",
      },
      {
        id: 41, title: 'Key Goal of EU AML Directives',
        question: "Which is a key goal of EU Directives on money laundering?",
        options: [
          { text: 'Establish a consistent regulatory environment across the EU to prevent money laundering', correct: true, feedback: "Correct. The EU Directives exist specifically to harmonize AML standards across all member states — so that a bank in one country isn't operating under materially weaker rules than a bank in another, closing gaps criminals could otherwise exploit by shopping for the weakest jurisdiction." },
          { text: 'Address control of payments in EU countries to reduce money laundering', correct: false, feedback: 'Payment system controls are addressed by separate, more specific EU payments regulation — not the stated purpose of the AML Directives themselves.' },
          { text: 'Allow member states to discuss the draft legislation with the cooperation of the EU Financial Intelligence Units (FIUs)', correct: false, feedback: 'FIU consultation may happen during the legislative process, but this describes a procedural detail, not the actual goal of the Directives.' },
          { text: 'Build a network of financial institutions (FIs) that work together to prevent money laundering across the EU', correct: false, feedback: 'The Directives regulate FIs individually through national law — they do not themselves create an operational FI cooperation network.' },
        ],
      },
      {
        id: 42, title: 'Protecting NPOs From TF Abuse',
        question: "What should countries do to help prevent non-profit organizations from being abused for the financing of terrorism, according to the FATF 40 Recommendations?",
        options: [
          { text: 'Allow for freezing assets of non-profit organizations', correct: false, feedback: 'Asset freezing is a targeted sanctions tool for designated persons/entities — it is not the general NPO-protection measure FATF calls for.' },
          { text: "Require all non-profit organizations to register with the country's financial intelligence unit", correct: false, feedback: 'FATF does not require blanket NPO registration with the FIU specifically — its guidance is more targeted, focused on the risk of diversion.' },
          { text: "Ensure non-profit organizations cannot be used to conceal or obscure the diversion of funds intended for legitimate purposes to terrorists' organizations", correct: true, feedback: "Correct. FATF's focus is protecting the genuine charitable sector from abuse — ensuring donated funds can't be secretly redirected to terrorist purposes — while explicitly avoiding measures so heavy-handed that they disrupt legitimate NPO activity." },
          { text: 'Create laws that forbid non-profit organizations from completing cross-border transactions without first running them through known terrorist databases', correct: false, feedback: 'A blanket cross-border screening mandate against terrorist databases is more restrictive than FATF actually calls for, and would be highly disruptive to legitimate international charity work.' },
        ],
      },
      {
        id: 43, title: 'AML Program — Non-FATF Country Customers',
        question: "A compliance officer is developing an anti-money laundering program for a financial institution located in a FATF member country. The institution conducts business with customers located in countries/jurisdictions that are not members of FATF. Which of the following issues should be addressed in the program? (1) The requirement to identify the beneficial owners of accounts. (2) The requirement for customer identification for the opening of new accounts. (3) The financial institution's obligation to report suspicious transactions. (4) The obligation to freeze funds involved in suspicious transactions.",
        options: [
          { text: '1, 2, and 3 only', correct: true, feedback: "Correct. Beneficial ownership identification, customer identification at onboarding, and suspicious transaction reporting are all standard FATF-aligned program elements that apply regardless of where the customer is based. Freezing funds is a distinct, more specific power tied to sanctions or a formal legal order — not a general program obligation triggered simply by dealing with non-FATF-member customers." },
          { text: '1, 2, and 4 only', correct: false, feedback: 'This omits the core suspicious transaction reporting obligation while including the freezing power, which is not a standard general program requirement.' },
          { text: '1, 3, and 4 only', correct: false, feedback: 'This omits basic customer identification at account opening, which is a foundational requirement, not an optional one.' },
          { text: '2, 3, and 4 only', correct: false, feedback: 'This omits beneficial ownership identification, a core FATF requirement that should not be left out of any AML program.' },
        ],
      },
      {
        id: 44, title: 'PATRIOT Act — Impact on Foreign FIs',
        question: "Which aspect of the USA PATRIOT Act impacts foreign financial institutions?",
        options: [
          { text: 'Requiring enhanced due diligence for foreign shell banks', correct: false, feedback: 'The Act actually prohibits US correspondent relationships with foreign shell banks outright — it does not merely require enhanced due diligence on them.' },
          { text: "Expanding sanctions requirements to a US financial institution's foreign branches", correct: false, feedback: 'This describes an extension of a US institution\'s own obligations to its branches, not a provision that directly reaches independent foreign financial institutions.' },
          { text: 'Expanding the anti-money laundering program requirements to all foreign financial institutions', correct: false, feedback: 'The Act does not impose US-style AML program requirements on all foreign FIs globally — its authority is more targeted than a blanket global mandate.' },
          { text: 'Providing authority to impose special measures on institutions that are of primary money-laundering concern', correct: true, feedback: "Correct. Section 311 gives the Treasury Secretary the power to designate a foreign jurisdiction, institution, or class of transactions as a 'primary money laundering concern' and impose graduated special measures — from enhanced record-keeping up to severing correspondent access to the US financial system entirely." },
        ],
      },
      {
        id: 45, title: 'Purpose of Economic Sanctions',
        question: "Why do governments and multi-national bodies impose economic sanctions?",
        options: [
          { text: 'To impede kleptocracy', correct: false, feedback: 'Kleptocracy is one possible target of a sanctions program, but it is not the general stated purpose of sanctions as a tool.' },
          { text: 'To enforce foreign policy objectives', correct: true, feedback: "Correct. Economic sanctions are fundamentally a foreign policy instrument — a non-military way for a government or coalition to pressure a target country, regime, or actor into changing behaviour that threatens their interests or violates international norms." },
          { text: 'To combat an imminent terrorist threat', correct: false, feedback: 'Counter-terrorism is one specific application of sanctions, but it does not describe their overall general purpose.' },
          { text: 'To prevent fraudulent international trade transactions', correct: false, feedback: 'Preventing trade fraud is a customs/trade-compliance concern — it is not the purpose behind economic sanctions regimes.' },
        ],
      },
      {
        id: 46, title: 'What FSRBs Do for Members',
        question: "What do Financial Action Task Force (FATF)-style regional bodies do for their members to help combat money laundering and terrorist financing?",
        options: [
          { text: 'They provide technical assistance to members in implementing FATF recommendations', correct: true, feedback: "Correct. FSRBs exist to bridge FATF's global standards down to the practical, regional level — supporting members with the technical assistance and capacity-building needed to actually implement the Recommendations, not to police or supervise them directly." },
          { text: 'They assist member countries in penalizing entities that violate FATF standards and recommendations', correct: false, feedback: 'FSRBs are not enforcement or penalty-imposing bodies — that authority sits with national regulators and law enforcement.' },
          { text: 'They work with members on areas of concern outside of anti-money laundering and terrorist financing', correct: false, feedback: "FSRBs are scoped specifically to AML/CFT — working outside that mandate isn't their role." },
          { text: 'They supervise member country financial institutions relating to anti-money laundering and terrorist financing', correct: false, feedback: 'Direct supervision of financial institutions remains a national regulator function, not something FSRBs do themselves.' },
        ],
      },
      {
        id: 47, title: 'Supporting Documentation Requirements', selectCount: 2,
        question: "What are two requirements with respect to supporting documentation that is used to identify potentially suspicious activity, according to the Financial Action Task Force?",
        options: [
          { text: 'It must be retained for at least five years', correct: true },
          { text: 'It must be retained for at least seven years', correct: false },
          { text: 'It must be kept in a manner so that it can be provided promptly', correct: true },
          { text: 'It must only be released to the government through a subpoena process', correct: false },
        ],
        explanation: "FATF's baseline record-keeping standard is a five-year minimum retention period, and just as importantly, records need to be organized well enough to actually be retrieved and produced quickly when a competent authority requests them — retention without retrievability defeats the purpose. There's no FATF requirement limiting release only to subpoena-driven requests.",
      },
      {
        id: 48, title: "How FATF Communicates Jurisdiction Findings",
        question: "How does the Financial Action Task Force (FATF) communicate its findings regarding jurisdictions with strategic anti-money laundering / Counter Financing of Terrorism deficiencies?",
        options: [
          { text: 'By issuing documentation to the private sector', correct: false, feedback: "FATF's formal findings are issued as public statements, not as private-sector-directed documentation." },
          { text: 'By issuing two formal documents three times per year', correct: true, feedback: "Correct. FATF publishes its two public documents — the 'grey list' (Jurisdictions Under Increased Monitoring) and the 'black list' (High-Risk Jurisdictions Subject to a Call for Action) — three times a year, following each of its plenary meetings." },
          { text: 'By issuing informal communication to FATF members', correct: false, feedback: "FATF's jurisdiction findings are published formally and publicly, not communicated informally to members only." },
          { text: 'By issuing four formal documents to the deficient jurisdictions', correct: false, feedback: 'The cadence is three times a year with two documents, not four documents sent directly and exclusively to the deficient jurisdictions.' },
        ],
      },
      {
        id: 49, title: 'FATF Action Against Deficient Jurisdictions',
        question: "Which action does the Financial Action Task Force (FATF) recommend be taken against jurisdictions that have strategic deficiencies?",
        options: [
          { text: 'Conduct due diligence', correct: false, feedback: 'Enhanced due diligence is something FIs apply when dealing with a deficient jurisdiction — it is not the action FATF recommends countries take against the jurisdiction itself.' },
          { text: 'Apply counter-measures', correct: true, feedback: "Correct. For jurisdictions with serious, unaddressed strategic deficiencies, FATF calls on its members and other jurisdictions to apply counter-measures — proportionate, risk-based restrictions that go beyond ordinary enhanced due diligence." },
          { text: "Add the jurisdiction to the United Nations' list of sanctioned jurisdictions", correct: false, feedback: 'FATF and the UN sanctions system are separate — FATF has no authority to add a jurisdiction to a UN sanctions list.' },
          { text: 'Create an action plan to address the deficiencies without the support of the FATF', correct: false, feedback: 'FATF action plans for deficient jurisdictions are developed collaboratively with FATF oversight, not independently of it.' },
        ],
      },
      {
        id: 50, title: 'EU Fourth Directive Currency Threshold',
        question: "What is the currency threshold under the European Union Fourth Anti-Money Laundering Directive?",
        options: [
          { text: '3,000 Euros', correct: false, feedback: 'This is below the actual 4AMLD threshold.' },
          { text: '5,000 Euros', correct: false, feedback: 'This is below the actual 4AMLD threshold.' },
          { text: '10,000 Euros', correct: true, feedback: "Correct. The Fourth Directive set €10,000 as the threshold for bringing certain cash-dealing traders and cash payments within its customer due diligence requirements — a figure widely referenced across CAMS material on EU AML thresholds." },
          { text: '15,000 Euros', correct: false, feedback: 'This is above the actual 4AMLD threshold — €15,000 was the threshold used in some earlier EU AML instruments, not the Fourth Directive.' },
        ],
      },
      {
        id: 51, title: 'FATF Rec. 24 — Legal Persons',
        question: "What does the Financial Action Task Force 40 Recommendations address on transparency of beneficial ownership?",
        options: [
          { text: 'Gatekeepers', correct: false, feedback: "Gatekeeper obligations (Recommendation 22/23) are a separate topic from the beneficial ownership transparency provisions." },
          { text: 'Correspondent banking', correct: false, feedback: 'Correspondent banking due diligence (Recommendation 13) is a distinct standard from the beneficial ownership transparency requirement.' },
          { text: 'Payable through accounts', correct: false, feedback: 'Payable-through account rules are addressed elsewhere in the correspondent banking recommendations, not the beneficial ownership transparency provision.' },
          { text: 'Legal persons and arrangements', correct: true, feedback: "Correct. Recommendations 24 and 25 specifically require countries to ensure adequate, accurate, and timely beneficial ownership information is available for legal persons (companies) and legal arrangements (trusts) — closing off the anonymity that shell structures would otherwise provide." },
        ],
      },
      {
        id: 52, title: 'FATF Response to Lax Jurisdictions',
        question: "What does the Financial Action Task Force (FATF) urge its members and all other jurisdictions to do when a jurisdiction is identified as having lax anti-money laundering / counter financing of terrorism controls?",
        options: [
          { text: 'Apply counter-measures to that jurisdiction', correct: true, feedback: "Correct. FATF's escalation path for the most serious, unremediated cases is to call on all members and jurisdictions — not just the assessing body — to apply counter-measures, extending real-world pressure well beyond FATF's own membership." },
          { text: 'Consider customers from that jurisdiction as high risk', correct: false, feedback: 'Treating customers from a grey-listed jurisdiction as higher-risk (warranting EDD) is the more moderate, earlier-stage response — not the escalated call-to-action for the most serious deficiencies.' },
          { text: 'Cease doing business with that jurisdiction immediately', correct: false, feedback: 'FATF does not call for an outright, immediate cessation of all business — its guidance is risk-based and proportionate, even at the counter-measures stage.' },
          { text: 'Apply economic sanctions until otherwise notified by FATF', correct: false, feedback: 'FATF has no authority to impose or lift economic sanctions — that remains the domain of governments and bodies like the UN Security Council.' },
        ],
      },
      {
        id: 53, title: 'AML Violations — Individual Risk',
        question: "How can violations of anti-money laundering laws be a risk to individuals?",
        options: [
          { text: 'Violations can result in civil and criminal fines and penalties against the individuals', correct: true, feedback: "Correct. AML violations are not only an institutional risk — individuals who willfully participate in or enable violations can personally face civil monetary penalties and, in serious cases, criminal prosecution and imprisonment, entirely separate from any action taken against their employer." },
          { text: 'Violations can result in additional legislation that the individuals have to comply with', correct: false, feedback: 'New legislation is a broader regulatory/societal response, not a direct personal consequence for the individual who committed the violation.' },
          { text: "Violations can result in enforcement actions that damage the reputation of the individual's employer", correct: false, feedback: "Reputational damage to the employer is a real consequence, but it's an institutional risk, not a personal risk to the individual." },
          { text: 'Violations can result in additional and more stringent anti-money laundering training for individuals', correct: false, feedback: 'Additional training is a remedial measure, not a genuine risk or penalty facing the individual.' },
        ],
      },
      {
        id: 54, title: 'UN Sanctions Objectives', selectCount: 3,
        question: "The primary objectives of the United Nations in developing sanctions regimes include:",
        options: [
          { text: 'to force developing nations to adopt liberal or substantive democracies', correct: false },
          { text: 'to support governments and regimes in the peaceful resolution of conflict', correct: true },
          { text: 'to punish governments for having weak financial crime controls', correct: false },
          { text: 'to deter non-democratic and non-constitutional changes within countries', correct: true },
          { text: 'to support the protection of human rights', correct: true },
        ],
        explanation: "UN sanctions are a diplomatic tool aimed at peaceful conflict resolution, deterring unconstitutional seizures of power, and protecting human rights — all consistent with the UN's founding mandate to maintain international peace and security. They are not intended to impose a specific system of government on any country, nor are they a punitive tool for weak domestic financial crime controls (that is FATF's domain, not the UN's).",
      },
      {
        id: 55, title: 'Preventing Proliferation Financing',
        question: "What is a tool governments and multi-national bodies can use to prevent the proliferation of weapons of mass destruction?",
        options: [
          { text: 'Economic Sanctions', correct: true, feedback: "Correct. Targeted financial sanctions — freezing assets and blocking transactions tied to weapons proliferation networks — are the primary tool used to cut off the financing that would otherwise support WMD programs, as reflected in UN Security Council resolutions and FATF Recommendation 7." },
          { text: 'Commission Rogatoire', correct: false, feedback: 'A commission rogatoire is a formal judicial request for assistance between courts in different countries — a legal cooperation tool, not a proliferation-financing prevention measure.' },
          { text: 'Account Monitoring Order', correct: false, feedback: 'An account monitoring order is an investigative tool used within a specific case — it is not a proliferation-prevention mechanism.' },
          { text: 'Mutual Legal Assistance Treaties', correct: false, feedback: 'MLATs facilitate cross-border evidence-gathering for investigations and prosecutions — they are not themselves a preventive financial tool against proliferation.' },
        ],
      },
      {
        id: 56, title: 'PATRIOT Act — Where US Lacks Jurisdiction',
        question: "Under the USA PATRIOT Act, in which scenario would the US not have jurisdiction?",
        options: [
          { text: 'US bank subsidiaries located in foreign jurisdictions', correct: false, feedback: 'A foreign subsidiary of a US bank remains part of a US-regulated corporate structure, so US jurisdiction still applies.' },
          { text: 'Foreign branch of a bank located in the US', correct: false, feedback: 'A foreign bank operating a branch physically located in the US is squarely within US jurisdiction for that branch\'s activity.' },
          { text: 'Foreign bank with a US correspondent account', correct: false, feedback: "Maintaining a US correspondent account is precisely the nexus the PATRIOT Act uses to reach foreign banks — jurisdiction does apply here." },
          { text: 'Shell banks operating in foreign jurisdictions', correct: true, feedback: "Correct. A genuine shell bank with no US correspondent relationship, no US branch, and no other US nexus falls outside the reach the Act was built on — the Act's power comes specifically from a connection to the US financial system, which a purely foreign shell bank with no such link doesn't have." },
        ],
      },
      {
        id: 57, title: 'Seizing Funds From a Foreign Bank Correspondent',
        question: "A foreign bank maintains a correspondent account in the US. According to an investigation carried out by US authorities, the specific correspondent account seems to have facilitated a transaction involving tainted funds. Which allows the US authorities to seize the funds of the foreign bank held with the US bank?",
        options: [
          { text: 'The FinCEN CDD Final Rule', correct: false, feedback: 'The CDD Final Rule governs beneficial ownership identification at account opening — it does not grant seizure authority.' },
          { text: 'The 6th EU AML Directive', correct: false, feedback: 'The 6th EU AML Directive is EU legislation and has no bearing on US authorities\' domestic seizure powers.' },
          { text: 'Regulations of the OFAC, US Department of Treasury', correct: false, feedback: "OFAC regulations govern sanctions compliance — this scenario is about tainted funds in a correspondent account, which is specifically addressed by the PATRIOT Act's correspondent account seizure provision." },
          { text: 'The USA PATRIOT Act', correct: true, feedback: "Correct. Section 319(a) of the USA PATRIOT Act specifically allows the US government to seize funds from a foreign bank's US correspondent account up to the amount that was deposited into the foreign bank — extending US forfeiture reach to funds physically held offshore." },
        ],
      },
      {
        id: 58, title: "OFAC's Extraterritorial Purpose",
        question: "The main purpose of the US Treasury Department for OFAC's extraterritorial reach is to:",
        options: [
          { text: 'accomplish the foreign policy and national security goals of the US', correct: true, feedback: "Correct. OFAC's extraterritorial authority exists to extend US foreign policy and national security objectives beyond US borders — reaching non-US persons and transactions that would otherwise sit outside direct US jurisdiction, wherever there's a sufficient US nexus." },
          { text: 'defend the US against questionable trade practices of its economic rivals', correct: false, feedback: 'Trade-practice disputes are handled through separate trade policy and dispute mechanisms — that is not the stated purpose of OFAC sanctions.' },
          { text: 'protect allied nations of the US from the economic threats of non-allied nations', correct: false, feedback: "OFAC's mandate is centred on advancing direct US foreign policy and national security interests — not acting as a general economic protector on behalf of allied nations." },
          { text: "align OFAC's and other countries' extraterritorial reach requirements", correct: false, feedback: "OFAC's reach is set by US law and policy — it is not designed around aligning with other countries' own extraterritorial regimes." },
        ],
      },
      {
        id: 59, title: 'OFAC and UN Sanctions — Shared Goal',
        question: "Which is a similarity between the Office of Foreign Assets Control (OFAC) and UN imposed sanctions?",
        options: [
          { text: 'Supporting foreign policy objectives', correct: false, feedback: 'OFAC sanctions support specifically US foreign policy — UN sanctions reflect the collective position of the Security Council, so this framing describes them somewhat differently rather than as a shared feature.' },
          { text: 'Encouraging the sharing of funds', correct: false, feedback: 'Neither sanctions regime is designed around encouraging fund-sharing — both are restrictive rather than facilitative tools.' },
          { text: 'Deterring financing of terrorism', correct: true, feedback: "Correct. Countering terrorist financing is a goal both regimes genuinely share — OFAC's terrorism-related sanctions programs and UN Security Council resolutions on terrorist financing (such as Resolution 1373) both work to cut off financial support to designated terrorist actors." },
          { text: 'Restoring sovereign lands', correct: false, feedback: 'Territorial restoration is not a general objective of either sanctions regime.' },
        ],
      },
      {
        id: 60, title: "The Wolfsberg Group's Purpose",
        question: "The Wolfsberg Group has issued a number of documents since its inception aiming to:",
        options: [
          { text: 'provide advice to regulators around the world on the due diligence requirements for Politically Exposed Persons (PEPs)', correct: false, feedback: "The Wolfsberg Group is an industry body producing guidance for its own member banks — it doesn't function as an advisory body to regulators." },
          { text: 'provide financial institutions with an industry perspective on effective financial crime risk management', correct: true, feedback: "Correct. The Wolfsberg Group is a private-sector association of major international banks that develops practical, industry-driven guidance — frameworks like the Private Banking and Correspondent Banking Principles — reflecting what effective financial crime risk management looks like from the perspective of the institutions actually implementing it." },
          { text: 'prevent money laundering or terrorist financing by establishing consistent regulatory standards across the EU', correct: false, feedback: "The Wolfsberg Group is a global industry initiative, not an EU regulatory body, and its output is guidance rather than binding regulatory standards." },
          { text: "provide a standardized process amongst its bank members for combatting ML/TF in private banking", correct: false, feedback: 'Wolfsberg publishes principles and guidance rather than mandating one single standardized operational process across its member banks.' },
        ],
      },
      {
        id: 61, title: "Measuring a Country's AML/CFT Effectiveness",
        question: "How does the Financial Action Task Force (FATF) measure the effectiveness of a country's efforts to combat money laundering and terrorist financing?",
        options: [
          { text: 'Mutual evaluation', correct: true, feedback: "Correct. FATF's mutual evaluation process is a peer-review system where assessors examine both technical compliance (do the right laws exist) and, critically, effectiveness (do those laws actually work in practice) — producing the mutual evaluation reports that drive grey/black-listing decisions." },
          { text: 'Series of internal audits followed by reporting to FATF', correct: false, feedback: "Countries don't self-report through internal audits to FATF — the assessment is an external, independent peer-review process, not self-certification." },
          { text: 'Basel Committee', correct: false, feedback: 'The Basel Committee is a separate body focused on banking supervision standards — it is not the mechanism FATF uses to assess country-level AML/CFT effectiveness.' },
          { text: 'FATF Evaluation Committee', correct: false, feedback: 'There is no body by this name — the actual mechanism is the mutual evaluation process conducted by FATF and FSRB assessors.' },
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
      {
        id: 7, title: 'Simplified CDD',
        question: "Simplified Customer Due Diligence (SDD) may be applied when:",
        options: [
          { text: 'The customer, product, transaction, or delivery channel presents a demonstrably lower ML/TF risk as determined through the institution\'s risk-based assessment — and no suspicious activity indicators are present', correct: true, feedback: 'Correct. FATF explicitly permits simplified CDD in genuinely lower-risk situations. Examples include listed companies, regulated financial institutions, government entities, and standard low-risk products like basic savings accounts or low-value insurance. Even where SDD applies, CDD is not eliminated — the level of verification and monitoring is reduced, not removed.' },
          { text: 'A customer has been a client for more than 5 years without incident', correct: false, feedback: 'Tenure is a CDD refresh consideration — not a basis for simplified CDD. A long-standing customer relationship does not automatically create a lower risk profile, particularly if the customer\'s activity has changed or risk indicators have emerged.' },
          { text: 'The customer is listed on a major stock exchange — listed companies are always exempt from CDD', correct: false, feedback: 'Listed companies may qualify for simplified CDD as a lower-risk category, but they are not exempt from CDD entirely. Institutions must still identify beneficial ownership through public filings and maintain records.' },
          { text: 'Management approves a waiver on a case-by-case basis without a documented risk basis', correct: false, feedback: 'Simplified CDD must have a documented risk basis — not simply management approval. Using SDD without documented justification is a compliance deficiency that can attract regulatory action.' },
        ],
      },
      {
        id: 8, title: 'Source of Wealth vs Source of Funds',
        question: "In AML Enhanced Due Diligence, the key distinction between 'source of wealth' and 'source of funds' is:",
        options: [
          { text: 'Source of wealth refers to the origin of the customer\'s overall net worth (e.g., business sale, inheritance, career earnings); source of funds refers to the specific origin of funds used in a particular transaction or relationship — both are required for EDD on high-risk customers including PEPs', correct: true, feedback: 'Correct. Both elements are needed for a complete EDD picture. Knowing source of wealth tells you whether the overall level of wealth is plausible; knowing source of funds tells you whether the specific money being used in this transaction is legitimate. A customer with plausible overall wealth could still be placing illicit funds into a specific transaction — making both inquiries necessary.' },
          { text: 'They are interchangeable terms with no material difference in AML documentation', correct: false, feedback: 'They are meaningfully different. A customer may have legitimate overall wealth (source of wealth) but be using proceeds of crime in a specific transaction (source of funds). Both must be verified independently for EDD.' },
          { text: 'Source of wealth is used only in private banking; source of funds only applies to retail banking CDD', correct: false, feedback: 'Both concepts apply wherever EDD is triggered — private banking, correspondent banking, PEP relationships, or any high-risk customer. The private/retail distinction is not relevant to their application.' },
          { text: 'Source of wealth verification is only required for accounts opened before 2015 under legacy CDD rules', correct: false, feedback: 'There are no legacy exemptions of this kind. Source of wealth verification requirements apply to all current EDD situations under applicable AML frameworks.' },
        ],
      },
      {
        id: 9, title: 'Domestic PEPs vs Foreign PEPs',
        question: "Under FATF Recommendation 12, how does the treatment of domestic PEPs differ from foreign PEPs?",
        options: [
          { text: 'Foreign PEPs automatically require EDD; domestic PEPs and international organisation PEPs require a risk-based determination of whether EDD is appropriate — considering corruption risk, role seniority, and jurisdiction-specific factors', correct: true, feedback: 'Correct. The automatic EDD trigger for foreign PEPs reflects the greater difficulty of verifying source of wealth across jurisdictions and the higher corruption risk profile of cross-border PEP relationships. Domestic PEPs are subject to the same regulator and legal system as the institution — but a risk-based judgment is still required, and high-risk domestic PEPs will require EDD.' },
          { text: 'Domestic PEPs are fully exempt from EDD because they are regulated by the same domestic authorities as the institution', correct: false, feedback: 'Domestic PEPs are not exempt from EDD. Shared jurisdiction reduces some verification challenges but does not eliminate corruption risk. FATF R.12 requires a risk-based assessment — not an automatic exemption.' },
          { text: 'Both domestic and foreign PEPs require identical EDD in all circumstances — there is no distinction', correct: false, feedback: 'FATF R.12 explicitly distinguishes between foreign PEPs (mandatory EDD) and domestic/IO PEPs (risk-based determination). This distinction reflects differences in corruption risk profiles and verification practicalities.' },
          { text: 'International organisation PEPs (e.g., World Bank, UN officials) are not covered by FATF R.12 at all', correct: false, feedback: 'International organisation PEPs are explicitly included in FATF R.12. They require the same risk-based assessment as domestic PEPs — not the automatic EDD required for foreign PEPs.' },
        ],
      },
      {
        id: 10, title: 'Senior Managing Official',
        question: "When no natural person can be identified as a beneficial owner of a legal entity meeting the 25% ownership threshold, financial institutions should:",
        options: [
          { text: 'Identify and verify the identity of the senior managing official (e.g., CEO, Managing Director) as the control person — and treat the situation as higher-risk requiring enhanced ongoing monitoring', correct: true, feedback: 'Correct. The senior managing official fallback is recognised in FATF guidance and in national CDD rules (e.g., US FinCEN Customer Due Diligence Rule). It does not satisfy the beneficial ownership obligation — it is a fallback when genuine beneficial owners cannot be identified through reasonable means. The higher-risk treatment acknowledges that complex ownership structures that prevent beneficial owner identification are themselves a risk indicator.' },
          { text: 'Refuse to onboard the entity — beneficial ownership identification at the 25% level is a non-negotiable prerequisite', correct: false, feedback: 'Refusal is one option but not the only one. Where beneficial ownership cannot be identified, institutions apply the senior managing official approach with enhanced monitoring. The decision to proceed or refuse depends on the totality of risk.' },
          { text: 'Accept the entity\'s statutory directors as the beneficial owners without further investigation', correct: false, feedback: 'Statutory directors and beneficial owners are distinct categories. Directors may not own or control the entity. The beneficial ownership investigation must look through the legal structure — accepting directors as proxies is insufficient.' },
          { text: 'Request the national regulator to formally identify the beneficial owner before proceeding', correct: false, feedback: 'Regulators do not perform beneficial ownership identification for individual institutions. The institution bears the obligation to conduct its own CDD — including beneficial ownership investigation.' },
        ],
      },
      {
        id: 11, title: 'Ongoing Monitoring',
        question: "Effective ongoing monitoring of customer relationships should include:",
        options: [
          { text: 'Scrutinising transactions against the customer\'s known risk profile and expected activity patterns, keeping CDD information current, identifying trigger events requiring CDD refresh, and applying proportionately enhanced monitoring to higher-risk relationships', correct: true, feedback: 'Correct. Ongoing monitoring has two components under FATF R.10: (1) transaction monitoring — ensuring transactions are consistent with the institution\'s knowledge of the customer; and (2) CDD refresh — periodically reviewing and updating customer information, especially when circumstances change. Higher-risk customers require more frequent and intensive monitoring.' },
          { text: 'Conducting full CDD on every individual transaction for all customers regardless of risk rating', correct: false, feedback: 'Full CDD on every transaction for every customer is neither required nor practical. Monitoring intensity should be proportionate to risk — with automated transaction monitoring applying to all and manual review focused on alerts and higher-risk profiles.' },
          { text: 'Reviewing customer information only when a SAR is filed or a law enforcement request is received', correct: false, feedback: 'A reactive-only monitoring approach is insufficient. Proactive monitoring is what enables SAR filings in the first place. Waiting for external triggers defeats the purpose of ongoing monitoring.' },
          { text: 'Outsourcing monitoring entirely to third-party screening providers without internal oversight', correct: false, feedback: 'Outsourcing monitoring is permitted but the institution retains ultimate AML responsibility. A robust outsourcing oversight framework is required — the institution cannot transfer its regulatory obligations to a vendor.' },
        ],
      },
      {
        id: 12, title: 'Sanctions Screening',
        question: "When conducting sanctions screening, financial institutions must screen against:",
        options: [
          { text: 'Multiple applicable lists — including OFAC (US), OFSI (UK), UN Security Council consolidated lists, and domestic lists — checking customers, beneficial owners, counterparties, and transaction-related entities', correct: true, feedback: 'Correct. Sanctions obligations are multi-jurisdictional and institutions must comply with all applicable lists. For most international banks, this means simultaneously managing OFAC (with its extraterritorial reach), local domestic lists, and UN lists. The screening scope extends beyond customers — beneficial owners, counterparties, vessels, aircraft, and entities involved in transactions must all be screened.' },
          { text: 'Only the UN Security Council consolidated list — national lists like OFAC are supplementary and voluntary for non-US institutions', correct: false, feedback: 'OFAC has significant extraterritorial reach — even non-US institutions with US dollar correspondent relationships can face OFAC liability. The UN list is the baseline; additional lists (OFAC, OFSI, EU) overlay it with expanded requirements.' },
          { text: 'Only at account opening — transactional screening is only required for wire transfers above a threshold', correct: false, feedback: 'Sanctions screening must occur continuously. New designations are added regularly — an individual not sanctioned at onboarding may be sanctioned later. Real-time transaction screening is essential, as is rescreening following new designations.' },
          { text: 'FATF grey and black lists only — sanctions lists are purely foreign policy tools unrelated to AML', correct: false, feedback: 'FATF lists and sanctions lists are separate frameworks. Sanctions lists identify specifically designated individuals and entities — they are not the same as FATF\'s country-level risk classifications.' },
        ],
      },
      {
        id: 13, title: 'Adverse Media Screening',
        question: "Adverse media screening (negative news screening) is used in AML compliance primarily to:",
        options: [
          { text: 'Identify derogatory information from public sources — such as news articles, court records, and regulatory announcements — that may indicate criminal involvement, corruption, or serious reputational risk not captured by structured database screening alone', correct: true, feedback: 'Correct. Adverse media provides an additional intelligence layer beyond sanction lists and PEP databases. Criminals who are not yet prosecuted or listed may appear in news reporting, court records, or regulatory filings. A multi-layer screening approach (sanctions + PEP databases + adverse media) provides more complete risk coverage.' },
          { text: 'Replace formal CDD documentation requirements when customers refuse to provide identification', correct: false, feedback: 'Adverse media cannot substitute for CDD documentation. It is an additional intelligence layer that supplements — not replaces — formal identity verification and source of funds documentation.' },
          { text: 'Assess a customer\'s creditworthiness for loan underwriting and credit scoring', correct: false, feedback: 'Credit assessment is a separate banking function. Adverse media in AML specifically focuses on criminal, regulatory, and reputational risk indicators — not financial creditworthiness.' },
          { text: 'Confirm that a customer has never been mentioned in any media — a completely clean media record is a prerequisite for onboarding', correct: false, feedback: 'A clean media record is not required — many legitimate customers have simply never been mentioned in news articles. Adverse media screening identifies derogatory content, not the absence of all mentions.' },
        ],
      },
      {
        id: 14, title: 'Four Risk Dimensions',
        question: "Under a risk-based approach, the four primary risk dimensions used in most institutional AML risk assessments are:",
        options: [
          { text: 'Customer risk, product/service risk, geographic/country risk, and delivery channel risk — these dimensions are combined to produce an overall risk rating used to determine appropriate CDD levels and monitoring intensity', correct: true, feedback: 'Correct. These four dimensions are the standard AML risk assessment architecture recommended in FATF guidance. Each dimension has multiple risk factors: customer risk includes PEP status, industry, ownership complexity; product risk includes cash-intensity, cross-border use; geographic risk includes country corruption and FATF listing status; channel risk includes digital onboarding and non-face-to-face verification.' },
          { text: 'Identity risk, financial risk, reputational risk, and operational risk', correct: false, feedback: 'These are general enterprise risk categories. The AML-specific risk dimensions are customer, product/service, geographic/country, and delivery channel — not these general categories.' },
          { text: 'Regulatory risk, credit risk, market risk, and liquidity risk', correct: false, feedback: 'These are prudential risk categories (Basel framework). AML risk dimensions are distinct — customer, product, geography, and channel.' },
          { text: 'Pre-screening risk, onboarding risk, ongoing monitoring risk, and exit risk', correct: false, feedback: 'These describe stages of a customer lifecycle — not the four standard AML risk dimensions used in institutional risk assessments.' },
        ],
      },
      {
        id: 15, title: 'Correspondent Banking CDD',
        question: "When establishing a new correspondent banking relationship, the correspondent bank must:",
        options: [
          { text: 'Gather sufficient information to understand the respondent\'s business, ownership structure, AML/CFT controls, regulatory status, and reputation — and obtain senior management approval before establishing the relationship', correct: true, feedback: 'Correct. FATF R.13 imposes specific correspondent banking CDD requirements beyond standard business CDD: (1) assess the respondent\'s AML/CFT controls; (2) obtain senior management approval; (3) document respective responsibilities; (4) satisfy themselves that the respondent does not permit shell banks to use its accounts. The Wolfsberg CBDDQ is widely used to structure respondent bank information gathering.' },
          { text: 'Simply verify the respondent bank\'s SWIFT BIC code and confirm its regulated status in its home jurisdiction', correct: false, feedback: 'BIC verification and licensing confirmation are baseline checks — not the full CDD required under R.13. The correspondent must assess the quality and effectiveness of the respondent\'s AML controls, not just their regulatory status.' },
          { text: 'Accept the respondent\'s most recent FATF mutual evaluation score as sufficient correspondent CDD', correct: false, feedback: 'Country-level FATF evaluations assess the national AML system — not the individual bank\'s controls. A bank in a highly rated country may have weak AML controls; institution-level CDD is always required.' },
          { text: 'Apply standard retail CDD — correspondent banking has no special requirements beyond normal business onboarding', correct: false, feedback: 'Correspondent banking has explicit additional CDD requirements under FATF R.13 because the correspondent bank\'s customers effectively have indirect access to the correspondent\'s infrastructure. This "nested customer" risk justifies elevated standards.' },
        ],
      },
      {
        id: 16, title: 'De-Risking',
        question: "FATF has expressed concern about 'de-risking' (financial institutions terminating entire customer categories) because:",
        options: [
          { text: 'Blanket de-risking of entire categories pushes legitimate activity outside the regulated financial system — reducing AML visibility and potentially undermining financial inclusion without improving overall ML/TF risk management', correct: true, feedback: 'Correct. FATF and the FSB have published extensive guidance criticising indiscriminate de-risking. When legitimate businesses lose banking access, they may use less regulated channels — creating opacity that makes ML harder to detect. FATF\'s position is that the RBA requires managing individual risk, not blanket category exclusion.' },
          { text: 'De-risking reduces bank profitability and therefore reduces tax revenues available to fund AML regulation', correct: false, feedback: 'While financial impact is real, FATF\'s concern is specifically about the systemic AML risk created by pushing legitimate activity outside the regulated system — not bank profitability.' },
          { text: 'De-risking violates FATF Recommendation 1 by applying any risk-based controls to customer categories', correct: false, feedback: 'De-risking is not inherently a violation of R.1 — but blanket de-risking without individual risk assessment is. The RBA permits category-level risk factors but requires individual assessment before relationship decisions.' },
          { text: 'FATF prohibits all forms of customer exit decisions regardless of risk level', correct: false, feedback: 'FATF does not prohibit customer exits. Genuine risk-based decisions to decline or exit relationships are legitimate. FATF opposes indiscriminate blanket de-risking — not individual risk-based relationship decisions.' },
        ],
      },
      {
        id: 17, title: 'AML Training Requirements',
        question: "Under most international AML frameworks, who is required to receive AML training?",
        options: [
          { text: 'All relevant staff — including those who handle customers, process transactions, and perform compliance functions — with training content calibrated to their role and risk exposure; senior management and the board also have AML oversight responsibilities requiring appropriate awareness training', correct: true, feedback: 'Correct. FATF R.18 requires institutions to have ongoing employee training programmes. "Relevant" employees include front-line customer staff, operations staff, compliance, legal, and risk functions — not just AML specialists. Senior management and board training on their oversight obligations is increasingly expected by regulators. Training should be risk-based: a teller receives different training than a private banker.' },
          { text: 'Only compliance officers and AML analysts — front-line customer service staff have no AML training obligation', correct: false, feedback: 'Front-line staff are often the first to encounter suspicious behaviour. They have an obligation to recognise red flags and escalate internally. Limiting training to specialists leaves the first line of defence untrained.' },
          { text: 'Only staff who handle cash transactions — other staff are not at risk of exposure to ML', correct: false, feedback: 'ML exposure extends well beyond cash handling. Digital banking, wire transfers, correspondent banking, trade finance, and private banking all carry ML risk. Training must reflect the breadth of potential exposure.' },
          { text: 'AML training is a best practice recommendation with no binding regulatory obligation', correct: false, feedback: 'AML training is a regulatory requirement — not merely best practice. FATF R.18 specifically requires ongoing employee training programmes as part of the mandatory AML compliance programme framework.' },
        ],
      },
      {
        id: 18, title: 'Independent AML Audit',
        question: "An effective AML independent testing (audit) function should:",
        options: [
          { text: 'Test the design and operating effectiveness of AML controls, be staffed by personnel independent from the functions being tested, occur with risk-appropriate frequency, and report findings directly to the board or audit committee', correct: true, feedback: 'Correct. Independence is the defining characteristic of effective audit. Testing should cover the full AML programme — risk assessment, CDD, transaction monitoring, SAR process, training, and governance. Risk-based frequency means higher-risk areas are tested more often. Board/audit committee reporting ensures accountability and action on findings.' },
          { text: 'Be conducted by the same compliance team that developed the AML policies — they are best placed to test their own work', correct: false, feedback: 'Self-review fundamentally compromises independence. The team that designed controls cannot objectively test their own effectiveness. Independence is essential for audit credibility with regulators and the board.' },
          { text: 'Focus exclusively on transaction monitoring alert dispositions and SAR filings', correct: false, feedback: 'Effective AML audit covers the full programme — risk assessment quality, CDD documentation, training effectiveness, governance, and the overall control environment — not just transaction monitoring and SARs.' },
          { text: 'Only be triggered following a regulatory examination — proactive internal audit of AML controls is optional', correct: false, feedback: 'Independent testing is a mandatory component of an AML programme (the "fourth pillar"). Regulators expect proactive, regular internal audit — not a reactive response to examinations.' },
        ],
      },
      {
        id: 19, title: 'MLRO Responsibilities',
        question: "An effective Money Laundering Reporting Officer (MLRO) / Chief AML Officer must have:",
        options: [
          { text: 'Sufficient seniority and authority to make independent compliance decisions, direct access to the board and senior management, adequate resources and staff, and AML expertise appropriate to the institution\'s risk profile', correct: true, feedback: 'Correct. FATF R.18 and national regulations require the designated compliance officer to have the authority and resources necessary to discharge their obligations. An MLRO who cannot override business-line decisions, access the board, or staff the compliance function appropriately cannot effectively manage AML risk. Regulators increasingly scrutinise compliance officer empowerment as an indicator of culture.' },
          { text: 'Primary reporting responsibility to the chief revenue officer to ensure compliance aligns with business growth', correct: false, feedback: 'Reporting to the CRO creates a conflict of interest — the revenue officer\'s objectives are commercial, not compliance-driven. Effective compliance requires independence from revenue-generating functions.' },
          { text: 'Authority limited to SAR filing decisions — all other programme and staffing decisions are reserved to the CEO', correct: false, feedback: 'Limiting the MLRO to SAR filing creates a compliance function without teeth. The MLRO must have authority over policy, programme design, training, and escalation — not just the narrow SAR filing decision.' },
          { text: 'No direct board access — board AML reporting should be filtered through the chief financial officer', correct: false, feedback: 'Direct board access is essential for MLRO independence and effectiveness. Filtering through the CFO would compromise the MLRO\'s ability to bring critical compliance concerns to the board.' },
        ],
      },
      {
        id: 20, title: 'Third-Party CDD Reliance',
        question: "Under FATF Recommendation 17, when a financial institution relies on a third party to perform CDD:",
        options: [
          { text: 'The financial institution retains ultimate AML responsibility — it must be able to immediately obtain relevant CDD information from the third party on request, and must satisfy itself that the third party is appropriately regulated and compliant with applicable AML standards', correct: true, feedback: 'Correct. Third-party reliance is a practical necessity (e.g., using an introducer or group entity for initial CDD), but FATF is explicit: ultimate responsibility remains with the relying institution. The third party must: be regulated and supervised; have AML measures consistent with FATF standards; and provide CDD data immediately on request.' },
          { text: 'The third party assumes full regulatory and legal AML responsibility — the financial institution is relieved of all liability', correct: false, feedback: 'Third-party reliance transfers the operational task but not the regulatory obligation or liability. If the third party fails to perform adequate CDD, the relying institution remains liable to its regulator.' },
          { text: 'Third-party CDD reliance is not permitted under FATF standards — all CDD must be performed directly', correct: false, feedback: 'FATF R.17 explicitly permits reliance on third parties under specific conditions. This flexibility is essential for group-level CDD sharing and certain introducer arrangements.' },
          { text: 'Third-party reliance is only permitted for low-risk customers — EDD must always be conducted directly', correct: false, feedback: 'While EDD situations warrant greater scrutiny of third-party reliance, FATF R.17 does not categorically prohibit reliance for EDD. The key requirement is that the third party meets the R.17 conditions — not that reliance is excluded for higher-risk situations.' },
        ],
      },
      {
        id: 21, title: 'Correspondent Client Due Diligence Scope', selectCount: 2,
        question: "Which entities require due diligence when the correspondent banking client is not controlled by its parent?",
        options: [
          { text: 'The parent of the correspondent banking client', correct: true },
          { text: 'The clients of the correspondent banking client', correct: false },
          { text: 'The entities exhibiting higher-risk characteristics', correct: false },
          { text: 'The third parties providing services to the correspondent bank', correct: false },
          { text: 'The correspondent banking client itself', correct: true },
        ],
        explanation: "Due diligence always covers the client itself — that's the baseline. When the client isn't actually controlled by its stated parent, you can no longer rely on the parent's due diligence to cover the relationship, so the parent needs to be independently assessed too. The client's own downstream customers and unrelated service providers aren't automatically pulled into correspondent-level due diligence.",
      },
      {
        id: 22, title: 'Identifying Trust Parties (Basel)', selectCount: 3,
        question: "Which trust parties should be identified to determine the true nature of the trust relationship, according to Basel guidelines?",
        options: [
          { text: 'Respondents', correct: false },
          { text: 'Payees', correct: false },
          { text: 'Trust administrators', correct: false },
          { text: 'Trustees', correct: true },
          { text: 'Beneficiaries', correct: true },
          { text: 'Settlors/grantors', correct: true },
        ],
        explanation: "A trust's true nature is defined by who controls it, who receives its benefit, and who created it — the trustee, the beneficiaries, and the settlor/grantor. Understanding those three roles is what tells you who's really behind the structure. 'Respondents' and 'payees' aren't trust-specific roles, and administrators are typically service providers rather than parties whose identity defines the trust relationship.",
      },
      {
        id: 23, title: 'Risk Assessment Factors', selectCount: 2,
        question: "When performing a risk assessment, which factors should be considered when identifying and measuring risk?",
        options: [
          { text: 'Customer composition', correct: true },
          { text: 'Financial performance', correct: false },
          { text: 'Product offerings', correct: true },
          { text: 'Regulatory environment', correct: false },
          { text: 'Company culture', correct: false },
        ],
        explanation: "A money laundering risk assessment is built around who you serve and what you sell them — customer composition and product/service offerings are the two core inputs that actually drive ML/TF exposure. Financial performance, regulatory environment, and culture are relevant to the business more broadly, but they aren't the specific risk-assessment inputs FATF and Basel guidance point to.",
      },
      {
        id: 24, title: 'Correspondent Client Ownership Risk', selectCount: 2,
        question: "Which risks are involved in a correspondent banking client's ownership and management structure?",
        options: [
          { text: 'Regularity of board meetings', correct: false },
          { text: 'Size of the management structure', correct: false },
          { text: 'Status as a state-, publicly-, or privately-held entity', correct: true },
          { text: 'Transparency of the ownership structure', correct: true },
          { text: 'Length of time since the last Wolfsberg Group review', correct: false },
        ],
        explanation: "The two things that actually matter for correspondent risk are how transparent the ownership is — can you actually see who controls the bank — and what kind of entity it is, since state-owned banks carry different (often PEP-related) risk than privately held ones. Board meeting cadence and time since a Wolfsberg review are governance housekeeping, not ownership-structure risk factors.",
      },
      {
        id: 25, title: 'Who May Perform the AML Audit', selectCount: 2,
        question: "Who meets the standard to perform the AML audit?",
        options: [
          { text: 'Qualified bank staff, if not involved in the AML function being tested', correct: true },
          { text: 'An internal auditor with the requisite knowledge and expertise of AML', correct: true },
          { text: 'An internal auditor with a family member employed in the AML department', correct: false },
          { text: 'A consultant with limited knowledge and experience in AML but many years of internal audit experience', correct: false },
          { text: 'A consultant previously employed in the AML department within the past two years', correct: false },
        ],
        explanation: "Independence and competence are both non-negotiable: the auditor must actually understand AML, and must have no involvement in — or close personal/employment ties to — the function being reviewed. A family member in the AML department, or having worked in that department within the last two years, compromises independence even if the auditor is otherwise qualified.",
      },
      {
        id: 26, title: "Basel's Essential KYC Elements", selectCount: 2,
        question: "Which are essential elements of a KYC program identified by the Basel Committee on Banking Supervision?",
        options: [
          { text: 'Risk appetite', correct: false },
          { text: 'Code of conduct', correct: false },
          { text: 'Risk management', correct: true },
          { text: 'Internal control', correct: false },
          { text: 'Customer acceptance policy', correct: true },
        ],
        explanation: "Basel's KYC framework centres on deciding who you'll accept as a customer (customer acceptance policy) and how you manage the risk of the customers you do accept (risk management) — the two elements that shape the entire customer lifecycle. Risk appetite, code of conduct, and internal control are broader governance concepts that sit around a KYC program rather than defining its essential elements.",
      },
      {
        id: 27, title: 'Third-Party Relationship Red Flags', selectCount: 2,
        question: "Which red flags should be considered prior to establishing a relationship with a third party?",
        options: [
          { text: 'The third party has sufficient capability to provide the services or goods for which it is being engaged', correct: false },
          { text: 'The third party has a declaration of non-family or business ties with government officials', correct: false },
          { text: 'The third party has requested unusual payment or billing procedures', correct: true },
          { text: 'The third party has a lack of anti-corruption compliance clauses in agreements', correct: true },
          { text: "The third party's amount to be paid for goods and services appears to be reasonable", correct: false },
        ],
        explanation: "Unusual payment/billing requests and the absence of anti-corruption clauses are the two things that should stop a third-party onboarding in its tracks — both point toward funds being routed in ways designed to avoid scrutiny. Genuine capability to deliver the service, a clean government-ties declaration, and reasonable pricing are all what you'd expect from a legitimate vendor.",
      },
      {
        id: 28, title: 'TCSP Trust Risk Assessment Data', selectCount: 2,
        question: "According to the Financial Action Task Force, as part of their risk assessment, which are important data and information that a Trust and Company Service Provider (TCSP) must understand when establishing and administering a trust?",
        options: [
          { text: 'The source of funds in the structure', correct: true },
          { text: 'The general purpose behind the structure', correct: true },
          { text: 'The responsibility and authority in the structure', correct: false },
          { text: 'The management structure of the trust', correct: false },
          { text: 'The general nature of business of the trust', correct: false },
        ],
        explanation: "A TCSP's core job is understanding why the trust exists and where its money comes from — the source of funds and the stated purpose behind the structure. Those two answer the fundamental risk question: is this a legitimate arrangement, and does the money entering it make sense. Authority, management structure, and general business nature are operational details that support, but don't replace, that core understanding.",
      },
      {
        id: 29, title: 'Triggers for Program Reassessment', selectCount: 2,
        question: "Which factors should lead to a reassessment of the current AML program?",
        options: [
          { text: 'Appointment of a new Chief Financial Officer', correct: false },
          { text: 'Change of company name', correct: false },
          { text: 'Change of internal audit team members', correct: false },
          { text: 'New product offering', correct: true },
          { text: 'Expansion of business to new territories', correct: true },
        ],
        explanation: "A reassessment is warranted when the actual risk exposure of the business changes — a new product or expanding into new territory both introduce genuinely new ML/TF risk that the existing program wasn't built to cover. A rebrand, a new CFO, or a staffing change on the audit team don't change the underlying risk profile of what the institution does.",
      },
      {
        id: 30, title: 'Customer Risk Rating Factors', selectCount: 3,
        question: "Which risk factors are considered when assessing the risk rating of customers?",
        options: [
          { text: 'Employment risk', correct: false },
          { text: 'Geographic risk', correct: true },
          { text: 'Customer risk', correct: true },
          { text: 'Credit risk', correct: false },
          { text: 'Fraud risk', correct: false },
          { text: 'Product risk', correct: true },
        ],
        explanation: "Customer risk rating is typically built on three standard dimensions: who the customer is (customer risk), where they operate (geographic risk), and what they're using (product risk). Credit and fraud risk are managed by other functions within a bank, and employment status alone isn't a standard risk-rating dimension.",
      },
      {
        id: 31, title: 'Basel — Identifying and Accepting Customers', selectCount: 2,
        question: 'The Basel Committee on Banking Supervision published guidelines on the "Sound management of risks related to money laundering and financing of terrorism." With regard to identifying and accepting customers, it recommends that banks:',
        options: [
          { text: 'establish policies and procedures for customer due diligence that vary based on risk', correct: true },
          { text: 'are prohibited from offering numbered accounts to customers, even if procedures are established to gather and maintain due diligence information', correct: false },
          { text: 'establish policies and procedures to identify and verify customers, beneficial owners, and any individuals that can transact on behalf of their customers', correct: true },
          { text: 'establish policies and procedures to ensure due diligence activities are identical for all customers', correct: false },
          { text: 'establish policies and procedures that encourage processing transactions while due diligence information is being established and verified', correct: false },
        ],
        explanation: "Basel's guidance is squarely risk-based: due diligence intensity should scale with risk, and it must cover not just the named customer but beneficial owners and anyone authorized to transact. Numbered accounts aren't outright banned as long as the bank still gathers full due diligence internally, and 'identical for everyone' is the opposite of a risk-based approach.",
      },
      {
        id: 32, title: 'Strengthening the Customer ID Program', selectCount: 2,
        question: "According to the Basel Committee principles, which actions would make a customer identification program at a bank more robust?",
        options: [
          { text: 'Limiting the online activities of a new customer during the first two months', correct: false },
          { text: 'Understanding the nature and purpose behind a new business opening an account at the bank', correct: true },
          { text: 'Verifying the identity of a customer with reputable online source documentation', correct: true },
          { text: 'Understanding why a customer has selected a particular financial institution for banking', correct: false },
        ],
        explanation: "A stronger identification program is about better verification and better context — confirming identity against credible independent sources, and genuinely understanding why a business wants the account (its nature and purpose). Restricting new-customer activity for an arbitrary period, or probing why they chose this particular bank, don't add to identification robustness.",
      },
      {
        id: 33, title: 'EU Data Privacy Restrictions on FIs', selectCount: 2,
        question: "Privacy and data protection restrictions placed upon financial institutions (FIs) in the EU require that FIs must:",
        options: [
          { text: 'engage third parties to supplement any missing customer identification information', correct: false },
          { text: 'apply data minimization to avoid overreach in data collection', correct: true },
          { text: 'inform a customer of any information the FI has obtained as a result of an investigation into unusual activity', correct: false },
          { text: 'follow strict guidelines when using machine learning and artificial intelligence', correct: true },
        ],
        explanation: "EU data protection principles require collecting only what's genuinely needed (data minimization) and applying real guardrails when automated tools like ML/AI process personal data. Telling a customer what an investigation uncovered would defeat the purpose of the investigation (and risks tipping-off), and outsourcing identity gaps to third parties doesn't satisfy the FI's own data-handling obligations.",
      },
      {
        id: 34, title: 'New Corporate Customer Risk Factors', selectCount: 3,
        question: "Which risk factors should a financial institution (FI) examine for a new corporate customer intending to open a new bank account?",
        options: [
          { text: 'The type of business the corporate customer is engaged in', correct: true },
          { text: 'The employment profiles and information of all employees of the new customer', correct: false },
          { text: 'All the financial institutions where the new customer currently banks or banked previously', correct: false },
          { text: 'The identity of senior managing officials and all individuals authorized to operate the account', correct: true },
          { text: 'The country or location where the customer is from or conducts business', correct: true },
        ],
        explanation: "The three things that actually shape a corporate customer's risk profile are what business they're in, where they operate, and who controls the account — the nature of the business, geography, and the identity of the people with real authority over it. A full employee roster and a complete banking history at other institutions aren't standard onboarding requirements.",
      },
      {
        id: 35, title: 'Corporate Banking Role-Specific Training', selectCount: 2,
        question: "A relationship manager in the corporate banking department at a bank is required to take specialized AML training tailored to the risks the department is most likely to encounter. Which types of content are most appropriate for this training?",
        options: [
          { text: 'Money laundering typologies applicable to monetary instrument reporting', correct: false },
          { text: 'Applicable AML laws and regulations', correct: true },
          { text: 'Money laundering typologies applicable to corporate loans', correct: true },
          { text: 'Regulatory exam best practices', correct: false },
        ],
        explanation: "Role-specific training should map directly to the job: a corporate banking RM needs to know the laws that govern their work and the ML typologies specific to corporate lending — the products they actually handle. Monetary instrument reporting typologies belong to a retail/teller role, and regulatory exam best practices are a compliance-department concern, not a frontline training topic.",
      },
      {
        id: 36, title: 'Purpose of a Risk Appetite Statement', selectCount: 2,
        question: "What is the purpose of a risk appetite statement (RAS) and its linkages while implementing corresponding organizational controls?",
        options: [
          { text: "An RAS formalizes a risk appetite statement from management and informs the board of directors on the risk assessment performed", correct: false },
          { text: 'An RAS establishes a desired level of risk exposure in qualitative terms and covering all areas of compliance', correct: false },
          { text: 'An RAS sets limits for risk-taking by means of quantitative and qualitative metrics so that the business does not take up risk in excess of the organization\'s risk tolerance', correct: true },
          { text: "An RAS establishes a management-approved policy that identifies the organization's risk tolerances aligned with strategic objectives, risk profile, and risk management capabilities", correct: true },
          { text: 'An RAS sets limits in terms of residual risk and is thus strongly intertwined with the efficacy of the system of internal controls', correct: false },
        ],
        explanation: "An RAS does two things at once: it sets concrete, measurable boundaries on risk-taking, and it's a management-approved policy that ties those boundaries back to the organization's actual strategy and risk capacity. It's not simply a report to the board on a risk assessment already performed, and it isn't defined purely in terms of residual risk or internal-control efficacy.",
      },
      {
        id: 37, title: 'Scenarios Warranting EDD', selectCount: 3,
        question: "Which of the following scenarios warrants enhanced due diligence (EDD)?",
        options: [
          { text: 'The former personal secretary to the minister of transport in a low-risk country 25 years ago opening a bank account at a bank in a neighboring low-risk country', correct: false },
          { text: 'An existing local league footballer trying to open a bank account with a bank in their local jurisdiction', correct: false },
          { text: 'A bank located in a higher-risk country trying to establish a correspondent-respondent banking relationship with a bank in a lower-risk country', correct: true },
          { text: 'An individual with a current bank account who resides in one country becoming the ambassador of another country', correct: true },
          { text: 'The current prime minister of a country trying to open a bank account in another country', correct: true },
        ],
        explanation: "EDD is triggered by present, active risk: a correspondent relationship originating from a higher-risk jurisdiction, and two current PEPs (a sitting ambassador and a sitting prime minister) opening accounts. A former, decades-ago junior government role in a low-risk country and an ordinary local footballer don't carry the same live risk profile.",
      },
      {
        id: 38, title: 'Designing a Risk-Based Approach', selectCount: 2,
        question: "What should an organization consider when designing a risk-based approach (RBA) to mitigating financial crime risks?",
        options: [
          { text: "The size and complexity of the organization's operations", correct: true },
          { text: 'The number of personnel or resources on staff', correct: false },
          { text: 'Eliminating opportunities to implement simplified measures', correct: false },
          { text: 'The nature and extent of money laundering and terrorist financing exposure', correct: true },
          { text: 'Increasingly outsourcing accountability to third parties and vendors', correct: false },
        ],
        explanation: "An RBA has to be built around the organization it actually governs: how big and complex the business is, and what ML/TF exposure it genuinely faces. Staff headcount is a resourcing question, not a design input, and a properly risk-based approach should preserve — not eliminate — the option to apply simplified measures where risk is genuinely low.",
      },
      {
        id: 39, title: 'Background Screening for New Hires', selectCount: 3,
        question: "A recruitment manager in the human resources department of a bank has shortlisted a candidate for the position of relationship manager in its private banking division. Which resources would be most useful for identifying any potential negative information regarding the shortlisted candidate?",
        options: [
          { text: 'Past employment records', correct: true },
          { text: 'Personal references from close associates', correct: false },
          { text: 'Personal resume', correct: false },
          { text: 'Internet and public media searches', correct: true },
          { text: 'Criminal history searches', correct: true },
        ],
        explanation: "Genuinely independent, verifiable sources are what a know-your-employee screen needs: past employer records, public media, and a criminal history check. A resume and personal references are both supplied or chosen by the candidate themselves, so they're the least reliable sources for surfacing information the candidate would rather not disclose.",
      },
      {
        id: 40, title: 'Triggers for Enterprise-Wide Reassessment', selectCount: 3,
        question: "Which changes at a financial institution (FI) should trigger an enterprise-wide reassessment of its inherent AML risk exposure?",
        options: [
          { text: 'Introduction of new products or services', correct: true },
          { text: "Restructuring of the FI's risk and compliance functions", correct: false },
          { text: "Changes in the individuals overseeing the FI's product lines and sales strategies", correct: false },
          { text: 'Use of new technologies for delivering existing products', correct: true },
          { text: 'Mergers or acquisitions', correct: true },
        ],
        explanation: "The events that warrant a full enterprise-wide reassessment are the ones that actually change what risk the institution is exposed to: new products, new delivery technology for existing products, and mergers/acquisitions all bring genuinely new customers, channels, or jurisdictions into scope. Reorganizing the compliance department or changing which manager oversees a product line doesn't change the underlying risk itself.",
      },
      {
        id: 41, title: 'Implementing New Customer Information Laws',
        question: "A government has instituted new anti-money laundering laws which require all financial institutions to obtain certain information from its customers. Which step should an institution located in this jurisdiction take to ensure compliance?",
        options: [
          { text: 'Change procedures to require that the necessary information is obtained', correct: false, feedback: 'Updating procedures alone, without also updating the systems that support them or training the staff who apply them, leaves a real gap between what the policy says and what actually happens.' },
          { text: 'Change procedures and systems as necessary and provide employee training', correct: true, feedback: "Correct. Genuine compliance with a new legal requirement needs all three legs in place together — updated procedures, the systems to actually capture and support the new information requirement, and staff trained to apply it correctly. Any one of these alone leaves a gap." },
          { text: 'Send a notice to customers asking them to provide the necessary information', correct: false, feedback: 'Simply asking customers, without a procedural and systems framework to collect, verify, and record the information, is not a compliance program.' },
          { text: 'Change systems to ensure the required information is automatically obtained from all customers', correct: false, feedback: 'Systems changes alone, without updated procedures and trained staff to handle exceptions and verification, are not sufficient on their own.' },
        ],
      },
      {
        id: 42, title: 'Legal Risks of Inadequate Privacy Policies', selectCount: 2,
        question: "What are two legal risks of having inadequate privacy policies and procedures?",
        options: [
          { text: 'Diminished reputation', correct: false },
          { text: 'Incurring regulatory sanctions', correct: true },
          { text: 'Charges of deceptive business practices', correct: true },
          { text: 'Higher marketing and public relations costs', correct: false },
        ],
        explanation: "Both are genuine legal exposures: regulators can directly sanction an institution for inadequate privacy controls, and mishandling customer data in ways that don't match what customers were told can expose the institution to deceptive-practices claims. Reputational damage and higher PR costs are real business consequences, but they are commercial fallout, not legal risks in themselves.",
      },
      {
        id: 43, title: 'Identifying PEPs (Basel CDD Paper)',
        question: "What is the appropriate compliance control for identifying politically exposed persons (PEPs) according to the Basel Committee's paper on Customer Due Diligence for Banks?",
        options: [
          { text: 'Determining that a local figure is a PEP', correct: false, feedback: "Assessing only 'local' figures misses the point — PEP status includes foreign officials too, and this option doesn't describe a control, just a narrow judgment call." },
          { text: 'Reviewing when a relationship is established', correct: false, feedback: "A one-time check at onboarding misses PEP status that arises later — someone can become a PEP well after the account was opened." },
          { text: 'Reviewing relationships at account opening and on a periodic basis', correct: true, feedback: "Correct. PEP status can change at any point during a relationship — someone can be appointed to a prominent public role years after becoming a customer — so Basel's guidance calls for checking at onboarding and then periodically throughout the relationship, not just once." },
          { text: 'Requiring that the customer discloses that they are a PEP or an associate of a PEP', correct: false, feedback: "Relying on self-disclosure alone is not an adequate control — a bank needs to actively screen for PEP status rather than depend on the customer to volunteer it." },
        ],
      },
      {
        id: 44, title: 'When to Update the Risk Assessment',
        question: "When should the anti-money laundering risk assessment be updated?",
        options: [
          { text: 'Every two years', correct: false, feedback: "A fixed calendar schedule alone isn't the trigger — the risk assessment needs to respond to actual changes in the business, not just the passage of time." },
          { text: 'After a merger or acquisition', correct: true, feedback: "Correct. A merger or acquisition can bring in entirely new customer bases, products, and jurisdictions overnight — exactly the kind of material change that makes the existing risk assessment out of date and requires it to be refreshed." },
          { text: 'When the board of directors changes', correct: false, feedback: "A change in board composition doesn't itself change the institution's underlying risk exposure." },
          { text: 'When instructed to by the Financial Action Task Force', correct: false, feedback: "FATF doesn't issue direct instructions to individual institutions — that role belongs to national regulators, and even then, the real trigger is a change in the business itself." },
        ],
      },
      {
        id: 45, title: "Basel's Essential KYC Standard",
        question: "What is an essential element of Know Your Customer (KYC) standards according to the Basel Committee's Customer Due Diligence for Banks paper?",
        options: [
          { text: 'Annual staff training', correct: false, feedback: 'Training is important to an overall AML program, but it is not the specific KYC standards element the Basel paper identifies.' },
          { text: 'A customer acceptance policy', correct: true, feedback: "Correct. A clear customer acceptance policy — defining who the bank will and won't take on as a customer, and under what conditions — is one of Basel's core KYC pillars, since it's the first control point where risk is actually screened before a relationship even begins." },
          { text: 'The same KYC requirements must be applied in all cases', correct: false, feedback: "This directly contradicts the risk-based approach — Basel's guidance calls for KYC intensity to vary with risk, not be applied uniformly." },
          { text: 'All completed KYC documents must be reviewed by a senior manager not involved in the account opening process', correct: false, feedback: "Universal senior-manager review of every KYC file isn't a standard Basel requirement — that level of scrutiny is reserved for higher-risk relationships." },
        ],
      },
      {
        id: 46, title: 'What Actually Triggers a Reassessment',
        question: "A new compliance officer is reviewing the bank's anti-money laundering program and notices that the risk assessment was completed six months ago. Since that time, the bank acquired another financial institution, re-named the internal records group, and streamlined cash handling procedures. Which factor causes the compliance officer to update the bank's risk assessment?",
        options: [
          { text: 'The bank acquired another institution', correct: true, feedback: "Correct. An acquisition brings in a new customer base, potentially new products, and new geographic exposure — a genuine change in risk profile. Renaming an internal department and streamlining internal cash handling procedures are operational, not risk-profile, changes." },
          { text: 'The internal records group has been re-named', correct: false, feedback: "A department rename is a purely administrative change with no bearing on the bank's actual risk exposure." },
          { text: 'The cash handling procedures were streamlined', correct: false, feedback: "Making an existing internal process more efficient doesn't change what customers, products, or geographies the bank is exposed to." },
          { text: 'The risk assessment was completed six months ago', correct: false, feedback: "Six months is not inherently stale — the timing itself isn't the trigger; a material business change is." },
        ],
      },
      {
        id: 47, title: 'Independent Review — Conflict of Interest',
        question: "A bank is preparing for its anti-money laundering independent review, which is performed every two years under the direction of the compliance officer. The bank's corporate audit department will conduct the review. The compliance officer will review the final report before it is released to the Board of Directors. What is the issue with this situation?",
        options: [
          { text: 'Independent reviews must be performed annually', correct: false, feedback: "There is no universal requirement that independent reviews happen annually — a two-year cycle can be appropriate depending on the institution's risk profile." },
          { text: 'The review must be performed by a group outside of the bank', correct: false, feedback: "An internal audit department can be an appropriate reviewer, provided it is genuinely independent of the function being reviewed — the problem here is elsewhere." },
          { text: 'The final report must be presented directly to the board of directors', correct: false, feedback: "The board should ultimately see the report, but that alone isn't the core problem in this scenario." },
          { text: 'There is a conflict of interest with the management of the review process', correct: true, feedback: "Correct. Having the compliance officer — the very person responsible for the program being reviewed — direct the review and screen the final report before the board sees it undermines the independence the review is supposed to provide. An independent review needs to reach the board without being filtered by the function it's assessing." },
        ],
      },
      {
        id: 48, title: 'Ultimate Responsibility for the BSA/AML Program',
        question: "Who has the ultimate responsibility within a bank for ensuring that the bank has a comprehensive and effective Bank Secrecy Act / anti-money laundering (BSA/AML) program and oversight framework that is reasonably designed to ensure compliance with applicable regulations?",
        options: [
          { text: 'Senior management', correct: false, feedback: "Senior management implements and executes the program day-to-day, but ultimate responsibility for its adequacy sits a level above them." },
          { text: 'Board of directors', correct: true, feedback: "Correct. The board of directors bears ultimate responsibility for the AML program's overall adequacy and effectiveness — it can delegate execution to senior management and the compliance officer, but accountability for the framework as a whole stays at the board level." },
          { text: 'Business line managers', correct: false, feedback: "Business line managers are responsible for compliance within their own units, not for the institution's overall program." },
          { text: 'BSA/AML compliance officer', correct: false, feedback: "The compliance officer manages the program's day-to-day operation, but does not hold ultimate institutional responsibility — that rests with the board." },
        ],
      },
      {
        id: 49, title: 'Orientation Training for New Tellers',
        question: "A compliance officer provides an overview of the bank's anti-money laundering program to a group of new tellers during employee orientation. Which training element should be delivered to this audience?",
        options: [
          { text: 'Results of recent risk assessments', correct: false, feedback: 'Full risk assessment results are a management/compliance-level document, not front-line orientation content for new tellers.' },
          { text: 'Large cash transaction reporting procedures', correct: true, feedback: "Correct. Tellers are the ones actually handling cash transactions day to day, so understanding large cash transaction reporting procedures is directly relevant, practical knowledge they need from day one — exactly the kind of role-specific content orientation training should prioritize." },
          { text: "The financial institution's surprise cash audit policy", correct: false, feedback: 'Internal audit policy details are an operational control matter for management, not front-line new-hire training content.' },
          { text: 'Past check fraud losses incurred by the financial institution', correct: false, feedback: "Historical loss figures aren't useful, actionable training content for a new teller's day-to-day responsibilities." },
        ],
      },
      {
        id: 50, title: 'How CDD Should Be Implemented',
        question: "A compliance officer at a small community bank has been asked to review existing customer onboarding policies and procedures to ensure they adequately address anti-money laundering risks. How should customer due diligence be implemented?",
        options: [
          { text: 'With an annual compliance review and approval of customers', correct: false, feedback: "A single annual check-in doesn't reflect the ongoing, dynamic nature CDD is supposed to have." },
          { text: 'With a one-time event conducted at initial customer onboarding', correct: false, feedback: "Treating CDD as a one-time onboarding exercise ignores the fact that customer risk and behaviour can change over the life of the relationship." },
          { text: "As an ongoing activity that may vary commensurate with the risk profile of the customer", correct: true, feedback: "Correct. CDD isn't a single event — it's continuous and risk-based, meaning the intensity and frequency of review should scale with how risky the customer actually is, from light-touch for low-risk customers to frequent, in-depth review for higher-risk ones." },
          { text: 'As applicable to customers that pose higher money laundering or terrorist financing risk', correct: false, feedback: "CDD applies to all customers at some level — it's the intensity that scales with risk, not whether it applies at all." },
        ],
      },
      {
        id: 51, title: 'Job Descriptions and AML Responsibility',
        question: "Findings from a regulatory examination report state that the job descriptions of personnel outside of the compliance department do not include references to anti-money laundering responsibilities. Which action should the firm take?",
        options: [
          { text: 'Update all job descriptions to include anti-money laundering responsibilities', correct: true, feedback: "Correct. A genuine culture of compliance means AML responsibility is embedded into how every relevant role is actually defined, not siloed to the compliance department alone — updating job descriptions makes that expectation explicit and formal for staff across the institution." },
          { text: 'Respond that only compliance personnel have anti-money laundering responsibilities', correct: false, feedback: "This directly contradicts the whole premise of an institution-wide AML culture — front-line and business staff have real AML responsibilities too." },
          { text: 'Send an email to all staff stating that personnel must observe the anti-money laundering policy', correct: false, feedback: "An email reminder doesn't formally embed the responsibility into how roles are actually defined and evaluated." },
          { text: 'Reply that a description of anti-money laundering responsibilities is included in the annual training', correct: false, feedback: "Training content doesn't substitute for the job description itself reflecting the expectation — the regulator's finding was specifically about the job descriptions." },
        ],
      },
      {
        id: 52, title: 'Reviewing Onboarding After a Peer Enforcement Action',
        question: "A compliance officer at a large financial institution has been tasked by senior management to lead a team in an internal review and potential revision of the institution's customer onboarding program following a regulatory enforcement action of another institution. Which step should the compliance officer perform first?",
        options: [
          { text: "Reviewing the institution's risk assessment", correct: true, feedback: "Correct. Before revising any specific onboarding procedure, the compliance officer needs to understand the institution's current risk profile as reflected in its risk assessment — that's the foundation everything else (training updates, EDD procedures, verification fixes) should be built on and measured against." },
          { text: 'Revising training materials for frontline staff', correct: false, feedback: "Updating training before understanding the actual risk picture risks training staff on the wrong priorities." },
          { text: 'Conducting enhanced due diligence on high risk customers', correct: false, feedback: "Jumping straight to EDD on existing customers skips the foundational step of understanding whether — and where — the onboarding program actually has gaps." },
          { text: 'Resolving substantive discrepancies in customer verification', correct: false, feedback: "Fixing individual verification discrepancies is a downstream fix, not the right starting point for a program-level review." },
        ],
      },
      {
        id: 53, title: 'Basel CDD — Corporate Account Opening',
        question: "What does the Basel Committee's Customer Due Diligence for Banks paper suggest that a bank needs to have in place when establishing an account for a corporate business entity?",
        options: [
          { text: 'An understanding of the structure of the company', correct: true, feedback: "Correct. Before opening a corporate account, a bank needs to genuinely understand the company's structure — its ownership, control, and organizational layout — since that's what makes it possible to identify the real beneficial owners and assess the actual risk behind the entity." },
          { text: 'A policy requiring all identified beneficial owners to undergo a national police check', correct: false, feedback: "A blanket criminal-record check on every beneficial owner isn't a standard Basel requirement — due diligence is risk-based, not a uniform background-check mandate." },
          { text: 'A process to ensure that the approval of senior management is obtained prior to opening the account', correct: false, feedback: "Senior management approval is reserved for higher-risk relationships (like PEPs), not a blanket requirement for every ordinary corporate account." },
          { text: "A fee structure that reflects the bank's costs in monitoring the risks associated with the entity's business activities", correct: false, feedback: "Pricing/fee structure is a commercial matter, not a CDD control Basel's guidance addresses." },
        ],
      },
      {
        id: 54, title: 'Leadership Oversight of New Products',
        question: "Since its last regulatory examination, a financial institution has aggressively grown by adding profitable new products and services. The institution has not historically received regulatory criticism regarding its anti-money laundering compliance program. However, a recent regulatory examination cited significant deficiencies in the anti-money laundering program that were attributed primarily to the lack of oversight by the institution's leadership in implementing adequate controls over the new products and services. Which area of internal control should leadership first address to correct the weaknesses in the program?",
        options: [
          { text: 'Anti-money laundering training', correct: false, feedback: "Training staff on controls that haven't yet been properly designed for the new products puts the cart before the horse." },
          { text: 'Anti-money laundering policy', correct: false, feedback: "Policy documents should reflect what the risk assessment says needs to be controlled — updating policy before understanding the actual new risk is premature." },
          { text: 'Money laundering risk assessment', correct: true, feedback: "Correct. The root cause here is that leadership didn't properly assess the risk introduced by the new products and services before rolling them out — fixing the risk assessment first is what should drive every other downstream fix, from policy to training to staffing." },
          { text: 'Anti-money laundering compliance staff', correct: false, feedback: "Adding or restructuring staff without first understanding the actual new risk exposure doesn't address the root cause identified in the exam findings." },
        ],
      },
      {
        id: 55, title: 'Stale Refresher Training', selectCount: 2,
        question: "The new compliance officer has reviewed the bank's anti-money laundering training program. The program consists of online training for all new employees within 30 days of hire date and annual refresher training to all employees, plus specialized training for higher-risk products and customers. Over the last year, there have been no regulatory changes and no new products or services introduced. The compliance officer wants to propose that the annual refresher training is still current and can be delivered unchanged to all employees. Which two critical pieces of information could be missed by taking this approach?",
        options: [
          { text: 'Any new trends, developments, or risks', correct: true },
          { text: "Results of the previous year's risk assessment", correct: false },
          { text: 'Changes to internal policies, procedures, and processes', correct: true },
          { text: 'Links to enforcement actions identifying violations in other financial institutions', correct: false },
        ],
        explanation: "Even without regulatory changes or new products, the threat landscape and the institution's own internal procedures can still evolve — new typologies emerge constantly, and internal policies get refined over the course of a year for reasons unrelated to regulation. Assuming 'no external change' means 'no training update needed' misses both of these internal, ongoing sources of change.",
      },
      {
        id: 56, title: 'Highest Unmitigated Risk From a Stale Assessment',
        question: "After review of the financial institution's enterprise-wide anti-money laundering risk assessment, the new compliance officer identifies several deficiencies that need attention. Which deficiency could lead to the highest potential for unmitigated risk?",
        options: [
          { text: 'The risk assessment is several years old and does not cover all current products and services', correct: true, feedback: "Correct. A risk assessment that's fallen years out of date and doesn't even cover current products means the institution has entire areas of its actual business running with no documented risk understanding or controls at all — a genuine, un-mitigated blind spot, worse than any of the other listed process inefficiencies." },
          { text: 'The risk assessment is revisited too frequently, thereby diverting critical resources from other compliance tasks', correct: false, feedback: "Reassessing too often is a resourcing inefficiency, not a source of unmitigated risk — if anything it means the assessment stays current." },
          { text: 'The risk assessment is managed by a different team from the previous assessment, therefore disrupting continuity of institutional knowledge', correct: false, feedback: "A change in the managing team is a continuity concern worth addressing, but it doesn't leave actual products or services uncovered by any risk analysis." },
          { text: 'The risk assessment does not anticipate potential risks even though the financial institution has no immediate plans involving those risks', correct: false, feedback: "Not anticipating risks that aren't currently relevant to the business is a reasonable scoping choice, not a genuine gap." },
        ],
      },
      {
        id: 57, title: 'Multi-Country Enterprise-Wide Program', selectCount: 3,
        question: "A compliance officer is tasked with implementing an enterprise-wide anti-money laundering program for a bank, which operates in multiple countries. Not all the bank's products and services are available in all countries. Which three factors should be considered as part of the approach?",
        options: [
          { text: 'The types of customers serviced by the bank', correct: true },
          { text: 'The customer onboarding platform that will be used', correct: false },
          { text: 'The extent of anti-money laundering regulations in the various countries', correct: true },
          { text: 'The anti-money laundering risk posed by the products and services offered by the bank', correct: true },
          { text: 'The amount of resources needed to implement the anti-money laundering program in the countries', correct: false },
        ],
        explanation: "A genuinely enterprise-wide program has to account for who the bank actually serves, what it actually sells them (and the risk that comes with it), and the regulatory landscape of every country it operates in — those three define the real risk picture. The specific onboarding technology platform and implementation resourcing are operational execution details, not factors that shape the risk-based design of the program itself.",
      },
      {
        id: 58, title: 'PEP Employee Review Red Flag',
        question: "An anti-money laundering officer is conducting employee reviews. Which employee action warrants enhanced due diligence?",
        options: [
          { text: "The teller reviews customer profiles and makes notations of personal information to reportedly become familiar with bank customers", correct: true, feedback: "Correct. A teller compiling personal notes on customers outside of any legitimate business purpose is an unusual and potentially concerning pattern — it can indicate the employee is gathering information for improper use, such as facilitating fraud or tipping off a customer, and warrants a closer look." },
          { text: 'The private banker has recently taken long vacations which caused staff members to fall behind in their work to help cover bank duties', correct: false, feedback: "This is actually the reverse of the classic 'avoiding vacation' red flag — someone who does take extended leave is generally less concerning, not more." },
          { text: 'The branch manager reviews the daily hold report and releases holds on non-cash items once the bank receives credit from the paying bank', correct: false, feedback: 'Releasing holds once payment has actually cleared is a normal, appropriate part of a branch manager\'s operational duties.' },
          { text: 'The bank chief executive officer lives in a lavish home and has requested the board to approve a membership payment at an exclusive country club', correct: false, feedback: "A board-approved perquisite for a CEO, disclosed and authorized through proper channels, is standard executive compensation practice, not a red flag in itself." },
        ],
      },
      {
        id: 59, title: 'Wolfsberg — Authorized Signatories', selectCount: 3,
        question: "The compliance officer for a private bank has been tasked with reviewing the procedure for authorized signatories on customer accounts to ensure it is in line with relevant Wolfsberg Anti-Money Laundering Principles for Private Banking. Which three statements from the procedure are in line with Wolfsberg?",
        options: [
          { text: 'Where the Authorized Signatory is not a lawyer or accountant, due diligence as to the source of funds and wealth of the Authorized Signatory should be undertaken', correct: false },
          { text: 'The responsible private banker must establish the identity of a holder of general powers over an account (e.g. a signatory for the account) and, as appropriate, verify that identity', correct: true },
          { text: 'Where due diligence has been satisfactorily completed on all authorized signers, the responsible private banker may reduce the due diligence performed on the account holder and/or beneficial owner', correct: false },
          { text: "The responsible private banker must obtain the necessary documentation establishing the authorized signer's authority to act on behalf of the account holder or beneficial owner (e.g. a Power of Attorney)", correct: true },
          { text: 'If an individual has signing authority over an account but does not act on a professional basis as a manager of funds, the responsible private banker must understand and document the relationship between that authorized signer, the account holder, and, if different, the beneficial owner of the account', correct: true },
        ],
        explanation: "Wolfsberg's principles require identifying and verifying anyone with general signing power, documenting their actual legal authority to act (like a Power of Attorney), and understanding the real relationship between a non-professional signatory and the account holder. Due diligence on the signatory should never come at the cost of reduced scrutiny on the account holder or beneficial owner — those are separate, non-substitutable checks.",
      },
      {
        id: 60, title: 'Correspondent Banking — Senior Management Approval',
        question: "Which action should financial institutions with cross-border correspondent banking activity be required to perform according to the Financial Action Task Force 40 Recommendations?",
        options: [
          { text: 'Gather a list of their politically exposed customers', correct: false, feedback: 'PEP identification is a separate, general CDD obligation — it is not the specific correspondent banking control FATF Recommendation 13 requires.' },
          { text: 'Identify natural persons who own or control more than 5%', correct: false, feedback: 'Beneficial ownership thresholds relate to general CDD requirements, not the specific correspondent banking control called for here.' },
          { text: 'Obtain senior management approval before establishing the relationship', correct: true, feedback: "Correct. FATF Recommendation 13 specifically requires senior management sign-off before entering into a new correspondent banking relationship — reflecting how much risk these relationships can carry, since a single correspondent account can be a gateway for an entire respondent bank's customer base." },
          { text: "Obtain a third-party independent review of the respondent's anti-money laundering program", correct: false, feedback: "The correspondent bank must assess the respondent's AML controls itself, but there's no requirement for an independent third-party review specifically." },
        ],
      },
      {
        id: 61, title: 'Onboarding a New PEP Segment', selectCount: 2,
        question: "A financial institution has expanded its scope of services so that it is attracting the business of politically exposed persons (PEPs) who had previously never been part of the customer base. Which two courses of action should the compliance officer include in the institution's procedures for considering PEPs as customers?",
        options: [
          { text: 'Conduct enhanced ongoing monitoring of the business relationship', correct: true },
          { text: 'Expedite due diligence when a PEP is pre-approved by a member of senior management', correct: false },
          { text: 'Obtain appropriate senior management approval for establishing a business relationship with a PEP from a high-risk country', correct: false },
          { text: 'Take adequate measures to establish the source of wealth and source of funds which are involved in the business relationship or occasional transaction', correct: true },
        ],
        explanation: "Once PEPs become part of the customer base, the two non-negotiable procedures are ongoing enhanced monitoring for the life of the relationship, and genuinely establishing the source of wealth and funds involved — not just a one-time check. Senior management approval is a real requirement too, but specifically for higher-risk PEPs, not a blanket rule for all PEP relationships, and 'expediting' due diligence based on pre-approval defeats the purpose of EDD.",
      },
      {
        id: 62, title: 'Bypassing EDD',
        question: "Enhanced due diligence (EDD) may be bypassed for which situation?",
        options: [
          { text: "On-boarding a branch or majority-owned subsidiary of an EU or US financial institution located in a high-risk third country that fully complies with group-wide policies and procedures", correct: true, feedback: "Correct. When the entity being onboarded is itself a branch or majority-owned subsidiary of a well-regulated EU or US institution, and it fully complies with that institution's group-wide AML policies, the location-based risk is already substantially mitigated by the parent's own controls — allowing EDD to reasonably be bypassed in that narrow case." },
          { text: 'On-boarding a subsidiary in a high-risk country with a complex ownership structure of a long-standing and reputable customer based in the EU or US', correct: false, feedback: "A complex ownership structure in a high-risk country still carries real risk regardless of how long-standing or reputable the parent customer is — EDD would still be warranted here." },
          { text: 'On-boarding a casino headquartered in the EU or US that is part of an international hotel chain, provides less than 50% of overall revenue and that fully complies with group-wide policies and procedures', correct: false, feedback: 'Casinos remain an inherently higher-risk designated sector regardless of what share of a parent group\'s revenue they represent — EDD would still apply.' },
          { text: 'On-boarding a reputable Politically Exposed Person (PEP) from the EU onto the wealth management arm of a US financial institution (FI)', correct: false, feedback: "PEP status itself triggers EDD requirements regardless of reputation — EDD cannot be bypassed simply because a PEP is considered reputable." },
        ],
      },
      {
        id: 63, title: 'Understanding the Customer Risk Profile',
        question: "To understand if the customer operates in line with the firm's risk appetite for a specific industry segment, a financial institution (FI) must:",
        options: [
          { text: 'obtain the name and address, country identification number and date of birth of a non-customer who purchases a monetary instrument', correct: false, feedback: 'This describes a specific record-keeping requirement for non-customer monetary instrument purchases — it doesn\'t address building an understanding of an actual customer\'s risk profile.' },
          { text: 'obtain identifying information for beneficial owners through a completed certification form from the individual opening the account on behalf of the legal entity customer', correct: false, feedback: 'Beneficial ownership certification is part of onboarding a legal entity, but it doesn\'t by itself build the broader understanding of how the customer\'s activity should look relative to risk appetite.' },
          { text: "obtain sufficient customer information to understand the nature and purpose of customer relationships for the purpose of developing a customer risk profile", correct: true, feedback: "Correct. Genuinely understanding whether a customer fits the firm's risk appetite requires enough information about the actual nature and purpose of the relationship to build a real risk profile — not just identity data, but context about what the customer does and why they need the relationship." },
          { text: 'obtain the name, date of birth for an individual, address and identification number from each customer before opening the account', correct: false, feedback: 'This is basic identity verification (CIP) — necessary, but it doesn\'t on its own build the risk-profile understanding the question is asking about.' },
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
      {
        id: 7, title: 'Continuing SARs',
        question: "Under US Bank Secrecy Act rules, when should a financial institution file a 'continuing SAR' for ongoing suspicious activity?",
        options: [
          { text: 'Every 90 calendar days if suspicious activity is ongoing after the initial SAR — the continuing SAR should reference the original, describe activity developments, and include any new identifying information', correct: true, feedback: 'Correct. FinCEN guidance requires continuing SARs filed at 90-day intervals for ongoing suspicious activity. Each continuing SAR should cross-reference the prior filing date and capture the evolution of activity plus any new information about the subject. The 90-day clock runs from the date of the prior SAR — not from the original detection date.' },
          { text: 'Only if the customer\'s cumulative suspicious transaction volume exceeds $100,000 over the period', correct: false, feedback: 'The continuing SAR obligation is triggered by ongoing suspicious activity — not a cumulative dollar threshold. Smaller but persistent suspicious transactions require continuing SARs regardless of total volume.' },
          { text: 'Only if law enforcement specifically requests a follow-up report on the prior SAR', correct: false, feedback: 'Continuing SARs are an independent institutional obligation — not contingent on law enforcement requests. FIUs do not typically provide feedback on individual SARs, so waiting for a request would mean never filing continuing SARs.' },
          { text: 'Every 30 days — the same timeline as the initial SAR filing obligation', correct: false, feedback: '30 days is the initial SAR filing deadline from initial detection. Continuing SARs for ongoing activity are due every 90 calendar days — a different and longer interval.' },
        ],
      },
      {
        id: 8, title: 'Investigation Documentation',
        question: "Best practice in AML investigation documentation requires:",
        options: [
          { text: 'A contemporaneous, objective record of all investigative steps — including searches conducted, documents reviewed, internal escalations, customer contacts, MLRO decisions, and the detailed rationale for decisions to file or not file an SAR', correct: true, feedback: 'Correct. Investigation documentation serves multiple purposes: it demonstrates a systematic, good-faith inquiry; it supports the quality of any SAR filed; it provides evidence of compliance in the event of regulatory review; and it creates a record that law enforcement can use if the SAR generates an investigation. "If it isn\'t documented, it didn\'t happen" is a core AML compliance principle.' },
          { text: 'A brief single-paragraph summary written after the SAR decision, focused on the outcome', correct: false, feedback: 'Post-hoc summaries are insufficient — they cannot capture the decision-making process contemporaneously and are more susceptible to hindsight bias. Documentation must be ongoing throughout the investigation.' },
          { text: 'Retaining only the final SAR and the triggering transaction data — supporting investigation notes are not required', correct: false, feedback: 'Supporting investigation documentation is as important as the SAR itself. Regulators examining AML programmes look at the quality of investigation documentation, not just whether SARs were filed.' },
          { text: 'Destroying investigation records within 30 days of SAR filing to protect customer privacy', correct: false, feedback: 'SAR-related records must be retained for the period required by law — typically 5 years in the US (BSA), the UK (POCA), and Australia (AML/CTF Act). Destroying records earlier could be an obstruction offence.' },
        ],
      },
      {
        id: 9, title: '"Reasonable Grounds to Suspect"',
        question: "The standard 'reasonable grounds to suspect' for SAR/STR filing in most AML jurisdictions means:",
        options: [
          { text: 'Facts, activity, or information that would lead a reasonable, trained compliance professional to suspect ML/TF — not certainty or conclusive evidence of wrongdoing, but an objective assessment based on what is known', correct: true, feedback: 'Correct. "Reasonable grounds" is an objective standard — assessed from the perspective of a trained compliance professional, not from the individual officer\'s subjective feeling. This standard is deliberately set below certainty to ensure suspicious activity is reported early enough to be useful. Waiting for certainty would defeat the intelligence-gathering purpose of the STR regime.' },
          { text: 'Conclusive evidence of criminal activity sufficient to support a criminal prosecution', correct: false, feedback: 'If evidence reached prosecution standard, law enforcement would already be involved. The STR/SAR threshold is set much lower — at the level of suspicion, not proof. This is intentional: the FIU aggregates intelligence from many partial reports to build a complete picture.' },
          { text: 'A direct law enforcement tip-off confirming criminal activity before the institution is required to report', correct: false, feedback: 'Requiring law enforcement confirmation would fundamentally invert the intelligence flow. The STR regime exists precisely to provide law enforcement with leads — not to require law enforcement to first provide leads to institutions.' },
          { text: 'A purely subjective standard — if the compliance officer personally does not feel the activity is suspicious, no SAR is required regardless of the facts', correct: false, feedback: 'The subjective feeling of an individual officer is not the standard. "Reasonable grounds" requires an objective assessment — what a reasonable, trained professional would conclude given the same facts. This objectivity prevents personal bias from overriding what the evidence indicates.' },
        ],
      },
      {
        id: 10, title: 'Proactive vs Reactive SAR Filing',
        question: "A 'proactive' SAR filing is one where:",
        options: [
          { text: 'The compliance function independently identifies suspicious activity through its own transaction monitoring, CDD review, or staff alerts — without any prior law enforcement contact or external tip', correct: true, feedback: 'Correct. Proactive filing demonstrates that the institution\'s AML controls are functioning effectively. Reactive filing (in response to a law enforcement inquiry) suggests that external intelligence identified activity the institution\'s own controls missed. Regulators assess the ratio of proactive to reactive filings as an indicator of AML programme effectiveness.' },
          { text: 'A law enforcement officer contacts the institution and requests voluntary disclosure of a customer\'s records', correct: false, feedback: 'This describes a reactive or law enforcement-prompted disclosure. The institution has not independently identified the activity — it has responded to an external trigger.' },
          { text: 'A court order compels the institution to provide information to prosecutors about a specific customer', correct: false, feedback: 'Court-compelled disclosure is not an SAR — it is legally compelled production. An SAR is a voluntary intelligence disclosure to the FIU, separate from court-ordered document production.' },
          { text: 'A customer self-reports suspicious activity in their own account to the institution', correct: false, feedback: 'Customer self-reporting would trigger an investigation, but the SAR is filed based on the institution\'s own assessment — not because the customer reported it. The SAR filing decision remains with the compliance function.' },
        ],
      },
      {
        id: 11, title: 'MLRO Internal Escalation Role',
        question: "The primary role of the MLRO in the internal suspicious activity reporting process is to:",
        options: [
          { text: 'Receive internal disclosures from staff, independently assess whether reasonable grounds to suspect exist, make the decision to file or not file an external SAR, and document the full rationale for every decision', correct: true, feedback: 'Correct. The MLRO acts as a central clearing-house and quality-control function for suspicious activity. Staff who have concerns internally report to the MLRO — not directly to the FIU. The MLRO reviews all evidence, applies the reasonable grounds standard, and makes the external filing decision. This centralisation ensures consistency and quality in SAR filings.' },
          { text: 'Automatically file an external SAR for every internal staff report received, without independent assessment', correct: false, feedback: 'Automatic filing without assessment would flood FIUs with low-quality intelligence and undermine the credibility of the institution\'s SAR programme. The MLRO\'s role is to assess — not to act as a mechanical pass-through.' },
          { text: 'Discuss the suspicious activity concerns directly with the customer before deciding whether to file', correct: false, feedback: 'Discussing ML suspicions with the customer risks tipping off the subject. Any customer outreach for a legitimate explanation must be carefully managed before suspicion crystallises — not after an internal SAR decision has been made.' },
          { text: 'Refer all internal disclosures to the CEO for final filing decisions to ensure board-level accountability', correct: false, feedback: 'SAR filing decisions are the MLRO\'s statutory responsibility. Referring to the CEO creates a conflict of interest (the CEO may have commercial relationships with the subject) and removes the MLRO\'s independence.' },
        ],
      },
      {
        id: 12, title: 'Tipping Off — Permitted Exceptions',
        question: "Which of the following is NOT considered a prohibited tipping-off disclosure under most AML frameworks?",
        options: [
          { text: 'Informing a customer that their account has a "security hold" without disclosing the existence of an SAR, investigation, or the basis of any suspicion — a neutral account restriction notification does not constitute tipping off', correct: true, feedback: 'Correct. The tipping-off prohibition targets disclosures that specifically reveal the SAR filing, the investigation, or the basis of suspicion. A neutral statement that an account is under a security review — without revealing that an SAR has been filed — does not cross the line. Some jurisdictions also allow disclosure between group entities for AML purposes.' },
          { text: 'Telling a customer that their transactions were reviewed for suspicious activity patterns', correct: false, feedback: 'Disclosing that transactions were reviewed for suspicious activity reveals the investigation — this is tipping off, even if the SAR filing itself is not mentioned.' },
          { text: 'Advising the customer\'s solicitor that an SAR was filed so they can prepare a legal response', correct: false, feedback: 'Disclosing an SAR filing to the subject\'s legal adviser is tipping off — regardless of the apparent legitimacy of the purpose. The prohibition extends to indirect disclosures.' },
          { text: 'Warning a business partner of the SAR subject that law enforcement is reviewing the subject\'s account', correct: false, feedback: 'This is a tipping-off disclosure — it reveals an investigation to a third party connected to the subject. The prohibition extends to third parties who might relay the information to the subject.' },
        ],
      },
      {
        id: 13, title: 'Asset Freezing vs Forfeiture',
        question: "The legal distinction between asset freezing and asset forfeiture is:",
        options: [
          { text: 'Freezing is a provisional measure to prevent dissipation of assets pending investigation or trial — forfeiture is a final legal outcome transferring ownership of criminal property to the state, typically following conviction or civil proceedings', correct: true, feedback: 'Correct. Freezing preserves the status quo — it does not change ownership. It is time-limited and subject to legal challenge. Forfeiture permanently transfers ownership. Civil (non-conviction-based) forfeiture is increasingly used internationally — it requires only a civil standard of proof rather than criminal conviction, which is significant in cases where the subject cannot be prosecuted.' },
          { text: 'Freezing applies only to funds in financial accounts; forfeiture applies only to physical property such as vehicles and real estate', correct: false, feedback: 'Both freezing and forfeiture apply to all asset types — financial accounts, real estate, vehicles, luxury goods, and virtual assets. The distinction is temporal and legal (provisional vs. final), not asset-specific.' },
          { text: 'Forfeiture is an administrative action by the regulator; freezing always requires a court order', correct: false, feedback: 'In practice, both freezing and forfeiture typically involve court orders, though administrative freezing powers exist in some jurisdictions for sanctions purposes. Civil forfeiture involves court proceedings — it is not a purely administrative action.' },
          { text: 'The terms are interchangeable under most international AML and criminal law frameworks', correct: false, feedback: 'They are meaningfully distinct: freezing is a provisional precautionary measure; forfeiture is a final transfer of ownership. Confusing them is a significant error in any criminal law or AML context.' },
        ],
      },
      {
        id: 14, title: 'Mutual Legal Assistance Treaties (MLATs)',
        question: "Mutual Legal Assistance Treaties (MLATs) are primarily used in cross-border financial crime investigations to:",
        options: [
          { text: 'Enable formal government-to-government requests for evidence gathering — including bank records, witness statements, and asset restraint — in jurisdictions where informal cooperation is insufficient or legally compelled production is required', correct: true, feedback: 'Correct. MLATs provide the formal legal framework for cross-border evidence requests between law enforcement and justice authorities. Without an MLAT, a country cannot compel another jurisdiction\'s banks to produce records — they can only request through informal channels. MLAT requests take time (often months) but provide legally admissible evidence that informal sharing cannot.' },
          { text: 'Allow financial institutions to exchange customer data directly across borders without government involvement', correct: false, feedback: 'MLATs operate between governments — specifically between law enforcement and justice authorities. Financial institutions are the subject of MLAT requests; they do not access or invoke MLAT mechanisms directly.' },
          { text: 'Replace the need for national courts to approve disclosure orders in cross-border investigations', correct: false, feedback: 'MLAT responses typically still require domestic court or authority authorisation in the requested country. They are not a shortcut around judicial oversight — they are the formal channel for requesting that another jurisdiction apply its own legal process.' },
          { text: 'Apply exclusively to terrorism financing investigations — ML investigations use Interpol red notices instead', correct: false, feedback: 'MLATs apply to the full range of serious crime including ML, corruption, fraud, and tax evasion. Interpol notices are law enforcement intelligence tools — not a substitute for formal evidence-gathering through MLATs.' },
        ],
      },
      {
        id: 15, title: 'SAR Quality Metrics',
        question: "FIUs and supervisors typically assess SAR quality based primarily on:",
        options: [
          { text: 'Actionability — whether the SAR contains sufficient detail, context, and transaction specifics to support intelligence analysis or law enforcement investigation; including narrative clarity, identifying information completeness, and accuracy of transaction records', correct: true, feedback: 'Correct. A high-quality SAR enables the FIU analyst to understand the activity, identify the subjects, and connect it to other intelligence. Key quality indicators: specific dates, amounts, counterparties, and account numbers; a clear explanation of why the activity is suspicious; description of the detection mechanism; and documentation of any customer explanation and why it was rejected.' },
          { text: 'Volume — institutions that file more SARs are automatically considered more effective AML reporters', correct: false, feedback: 'High SAR volume can indicate strong monitoring capability or, equally, poor alert quality requiring mass filing of low-value reports. Quantity without quality is counterproductive. FIUs are increasingly focused on SAR quality metrics rather than volume.' },
          { text: 'Processing speed — SARs filed within 24 hours of suspicion formation are always considered highest quality', correct: false, feedback: 'Speed is important (statutory deadlines must be met) but a hastily filed, superficial SAR is less valuable than a carefully investigated, well-documented report filed closer to the deadline. Quality and timeliness are both required — but quality is the primary intelligence metric.' },
          { text: 'Whether the reported suspicious activity subsequently resulted in a criminal conviction', correct: false, feedback: 'Convictions are not a SAR quality measure — many SARs support investigations that do not result in prosecutions (for legitimate reasons), and conviction timelines are often years after the SAR was filed. SAR quality is assessed at filing, not at the end of criminal proceedings.' },
        ],
      },
      {
        id: 16, title: 'Whistleblower Protections',
        question: "AML whistleblower protection laws typically protect employees who:",
        options: [
          { text: 'Report suspected ML, TF, or AML compliance failures in good faith to internal compliance functions, regulators, FIUs, or other competent authorities — protecting them against retaliation such as dismissal, demotion, or harassment', correct: true, feedback: 'Correct. Whistleblower protection is essential to effective AML compliance because employees often have the earliest visibility of suspicious activity or compliance failures. Protections exist in many jurisdictions: the US FinCEN whistleblower programme (established 2022 under the AML Act), the EU Whistleblower Protection Directive (2019), the UK, and Australia. Protections typically cover both internal and external reporting channels.' },
          { text: 'Directly file personal SARs with the FIU alleging financial crime by their employer — bypassing internal reporting channels', correct: false, feedback: 'Individual employees are generally not authorised to file SARs directly with the FIU — that is the MLRO\'s responsibility. Whistleblower protection covers reporting concerns through legitimate channels (internal compliance, regulator, FIU) — not bypassing the SAR framework.' },
          { text: 'Disclose confidential SAR information to journalists or media outlets to publicise financial crime', correct: false, feedback: 'SAR confidentiality is statutory — disclosing SAR contents to the media violates AML law regardless of the whistleblower\'s intent. Whistleblower protections do not override the tipping-off and SAR confidentiality prohibitions.' },
          { text: 'Unilaterally refuse to follow AML procedures they disagree with on ethical grounds — without reporting the concern', correct: false, feedback: 'Refusing to follow AML procedures without reporting the concern is not whistleblowing — it is non-compliance. Whistleblower protection is for those who report concerns through proper channels, not those who simply opt out of compliance obligations.' },
        ],
      },
      {
        id: 17, title: 'Customer Outreach During Investigation',
        question: "When is customer outreach (contacting the customer for an explanation) appropriate during a suspicious activity investigation?",
        options: [
          { text: 'Before suspicion fully crystallises — to obtain a plausible explanation that could resolve the concern — but outreach must be managed carefully to avoid tipping off, must be documented including any explanation received, and must not occur after an SAR has been filed on the specific activity', correct: true, feedback: 'Correct. Early-stage customer outreach (during the fact-finding phase) is a legitimate investigative step — for example, asking a business customer about an unusual high-value deposit. However, outreach becomes tipping off if it reveals the suspicion of ML/TF or discloses that an SAR has been filed. A credible customer explanation that is documented and assessed can avoid unnecessary SAR filings; an implausible explanation strengthens the suspicion.' },
          { text: 'Customer outreach is prohibited at all stages of a suspicious activity investigation — any contact creates tipping-off risk', correct: false, feedback: 'A blanket prohibition on customer outreach is not legally required and would prevent institutions from obtaining legitimate explanations that resolve apparent suspicious activity. The key is that outreach must not cross into tipping off.' },
          { text: 'Outreach is required before any SAR can be filed — institutions must document a customer explanation before filing is legally valid', correct: false, feedback: 'There is no legal requirement to contact the customer before filing an SAR. In many cases, early contact would be inappropriate — particularly where the suspicion relates to a serious offence or where there is a risk the customer would flee or dissipate assets.' },
          { text: 'Outreach can be conducted freely by front-line staff at any stage without compliance involvement', correct: false, feedback: 'Front-line-only outreach without compliance involvement creates tipping-off risk. Any outreach during a suspicious activity review should involve the compliance function to ensure questions are appropriately framed and responses properly documented and assessed.' },
        ],
      },
      {
        id: 18, title: 'Declination vs Exit vs SAR',
        question: "When a prospective customer presents suspicious activity indicators during onboarding (before any account is opened), the institution's primary obligations are to:",
        options: [
          { text: 'Decline the relationship — and separately assess whether the suspicious indicators meet the threshold for SAR/STR filing, since declining a customer does not discharge the reporting obligation if reasonable grounds to suspect ML/TF exist', correct: true, feedback: 'Correct. These are two separate obligations that arise simultaneously. The onboarding refusal manages the institution\'s own risk exposure. The SAR/STR filing fulfils the regulatory reporting obligation. The error many institutions make is treating declination as a substitute for reporting. Some jurisdictions explicitly require STR filing even for refused business where suspicion arose during the onboarding attempt.' },
          { text: 'Accept the customer and immediately file an SAR — only active customers can be the subject of SAR filings', correct: false, feedback: 'Many jurisdictions require STR/SAR filing for attempted transactions — not just completed ones. Prospective customers who present suspicion during onboarding can and should be the subject of an SAR without the institution accepting them.' },
          { text: 'Decline the customer — no SAR is required because no financial relationship was established', correct: false, feedback: 'This is a common compliance misconception. The SAR obligation is triggered by suspicion of ML/TF — not by the completion of a financial relationship. The attempt to establish a relationship under suspicious circumstances can independently trigger reporting.' },
          { text: 'Refer the prospective customer to another institution — this transfers AML responsibility to the new institution', correct: false, feedback: 'Referring a suspicious prospective customer to another institution could facilitate ML. The obligation is to decline and report — not to redirect suspicious customers elsewhere.' },
        ],
      },
      {
        id: 19, title: 'Cross-Border SAR Cooperation',
        question: "When a domestic FIU receives an SAR involving suspicious cross-border activity linked to a foreign jurisdiction, it may:",
        options: [
          { text: 'Analyse the intelligence internally and, where appropriate, share it spontaneously or on request with the relevant foreign FIU through the Egmont Secure Web (ESW) — enabling a coordinated international intelligence picture without the formality and delay of MLAT requests', correct: true, feedback: 'Correct. The Egmont Group\'s Secure Web allows FIU-to-FIU intelligence exchange much faster than formal MLAT processes. "Spontaneous" sharing — proactively forwarding intelligence without a specific request — is an important Egmont principle. If an FIU analyses a SAR and identifies a foreign dimension, it can proactively notify the relevant foreign FIU, significantly accelerating international financial crime detection.' },
          { text: 'Automatically forward the SAR in full to Interpol for immediate law enforcement response', correct: false, feedback: 'FIUs share intelligence with each other (via Egmont) — not typically with Interpol. FIU intelligence is subject to use limitations. Law enforcement bodies receive disseminated intelligence from FIUs through national channels — not direct SAR transfers to Interpol.' },
          { text: 'Request foreign regulatory approval before analysing any SAR data with international dimensions', correct: false, feedback: 'FIUs are empowered to analyse their own national SAR data without foreign regulatory approval. The analysis phase is domestic — sharing the output of that analysis is the step that involves foreign FIUs.' },
          { text: 'Disclose the SAR contents directly to the foreign bank that is the counterparty to the suspicious transaction', correct: false, feedback: 'Financial institutions — even foreign ones — cannot receive SAR data. SARs are strictly confidential. FIUs share intelligence with other FIUs and disseminate it to law enforcement through national channels.' },
        ],
      },
      {
        id: 20, title: 'Retrospective SAR Filing',
        question: "A financial institution discovers historical AML control deficiencies that may have allowed suspicious transactions to go unreported. The appropriate response is:",
        options: [
          { text: 'Conduct an internal lookback review to assess the scope of missed reporting, file retrospective SARs for transactions meeting the suspicion threshold, remediate the control gaps, and consider voluntary self-disclosure to the regulator — which typically results in more favourable regulatory outcomes than regulator-discovered deficiencies', correct: true, feedback: 'Correct. Self-remediation and voluntary disclosure are consistently recognised as mitigating factors in regulatory enforcement. The lookback review establishes the scope of any historical SAR filing failures. Retrospective SARs can be filed (with a notation that they are retrospective) and may still have intelligence value. Voluntary disclosure demonstrates good faith and a strong compliance culture, which regulators credit in enforcement decisions.' },
          { text: 'Do nothing — retrospective SAR filing for historical transactions is not permitted under BSA or international AML regulations', correct: false, feedback: 'Retrospective SAR filing is permitted and expected where historical suspicious activity was missed due to control failures. FinCEN and AUSTRAC have both addressed this in guidance — there is no prohibition on late or retrospective SARs.' },
          { text: 'Immediately close all potentially affected accounts without documentation or regulatory reporting', correct: false, feedback: 'Unexplained mass account closures would be a significant red flag to regulators and potentially harmful to customers who have not been found to be engaged in wrongdoing. Closing accounts without a compliance framework is itself a regulatory concern.' },
          { text: 'Request a formal regulatory waiver before filing any retrospective SARs to avoid self-incrimination', correct: false, feedback: 'No formal waiver is required before filing retrospective SARs. The institution\'s SAR-filing obligation extends to historical transactions meeting the suspicion threshold. The institution should file and simultaneously engage with the regulator on the overall control deficiency.' },
        ],
      },
      {
        id: 21, title: 'Investigating Mule Accounts', selectCount: 3,
        question: "When investigating an AML event, which techniques would be used to investigate suspected mule accounts?",
        options: [
          { text: 'Reconcile the stated purpose of the account with actual transaction history and compare with peer groups', correct: true },
          { text: 'Determine if the suspected accounts are being accessed by a common person, telephone number, or device', correct: true },
          { text: 'Contact the appropriate law enforcement agency and report the account activity', correct: false },
          { text: 'Review the account history and determine if there are previous payments to charity accounts', correct: false },
          { text: 'Establish the frequency with which funds are moved in and out of the accounts', correct: true },
        ],
        explanation: "Mule account analysis is internal investigative work before any escalation: checking whether the account's actual activity matches its stated purpose, spotting shared access points (same device/phone/person) across seemingly unrelated accounts, and looking at how quickly funds pass through. Contacting law enforcement is a later escalation step, not an investigative technique, and charity payment history isn't a recognised mule indicator.",
      },
      {
        id: 22, title: 'Law Enforcement Request to Keep Account Open', selectCount: 3,
        question: "Which steps should a financial institution (FI) take after receiving a request from law enforcement to keep an account open due to a criminal investigation?",
        options: [
          { text: 'Inform the customer that the account is under investigation by law enforcement', correct: false },
          { text: 'Ask for written documentation of the request', correct: true },
          { text: 'Freeze the account to prevent the customer from transferring the funds out', correct: false },
          { text: 'Maintain documentation of such requests for at least five years after the request has expired', correct: true },
          { text: 'Ensure that the request indicates the duration for the request', correct: true },
        ],
        explanation: "The institution's obligations here are procedural and record-keeping ones: get the request in writing, make sure it specifies how long it applies for, and retain that documentation well after it expires. Telling the customer would be tipping off, and freezing the account defeats the entire purpose of the request — law enforcement specifically wants activity to continue so they can keep watching it.",
      },
      {
        id: 23, title: 'Cooperating With a Law Enforcement Investigation', selectCount: 2,
        question: "A financial institution (FI) is being investigated for possible money laundering. When cooperating with law enforcement agencies, which additional steps should the FI ensure are taken?",
        options: [
          { text: 'Centralized control is maintained over all requests and responses to ensure completeness and timely responses', correct: true },
          { text: 'Make employees, including corporate officers, unavailable for interviews and refuse documents upon receipt of a subpoena', correct: false },
          { text: 'Subpoenas and other information requests should be reviewed by senior management and an investigations group or counsel', correct: true },
          { text: 'Address the document destruction policy to ensure the relevant documents are destroyed', correct: false },
          { text: 'Inquiries from the media are not answered directly, but rather are addressed by replying, "No comment."', correct: false },
        ],
        explanation: "Good cooperation is organized cooperation: routing everything through one central point so responses stay complete and consistent, and having senior management/counsel review requests before they're actioned. Making staff unavailable or refusing a valid subpoena is obstruction, and destroying documents once an investigation is known is a serious offence in its own right, regardless of any general retention policy.",
      },
      {
        id: 24, title: 'How Law Enforcement Obtains Documentation', selectCount: 2,
        question: "How should law enforcement obtain documentation from an institution when suspicious activity was identified?",
        options: [
          { text: 'Request copies of the relevant documents from the accountable institution', correct: true },
          { text: 'Pay an employee of the accountable institution to make copies of the documents', correct: false },
          { text: 'Request a Financial Intelligence Unit (FIU) share copies of suspicious transaction reports', correct: false },
          { text: 'Request the documents from the FIU', correct: false },
          { text: 'Acquire a search warrant to obtain the documents', correct: true },
        ],
        explanation: "The two legitimate routes are a direct, lawful request to the institution itself, or a search warrant when compulsory production is needed. FIUs hold analytical intelligence, not the institution's underlying records, so they aren't the source for the documents themselves — and paying an employee to hand over records outside proper channels is a serious integrity breach, not a legitimate investigative method.",
      },
      {
        id: 25, title: 'Responding to a Search Warrant', selectCount: 2,
        question: "An AML specialist at a financial institution (FI) is presented with a search warrant. Which actions should be taken to comply with the search?",
        options: [
          { text: 'Remember what items the agents have seized and taken from the premises', correct: false },
          { text: 'Leave the premises to allow the agents to conduct the search', correct: false },
          { text: 'Obtain a copy of the warrant or photocopy the original warrant', correct: true },
          { text: 'Record the names and affiliations of the agents who conduct the search', correct: true },
          { text: 'Proactively ask the agents as many questions as time allows', correct: false },

        ],
        explanation: "Compliance with a search warrant means creating a clear contemporaneous record of what authority was exercised and by whom — getting a copy of the warrant itself and logging the identities of the agents present. Staff shouldn't leave (someone from the institution should observe the search) or try to interrogate the agents about the investigation's substance — that's a matter for counsel, not the AML specialist on the floor.",
      },
      {
        id: 26, title: 'Events That Trigger an AML Investigation', selectCount: 3,
        question: "Typical events to identify and investigate potential AML activities include:",
        options: [
          { text: 'blocked transactions involving individuals included in the OFAC SDN list', correct: false },
          { text: 'subpoenas requesting information for civil cases', correct: false },
          { text: 'internal tips from employees of the bank about potential suspicious activity', correct: true },
          { text: 'requests from law enforcement agencies', correct: true },
          { text: 'alerts triggered by the automated AML monitoring system', correct: true },
          { text: 'accounts going to dormant status', correct: false },
        ],
        explanation: "The three real triggers for opening an AML investigation are the ones that actually surface suspicion: an internal tip from staff, an external law enforcement request, or a system-generated monitoring alert. A blocked OFAC transaction is a sanctions compliance action rather than an ML investigation trigger, a civil-case subpoena is unrelated to AML suspicion, and an account simply going dormant is not by itself a red flag.",
      },
      {
        id: 27, title: 'Notified of a FIU Investigation', selectCount: 2,
        question: "The AML compliance officer of a financial institution (FI) has been advised that the institution is being investigated by the country's financial intelligence unit (FIU). What should the AML compliance officer do?",
        options: [
          { text: 'Monitor the progress of the investigation by keeping clear records', correct: true },
          { text: 'Share investigation results with other financial institutions to help them prepare', correct: false },
          { text: 'Send an informative communication to all employees about the investigation', correct: false },
          { text: 'Provide all information to the FIU as soon as possible to avoid delays', correct: false },
          { text: 'Inform senior leadership and the board of the investigation', correct: true },
        ],
        explanation: "When the institution itself is under investigation, the response is internal governance, not outreach: keep clear records of what's happening, and make sure senior leadership and the board are informed given the potential business impact. Broadcasting the investigation to all staff or to other institutions breaches confidentiality, and 'as soon as possible' isn't the standard — information should still go through proper legal review before release.",
      },
      {
        id: 28, title: 'Investigating a Large Deposit Alert', selectCount: 3,
        question: "A bank's transaction surveillance system triggers an alert for a deposit of $250,000 into a client's account. According to the bank's KYC information, the client works for a financial advisory firm and earns approximately $100,000 per year. Which actions should be taken?",
        options: [
          { text: 'File the suspicious transaction immediately to the financial intelligence unit', correct: false },
          { text: "Review the transaction background in the bank's transaction platform", correct: true },
          { text: 'Review the alert if the deposit is made in cash', correct: false },
          { text: 'Discard the alert as a false positive hit', correct: false },
          { text: 'Contact the client advisor to learn if he has any insight on the transaction background', correct: true },
          { text: 'Request information and documentation from the client on the background of the transaction', correct: true },
        ],
        explanation: "A deposit well above the customer's known income needs investigation, not an immediate filing or an automatic dismissal: pull the transaction's context internally, ask the relationship manager what they know, and go to the client directly for an explanation and supporting documentation. Only after that fact-finding is complete would there be enough basis to either close the alert or escalate to an SAR/STR.",
      },
      {
        id: 29, title: 'Foreign Law Enforcement — Wanted Client', selectCount: 2,
        question: "The law enforcement agency (LEA) of a foreign jurisdiction contacts a financial institution (FI) regarding one of the FI's clients. The LEA advises that the client is currently wanted for prosecution as a result of a series of human trafficking charges. What should the FI do?",
        options: [
          { text: 'Comply immediately with the foreign jurisdiction and turn over all client information', correct: false },
          { text: 'Inform the local LEA and regulator of the request, for awareness', correct: true },
          { text: 'Review the client\'s activity, determine if suspicious activity exists, and report accordingly', correct: true },
          { text: 'Advise the LEA that the government needs to be contacted for extradition', correct: false },
          { text: "Close the client's accounts immediately to avoid any undue risk", correct: false },
        ],
        explanation: "A direct request from a foreign LEA doesn't bypass the FI's own domestic process — it should be routed through the proper local channels (informing local authorities/the regulator) and it should trigger the FI's own review of the client's activity to determine whether a domestic SAR/STR is now warranted. Handing over information directly to a foreign agency, or closing accounts unilaterally, skips the legal process that's supposed to govern cross-border requests.",
      },
      {
        id: 30, title: 'Regulatory Actions for AML Program Failure', selectCount: 2,
        question: "The regulators of a US financial institution find that the institution has failed to establish and maintain a reasonably designed AML program. Which regulatory actions should be taken?",
        options: [
          { text: 'Cease and desist order', correct: true },
          { text: 'Obtain additional license', correct: false },
          { text: 'Matter Requiring Attention (MRA)', correct: true },
          { text: 'Criminal penalties', correct: false },
        ],
        explanation: "For a program deficiency (as opposed to proven willful misconduct), a regulator's toolkit typically starts with supervisory and enforcement actions — a formal Matter Requiring Attention demanding remediation, escalating to a cease-and-desist order if it isn't fixed. Criminal penalties require proof of willful violations, a much higher bar than a program design deficiency, and 'obtaining an additional license' isn't a regulatory sanction at all.",
      },
      {
        id: 31, title: 'Roles of a Government FIU', selectCount: 3,
        question: "What are the roles of a government Financial Intelligence Unit (FIU)?",
        options: [
          { text: 'Investigate and, where appropriate, prosecute all suspicious transaction and suspicious activity reports received from reporting institutions', correct: false },
          { text: 'Analyze all suspicious transaction and suspicious activity reports received from reporting institutions or obliged institutions', correct: true },
          { text: "Disseminate analysis of suspicious transaction and suspicious activity reports to foreign judicial systems to enhance their AML/CFT investigations and prosecutions", correct: false },
          { text: 'Disseminate the analysis of suspicious transaction and suspicious activity reports to local law enforcement agencies and foreign FIUs to combat money laundering', correct: true },
          { text: 'Receive reports of suspicious transactions and suspicious activities from reporting institutions or obliged institutions', correct: true },
        ],
        explanation: "An FIU's core function is receive → analyze → disseminate: taking in SARs/STRs, analyzing them for value, and passing actionable intelligence on to domestic law enforcement or partner FIUs. It does not prosecute — that stays with law enforcement/judicial authorities — and it disseminates to other FIUs and domestic agencies, not directly to a foreign judicial system.",
      },
      {
        id: 32, title: 'Investigating Unusual Transactions', selectCount: 3,
        question: "Which practices should be considered when investigating unusual transactions and activities?",
        options: [
          { text: 'Focusing primarily on quantitative metrics, such as transaction amounts', correct: false },
          { text: 'Evaluating the transactions by cross-referencing with known external factors, such as market trends or recent news events', correct: true },
          { text: "Discussing with the responsible relationship manager, who may have insights into the customer's behavior or the nature of the transactions", correct: true },
          { text: 'Utilizing a risk-based approach to determine the level of scrutiny required for different types of transactions', correct: true },
          { text: 'Prioritizing automated alerts over manual reviews to streamline the investigation process', correct: false },
        ],
        explanation: "A sound investigation looks beyond the raw numbers: checking transactions against real-world context (news, market events), talking to the people who actually know the customer, and applying a risk-based level of scrutiny rather than a one-size-fits-all check. Fixating purely on transaction size, or letting automation replace manual judgment entirely, both miss context a human investigator would catch.",
      },
      {
        id: 33, title: 'Investigating a Cross-Border Correspondent Payment', selectCount: 3,
        question: "An international bank is investigating a payment requested by one of its correspondent relationships that generated an alert in the automated transaction monitoring system. The payment originated from a corporation located in Hong Kong, and the final beneficiary is an individual located in New York. Which steps should the bank take first to address the alert?",
        options: [
          { text: 'Call the receiving individual to review identity verification documents', correct: false },
          { text: 'Confirm that neither the beneficiary nor the originator are sanctioned parties', correct: true },
          { text: 'Request supporting documents, including invoices and contracts, to confirm the purpose of the payment', correct: true },
          { text: 'Check for negative news in public sources on the sender and receiver', correct: true },
          { text: 'Send a 314(b) request to the corporation\'s bank in Hong Kong', correct: false },
        ],
        explanation: "The first-line checks are all things the investigating bank can do itself: confirm neither party is sanctioned, gather documentation supporting the stated business purpose, and screen both parties against adverse media. Contacting the ultimate beneficiary directly, or reaching out to a foreign correspondent's bank via 314(b), are appropriate later steps once the internal review has established there's a genuine reason to escalate.",
      },
      {
        id: 34, title: 'Investigating Patterns Across Multiple Businesses', selectCount: 2,
        question: "Which techniques would be most efficient for a complex investigation of unusual patterns of activity involving multiple businesses, triggered by an automated monitoring system alert?",
        options: [
          { text: 'Perform a control and ownership assessment of the businesses involved, using the information available in the client files', correct: true },
          { text: 'Contact local law enforcement and request that they assist in the analysis and investigation', correct: false },
          { text: 'Contact the account manager and ask for the reasons behind the patterns of activity highlighted in the AML alerts', correct: true },
          { text: 'Review the information presented in the automated monitoring system\'s alert description and decline any future transactions', correct: false },
          { text: 'Use social media platforms to connect with the businesses and request details about the account activity', correct: false },
        ],
        explanation: "The efficient first moves are entirely internal: check whether the businesses share common control or ownership using what's already on file, and get the account manager's read on the pattern. Looping in law enforcement before the internal review is complete is premature, and reaching out via social media, or simply blocking future transactions without investigating, are neither appropriate nor effective.",
      },
      {
        id: 35, title: 'Employee Red Flags Before a Resignation', selectCount: 2,
        question: "An employee in a corporation's finance department hears news of an internal investigation into potential fraud within the company, quits her job, and disappears. If they had been observed before her resignation, which characteristics of the employee would have been considered red flags?",
        options: [
          { text: 'The employee was constantly evasive about the reasons for leaving her previous corporate finance job', correct: true },
          { text: 'The employee was originally from a high-risk jurisdiction', correct: false },
          { text: 'The employee had friends in high-risk industries', correct: false },
          { text: 'The employee had a lavish lifestyle for her income', correct: true },

        ],
        explanation: "Both real red flags are behavioural and financial: being evasive about her own employment history (a vetting red flag), and living beyond what her salary could support (a classic insider-risk indicator). Where someone is originally from, or who their friends are, aren't legitimate red flags — using them would amount to profiling rather than genuine risk assessment.",
      },
      {
        id: 36, title: 'SAR Supporting Documentation', selectCount: 2,
        question: "According to FinCEN, when a financial institution (FI) identifies a suspicious activity that necessitates suspicious activity report (SAR) filing, the SAR supporting documentation should:",
        options: [
          { text: 'have written policies and procedures to maintain supporting documentation', correct: true },
          { text: 'always be limited to account name, account details, and transaction records', correct: false },
          { text: 'be saved in a single separate file with hard copies stored in a fireproof cabinet', correct: false },
          { text: 'include all documents or records that assisted the FI in making the determination that the activity required a filing', correct: true },
        ],
        explanation: "The two real requirements are having documented policies governing how supporting documentation is kept, and retaining everything that actually informed the SAR decision — not just a fixed, narrow set of account records. There's no FinCEN requirement dictating a specific physical storage method like a single fireproof cabinet.",
      },
      {
        id: 37, title: 'Developments That Trigger an Internal Investigation', selectCount: 3,
        question: "What are three developments that should cause a financial institution to conduct an internal investigation?",
        options: [
          { text: 'When the institution receives a grand jury subpoena with regard to transactions that have occurred within several accounts at the institution', correct: true },
          { text: 'When several employees of the institution alert senior management or the compliance officer that there are some suspicious transactions within an account', correct: true },
          { text: "When the institution's auditor identifies an omission in the AML policy", correct: false },
          { text: 'When a small local business starts engaging in overseas activity involving numerous, unexplained wire transfers', correct: true },
        ],
        explanation: "A grand jury subpoena, multiple internal staff flagging the same account, and a small local business suddenly generating unexplained international wire activity are all live signals that something specific needs investigating. An audit finding a gap in the written AML policy is a program design issue to be remediated — it doesn't point to any particular suspicious activity requiring a case-level investigation.",
      },
      {
        id: 38, title: 'Responding to Law Enforcement Inquiries', selectCount: 3,
        question: "What are three of the recommended ways to respond to a law enforcement inquiry?",
        options: [
          { text: 'Cooperate with the law enforcement inquiry as much as possible', correct: true },
          { text: 'Respond to all formal requests for information as promptly and thoroughly as possible, unless there is a valid objection that can and should be made', correct: true },
          { text: 'Ensure that all communication, written and oral, is funneled through a centralized place', correct: true },
          { text: 'Guard against unwarranted publicity by resisting all inquiries and requests whenever possible', correct: false },
        ],
        explanation: "The recommended posture is genuine, organized cooperation: respond promptly and fully unless there's a legitimate legal basis not to, and route everything through one centralized point of contact. Reflexively resisting inquiries to avoid publicity is the opposite of good practice and can itself create legal and reputational exposure.",
      },
      {
        id: 39, title: 'Sources for Deciding Whether to Report', selectCount: 2,
        question: "A compliance officer receives a report from the institution's monitoring system. One account was identified in multiple alerts for the amount of cash deposited and international wires sent. Which two sources of information held within the institution will enable the compliance officer to determine whether the activity should be reported?",
        options: [
          { text: 'The signature card for the account', correct: false },
          { text: 'The customer due diligence information on file', correct: true },
          { text: 'The monitoring system parameters for identifying unusual activity', correct: false },
          { text: 'Transaction records for the period during which the unusual activity occurred', correct: true },
        ],
        explanation: "Deciding whether an alert is genuinely suspicious means comparing what the customer is actually doing against what you already know about them: their CDD profile (expected activity) against their actual transaction records for the alerted period. The signature card just shows who can operate the account, and the monitoring system's own parameters explain why it alerted — neither tells you whether the activity itself is suspicious.",
      },
      {
        id: 40, title: 'Governing Transaction Monitoring Effectiveness', selectCount: 2,
        question: "In a large US bank, an individual leads a team in charge of overseeing the governance and effectiveness of the bank's transaction monitoring approach. Which strategies should the team implement?",
        options: [
          { text: 'Periodic review of suspicious activity reports (SARs) filed with FinCEN to determine whether any should be withdrawn', correct: false },
          { text: 'Periodic and ad hoc cooperation with the legal team to appropriately investigate and monitor the transactions of subjects of subpoenas or government inquiries', correct: false },
          { text: "Periodic review of client profiles to ensure that the most up-to-date information is on file for high-risk clients in line with the bank's internal policies and procedures", correct: true },
          { text: "Periodic review of the transaction monitoring scenarios and their productivity to ensure that appropriate AML typologies are reflected", correct: true },
        ],
        explanation: "Governing a monitoring program means keeping its two core inputs current: the client risk data the system relies on, and the detection scenarios themselves, tuned so they still reflect real-world typologies. Reviewing already-filed SARs for possible withdrawal isn't a recognised monitoring-governance practice, and coordinating with legal on subpoenas is a case-response function, not a program-governance one.",
      },
      {
        id: 41, title: 'FATF Supporting Documentation Requirements', selectCount: 2,
        question: "What are two requirements with respect to supporting documentation that is used to identify potentially suspicious activity, according to the Financial Action Task Force?",
        options: [
          { text: 'It must be retained for at least five years', correct: true },
          { text: 'It must be retained for at least seven years', correct: false },
          { text: 'It must be kept in a manner so that it can be provided promptly', correct: true },
          { text: 'It must only be released to the government through a subpoena process', correct: false },
        ],
        explanation: "FATF's standard sets a five-year retention floor for the documentation behind a suspicious activity finding, and requires it be kept organized enough to hand over promptly when a competent authority asks — not locked away in a way that delays a request. There's no seven-year floor, and requiring a subpoena before any release would defeat the purpose of cooperative supervision.",
      },
      {
        id: 42, title: "Reading Through a Suspect's False Statements",
        question: "During a law enforcement investigative interview regarding potential money laundering, the suspect starts making assertions and statements that the investigator believes are false. How should the investigator respond?",
        options: [
          { text: 'Inform the suspect that deception is obvious and continue the interview', correct: false, feedback: "Announcing that the deception has been spotted gives up the investigator's advantage and lets the suspect adjust their story instead of continuing to talk." },
          { text: 'Advise the suspect that the interview will be terminated if there is suspicion of deception', correct: false, feedback: "Threatening to end the interview shuts down the flow of information rather than using it — the goal is to keep the suspect talking, not to cut the interview short." },
          { text: 'Direct the interview in another direction until there is better rapport before returning back to the troubling questions', correct: false, feedback: "Pivoting away entirely risks losing the thread and giving the suspect time to reconcile their story rather than probing the inconsistency while it's fresh." },
          { text: 'Ask questions of a material nature about the suspected false statements without revealing the suspected deception', correct: true, feedback: "Correct. Probing the substance of the suspicious statements with follow-up questions — without tipping off the suspect that the deception has been noticed — is what actually generates more information and lets inconsistencies surface naturally." },
        ],
      },
      {
        id: 43, title: 'Sharing Data With a Broker-Dealer Affiliate',
        question: "Which factor should a bank consider before sharing information about a customer with its broker-dealer affiliate in the case of an investigation?",
        options: [
          { text: 'Whether the broker-dealer affiliate can rely on the due diligence done by the bank', correct: false, feedback: "Whether the affiliate can lean on the bank's existing due diligence is a convenience consideration, not the threshold legal question that governs whether sharing is permitted at all." },
          { text: 'Whether there is a mutual legal assistance treaty in place between the two institutions', correct: false, feedback: "MLATs govern cooperation between countries' authorities in cross-border investigations — they have no bearing on sharing between a bank and its own affiliate." },
          { text: 'Whether privacy and data protection rules permit the bank to share the information with the affiliate', correct: true, feedback: "Correct. Before any information moves — even between corporate affiliates — the bank has to confirm that doing so is actually permitted under applicable privacy and data protection law. That's the threshold question everything else depends on." },
          { text: 'Whether both institutions have an account or are in the process of opening an account for the customer', correct: false, feedback: "Whether the customer has an account with both entities doesn't determine whether the sharing is legally permitted — the governing question is the privacy/data protection framework." },
        ],
      },
      {
        id: 44, title: 'Best Location for an Investigative Interview',
        question: "Which location provides a law enforcement investigator the best opportunity for a productive investigative interview of a suspect?",
        options: [
          { text: 'The residence of the suspect', correct: false, feedback: "A suspect's home is their own territory — comfortable and familiar in a way that works against the investigator, not for them." },
          { text: 'The office or work location of the suspect', correct: false, feedback: "A workplace setting carries its own distractions and status dynamics that can work against a candid, focused interview." },
          { text: 'A neutral location such as a coffee shop or restaurant', correct: false, feedback: "A public venue offers no control over privacy, interruptions, or recording — all things a productive interview depends on." },
          { text: "An interview room in the offices of a law enforcement agency", correct: true, feedback: "Correct. A dedicated interview room gives the investigator control over the environment — privacy, structure, and psychological framing — all of which support a more productive, focused interview than any location on the suspect's own turf." },
        ],
      },
      {
        id: 45, title: "Employee Who Assisted a Convicted Director",
        question: "A director of a financial institution was convicted of laundering money as part of a Ponzi scheme and terminated. As a result of an internal investigation, evidence proved that an employee assisted in the illegal activity. Which action should the institution take?",
        options: [
          { text: 'Discipline the employee with no further action', correct: false, feedback: "Internal discipline alone doesn't address the fact that the employee's conduct may itself have been criminal — that needs to go beyond an internal HR matter." },
          { text: 'Discipline the employee and inform local authorities', correct: true, feedback: "Correct. Once an internal investigation confirms an employee actively assisted in laundering money, the institution needs to both address it internally through discipline and refer the conduct to local authorities — internal action alone isn't sufficient when the underlying conduct may be criminal." },
          { text: 'Since the employee was not charged, no further action is required', correct: false, feedback: "The absence of a criminal charge against the employee doesn't excuse the institution from acting on evidence its own investigation has already confirmed." },
          { text: 'Require all employees to complete additional anti-money laundering training', correct: false, feedback: "A training refresh for the whole staff doesn't address the specific, confirmed misconduct of the individual employee involved." },
        ],
      },
      {
        id: 46, title: "The 'Follow the Money' Approach",
        question: "A law enforcement agent is conducting an investigation into a possible money laundering event. During the investigation, the officer will use:",
        options: [
          { text: 'the follow the money approach.', correct: true, feedback: "Correct. Tracing the flow of funds — where money originated, how it moved, and where it ended up — is the core investigative technique law enforcement relies on to build a money laundering case, since the money trail itself is the evidence." },
          { text: 'confirmed evidence obtained from financial intelligence units.', correct: false, feedback: "FIU intelligence can support an investigation, but it's a source an investigator may draw on, not the defining approach that shapes how the investigation itself is conducted." },
          { text: 'a process to identify suspicious activity.', correct: false, feedback: "Identifying suspicious activity is what triggers an investigation in the first place — it describes the starting point, not the investigative method used once the case is underway." },
          { text: 'a risk-based approach alert generating system.', correct: false, feedback: "Alert-generating systems are a detection tool used by financial institutions upstream of an investigation — they don't describe how a law enforcement officer actually investigates a case." },
        ],
      },
      {
        id: 47, title: 'Cooperating With Law Enforcement — Two Additional Steps', selectCount: 2,
        question: "A financial institution (FI) is being investigated for possible money laundering. When cooperating with law enforcement agencies, which additional steps should the FI ensure are taken?",
        options: [
          { text: 'Centralized control is maintained over all requests and responses to ensure completeness and timely responses.', correct: true },
          { text: 'Make employees, including corporate officers, unavailable for interviews and refuse documents upon receipt of a subpoena.', correct: false },
          { text: 'Subpoenas and other information requests should be reviewed by senior management and an investigations group or counsel.', correct: true },
          { text: 'Address the document destruction policy to ensure the relevant documents are destroyed.', correct: false },
          { text: 'Inquiries from the media are not answered directly, but rather are addressed by replying, "No comment."', correct: false },
        ],
        explanation: "Effective cooperation means centralizing control over the flow of requests and responses so nothing falls through the cracks, and routing subpoenas and information requests through senior management and legal/investigations before they're answered. Making staff unavailable or refusing documents obstructs the process, and altering document destruction practices during an active investigation can itself constitute obstruction of justice.",
      },
      {
        id: 48, title: 'FATF Standard on Intra-Group SAR Information Sharing',
        question: "Which statement is true regarding the FATF standards for SARs/STRs information sharing within a financial group?",
        options: [
          { text: 'FIs must retain copies of SARs/STRs and supporting documentation for five years from the date of filing the STRs.', correct: false, feedback: "This describes a general record-retention obligation, not the specific intra-group information-sharing principle FATF's standard addresses here." },
          { text: 'FIs cannot share customer information at all since it is confidential.', correct: false, feedback: "A blanket prohibition on sharing would defeat the purpose of group-wide AML programs, which rely on some level of information flow between affiliates." },
          { text: 'Financial institutions (FIs) should establish sufficient safeguards concerning the confidentiality of information shared for AML purposes.', correct: true, feedback: "Correct. FATF's standard permits information sharing within a financial group for AML purposes, but conditions it on the group having sufficient confidentiality safeguards in place — sharing is allowed, but it has to be protected." },
          { text: 'FIs must require approval from regulators to share SARs/STRs information and supporting documentation.', correct: false, feedback: "Regulatory pre-approval for every instance of intra-group sharing isn't the FATF standard — the requirement is adequate confidentiality safeguards, not a regulatory gatekeeping step." },
        ],
      },
      {
        id: 49, title: "PATRIOT Act Extraterritorial Reach — Three True Statements", selectCount: 3,
        question: "Which statements regarding the USA PATRIOT Act best describe key aspects that have extraterritorial reach?",
        options: [
          { text: 'It allows for the US Attorney General to subpoena records from a foreign bank with US correspondent accounts, including those that are located outside the US.', correct: true },
          { text: 'It allows foreign banks to voluntarily designate a registered agent in the US to accept service of subpoenas.', correct: false },
          { text: 'It allows the Secretary of the Treasury to order a US financial institution (FI) to close a correspondent account when a subpoena has not been responded to by a foreign bank in a timely manner.', correct: true },
          { text: 'It obliges the government to trace the origin of the funds when a seizure of assets occurs in a correspondent account that has been opened and maintained for a foreign bank in the US.', correct: false },
          { text: 'It excludes as foreign FIs businesses that would be considered broker-dealers, money transmitters, and currency exchangers.', correct: false },
          { text: 'It allows federal banking supervisors to require records of the identity of the owners of a foreign bank from a FI operating in the US.', correct: true },
        ],
        explanation: "The PATRIOT Act's extraterritorial power comes from reaching foreign banks through their US correspondent relationships: the Attorney General can subpoena a foreign bank's records anywhere via the correspondent account, Treasury can order the account closed if a subpoena goes unanswered, and federal supervisors can demand ownership records of the foreign bank itself. There's no obligation to trace fund origins on every seizure, no voluntary registered-agent designation mechanism, and the Act's foreign FI definition is broad, not narrowed to exclude those business types.",
      },
      {
        id: 50, title: 'Legal Risk of Failing to Report Suspected Fraud',
        question: "What is an example of a legal risk a financial institution (FI) could face if it is sanctioned for failure to report suspected fraud activity?",
        options: [
          { text: 'Foreign correspondents could terminate their relationships with the sanctioned bank.', correct: false, feedback: "Correspondent banks pulling relationships is a real commercial consequence, but it's reputational/business fallout, not a direct legal risk in itself." },
          { text: 'Clients of the bank might draw down the reserves of the bank and lead to liquidity issues.', correct: false, feedback: "A run on deposits is a financial/liquidity risk, not a legal one arising from the sanction itself." },
          { text: 'The bank could be forced to reimburse the victims of the fraudster for the losses suffered.', correct: true, feedback: "Correct. A concrete legal consequence of being sanctioned for failing to report suspected fraud is potential liability to the victims — the bank can be legally compelled to make restitution for losses it failed to help prevent by not reporting." },
          { text: 'The bank could see higher default rates on loans granted to companies owned by the fraudster.', correct: false, feedback: "Higher default rates are a credit-risk consequence, unrelated to the legal exposure created by a reporting-failure sanction." },
        ],
      },
      {
        id: 51, title: 'Main Objective of an FI Investigation',
        question: "Which is the main objective when a financial institution (FI) conducts an investigation?",
        options: [
          { text: 'Keep policies and procedures updated', correct: false, feedback: "Maintaining current policies is an ongoing program-management task, not the specific objective of conducting an individual investigation." },
          { text: 'Keep all the documentation', correct: false, feedback: "Documentation is a necessary output and evidentiary requirement of the investigation, but it isn't the investigation's actual goal." },
          { text: 'Know the customer', correct: false, feedback: "Knowing the customer is a foundational CDD obligation that exists before and independent of any specific investigation." },
          { text: 'Track the movement of the money', correct: true, feedback: "Correct. The central objective of an AML investigation is to trace where the funds came from, how they moved, and where they ended up — following the money is what actually determines whether the activity is suspicious and what happened." },
        ],
      },
      {
        id: 52, title: 'First Step in the MLAT Process',
        question: "Which is the first valid step in the Mutual Legal Assistance Treaties (MLAT) international cooperation process?",
        options: [
          { text: 'The central authority that receives the request sends it to a local judicial officer to find out if the information is available.', correct: false, feedback: "This is a step that happens after the request has already been received by the responding country's central authority — it isn't the first step of the overall process." },
          { text: 'The central authority of the requesting country sends a commission letter of request to the central authority of the other country.', correct: true, feedback: "Correct. The MLAT process formally begins with the requesting country's central authority sending a commission letter of request to the central authority of the country holding the information — that's the entry point that sets the whole cooperation process in motion." },
          { text: 'The investigator may remove the evidence collected without asking permission to do so.', correct: false, feedback: "Investigators cannot unilaterally remove evidence from a foreign jurisdiction — that would bypass the entire treaty-based cooperation process MLATs exist to formalize." },
          { text: 'An investigator from the requesting country visits the country where the information is sought and takes statements from the identified witnesses or suspects.', correct: false, feedback: "Direct in-country action by a foreign investigator isn't the starting point — it would need to follow the formal MLAT request process, not precede it." },
        ],
      },
      {
        id: 53, title: 'Responding to an Overly Broad Law Enforcement Request',
        question: "Law enforcement is conducting an investigation of a FI and has submitted an overly broad and unduly intrusive request. Which is a FI's most appropriate response?",
        options: [
          { text: "Contest the request with the company's board of directors and key senior management.", correct: false, feedback: "Escalating internally to the board doesn't actually address the scope problem with law enforcement — the resolution needs to happen with the requesting agency." },
          { text: 'Delay a response until all documents can be gathered regardless of the duration.', correct: false, feedback: "Open-ended delay risks looking like obstruction and doesn't resolve the underlying problem that the request itself is too broad." },
          { text: 'Narrow the request through a prompt response to the law enforcement agency.', correct: true, feedback: "Correct. The appropriate response to an overly broad request is to engage promptly with the law enforcement agency to narrow its scope — this keeps the FI cooperative while still pushing back constructively on a request that's genuinely too intrusive." },
          { text: 'Ignore the request due to the unacceptable volume of information contained within.', correct: false, feedback: "Ignoring a law enforcement request outright is not a legitimate response regardless of how broad it is, and risks serious legal consequences for the FI." },
        ],
      },
      {
        id: 54, title: 'Balancing Privacy Law and AML Law',
        question: "Which principle about safeguarding privacy and data should an auditor adhere to when performing an AML investigation?",
        options: [
          { text: 'During evidence gathering, privacy laws are less important than local AML laws.', correct: false, feedback: "Treating privacy law as subordinate to AML law isn't the correct principle — the two need to be reconciled together, not ranked against each other." },
          { text: 'Countries should clarify where AML and Data Protection Privacy are not balanced.', correct: false, feedback: "This describes a policy recommendation for regulators, not a principle an individual auditor applies while conducting an investigation." },
          { text: 'Terrorist Financing is more relevant in the context of data protection and supersedes laws.', correct: false, feedback: "No category of financial crime automatically overrides data protection law — the seriousness of the underlying conduct doesn't suspend privacy obligations." },
          { text: 'AML and Data Protection Privacy law should not be mutually exclusive.', correct: true, feedback: "Correct. The correct principle is that AML obligations and data protection/privacy law are meant to operate together, not as competing frameworks where one simply overrides the other — an auditor needs to satisfy both simultaneously." },
        ],
      },
      {
        id: 55, title: 'Suspecting an Employee of Mortgage Fraud',
        question: "What should a bank do if it suspects one of its employees may be involved in mortgage loan fraud?",
        options: [
          { text: 'Conduct an investigation by gathering and analyzing information on the employee.', correct: true, feedback: "Correct. The appropriate first step is a proper internal investigation — gathering and analyzing the relevant information before taking any further action, since jumping straight to a police report, litigation, or a SAR filing without first substantiating the suspicion would be premature." },
          { text: "Automatically file a police report about the employee's potential misconduct.", correct: false, feedback: "Filing a police report before any internal investigation has substantiated the suspicion skips the necessary fact-gathering step." },
          { text: 'Initiate civil litigation against the employee to recover damages for losses incurred.', correct: false, feedback: "Civil litigation is a downstream remedy that would only be considered after an investigation establishes what actually happened, not a first response to mere suspicion." },
          { text: "File a SAR/STR on the employee's activities if management thinks it is suspicious.", correct: false, feedback: "A SAR filing decision should follow a proper investigation of the facts, not be based solely on management's initial impression." },
        ],
      },
      {
        id: 56, title: 'Which Law Enforcement Request Is Legitimate',
        question: "A law enforcement agency submits several requests to a FI. Which request is legitimate and requires the bank to respond?",
        options: [
          { text: 'Seize privileged documents upon written request.', correct: false, feedback: "Privileged documents are protected regardless of a written request — a request alone doesn't override legal privilege." },
          { text: 'Freeze an account in terms of a court order.', correct: true, feedback: "Correct. A court order is the legitimate legal instrument that actually obligates a bank to freeze an account — it carries binding judicial authority, unlike a verbal request or an attempt to bypass legal protections." },
          { text: 'Produce documents and testimony without a subpoena.', correct: false, feedback: "Compelling document production and testimony ordinarily requires a subpoena or equivalent legal process — a bare request without one isn't sufficient." },
          { text: 'Keep an account open upon verbal request.', correct: false, feedback: "A verbal request lacks the legal force needed to obligate a bank's action — it isn't a legitimate basis on its own." },
        ],
      },
      {
        id: 57, title: 'Data Privacy Regulation Relevant to Financial Crime Investigations',
        question: "Which regulation regarding data privacy has to be considered while carrying out a financial crime investigation?",
        options: [
          { text: 'Securities Financing Transactions Regulation', correct: false, feedback: "This regulation governs securities financing transaction transparency — it has no bearing on data privacy in an investigation." },
          { text: 'General Data Protection Regulation', correct: true, feedback: "Correct. The GDPR is the major data privacy framework that has to be factored into how personal data is handled, shared, and retained during a financial crime investigation — especially where EU-connected data or subjects are involved." },
          { text: 'European Enforcement Order', correct: false, feedback: "This is a civil judgment-recognition mechanism between EU member states — it isn't a data privacy regulation." },
          { text: 'Rome II Regulation', correct: false, feedback: "Rome II governs which country's law applies to non-contractual obligations (like torts) — it isn't a data privacy framework." },
        ],
      },
      {
        id: 58, title: 'Responding to a Grand-Jury Subpoena',
        question: "Which action should a financial institution take when it receives a grand-jury subpoena regarding a customer?",
        options: [
          { text: "Have the institution's assigned legal counsel review the subpoena.", correct: true, feedback: "Correct. A grand-jury subpoena is a formal legal instrument, and the appropriate first action is having legal counsel review it — to confirm its scope and validity and guide a properly compliant response, rather than the FI acting on it unilaterally." },
          { text: "Make copies of the customer's documents and submit the originals to the enforcement agency.", correct: false, feedback: "Handing over originals — rather than following counsel-reviewed procedures for what and how to produce — isn't the correct first action." },
          { text: "Keep the customer's accounts open at the enforcement agency's verbal request.", correct: false, feedback: "A verbal request carries no legal force to act on — and this doesn't address how to actually respond to the subpoena itself." },
          { text: 'Notify the customer being investigated before submitting documents.', correct: false, feedback: "Notifying the customer of a grand-jury subpoena can itself constitute unlawful tipping-off and undermine the investigation — it is not the appropriate first action." },
        ],
      },
      {
        id: 59, title: 'Responding to a Formal Document Production Request',
        question: "What should a financial institution (FI) do in response to a formal law enforcement request to produce documents?",
        options: [
          { text: "Verify the officer's identification and ask for the law enforcement request to be served when the Chief Executive Officer is available to sign for it.", correct: false, feedback: "Requiring the CEO personally to be available to accept service isn't a necessary or standard part of responding to a formal document request." },
          { text: 'Keep senior management informed at all times to strategically organize a defense to terminate the law enforcement request.', correct: false, feedback: "Organizing a defense to try to terminate a legitimate request treats cooperation as adversarial, which isn't the appropriate posture for a formal, lawful request." },
          { text: "Ask for an extension to review the FI's privacy policy and confidentiality policy before providing any information under the law enforcement request.", correct: false, feedback: "Using an extension to review internal policy as a stalling tactic delays a legitimate legal request rather than responding to it properly." },
          { text: 'Designate a person responsible for the internal investigation in preparation of documents for the request.', correct: true, feedback: "Correct. The appropriate response is to designate someone responsible for coordinating the internal effort to gather and prepare the requested documents — giving the request clear ownership and ensuring a timely, organized, and complete response." },
        ],
      },
      {
        id: 60, title: 'Data Privacy and SAR Information Sharing',
        question: "Which statement regarding data privacy is the most accurate in the context of AML investigations?",
        options: [
          { text: 'FIUs should document purposes for which personal data included on suspicious activity reports may be shared with other agencies.', correct: true, feedback: "Correct. Financial intelligence units are expected to document the specific purposes for which SAR-derived personal data may be shared further — this is what keeps information sharing accountable and limited to legitimate AML purposes rather than open-ended." },
          { text: 'Any customer that is the subject of a suspicious report filing has the right to request redaction of their personal data.', correct: false, feedback: "Giving the subject of a SAR the ability to demand redaction would undermine the entire reporting system and is not how SAR confidentiality works." },
          { text: 'Data privacy laws prohibit information sharing between financial institutions for the purposes of AML investigations in all jurisdictions.', correct: false, feedback: "This overstates the position — most jurisdictions provide specific carve-outs or safeguarded pathways for AML-purpose information sharing, not a blanket prohibition everywhere." },
          { text: 'Organizations are required to demonstrate that customers have opted into information sharing before submitting suspicious activity reports to relevant financial intelligence units (FIUs).', correct: false, feedback: "Requiring customer opt-in before filing a SAR would defeat the purpose of the reporting obligation, which by design operates without the customer's knowledge or consent." },
        ],
      },
      {
        id: 61, title: 'First Step in a Financial Investigation',
        question: "What is the first step that an investigator should take when beginning a financial investigation into a potential suspicious activity?",
        options: [
          { text: "Contacting the country's financial intelligence unit's (FIU's) officers to seek advice on whether the potential suspicious activity is indeed a suspicious activity", correct: false, feedback: "Reaching out to the FIU before the investigator has even gathered the institution's own information skips the necessary internal groundwork." },
          { text: "Determining whether the potential suspicious activity is consistent with the customer's transactional behavior, nature of business, and occupation", correct: false, feedback: "This comparison against expected behavior is an important analytical step, but it comes after the investigator has actually gathered the underlying internal information to compare against." },
          { text: 'Gathering and assessing internal sources of information, including information obtained from the customer, transactions, and value and volume', correct: true, feedback: "Correct. A financial investigation properly starts by pulling together what the institution already has internally — customer information, transaction records, and value/volume data — before moving on to comparing that against expected behavior or looking outward to external sources." },
          { text: 'Identifying and reviewing external information, including online presence, customer-related entities, and relevant media', correct: false, feedback: "External research is a valuable supplementary step, but it should follow — not precede — a thorough review of the institution's own internal records." },
        ],
      },
      {
        id: 62, title: 'Practices for Terminating Customer Relationships', selectCount: 3,
        question: "Which practices should financial institutions (FIs) adopt for the process of terminating customer relationships?",
        options: [
          { text: 'Utilizing a flexible communication style that adapts to different customer situations during the termination process', correct: false },
          { text: 'Implementing a standardized procedure for customer termination that includes risk assessments and necessary documentation', correct: true },
          { text: "Performing a final review of a customer's transaction history and records to address any unresolved issues prior to termination", correct: true },
          { text: 'Keeping records of the termination process, including the justification for the decision and any correspondence with the customer', correct: true },
          { text: 'Notifying the customer of the termination decision only after completing the termination process to prevent possible disputes', correct: false },
        ],
        explanation: "A sound termination process is standardized (risk-assessed and documented consistently, not handled ad hoc), includes a final review of the customer's history to resolve anything outstanding first, and is fully recorded — including the rationale and any correspondence — so the decision can be defended later. An improvised, situation-by-situation communication style undermines consistency, and withholding notification until after termination is complete raises fairness and transparency concerns rather than preventing disputes.",
      },
      {
        id: 63, title: 'Escalating a Transaction Monitoring Alert',
        question: "An AML analyst at a financial institution is examining an alert generated by the automated transaction monitoring system to determine whether the alert should be escalated to the AML unit for further investigation or whether it can be archived as a false positive. Which action might be reasonable for the AML analyst to take?",
        options: [
          { text: 'Perform below-the-line testing to ensure the automated monitoring system is operating effectively', correct: false, feedback: "Below-the-line testing is a system-tuning and model-validation exercise conducted separately from working an individual alert — it isn't part of triaging this specific case." },
          { text: 'Send a request for information to the counterparty bank involved in the transaction that caused the alert', correct: false, feedback: "Reaching out directly to an external counterparty bank isn't a routine or appropriate step for an analyst triaging a single alert — that kind of external inquiry would need to go through proper channels, if at all." },
          { text: 'Request information from the relationship manager assigned to the account that caused the alert', correct: true, feedback: "Correct. The relationship manager typically has direct context about the customer's business and expected activity, making them a natural and reasonable internal source of information for the analyst to consult before deciding whether the alert warrants escalation." },
          { text: "Restrict the client's access to the account", correct: false, feedback: "Restricting account access is a significant action that goes well beyond what's needed simply to triage an alert, and isn't something an analyst should do unilaterally at this stage." },
        ],
      },
      {
        id: 64, title: 'PATRIOT Act Section Permitting Seizure of Correspondent Funds',
        question: "Which section of the USA PATRIOT Act permits the US government to seize funds deposited in a US correspondent account of a foreign bank, creating extraterritorial impact?",
        options: [
          { text: 'Section 319(b)', correct: false, feedback: "Section 319(b) deals with the requirement to maintain records of correspondent account owners and the subpoena power over foreign banks' records — not the seizure power itself." },
          { text: 'Section 314(b)', correct: false, feedback: "Section 314(b) provides a voluntary information-sharing safe harbour between financial institutions — it has nothing to do with seizure of funds." },
          { text: 'Section 314(a)', correct: false, feedback: "Section 314(a) is the government-to-institution information request mechanism for locating accounts and transactions — not a seizure power." },
          { text: 'Section 319(a)', correct: true, feedback: "Correct. Section 319(a) is the specific PATRIOT Act provision that allows the US government to seize funds held in a US correspondent account of a foreign bank — a direct extraterritorial reach into funds that are technically the foreign bank's, not the account holder's, within the US." },
        ],
      },
      {
        id: 65, title: 'Indicator of Potential Insider Activity',
        question: "Which of the options below is an indicator of potential insider activity that may warrant escalation for further investigation?",
        options: [
          { text: "A relationship manager advocates for overriding the results of the company's client risk rating model that resulted in a client's high-risk rating.", correct: true, feedback: "Correct. A relationship manager actively pushing to override a model-generated high-risk rating is a genuine insider red flag — it suggests a possible motive to keep a risky client's rating artificially low, which is exactly the kind of pattern that warrants a closer look." },
          { text: 'A relationship manager makes an exception to company policy and proceeds with onboarding a customer without documenting a passport for customer identification.', correct: false, feedback: "A documented policy exception is a control gap worth correcting, but on its own it's a process failure rather than a specific indicator of insider misconduct." },
          { text: 'An investigator does not complete the automated transaction monitoring system alerts assigned to them before the time required by company procedures.', correct: false, feedback: "Missing an internal deadline points to a workload or performance issue, not a specific indicator that someone is deliberately protecting a risky relationship." },
          { text: "An IT employee shares information about a firm's risk management framework with employees of other firms at an industry convention.", correct: false, feedback: "General professional discussion of a risk framework at an industry event, without more, isn't inherently a sign of insider misconduct." },
        ],
      },
      {
        id: 66, title: 'Who Makes the Final Decision to File',
        question: "After an unusual transaction has been analyzed and it is determined that there are grounds to report it to the local Financial Intelligence Unit (FIU), how or by whom is the final decision to report the unusual transaction made?",
        options: [
          { text: 'Automatic reporting by the case management system', correct: false, feedback: "Filing is a substantive judgment call, not something that should be automated purely by the case management system without human authorization." },
          { text: 'Any manager within the department which escalated the unusual transaction', correct: false, feedback: "The decision needs to sit with a specifically authorized individual under the institution's own internal procedures — not just any manager who happens to be in the escalating department." },
          { text: 'An individual authorized through internal procedures', correct: true, feedback: "Correct. The final decision to file rests with whoever the institution's internal procedures have specifically designated and authorized to make that call — typically the MLRO or compliance officer — not an automated system or an ad hoc manager." },
          { text: 'The analyst who analyzed the unusual transaction', correct: false, feedback: "The analyst who worked the case builds the analysis and recommendation, but the filing decision itself is reserved for the specifically authorized individual, not the analyst directly." },
        ],
      },
      {
        id: 67, title: 'Cross-Border ML Investigation Challenge',
        question: "Which statement best describes an organizational challenge for law enforcement agencies and Financial Intelligence Units (FIUs) when conducting cross-border money laundering (ML) investigations?",
        options: [
          { text: 'Defining a common communication approach and language between all involved parties.', correct: false, feedback: "Language and communication differences are a practical friction point, but not the structural organizational challenge this question is pointing at." },
          { text: 'Delays in the investigation due to a foreign FIU awaiting the results of queries performed by third parties.', correct: false, feedback: "Waiting on third-party query results is a process delay, but it isn't the core organizational gap in cross-border cooperation described here." },
          { text: 'Conducting an investigation in all countries through which ML funds were transferred when one or more of the countries do not have an FIU.', correct: true, feedback: "Correct. When laundered funds pass through a jurisdiction that has no FIU at all, there's no counterpart institution to cooperate with — a genuine structural gap in the international cooperation framework, not just a procedural delay." },
          { text: 'Investigations which involve high-ranking politicians, who often have influence over the local FIU.', correct: false, feedback: "Political interference is a real risk in some cases, but it's a case-specific integrity concern, not the general organizational/structural challenge being described." },
        ],
      },
      {
        id: 68, title: 'Limits of Public-Private Partnership Information Sharing', selectCount: 2,
        question: "Which statements are true regarding the limitations that public-private partnerships (PPPs) have in relation to data and intelligence sharing?",
        options: [
          { text: "Both public and private sectors are exempted from data and intelligence sharing restrictions in many jurisdictions even without customers' consent when the data is used to fight financial crimes", correct: false },
          { text: "The full disclosure of customers' and other relevant information to authorities to fulfil suspicious activity report (SAR) filing obligations is protected by law in Financial Action Task Force (FATF) countries", correct: true },
          { text: 'The sharing of data and intelligence for commercial reasons requires legal advice but is not restricted in public-private partnerships (PPPs) for combating financial crimes in Financial Action Task Force (FATF) countries', correct: false },
          { text: 'Both public and private sectors must consult their own legal counsel regarding legal restrictions and come to an agreement with the relevant authorities before any data or intelligence can be shared', correct: true },
        ],
        explanation: "PPP information sharing operates within real limits: SAR-related disclosure to authorities is legally protected in FATF countries specifically for fulfilling that filing obligation, and both sides of a partnership need their own legal counsel's input and an agreement with the relevant authorities before sharing more broadly. There's no blanket consent-free exemption from sharing restrictions, and commercially-motivated sharing is not simply unrestricted just because a PPP exists.",
      },
      {
        id: 69, title: 'Considerations for Private-Sector Data Sharing', selectCount: 4,
        question: "What needs to be considered when sharing data and intelligence as a result of private sector efforts to foster collaboration in the fight against financial crimes?",
        options: [
          { text: 'Maintain regular communication with respective regulators', correct: true },
          { text: 'Consult in-house legal counsel', correct: true },
          { text: 'Review customer experience and feedback to adjust AFC policies', correct: false },
          { text: 'Observe and fulfill suspicious activity report (SAR) filing obligations', correct: true },
          { text: 'Obtain advice from data privacy officers', correct: true },
          { text: 'Inform the FIU of what has been shared', correct: false },
        ],
        explanation: "Responsible private-sector collaboration on financial crime data requires staying in regular contact with regulators, getting in-house legal counsel's input, keeping SAR filing obligations intact regardless of what's shared elsewhere, and consulting data privacy officers on what can lawfully move between parties. Customer experience feedback isn't a compliance consideration here, and there's no general requirement to separately inform the FIU of everything shared under a private-sector collaboration.",
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
  'Free Preview': 'bg-violet-100 text-violet-600 border border-violet-200',
}

const CAMS_FREE_QUESTIONS = 6

// Deterministic per-question shuffle so the same question always renders in the
// same scrambled order (stable across re-renders/revisits) without needing to
// hand-reorder every option in the source data.
function seededShuffle(arr, seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(h, 31) + seed.charCodeAt(i)) >>> 0
  const next = () => {
    h ^= h << 13; h >>>= 0
    h ^= h >>> 17
    h ^= h << 5; h >>>= 0
    return h / 4294967296
  }
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function Training({ user, onGoHome, onNavigateSection, onStart, onSignIn, onSignUp, onOpenChat, onOpenTraining, onSignOut, onOpenSettings, onOpenAbout, onOpenContact, onOpenCost, onOpenSetupGuide, onOpenEligibility, onOpenProgramBuilder, onOpenAustracEnrolment, onOpenSmrGuide, onOpenComplianceOfficer, onOpenRiskAssessment, onUpgrade }) {
  const isPremium = user?.premium || false
  const [activeRole, setActiveRole] = useState(user?.role || 'analyst')
  const [activeIndustry, setActiveIndustry] = useState(user?.industry || 'banking')
  const caseset = CASES_BY_INDUSTRY[activeIndustry] || CASES_BY_INDUSTRY.banking
  const cases = activeRole === 'cams' ? CAMS_MODULES : activeRole === 'mlro' ? caseset.mlro : activeRole === 'simulations' ? [] : caseset.analyst

  const handleIndustryChange = (ind) => {
    setActiveIndustry(ind)
    const stored = localStorage.getItem('aml_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        localStorage.setItem('aml_user', JSON.stringify({ ...parsed, industry: ind }))
      } catch {}
    }
  }

  const [activeSimView, setActiveSimView] = useState(null)
  const [progress, setProgress] = useState({})
  const [activeCase, setActiveCase] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [selected, setSelected] = useState([])
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
    if (!c.steps || c.steps.length === 0) return
    const step = fromStep != null ? fromStep : (progress[c.id]?.step || 0)
    setActiveCase(c)
    setActiveStep(step)
    setSelected([])
    setShowFeedback(false)
  }

  const restart = (c, e) => {
    e?.stopPropagation()
    save({ ...progress, [c.id]: { step: 0, completed: false } })
    startCase(c, 0)
  }

  const toggleOption = (i) => {
    if (showFeedback) return
    const step = activeCase.steps[activeStep]
    if (!step.selectCount) {
      setSelected([i])
      setShowFeedback(true)
      return
    }
    setSelected((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i)
      if (prev.length >= step.selectCount) return prev
      return [...prev, i]
    })
  }

  const submitMultiAnswer = () => setShowFeedback(true)

  const stepLimit = (c) => (c.sector === 'CAMS' && !isPremium) ? Math.min(CAMS_FREE_QUESTIONS, c.steps.length) : c.steps.length

  const handleNext = () => {
    const next = activeStep + 1
    if (next >= activeCase.steps.length) {
      save({ ...progress, [activeCase.id]: { step: 0, completed: true } })
      setActiveCase(null)
    } else {
      save({ ...progress, [activeCase.id]: { step: next, completed: false } })
      setActiveStep(next)
      setSelected([])
      setShowFeedback(false)
    }
  }

  /* ── Ownership simulation view ── */
  if (activeSimView === 'ownership') {
    return <OwnershipSimulation user={user} onBack={() => setActiveSimView(null)} />
  }

  /* ── Case simulation view ── */
  if (activeCase) {
    const step = activeCase.steps[activeStep]
    const options = seededShuffle(step.options, `${activeCase.id}::${step.id ?? activeStep}`)
    const isMulti = !!step.selectCount
    const chosen = !isMulti && selected.length ? options[selected[0]] : null
    const correctIndices = options.map((o, i) => (o.correct ? i : null)).filter((x) => x !== null)
    const multiCorrect = isMulti && selected.length === correctIndices.length && correctIndices.every((i) => selected.includes(i))
    const total = stepLimit(activeCase)
    const isCamsFree = activeCase.sector === 'CAMS' && !isPremium
    const isLastFreeStep = isCamsFree && activeStep === total - 1

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

              {isMulti && !showFeedback && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Select {step.selectCount} answers — {selected.length}/{step.selectCount} selected</p>
              )}

              <div className="space-y-2">
                {options.map((opt, i) => {
                  const isSelected = selected.includes(i)
                  let cls = 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer'
                  if (showFeedback) {
                    if (isSelected) cls = opt.correct ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-900 dark:text-red-300'
                    else if (opt.correct) cls = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400'
                    else cls = 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 cursor-default'
                  } else if (isMulti && isSelected) {
                    cls = 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 text-blue-900 dark:text-blue-200 cursor-pointer'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => toggleOption(i)}
                      disabled={showFeedback}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm leading-snug transition-all flex items-start gap-3 ${cls}`}
                    >
                      {isMulti && (
                        <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-500'}`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </span>
                      )}
                      <span>{opt.text}</span>
                    </button>
                  )
                })}
              </div>

              {showFeedback && !isMulti && chosen && (
                <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${chosen.correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'}`}>
                  <p className="font-semibold mb-1">{chosen.correct ? '✓ Correct' : '✗ Incorrect'}</p>
                  {chosen.feedback}
                </div>
              )}

              {showFeedback && isMulti && (
                <div className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${multiCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'}`}>
                  <p className="font-semibold mb-1">{multiCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
                  {step.explanation}
                </div>
              )}
            </div>

            {isMulti && !showFeedback && selected.length === step.selectCount && (
              <button
                onClick={submitMultiAnswer}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                Check answer
              </button>
            )}

            {showFeedback && isLastFreeStep ? (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-5 text-center">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Free preview complete</p>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  You've answered {CAMS_FREE_QUESTIONS} of {activeCase.steps.length} questions in this chapter. Upgrade to Premium to unlock the remaining {activeCase.steps.length - CAMS_FREE_QUESTIONS} questions in every CAMS chapter.
                </p>
                <button onClick={onUpgrade} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-sm transition-colors">
                  Upgrade to Premium — $49.99/mo
                </button>
              </div>
            ) : showFeedback && (
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
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeRole === 'simulations'
                ? 'AML Simulations'
                : (activeRole === 'mlro' ? 'MLRO' : activeRole === 'cams' ? 'CAMS Certification Prep' : 'Analyst') + ' Training Modules'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {activeRole === 'mlro'
                ? 'Review escalated cases from analysts. Sign off, send back with conditions, or escalate to SAR / DAML.'
                : activeRole === 'cams'
                ? `Genuine, exam-style questions sourced from real CAMS exam question banks and reviewed by a CAMS-certified AML professional. Free plan: the first ${CAMS_FREE_QUESTIONS} questions per chapter — Premium unlocks every remaining question in every chapter.`
                : activeRole === 'simulations'
                ? 'Gamified mini-games to sharpen specific AML skills.'
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
            <button
              onClick={() => setActiveRole('simulations')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeRole === 'simulations'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm6-5h4m-2-2v4m2 4H10m2 2v-4" />
              </svg>
              Simulations
            </button>
          </div>
        </div>

        {/* Industry switcher */}
        {activeRole === 'simulations' ? null : activeRole === 'cams' ? (
          <div className="w-full bg-violet-100 dark:bg-violet-900/30 rounded-full py-2 text-center text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-6">
            ACAMS CAMS Certification — 6th Edition
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">Industry</span>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 shrink-0" />
            {[
              { id: 'banking', label: 'Banking' },
              { id: 'law',     label: 'Law' },
              { id: 'crypto',  label: 'Crypto' },
              { id: 'fintech', label: 'Fintech' },
              { id: 'accountant', label: 'Accountant / TCSPs' },
            ].map((ind) => (
              <button
                key={ind.id}
                onClick={() => handleIndustryChange(ind.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeIndustry === ind.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {ind.label}
              </button>
            ))}
            <span className="text-xs text-slate-300 dark:text-slate-600 ml-1 hidden sm:inline">
              · Gambling · Wealth Management · MSBs — coming soon
            </span>
          </div>
        )}

        {/* Simulation grid */}
        {activeRole === 'simulations' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-2xl">
            {[
              {
                id: 'ownership',
                name: 'Ownership Structure Simulation',
                desc: 'Map UBOs, read structures, and diagnose red flags.',
                available: true,
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm6-5h4m-2-2v4m2 4H10m2 2v-4" />
                  </svg>
                ),
              },
              {
                id: 'more',
                name: 'More Simulations',
                desc: '',
                available: false,
                icon: (
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
            ].map((sim) => (
              <div
                key={sim.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative ${!sim.available ? 'opacity-60' : ''}`}
              >
                {!sim.available && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${sim.available ? 'bg-slate-800 dark:bg-slate-700' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  {sim.icon}
                </div>
                <p className={`font-bold text-base leading-snug mb-2 ${sim.available ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {sim.name}
                </p>
                {sim.desc && (
                  <p className={`text-xs leading-relaxed ${sim.available ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {sim.desc}
                  </p>
                )}
                {sim.available && (
                  <button
                    onClick={() => setActiveSimView(sim.id)}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Launch
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Case grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cases.map((c) => {
            const prog = progress[c.id]
            const inProgress = prog && !prog.completed && prog.step > 0
            const completed = prog?.completed
            const camsFree = c.sector === 'CAMS' && !isPremium
            const locked = c.premium && !isPremium && !camsFree
            const comingSoon = !c.steps || c.steps.length === 0

            return (
              <div
                key={c.id}
                className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col relative ${locked || comingSoon ? 'opacity-60' : ''}`}
              >
                {comingSoon && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
                {locked && !comingSoon && (
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
                  {locked && !comingSoon && <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLE['Premium']}`}>Premium</span>}
                  {camsFree && !completed && <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${TAG_STYLE['Free Preview']}`}>Free: {CAMS_FREE_QUESTIONS} of {c.steps.length}</span>}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-2">{c.number} {c.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed flex-1 mb-5">{c.shortDesc}</p>

                <div className="flex items-center justify-end gap-3">
                  {comingSoon ? (
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Coming soon</span>
                  ) : locked ? (
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
        {!isPremium && activeRole === 'cams' && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-6">
            <p className="font-bold text-slate-900 dark:text-white mb-1">Free plan: {CAMS_FREE_QUESTIONS} questions per chapter</p>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-5">
              Each chapter's free preview covers the first {CAMS_FREE_QUESTIONS} questions, sourced from real CAMS exam question banks and reviewed by a CAMS-certified AML professional. Upgrade to <strong>Premium</strong> to unlock every remaining exam-style question in every chapter.
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
