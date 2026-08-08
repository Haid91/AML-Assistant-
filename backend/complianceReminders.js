import { pool } from './db.js'

// Same local-midnight parsing as ComplianceCalendar.jsx — `new Date('YYYY-MM-DD')`
// parses as UTC midnight, which is off by a day for any server/user west of UTC.
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addYears(dateStr, years) {
  const d = parseLocalDate(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return d
}

function addMonths(dateStr, months) {
  const d = parseLocalDate(dateStr)
  d.setMonth(d.getMonth() + months)
  return d
}

function daysUntil(date) {
  const now = new Date()
  return Math.floor((date - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)
}

function toIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Mirrors ComplianceCalendar.jsx's currentAcrDueInfo() exactly — first
// Tranche 2 Annual Compliance Report is never due before 30 September 2027,
// then the same 1 July–30 September lodgement window recurs each year.
function currentAcrDueInfo() {
  const today = new Date()
  let fyEndYear = 2027
  let due = new Date(fyEndYear, 8, 30)
  while (today > due) {
    fyEndYear += 1
    due = new Date(fyEndYear, 8, 30)
  }
  return { dueDate: due, fyEndYear, fyLabel: `FY${fyEndYear - 1}–${fyEndYear}` }
}

// Mirrors ComplianceCalendar.jsx's ITEMS array. Each item's `dateKey` is the
// checklist column holding "last done", and `remindedKey` is the column
// tracking which computed due date was last reminded about.
const ITEMS = [
  {
    key: 'programReviewDate',
    dateKey: 'programReviewDate',
    remindedKey: 'programReviewRemindedDue',
    title: 'AML/CTF Program & Risk Assessment Review',
    cycleFn: (d) => addYears(d, 3),
    dueSoonDays: 90,
  },
  {
    key: 'independentEvalDate',
    dateKey: 'independentEvalDate',
    remindedKey: 'independentEvalRemindedDue',
    title: 'Independent Evaluation of Your Program',
    cycleFn: (d) => addYears(d, 3),
    dueSoonDays: 90,
  },
  {
    key: 'staffTrainingDate',
    dateKey: 'staffTrainingDate',
    remindedKey: 'staffTrainingRemindedDue',
    title: 'Staff AML/CTF Training Refresher',
    cycleFn: (d) => addMonths(d, 12),
    dueSoonDays: 30,
  },
  {
    key: 'privacyReviewDate',
    dateKey: 'privacyReviewDate',
    remindedKey: 'privacyReviewRemindedDue',
    title: 'Privacy Policy Review',
    cycleFn: (d) => addMonths(d, 12),
    dueSoonDays: 30,
  },
]

const REMINDED_COLUMNS = {
  programReviewRemindedDue: 'program_review_reminded_due',
  independentEvalRemindedDue: 'independent_eval_reminded_due',
  staffTrainingRemindedDue: 'staff_training_reminded_due',
  privacyReviewRemindedDue: 'privacy_review_reminded_due',
  acrRemindedYear: 'acr_reminded_year',
}

// Premium users only — reminders are a Premium feature, same as the
// Compliance Calendar itself. A user with no compliance_checklist row yet
// (never used the calendar) has nothing to remind about, so the join is
// inner rather than left. `premiumEmailOverrides` mirrors server.js's
// PREMIUM_EMAILS set (passed in by the caller, since that set lives in
// server.js) so an account granted premium via the email override — not the
// users.premium column — is still eligible, matching isPremiumUser()
// everywhere else in the app.
export async function getChecklistsForReminders(premiumEmailOverrides = []) {
  const { rows } = await pool.query(
    `SELECT u.id AS "userId", u.email, u.name,
            c.program_review_date AS "programReviewDate",
            c.independent_eval_date AS "independentEvalDate",
            c.staff_training_date AS "staffTrainingDate",
            c.privacy_review_date AS "privacyReviewDate",
            c.acr_lodged_year AS "acrLodgedYear",
            c.program_review_reminded_due AS "programReviewRemindedDue",
            c.independent_eval_reminded_due AS "independentEvalRemindedDue",
            c.staff_training_reminded_due AS "staffTrainingRemindedDue",
            c.privacy_review_reminded_due AS "privacyReviewRemindedDue",
            c.acr_reminded_year AS "acrRemindedYear"
     FROM compliance_checklist c
     JOIN users u ON u.id = c.user_id
     WHERE u.premium = true OR u.email = ANY($1::text[])`,
    [premiumEmailOverrides]
  )
  return rows
}

// For one checklist row, works out which items are currently due/overdue AND
// haven't already been reminded about for this specific occurrence (compares
// the *computed* due date against the last-reminded-due date, not a boolean),
// and returns both the items to include in the email and the DB columns to
// update afterward so the same occurrence never re-fires.
function dueItemsFor(checklist) {
  const due = []
  const updates = {}

  for (const item of ITEMS) {
    const lastDone = checklist[item.dateKey]
    if (!lastDone) continue
    const dueDate = item.cycleFn(lastDone)
    const days = daysUntil(dueDate)
    if (days > item.dueSoonDays) continue
    const dueIso = toIso(dueDate)
    if (checklist[item.remindedKey] === dueIso) continue
    due.push({ title: item.title, dueDate, overdue: days < 0 })
    updates[item.remindedKey] = dueIso
  }

  const acr = currentAcrDueInfo()
  const acrLodged = checklist.acrLodgedYear === acr.fyEndYear
  if (!acrLodged) {
    const acrDays = daysUntil(acr.dueDate)
    if (acrDays <= 30 && checklist.acrRemindedYear !== acr.fyEndYear) {
      due.push({ title: `Annual Compliance Report (${acr.fyLabel})`, dueDate: acr.dueDate, overdue: acrDays < 0 })
      updates.acrRemindedYear = acr.fyEndYear
    }
  }

  return { due, updates }
}

export async function markReminded(userId, updates) {
  const presentKeys = Object.keys(updates).filter((k) => k in REMINDED_COLUMNS)
  if (presentKeys.length === 0) return
  const params = [userId]
  const setClauses = []
  for (const key of presentKeys) {
    params.push(updates[key])
    setClauses.push(`${REMINDED_COLUMNS[key]} = $${params.length}`)
  }
  await pool.query(
    `UPDATE compliance_checklist SET ${setClauses.join(', ')} WHERE user_id = $1`,
    params
  )
}

// One consolidated reminder per user per cycle (not one email per item) —
// returns the list of {userId, email, name, items, updates} to send. Does
// NOT mark anything as reminded itself — the caller must call
// markReminded(userId, updates) only after the email actually sends
// successfully, so a failed send is retried on the next cycle instead of
// being silently marked done and lost until the item's next occurrence.
export async function runComplianceReminderCycle(premiumEmailOverrides = []) {
  const checklists = await getChecklistsForReminders(premiumEmailOverrides)
  const toNotify = []
  for (const checklist of checklists) {
    const { due, updates } = dueItemsFor(checklist)
    if (due.length === 0) continue
    toNotify.push({ userId: checklist.userId, email: checklist.email, name: checklist.name, items: due, updates })
  }
  return toNotify
}
