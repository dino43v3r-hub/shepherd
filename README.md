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

Refreshing the page clears the in-memory flow.

## User Flow

The user enters:

- Concern or issue
- Christian tradition
- Reflection focus
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
3. Scripture Passages with Context
4. Denominational Perspective
5. Reflection Questions
6. Optional Suggested Prayer
7. 7-Day Pastoral Care Plan
8. Recommended Human Next Step

## Safety Boundaries

If the user's text includes crisis language related to self-harm, suicide, abuse, immediate danger, severe depression, violence, or emergencies, Shepherd does not generate a normal pastoral plan.

Instead, it displays a crisis/support message that:

- Says the app cannot handle emergencies
- Encourages immediate help from emergency services when danger is present
- Names crisis hotline support, trusted people, clergy, counselors, doctors, and appropriate professionals
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

## Denominational Perspective System

Version 1 includes static summaries for:

- General Christian
- Baptist
- Methodist/Wesleyan
- Reformed
- Lutheran
- Anglican / 1928 Prayer Book
- Roman Catholic
- Eastern Orthodox
- Pentecostal/Charismatic

These are presented as summaries of common tradition emphases, not universal declarations. The app avoids absolute claims where traditions differ and encourages users to seek actual pastoral guidance within their community.

## Scripture Approach

Shepherd includes Scripture passages with short context notes. The goal is to avoid proof-texting by briefly explaining how each passage functions in its biblical context.

Future versions should expand this system with richer context, denominational sensitivity, and review by qualified Christian leaders from different traditions.

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
- Add export-to-PDF or print support without storing data
- Improve crisis detection and escalation language with professional review
- Expand Scripture context notes and denominational summaries
- Add accessibility testing and keyboard-flow refinements
- Add optional local-only draft saving controlled by the user
- Add pastoral-review workflows before any public deployment
