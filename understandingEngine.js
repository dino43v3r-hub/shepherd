// Shepherd Understanding Engine.
//
// This engine runs before correction, Divine Pattern analysis, and voice rendering.
// It is transient, rule-based, dependency-free, and keeps the full internal
// understanding object out of the user interface unless developer debug is on.

(function attachUnderstandingEngine(globalScope) {
const EMOTION_SIGNALS = [
  { emotion: "fear", patterns: ["afraid", "fear", "scared", "panic", "worried", "anxious", "punishing me"] },
  { emotion: "guilt", patterns: ["guilty", "guilt", "confess", "repent", "sinned", "punishing me"] },
  { emotion: "shame", patterns: ["shame", "ashamed", "worthless", "failure", "disgusting", "tired of me"] },
  { emotion: "despair", patterns: ["worthless", "no hope", "hopeless", "tired of me", "too far gone"] },
  { emotion: "hurt", patterns: ["hurt", "wounded", "betrayed", "forgive them", "forgiveness"] },
  { emotion: "anger", patterns: ["angry", "anger", "resent", "bitter", "don't want to forgive", "do not want to forgive"] },
  { emotion: "confusion", patterns: ["confused", "don't know", "do not know", "why", "what should"] },
  { emotion: "loneliness", patterns: ["alone", "lonely", "isolated", "no one"] }
];

const CONCERN_SIGNALS = [
  {
    id: "punishment_fear",
    patterns: ["god is punishing me", "god's punishing me", "god must be punishing me", "punishing me"],
    meaning: "The user appears to be interpreting suffering or hardship as God's personal punishment.",
    problem: "Fear, guilt, and possible theological confusion about suffering, mercy, and fatherly discipline.",
    needs: ["comfort", "theological correction", "mercy", "patient discernment", "pastoral counsel"],
    themes: ["suffering", "grace", "fatherly discipline", "mercy", "lament"],
    strategies: ["comfort", "gentle correction", "teaching", "prayerful reflection"],
    assumptions: [
      {
        statement: "Suffering may mean God is punishing me.",
        status: "incomplete",
        pastoralNote: "Scripture allows fatherly discipline, but it rejects simplistic explanations that turn every sorrow into direct punishment."
      },
      {
        statement: "God's posture toward me may be chiefly anger.",
        status: "distorted",
        pastoralNote: "The response should hold together God's holiness and his revealed mercy in Christ."
      }
    ],
    divinePatternEntry: {
      primaryEntry: "Son / Logos",
      father: "Needs truth about reality, discipline, mercy, and the limits of easy explanations.",
      sonLogos: "Needs meaning in suffering through Christ's redemptive presence rather than a bare punishment story.",
      holySpirit: "Needs comfort, conviction without condemnation, and patient sanctification."
    }
  },
  {
    id: "forgiveness_resistance",
    patterns: ["should forgive", "forgive them", "don't want to forgive", "do not want to forgive", "refuse to forgive"],
    meaning: "The user knows forgiveness is commanded but is honestly resisting it because hurt remains powerful.",
    problem: "Hurt, resistance, and possible temptation to let bitterness govern obedience.",
    needs: ["repentance", "healing", "grace", "obedience", "practical next step"],
    themes: ["forgiveness", "mercy", "obedience", "sanctification", "truthful reconciliation"],
    strategies: ["gentle correction", "teaching", "practical next step", "prayerful reflection"],
    assumptions: [
      {
        statement: "Forgiveness may require wanting to forgive before taking any obedient step.",
        status: "incomplete",
        pastoralNote: "Desire may lag behind obedience; Shepherd should invite one honest act of grace without pretending the wound is healed."
      },
      {
        statement: "Withholding forgiveness may protect me from being hurt again.",
        status: "distorted",
        pastoralNote: "Boundaries can protect without letting bitterness become the keeper of the heart."
      }
    ],
    divinePatternEntry: {
      primaryEntry: "Holy Spirit",
      father: "Needs truthful boundaries and moral order around the wrong that happened.",
      sonLogos: "Needs reconciliation shaped by Christ's mercy, not denial of harm.",
      holySpirit: "Needs transformation, conviction, and sanctifying grace for obedience."
    }
  },
  {
    id: "worthlessness_despair",
    patterns: ["i am worthless", "i'm worthless", "worthless", "god must be tired of me", "god is tired of me", "tired of me"],
    meaning: "The user appears to be making a despairing identity statement and imagining God as weary of them.",
    problem: "Shame, despair, and a false belief about identity before God.",
    needs: ["comfort", "safety awareness", "gospel hope", "human support", "correction of false belief"],
    themes: ["image of God", "mercy", "adoption", "hope", "grace stronger than shame"],
    strategies: ["comfort", "gentle correction", "referral to a human pastor/counselor/doctor when needed", "encouragement"],
    assumptions: [
      {
        statement: "My worth is defined by my failure, feelings, or usefulness.",
        status: "unbiblical",
        pastoralNote: "Shepherd should correct this identity claim with creation, redemption, and adoption language."
      },
      {
        statement: "God is exhausted by me and may be done with me.",
        status: "spiritually dangerous",
        pastoralNote: "This can deepen isolation and despair; the response should encourage immediate human support if the thought feels strong or unsafe."
      }
    ],
    divinePatternEntry: {
      primaryEntry: "Father",
      father: "Needs truth about creaturely dignity, adoption, and God's faithful care.",
      sonLogos: "Needs redemption of shame through Christ, who receives the weary and rejected.",
      holySpirit: "Needs comfort, hope, and communion rather than isolation."
    }
  }
];

const GENERAL_SIGNALS = [
  {
    id: "harm_or_safety",
    patterns: ["abuse", "unsafe", "not safe", "violence", "assault", "hurt myself", "self harm", "self-harm"],
    needs: ["safety", "human support", "protection", "wise counsel"],
    themes: ["protection", "justice", "truth-telling", "human dignity"],
    strategies: ["warning", "referral to a human pastor/counselor/doctor when needed", "practical next step"]
  },
  {
    id: "sin_or_confession",
    patterns: ["sin", "sinned", "guilty", "confess", "repent", "temptation"],
    needs: ["repentance", "confession", "forgiveness", "repair", "accountability"],
    themes: ["repentance", "confession", "grace", "sanctification"],
    strategies: ["gentle correction", "teaching", "practical next step"]
  },
  {
    id: "grief_or_suffering",
    patterns: ["grief", "loss", "died", "death", "suffering", "sorrow"],
    needs: ["comfort", "lament", "patient presence", "community"],
    themes: ["lament", "suffering", "hope", "endurance"],
    strategies: ["comfort", "prayerful reflection", "encouragement"]
  }
];

function analyzeUnderstanding(userText, options = {}) {
  const text = normalizeInput(userText);
  const lower = text.toLowerCase();
  const primaryConcern = findPrimaryConcern(lower);
  const generalMatches = findGeneralMatches(lower);
  const emotions = detectEmotions(lower, primaryConcern, generalMatches);
  const intensity = assessEmotionalIntensity(lower, emotions, primaryConcern);
  const strategies = unique([
    ...(primaryConcern ? primaryConcern.strategies : []),
    ...generalMatches.flatMap((item) => item.strategies),
    "practical next step"
  ]);

  return {
    // userMeaning summarizes what the user appears to be communicating so the
    // final response addresses meaning before advice.
    userMeaning: {
      summary: primaryConcern ? primaryConcern.meaning : "The user is bringing an open-ended spiritual or pastoral concern that needs careful listening before advice.",
      expressedConcern: primaryConcern ? primaryConcern.problem : "The exact problem is not fully clear from the wording, so Shepherd should stay humble and avoid overclaiming.",
      possibleProblemType: primaryConcern ? primaryConcern.id : "general_discernment"
    },

    // emotionsDetected helps Shepherd choose pace, tenderness, and urgency
    // without pretending to diagnose the user.
    emotionsDetected: {
      primary: emotions.slice(0, 2),
      secondary: emotions.slice(2, 5),
      intensity
    },

    // assumptionsDetected names possible beliefs beneath the concern so the
    // correction layer can affirm what is true and challenge what is harmful.
    assumptionsDetected: primaryConcern
      ? primaryConcern.assumptions
      : buildGeneralAssumptions(lower),

    // deeperNeeds looks below the presenting words toward repentance, comfort,
    // courage, support, or discernment.
    deeperNeeds: unique([
      ...(primaryConcern ? primaryConcern.needs : ["discernment", "prayer", "wise counsel"]),
      ...generalMatches.flatMap((item) => item.needs)
    ]).slice(0, 8),

    // biblicalThemes supplies broad biblical categories without turning the
    // response into proof-texting or a verse lookup.
    biblicalThemes: unique([
      ...(primaryConcern ? primaryConcern.themes : ["wisdom", "humility", "prayer", "wise counsel"]),
      ...generalMatches.flatMap((item) => item.themes)
    ]).slice(0, 8),

    // pastoralStrategy determines how Shepherd should speak: comfort, correct,
    // warn, teach, pray, or refer to human care.
    pastoralStrategy: {
      primary: strategies[0] || "prayerful reflection",
      supporting: strategies.slice(1, 5),
      referralNeeded: strategies.some((strategy) => strategy.includes("referral")) || intensity === "high"
    },

    // divinePatternEntry gives the Divine Pattern Engine an entry point into
    // Father, Son / Logos, and Holy Spirit emphases before it scores patterns.
    divinePatternEntry: primaryConcern
      ? primaryConcern.divinePatternEntry
      : buildGeneralDivinePatternEntry(options)
  };
}

function findPrimaryConcern(lower) {
  return CONCERN_SIGNALS.find((concern) =>
    concern.patterns.some((pattern) => lower.includes(pattern))
  );
}

function findGeneralMatches(lower) {
  return GENERAL_SIGNALS.filter((signal) =>
    signal.patterns.some((pattern) => lower.includes(pattern))
  );
}

function detectEmotions(lower, primaryConcern, generalMatches) {
  const hits = EMOTION_SIGNALS
    .filter((item) => item.patterns.some((pattern) => lower.includes(pattern)))
    .map((item) => item.emotion);

  if (primaryConcern && primaryConcern.id === "punishment_fear") {
    hits.push("fear", "guilt", "confusion");
  }
  if (primaryConcern && primaryConcern.id === "forgiveness_resistance") {
    hits.push("hurt", "anger", "resistance");
  }
  if (primaryConcern && primaryConcern.id === "worthlessness_despair") {
    hits.push("despair", "shame", "loneliness");
  }
  if (generalMatches.some((item) => item.id === "harm_or_safety")) {
    hits.push("fear", "distress");
  }

  return unique(hits.length ? hits : ["uncertainty"]);
}

function assessEmotionalIntensity(lower, emotions, primaryConcern) {
  const highSignals = ["worthless", "no hope", "hopeless", "kill myself", "hurt myself", "not safe", "abuse"];
  const mediumSignals = ["punishing me", "don't want", "do not want", "ashamed", "panic", "overwhelmed"];

  if (highSignals.some((signal) => lower.includes(signal)) || emotions.includes("despair")) {
    return "high";
  }
  if (primaryConcern || mediumSignals.some((signal) => lower.includes(signal)) || emotions.length >= 3) {
    return "medium";
  }
  return "low";
}

function buildGeneralAssumptions(lower) {
  const assumptions = [];

  if (lower.includes("always") || lower.includes("never")) {
    assumptions.push({
      statement: "The situation may be total or unchangeable.",
      status: "distorted",
      pastoralNote: "Absolute language may need testing with Scripture, counsel, and reality."
    });
  }

  assumptions.push({
    statement: "The presenting concern may be the whole concern.",
    status: "incomplete",
    pastoralNote: "Shepherd should leave room for hidden grief, fear, sin, or need that has not yet been named."
  });

  return assumptions;
}

function buildGeneralDivinePatternEntry(options) {
  const tradition = typeof options.tradition === "string" ? options.tradition : "General Christian";

  return {
    primaryEntry: "Father",
    father: `Order, truth, reality, and wise boundaries should be held in a ${tradition} pastoral frame.`,
    sonLogos: "Meaning, redemption, incarnation, suffering, and reconciliation should shape the response.",
    holySpirit: "Transformation, conviction, comfort, sanctification, and communion should guide next steps."
  };
}

function normalizeInput(inputText) {
  return typeof inputText === "string" ? inputText.trim() : "";
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

globalScope.ShepherdUnderstandingEngine = Object.freeze({
  analyzeUnderstanding
});
})(globalThis);
