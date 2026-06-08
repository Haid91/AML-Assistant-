/**
 * SMR narrative builder.
 *
 * Assembles a draft Suspicious Matter Report narrative around the structure
 * AUSTRAC expects from a good report: a clear grounds-for-suspicion statement,
 * the subject (Who), a factual chronology (What / When / Where / How), the
 * indicators observed, and the analytical link to recognised typologies (Why).
 *
 * The drafter remains responsible for accuracy and submission. This produces a
 * structured starting point, not a final report.
 */

import { fmtAud, sortByDate, parseDate, detectIndicators } from './indicators.js';
import { rankTypologies } from './typologies.js';

function dateRange(txns) {
  const sorted = sortByDate(txns);
  const first = sorted[0]?.date;
  const last = sorted[sorted.length - 1]?.date;
  if (!first) return 'the review period';
  if (first === last) return `on ${first}`;
  return `between ${first} and ${last}`;
}

function summariseFlows(txns) {
  const credits = txns.filter((t) => t.direction === 'credit');
  const debits = txns.filter((t) => t.direction === 'debit');
  const creditTotal = credits.reduce((s, t) => s + t.amount, 0);
  const debitTotal = debits.reduce((s, t) => s + t.amount, 0);
  return { credits, debits, creditTotal, debitTotal };
}

function buildChronology(txns) {
  const sorted = sortByDate(txns);
  return sorted.map((t) => {
    const dir = t.direction === 'credit' ? 'credit' : 'debit';
    const via = t.method ? ` via ${t.method.replace(/_/g, ' ')}` : '';
    const cp = t.counterparty ? ` ${dir === 'credit' ? 'from' : 'to'} ${t.counterparty}` : '';
    const country =
      t.counterpartyCountry && t.counterpartyCountry.toUpperCase() !== 'AU'
        ? ` (${t.counterpartyCountry.toUpperCase()})`
        : '';
    return `${t.date}: ${dir} of ${fmtAud(t.amount)}${via}${cp}${country}.`;
  });
}

/**
 * AUSTRAC-style quality checklist. Each item reflects guidance on what makes an
 * SMR useful to financial intelligence: clear grounds, complete identifiers,
 * specific figures, and an articulated rationale.
 */
function qualityChecks({ profile, indicators, transactions }) {
  const hasSubject = Boolean(profile && (profile.name || profile.accountId));
  const hasFigures = transactions.length > 0;
  const hasGrounds = indicators.length > 0;
  const hasDates = transactions.every((t) => parseDate(t.date));

  return [
    {
      item: 'Grounds for suspicion are clearly articulated',
      pass: hasGrounds,
      note: hasGrounds
        ? `${indicators.length} indicator(s) support the suspicion.`
        : 'No indicators detected — confirm there is a genuine basis for an SMR.',
    },
    {
      item: 'Subject is identified (name and/or account)',
      pass: hasSubject,
      note: hasSubject ? 'Subject identifiers present.' : 'Add customer/account identifiers.',
    },
    {
      item: 'Specific amounts and dates are included',
      pass: hasFigures && hasDates,
      note:
        hasFigures && hasDates
          ? 'Transaction figures and dates are populated.'
          : 'Ensure every transaction has a valid amount and date.',
    },
    {
      item: 'Narrative explains why activity is suspicious (not just what happened)',
      pass: hasGrounds,
      note: hasGrounds
        ? 'Typology assessment links the facts to a recognised pattern.'
        : 'Add analysis linking the activity to a typology or risk.',
    },
  ];
}

/**
 * Produce a full draft. `selectedTypologyIds` lets a drafter override the
 * automatic ranking; if omitted, the top-ranked typologies are used.
 */
export function buildDraft({ transactions = [], profile = null, selectedTypologyIds = null } = {}) {
  const txns = transactions;
  // Detect the red-flag indicators that drive the typology assessment.
  const detected = detectIndicators(txns, profile);

  const firedCodes = detected.map((i) => i.code);
  const allRanked = rankTypologies(firedCodes);
  const chosen =
    selectedTypologyIds && selectedTypologyIds.length
      ? allRanked.filter((t) => selectedTypologyIds.includes(t.id))
      : allRanked.slice(0, 2);

  const { creditTotal, debitTotal, credits, debits } = summariseFlows(txns);
  const subject =
    (profile && (profile.name || profile.accountId)) || 'the customer (identifiers to be confirmed)';

  /* ---- Section 1: Grounds for suspicion (executive summary) ---- */
  const primary = chosen[0];
  const groundsForSuspicion = primary
    ? `${primary.framing} The reporting entity is therefore unable to be ` +
      `satisfied as to the legitimate purpose or source of the activity.`
    : 'The activity reviewed presents features that warrant reporting; ' +
      'grounds for suspicion to be articulated by the analyst.';

  /* ---- Section 2: Subject (Who) ---- */
  const subjectDetails = [];
  if (profile?.name) subjectDetails.push(`Name: ${profile.name}`);
  if (profile?.accountId) subjectDetails.push(`Account: ${profile.accountId}`);
  if (profile?.occupation) subjectDetails.push(`Stated occupation: ${profile.occupation}`);
  if (profile?.statedAnnualIncome)
    subjectDetails.push(`Stated annual income: ${fmtAud(profile.statedAnnualIncome)}`);
  if (profile?.riskRating) subjectDetails.push(`Customer risk rating: ${profile.riskRating}`);
  if (subjectDetails.length === 0) subjectDetails.push('Subject identifiers to be confirmed by the analyst.');

  /* ---- Section 3: Suspicious activity (What/When/Where/How) ---- */
  const activitySummary =
    `Over the period ${dateRange(txns)}, ${subject} conducted ${txns.length} ` +
    `transaction(s) comprising ${credits.length} credit(s) totalling ${fmtAud(creditTotal)} ` +
    `and ${debits.length} debit(s) totalling ${fmtAud(debitTotal)}.`;
  const chronology = buildChronology(txns);

  /* ---- Section 4: Indicators identified ---- */
  const indicatorLines = detected.map((i) => `[${i.severity.toUpperCase()}] ${i.name} — ${i.detail}`);

  /* ---- Section 5: Typology assessment (Why) ---- */
  const typologyLines = chosen.map(
    (t) =>
      `${t.name}: ${t.framing} (Reference: ${t.austracReference}; ` +
      `indicators matched: ${t.matchedIndicators.join(', ')}.)`
  );

  /* ---- Assemble the rendered narrative ---- */
  const sections = [
    { heading: '1. Grounds for suspicion', body: groundsForSuspicion },
    { heading: '2. Subject of the report', body: subjectDetails.join('\n') },
    {
      heading: '3. Description of the suspicious activity',
      body: [activitySummary, '', 'Transaction chronology:', ...chronology].join('\n'),
    },
    {
      heading: '4. Indicators identified',
      body: indicatorLines.length ? indicatorLines.map((l) => `• ${l}`).join('\n') : 'None detected.',
    },
    {
      heading: '5. Typology assessment',
      body: typologyLines.length ? typologyLines.map((l) => `• ${l}`).join('\n') : 'No typology matched.',
    },
    {
      heading: '6. Action and recommendation',
      body:
        'Recommend submission of a Suspicious Matter Report to AUSTRAC and ' +
        'consideration of enhanced customer due diligence. This draft requires ' +
        'analyst review and verification of all identifiers and figures before lodgement.',
    },
  ];

  const renderedNarrative = sections.map((s) => `${s.heading}\n${s.body}`).join('\n\n');

  return {
    generatedAt: new Date().toISOString(),
    subject,
    indicators: detected,
    suggestedTypologies: allRanked,
    selectedTypologies: chosen,
    sections,
    narrative: renderedNarrative,
    qualityChecks: qualityChecks({ profile, indicators: detected, transactions: txns }),
    disclaimer:
      'PROTOTYPE / DRAFTING AID ONLY. Output is a structured starting point and ' +
      'must be reviewed and verified by a qualified analyst before any reporting ' +
      'decision or lodgement with AUSTRAC.',
  };
}
