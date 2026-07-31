export const OWNERSHIP_SCENARIOS = [
  // ── Ltd / LLC / Holdcos ──────────────────────────────────────────────
  {
    id: 'ltd-b1',
    category: 'ltd',
    difficulty: 'Beginner',
    title: 'Simple Holdco Structure',
    shortDesc: 'A single individual owns an operating company through a two-tier holding structure. Identify the UBO and assess the CDD level required.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'person', label: 'Maria Alonso', sub: 'Individual', row: 0, col: 0 },
        { id: 'n2', type: 'company', label: 'Alonso Holdings Pty Ltd', sub: 'Holding company', row: 1, col: 0 },
        { id: 'n3', type: 'company', label: 'Bright Retail Pty Ltd', sub: 'Operating company', row: 2, col: 0 },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '100%' },
        { from: 'n2', to: 'n3', label: '100%' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Identify the UBO',
        question: 'Who is the ultimate beneficial owner of Bright Retail Pty Ltd?',
        options: [
          { text: 'Maria Alonso — she indirectly holds 100% through the holdco chain, meeting the UBO threshold at every tier', correct: true, feedback: 'Correct. Ownership is traced through each layer of the chain. Since Maria owns 100% of Alonso Holdings, which owns 100% of Bright Retail, her effective indirect ownership is 100% × 100% = 100%.' },
          { text: 'Alonso Holdings Pty Ltd, since it is the direct legal shareholder of Bright Retail', correct: false, feedback: 'Incorrect. A UBO must be a natural person, not a legal entity. Alonso Holdings is the direct shareholder of record, but the beneficial ownership analysis must look through it to the natural person who ultimately controls it — Maria Alonso.' },
          { text: 'No UBO can be determined without a company search in every jurisdiction involved', correct: false, feedback: "Incorrect. In this simple two-tier chain with a single individual at the top, the UBO is readily determinable from the ownership chain shown — a full jurisdictional search isn't a prerequisite to identifying the natural person at the top." },
          { text: 'Both Maria Alonso and Alonso Holdings Pty Ltd should be listed jointly as UBOs', correct: false, feedback: 'Incorrect. UBO status applies to natural persons only. Alonso Holdings should be recorded as part of the ownership structure, but only Maria Alonso qualifies as the beneficial owner.' },
        ],
      },
      {
        id: 2, title: 'Calculating Effective Ownership',
        question: 'What ownership percentage does Maria control in Bright Retail Pty Ltd?',
        options: [
          { text: '100% — multiplying 100% × 100% through the ownership chain', correct: true, feedback: 'Correct. Effective indirect ownership is calculated by multiplying the ownership percentage at each tier of the chain: 100% (Maria → Holdco) × 100% (Holdco → Opco) = 100%.' },
          { text: '50% — since there are two tiers in the ownership chain', correct: false, feedback: 'Incorrect. The number of tiers does not determine the percentage — the percentages at each tier must be multiplied together, not averaged or divided by the number of tiers.' },
          { text: 'It cannot be calculated without knowing the value of each company', correct: false, feedback: "Incorrect. Beneficial ownership percentage is a function of the shareholding percentages through the chain, not company valuation — valuation isn't required for this calculation." },
          { text: '0%, since Maria does not directly hold shares in Bright Retail Pty Ltd', correct: false, feedback: "Incorrect. Direct shareholding isn't required — indirect ownership through a holding company chain still counts fully toward beneficial ownership, which is exactly why UBO analysis looks through corporate layers." },
        ],
      },
      {
        id: 3, title: 'CDD Level',
        question: 'Does this structure raise any red flags requiring Enhanced Due Diligence?',
        options: [
          { text: 'No — a single natural person, a transparent two-tier chain, and no nominees or opaque intermediaries mean standard CDD is proportionate', correct: true, feedback: "Correct. The structure is fully transparent: one identifiable individual at the top, no offshore layers, no nominees, and a straightforward chain. Absent other risk factors (e.g. high-risk jurisdiction, PEP status, cash-intensive sector), standard CDD is proportionate." },
          { text: 'Yes — any structure with more than one corporate tier automatically requires EDD', correct: false, feedback: "Incorrect. The number of tiers alone doesn't trigger EDD — it's the presence of opacity, offshore elements, nominees, or other risk indicators that does. A simple, fully transparent two-tier chain doesn't meet that bar." },
          { text: 'Yes — holding companies are always high risk regardless of transparency', correct: false, feedback: 'Incorrect. Holding company structures are a normal, legitimate business practice. Risk comes from opacity and specific red flags, not from the mere presence of a holding company.' },
          { text: "Simplified due diligence is appropriate, since Maria is the sole owner", correct: false, feedback: 'Incorrect. Sole ownership alone does not automatically qualify for simplified due diligence — that requires a demonstrable, documented low-risk determination, not just structural simplicity.' },
        ],
      },
    ],
  },
  {
    id: 'ltd-b2',
    category: 'ltd',
    difficulty: 'Beginner',
    title: 'Two Shareholders, One Holdco',
    shortDesc: 'A company is jointly owned by two individuals with different stakes and different roles. Work through the 25% ownership threshold and the separate control test.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'person', label: 'David Kim', sub: '80% shareholder', row: 0, col: 0 },
        { id: 'n2', type: 'person', label: 'Priya Nair', sub: '20% shareholder, sole director', row: 0, col: 2 },
        { id: 'n3', type: 'company', label: 'Kim Nair Consulting Ltd', sub: 'Operating company', row: 1, col: 1 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: '80%' },
        { from: 'n2', to: 'n3', label: '20%' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Ownership Threshold',
        question: 'Which individual(s) meet the standard beneficial ownership threshold (typically ≥25%) requiring identification as a UBO of Kim Nair Consulting Ltd?',
        options: [
          { text: "David Kim only — his 80% shareholding clearly exceeds the 25% threshold; Priya Nair's 20% stake falls below it based on ownership alone", correct: true, feedback: "Correct. The standard beneficial-ownership test used across most frameworks (FATF, MLR 2017, FinCEN CDD Rule) sets a 25% ownership threshold. David's 80% clearly qualifies him. Priya's 20% falls below that threshold on ownership grounds alone — though her role must still be separately assessed (see next question)." },
          { text: 'Both David and Priya, since both are shareholders of record', correct: false, feedback: "Incorrect. Being a shareholder alone doesn't automatically confer UBO status — the standard test is whether ownership meets or exceeds the threshold (commonly 25%). Priya's 20% stake doesn't meet that ownership-based test on its own." },
          { text: 'Neither, since neither individual owns 100% of the company', correct: false, feedback: "Incorrect. The UBO threshold is not 100% ownership — it's typically set at 25% or more. David's 80% shareholding is well above that threshold." },
          { text: 'Only Priya, since minority shareholders are inherently higher risk and require closer scrutiny', correct: false, feedback: "Incorrect — this has the logic backwards. A larger ownership stake (like David's 80%) more clearly establishes UBO status under the ownership test, not a smaller one." },
        ],
      },
      {
        id: 2, title: 'The Control Test',
        question: "Priya Nair is also the company's sole director with full control over its bank accounts and decision-making, despite her 20% shareholding. How should the firm treat her?",
        options: [
          { text: "She should still be identified and verified as a person with significant control — beneficial ownership isn't determined by shareholding percentage alone; control through directorship or management authority also triggers UBO identification requirements", correct: true, feedback: "Correct. Beneficial ownership frameworks include a separate control test alongside the ownership test — a person who exercises significant control (e.g. sole director with authority over the company's decisions and finances) qualifies for identification even if their shareholding falls below the ownership threshold." },
          { text: 'No further action is needed since she is below the 25% ownership threshold', correct: false, feedback: "Incorrect. The ownership threshold and the control test are two independent tests — falling below the ownership threshold does not exempt someone who separately exercises significant control over the company." },
          { text: 'She should be removed as director since her ownership percentage is too low to justify that level of control', correct: false, feedback: "Incorrect. This isn't a CDD requirement, and the firm has no basis to direct a customer's internal governance — the correct response is to identify and verify her as a controller, not to demand governance changes." },
          { text: 'This is only relevant if she also holds a power of attorney over David\'s shares', correct: false, feedback: "Incorrect. Her own directorship and control over company decision-making and accounts is sufficient on its own to trigger identification — a power of attorney over David's shares isn't required for the control test to apply." },
        ],
      },
      {
        id: 3, title: 'Overall CDD Approach',
        question: 'What CDD approach is appropriate for this two-shareholder structure overall?',
        options: [
          { text: 'Standard CDD is generally proportionate — a straightforward domestic company with clearly identifiable, verifiable individual shareholders and no layering or offshore elements; EDD would only be warranted if additional risk factors were present', correct: true, feedback: "Correct. The structure itself is transparent and low-complexity — two named individuals, no corporate intermediaries, no offshore jurisdictions. Standard CDD (verifying both David as UBO and Priya as a controller) is proportionate absent other risk indicators like PEP status or a high-risk sector." },
          { text: 'EDD is always required whenever a company has more than one shareholder', correct: false, feedback: "Incorrect. Having multiple shareholders is entirely normal and is not, on its own, an EDD trigger — EDD is driven by specific risk factors, not shareholder count." },
          { text: 'Simplified due diligence, since the ownership structure is straightforward', correct: false, feedback: "Incorrect. Simplified CDD requires a documented, evidence-based low-risk determination — structural simplicity alone is not sufficient justification to apply a reduced due diligence standard." },
          { text: "No CDD is required since both individuals are already company directors on public record", correct: false, feedback: "Incorrect. Public record filings (e.g. a companies register) are a useful verification source but do not substitute for the firm's own independent CDD process." },
        ],
      },
    ],
  },

  // ── Trusts ───────────────────────────────────────────────────────────
  {
    id: 'trusts-b1',
    category: 'trusts',
    difficulty: 'Beginner',
    title: 'Discretionary Family Trust',
    shortDesc: 'A straightforward family trust with a named settlor, trustee, and beneficiaries. Work through who must be identified and whether any red flags apply.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'person', label: 'John Carter', sub: 'Settlor', row: 0, col: 0 },
        { id: 'n2', type: 'person', label: 'Sarah Carter', sub: 'Trustee', row: 0, col: 2 },
        { id: 'n3', type: 'trust', label: 'Carter Family Trust', sub: 'Discretionary trust', row: 1, col: 1 },
        { id: 'n4', type: 'person', label: 'John Carter Jr.', sub: 'Beneficiary', row: 2, col: 0 },
        { id: 'n5', type: 'person', label: 'Emma Carter', sub: 'Beneficiary', row: 2, col: 2 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: 'Settlor' },
        { from: 'n2', to: 'n3', label: 'Trustee' },
        { from: 'n3', to: 'n4', label: 'Beneficiary' },
        { from: 'n3', to: 'n5', label: 'Beneficiary' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Legal Control',
        question: 'Who exercises legal control over the trust assets day-to-day?',
        options: [
          { text: 'Sarah Carter, the trustee — she holds legal title and makes distribution decisions, even though she is not an economic beneficiary', correct: true, feedback: "Correct. The trustee holds legal title to trust assets and exercises day-to-day control and decision-making authority, including distribution decisions — a distinct role from the settlor (who established the trust) and the beneficiaries (who may receive distributions)." },
          { text: 'John Carter, the settlor, since he originally provided the trust assets', correct: false, feedback: "Incorrect. Once assets are settled into a trust, the settlor typically relinquishes legal control over them — day-to-day control passes to the trustee, not the settlor." },
          { text: 'John Carter Jr. and Emma Carter jointly, as the named beneficiaries', correct: false, feedback: 'Incorrect. Beneficiaries have a right to potentially receive distributions but do not exercise control over trust assets or decision-making — that authority sits with the trustee.' },
          { text: 'No one — discretionary trusts have no legal controller by design', correct: false, feedback: 'Incorrect. Every trust has a trustee who holds legal control, even a discretionary trust — the "discretionary" element refers to the trustee\'s discretion over distributions to beneficiaries, not an absence of control.' },
        ],
      },
      {
        id: 2, title: 'Who Must Be Identified',
        question: 'Under a risk-based approach, who must be identified as UBO(s) of this trust?',
        options: [
          { text: 'The settlor, the trustee(s), and named beneficiaries with fixed/vested entitlement or significant discretionary distributions — here: John Carter, Sarah Carter, John Carter Jr., and Emma Carter', correct: true, feedback: "Correct. Trust beneficial ownership frameworks typically require identifying all four roles: settlor(s), trustee(s), protector(s) if any, and beneficiaries who are named individuals (as opposed to an undefined class) — all four named individuals here must be identified and verified." },
          { text: 'Only the trustee, since she is the one with legal control', correct: false, feedback: "Incorrect. Trust UBO identification is broader than just the trustee — the settlor and named beneficiaries must also be identified, since each has a distinct beneficial interest or influence over the trust." },
          { text: 'Only the settlor and the beneficiaries, since the trustee is a fiduciary and therefore exempt', correct: false, feedback: "Incorrect. A trustee's fiduciary duty does not exempt them from AML identification requirements — trustees must be identified precisely because they hold legal control over the assets." },
          { text: 'No one specifically — trusts are identified as a single legal entity, similar to a company', correct: false, feedback: "Incorrect. Unlike a company (which itself can be a legal person), a trust is not a legal entity — it has no UBO of its own, which is exactly why AML frameworks require identifying the natural persons in each of its constituent roles." },
        ],
      },
      {
        id: 3, title: 'Red Flag Assessment',
        question: 'What red flag, if any, applies to this structure?',
        options: [
          { text: 'None on its face — settlor, trustee, and beneficiaries are all fully named and identifiable, with no opacity; discretionary trusts warrant EDD when beneficiaries are undisclosed classes or the structure involves high-risk jurisdictions, neither of which applies here', correct: true, feedback: 'Correct. This is a transparent, domestic family trust with every role held by a named, identifiable individual. Discretionary trusts are not inherently high risk — the risk comes from undisclosed beneficiary classes, offshore elements, or corporate trustees in opaque jurisdictions, none of which are present.' },
          { text: 'All discretionary trusts are automatically high risk and require EDD regardless of transparency', correct: false, feedback: "Incorrect. The discretionary structure itself is a normal estate-planning tool — risk comes from opacity (undisclosed beneficiaries, offshore trustees, unclear jurisdiction), not from the discretionary mechanism alone." },
          { text: "The trust having two beneficiaries instead of one is itself a red flag", correct: false, feedback: 'Incorrect. Having multiple named beneficiaries is entirely normal for a family trust and is not a risk indicator on its own.' },
          { text: 'Sarah Carter acting as trustee while also potentially being a beneficiary is inherently suspicious', correct: false, feedback: "Incorrect. In this scenario Sarah is identified only as trustee, not as a beneficiary — and even where a trustee is also a beneficiary in other structures, that alone is a common, legitimate arrangement rather than an automatic red flag." },
        ],
      },
    ],
  },
  {
    id: 'trusts-b2',
    category: 'trusts',
    difficulty: 'Beginner',
    title: 'Offshore Trust with Corporate Trustee',
    shortDesc: 'A trust uses an offshore corporate trustee and an undisclosed beneficiary class. Identify the red flags and determine what must be resolved before proceeding.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'person', label: 'Elena Petrova', sub: 'Settlor', row: 0, col: 0 },
        { id: 'n2', type: 'company', label: 'BVI Corporate Trustee Services Ltd', sub: 'Corporate trustee (BVI)', row: 0, col: 2 },
        { id: 'n3', type: 'trust', label: 'Silverline Trust', sub: 'Discretionary trust', row: 1, col: 1 },
        { id: 'n4', type: 'person', label: 'Unnamed beneficiary class', sub: 'Details not disclosed', row: 2, col: 1 },
      ],
      edges: [
        { from: 'n1', to: 'n3', label: 'Settlor' },
        { from: 'n2', to: 'n3', label: 'Corporate Trustee' },
        { from: 'n3', to: 'n4', label: 'Undisclosed' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Identifying the Red Flag',
        question: 'What is the PRIMARY red flag in this structure?',
        options: [
          { text: 'The combination of a BVI-based corporate trustee and an undisclosed/unnamed beneficiary class — offshore corporate trustees can obscure who ultimately controls trust decisions, and undisclosed beneficiary classes prevent proper UBO identification', correct: true, feedback: 'Correct. Individually, an offshore corporate trustee or a discretionary beneficiary class are not automatically disqualifying — but together, with no further disclosure, they create a structure where nobody controlling or benefiting from the trust can actually be identified, which is exactly the opacity AML frameworks target.' },
          { text: 'The use of a trust structure itself, which is inherently high-risk', correct: false, feedback: "Incorrect. Trusts are a legitimate and common wealth-planning tool — they are not inherently high risk. The risk here comes from the specific opacity factors present, not from the use of a trust as such." },
          { text: 'Elena Petrova being the settlor of the trust', correct: false, feedback: "Incorrect. Being a settlor is a normal, expected role in any trust structure and is not itself a red flag — the concern lies elsewhere in this structure." },
          { text: 'The trust having only one beneficiary class', correct: false, feedback: "Incorrect. Having a defined beneficiary class is standard for discretionary trusts — the issue here specifically is that the class is unnamed and undisclosed, not that a class exists at all." },
        ],
      },
      {
        id: 2, title: 'What Must Be Obtained',
        question: 'What must the firm obtain before this relationship can proceed?',
        options: [
          { text: "Identification of BVI Corporate Trustee Services Ltd's own beneficial owners/controllers (looking through the corporate trustee to the natural persons who direct it), and either named beneficiaries or a clearly defined, verifiable class with the criteria for potential distribution", correct: true, feedback: "Correct. A corporate trustee must itself be looked through to the natural persons who control it — the same UBO principle applied to any corporate entity. Similarly, an entirely undisclosed beneficiary class must be resolved into either named individuals or, at minimum, an objectively verifiable class definition." },
          { text: 'Nothing further — corporate trustees are professional, regulated entities in their home jurisdiction, so no look-through is needed', correct: false, feedback: "Incorrect. Being a regulated professional trustee in its home jurisdiction doesn't exempt a corporate trustee from being looked through to its own controllers for AML purposes — that look-through obligation is exactly what corporate UBO identification requires." },
          { text: "A signed declaration from the corporate trustee confirming the beneficiaries are legitimate", correct: false, feedback: 'Incorrect. A self-declaration provides no independent verification — it does not identify the actual controllers of the corporate trustee or resolve the undisclosed beneficiary class.' },
          { text: 'Nothing — discretionary trusts are permitted to have undisclosed beneficiaries by design', correct: false, feedback: "Incorrect. Discretionary trusts are permitted to have a defined class of potential beneficiaries who may not each receive a distribution — but that class must still be identifiable and verifiable for AML purposes, not left entirely undisclosed." },
        ],
      },
      {
        id: 3, title: 'CDD Level Required',
        question: 'Given the offshore corporate trustee and unresolved beneficiary disclosure, what CDD level applies?',
        options: [
          { text: "Enhanced Due Diligence — the combination of an offshore corporate trustee and an unverified/undisclosed beneficiary class are classic high-risk indicators for trust structures, requiring full EDD including source of wealth for the settlor and identification of the trustee's own controllers", correct: true, feedback: 'Correct. This combination of risk factors — offshore corporate trustee plus undisclosed beneficiaries — is precisely the pattern LSAG and FATF guidance flag as high risk for trust structures, warranting full EDD before the relationship can proceed.' },
          { text: 'Standard CDD, since the settlor herself has been identified', correct: false, feedback: "Incorrect. Identifying only the settlor leaves the corporate trustee's controllers and the beneficiary class entirely unresolved — standard CDD does not address the specific opacity risks present here." },
          { text: 'Simplified CDD, since professional corporate trustees are lower risk by default', correct: false, feedback: 'Incorrect. Professional/corporate trustee status does not automatically reduce risk — when combined with an offshore jurisdiction and undisclosed beneficiaries, it is a risk-elevating factor, not a risk-reducing one.' },
          { text: 'No CDD is needed until the trust actually makes a distribution to a beneficiary', correct: false, feedback: 'Incorrect. CDD obligations apply at the point of establishing the relationship, not deferred until a future distribution event — the structure must be assessed and resolved now.' },
        ],
      },
    ],
  },

  // ── Funds & Listed ───────────────────────────────────────────────────
  {
    id: 'funds-b1',
    category: 'funds',
    difficulty: 'Beginner',
    title: 'PE Fund with Listed Parent Exemption',
    shortDesc: 'A private equity fund chain sits beneath a listed parent company. Work through when the listed-company exemption applies and what still needs verifying.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'fund', label: 'Global Equity Holdings PLC', sub: 'Listed on LSE', row: 0, col: 0 },
        { id: 'n2', type: 'company', label: 'Everstone Capital GP Ltd', sub: 'General Partner', row: 1, col: 0 },
        { id: 'n3', type: 'fund', label: 'Everstone Capital Fund III LP', sub: 'Limited partnership', row: 2, col: 0 },
        { id: 'n4', type: 'company', label: 'Meridian Manufacturing Ltd', sub: 'Portfolio company', row: 3, col: 0 },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: 'Controls' },
        { from: 'n2', to: 'n3', label: 'General Partner' },
        { from: 'n3', to: 'n4', label: '100%' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Listed Company Exemption',
        question: 'Does this structure require identification of individual UBOs behind the listed parent, Global Equity Holdings PLC?',
        options: [
          { text: 'No — entities listed on a recognised exchange with public disclosure requirements are generally exempt from further beneficial-ownership look-through, since their ownership and governance are already subject to market transparency and regulatory oversight', correct: true, feedback: "Correct. Most AML frameworks (including FATF and MLR 2017) provide an exemption from further UBO look-through for entities listed on a recognised stock exchange — their shareholding and governance are already subject to public disclosure and regulatory oversight, making individual look-through unnecessary." },
          { text: 'Yes, every individual shareholder of the listed company must be identified regardless of exchange listing', correct: false, feedback: 'Incorrect. This would defeat the purpose of the listed-company exemption — the exemption exists precisely because a recognised listing already provides the transparency that individual UBO identification would otherwise achieve.' },
          { text: "Only if the listed company's free float is below 50%", correct: false, feedback: 'Incorrect. The listed-company exemption is based on the fact of being listed on a recognised, regulated exchange with disclosure obligations — not on the specific free-float percentage.' },
          { text: 'No, because General Partners are always exempt from CDD regardless of their parent', correct: false, feedback: "Incorrect reasoning. The GP itself is not automatically exempt — it's the listed status of the ultimate parent (Global Equity Holdings PLC) that supports the exemption from further individual look-through, not any inherent GP exemption." },
        ],
      },
      {
        id: 2, title: 'What Still Needs Verification',
        question: 'What must still be independently verified even with the listed-company exemption in place?',
        options: [
          { text: "The listing itself (confirming the exchange, ticker, and current regulatory status of Global Equity Holdings PLC), and that Everstone Capital GP Ltd and the Fund LP are properly constituted, active, and genuinely controlled by the listed parent", correct: true, feedback: "Correct. The exemption isn't a blanket pass on the entire chain — the firm must still confirm the parent is genuinely listed and in good standing, and verify that the GP and fund entities beneath it are properly constituted and actually controlled by that listed parent, not just nominally connected to it." },
          { text: 'Nothing further is required once the listed exemption applies', correct: false, feedback: "Incorrect. The exemption addresses individual UBO look-through specifically — it doesn't eliminate the need for standard entity verification on the rest of the chain (GP and fund entities)." },
          { text: 'Only the portfolio company needs verification, not the fund entities', correct: false, feedback: 'Incorrect. The GP and Fund LP still require standard entity verification (confirming they exist, are properly constituted, and are genuinely controlled by the listed parent) — this is not limited to only the portfolio company.' },
          { text: "The personal wealth of the GP's investment committee members", correct: false, feedback: 'Incorrect. Once the listed-parent exemption properly applies, individual-level source-of-wealth checks on investment committee members are not required — that is precisely what the exemption is designed to avoid.' },
        ],
      },
      {
        id: 3, title: 'Portfolio Company Risk',
        question: "Meridian Manufacturing Ltd (the portfolio company) operates in a cash-intensive, higher-risk sector. Does the listed-parent exemption reduce the CDD required for Meridian itself?",
        options: [
          { text: "No — the exemption addresses the ownership/UBO look-through question higher up the chain; it does not reduce standard due diligence on Meridian's own business activities, sector risk, and transaction monitoring", correct: true, feedback: "Correct. The listed-parent exemption is specifically about not needing to identify individual shareholders behind a listed entity — it says nothing about the operational risk of an underlying portfolio company. Meridian's own sector risk and transaction monitoring must be assessed on its own merits, independent of the exemption higher up the chain." },
          { text: 'Yes, the exemption flows down to reduce all CDD obligations throughout the entire structure', correct: false, feedback: "Incorrect. This conflates two separate things: the UBO look-through exemption at the top of the chain, and Meridian's own operational business risk further down — the exemption doesn't touch the latter at all." },
          { text: 'Yes, since Meridian\'s ownership is already covered by the listed-parent exemption, no further monitoring is needed', correct: false, feedback: "Incorrect. Ownership being covered by the exemption is unrelated to whether Meridian's own business activities and transactions require ongoing monitoring — those are assessed independently based on its sector and risk profile." },
          { text: "The exemption is irrelevant here since exemptions only ever apply to the topmost holding company", correct: false, feedback: "Incorrect framing. The exemption does apply at the top of this chain (the listed parent) — the point is that it doesn't extend down to exempt Meridian's own operational risk assessment, not that exemptions can never apply structurally." },
        ],
      },
    ],
  },
  {
    id: 'funds-b2',
    category: 'funds',
    difficulty: 'Beginner',
    title: 'Nominee Shareholder Concealing True Owner',
    shortDesc: 'A fund structure is held through an offshore nominee shareholder whose principal has not been disclosed. Work through the look-through obligation and what to do if the client refuses identification.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'company', label: 'Offshore Nominee Services Ltd', sub: 'Nominee shareholder — principal undisclosed', row: 0, col: 0 },
        { id: 'n2', type: 'fund', label: 'Quantum Growth Fund SPC', sub: 'Segregated portfolio company, Cayman', row: 1, col: 0 },
        { id: 'n3', type: 'company', label: 'TechVantage Ltd', sub: 'Portfolio company', row: 2, col: 0 },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '100% (nominee)' },
        { from: 'n2', to: 'n3', label: '100%' },
      ],
    },
    steps: [
      {
        id: 1, title: 'The Core Concern',
        question: 'What is the core AML concern with Offshore Nominee Services Ltd sitting at the top of this structure?',
        options: [
          { text: 'A nominee shareholder holds legal title on behalf of an undisclosed beneficial owner — the firm cannot identify the actual natural person(s) who ultimately control or benefit from Quantum Growth Fund SPC until the nominee arrangement is looked through', correct: true, feedback: "Correct. By definition, a nominee holds shares on behalf of someone else. Until that underlying principal is identified, the firm has no visibility into who actually controls or benefits from the fund — which is exactly the opacity beneficial-ownership rules exist to prevent." },
          { text: 'Nominee shareholders are illegal in most jurisdictions, so this structure cannot be accepted under any circumstances', correct: false, feedback: 'Incorrect. Nominee arrangements are legal and common in many jurisdictions when properly disclosed — the issue here is the lack of disclosure of the underlying principal, not the use of a nominee arrangement as such.' },
          { text: 'Nominee arrangements only matter for tax purposes, not for AML', correct: false, feedback: 'Incorrect. Nominee arrangements are directly relevant to AML — beneficial ownership identification specifically requires looking through nominee holdings to the natural person being represented.' },
          { text: "The concern is that the fund is Cayman-domiciled, not the nominee arrangement itself", correct: false, feedback: "Incorrect. While the Cayman domicile is a relevant jurisdictional factor to note, the primary and more fundamental issue here is the undisclosed principal behind the nominee shareholder." },
        ],
      },
      {
        id: 2, title: 'What Must Be Obtained',
        question: 'What must the firm obtain to properly complete CDD on this structure?',
        options: [
          { text: 'Documentation identifying the actual principal(s) behind the nominee arrangement — nominee agreements, or direct confirmation from Offshore Nominee Services Ltd of who they act for — since AML obligations require looking through nominee holdings to the real beneficial owner', correct: true, feedback: "Correct. The firm must obtain evidence identifying who the nominee actually represents. Without this, the beneficial ownership chain remains unresolved and CDD cannot be considered complete." },
          { text: "A statement from Offshore Nominee Services Ltd confirming they comply with their home jurisdiction's laws", correct: false, feedback: "Incorrect. Compliance with local regulation in the nominee's own jurisdiction does not identify the beneficial owner to this firm — a general compliance statement does not substitute for actual principal identification." },
          { text: 'Nothing — nominee shareholders are treated as the beneficial owners for AML purposes', correct: false, feedback: "Incorrect. This is the opposite of how nominee arrangements are treated — nominees are explicitly NOT beneficial owners, which is exactly why look-through to the underlying principal is required." },
          { text: 'Confirmation that Quantum Growth Fund SPC is a licensed and regulated fund', correct: false, feedback: "Helpful context on the fund itself, but this does not resolve the core issue — confirming the fund is regulated says nothing about who the nominee shareholder actually represents." },
        ],
      },
      {
        id: 3, title: 'Client Refuses Identification',
        question: "The nominee arrangement is disclosed but the underlying principal 'prefers to remain anonymous' and declines to provide identification. How should the firm proceed?",
        options: [
          { text: 'Decline to onboard or continue the relationship — an undisclosed beneficial owner who refuses identification cannot satisfy CDD requirements under any risk-based approach; this is a fundamental CDD failure, not a risk to be mitigated with enhanced monitoring', correct: true, feedback: 'Correct. Beneficial owner identification is a baseline CDD requirement, not something that can be waived through enhanced monitoring or risk-based mitigation. A refusal to identify the ultimate principal means CDD cannot be completed, and the relationship cannot proceed.' },
          { text: 'Proceed with EDD and enhanced ongoing monitoring in place of identification', correct: false, feedback: 'Incorrect. EDD supplements identification of a known, higher-risk customer — it cannot substitute for the fundamental requirement to identify the beneficial owner in the first place.' },
          { text: 'Proceed but flag the account for annual review', correct: false, feedback: 'Incorrect. Deferring to a future review does not resolve the immediate, unaddressed failure to identify the beneficial owner — the relationship should not proceed on this basis.' },
          { text: "Accept the anonymity if the nominee firm is based in a FATF-compliant jurisdiction", correct: false, feedback: "Incorrect. The nominee firm's own jurisdiction and regulatory standing does not resolve the fundamental failure to identify the actual beneficial owner it represents." },
        ],
      },
    ],
  },

  // ── Charities & HNWI ─────────────────────────────────────────────────
  {
    id: 'charities-b1',
    category: 'charities',
    difficulty: 'Beginner',
    title: 'Straightforward Charity Structure',
    shortDesc: 'A registered charity governed by a named board of trustees, with a verified major donor. Work through who must be identified and the resulting risk profile.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'charity', label: 'Global Relief Foundation', sub: 'UK registered charity', row: 0, col: 1 },
        { id: 'n2', type: 'person', label: 'Board of Trustees (5 named individuals)', sub: 'Governing body', row: 1, col: 0 },
        { id: 'n3', type: 'trust', label: 'Thompson Family Trust', sub: 'Major donor — verified', row: 1, col: 2 },
      ],
      edges: [
        { from: 'n2', to: 'n1', label: 'Governs' },
        { from: 'n3', to: 'n1', label: '40% of funding' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Persons with Significant Control',
        question: 'Who should be identified as the individuals with significant control over Global Relief Foundation?',
        options: [
          { text: 'The five named trustees on the Board — as the governing body, they exercise legal control over the charity\'s assets and decision-making, making them the relevant persons with significant control for CDD purposes', correct: true, feedback: 'Correct. A registered charity is not itself a natural person — the trustees who govern it and control its assets and decisions are the individuals who must be identified and verified for CDD purposes.' },
          { text: 'The charity itself, since it is a registered legal entity', correct: false, feedback: "Incorrect. The charity's legal registration establishes it as an entity, but AML identification requires looking through to the natural persons who control it — the entity's own registration doesn't substitute for that." },
          { text: 'Only the chair of the Board of Trustees', correct: false, feedback: "Incorrect. Absent evidence that only the chair holds real decision-making authority, all trustees with genuine control over the charity's governance and assets should typically be identified, not just the chair." },
          { text: 'No one — registered charities are automatically exempt from beneficial ownership identification', correct: false, feedback: 'Incorrect. Registered charity status does not exempt an organisation from control identification requirements, though it may support a lower overall risk rating once trustees are properly identified.' },
        ],
      },
      {
        id: 2, title: 'Major Donor Due Diligence',
        question: "The Thompson Family Trust provides 40% of the charity's annual funding. Does this funding relationship require additional due diligence?",
        options: [
          { text: 'Yes, proportionate to the size of the funding relationship — a major, identifiable, and verifiable funding source should be reviewed to confirm its own legitimacy and the source of the funds it provides, though this is standard due diligence rather than automatically requiring EDD', correct: true, feedback: "Correct. A donor providing 40% of a charity's funding represents a significant, concentrated relationship that warrants proportionate review of its own legitimacy — but a transparent, identifiable, verified trust doesn't automatically require Enhanced Due Diligence absent other risk factors." },
          { text: 'No, because charitable donations are exempt from AML scrutiny', correct: false, feedback: 'Incorrect. Charitable donations are not exempt from scrutiny — the non-profit sector is specifically flagged by FATF (Recommendation 8) as an area of terrorist-financing abuse risk, warranting proportionate due diligence.' },
          { text: 'Yes, and this alone automatically requires filing an SAR', correct: false, feedback: "Incorrect. A significant but transparent and verifiable donor relationship does not, by itself, meet the reasonable-grounds-to-suspect threshold that would trigger an SAR." },
          { text: "No, since the trust's name confirms it is a family trust and therefore low risk", correct: false, feedback: "Incorrect. A name alone provides no assurance of legitimacy — independent verification of the donor trust is still required regardless of what it is called." },
        ],
      },
      {
        id: 3, title: 'Overall Risk Profile',
        question: 'What is the overall risk profile of this charity structure, assuming all trustees and the major donor check out cleanly on verification?',
        options: [
          { text: 'Lower risk — a registered charity with a fully identified, transparent Board of Trustees and a verified, legitimate major donor represents a straightforward structure; standard CDD and proportionate ongoing NPO/terrorist-financing risk monitoring is appropriate', correct: true, feedback: 'Correct. Once trustees and the major funding source are properly identified and verified with no adverse findings, this structure presents a low, well-understood risk profile — appropriate for standard CDD with the ongoing monitoring proportionate to the charity sector generally.' },
          { text: 'High risk — all charities are inherently high risk for terrorist financing regardless of transparency', correct: false, feedback: "Incorrect. The charity sector as a whole carries elevated terrorist-financing risk per FATF guidance, but that doesn't mean every individual, fully-verified, transparent charity is automatically high risk — risk is assessed on the specific facts, not the sector label alone." },
          { text: 'No risk — charities are entirely exempt from ongoing AML monitoring once registered', correct: false, feedback: 'Incorrect. Registration does not exempt a charity from ongoing monitoring — proportionate monitoring should continue even for a well-verified, lower-risk charity like this one.' },
          { text: "Cannot be determined without knowing the charity's total annual budget", correct: false, feedback: "Incorrect. The determining factors here are the transparency and verifiability of the governance and funding structure, not the charity's overall budget size." },
        ],
      },
    ],
  },
  {
    id: 'charities-b2',
    category: 'charities',
    difficulty: 'Beginner',
    title: 'Charity with Undisclosed Overseas Fund Flows',
    shortDesc: 'A charity receives most of its funding from an anonymous donor and transfers funds to an overseas field office with no audited accounts. Diagnose the red flags and the appropriate response.',
    diagram: {
      nodes: [
        { id: 'n1', type: 'charity', label: 'Horizon Humanitarian Trust', sub: 'Registered charity', row: 0, col: 1 },
        { id: 'n2', type: 'person', label: 'Anonymous HNWI Donor', sub: 'Identity withheld by request', row: 1, col: 0 },
        { id: 'n3', type: 'company', label: 'Overseas Field Office — Country X', sub: 'FATF grey-listed, no audited accounts', row: 1, col: 2 },
      ],
      edges: [
        { from: 'n2', to: 'n1', label: '60% of funding' },
        { from: 'n1', to: 'n3', label: 'Funds transferred' },
      ],
    },
    steps: [
      {
        id: 1, title: 'Identifying the Red Flag',
        question: 'What is the PRIMARY red flag in this structure?',
        options: [
          { text: 'An anonymous donor providing 60% of the funding, combined with those funds being transferred to an overseas field office in a FATF grey-listed jurisdiction with no audited accounts — undisclosed source of funds plus opaque end-use in a higher-risk jurisdiction is a classic NPO-abuse/terrorist-financing risk pattern', correct: true, feedback: 'Correct. Neither factor alone is necessarily disqualifying, but together they create exactly the pattern FATF Recommendation 8 warns about: funds entering an NPO from an undisclosed source and exiting to an unaudited entity in a higher-risk jurisdiction, with no visibility into either end.' },
          { text: 'The charity operating internationally, which is inherently suspicious', correct: false, feedback: 'Incorrect. International humanitarian operations are entirely normal for a charity of this type and are not themselves a red flag — the concern is specifically the undisclosed donor and the unaudited, opaque destination.' },
          { text: 'The charity having only one major donor', correct: false, feedback: "Incorrect. Donor concentration alone isn't the primary issue — it's specifically the combination of the donor's anonymity with the high-risk, unaudited destination of the funds." },
          { text: "The use of the word 'humanitarian' in the charity's name", correct: false, feedback: 'Incorrect. The name of the organisation has no bearing on the actual AML risk factors present in this structure.' },
        ],
      },
      {
        id: 2, title: 'Anonymous Donor Handling',
        question: 'Can the charity accept funds from a donor who insists on remaining anonymous?',
        options: [
          { text: "Not without identifying the donor for the charity's own CDD purposes — while small public fundraising donations can be genuinely anonymous, a single donor providing 60% of total funding is a significant, concentrated relationship that must be identified regardless of the donor's privacy preference", correct: true, feedback: 'Correct. Anonymity is workable for small, dispersed public donations, but a donor representing 60% of total funding is a material, concentrated relationship — the scale alone means it must be identified, and a preference for privacy does not override that requirement.' },
          { text: 'Yes, always — donor anonymity is a fundamental right that AML rules cannot override', correct: false, feedback: "Incorrect. A donor's preference for privacy does not override the charity's own CDD obligations for a funding relationship of this scale and concentration." },
          { text: 'Yes, but only if the donation is under £1 million', correct: false, feedback: 'Incorrect. There is no such blanket monetary exemption — the facts here (60% funding concentration plus the destination risk) already establish clear grounds for concern regardless of the specific amount.' },
          { text: 'No, anonymous donations are illegal in all circumstances', correct: false, feedback: 'Incorrect. Small, genuinely dispersed anonymous public donations are generally permitted — the issue in this specific scenario is the scale and concentration of this particular donor relationship, not anonymous donations as a concept.' },
        ],
      },
      {
        id: 3, title: 'Appropriate Response',
        question: 'Given the transfer to the overseas field office in a grey-listed jurisdiction with no audited accounts, what should the reporting entity do?',
        options: [
          { text: 'Treat this as reasonable grounds for concern warranting an SAR/SMR — the combination of an undisclosed major funding source and transfers to an unaudited overseas entity in a higher-risk jurisdiction, with no verifiable end-use documentation, meets the threshold for suspicious activity reporting, alongside seeking further evidence of the field office\'s legitimacy', correct: true, feedback: 'Correct. The combination of an unresolved anonymous major donor and unverifiable, opaque fund transfers to a higher-risk jurisdiction collectively meets the reasonable-grounds-to-suspect threshold — this should be escalated for an SAR/SMR, alongside pursuing further evidence of the field office\'s legitimacy and actual use of funds.' },
          { text: "Nothing — the charity's registered status is sufficient assurance that all fund flows are legitimate", correct: false, feedback: "Incorrect. A charity's registration confirms its legal status but provides no assurance about the legitimacy of specific, opaque downstream fund flows like this one." },
          { text: "Simply request that the Country X field office provide audited accounts, with no other action needed", correct: false, feedback: 'Incorrect. Requesting audited accounts is a reasonable step but addresses only part of the picture — it does not resolve the separate, unaddressed issue of the anonymous major donor, so escalation is still warranted.' },
          { text: 'Stop only the specific transfer in question but take no further action on the wider relationship', correct: false, feedback: 'Incorrect. Addressing a single transaction in isolation, without escalating the broader pattern (anonymous donor plus opaque overseas transfers) for proper review, misses the full scope of the risk present.' },
        ],
      },
    ],
  },
]
