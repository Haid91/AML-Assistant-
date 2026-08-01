import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';
import { getUserByEmail, createUser, updateUserName, updateUserPassword, getProgramDraft, saveProgramDraft, createSession, getSessionEmail, deleteSession } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
})

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
})

const programDraftLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many draft requests. Please try again later.' },
})

const estimateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please try again later.' },
})

function asyncRoute(handler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      console.error('Unexpected error:', err)
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    }
  }
}

// ── Anthropic client ──────────────────────────────────────────────────────────
const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_api_key_here'
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// ── Sessions / reset tokens ───────────────────────────────────────────────────
// Users and sessions are persisted in Postgres (see db.js) so signed-in users
// stay signed in across server restarts. Reset tokens stay in-memory — they're
// short-lived, and losing one on restart just means requesting a new reset link.
const resetTokens = new Map() // token → { email, expiresAt }

// ── Email / SMTP ──────────────────────────────────────────────────────────────
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'your_email_password_here') return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

async function sendResetEmail(toEmail, name, resetUrl) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log(`\n📧 Password reset link (configure SMTP_PASS in .env to send real emails):\n   ${resetUrl}\n`)
    return
  }
  await transporter.sendMail({
    from: `"AmlIntel" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Reset your AmlIntel password',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:36px;height:36px;background:#2563eb;border-radius:8px;line-height:36px;text-align:center;color:#fff;font-weight:700;font-size:13px">AML</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">Reset your password</h2>
        <p style="margin:0 0 24px;color:#475569;font-size:15px">Hi ${name}, we received a request to reset your AmlIntel password. Click the button below — the link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:13px 28px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Reset Password</a>
        <p style="margin:28px 0 0;color:#94a3b8;font-size:13px">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
        <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0"/>
        <p style="margin:0;color:#94a3b8;font-size:12px">AML Compliance Assistant</p>
      </div>
    `,
  })
}

async function sendEstimateEmail(toEmail, { industryLabel, people, annualTotal, monthlyEquivalent }) {
  const transporter = createTransporter()
  const summary = `${industryLabel} · ${people} ${people === 1 ? 'person' : 'people'} · $${annualTotal.toFixed(2)}/year ($${monthlyEquivalent.toFixed(2)}/month)`
  if (!transporter) {
    console.log(`\n📧 Cost estimate (configure SMTP_PASS in .env to send real emails):\n   To: ${toEmail}\n   ${summary}\n`)
    return
  }
  await transporter.sendMail({
    from: `"AmlIntel" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your AmlIntel cost estimate',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:36px;height:36px;background:#2563eb;border-radius:8px;line-height:36px;text-align:center;color:#fff;font-weight:700;font-size:13px">AML</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">Your AmlIntel cost estimate</h2>
        <p style="margin:0 0 20px;color:#475569;font-size:15px">Here's the Premium plan estimate you requested:</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px">
          <p style="margin:0 0 4px;color:#64748b;font-size:13px">${industryLabel} · ${people} ${people === 1 ? 'person' : 'people'}</p>
          <p style="margin:0;color:#0f172a;font-size:28px;font-weight:700">$${annualTotal.toFixed(2)} <span style="font-size:14px;font-weight:500;color:#64748b">/ year</span></p>
          <p style="margin:2px 0 0;color:#64748b;font-size:13px">$${monthlyEquivalent.toFixed(2)} / month equivalent</p>
        </div>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:13px">This is an illustrative estimate, not a quote.</p>
        <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0"/>
        <p style="margin:0;color:#94a3b8;font-size:12px">AML Compliance Assistant</p>
      </div>
    `,
  })
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

async function sendContactEmail({ name, email, subject, message }) {
  const transporter = createTransporter()
  const inboxAddress = process.env.EMAIL_FROM || process.env.SMTP_USER
  if (!transporter) {
    console.log(`\n📧 Contact message (configure SMTP_PASS in .env to send real emails):\n   From: ${name} <${email}>\n   Subject: ${subject}\n   Message: ${message}\n`)
    return
  }
  await transporter.sendMail({
    from: `"AmlIntel Contact Form" <${inboxAddress}>`,
    to: inboxAddress,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:36px;height:36px;background:#2563eb;border-radius:8px;line-height:36px;text-align:center;color:#fff;font-weight:700;font-size:13px">AML</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">New contact form message</h2>
        <p style="margin:0 0 4px;color:#475569;font-size:14px"><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p style="margin:0 0 20px;color:#475569;font-size:14px"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;white-space:pre-wrap;color:#0f172a;font-size:14px">${escapeHtml(message)}</div>
        <p style="margin:0;color:#94a3b8;font-size:12px">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
      </div>
    `,
  })
}

const PREMIUM_EMAILS = new Set(['haidershahid3.16@live.com'])

function isPremiumUser(user) {
  return !!(user.premium || PREMIUM_EMAILS.has(user.email))
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

// Legacy hash from before bcrypt migration — kept only to verify existing accounts' passwords.
function legacyHashPassword(password) {
  return crypto.createHash('sha256').update(password + 'aml_salt_2026').digest('hex')
}

function verifyPassword(password, storedHash) {
  if (storedHash.startsWith('$2')) return bcrypt.compareSync(password, storedHash)
  return storedHash === legacyHashPassword(password)
}

// ── Auth routes ───────────────────────────────────────────────────────────────
app.post('/auth/register', authLimiter, asyncRoute(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  const lowerEmail = email.toLowerCase()
  if (await getUserByEmail(lowerEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }
  const id = crypto.randomUUID()
  const passwordHash = hashPassword(password)
  const premium = PREMIUM_EMAILS.has(lowerEmail)
  try {
    await createUser({ id, name, email: lowerEmail, passwordHash, premium })
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'An account with this email already exists' })
    throw err
  }
  const token = crypto.randomUUID()
  await createSession(token, lowerEmail)
  res.json({ token, user: { id, name, email: lowerEmail, premium } })
}))

app.post('/auth/login', authLimiter, asyncRoute(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = await getUserByEmail(email.toLowerCase())
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  if (!user.passwordHash.startsWith('$2')) {
    await updateUserPassword(user.email, hashPassword(password))
  }
  const token = crypto.randomUUID()
  await createSession(token, user.email)
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, premium: user.premium || PREMIUM_EMAILS.has(user.email) } })
}))

app.post('/auth/logout', asyncRoute(async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) await deleteSession(token)
  res.json({ success: true })
}))

async function getUserFromAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const email = await getSessionEmail(token)
  if (!email) return null
  return getUserByEmail(email)
}

app.post('/auth/update-profile', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' })
  const trimmedName = name.trim()
  await updateUserName(user.email, trimmedName)
  res.json({ user: { id: user.id, name: trimmedName, email: user.email, premium: user.premium || PREMIUM_EMAILS.has(user.email) } })
}))

app.post('/auth/change-password', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password are required' })
  if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' })
  if (!verifyPassword(currentPassword, user.passwordHash)) return res.status(401).json({ error: 'Current password is incorrect' })
  await updateUserPassword(user.email, hashPassword(newPassword))
  res.json({ success: true })
}))

app.post('/auth/forgot-password', authLimiter, asyncRoute(async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })
  const lowerEmail = email.toLowerCase().trim()
  const user = await getUserByEmail(lowerEmail)
  // Always respond success to prevent email enumeration
  if (!user) return res.json({ success: true })
  // Invalidate any existing token for this email
  for (const [tok, entry] of resetTokens) {
    if (entry.email === lowerEmail) resetTokens.delete(tok)
  }
  const token = crypto.randomUUID()
  resetTokens.set(token, { email: lowerEmail, expiresAt: Date.now() + 60 * 60 * 1000 })
  const resetUrl = `${FRONTEND_URL}/?action=reset&token=${token}`
  try {
    await sendResetEmail(lowerEmail, user.name, resetUrl)
  } catch (err) {
    console.error('Failed to send reset email:', err.message)
    console.log(`Reset URL (fallback): ${resetUrl}`)
  }
  res.json({ success: true })
}))

app.post('/auth/reset-password', asyncRoute(async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
  const entry = resetTokens.get(token)
  if (!entry || entry.expiresAt < Date.now()) {
    resetTokens.delete(token)
    return res.status(400).json({ error: 'This reset link has expired or is invalid. Please request a new one.' })
  }
  const user = await getUserByEmail(entry.email)
  if (!user) return res.status(400).json({ error: 'Account not found.' })
  await updateUserPassword(entry.email, hashPassword(password))
  resetTokens.delete(token)
  res.json({ success: true })
}))

// ── AML system prompt ─────────────────────────────────────────────────────────
const AML_SYSTEM_PROMPT = `You are an expert AML (Anti-Money Laundering) Compliance AI Assistant with deep knowledge of global AML/CFT frameworks and Australian AUSTRAC regulations. You provide accurate, detailed, professional guidance to compliance professionals, MLROs, analysts, and regulated entities.

YOUR EXPERTISE COVERS:

GLOBAL AML FRAMEWORKS:
- FATF 40 Recommendations, mutual evaluations, grey/black lists
- Bank Secrecy Act (BSA), USA PATRIOT Act, FinCEN regulations and guidance
- EU AML Directives (AMLD4, AMLD5, AMLD6) and DORA
- OFAC sanctions programs, SDN list, country-based sanctions
- Egmont Group financial intelligence sharing
- Wolfsberg Group principles (correspondent banking, PEPs, trade finance)

KYC / CDD / EDD:
- Customer Identification Programs (CIP), Customer Due Diligence (CDD) Rule
- Enhanced Due Diligence (EDD) for PEPs, high-risk jurisdictions, complex structures
- Simplified Due Diligence (SDD) criteria
- Beneficial ownership requirements (FinCEN CDD Rule, Corporate Transparency Act, FATF R.24/25)
- Ongoing Customer Due Diligence (OCDD) and periodic reviews
- KYC refresh triggers and risk-based review cycles
- CDD scenarios across industries: banking, fintech, crypto, remittance, real estate, legal, accounting, gambling

TRANSACTION MONITORING:
- Live transaction monitoring guidance: rule design, thresholds, alert review workflows
- Scenario tuning, false positive reduction, model validation
- Typologies: structuring, smurfing, layering, rapid movement, dormant accounts
- Trade-Based Money Laundering (TBML): over/under-invoicing, phantom shipments, black market peso exchange
- Correspondent banking nested accounts and payable-through account risks
- Virtual asset / crypto monitoring: mixing services, privacy coins, darknet wallet addresses
- Human trafficking indicators, tax evasion typologies, real estate ML
- Sanctions screening: real-time, batch, fuzzy matching, adverse media

SMR / SAR INVESTIGATION WORKFLOW:
- Full SMR/SAR investigation workflow: alert triage → case opening → evidence gathering → SMR/SAR decision
- MLRO sign-off process, consent SARs (Defence Against Money Laundering — DAML)
- SMR/SAR narrative writing best practice: who, what, when, where, why, how
- FinCEN SAR rules (31 CFR §1020.320), UK Proceeds of Crime Act SARs, Australian SMR obligations (Section 41 AML/CTF Act 2006)
- Tipping-off prohibition (US and Australian law), safe harbour protection
- SMR/SAR filing timeframes: 30 days (US banks), 24 hours terrorism (AUSTRAC), 3 business days other (AUSTRAC)
- Voluntary SMR/SAR filing considerations and best practice
- SMR/SAR management and case tracking

SMR/SAR DRAFTING FORMAT — MANDATORY STRUCTURE:
When a user asks you to draft, write, or help with an SMR or SAR narrative, ALWAYS use this exact three-section structure. Do not use any other format. Populate each section with realistic placeholder details if the user has not provided specific facts, and instruct them to replace the placeholders with actual case data.

The three sections are: CONCERN, CUSTOMER PROFILING, and SUSPICIOUS ACTIVITY.

CONCERN section: Write 2-4 sentences summarising the nature and basis of the suspicion. State the specific typology (e.g., structuring, third-party cash layering, rapid fund movement, smurfing) and cite the applicable legislation. For Australia: "reasonable grounds to suspect under Section 41 of the AML/CTF Act 2006". For the US: "suspicious activity indicative of intent to evade BSA reporting requirements under 31 USC 5324". For the UK: "knowledge or suspicion of money laundering under Part 7 of the Proceeds of Crime Act 2002".

CUSTOMER PROFILING section: Provide KYC details and risk profile including: full name, date of birth, address, occupation/business (as declared in KYC), declared income or turnover, customer since date, account type(s) and masked account number(s), risk rating at last review, PEP/sanctions status, prior SMR/SAR history, and adverse media findings.

SUSPICIOUS ACTIVITY section: This is the most important section. List EVERY relevant credit (incoming) and debit (outgoing) transaction individually in this exact format:
- 1 x credit of $[amount] from [Bank Name] account [masked account number] in the name of [Sender Name] on [DD/MM/YYYY]
- 1 x debit of $[amount] to [Bank Name] account [masked account number] in the name of [Recipient Name] on [DD/MM/YYYY]

After listing all transactions, provide: Total credits for the period, Total debits for the period, Net movement, and Current account balance. Then list all red flags observed as bullet points.

ALWAYS follow this Concern / Customer Profiling / Suspicious Activity structure for every SMR/SAR draft. After producing the draft, offer to refine any section or add jurisdiction-specific detail (AUSTRAC, FinCEN, FCA, FINTRAC, etc.).

AUSTRAC & AUSTRALIAN AML/CTF:
- AML/CTF Act 2006 (Cth) and AML/CTF Rules 2007 — full working knowledge
- AML/CTF Programs: Part A (enterprise-wide risk management) and Part B (KYC/CDD procedures)
- Suspicious Matter Reports (SMRs) — Section 41 obligations, timeframes, AUSTRAC Online portal
- Threshold Transaction Reports (TTRs) — Section 43, AUD $10,000 threshold, aggregation rules
- International Funds Transfer Instructions (IFTIs) — Section 45, both inbound and outbound
- Reporting entities and designated services (Table 1 and Table 2, Section 6)
- Enterprise-Wide Risk Assessment (EWRA): four risk factors (customer, product/service, delivery channel, jurisdiction)
- Ongoing Customer Due Diligence (OCDD): Chapter 15 AML/CTF Rules
- Digital Currency Exchange (DCE) registration and obligations
- Remittance Network Providers (RNPs) and independent remittance dealers
- Tipping off prohibition — Section 123 AML/CTF Act, up to 2 years imprisonment
- AUSTRAC enforcement actions: Commonwealth Bank ($700M), Westpac ($1.3B), SkyCity, Star Entertainment
- Fintel Alliance public-private partnership and typology intelligence
- 2024 AML/CTF Act Reforms: Tranche 2 expansion (lawyers, accountants, real estate agents, TCSPs)
- AUSTRAC e-learning modules and guidance publications

FATF & AUSTRAC COMPLIANCE MAPPING:
- Map FATF Recommendations to Australian AML/CTF Act obligations
- Risk-based approach implementation and documentation
- Independent review requirements and audit planning
- Compliance gap analysis and remediation planning
- Board reporting and governance frameworks
- Staff training program design

INDUSTRY-SPECIFIC CDD SCENARIOS:
- Banking: retail, business, corporate, private banking
- Fintech and payments: e-wallets, BNPL, neobanks
- Crypto and digital assets: DCE, DeFi, NFT platforms
- Remittance and money transfer operators
- Real estate: agent obligations (Tranche 2), high-value transactions
- Legal and accounting: Tranche 2 obligations, legal professional privilege
- Gambling: casinos (SkyCity, Star learnings), online wagering
- Bullion dealers

RESPONSE STYLE:
- Be precise, professional, and practical — you are advising compliance professionals
- Use structured formatting (headings, bullet points) for complex topics
- Cite specific legislation and regulation references where relevant (e.g., "Section 41, AML/CTF Act 2006")
- For investigation/workflow questions, provide step-by-step guidance
- For scenario questions, walk through the analysis systematically
- Always note when something requires professional legal advice for the specific circumstances
- Tailor depth to the question: brief questions get concise answers, complex questions get thorough analysis
- When asked about a specific case or scenario, provide concrete actionable guidance
- ALWAYS refer to suspicious reports as "SMR/SAR" (never SAR alone unless the user specifies a US-only context)
- When drafting any suspicious report, ALWAYS use the three-section format: CONCERN / CUSTOMER PROFILING / SUSPICIOUS ACTIVITY

IMPORTANT DISCLAIMER: Always include a brief disclaimer for highly specific legal/compliance decisions that a qualified compliance professional or legal counsel should be consulted for advice specific to their circumstances and jurisdiction.`

// ── AML/CTF Program draft system prompt ───────────────────────────────────────
const PROGRAM_DRAFT_SYSTEM_PROMPT = `You are an AML/CTF compliance drafting assistant. Given a Business Profile describing an Australian Tranche 2 reporting entity (lawyer/conveyancer, accountant/bookkeeper, real estate agent, trust & company service provider, or precious metals/stones dealer), produce a first-pass draft AML/CTF Program tailored to that business, grounded in the AML/CTF Act 2006 (Cth) and AML/CTF Rules.

OUTPUT FORMAT — MANDATORY:
Output plain text only. Do not use markdown syntax (no #, no **, no backticks). Use ALL-CAPS section headers and numbered subsections, with blank lines between subsections, so the document reads clearly as plain text.

Structure the document in exactly this order:

PART A — GOVERNANCE & RISK-BASED FRAMEWORK
1. Risk Appetite Statement
2. Enterprise-Wide Risk Assessment (EWRA) Summary — reason from the specific Business Profile fields provided (industry, services, client types, delivery channels) to identify and rate the business's actual ML/TF risk factors. Do not use generic filler; reference the submitted details directly.
3. AML/CTF Compliance Officer — role, seniority, and responsibilities (note whether the profile indicates one is already appointed)
4. Staff Training Program — cadence and content, tailored to team size
5. Independent Review — required cycle and what a review should check

PART B — CUSTOMER IDENTIFICATION PROCEDURES
6. Customer Due Diligence (CDD) Procedures by Risk Tier — standard, and when to escalate
7. Enhanced Due Diligence (EDD) Triggers — specific to this business's client types and services
8. Record-Keeping — what to retain and for how long (7 years)
9. Ongoing Monitoring & Reporting Reminder — SMR (Section 41) and TTR (Section 43) obligations and timeframes

Close with a section titled DISCLAIMER containing 2-3 sentences stating plainly that this is an AI-generated first-pass draft based only on the information provided, is a starting point for building a compliant program, is not legal advice, and must be reviewed and finalised by a qualified AML/CTF professional or lawyer before being relied on or submitted to AUSTRAC.

Be specific and reference the submitted Business Profile throughout rather than writing generic boilerplate — a business with no compliance officer yet should get a section that says so and explains what to do next; a business with client types including overseas/international clients should get EDD guidance that reflects that.`

function buildBusinessProfileText(intake) {
  const {
    businessName, industry, services, staffSize,
    clientTypes, deliveryChannels, hasComplianceOfficer, hasRiskAssessment,
  } = intake || {}
  return `Business Profile
- Business name: ${businessName || 'Not provided'}
- Industry: ${industry || 'Not provided'}
- Designated services provided: ${Array.isArray(services) && services.length ? services.join(', ') : 'Not provided'}
- Staff size: ${staffSize || 'Not provided'}
- Client types: ${Array.isArray(clientTypes) && clientTypes.length ? clientTypes.join(', ') : 'Not provided'}
- Delivery channels: ${Array.isArray(deliveryChannels) && deliveryChannels.length ? deliveryChannels.join(', ') : 'Not provided'}
- AML/CTF Compliance Officer already appointed: ${hasComplianceOfficer ? 'Yes' : 'No'}
- Risk assessment already completed: ${hasRiskAssessment ? 'Yes' : 'No'}

Draft a first-pass AML/CTF Program (Part A and Part B) for this business, following the mandatory structure and grounding every section in these specific details.`
}

// ── Fallback responses (used when no API key is configured) ──────────────────
const SMR_SAR_DRAFT_TEMPLATE = `SUSPICIOUS MATTER REPORT (SMR) / SUSPICIOUS ACTIVITY REPORT (SAR)

Report Reference: [Internal Case/Alert ID — e.g., AML-2026-00147]
Date of Report: [DD/MM/YYYY]
Reporting Entity: [Your Institution Name]
MLRO / Authorising Officer: [Full Name, Title]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONCERN:

This report is filed on the basis of reasonable grounds to suspect that the account holder has engaged in structured cash deposit activity designed to avoid the AUD $10,000 Threshold Transaction Report (TTR) obligation under Section 43 of the AML/CTF Act 2006. The reporting entity suspects this activity may constitute money laundering under Part 10.2 of the Criminal Code Act 1995 (Cth).

Between [Start Date] and [End Date], the subject [Full Name] made multiple cash deposits totalling AUD $[Total Amount] across several transactions, each kept below the reporting threshold. The volume and pattern of activity is grossly inconsistent with the customer's declared occupation and income profile, and is consistent with the money laundering typology of deliberate third-party cash structuring (smurfing).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER PROFILING:

- Full name: [First Name Last Name]
- Date of birth: [DD/MM/YYYY]
- Address: [Full residential address]
- Occupation / Business: [As declared in KYC records — e.g., "Casual Hospitality Worker"]
- Declared annual income: AUD $[Amount] per annum
- Customer since: [DD/MM/YYYY]
- Account type(s): [e.g., Personal Transaction Account]
- Account number(s): [Masked — e.g., xxxx-xxxx-xxxx-1234]
- Risk rating at last review: [Low / Medium / High] (reviewed [DD/MM/YYYY])
- PEP status: [Clear / Match — provide detail if match]
- Sanctions screening: [Clear / Match — provide detail if match]
- Prior SMR/SAR history: [None on file / Yes — reference prior report ID]
- Adverse media: [None identified / Yes — summarise finding]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUSPICIOUS ACTIVITY:

Credits (incoming transactions):
- 1 x credit of $[Amount] from [Bank Name] account [masked account number] in the name of [Sender Full Name] on [DD/MM/YYYY]
- 1 x credit of $[Amount] from [Bank Name] account [masked account number] in the name of [Sender Full Name] on [DD/MM/YYYY]
- 1 x credit of $[Amount] from [Bank Name] account [masked account number] in the name of [Sender Full Name] on [DD/MM/YYYY]
- 1 x credit of $[Amount] from [Bank Name] account [masked account number] in the name of [Sender Full Name] on [DD/MM/YYYY]
[Add all additional credit transactions]

Debits (outgoing transactions):
- 1 x debit of $[Amount] to [Bank Name] account [masked account number] in the name of [Recipient Full Name] on [DD/MM/YYYY]
[Add all debit transactions, or state "Nil — no debits recorded during the review period"]

Total credits for the period: AUD $[Sum of all credits]
Total debits for the period: AUD $[Sum of all debits]
Net movement: AUD $[Credits minus debits]
Account balance at date of report: AUD $[Current balance]

Red flags observed:
- Multiple cash deposits from unrelated third parties, each calibrated below the AUD $10,000 TTR threshold — consistent with deliberate structuring
- Deposits made across [X] different branch locations by [X] different individuals — indicative of coordinated smurfing activity
- Deposit amounts consistently between $[Low] and $[High] — showing awareness of the reporting threshold
- Account balance accumulating with minimal withdrawals — inconsistent with declared income use (wages, living expenses)
- Total deposit volume of AUD $[Amount] over [X] days is approximately [X]x the customer's declared annual income of AUD $[Income]
- No plausible business or personal explanation obtained that accounts for the volume, frequency, or multi-depositor pattern

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Note: Replace all bracketed placeholders with actual case data before submission. File via AUSTRAC Online within 3 business days of forming reasonable grounds to suspect (or within 24 hours if terrorism financing is suspected). Do not tip off the subject — Section 123, AML/CTF Act 2006.

⚠️ Add your Anthropic API key to backend/.env to get AI-generated drafts tailored to your specific case facts.`

const knowledge = [
  {
    keywords: ['draft', 'smr', 'sar', 'suspicious matter report', 'suspicious activity report', 'narrative', 'write a report', 'help me draft', 'structuring case', 'structuring report'],
    reply: SMR_SAR_DRAFT_TEMPLATE,
  },
  {
    keywords: ['what is aml', 'define aml', 'anti-money laundering', 'explain aml'],
    reply: `Anti-Money Laundering (AML) refers to laws, regulations, and procedures designed to prevent criminals from disguising illegally obtained funds as legitimate income.\n\nKey frameworks: FATF 40 Recommendations, Bank Secrecy Act (US), EU AML Directives, Australia's AML/CTF Act 2006.\n\n⚠️ Add your Anthropic API key to backend/.env for full AI-powered responses tailored to your question.`,
  },
  {
    keywords: ['3 stages', 'three stages', 'placement', 'layering', 'integration'],
    reply: `The 3 stages of money laundering:\n\n1. PLACEMENT — illegal cash enters the financial system\n2. LAYERING — funds are separated from criminal origin through complex transactions\n3. INTEGRATION — laundered funds re-enter the legitimate economy\n\n⚠️ Add your Anthropic API key to backend/.env for full AI-powered responses.`,
  },
  {
    keywords: ['austrac', 'ttr', 'ifti', 'aml/ctf act', 'reporting entity', 'ewra', 'ocdd'],
    reply: `AUSTRAC is Australia's AML/CTF regulator under the AML/CTF Act 2006. Key obligations include SMRs, TTRs, IFTIs, and maintaining an AML/CTF Program (Part A and Part B).\n\n⚠️ Add your Anthropic API key to backend/.env for full AI-powered responses.`,
  },
]

function fallbackReply(message) {
  const lower = message.toLowerCase()
  for (const entry of knowledge) {
    if (entry.keywords.some((kw) => lower.includes(kw))) return entry.reply
  }
  return `I can see you're asking: "${message}"\n\n⚠️ The AI assistant requires an Anthropic API key to answer open-ended questions. To activate it:\n\n1. Go to console.anthropic.com → API Keys → Create Key\n2. Open business/backend/.env\n3. Replace "your_api_key_here" with your key (starts with sk-ant-...)\n4. Restart the backend server\n\nIn the meantime, try asking me to "draft an SMR" or "draft a SAR" — I can produce a full template for that right now.`
}

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.post('/chat', chatLimiter, async (req, res) => {
  const { message, history } = req.body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' })
  }

  // If no API key configured, use fallback
  if (!anthropic) {
    const reply = fallbackReply(message.trim())
    return res.json({ reply })
  }

  try {
    // Build message history for context (last 10 exchanges max)
    const messages = []
    if (Array.isArray(history)) {
      const recent = history.slice(-20) // last 10 exchanges (20 messages)
      for (const msg of recent) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.text || msg.content || '' })
        }
      }
    }
    messages.push({ role: 'user', content: message.trim() })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: AML_SYSTEM_PROMPT,
      messages,
    })

    const reply = response.content[0]?.text || 'No response generated.'
    res.json({ reply })
  } catch (err) {
    console.error('Claude API error:', err.message)
    if (err.status === 401) {
      return res.status(500).json({ reply: 'Invalid API key. Please check your ANTHROPIC_API_KEY in backend/.env and restart the server.' })
    }
    res.status(500).json({ reply: 'The AI service encountered an error. Please try again in a moment.' })
  }
})

// ── AML/CTF Program draft endpoints ───────────────────────────────────────────
app.post('/program-draft', programDraftLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const intake = req.body?.intake
  if (!intake || typeof intake !== 'object') {
    return res.status(400).json({ error: 'Business intake details are required' })
  }

  if (!anthropic) {
    return res.status(503).json({ error: 'AI program drafting is not available right now. Please try again later.' })
  }

  try {
    const profileText = buildBusinessProfileText(intake)
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 16000,
      system: PROGRAM_DRAFT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: profileText }],
    })

    const draftText = response.content[0]?.text || ''
    if (!draftText) return res.status(500).json({ error: 'No draft was generated. Please try again.' })

    const businessName = intake.businessName || null
    await saveProgramDraft({ id: crypto.randomUUID(), userId: user.id, businessName, intake, draftText })
    res.json({ draft: { businessName, intake, draftText } })
  } catch (err) {
    console.error('Claude API error (program draft):', err.message)
    if (err.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in backend/.env and restart the server.' })
    }
    res.status(500).json({ error: 'The AI service encountered an error while drafting your program. Please try again in a moment.' })
  }
}))

app.get('/program-draft', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const draft = await getProgramDraft(user.id)
  res.json({ draft })
}))

// ── Cost estimate email ───────────────────────────────────────────────────────
const COST_INDUSTRIES = {
  lawyers: 'Lawyers & Conveyancers',
  accountants: 'Accountants',
  realestate: 'Real Estate Agents',
  tcsp: 'Trust & Company Service Providers',
  bullion: 'Dealers in Precious Metals & Stones',
  other: 'Other Tranche 2 Professionals',
}
const COST_PREMIUM_MONTHLY = 49.99

app.post('/email-estimate', estimateLimiter, asyncRoute(async (req, res) => {
  const { email, industry, people } = req.body
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
  }
  const industryLabel = COST_INDUSTRIES[industry]
  if (!industryLabel) {
    return res.status(400).json({ error: 'Invalid industry' })
  }
  const peopleCount = Number(people)
  if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 500) {
    return res.status(400).json({ error: 'Invalid team size' })
  }

  const annualTotal = COST_PREMIUM_MONTHLY * 12 * peopleCount
  const monthlyEquivalent = annualTotal / 12

  try {
    await sendEstimateEmail(email.trim(), { industryLabel, people: peopleCount, annualTotal, monthlyEquivalent })
  } catch (err) {
    console.error('Failed to send estimate email:', err.message)
    console.log(`Estimate (fallback): ${email.trim()} — ${industryLabel}, ${peopleCount} people, $${annualTotal.toFixed(2)}/year`)
  }
  res.json({ success: true })
}))

// ── Contact form ───────────────────────────────────────────────────────────────
app.post('/contact', contactLimiter, asyncRoute(async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || typeof name !== 'string' || !name.trim() || name.trim().length > 200) {
    return res.status(400).json({ error: 'Please enter your name' })
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
  }
  if (!subject || typeof subject !== 'string' || !subject.trim() || subject.trim().length > 200) {
    return res.status(400).json({ error: 'Please enter a subject' })
  }
  if (!message || typeof message !== 'string' || !message.trim() || message.trim().length > 5000) {
    return res.status(400).json({ error: 'Please enter a message (max 5000 characters)' })
  }

  try {
    await sendContactEmail({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })
  } catch (err) {
    console.error('Failed to send contact email:', err.message)
    console.log(`Contact message (fallback): ${name.trim()} <${email.trim()}> — ${subject.trim()}: ${message.trim()}`)
  }
  res.json({ success: true })
}))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AML Compliance Assistant API', aiEnabled: !!anthropic })
})

app.listen(PORT, () => {
  console.log(`AmlIntel API running on http://localhost:${PORT}`)
  if (anthropic) {
    console.log('✅ AI assistant: ENABLED (Claude API connected)')
  } else {
    console.log('⚠️  AI assistant: DISABLED — add ANTHROPIC_API_KEY to .env and restart')
  }
})
