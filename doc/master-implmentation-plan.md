# Scorr — Master Implementation Plan
**Your complete reference. Everything decided in planning — in one document.**

> **Platform name:** Scorr  
> **Domain:** scorr.ai (registered — Namecheap, 2 years)  
> **Vision:** The only AI-first AP Physics and Chemistry exam prep platform  
> **Target:** US high school students preparing for AP exams  
> **Stack:** Next.js + Vercel + Supabase + Claude API  
> **IDE:** Cursor (cursor.com)  
> **Last updated:** March 2026

---

## Table of Contents
1. [The Big Picture](#1-the-big-picture)
2. [Subject Roadmap](#2-subject-roadmap)
3. [Tech Stack](#3-tech-stack)
4. [Architecture — What Lives Where](#4-architecture--what-lives-where)
5. [Database Schema](#5-database-schema)
6. [Content Structure](#6-content-structure)
7. [AI Tutor Design](#7-ai-tutor-design)
8. [Student Engagement Rules](#8-student-engagement-rules)
9. [Monetization](#9-monetization)
10. [Competitive Positioning](#10-competitive-positioning)
11. [GEO — Getting AI Platforms to Recommend You](#11-geo--getting-ai-platforms-to-recommend-you)
12. [Phase-by-Phase Build Plan](#12-phase-by-phase-build-plan)
13. [Key Rules — Never Break These](#13-key-rules--never-break-these)
14. [Checklist — Before You Launch](#14-checklist--before-you-launch)
15. [Quick Reference — When You're Stuck](#15-quick-reference--when-youre-stuck)

---

## 1. The Big Picture

### What you're building
An AI-powered AP exam prep website called **Scorr** at **scorr.ai**. Students study by unit, get an AI tutor that explains concepts, solves problems step by step, grades their free-response answers against the real AP rubric, and tracks their weaknesses automatically.

### Why this wins
| What nobody else has | Why it matters |
|---|---|
| AI tutor scoped to exact AP lesson | General AI gives generic answers. Yours knows exactly what unit the student is on. |
| FRQ grading vs real AP rubric | 50% of the AP exam is free response. No competitor grades it with AI. |
| Interactive physics/chemistry simulations | Seeing Newton's Second Law play out beats reading about it every time. |
| Weakness map per AP unit | After 20 problems the AI knows exactly what to drill — no student has to figure this out. |
| AP Physics + Chemistry bundled | One subscription, two high-stakes subjects. |
| Photo scan | Student photographs any problem, AI solves and explains it. |

### Your positioning sentence
> "Khan Academy teaches you physics. Studdy solves your homework. Scorr gets you a 5 on the AP exam."

### Brand
- **Name:** Scorr
- **Domain:** scorr.ai
- **Tagline options:** "Know your score before exam day" / "Built for the 5" / "Study less. Score more."
- **Colors:** Deep navy + electric teal
- **Feel:** Confident, modern, student-friendly — not academic or textbook

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
- College Board curriculum is fully public — structure is handed to you

### Why AP Chemistry second
- ~160,000 students annually
- Shares 80% of platform code — reuse everything
- Molecular simulations (titration, reactions) differentiate from competitors
- Natural bundling: "AP Science Bundle — $24.99/mo"

### You don't need to be a physics expert
- College Board publishes every topic, objective, and FRQ rubric publicly — free at apcentral.collegeboard.org
- Claude drafts all content — you curate and organize
- Hire one AP Physics teacher at $15–25/hour to review each unit for accuracy
- Budget $75–100 per unit reviewed — $500 total for all of AP Physics 1
- Cross-check everything against College Board CED and Khan Academy

---

## 3. Tech Stack

### Final stack decision — Vercel + Supabase + Next.js
Chosen for long-term foundation over Firebase. Better data model for relational data (students → progress → lessons), more powerful admin dashboard, predictable pricing at scale, open-source (no vendor lock-in).

| Layer | Tool | Why chosen |
|---|---|---|
| Frontend framework | Next.js (React) | Built by Vercel, SSR for SEO, API routes built in, file-based routing |
| Hosting | Vercel | Auto-deploys on every GitHub push, zero config, best-in-class for Next.js |
| Database | Supabase (PostgreSQL) | SQL — handles relational data perfectly, powerful dashboard, open source |
| Auth | Supabase Auth | Google SSO built in, row-level security, easy to customize |
| Storage | Supabase Storage | Student uploads, diagrams, images |
| AI Tutor | Claude API (Sonnet) | Best at step-by-step reasoning and AP-level science |
| AI proxy | Next.js API Routes | Claude key never touches browser — server-side only |
| Math rendering | KaTeX | Faster than MathJax, renders F=ma and chemical formulas beautifully |
| Physics sims | HTML Canvas + Matter.js | Lightweight, browser-native, interactive |
| Chemistry sims | Kekule.js | Open-source, handles molecular structures |
| Styling | Tailwind CSS | Utility-first, fast to build, no separate CSS files |
| Payments | Stripe | 2.9% fee vs Apple/Google's 30% |
| IDE | Cursor | AI writes code in your files as you describe what you want |
| Version control | GitHub (private repo: scorr) | Save every version, auto-deploys to Vercel on push |
| API testing | Postman | Test Claude prompts before coding |

### Personal accounts setup
| Account | Email to use | Why |
|---|---|---|
| Google Workspace | admin@scorr.ai | Business owns everything — not personal Gmail |
| Supabase | admin@scorr.ai | All DB resources under company account |
| Vercel | admin@scorr.ai | Hosting under company account |
| GitHub | admin@scorr.ai | Code repo under company account |
| Anthropic Console | admin@scorr.ai | API keys under company account |
| Stripe | admin@scorr.ai | Payments under company account |
| Namecheap | admin@scorr.ai | Domain already registered |

### Claude accounts — two separate things
| Tool | Purpose | Cost |
|---|---|---|
| Claude.ai Pro | Your personal AI — planning, writing content, generating code to paste into Cursor | $20/month (already paying) |
| Anthropic Console | API budget — powers the AI tutor inside Scorr for students | $5 loaded, pay-as-you-go |

**$5 Console budget covers entire MVP development phase** (~1,250 student questions). Top up to $20 when beta students start using it.

### Cost reality at scale
```
At 100 students, 5 AI questions/day, 20 days/month:
  Claude API cost:  ~$15–50/month total
  Per student:      ~$0.50/month
  You charge:       $19.99/month
  Gross margin:     ~97%

Supabase free tier covers first 500 students (50k MAU, 500MB DB)
Vercel free tier covers hosting until serious traffic
```

### Project setup commands
```bash
# Create project
npx create-next-app@latest scorr \
  --typescript --tailwind --eslint --app --src-dir

cd scorr

# Install Supabase
npm install @supabase/supabase-js @supabase/ssr

# Install payments
npm install stripe @stripe/stripe-js

# Push to GitHub
git init
git add .
git commit -m "initial scorr setup"
git remote add origin https://github.com/yourusername/scorr.git
git push -u origin main
```

### Environment variables (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_claude_api_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public
```

**Never commit .env.local to GitHub. Add it to .gitignore immediately.**

### Folder structure
```
scorr/
  src/
    app/
      (auth)/
        login/page.tsx
        signup/page.tsx
      (dashboard)/
        dashboard/page.tsx
        lesson/[id]/page.tsx
        unit/[id]/page.tsx
      api/
        tutor/route.ts          ← Claude API proxy
        stripe/webhook/route.ts
      layout.tsx
      page.tsx                  ← landing page
    components/
      lesson/
        ConceptNote.tsx
        Simulation.tsx
        AITutor.tsx
        PracticeProblems.tsx
      ui/
        Button.tsx
        Card.tsx
        ProgressBar.tsx
    lib/
      supabase.ts
      stripe.ts
      claude.ts
  .env.local                    ← never commit this
  .gitignore
  tailwind.config.ts
```

---

## 4. Architecture — What Lives Where

### The golden rule
> Content in the database. Logic on the server. Intelligence in the AI. UI only renders.

### Frontend (Next.js) stores
- Current tab / active lesson (React state — temporary)
- Chat messages for current session only
- Form inputs and loading states
- Simulation state (sliders, ball position)

### Frontend never stores
- Correct answers to problems (validated server-side only)
- API keys (never, ever — not even in browser env vars)
- Student scores (truth lives in Supabase)
- Subscription status (always verify from server)

### Server (Next.js API Routes) handles
- All Claude API calls — key never touches browser
- Answer validation — correct_index never sent to client
- Stripe webhook processing
- Daily AI question limit enforcement (20/day per student)
- Weekly progress report generation

### Three security rules that cannot be broken
1. **Claude API key** lives ONLY in server environment variables — never in any client code
2. **Correct answers** validated server-side only — `correct_index` never returned to browser
3. **All Claude calls** go through Next.js API routes — never client → Claude directly

---

## 5. Database Schema

Run this in Supabase SQL Editor before writing any code.

```sql
-- Subjects (AP Physics 1, AP Chemistry etc)
create table subjects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  ap_exam_date date,
  total_units int default 0,
  created_at timestamptz default now()
);

-- Units (Unit 1: Kinematics etc)
create table units (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  title text not null,
  description text,
  order_num int not null,
  total_lessons int default 0,
  created_at timestamptz default now()
);

-- Lessons
create table lessons (
  id uuid default gen_random_uuid() primary key,
  unit_id uuid references units(id) on delete cascade,
  title text not null,
  ap_topic text,
  concept_note text,       -- markdown content
  sim_type text,           -- 'numberline' | 'projectile' | 'ramp' etc
  estimated_minutes int default 15,
  xp_reward int default 20,
  order_num int not null,
  created_at timestamptz default now()
);

-- Problems (correct_index never sent to client)
create table problems (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references lessons(id) on delete cascade,
  question text not null,
  options jsonb,            -- ["option A", "option B", "option C", "option D"]
  correct_index int not null, -- 0-3, server-side only
  explanation text,
  difficulty int default 1 check (difficulty between 1 and 3),
  concept text,
  created_at timestamptz default now()
);

-- User profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) primary key,
  name text,
  email text,
  plan text default 'free',  -- 'free' | 'student' | 'bundle' | 'school'
  stripe_customer_id text,
  subjects text[] default '{}',
  created_at timestamptz default now()
);

-- Student progress per lesson
create table progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  completed boolean default false,
  score int default 0,
  attempts int default 0,
  xp_earned int default 0,
  weak_concepts text[] default '{}',
  last_seen timestamptz default now(),
  unique(user_id, lesson_id)
);

-- AI chat history
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  messages jsonb default '[]',
  created_at timestamptz default now()
);

-- Daily AI usage (rate limiting — 20 questions/day)
create table ai_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  date date default current_date,
  question_count int default 0,
  unique(user_id, date)
);
```

### Row Level Security (run immediately after schema)
```sql
-- Enable RLS
alter table profiles enable row level security;
alter table progress enable row level security;
alter table chat_sessions enable row level security;
alter table ai_usage enable row level security;

-- Users see only their own data
create policy "Users see own profile"
  on profiles for all using (auth.uid() = id);

create policy "Users see own progress"
  on progress for all using (auth.uid() = user_id);

create policy "Users see own chats"
  on chat_sessions for all using (auth.uid() = user_id);

create policy "Users see own usage"
  on ai_usage for all using (auth.uid() = user_id);

-- Content is public
create policy "Subjects are public"
  on subjects for select using (true);

create policy "Units are public"
  on units for select using (true);

create policy "Lessons are public"
  on lessons for select using (true);

create policy "Problems visible (no correct_index)"
  on problems for select using (true);
```

### Useful SQL queries for business insights (Supabase dashboard)
```sql
-- Which units have lowest completion rates?
SELECT u.title, 
  COUNT(p.id) as total_attempts,
  AVG(p.score) as avg_score,
  SUM(CASE WHEN p.completed THEN 1 ELSE 0 END) as completions
FROM units u
JOIN lessons l ON l.unit_id = u.id
JOIN progress p ON p.lesson_id = l.id
GROUP BY u.title ORDER BY avg_score ASC;

-- How many students completed Unit 1 this week?
SELECT COUNT(DISTINCT p.user_id)
FROM progress p
JOIN lessons l ON p.lesson_id = l.id
JOIN units u ON l.unit_id = u.id
WHERE u.order_num = 1
AND p.completed = true
AND p.last_seen > now() - interval '7 days';

-- Students by plan
SELECT plan, COUNT(*) FROM profiles GROUP BY plan;
```

---

## 6. Content Structure

### Every lesson has exactly 4 parts (always in this order)

| Part | Type | Built once or live? | Cost |
|---|---|---|---|
| Concept note | Text + diagrams (markdown) | Built once | Your time |
| Interactive simulation | JavaScript canvas | Built once per concept | Developer time |
| AI Tutor | Claude API chat | Generates live | ~$0.004/question |
| Practice problems | 10–18 MCQ + FRQ | Built once (AI drafts, you review) | Your time |

### Content format — text and images, not video (Phase 1)

**Why no video in Phase 1:**
- Recording + editing one 10-min physics video = 3–5 hours
- 35 lessons = 100–175 hours before first paying student
- Curriculum changes require re-recording — text edits in 5 minutes
- Your AI tutor beats video — it responds to exactly what the student asks

**What a text lesson looks like:**
```
LESSON 1: Position, Displacement & Distance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Key Idea
Distance and displacement are NOT the same thing.
One is a scalar. One is a vector.

POSITION: Where an object is relative to a reference point
DISTANCE: Total path length. Always positive. Scalar.
DISPLACEMENT: Straight-line start → finish. Has direction. Vector.

Formula:  Δx = x_final − x_initial

📝 Worked Example
Walk 8 m east, then 3 m west.
  Distance    = 8 + 3 = 11 m
  Displacement = 8 − 3 = 5 m east

⚠️ AP Exam Trap
"How far from starting point?" = displacement
"How far did you travel?" = distance
These are different questions. Read carefully.
```

**Add video in Phase 2 using:**
- Synthesia or HeyGen — type a script, AI generates a presenter video. No camera. ~$30/month
- Loom — record your screen solving FRQs. Free. Takes 15 minutes per problem.
- Selective YouTube embeds — Khan Academy for complex concepts. Keep students on your page.

### AP Physics 1 — Unit 1 example
```
Unit 1: Kinematics (AP Topics 1.A–1.E)
  Lesson 1: Position, displacement & distance  → sim: number line walker
  Lesson 2: Velocity & speed                   → sim: position-time graph
  Lesson 3: Acceleration                        → sim: ramp with slider
  Lesson 4: Kinematic equations                 → sim: equation picker
  Lesson 5: Projectile motion                   → sim: projectile launcher

5 lessons × 4 parts = 20 content items
At 2–3 items/day = Unit 1 live in ~2 weeks
```

### Content creation workflow
```
1. Open Claude.ai Pro (this chat)
2. Prompt: "Write a concept note for AP Physics 1 Lesson 1:
   Position, displacement and distance. Markdown format,
   max 250 words, one worked example, one AP exam tip.
   Follow College Board topic 1.A."
3. Claude writes it in 30 seconds
4. Paste into Google Doc for review
5. Send to AP Physics teacher reviewer ($20/hr)
6. Teacher approves → paste into Supabase lessons table
```

### Content creation costs
| Content | Who creates | Time | Cost |
|---|---|---|---|
| Concept notes | Claude drafts, you review | 30 min/lesson | $0 |
| Practice problems | Claude generates 50, keep 15 | 20 min/lesson | $0 |
| FRQ rubrics | Copy from College Board (public) | 10 min/lesson | $0 |
| Simulations | Cursor builds JS canvas | 2–4 hrs/sim | $0 |
| Physics review | AP teacher, per unit | 3 hrs/unit | $75 |
| AI tutor responses | Claude generates live | Zero prep | API cost |

**Total content cost for AP Physics 1 Unit 1: ~$75**

---

## 7. AI Tutor Design

### How it works technically
```
Student types question in lesson page
  ↓
Next.js API route (src/app/api/tutor/route.ts)
  ↓
Check ai_usage table — enforce 20/day limit
  ↓
Build system prompt (lesson context + student history)
  ↓
Call Claude API (server-side — key never in browser)
  ↓
Return response to student
  ↓
Log to chat_sessions table
  ↓
Update weak_concepts in progress table
```

### System prompt structure
```
You are an AP {subject} tutor for a high school student preparing
for the May AP exam.

Current lesson: {lessonTitle} — College Board Topic {apTopic}
Student's weak concepts in this unit: {weakConcepts[]}
Days until AP exam: {daysUntilExam}

Rules:
- Use casual, encouraging language — not textbook voice
- Always show step-by-step working for calculations
- Use AP exam language (free-body diagram, net force, delta-x)
- Maximum 250 words per response
- End with one follow-up question to check understanding
- For FRQs: guide with hints first, never give full answer directly
- Acknowledge difficulty: "This trips everyone up" when relevant
```

### Four response modes (Claude picks based on question)
| Student says | Mode | What Claude does |
|---|---|---|
| "Why does X work?" | Concept explain | Analogy + formula + real example |
| "Solve this problem" | Step-by-step solver | Identify → formula → solve → check units |
| "Is my answer right?" | Answer checker | Right/wrong + exactly what went wrong |
| "I'm stuck" | Socratic hint | Leading question — never gives full answer |

### Tone examples
```
❌ "Incorrect. The net force equals mass times acceleration."

✓  "Good thinking — that's actually the most common mistake on
    this FRQ! The key is that F=ma uses NET force, not just one
    force. What other forces are acting on the object here?"
```

### Cost controls (implement from day 1)
- 20 AI questions per student per day (enforced in API route)
- Max 400 output tokens per response
- Cache top 50 most-asked questions per lesson in Supabase
- System prompt kept under 300 words
- Set $10/month spend limit in Anthropic Console immediately

### Claude API route (tell Cursor to build this)
> *"Create a Next.js API route at src/app/api/tutor/route.ts that accepts POST with lessonTitle, apTopic, weakConcepts, and studentQuestion. Check the ai_usage Supabase table to enforce 20 questions/day limit. Call Claude API with AP tutor system prompt. Return the response. Use ANTHROPIC_API_KEY from environment variables."*

---

## 8. Student Engagement Rules

High schoolers close the tab if it feels like homework. They stay for hours if it feels like a game they're winning.

**The #1 retention feature:** Predicted AP score that updates after every session. A student who sees "predicted score went from 3 to 4" tells every friend in their AP class. This is your viral loop.

### Four engagement pillars

**1. Make progress visible instantly**
- XP bar fills after every problem solved
- Predicted AP score updates live (your #1 feature)
- Streak counter — days studied in a row
- Unit completion percentage on dashboard
- "You've answered 47 AP-style questions this week" stats

**2. Make sessions short and complete**
- Design for 10-minute sessions, not 45-minute ones
- One lesson → one sim → 5 problems = one complete session
- Daily challenge: one hard problem per day (3 minutes)
- Quick-fire mode: 10 MCQ timed, instant results

**3. Add social proof and competition**
- Class leaderboard (opt-in — some hate it, make it optional)
- Shareable score card for Instagram/Discord
- "3 friends also prepping for AP Physics" social nudge
- Achievement badges for milestones

**4. AI personality — cool tutor not textbook**
- Casual, warm, never condescending
- Acknowledges difficulty: "This one trips literally everyone up"
- Celebrates wins: "That's a 4-point answer right there"
- Exam countdown clock creates natural urgency

### The viral loop
```
Student uses Scorr
→ Score prediction improves (visible on dashboard)
→ Student tells friend "I went from 3 to 4 on my practice exam"
→ Friend asks "what are you using?"
→ New student signs up
→ Repeat
```

---

## 9. Monetization

### Pricing model
| Plan | Price | Who |
|---|---|---|
| Free | $0 | 3 lessons + 10 AI questions/day — genuine taste test |
| Student Monthly | $19.99/mo | Individual student, full access |
| Student Annual | $99/year | ~$8.25/mo — push this, 58% off |
| AP Bundle | $24.99/mo | Physics + Chemistry together |
| School License | $8/student/mo | Min 20 students, teacher dashboard |

### Revenue math
```
500 students × $99/year  = $49,500/year
  minus Claude API        ~$600/year
  minus Stripe fees       ~$1,400/year
  = ~$47,500 net

1,000 students × $99/year = $99,000/year
Achievable in year 1 with strong AP community presence
```

### Always use Stripe on web — never iOS/Android IAP
```
500 students × $99/year:
  Stripe (2.9%):        costs $1,435
  Apple/Google (30%):   costs $14,850
  You save:             $13,415/year
```

### School sales strategy (Phase 2)
- One teacher who loves Scorr pushes it to their school
- Offer 30-day free trial for entire class
- Teacher dashboard is the unlock — shows which students are behind
- School license removes individual payment friction

---

## 10. Competitive Positioning

### The market
| Competitor | Strength | Gap | Your advantage |
|---|---|---|---|
| Khan Academy / Khanmigo | Brand, free, Socratic AI | Too broad, no FRQ grading, no sims | AP-only depth |
| Studdy AI | Photo scan, homework help | No AP structure, no exam prep | Exam prep focus |
| UWorld | Deep question bank, AP-aligned | Zero AI, static content only | Live AI tutor |
| Fiveable | AP structure, study guides | 40 subjects — shallow on physics | Physics/Chem specialist |
| Albert.io | Excellent practice questions | No teaching, no AI | AI teaches + practices |

### Features nobody has — your moat
1. AI FRQ grading against real College Board rubric
2. Lesson-specific interactive simulations
3. AI weakness map by AP unit, auto-updated
4. AP score prediction that updates in real time
5. Photo scan (add early — Claude vision API)

---

## 11. GEO — Getting AI Platforms to Recommend You

**GEO = Generative Engine Optimization.** Getting ChatGPT, Claude, Perplexity to recommend scorr.ai when students ask "best AP Physics prep site?"

You cannot pay for this. AI models recommend platforms cited frequently and positively across the web. Takes 6–12 months of consistent effort.

### 5 actions in priority order

**1. Engage on Reddit (start before launch)**
- r/APStudents — 500k+ members
- r/Physics, r/HomeworkHelp
- Answer questions genuinely. Mention Scorr only when directly relevant.
- Reddit is heavily indexed by all AI models. One upvoted comment lasts years.

**2. Publish free resources that get linked**
- "Complete AP Physics 1 Formula Sheet 2026" — free PDF on scorr.ai
- "Every AP Physics 1 FRQ 2018–2025 with solutions" — teachers link this
- "AP Physics 1 Score Calculator" — students share it
- Teachers linking from school websites = .edu backlinks = high AI trust signal

**3. Write content answering AI search queries**
Blog pages on scorr.ai answering exactly what students type into AI:
- "How to study for AP Physics 1 in 2 weeks"
- "AP Physics 1 2026 exam format and changes"
- "How is AP Physics 1 FRQ scored?"
- "What score do I need to get a 5 on AP Physics?"

**4. Collect and publish student results**
- "I went from a predicted 3 to a 5" — student stories
- Post on site, Reddit, YouTube descriptions
- AI models treat outcome data as citation-worthy

**5. Add structured data markup (one-time technical)**
Tell Cursor:
> *"Add schema.org EducationalOrganization, Course, and FAQPage markup to my Next.js app layout"*

---

## 12. Phase-by-Phase Build Plan

### Phase 0 — Setup (this week)
**Goal: Working skeleton deployed at scorr.ai**

- [x] Domain registered — scorr.ai (Namecheap, 2 years, $185)
- [x] Anthropic Console — $5 loaded, API key created
- [x] Claude.ai Pro — active
- [ ] Google Workspace — create admin@scorr.ai
- [ ] GitHub — create private repo `scorr` under admin@scorr.ai
- [ ] Supabase — create project `scorr` under admin@scorr.ai, US East region
- [ ] Vercel — connect to GitHub under admin@scorr.ai
- [ ] Run Next.js + Tailwind setup command
- [ ] Run database schema SQL in Supabase
- [ ] Run Row Level Security SQL in Supabase
- [ ] Set up Supabase Google Auth
- [ ] Create .env.local with all keys
- [ ] Push to GitHub → auto-deploys to Vercel
- [ ] Point scorr.ai domain to Vercel (DNS settings in Namecheap)
- [ ] Set $10/month spend limit in Anthropic Console
- [ ] Set $25/month budget alert in Supabase

### Phase 1 — MVP (weeks 1–8) — AP Physics 1, Unit 1
**Goal: First paying student**

- [ ] Supabase Auth working with Google SSO and email/password
- [ ] Landing page at scorr.ai (Next.js, Tailwind)
- [ ] Student dashboard page (progress, predicted score, units)
- [ ] Lesson page UI — 4 tabs: Concept / Simulation / AI Tutor / Practice
- [ ] KaTeX integration for math formula rendering
- [ ] Unit 1 content: all 5 lessons, concept notes in Supabase
- [ ] Unit 1: 50 practice problems in Supabase (Claude generates, teacher reviews)
- [ ] Number line simulation (Lesson 1 — position/displacement)
- [ ] Projectile motion simulation (Lesson 5)
- [ ] Claude API route (Next.js API route, server-side only)
- [ ] AI tutor chat connected and working in lesson page
- [ ] AI rate limiting (20 questions/day per student)
- [ ] Answer validation server-side (correct_index never sent to client)
- [ ] XP system — earn points per lesson completed
- [ ] Progress tracking per lesson in Supabase progress table
- [ ] Predicted AP score on dashboard (calculated from progress data)
- [ ] Streak counter
- [ ] Stripe payment integration ($19.99/mo, $99/year)
- [ ] Free tier (3 lessons, 10 AI questions/day)
- [ ] Mobile responsive (test on actual phone)
- [ ] Schema.org markup added to all pages
- [ ] Google Analytics installed
- [ ] Deploy to scorr.ai via Vercel
- [ ] 10 beta students (free) from Reddit or personal network
- [ ] Collect feedback — fix top 3 issues
- [ ] AP Physics teacher reviews all Unit 1 content for accuracy
- [ ] Start charging after 10 students validate it

### Phase 2 — Expand (months 3–6)
**Goal: 200 paying students**

- [ ] AP Physics 1 Units 2–7 (complete curriculum)
- [ ] AP Chemistry subject, units, and lessons
- [ ] Chemistry simulations (titration curve, molecular viewer)
- [ ] FRQ grader — AI grades vs AP rubric, shows points earned
- [ ] Photo scan — Claude vision API, photograph any problem
- [ ] Weakness map per unit (auto-updated after each session)
- [ ] Teacher dashboard (assign, monitor, progress reports)
- [ ] AP Bundle pricing ($24.99/mo Physics + Chemistry)
- [ ] School license pricing ($8/student/mo, min 20 students)
- [ ] Free AP Physics 1 formula sheet page live on scorr.ai
- [ ] Free FRQ archive page (2018–2025) live on scorr.ai
- [ ] Reddit presence: 3 posts/week in r/APStudents

### Phase 3 — Scale (months 7–18)
**Goal: 1,000 paying students**

- [ ] Progressive Web App — installable from browser
- [ ] Daily challenge feature (one hard problem/day)
- [ ] Leaderboard (opt-in, class-based)
- [ ] Shareable score card (export progress image)
- [ ] Achievement badges system
- [ ] AI-generated video lessons (Synthesia)
- [ ] Loom FRQ walkthroughs
- [ ] Capacitor wrapper → iOS App Store
- [ ] Capacitor wrapper → Google Play
- [ ] AP Physics 2 added
- [ ] GEO content library (20+ articles)

### Phase 4 — Platform (year 2+)
**Goal: 5,000+ students, school contracts**

- [ ] AP Physics C, AP Biology, AP Calculus, AP Statistics
- [ ] District dashboard, LMS integration (Google Classroom, Canvas)
- [ ] Live tutoring marketplace
- [ ] AI personalized study plans
- [ ] Parent portal

---

## 13. Key Rules — Never Break These

### Security
1. **Claude API key** — ONLY in server environment variables, never in client code or GitHub
2. **Correct answers** — `correct_index` validated server-side only, never returned to browser
3. **All Claude calls** — through Next.js API routes only, never client → Claude directly
4. **Stripe webhooks** — verified server-side, never trust client for subscription status
5. **Supabase service role key** — server-side only, never in client code

### Architecture
6. All content (lessons, problems, rubrics) in Supabase — never hardcoded in components
7. One lesson template, infinite content — build template once, swap content
8. AI tutor system prompt stored in Supabase — change tone without redeploying
9. Never put database logic in React components — always in lib/ utilities

### Product
10. Every session must feel complete in 10 minutes — design for short sessions
11. Predicted AP score updates after every session — your #1 retention feature
12. Photo scan must work — baseline expectation for students in 2026
13. Free tier must be genuinely useful (3 full lessons) — bad free tiers kill word-of-mouth

### Business
14. Always collect payments on web via Stripe — never push students to pay through iOS/Android app
15. Always ask for school/teacher referrals — one teacher = 30 students at once
16. Never add a new subject until current subject has 200+ paying students
17. Every unit reviewed by a qualified AP teacher before publishing

### Development
18. Never commit .env.local to GitHub
19. Always work in a separate `scorr-dev` Supabase project for testing
20. Commit to GitHub after every working feature — auto-deploys to Vercel

---

## 14. Checklist — Before You Launch

### Accounts and infrastructure
- [ ] admin@scorr.ai Google Workspace active
- [ ] All services (Supabase, Vercel, GitHub, Stripe, Anthropic) under admin@scorr.ai
- [ ] scorr.ai DNS pointed to Vercel
- [ ] $10/month Anthropic Console spend limit set
- [ ] $25/month Supabase budget alert set
- [ ] .env.local in .gitignore — never committed to GitHub

### Security
- [ ] Claude API key only in server environment variables
- [ ] correct_index never returned to browser — confirmed in Network tab
- [ ] All Claude calls go through /api/tutor route — confirmed in browser dev tools
- [ ] Row Level Security enabled on all Supabase tables
- [ ] Stripe webhook signature verified server-side

### Technical
- [ ] KaTeX renders equations correctly on all browsers
- [ ] Site loads under 3 seconds on mobile (test with Chrome DevTools)
- [ ] Stripe payment completes in test mode
- [ ] Google SSO auth works end to end
- [ ] AI rate limit (20/day) enforced correctly
- [ ] Progress saves to Supabase after each lesson

### Content
- [ ] Unit 1 all 5 lessons have concept notes in Supabase
- [ ] At least 50 practice problems in Supabase for Unit 1
- [ ] At least 2 interactive simulations working
- [ ] AI tutor system prompt reviewed and tuned
- [ ] All Unit 1 content reviewed by AP Physics teacher
- [ ] FRQ grader tested against 3 real past AP FRQs

### Student experience
- [ ] Predicted AP score shows on dashboard and updates
- [ ] XP and progress bar work after completing a lesson
- [ ] Streak counter works
- [ ] Mobile tested on actual phone (not just browser responsive mode)
- [ ] 10 beta students have used it and given positive feedback
- [ ] Onboarding takes under 2 minutes (signup → first lesson)

### GEO / Marketing
- [ ] Free formula sheet page live at scorr.ai/resources
- [ ] Reddit account created, first 5 genuine posts in r/APStudents
- [ ] Google Analytics installed and tracking
- [ ] Schema.org markup on all pages
- [ ] scorr.ai loads correctly and SSL is green

---

## 15. Quick Reference — When You're Stuck

| Problem | Solution |
|---|---|
| "How do I build X?" | Open Cursor, press Cmd+K, describe it in English |
| "Supabase query not working" | Paste query into Supabase SQL Editor first, test there |
| "Claude API costs too much" | Cap max_tokens at 400, cache common answers, check rate limit is working |
| "Students aren't coming back" | Check if predicted score is updating — that's the #1 retention feature |
| "Nobody is finding my site" | Post genuinely on r/APStudents, publish the free FRQ archive |
| "A school wants to sign up" | Offer 30-day free trial for the class, demo the teacher dashboard |
| "Should I add a new subject?" | Only after 200+ paying students on current subject |
| "AI gives wrong physics answers" | Add physics review instructions to system prompt, get teacher to tune it |
| "How do I deploy?" | git push to GitHub → Vercel auto-deploys in 60 seconds |
| "Environment variable not working" | Add to Vercel dashboard under Project Settings → Environment Variables |
| "Supabase RLS blocking a query" | Check policy in Supabase dashboard → Authentication → Policies |

---

## Cursor Prompts That Work — Copy These

**Setting up auth:**
> "Create a complete Supabase authentication system for Next.js App Router with Google sign-in and email/password. Use @supabase/ssr. Include login page, signup page, and middleware to protect routes."

**Building the lesson page:**
> "Create a Next.js lesson page at src/app/lesson/[id]/page.tsx with 4 tabs: Concept (renders markdown with KaTeX), Simulation (placeholder canvas), AI Tutor (chat interface), and Practice (MCQ questions). Fetch lesson data from Supabase."

**Claude API route:**
> "Create a Next.js API route at src/app/api/tutor/route.ts. It accepts POST with lessonTitle, apTopic, weakConcepts, studentQuestion, and userId. Check the Supabase ai_usage table to enforce 20 questions per day. Call the Anthropic Claude API with an AP Physics tutor system prompt. Return the response as JSON."

**Stripe payments:**
> "Add Stripe subscription payments to my Next.js app. Create a checkout session for $19.99/month and $99/year plans. Handle the webhook at /api/stripe/webhook to update the user's plan in Supabase profiles table."

**Progress tracking:**
> "Create a Supabase function that updates a student's progress after completing a lesson. It should update the progress table with score, xp_earned, and weak_concepts. It should also recalculate and update a predicted_score field on their profile."

**Schema.org markup:**
> "Add schema.org structured data to my Next.js layout.tsx. Include EducationalOrganization for Scorr, Course for AP Physics 1, and FAQPage markup for the landing page."

---

*Document compiled from full product planning session — March 2026*
*Domain: scorr.ai registered. Stack finalized: Next.js + Vercel + Supabase.*
*Keep this file as PLAN.md in your GitHub repo root. Update as decisions change.*