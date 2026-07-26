import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ── In-memory auth store ──────────────────────────────────────────────────
const users = new Map()   // email → { id, name, email, passwordHash }
const sessions = new Map() // token → email

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'aml_salt_2026').digest('hex')
}

app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  if (users.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }
  const id = crypto.randomUUID()
  const passwordHash = hashPassword(password)
  users.set(email.toLowerCase(), { id, name, email: email.toLowerCase(), passwordHash })
  const token = crypto.randomUUID()
  sessions.set(token, email.toLowerCase())
  res.json({ token, user: { id, name, email: email.toLowerCase() } })
})

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = users.get(email.toLowerCase())
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const token = crypto.randomUUID()
  sessions.set(token, email.toLowerCase())
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

app.post('/auth/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) sessions.delete(token)
  res.json({ success: true })
})

// ── AML knowledge base — keyword → reply pairs ───────────────────────────
const knowledge = [
  {
    keywords: ['what is aml', 'define aml', 'anti-money laundering', 'money laundering mean', 'explain aml'],
    reply: `Anti-Money Laundering (AML) refers to a set of laws, regulations, and procedures designed to prevent criminals from disguising illegally obtained funds as legitimate income.

Key AML objectives:
• Detect and report suspicious financial activity
• Prevent the financial system from being exploited for criminal purposes
• Comply with regulatory requirements

Major AML frameworks:
• Bank Secrecy Act (BSA) — United States
• USA PATRIOT Act — expanded BSA requirements
• EU Anti-Money Laundering Directives (6AMLD)
• FATF 40 Recommendations — global standard
• FinCEN regulations`
  },
  {
    keywords: ['3 stages', 'three stages', 'placement', 'layering', 'integration', 'stages of money laundering'],
    reply: `Money laundering typically occurs in three stages:

1. PLACEMENT
The illegal cash enters the financial system for the first time.
Examples: cash deposits, currency exchange, casino winnings, purchasing monetary instruments.
This is the stage where criminals are most vulnerable to detection.

2. LAYERING
The funds are separated from their criminal origin through a series of complex financial transactions.
Examples: wire transfers across multiple countries, converting funds between asset classes, using shell companies, trade-based laundering.

3. INTEGRATION
The laundered funds re-enter the legitimate economy and appear as clean money.
Examples: purchasing real estate, luxury goods, investing in businesses, loan-back schemes.

Detecting transactions early in the placement stage is generally the most effective AML strategy.`
  },
  {
    keywords: ['kyc', 'know your customer', 'customer identification', 'cip', 'customer identification program'],
    reply: `Know Your Customer (KYC) is the process by which financial institutions verify the identity of their clients and assess the risk they pose.

Core KYC components:

Customer Identification Program (CIP):
• Collect full legal name, date of birth, address, and ID number
• Verify identity using reliable, independent documents or data
• Required for all account-opening relationships

Customer Due Diligence (CDD):
• Understand the nature and purpose of the account
• Identify and verify beneficial owners (≥25% ownership)
• Assess the customer risk level (low, medium, high)

Ongoing monitoring:
• Continuously monitor transactions against expected activity
• Update customer information and risk ratings periodically
• Re-screen customers against sanctions and watchlists

Regulatory basis: FinCEN CDD Rule (31 CFR §1010.230), FATF Recommendation 10`
  },
  {
    keywords: ['cdd', 'customer due diligence', 'edd', 'enhanced due diligence', 'due diligence'],
    reply: `Customer Due Diligence (CDD) is the standard process of collecting and verifying customer information to assess risk.

Standard CDD includes:
• Verify customer identity and beneficial ownership
• Understand the purpose of the business relationship
• Assess and assign a risk rating
• Monitor for unusual or suspicious activity

Enhanced Due Diligence (EDD) is required for higher-risk customers and relationships, including:
• Politically Exposed Persons (PEPs)
• Customers in high-risk jurisdictions (FATF grey/black list countries)
• Cash-intensive businesses
• Correspondent banking relationships
• Non-face-to-face customers

EDD measures include:
• Senior management approval for onboarding
• Obtaining source of funds and wealth documentation
• More frequent transaction monitoring reviews
• Additional third-party screening

Simplified Due Diligence (SDD) may apply to lower-risk customers where regulations permit, such as regulated financial institutions or government entities.`
  },
  {
    keywords: ['sar', 'suspicious activity report', 'file a sar', 'filing sar', 'report suspicious'],
    reply: `A Suspicious Activity Report (SAR) is a report filed with FinCEN (in the US) when a financial institution detects a transaction or pattern of activity suspected to involve money laundering, fraud, or other financial crimes.

When to file a SAR:
• Transactions ≥ $5,000 involving suspected illegal activity (banks)
• Transactions ≥ $2,000 for MSBs
• No minimum if terrorist financing is suspected
• Filed within 30 days of detection (60 days if no suspect is identified)

Key SAR rules:
• Tipping off the subject of a SAR is prohibited (tipping-off violation)
• Safe harbor protection is granted to good-faith filers
• Retain SAR records for 5 years
• SARs are confidential — not a court-admissible admission

SAR content should include:
• Who, what, when, where, how, and why the activity is suspicious
• Clear narrative describing the suspicious activity
• All known subject information

Regulatory basis: 31 CFR §1020.320 (banks), 31 CFR §1022.320 (MSBs)`
  },
  {
    keywords: ['ctr', 'currency transaction report', 'cash transaction report', '$10,000', '10000', 'cash over'],
    reply: `A Currency Transaction Report (CTR) must be filed by financial institutions for any cash transaction exceeding $10,000 in a single business day, whether deposits, withdrawals, or exchanges.

Key CTR rules:
• Threshold: Any cash transaction > $10,000 (single or aggregated)
• Multiple transactions by the same person on the same day must be aggregated
• Must be filed within 15 days of the transaction
• Retain records for 5 years

CTR Exemptions:
• Phase I: Banks, government entities, publicly listed companies — exempt automatically
• Phase II: Other businesses with established history may be exempted by the bank

Structuring (illegal):
Breaking up transactions to avoid the $10,000 CTR threshold is illegal and called "structuring." It is itself a federal crime under 31 USC §5324, regardless of whether the underlying funds are illicit.

Regulatory basis: Bank Secrecy Act (BSA) / 31 CFR §1010.311`
  },
  {
    keywords: ['red flag', 'suspicious behavior', 'unusual activity', 'warning sign', 'indicators', 'typologies'],
    reply: `Common AML Red Flags and Suspicious Indicators:

CASH & TRANSACTION PATTERNS:
• Frequent cash deposits just below $10,000 (structuring)
• Round-dollar transactions with no clear business purpose
• Rapid movement of funds in and out of accounts (layering)
• Transactions inconsistent with customer's stated business

CUSTOMER BEHAVIOR:
• Customer unusually knowledgeable about reporting thresholds
• Reluctance to provide identification or beneficial ownership info
• Explanations for transactions that don't make business sense
• Multiple customers using the same address

HIGH-RISK ACTIVITIES:
• Transactions involving high-risk jurisdictions or FATF grey-list countries
• Payments to or from politically exposed persons (PEPs)
• Use of shell companies or complex legal structures without clear business rationale
• Third-party payments with no apparent connection to the transaction

TRADE & WIRE TRANSFERS:
• Overpayment or underpayment in trade transactions
• Wire transfers to non-account holders or unknown parties
• Payments routed through unrelated countries
• Unusual use of letters of credit or trade finance

Document all red flags in your investigation and escalate to your BSA/AML Officer when warranted.`
  },
  {
    keywords: ['fatf', 'financial action task force', 'fatf recommendations', 'grey list', 'black list'],
    reply: `The Financial Action Task Force (FATF) is the global inter-governmental body that sets international standards for combating money laundering, terrorist financing, and proliferation financing.

FATF Key Outputs:
• 40 Recommendations — the international AML/CFT standard
• Mutual Evaluations — peer reviews of country compliance
• Grey List (Jurisdictions under Increased Monitoring) — countries with strategic AML deficiencies that are actively working to improve
• Black List (Call for Action) — high-risk jurisdictions subject to enhanced measures (e.g., Iran, North Korea)

Key FATF Recommendations:
• R.10: Customer due diligence (CDD)
• R.20: Reporting of suspicious transactions (SARs)
• R.24/25: Transparency of beneficial ownership of legal persons and arrangements
• R.40: International cooperation

Financial institutions must apply enhanced due diligence (EDD) to customers and transactions involving FATF grey/black list countries.

FATF membership includes 39 jurisdictions plus the European Commission. It was founded in 1989 by the G7.`
  },
  {
    keywords: ['pep', 'politically exposed person', 'senior political figure', 'government official'],
    reply: `A Politically Exposed Person (PEP) is an individual who holds or has held a prominent public position, making them a higher risk for bribery, corruption, and money laundering.

PEP Categories:
• Foreign PEPs: Heads of state, senior politicians, judicial officers, military generals, state-owned enterprise executives
• Domestic PEPs: Holders of prominent domestic political functions (risk level depends on local law)
• International Organisation PEPs: Senior management of international bodies (UN, IMF, World Bank, etc.)
• Close Associates: Family members and close business associates of PEPs inherit PEP risk

AML Obligations for PEPs:
• Apply Enhanced Due Diligence (EDD)
• Obtain senior management approval before establishing or continuing the relationship
• Conduct enhanced scrutiny of the source of wealth and source of funds
• Perform ongoing monitoring of the relationship

PEP status does not automatically mean a person is criminal — but it requires a higher level of scrutiny due to elevated corruption risk.

Regulatory basis: FATF Recommendation 12, EU 5AMLD/6AMLD`
  },
  {
    keywords: ['structuring', 'smurfing', 'under report', 'avoid reporting', 'breaking up cash'],
    reply: `Structuring (also called "smurfing") is the illegal practice of breaking up large cash transactions into smaller amounts specifically to avoid the $10,000 CTR reporting threshold.

Key facts:
• Structuring is a federal crime under 31 USC §5324 (Bank Secrecy Act)
• It is illegal even if the underlying money is from legitimate sources
• Penalties can include fines and up to 5 years imprisonment
• Banks are required to file SARs on suspected structuring activity

How it works:
• A person may deposit $9,500 on Monday, $9,800 on Wednesday, and $9,200 on Friday to avoid triggering CTRs
• "Smurfs" are individuals hired to make multiple deposits or purchases across many locations on behalf of one person

Bank obligations:
• Aggregate same-day cash transactions from the same person
• Flag and investigate patterns that suggest structuring
• File a SAR when structuring is suspected, regardless of the individual transaction amount

Structuring is considered a red flag for money laundering even when the funds are lawfully obtained.`
  },
  {
    keywords: ['ofac', 'sanctions', 'sdn', 'specially designated nationals', 'sanctions screening', 'treasury'],
    reply: `OFAC (Office of Foreign Assets Control) is a U.S. Treasury Department agency that administers and enforces economic and trade sanctions programs.

Key OFAC Programs:
• SDN List (Specially Designated Nationals and Blocked Persons) — individuals, entities, and vessels that US persons are prohibited from dealing with
• Consolidated Sanctions List — comprehensive list combining all OFAC sanctions lists
• Country-based programs — comprehensive sanctions (e.g., Cuba, Iran, North Korea, Syria)

AML/Sanctions Obligations:
• Screen all customers, beneficial owners, and counterparties against OFAC lists at onboarding and on an ongoing basis
• Block or reject transactions involving sanctioned parties
• Report blocked assets to OFAC within 10 business days
• Maintain records of blocked property for 5 years

OFAC Penalties:
• Civil: Up to $1 million+ per violation or twice the transaction amount
• Criminal: Up to 20 years imprisonment
• OFAC publishes enforcement actions publicly

Violations can occur even without intent ("strict liability"). Robust screening and a well-documented compliance program are essential defenses.`
  },
  {
    keywords: ['beneficial ownership', 'ultimate beneficial owner', 'ubo', 'who owns', 'ownership'],
    reply: `Beneficial Ownership refers to the natural person(s) who ultimately own or control a legal entity, even if ownership is held through nominees or complex corporate structures.

FinCEN CDD Rule (effective May 2018):
Covered financial institutions must identify and verify beneficial owners of legal entity customers:
• Ownership prong: All natural persons owning ≥25% of the entity's equity
• Control prong: One person with significant responsibility to control/manage the entity (e.g., CEO, CFO, COO)

New: Corporate Transparency Act (CTA)
Effective January 1, 2024 — most US companies must report beneficial ownership information (BOI) directly to FinCEN. Exceptions include publicly traded companies, large operating companies, and regulated entities.

Red flags in beneficial ownership:
• Refusal to identify beneficial owners
• Ownership structures with no apparent business rationale
• Nominees or shell companies used to obscure true ownership
• Beneficial owners located in high-risk or secrecy jurisdictions

Why it matters:
Shell companies with obscured ownership are one of the most common tools for money laundering. Identifying the true UBO is critical to assessing real risk.`
  },
  {
    keywords: ['bsa', 'bank secrecy act', 'fincen', 'currency reporting', 'us aml law'],
    reply: `The Bank Secrecy Act (BSA), enacted in 1970, is the primary US AML law. It requires financial institutions to assist US government agencies in detecting and preventing money laundering.

Key BSA Requirements:
• Currency Transaction Reports (CTRs) — for cash transactions >$10,000
• Suspicious Activity Reports (SARs) — for suspected illegal activity
• Customer Identification Program (CIP) — verify customer identities
• Customer Due Diligence (CDD) — including beneficial ownership
• Recordkeeping requirements — retain records 5 years

BSA Program Requirements (the "5 Pillars"):
1. Written internal policies, procedures, and controls
2. Designated BSA/AML Compliance Officer
3. Ongoing employee training
4. Independent audit/testing function
5. Customer Due Diligence (added as 5th pillar by FinCEN in 2016)

Enforcement:
• FinCEN (Financial Crimes Enforcement Network) administers the BSA
• Federal banking agencies (OCC, FDIC, Federal Reserve) examine for BSA compliance
• DOJ and FinCEN can impose significant civil monetary penalties

Notable penalties have exceeded $1 billion for large-scale BSA failures.`
  },
  {
    keywords: ['shell company', 'shell corporation', 'nominee', 'front company', 'offshore'],
    reply: `A shell company is a legal entity that typically has no significant assets or operations and is used primarily to hold financial instruments, own real estate, or conduct transactions while obscuring the true owner.

How they are misused for money laundering:
• Ownership layers: Stacking multiple shells in different jurisdictions makes tracing beneficial ownership extremely difficult
• Real estate: Purchasing property through shells to integrate funds without disclosure
• Trade: Inflating or deflating invoice values between related shells (trade-based ML)
• Loan-back schemes: Self-lending between owned entities to create false loan repayment paper trails

AML risk indicators for shell companies:
• No employees, no physical address, no obvious business purpose
• Ownership held by other shell companies in secrecy jurisdictions
• Transactions inconsistent with any real business activity
• Rapid account opening and fund movement

Regulatory responses:
• FinCEN beneficial ownership rule (2018) and CTA (2024) target shell company opacity
• FATF Recommendation 24 requires countries to ensure beneficial ownership transparency
• FinCEN Geographic Targeting Orders (GTOs) require title insurance companies to identify buyers of real estate in certain cities`
  },
  {
    keywords: ['transaction monitoring', 'monitoring system', 'alert', 'tune', 'false positive'],
    reply: `Transaction Monitoring (TM) is a core AML control that automatically reviews customer transactions to detect unusual or suspicious patterns.

How it works:
• Rules-based systems flag transactions meeting specific criteria (e.g., large cash deposits, rapid fund movement, transactions to high-risk countries)
• Scenario-based alerts are calibrated against known money laundering typologies
• Risk-based thresholds are applied based on customer risk rating

Alert review process:
1. Alert generated by monitoring system
2. Analyst reviews the alert and customer's transaction history
3. Alert cleared (no suspicious activity found) or escalated
4. Escalated alerts lead to a SAR investigation
5. SAR filed or case closed with documented rationale

Tuning and calibration:
• High false positive rates waste resources and desensitize staff
• Regular model validation and threshold tuning is required
• Systems must be documented, tested, and risk-based
• Regulators expect evidence of a risk-based approach, not just high alert volumes

Common monitoring scenarios:
• Structuring (transactions just below $10,000)
• Rapid movement (funds in and out within short periods)
• Dormant account activity resuming suddenly
• Geographic anomalies (transactions to FATF grey/black list countries)`
  },
  {
    keywords: ['trade based', 'tbml', 'invoice', 'over invoicing', 'under invoicing', 'trade finance'],
    reply: `Trade-Based Money Laundering (TBML) involves manipulating international trade transactions to transfer value and launder illicit funds.

Common TBML techniques:
• Over-invoicing: Exporter invoices more than the actual value of goods, the excess payment moves value from importer to exporter country
• Under-invoicing: Goods sold below market value, transferring value in the opposite direction
• Multiple invoicing: Issuing multiple payments for the same shipment
• Falsely described goods: Misrepresenting quality, quantity, or type of goods
• Black market peso exchange: Using legitimate trade to convert drug proceeds (common in Latin America)

Red flags for TBML:
• Invoice price inconsistent with market value (use of trade pricing databases)
• Payment by unrelated third parties
• Routing through countries with no obvious business connection
• Goods shipped through unusual or high-risk ports
• Complex letters of credit or financing arrangements
• Transactions with no apparent economic purpose

TBML is considered one of the largest and most underdetected methods of money laundering globally. FATF has published dedicated guidance on TBML typologies.`
  },
  {
    keywords: ['correspondent banking', 'nostro', 'vostro', 'respondent bank', 'wire transfer'],
    reply: `Correspondent Banking refers to financial services provided by one bank (the correspondent) to another bank (the respondent), typically in a different country, to facilitate international payments and transactions.

AML risks in correspondent banking:
• Nested accounts: A respondent bank's customers transact through the correspondent without direct due diligence
• Concentration of risk: Many underlying customers are behind a single account
• Payable-through accounts: Allow respondent bank's customers to directly conduct transactions in the correspondent's name

AML obligations:
• Apply Enhanced Due Diligence (EDD) to all correspondent relationships
• Assess the respondent bank's own AML/CFT controls
• Obtain information on any nested correspondents
• Prohibited: knowingly providing correspondent services to shell banks (banks with no physical presence in any country)

Key regulatory event:
• De-risking: Many large banks have exited high-risk correspondent relationships to reduce compliance burden, which can inadvertently push transactions to less-regulated channels

Regulatory basis: FATF Recommendation 13, 31 CFR §1010.610 (prohibition on shell bank services)`
  },
  // ── AUSTRAC & Australian AML/CTF ──────────────────────────────────────────

  {
    keywords: ['austrac', 'australian transaction reports', 'australia aml', 'australian aml', 'amlctf regulator'],
    reply: `AUSTRAC (Australian Transaction Reports and Analysis Centre) is Australia's financial intelligence agency and the primary regulator for anti-money laundering and counter-terrorism financing (AML/CTF).

Role and functions:
• Collects, analyses, and distributes financial intelligence to law enforcement
• Regulates and supervises reporting entities for AML/CTF compliance
• Administers the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (AML/CTF Act)
• Issues guidance, e-learning, and typology reports to help industry comply

AUSTRAC's key powers:
• Issue compliance assessments and enforceable undertakings
• Impose civil penalty orders (no statutory cap)
• Refer matters to law enforcement for criminal prosecution
• Cancel or suspend registrations (remittance, DCE providers)

Notable enforcement:
• Commonwealth Bank (2018) — AUD $700 million penalty (then largest in Australian history)
• Westpac (2020) — AUD $1.3 billion penalty (largest corporate penalty in Australian history)
• SkyCity Adelaide (2024) — AUD $67 million penalty
• Star Entertainment (2024) — AUD $15 million penalty

AUSTRAC is a member of the Egmont Group of Financial Intelligence Units and works closely with ACIC, AFP, ATO, and ASIC.`
  },
  {
    keywords: ['aml/ctf act', 'amlctf act', 'aml ctf act 2006', 'anti-money laundering and counter-terrorism', 'australian aml law', 'ctf act'],
    reply: `The Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (AML/CTF Act) is Australia's primary AML/CTF legislation, administered by AUSTRAC.

Key obligations under the AML/CTF Act:

Reporting obligations (Part 3):
• Suspicious Matter Reports (SMRs) — Section 41
• Threshold Transaction Reports (TTRs) — Section 43 (AUD $10,000+)
• International Funds Transfer Instructions (IFTIs) — Section 45
• Significant Cash Transaction Reports

AML/CTF Program (Part 2):
• All reporting entities must have a written AML/CTF Program
• Part A: Covers enterprise-wide risk assessment and controls
• Part B: Covers Know Your Customer (KYC) / customer due diligence procedures

Registration (Part 6):
• Remittance network providers (RNPs) and digital currency exchange (DCE) providers must register with AUSTRAC before commencing business

Record-keeping (Part 10):
• Retain transaction and customer records for 7 years

2024 AML/CTF Act Reforms:
• Expanded to cover "Tranche 2" entities: lawyers, accountants, real estate agents, trust and company service providers (TCSPs)
• Simplified and modernised the program and reporting framework
• Strengthened beneficial ownership requirements

Regulatory basis: AML/CTF Act 2006 (Cth) and AML/CTF Rules 2007`
  },
  {
    keywords: ['aml/ctf program', 'part a program', 'part b program', 'compliance program australia', 'amlctf program', 'austrac program'],
    reply: `Under the AML/CTF Act 2006, all reporting entities must adopt and maintain a written AML/CTF Program tailored to their business.

PART A — AML/CTF Risk Management Program:
• Enterprise-Wide Risk Assessment (EWRA): Identify and assess the ML/TF risks posed by customers, designated services, delivery channels, and jurisdictions
• Risk-based controls: Policies and procedures to mitigate identified risks
• Employee due diligence and awareness training
• Board/senior management oversight
• Independent review: Program must be reviewed by an independent auditor at least every 3 years (or after a material change)
• Compliance officer: A designated AML/CTF compliance officer must be appointed

PART B — KYC / Customer Due Diligence Procedures:
• Collect and verify customer identity before providing a designated service
• Applicable customer identification: individuals, companies, trusts, partnerships, associations
• Ongoing Customer Due Diligence (OCDD): Monitor customer activity and update records
• Enhanced due diligence for high-risk customers (PEPs, high-risk countries, complex structures)
• Correspondent banking controls

Key principle — risk-based approach:
The program must be proportionate to the nature, size, and complexity of the business. AUSTRAC expects documented rationale for risk ratings and controls, not a "tick-the-box" approach.

Source: AUSTRAC AML/CTF Program guidance and AML/CTF Rules 2007 Chapter 8`
  },
  {
    keywords: ['smr', 'suspicious matter report', 'australia suspicious', 'suspicious matter', 'report suspicious australia'],
    reply: `A Suspicious Matter Report (SMR) is Australia's equivalent of a Suspicious Activity Report (SAR). It is filed with AUSTRAC when a reporting entity suspects a transaction or customer may be related to money laundering, terrorism financing, or other serious crimes.

When to file an SMR (Section 41, AML/CTF Act):
• You have reasonable grounds to suspect a customer or transaction is related to:
  — Money laundering or terrorism financing
  — An offence against a Commonwealth, State, or Territory law
  — Proceeds of crime
• No minimum transaction amount — suspicion alone triggers the obligation
• Must be filed as soon as practicable, and within 24 hours for terrorism financing suspicion, or 3 business days for other matters

Tipping off prohibition:
• It is a criminal offence to tip off (disclose) that an SMR has been, is being, or may be filed to the subject or any person who might alert the subject
• Penalty: Up to 2 years imprisonment

Safe harbour:
• A reporting entity and its staff have safe harbour from civil, criminal, and administrative liability for filing an SMR in good faith

SMR content should document:
• Full customer details and account information
• Specific details of the suspicious transaction(s)
• The basis for suspicion — what activity triggered it and why it is suspicious
• Any enquiries made prior to filing

Source: AML/CTF Act 2006 Section 41; AUSTRAC SMR guidance`
  },
  {
    keywords: ['ttr', 'threshold transaction report', 'cash reporting australia', 'austrac cash', '$10,000 australia', 'threshold transaction'],
    reply: `A Threshold Transaction Report (TTR) must be filed with AUSTRAC when a reporting entity provides a designated service involving physical currency (cash) of AUD $10,000 or more in a single transaction, or multiple related cash transactions that together total AUD $10,000 or more.

Key TTR rules (Section 43, AML/CTF Act):
• Threshold: AUD $10,000 or more in physical currency
• Must be filed within 10 business days of the transaction
• Applies to incoming and outgoing cash transactions
• Foreign currency must be converted to AUD using the exchange rate at the time of the transaction

Aggregation:
• Two or more transactions are aggregated if they appear to be related (same customer, same day or close in time, same purpose) and together total AUD $10,000+

Exemptions:
• Transactions between Australian banks (ADIs) may be exempt in certain circumstances
• AUSTRAC can grant specific exemptions

TTR vs SMR:
• A TTR is an automatic reporting obligation triggered by the dollar threshold — no suspicion is required
• If a transaction is both above $10,000 AND suspicious, both a TTR and an SMR must be filed

Structuring to avoid TTRs is illegal under Section 142 of the AML/CTF Act and is itself a designated offence.

Source: AML/CTF Act 2006 Section 43; AUSTRAC TTR guidance`
  },
  {
    keywords: ['ifti', 'international funds transfer instruction', 'cross-border transfer', 'swift reporting australia', 'austrac wire', 'international transfer australia'],
    reply: `An International Funds Transfer Instruction (IFTI) is a reporting obligation unique to Australia. It requires reporting entities to report to AUSTRAC all instructions to transfer funds into or out of Australia.

What triggers an IFTI (Section 45, AML/CTF Act):
• Any instruction given by a customer to transfer money to or from Australia (regardless of amount)
• Covers SWIFT messages, telegraphic transfers, RTGS, and equivalent cross-border instructions
• Both the sending institution and the receiving institution in Australia must report

Filing requirements:
• Must be reported within 10 business days of sending or receiving the IFTI
• Both inbound and outbound instructions must be reported
• Includes information on the originator, beneficiary, and amounts

Information to include:
• Full name, address, account details of the originator
• Full name, account details of the beneficiary
• Date and amount of the transfer
• Ordering and beneficiary financial institutions

Why IFTIs matter:
• AUSTRAC uses IFTI data to map cross-border money flows and identify typologies
• Failure to report IFTIs has featured in several major AUSTRAC enforcement actions, including the Westpac case (23 million unreported IFTIs)
• IFTIs are a major source of financial intelligence for law enforcement

Source: AML/CTF Act 2006 Section 45; AUSTRAC IFTI guidance`
  },
  {
    keywords: ['reporting entity', 'designated service', 'who must comply austrac', 'austrac obligations', 'who is regulated by austrac'],
    reply: `Under the AML/CTF Act 2006, any entity that provides a "designated service" in Australia is a "reporting entity" and must comply with AUSTRAC obligations.

What is a designated service?
Designated services are defined in Table 1 and Table 2 of Section 6 of the AML/CTF Act. Key categories include:

Financial services (Table 1):
• Opening and operating bank accounts, loans, credit facilities
• Issuing, selling, or redeeming traveller's cheques or money orders
• Currency exchange and cash handling
• Issuing securities, debentures, or derivatives
• Custodial and depository services
• Life insurance and investment-linked insurance products

Bullion (Table 2):
• Buying and selling precious metals, stones, or jewellery above AUD $10,000 in cash

Remittance:
• Providing remittance (money transfer) services

Digital Currency Exchange (DCE):
• Exchanging Australian or foreign currency for digital currency (cryptocurrency) and vice versa

Who is a reporting entity:
• Banks (ADIs), credit unions, building societies
• Insurance companies and brokers (for relevant products)
• Stockbrokers, financial advisers (for some services)
• Casinos and some gambling operators
• Remittance dealers and money transfer operators
• Digital currency exchange providers
• Bullion dealers (for large cash transactions)
• From 2026: lawyers, accountants, real estate agents, TCSPs (Tranche 2 reforms)

Source: AML/CTF Act 2006, Section 6 and Schedule 7`
  },
  {
    keywords: ['enterprise wide risk assessment', 'ewra', 'austrac risk assessment', 'ml/tf risk', 'money laundering risk assessment', 'risk assessment australia'],
    reply: `An Enterprise-Wide Risk Assessment (EWRA) is a foundational component of an AML/CTF Program under AUSTRAC's framework. Reporting entities must identify and assess the money laundering and terrorism financing (ML/TF) risks specific to their business.

AUSTRAC's risk assessment framework considers four key risk factors:

1. Customer risk
• Who are your customers? (PEPs, high-risk nationalities, cash-intensive businesses)
• Customer identification and verification gaps
• Anonymous or low-transparency relationships

2. Designated service risk
• Which services do you offer? (cash, international transfers, complex financial products)
• Higher-risk services include cash handling, correspondent banking, DCE

3. Delivery channel risk
• How are services delivered? (face-to-face, online/non-face-to-face, agents, third parties)
• Non-face-to-face and agent-based models carry higher inherent risk

4. Jurisdiction risk
• Which countries are customers/counterparties from or operating in?
• FATF grey/black list countries and high-corruption-index jurisdictions carry elevated risk

EWRA process:
• Identify: List all ML/TF risks relevant to your business
• Assess: Rate inherent risk (likelihood × impact)
• Mitigate: Document controls applied to each risk
• Residual risk: Reassess after controls — determine if acceptable
• Review: Update the EWRA regularly and after material business changes

AUSTRAC guidance: "Risk assessment" section of the AUSTRAC website and AML/CTF Rules Chapter 8, Part 8.2`
  },
  {
    keywords: ['ocdd', 'ongoing customer due diligence', 'ongoing monitoring austrac', 'ongoing cdd', 'ongoing due diligence'],
    reply: `Ongoing Customer Due Diligence (OCDD) is the continuous process of monitoring customer relationships and transactions after initial onboarding to ensure the information remains current and to detect suspicious or unusual activity.

AUSTRAC's OCDD requirements (AML/CTF Rules, Chapter 15):

1. Transaction monitoring
• Monitor transactions for consistency with the customer's known risk profile and expected behaviour
• Systems must be capable of detecting unusual patterns (e.g., rapid fund movement, structuring, unexpected geographic activity)

2. Enhanced OCDD
• Apply additional monitoring to high-risk customers (PEPs, customers in high-risk jurisdictions, complex ownership structures)
• Obtain senior management sign-off for high-risk relationships

3. Keeping information up to date
• Re-verify customer identification and beneficial ownership when there are doubts about accuracy
• Update records when material changes occur (e.g., change of business structure, new beneficial owners)
• Periodically re-screen customers against sanctions and PEP lists

4. KYC refresh
• Reporting entities should define periodic review cycles based on risk rating (e.g., high-risk: annually, medium: every 2 years, low-risk: every 3–5 years)

OCDD triggers:
• Transaction patterns inconsistent with the customer's risk profile
• Customer requests a new or higher-risk service
• External information (media, law enforcement) raises concerns
• PEP status change or sanctions hit

Source: AML/CTF Rules 2007, Chapter 15; AUSTRAC Ongoing Customer Due Diligence guidance`
  },
  {
    keywords: ['digital currency exchange', 'dce', 'crypto aml', 'bitcoin aml', 'cryptocurrency austrac', 'virtual asset', 'crypto compliance'],
    reply: `Digital Currency Exchange (DCE) providers are regulated by AUSTRAC under the AML/CTF Act as reporting entities.

Registration requirement:
• All DCE providers operating in Australia or providing services to Australian customers must register with AUSTRAC before commencing business
• Operating without registration is a criminal offence
• AUSTRAC maintains a public register of registered DCE providers

DCE AML/CTF obligations:
• Adopt and maintain an AML/CTF Program (Part A and Part B)
• Verify customer identity (KYC) — no anonymous accounts
• File SMRs, TTRs (for cash transactions), and IFTIs
• Keep transaction and customer records for 7 years
• Apply Enhanced Due Diligence to high-risk customers and transactions

AUSTRAC typology guidance — cryptocurrency red flags:
• Transactions involving mixing services or tumblers (obfuscation tools)
• Use of privacy coins (Monero, Zcash) without business justification
• Rapid conversion between fiat and multiple digital currencies
• Transactions involving darknet markets or flagged wallet addresses
• No apparent business purpose for large crypto transactions
• Customers unwilling to explain source of crypto funds

FATF Virtual Asset guidance:
• FATF Recommendation 15 requires countries to regulate virtual asset service providers (VASPs) for AML/CTF
• Australia's DCE framework aligns with FATF's VASP standards, including the Travel Rule (requiring beneficiary/originator information on transfers)

Source: AUSTRAC Digital Currency Exchange guidance; AML/CTF Act 2006 Part 6`
  },
  {
    keywords: ['remittance', 'money transfer operator', 'mto', 'remittance network provider', 'rnp', 'send money overseas', 'remittance sector'],
    reply: `Remittance (money transfer) services are a high-risk designated service sector under the AML/CTF Act and are closely supervised by AUSTRAC.

Registration:
• All remittance network providers (RNPs) and independent remittance dealers must register with AUSTRAC
• Unregistered remittance is a criminal offence under Section 74 of the AML/CTF Act

AML/CTF obligations for remittance:
• AML/CTF Program (Part A and Part B) tailored to remittance risks
• KYC/CDD for all customers
• Verify sender and recipient identity and collect purpose of remittance
• File SMRs, TTRs, and IFTIs as applicable
• Enhanced due diligence for high-risk corridors and customers

AUSTRAC remittance typology — red flags:
• Frequent small transfers to the same offshore recipient (structuring)
• Transfers to high-risk or FATF grey-list countries without clear purpose
• Cash payments for international transfers
• Customers providing inconsistent or implausible explanations for transfers
• Third-party funding (someone paying on behalf of the sender)
• Use of multiple remittance providers by the same customer

Network provider responsibilities:
• Remittance network providers (e.g., the franchiser) are responsible for AML/CTF compliance of the whole network, including agents
• Agents must be monitored and trained

AUSTRAC has published specific guidance on the remittance sector including typology reports on hawala, informal value transfer systems, and high-risk corridors.

Source: AUSTRAC Remittance sector guidance; AML/CTF Act 2006 Part 6`
  },
  {
    keywords: ['austrac e-learning', 'austrac elearning', 'austrac training', 'austrac online modules', 'aml elearning', 'compliance training modules', 'austrac modules'],
    reply: `AUSTRAC provides free online e-learning modules to help reporting entities, compliance professionals, and staff understand their AML/CTF obligations.

AUSTRAC e-learning modules include:

1. Introduction to AML/CTF
Overview of money laundering and terrorism financing, the three stages of ML, why it matters, and Australia's AML/CTF regulatory framework.

2. AML/CTF Programs
How to build and maintain a compliant AML/CTF Program — Part A (risk management) and Part B (KYC/CDD procedures), risk-based approach, and independent review.

3. Customer Due Diligence (KYC)
Collecting and verifying customer identity, ongoing CDD, beneficial ownership identification, and enhanced due diligence requirements.

4. Reporting Obligations
How and when to file SMRs, TTRs, and IFTIs. Understanding thresholds, timeframes, AUSTRAC Online portal, and the tipping-off prohibition.

5. Risk Assessment
Conducting an Enterprise-Wide Risk Assessment (EWRA) — identifying customer, product/service, delivery channel, and jurisdiction risks.

6. Remittance Sector
Specific guidance for remittance and money transfer operators on registration, KYC, and filing obligations.

7. Digital Currency Exchange
AML/CTF obligations for crypto exchanges — registration, KYC, transaction monitoring, and reporting.

8. Gambling Sector
AML/CTF obligations for casinos and gambling operators — customer due diligence, large cash transactions, and suspicious matter reporting.

Access:
All modules are free and available through the AUSTRAC website (www.austrac.gov.au) under "Business > How to comply > e-learning". Completion certificates can be used as evidence of staff training.`
  },
  {
    keywords: ['westpac', 'cba', 'commonwealth bank', 'austrac penalty', 'austrac enforcement', 'austrac fine', 'austrac case', 'star entertainment', 'skycity'],
    reply: `AUSTRAC has pursued several landmark enforcement actions that have shaped AML/CTF compliance in Australia.

Commonwealth Bank of Australia (CBA) — 2018:
• AUD $700 million civil penalty (then the largest in Australian corporate history)
• CBA failed to report more than 53,000 TTRs on time for cash deposits through its intelligent deposit machines (IDMs)
• Failed to conduct appropriate ongoing customer due diligence
• Failed to assess ML/TF risks when introducing IDMs
• Key lesson: Technology and product changes must trigger a risk assessment update

Westpac Banking Corporation — 2020:
• AUD $1.3 billion civil penalty — the largest corporate penalty in Australian history
• 23 million breaches of the AML/CTF Act over five years
• Failed to report approximately 23 million IFTIs to AUSTRAC
• Failed to apply appropriate due diligence to transactions linked to child exploitation in Southeast Asia (LitePay correspondent banking channel)
• Failed to assess and monitor high-risk correspondent banking relationships
• Key lesson: Correspondent banking due diligence and IFTI reporting are critical

SkyCity Adelaide — 2024:
• AUD $67 million penalty
• Systemic failures in AML/CTF controls at the casino

Star Entertainment — 2024:
• AUD $15 million penalty (plus ongoing regulatory scrutiny and licence reviews)

Common themes across enforcement actions:
• Failure to file or late filing of TTRs and IFTIs
• Inadequate transaction monitoring systems
• Poor ongoing CDD and high-risk customer management
• AML/CTF programs not kept up to date
• Weak governance and board oversight

Source: AUSTRAC published enforcement actions (austrac.gov.au)`
  },
  {
    keywords: ['fintel alliance', 'public private partnership', 'austrac intelligence', 'industry partnership', 'financial intelligence partnership'],
    reply: `The Fintel Alliance is AUSTRAC's public-private sector partnership established in 2017 to improve the quality and sharing of financial intelligence in Australia.

Members include:
• AUSTRAC
• Major Australian banks (ANZ, CBA, NAB, Westpac, Macquarie)
• Fintech and payments companies
• Law enforcement agencies (AFP, ACIC, ABF, ASIO)

Key objectives:
• Share financial intelligence between public and private sectors in near real-time
• Develop joint typologies and red flag indicators
• Respond faster to emerging threats (e.g., child exploitation, drug trafficking, fraud)
• Improve the accuracy and value of SMRs filed by industry

Outcomes and projects:
• Project Islington: Identifying and disrupting child exploitation financing networks
• Human trafficking and slavery financial intelligence work
• COVID-19 financial crime taskforce — identifying pandemic-related scams and fraud
• Crypto typologies — joint analysis of virtual asset-related financial crime

Why it matters for compliance teams:
• Fintel Alliance typology reports are published and available on the AUSTRAC website
• These reports provide real-world red flag indicators and case studies based on actual SMR data
• Compliance programs should incorporate Fintel Alliance typologies into transaction monitoring scenarios

Source: AUSTRAC Fintel Alliance — austrac.gov.au/fintel-alliance`
  },
  {
    keywords: ['tipping off', 'tip off', 'tip-off', 'disclose smr', 'notify customer smr', 'disclose investigation', 'tip off prohibition'],
    reply: `Tipping off is the prohibited act of disclosing to a person that a Suspicious Matter Report (SMR) has been, is being, or may be filed about them or their transactions.

Legal prohibition (AML/CTF Act 2006, Section 123):
• It is a criminal offence for a reporting entity, its officers, or employees to tip off a customer or any person who might alert the customer
• Penalty: Up to 2 years imprisonment

What constitutes tipping off:
• Telling a customer "we've reported you to AUSTRAC"
• Asking a customer to explain suspicious activity in a way that alerts them to the investigation
• Sharing the existence of an SMR with colleagues who don't need to know (information barriers)
• Inadvertently disclosing the SMR through document production in civil proceedings

What is NOT tipping off:
• Disclosures made to AUSTRAC or law enforcement
• Disclosures required by court order (with proper protections)
• Disclosures within the same corporate group for AML/CTF compliance purposes (subject to conditions)
• Communications between a reporting entity and its professional legal advisers for legal advice

Practical guidance:
• Train staff on the tipping off prohibition as part of AML/CTF awareness training
• When filing an SMR, do not alert the customer — proceed with the transaction normally where safe to do so
• If you genuinely believe the transaction should not proceed, take appropriate steps (e.g., refuse the service) without referencing AUSTRAC reporting

Source: AML/CTF Act 2006, Section 123; AUSTRAC Tipping Off guidance`
  },

  // ── Greetings / help ──────────────────────────────────────────────────────

  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start', 'what can you do', 'what do you know'],
    reply: `Hello! I'm your AML Compliance Assistant — covering global AML frameworks and AUSTRAC guidance.

GLOBAL AML:
• AML fundamentals and the three stages of money laundering
• KYC, CDD, and Enhanced Due Diligence (EDD)
• Suspicious Activity Reports (SARs) and Currency Transaction Reports (CTRs)
• FATF recommendations, grey/black lists, and typologies
• Red flags and transaction monitoring
• OFAC sanctions screening
• Beneficial ownership and shell company risks
• Structuring and smurfing
• Trade-Based Money Laundering (TBML)
• Correspondent banking AML risks
• Bank Secrecy Act (BSA) requirements

AUSTRAC & AUSTRALIAN AML/CTF:
• What is AUSTRAC and how it regulates
• AML/CTF Act 2006 and AML/CTF Rules
• AML/CTF Programs (Part A and Part B)
• Suspicious Matter Reports (SMRs)
• Threshold Transaction Reports (TTRs)
• International Funds Transfer Instructions (IFTIs)
• Reporting entities and designated services
• Enterprise-Wide Risk Assessment (EWRA)
• Ongoing Customer Due Diligence (OCDD)
• Digital Currency Exchange (DCE) regulation
• Remittance sector obligations
• Tipping off prohibition
• AUSTRAC e-learning modules
• AUSTRAC enforcement actions (Westpac, CBA)
• Fintel Alliance

Try asking "What is an SMR?" or "What is an IFTI?" — or use the quick questions in the sidebar.`
  },
]

function findReply(message) {
  const lower = message.toLowerCase()

  for (const entry of knowledge) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.reply
    }
  }

  return `I don't have a specific answer for "${message}" in my current knowledge base.

GLOBAL AML topics I can help with:
• What is AML / money laundering
• The 3 stages of money laundering
• KYC / CDD / EDD requirements
• Suspicious Activity Reports (SARs)
• Currency Transaction Reports (CTRs)
• AML red flags and transaction monitoring
• FATF recommendations and grey/black lists
• Politically Exposed Persons (PEPs)
• Structuring and smurfing
• OFAC sanctions screening
• Beneficial ownership and shell companies
• Bank Secrecy Act (BSA)
• Trade-Based Money Laundering (TBML)
• Correspondent banking risks

AUSTRAC & Australian AML/CTF topics:
• What is AUSTRAC
• AML/CTF Act 2006
• AML/CTF Programs (Part A & Part B)
• Suspicious Matter Reports (SMRs)
• Threshold Transaction Reports (TTRs)
• International Funds Transfer Instructions (IFTIs)
• Reporting entities and designated services
• Enterprise-Wide Risk Assessment (EWRA)
• Ongoing Customer Due Diligence (OCDD)
• Digital Currency Exchange (DCE) regulation
• Remittance sector obligations
• Tipping off prohibition
• AUSTRAC e-learning modules
• AUSTRAC enforcement actions
• Fintel Alliance

Try rephrasing your question or select a quick question from the sidebar.`
}

app.post('/chat', (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const reply = findReply(message.trim())
  res.json({ reply })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AML Compliance Assistant API' })
})

app.listen(PORT, () => {
  console.log(`AML Assistant API running on http://localhost:${PORT}`)
})
