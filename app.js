const form = document.querySelector("#reflection-form");
const result = document.querySelector("#result");
const clearButton = document.querySelector("#clear-button");
const { analyzeUnderstanding } = window.ShepherdUnderstandingEngine;
const { analyzeDiscernment } = window.ShepherdDiscernmentEngine;
const { analyzeDivinePattern } = window.ShepherdDivinePatternEngine;
const { buildRuleOfLife } = window.ShepherdRuleOfLifeEngine;
const { composeShepherdResponse } = window.ShepherdResponseComposer;
const { buildVoiceContext } = window.ShepherdVoiceReasoningEngine || {};

// Privacy model:
// Shepherd has no backend, database, analytics, storage, or AI API.
// User text lives only in browser memory while this page is open.
let sessionDraft = null;
const developerDebugEnabled = new URLSearchParams(window.location.search).has("debug")
  || window.location.hash.toLowerCase().includes("debug");

const crisisTerms = [
  "suicide",
  "suicidal",
  "kill myself",
  "end my life",
  "self-harm",
  "self harm",
  "hurt myself",
  "abuse",
  "abused",
  "assault",
  "immediate danger",
  "not safe",
  "severe depression",
  "violence",
  "violent",
  "crisis",
  "emergency"
];

const voiceProfiles = {
  "Shepherd": {
    emphasis: "truth, mercy, Scripture in context, wise human counsel, and one faithful next step",
    challenge: "Test the strongest conclusion by Scripture, prayer, wise counsel, and the fruit it is likely to bear."
  },
  "Paul": {
    emphasis: "grace, union with Christ, endurance, correction, and community",
    challenge: "Test the conclusion by the gospel: does it lead toward faith working through love, or toward fear, shame, and isolation?"
  },
  "Augustine": {
    emphasis: "disordered loves, confession, restlessness, desire, and return to God",
    challenge: "Ask what love is ruling the moment: love of God, love of control, love of approval, or love of being vindicated."
  },
  "C.S. Lewis": {
    emphasis: "imagination, reason, pride, humility, moral clarity, and honest language",
    challenge: "Reason and humility both matter here: the feeling may be real without being a reliable judge of ultimate truth."
  },
  "Bonhoeffer": {
    emphasis: "costly obedience, community, discipleship, truthful action, and responsibility",
    challenge: "Grace is not permission to avoid costly truth. Discernment should become responsible action, not endless inward circling."
  },
  "Spurgeon": {
    emphasis: "comfort, hope, tenderness, gospel assurance, and weary-soul encouragement",
    challenge: "Do not let sorrow preach a sermon that Christ himself would not preach over you."
  },
  "Thoughtful pastor": {
    emphasis: "balanced pastoral care, Scripture, emotional honesty, wise caution, and next faithful steps",
    challenge: "A faithful response may need both comfort and correction, depending on what is true and what is merely loud."
  },
  "Trusted Christian friend": {
    emphasis: "warm honesty, companionship, practical help, courage, and faithful candor",
    challenge: "A faithful friend would believe your pain matters while still refusing to let a false conclusion rule you."
  }
};

const theologicalDistortions = [
  {
    id: "god_hates_me",
    patterns: ["god hates me", "god must hate me"],
    correction: "Gently reject the conclusion that God hates you. Pain, discipline, failure, or silence may need lament and counsel, but they are not proof that God's love has vanished.",
    scripture: ["Romans 8:38-39", "Paul says nothing in creation can separate believers from the love of God in Christ Jesus."],
    responseTypes: ["comfort", "correction", "counsel"]
  },
  {
    id: "god_abandoned_me",
    patterns: ["god abandoned me", "god has abandoned me", "god left me"],
    correction: "Feeling abandoned should be spoken honestly to God, but it should not be treated as the final truth about God.",
    scripture: ["Psalm 22:1-5", "Scripture gives language for forsakenness while still turning toward the God who has been faithful."],
    responseTypes: ["comfort", "counsel"]
  },
  {
    id: "unforgivable",
    patterns: ["i can never be forgiven", "god can't forgive me", "too far gone", "unforgivable", "no grace for me"],
    correction: "Christian confession takes sin seriously, but it does not grant shame authority over Christ's mercy.",
    scripture: ["1 John 1:8-9", "God's faithful forgiveness is held together with honest confession."],
    responseTypes: ["comfort", "correction", "repentance", "counsel"]
  },
  {
    id: "earn_love",
    patterns: ["earn god's love", "earn gods love", "make god love me", "god will love me if", "have to be perfect for god"],
    correction: "Obedience matters, but it is not a wage paid to purchase God's love.",
    scripture: ["Ephesians 2:8-10", "Grace comes before the good works Christians are created to walk in."],
    responseTypes: ["comfort", "correction"]
  },
  {
    id: "suffering_proves_failure",
    patterns: ["my suffering proves i failed", "suffering means i failed", "god is punishing me because i failed", "god is punishing me", "god must be punishing me", "punishing me"],
    correction: "Suffering can reveal many things, but Scripture does not let you reduce every sorrow to personal failure.",
    scripture: ["John 9:1-3", "Jesus rejects a simplistic link between suffering and personal blame."],
    responseTypes: ["comfort", "correction", "counsel"]
  },
  {
    id: "worthless_identity",
    patterns: ["i am worthless", "i'm worthless", "worthless", "god must be tired of me", "god is tired of me", "tired of me"],
    correction: "Gently reject the conclusion that you are worthless or that God is weary of you. Shame may feel authoritative, but it is not the voice that names your identity before God.",
    scripture: ["Matthew 11:28-30", "Jesus invites the weary to come to him and learn his gentle yoke."],
    responseTypes: ["comfort", "correction", "counsel"]
  },
  {
    id: "forgiveness_resistance",
    patterns: ["i don't want to forgive", "i do not want to forgive", "don't want to forgive", "do not want to forgive", "i refuse to forgive"],
    correction: "The hurt should not be minimized, but resistance to forgiveness still needs to be brought honestly under Christ's mercy and command.",
    scripture: ["Ephesians 4:31-32", "Paul roots Christian forgiveness in God's mercy while still calling evil by its proper name."],
    responseTypes: ["correction", "repentance", "comfort", "practical"]
  },
  {
    id: "forgiveness_no_boundaries",
    patterns: ["forgiveness means no boundaries", "forgive and go back", "forgive them so i have to let them", "forgiveness means i have to trust them"],
    correction: "Forgiveness does not require enabling continued harm or pretending trust has been rebuilt.",
    scripture: ["Romans 12:18", "Peace is pursued as far as it depends on you, which recognizes limits and responsibility."],
    responseTypes: ["correction", "boundaries", "counsel"]
  },
  {
    id: "silent_about_harm",
    patterns: ["i should stay silent about harm", "keep quiet about abuse", "not tell anyone about abuse", "hide the harm"],
    correction: "Silence can protect privacy, but it must not be used to protect harm. Safety and wise help matter.",
    scripture: ["Proverbs 31:8-9", "Wisdom calls God's people to speak for those who need protection and justice."],
    responseTypes: ["warning", "boundaries", "counsel", "practical"]
  },
  {
    id: "faith_fixes_all",
    patterns: ["just need more faith", "if i had more faith everything would be fixed", "more faith and then everything will be fixed"],
    correction: "Faith is not a way to deny ordinary means of help. Prayer, medicine, counsel, repentance, boundaries, and community can all be gifts of God.",
    scripture: ["James 2:15-17", "Faith is not detached from embodied care and concrete action."],
    responseTypes: ["correction", "practical", "counsel"]
  }
];

const cognitiveDistortions = [
  {
    id: "all_or_nothing",
    label: "all-or-nothing thinking",
    patterns: ["always", "never", "everyone", "no one", "nothing", "forever", "ruined everything"],
    observation: "Absolute words may be making a painful situation feel more total than it really is."
  },
  {
    id: "despair",
    label: "despair",
    patterns: ["no hope", "hopeless", "no point", "nothing will ever change", "it will never get better"],
    observation: "Despair is a signal to seek support, not a reliable prophet about what God can still do."
  },
  {
    id: "shame",
    label: "shame",
    patterns: ["i am disgusting", "i'm disgusting", "i hate myself", "worthless", "i am a failure", "i'm a failure"],
    observation: "Shame may be trying to counterfeit conviction; conviction leads toward confession and life, not self-hatred."
  },
  {
    id: "blame_shifting",
    label: "blame shifting",
    patterns: ["all their fault", "none of this is my fault", "everyone else is the problem", "they made me"],
    observation: "Another person's wrong can be real while your own heart and next step still need honest examination."
  },
  {
    id: "revenge",
    label: "revenge",
    patterns: ["revenge", "get them back", "make them pay", "hurt them back", "ruin them"],
    observation: "Revenge may feel like justice, but it can hand your discernment over to anger."
  },
  {
    id: "bitterness",
    label: "bitterness",
    patterns: ["bitter", "bitterness", "resent", "resentment", "i refuse to forgive"],
    observation: "Bitterness can become a second wound: it remembers harm but may stop seeking healing."
  },
  {
    id: "fear_led",
    label: "fear-led decision",
    patterns: ["too afraid", "because i'm scared", "what if everything goes wrong", "fear is stopping me"],
    observation: "Fear may be giving information, but it should not be the only voice allowed to vote."
  },
  {
    id: "isolation",
    label: "isolation",
    patterns: ["handle it alone", "won't tell anyone", "cut everyone off", "no one can help"],
    observation: "Isolation can feel protective, but some burdens become clearer and safer in wise community."
  },
  {
    id: "condemnation",
    label: "confusing conviction with condemnation",
    patterns: ["god is condemning me", "i am condemned", "god rejects me", "disgusting to god"],
    observation: "Christian conviction names sin in order to bring you to mercy; condemnation drives you from mercy."
  },
  {
    id: "passivity",
    label: "confusing patience with passivity",
    patterns: ["do nothing and wait", "just take it", "patience means accepting it"],
    observation: "Patience is not the same as refusing truthful action, help, or protection."
  }
];

const concernSignals = [
  {
    issue: "grief or loss",
    focus: "grief",
    emotions: ["grief", "sadness", "loneliness"],
    themes: ["lament", "memory", "hope without rushing sorrow"],
    responseTypes: ["comfort", "encouragement", "counsel"],
    keywords: ["grief", "loss", "died", "death", "funeral", "mourning", "miss them", "widow", "widower"]
  },
  {
    issue: "fear or anxiety",
    focus: "fear",
    emotions: ["fear", "anxiety", "overwhelm"],
    themes: ["fear named before God", "peace without denial", "embodied trust"],
    responseTypes: ["comfort", "encouragement", "practical", "counsel"],
    keywords: ["anxious", "anxiety", "afraid", "fear", "panic", "worried", "worry", "scared", "overwhelmed"]
  },
  {
    issue: "guilt, sin, or repentance",
    focus: "guilt",
    emotions: ["guilt", "shame", "sorrow"],
    themes: ["confession", "repentance", "grace stronger than shame"],
    responseTypes: ["repentance", "comfort", "counsel", "practical"],
    keywords: ["sin", "sinned", "guilty", "confess", "repent", "lied", "cheated", "temptation", "addiction", "relapse"]
  },
  {
    issue: "forgiveness and resentment",
    focus: "forgiveness",
    emotions: ["hurt", "anger", "resentment"],
    themes: ["mercy with truth", "forgiveness without enabling harm", "repair where wise"],
    responseTypes: ["correction", "boundaries", "counsel"],
    keywords: ["forgive", "forgiveness", "resent", "resentment", "bitter", "bitterness", "apology", "hurt me"]
  },
  {
    issue: "relationship conflict",
    focus: "conflict",
    emotions: ["anger", "hurt", "confusion"],
    themes: ["truthful speech", "humility", "peace where possible"],
    responseTypes: ["counsel", "boundaries", "practical", "correction"],
    keywords: ["marriage", "spouse", "wife", "husband", "family", "parent", "child", "friend", "relationship", "conflict", "argument"]
  },
  {
    issue: "faith, doubt, or theological confusion",
    focus: "doubt",
    emotions: ["confusion", "fear", "longing"],
    themes: ["honest doubt", "Scripture in context", "patient trust"],
    responseTypes: ["comfort", "counsel", "encouragement"],
    keywords: ["doubt", "faith", "believe", "belief", "god feels far", "spiritual", "church", "prayer feels", "theology"]
  },
  {
    issue: "decision or calling",
    focus: "decision",
    emotions: ["uncertainty", "pressure", "fear"],
    themes: ["wisdom", "motive testing", "patient counsel"],
    responseTypes: ["counsel", "practical", "encouragement"],
    keywords: ["decide", "decision", "choice", "discern", "direction", "should i", "calling", "job", "move", "quit"]
  },
  {
    issue: "loneliness or isolation",
    focus: "loneliness",
    emotions: ["loneliness", "discouragement", "sadness"],
    themes: ["community", "one trustworthy person", "burdens shared wisely"],
    responseTypes: ["comfort", "encouragement", "practical", "counsel"],
    keywords: ["lonely", "alone", "isolated", "no one", "cut off", "left out"]
  },
  {
    issue: "harm, safety, or boundaries",
    focus: "harm",
    emotions: ["fear", "confusion", "hurt"],
    themes: ["safety", "truth-telling", "mercy joined to protection"],
    responseTypes: ["warning", "boundaries", "counsel", "practical"],
    keywords: ["harm", "unsafe", "threat", "hit", "hurt", "boundary", "boundaries", "manipulate", "control"]
  }
];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sessionDraft = collectInputs();

  if (!sessionDraft.concern.trim()) {
    return;
  }

  if (containsCrisisLanguage(sessionDraft.concern)) {
    renderCrisisMessage();
    return;
  }

  const understanding = analyzeUnderstanding(sessionDraft.concern, {
    tradition: sessionDraft.tradition,
    selectedVoice: sessionDraft.voice
  });
  const selectedVoice = sessionDraft.voice;
  const discernment = analyzeDiscernment(sessionDraft.concern, selectedVoice, understanding);
  const analysis = analyzeConcern(sessionDraft.concern, understanding, discernment);
  const shepherdContext = {
    tradition: sessionDraft.tradition,
    selectedVoice,
    understanding,
    discernment,
    concernAnalysis: analysis
  };
  const divinePatternAnalysis = analyzeDivinePattern(sessionDraft.concern, {
    selectedVoice,
    shepherdContext,
    understanding,
    discernment
  });
  const ruleOfLife = buildRuleOfLife({
    userMessage: sessionDraft.concern,
    understanding,
    discernment,
    divinePattern: divinePatternAnalysis,
    selectedVoice
  });
  const voiceProfile = voiceProfiles[selectedVoice] || voiceProfiles["Shepherd"];
  const voiceContext = typeof buildVoiceContext === "function"
    ? buildVoiceContext({
        selectedVoice,
        voiceProfile,
        understanding,
        discernment,
        divinePattern: divinePatternAnalysis,
        ruleOfLife
      })
    : null;
  const composedResponse = composeShepherdResponse({
    userMessage: sessionDraft.concern,
    selectedVoice,
    voiceProfile,
    voiceContext,
    understanding,
    discernment,
    divinePattern: divinePatternAnalysis,
    ruleOfLife,
    concernAnalysis: analysis
  });

  logDeveloperDebug({ understanding, discernment, analysis, divinePatternAnalysis, ruleOfLife, voiceContext, composedResponse });
  renderPlan(sessionDraft, composedResponse);
});

clearButton.addEventListener("click", clearSession);

result.addEventListener("click", (event) => {
  if (event.target.id === "print-button") {
    window.print();
  }

  if (event.target.id === "result-clear-button") {
    clearSession();
  }

});

function collectInputs() {
  return {
    concern: document.querySelector("#concern").value.trim(),
    tradition: document.querySelector("#tradition").value,
    voice: document.querySelector("#voice").value
  };
}

function containsCrisisLanguage(text) {
  const normalized = text.toLowerCase();
  return crisisTerms.some((term) => normalized.includes(term));
}

function analyzeConcern(userText, understanding = null, discernment = null) {
  const lower = userText.toLowerCase();
  const matches = concernSignals
    .map((signal) => ({
      ...signal,
      score: signal.keywords.reduce((count, keyword) => count + (lower.includes(keyword) ? 1 : 0), 0)
    }))
    .filter((signal) => signal.score > 0)
    .sort((a, b) => b.score - a.score);

  const primary = matches[0] || {
    issue: "unclear spiritual or pastoral concern",
    focus: "general",
    emotions: ["uncertainty"],
    themes: ["humble discernment", "prayer", "wise counsel"],
    responseTypes: ["counsel", "encouragement", "practical"],
    score: 0
  };

  const theological = theologicalDistortions.filter((distortion) =>
    distortion.patterns.some((pattern) => lower.includes(pattern))
  );
  const cognitive = cognitiveDistortions.filter((distortion) =>
    distortion.patterns.some((pattern) => lower.includes(pattern))
  );
  const emotionHits = detectEmotions(lower, primary, matches);
  const medicalOrMentalHealth = [
    "depression",
    "depressed",
    "panic attack",
    "trauma",
    "ptsd",
    "therapy",
    "therapist",
    "doctor",
    "medication",
    "diagnosed"
  ].some((term) => lower.includes(term));

  const responseTypes = [
    ...primary.responseTypes,
    ...theological.flatMap((item) => item.responseTypes),
    ...(understanding ? mapStrategiesToResponseTypes(understanding.pastoralStrategy) : []),
    ...(discernment ? mapDiscernmentPrioritiesToResponseTypes(discernment) : []),
    ...(cognitive.some((item) => ["all_or_nothing", "fear_led"].includes(item.id)) ? ["correction"] : []),
    ...(medicalOrMentalHealth ? ["counsel", "practical"] : [])
  ];

  const detectedPatternCount = primary.score + theological.length + cognitive.length + (medicalOrMentalHealth ? 1 : 0);
  const weightedPatternScore = primary.score + theological.length * 2 + cognitive.length + (medicalOrMentalHealth ? 1 : 0);

  return {
    likelyEmotions: unique([
      ...emotionHits,
      ...(understanding ? understanding.emotionsDetected.primary : []),
      ...(understanding ? understanding.emotionsDetected.secondary : [])
    ]).slice(0, 5),
    possibleSpiritualIssue: primary.issue,
    possibleCognitiveDistortions: cognitive,
    possibleTheologicalDistortions: theological,
    responseTypes: unique(responseTypes).slice(0, 6),
    confidence: getConfidence(weightedPatternScore, detectedPatternCount, matches.length),
    focus: primary.focus,
    themes: unique([
      ...primary.themes,
      ...matches.flatMap((item) => item.themes),
      ...(understanding ? understanding.biblicalThemes : [])
    ]).slice(0, 6),
    overlaps: matches.slice(1, 3).map((item) => item.issue),
    medicalOrMentalHealth,
    hasHarmLanguage: primary.focus === "harm" || lower.includes("abuse") || lower.includes("unsafe")
  };
}

function mapDiscernmentPrioritiesToResponseTypes(discernment = {}) {
  const priorities = (discernment.pastoralPriority || []).join(" ").toLowerCase();
  const mapped = [];

  if (priorities.includes("comfort")) {
    mapped.push("comfort");
  }
  if (priorities.includes("correction")) {
    mapped.push("correction");
  }
  if (priorities.includes("encouragement")) {
    mapped.push("encouragement");
  }
  if (priorities.includes("warning")) {
    mapped.push("warning");
  }
  if (priorities.includes("teaching")) {
    mapped.push("counsel");
  }
  if (priorities.includes("repentance")) {
    mapped.push("repentance");
  }
  if (priorities.includes("practical")) {
    mapped.push("practical");
  }
  if (priorities.includes("human support")) {
    mapped.push("counsel", "practical");
  }

  return mapped;
}

function mapStrategiesToResponseTypes(pastoralStrategy = {}) {
  const strategies = [pastoralStrategy.primary, ...(pastoralStrategy.supporting || [])].join(" ").toLowerCase();
  const mapped = [];

  if (strategies.includes("comfort")) {
    mapped.push("comfort");
  }
  if (strategies.includes("correction")) {
    mapped.push("correction");
  }
  if (strategies.includes("warning")) {
    mapped.push("warning");
  }
  if (strategies.includes("encouragement")) {
    mapped.push("encouragement");
  }
  if (strategies.includes("repentance")) {
    mapped.push("repentance");
  }
  if (strategies.includes("practical")) {
    mapped.push("practical");
  }
  if (strategies.includes("referral")) {
    mapped.push("counsel", "practical");
  }
  if (strategies.includes("teaching") || strategies.includes("reflection")) {
    mapped.push("counsel");
  }

  return mapped;
}

function detectEmotions(lower, primary, matches) {
  const emotionLexicon = [
    ["fear", ["afraid", "fear", "scared", "panic", "worried", "anxious"]],
    ["grief", ["grief", "sad", "loss", "mourning", "miss them"]],
    ["anger", ["angry", "furious", "resent", "bitter", "rage"]],
    ["shame", ["ashamed", "shame", "worthless", "disgusting", "failure"]],
    ["guilt", ["guilty", "confess", "repent", "sinned"]],
    ["loneliness", ["alone", "lonely", "isolated", "left out"]],
    ["confusion", ["confused", "unclear", "don't know", "what should"]]
  ];
  const hits = emotionLexicon
    .filter(([, patterns]) => patterns.some((pattern) => lower.includes(pattern)))
    .map(([emotion]) => emotion);

  return [...hits, ...primary.emotions, ...matches.flatMap((item) => item.emotions)];
}

function getConfidence(weightedPatternScore, detectedPatternCount, matchCount) {
  if (weightedPatternScore >= 5 || (detectedPatternCount >= 4 && matchCount > 1)) {
    return {
      level: "High",
      note: "Shepherd sees several clear textual patterns, though it still only has the words provided here."
    };
  }
  if (weightedPatternScore >= 2 || detectedPatternCount >= 2) {
    return {
      level: "Moderate",
      note: "Shepherd sees a plausible pattern, but there may be mixed motives, missing history, or context it cannot know."
    };
  }
  return {
    level: "Low",
    note: "Shepherd may be missing important context; bring this to a trusted person who can listen more fully."
  };
}

function logDeveloperDebug(payload) {
  if (!developerDebugEnabled) {
    return;
  }

  console.group("Shepherd developer debug");
  console.log("Understanding object", payload.understanding);
  console.log("Discernment object", payload.discernment);
  console.log("Discernment / correction analysis", payload.analysis);
  console.log("Divine Pattern analysis", payload.divinePatternAnalysis);
  console.log("Rule of Life object", payload.ruleOfLife);
  console.log("Composed response structure", payload.composedResponse);
  console.groupEnd();
}

function renderPlan(data, composedResponse) {
  const voice = voiceProfiles[data.voice] || voiceProfiles["Shepherd"];
  const isPrimaryShepherd = data.voice === "Shepherd";

  form.classList.add("hidden");
  result.className = "result";
  result.innerHTML = `
    <div class="result-header">
      <h2>A pastoral response</h2>
      <p>This is meant to help you pray, think clearly, and know what faithful next step to take with real human support.</p>
      <p class="fine-print">${escapeHtml(isPrimaryShepherd ? "Voice" : "Voice, as a perspective lens")}: ${escapeHtml(data.voice)}.</p>
      <div class="result-actions">
        <button type="button" id="print-button" class="primary">Print / Save as PDF</button>
        <button type="button" id="result-clear-button" class="secondary">Clear Everything</button>
      </div>
    </div>
    ${composedResponse.highRiskNotice ? highRiskNotice(composedResponse.highRiskNotice) : ""}
    ${conversationSections(composedResponse.sections)}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function highRiskNotice(message) {
  return `
    <section class="high-risk-notice" role="alert" aria-label="Safety notice">
      <h3>Before reading further</h3>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

function conversationSections(sections) {
  return sections.map((item) => {
    const heading = item.heading ? `<h3>${escapeHtml(item.heading)}</h3>` : "";
    const content = item.items ? list(item.items) : paragraph(item.content);

    return `
      <section class="result-section conversational-section">
        ${heading}
        ${content}
      </section>
    `;
  }).join("");
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function paragraph(text) {
  return `<p>${escapeHtml(text)}</p>`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clearSession() {
  sessionDraft = null;
  form.reset();
  result.classList.add("hidden");
  result.innerHTML = "";
  form.classList.remove("hidden");
}

function renderCrisisMessage() {
  form.classList.add("hidden");
  result.className = "result crisis";
  result.innerHTML = `
    <div class="result-header">
      <h2>This needs immediate human support</h2>
      <p>Shepherd cannot handle emergencies or crisis situations, and it should not be used as a substitute for urgent help.</p>
      <div class="result-actions">
        <button type="button" id="result-clear-button" class="secondary">Clear Everything</button>
      </div>
    </div>
    ${highRiskNotice("Because this may involve immediate danger, self-harm, abuse, violence, or severe crisis, do not use Shepherd as the next step. If there is immediate danger, call emergency services now. In the United States, call or text 988 for suicide or crisis support. Contact a safe person, pastor or priest, counselor, doctor, local crisis line, or appropriate professional support now.")}
    ${conversationSections([
      {
        heading: "Please reach out now",
        content: "If there is immediate danger, call emergency services right now. In the United States, call or text 988 for the Suicide & Crisis Lifeline if self-harm, suicide, or severe crisis may be involved. Contact a trusted person, pastor or priest, counselor, doctor, local crisis line, or appropriate professional. If abuse or violence is involved, seek safety first and contact local emergency or abuse-support services."
      },
      {
        heading: "A grounding step",
        content: "Move near another safe person if possible, reduce access to anything that could be used for harm, and say plainly: I need help right now."
      }
    ])}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}
