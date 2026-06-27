const form = document.querySelector("#reflection-form");
const result = document.querySelector("#result");
const clearButton = document.querySelector("#clear-button");
const { analyzeUnderstanding } = window.ShepherdUnderstandingEngine;
const { analyzeDivinePattern } = window.ShepherdDivinePatternEngine;

// Privacy model:
// Shepherd has no backend, database, analytics, storage, or AI API.
// User text lives only in browser memory while this page is open.
let sessionDraft = null;
let lastResponse = null;
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

const traditionPerspectives = {
  "General Christian": "A broad Christian reading should hold together Scripture, prayer, confession where needed, mercy, truth, and wise counsel in community.",
  "Baptist": "A Baptist reading often emphasizes Scripture, personal repentance and faith, prayer, discipleship, local church accountability, and voluntary obedience.",
  "Methodist/Wesleyan": "A Methodist/Wesleyan reading often emphasizes prevenient and sanctifying grace, practical holiness, small-group support, and love of God and neighbor.",
  "Reformed": "A Reformed reading often emphasizes God's covenant faithfulness, repentance and faith, sober self-examination, ordinary means of grace, and hope grounded in Christ.",
  "Lutheran": "A Lutheran reading often distinguishes law and gospel: God's Word exposes sin and false refuge, then gives the promise of mercy in Christ.",
  "Anglican": "An Anglican reading often emphasizes Scripture, ordered prayer, confession and absolution, sacramental life, pastoral counsel, and steady formation through common worship.",
  "Roman Catholic": "A Roman Catholic reading often emphasizes formed conscience, sacramental grace, confession where needed, spiritual direction, works of mercy, and the Church's moral wisdom.",
  "Eastern Orthodox": "An Eastern Orthodox reading often frames the struggle as healing and return to communion with Christ through repentance, prayer, spiritual counsel, and life in the Church.",
  "Pentecostal/Charismatic": "A Pentecostal/Charismatic reading often emphasizes Scripture, prayer, dependence on the Holy Spirit, discernment in community, worship, and hopeful obedience."
};

const voiceProfiles = {
  "Shepherd": {
    emphasis: "truth, mercy, Scripture in context, wise human counsel, and one faithful next step",
    comfort: "Shepherd holds this first with the mercy of Christ, without rushing past the pain or letting the pain become the whole story.",
    challenge: "Shepherd should test the strongest conclusion by Scripture, prayer, wise counsel, and the fruit it is likely to bear.",
    compare: "Shepherd keeps the main response centered on truth, mercy, Scripture in context, wise human counsel, and one faithful next step."
  },
  "Paul": {
    emphasis: "grace, union with Christ, endurance, correction, and community",
    comfort: "Your pain should be brought under the mercy of Christ, not treated as proof that grace has failed.",
    challenge: "Test the conclusion by the gospel: does it lead toward faith working through love, or toward fear, shame, and isolation?",
    compare: "Paul might emphasize grace in Christ, endurance under trial, honest correction, and the need to carry this with the body of believers."
  },
  "Augustine": {
    emphasis: "disordered loves, confession, restlessness, desire, and return to God",
    comfort: "A restless heart is not a rejected heart; it may be a heart being summoned back to God.",
    challenge: "Ask what love is ruling the moment: love of God, love of control, love of approval, or love of being vindicated.",
    compare: "Augustine might ask what desire has become disordered and how confession could turn restlessness back toward God."
  },
  "C.S. Lewis": {
    emphasis: "imagination, reason, pride, humility, moral clarity, and honest language",
    comfort: "Do not let the loudest image in your mind become your whole theology of God.",
    challenge: "Reason and humility both matter here: the feeling may be real without being a reliable judge of ultimate truth.",
    compare: "C.S. Lewis might press for moral clarity, humble imagination, and a refusal to let pride or fear dress itself up as wisdom."
  },
  "Bonhoeffer": {
    emphasis: "costly obedience, community, discipleship, truthful action, and responsibility",
    comfort: "Christ does not call you to vague heroics; he calls you to the next concrete act of faithful obedience in community.",
    challenge: "Grace is not permission to avoid costly truth. Discernment should become responsible action, not endless inward circling.",
    compare: "Bonhoeffer might warn against cheap grace, private isolation, and delay when discipleship requires concrete action."
  },
  "Spurgeon": {
    emphasis: "comfort, hope, tenderness, gospel assurance, and weary-soul encouragement",
    comfort: "A bruised reed is not thrown away by Christ. Bring the wound into his mercy without pretending it is smaller than it is.",
    challenge: "Do not let sorrow preach a sermon that Christ himself would not preach over you.",
    compare: "Spurgeon might give tender gospel assurance, especially where shame, fear, or grief is trying to drown out hope."
  },
  "Thoughtful pastor": {
    emphasis: "balanced pastoral care, Scripture, emotional honesty, wise caution, and next faithful steps",
    comfort: "This should be held with both tenderness and truth; you do not need to rush to a final verdict tonight.",
    challenge: "A faithful response may need both comfort and correction, depending on what is true and what is merely loud.",
    compare: "A thoughtful pastor might balance comfort, correction, Scripture, practical support, and a concrete human next step."
  },
  "Trusted Christian friend": {
    emphasis: "warm honesty, companionship, practical help, courage, and faithful candor",
    comfort: "You do not have to carry this alone, and you do not have to make pain sound prettier before asking for help.",
    challenge: "A faithful friend would believe your pain matters while still refusing to let a false conclusion rule you.",
    compare: "A trusted Christian friend might speak warmly and plainly, helping you take one honest step instead of spiraling alone."
  }
};

const responseTypeLabels = {
  comfort: "comfort",
  correction: "correction",
  warning: "warning",
  encouragement: "encouragement",
  repentance: "repentance",
  boundaries: "boundaries",
  counsel: "wise counsel",
  practical: "practical next steps"
};

const scriptureByFocus = {
  grief: [
    ["Psalm 13", "The psalm gives faithful language for sorrow, protest, waiting, and renewed trust."],
    ["John 11:32-36", "Jesus meets grief with presence and tears, showing that mourning is not unbelief."]
  ],
  fear: [
    ["Psalm 56:3-4", "The psalm names fear honestly and turns toward trust without pretending fear is simple."],
    ["1 Peter 5:6-7", "Peter joins humility, God's care, and casting anxieties on the Lord within a suffering community."]
  ],
  guilt: [
    ["1 John 1:8-9", "John holds together honest confession and confidence in God's faithful forgiveness."],
    ["Psalm 32:3-5", "The psalm connects hidden guilt with heaviness and confession with mercy."]
  ],
  forgiveness: [
    ["Ephesians 4:31-32", "Paul roots Christian forgiveness in God's mercy while the wider passage also calls for truthful renewed relationships."],
    ["Romans 12:18", "Paul says to live peaceably so far as it depends on you, which recognizes real limits."]
  ],
  conflict: [
    ["Romans 12:9-18", "Christian love is sincere, patient, honorable, and peace-seeking without pretending evil is good."],
    ["James 1:19-20", "James calls believers to be quick to hear, slow to speak, and slow to anger."]
  ],
  doubt: [
    ["Mark 9:24", "A desperate father brings both belief and unbelief to Jesus."],
    ["John 20:24-29", "Thomas is met by the risen Christ with evidence and invitation, not mockery."]
  ],
  decision: [
    ["James 1:5", "James encourages believers to ask God for wisdom amid testing, with humility and trust."],
    ["Proverbs 3:5-6", "The proverb commends whole-life trust rather than isolated proof-text decision making."]
  ],
  loneliness: [
    ["Hebrews 10:24-25", "The church is called to stir one another up to love and good works, not to drift into isolation."],
    ["Galatians 6:2", "Paul calls believers to bear one another's burdens as part of life in Christ."]
  ],
  harm: [
    ["Proverbs 31:8-9", "Wisdom calls God's people to speak for those who need protection and justice."],
    ["Micah 6:8", "The prophet joins humility before God with doing justice and loving mercy."]
  ],
  general: [
    ["Matthew 11:28-30", "Jesus invites the weary to come to him and learn his gentle yoke."],
    ["Philippians 4:6-7", "Paul invites anxious believers to bring requests to God with thanksgiving and receive God's guarding peace."]
  ]
};

const theologicalDistortions = [
  {
    id: "god_hates_me",
    patterns: ["god hates me", "god must hate me"],
    correction: "Shepherd should gently reject the conclusion that God hates you. Pain, discipline, failure, or silence may need lament and counsel, but they are not proof that God's love has vanished.",
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
    correction: "Shepherd should gently reject the conclusion that you are worthless or that God is weary of you. Shame may feel authoritative, but it is not the voice that names your identity before God.",
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
    lastResponse = null;
    renderCrisisMessage();
    return;
  }

  const understanding = analyzeUnderstanding(sessionDraft.concern, {
    tradition: sessionDraft.tradition,
    selectedVoice: sessionDraft.voice
  });
  const analysis = analyzeConcern(sessionDraft.concern, understanding);
  const selectedVoice = sessionDraft.voice;
  const shepherdContext = {
    tradition: sessionDraft.tradition,
    selectedVoice,
    understanding,
    concernAnalysis: analysis
  };
  const divinePatternAnalysis = analyzeDivinePattern(sessionDraft.concern, {
    selectedVoice,
    shepherdContext,
    understanding
  });

  logDeveloperDebug({ understanding, analysis, divinePatternAnalysis });
  lastResponse = { data: sessionDraft, understanding, analysis, divinePatternAnalysis };
  renderPlan(sessionDraft, understanding, analysis, divinePatternAnalysis);
});

clearButton.addEventListener("click", clearSession);

result.addEventListener("click", (event) => {
  if (event.target.id === "print-button") {
    window.print();
  }

  if (event.target.id === "result-clear-button") {
    clearSession();
  }

  if (event.target.id === "compare-button" && lastResponse) {
    renderVoiceComparison(lastResponse.data, lastResponse.understanding, lastResponse.analysis);
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

function analyzeConcern(userText, understanding = null) {
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
  console.log("Discernment / correction analysis", payload.analysis);
  console.log("Divine Pattern analysis", payload.divinePatternAnalysis);
  console.groupEnd();
}

function renderPlan(data, understanding, analysis, divinePatternAnalysis) {
  const voice = voiceProfiles[data.voice] || voiceProfiles["Shepherd"];
  const scriptures = buildScriptureSelection(analysis);
  const nextStep = buildHumanNextStep(analysis);
  const isPrimaryShepherd = data.voice === "Shepherd";

  form.classList.add("hidden");
  result.className = "result";
  result.innerHTML = `
    <div class="result-header">
      <h2>Your discernment draft</h2>
      <p>This is a static, in-browser Christian reflection. It is meant to prepare you for prayer, Scripture, and human care.</p>
      <p class="fine-print">${escapeHtml(isPrimaryShepherd ? "Primary guide" : "Primary guide: Shepherd. Perspective lens")}: ${escapeHtml(data.voice)}. Emphasis: ${escapeHtml(voice.emphasis)}.</p>
      <div class="result-actions">
        <button type="button" id="print-button" class="primary">Print / Save as PDF</button>
        <button type="button" id="compare-button" class="secondary">Additional Faithful Perspectives</button>
        <button type="button" id="result-clear-button" class="secondary">Clear Everything</button>
      </div>
    </div>
    ${section("Pastoral Reading", "Pastoral wisdom", buildPastoralReading(data, understanding, analysis, voice))}
    ${section("Divine Pattern Layer", "Pastoral pattern summary", buildDivinePatternLayer(divinePatternAnalysis))}
    ${analysis.possibleTheologicalDistortions.length ? section("Gentle Correction", "Scripture and pastoral wisdom", correctionBlock(analysis, voice)) : ""}
    ${section("Scripture with Context", "Scripture", scriptureList(scriptures))}
    ${section("Things You May Not Have Considered", "Discernment considerations", list(buildConsiderations(analysis, understanding)))}
    ${section("Christian Tradition Perspective", "Christian tradition summary", `<p>${escapeHtml(traditionPerspectives[data.tradition])}</p>`)}
    ${section("Suggested Prayer", "Pastoral wisdom", `<p>${escapeHtml(buildPrayer(data, understanding, analysis, voice))}</p>`)}
    ${section("Recommended Human Next Step", "Caution / safety boundary", `<p>${escapeHtml(nextStep)}</p>`)}
    ${section("Boundaries and Cautions", "Caution / safety boundary", list(buildBoundaries(analysis)))}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildDivinePatternLayer(divinePatternAnalysis) {
  if (!divinePatternAnalysis) {
    return "<p>Shepherd does not have enough pattern context to add this layer yet.</p>";
  }

  const summary = formatDivinePatternSummary(divinePatternAnalysis.summaryForShepherd);
  const scriptureAnchor = divinePatternAnalysis.scriptureAnchor || {};
  const pastoralRisk = divinePatternAnalysis.pastoralRisk || {};
  const riskLevel = String(pastoralRisk.level || "low").toLowerCase();
  const anchorText = scriptureAnchor.reference
    ? `${scriptureAnchor.reference}: ${scriptureAnchor.rationale || "Hold this passage in context with prayer and wise counsel."}`
    : "Hold Scripture in context with prayer and wise counsel.";
  const cautionText = riskLevel === "high"
    ? "A caution to hold carefully is that this may need trusted human support before it needs more private reflection. If danger, despair, coercion, or self-harm may be involved, contact emergency help, a crisis line, a pastor or priest, counselor, doctor, or another safe person now."
    : `A caution to hold carefully is this: ${divinePatternAnalysis.guardrail}`;

  return `
    <p>One pattern Shepherd notices is ${escapeHtml(summary)}.</p>
    <p>A helpful theological anchor may be ${escapeHtml(anchorText)}</p>
    <p>${escapeHtml(cautionText)}</p>
  `;
}

function formatDivinePatternSummary(summaryForShepherd) {
  const summary = String(summaryForShepherd || "")
    .split(".")
    .map((sentence) => sentence.trim())
    .filter((sentence) =>
      sentence &&
      !sentence.toLowerCase().startsWith("confidence:") &&
      !sentence.toLowerCase().startsWith("pastoral risk:")
    );
  const patternSentence = summary.find((sentence) => sentence.toLowerCase().startsWith("possible divine pattern:"));

  if (patternSentence) {
    return patternSentence
      .replace(/^possible divine pattern:\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  return "a call to hold truth, mercy, Scripture, and wise human counsel together";
}

function buildPastoralReading(data, understanding, analysis, voice) {
  const responseText = analysis.responseTypes.map((type) => responseTypeLabels[type] || type).join(", ");
  const emotionText = analysis.likelyEmotions.length
    ? `Shepherd hears ${joinHumanList(analysis.likelyEmotions)} in what you wrote.`
    : "Shepherd cannot name the emotions yet from the wording alone.";
  const overlapText = analysis.overlaps.length
    ? `There may also be overlap with ${joinHumanList(analysis.overlaps)}.`
    : "No strong secondary issue was clear from the wording.";
  const meaningText = understanding.userMeaning.summary;
  const needText = understanding.deeperNeeds.length
    ? `Beneath the surface, this may call for ${joinHumanList(understanding.deeperNeeds.slice(0, 4))}.`
    : "Beneath the surface, this needs prayer, humility, and wise counsel.";
  const strategyText = [
    understanding.pastoralStrategy.primary,
    ...understanding.pastoralStrategy.supporting
  ].filter(Boolean).join(", ");

  return `
    <p>${escapeHtml(meaningText)} ${escapeHtml(emotionText)} ${escapeHtml(needText)}</p>
    <p>The likely spiritual or pastoral issue is ${escapeHtml(analysis.possibleSpiritualIssue)}. ${escapeHtml(overlapText)}</p>
    <p>${escapeHtml(voiceProfiles["Shepherd"].comfort)} ${escapeHtml(voiceProfiles["Shepherd"].challenge)}</p>
    ${data.voice === "Shepherd" ? "" : `<p>${escapeHtml(buildPerspectiveLine(data.voice, voice))}</p>`}
    <p>The response seems to call for ${escapeHtml(responseText)} rather than simple affirmation. In pastoral strategy terms: ${escapeHtml(strategyText)}. Shepherd should help you test what is true, receive what is merciful, and take one faithful human next step.</p>
  `;
}

function correctionBlock(analysis, voice) {
  const items = analysis.possibleTheologicalDistortions.map((distortion) => `
    <div class="reasoning-item">
      <strong>${escapeHtml(labelFromId(distortion.id))}</strong>
      <span>${escapeHtml(distortion.correction)} ${escapeHtml(voice.challenge)}</span>
    </div>
  `).join("");
  return `<div class="reasoning-grid">${items}</div>`;
}

function buildPerspectiveLine(voiceName, voice) {
  const openings = {
    "C.S. Lewis": "A C.S. Lewis-style perspective might notice",
    "Thoughtful pastor": "A thoughtful pastor perspective might notice",
    "Trusted Christian friend": "A trusted Christian friend perspective might notice"
  };
  const opening = openings[voiceName] || `Seen through the perspective of ${voiceName}, Shepherd might notice`;

  return `${opening}: ${voice.comfort} ${voice.challenge}`;
}

function buildScriptureSelection(analysis) {
  const theologicalScriptures = analysis.possibleTheologicalDistortions.map((item) => item.scripture);
  const base = scriptureByFocus[analysis.focus] || scriptureByFocus.general;
  return [...theologicalScriptures, ...base].slice(0, 3);
}

function buildConsiderations(analysis, understanding = null) {
  const considerations = [];

  if (understanding) {
    understanding.assumptionsDetected.forEach((assumption) => {
      considerations.push(`${assumption.statement} ${assumption.pastoralNote}`);
    });
  }

  analysis.possibleTheologicalDistortions.forEach((distortion) => {
    considerations.push(distortion.correction);
  });

  analysis.possibleCognitiveDistortions.forEach((distortion) => {
    considerations.push(distortion.observation);
  });

  if (analysis.responseTypes.includes("boundaries")) {
    considerations.push("Forgiveness and boundaries are not enemies. A Christian response can pursue mercy while refusing to enable harm.");
  }

  if (analysis.responseTypes.includes("repentance")) {
    considerations.push("Repentance is not self-punishment. It is truthful return to God, repair where possible, and receiving mercy without pretending sin is harmless.");
  }

  if (analysis.responseTypes.includes("counsel")) {
    considerations.push("This may become clearer when spoken aloud to a mature Christian, pastor, priest, counselor, or trusted friend who can ask careful questions.");
  }

  if (analysis.themes.length) {
    considerations.push(`The Scripture tension may be between ${analysis.themes.slice(0, 2).join(" and ")}; both sides deserve attention.`);
  }

  const focusConsiderations = {
    grief: [
      "Grief may need faithful lament before it needs a plan; moving too quickly to explanation can leave sorrow unheard.",
      "Hope in Christ does not require pretending the loss is small."
    ],
    fear: [
      "Fear may be naming a real concern, but it is not wise enough to become the only counselor.",
      "Peace may begin with one embodied step of trust, not with solving every possible outcome."
    ],
    guilt: [
      "The difference between conviction and condemnation matters here: conviction leads toward confession and life; condemnation leads toward hiding.",
      "Grace does not make repair unnecessary, but it keeps repair from becoming self-punishment."
    ],
    forgiveness: [
      "Reconciliation may require repentance, truth, time, and rebuilt trust; forgiveness alone does not instantly restore safety.",
      "Mercy can be sincere while boundaries remain firm."
    ],
    conflict: [
      "The timing and manner of truth-telling may matter as much as the truth being spoken.",
      "Peace is not the same as avoiding the conversation; it is truth pursued without contempt."
    ],
    doubt: [
      "Confusion may need patient teaching and prayer rather than shame or rushed certainty.",
      "A hard question can be brought into Christian community without treating doubt as rebellion."
    ],
    decision: [
      "A decision may look spiritual while still being driven by fear, pressure, pride, or avoidance.",
      "Wise discernment usually compares likely fruit, motives, counsel, and Scripture rather than waiting for one perfect feeling."
    ],
    loneliness: [
      "Isolation can make painful conclusions sound more certain than they are.",
      "The next faithful step may be one honest conversation, not a complete life overhaul."
    ],
    harm: [
      "Spiritual language should never be used to keep danger hidden or to protect someone who is causing harm.",
      "Safety and truth-telling can be acts of faithfulness, not failures of love."
    ],
    general: [
      "The concern may need more context before a strong conclusion is wise.",
      "A humble next step may be to name the burden clearly to one trustworthy person."
    ]
  };

  const fallbackConsiderations = focusConsiderations[analysis.focus] || focusConsiderations.general;
  fallbackConsiderations.forEach((item) => considerations.push(item));

  if (!considerations.length) {
    considerations.push("The wording is open-ended, so the wisest posture is humility: name what you know, admit what you do not, and seek counsel before acting.");
  }

  return unique(considerations).slice(0, 5);
}

function buildPrayer(data, understanding, analysis, voice) {
  const lensRequest = data.voice === "Shepherd"
    ? "Give me truth and mercy"
    : `Let this ${data.voice} perspective serve truth and mercy`;
  const need = understanding.deeperNeeds[0] || analysis.possibleSpiritualIssue;

  return `Lord Jesus, meet me with truth and mercy. Help me name ${analysis.possibleSpiritualIssue} without panic or self-deception, and give me ${need}. ${lensRequest}, Scripture held in context, and courage to seek wise human help. Amen.`;
}

function buildHumanNextStep(analysis) {
  if (analysis.hasHarmLanguage) {
    return "If anyone is unsafe, seek immediate human help from emergency services, a safe person, a pastor or priest, counselor, doctor, advocate, or local support service. Do not let spiritual language keep harm hidden.";
  }
  if (analysis.medicalOrMentalHealth) {
    return "Bring this to a doctor, counselor, or qualified mental health professional, and also ask a trusted pastor, priest, or mature Christian to support you spiritually.";
  }
  if (analysis.responseTypes.includes("repentance")) {
    return "Make a concrete confession to God, consider confession or pastoral counsel in your tradition, and identify one repair or accountability step that does not depend on self-hatred.";
  }
  if (analysis.focus === "grief") {
    return "Tell one pastor, priest, mature Christian friend, counselor, or grief-support person what you are carrying, and ask them to sit with you without rushing the sorrow.";
  }
  if (analysis.focus === "conflict" || analysis.focus === "forgiveness") {
    return "Before a major conversation, ask a wise mediator, pastor, priest, counselor, or mature Christian to help you separate truth, repentance, forgiveness, and boundaries.";
  }
  if (analysis.focus === "doubt") {
    return "Bring the theological confusion to a pastor, priest, Bible study leader, spiritual director, or mature Christian who can read Scripture with you in context.";
  }
  if (analysis.focus === "loneliness") {
    return "Choose one trusted person this week and say plainly that you should not carry this alone. Keep the first step small but real.";
  }
  if (analysis.focus === "decision") {
    return "Write down the real options, likely fruit, fears, and motives, then test them with a pastor, mentor, counselor, or wise Christian friend before acting.";
  }
  return "Share a brief, honest version of this with one trusted pastor, priest, mature Christian, counselor, doctor, mentor, or wise friend this week.";
}

function renderVoiceComparison(data, understanding, analysis) {
  const selected = ["Paul", "Augustine", "Bonhoeffer"].includes(data.voice)
    ? ["Spurgeon", "C.S. Lewis", "Thoughtful pastor"]
    : ["Paul", "Augustine", "Bonhoeffer"];
  const comparisons = selected.map((voiceName) => {
    const voice = voiceProfiles[voiceName];
    return `
      <div class="compare-card">
        <h4>${escapeHtml(voiceName)}</h4>
        <p>${escapeHtml(voice.compare)}</p>
      </div>
    `;
  }).join("");

  const existing = document.querySelector("#voice-comparison");
  if (existing) {
    existing.remove();
  }

  result.insertAdjacentHTML("beforeend", section(
    "Additional Faithful Perspectives",
    "Discernment training",
    `
      <div id="voice-comparison">
        <div class="compare-grid">${comparisons}</div>
        <p><strong>Where they agree:</strong> ${escapeHtml(buildAgreementLine(analysis))}</p>
        <p><strong>What Shepherd understood first:</strong> ${escapeHtml(understanding.userMeaning.summary)}</p>
        <p><strong>Where they differ:</strong> They would place different weight on assurance, desire, moral clarity, costly obedience, tenderness, or practical counsel.</p>
      </div>
    `
  ));
}

function buildAgreementLine(analysis) {
  if (analysis.possibleTheologicalDistortions.length) {
    return "they would not affirm a false conclusion about God, grace, forgiveness, or harm simply because it feels powerful.";
  }
  if (analysis.responseTypes.includes("boundaries")) {
    return "they would agree that love must be truthful and that mercy does not require enabling harm.";
  }
  if (analysis.responseTypes.includes("repentance")) {
    return "they would agree that confession should lead toward grace-filled obedience, not despair.";
  }
  return "they would agree that discernment belongs in Scripture, prayer, humility, and Christian community.";
}

function buildBoundaries(analysis) {
  const boundaries = [
    "Shepherd is a preparation and reflection tool, not clergy, counseling, medical care, emergency help, or final spiritual authority.",
    "This is static rule-based discernment from limited text. It is not a clinical diagnosis, prophecy, or private revelation.",
    "User input is not stored, transmitted, analyzed by an AI API, or saved to browser storage.",
    "If safety, abuse, self-harm, severe depression, medical concerns, violence, or legal danger may be involved, seek appropriate human help immediately."
  ];

  return boundaries;
}

function section(title, evidence, content) {
  return `
    <section class="result-section">
      <div class="section-heading">
        <h3>${title}</h3>
        <span class="evidence-label">${evidence}</span>
      </div>
      ${content}
    </section>
  `;
}

function scriptureList(items) {
  return `<div class="scripture-list">${items.map(([ref, context]) => `
    <div class="scripture-item">
      <h3>${escapeHtml(ref)}</h3>
      <p>${escapeHtml(context)}</p>
    </div>
  `).join("")}</div>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function labelFromId(id) {
  return id.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
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
  lastResponse = null;
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
    ${section("Please reach out now", "Caution / safety boundary", `
      <p>If there is immediate danger, call emergency services right now. In the United States, call or text 988 for the Suicide & Crisis Lifeline if self-harm, suicide, or severe crisis may be involved.</p>
      <p>Contact a trusted person, pastor or priest, counselor, doctor, local crisis line, or appropriate professional. If abuse or violence is involved, seek safety first and contact local emergency or abuse-support services.</p>
    `)}
    ${section("A grounding step", "Pastoral wisdom", `
      <p>Move near another safe person if possible, reduce access to anything that could be used for harm, and say plainly: "I need help right now."</p>
    `)}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}
