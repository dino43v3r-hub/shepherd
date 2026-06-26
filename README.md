# Shepherd

Shepherd is a privacy-first AI-assisted pastoral reflection web app. It helps a person write out an issue, concern, grief, spiritual struggle, or question, then turns that input into a structured Christian reflection and pastoral care plan.

Version 1 is intentionally static. It does not connect to an AI API, does not create accounts, does not use a database, and does not permanently store user input.

## Core Purpose

Shepherd is a preparation and reflection tool. It can help a person organize thoughts before prayer, conversation, confession, pastoral care, counseling, or community discernment.

Shepherd is not a replacement for:

- A pastor, priest, deacon, elder, bishop, spiritual director, or mature Christian community
- A counselor, doctor, therapist, or other appropriate professional
- Emergency services or crisis support
- Trusted human relationships

## Privacy Model

The app displays the privacy statement:

> Your reflection is not saved.

Version 1 keeps user input only in browser/session memory:

- No login
- No database
- No permanent storage
- No analytics
- No AI API requests
- No browser localStorage or sessionStorage

Refreshing the page clears the in-memory flow. The Print / Save as PDF feature uses the browser print dialog only; Shepherd does not save, export, upload, or retain the reflection.

## User Flow

The user enters:

- What is weighing on them
- Whose voice or tone Shepherd should use
- Optional faith tradition / background, only if they want Shepherd to consider one

Shepherd avoids asking users to self-diagnose. The user names the burden and chooses a voice. Shepherd then transparently discerns the likely issue type, pastoral needs, Scripture themes, and next steps.

The user is not required to choose a reflection focus, role lens, grounding preference, care type, issue category, or Scripture category.

Shepherd does not merely affirm the user's assumptions. It compassionately reflects the user's concern, then tests the concern through Scripture, Christian wisdom, and the selected voice. When needed, it offers gentle correction without shame.

Shepherd analyzes the user's actual words before generating the reflection. Version 1 uses static rule-based functions:

- `extractConcernDetails()` identifies details such as emotions, relationship settings, desired actions, absolute language, safety language, and matched concern keywords.
- `scorePastoralNeeds()` scores multiple overlapping pastoral needs instead of relying on the first keyword match.
- `buildPersonalizedInsight()` summarizes what Shepherd noticed in the user's wording.
- `buildWisestNextStep()` uses extracted details, discernment results, and correction cautions to recommend a next step.

The final reflection includes:

1. Situation Summary
2. Key Themes
3. Reasoning Path
4. Compassionate Correction, only when needed
5. Scripture with Context
6. Christian Tradition Perspective
7. Reflection Questions
8. Suggested Prayer
9. 7-Day Pastoral Care Plan
10. Wisest Next Step
11. Boundaries and Cautions

## Reasoning Path

The Reasoning Path is a transparency section. It shows:

- What concern the user named
- The likely issue type Shepherd inferred
- The primary and secondary pastoral needs Shepherd inferred
- What themes were detected by the static mock logic
- Why those themes matter for prayer and discernment
- What Scripture themes were selected
- What care plan type was selected
- What wisest next step was recommended
- A confidence note explaining that Shepherd is pastoral preparation, not final authority

The Reasoning Path should help the user see how the reflection was structured. It should not be treated as a diagnosis, prophecy, counseling conclusion, or replacement for human pastoral care.

## Compassionate Correction

Shepherd includes a rule-based correction and discernment layer. The function `detectNeededCorrection(userConcern, extractedDetails, discernmentResult, selectedVoice)` looks for patterns that may need gentle testing, such as revenge, despair, false conclusions about God, shame that denies grace, bitterness, fear-led decision-making, isolation, confusing forgiveness with allowing continued harm, or confusing conviction with condemnation.

When correction is needed, Shepherd adds a Compassionate Correction section. This section should:

- Acknowledge pain or confusion without automatically agreeing with the user's conclusion
- Name what may need to be tested
- Speak in the selected voice
- Use Scripture or Christian wisdom as the anchor
- Avoid harsh, shaming, robotic, or preachy language
- Avoid pretending certainty

The correction also influences Scripture selection, reflection questions, the wisest next step, and the cautions section.

## Evidence Levels

Each major output section displays an evidence label:

- Scripture
- Christian tradition summary
- Pastoral wisdom
- User-provided reflection
- Caution / safety boundary

These labels help distinguish biblical context, denominational summaries, practical pastoral guidance, user-provided content, and safety cautions.

## Safety Boundaries

If the user's text includes crisis language related to self-harm, suicide, abuse, immediate danger, severe depression, violence, or emergencies, Shepherd does not generate a normal pastoral plan.

Instead, it displays a crisis/support message that:

- Says the app cannot handle emergencies
- Encourages immediate help from emergency services when danger is present
- Names crisis support, trusted clergy, trusted people, counselors, doctors, and appropriate professionals
- Encourages moving toward safety and human support right away

The crisis language check is simple static keyword logic in Version 1. It is not a clinical classifier.

## Pastoral Voice System

The voice settings change tone, vocabulary, warmth, and emphasis only.

Voice options:

- Gentle pastoral
- Trusted Christian friend
- Thoughtful theologian
- Direct and steady
- Warm family-style encouragement
- Neutral and clear

Important limitation: Shepherd must not pretend to be real clergy, a counselor, a doctor, or a final authority. The generated output explicitly states that voice settings only shape wording and emphasis.

## Denominational Perspective System

Version 1 includes static summaries for:

- General Christian
- Baptist
- Methodist/Wesleyan
- Reformed
- Lutheran
- Anglican
- Roman Catholic
- Eastern Orthodox
- Pentecostal/Charismatic

These are presented as summaries of common tradition emphases, not universal declarations. The app avoids absolute claims where traditions differ and encourages users to seek actual pastoral guidance within their community.

## Scripture Approach

Shepherd includes Scripture passages with short context notes. The goal is to avoid proof-texting by briefly explaining how each passage functions in its biblical context.

Future versions should expand this system with richer context, denominational sensitivity, and review by qualified Christian leaders from different traditions.

## User-Controlled Print

The Print / Save as PDF button calls the browser's print dialog. It does not create a server-side export, store a file, upload content, or keep a copy in the app.

## Running Locally

Open `index.html` in a browser. No build step is required.

## Project Structure

```text
Shepherd/
  index.html
  styles.css
  app.js
  README.md
```

## Future Roadmap

- Add a reviewed prompt system for optional AI-assisted generation
- Add an explicit consent step before any future API call
- Keep a no-storage mode as the default
- Improve print styling while keeping export user-controlled and storage-free
- Improve crisis detection and escalation language with professional review
- Expand Scripture context notes and denominational summaries
- Add richer reasoning transparency and user-editable assumptions
- Add accessibility testing and keyboard-flow refinements
- Add optional local-only draft saving controlled by the user
- Add pastoral-review workflows before any public deployment
