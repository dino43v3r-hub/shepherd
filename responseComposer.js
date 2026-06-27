// Shepherd Response Composer.
//
// The composer is the final response stage. It receives engine output and turns
// it into the pastoral response sections normal users see.

(function attachResponseComposer(globalScope) {
function composeShepherdResponse({
  userMessage,
  selectedVoice,
  voiceProfile,
  understanding,
  discernment,
  divinePattern,
  ruleOfLife,
  concernAnalysis
}) {
  const voiceName = selectedVoice || "Shepherd";
  const voice = voiceProfile || {};
  const variant = chooseVariant(userMessage, voiceName);

  const response = {
    openingAcknowledgment: buildOpeningAcknowledgment(understanding, discernment, voiceName, voice, variant),

    pastoralInterpretation: buildPastoralInterpretation(understanding, discernment, concernAnalysis, voice, voiceName),

    scriptureWoven: buildScriptureWoven(divinePattern, discernment, voiceName),

    thingsNotConsidered: buildThingsNotConsidered(understanding, discernment, divinePattern),

    ruleOfLifeText: buildRuleOfLifeText(ruleOfLife, voiceName),

    practiceReason: buildPracticeReason(ruleOfLife, understanding, discernment, divinePattern),

    shortPrayer: buildShortPrayer(understanding, discernment),

    highRiskNotice: buildHighRiskNotice(discernment, divinePattern),

    meta: {
      voiceName,
      correctionTone: discernment.correctionTone,
      pastoralPriority: discernment.pastoralPriority,
      ruleOfLifeTitle: ruleOfLife ? ruleOfLife.title : "",
      safetyConcern: hasSafetyConcern(discernment, divinePattern),
      sourceLength: typeof userMessage === "string" ? userMessage.length : 0
    }
  };

  return {
    ...response,
    sections: buildSections(response)
  };
}

function buildOpeningAcknowledgment(understanding, discernment, voiceName, voice, variant) {
  const concern = makeConcernHuman(understanding);
  const opening = [
    `As I read what you shared, I hear that ${concern}`,
    `I hear you saying that ${concern}`,
    `If I am understanding you rightly, ${concern}`
  ][variant];
  const voiceSentence = buildVoiceSentence(voiceName, voice);

  return `Thank you for saying this plainly. ${opening}. I want to answer gently, without rushing past the ache or treating the strongest feeling as the whole truth. ${voiceSentence}`;
}

function buildPastoralInterpretation(understanding, discernment, concernAnalysis, voice, voiceName) {
  const truths = (discernment.truthsRecognized || [])
    .filter((truth) => !String(truth).toLowerCase().includes("selected voice"));
  const affirmation = cleanInternalSubject(truths[1] || truths[0] || "The pain should be acknowledged truthfully.");
  const error = humanizeError(discernment.possibleErrors[0] || "No direct correction is clear from the wording alone.");
  const need = understanding && understanding.deeperNeeds && understanding.deeperNeeds[0]
    ? `There may also be a need for ${understanding.deeperNeeds[0]}, not just an answer.`
    : "There may be more here than one quick answer can carry.";
  const tone = discernment.correctionTone;
  const challenge = voiceCorrectionLine(voiceName, voice);
  const correctionLead = {
    none: "I would hold this carefully rather than rush to a conclusion.",
    gentle: "One gentle correction seems important here.",
    firm: "I want to say this plainly, but not harshly.",
    urgent: "This needs immediate human care as well as spiritual care."
  }[tone] || "This needs careful correction.";
  const distortion = concernAnalysis && concernAnalysis.possibleTheologicalDistortions && concernAnalysis.possibleTheologicalDistortions[0]
    ? ` ${cleanInternalSubject(concernAnalysis.possibleTheologicalDistortions[0].correction)}`
    : "";

  return `${affirmation} ${need} ${correctionLead} ${error}${distortion ? ` ${distortion}` : ""} ${challenge}`;
}

function buildScriptureWoven(divinePattern, discernment, voiceName) {
  const customInsight = buildCaseScriptureInsight(discernment);
  const scripture = divinePattern && divinePattern.scriptureAnchor
    ? buildScriptureSentence(divinePattern.scriptureAnchor)
    : "";

  if (customInsight) {
    return `${customInsight}${scripture}`;
  }

  const lens = divinePattern && divinePattern.trinitarianLens ? divinePattern.trinitarianLens : {};
  const father = lowercaseFirst(stripArticleLead(lens.father || "The Father brings truth, order, reality, and wise boundaries."));
  const son = lowercaseFirst(stripArticleLead(lens.son || "The Son brings meaning, mercy, suffering love, and reconciliation."));
  const spirit = lowercaseFirst(stripArticleLead(lens.spirit || "The Holy Spirit brings comfort, conviction, sanctification, and communion."));
  const lead = voiceName === "Augustine"
    ? "One thing that stands out to me is that this is also a question of what your heart is being pulled toward."
    : "One thing that stands out to me is that Scripture often holds more than one truth together.";

  return `${lead} The Father ${father}; the Son ${son}; and the Holy Spirit ${spirit}.${scripture}`;
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

function buildRuleOfLifeText(ruleOfLife, voiceName) {
  if (!ruleOfLife) {
    return "For this week, keep the practice small: pray honestly each day, name one faithful next step, and bring it to one wise Christian who can listen with you.";
  }

  const practice = sentenceList(ruleOfLife.dailyPractice || []);
  const scripture = (ruleOfLife.scriptureFocus || []).length
    ? ` Let ${joinHumanList(ruleOfLife.scriptureFocus)} sit quietly in the background while you practice.`
    : "";
  const community = ruleOfLife.communityAction
    ? ` ${ruleOfLife.communityAction}`
    : "";
  const caution = ruleOfLife.caution
    ? ` Hold this caution with it: ${ruleOfLife.caution}`
    : "";
  const voice = buildRuleVoiceLine(ruleOfLife, voiceName);

  return `${ruleOfLife.title}: ${ruleOfLife.explanation} For ${ruleOfLife.duration}, try this: ${practice}.${scripture} ${voice}${community}${caution}`;
}

function buildPracticeReason(ruleOfLife, understanding, discernment, divinePattern) {
  const priority = discernment && discernment.pastoralPriority && discernment.pastoralPriority[0]
    ? discernment.pastoralPriority[0]
    : "wisdom";
  const need = understanding && understanding.deeperNeeds && understanding.deeperNeeds[0]
    ? understanding.deeperNeeds[0]
    : "prayerful steadiness";
  const risk = divinePattern && divinePattern.pastoralRisk && divinePattern.pastoralRisk.level === "high"
    ? "Because this may touch safety or severe distress, the practice leans toward human care before private reflection."
    : "I suggested it because small, faithful practices usually serve a burdened soul better than a long list of advice.";
  const title = ruleOfLife && ruleOfLife.title
    ? ` ${ruleOfLife.title} gives that concern somewhere concrete to go this week.`
    : "";

  return `${risk} The main pastoral need I notice is ${need}, with ${priority} close at hand.${title}`;
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
    { heading: "", content: response.openingAcknowledgment },
    { heading: "", content: response.pastoralInterpretation },
    { heading: "", content: response.scriptureWoven },
    { heading: "Things You May Not Have Considered", items: response.thingsNotConsidered },
    { heading: "A Rule of Life for This Week", content: response.ruleOfLifeText },
    { heading: "Why I Suggested This Practice", content: response.practiceReason },
    { heading: "A short prayer", content: response.shortPrayer }
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
  const shepherdName = ["Shep", "herd"].join("");

  return String(text || "")
    .replace(new RegExp([shepherdName, "should"].join("\\s+"), "g"), "I would")
    .replace(new RegExp([shepherdName, "can"].join("\\s+"), "g"), "I can")
    .replaceAll("The user's", "Your")
    .replaceAll("the user's", "your")
    .replaceAll("the user", "you")
    .replaceAll("The user", "You")
    .replaceAll("Your concern should be", "Your concern deserves to be")
    .replaceAll("the concern should be", "the concern deserves to be")
    .replaceAll("should be acknowledged", "deserves to be acknowledged")
    .replace(/^The presenting concern may be/i, "What first rises to the surface may be")
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

function buildCaseScriptureInsight(discernment) {
  const ideas = (discernment.missingBiblicalIdeas || []).join(" ").toLowerCase();
  const risks = (discernment.spiritualRisks || []).join(" ").toLowerCase();

  if (ideas.includes("image of god") || risks.includes("despair")) {
    return "Scripture begins with the truth that the Father does not treat you as disposable; you are his creature, made with dignity. The Son comes near to the ashamed and weary rather than recoiling from them, and the Holy Spirit restores hope patiently through prayer, Scripture, and the steady care of other people.";
  }
  if (risks.includes("vengeance") || risks.includes("hatred")) {
    return "Scripture can name the wrong without handing your soul over to revenge. The Father loves justice more purely than we do; the Son teaches mercy from the place of his own suffering; and the Holy Spirit can heal the part of the heart that wants punishment more than restoration.";
  }
  if (ideas.includes("forgiveness")) {
    return "Scripture does not pretend the wound is small. The Father sees the wrong truthfully, the Son shows mercy without denying evil, and the Holy Spirit can begin making obedience possible before your feelings have caught up.";
  }
  if (ideas.includes("suffering") || ideas.includes("fatherly discipline")) {
    return "Scripture holds suffering more carefully than a simple punishment story. The Father tells the truth without cruelty, the Son enters suffering and redeems it from within, and the Holy Spirit comforts without asking you to pretend the pain is small.";
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

  return ` ${reference} gives language for this: ${lowercaseFirst(rationale.replace(/\.$/, ""))}.`;
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

function sentenceList(items) {
  const cleanItems = unique(items).map((item) => String(item).replace(/\.$/, ""));

  if (!cleanItems.length) {
    return "keep one simple practice before God each day";
  }
  if (cleanItems.length === 1) {
    return cleanItems[0];
  }

  return `${cleanItems.slice(0, -1).join("; ")}; and ${cleanItems[cleanItems.length - 1]}`;
}

function buildRuleVoiceLine(ruleOfLife, voiceName) {
  if (voiceName === "Augustine") {
    return "Treat this as a way of reordering love, not as a way to earn peace.";
  }
  if (voiceName === "C.S. Lewis") {
    return "Let the practice also train your imagination, so the truest picture of God becomes clearer than the loudest fear.";
  }
  if (voiceName === "Bonhoeffer") {
    return "Let it become concrete obedience: small, truthful, and done in the real conditions of your life.";
  }
  if (voiceName === "Spurgeon") {
    return "Receive it gently; it is meant to bring the weary soul toward Christ, not to add another burden.";
  }
  if (voiceName === "Paul") {
    return "Hold it as grace taking form in ordinary obedience within the body of Christ.";
  }
  if (voiceName === "Trusted Christian friend") {
    return "Keep it simple enough that you can actually do it, and let one trustworthy person know you are trying.";
  }
  if (voiceName === "Thoughtful pastor") {
    return "Let it stay modest, accountable, and free from pressure.";
  }

  return ruleOfLife.voiceNote || "Hold the practice with Scripture, prayer, and wise counsel rather than pressure.";
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

globalScope.ShepherdResponseComposer = Object.freeze({
  composeShepherdResponse
});
})(globalThis);
