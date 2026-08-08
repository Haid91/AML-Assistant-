import 'dotenv/config'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import Stripe from 'stripe';
import rateLimit from 'express-rate-limit';
import { getUserByEmail, createUser, updateUserName, updateUserPassword, getProgramDraft, saveProgramDraft, getPrivacyDraft, savePrivacyDraft, saveMockExamAttempt, getMockExamAttempts, getComplianceChecklist, saveComplianceChecklist, getClientRiskEntries, createClientRiskEntry, updateClientRiskEntry, deleteClientRiskEntry, getCaseNotes, addCaseNote, deleteCaseNote, getChatSessions, createChatSession, updateChatSession, deleteChatSession, createDocumentVersion, getDocumentVersions, createSession, getSessionEmail, deleteSession, updateUserStripeInfo, setPremiumByStripeCustomerId, logAiUsage, getAiUsageSummary } from './db.js';
import { refreshAllSanctionsLists, getSanctionsListsStatus, screenName, getWatchlistCount, addToWatchlist, getWatchlist, removeFromWatchlist, refreshWatchlistChecks } from './sanctions.js';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// This is a pure JSON API (the frontend is served separately), so helmet's
// default CSP — built for serving HTML — isn't relevant and is disabled;
// the rest of its defaults (X-Content-Type-Options, HSTS, removing
// X-Powered-By, etc.) apply as normal.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// ── Stripe webhook ────────────────────────────────────────────────────────────
// Must be registered with the raw body BEFORE express.json() below — Stripe's
// signature verification needs the exact bytes it signed, not a parsed/re-serialized copy.
const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_key_here'
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

app.post('/billing/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Billing is not configured' })
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.customer) {
          let plan = null
          if (session.subscription) {
            try {
              const sub = await stripe.subscriptions.retrieve(session.subscription)
              const priceId = sub.items?.data?.[0]?.price?.id
              plan = priceId && priceId === process.env.STRIPE_PRICE_ID_PROFESSIONAL ? 'professional' : 'premium'
            } catch (err) {
              // A failed price lookup shouldn't block granting premium below
              // — plan just stays null (unknown) for this event.
              console.error('[billing] failed to look up subscription price:', err.message)
            }
          }
          const user = await setPremiumByStripeCustomerId(session.customer, true, session.subscription, plan)
          if (user && plan === 'professional') {
            try {
              await sendProfessionalSubscriberEmail({ name: user.name, email: user.email })
            } catch (err) {
              // Never let a notification failure fail the webhook itself —
              // Stripe retries non-2xx responses, and premium access is
              // already granted above regardless of this email's outcome.
              console.error('[billing] Professional-subscriber notification failed:', err.message)
            }
          }
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const active = ['active', 'trialing'].includes(sub.status)
        const priceId = sub.items?.data?.[0]?.price?.id
        const plan = priceId && priceId === process.env.STRIPE_PRICE_ID_PROFESSIONAL ? 'professional' : 'premium'
        await setPremiumByStripeCustomerId(sub.customer, active, sub.id, plan)
        break
      }
    }
    res.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

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

const mockExamLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
})

const complianceLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
})

const clientRegisterLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
})

// Higher limit than other CRUD limiters — a single conversation can fire a
// PUT after every exchange, so normal chat use can rack up many requests.
const chatSessionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
})

const sanctionsScreenLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down and try again shortly.' },
})

const billingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
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

// Fire-and-forget — a logging failure must never break the actual AI
// response the user is waiting on. Lets real Claude API spend per
// subscriber be measured later instead of estimated (see getAiUsageSummary).
function recordAiUsage(userId, route, response) {
  const usage = response?.usage
  if (!usage) return
  logAiUsage({
    id: crypto.randomUUID(),
    userId,
    route,
    model: response.model || 'unknown',
    inputTokens: usage.input_tokens || 0,
    outputTokens: usage.output_tokens || 0,
  }).catch((err) => console.error('[ai-usage] log failed:', err.message))
}

// ── Sessions / reset tokens ───────────────────────────────────────────────────
// Users and sessions are persisted in Postgres (see db.js) so signed-in users
// stay signed in across server restarts. Reset tokens stay in-memory — they're
// short-lived, and losing one on restart just means requesting a new reset link.
const resetTokens = new Map() // token → { email, expiresAt }
const RESET_TOKEN_SWEEP_INTERVAL_MS = 60 * 60 * 1000

// A token is only otherwise removed when redeemed or superseded by a newer
// request for the same email — a link that's requested but never clicked
// would sit here forever without this sweep.
function sweepExpiredResetTokens() {
  const now = Date.now()
  for (const [tok, entry] of resetTokens) {
    if (entry.expiresAt < now) resetTokens.delete(tok)
  }
}

// ── Email (Resend) ─────────────────────────────────────────────────────────────
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
// Resend can only send from a domain you've verified in their dashboard. Until
// you verify your own (Dashboard > Domains), their shared sandbox address works
// with no setup — just less "branded." Override via RESEND_FROM once you have one.
const RESEND_FROM = process.env.RESEND_FROM || 'AmlIntel <onboarding@resend.dev>'

async function sendResetEmail(toEmail, name, resetUrl) {
  if (!resend) {
    console.log(`\n📧 Password reset link (configure RESEND_API_KEY in .env to send real emails):\n   ${resetUrl}\n`)
    return
  }
  await resend.emails.send({
    from: RESEND_FROM,
    to: toEmail,
    subject: 'Reset your AmlIntel password',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:36px;height:36px;background:#2563eb;border-radius:8px;line-height:36px;text-align:center;color:#fff;font-weight:700;font-size:13px">AML</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">Reset your password</h2>
        <p style="margin:0 0 24px;color:#475569;font-size:15px">Hi ${escapeHtml(name)}, we received a request to reset your AmlIntel password. Click the button below — the link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:13px 28px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Reset Password</a>
        <p style="margin:28px 0 0;color:#94a3b8;font-size:13px">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
        <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0"/>
        <p style="margin:0;color:#94a3b8;font-size:12px">AML Compliance Assistant</p>
      </div>
    `,
  })
}

async function sendEstimateEmail(toEmail, { industryLabel, people, annualTotal, monthlyEquivalent }) {
  const summary = `${industryLabel} · ${people} ${people === 1 ? 'person' : 'people'} · $${annualTotal.toFixed(2)}/year ($${monthlyEquivalent.toFixed(2)}/month)`
  if (!resend) {
    console.log(`\n📧 Cost estimate (configure RESEND_API_KEY in .env to send real emails):\n   To: ${toEmail}\n   ${summary}\n`)
    return
  }
  await resend.emails.send({
    from: RESEND_FROM,
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

async function sendSanctionsAlertEmail(toEmail, { name, matches }) {
  const summary = `${matches.length} new match${matches.length === 1 ? '' : 'es'} for "${name}"`
  if (!resend) {
    console.log(`\n📧 Sanctions watchlist alert (configure RESEND_API_KEY in .env to send real emails):\n   To: ${toEmail}\n   ${summary}\n`)
    return
  }
  const matchRows = matches.slice(0, 5).map((m) => `
        <div style="padding:10px 0;border-top:1px solid #e2e8f0">
          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600">${escapeHtml(m.primary_name)}</p>
          <p style="margin:2px 0 0;color:#64748b;font-size:12px">${escapeHtml(m.source === 'ofac' ? 'OFAC SDN List' : 'DFAT Consolidated List')}${m.program_or_reference ? ' · ' + escapeHtml(m.program_or_reference) : ''}</p>
        </div>`).join('')
  await resend.emails.send({
    from: RESEND_FROM,
    to: toEmail,
    subject: `New sanctions match for "${name}"`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:36px;height:36px;background:#2563eb;border-radius:8px;line-height:36px;text-align:center;color:#fff;font-weight:700;font-size:13px">AML</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">New sanctions match found</h2>
        <p style="margin:0 0 20px;color:#475569;font-size:15px">A name you're monitoring — <strong>${escapeHtml(name)}</strong> — now has a match it didn't have at last check:</p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;margin-bottom:24px">
          ${matchRows}
        </div>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:13px">This is a screening aid against a periodically-refreshed copy of public sanctions lists, not a live regulator query. Verify directly against the official DFAT and OFAC lists before acting on it.</p>
        <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0"/>
        <p style="margin:0;color:#94a3b8;font-size:12px">AmlIntel Sanctions Screening</p>
      </div>
    `,
  })
}

async function sendContactEmail({ name, email, subject, message }) {
  const inboxAddress = process.env.EMAIL_FROM
  if (!resend || !inboxAddress) {
    console.log(`\n📧 Contact message (configure RESEND_API_KEY and EMAIL_FROM in .env to send real emails):\n   From: ${name} <${email}>\n   Subject: ${subject}\n   Message: ${message}\n`)
    return
  }
  await resend.emails.send({
    from: RESEND_FROM,
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

// Professional subscribers get the same `premium` flag as everyone else —
// the app has no separate tier concept — so this is the one place that
// signals "this customer is also owed the human-delivered parts (Part A
// review, 1-on-1 advisor session)" since nothing else in the app tracks it.
async function sendProfessionalSubscriberEmail({ name, email }) {
  const inboxAddress = process.env.EMAIL_FROM
  if (!resend || !inboxAddress) {
    console.log(`\n📧 New Professional subscriber (configure RESEND_API_KEY and EMAIL_FROM in .env to send real emails):\n   ${name} <${email}>\n`)
    return
  }
  await resend.emails.send({
    from: RESEND_FROM,
    to: inboxAddress,
    replyTo: email,
    subject: `New Professional subscriber: ${name}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:36px;height:36px;background:#2563eb;border-radius:8px;line-height:36px;text-align:center;color:#fff;font-weight:700;font-size:13px">AML</span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">New Professional subscriber</h2>
        <p style="margin:0 0 20px;color:#475569;font-size:15px"><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) just subscribed to AmlIntel Professional.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;color:#0f172a;font-size:14px">
          Reach out to schedule their independent Part A review and 1-on-1 advisor session.
        </div>
      </div>
    `,
  })
}

const PREMIUM_EMAILS = new Set(['haidershahid3.16@live.com'])

function isPremiumUser(user) {
  return !!(user.premium || PREMIUM_EMAILS.has(user.email))
}

// Reuses the same owner-email set as the premium override — there's only
// one operator of this app, so "premium override" and "admin" are the same
// person in practice. Split into a distinct check anyway so the intent at
// each call site is clear rather than incidentally piggybacking on billing logic.
function isAdminUser(user) {
  return PREMIUM_EMAILS.has(user.email)
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
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !password || typeof password !== 'string') {
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
  res.json({ token, user: { id, name, email: lowerEmail, premium, plan: null } })
}))

app.post('/auth/login', authLimiter, asyncRoute(async (req, res) => {
  const { email, password } = req.body
  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
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
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, premium: user.premium || PREMIUM_EMAILS.has(user.email), plan: user.plan } })
}))

app.post('/auth/logout', asyncRoute(async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) await deleteSession(token)
  res.json({ success: true })
}))

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getUserFromAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  // Session tokens are always UUIDs (crypto.randomUUID()) — a non-UUID value
  // can never match a row, and querying the uuid-typed sessions.token column
  // with one throws a Postgres type-cast error rather than just finding no
  // rows. Treat it the same as "no session found" instead of a 500.
  if (!token || !UUID_RE.test(token)) return null
  const email = await getSessionEmail(token)
  if (!email) return null
  return getUserByEmail(email)
}

app.get('/auth/me', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  res.json({ user: { id: user.id, name: user.name, email: user.email, premium: user.premium || PREMIUM_EMAILS.has(user.email), plan: user.plan } })
}))

// ── Billing (Stripe) ────────────────────────────────────────────────────────
// Both plans grant the same `premium` boolean (Professional is a superset of
// Premium's software features — the consultancy/advisor parts are delivered
// by the business directly, not gated in-app) — only the Stripe price differs.
const PLAN_PRICE_ENV = { premium: 'STRIPE_PRICE_ID', professional: 'STRIPE_PRICE_ID_PROFESSIONAL' }

app.post('/billing/create-checkout-session', billingLimiter, asyncRoute(async (req, res) => {
  const plan = PLAN_PRICE_ENV[req.body?.plan] ? req.body.plan : 'premium'
  const priceId = process.env[PLAN_PRICE_ENV[plan]]
  if (!stripe || !priceId) return res.status(503).json({ error: 'Billing is not configured yet' })
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name, metadata: { userId: user.id } })
    customerId = customer.id
    await updateUserStripeInfo(user.email, { stripeCustomerId: customerId, stripeSubscriptionId: user.stripeSubscriptionId })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    allow_promotion_codes: true,
    success_url: `${FRONTEND_URL}/?checkout=success`,
    cancel_url: `${FRONTEND_URL}/?checkout=cancel`,
  })
  res.json({ url: session.url })
}))

app.post('/billing/create-portal-session', billingLimiter, asyncRoute(async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Billing is not configured yet' })
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!user.stripeCustomerId) return res.status(400).json({ error: 'No billing account found for this user yet' })

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${FRONTEND_URL}/`,
  })
  res.json({ url: session.url })
}))

app.post('/auth/update-profile', authLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  const { name } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' })
  const trimmedName = name.trim()
  await updateUserName(user.email, trimmedName)
  res.json({ user: { id: user.id, name: trimmedName, email: user.email, premium: user.premium || PREMIUM_EMAILS.has(user.email), plan: user.plan } })
}))

app.post('/auth/change-password', authLimiter, asyncRoute(async (req, res) => {
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

// This intentionally never collects the customer's actual name, date of
// birth, address, or ID document numbers — SmrDraft.jsx asks the user to
// keep those as placeholders. The generated narrative uses bracketed
// placeholders for that identifying detail, which the user fills in
// themselves after copying the draft, consistent with how Client Risk
// Register handles client data (metadata only, no real PII ever sent to
// the AI or stored).
const SMR_DRAFT_SYSTEM_PROMPT = `You are an AML/CTF compliance drafting assistant. Given details of a suspicious matter, draft a first-pass Suspicious Matter Report (SMR) narrative for an Australian reporting entity, grounded in Section 41 of the AML/CTF Act 2006 (Cth) and AUSTRAC's SMR guidance.

IMPORTANT — the details provided deliberately exclude the customer's real name, date of birth, address, and identity document numbers. Do not invent these. Everywhere identifying detail would normally go, use a clearly bracketed placeholder instead, e.g. [Customer's full legal name], [Date of birth], [Residential address], [ID document type and number] — so the user can fill in the real detail themselves after copying the draft.

OUTPUT FORMAT — MANDATORY:
Output plain text only. Do not use markdown syntax (no #, no **, no backticks). Use ALL-CAPS section headers, with blank lines between subsections.

Structure the narrative in exactly this order:

CONCERN
State the nature and basis of the suspicion in a few sentences — name the specific typology described (structuring, layering, rapid fund movement, smurfing, behavioural red flags, etc.) and reference Section 41 of the AML/CTF Act 2006.

CUSTOMER PROFILING
Using only the customer-type, risk-rating, and PEP/sanctions/prior-SMR fields provided (never inventing identifying detail), describe the customer's risk picture. Use bracketed placeholders for name, date of birth, address, occupation, and ID details.

SUSPICIOUS ACTIVITY
Describe the specific transactions/pattern and red flags provided, as concretely as the input allows — amounts, approximate dates, and the behaviour observed. Do not invent transaction details beyond what's given.

REPORTING DEADLINE
State the exact deadline that applies: within 24 hours of forming the suspicion if it relates to a suspected terrorism financing matter, otherwise within 3 business days — based on which the user indicated.

Close with a section titled DISCLAIMER containing 2-3 sentences stating plainly that this is an AI-generated first-pass draft based only on the information provided, is a starting point for the user's own SMR narrative, is not legal advice, and must be reviewed and completed (including all real identifying details) by a qualified AML/CTF professional before filing with AUSTRAC.`

const SMR_TYPOLOGY_LABELS = {
  structuring: 'Structuring / smurfing (transactions kept below reporting thresholds)',
  layering: 'Layering (moving funds through multiple accounts/entities to obscure origin)',
  rapidmovement: 'Rapid, unexplained movement of funds',
  sourceoffunds: 'Unexplained or inconsistent source of funds',
  behavioural: 'Behavioural red flags (evasive, nervous, inconsistent story)',
  other: 'Other',
}

function buildSmrProfileText(intake) {
  const {
    typology, concernDescription, terrorismFinancing,
    customerType, riskRating, pepOrSanctions, priorSmr,
    transactionDetails, redFlags, additionalContext,
  } = intake || {}
  return `Suspicious Matter Details
- Typology: ${SMR_TYPOLOGY_LABELS[typology] || typology || 'Not provided'}
- What triggered the suspicion: ${concernDescription || 'Not provided'}
- Suspected terrorism financing: ${terrorismFinancing ? 'Yes' : 'No'}

Customer Profile (metadata only — no real name/DOB/address/ID provided; use bracketed placeholders for these in the draft)
- Customer type: ${customerType || 'Not provided'}
- Risk rating: ${riskRating || 'Not provided'}
- PEP or sanctions relevant: ${pepOrSanctions || 'Not provided'}
- Prior SMR filed on this customer: ${priorSmr || 'Not provided'}

Suspicious Activity
- Transaction pattern/amounts: ${transactionDetails || 'Not provided'}
- Red flags observed: ${Array.isArray(redFlags) && redFlags.length ? redFlags.join(', ') : 'Not provided'}
- Additional context: ${additionalContext || 'None provided'}

Draft a first-pass SMR narrative following the mandatory CONCERN / CUSTOMER PROFILING / SUSPICIOUS ACTIVITY / REPORTING DEADLINE structure, grounding every section in these specific details and using bracketed placeholders for any identifying detail not provided above.`
}

function buildChatContextPreamble(intake) {
  const { businessName, industry, services, staffSize, clientTypes, deliveryChannels } = intake || {}
  const parts = []
  if (businessName) parts.push(`business name: ${businessName}`)
  if (industry) parts.push(`industry: ${industry}`)
  if (Array.isArray(services) && services.length) parts.push(`designated services: ${services.join(', ')}`)
  if (staffSize) parts.push(`staff size: ${staffSize}`)
  if (Array.isArray(clientTypes) && clientTypes.length) parts.push(`client types: ${clientTypes.join(', ')}`)
  if (Array.isArray(deliveryChannels) && deliveryChannels.length) parts.push(`delivery channels: ${deliveryChannels.join(', ')}`)
  if (!parts.length) return null
  return `The user has previously provided this business profile via AmlIntel's Program Builder — use it to make answers specific where relevant, but don't force it into every reply: ${parts.join('; ')}.`
}

const PRIVACY_PACK_SYSTEM_PROMPT = `You are a privacy compliance drafting assistant. Given a Business Profile for an Australian Tranche 2 AML/CTF reporting entity, draft the specific Privacy Act 1988 (Cth) documents requested, grounded in the following facts:

- Under section 6E(1A) of the Privacy Act, a small business operator that becomes an AML/CTF reporting entity is bound by the Australian Privacy Principles (APPs) for the personal information it handles in connection with its AML/CTF obligations, regardless of annual turnover. This removes the usual small-business exemption. Tranche 2 entities are captured from the date they start providing a designated service (from 1 July 2026 for the Tranche 2 reforms).
- APP 1 requires a clearly expressed, up-to-date, accessible privacy policy covering: what personal information is collected and why, how it's collected and held, the purposes of use and disclosure, and how an individual can access or correct their information or make a complaint.
- APP 5 requires a collection notice given at or before the point personal information is collected (or as soon as practicable after), covering the matters APP 5.2 requires. For an AML/CTF reporting entity, this notice must be worded carefully so it does not conflict with the tipping-off prohibition (Section 123, AML/CTF Act 2006) — it should describe routine CDD/AML data handling in general terms, never anything that could reveal a specific suspicion or SMR.
- The Notifiable Data Breaches (NDB) scheme (Part IIIC of the Privacy Act) applies to any entity bound by APP 11. An eligible data breach — unauthorised access, disclosure, or loss of personal information likely to result in serious harm that can't be prevented with remedial action — must be assessed and, if it qualifies, notified to the OAIC and affected individuals.
- APP 11 requires reasonable steps to destroy or de-identify personal information once it's no longer needed for the purpose it was collected for, except where a law (such as the AML/CTF Act's 7-year CDD/transaction record-keeping requirement) requires it to be kept.

OUTPUT FORMAT — MANDATORY:
Output plain text only. Do not use markdown syntax (no #, no **, no backticks). Use ALL-CAPS section headers, with blank lines between sections, so the document reads clearly as plain text. Draft ONLY the documents listed in the Business Profile's "Documents requested" field, each as its own clearly separated section headed with the document's full name.

For each requested document, ground it in the submitted Business Profile (business name, industry, designated services) rather than writing generic boilerplate:
- PRIVACY POLICY (APP 1): what personal information this specific type of business collects for AML/CTF purposes (identity documents, beneficial ownership details, transaction records), why, how it's held and secured, disclosure practices (including to AUSTRAC where legally required), and how someone can access/correct their information or complain.
- COLLECTION NOTICE (APP 5): a notice suitable for use at the point of collecting client ID/CDD information, worded generally about AML/CTF compliance obligations without ever referencing suspicion, investigations, or SMRs (tipping-off risk).
- DATA BREACH RESPONSE PLAN (NDB SCHEME): steps to assess a suspected breach, the seriousness/harm assessment, escalation and notification steps to the OAIC and affected individuals within the required timeframe, and roles/responsibilities.
- RETENTION & DESTRUCTION SCHEDULE (APP 11): what must be kept for the AML/CTF Act's 7-year requirement, what can be destroyed/de-identified sooner, and the practical process for doing so securely.

Close with a section titled DISCLAIMER containing 2-3 sentences stating plainly that this is an AI-generated first-pass draft based only on the information provided, is a starting point, is not legal advice, and must be reviewed and finalised by a qualified privacy or legal professional before being relied on or published.`

function buildPrivacyProfileText(intake) {
  const { businessName, industry, documents } = intake || {}
  const docLabels = {
    privacyPolicy: 'Privacy Policy (APP 1)',
    collectionNotice: 'Collection Notice (APP 5)',
    dataBreachPlan: 'Data Breach Response Plan (NDB Scheme)',
    retentionSchedule: 'Retention & Destruction Schedule (APP 11)',
  }
  const requested = Array.isArray(documents) && documents.length
    ? documents.map((d) => docLabels[d] || d).join(', ')
    : Object.values(docLabels).join(', ')
  return `Business Profile
- Business name: ${businessName || 'Not provided'}
- Industry: ${industry || 'Not provided'}
- Documents requested: ${requested}

Draft each requested document as its own section, following the mandatory structure and grounding every section in these specific details.`
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
app.post('/chat', chatLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

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

    let systemPrompt = AML_SYSTEM_PROMPT
    const draft = await getProgramDraft(user.id)
    const preamble = draft?.intake && buildChatContextPreamble(draft.intake)
    if (preamble) systemPrompt += `\n\n${preamble}`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: systemPrompt,
      messages,
    })
    recordAiUsage(user.id, 'chat', response)

    const reply = response.content[0]?.text || 'No response generated.'
    res.json({ reply })
  } catch (err) {
    console.error('Claude API error:', err.message)
    if (err.status === 401) {
      return res.status(500).json({ reply: 'Invalid API key. Please check your ANTHROPIC_API_KEY in backend/.env and restart the server.' })
    }
    res.status(500).json({ reply: 'The AI service encountered an error. Please try again in a moment.' })
  }
}))

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
    recordAiUsage(user.id, 'program-draft', response)

    const draftText = response.content[0]?.text || ''
    if (!draftText) return res.status(500).json({ error: 'No draft was generated. Please try again.' })

    const businessName = intake.businessName || null
    await saveProgramDraft({ id: crypto.randomUUID(), userId: user.id, businessName, intake, draftText })
    await createDocumentVersion({ id: crypto.randomUUID(), userId: user.id, docType: 'program', businessName, intake, draftText })
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

// ── Privacy Pack (Privacy Act documents) ──────────────────────────────────────
app.post('/privacy-draft', programDraftLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const intake = req.body?.intake
  if (!intake || typeof intake !== 'object') {
    return res.status(400).json({ error: 'Business intake details are required' })
  }

  if (!anthropic) {
    return res.status(503).json({ error: 'AI document drafting is not available right now. Please try again later.' })
  }

  try {
    const profileText = buildPrivacyProfileText(intake)
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 16000,
      system: PRIVACY_PACK_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: profileText }],
    })
    recordAiUsage(user.id, 'privacy-draft', response)

    const draftText = response.content[0]?.text || ''
    if (!draftText) return res.status(500).json({ error: 'No draft was generated. Please try again.' })

    const businessName = intake.businessName || null
    await savePrivacyDraft({ id: crypto.randomUUID(), userId: user.id, businessName, intake, draftText })
    await createDocumentVersion({ id: crypto.randomUUID(), userId: user.id, docType: 'privacy', businessName, intake, draftText })
    res.json({ draft: { businessName, intake, draftText } })
  } catch (err) {
    console.error('Claude API error (privacy draft):', err.message)
    if (err.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in backend/.env and restart the server.' })
    }
    res.status(500).json({ error: 'The AI service encountered an error while drafting your documents. Please try again in a moment.' })
  }
}))

app.get('/privacy-draft', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const draft = await getPrivacyDraft(user.id)
  res.json({ draft })
}))

// ── SMR draft ──────────────────────────────────────────────────────────────────
// Unlike Program/Privacy (one row per user, upserted — "your current draft"),
// each SMR is a separate incident, so every submission is a new row in
// document_versions rather than replacing a prior one. Listing past drafts
// reuses the existing GET /document-versions?type=smr endpoint.
app.post('/smr-draft', programDraftLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const intake = req.body?.intake
  if (!intake || typeof intake !== 'object') {
    return res.status(400).json({ error: 'Details about the matter are required' })
  }

  if (!anthropic) {
    return res.status(503).json({ error: 'AI drafting is not available right now. Please try again later.' })
  }

  try {
    const profileText = buildSmrProfileText(intake)
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: SMR_DRAFT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: profileText }],
    })
    recordAiUsage(user.id, 'smr-draft', response)

    const draftText = response.content[0]?.text || ''
    if (!draftText) return res.status(500).json({ error: 'No draft was generated. Please try again.' })

    const label = `${SMR_TYPOLOGY_LABELS[intake.typology] || 'Suspicious matter'} — ${intake.riskRating || 'risk not set'}`
    const id = crypto.randomUUID()
    await createDocumentVersion({ id, userId: user.id, docType: 'smr', businessName: label, intake, draftText })
    res.json({ draft: { id, businessName: label, intake, draftText, createdAt: new Date().toISOString() } })
  } catch (err) {
    console.error('Claude API error (SMR draft):', err.message)
    if (err.status === 401) {
      return res.status(500).json({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in backend/.env and restart the server.' })
    }
    res.status(500).json({ error: 'The AI service encountered an error while drafting your SMR. Please try again in a moment.' })
  }
}))

// ── CAMS mock exam attempts ────────────────────────────────────────────────────
app.post('/mock-exam-attempt', mockExamLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const { score, total, chapterBreakdown } = req.body || {}
  if (!Number.isInteger(score) || !Number.isInteger(total) || total <= 0 || score < 0 || score > total) {
    return res.status(400).json({ error: 'Invalid attempt data' })
  }

  const passed = score / total >= 0.625
  await saveMockExamAttempt({ id: crypto.randomUUID(), userId: user.id, score, total, passed, chapterBreakdown: chapterBreakdown || null })
  res.json({ attempt: { score, total, passed } })
}))

app.get('/mock-exam-attempts', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const attempts = await getMockExamAttempts(user.id)
  res.json({ attempts })
}))

// ── Compliance calendar ────────────────────────────────────────────────────────
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

app.get('/compliance-checklist', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const checklist = await getComplianceChecklist(user.id)
  res.json({ checklist })
}))

app.post('/compliance-checklist', complianceLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const body = req.body || {}
  // Only fields actually present in the request are touched — `key in body`
  // (not just `body[key] != null`) so that explicitly sending `null` clears
  // a field instead of being indistinguishable from "not sent" and silently
  // ignored (a field omitted entirely from the body must leave the existing
  // value alone).
  const fields = {}
  for (const name of ['programReviewDate', 'independentEvalDate', 'staffTrainingDate', 'privacyReviewDate']) {
    if (!(name in body)) continue
    if (body[name] != null && !ISO_DATE_RE.test(body[name])) {
      return res.status(400).json({ error: `Invalid date for ${name}` })
    }
    fields[name] = body[name] ?? null
  }
  if ('acrLodgedYear' in body) {
    if (body.acrLodgedYear != null && !Number.isInteger(body.acrLodgedYear)) {
      return res.status(400).json({ error: 'Invalid acrLodgedYear' })
    }
    fields.acrLodgedYear = body.acrLodgedYear ?? null
  }

  await saveComplianceChecklist({ id: crypto.randomUUID(), userId: user.id, ...fields })
  const checklist = await getComplianceChecklist(user.id)
  res.json({ checklist })
}))

// ── Client risk register ───────────────────────────────────────────────────────
const RISK_RATINGS = new Set(['low', 'medium', 'high'])
const CDD_TYPES = new Set(['standard', 'edd'])
const ENTRY_STATUSES = new Set(['active', 'offboarded'])
const CASE_STATUSES = new Set(['none', 'open', 'closed'])

function validateClientRiskFields(body, { requireCore }) {
  const { referenceLabel, riskRating, cddType, onboardedDate, lastReviewDate, nextReviewDate, status, caseStatus, notes } = body || {}
  if (requireCore) {
    if (!referenceLabel || typeof referenceLabel !== 'string' || !referenceLabel.trim() || referenceLabel.trim().length > 200) return 'referenceLabel is required (max 200 characters)'
    if (!riskRating || !RISK_RATINGS.has(riskRating)) return 'Invalid riskRating'
    if (!cddType || !CDD_TYPES.has(cddType)) return 'Invalid cddType'
  } else {
    if (riskRating != null && !RISK_RATINGS.has(riskRating)) return 'Invalid riskRating'
    if (cddType != null && !CDD_TYPES.has(cddType)) return 'Invalid cddType'
    if (referenceLabel != null && (typeof referenceLabel !== 'string' || !referenceLabel.trim() || referenceLabel.trim().length > 200)) return 'Invalid referenceLabel (max 200 characters)'
  }
  if (notes != null && (typeof notes !== 'string' || notes.length > 2000)) return 'Invalid notes (max 2000 characters)'
  if (status != null && !ENTRY_STATUSES.has(status)) return 'Invalid status'
  if (caseStatus != null && !CASE_STATUSES.has(caseStatus)) return 'Invalid caseStatus'
  for (const [name, value] of Object.entries({ onboardedDate, lastReviewDate, nextReviewDate })) {
    if (value != null && !ISO_DATE_RE.test(value)) return `Invalid date for ${name}`
  }
  return null
}

app.get('/client-risk-entries', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const entries = await getClientRiskEntries(user.id)
  res.json({ entries })
}))

app.post('/client-risk-entries', clientRegisterLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const err = validateClientRiskFields(req.body, { requireCore: true })
  if (err) return res.status(400).json({ error: err })

  const { referenceLabel, riskRating, cddType, onboardedDate, nextReviewDate, notes } = req.body
  const entry = await createClientRiskEntry({
    id: crypto.randomUUID(), userId: user.id, referenceLabel: referenceLabel.trim(), riskRating, cddType,
    onboardedDate: onboardedDate ?? null, nextReviewDate: nextReviewDate ?? null, notes: notes ?? null,
  })
  res.json({ entry })
}))

app.put('/client-risk-entries/:id', clientRegisterLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const err = validateClientRiskFields(req.body, { requireCore: false })
  if (err) return res.status(400).json({ error: err })

  const body = req.body || {}
  // Only fields actually present in the request are touched — see the same
  // note in the /compliance-checklist handler above.
  const fields = {}
  for (const name of ['referenceLabel', 'riskRating', 'cddType', 'onboardedDate', 'lastReviewDate', 'nextReviewDate', 'status', 'notes', 'caseStatus']) {
    if (!(name in body)) continue
    fields[name] = name === 'referenceLabel' ? (body[name]?.trim() ?? null) : (body[name] ?? null)
  }
  const entry = await updateClientRiskEntry({ id: req.params.id, userId: user.id, ...fields })
  if (!entry) return res.status(404).json({ error: 'Entry not found' })
  res.json({ entry })
}))

app.delete('/client-risk-entries/:id', clientRegisterLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const deleted = await deleteClientRiskEntry(req.params.id, user.id)
  if (!deleted) return res.status(404).json({ error: 'Entry not found' })
  res.json({ ok: true })
}))

// ── Client risk register: case notes (append-only investigation log) ───────
app.get('/client-risk-entries/:id/case-notes', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const notes = await getCaseNotes(req.params.id, user.id)
  res.json({ notes })
}))

app.post('/client-risk-entries/:id/case-notes', clientRegisterLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const { note } = req.body
  if (!note || typeof note !== 'string' || !note.trim() || note.trim().length > 2000) {
    return res.status(400).json({ error: 'Invalid note' })
  }

  const created = await addCaseNote({ id: crypto.randomUUID(), entryId: req.params.id, userId: user.id, note: note.trim() })
  if (!created) return res.status(404).json({ error: 'Entry not found' })
  res.json({ note: created })
}))

app.delete('/client-risk-entries/:id/case-notes/:noteId', clientRegisterLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const deleted = await deleteCaseNote(req.params.noteId, user.id)
  if (!deleted) return res.status(404).json({ error: 'Note not found' })
  res.json({ ok: true })
}))

// ── Chat session sync ───────────────────────────────────────────────────────
app.get('/chat-sessions', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const sessions = await getChatSessions(user.id)
  res.json({ sessions })
}))

app.post('/chat-sessions', chatSessionLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const { id, title, messages } = req.body || {}
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title is required' })
  if (messages != null && !Array.isArray(messages)) return res.status(400).json({ error: 'messages must be an array' })

  const session = await createChatSession({ id: id && UUID_RE.test(id) ? id : crypto.randomUUID(), userId: user.id, title, messages })
  res.json({ session })
}))

app.put('/chat-sessions/:id', chatSessionLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const { title, messages } = req.body || {}
  if (title != null && typeof title !== 'string') return res.status(400).json({ error: 'Invalid title' })
  if (messages != null && !Array.isArray(messages)) return res.status(400).json({ error: 'messages must be an array' })

  const session = await updateChatSession({ id: req.params.id, userId: user.id, title: title ?? null, messages: messages ?? null })
  if (!session) return res.status(404).json({ error: 'Session not found' })
  res.json({ session })
}))

app.delete('/chat-sessions/:id', chatSessionLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const deleted = await deleteChatSession(req.params.id, user.id)
  if (!deleted) return res.status(404).json({ error: 'Session not found' })
  res.json({ ok: true })
}))

// ── Document version history ───────────────────────────────────────────────────
app.get('/document-versions', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const docType = req.query.type
  if (!['program', 'privacy', 'smr'].includes(docType)) return res.status(400).json({ error: 'Invalid type — expected "program", "privacy", or "smr"' })

  const versions = await getDocumentVersions(user.id, docType)
  res.json({ versions })
}))

// ── Sanctions screening ───────────────────────────────────────────────────────
// Matches against periodically-refreshed local copies of the DFAT and OFAC
// public sanctions lists (see sanctions.js) rather than a live regulator
// query — getSanctionsListsStatus() lets the frontend show data currency.
app.post('/sanctions-screen', sanctionsScreenLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const name = req.body?.name
  if (!name || typeof name !== 'string' || !name.trim() || name.trim().length > 200) {
    return res.status(400).json({ error: 'A name to screen is required (max 200 characters)' })
  }

  const [matches, listsStatus] = await Promise.all([
    screenName({ name: name.trim() }),
    getSanctionsListsStatus(),
  ])
  res.json({ query: name.trim(), matches, listsStatus })
}))

// ── Sanctions watchlist (ongoing re-screening) ────────────────────────────────
// Explicit opt-in extension of the one-off screen above — unlike
// client_risk_entries, this deliberately does store a real name, because
// the user already had to enter one to run a one-off check and is now
// choosing to keep checking it. Re-screened on the same cycle as the
// sanctions list refresh (see app.listen below); new hits are emailed.
const MAX_WATCHLIST_PER_USER = 50

app.post('/sanctions-watchlist', sanctionsScreenLimiter, asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })

  const name = req.body?.name
  if (!name || typeof name !== 'string' || !name.trim() || name.trim().length > 200) {
    return res.status(400).json({ error: 'A name to monitor is required (max 200 characters)' })
  }
  const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim().slice(0, 500) : null

  const count = await getWatchlistCount(user.id)
  if (count >= MAX_WATCHLIST_PER_USER) {
    return res.status(400).json({ error: `You can monitor up to ${MAX_WATCHLIST_PER_USER} names at a time.` })
  }

  const id = crypto.randomUUID()
  const added = await addToWatchlist({ id, userId: user.id, name: name.trim(), notes })
  if (!added) return res.status(400).json({ error: `You can monitor up to ${MAX_WATCHLIST_PER_USER} names at a time.` })
  res.json({ id })
}))

app.get('/sanctions-watchlist', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const watchlist = await getWatchlist(user.id)
  res.json({ watchlist })
}))

app.delete('/sanctions-watchlist/:id', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isPremiumUser(user)) return res.status(403).json({ error: 'This feature requires a Premium subscription.' })
  const removed = await removeFromWatchlist({ id: req.params.id, userId: user.id })
  if (!removed) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
}))

// ── AI usage / cost tracking (owner-only) ────────────────────────────────────
// Real Claude API spend per subscriber, derived from logged token counts
// rather than estimated — see recordAiUsage() and db.js's getAiUsageSummary.
app.get('/admin/ai-usage-summary', asyncRoute(async (req, res) => {
  const user = await getUserFromAuth(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  if (!isAdminUser(user)) return res.status(403).json({ error: 'Not authorized' })

  const days = Number(req.query.days) || 30
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const summary = await getAiUsageSummary({ since })
  res.json({ sinceDays: days, ...summary })
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

  // Flat regardless of team size, matching CostCalculator.jsx on the
  // frontend — one Premium subscription covers the firm, so peopleCount
  // (kept for the email's "X people" context line) never multiplies price.
  const annualTotal = COST_PREMIUM_MONTHLY * 12
  const monthlyEquivalent = COST_PREMIUM_MONTHLY

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

const SANCTIONS_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000

// Watchlist re-screening must run AFTER the sanctions lists finish
// refreshing, not in parallel — it needs that day's fresh data, not
// whatever was there before. New hits get emailed individually.
async function runSanctionsRefreshCycle() {
  await refreshAllSanctionsLists()
  try {
    const newHits = await refreshWatchlistChecks()
    for (const hit of newHits) {
      try {
        await sendSanctionsAlertEmail(hit.email, { name: hit.name, matches: hit.matches })
      } catch (err) {
        console.error('[sanctions] failed to send watchlist alert email:', err.message)
      }
    }
    if (newHits.length > 0) console.log(`[sanctions] sent ${newHits.length} watchlist alert email(s)`)
  } catch (err) {
    console.error('[sanctions] watchlist refresh failed:', err.message)
  }
}

app.listen(PORT, () => {
  console.log(`AmlIntel API running on http://localhost:${PORT}`)
  if (anthropic) {
    console.log('✅ AI assistant: ENABLED (Claude API connected)')
  } else {
    console.log('⚠️  AI assistant: DISABLED — add ANTHROPIC_API_KEY to .env and restart')
  }

  // Fire-and-forget — the server starts serving immediately rather than
  // blocking on a ~20s network fetch; sanctions-screen results are simply
  // sparse/empty until the first refresh completes.
  runSanctionsRefreshCycle().catch((err) => console.error('[sanctions] initial refresh cycle failed:', err.message))
  setInterval(() => {
    runSanctionsRefreshCycle().catch((err) => console.error('[sanctions] scheduled refresh cycle failed:', err.message))
  }, SANCTIONS_REFRESH_INTERVAL_MS)

  setInterval(sweepExpiredResetTokens, RESET_TOKEN_SWEEP_INTERVAL_MS)
})
