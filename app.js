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
  const lower = concern.toLowerCase();
  const matched = inferenceRules.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword))) || {
    issueType: "General spiritual burden",
    focus: "Prayer",
    carePlanType: "Pastoral reflection and prayer",
    primaryNeed: "Honest prayer and careful naming",
    secondaryNeed: "Trusted Christian community and practical next steps",
    themes: ["Honest prayer without shame", "Discernment with trusted Christian community", "Bringing the burden into God's light"]
  };

  return {
    ...matched,
    detectedThemes: [...new Set(["Honest prayer without shame", ...matched.themes])].slice(0, 5),
    scriptureThemes: scriptureCategoryByFocus[matched.focus] || scriptureCategoryByFocus.Prayer
  };
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
  const scripture = scriptureByFocus[inference.focus] || scriptureByFocus.Prayer;
  const voice = voiceProfiles[data.voice] || voiceProfiles["Gentle pastoral"];
  const humanStep = buildHumanStep(data, inference);
  const reasoning = buildReasoningPath(data, inference, humanStep);

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
    ${section("Scripture with Context", "Scripture", scriptureList(scripture))}
    ${section("Christian Tradition Perspective", "Christian tradition summary", `<p>${escapeHtml(buildTraditionPerspective(data.tradition))}</p><p>This is a summary of a tradition's common emphases, not a universal declaration for every church or believer in that tradition.</p>`)}
    ${section("Reflection Questions", "Pastoral wisdom", list(buildQuestions(data, inference)))}
    ${section("Suggested Prayer", "Pastoral wisdom", `<p>${buildPrayer(data, inference, voice)}</p>`)}
    ${section("7-Day Pastoral Care Plan", "Pastoral wisdom", orderedList(buildCarePlan(data, inference)))}
    ${section("Recommended Human Next Step", "Pastoral wisdom", `<p>${humanStep}</p>`)}
    ${section("Boundaries and Cautions", "Caution / safety boundary", list(buildBoundaries()))}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildSummary(data, inference) {
  return `You named this burden: "${shorten(data.concern)}" Shepherd's rule-based reading suggests a likely issue type of ${escapeHtml(inference.issueType.toLowerCase())}, with a primary pastoral need for ${escapeHtml(inference.primaryNeed.toLowerCase())} and a secondary need for ${escapeHtml(inference.secondaryNeed.toLowerCase())}.`;
}

function buildTraditionPerspective(tradition) {
  return traditionPerspectives[tradition] || `You named ${tradition} as a faith background. Shepherd does not have a reviewed static summary for that background yet, so it will keep the tradition note modest and encourage guidance from a trusted leader in that community.`;
}

function buildQuestions(data, inference) {
  return [
    `What part of this ${inference.issueType.toLowerCase()} burden feels most important to name before God?`,
    `What would ${inference.primaryNeed.toLowerCase()} look like in one concrete step this week?`,
    "What would it look like to tell the truth without condemning yourself or another person?",
    "Where might Scripture comfort you, and where might it challenge you toward a concrete act of faith?",
    "Who is one mature Christian or appropriate professional you could invite into this with humility and care?"
  ];
}

function buildReasoningPath(data, inference, humanStep) {
  return [
    ["Concern named", shortenPlain(data.concern)],
    ["Likely issue type", inference.issueType],
    ["Primary pastoral need", inference.primaryNeed],
    ["Secondary pastoral need", inference.secondaryNeed],
    ["Detected themes", inference.detectedThemes.join("; ")],
    ["Scripture themes selected", inference.scriptureThemes],
    ["Care plan type", inference.carePlanType],
    ["Human next step recommended", humanStep],
    ["Confidence note", "This is a structured pastoral preparation draft based on limited user-provided information and static rule logic. It is not final authority, diagnosis, prophecy, counseling, or a substitute for human pastoral care."]
  ];
}

function buildBoundaries() {
  return [
    "Shepherd is a preparation and reflection tool, not a pastor, priest, counselor, doctor, emergency service, or final authority.",
    "The response is generated from static mock logic and user-provided reflection, not from an AI model or a human review.",
    "Shepherd avoids asking users to self-diagnose; the issue type and pastoral needs are inferred transparently and may be incomplete.",
    "Where safety, abuse, severe depression, violence, self-harm, medical concerns, or legal questions may be involved, seek immediate help from appropriate people or professionals.",
    "Print / Save as PDF uses the browser print dialog only. Shepherd does not save, transmit, or store the reflection."
  ];
}

function buildPrayer(data, inference, voice) {
  return `Lord Jesus, meet this person with ${voice}. Help them bring this ${inference.issueType.toLowerCase()} burden into your light without shame. Give them Scripture in context, wise counsel, patience for the process, and the humility to seek human help where it is needed. Amen.`;
}

function buildCarePlan(data, inference) {
  return [
    "Day 1: Read the first Scripture passage slowly. Write one honest sentence of prayer.",
    `Day 2: Name what feels heaviest about this ${inference.issueType.toLowerCase()} burden without trying to solve it all at once.`,
    `Day 3: Ask what ${inference.primaryNeed.toLowerCase()} would look like in one small faithful action.`,
    `Day 4: Consider one practice from the ${data.tradition} tradition that could support you, such as prayer, confession, counsel, worship, service, or spiritual direction.`,
    `Day 5: Follow the ${inference.carePlanType.toLowerCase()} path by sharing a brief version of this burden with a trusted Christian or appropriate professional.`,
    "Day 6: Take one embodied step: rest, make an appointment, write a letter you may not send, apologize, set a boundary, or ask for help.",
    "Day 7: Review what changed, what remains unclear, and what human next step is now wise."
  ];
}

function buildHumanStep(data, inference) {
  const lowerType = inference.issueType.toLowerCase();
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
