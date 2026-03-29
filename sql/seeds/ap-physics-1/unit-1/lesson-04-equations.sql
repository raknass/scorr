-- ============================================================
-- seeds/ap-physics-1/unit-1/lesson-04-equations.sql
-- Lesson 4: The 4 Kinematic Equations
-- Self-contained: finds subject+unit, upserts lesson, reloads problems.
-- Safe to re-run to update concept note or problems.
-- ============================================================

DO $outer$
DECLARE
  v_subject_id UUID;
  v_unit_id    UUID;
  v_lesson_id  UUID;
  v_note       TEXT;
BEGIN

SELECT id INTO v_subject_id FROM subjects WHERE slug = 'ap-physics-1';
SELECT id INTO v_unit_id    FROM units    WHERE subject_id = v_subject_id AND order_num = 1;

-- ── Concept Note ─────────────────────────────────────────────────────────────
v_note := $note$# The 4 Kinematic Equations
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.D**
*Estimated time: 18 minutes | XP reward: 20*

By the end of this lesson you will be able to:
- State all 4 kinematic equations from memory
- Identify which equation to use based on known and unknown variables
- Solve single-step and multi-step kinematic problems
- Apply the equations to free fall problems

---

## The Big Rule — When These Equations Apply

**The 4 kinematic equations ONLY work when acceleration is constant.**

If a problem describes changing acceleration, these equations do not apply. For AP Physics 1, most kinematics problems involve constant acceleration (including free fall where $a = -9.8\ \text{m/s}^2$).

---

## The 4 Equations

Five variables appear in kinematic problems: $v_i$, $v_f$, $a$, $t$, $\Delta x$.

Each equation uses 4 of the 5 — and is **missing one**:

| Equation | Missing variable |
|---|---|
| $v_f = v_i + at$ | $\Delta x$ |
| $\Delta x = v_i t + \frac{1}{2}at^2$ | $v_f$ |
| $v_f^2 = v_i^2 + 2a\Delta x$ | $t$ |
| $\Delta x = \frac{1}{2}(v_i + v_f)t$ | $a$ |

---

## How to Pick the Right Equation — Every Time

1. **List** what you know (given values)
2. **Identify** what you are solving for
3. **Find** which variable is missing (not given, not asked for)
4. **Use** the equation that is also missing that variable

**Example:** You know $v_i$, $a$, $t$. You want $\Delta x$. Missing variable: $v_f$.
→ Use $\Delta x = v_i t + \frac{1}{2}at^2$ (no $v_f$ in this equation)

---

## Worked Example 1 — Basic Kinematics

**Problem:** A car starts from rest and accelerates at $3\ \text{m/s}^2$ for 6 s. How far does it travel?

$v_i = 0$, $a = 3\ \text{m/s}^2$, $t = 6\ \text{s}$. Missing: $v_f$.

$$\Delta x = v_i t + \frac{1}{2}at^2 = 0 + \frac{1}{2}(3)(36) = \textbf{54 m}$$

---

## Worked Example 2 — No Time Given

**Problem:** A ball at 8 m/s decelerates at $2\ \text{m/s}^2$. How far before stopping?

$v_i = 8$, $v_f = 0$, $a = -2\ \text{m/s}^2$. Missing: $t$.

$$v_f^2 = v_i^2 + 2a\Delta x \implies 0 = 64 - 4\Delta x \implies \Delta x = \textbf{16 m}$$

---

## Worked Example 3 — Free Fall

**Problem:** A ball is dropped from 45 m. How long to hit the ground? (Let down = positive)

$v_i = 0$, $a = 9.8\ \text{m/s}^2$, $\Delta x = 45\ \text{m}$. Missing: $v_f$.

$$45 = \frac{1}{2}(9.8)t^2 \implies t = \sqrt{\frac{45}{4.9}} \approx \textbf{3.03 s}$$

---

## Worked Example 4 — Two-Phase Problem

**Problem:** A car at 20 m/s accelerates at $4\ \text{m/s}^2$ for 3 s, then constant velocity for 5 s. Total displacement?

**Phase 1:** $\Delta x_1 = 20(3) + \frac{1}{2}(4)(9) = 78\ \text{m}$, $v_f = 20 + 4(3) = 32\ \text{m/s}$

**Phase 2:** $\Delta x_2 = 32 \times 5 = 160\ \text{m}$

$$\Delta x_{total} = 78 + 160 = \textbf{238 m}$$

---

## The Variable Table

Before every kinematic problem, fill in this table:

```
v_i  = ?
v_f  = ?
a    = ?
t    = ?
Δx   = ?
```

Three filled values → enough to solve. The **missing** entry tells you which equation to use.

---

## AP Exam Traps

### Trap 1: Forgetting sign convention
Always define which direction is positive. If up = positive, $g = -9.8\ \text{m/s}^2$. Be consistent throughout.

### Trap 2: $\Delta x = \frac{1}{2}(v_i + v_f)t$ needs both velocities
This equation requires knowing **both** $v_i$ and $v_f$. If you only know one, use a different equation.

### Trap 3: Multi-phase problems
Treat each phase separately. $v_f$ of Phase 1 = $v_i$ of Phase 2.

### Trap 4: Word clues
- "Starts from rest" or "dropped" → $v_i = 0$
- "Comes to rest" or "stops" → $v_f = 0$

### Trap 5: Units
Time: seconds. Velocity: m/s. Acceleration: m/s². Displacement: m. Convert km/h first.

---

## Self-Check Before Practice

1. A runner goes from 2 m/s to 8 m/s in 3 s. Which equation finds displacement? What is it?
2. What 4 steps do you follow to pick the right equation?
3. Object thrown downward at 5 m/s (up = positive). What is $v_i$? What is $a$?

> **Answers:**
> 1. $\Delta x = \frac{1}{2}(v_i + v_f)t = \frac{1}{2}(10)(3) = 15\ \text{m}$
> 2. List knowns → identify unknown → find missing variable → pick matching equation
> 3. $v_i = -5\ \text{m/s}$; $a = -9.8\ \text{m/s}^2$

---

## Connection to Other Lessons

- **Lesson 3:** These equations assume constant acceleration — established in the previous lesson
- **Lesson 5:** Projectile motion applies these equations separately to $x$ and $y$ directions
- **Unit 2:** Forces cause acceleration — $F = ma$ links directly to these equations
$note$;

-- ── Upsert Lesson ─────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id, 'The 4 Kinematic Equations', '1.D', v_note, null, 18, 20, 4)
ON CONFLICT (unit_id, order_num) DO UPDATE SET
  title             = EXCLUDED.title,
  ap_topic          = EXCLUDED.ap_topic,
  concept_note      = EXCLUDED.concept_note,
  sim_type          = EXCLUDED.sim_type,
  estimated_minutes = EXCLUDED.estimated_minutes,
  xp_reward         = EXCLUDED.xp_reward;

SELECT id INTO v_lesson_id FROM lessons WHERE unit_id = v_unit_id AND order_num = 4;

-- ── Problems ──────────────────────────────────────────────────────────────────
DELETE FROM problems WHERE lesson_id = v_lesson_id;

INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

(v_lesson_id,
'A car starts from rest and accelerates at 3 m/s² for 5 s. What is its final velocity?',
'["15 m/s","8 m/s","1.7 m/s","45 m/s"]',
0,
'Use v_f = v_i + at: v_f = 0 + (3)(5) = 15 m/s. "Starts from rest" means v_i = 0.',
1, 'kinematic equation 1'),

(v_lesson_id,
'A car starts from rest and accelerates at 3 m/s² for 5 s. How far does it travel?',
'["37.5 m","75 m","15 m","7.5 m"]',
0,
'v_i = 0, a = 3, t = 5. Missing v_f → use Δx = v_i·t + ½at² = 0 + ½(3)(25) = 37.5 m.',
1, 'kinematic equation 2'),

(v_lesson_id,
'A ball rolling at 8 m/s decelerates at 2 m/s². How far does it travel before stopping?',
'["16 m","4 m","32 m","2 m"]',
0,
'v_i = 8, v_f = 0, a = −2. Missing t → use v_f² = v_i² + 2aΔx: 0 = 64 − 4Δx → Δx = 16 m.',
2, 'kinematic equation 3'),

(v_lesson_id,
'Which kinematic equation should you use when time is unknown?',
'["v_f = v_i + at","Δx = v_i·t + ½at²","v_f² = v_i² + 2aΔx","Δx = ½(v_i + v_f)·t"]',
2,
'v_f² = v_i² + 2aΔx is the only equation that does not contain t. Use it when time is neither given nor asked for.',
1, 'choosing equations'),

(v_lesson_id,
'A runner accelerates from 2 m/s to 8 m/s in 3 s. What is the displacement?',
'["15 m","18 m","30 m","9 m"]',
0,
'v_i = 2, v_f = 8, t = 3. Missing a → use Δx = ½(v_i + v_f)t = ½(10)(3) = 15 m.',
1, 'kinematic equation 4'),

(v_lesson_id,
'A ball is dropped from 45 m. How long does it take to hit the ground? (g = 9.8 m/s²)',
'["3.03 s","4.59 s","2.14 s","9.18 s"]',
0,
'v_i = 0, a = 9.8, Δx = 45 (down = positive). Missing v_f → Δx = ½at²: 45 = 4.9t² → t = √9.18 ≈ 3.03 s.',
2, 'free fall'),

(v_lesson_id,
'A stone is thrown upward at 15 m/s. What is its velocity after 2 s? (g = 9.8 m/s², up = positive)',
'["−4.6 m/s","4.6 m/s","−24.6 m/s","24.6 m/s"]',
0,
'v_f = v_i + at = 15 + (−9.8)(2) = 15 − 19.6 = −4.6 m/s. Negative means the stone is now moving downward.',
2, 'free fall'),

(v_lesson_id,
'A car at 20 m/s accelerates at 4 m/s² for 3 s, then travels at constant velocity for 5 s. What is total displacement?',
'["238 m","260 m","200 m","160 m"]',
0,
'Phase 1: Δx₁ = 20(3) + ½(4)(9) = 78 m. v_f = 20 + 4(3) = 32 m/s. Phase 2: Δx₂ = 32(5) = 160 m. Total = 238 m.',
3, 'two-phase kinematics'),

(v_lesson_id,
'[FRQ] A motorcycle starts from rest and reaches 24 m/s in 8 s. (a) Find acceleration. (b) Find distance traveled. (c) Find velocity at t = 5 s.',
'["(a) 3 m/s², (b) 96 m, (c) 15 m/s","(a) 3 m/s², (b) 192 m, (c) 15 m/s","(a) 3 m/s², (b) 96 m, (c) 24 m/s","(a) 4 m/s², (b) 96 m, (c) 20 m/s"]',
0,
'(a) a = Δv/Δt = 24/8 = 3 m/s². (b) Missing v_f (at 8 s) is known = 24 → use Δx = ½(0+24)(8) = 96 m. (c) v = 0 + 3(5) = 15 m/s.',
2, 'applying kinematics'),

(v_lesson_id,
'[FRQ] A stone is dropped from a cliff and hits the ground after 3 s. (a) How tall is the cliff? (b) What is the impact speed? (g = 10 m/s²)',
'["(a) 45 m, (b) 30 m/s","(a) 30 m, (b) 30 m/s","(a) 45 m, (b) 15 m/s","(a) 90 m, (b) 30 m/s"]',
0,
'(a) Δx = ½gt² = ½(10)(9) = 45 m. (b) v_f = v_i + at = 0 + 10(3) = 30 m/s.',
2, 'free fall');

RAISE NOTICE 'Lesson 4 seeded (id = %)', v_lesson_id;

END $outer$;
