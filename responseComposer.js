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

  return {
    // Pastoral Acknowledgment shows Shepherd has heard the concern without
    // flattering, over-affirming, or accepting every conclusion as true.
    pastoralAcknowledgment: buildPastoralAcknowledgment(understanding, discernment, voiceName, voice),

    // Truth / Correction affirms what is true and corrects distorted,
    // unbiblical, despairing, prideful, unsafe, or incomplete assumptions.
    truthCorrection: buildTruthCorrection(discernment, concernAnalysis, voice),

    // Divine Pattern Insight translates the existing Divine Pattern result into
    // brief pastoral language around Father, Son / Logos, and Holy Spirit.
    divinePatternInsight: buildDivinePatternInsight(divinePattern),

    // Things You May Not Have Considered replaces generic reflection questions
    // with short points drawn from understanding, discernment, and pattern data.
    thingsNotConsidered: buildThingsNotConsidered(understanding, discernment, divinePattern),

    // Practical Next Step gives one concrete action aligned to pastoral priority.
    practicalNextStep: buildPracticalNextStep(discernment, concernAnalysis),

    // Short Prayer ends the visible response with a simple Anglican/scriptural
    // prayer grounded in the user's need.
    shortPrayer: buildShortPrayer(understanding, discernment),

    meta: {
      voiceName,
      correctionTone: discernment.correctionTone,
      pastoralPriority: discernment.pastoralPriority,
      sourceLength: typeof userMessage === "string" ? userMessage.length : 0
    }
  };
}

function buildPastoralAcknowledgment(understanding, discernment, voiceName, voice) {
  const truth = discernment.truthsRecognized[0] || "There is something honest and spiritually important in what you wrote.";
  const meaning = understanding.userMeaning.summary;
  const voiceLine = voiceName === "Shepherd"
    ? "Shepherd should answer with truth and mercy together."
    : `Seen through the ${voiceName} perspective, this still needs Shepherd's steadiness: ${voice.emphasis || "truth, mercy, and wise counsel"}.`;

  return `${meaning} ${truth} ${voiceLine}`;
}

function buildTruthCorrection(discernment, concernAnalysis, voice) {
  const affirmation = discernment.truthsRecognized[1] || discernment.truthsRecognized[0] || "The pain should be acknowledged truthfully.";
  const error = discernment.possibleErrors[0] || "No direct correction is clear from the wording alone.";
  const tone = discernment.correctionTone;
  const challenge = voice.challenge || "Shepherd should test the strongest conclusion by Scripture, prayer, wise counsel, and the fruit it is likely to bear.";
  const correctionLead = {
    none: "Hold this humbly:",
    gentle: "Gently, this needs correction:",
    firm: "This needs a clear correction:",
    urgent: "This needs urgent care and clear correction:"
  }[tone] || "This needs careful correction:";
  const distortion = concernAnalysis && concernAnalysis.possibleTheologicalDistortions && concernAnalysis.possibleTheologicalDistortions[0]
    ? ` ${concernAnalysis.possibleTheologicalDistortions[0].correction}`
    : "";

  return `${affirmation} ${correctionLead} ${error}.${distortion} ${challenge}`;
}

function buildDivinePatternInsight(divinePattern) {
  const lens = divinePattern && divinePattern.trinitarianLens ? divinePattern.trinitarianLens : {};
  const father = lens.father || "The Father brings truth, order, reality, and wise boundaries.";
  const son = lens.son || "The Son / Logos brings meaning, mercy, suffering love, and reconciliation.";
  const spirit = lens.spirit || "The Holy Spirit brings comfort, conviction, sanctification, and communion.";
  const anchor = divinePattern && divinePattern.scriptureAnchor && divinePattern.scriptureAnchor.reference
    ? ` A Scripture anchor to hold carefully is ${divinePattern.scriptureAnchor.reference}.`
    : "";

  return `The Father steadies this with truth: ${father} The Son meets it redemptively: ${son} The Holy Spirit works inwardly: ${spirit}${anchor}`;
}

function buildThingsNotConsidered(understanding, discernment, divinePattern) {
  const items = [
    discernment.possibleErrors[1],
    discernment.missingBiblicalIdeas[0] ? `A biblical truth to bring back into view is ${discernment.missingBiblicalIdeas[0]}.` : "",
    discernment.spiritualRisks[0] ? `A spiritual risk to watch is ${discernment.spiritualRisks[0]}.` : "",
    understanding.assumptionsDetected[0]
      ? `${understanding.assumptionsDetected[0].statement} ${understanding.assumptionsDetected[0].pastoralNote}`
      : "",
    divinePattern && divinePattern.guardrail ? divinePattern.guardrail : ""
  ];

  return unique(items).slice(0, 4);
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
  const growth = discernment.growthOpportunities[0] || "faithful obedience";

  return `Lord Jesus Christ, have mercy upon me. Give me ${need}, correct what is false without crushing what is wounded, and lead me toward ${growth}. By your Spirit, keep me in truth, hope, and the care of your Church. Amen.`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

globalScope.ShepherdResponseComposer = Object.freeze({
  composeShepherdResponse
});
})(globalThis);
