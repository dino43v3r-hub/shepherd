const form = document.querySelector("#reflection-form");
const result = document.querySelector("#result");
const clearButton = document.querySelector("#clear-button");

// Privacy model:
// Shepherd has no backend, no database, no analytics, no localStorage/sessionStorage, and no AI API.
// User text lives only in browser memory while this page is open; refreshing the page clears it.
// Print/export uses the browser's print dialog only and is fully user-controlled.
let sessionDraft = null;

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

const scriptureByFocus = {
  "Prayer": [
    ["Philippians 4:6-7", "Paul invites anxious believers to bring requests to God with thanksgiving, receiving God's guarding peace rather than treating prayer as a formula."],
    ["Matthew 6:9-13", "Jesus teaches prayer as worship, dependence, confession, and daily trust in the Father."]
  ],
  "Forgiveness": [
    ["Ephesians 4:31-32", "Paul roots Christian forgiveness in God's mercy, while the wider passage also calls for truthful, wise, renewed relationships."],
    ["Matthew 18:21-35", "Jesus presses forgiveness as a kingdom practice, not a denial of harm or a substitute for justice."]
  ],
  "Grief": [
    ["Psalm 13", "The psalm gives faithful language for sorrow, protest, waiting, and renewed trust."],
    ["John 11:32-36", "Jesus meets grief with presence and tears before bringing hope, showing that mourning is not unbelief."]
  ],
  "Decision-making": [
    ["James 1:5", "James encourages believers to ask God for wisdom amid testing, with humility and trust."],
    ["Proverbs 3:5-6", "The proverb commends whole-life trust in God rather than isolated proof-text decision making."]
  ],
  "Marriage/family": [
    ["Colossians 3:12-15", "Paul frames Christian household life with compassion, humility, patience, forgiveness, and peace."],
    ["Romans 12:9-18", "The passage calls believers to sincere love, honor, patience, hospitality, and peace where possible."]
  ],
  "Anxiety/fear": [
    ["Psalm 56:3-4", "The psalm names fear honestly and turns toward trust without pretending fear is simple."],
    ["1 Peter 5:6-7", "Peter connects humility, God's care, and casting anxieties on the Lord within a suffering community."]
  ],
  "Faith/doubt": [
    ["Mark 9:24", "A desperate father brings both belief and unbelief to Jesus, which gives honest doubters a faithful prayer."],
    ["John 20:24-29", "Thomas is met by the risen Christ with evidence and invitation, not mockery."]
  ],
  "Habit/sin struggle": [
    ["Romans 6:11-14", "Paul calls believers to live from union with Christ, resisting sin's rule through grace."],
    ["1 John 1:8-9", "John holds together honesty about sin and confidence in God's faithful forgiveness."]
  ]
};

const correctionScripture = {
  blame: [
    ["Matthew 7:3-5", "Jesus warns against seeing another person's fault while refusing self-examination. The passage does not excuse harm; it calls for humility before judgment."]
  ],
  revenge: [
    ["Romans 12:17-21", "Paul forbids revenge and calls believers to overcome evil with good, while leaving justice in God's hands."]
  ],
  contempt: [
    ["James 3:8-10", "James warns that the same tongue should not bless God and curse people made in God's likeness."]
  ],
  despair: [
    ["Psalm 42:5", "The psalmist speaks to a downcast soul with honest sorrow and renewed hope in God."]
  ],
  false_view_of_god: [
    ["Romans 8:38-39", "Paul says nothing in creation can separate believers from the love of God in Christ Jesus."]
  ],
  unforgivable_shame: [
    ["1 John 1:8-9", "John holds together honest confession and confidence in God's faithful forgiveness."]
  ],
  isolation: [
    ["Proverbs 18:1", "The proverb cautions that isolation can resist sound judgment, though wise boundaries may still be necessary."]
  ],
  unsafe_silence: [
    ["Proverbs 31:8-9", "Wisdom calls God's people to speak for those who need protection and justice."]
  ],
  angry_confrontation: [
    ["James 1:19-20", "James calls believers to be quick to hear, slow to speak, and slow to anger because anger does not produce God's righteousness."]
  ],
  guilt_confession: [
    ["Psalm 32:3-5", "The psalm connects hidden guilt with heaviness and confession with mercy."]
  ],
  fear_ruled: [
    ["2 Timothy 1:7", "Paul reminds Timothy that God gives a spirit of power, love, and self-control, not fear as master."]
  ],
  bitterness: [
    ["Hebrews 12:15", "Hebrews warns that bitterness can take root and spread harm in a community."]
  ],
  avoiding_counsel: [
    ["Proverbs 11:14", "Wisdom literature commends counsel rather than isolated judgment."]
  ],
  forgiveness_without_boundaries: [
    ["Romans 12:18", "Paul calls believers to live peaceably so far as it depends on them, which recognizes limits and does not require enabling harm."]
  ],
  passive_patience: [
    ["Micah 6:8", "The prophet joins humility with doing justice and loving mercy; patience is not the same as passivity toward wrong."]
  ],
  condemnation: [
    ["Romans 8:1", "Paul distinguishes conviction and new life in Christ from condemnation."]
  ]
};

const scriptureCategoryByFocus = {
  "Prayer": "Prayer, dependence, and peace before God",
  "Forgiveness": "Forgiveness, mercy, truth, and relational repair",
  "Grief": "Lament, mourning, hope, and Christ's presence in sorrow",
  "Decision-making": "Wisdom, trust, humility, and discernment",
  "Marriage/family": "Household love, patience, peace, and reconciliation where possible",
  "Anxiety/fear": "Fear, trust, humility, and God's care",
  "Faith/doubt": "Honest doubt, belief, encounter, and patient trust",
  "Habit/sin struggle": "Confession, grace, repentance, and embodied resistance to sin"
};

const traditionPerspectives = {
  "General Christian": "A broad Christian approach would invite honest prayer, Scripture read in context, confession where needed, wise counsel, and practical next steps in community.",
  "Baptist": "A Baptist summary often emphasizes personal faith, Scripture, prayer, believer's discipleship, local church support, and voluntary accountability.",
  "Methodist/Wesleyan": "A Methodist/Wesleyan summary often emphasizes grace that heals and forms us, practical holiness, prayer, Scripture, small-group support, and love of God and neighbor.",
  "Reformed": "A Reformed summary often emphasizes God's sovereignty, covenant faithfulness, Scripture, repentance and faith, wise pastoral care, and hope grounded in Christ.",
  "Lutheran": "A Lutheran summary often emphasizes law and gospel, honest confession, the promise of grace in Christ, vocation, prayer, and receiving care through Word and sacrament.",
  "Anglican": "An Anglican summary shaped by the 1928 Book of Common Prayer often emphasizes ordered prayer, Scripture, confession and absolution, the collects, sacramental life, pastoral counsel, and steady formation through the Church's common worship.",
  "Roman Catholic": "A Roman Catholic summary often emphasizes prayer, conscience formation, sacramental life, spiritual direction, works of mercy, and guidance from the Church's moral tradition.",
  "Eastern Orthodox": "An Eastern Orthodox summary often emphasizes healing, repentance as returning to God, prayer, the life of the Church, spiritual counsel, and growth in communion with Christ.",
  "Pentecostal/Charismatic": "A Pentecostal/Charismatic summary often emphasizes prayer, the Holy Spirit's comfort and gifts, Scripture, worship, discernment in community, and hopeful dependence on God."
};

const voiceProfiles = {
  "Gentle pastoral": "gentle pastoral care, steadiness, prayer, and next faithful steps",
  "Trusted Christian friend": "warm companionship, honest encouragement, and practical support",
  "Thoughtful theologian": "careful theological reflection, humility, distinctions, and Scripture in context",
  "Direct and steady": "clear, grounded, and practical without harshness",
  "Warm family-style encouragement": "warmth, belonging, courage, and tender perseverance",
  "Neutral and clear": "calm, balanced, and plain-spoken"
};

const correctionRules = [
  {
    type: "blame",
    phrase: "everyone else is the problem",
    patterns: ["everyone else", "they always", "they never", "none of this is my fault", "all their fault"],
    challenge: "There may be real hurt here, but Shepherd would also invite a little room for self-examination. Christian wisdom can name another person's wrong without refusing to ask, 'Lord, is there anything in me that needs truth, repentance, or maturity?'",
    anchor: "Matthew 7:3-5"
  },
  {
    type: "revenge",
    phrase: "revenge",
    patterns: ["revenge", "get them back", "make them pay", "ruin them", "hurt them back", "teach them a lesson"],
    challenge: "Your anger may be naming something that matters, but revenge is not the same as justice. Shepherd would encourage you to seek protection, truth, and wise help without letting payback become your guide.",
    anchor: "Romans 12:17-21"
  },
  {
    type: "contempt",
    phrase: "contempt or dehumanizing language",
    patterns: ["worthless", "trash", "monster", "evil people", "i hate them", "they are nothing"],
    challenge: "You may be naming serious harm or disappointment, but contempt can distort discernment. Christian wisdom lets you tell the truth about wrong without surrendering your speech to dehumanizing anger.",
    anchor: "James 3:8-10"
  },
  {
    type: "despair",
    phrase: "despair or hopelessness",
    patterns: ["no hope", "hopeless", "nothing will ever change", "there is no point", "it will never get better"],
    challenge: "Shepherd would not minimize how heavy this feels. But despair should be treated as a signal to seek support, not as a final verdict on what God can do.",
    anchor: "Psalm 42:5"
  },
  {
    type: "false_view_of_god",
    phrase: "God must hate me",
    patterns: ["god must hate me", "god hates me", "god is punishing me", "god abandoned me"],
    challenge: "Shepherd would gently challenge that conclusion. Pain, failure, or confusion may call for confession, help, lament, and change, but they do not prove that God hates you.",
    anchor: "Romans 8:38-39"
  },
  {
    type: "unforgivable_shame",
    phrase: "I can never be forgiven",
    patterns: ["can never be forgiven", "god can't forgive me", "too far gone", "unforgivable", "no grace for me"],
    challenge: "Shepherd would challenge the idea that shame gets the final word. Christian faith names sin honestly, but it also trusts God's mercy more than despair.",
    anchor: "1 John 1:8-9"
  },
  {
    type: "isolation",
    phrase: "cut everyone off",
    patterns: ["cut everyone off", "done with all of them", "never speak to them again", "leave everyone forever"],
    challenge: "You may be naming real exhaustion and disappointment, but permanent rejection is a heavy conclusion. The next faithful step may be one clear boundary, not turning pain into total isolation.",
    anchor: "Proverbs 18:1"
  },
  {
    type: "unsafe_silence",
    phrase: "stay silent around harm",
    patterns: ["stay silent", "keep quiet", "not tell anyone", "hide it"],
    requiresAny: ["harm", "abuse", "threat", "unsafe", "hit", "hurt"],
    challenge: "Shepherd would be careful here: silence can sometimes protect privacy, but it can also protect harm. If someone is being hurt or endangered, wise help and safety matter more than keeping the burden hidden.",
    anchor: "Proverbs 31:8-9"
  },
  {
    type: "angry_confrontation",
    phrase: "confront immediately while furious",
    patterns: ["confront them right now", "tell them off", "i'm furious", "while i'm angry", "right now because i'm angry"],
    challenge: "Your anger may be pointing to something important, but anger is not always a trustworthy guide for timing. Shepherd would encourage you to wait until you can speak truth without trying to wound.",
    anchor: "James 1:19-20"
  },
  {
    type: "guilt_confession",
    phrase: "guilt that may need confession",
    patterns: ["i feel guilty", "i did wrong", "i lied", "i cheated", "i sinned", "i need to confess"],
    challenge: "Guilt may be doing useful work if it is calling you toward confession, repair, and grace. Shepherd would not want you to hide from it or drown in it.",
    anchor: "Psalm 32:3-5"
  },
  {
    type: "fear_ruled",
    phrase: "fear ruling the decision",
    patterns: ["i'm too afraid", "fear is stopping me", "i can't because i'm scared", "what if everything goes wrong"],
    challenge: "Fear may be giving you information, but it should not be allowed to rule alone. Shepherd would invite wisdom, prayer, and counsel before fear makes the decision for you.",
    anchor: "2 Timothy 1:7"
  },
  {
    type: "bitterness",
    phrase: "bitterness",
    patterns: ["bitter", "bitterness", "resent", "resentment", "i refuse to forgive"],
    challenge: "Your pain may be real, and forgiveness should not be rushed or used to deny harm. Still, bitterness can become its own wound and may need repentance, truth, and wise support.",
    anchor: "Hebrews 12:15"
  },
  {
    type: "avoiding_counsel",
    phrase: "avoiding wise counsel",
    patterns: ["i won't tell anyone", "i don't need advice", "no one can help", "i'll handle it alone"],
    challenge: "Shepherd would gently question isolation as a strategy. Some burdens become clearer and safer when they are brought to a wise, trustworthy person.",
    anchor: "Proverbs 11:14"
  },
  {
    type: "forgiveness_without_boundaries",
    phrase: "forgiveness confused with allowing continued harm",
    patterns: ["forgive them so i have to let them", "keep treating me this way", "forgiveness means no boundaries", "forgive and go back"],
    challenge: "Shepherd would challenge that. Forgiveness does not require allowing continued harm. A Christian response can include mercy and boundaries at the same time.",
    anchor: "Romans 12:18"
  },
  {
    type: "passive_patience",
    phrase: "patience confused with passivity",
    patterns: ["just be patient while they keep", "do nothing and wait", "patience means accepting it", "i guess i should just take it"],
    challenge: "Patience is not the same as passivity. Shepherd would test whether waiting is actually faithful endurance, or whether it has become avoidance of truth, help, or protection.",
    anchor: "Micah 6:8"
  },
  {
    type: "condemnation",
    phrase: "conviction confused with condemnation",
    patterns: ["god is condemning me", "i am condemned", "convicted so god rejects me", "i'm disgusting to god"],
    challenge: "Conviction can lead toward confession and life; condemnation drives a person away from grace. Shepherd would not treat self-hatred as holiness.",
    anchor: "Romans 8:1"
  }
];

const inferenceRules = [
  {
    issueType: "Grief or loss",
    focus: "Grief",
    carePlanType: "Grief support",
    primaryNeed: "Lament and patient presence",
    secondaryNeed: "Community support without rushing the sorrow",
    themes: ["Lament, memory, and hope", "Permission to grieve honestly", "God's presence in sorrow"],
    keywords: ["grief", "loss", "died", "death", "mourning", "funeral", "miss them", "widow", "widower"]
  },
  {
    issueType: "Anxiety or fear",
    focus: "Anxiety/fear",
    carePlanType: "Stabilizing prayer and support",
    primaryNeed: "Calm, grounding, and honest prayer",
    secondaryNeed: "Wise support if fear is becoming overwhelming",
    themes: ["Fear named before God rather than hidden", "Peace without pretending the concern is simple", "Embodied practices of trust"],
    keywords: ["anxious", "anxiety", "afraid", "fear", "panic", "worried", "worry", "scared", "overwhelmed"]
  },
  {
    issueType: "Decision or discernment",
    focus: "Decision-making",
    carePlanType: "Decision discernment",
    primaryNeed: "Wisdom and clarity",
    secondaryNeed: "Testing motives and options with wise counsel",
    themes: ["Clarifying motives and options", "Seeking wisdom before acting", "Patience before a major step"],
    keywords: ["decide", "decision", "choice", "discern", "direction", "should i", "calling", "job", "move"]
  },
  {
    issueType: "Relationship or family strain",
    focus: "Marriage/family",
    carePlanType: "Relational repair and boundaries",
    primaryNeed: "Truthful, patient communication",
    secondaryNeed: "Healthy boundaries and mature counsel",
    themes: ["Patient truth-telling and repair where possible", "Love joined to wisdom", "Peace without denial"],
    keywords: ["marriage", "spouse", "wife", "husband", "family", "parent", "child", "friend", "relationship", "conflict"]
  },
  {
    issueType: "Forgiveness or resentment",
    focus: "Forgiveness",
    carePlanType: "Forgiveness with truth",
    primaryNeed: "Mercy without minimizing harm",
    secondaryNeed: "Boundaries, confession, or reconciliation where appropriate",
    themes: ["Forgiveness with truth and healthy boundaries", "Mercy shaped by God's mercy", "Repair without pretending harm did not happen"],
    keywords: ["forgive", "forgiveness", "resent", "resentment", "bitter", "bitterness", "apology", "hurt me"]
  },
  {
    issueType: "Faith, doubt, or spiritual struggle",
    focus: "Faith/doubt",
    carePlanType: "Faith and doubt reflection",
    primaryNeed: "Honest questions before God",
    secondaryNeed: "Patient Scripture, prayer, and trusted conversation",
    themes: ["Honest doubt brought to Christ", "Faith seeking understanding", "Questions held without shame"],
    keywords: ["doubt", "faith", "believe", "belief", "god feels far", "spiritual", "church", "prayer feels"]
  },
  {
    issueType: "Habit or sin struggle",
    focus: "Habit/sin struggle",
    carePlanType: "Grace-shaped accountability",
    primaryNeed: "Confession without despair",
    secondaryNeed: "Concrete accountability and replacement practices",
    themes: ["Repentance joined to grace and practical support", "Confession without shame", "Embodied resistance to sin"],
    keywords: ["sin", "habit", "addiction", "tempted", "temptation", "porn", "anger", "drinking", "relapse"]
  }
];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sessionDraft = collectInputs();
  if (!sessionDraft.concern.trim()) {
    return;
  }

  const crisisText = `${sessionDraft.concern} ${sessionDraft.tradition}`;
  if (containsCrisisLanguage(crisisText)) {
    renderCrisisMessage();
    return;
  }

  renderPlan(sessionDraft);
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
  const traditionInput = document.querySelector("#tradition").value.trim();
  return {
    concern: document.querySelector("#concern").value.trim(),
    voice: document.querySelector("#voice").value,
    tradition: normalizeTradition(traditionInput)
  };
}

function containsCrisisLanguage(text) {
  const normalized = text.toLowerCase();
  return crisisTerms.some((term) => normalized.includes(term));
}

function normalizeTradition(value) {
  if (!value) {
    return "General Christian";
  }

  const lower = value.toLowerCase();
  const knownTradition = Object.keys(traditionPerspectives).find((tradition) => lower.includes(tradition.toLowerCase()));
  if (knownTradition) {
    return knownTradition;
  }

  if (lower.includes("catholic")) return "Roman Catholic";
  if (lower.includes("orthodox")) return "Eastern Orthodox";
  if (lower.includes("methodist") || lower.includes("wesley")) return "Methodist/Wesleyan";
  if (lower.includes("pentecostal") || lower.includes("charismatic")) return "Pentecostal/Charismatic";
  if (lower.includes("anglican") || lower.includes("episcopal")) return "Anglican";
  return value;
}

function inferConcern(concern) {
  const extractedDetails = extractConcernDetails(concern);
  const scoredNeeds = scorePastoralNeeds(extractedDetails);
  const primaryRule = scoredNeeds[0]?.rule || {
    issueType: "General spiritual burden",
    focus: "Prayer",
    carePlanType: "Pastoral reflection and prayer",
    primaryNeed: "Honest prayer and careful naming",
    secondaryNeed: "Trusted Christian community and practical next steps",
    themes: ["Honest prayer without shame", "Discernment with trusted Christian community", "Bringing the burden into God's light"]
  };
  const secondaryRule = scoredNeeds[1]?.rule;
  const themes = scoredNeeds
    .flatMap((need) => need.rule.themes)
    .concat(primaryRule.themes);

  return {
    ...primaryRule,
    extractedDetails,
    scoredNeeds,
    likelyIssueTypes: scoredNeeds.map((need) => need.rule.issueType),
    secondaryIssueType: secondaryRule?.issueType || "",
    secondaryNeed: secondaryRule?.primaryNeed || primaryRule.secondaryNeed,
    detectedThemes: [...new Set(["Honest prayer without shame", ...themes])].slice(0, 6),
    scriptureThemes: buildScriptureThemes(scoredNeeds, primaryRule),
    personalizedInsight: buildPersonalizedInsight(extractedDetails, {
      primary: primaryRule,
      secondary: secondaryRule,
      scoredNeeds
    })
  };
}

function extractConcernDetails(userConcern) {
  const lower = userConcern.toLowerCase();
  const sentences = userConcern
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const matchedKeywords = inferenceRules.flatMap((rule) =>
    rule.keywords
      .filter((keyword) => lower.includes(keyword))
      .map((keyword) => ({ keyword, issueType: rule.issueType }))
  );
  const correctionSignals = correctionRules
    .filter((rule) => rule.patterns.some((pattern) => lower.includes(pattern)))
    .map((rule) => rule.phrase);
  const emotionWords = [
    "angry", "furious", "sad", "afraid", "scared", "anxious", "ashamed", "guilty",
    "lonely", "confused", "hurt", "bitter", "overwhelmed", "tired", "exhausted"
  ].filter((word) => lower.includes(word));
  const relationshipWords = [
    "family", "mother", "father", "parent", "spouse", "wife", "husband", "child",
    "friend", "church", "pastor", "coworker", "boss"
  ].filter((word) => lower.includes(word));
  const timeWords = [
    "today", "right now", "for years", "for months", "for weeks", "again", "always", "never"
  ].filter((word) => lower.includes(word));
  const desiredActions = [
    "confront", "leave", "forgive", "confess", "hide", "stay silent", "cut", "decide",
    "quit", "move", "apologize", "tell them"
  ].filter((word) => lower.includes(word));

  return {
    originalConcern: userConcern,
    lowerConcern: lower,
    sentences,
    matchedKeywords,
    correctionSignals,
    emotionWords: [...new Set(emotionWords)],
    relationshipWords: [...new Set(relationshipWords)],
    timeWords: [...new Set(timeWords)],
    desiredActions: [...new Set(desiredActions)],
    hasAbsolutes: /\b(always|never|forever|everyone|no one|nothing)\b/.test(lower),
    hasGodConclusion: /\bgod\b/.test(lower) && /\b(hate|punish|abandon|forgive|condemn)\w*\b/.test(lower),
    hasSafetyLanguage: /\b(abuse|harm|unsafe|threat|hit|violence|assault)\b/.test(lower)
  };
}

function scorePastoralNeeds(extractedDetails) {
  const lower = extractedDetails.lowerConcern;
  const scored = inferenceRules.map((rule) => {
    const keywordHits = rule.keywords.filter((keyword) => lower.includes(keyword));
    let score = keywordHits.length * 3;
    if (rule.issueType.includes("Grief") && extractedDetails.emotionWords.includes("sad")) score += 1;
    if (rule.issueType.includes("Anxiety") && extractedDetails.emotionWords.some((word) => ["afraid", "scared", "anxious", "overwhelmed"].includes(word))) score += 2;
    if (rule.issueType.includes("Decision") && extractedDetails.desiredActions.some((word) => ["decide", "quit", "move"].includes(word))) score += 2;
    if (rule.issueType.includes("Relationship") && extractedDetails.relationshipWords.length) score += 1;
    if (rule.issueType.includes("Habit") && extractedDetails.emotionWords.includes("guilty")) score += 1;
    return { rule, score, keywordHits };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length) {
    return scored;
  }

  return [{
    rule: {
      issueType: "General spiritual burden",
      focus: "Prayer",
      carePlanType: "Pastoral reflection and prayer",
      primaryNeed: "Honest prayer and careful naming",
      secondaryNeed: "Trusted Christian community and practical next steps",
      themes: ["Honest prayer without shame", "Discernment with trusted Christian community", "Bringing the burden into God's light"],
      keywords: []
    },
    score: 1,
    keywordHits: []
  }];
}

function buildScriptureThemes(scoredNeeds, primaryRule) {
  const themes = scoredNeeds
    .map((need) => scriptureCategoryByFocus[need.rule.focus])
    .filter(Boolean);
  return [...new Set(themes.length ? themes : [scriptureCategoryByFocus[primaryRule.focus] || scriptureCategoryByFocus.Prayer])].join("; ");
}

function buildPersonalizedInsight(extractedDetails, discernmentResult) {
  const emotionText = extractedDetails.emotionWords.length
    ? `The words suggest ${joinHumanList(extractedDetails.emotionWords)} may be part of what you are carrying.`
    : "The concern needs careful naming before it is solved.";
  const relationshipText = extractedDetails.relationshipWords.length
    ? `It also appears connected to ${joinHumanList(extractedDetails.relationshipWords)}.`
    : "No specific relationship setting was clearly named.";
  const overlapText = discernmentResult.secondary
    ? `This may not be only ${discernmentResult.primary.issueType.toLowerCase()}; it also overlaps with ${discernmentResult.secondary.issueType.toLowerCase()}.`
    : `The strongest inferred need is ${discernmentResult.primary.primaryNeed.toLowerCase()}.`;
  const cautionText = extractedDetails.hasAbsolutes
    ? "Words like always, never, forever, or no one may need to be tested because pain can make conclusions feel more total than they are."
    : "Shepherd is treating this as a partial reading, not a complete judgment.";

  return `${emotionText} ${relationshipText} ${overlapText} ${cautionText}`;
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

function renderPlan(data) {
  const inference = inferConcern(data.concern);
  const correction = detectNeededCorrection(data.concern, { tradition: data.tradition, ...inference.extractedDetails }, inference, data.voice);
  const scripture = buildScriptureSelection(inference, correction);
  const voice = voiceProfiles[data.voice] || voiceProfiles["Gentle pastoral"];
  const wisestStep = buildWisestNextStep(data, inference.extractedDetails, inference, correction);
  const reasoning = buildReasoningPath(data, inference, wisestStep, correction);

  form.classList.add("hidden");
  result.className = "result";
  result.innerHTML = `
    <div class="result-header">
      <h2>Your pastoral reflection draft</h2>
      <p>This is a mock, static reflection generated in browser memory. It is preparation for prayer, discernment, and human pastoral care.</p>
      <p class="fine-print">Voice setting: ${escapeHtml(data.voice)}. This changes wording and emphasis only; Shepherd is not claiming to be clergy, a counselor, a doctor, or final spiritual authority.</p>
      <div class="result-actions">
        <button type="button" id="print-button" class="primary">Print / Save as PDF</button>
        <button type="button" id="result-clear-button" class="secondary">Clear Everything</button>
      </div>
    </div>
    ${section("Situation Summary", "User-provided reflection", `<p>${buildSummary(data, inference)}</p>`)}
    ${section("Key Themes", "Pastoral wisdom", list(inference.detectedThemes))}
    ${section("Reasoning Path", "Pastoral wisdom", reasoningPath(reasoning))}
    ${correction.correctionNeeded ? section("Compassionate Correction", "Pastoral wisdom", correctionBlock(correction)) : ""}
    ${section("Scripture with Context", "Scripture", scriptureList(scripture))}
    ${section("Christian Tradition Perspective", "Christian tradition summary", `<p>${escapeHtml(buildTraditionPerspective(data.tradition))}</p><p>This is a summary of a tradition's common emphases, not a universal declaration for every church or believer in that tradition.</p>`)}
    ${section("Reflection Questions", "Pastoral wisdom", list(buildQuestions(data, inference, correction)))}
    ${section("Suggested Prayer", "Pastoral wisdom", `<p>${buildPrayer(data, inference, voice)}</p>`)}
    ${section("7-Day Pastoral Care Plan", "Pastoral wisdom", orderedList(buildCarePlan(data, inference)))}
    ${section("Wisest Next Step", "Pastoral wisdom", `<p>${wisestStep}</p>`)}
    ${section("Boundaries and Cautions", "Caution / safety boundary", list(buildBoundaries(correction)))}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function detectNeededCorrection(userConcern, extractedDetails, discernmentResult, selectedVoice) {
  const lowerConcern = userConcern.toLowerCase();
  const matchedRule = correctionRules.find((rule) => {
    const hasPattern = rule.patterns.some((pattern) => lowerConcern.includes(pattern));
    const hasRequiredContext = !rule.requiresAny || rule.requiresAny.some((pattern) => lowerConcern.includes(pattern));
    return hasPattern && hasRequiredContext;
  });

  if (!matchedRule) {
    return {
      correctionNeeded: false,
      correctionType: "",
      concernPhrase: "",
      gentleChallenge: "",
      biblicalAnchor: "",
      voiceAdjustedWording: ""
    };
  }

  const voiceAdjustedWording = adjustCorrectionForVoice(matchedRule.challenge, selectedVoice, matchedRule.anchor);
  return {
    correctionNeeded: true,
    correctionType: matchedRule.type,
    concernPhrase: matchedRule.phrase,
    gentleChallenge: matchedRule.challenge,
    biblicalAnchor: matchedRule.anchor,
    voiceAdjustedWording,
    issueType: discernmentResult.issueType,
    tradition: extractedDetails.tradition
  };
}

function adjustCorrectionForVoice(challenge, selectedVoice, anchor) {
  if (selectedVoice === "Direct and steady") {
    return `${challenge} Pause before acting. Test the conclusion, seek wise counsel, and choose a next step that does not deepen harm.`;
  }
  if (selectedVoice === "Thoughtful theologian") {
    return `${challenge} Doctrinally, this needs to be held under both truth and grace; ${anchor} gives a biblical frame for testing the conclusion rather than baptizing it as wisdom.`;
  }
  if (selectedVoice === "Trusted Christian friend") {
    return `${challenge} A faithful friend might say: I believe your pain matters, and I also do not want pain to make the decision for you.`;
  }
  if (selectedVoice === "Warm family-style encouragement") {
    return `${challenge} You do not have to be harsh with yourself to be honest, and you do not have to rush into a reaction to be brave.`;
  }
  if (selectedVoice === "Neutral and clear") {
    return `${challenge} Treat this as something to test, not something to assume is fully true yet.`;
  }
  return `${challenge} Shepherd would hold this tenderly, but also invite you to test it before God, Scripture, and wise human counsel.`;
}

function buildScriptureSelection(inference, correction) {
  const baseScripture = scriptureByFocus[inference.focus] || scriptureByFocus.Prayer;
  if (!correction.correctionNeeded) {
    return baseScripture;
  }
  const addedScripture = correctionScripture[correction.correctionType] || [];
  return [...addedScripture, ...baseScripture].slice(0, 3);
}

function buildSummary(data, inference) {
  return `You named this burden: "${shorten(data.concern)}" ${escapeHtml(inference.personalizedInsight)} Shepherd's rule-based reading suggests a likely issue type of ${escapeHtml(inference.issueType.toLowerCase())}, with a primary pastoral need for ${escapeHtml(inference.primaryNeed.toLowerCase())} and a secondary need for ${escapeHtml(inference.secondaryNeed.toLowerCase())}.`;
}

function buildTraditionPerspective(tradition) {
  return traditionPerspectives[tradition] || `You named ${tradition} as a faith background. Shepherd does not have a reviewed static summary for that background yet, so it will keep the tradition note modest and encourage guidance from a trusted leader in that community.`;
}

function buildQuestions(data, inference, correction) {
  const details = inference.extractedDetails;
  const questions = [
    `What part of this ${inference.issueType.toLowerCase()} burden feels most important to name before God?`,
    `What would ${inference.primaryNeed.toLowerCase()} look like in one concrete step this week?`,
    details.emotionWords.length ? `How might ${joinHumanList(details.emotionWords)} be shaping what feels true right now?` : "What feeling is loudest when you slow down and pray?",
    details.relationshipWords.length ? `What would love and truth require in relation to ${joinHumanList(details.relationshipWords)}?` : "Who is affected by this concern besides you?",
    "What would it look like to tell the truth without condemning yourself or another person?",
    `Where might these Scripture themes comfort or challenge you: ${inference.scriptureThemes}?`,
    "Who is one mature Christian or appropriate professional you could invite into this with humility and care?"
  ];
  if (correction.correctionNeeded) {
    questions.splice(2, 0, `What part of "${correction.concernPhrase}" needs to be tested before you treat it as wisdom?`);
  }
  return questions;
}

function buildReasoningPath(data, inference, wisestStep, correction) {
  const details = inference.extractedDetails;
  return [
    ["Concern named", shortenPlain(data.concern)],
    ["Details noticed", buildDetailsLine(details)],
    ["Likely issue type", inference.issueType],
    ["Other overlapping needs", inference.likelyIssueTypes.slice(1).join("; ") || "No strong secondary issue type detected."],
    ["Primary pastoral need", inference.primaryNeed],
    ["Secondary pastoral need", inference.secondaryNeed],
    ["Detected themes", inference.detectedThemes.join("; ")],
    ["Scripture themes selected", inference.scriptureThemes],
    ["Care plan type", inference.carePlanType],
    ["Correction check", correction.correctionNeeded ? `Possible ${correction.correctionType.replaceAll("_", " ")} concern detected: ${correction.concernPhrase}` : "No specific correction pattern detected."],
    ["Wisest next step", wisestStep],
    ["Confidence note", "This is a structured pastoral preparation draft based on limited user-provided information and static rule logic. It is not final authority, diagnosis, prophecy, counseling, or a substitute for human pastoral care."]
  ];
}

function buildBoundaries(correction) {
  const boundaries = [
    "Shepherd is a preparation and reflection tool, not a pastor, priest, counselor, doctor, emergency service, or final authority.",
    "The response is generated from static mock logic and user-provided reflection, not from an AI model or a human review.",
    "Shepherd avoids asking users to self-diagnose; the issue type and pastoral needs are inferred transparently and may be incomplete.",
    "Where safety, abuse, severe depression, violence, self-harm, medical concerns, or legal questions may be involved, seek immediate help from appropriate people or professionals.",
    "Print / Save as PDF uses the browser print dialog only. Shepherd does not save, transmit, or store the reflection."
  ];
  if (correction.correctionNeeded) {
    boundaries.splice(3, 0, `Compassionate correction is a caution, not a verdict. The concern flagged was "${correction.concernPhrase}", and it should be tested with prayer, Scripture, and wise counsel.`);
  }
  return boundaries;
}

function buildPrayer(data, inference, voice) {
  return `Lord Jesus, meet this person with ${voice}. Help them bring this ${inference.issueType.toLowerCase()} burden into your light without shame. Give them Scripture in context, wise counsel, patience for the process, and the humility to seek human help where it is needed. Amen.`;
}

function buildCarePlan(data, inference) {
  const details = inference.extractedDetails;
  const detailPrompt = details.matchedKeywords.length
    ? `Pay attention to these named signals: ${joinHumanList(details.matchedKeywords.map((item) => item.keyword).slice(0, 5))}.`
    : "Pay attention to the exact words you used, especially where the burden feels most charged.";
  return [
    "Day 1: Read the first Scripture passage slowly. Write one honest sentence of prayer.",
    `Day 2: Name what feels heaviest about this ${inference.issueType.toLowerCase()} burden without trying to solve it all at once.`,
    `Day 3: Ask what ${inference.primaryNeed.toLowerCase()} would look like in one small faithful action.`,
    `Day 4: ${detailPrompt}`,
    `Day 5: Follow the ${inference.carePlanType.toLowerCase()} path by sharing a brief version of this burden with a trusted Christian or appropriate professional.`,
    `Day 6: Consider one practice from the ${data.tradition} tradition that could support you, such as prayer, confession, counsel, worship, service, or spiritual direction.`,
    "Day 7: Review what changed, what remains unclear, and what wisest next step is now appropriate."
  ];
}

function buildWisestNextStep(data, extractedDetails, discernmentResult, correction) {
  if (correction.correctionNeeded) {
    if (correction.correctionType === "angry_confrontation") {
      return "Before confronting anyone, wait until anger is no longer steering the timing. Consider writing the concern down, praying, and asking a trusted mature Christian or counselor to help you prepare words that are truthful without trying to wound.";
    }
    if (correction.correctionType === "forgiveness_without_boundaries" || correction.correctionType === "unsafe_silence") {
      return "Talk with a trusted pastor, counselor, doctor, advocate, or safe person about what mercy and protection should look like together. Do not confuse forgiveness, patience, or silence with allowing continued harm.";
    }
    if (correction.correctionType === "false_view_of_god" || correction.correctionType === "unforgivable_shame" || correction.correctionType === "condemnation") {
      return "Bring this conclusion about God or yourself to a trusted pastor, priest, counselor, or mature Christian who can help separate conviction from condemnation and shame from grace.";
    }
    if (correction.correctionType === "revenge" || correction.correctionType === "contempt" || correction.correctionType === "bitterness") {
      return "Before acting, seek wise counsel from a pastor, mentor, counselor, or mature Christian who can help you pursue truth and boundaries without letting bitterness or revenge shape the next step.";
    }
  }
  if (extractedDetails.hasSafetyLanguage) {
    return "Because safety-related language appears in the concern, the wisest next step is to speak with a safe trusted person or appropriate professional rather than carrying this alone.";
  }
  if (extractedDetails.desiredActions.includes("decide") || extractedDetails.desiredActions.includes("quit") || extractedDetails.desiredActions.includes("move")) {
    return "Before acting, write down the real options, the likely fruit of each, and one wise person who can help you test the decision.";
  }
  const lowerType = discernmentResult.issueType.toLowerCase();
  if (lowerType.includes("grief")) {
    return "Consider speaking with a pastor, priest, grief group, counselor, doctor, or trusted person who can help you carry sorrow with support instead of carrying it alone.";
  }
  if (lowerType.includes("anxiety")) {
    return "Consider talking with a trusted person, pastor, counselor, doctor, or appropriate professional if fear is becoming heavy, persistent, or disruptive.";
  }
  if (lowerType.includes("decision")) {
    return "Invite a pastor, mentor, counselor, or wise Christian friend to help you slow down, test motives, and compare realistic options.";
  }
  if (lowerType.includes("habit")) {
    return "Seek confession, accountability, and practical support from a pastor, priest, mature Christian, counselor, recovery group, or appropriate professional.";
  }
  return "Choose one trusted person this week: a pastor or priest, mature Christian friend, counselor, doctor, mentor, or family member. Shepherd can help you prepare, but discernment belongs in prayerful human community.";
}

function correctionBlock(correction) {
  return `
    <p>${escapeHtml(correction.voiceAdjustedWording)}</p>
    <div class="reasoning-item">
      <strong>What may need testing</strong>
      <span>${escapeHtml(correction.concernPhrase)}</span>
    </div>
    <div class="reasoning-item">
      <strong>Biblical anchor</strong>
      <span>${escapeHtml(correction.biblicalAnchor)}</span>
    </div>
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

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function orderedList(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function reasoningPath(items) {
  return `<div class="reasoning-grid">${items.map(([label, detail]) => `
    <div class="reasoning-item">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(detail)}</span>
    </div>
  `).join("")}</div>`;
}

function buildDetailsLine(details) {
  const parts = [];
  if (details.emotionWords.length) parts.push(`emotions: ${joinHumanList(details.emotionWords)}`);
  if (details.relationshipWords.length) parts.push(`relationships/settings: ${joinHumanList(details.relationshipWords)}`);
  if (details.desiredActions.length) parts.push(`desired actions: ${joinHumanList(details.desiredActions)}`);
  if (details.timeWords.length) parts.push(`time/intensity words: ${joinHumanList(details.timeWords)}`);
  if (details.hasAbsolutes) parts.push("absolute language appears");
  return parts.length ? parts.join("; ") : "No specific detail cluster stood out strongly.";
}

function joinHumanList(items) {
  const cleanItems = [...new Set(items)].filter(Boolean);
  if (cleanItems.length <= 1) {
    return cleanItems[0] || "";
  }
  if (cleanItems.length === 2) {
    return `${cleanItems[0]} and ${cleanItems[1]}`;
  }
  return `${cleanItems.slice(0, -1).join(", ")}, and ${cleanItems[cleanItems.length - 1]}`;
}

function shorten(text) {
  const clean = escapeHtml(text.trim());
  return clean.length > 240 ? `${clean.slice(0, 237)}...` : clean;
}

function shortenPlain(text) {
  const clean = text.trim();
  return clean.length > 240 ? `${clean.slice(0, 237)}...` : clean;
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
  form.classList.remove("hidden");
}
