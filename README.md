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

- Concern or issue
- Christian tradition
- Reflection focus
- Shepherd mode
- Pastoral voice tone
- Role lens

Before creating a plan, Shepherd asks a few follow-up questions:

- How long have you been carrying this?
- Have you talked with anyone you trust about it?
- What have you already tried?
- What are you hoping God will help you discern?

The final reflection includes:

1. Situation Summary
2. Key Themes
3. Reasoning Path
4. Scripture with Context
5. Christian Tradition Perspective
6. Reflection Questions
7. Suggested Prayer
8. 7-Day Pastoral Care Plan
9. Recommended Human Next Step
10. Boundaries and Cautions

## Reasoning Path

The Reasoning Path is a transparency section. It shows:

- What concern the user named
- What themes were detected by the static mock logic
- Why those themes matter for prayer and discernment
- What Scripture category was selected
- What human next step was recommended
- A confidence note explaining that Shepherd is pastoral preparation, not final authority

The Reasoning Path should help the user see how the reflection was structured. It should not be treated as a diagnosis, prophecy, counseling conclusion, or replacement for human pastoral care.

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

Voice tone options:

- Female
- Male
- Neutral

Role lens options:

- Pastor / Priest
- Deacon / Deaconess
- Bishop / Elder
- Theologian
- Trusted Christian Friend
- Family-Style Encouragement

Important limitation: Shepherd must not pretend to be real clergy, a counselor, a doctor, or a final authority. The generated output explicitly states that voice settings only shape wording and emphasis.

## Shepherd Modes

Shepherd Modes change wording and emphasis only. They do not claim that the app is real clergy, a counselor, a doctor, a theologian, or final spiritual authority.

Mode options:

- Pastoral Care
- Theologian
- Trusted Christian Friend
- Decision Discernment
- Grief Support
- Habit / Sin Struggle

The selected mode affects:

- Tone
- Key themes
- Reflection questions
- 7-day care plan
- Recommended human next step

Mode logic is static and local. It does not use an AI API, store user input, or send data anywhere.

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
