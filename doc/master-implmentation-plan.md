# AP Learning Platform — Master Implementation Plan
**Your complete reference. Everything decided in planning — in one document.**

> Vision: The only AI-first AP Physics and Chemistry exam prep platform.  
> Target: US high school students preparing for AP exams.  
> Stack: React + Firebase + Claude API  
> IDE: Cursor (cursor.com)

---

## Table of Contents
1. [The Big Picture](#1-the-big-picture)
2. [Subject Roadmap](#2-subject-roadmap)
3. [Tech Stack](#3-tech-stack)
4. [Architecture — What Lives Where](#4-architecture--what-lives-where)
5. [Content Structure](#5-content-structure)
6. [AI Tutor Design](#6-ai-tutor-design)
7. [Student Engagement Rules](#7-student-engagement-rules)
8. [Monetization](#8-monetization)
9. [Competitive Positioning](#9-competitive-positioning)
10. [GEO — Getting AI Platforms to Recommend You](#10-geo--getting-ai-platforms-to-recommend-you)
11. [Phase-by-Phase Build Plan](#11-phase-by-phase-build-plan)
12. [Key Rules — Never Break These](#12-key-rules--never-break-these)
13. [Checklist — Before You Launch](#13-checklist--before-you-launch)

---

## 1. The Big Picture

### What you're building
An AI-powered AP exam prep website. Students study by unit, get an AI tutor that explains concepts, solves problems step by step, grades their free-response answers against the real AP rubric, and tracks their weaknesses automatically.

### Why this wins
| What nobody else has | Why it matters |
|---|---|
| AI tutor scoped to exact AP lesson | General AI gives generic answers. Yours knows exactly what unit the student is on. |
| FRQ grading vs real AP rubric | 50% of the AP exam is free response. No competitor grades it with AI. |
| Interactive physics/chemistry simulations | Seeing Newton's Second Law play out beats reading about it every time. |
| Weakness map per AP unit | After 20 problems the AI knows exactly what to drill — no student has to figure this out. |
| AP Physics + Chemistry bundled | One subscription, two high-stakes subjects. |

### Your positioning sentence
> "Khan Academy teaches you physics. Studdy solves your homework. We get you a 5 on the AP exam."

---

## 2. Subject Roadmap

Start narrow. Go deep. Expand only when Phase 1 is profitable.

```
Phase 1 (launch)     AP Physics 1 only
Phase 2 (month 4+)   Add AP Chemistry
Phase 3 (year 2)     AP Physics 2, AP Physics C
Phase 4 (year 3)     AP Biology, AP Calculus, AP Statistics
Phase 5 (year 4+)    Full AP science + math suite
```

### Why AP Physics 1 first
- ~300,000 students take it annually in the US
- High anxiety subject — students actively pay for help
- Your simulations advantage is strongest here (forces, waves, circuits)
- College Board curriculum is public — structure is handed to you

### Why AP Chemistry second
- ~160,000 students annually
- Shares the same platform architecture — reuse 80% of code
- Molecular simulations (titration, reactions) differentiate from competitors
- Natural bundling with Physics ("AP Science Bundle — $24.99/mo")

---

## 3. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | React + Vite | Fast, component-based, you know Firebase already |
| Backend / DB | Firebase Firestore | Real-time, scalable, no server to manage |
| Auth | Firebase Auth | Google SSO, email/password, role management |
| AI Tutor | Claude API (Sonnet) | Best at step-by-step reasoning and AP-level science |
| Math rendering | KaTeX | Faster than MathJax, renders F=ma and chemical formulas |
| Physics sims | HTML Canvas + Matter.js | Lightweight, browser-native, no install |
| Chemistry sims | Kekule.js | Open-source, handles molecular structures |
| Payments | Stripe (web) | 2.9% fee vs Apple/Google's 30% |
| Hosting | Firebase Hosting | One command deploy, global CDN |
| IDE | Cursor | AI writes code in your files as you describe what you want |
| Version control | GitHub (private) | Save every version, roll back if AI breaks something |
| API testing | Postman | Test Claude prompts before coding |

### Cost reality at scale
At 100 students using AI 5 questions/day for 20 days:
- Claude API cost: ~$15–50/month total
- Per student: ~$0.50/month
- You charge: $19.99/month
- Gross margin: ~97% before other costs

---

## 4. Architecture — What Lives Where

### The golden rule
> Content in the database. Logic on the server. Intelligence in the AI. UI only renders.

### Frontend (React) stores
- Current tab / active lesson (temporary)
- Chat messages for current session only
- Form inputs and loading states
- Simulation state (sliders, ball position)

### Frontend never stores
- Correct answers to problems
- API keys (never, ever)
- Student scores (truth lives in Firestore)
- Subscription status

### Firestore collections
```
/subjects/{subjectId}
/subjects/{subjectId}/units/{unitId}
/subjects/{subjectId}/units/{unitId}/lessons/{lessonId}
  → title, apTopic, conceptNote (markdown), simType, xpReward
/subjects/{subjectId}/units/{unitId}/lessons/{lessonId}/problems/{problemId}
  → question, options[], correctIndex (server-only), explanation, difficulty
/users/{userId}
  → name, email, plan, stripeCustomerId, subjects[]
/users/{userId}/progress/{lessonId}
  → completed, score, attempts, weakConcepts[]
/users/{userId}/chatHistory/{sessionId}
  → lessonId, messages[], createdAt
```

### Firebase Functions (server-side only)
- Proxy ALL Claude API calls — key never touches browser
- Validate answers and write scores to Firestore
- Handle Stripe webhooks
- Generate weekly progress reports
- Enforce daily AI question limits (20/day per student)

### Three security rules that cannot be broken
1. API key lives only in Firebase Functions environment variables
2. Correct answers validated server-side — never sent to browser
3. All Claude calls go through your server — never client → Claude directly

---

## 5. Content Structure

### Every lesson has exactly 4 parts (always in this order)

| Part | Type | Built once or live? | Cost |
|---|---|---|---|
| Concept note | Written markdown + diagrams | Built once | Your time |
| AI Tutor | Claude API chat | Generates live | ~$0.004/question |
| Interactive simulation | JavaScript canvas | Built once per concept | Developer time |
| Practice problems | 10–18 MCQ + FRQ | Built once (AI drafts, you review) | Your time |

### AP Physics 1 — Unit 1 example (replicate for all 7 units)
```
Unit 1: Kinematics
  Lesson 1: Position, displacement & distance
  Lesson 2: Velocity & speed
  Lesson 3: Acceleration
  Lesson 4: Kinematic equations (the 4 big ones)
  Lesson 5: Projectile motion
  → 5 lessons × 4 parts = 20 content items
  → At 2–3 items/day = Unit 1 live in ~2 weeks
```

### Content creation efficiency
- Concept notes: Write yourself or use Claude to draft, then review
- Practice problems: Prompt Claude to generate 50, keep the best 15
- FRQ rubrics: Copy directly from College Board's public released rubrics
- Simulations: One developer builds the JS template; swap parameters per lesson
- AI tutor responses: Zero prep — Claude generates live every time

### Firestore content document shape
```javascript
// lessons/{lessonId}
{
  title: "Position, displacement & distance",
  apTopic: "1.A",
  unitId: "unit-1-kinematics",
  subjectId: "ap-physics-1",
  conceptNote: "## Position\nIn kinematics...", // markdown
  simType: "numberline",
  estimatedMinutes: 15,
  xpReward: 20,
  order: 1
}
```

---

## 6. AI Tutor Design

### System prompt structure (store in Firebase, not hardcoded)
```
You are an AP {subject} tutor helping a high school student.
Current lesson: {lessonTitle} — College Board Topic {apTopic}
Student's weak concepts this unit: {weakConcepts[]}
Exam date: {daysUntilExam} days away.

Rules:
- Use casual, encouraging language — not textbook voice
- Always show step-by-step working for calculations
- Use AP exam language (free-body diagram, net force, delta-x)
- Maximum 250 words per response
- End with one follow-up question to check understanding
- Never give a final FRQ answer directly — guide with hints first
```

### Four response modes (AI picks based on question type)
| Student says | AI mode | What it does |
|---|---|---|
| "Why does X work?" | Concept explain | Analogy + formula + real example |
| "Solve this problem" | Step-by-step solver | Identify → formula → solve → check units |
| "Is my answer right?" | Answer checker | Right/wrong + exactly what went wrong |
| "I'm stuck" | Socratic hint | Leading question, never gives full answer |

### Cost controls (implement from day 1)
- 20 AI questions per student per day (enforced in Firebase Function)
- Max 400 output tokens per response
- Cache top 50 most-asked questions per unit in Firestore
- System prompt kept under 300 words (every call includes it)

### AI tutor tone examples
```
❌ "Incorrect. The net force equals mass times acceleration."
✓  "Good thinking — that's the most common mistake on this FRQ!
    The key is that F=ma uses NET force, not just one force.
    What other forces are acting on the object?"

❌ "The displacement formula is Δx = x_f - x_i"
✓  "Here's the trick: displacement only cares about start
    and finish — not the path. Walk 10m east then 10m west?
    Displacement = 0. Distance = 20m. Make sense?"
```

---

## 7. Student Engagement Rules

High schoolers close the tab if it feels like homework. They stay for hours if it feels like a game they're winning. Every design decision should pass this test: **does this make a student feel like they're winning?**

### The four engagement pillars

**1. Make progress visible instantly**
- XP bar fills after every problem
- Predicted AP score updates as they improve (this is your viral feature)
- Streak counter — days studied in a row
- "You've answered 47 AP-style questions this week" summary
- Unit completion percentage on dashboard

**2. Make sessions short and complete**
- Design for 10-minute sessions, not 45-minute ones
- One lesson → one sim → 5 problems = one complete session
- Daily challenge: one hard problem per day (takes 3 minutes)
- Quick-fire mode: 10 MCQ, timed, instant results

**3. Add social proof and competition**
- Class leaderboard (opt-in — some students hate this, make it optional)
- Shareable score card for Instagram/Discord
- "3 friends are also prepping for AP Physics" social nudge
- Achievement badges for milestones (first perfect score, 7-day streak, etc.)

**4. AI personality — cool tutor, not textbook**
- Casual, warm, never condescending
- Acknowledges difficulty: "This one trips literally everyone up"
- Celebrates wins: "That's a 4-point answer right there"
- Exam countdown clock creates natural urgency

### The viral loop
```
Student uses platform
→ Score improves (visible on dashboard)
→ Student shares "I went from 3 to 4 on my practice exam"
→ Friend in AP class asks "what are you using?"
→ New student signs up
→ Repeat
```

---

## 8. Monetization

### Pricing model
| Plan | Price | Who it's for |
|---|---|---|
| Free | $0 | 3 lessons + 10 problems/day (taste test) |
| Student Monthly | $19.99/mo | Individual student, full access |
| Student Annual | $99/year | ~$8.25/mo — 58% off, push this |
| AP Bundle | $24.99/mo | Physics + Chemistry together |
| School License | $8/student/mo | Min 20 students, teacher dashboard included |

### Revenue math
```
500 students × $99/year = $49,500/year
  minus Claude API (~$600/year at this scale)
  minus Stripe fees (~$1,400/year)
  = ~$47,500 net (before any other costs)

1,000 students × $99/year = $99,000/year
  This is achievable in year 1 with strong AP community presence
```

### Always use Stripe on web (never Apple/Google IAP for web)
- Stripe takes 2.9% — Apple/Google take 30%
- At 500 students × $99/year: Stripe costs $1,435 vs Apple $14,850
- Save ~$13,000/year just by collecting payments on the web

### School sales strategy (add in Phase 2)
- One teacher who loves your platform will push it to their school
- Offer 30-day free trial for entire class
- Teacher dashboard is the unlock — shows which students are behind
- School license removes individual payment friction entirely

---

## 9. Competitive Positioning

### The market in one table
| Competitor | Their strength | Their gap | Your advantage |
|---|---|---|---|
| Khan Academy | Brand, free, Socratic AI | Too broad, no FRQ grading, no sims | AP-only depth |
| Studdy AI | Photo scan, homework help | No AP structure, no exam prep | Exam prep focus |
| UWorld | Deep question bank, aligned to AP | Zero AI, static content only | Live AI tutor |
| Fiveable | AP structure, study guides | Covers 40 subjects — shallow on physics | Physics/Chem specialist |
| Albert.io | Excellent practice questions | No teaching, no AI | AI teaches + practices |

### Features nobody has (your moat)
1. AI FRQ grading against real College Board rubric
2. Lesson-specific interactive simulations
3. AI weakness map by AP unit, updated automatically
4. AP score prediction that updates in real time

### One feature to add early: photo scan
Studdy's photo scan (point camera at a problem, get instant help) is now a baseline student expectation. Add it using Claude's vision capability. Without it your platform feels incomplete compared to what students are used to.

---

## 10. GEO — Getting AI Platforms to Recommend You

**GEO = Generative Engine Optimization.** The strategy of getting ChatGPT, Claude, Perplexity and others to recommend your platform when students or parents ask "what's the best AP Physics prep site?"

You cannot pay for this or set it up technically. AI models recommend platforms they have seen cited frequently and positively across the web. This takes 6–12 months of consistent effort.

### The 5 actions, in priority order

**1. Engage on Reddit (start immediately, before launch)**
- r/APStudents — 500k+ members, AP students ask questions daily
- r/Physics, r/HomeworkHelp
- Genuinely answer AP Physics questions. Mention your platform only when directly relevant.
- When students ask "best AP Physics resource?" — be present in that thread.
- Reddit is heavily indexed by all AI models. One upvoted comment lasts years.

**2. Publish free resources that get linked (before launch)**
- "Complete AP Physics 1 Formula Sheet 2026" — one-page PDF, free download
- "Every AP Physics 1 FRQ 2018–2025 with full solutions" — teachers will link this
- "AP Physics 1 Score Calculator" — interactive tool, students share it
- Each of these lives on your site. Teachers linking from school websites = .edu backlinks = very high AI trust signal.

**3. Write content that directly answers AI search queries**
On your site/blog, publish pages that answer exactly what students type into AI:
- "How to study for AP Physics 1 in 2 weeks"
- "AP Physics 1 2026 exam format and changes"
- "How is AP Physics 1 FRQ scored?"
- "What score do I need on AP Physics to get a 5?"
Each question gets its own URL with a direct, thorough answer.

**4. Collect and publish student results**
- "I went from a predicted 3 to a 5 — here's what I did" (student story)
- Post these on your site, Reddit, and YouTube descriptions
- AI models treat user reviews and outcome data as citation-worthy

**5. Add structured data to your website (technical, one-time)**
Add schema.org markup to your pages. Ask Cursor to do this:
```
"Add EducationalOrganization, Course, and FAQPage schema markup
to my React app's head section"
```
This signals to AI crawlers exactly what your platform is and who it serves.

---

## 11. Phase-by-Phase Build Plan

### Phase 1 — MVP (weeks 1–8) — AP Physics 1 only
**Goal: First paying student**

- [ ] Set up React + Firebase project in Cursor
- [ ] Firebase Auth (Google SSO + email)
- [ ] Firestore schema (subjects, units, lessons, problems, users, progress)
- [ ] Unit 1: Kinematics — all 5 lessons, concept notes, 50 practice problems
- [ ] KaTeX integration for math rendering
- [ ] Claude API connected via Firebase Function (AI tutor chat)
- [ ] Basic lesson page UI (4 tabs: Concept / Sim / AI Tutor / Practice)
- [ ] Number line simulation (Lesson 1)
- [ ] Projectile motion simulation (Lesson 5)
- [ ] Student progress tracking (XP, completion %)
- [ ] Stripe payment integration ($19.99/mo)
- [ ] Predicted AP score on dashboard
- [ ] Mobile responsive design
- [ ] Deploy to Firebase Hosting
- [ ] Get 10 beta students (free) — AP students you know or from Reddit
- [ ] Collect feedback, fix issues
- [ ] Start charging after 10 students validate it

### Phase 2 — Expand (months 3–6) — All 7 units + Chemistry
**Goal: 200 paying students**

- [ ] Complete Units 2–7 for AP Physics 1
- [ ] AP Chemistry subject structure (units, lessons, problems)
- [ ] Chemistry simulations (titration curve, molecular viewer)
- [ ] FRQ grader — AI grades against AP rubric, shows points earned
- [ ] Photo scan — Claude vision API, student photographs a problem
- [ ] Weakness map — per unit, auto-updated after each session
- [ ] Teacher dashboard (assign, monitor, progress reports)
- [ ] AP Bundle pricing ($24.99/mo Physics + Chemistry)
- [ ] School license pricing ($8/student/mo, min 20)
- [ ] Reddit community presence (r/APStudents)
- [ ] Free formula sheet + FRQ archive pages published

### Phase 3 — Scale (months 7–18) — PWA + Mobile
**Goal: 1,000 paying students**

- [ ] Progressive Web App (installable from browser, partial offline)
- [ ] Daily challenge feature (one hard problem per day, push notification via browser)
- [ ] Leaderboard (opt-in, class-based)
- [ ] Shareable score card (student exports progress image for Instagram)
- [ ] Achievement badges system
- [ ] Streak tracking and reminders
- [ ] Capacitor wrapper → iOS App Store submission
- [ ] Capacitor wrapper → Google Play submission
- [ ] AP Physics 2 subject added
- [ ] GEO content library (20+ SEO + AI-optimized articles)

### Phase 4 — Platform (year 2+)
**Goal: 5,000+ students, school district contracts**

- [ ] AP Physics C (Mechanics + E&M)
- [ ] AP Biology
- [ ] AP Calculus AB/BC
- [ ] AP Statistics
- [ ] District dashboard and LMS integration (Google Classroom, Canvas)
- [ ] Live tutoring marketplace (human tutors for 1:1 sessions)
- [ ] AI-generated personalized study plans
- [ ] Parent portal

---

## 12. Key Rules — Never Break These

### Security
1. Claude API key lives ONLY in Firebase Functions environment variables — never in React code
2. Correct answers validated server-side only — never sent to the browser
3. All Claude API calls go through your Firebase Function — never client → Claude directly
4. Stripe webhooks verified server-side — never trust client for subscription status

### Architecture
5. Content (lessons, problems, rubrics) lives in Firestore — never hardcoded in React
6. One lesson template, infinite content — build the template once, swap content
7. AI tutor system prompt stored in Firestore — change tone/rules without redeploying

### Product
8. Every session must feel complete in 10 minutes — design for short sessions
9. Predicted AP score updates after every session — this is your #1 retention feature
10. Photo scan must work — it is a baseline expectation for students in 2026

### Business
11. Always collect payments on the web via Stripe — never push students to pay through iOS/Android app (saves 27% in fees)
12. Always ask for school/teacher referrals — one teacher = 30 students at once
13. Free tier must be genuinely useful (3 full lessons) — bad free tiers kill word-of-mouth

---

## 13. Checklist — Before You Launch

### Technical
- [ ] Claude API key is in Firebase Functions env vars, not in any React file
- [ ] Correct answers are never returned to the browser
- [ ] All Claude calls route through Firebase Functions
- [ ] KaTeX renders equations correctly on all browsers
- [ ] Site loads in under 3 seconds on mobile
- [ ] Stripe payment completes successfully in test mode
- [ ] Firebase Auth works with Google SSO

### Content
- [ ] Unit 1 all 5 lessons have concept notes
- [ ] At least 50 practice problems in Unit 1
- [ ] At least 2 interactive simulations working
- [ ] AI tutor system prompt reviewed and tuned
- [ ] FRQ grader tested against at least 3 real past FRQs

### Student experience
- [ ] Predicted AP score shows on dashboard
- [ ] XP and progress bar work after completing a lesson
- [ ] Mobile version tested on actual phone
- [ ] 10 beta students have used it and given feedback
- [ ] Onboarding takes under 2 minutes (signup → first lesson)

### GEO / Marketing
- [ ] Free AP Physics 1 formula sheet page live on your site
- [ ] Reddit account created, first 5 genuine posts in r/APStudents
- [ ] Google Analytics installed
- [ ] Schema.org markup added to site

---

## Quick Reference — When You're Stuck

| Problem | Solution |
|---|---|
| "How do I build X?" | Open Cursor, press Cmd+K, describe it in English |
| "My AI response costs too much" | Reduce system prompt, cap max_tokens at 400, cache common answers |
| "Students aren't coming back" | Check if predicted score is showing — that's the #1 retention feature |
| "Nobody is finding my site" | Post genuinely on r/APStudents, publish the free FRQ archive |
| "A school wants to sign up" | Offer 30-day free trial for the class, present the teacher dashboard |
| "Should I add a new subject?" | Only after current subject has 200+ paying students |
| "AI gives wrong physics answers" | Add "double-check your physics calculations" to system prompt, add more context |

---

*Document compiled from full product planning session — March 2026*  
*Update this document as decisions change. Keep it in your GitHub repo.*