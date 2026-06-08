/**
 * Indicator detection engine.
 *
 * Takes raw transactions (and an optional customer profile) and surfaces the
 * red-flag indicators that drive AUSTRAC typology assessment. Each detector is
 * deterministic and returns the supporting evidence, so the resulting SMR
 * narrative can cite specific transactions rather than assert conclusions.
 *
 * Transaction shape:
 *   { date, amount, direction: 'credit'|'debit', method, counterparty,
 *     counterpartyCountry, channel, description }
 *
 * Profile shape (all optional):
 *   { name, accountId, occupation, statedAnnualIncome, expectedMonthlyTurnover,
 *     riskRating }
 */

const TTR_THRESHOLD = 10000; // AUD Threshold Transaction Report trigger.
const NEAR_THRESHOLD_FLOOR = 7000; // Cash amounts in [floor, threshold) look deliberate.
const DAY_MS = 24 * 60 * 60 * 1000;

// Indicative higher-risk jurisdictions for the prototype. In production this
// would be driven by the entity's own risk methodology / FATF lists.
const HIGH_RISK_JURISDICTIONS = new Set(['IR', 'KP', 'MM', 'SY', 'AF', 'YE']);

function parseDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isRound(amount, unit = 1000) {
  return amount >= unit && amount % unit === 0;
}

function fmtAud(amount) {
  return `AUD ${Number(amount).toLocaleString('en-AU')}`;
}

function sortByDate(transactions) {
  return [...transactions].sort((a, b) => {
    const da = parseDate(a.date)?.getTime() ?? 0;
    const db = parseDate(b.date)?.getTime() ?? 0;
    return da - db;
  });
}

/* --------------------------------- detectors -------------------------------- */

function detectCashNearThreshold(txns) {
  const hits = txns.filter(
    (t) =>
      t.direction === 'credit' &&
      t.method === 'cash' &&
      t.amount >= NEAR_THRESHOLD_FLOOR &&
      t.amount < TTR_THRESHOLD
  );
  if (hits.length < 2) return null;
  return {
    code: 'CASH_NEAR_THRESHOLD',
    name: 'Cash deposits just below the TTR threshold',
    severity: 'high',
    detail:
      `${hits.length} cash deposits between ${fmtAud(NEAR_THRESHOLD_FLOOR)} and ` +
      `${fmtAud(TTR_THRESHOLD)} were identified, each falling below the ` +
      `AUD 10,000 threshold transaction reporting trigger.`,
    evidence: hits,
  };
}

function detectStructuredAggregate(txns) {
  // Cash credits within a 7-day rolling window that aggregate over the threshold.
  const cash = sortByDate(
    txns.filter((t) => t.direction === 'credit' && t.method === 'cash')
  );
  for (let i = 0; i < cash.length; i++) {
    const windowStart = parseDate(cash[i].date)?.getTime();
    if (windowStart == null) continue;
    const window = cash.filter((t) => {
      const ts = parseDate(t.date)?.getTime();
      return ts != null && ts >= windowStart && ts < windowStart + 7 * DAY_MS;
    });
    const total = window.reduce((s, t) => s + t.amount, 0);
    if (window.length >= 2 && total >= TTR_THRESHOLD) {
      return {
        code: 'STRUCTURED_AGGREGATE',
        name: 'Cash deposits aggregating over threshold within a short window',
        severity: 'high',
        detail:
          `${window.length} cash deposits totalling ${fmtAud(total)} were made ` +
          `within a 7-day period, exceeding the AUD 10,000 threshold in aggregate ` +
          `while no single deposit triggered a report.`,
        evidence: window,
      };
    }
  }
  return null;
}

function detectMultiBranchCash(txns) {
  const cash = txns.filter((t) => t.direction === 'credit' && t.method === 'cash');
  const channels = new Set(cash.map((t) => t.channel).filter(Boolean));
  if (cash.length >= 3 && channels.size >= 2) {
    return {
      code: 'MULTI_BRANCH_CASH',
      name: 'Cash deposits spread across multiple channels/locations',
      severity: 'medium',
      detail:
        `Cash deposits were made through ${channels.size} different channels ` +
        `(${[...channels].join(', ')}), consistent with spreading activity to ` +
        `reduce visibility at any single point.`,
      evidence: cash,
    };
  }
  return null;
}

function detectRapidInOut(txns) {
  const sorted = sortByDate(txns);
  const pairs = [];
  for (let i = 0; i < sorted.length; i++) {
    const credit = sorted[i];
    if (credit.direction !== 'credit') continue;
    const creditTs = parseDate(credit.date)?.getTime();
    if (creditTs == null) continue;
    // Look for an outbound transfer of similar magnitude within 72 hours.
    const match = sorted.find((t, j) => {
      if (j <= i || t.direction !== 'debit') return false;
      const ts = parseDate(t.date)?.getTime();
      if (ts == null || ts > creditTs + 3 * DAY_MS) return false;
      const ratio = t.amount / credit.amount;
      return ratio >= 0.8 && ratio <= 1.05;
    });
    if (match) pairs.push({ credit, debit: match });
  }
  if (pairs.length < 1) return null;
  const evidence = pairs.flatMap((p) => [p.credit, p.debit]);
  return {
    code: 'RAPID_IN_OUT',
    name: 'Rapid in-and-out movement of funds',
    severity: 'high',
    detail:
      `${pairs.length} instance(s) were identified where a credit was followed ` +
      `by an outbound transfer of a similar amount within 72 hours, consistent ` +
      `with a pass-through (flow-through) pattern.`,
    evidence,
  };
}

function detectPassThroughBalance(txns) {
  const credits = txns.filter((t) => t.direction === 'credit').reduce((s, t) => s + t.amount, 0);
  const debits = txns.filter((t) => t.direction === 'debit').reduce((s, t) => s + t.amount, 0);
  if (credits === 0) return null;
  const retained = credits - debits;
  const retainedRatio = retained / credits;
  if (credits >= TTR_THRESHOLD && retainedRatio <= 0.05) {
    return {
      code: 'PASS_THROUGH_BALANCE',
      name: 'Funds passed through with negligible retained balance',
      severity: 'medium',
      detail:
        `Total credits of ${fmtAud(credits)} were almost entirely offset by ` +
        `debits of ${fmtAud(debits)}, leaving only ${fmtAud(Math.max(retained, 0))} ` +
        `(${(retainedRatio * 100).toFixed(1)}%) retained — consistent with the ` +
        `account being used to move rather than hold funds.`,
      evidence: [],
    };
  }
  return null;
}

function detectRoundAmounts(txns) {
  const round = txns.filter((t) => isRound(t.amount, 1000));
  if (round.length < 3 || round.length / txns.length < 0.5) return null;
  return {
    code: 'ROUND_AMOUNTS',
    name: 'Predominance of round-figure transactions',
    severity: 'low',
    detail:
      `${round.length} of ${txns.length} transactions were exact round figures ` +
      `(multiples of AUD 1,000), which is uncommon for genuine commercial activity.`,
    evidence: round,
  };
}

function detectThirdPartyCash(txns, profile) {
  const accountName = (profile?.name || '').trim().toLowerCase();
  const thirdParty = txns.filter(
    (t) =>
      t.direction === 'credit' &&
      t.method === 'cash' &&
      t.counterparty &&
      t.counterparty.trim().toLowerCase() !== accountName
  );
  // Only meaningful when there are several distinct third-party depositors.
  const depositors = new Set(thirdParty.map((t) => t.counterparty.trim().toLowerCase()));
  if (thirdParty.length >= 2 && depositors.size >= 2) {
    return {
      code: 'THIRD_PARTY_CASH',
      name: 'Cash deposited by unrelated third parties',
      severity: 'high',
      detail:
        `${thirdParty.length} cash deposits were made by ${depositors.size} ` +
        `apparently unrelated third parties, with no evident relationship to the ` +
        `account holder.`,
      evidence: thirdParty,
    };
  }
  return null;
}

function detectHighRiskJurisdiction(txns) {
  const hits = txns.filter(
    (t) => t.counterpartyCountry && HIGH_RISK_JURISDICTIONS.has(t.counterpartyCountry.toUpperCase())
  );
  if (hits.length === 0) return null;
  const countries = [...new Set(hits.map((t) => t.counterpartyCountry.toUpperCase()))];
  return {
    code: 'HIGH_RISK_JURISDICTION',
    name: 'Transactions involving higher-risk jurisdictions',
    severity: 'high',
    detail:
      `${hits.length} transaction(s) involved higher-risk jurisdiction(s): ` +
      `${countries.join(', ')}.`,
    evidence: hits,
  };
}

function detectManyIntlBeneficiaries(txns) {
  const intl = txns.filter(
    (t) =>
      t.direction === 'debit' &&
      (t.method === 'international_transfer' ||
        (t.counterpartyCountry && t.counterpartyCountry.toUpperCase() !== 'AU'))
  );
  const beneficiaries = new Set(intl.map((t) => (t.counterparty || '').trim().toLowerCase()).filter(Boolean));
  if (intl.length >= 3 && beneficiaries.size >= 3) {
    return {
      code: 'MANY_INTL_BENEFICIARIES',
      name: 'Outbound international transfers to multiple beneficiaries',
      severity: 'medium',
      detail:
        `${intl.length} outbound international transfers were sent to ` +
        `${beneficiaries.size} different beneficiaries, with no apparent ` +
        `commercial relationship to the customer.`,
      evidence: intl,
    };
  }
  return null;
}

function detectManySources(txns) {
  const credits = txns.filter((t) => t.direction === 'credit');
  const sources = new Set(credits.map((t) => (t.counterparty || '').trim().toLowerCase()).filter(Boolean));
  if (credits.length >= 4 && sources.size >= 4) {
    return {
      code: 'MANY_SOURCES',
      name: 'Funds received from many unrelated sources',
      severity: 'medium',
      detail:
        `Credits were received from ${sources.size} distinct sources, consistent ` +
        `with aggregation of funds from disparate, unrelated parties.`,
      evidence: credits,
    };
  }
  return null;
}

function detectInconsistentProfile(txns, profile) {
  if (!profile) return null;
  const credits = txns.filter((t) => t.direction === 'credit').reduce((s, t) => s + t.amount, 0);

  // Compare turnover against stated income (annualised proxy).
  if (profile.statedAnnualIncome > 0 && credits > profile.statedAnnualIncome) {
    return {
      code: 'INCONSISTENT_PROFILE',
      name: 'Activity inconsistent with stated income/profile',
      severity: 'high',
      detail:
        `Total credits of ${fmtAud(credits)} over the review period exceed the ` +
        `customer's stated annual income of ${fmtAud(profile.statedAnnualIncome)} ` +
        `(occupation: ${profile.occupation || 'not stated'}).`,
      evidence: [],
    };
  }

  if (profile.expectedMonthlyTurnover > 0 && credits > profile.expectedMonthlyTurnover * 3) {
    return {
      code: 'INCONSISTENT_PROFILE',
      name: 'Activity inconsistent with expected account turnover',
      severity: 'medium',
      detail:
        `Credits of ${fmtAud(credits)} materially exceed the expected monthly ` +
        `turnover of ${fmtAud(profile.expectedMonthlyTurnover)} recorded for the account.`,
      evidence: [],
    };
  }
  return null;
}

function detectVelocitySpike(txns) {
  if (txns.length < 6) return null;
  const sorted = sortByDate(txns);
  const first = parseDate(sorted[0].date)?.getTime();
  const last = parseDate(sorted[sorted.length - 1].date)?.getTime();
  if (first == null || last == null) return null;
  const days = Math.max((last - first) / DAY_MS, 1);
  const perDay = txns.length / days;
  if (perDay >= 1.5) {
    return {
      code: 'VELOCITY_SPIKE',
      name: 'High transaction velocity',
      severity: 'low',
      detail:
        `${txns.length} transactions occurred over ${Math.round(days)} day(s) ` +
        `(~${perDay.toFixed(1)} per day), indicating an unusually high velocity.`,
      evidence: [],
    };
  }
  return null;
}

/**
 * Run all detectors and return the indicators that fired.
 */
export function detectIndicators(transactions, profile) {
  const txns = Array.isArray(transactions) ? transactions : [];
  const detectors = [
    detectCashNearThreshold,
    detectStructuredAggregate,
    detectMultiBranchCash,
    detectRapidInOut,
    detectPassThroughBalance,
    detectRoundAmounts,
    detectThirdPartyCash,
    detectHighRiskJurisdiction,
    detectManyIntlBeneficiaries,
    detectManySources,
    detectInconsistentProfile,
    detectVelocitySpike,
  ];

  const results = [];
  for (const detector of detectors) {
    // Detectors that need the profile accept it as a second argument; the rest
    // simply ignore it.
    const hit = detector(txns, profile);
    if (hit) results.push(hit);
  }
  return results;
}

export { fmtAud, sortByDate, parseDate, TTR_THRESHOLD };
