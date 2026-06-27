// Shepherd Response Composer.
//
// The composer is the final structured response stage. It receives the
// Understanding Engine, Discernment Engine, Divine Pattern Engine, and selected
// voice context, then produces the pastoral response sections normal users see.

(function attachResponseComposer(globalScope) {
function composeShepherdResponse({
  userMessage,
  selectedVoice,
  voiceProfile,
  understanding,
  discernment,
  divinePattern,
  concernAnalysis
}) {
  const voiceName = selectedVoice || "Shepherd";
  const voice = voiceProfile || {};
  const variant = chooseVariant(userMessage, voiceName);

  const response = {
    // Pastoral Acknowledgment shows Shepherd has heard the concern without
    // flattering, over-affirming, or accepting every conclusion as true.
    pastoralAcknowledgment: buildPastoralAcknowledgment(understanding, discernment, voiceName, voice, variant),

    // Truth / Correction affirms what is true and corrects distorted,
    // unbiblical, despairing, prideful, unsafe, or incomplete assumptions.
    truthCorrection: buildTruthCorrection(discernment, concernAnalysis, voice, voiceName),

    // Divine Pattern Insight translates the existing Divine Pattern result into
    // brief pastoral language around Father, Son / Logos, and Holy Spirit.
    divinePatternInsight: buildDivinePatternInsight(divinePattern, discernment, voiceName),

    // Things You May Not Have Considered replaces generic reflection questions
    // with short points drawn from understanding, discernment, and pattern data.
    thingsNotConsidered: buildThingsNotConsidered(understanding, discernment, divinePattern),

    // Practical Next Step gives one concrete action aligned to pastoral priority.
    practicalNextStep: buildPracticalNextStep(discernment, concernAnalysis),

    // Short Prayer ends the visible response with a simple Anglican/scriptural
    // prayer grounded in the user's need.
    shortPrayer: buildShortPrayer(understanding, discernment),

    highRiskNotice: buildHighRiskNotice(discernment, divinePattern),

    meta: {
      voiceName,
      correctionTone: discernment.correctionTone,
      pastoralPriority: discernment.pastoralPriority,
      safetyConcern: hasSafetyConcern(discernment, divinePattern),
      sourceLength: typeof userMessage === "string" ? userMessage.length : 0
    }
  };

  return {
    ...response,
    sections: buildSections(response)
  };
}

function buildPastoralAcknowledgment(understanding, discernment, voiceName, voice, variant) {
  const truth = cleanInternalSubject(discernment.truthsRecognized[0] || "There is something honest and spiritually important in what you wrote.");
  const concern = makeConcernHuman(understanding);
  const opening = [
    `From what you've shared, ${concern}`,
    `It sounds like ${concern}`,
    `If I am understanding you rightly, ${concern}`
  ][variant];
  const voiceSentence = buildVoiceSentence(voiceName, voice);

  return `${opening}. ${truth} ${voiceSentence}`;
}

function buildTruthCorrection(discernment, concernAnalysis, voice, voiceName) {
  const affirmation = cleanInternalSubject(discernment.truthsRecognized[1] || discernment.truthsRecognized[0] || "The pain should be acknowledged truthfully.");
  const error = humanizeError(discernment.possibleErrors[0] || "No direct correction is clear from the wording alone.");
  const tone = discernment.correctionTone;
  const challenge = voiceCorrectionLine(voiceName, voice);
  const correctionLead = {
    none: "I would hold that carefully rather than rush to a conclusion.",
    gentle: "Here is the gentle correction I would offer.",
    firm: "I want to say this plainly, but not harshly.",
    urgent: "This needs immediate human care as well as spiritual care."
  }[tone] || "This needs careful correction.";
  const distortion = concernAnalysis && concernAnalysis.possibleTheologicalDistortions && concernAnalysis.possibleTheologicalDistortions[0]
    ? ` ${cleanInternalSubject(concernAnalysis.possibleTheologicalDistortions[0].correction)}`
    : "";

  return `${affirmation} ${correctionLead} ${error}${distortion ? ` ${distortion}` : ""} ${challenge}`;
}

function buildDivinePatternInsight(divinePattern, discernment, voiceName) {
  const customInsight = buildCasePatternInsight(discernment);

  if (customInsight) {
    return customInsight;
  }

  const lens = divinePattern && divinePattern.trinitarianLens ? divinePattern.trinitarianLens : {};
  const father = stripArticleLead(lens.father || "The Father brings truth, order, reality, and wise boundaries.");
  const son = stripArticleLead(lens.son || "The Son brings meaning, mercy, suffering love, and reconciliation.");
  const spirit = stripArticleLead(lens.spirit || "The Holy Spirit brings comfort, conviction, sanctification, and communion.");
  const anchor = divinePattern && divinePattern.scriptureAnchor && divinePattern.scriptureAnchor.reference
    ? buildScriptureSentence(divinePattern.scriptureAnchor)
    : "";
  const lead = voiceName === "Augustine"
    ? "One way to see this is as a question of what your heart is being pulled toward."
    : "A biblical perspective holds more than one truth together here.";

  return `${lead} The Father ${father}; the Son ${son}; and the Holy Spirit ${spirit}.${anchor}`;
}

function buildThingsNotConsidered(understanding, discernment, divinePattern) {
  const items = [
    discernment.possibleErrors[1],
    discernment.missingBiblicalIdeas[0] ? `Bring ${formatBiblicalIdea(discernment.missingBiblicalIdeas[0])} back into view; it may change the way this burden feels.` : "",
    discernment.spiritualRisks[0] ? `Watch for ${discernment.spiritualRisks[0]}; pain can quietly begin steering the soul if it is left alone.` : "",
    understanding.assumptionsDetected[0]
      ? `${understanding.assumptionsDetected[0].statement} ${understanding.assumptionsDetected[0].pastoralNote}`
      : "",
    divinePattern && divinePattern.pastoralRisk && divinePattern.pastoralRisk.level === "high"
      ? "This may need trusted human support before it needs more private reflection."
      : ""
  ];

  return unique(items.map(cleanInternalSubject)).slice(0, 3);
}

function buildPracticalNextStep(discernment, concernAnalysis) {
  const priorities = (discernment.pastoralPriority || []).join(" ").toLowerCase();
  const risks = (discernment.spiritualRisks || []).join(" ").toLowerCase();

  if (risks.includes("unsafe") || risks.includes("despair") || risks.includes("isolation")) {
    return "Tell one safe, mature person today what you wrote here: a pastor or priest, counselor, doctor, trusted Christian friend, or crisis support if you may be unsafe.";
  }
  if (priorities.includes("repentance") || priorities.includes("forgiveness")) {
    return "Pray for willingness before you pray for warm feelings, then choose one concrete act of obedience that does not deny the hurt or remove wise boundaries.";
  }
  if (priorities.includes("correction")) {
    return "Before asking God to act against the other person, write one sentence of lament and one sentence entrusting justice to God without revenge.";
  }
  if (priorities.includes("teaching")) {
    return "Bring this exact concern to Scripture and to a pastor or mature Christian, asking them to help you separate suffering, discipline, mercy, and fear.";
  }
  if (concernAnalysis && concernAnalysis.medicalOrMentalHealth) {
    return "Make an appointment or send a message to a qualified professional, and ask a trusted Christian to walk with you spiritually while you do.";
  }

  return "Take one small faithful step today: pray honestly, name the concern plainly, and bring it to one wise Christian who can listen with you.";
}

function buildShortPrayer(understanding, discernment) {
  const need = understanding.deeperNeeds[0] || "mercy";
  const growth = normalizeGrowthPhrase(discernment.growthOpportunities[0] || "faithful obedience");

  return `Lord Jesus Christ, have mercy on me. Give me ${need}. Correct what is false without crushing what is wounded. Lead me toward ${growth}, and keep me in the hope and care of your Church. Amen.`;
}

function buildHighRiskNotice(discernment, divinePattern) {
  if (!hasSafetyConcern(discernment, divinePattern)) {
    return "";
  }

  return "Because this touches despair, isolation, unsafe thinking, harm, or severe distress, do not carry it alone. If there is immediate danger, call emergency services now. In the United States, call or text 988 for suicide or crisis support. If abuse, violence, coercion, or self-harm may be involved, move toward a safe person and contact appropriate professional, pastoral, medical, or local crisis support today.";
}

function hasSafetyConcern(discernment, divinePattern) {
  const risks = (discernment.spiritualRisks || []).join(" ").toLowerCase();
  const priorities = (discernment.pastoralPriority || []).join(" ").toLowerCase();
  const riskLevel = divinePattern && divinePattern.pastoralRisk
    ? String(divinePattern.pastoralRisk.level || "").toLowerCase()
    : "";

  return riskLevel === "high"
    || priorities.includes("human support")
    || risks.includes("despair")
    || risks.includes("unsafe")
    || risks.includes("isolation")
    || risks.includes("harm")
    || risks.includes("violence")
    || risks.includes("self-harm");
}

function buildSections(response) {
  return [
    { heading: "", content: response.pastoralAcknowledgment },
    { heading: "One truth worth holding onto", content: response.truthCorrection },
    { heading: "A biblical perspective", content: response.divinePatternInsight },
    { heading: "Things You May Not Have Considered", items: response.thingsNotConsidered },
    { heading: "One practical next step", content: response.practicalNextStep },
    { heading: "Let us pray", content: response.shortPrayer }
  ];
}

function chooseVariant(userMessage, voiceName) {
  const seed = `${userMessage || ""}${voiceName || ""}`.length;
  return seed % 3;
}

function makeConcernHuman(understanding) {
  const type = understanding && understanding.userMeaning ? understanding.userMeaning.possibleProblemType : "";
  const emotions = understanding && understanding.emotionsDetected
    ? [...(understanding.emotionsDetected.primary || []), ...(understanding.emotionsDetected.secondary || [])]
    : [];

  if (type === "punishment_fear") {
    return "you are trying to make sense of suffering, and fear is pressing you toward the thought that God may be punishing you";
  }
  if (type === "forgiveness_resistance") {
    return "you know forgiveness matters, but the wound is still resisting mercy";
  }
  if (type === "worthlessness_despair") {
    return "you are carrying shame so heavily that it is beginning to sound like the truth about who you are";
  }
  if (emotions.length) {
    return `you are carrying ${joinHumanList(emotions.slice(0, 3))}, and you are trying to bring it before God honestly`;
  }
  return "you are trying to name something spiritually important and you do not want a shallow answer";
}

function buildVoiceSentence(voiceName, voice) {
  if (voiceName === "C.S. Lewis") {
    return "The feeling may be vivid, but vividness is not the same thing as truth.";
  }
  if (voiceName === "Augustine") {
    return "This is worth treating as a matter of love, fear, and desire before God, not merely as a problem to solve.";
  }
  if (voiceName === "Bonhoeffer") {
    return "The question now is what faithful obedience looks like in the concrete next step.";
  }
  if (voiceName === "Spurgeon") {
    return "A bruised soul needs tenderness, but tenderness should still tell the truth.";
  }
  if (voiceName === "Paul") {
    return "Grace does not make the struggle unreal; it places the struggle under Christ rather than under fear.";
  }
  if (voiceName === "Trusted Christian friend") {
    return "I would not want you to carry that alone or let the sharpest feeling have the final word.";
  }
  if (voiceName === "Thoughtful pastor") {
    return "This deserves both gentleness and careful truth.";
  }

  return voice && voice.emphasis
    ? "Truth and mercy both matter here."
    : "This deserves a careful answer, not a quick reassurance.";
}

function voiceCorrectionLine(voiceName, voice) {
  if (voiceName === "C.S. Lewis") {
    return "A painful thought can be psychologically powerful and still be a poor theologian.";
  }
  if (voiceName === "Augustine") {
    return "The heart needs to be turned back toward God, not left circling its own fear or injury.";
  }
  if (voiceName === "Bonhoeffer") {
    return "Grace should become truthful action, not a way to avoid the next act of obedience.";
  }
  if (voiceName === "Spurgeon") {
    return "Christ does not break the bruised reed, but neither does he let despair preach in his name.";
  }

  return voice.challenge || "Test the strongest conclusion by Scripture, prayer, wise counsel, and the fruit it is likely to bear.";
}

function humanizeError(error) {
  return cleanInternalSubject(error)
    .replace(/^The user may be /i, "You may be ")
    .replace(/^The user is /i, "You may be ")
    .replace(/^You is /i, "You may be ")
    .replace(/^Unforgiveness may be/i, "Unforgiveness may be")
    .replace(/\.$/, ".");
}

function cleanInternalSubject(text) {
  return String(text || "")
    .replaceAll("Shepherd should", "It would be wise to")
    .replaceAll("The user's", "Your")
    .replaceAll("the user's", "your")
    .replaceAll("the user", "you")
    .replaceAll("The user", "You")
    .replaceAll("You is", "You are")
    .replaceAll("You are in pain and needs", "You are in pain and need")
    .replace(/\s+/g, " ")
    .trim();
}

function formatBiblicalIdea(idea) {
  if (idea === "image of God") {
    return "the image of God";
  }

  return idea;
}

function buildCasePatternInsight(discernment) {
  const ideas = (discernment.missingBiblicalIdeas || []).join(" ").toLowerCase();
  const risks = (discernment.spiritualRisks || []).join(" ").toLowerCase();

  if (ideas.includes("image of god") || risks.includes("despair")) {
    return "A biblical perspective begins with the truth that the Father does not treat you as disposable; you are his creature, made with dignity. The Son comes near to the ashamed and weary rather than recoiling from them. The Holy Spirit restores hope patiently, often through prayer, Scripture, and the steady care of other people.";
  }
  if (risks.includes("vengeance") || risks.includes("hatred")) {
    return "A biblical perspective can name the wrong without handing your soul over to revenge. The Father loves justice more purely than we do; the Son teaches mercy from the place of his own suffering; and the Holy Spirit can heal the part of the heart that wants punishment more than restoration.";
  }
  if (ideas.includes("forgiveness")) {
    return "A biblical perspective does not pretend the wound is small. The Father sees the wrong truthfully, the Son shows mercy without denying evil, and the Holy Spirit can begin making obedience possible before your feelings have caught up.";
  }
  if (ideas.includes("suffering") || ideas.includes("fatherly discipline")) {
    return "A biblical perspective holds suffering more carefully than a simple punishment story. The Father tells the truth without cruelty, the Son enters suffering and redeems it from within, and the Holy Spirit comforts without asking you to pretend the pain is small.";
  }

  return "";
}

function normalizeGrowthPhrase(growth) {
  const replacements = {
    "receive grace": "receiving grace",
    "lament honestly": "honest lament",
    "seek teaching": "teachable wisdom",
    "ask for pastoral counsel": "the humility to seek pastoral counsel",
    "repentance": "repentance",
    "prayer for willingness": "a willing heart",
    "lament the wrong": "truthful lament over the wrong",
    "entrust judgment to God": "entrusting judgment to God"
  };

  return replacements[growth] || growth;
}

function stripArticleLead(text) {
  return String(text || "")
    .replace(/^The Father\s+/i, "")
    .replace(/^The Son\s+/i, "")
    .replace(/^The Spirit\s+/i, "")
    .replace(/^The Holy Spirit\s+/i, "")
    .replace(/^brings\s+/i, "brings ")
    .replace(/\.$/, "");
}

function buildScriptureSentence(anchor) {
  const reference = anchor.reference || "Scripture";
  const rationale = anchor.rationale || "Scripture gives language for this without flattening it.";

  return ` ${reference} reminds us that ${lowercaseFirst(rationale.replace(/\.$/, ""))}.`;
}

function lowercaseFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : "";
}

function joinHumanList(items) {
  const cleanItems = unique(items);
  if (cleanItems.length <= 1) {
    return cleanItems[0] || "";
  }
  if (cleanItems.length === 2) {
    return `${cleanItems[0]} and ${cleanItems[1]}`;
  }
  return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems[cleanItems.length - 1]}`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

globalScope.ShepherdResponseComposer = Object.freeze({
  composeShepherdResponse
});
})(globalThis);
