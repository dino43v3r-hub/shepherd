// Shepherd Discernment Engine.
//
// The Understanding Engine observes what the user appears to mean.
// This Discernment Engine evaluates what should be affirmed, corrected,
// warned about, or developed before Shepherd forms a pastoral response.

(function attachDiscernmentEngine(globalScope) {
const CASE_RULES = [
  {
    id: "punishment_fear",
    patterns: ["god is punishing me", "god's punishing me", "god must be punishing me", "punishing me"],
    truthsRecognized: [
      "The user is spiritually distressed and trying to understand suffering before God.",
      "The user's concern should be received as fear and confusion, not dismissed as shallow theology."
    ],
    possibleErrors: [
      "The user may be assuming all suffering is direct punishment from God.",
      "The user may be reading God's character chiefly through fear rather than through Christ's mercy."
    ],
    missingBiblicalIdeas: ["grace", "mercy", "fatherly discipline", "lament", "Christ's suffering"],
    spiritualRisks: ["fear of God without trust", "shame", "distorted view of God", "spiritual confusion"],
    growthOpportunities: ["lament honestly", "receive mercy", "seek teaching", "ask for pastoral counsel"],
    correctionTone: "gentle",
    pastoralPriority: ["comfort", "teaching"],
    confidence: 0.88
  },
  {
    id: "forgiveness_resistance",
    patterns: ["should forgive", "forgive them", "don't want to forgive", "do not want to forgive", "refuse to forgive"],
    truthsRecognized: [
      "The user is honest about resistance rather than pretending forgiveness is easy.",
      "The hurt beneath the resistance may be real and should be acknowledged."
    ],
    possibleErrors: [
      "Unforgiveness may be gaining moral permission because the wound is real.",
      "The user may desire to withhold mercy as a form of protection or justice."
    ],
    missingBiblicalIdeas: ["forgiveness", "obedience", "mercy received before mercy given", "sanctification"],
    spiritualRisks: ["bitterness", "hardness of heart", "avoidance", "spiritual stagnation"],
    growthOpportunities: ["repentance", "prayer for willingness", "wise boundaries", "one concrete act of obedience"],
    correctionTone: "gentle",
    pastoralPriority: ["repentance", "practical next step"],
    confidence: 0.9
  },
  {
    id: "worthlessness_despair",
    patterns: ["i am worthless", "i'm worthless", "worthless", "god must be tired of me", "god is tired of me", "tired of me"],
    truthsRecognized: [
      "The user is in pain and needs care before argument.",
      "The statement may be naming shame and despair rather than settled belief."
    ],
    possibleErrors: [
      "The user is treating a false identity claim as truth.",
      "The user may be assuming God's mercy has limits that Christ has not placed on it."
    ],
    missingBiblicalIdeas: ["image of God", "adoption", "mercy", "Christ's compassion", "hope"],
    spiritualRisks: ["despair", "isolation", "unsafe thinking", "shame spiral", "false belief about God"],
    growthOpportunities: ["receive grace", "tell a safe human being", "reject self-condemnation", "rest in Christ's compassion"],
    correctionTone: "gentle",
    pastoralPriority: ["comfort", "hope", "human support"],
    confidence: 0.92
  },
  {
    id: "vengeance_desire",
    patterns: ["hope god makes them suffer", "god makes them suffer", "make them suffer", "they hurt me"],
    truthsRecognized: [
      "The user's hurt should be acknowledged as real and morally important.",
      "The desire for justice may be pointing to a genuine wrong that should not be minimized."
    ],
    possibleErrors: [
      "The user may be confusing justice with revenge.",
      "Bitterness or hatred may be trying to take over the desire for righteousness."
    ],
    missingBiblicalIdeas: ["forgiveness", "entrusting judgment to God", "mercy", "prayer for enemies", "lament"],
    spiritualRisks: ["bitterness", "hatred", "spiritual hardening", "vengeance", "contempt"],
    growthOpportunities: ["lament the wrong", "entrust judgment to God", "seek healing", "pray for a non-vengeful heart"],
    correctionTone: "firm",
    pastoralPriority: ["correction", "teaching", "hope"],
    confidence: 0.86
  }
];

const GENERAL_ERROR_RULES = [
  {
    patterns: ["always", "never", "everyone", "no one", "nothing"],
    error: "Absolute language may be making the concern feel more total than it is.",
    risk: "overcertainty",
    missing: "wisdom"
  },
  {
    patterns: ["my fault", "i ruin everything", "disgusting"],
    error: "Self-condemnation may be imitating conviction while driving the user away from mercy.",
    risk: "shame spiral",
    missing: "grace"
  },
  {
    patterns: ["they made me", "all their fault", "none of this is my fault"],
    error: "Blame-shifting may hide the user's own next faithful step.",
    risk: "avoidance",
    missing: "humility"
  },
  {
    patterns: ["afraid", "scared", "panic", "worried"],
    error: "Fear may be acting as the final authority rather than as one signal to discern.",
    risk: "fear-based conclusions",
    missing: "courage"
  }
];

function analyzeDiscernment(userText, selectedVoice, understanding) {
  const lower = normalizeInput(userText).toLowerCase();
  const primaryRule = findPrimaryRule(lower, understanding);
  const generalFindings = findGeneralFindings(lower);
  const correctionTone = chooseCorrectionTone(lower, primaryRule, generalFindings, understanding);
  const pastoralPriority = choosePastoralPriority(primaryRule, correctionTone, understanding);

  return {
    // truthsRecognized protects the response from sounding condemnatory by
    // naming what is honest, painful, or spiritually important in the message.
    truthsRecognized: unique([
      ...(primaryRule ? primaryRule.truthsRecognized : []),
      understanding && understanding.userMeaning ? understanding.userMeaning.summary : "",
      selectedVoice ? `The selected voice should serve Shepherd's pastoral care rather than overpower it: ${selectedVoice}.` : ""
    ]).slice(0, 5),

    // possibleErrors evaluates ideas, assumptions, and direction, while keeping
    // the suffering person distinct from the false or harmful belief.
    possibleErrors: unique([
      ...(primaryRule ? primaryRule.possibleErrors : []),
      ...extractAssumptionErrors(understanding),
      ...generalFindings.map((item) => item.error)
    ]).slice(0, 7),

    // missingBiblicalIdeas names important truths that may need to be developed
    // without proof-texting or flattening the user's situation.
    missingBiblicalIdeas: unique([
      ...(primaryRule ? primaryRule.missingBiblicalIdeas : []),
      ...(understanding ? understanding.biblicalThemes || [] : []),
      ...generalFindings.map((item) => item.missing)
    ]).slice(0, 8),

    // spiritualRisks identifies where the current direction could become
    // spiritually harmful if left untested.
    spiritualRisks: unique([
      ...(primaryRule ? primaryRule.spiritualRisks : []),
      ...generalFindings.map((item) => item.risk),
      ...(understanding && understanding.emotionsDetected && understanding.emotionsDetected.intensity === "high" ? ["isolation"] : [])
    ]).slice(0, 8),

    // growthOpportunities turns correction toward repentance, comfort, courage,
    // counsel, prayer, and concrete Christian maturity.
    growthOpportunities: unique([
      ...(primaryRule ? primaryRule.growthOpportunities : []),
      ...(understanding ? understanding.deeperNeeds || [] : []),
      "prayer"
    ]).slice(0, 8),

    // correctionTone controls how direct Shepherd should be while avoiding
    // condemnation: none, gentle, firm, or urgent.
    correctionTone,

    // pastoralPriority tells the response builder what must lead the final
    // answer: comfort, correction, warning, teaching, repentance, hope, a next
    // step, or human support.
    pastoralPriority,

    // confidence is a humble rule-based weighting, not a diagnosis or prophecy.
    confidence: calculateConfidence(primaryRule, generalFindings, understanding)
  };
}

function findPrimaryRule(lower, understanding) {
  const understandingType = understanding && understanding.userMeaning
    ? understanding.userMeaning.possibleProblemType
    : "";

  return CASE_RULES.find((rule) =>
    rule.id === understandingType || rule.patterns.some((pattern) => lower.includes(pattern))
  );
}

function findGeneralFindings(lower) {
  return GENERAL_ERROR_RULES.filter((rule) =>
    rule.patterns.some((pattern) => lower.includes(pattern))
  );
}

function extractAssumptionErrors(understanding) {
  if (!understanding || !Array.isArray(understanding.assumptionsDetected)) {
    return [];
  }

  return understanding.assumptionsDetected
    .filter((assumption) => ["distorted", "unbiblical", "spiritually dangerous", "incomplete"].includes(assumption.status))
    .map((assumption) => `${assumption.statement} ${assumption.pastoralNote}`);
}

function chooseCorrectionTone(lower, primaryRule, generalFindings, understanding) {
  const urgentSafetyLanguage = ["suicide", "kill myself", "hurt myself", "self-harm", "self harm", "not safe", "abuse", "violence"];

  if (urgentSafetyLanguage.some((term) => lower.includes(term))) {
    return "urgent";
  }
  if (primaryRule && primaryRule.correctionTone) {
    return primaryRule.correctionTone;
  }
  if (generalFindings.length > 1) {
    return "gentle";
  }
  return "none";
}

function choosePastoralPriority(primaryRule, correctionTone, understanding) {
  const priorities = [
    ...(primaryRule ? primaryRule.pastoralPriority : []),
    ...(understanding && understanding.pastoralStrategy ? [understanding.pastoralStrategy.primary] : [])
  ];

  if (correctionTone === "urgent") {
    priorities.unshift("human support");
  }
  if (!priorities.length) {
    priorities.push("encouragement", "practical next step");
  }

  return unique(priorities).slice(0, 4);
}

function calculateConfidence(primaryRule, generalFindings, understanding) {
  let confidence = primaryRule ? primaryRule.confidence : 0.45;

  confidence += Math.min(generalFindings.length * 0.04, 0.12);

  if (understanding && understanding.userMeaning && understanding.userMeaning.possibleProblemType !== "general_discernment") {
    confidence += 0.04;
  }

  return Math.min(0.96, Math.round(confidence * 100) / 100);
}

function normalizeInput(inputText) {
  return typeof inputText === "string" ? inputText.trim() : "";
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

globalScope.ShepherdDiscernmentEngine = Object.freeze({
  analyzeDiscernment
});
})(globalThis);
