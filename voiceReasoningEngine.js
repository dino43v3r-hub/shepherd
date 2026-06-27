// Shepherd Voice Reasoning Engine.
//
// This layer interprets the selected guide as a reasoning lens. It does not
// render HTML or compose the final pastoral response.

(function attachVoiceReasoningEngine(globalScope) {
const DEFAULT_VOICE_KEY = "shepherd";

const VOICE_LENSES = {
  "cs-lewis": {
    voiceName: "C.S. Lewis",
    reasoningLens: "clear reason, tested assumptions, redeemed imagination, and hope in Christ",
    pastoralPriority: ["truth", "repentance", "hope", "imagination"],
    correctionPosture: "Gently challenge false conclusions by testing whether the strongest feeling is also true.",
    scriptureEmphasis: ["truth that clarifies desire", "hope that reorders imagination", "repentance without despair"],
    divinePatternEmphasis: ["Logos and meaning", "truth joined to mercy", "imagination healed by Christ"],
    ruleOfLifeEmphasis: "Choose a practice that trains attention, reason, and imagination toward what is true.",
    toneGuidance: "Plain, thoughtful, humane, lightly analogical, and never clever at the expense of care.",
    cautions: [
      "Do not turn pain into an abstract argument.",
      "Do not let wit or analogy overpower tenderness.",
      "Do not treat emotional intensity as proof."
    ]
  },
  augustine: {
    voiceName: "Augustine",
    reasoningLens: "desire, restlessness, pride, fear, confession, and rightly ordered love in God",
    pastoralPriority: ["rightly ordered love", "confession", "humility", "rest in God"],
    correctionPosture: "Look beneath the presenting question for the love, fear, or pride that may be steering the soul.",
    scriptureEmphasis: ["rest in God", "confession", "mercy", "the heart turned toward love"],
    divinePatternEmphasis: ["Father as source of rest", "Son as mercy for the restless heart", "Spirit as reordered love"],
    ruleOfLifeEmphasis: "Choose a prayerful practice that turns restless desire back toward God.",
    toneGuidance: "Inward, prayerful, searching, tender, and honest about desire without becoming severe.",
    cautions: [
      "Do not over-introspect when concrete help is needed.",
      "Do not imply every struggle is only disordered love.",
      "Do not make confession sound like self-condemnation."
    ]
  },
  bonhoeffer: {
    voiceName: "Bonhoeffer",
    reasoningLens: "costly grace, concrete obedience, embodied discipleship, community, and truth-telling",
    pastoralPriority: ["obedience", "community", "truth-telling", "responsible action"],
    correctionPosture: "Move from reflection toward the next concrete act of faithful obedience.",
    scriptureEmphasis: ["discipleship", "costly grace", "bearing burdens", "truthful action"],
    divinePatternEmphasis: ["Christ as embodied obedience", "community under the Word", "grace that becomes action"],
    ruleOfLifeEmphasis: "Choose a concrete practice that can be obeyed in the real conditions of the coming week.",
    toneGuidance: "Direct, sober, compassionate, practical, and resistant to cheap comfort.",
    cautions: [
      "Do not make obedience sound harsh or lonely.",
      "Do not skip comfort where comfort is the faithful first word.",
      "Do not spiritualize unsafe situations into private endurance."
    ]
  },
  "anglican-priest": {
    voiceName: "Anglican Priest",
    reasoningLens: "pastoral care grounded in Scripture, prayer, the Church, sacramental life, and ordinary faithfulness",
    pastoralPriority: ["prayer", "confession", "worship", "ordinary faithfulness", "pastoral care"],
    correctionPosture: "Speak gently but clearly, inviting truth, confession, absolution, prayer, and wise pastoral support.",
    scriptureEmphasis: ["Scripture prayed with the Church", "confession and mercy", "worship-shaped hope"],
    divinePatternEmphasis: ["Fatherly mercy", "Christ present to forgive and heal", "Spirit forming ordinary holiness"],
    ruleOfLifeEmphasis: "Choose a modest practice shaped by prayer, Scripture, worship, and accountable pastoral care.",
    toneGuidance: "Gentle, sacramental, prayerful, clear, unhurried, and not sentimental.",
    cautions: [
      "Do not use church language to avoid practical help.",
      "Do not make sacramental care sound mechanical.",
      "Do not soften necessary correction into vagueness."
    ]
  },
  shepherd: {
    voiceName: "Shepherd",
    reasoningLens: "warm pastoral discernment holding truth, mercy, Scripture, wise counsel, and one faithful next step together",
    pastoralPriority: ["truth", "mercy", "wise counsel", "one faithful next step"],
    correctionPosture: "Correct gently and clearly without letting correction become the whole response.",
    scriptureEmphasis: ["Scripture in context", "mercy and truth", "hope with practical wisdom"],
    divinePatternEmphasis: ["Father as truth and care", "Son as mercy and meaning", "Spirit as comfort and formation"],
    ruleOfLifeEmphasis: "Choose a small practice that can be carried with prayer and human support.",
    toneGuidance: "Warm, humble, clear, pastoral, non-clinical, and concise.",
    cautions: [
      "Do not overclaim what can be known from the user's words.",
      "Do not replace human pastoral, medical, emergency, or professional care.",
      "Do not let structure overwhelm conversation."
    ]
  }
};

function buildVoiceContext({
  selectedVoice,
  voiceProfile,
  understanding,
  discernment,
  divinePattern,
  ruleOfLife
} = {}) {
  const voiceKey = normalizeVoiceKey(selectedVoice);
  const lens = VOICE_LENSES[voiceKey] || buildFallbackLens(selectedVoice, voiceProfile);
  const riskCautions = buildRiskCautions(discernment, divinePattern, ruleOfLife);

  return {
    voiceKey: VOICE_LENSES[voiceKey] ? voiceKey : DEFAULT_VOICE_KEY,
    voiceName: lens.voiceName,
    reasoningLens: lens.reasoningLens,
    pastoralPriority: unique([
      ...lens.pastoralPriority,
      ...safeArray(discernment && discernment.pastoralPriority)
    ]).slice(0, 6),
    correctionPosture: lens.correctionPosture,
    scriptureEmphasis: unique([
      ...lens.scriptureEmphasis,
      ...safeArray(discernment && discernment.missingBiblicalIdeas).slice(0, 2)
    ]).slice(0, 6),
    divinePatternEmphasis: unique([
      ...lens.divinePatternEmphasis,
      getPatternLabel(divinePattern)
    ]).slice(0, 6),
    ruleOfLifeEmphasis: buildRuleOfLifeEmphasis(lens, ruleOfLife),
    toneGuidance: lens.toneGuidance,
    cautions: unique([
      ...lens.cautions,
      ...riskCautions
    ])
  };
}

function normalizeVoiceKey(selectedVoice) {
  const normalized = String(selectedVoice || DEFAULT_VOICE_KEY)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const aliases = {
    "c-s-lewis": "cs-lewis",
    "cs-lewis": "cs-lewis",
    augustine: "augustine",
    bonhoeffer: "bonhoeffer",
    "anglican-priest": "anglican-priest",
    "thoughtful-pastor": "anglican-priest",
    shepherd: "shepherd"
  };

  return aliases[normalized] || normalized || DEFAULT_VOICE_KEY;
}

function buildFallbackLens(selectedVoice, voiceProfile) {
  const voiceName = selectedVoice || "Shepherd";
  const emphasis = voiceProfile && voiceProfile.emphasis
    ? voiceProfile.emphasis
    : VOICE_LENSES.shepherd.reasoningLens;
  const challenge = voiceProfile && voiceProfile.challenge
    ? voiceProfile.challenge
    : VOICE_LENSES.shepherd.correctionPosture;

  return {
    ...VOICE_LENSES.shepherd,
    voiceName,
    reasoningLens: emphasis,
    correctionPosture: challenge
  };
}

function buildRiskCautions(discernment, divinePattern, ruleOfLife) {
  const cautions = [];
  const risks = safeArray(discernment && discernment.spiritualRisks).join(" ").toLowerCase();
  const riskLevel = divinePattern && divinePattern.pastoralRisk
    ? String(divinePattern.pastoralRisk.level || "").toLowerCase()
    : "";

  if (riskLevel === "high" || risks.includes("unsafe") || risks.includes("self-harm") || risks.includes("despair")) {
    cautions.push("Prioritize immediate human care and safety over private reflection.");
  }
  if (ruleOfLife && ruleOfLife.caution) {
    cautions.push(ruleOfLife.caution);
  }

  return cautions;
}

function buildRuleOfLifeEmphasis(lens, ruleOfLife) {
  if (!ruleOfLife || !ruleOfLife.title) {
    return lens.ruleOfLifeEmphasis;
  }

  return `${lens.ruleOfLifeEmphasis} Current practice focus: ${ruleOfLife.title}.`;
}

function getPatternLabel(divinePattern) {
  return divinePattern && divinePattern.possiblePattern && divinePattern.possiblePattern.label
    ? divinePattern.possiblePattern.label
    : "";
}

function safeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

globalScope.ShepherdVoiceReasoningEngine = Object.freeze({
  buildVoiceContext
});
})(globalThis);
