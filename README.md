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
2. Pastoral / theological voice
3. Their concern or problem

Shepherd does not ask extra follow-up questions or require the user to self-diagnose. The app infers the likely issue, focus, emotional and spiritual themes, and needed response type from the concern text.

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
- Confidence level: high, moderate, or low

The analysis shapes the final reflection, but the app avoids presenting it as a cold diagnostic report. Confidence language stays humble and non-clinical.

## Divine Pattern Layer

Shepherd now includes a reusable Divine Pattern reasoning layer inspired by the Divine project. This layer looks for broad theological patterns such as lament moving toward trust, conviction moving toward mercy, fear moving toward wise trust, harm named for protection, or isolation moving toward communion.

Divine remains a separate standalone website/project. It has not been merged into Shepherd, and Shepherd does not call Divine as a backend, API, database, or shared website runtime.

The current in-browser flow is:

```text
User input
-> transient Shepherd concern analysis
-> transient Divine Pattern analysis
-> selected voice response
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

## Voice-Shaped Reasoning

The selected voice changes reasoning emphasis, not just tone.

Current voices:

- Paul: grace, union with Christ, endurance, correction, community
- Augustine: disordered loves, confession, restlessness, desire
- C.S. Lewis: imagination, reason, pride, humility, moral clarity
- Bonhoeffer: costly obedience, community, discipleship, action
- Spurgeon: comfort, hope, tenderness, gospel assurance
- Thoughtful pastor: balanced pastoral care
- Trusted Christian friend: warm but honest companionship

Each voice can comfort, challenge, and disagree with the user's conclusion when needed.

## Dynamic Human Next Steps

The recommended next step changes based on the detected issue:

- Crisis or unsafe language: immediate human help, emergency support, crisis support, or safety planning
- Guilt or sin: confession, repentance, repair, accountability, and pastoral counsel
- Grief: pastor, mature Christian friend, grief support, prayerful community, or counselor
- Relationship conflict: mediator, pastor, priest, counselor, or mature Christian
- Theological confusion: pastor, priest, Bible study leader, or spiritual director
- Loneliness or isolation: one trusted person this week
- Medical or mental health language: doctor or counselor plus pastoral support

## Compare Faithful Perspectives

After the first response, Shepherd offers:

> Compare faithful perspectives

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

## Project Structure

```text
Shepherd/
  index.html
  styles.css
  app.js
  divine-pattern-engine.js
  README.md
```

## Development Notes

- `divine-pattern-engine.js` is dependency-free.
- Divine Pattern analysis is performed in memory only.
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
