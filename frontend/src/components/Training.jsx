import { useState } from 'react'

const MODULES = [
  {
    id: 1,
    code: 'MOD-01',
    title: 'Customer Due Diligence',
    subtitle: 'A practical CDD scenario walkthrough',
    duration: '25 min',
    level: 'Foundational',
    color: 'blue',
    lessons: [
      {
        id: 'l1-1',
        title: 'Case Overview: The Client',
        intro: 'You are an AML analyst at a remittance provider. A new business customer has applied to open a corporate account. Work through this scenario step by step.',
        sections: [
          {
            heading: 'Client Profile',
            body: `Entity: Ming Lee Trading Pty Ltd (ABN 54 123 456 789)
Registered: ASIC — active, incorporated 2019
Director: James Wong (DOB: 15 March 1978, Singapore national, Australian PR)
Nature of business: Import/export of wholesale electronics and consumer goods
Requested services: Regular outward international transfers to suppliers in Hong Kong, Shenzhen, and Singapore — estimated AUD $80,000–$120,000 per month`,
          },
          {
            heading: 'Initial Red Flags to Note',
            body: `Before beginning CDD, take note of the following indicators:

• Cross-border transfers to high-volume trade corridors (HK, China, Singapore)
• Director is a foreign national with recent Australian PR status
• Business is relatively new (incorporated 2019 — only 5 years old)
• Transaction volumes are substantial for a small business
• Import/export sector is a known FATF typology for trade-based money laundering (TBML)

None of these red flags alone mean the customer is criminal — but together they inform a higher inherent risk rating and require thorough CDD.`,
          },
          {
            heading: 'Your Objective as the Analyst',
            body: `Complete the following steps before recommending approval or rejection:

1. Collect the required CDD documents for the entity and its director
2. Verify the identity of the entity and its beneficial owners
3. Assess the customer's ML/TF risk rating using your EWRA methodology
4. Determine whether Enhanced Due Diligence (EDD) is required
5. Document the onboarding decision and rationale — retained for 7 years`,
          },
        ],
      },
      {
        id: 'l1-2',
        title: 'CDD Document Collection',
        intro: 'For a corporate customer, your AML/CTF Part B program specifies the documents required to verify identity and understand the nature of the business relationship.',
        sections: [
          {
            heading: 'Entity Verification Documents',
            body: `Required for Ming Lee Trading Pty Ltd:

✓ ASIC Company Extract (current — showing registered address, directors, shareholders, and company status)
✓ ABN/ACN verification via the Australian Business Register (ABR) lookup
✓ Trust deed — not applicable here (no trust structure)
✓ Constitution or equivalent governing document (for companies above a size threshold)

The ASIC extract must be current (obtained within 30 days of onboarding). Older extracts may not reflect recent changes in directors or shareholders.`,
          },
          {
            heading: 'Director Identity Verification',
            body: `For James Wong — required documents:

✓ Passport (Singapore): Full name, DOB, passport number, country of issue, expiry date
✓ Australian PR visa evidence (visa grant notice or VEVO check)
✓ Residential address verification: recent utility bill or bank statement (within 3 months)

Verification method options under AUSTRAC guidance:
• Electronic verification via an approved DVSV provider (e.g., GreenID, Equifax, Illion)
• Manual document inspection with certified copies
• Video KYC for remote onboarding (acceptable with appropriate controls)

If using electronic verification: document the provider used, the match result, and the date of verification. Retain these records for 7 years.`,
          },
          {
            heading: 'Beneficial Ownership',
            body: `AUSTRAC requires identification of any individual who owns or controls 25% or more of the entity, or who otherwise exercises effective control.

For Ming Lee Trading Pty Ltd (as per ASIC extract):
• James Wong: 100% shareholder → CONFIRMED sole beneficial owner

No complex corporate structure or intermediary holding companies — verification is straightforward here.

If multiple shareholders each held less than 25%, you would need to identify the person exercising effective control — typically the CEO or managing director — even if they hold no equity stake.

Document the beneficial ownership structure with a diagram or written description. This is a key AUSTRAC audit point.`,
          },
          {
            heading: 'Source of Funds & Business Verification',
            body: `For a business customer, collect:

✓ Most recent 2 years of financial statements (Profit & Loss, Balance Sheet)
✓ Business Activity Statements (BAS) lodged with the ATO
✓ Supplier contracts or purchase orders confirming legitimate trade activity
✓ Bank statements for the last 3–6 months
✓ Explanation of source of initial capital (personal savings, business loan, investor funds)

For James Wong specifically:
— Declared Singapore business interests as prior source of wealth
— No adverse media found in initial open-source screening
— Financial statements show consistent revenue from wholesale trade activity

If statements are not available (new business), request a business plan and projected cash flows, and apply additional scrutiny.`,
          },
        ],
      },
      {
        id: 'l1-3',
        title: 'Risk Rating & Decision',
        intro: 'Your EWRA and Part A program define the risk factors and rating methodology. Apply them systematically to Ming Lee Trading to arrive at a documented risk rating.',
        sections: [
          {
            heading: 'Risk Factor Assessment',
            body: `Customer Risk:
• Business type: Import/export — MEDIUM-HIGH (known TBML typology per FATF)
• Director nationality: Singapore — LOW (FATF member, cooperative jurisdiction)
• Business age: 5 years — LOW-MEDIUM
• No prior adverse history found — neutral

Geographic Risk:
• Hong Kong — MEDIUM-HIGH (subject to FATF monitoring; elevated financial crime risk post-2020)
• Mainland China (Shenzhen) — MEDIUM (high-volume corridor; TBML risk)
• Singapore — LOW (strong AML regime; FATF member)

Product/Service Risk:
• International wire transfers: HIGH inherent risk product (anonymity, speed, cross-border)
• No cash transactions declared: reduces risk
• No virtual assets involved: reduces risk

Channel Risk:
• Remote onboarding (no face-to-face): MEDIUM uplift
• Electronic verification used: partially mitigates channel risk`,
          },
          {
            heading: 'Overall Risk Rating',
            body: `Applying your EWRA methodology to the above factors:

⚠️  OVERALL RATING: MEDIUM-HIGH

Consequence:
• EDD is required before onboarding approval
• Enhanced transaction monitoring rules must be applied
• Annual customer review (not biennial)
• Senior management (MLRO) sign-off required before account is opened
• Ongoing source of funds verification required for large or unusual transactions`,
          },
          {
            heading: 'EDD Requirements',
            body: `Given the MEDIUM-HIGH rating, the following EDD steps are mandatory:

1. SENIOR MANAGEMENT APPROVAL
The account cannot be opened by the analyst alone. Written sign-off required from the MLRO or Head of Compliance.

2. ENHANCED SOURCE OF FUNDS
Obtain and review actual supplier invoices and shipping/customs records to verify that trade flows match the declared transaction volumes of $80K–$120K/month.

3. PEP SCREENING
Full PEP screening of James Wong against World-Check or equivalent commercial database. Check spouse and close associates. Retain screening record and result.

4. ADVERSE MEDIA
Comprehensive search across English, Mandarin, and Cantonese media sources. Document what was searched and on what date.

5. ENHANCED MONITORING RULES
Apply dedicated monitoring: flag any transfers >$20,000, any deviation from stated business purpose, and any new counterparty countries not previously declared.`,
          },
          {
            heading: 'Documenting the Decision',
            body: `Your onboarding file must contain a written record of:

✓ All documents collected and their verification outcome
✓ Risk rating with written rationale for each factor scored
✓ EDD measures applied and findings (including PEP/sanctions results)
✓ Any residual concerns, conditions, or account restrictions applied
✓ Full approval chain: analyst assessment → MLRO sign-off → date of approval
✓ Date of next scheduled review (12 months from today for MEDIUM-HIGH)

Filing: All records retained for a minimum of 7 years from the date the relationship ends (AUSTRAC AML/CTF Rules s.105). Failure to maintain records attracts a civil penalty of up to $22.2 million.`,
          },
        ],
      },
      {
        id: 'l1-4',
        title: 'Ongoing CDD & Review Triggers',
        intro: 'CDD is not a one-time event. Ongoing Customer Due Diligence (OCDD) is a legal requirement under the AML/CTF Act. Your relationship with the customer must be monitored continuously.',
        sections: [
          {
            heading: 'What is OCDD?',
            body: `OCDD requires reporting entities to:

• Monitor customer transactions on an ongoing basis for unusual or suspicious activity
• Keep customer identification information current and up-to-date
• Identify changes in the customer's risk profile (new business lines, new jurisdictions, new UBOs)
• Conduct periodic reviews at a frequency proportionate to risk

Under AUSTRAC's AML/CTF Act s.36, you must maintain a system of ongoing due diligence that is appropriate to the level of ML/TF risk posed by each customer and designated service.`,
          },
          {
            heading: 'Periodic Review Schedule',
            body: `Review frequency is risk-based — calibrate to your EWRA methodology:

HIGH risk customers:       Review every 6–12 months
MEDIUM-HIGH risk:          Review annually
MEDIUM risk:               Review every 2 years
LOW risk:                  Review every 3 years

For Ming Lee Trading (MEDIUM-HIGH): Annual review required.

What to review at each periodic review:
• ASIC extract — any changes in directors or shareholders since last review?
• Financial statements — is business activity consistent with declared profile?
• Transaction activity — does volume/geography match the risk profile on file?
• PEP and sanctions re-screening
• Adverse media search since last review
• Re-confirm source of funds if major changes have occurred`,
          },
          {
            heading: 'Event-Driven Review Triggers',
            body: `A review must be triggered immediately (outside of the scheduled cycle) when:

🔴 HIGH PRIORITY — Act within 24–48 hours:
• Customer is identified as a PEP or linked to a PEP
• Customer appears on a sanctions list
• Law enforcement makes an inquiry about the customer
• Transaction matches a known ML typology or AUSTRAC typology advisory
• Customer's transaction pattern deviates significantly from declared purpose

🟡 MEDIUM PRIORITY — Act within 5–10 business days:
• Change of directors or significant shareholders (visible via ASIC extract)
• Customer moves into a new jurisdiction not previously disclosed
• Customer requests access to new products with higher inherent risk
• Source of funds explanation becomes inadequate based on new transaction activity

🟢 LOW PRIORITY — Address at next scheduled review:
• Minor contact information updates
• Small product changes within same risk tier
• Customer provides updated personal documents`,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    code: 'MOD-02',
    title: 'Core 3-Stage AML Workflow',
    subtitle: 'KYC → EWRA → Reporting obligations',
    duration: '30 min',
    level: 'Foundational',
    color: 'emerald',
    lessons: [
      {
        id: 'l2-1',
        title: 'Stage 1: Know Your Customer (KYC)',
        intro: 'KYC is the foundation of every AML/CTF program. Without knowing who your customer is, you cannot assess the risk they represent or detect suspicious activity in their transactions.',
        sections: [
          {
            heading: 'The Three Pillars of KYC',
            body: `PILLAR 1 — IDENTITY VERIFICATION
Who are they? Collect and verify:
• Full legal name (as it appears on official ID)
• Date of birth (individuals) or ABN/ACN (entities)
• Residential or registered address
• Nationality and residency status
• Photo ID: passport or driver's licence
• Electronic verification preferred for speed, auditability, and accuracy

PILLAR 2 — BENEFICIAL OWNERSHIP
Who ultimately owns or controls them?
• Identify all individuals with >25% ownership or effective control
• Look through corporate layers — shell companies, trusts, nominees
• Document the entire ownership chain with evidence
• AUSTRAC requires this for all non-individual customers

PILLAR 3 — NATURE & PURPOSE OF THE RELATIONSHIP
Why are they here? What do they intend to do?
• Source of funds (where does the money transacted come from?)
• Source of wealth (how did they accumulate their overall wealth?)
• Expected transaction profile: volume, frequency, counterparty countries
• Products and services they need and why`,
          },
          {
            heading: 'Customer Identification Procedure (CIP)',
            body: `Your AML/CTF Part B program must document your CIP in detail.

For individuals:
— Primary document: Passport or driver's licence (with photo)
— Secondary document: Medicare card, utility bill, bank statement
— Electronic verification: Via an AUSTRAC-compliant DVSV provider (GreenID, illion, Equifax)

For companies:
— ASIC extract verified against the ASIC primary source (not just a photocopy)
— Director identity verification (as per individual CIP for each director)
— Beneficial ownership declaration with supporting evidence
— Certified copies of constitutional documents for high-risk or complex structures

Timing rule (AUSTRAC):
You must verify identity BEFORE providing a designated service. In low-risk circumstances where verification is impractical before commencement, verification must occur as soon as practicable — and you must document the reason for the delay.`,
          },
          {
            heading: 'Standard CDD vs Enhanced Due Diligence (EDD)',
            body: `Standard CDD applies to all customers. EDD is applied where the risk is elevated.

CDD (Standard) — applied to all:
• Full identity verification
• Beneficial ownership identification
• Understanding the nature and purpose of the relationship
• Source of funds (at a standard level of evidence)
• Standard transaction monitoring

EDD (Enhanced) — mandatory when:
• Customer is identified as a PEP or PEP associate
• Customer is from a high-risk or FATF grey/black-listed jurisdiction
• Transaction profiles are unusual, high value, or structurally complex
• Business is in a high-risk sector: casinos, crypto/DCE, remittance, bullion
• Internal risk rating is HIGH or MEDIUM-HIGH

EDD additional steps:
• Senior management approval before relationship commences or continues
• Enhanced source of funds AND source of wealth documentation
• More frequent periodic reviews
• Elevated transaction monitoring thresholds
• Possible site visits or enhanced verification interviews`,
          },
        ],
      },
      {
        id: 'l2-2',
        title: 'Stage 2: Enterprise-Wide Risk Assessment (EWRA)',
        intro: 'The EWRA is the cornerstone of a risk-based AML/CTF program. It documents how your business identifies, assesses, and manages money laundering and terrorism financing risk across every service you offer.',
        sections: [
          {
            heading: 'What is an EWRA?',
            body: `An Enterprise-Wide Risk Assessment is a formal, documented process that:

• Identifies all ML/TF risks across your business and its designated services
• Assesses the likelihood and potential impact of each risk materialising
• Documents the controls you have in place to mitigate each identified risk
• Produces a residual risk rating for each risk, after controls are applied

AUSTRAC's legal requirement:
All reporting entities must maintain a current, documented EWRA as part of their Part A AML/CTF Program. It must be:
✓ In writing (a spreadsheet or formal document — not just in someone's head)
✓ Risk-based (not a box-ticking exercise)
✓ Reviewed and updated at least every 2 years, or after any significant business change
✓ Approved and signed off by senior management (Board or equivalent)`,
          },
          {
            heading: "AUSTRAC's 6 Risk Factors",
            body: `AUSTRAC's AML/CTF Rules specify six risk dimensions to assess in your EWRA:

1. CUSTOMER RISK
Who are your customers? Do you serve PEPs, foreign nationals, anonymous customers, high-risk occupations, cash-intensive businesses, or customers in high-risk sectors?

2. DESIGNATED SERVICE RISK
What services do you provide? Cash-heavy, international transfers, anonymous prepaid products, large or frequent cross-border transfers?

3. DELIVERY CHANNEL RISK
How do you provide services? Face-to-face (lower risk) vs fully remote/digital (higher risk due to anonymity). Agent networks add additional complexity.

4. JURISDICTION RISK
Where do your customers come from and transact to? Non-FATF member states, FATF grey/black-listed countries, high-corruption index nations (Transparency International CPI)?

5. NEW TECHNOLOGY RISK
Do you use emerging technology products? Crypto, digital wallets, instant payment rails, automated onboarding, biometric verification? New tech can reduce friction for both legitimate users and criminals.

6. ML/TF ENVIRONMENT RISK
What is the current threat landscape? AUSTRAC typology reports, FATF mutual evaluations, intelligence from Fintel Alliance, and ACIC organised crime assessments should all inform this factor.`,
          },
          {
            heading: 'How to Conduct Your EWRA — Step by Step',
            body: `STEP 1 — SCOPE
Map every designated service your business provides under the AML/CTF Act. Each must be assessed separately.

STEP 2 — INHERENT RISK ASSESSMENT
For each service and business unit, rate each of the 6 risk factors: LOW / MEDIUM / HIGH. Inherent risk = risk before any controls are applied.

STEP 3 — CONTROL ASSESSMENT
Document controls in place for each identified risk:
• Policies and procedures
• System-based controls (transaction monitoring, automated screening)
• Staff training and awareness
• Escalation and reporting lines

STEP 4 — CONTROL EFFECTIVENESS RATING
Rate each control: EFFECTIVE / PARTIALLY EFFECTIVE / INEFFECTIVE. An ineffective control does not reduce residual risk.

STEP 5 — RESIDUAL RISK
Combine inherent risk with control effectiveness. A HIGH inherent risk with EFFECTIVE controls may yield MEDIUM residual risk.

STEP 6 — TREATMENT PLAN
For MEDIUM or HIGH residual risks: document your risk treatment plan. Include additional controls, implementation timeline, and responsible owner.

STEP 7 — SENIOR MANAGEMENT APPROVAL
Present findings to the Board or senior leadership. Document approval in Board minutes. This is an AUSTRAC audit point.

STEP 8 — REVIEW SCHEDULE
Set the next review date. Minimum: every 2 years. Sooner if: business model changes, new products launch, new jurisdictions added, regulatory guidance is updated.`,
          },
        ],
      },
      {
        id: 'l2-3',
        title: 'Stage 3: Reporting Obligations',
        intro: 'Reporting to AUSTRAC is a legal obligation — not optional. Failure to report is a criminal offence. There are three primary report types applicable to most reporting entities.',
        sections: [
          {
            heading: 'Suspicious Matter Reports (SMRs)',
            body: `WHEN TO LODGE AN SMR:
Lodge when you have reasonable grounds to suspect a customer or transaction is related to:
• Money laundering or terrorism financing
• Proceeds of crime or a tax offence
• Evasion of a financial reporting obligation

TIMING:
• Within 24 hours if you suspect terrorism financing
• Within 3 business days for all other suspicions

HOW TO LODGE:
Via AUSTRAC Online. Your MLRO must review all SMRs before submission. Do not delay lodgement pending a final outcome — suspicion is the legal threshold, not proof.

⚠️ TIPPING OFF PROHIBITION:
You MUST NOT tell the customer, their associate, or any unauthorised person that an SMR has been lodged or that AUSTRAC is investigating. This is a criminal offence under s.123 of the AML/CTF Act.

COMMON SMR TRIGGERS:
• Customer is evasive about the source of funds or purpose of transactions
• Transactions are structurally inconsistent with declared business activity
• Customer terminates the relationship when asked for additional documentation
• Transactions match a known FATF or AUSTRAC ML typology
• Law enforcement contacts you about the customer prior to any SMR being lodged`,
          },
          {
            heading: 'Threshold Transaction Reports (TTRs)',
            body: `WHAT IS A TTR?
A TTR must be lodged for any physical currency transaction of AUD $10,000 or more (or the foreign currency equivalent on the transaction date).

WHO MUST LODGE?
All reporting entities that deal with physical cash — banks, credit unions, casinos, remittance providers, bullion dealers, and others.

TIMING:
Within 10 business days of the transaction.

STRUCTURING — A SEPARATE CRIMINAL OFFENCE:
If a person deliberately splits transactions to avoid the $10,000 threshold (known as structuring or smurfing), both the transaction AND the structuring behaviour must be reported. Structuring is a criminal offence under s.140 of the AML/CTF Act — penalties include imprisonment.

WHAT TO INCLUDE IN A TTR:
• Full identity of the customer (as verified)
• Amount and currency involved
• Nature of the transaction (deposit, withdrawal, foreign currency exchange)
• Date, time, and branch/location
• Whether the customer is acting on their own behalf or for a third party`,
          },
          {
            heading: 'International Funds Transfer Instructions (IFTIs)',
            body: `WHAT IS AN IFTI?
An IFTI must be lodged for any instruction to transfer funds into or out of Australia — this applies regardless of the amount.

TIMING:
Within 10 business days of the instruction being given or received.

WHAT TO INCLUDE:
• Sender: full name, address, and account number
• Recipient: full name, address, and financial institution
• Amount and currency
• Date the instruction was given
• Purpose of the transfer (if known or declared)
• Correspondent bank details (for SWIFT transfers)

SCOPE:
Applies to ALL cross-border wire transfers — SWIFT, remittance, correspondent banking. Does NOT apply to internal book transfers between Australian entities.

WHY IFTIS MATTER:
IFTIs are one of AUSTRAC's most powerful intelligence tools. They map money flows across borders and are used to identify financial crime networks, unexplained wealth, tax evasion, and terrorism financing. WESTPAC's failure to lodge 19.5 million IFTIs resulted in a $1.3 billion penalty in 2020.`,
          },
          {
            heading: 'Record Keeping — The 7-Year Rule',
            body: `AUSTRAC requires you to retain the following records for a minimum of 7 years:

✓ All CDD and EDD documents (identity verification, source of funds, beneficial ownership)
✓ All transaction records (date, amount, parties, purpose)
✓ All reports lodged (SMRs, TTRs, IFTIs) and the evidence that led to each
✓ Your AML/CTF Program — Part A and Part B (all versions)
✓ Staff training records and completion certificates
✓ Risk assessments and EWRA documentation
✓ Internal audit findings and management responses

STORAGE REQUIREMENTS:
• Records must be readily accessible for AUSTRAC examination on request
• Electronic storage is acceptable — must be retrievable in a readable format
• Encryption is acceptable if you can decrypt on demand for AUSTRAC

PENALTIES FOR BREACH:
• Failure to keep records: civil penalty up to $22.2 million per breach
• Failure to lodge a required report: up to $22.2 million per breach
• Deliberate non-compliance: criminal charges`,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    code: 'MOD-03',
    title: 'AUSTRAC E-Learning Overview',
    subtitle: 'Regulatory framework, obligations & enforcement',
    duration: '20 min',
    level: 'Regulatory',
    color: 'violet',
    lessons: [
      {
        id: 'l3-1',
        title: "AUSTRAC's Role & Key Legislation",
        intro: "AUSTRAC is Australia's financial intelligence unit and AML/CTF regulator. Understanding its dual role is fundamental to understanding your compliance obligations.",
        sections: [
          {
            heading: "AUSTRAC's Dual Role",
            body: `ROLE 1 — REGULATOR:
• Sets and enforces AML/CTF obligations for reporting entities under the AML/CTF Act 2006
• Issues AML/CTF Rules (legislative instruments with the force of law)
• Conducts compliance assessments, desk-based reviews, and on-site examinations
• Takes enforcement action — civil penalties, remedial directions, and court proceedings
• Supervises over 15,000 reporting entities across financial services, remittance, gambling, bullion, and digital currency sectors

ROLE 2 — FINANCIAL INTELLIGENCE UNIT (FIU):
• Collects, analyses, and disseminates financial intelligence
• Receives SMRs, TTRs, and IFTIs from reporting entities
• Shares intelligence with law enforcement: AFP, state police, ACIC, ATO, ASIC, ABF
• Member of the Egmont Group (international network of 170+ FIUs)
• Operates Fintel Alliance — a public-private partnership between AUSTRAC and major financial institutions`,
          },
          {
            heading: 'Key Legislation',
            body: `PRIMARY LEGISLATION:

Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (AML/CTF Act)
— Defines what a "reporting entity" is and what constitutes a "designated service"
— Sets the AML/CTF Program requirements (Part A and Part B)
— Establishes reporting obligations: SMRs, TTRs, and IFTIs
— Specifies civil and criminal penalties for non-compliance
— Grants AUSTRAC its powers of examination, investigation, and enforcement

Anti-Money Laundering and Counter-Terrorism Financing Rules Instrument 2007 (No. 1)
— Detailed operational requirements that sit under the Act
— Specifies CDD/KYC obligations in detail
— Prescribes the risk assessment approach
— Sets record keeping requirements (7-year minimum)

RELATED LEGISLATION:
• Proceeds of Crime Act 2002 — asset freezing and confiscation
• Criminal Code Act 1995 — money laundering and terrorism financing as criminal offences
• Financial Transaction Reports Act 1988 — legacy legislation for some cash dealers
• Charter of the United Nations Act 1945 — UN sanctions implementation in Australia`,
          },
          {
            heading: 'Who Must Comply — Reporting Entities',
            body: `A "reporting entity" is any business that provides a "designated service" listed in Schedule 1 or 2 of the AML/CTF Act.

FINANCIAL SERVICES:
• Banks, credit unions, building societies, authorised deposit-taking institutions
• General and life insurance providers (some products only)
• Stockbrokers, financial advisers, and dealers in financial instruments
• Mortgage brokers (in certain activities)

REMITTANCE:
• Remittance service providers (Western Union, MoneyGram, small community remitters)
• Foreign exchange dealers
All must be registered on AUSTRAC's Remittance Sector Register (RSR)

GAMBLING:
• Casinos (most comprehensive obligations in the sector)
• Gaming machine operators (limited obligations)
• Betting agencies (some obligations)

DIGITAL CURRENCY:
• Digital Currency Exchange (DCE) providers — buying/selling crypto for fiat
• Bitcoin ATM operators
• Custodial wallet providers (in some circumstances)
All DCEs must be registered with AUSTRAC

OTHER:
• Bullion dealers
• Pawnbrokers (in some circumstances)
• Trustees of unit trust schemes (some activities)

REGISTRATION IS MANDATORY. Carrying on a designated service without being registered with AUSTRAC is a criminal offence.`,
          },
        ],
      },
      {
        id: 'l3-2',
        title: 'AML/CTF Program Requirements',
        intro: 'Every reporting entity must have a documented AML/CTF Program. This is not discretionary — it is a legal requirement under s.81 of the AML/CTF Act.',
        sections: [
          {
            heading: 'Part A: Your Compliance Framework',
            body: `Part A of your AML/CTF Program must address:

1. MLRO APPOINTMENT
• Appoint a Money Laundering Reporting Officer (MLRO) — or equivalent role
• The MLRO must be a senior person with appropriate authority and seniority
• Responsibilities must be documented in writing (job description, delegation of authority)

2. ENTERPRISE-WIDE RISK ASSESSMENT (EWRA)
• Identify and assess ML/TF risks across all designated services
• Review and update at least every 2 years — or after significant business change

3. BOARD & SENIOR MANAGEMENT OVERSIGHT
• The Board must approve the AML/CTF Program
• Senior management must receive regular AML compliance reporting
• Annual Board-level AML/CTF compliance report is AUSTRAC best practice

4. INDEPENDENT REVIEW
• Part A must be independently reviewed at least every 3 years
• The review must assess effectiveness, not just document that controls exist
• Findings must be reported to senior management with action items

5. EMPLOYEE DUE DILIGENCE
• Screen employees in ML/TF risk-relevant roles (background checks, reference checks)
• Ongoing monitoring of employee conduct — report internal suspicious behaviour
• Whistleblower pathway for staff to report concerns without fear of retaliation

6. STAFF TRAINING
• All relevant employees must receive AML/CTF training appropriate to their role
• Training must be completed before the employee begins risk-relevant duties
• Refresher training required periodically (annually is best practice)
• Training records retained for 7 years`,
          },
          {
            heading: 'Part B: Customer Identification Program (CIP)',
            body: `Part B specifies your rules for identifying and verifying who your customers are.

FOR INDIVIDUALS, your CIP must specify:
• Primary ID documents accepted (passport, driver's licence)
• Secondary ID documents accepted (Medicare, utility bill, bank statement)
• Electronic verification procedures and approved providers (DVSV)
• Procedures when identity cannot be verified (decline, delay, or apply additional controls)
• Special cases: customers with no fixed address, minors, customers with disability

FOR COMPANIES, TRUSTS & PARTNERSHIPS, your CIP must specify:
• How you verify the entity via ASIC (or equivalent for foreign entities)
• How you identify and verify directors and beneficial owners
• Beneficial ownership threshold (25% — in line with FATF guidance)
• How you handle complex corporate structures (multiple layers, offshore entities)

ADDITIONAL PART B ELEMENTS:
• PEP identification and EDD procedure
• Non-face-to-face customer onboarding procedure
• Reliance on third-party CDD (documentation and legal requirements)
• Correspondent bank CDD procedure
• When and how you can rely on another reporting entity's CDD`,
          },
          {
            heading: "AUSTRAC's Official E-Learning Modules",
            body: `AUSTRAC provides free e-learning for reporting entities through AUSTRAC Online. These modules are considered by AUSTRAC as a benchmark for staff training.

MODULE A — Introduction to AML/CTF
What is money laundering and terrorism financing, the three stages, and why compliance matters.

MODULE B — Your AML/CTF Obligations
What it means to be a reporting entity, designated services, and registration requirements.

MODULE C — AML/CTF Program
What must be in Part A and Part B, the risk-based approach, common compliance failures.

MODULE D — Reporting to AUSTRAC
Step-by-step guidance on lodging SMRs, TTRs, and IFTIs through AUSTRAC Online. Tipping off prohibition explained.

MODULE E — Know Your Customer
CDD and EDD requirements, beneficial ownership identification, PEPs, and high-risk customers.

MODULE F — Risk Assessment
Conducting an EWRA, the 6 risk factors, FATF alignment, and documenting your assessment.

MODULE G — Digital Currency Exchange
DCE-specific obligations, registration requirements, and sector-specific red flags.

ACCESS: All modules are free via AUSTRAC Online after registering as a reporting entity. Completion can be documented as part of your staff training records.`,
          },
        ],
      },
      {
        id: 'l3-3',
        title: 'AUSTRAC Enforcement & Fintel Alliance',
        intro: "AUSTRAC has broad and powerful enforcement tools. Understanding enforcement history is one of the most effective ways to internalise what non-compliance looks like in practice.",
        sections: [
          {
            heading: "AUSTRAC's Enforcement Powers",
            body: `CIVIL PENALTIES:
• Up to $22.2 million per contravention for a body corporate
• Up to $4.4 million per contravention for an individual
• A single enforcement action can allege hundreds or thousands of contraventions — making penalties potentially reach into the billions

INFRINGEMENT NOTICES:
• Fixed-penalty tool for minor or technical breaches
• Paid without requiring a court proceeding
• No admission of liability is required

REMEDIAL DIRECTIONS:
• AUSTRAC can direct a reporting entity to take specific steps to improve compliance
• Non-compliance with a remedial direction is itself a separate offence

ENFORCEABLE UNDERTAKINGS:
• A formal commitment by the reporting entity to address identified compliance failures
• Published on AUSTRAC's website — public reputational impact
• Often accompanied by an independent compliance audit requirement

LICENCE / REGISTRATION CANCELLATION:
• AUSTRAC can cancel the registration of a remittance dealer or DCE
• Operating without registration after cancellation is a criminal offence

CRIMINAL REFERRALS:
• AUSTRAC can refer matters to the AFP for criminal investigation
• Money laundering under the Criminal Code Act 1995 carries up to 25 years imprisonment`,
          },
          {
            heading: 'Landmark Enforcement Actions',
            body: `WESTPAC (2020) — AUD $1.3 BILLION
23 million contraventions of the AML/CTF Act, including:
• Failure to lodge IFTIs for over 19.5 million international transfer instructions
• Transactions linked to child exploitation material in South-East Asia
• Systemic failures in correspondent banking oversight and controls
• Failure to terminate high-risk correspondent banking relationships
Outcome: Largest corporate penalty in Australian history at the time of settlement.

COMMONWEALTH BANK (2018) — AUD $700 MILLION
53,700+ contraventions, including:
• Failure to lodge TTRs for 53,506 cash deposits through Intelligent Deposit Machines (IDMs)
• Root cause: a software coding error during an IDM upgrade went undetected for 3 years
• Inadequate transaction monitoring for suspicious patterns in IDM usage
• Delayed SMR lodgements
Lesson: AUSTRAC does not accept "system error" as a complete defence. Governance and testing obligations apply to technology as well as processes.

TABCORP (2017) — AUD $45 MILLION
100+ breaches, including:
• Inadequate AML/CTF program and risk assessment
• Failure to conduct EDD on high-risk gambling customers
• Insufficient employee training across the group

KEY LESSONS FROM ALL ENFORCEMENT:
• Systemic failures attract the largest penalties
• Self-reporting and cooperation with AUSTRAC are mitigating factors
• AUSTRAC uses a risk-based approach to enforcement priority — higher risk exposure → closer scrutiny`,
          },
          {
            heading: 'Fintel Alliance',
            body: `WHAT IS FINTEL ALLIANCE?
Fintel Alliance is AUSTRAC's flagship public-private partnership — a collaboration between AUSTRAC, major Australian financial institutions, and government agencies to share financial intelligence and disrupt financial crime in real time.

FOUNDING MEMBERS INCLUDE:
• Major Australian banks (ANZ, CBA, NAB, Westpac, Macquarie)
• Austrade, AFP, ABF, ACIC, ATO
• AUSTRAC as the coordinating body

HOW IT WORKS:
• Financial institutions share typologies, red flags, and case intelligence with AUSTRAC and each other (within privacy law constraints)
• AUSTRAC provides de-identified intelligence back to industry partners
• Joint analytical work identifies financial crime networks that no single institution would detect alone
• Financial institutions can receive real-time alerts about emerging threats

OUTCOMES:
• Identification of child exploitation financing networks
• Disruption of drug trafficking money flows
• Detection of tax evasion and superannuation fraud schemes
• Counter-terrorism financing investigations

WHY IT MATTERS TO COMPLIANCE OFFICERS:
• Fintel Alliance typology reports are publicly available and should inform your EWRA and transaction monitoring red flags
• Participation demonstrates an institution's commitment to combating financial crime (mitigating factor in enforcement)
• Intelligence from Fintel Alliance informs AUSTRAC's supervisory priorities`,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    code: 'MOD-04',
    title: 'Sanctions & PEP Screening',
    subtitle: 'Practical screening guidance for compliance analysts',
    duration: '20 min',
    level: 'Intermediate',
    color: 'orange',
    lessons: [
      {
        id: 'l4-1',
        title: 'Understanding Sanctions Regimes',
        intro: 'Sanctions are legal restrictions imposed by governments or international bodies on specific individuals, entities, countries, or sectors. Compliance with sanctions is a distinct obligation from AML — but the two are closely interrelated.',
        sections: [
          {
            heading: 'Types of Sanctions Regimes',
            body: `UN SANCTIONS (United Nations Security Council):
• Legally binding on all 193 UN member states under the UN Charter
• Implemented in Australia via the Charter of the United Nations Act 1945
• Targets: terrorist groups (Al-Qaeda, ISIS/ISIL), proliferation networks, human rights violators
• Examples: North Korea (nuclear/missile programme), Iran (nuclear sanctions), Mali, Sudan

AUSTRALIAN AUTONOMOUS SANCTIONS (DFAT):
• Imposed by Australia independently of the UN
• Russia — comprehensive sanctions since the 2022 Ukraine invasion
• Myanmar — following the 2021 military coup
• Belarus, Iran, Libya, Syria — various sector and individual sanctions
• Administered by the Department of Foreign Affairs and Trade (DFAT)

US OFAC SANCTIONS:
• Not legally binding outside the US — but critically important for USD-clearing banks and global businesses
• SDN List (Specially Designated Nationals): the most widely screened list globally
• Any entity that clears USD or has US nexus must comply with OFAC
• Secondary sanctions risk: non-US companies can face penalties for dealings with SDN-listed persons

EU & UK SANCTIONS:
• EU sanctions apply to EU-incorporated entities and EU nationals globally
• Post-Brexit, the UK runs its own Consolidated List via OFSI (Office of Financial Sanctions Implementation)
• Both regimes impose asset freezes and prohibitions on making funds available`,
          },
          {
            heading: 'What to Screen and When',
            body: `PARTIES TO SCREEN:
• The customer (individual or entity)
• All directors, officers, and authorised signatories
• Beneficial owners (UBOs) at every tier of the structure
• Counterparties on each transaction (sender and recipient)
• Correspondent and intermediary banks in a payment chain
• Countries involved (origin and destination jurisdictions)
• Vessels and aircraft (for trade finance and cargo transactions)

WHEN TO SCREEN:
• At onboarding — before providing any designated service
• Before processing each transaction instruction
• On an ongoing basis — sanctions lists update frequently (often daily)
• When customer information changes (new director, new country)
• When a new sanctions designation is issued — retrospective screening of all existing customers

SANCTIONS LIST UPDATE FREQUENCY:
• OFAC SDN: Multiple times per week — sometimes daily during active geopolitical events
• Australian DFAT Consolidated List: Updated periodically — subscribe to DFAT alerts
• UN Consolidated List: Updated irregularly — sometimes daily during active crises
• UK OFSI: Updated multiple times per week
• EU Official Journal: Updated multiple times per week`,
          },
          {
            heading: 'Name Matching, Fuzzy Logic & False Positives',
            body: `THE NAME MATCHING CHALLENGE:
Sanctions lists contain names in many languages, scripts, and transliterations. Manual checking is impractical for any real transaction volume.

COMMON MATCHING CHALLENGES:
• Arabic names: Mohamed / Mohammed / Muhammad / Muhammed (all valid transliterations of the same name)
• Chinese names: Order is reversed in Western databases (surname first vs given name first)
• Russian names: Patronymics, multiple romanisations (Mikhail / Mikhael / Michael / Michail)
• Corporate entities: Abbreviations differ (Ltd / Limited / Pty Ltd), missing articles (The, Al-, El-)

FUZZY MATCHING TECHNIQUES:
• Soundex / Metaphone: phonetic matching — "sounds like" matching
• Levenshtein distance: counts the number of character edits between two strings
• Token matching: matches individual words regardless of order
• Configurable threshold: typically 85–95% similarity triggers a manual review alert

BEST PRACTICE:
• Use a purpose-built screening tool: Dow Jones Risk & Compliance, Refinitiv World-Check, LexisNexis Bridger, Accuity (now Firco)
• Calibrate your match threshold — too high = missed hits, too low = alert fatigue
• Document the threshold chosen and the rationale in your EWRA
• Human review required for all alerts above your match threshold

FALSE POSITIVE MANAGEMENT:
• Common names (e.g., Ali Hassan, John Smith) generate many false positives
• Use DOB, nationality, address, and context to differentiate real matches from false positives
• Document every alert disposition: "Cleared — different DOB and nationality confirmed" or "Escalated to MLRO"
• Cleared alert records must be retained for 7 years`,
          },
        ],
      },
      {
        id: 'l4-2',
        title: 'PEP Identification & EDD',
        intro: 'Politically Exposed Persons represent elevated ML risk due to their access to public funds, influence over government decisions, and potential exposure to corruption. Every reporting entity must have a documented PEP procedure.',
        sections: [
          {
            heading: 'Who is a PEP?',
            body: `PEPs are individuals who hold (or have held) prominent public functions, and their close associates.

DOMESTIC PEPs (Australia):
• Members of Parliament — federal and state/territory
• Senior public servants (SES Band 3 and above)
• Judges of the Federal Court, Federal Circuit Court, and High Court
• Senior military officers (3-star equivalent: Lieutenant General, Vice Admiral, Air Marshal)
• Senior executives of state-owned enterprises (e.g., Australia Post, NBN Co)

FOREIGN PEPs:
• Heads of state and government (Presidents, Prime Ministers, Monarchs)
• Senior government ministers
• Senior military and judicial officials
• Senior executives of foreign state-owned companies
• Ambassadors, high commissioners, and senior diplomatic officials

INTERNATIONAL ORGANISATION PEPs:
• Senior officials of international bodies: UN Secretariat, IMF, World Bank, FATF, ADB, OECD, WHO
• Elected or appointed heads of intergovernmental organisations

CLOSE ASSOCIATES (often called "PEP-adjacent"):
• Spouse or de facto partner
• Children (and their partners)
• Parents and siblings
• Known business partners with a significant financial relationship
• Senior advisers known to have close personal relationships with the PEP

PEP STATUS DURATION:
• A person who leaves a prominent public role is still treated as a PEP for a minimum of 12 months
• Apply a risk-based judgement for longer: a former president remains elevated risk longer than a retired local councillor`,
          },
          {
            heading: 'EDD Requirements for PEPs',
            body: `MANDATORY EDD STEPS when a PEP is identified:

1. SENIOR MANAGEMENT APPROVAL
The business relationship cannot be established or continued without written approval from a senior manager — not just the analyst or their line manager. The MLRO or Head of Compliance must sign off.

2. ENHANCED SOURCE OF FUNDS
Detailed, documented evidence of where the funds being transacted originate. For example: salary slips, government appointment records, dividend statements, property sale proceeds.

3. ENHANCED SOURCE OF WEALTH
How did the PEP accumulate their overall net worth? This goes beyond the current transaction — it looks at the PEP's entire financial history: inheritances, business sales, investments, property.

4. PURPOSE OF THE RELATIONSHIP
Clearly document why the PEP needs your services and what they will use them for. Review this at each periodic review.

5. ENHANCED ONGOING MONITORING
Apply elevated transaction monitoring thresholds and more frequent adverse media checks (quarterly minimum). Flag any transactions that are inconsistent with the PEP's declared source of wealth.

DOMESTIC vs FOREIGN PEP RISK CALIBRATION:
• Foreign PEPs carry higher inherent risk because oversight mechanisms in their home country may be weaker or more corrupt
• Domestic Australian PEPs may be assessed as MEDIUM-HIGH risk with appropriate EDD controls applied
• Apply proportionate, risk-based assessment — a local councillor is not the same risk as a foreign head of state controlling a sovereign wealth fund`,
          },
          {
            heading: 'Adverse Media Screening',
            body: `Adverse media (negative news) screening is a critical complement to sanctions and PEP list screening. A person may not appear on any list — but may still be the subject of credible financial crime allegations in the media.

WHAT TO SEARCH FOR:
• Money laundering allegations, charges, or convictions
• Fraud, corruption, or bribery
• Tax evasion, unexplained wealth, or hidden assets
• Drug trafficking, organised crime association
• Human rights abuses or involvement in atrocities
• Regulatory enforcement actions or licence revocations
• Association with known criminal entities or sanctioned persons

SOURCES TO USE:
• Major international media: Reuters, BBC, AP, AFP, Bloomberg, Wall Street Journal
• Local-language media using translation tools (Google Translate for preliminary scan)
• AUSTRAC typology reports and intelligence advisories
• Transparency International Corruption Perceptions Index (jurisdiction risk)
• Commercial databases: Dow Jones, World-Check, LexisNexis
• Court records, insolvency registers, and ASIC enforcement actions

THE SCREENING PROCESS:
1. Search customer name + common variations and misspellings
2. Search director/beneficial owner names separately
3. Search the business name and any trading names
4. Document: what search terms were used, what sources were checked, what date the search was conducted
5. Record the outcome: "No adverse media found" or "Adverse media identified — see escalation note"

IMPORTANT: A positive adverse media result is NOT an automatic declination. Assess the credibility and relevance of the source. Old, unverified, or clearly erroneous reports may be discounted with documented rationale. Credible, recent, relevant reports must be escalated to the MLRO for a disposition decision.`,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    code: 'MOD-05',
    title: 'Industry Glossary & FATF Reference',
    subtitle: 'Key terms, definitions & FATF 40 Recommendations',
    duration: '15 min',
    level: 'Reference',
    color: 'slate',
    lessons: [
      {
        id: 'l5-1',
        title: 'Core AML/CTF Glossary — A to M',
        intro: 'A comprehensive reference guide to AML/CTF terminology. Precision in language is critical when communicating with regulators, law enforcement, and senior management.',
        sections: [
          {
            heading: 'A – C',
            body: `AML (Anti-Money Laundering)
Laws, regulations, and procedures designed to prevent criminals from disguising illegally obtained funds as legitimate income.

AUSTRAC (Australian Transaction Reports and Analysis Centre)
Australia's AML/CTF regulator and financial intelligence unit. Regulates over 15,000 reporting entities. Dual role: regulatory enforcement + financial intelligence analysis.

Beneficial Owner
The natural person(s) who ultimately own or control an entity, or on whose behalf a transaction is conducted. FATF and AUSTRAC define this as 25%+ ownership or effective control through other means.

BSA (Bank Secrecy Act)
US federal law (1970) requiring US financial institutions to assist government agencies in detecting and preventing money laundering. Administered by FinCEN.

CDD (Customer Due Diligence)
The process of verifying a customer's identity, understanding their business, assessing their ML/TF risk, and monitoring their transactions on an ongoing basis. The baseline AML obligation.

CIP (Customer Identification Program)
The documented procedures within your AML/CTF Part B Program for collecting and verifying customer identity. Must specify acceptable documents, verification methods, and exceptions.

Correspondent Banking
A relationship where one bank (the correspondent) provides services to another bank (the respondent), typically in a different jurisdiction. High ML/TF risk due to limited visibility into the respondent bank's customers.

CTF (Counter-Terrorism Financing)
Measures to detect, prevent, and disrupt the financing of terrorism. Often paired with AML as "AML/CTF."

CTR (Currency Transaction Report)
The US equivalent of AUSTRAC's Threshold Transaction Report (TTR). Filed with FinCEN for cash transactions exceeding USD $10,000.`,
          },
          {
            heading: 'D – M',
            body: `DCE (Digital Currency Exchange)
An Australian reporting entity that exchanges fiat currency for digital currency (e.g., Bitcoin, Ethereum) or vice versa. Must be registered with AUSTRAC. Subject to full AML/CTF obligations including CDD, SMR lodgement, and program requirements.

EDD (Enhanced Due Diligence)
Additional verification and monitoring measures applied to high-risk customers, PEPs, high-risk jurisdictions, or high-risk transactions. Includes senior management approval, enhanced source of funds, and more frequent periodic reviews.

Egmont Group
An international network of 170+ Financial Intelligence Units (FIUs) that facilitates intelligence sharing and operational cooperation across borders to combat financial crime.

EWRA (Enterprise-Wide Risk Assessment)
A formal, documented assessment of all ML/TF risks facing a reporting entity across its designated services. Required by AUSTRAC as part of the AML/CTF Part A Program. Must be reviewed at least every 2 years.

FATF (Financial Action Task Force)
An intergovernmental policy-making body that sets the international standard for AML/CFT through its 40 Recommendations. Conducts mutual evaluations of member countries. Members: 37 countries plus 2 regional organisations.

FinCEN (Financial Crimes Enforcement Network)
The US equivalent of AUSTRAC — a bureau of the US Treasury Department that receives, analyses, and disseminates financial intelligence. Administers the BSA.

Fintel Alliance
AUSTRAC's public-private intelligence-sharing partnership with major Australian financial institutions and government agencies.

FIU (Financial Intelligence Unit)
A national body that receives, analyses, and disseminates financial intelligence. AUSTRAC is Australia's FIU. All FIUs are members of the Egmont Group.

IFTI (International Funds Transfer Instruction)
An instruction to transfer funds into or out of Australia. Must be reported to AUSTRAC within 10 business days regardless of amount.

KYC (Know Your Customer)
The process of identifying and verifying a customer's identity, understanding their business and risk profile, and establishing the nature and purpose of the business relationship.

Layering
The second stage of money laundering — the process of moving funds through multiple transactions, jurisdictions, and entities to obscure the audit trail and distance the funds from their criminal origin.

ML (Money Laundering)
The process of making illegally obtained funds appear legitimate. Three stages: placement (introducing cash into the financial system), layering (obscuring the origin), and integration (using funds as clean money).

MLRO (Money Laundering Reporting Officer)
The designated senior officer responsible for overseeing AML/CTF compliance within a reporting entity, receiving internal suspicious matter referrals, and authorising the lodgement of SMRs with AUSTRAC.`,
          },
        ],
      },
      {
        id: 'l5-2',
        title: 'Core AML/CTF Glossary — N to Z',
        intro: 'Continuation of the AML/CTF glossary, covering the remaining essential terms for MLROs and compliance analysts.',
        sections: [
          {
            heading: 'N – S',
            body: `OCDD (Ongoing Customer Due Diligence)
The legal obligation to monitor a customer relationship on a continuing basis, keep information current, identify changes in risk profile, and conduct periodic reviews. Required under s.36 of the AML/CTF Act.

OFAC (Office of Foreign Assets Control)
US Treasury agency that administers and enforces US economic and trade sanctions. Maintains the SDN (Specially Designated Nationals) list — the most widely checked sanctions list globally.

PEP (Politically Exposed Person)
An individual who holds or has held a prominent public function, including heads of state, senior government officials, senior military and judicial officers, and senior executives of state-owned enterprises. Includes close family members and known associates.

Placement
The first stage of money laundering — the initial introduction of criminal proceeds into the legitimate financial system (e.g., depositing cash at a bank, using cash to purchase assets).

Proceeds of Crime
Assets that represent the direct or indirect benefit of criminal activity. Subject to confiscation under the Proceeds of Crime Act 2002 (Australia).

SAR (Suspicious Activity Report)
The US equivalent of AUSTRAC's SMR. Filed with FinCEN when a financial institution suspects a transaction involves money laundering, fraud, or other financial crime.

SDN (Specially Designated National)
A person or entity listed on OFAC's SDN List. US persons are prohibited from dealing with SDNs. Non-US entities face secondary sanctions risk for dealings with SDNs in USD or through US financial infrastructure.

SMR (Suspicious Matter Report)
The Australian equivalent of a SAR. Must be lodged with AUSTRAC within 3 business days (24 hours for TF suspicion) when a reporting entity has reasonable grounds to suspect ML, TF, or related financial crime.

Structuring (Smurfing)
The deliberate splitting of large transactions into smaller amounts to fall below reporting thresholds (e.g., $10,000 TTR threshold). A criminal offence under s.140 of the AML/CTF Act. Both the structuring behaviour AND the underlying transactions must be reported.`,
          },
          {
            heading: 'T – Z',
            body: `TBML (Trade-Based Money Laundering)
The use of legitimate trade transactions to move value across borders and launder criminal proceeds. Common typologies:
• Over-invoicing: importer pays more than the goods are worth — excess value transferred to exporter
• Under-invoicing: importer pays less — value transferred to importer in the destination country
• Multiple invoicing: same shipment invoiced multiple times across multiple parties
• Falsely described goods: misrepresenting the quality or quantity of goods on shipping documents

TF (Terrorism Financing)
The provision, collection, or processing of funds with the intention, or knowledge, that they will be used to carry out a terrorist act or to benefit a terrorist organisation. A criminal offence under Division 103 of the Criminal Code Act 1995.

Tipping Off
The disclosure — to a customer, their associate, or any unauthorised person — that a suspicious matter report has been lodged, or that an investigation is underway. A criminal offence under s.123 of the AML/CTF Act. Penalties: up to 2 years imprisonment and/or a significant financial penalty.

TTR (Threshold Transaction Report)
A report filed with AUSTRAC for any physical currency transaction of AUD $10,000 or more (or foreign currency equivalent). Must be lodged within 10 business days of the transaction.

UBO (Ultimate Beneficial Owner)
See "Beneficial Owner" — the natural person(s) at the top of an ownership chain who ultimately own or control an entity. Sometimes used interchangeably with "beneficial owner."

VEVO (Visa Entitlement Verification Online)
An Australian Department of Home Affairs tool used to verify an individual's visa status and entitlements. Useful for verifying foreign national customers' residency status during CDD.

Wolfsberg Group
An association of 13 global banks that develops financial crime risk management standards, guidance, and best practice for AML, sanctions, and anti-bribery and corruption.`,
          },
        ],
      },
      {
        id: 'l5-3',
        title: 'FATF 40 Recommendations — Reference Guide',
        intro: "The FATF 40 Recommendations are the global AML/CFT standard. Every compliance professional should understand their structure and the key recommendations that directly impact their daily work.",
        sections: [
          {
            heading: 'Structure of the 40 Recommendations',
            body: `The 40 Recommendations are grouped into 7 thematic areas:

A. AML/CFT POLICIES AND COORDINATION (Rec. 1–2)
  Rec. 1:  Risk-based approach — the foundation of modern AML
  Rec. 2:  National cooperation and coordination

B. MONEY LAUNDERING AND CONFISCATION (Rec. 3–4)
  Rec. 3:  Money laundering offence
  Rec. 4:  Confiscation and provisional measures

C. TERRORISM FINANCING & PROLIFERATION FINANCING (Rec. 5–8)
  Rec. 5:  Terrorism financing offence
  Rec. 6:  Targeted financial sanctions — terrorism and TF
  Rec. 7:  Targeted financial sanctions — proliferation (WMD)
  Rec. 8:  Non-profit organisations (NPOs) — TF misuse prevention

D. PREVENTIVE MEASURES (Rec. 9–23)
  Rec. 9:  Financial institution secrecy — cannot be used as a barrier to compliance
  Rec. 10: Customer due diligence
  Rec. 11: Record keeping (minimum 5 years under FATF; 7 years under AUSTRAC)
  Rec. 12: Politically exposed persons
  Rec. 13: Correspondent banking
  Rec. 14: Money or value transfer services (MVTS)
  Rec. 15: New technologies — risk assessment required before launch
  Rec. 16: Wire transfers — the "Travel Rule" (originator and beneficiary info must travel with funds)
  Rec. 17: Reliance on third parties for CDD
  Rec. 18: Internal controls — including foreign branches and subsidiaries
  Rec. 19: Higher-risk countries — apply EDD for FATF grey/black-listed jurisdictions
  Rec. 20: Reporting of suspicious transactions (STRs/SARs/SMRs)
  Rec. 21: Tipping-off and confidentiality
  Rec. 22: DNFBPs — CDD (Designated Non-Financial Businesses and Professions)
  Rec. 23: DNFBPs — Other measures

E. TRANSPARENCY AND BENEFICIAL OWNERSHIP (Rec. 24–25)
  Rec. 24: Transparency of legal persons — beneficial ownership registers
  Rec. 25: Transparency of legal arrangements — trusts and similar structures

F. POWERS AND RESPONSIBILITIES OF COMPETENT AUTHORITIES (Rec. 26–35)
  Rec. 26–28: Regulation, supervision, and powers of financial intelligence units
  Rec. 29–32: Law enforcement and operational powers
  Rec. 33–35: General and statistical requirements

G. INTERNATIONAL COOPERATION (Rec. 36–40)
  Rec. 36–38: Mutual legal assistance and extradition
  Rec. 39–40: Other forms of international cooperation`,
          },
          {
            heading: 'Key Recommendations for Compliance Officers',
            body: `REC. 1 — RISK-BASED APPROACH
The cornerstone of all modern AML. Countries and institutions must identify, assess, and understand their ML/TF risks, and direct resources proportionately. High-risk = more controls. Low-risk = simplified measures permitted.

REC. 10 — CUSTOMER DUE DILIGENCE
Requires FIs to:
• Verify customer identity using reliable, independent documents
• Identify and verify beneficial owners
• Understand the nature and purpose of the relationship
• Conduct ongoing monitoring
• Apply EDD for high-risk situations — PEPs, high-risk countries, complex structures

REC. 12 — POLITICALLY EXPOSED PERSONS
EDD for all PEPs. Senior management approval, source of wealth and funds, enhanced monitoring. A PEP's lower-risk status can be reassessed over time, but never eliminated entirely.

REC. 16 — THE WIRE TRANSFER TRAVEL RULE
Originator and beneficiary information must accompany every wire transfer. Gaps in this information are a red flag. Critically, FATF has extended this to virtual asset transfers — the "VASP Travel Rule" requires crypto exchanges to share sender/recipient data.

REC. 20 — SUSPICIOUS TRANSACTION REPORTING
FIs must report to the FIU when they suspect ML, TF, or related offences. The threshold is reasonable suspicion — not proof. Failure to report is a criminal offence.

REC. 21 — TIPPING OFF
Confidentiality of STR lodgement is mandatory. Criminal offence to disclose to the subject or their associate.

REC. 24 — BENEFICIAL OWNERSHIP OF LEGAL PERSONS
Countries must ensure that accurate, current beneficial ownership information is available to competent authorities in a timely manner. The driver behind Australia's proposed beneficial ownership register.`,
          },
          {
            heading: "FATF Mutual Evaluations & Australia's AML Regime",
            body: `WHAT IS A MUTUAL EVALUATION?
A peer-review assessment conducted by FATF (or FATF-Style Regional Bodies) of a member country's AML/CFT framework. Assessed against two dimensions:
• Technical compliance: Are the laws and regulations in place?
• Effectiveness: Are those measures actually achieving outcomes? (11 Immediate Outcomes rated)

RATINGS:
Technical: Compliant (C) / Largely Compliant (LC) / Partially Compliant (PC) / Non-Compliant (NC)
Effectiveness: High / Substantial / Moderate / Low

AUSTRALIA'S 2015 MUTUAL EVALUATION — KEY FINDINGS:
• Australia was rated "Largely Compliant" or better on most technical recommendations
• KEY GAPS IDENTIFIED:
  — Designated Non-Financial Businesses & Professions (DNFBPs) not yet covered by AML/CTF Act (lawyers, accountants, real estate agents — still unregulated as of 2024)
  — Beneficial ownership transparency: no central register existed
  — Real estate sector: significant ML vulnerability with no reporting obligations
• Follow-up assessment (2018): improvements noted in some areas; gaps remain

AUSTRALIA'S NEXT MUTUAL EVALUATION:
Expected in the 2025–2026 FATF evaluation cycle. The outcome will have significant implications for Australian reporting entities — any areas of non-compliance identified will likely lead to new regulatory obligations or intensified supervision.

FATF GREY LIST (Jurisdictions Under Increased Monitoring):
• Countries with strategic deficiencies receive increased monitoring status
• Transactions involving grey-listed jurisdictions require a risk uplift in your EWRA and screening
• Check FATF's website for the current list — it changes at every FATF Plenary (3 times per year)
• Subscribe to AUSTRAC alerts for immediate notification of FATF list changes`,
          },
        ],
      },
    ],
  },
]

const COLORS = {
  blue: {
    icon: 'bg-blue-600',
    badge: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
    active: 'bg-blue-600/15 text-blue-300 border-blue-600/30',
    heading: 'text-blue-400',
    number: 'bg-blue-600/20 text-blue-400',
  },
  emerald: {
    icon: 'bg-emerald-600',
    badge: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
    active: 'bg-emerald-600/15 text-emerald-300 border-emerald-600/30',
    heading: 'text-emerald-400',
    number: 'bg-emerald-600/20 text-emerald-400',
  },
  violet: {
    icon: 'bg-violet-600',
    badge: 'bg-violet-600/20 text-violet-400 border border-violet-600/30',
    active: 'bg-violet-600/15 text-violet-300 border-violet-600/30',
    heading: 'text-violet-400',
    number: 'bg-violet-600/20 text-violet-400',
  },
  orange: {
    icon: 'bg-orange-600',
    badge: 'bg-orange-600/20 text-orange-400 border border-orange-600/30',
    active: 'bg-orange-600/15 text-orange-300 border-orange-600/30',
    heading: 'text-orange-400',
    number: 'bg-orange-600/20 text-orange-400',
  },
  slate: {
    icon: 'bg-slate-600',
    badge: 'bg-slate-600/20 text-slate-400 border border-slate-600/30',
    active: 'bg-slate-700/40 text-slate-300 border-slate-600/30',
    heading: 'text-slate-400',
    number: 'bg-slate-700 text-slate-400',
  },
}

export default function Training({ onBack, onSignOut, user }) {
  const [activeMod, setActiveMod] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)

  const openModule = (mod) => {
    setActiveMod(mod)
    setActiveLesson(mod.lessons[0])
  }

  const lessonIndex = activeMod && activeLesson
    ? activeMod.lessons.findIndex((l) => l.id === activeLesson.id)
    : -1

  const c = activeMod ? COLORS[activeMod.color] : COLORS.blue

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">

      {/* Left sidebar — module list */}
      <aside className="w-68 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col" style={{ width: '17rem' }}>
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">AML</div>
            <div>
              <p className="text-sm font-semibold leading-tight">Training Modules</p>
              <p className="text-xs text-slate-400">Free tier · 5 modules</p>
            </div>
          </div>
          <button
            onClick={() => { setActiveMod(null); setActiveLesson(null) }}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors text-slate-300 text-left"
          >
            ← All modules
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {MODULES.map((mod) => {
            const mc = COLORS[mod.color]
            const isActive = activeMod?.id === mod.id
            return (
              <button
                key={mod.id}
                onClick={() => openModule(mod)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? `border-slate-700 bg-slate-800`
                    : 'border-transparent hover:bg-slate-800/60 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${mc.badge}`}>{mod.code}</span>
                  <span className="text-xs text-slate-500">{mod.duration}</span>
                </div>
                <p className="text-sm font-medium leading-snug">{mod.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{mod.subtitle}</p>
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">5 modules unlocked — free tier</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="shrink-0 px-5 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200 text-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Home
              </button>
            )}
            <div>
              <h1 className="text-sm font-semibold">AML Training Modules</h1>
              <p className="text-xs text-slate-400">MLROs & Analysts · Foundational to Intermediate</p>
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
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        {/* Body */}
        {!activeMod ? (
          /* Module overview grid */
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Your Training Modules</h2>
                <p className="text-slate-400 text-sm max-w-xl">
                  Five comprehensive modules covering AML fundamentals, AUSTRAC obligations, sanctions, PEP screening, and the FATF framework — built for MLROs and compliance analysts.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {MODULES.map((mod) => {
                  const mc = COLORS[mod.color]
                  return (
                    <button
                      key={mod.id}
                      onClick={() => openModule(mod)}
                      className="text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl ${mc.icon} flex items-center justify-center text-sm font-bold`}>
                          {mod.id}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${mc.badge}`}>FREE</span>
                          <span className="text-xs text-slate-500">{mod.duration}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{mod.code} · {mod.level}</p>
                      <h3 className="font-semibold text-base mb-1 group-hover:text-white transition-colors">{mod.title}</h3>
                      <p className="text-slate-400 text-sm leading-snug">{mod.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <span>{mod.lessons.length} lessons</span>
                        <span>·</span>
                        <span className={`${mc.heading} group-hover:opacity-80 transition-opacity`}>Start module →</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Lesson viewer */
          <div className="flex flex-1 min-h-0">

            {/* Lesson list panel */}
            <div className="w-52 shrink-0 border-r border-slate-800 bg-slate-900/40 overflow-y-auto">
              <div className="p-3">
                <p className={`text-xs font-semibold uppercase tracking-wider px-2 mb-1 ${c.heading}`}>{activeMod.code}</p>
                <p className="text-sm font-semibold px-2 mb-3 leading-snug">{activeMod.title}</p>
                {activeMod.lessons.map((lesson, i) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left text-xs px-2 py-2.5 rounded-lg transition-colors mb-0.5 flex items-start gap-2 border ${
                      activeLesson?.id === lesson.id
                        ? `${c.active} border`
                        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                      activeLesson?.id === lesson.id ? c.number : 'bg-slate-800 text-slate-500'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="leading-tight">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson content */}
            <div className="flex-1 overflow-y-auto">
              {activeLesson && (
                <div className="max-w-3xl mx-auto px-8 py-8">
                  <p className="text-xs text-slate-500 mb-2">{activeMod.code} · Lesson {lessonIndex + 1} of {activeMod.lessons.length}</p>
                  <h2 className="text-2xl font-bold mb-3">{activeLesson.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed pb-7 mb-7 border-b border-slate-800">
                    {activeLesson.intro}
                  </p>

                  <div className="space-y-8">
                    {activeLesson.sections.map((sec, i) => (
                      <div key={i}>
                        <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${c.heading}`}>{sec.heading}</h3>
                        <p className="text-slate-300 text-sm leading-7 whitespace-pre-line">{sec.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Lesson nav */}
                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800">
                    <button
                      onClick={() => lessonIndex > 0 && setActiveLesson(activeMod.lessons[lessonIndex - 1])}
                      disabled={lessonIndex === 0}
                      className="px-4 py-2 border border-slate-700 rounded-lg text-sm text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-xs text-slate-600">{lessonIndex + 1} / {activeMod.lessons.length}</span>
                    {lessonIndex < activeMod.lessons.length - 1 ? (
                      <button
                        onClick={() => setActiveLesson(activeMod.lessons[lessonIndex + 1])}
                        className={`px-4 py-2 ${c.icon} hover:opacity-90 rounded-lg text-sm font-medium transition-opacity`}
                      >
                        Next lesson →
                      </button>
                    ) : (
                      <button
                        onClick={() => { setActiveMod(null); setActiveLesson(null) }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                      >
                        Complete module ✓
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
