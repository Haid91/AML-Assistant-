/**
 * AUSTRAC-aligned money-laundering typology library.
 *
 * This is the part that makes the tool more than a "generic LLM wrapper": each
 * typology encodes (a) the indicators that tend to evidence it, and (b) the
 * narrative framing a good Suspicious Matter Report uses to articulate the
 * grounds for suspicion. References point to publicly available AUSTRAC
 * guidance/financial-crime guides so a drafter can cite the rationale.
 *
 * NOTE: References are descriptive pointers to AUSTRAC public guidance, not a
 * substitute for an AML/CTF program's own typology register.
 */

export const TYPOLOGIES = {
  STRUCTURING: {
    id: 'STRUCTURING',
    name: 'Structuring (cash transactions below the reporting threshold)',
    summary:
      'Deliberately conducting transactions below the AUD 10,000 Threshold ' +
      'Transaction Report (TTR) trigger to avoid mandatory reporting.',
    austracReference:
      'AUSTRAC — Cash transactions and structuring; AML/CTF Act s142 (offence of structuring).',
    indicators: ['CASH_NEAR_THRESHOLD', 'STRUCTURED_AGGREGATE', 'MULTI_BRANCH_CASH'],
    framing:
      'The pattern is consistent with structuring: cash was deposited in ' +
      'multiple amounts each falling just below the AUD 10,000 TTR threshold, ' +
      'in a manner that appears designed to avoid triggering a threshold report.',
  },

  RAPID_MOVEMENT: {
    id: 'RAPID_MOVEMENT',
    name: 'Rapid movement of funds / pass-through (flow-through) account',
    summary:
      'Funds are credited then moved out almost immediately, with the account ' +
      'serving as a conduit rather than for genuine economic activity.',
    austracReference:
      'AUSTRAC — Indicators of money laundering; pass-through / flow-through account behaviour.',
    indicators: ['RAPID_IN_OUT', 'PASS_THROUGH_BALANCE', 'ROUND_AMOUNTS'],
    framing:
      'Funds were credited and then transferred out within a short period and ' +
      'in similar amounts, leaving little or no residual balance. This ' +
      'flow-through behaviour is consistent with the layering stage of money ' +
      'laundering, where the account is used to move rather than hold value.',
  },

  CUCKOO_SMURFING: {
    id: 'CUCKOO_SMURFING',
    name: 'Cuckoo smurfing (third-party cash deposits)',
    summary:
      'Unrelated third parties make cash deposits into an account, often to ' +
      'settle an offshore value transfer, disguising the true source of funds.',
    austracReference:
      'AUSTRAC — Cuckoo smurfing financial crime guide.',
    indicators: ['THIRD_PARTY_CASH', 'CASH_NEAR_THRESHOLD', 'INCONSISTENT_PROFILE'],
    framing:
      'Multiple cash deposits were made by, or on behalf of, parties with no ' +
      'apparent relationship to the account holder. This third-party cash ' +
      'pattern is consistent with cuckoo smurfing, where deposits are used to ' +
      'settle a separate (often offshore) value transfer.',
  },

  INTERNATIONAL_FUNNELING: {
    id: 'INTERNATIONAL_FUNNELING',
    name: 'International funnelling to higher-risk jurisdictions',
    summary:
      'Funds are aggregated domestically and remitted offshore, frequently to ' +
      'or through higher-risk jurisdictions or numerous unrelated beneficiaries.',
    austracReference:
      'AUSTRAC — International funds transfer instructions (IFTI) risk; high-risk jurisdiction guidance.',
    indicators: ['HIGH_RISK_JURISDICTION', 'MANY_INTL_BENEFICIARIES', 'ROUND_AMOUNTS'],
    framing:
      'Domestic credits were consolidated and remitted internationally, ' +
      'including to higher-risk jurisdictions and/or numerous beneficiaries ' +
      'with no apparent commercial link to the customer. This is consistent ' +
      'with the placement and layering of illicit value offshore.',
  },

  UNEXPLAINED_WEALTH: {
    id: 'UNEXPLAINED_WEALTH',
    name: 'Activity inconsistent with customer profile',
    summary:
      'Turnover or transaction values are materially inconsistent with the ' +
      "customer's stated occupation, income or expected account activity.",
    austracReference:
      'AUSTRAC — Know your customer; activity inconsistent with customer profile indicators.',
    indicators: ['INCONSISTENT_PROFILE', 'VELOCITY_SPIKE'],
    framing:
      "The volume and value of activity is materially inconsistent with the " +
      "customer's stated profile (occupation, income and expected activity), " +
      'and no legitimate economic explanation has been identified.',
  },

  MONEY_MULE: {
    id: 'MONEY_MULE',
    name: 'Money mule / third-party account use',
    summary:
      'An account receives funds from disparate sources and forwards them on, ' +
      'consistent with use as a mule account by a third party.',
    austracReference:
      'AUSTRAC — Money mules financial crime guide.',
    indicators: ['RAPID_IN_OUT', 'MANY_SOURCES', 'INCONSISTENT_PROFILE'],
    framing:
      'The account received funds from multiple unrelated sources and quickly ' +
      'forwarded them on, with little benefit retained by the account holder. ' +
      'This is consistent with the account being used as a money mule.',
  },
};

/**
 * Given a set of detected indicator codes, rank the typologies by how strongly
 * the evidence supports them. A typology scores for each of its indicators that
 * fired, normalised by how many indicators it expects, so a 2-of-2 match
 * outranks a 2-of-3 match.
 */
export function rankTypologies(firedIndicatorCodes) {
  const fired = new Set(firedIndicatorCodes);
  const ranked = [];

  for (const typology of Object.values(TYPOLOGIES)) {
    const matched = typology.indicators.filter((code) => fired.has(code));
    if (matched.length === 0) continue;

    const coverage = matched.length / typology.indicators.length;
    // Weight: how many of this typology's indicators fired, plus a coverage bonus.
    const score = matched.length + coverage;

    ranked.push({
      id: typology.id,
      name: typology.name,
      summary: typology.summary,
      austracReference: typology.austracReference,
      framing: typology.framing,
      matchedIndicators: matched,
      score: Number(score.toFixed(2)),
      coverage: Number(coverage.toFixed(2)),
    });
  }

  return ranked.sort((a, b) => b.score - a.score);
}
