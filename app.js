const form = document.querySelector("#reflection-form");
const followUpPanel = document.querySelector("#follow-up-panel");
const result = document.querySelector("#result");
const clearButton = document.querySelector("#clear-button");
const backButton = document.querySelector("#back-button");
const generateButton = document.querySelector("#generate-button");

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

const traditionPerspectives = {
  "General Christian": "A broad Christian approach would invite honest prayer, Scripture read in context, confession where needed, wise counsel, and practical next steps in community.",
  "Baptist": "A Baptist summary often emphasizes personal faith, Scripture, prayer, believer's discipleship, local church support, and voluntary accountability.",
  "Methodist/Wesleyan": "A Methodist/Wesleyan summary often emphasizes grace that heals and forms us, practical holiness, prayer, Scripture, small-group support, and love of God and neighbor.",
  "Reformed": "A Reformed summary often emphasizes God's sovereignty, covenant faithfulness, Scripture, repentance and faith, wise pastoral care, and hope grounded in Christ.",
  "Lutheran": "A Lutheran summary often emphasizes law and gospel, honest confession, the promise of grace in Christ, vocation, prayer, and receiving care through Word and sacrament.",
  "Roman Catholic": "A Roman Catholic summary often emphasizes prayer, conscience formation, sacramental life, spiritual direction, works of mercy, and guidance from the Church's moral tradition.",
  "Eastern Orthodox": "An Eastern Orthodox summary often emphasizes healing, repentance as returning to God, prayer, the life of the Church, spiritual counsel, and growth in communion with Christ.",
  "Pentecostal/Charismatic": "A Pentecostal/Charismatic summary often emphasizes prayer, the Holy Spirit's comfort and gifts, Scripture, worship, discernment in community, and hopeful dependence on God."
};

const voiceProfiles = {
  "Female": "gentle, attentive, and emotionally specific",
  "Male": "steady, direct, and protective without pressure",
  "Neutral": "calm, balanced, and clear"
};

const roleProfiles = {
  "Pastor / Priest": "uses pastoral language of care, prayer, confession, hope, and next faithful steps",
  "Deacon / Deaconess": "emphasizes service, practical care, community support, and embodied help",
  "Bishop / Elder": "emphasizes spiritual oversight, maturity, patience, and wise counsel",
  "Theologian": "emphasizes careful distinctions, Scripture in context, and humility where Christians differ",
  "Trusted Christian Friend": "emphasizes companionship, encouragement, honesty, and staying connected",
  "Family-Style Encouragement": "emphasizes warmth, belonging, courage, and tender perseverance"
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sessionDraft = collectInitialInputs();
  if (!sessionDraft.concern.trim()) {
    return;
  }
  form.classList.add("hidden");
  followUpPanel.classList.remove("hidden");
  result.classList.add("hidden");
});

backButton.addEventListener("click", () => {
  followUpPanel.classList.add("hidden");
  form.classList.remove("hidden");
});

generateButton.addEventListener("click", () => {
  if (!sessionDraft) {
    sessionDraft = collectInitialInputs();
  }
  const followUps = collectFollowUps();
  const combinedText = `${sessionDraft.concern} ${Object.values(followUps).join(" ")}`;
  if (containsCrisisLanguage(combinedText)) {
    renderCrisisMessage();
    return;
  }
  renderPlan({ ...sessionDraft, followUps });
});

clearButton.addEventListener("click", clearSession);

function collectInitialInputs() {
  return {
    concern: document.querySelector("#concern").value.trim(),
    tradition: document.querySelector("#tradition").value,
    focus: document.querySelector("#focus").value,
    tone: document.querySelector("input[name='tone']:checked").value,
    role: document.querySelector("#role").value
  };
}

function collectFollowUps() {
  return {
    duration: document.querySelector("#duration").value.trim(),
    trustedPerson: document.querySelector("#trusted-person").value.trim(),
    alreadyTried: document.querySelector("#already-tried").value.trim(),
    discernment: document.querySelector("#discernment").value.trim()
  };
}

function containsCrisisLanguage(text) {
  const normalized = text.toLowerCase();
  return crisisTerms.some((term) => normalized.includes(term));
}

function renderCrisisMessage() {
  followUpPanel.classList.add("hidden");
  result.className = "result crisis";
  result.innerHTML = `
    <div class="result-header">
      <h2>This needs immediate human support</h2>
      <p>Shepherd cannot handle emergencies or crisis situations, and it should not be used as a substitute for urgent help.</p>
    </div>
    <section class="result-section">
      <h3>Please reach out now</h3>
      <p>If there is immediate danger, call emergency services right now. In the United States, call or text 988 for the Suicide & Crisis Lifeline if self-harm, suicide, or severe crisis may be involved.</p>
      <p>Contact a trusted person, pastor or priest, counselor, doctor, local crisis line, or appropriate professional. If abuse or violence is involved, seek safety first and contact local emergency or abuse-support services.</p>
    </section>
    <section class="result-section">
      <h3>A grounding step</h3>
      <p>Move near another safe person if possible, reduce access to anything that could be used for harm, and say plainly: "I need help right now."</p>
    </section>
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderPlan(data) {
  const themes = inferThemes(data.concern, data.focus);
  const scripture = scriptureByFocus[data.focus] || scriptureByFocus.Prayer;
  const voice = `${voiceProfiles[data.tone]}; ${roleProfiles[data.role]}`;
  const summary = buildSummary(data);

  followUpPanel.classList.add("hidden");
  result.className = "result";
  result.innerHTML = `
    <div class="result-header">
      <h2>Your pastoral reflection draft</h2>
      <p>This is a mock, static reflection generated in browser memory. It is preparation for prayer, discernment, and human pastoral care.</p>
      <p class="fine-print">Voice setting: ${escapeHtml(data.tone)} tone through a ${escapeHtml(data.role)} lens. This changes wording and emphasis only; Shepherd is not claiming to be clergy, a counselor, or an authority figure.</p>
    </div>
    ${section("Situation Summary", `<p>${summary}</p>`)}
    ${section("Key Themes", list(themes))}
    ${section("Scripture Passages with Context", scriptureList(scripture))}
    ${section("Denominational Perspective", `<p>${escapeHtml(traditionPerspectives[data.tradition])}</p><p>This is a summary of a tradition's common emphases, not a universal declaration for every church or believer in that tradition.</p>`)}
    ${section("Reflection Questions", list(buildQuestions(data)))}
    ${section("Optional Suggested Prayer", `<p>${buildPrayer(data, voice)}</p>`)}
    ${section("7-Day Pastoral Care Plan", orderedList(buildCarePlan(data)))}
    ${section("Recommended Human Next Step", `<p>${buildHumanStep(data)}</p>`)}
  `;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildSummary(data) {
  const duration = data.followUps.duration || "an unspecified amount of time";
  const tried = data.followUps.alreadyTried || "some steps that may still need naming";
  const discernment = data.followUps.discernment || "a wise and faithful next step";
  return `You are bringing a ${data.focus.toLowerCase()} concern connected to this situation: "${shorten(data.concern)}" You have been carrying it for ${escapeHtml(duration)}. You have already tried ${escapeHtml(tried)}, and you are hoping God will help you discern ${escapeHtml(discernment)}.`;
}

function inferThemes(concern, focus) {
  const lower = concern.toLowerCase();
  const themes = ["Honest prayer without shame", "Discernment with trusted Christian community"];
  if (lower.includes("forgive") || focus === "Forgiveness") themes.push("Forgiveness with truth and healthy boundaries");
  if (lower.includes("grief") || lower.includes("loss") || focus === "Grief") themes.push("Lament, memory, and hope");
  if (lower.includes("anxious") || lower.includes("fear") || focus === "Anxiety/fear") themes.push("Fear named before God rather than hidden");
  if (lower.includes("sin") || lower.includes("habit") || focus === "Habit/sin struggle") themes.push("Repentance joined to grace and practical support");
  if (lower.includes("family") || lower.includes("marriage") || focus === "Marriage/family") themes.push("Patient truth-telling and repair where possible");
  return [...new Set(themes)].slice(0, 5);
}

function buildQuestions(data) {
  return [
    `What part of this ${data.focus.toLowerCase()} concern feels heaviest when you pray about it?`,
    "What would it look like to tell the truth without condemning yourself or another person?",
    "Where might Scripture comfort you, and where might it challenge you toward a concrete act of faith?",
    "Who is one mature Christian or appropriate professional you could invite into this with humility and care?",
    `How might your ${data.tradition} background shape the practices you choose this week?`
  ];
}

function buildPrayer(data, voice) {
  const opening = data.tone === "Female"
    ? "Lord Jesus, meet your child with tenderness and courage."
    : data.tone === "Male"
      ? "Lord Jesus, give your servant steadiness, courage, and a clear next step."
      : "Lord Jesus, bring mercy, truth, and wisdom into this concern.";
  return `${opening} Help them bring this ${data.focus.toLowerCase()} concern into your light without shame. Give them Scripture in context, wise counsel, patience for the process, and the humility to seek human help where it is needed. Shape this reflection with a ${voice} posture, while keeping all authority in your hands. Amen.`;
}

function buildCarePlan(data) {
  return [
    "Day 1: Read the first Scripture passage slowly. Write one honest sentence of prayer.",
    "Day 2: Name the facts, feelings, fears, and hopes separately so they do not blur together.",
    "Day 3: Ask what repentance, forgiveness, courage, grief, or patience may look like without forcing a false conclusion.",
    `Day 4: Consider one practice from the ${data.tradition} tradition that could support you, such as prayer, confession, counsel, worship, service, or spiritual direction.`,
    "Day 5: Share a brief version of this concern with a trusted Christian or appropriate professional.",
    "Day 6: Take one small embodied step: rest, make an appointment, write a letter you may not send, apologize, set a boundary, or ask for help.",
    "Day 7: Review what changed, what remains unclear, and what human next step is now wise."
  ];
}

function buildHumanStep(data) {
  const trusted = data.followUps.trustedPerson;
  if (trusted) {
    return `Because you mentioned ${escapeHtml(trusted)}, consider making that conversation concrete: ask for a time to talk, bring a short summary, and be clear about whether you need prayer, counsel, accountability, or practical help.`;
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

function section(title, content) {
  return `<section class="result-section"><h3>${title}</h3>${content}</section>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function orderedList(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function shorten(text) {
  const clean = escapeHtml(text.trim());
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
  document.querySelectorAll("#follow-up-panel input").forEach((input) => {
    input.value = "";
  });
  followUpPanel.classList.add("hidden");
  result.classList.add("hidden");
  form.classList.remove("hidden");
}
