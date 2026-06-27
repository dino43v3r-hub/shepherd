// Divine Pattern reasoning engine for Shepherd.
//
// This engine performs transient in-memory analysis only. Raw input and
// internal analysis are not stored.
//
// Privacy constraints:
// - No localStorage, sessionStorage, IndexedDB, cookies, analytics, or network calls.
// - No console logging of raw user input.
// - The exported function is pure and dependency-free.

(function attachDivinePatternEngine(globalScope) {
const PATTERN_SIGNALS = [
  {
    id: "lament_to_trust",
    label: "lament moving toward trust",
    keywords: ["grief", "loss", "died", "death", "sad", "sorrow", "mourning", "cry", "why god"],
    scriptureAnchor: {
      reference: "Psalm 13",
      rationale: "Faithful lament names sorrow honestly while still turning toward God's steadfast love."
    },
    theologicalAnchor: "God receives truthful lament; Christian hope does not require minimizing sorrow.",
    trinitarianLens: {
      father: "The Father hears lament without despising weakness.",
      son: "The Son enters grief and bears sorrow rather than explaining it away.",
      spirit: "The Spirit helps prayer continue when words are thin."
    },
    cfrc: {
      creation: "Human love and attachment are good gifts.",
      fall: "Death, loss, and alienation wound what was made good.",
      redemption: "Christ meets grief with presence, tears, and resurrection hope.",
      consummation: "The final Christian hope is communion restored and death undone."
    }
  },
  {
    id: "conviction_to_mercy",
    label: "conviction moving toward mercy",
    keywords: ["sin", "guilt", "guilty", "ashamed", "shame", "confess", "repent", "failed", "unforgivable"],
    scriptureAnchor: {
      reference: "1 John 1:8-9",
      rationale: "Confession is joined to God's faithful forgiveness, not to despair."
    },
    theologicalAnchor: "Christian conviction tells the truth in order to return a person to grace and repaired obedience.",
    trinitarianLens: {
      father: "The Father receives returning children with mercy and truth.",
      son: "The Son bears sin and opens the way for confession without hiding.",
      spirit: "The Spirit convicts for life, not for self-hatred."
    },
    cfrc: {
      creation: "Human conscience is meant to respond to truth and goodness.",
      fall: "Sin and shame distort conscience into hiding or self-condemnation.",
      redemption: "Christ makes confession, forgiveness, and repair possible.",
      consummation: "The redeemed life is healed truthfulness before God and neighbor."
    }
  },
  {
    id: "fear_to_wise_trust",
    label: "fear moving toward wise trust",
    keywords: ["afraid", "fear", "scared", "anxious", "anxiety", "panic", "worried", "overwhelmed"],
    scriptureAnchor: {
      reference: "1 Peter 5:6-7",
      rationale: "Anxiety is cast on God within humility, community, and sober watchfulness."
    },
    theologicalAnchor: "Trust in God does not deny risk; it refuses to let fear become the final authority.",
    trinitarianLens: {
      father: "The Father cares for embodied needs and hidden fears.",
      son: "The Son teaches trust without demanding denial of trouble.",
      spirit: "The Spirit steadies courage for the next faithful step."
    },
    cfrc: {
      creation: "Human caution can protect life and help discern danger.",
      fall: "Fear can become domination, avoidance, or false prophecy.",
      redemption: "Christ forms courage, prayer, counsel, and patient obedience.",
      consummation: "Perfect love finally casts out fear in God's presence."
    }
  },
  {
    id: "harm_to_protection",
    label: "harm named for protection and justice",
    keywords: ["abuse", "unsafe", "harm", "hurt me", "violence", "threat", "control", "manipulate", "assault"],
    scriptureAnchor: {
      reference: "Proverbs 31:8-9",
      rationale: "Wisdom calls God's people to speak for those who need protection and justice."
    },
    theologicalAnchor: "Mercy and forgiveness must not be twisted into silence, exposure to danger, or protection of harm.",
    trinitarianLens: {
      father: "The Father judges oppression and cares for the vulnerable.",
      son: "The Son identifies with the wounded and confronts misuse of power.",
      spirit: "The Spirit gives courage, discernment, and truthful witness."
    },
    cfrc: {
      creation: "Human dignity and bodily safety are good gifts.",
      fall: "Violence and coercion corrupt power and relationship.",
      redemption: "Christ calls truth into the light and gathers the wounded into care.",
      consummation: "God's kingdom brings justice, peace, and the end of predatory harm."
    }
  },
  {
    id: "isolation_to_communion",
    label: "isolation moving toward communion",
    keywords: ["alone", "lonely", "isolated", "no one", "cut off", "left out", "can't tell anyone"],
    scriptureAnchor: {
      reference: "Galatians 6:2",
      rationale: "The body of Christ is called to bear burdens together."
    },
    theologicalAnchor: "Christian discernment is personal but not solitary; burdens often need wise human witness.",
    trinitarianLens: {
      father: "The Father adopts people into a family, not spiritual isolation.",
      son: "The Son gathers disciples into a shared life of love and truth.",
      spirit: "The Spirit builds communion and distributes care through the body."
    },
    cfrc: {
      creation: "People are made for communion with God and neighbor.",
      fall: "Shame, fear, and hurt can drive protective isolation.",
      redemption: "Christ reconciles and teaches burdens to be shared wisely.",
      consummation: "The final hope is healed communion with God and one another."
    }
  }
];

const DISTORTION_WARNINGS = [
  {
    id: "proof_texting",
    patterns: ["god told me", "one verse proves", "the only answer"],
    warning: "Do not treat a single impression or isolated phrase as final authority without Scripture in context, prayer, counsel, and wise testing."
  },
  {
    id: "harm_spiritualized",
    patterns: ["forgive and go back", "stay silent about abuse", "submit to abuse", "hide the harm"],
    warning: "Do not use spiritual language to hide harm, remove boundaries, or delay appropriate human help."
  },
  {
    id: "shame_as_conviction",
    patterns: ["god hates me", "disgusting to god", "too far gone", "no grace for me"],
    warning: "Do not confuse condemnation with Christian conviction; conviction moves toward truth, mercy, repentance, and life."
  },
  {
    id: "overcertainty",
    patterns: ["definitely", "always", "never", "everyone", "no one"],
    warning: "Watch for overcertainty. Shepherd should hold the pattern humbly because it only sees the words supplied."
  }
];

const PASTORAL_RISK_TERMS = [
  "suicide",
  "suicidal",
  "kill myself",
  "end my life",
  "self-harm",
  "self harm",
  "hurt myself",
  "abuse",
  "assault",
  "violence",
  "emergency",
  "not safe"
];

function analyzeDivinePattern(inputText, options = {}) {
  const text = normalizeInput(inputText);
  const optionScope = normalizeOptions(options);
  const scoredPatterns = scorePatterns(text);
  const primaryPattern = scoredPatterns[0] || buildFallbackPattern();
  const warnings = detectWarnings(text, primaryPattern);
  const pastoralRisk = assessPastoralRisk(text, warnings);
  const confidenceScore = calculateConfidence(primaryPattern.score, warnings.length, text.length);

  return {
    possiblePattern: {
      id: primaryPattern.id,
      label: primaryPattern.label,
      matchedSignals: primaryPattern.matchedSignals
    },
    scriptureAnchor: primaryPattern.scriptureAnchor,
    theologicalAnchor: primaryPattern.theologicalAnchor,
    trinitarianLens: primaryPattern.trinitarianLens,
    creationFallRedemptionConsummation: primaryPattern.cfrc,
    distortionWarnings: warnings,
    pastoralRisk,
    confidenceScore,
    guardrail: buildGuardrail(pastoralRisk, optionScope),
    summaryForShepherd: buildSummary(primaryPattern, confidenceScore, pastoralRisk)
  };
}

function exampleAnalyzeDivinePatternForShepherd(userInput) {
  // Future Shepherd response pipeline usage:
  // const divinePattern = analyzeDivinePattern(userInput);
  // Use divinePattern.summaryForShepherd and guardrails as supporting context only.
  return analyzeDivinePattern(userInput);
}

function normalizeInput(inputText) {
  if (typeof inputText !== "string") {
    return "";
  }

  return inputText.trim().toLowerCase();
}

function normalizeOptions(options) {
  if (!options || typeof options !== "object") {
    return {};
  }

  return {
    tradition: typeof options.tradition === "string" ? options.tradition : "General Christian",
    sensitivity: typeof options.sensitivity === "string" ? options.sensitivity : "balanced"
  };
}

function scorePatterns(text) {
  return PATTERN_SIGNALS
    .map((pattern) => {
      const matchedSignals = pattern.keywords.filter((keyword) => text.includes(keyword));

      return {
        ...pattern,
        matchedSignals,
        score: matchedSignals.length
      };
    })
    .filter((pattern) => pattern.score > 0)
    .sort((a, b) => b.score - a.score);
}

function detectWarnings(text, primaryPattern) {
  const warnings = DISTORTION_WARNINGS
    .filter((item) => item.patterns.some((pattern) => text.includes(pattern)))
    .map((item) => ({
      id: item.id,
      warning: item.warning
    }));

  if (primaryPattern.id === "harm_to_protection") {
    warnings.push({
      id: "safety_first",
      warning: "If harm or danger may be present, Shepherd should prioritize immediate human support, safety, and appropriate professional or pastoral help."
    });
  }

  return uniqueById(warnings);
}

function assessPastoralRisk(text, warnings) {
  const hasCrisisLanguage = PASTORAL_RISK_TERMS.some((term) => text.includes(term));
  const hasHarmWarning = warnings.some((warning) => ["harm_spiritualized", "safety_first"].includes(warning.id));

  if (hasCrisisLanguage || hasHarmWarning) {
    return {
      level: "high",
      reason: "The input may involve safety, harm, crisis, or coercion language.",
      recommendedPosture: "Do not generate a normal spiritualized answer without urging immediate appropriate human help."
    };
  }

  if (warnings.length > 0) {
    return {
      level: "moderate",
      reason: "The input may contain distorted theological reasoning or overcertainty.",
      recommendedPosture: "Answer humbly, avoid overclaiming, and encourage wise Christian counsel."
    };
  }

  return {
    level: "low",
    reason: "No immediate safety or severe distortion signal was detected by this rule-based engine.",
    recommendedPosture: "Use the pattern as a humble aid to prayer, Scripture, and human discernment."
  };
}

function calculateConfidence(patternScore, warningCount, textLength) {
  if (textLength === 0) {
    return 0.1;
  }

  const patternWeight = Math.min(patternScore * 0.18, 0.72);
  const warningWeight = Math.min(warningCount * 0.06, 0.18);
  const lengthWeight = textLength > 80 ? 0.1 : 0.04;

  return roundToTwoDecimals(Math.min(0.92, 0.16 + patternWeight + warningWeight + lengthWeight));
}

function buildGuardrail(pastoralRisk, options) {
  const traditionNote = options.tradition ? `Tradition context: ${options.tradition}. ` : "";

  if (pastoralRisk.level === "high") {
    return `${traditionNote}Treat this analysis as secondary to safety, trusted human care, pastoral counsel, professional help, and emergency support where needed.`;
  }

  return `${traditionNote}This is a rule-based theological reflection aid, not prophecy, diagnosis, final authority, or a substitute for Scripture in context and wise human counsel.`;
}

function buildSummary(pattern, confidenceScore, pastoralRisk) {
  return [
    `Possible Divine Pattern: ${pattern.label}.`,
    `Anchor: ${pattern.scriptureAnchor.reference}.`,
    `Confidence: ${confidenceScore}.`,
    `Pastoral risk: ${pastoralRisk.level}.`,
    "Use as supporting context only; do not store raw input or analysis."
  ].join(" ");
}

function buildFallbackPattern() {
  return {
    id: "general_discernment",
    label: "general discernment toward truth, mercy, and wise counsel",
    matchedSignals: [],
    score: 0,
    scriptureAnchor: {
      reference: "James 1:5",
      rationale: "When wisdom is lacking, Scripture invites humble prayer for wisdom."
    },
    theologicalAnchor: "When no strong pattern is clear, Christian discernment should remain humble, prayerful, and accountable to wise counsel.",
    trinitarianLens: {
      father: "The Father gives wisdom generously.",
      son: "The Son reveals truth with mercy.",
      spirit: "The Spirit guides discernment through Scripture, prayer, and the body of Christ."
    },
    cfrc: {
      creation: "Human reason, conscience, and community are gifts for discernment.",
      fall: "Limited context and distorted desire can cloud judgment.",
      redemption: "Christ teaches truthful, merciful, accountable wisdom.",
      consummation: "God's final restoration brings clear knowledge, healed desire, and faithful communion."
    }
  };
}

function uniqueById(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}

globalScope.ShepherdDivinePatternEngine = Object.freeze({
  analyzeDivinePattern,
  exampleAnalyzeDivinePatternForShepherd
});
})(globalThis);
