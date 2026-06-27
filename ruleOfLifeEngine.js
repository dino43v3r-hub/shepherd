// Shepherd Rule of Life Engine.
//
// This engine translates Shepherd's discernment into one small practice for the
// coming days. It is formation, not advice volume: specific, realistic,
// biblically grounded, and never a substitute for urgent human care.

(function attachRuleOfLifeEngine(globalScope) {
function buildRuleOfLife({
  userMessage,
  understanding,
  discernment,
  divinePattern,
  selectedVoice
}) {
  const lower = normalizeInput(userMessage).toLowerCase();
  const safetyRule = buildSafetyRule(lower, discernment, divinePattern);

  if (safetyRule) {
    return applyVoice(safetyRule, selectedVoice);
  }

  const type = understanding && understanding.userMeaning
    ? understanding.userMeaning.possibleProblemType
    : "general_discernment";
  const risks = (discernment.spiritualRisks || []).join(" ").toLowerCase();
  const ideas = (discernment.missingBiblicalIdeas || []).join(" ").toLowerCase();

  if (risks.includes("vengeance") || risks.includes("hatred") || lower.includes("makes them suffer")) {
    return applyVoice(buildLamentJusticeRule(), selectedVoice);
  }
  if (lower.includes("grief") || lower.includes("grieving") || lower.includes("loss") || lower.includes("died")) {
    return applyVoice(buildLamentRule(), selectedVoice);
  }
  if (type === "punishment_fear" || lower.includes("punishing me") || ideas.includes("suffering")) {
    return applyVoice(buildTrustRule(), selectedVoice);
  }
  if (type === "forgiveness_resistance" || ideas.includes("forgiveness")) {
    return applyVoice(buildForgivenessRule(), selectedVoice);
  }
  if (type === "worthlessness_despair" || risks.includes("shame")) {
    return applyVoice(buildGraceRule(), selectedVoice);
  }
  if (lower.includes("lonely") || lower.includes("alone") || risks.includes("isolation")) {
    return applyVoice(buildCommunityRule(), selectedVoice);
  }
  return applyVoice(buildWisdomRule(discernment), selectedVoice);
}

function buildSafetyRule(lower, discernment, divinePattern) {
  const risks = (discernment.spiritualRisks || []).join(" ").toLowerCase();
  const explicitSafetyLanguage = [
    "suicide",
    "suicidal",
    "kill myself",
    "end my life",
    "hurt myself",
    "self-harm",
    "self harm",
    "not safe",
    "abuse",
    "violence",
    "violent",
    "assault",
    "severe depression",
    "psychosis",
    "emergency"
  ].some((term) => lower.includes(term));

  if (!explicitSafetyLanguage
    && !risks.includes("violence")
    && !risks.includes("self-harm")
    && !lowerRiskIncludesSevere(risks)) {
    return null;
  }

  return {
    title: "Reach for Human Care",
    explanation: "When safety, severe despair, abuse, violence, or self-harm may be involved, the faithful practice is not private spiritual effort. It is moving toward appropriate human help while remaining under God's mercy.",
    duration: "Today, before any private practice",
    dailyPractice: [
      "Contact one safe person now: a pastor or priest, trusted friend, counselor, doctor, local crisis line, or emergency support.",
      "If there is immediate danger, call emergency services. In the United States, call or text 988 for suicide or crisis support.",
      "After contacting help, pray one sentence: Lord Jesus Christ, keep me in your mercy and help me receive care."
    ],
    scriptureFocus: [
      "Psalm 46:1",
      "Galatians 6:2"
    ],
    reflectionQuestion: "Who is the safest person I can contact before I try to carry this alone?",
    communityAction: "Do not keep this private today; tell one appropriate human being plainly that you need help.",
    caution: "This Rule of Life does not replace emergency services, medical care, counseling, abuse support, or pastoral care."
  };
}

function lowerRiskIncludesSevere(risks) {
  return risks.includes("severe depression")
    || risks.includes("psychosis")
    || risks.includes("medical")
    || risks.includes("abuse");
}

function buildTrustRule() {
  return {
    title: "Growing in Trust",
    explanation: "Because fear is trying to interpret suffering as punishment, this practice slows the soul down long enough to hold pain before God without rushing to a verdict.",
    duration: "Seven mornings",
    dailyPractice: [
      "Read Psalm 13 slowly once each morning.",
      "Name one fear to God in a single honest sentence.",
      "End by saying: Father, show me what is true without letting fear define you for me."
    ],
    scriptureFocus: [
      "Psalm 13",
      "John 9:1-3"
    ],
    reflectionQuestion: "Where am I treating pain as proof before I have brought it to God in prayer?",
    communityAction: "This week, ask a pastor, priest, or mature Christian to help you distinguish suffering, discipline, mercy, and fear.",
    caution: "Do not use this practice to explain away real harm or medical, emotional, or pastoral needs."
  };
}

function buildForgivenessRule() {
  return {
    title: "Learning Mercy",
    explanation: "Because the wound is real and resistance is honest, this practice asks for willingness before it asks for warm feelings.",
    duration: "Seven days",
    dailyPractice: [
      "Pray for the person by name for one minute.",
      "Do not begin by asking God to change them; simply place them into God's hands.",
      "Afterward say: Lord, make me willing to obey without pretending the hurt was small."
    ],
    scriptureFocus: [
      "Ephesians 4:31-32",
      "Romans 12:18"
    ],
    reflectionQuestion: "What would obedience look like today if forgiveness does not yet feel emotionally complete?",
    communityAction: "If the relationship is complicated or unsafe, speak with a pastor, priest, counselor, or wise mediator before taking relational action.",
    caution: "Forgiveness is not permission to enable harm, remove wise boundaries, or rebuild trust before it is truthful."
  };
}

function buildGraceRule() {
  return {
    title: "Receiving Grace",
    explanation: "Because shame is trying to name your identity, this practice turns attention toward Christ's mercy rather than toward self-accusation.",
    duration: "Five days",
    dailyPractice: [
      "Read one Gospel story where Jesus restores someone who seems beyond hope.",
      "Write one sentence about what the story shows you about Christ.",
      "Pray: Lord Jesus, let your mercy speak more truthfully than my shame."
    ],
    scriptureFocus: [
      "Luke 15:11-24",
      "Matthew 11:28-30"
    ],
    reflectionQuestion: "What does this passage reveal about Christ before it asks me to evaluate myself?",
    communityAction: "Tell one safe, mature Christian or pastor this week that shame has been heavy and you should not carry it alone.",
    caution: "If thoughts of self-harm, severe depression, or danger are present, seek immediate professional or crisis support."
  };
}

function buildLamentJusticeRule() {
  return {
    title: "Lament Without Revenge",
    explanation: "Because real hurt can bend justice into vengeance, this practice gives anger truthful words before God without handing it the steering wheel.",
    duration: "Seven evenings",
    dailyPractice: [
      "Write one sentence naming the wrong without exaggeration.",
      "Pray one sentence entrusting justice to God.",
      "End by asking the Holy Spirit to heal the desire to see the other person destroyed."
    ],
    scriptureFocus: [
      "Romans 12:19",
      "Psalm 13"
    ],
    reflectionQuestion: "Where is my desire for justice beginning to become a desire for revenge?",
    communityAction: "Before confronting the person, speak with a wise pastor, priest, counselor, or mediator about truth, safety, and timing.",
    caution: "This practice does not require minimizing harm or returning to an unsafe person."
  };
}

function buildLamentRule() {
  return {
    title: "Faithful Lament",
    explanation: "Grief often needs to be prayed before it can be explained. This practice gives sorrow room before God.",
    duration: "Seven days",
    dailyPractice: [
      "Spend ten quiet minutes with Psalm 13 or Psalm 42.",
      "Tell God plainly what hurts.",
      "Do not force yourself to resolve the grief before the prayer ends."
    ],
    scriptureFocus: [
      "Psalm 13",
      "Psalm 42"
    ],
    reflectionQuestion: "What sorrow have I been trying to explain before I have allowed myself to lament?",
    communityAction: "Ask one trusted person to sit with you this week without rushing you toward a lesson.",
    caution: "If grief is becoming severe depression or unsafe thinking, seek qualified human support."
  };
}

function buildCommunityRule() {
  return {
    title: "Walking with the Church",
    explanation: "Loneliness often makes painful conclusions sound more final. This practice turns isolation toward one concrete act of communion.",
    duration: "This week",
    dailyPractice: [
      "Pray by name for one person from church or Christian community each day.",
      "Send one simple message asking how they are.",
      "If you are able, attend worship this week and greet one person you do not know well."
    ],
    scriptureFocus: [
      "Hebrews 10:24-25",
      "Galatians 6:2"
    ],
    reflectionQuestion: "What small act of communion can I receive instead of waiting until I feel less alone?",
    communityAction: "Choose one service, group, or worship gathering this week and make yourself known to one person.",
    caution: "Community should be wise and safe; do not seek support from someone who manipulates, coerces, or harms you."
  };
}

function buildWisdomRule(discernment) {
  const priority = (discernment.pastoralPriority || [])[0] || "wisdom";

  return {
    title: "A Week of Wise Attention",
    explanation: `This practice keeps the concern before God without turning it into pressure. It is shaped around ${priority} and one faithful step at a time.`,
    duration: "Seven days",
    dailyPractice: [
      "Spend five quiet minutes each morning naming the concern before God.",
      "Read James 1:5 slowly.",
      "Write one sentence about the next faithful thing, not the whole solution."
    ],
    scriptureFocus: [
      "James 1:5",
      "Proverbs 3:5-6"
    ],
    reflectionQuestion: "What is the next faithful step I can take without pretending I know the whole path?",
    communityAction: "Share the one-sentence next step with a wise Christian and ask them to pray with you.",
    caution: "Do not force certainty where God may be inviting patience, counsel, and humility."
  };
}

function applyVoice(rule, selectedVoice) {
  const voice = selectedVoice || "Shepherd";
  const voiceNotes = {
    "Augustine": "Attend especially to what this practice reveals about love, fear, and the restless heart.",
    "C.S. Lewis": "Let this practice train the imagination as well as the will; do not let the loudest mental picture become your theology.",
    "Bonhoeffer": "Let the practice become concrete obedience, not private rumination.",
    "Spurgeon": "Receive this gently; the practice is meant to steady a weary soul, not burden it.",
    "Paul": "Hold this as grace becoming embodied in ordinary obedience within the body of Christ.",
    "Thoughtful pastor": "Keep the practice modest, honest, and accountable to wise human care.",
    "Trusted Christian friend": "Do it simply, and let one trustworthy person know you are trying to take this step."
  };

  return {
    ...rule,
    voiceNote: voiceNotes[voice] || "Hold the practice with Scripture, prayer, and wise counsel rather than pressure.",
    selectedVoice: voice
  };
}

function normalizeInput(inputText) {
  return typeof inputText === "string" ? inputText.trim() : "";
}

globalScope.ShepherdRuleOfLifeEngine = Object.freeze({
  buildRuleOfLife
});
})(globalThis);
