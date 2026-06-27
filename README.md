# Shepherd

Shepherd is a privacy-first, static Christian discernment tool. It helps a person write out a concern, grief, conflict, spiritual struggle, or theological question, then turns that input into a structured pastoral reflection.

Shepherd v2 is still intentionally static:

- No backend
- No login
- No database
- No analytics
- No AI API calls
- No `localStorage`
- No `sessionStorage`
- No IndexedDB
- No permanent storage of user input
- No permanent storage of internal analysis

User input remains only in browser memory while the page is open. Refreshing or clearing the page removes the current reflection. Print / Save as PDF uses the browser print dialog only.

## Core Purpose

Shepherd is a preparation and reflection tool for prayer, Scripture, confession, pastoral care, counseling, and Christian community discernment.

It is not a replacement for:

- A pastor, priest, deacon, elder, bishop, spiritual director, or mature Christian community
- A counselor, doctor, therapist, or other appropriate professional
- Emergency services or crisis support
- Trusted human relationships

## User Flow

The user only selects:

1. Christian tradition
2. Primary guide
3. Their concern or problem

Shepherd does not ask extra follow-up questions or require the user to self-diagnose. The app infers the likely issue, focus, emotional and spiritual themes, and needed response type from the concern text.

## Shepherd Understanding Engine

Version 3 adds an internal first-pass engine:

```js
analyzeUnderstanding(userText, options)
```

The Understanding Engine runs before the discernment/correction layer, before Divine Pattern analysis, and before the selected voice shapes the visible response. It returns a transient structured object with:

- `userMeaning`
- `emotionsDetected`
- `assumptionsDetected`
- `deeperNeeds`
- `biblicalThemes`
- `pastoralStrategy`
- `divinePatternEntry`

This object helps Shepherd understand meaning, emotions, assumptions, deeper needs, biblical themes, pastoral strategy, and the Father / Son-Logos / Holy Spirit entry point before producing the final pastoral response. The full object is internal and is not shown to normal users.

## Shepherd Discernment Engine

Version 4 adds a second internal reasoning stage:

```js
analyzeDiscernment(userText, selectedVoice, understanding)
```

The Understanding Engine observes what the user appears to be saying. The Discernment Engine evaluates what needs to be affirmed, corrected, warned about, or developed. It returns a transient structured object with:

- `truthsRecognized`
- `possibleErrors`
- `missingBiblicalIdeas`
- `spiritualRisks`
- `growthOpportunities`
- `correctionTone`
- `pastoralPriority`
- `confidence`

This object helps Shepherd distinguish the suffering person from a possibly false belief or harmful spiritual direction. It is used internally by the Divine Pattern layer and visible response builders, but normal users do not see the raw object.

## Shepherd Response Composer

Version 5 adds the final structured response stage:

```js
composeShepherdResponse({ userMessage, selectedVoice, voiceProfile, understanding, discernment, divinePattern, concernAnalysis })
```

The Response Composer receives the Understanding Engine, Discernment Engine, Divine Pattern Engine, and selected voice context, then produces the six visible pastoral sections:

- Pastoral Acknowledgment
- Truth / Correction
- Divine Pattern Insight
- Things You May Not Have Considered
- Practical Next Step
- Short Prayer

The composer keeps the final response consistent across voices while preserving the selected voice as a perspective lens. It does not expose raw internal JSON to normal users.

## Discernment Engine

Version 2 includes a static rule-based function:

```js
analyzeConcern(userText)
```

It detects possible:

- Emotions
- Spiritual or pastoral issue
- Cognitive distortion
- Theological distortion
- Needed response type, such as comfort, correction, warning, encouragement, repentance, boundaries, counsel, or practical next steps
- Internal confidence level for humble weighting

The analysis shapes the final reflection, but the app avoids presenting it as a cold diagnostic report and does not expose confidence internals.

## Divine Pattern Layer

Shepherd now includes a reusable Divine Pattern reasoning layer inspired by the Divine project. This layer looks for broad theological patterns such as lament moving toward trust, conviction moving toward mercy, fear moving toward wise trust, harm named for protection, or isolation moving toward communion.

Divine remains a separate standalone website/project. It has not been merged into Shepherd, and Shepherd does not call Divine as a backend, API, database, or shared website runtime.

The current in-browser flow is:

```text
User input
-> transient Shepherd Understanding Engine
-> transient Shepherd Discernment Engine
-> transient discernment / correction analysis
-> transient Divine Pattern analysis
-> selected Shepherd voice or perspective lens
-> Shepherd Response Composer
-> final visible response
```

The visible Divine Pattern Layer is intentionally short. It shows a pastoral summary, a Scripture anchor, and a caution or guardrail. It does not display the raw analysis object, JSON, internal IDs, or developer reasoning.

The Divine Pattern Layer is a support layer, not an authority. Scripture, prayer, the Holy Spirit, and Christian community remain central.

## Theological and Cognitive Distortions

Shepherd v2 can gently correct spiritually harmful conclusions, including ideas such as:

- God hates me
- God abandoned me
- I can never be forgiven
- I have to earn God's love
- My suffering proves I failed
- Forgiveness means no boundaries
- I should stay silent about harm
- I just need more faith and then everything will be fixed

It also checks for cognitive and spiritual patterns such as all-or-nothing thinking, despair, shame, blame shifting, revenge, bitterness, fear-led decisions, isolation, confusing conviction with condemnation, confusing patience with passivity, and confusing forgiveness with enabling harm.

When these appear, Shepherd should lovingly test the conclusion rather than simply affirm it.

## Things You May Not Have Considered

This section gives 3 to 5 observations about blind spots, possible assumptions, Scripture tensions, practical wisdom, or spiritual danger. It is meant to deepen discernment without creating dependence on the tool.

The older generic reflection-question pattern has been replaced by this section so the response can surface assumptions and pastoral blind spots directly.

## Shepherd as Primary Guide

Shepherd is the primary guide by default. Other voices remain available as optional perspectives that can shape emphasis, but they do not become the identity of the app or pretend to speak as a historical figure.

Current guide and perspectives:

- Shepherd: truth, mercy, Scripture in context, wise human counsel, one faithful next step
- Thoughtful pastor: balanced pastoral care
- Trusted Christian friend: warm but honest companionship
- Paul: grace, union with Christ, endurance, correction, community
- Augustine: disordered loves, confession, restlessness, desire
- C.S. Lewis: imagination, reason, pride, humility, moral clarity
- Bonhoeffer: costly obedience, community, discipleship, action
- Spurgeon: comfort, hope, tenderness, gospel assurance

Each perspective can comfort, challenge, and disagree with the user's conclusion when needed, while Shepherd remains the main guide.

## Dynamic Human Next Steps

The recommended next step changes based on the detected issue:

- Crisis or unsafe language: immediate human help, emergency support, crisis support, or safety planning
- Guilt or sin: confession, repentance, repair, accountability, and pastoral counsel
- Grief: pastor, mature Christian friend, grief support, prayerful community, or counselor
- Relationship conflict: mediator, pastor, priest, counselor, or mature Christian
- Theological confusion: pastor, priest, Bible study leader, or spiritual director
- Loneliness or isolation: one trusted person this week
- Medical or mental health language: doctor or counselor plus pastoral support

## Additional Faithful Perspectives

After the first response, Shepherd offers:

> Additional Faithful Perspectives

This shows three brief responses from different voices, then names where they agree and how they differ. The goal is to teach discernment, not dependence on AI.

## Safety Boundaries

If the user's text includes crisis language related to self-harm, suicide, abuse, immediate danger, severe depression, violence, or emergencies, Shepherd does not generate a normal pastoral reflection.

Instead, it displays a crisis/support message encouraging immediate human help from emergency services, crisis support, trusted clergy, trusted people, counselors, doctors, or appropriate local services.

The crisis check is simple static keyword logic. It is not a clinical classifier.

## Privacy Model

Shepherd's privacy model is intentionally simple:

- No login required
- No backend database
- No `localStorage`
- No `sessionStorage`
- No IndexedDB
- No analytics
- No raw input saved
- No internal Shepherd analysis saved
- No internal Divine Pattern analysis saved
- Refreshing the page clears the session

All analysis is transient and in memory while the page is open.

## Running Locally

Open `index.html` in a browser. No build step is required.

Developer debug mode is available by adding `?debug` or `#debug` to the page URL. In that mode, Shepherd writes the internal Understanding Engine object, Discernment Engine object, legacy correction analysis, Divine Pattern analysis, and composed response structure to the browser console for testing. Normal users do not see these objects in the page.

## Project Structure

```text
Shepherd/
  index.html
  styles.css
  understandingEngine.js
  discernmentEngine.js
  responseComposer.js
  app.js
  divine-pattern-engine.js
  README.md
```

## Development Notes

- `divine-pattern-engine.js` is dependency-free.
- `understandingEngine.js` is dependency-free and must load before `app.js`.
- `discernmentEngine.js` is dependency-free and must load after `understandingEngine.js` and before `app.js`.
- `responseComposer.js` is dependency-free and must load before `app.js`.
- Divine Pattern analysis is performed in memory only.
- The Divine Pattern engine receives the Understanding Engine and Discernment Engine objects as context and records their entries internally.
- The UI displays only a short pastoral summary, not the raw analysis object.
- Shepherd loads the Divine Pattern engine locally before `app.js`; it does not add a backend, API call, analytics call, database, or storage layer.
- Divine remains separate from Shepherd.

## Future Roadmap

- Add reviewed optional AI-assisted generation only after explicit consent
- Keep no-storage mode as the default
- Improve crisis detection and safety language with professional review
- Expand Scripture context notes and denominational summaries
- Add broader pastoral review from different Christian traditions
- Add accessibility testing and keyboard-flow refinements
