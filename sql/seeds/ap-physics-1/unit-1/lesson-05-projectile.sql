-- ============================================================
-- seeds/ap-physics-1/unit-1/lesson-05-projectile.sql
-- Lesson 5: Projectile Motion
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
v_note := $note$# Projectile Motion
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.E**
*Estimated time: 20 minutes | XP reward: 20*

By the end of this lesson you will be able to:
- State and apply the principle of independence of horizontal and vertical motion
- Identify the acceleration in each direction for a projectile
- Solve for range, time of flight, and maximum height
- Analyze both launched and dropped projectile scenarios

---

## The Central Idea — Independence of Motion

**Horizontal and vertical motions are completely independent of each other.**

A projectile (any object in free flight, no thrust) has:
- **Horizontal ($x$):** constant velocity, zero acceleration
- **Vertical ($y$):** constant acceleration due to gravity, $a_y = -9.8\ \text{m/s}^2$

These two motions happen simultaneously but do not affect each other. Solve them separately — the one thing connecting them is **time**.

---

## The Famous Demonstration

A ball dropped straight down and a ball fired horizontally from the same height hit the ground **at exactly the same time**.

Both experience the same vertical acceleration (gravity) regardless of horizontal motion. The AP exam tests whether you truly believe this.

---

## Setting Up Projectile Problems

Always separate into two columns:

| | Horizontal ($x$) | Vertical ($y$) |
|---|---|---|
| Acceleration | $a_x = 0$ | $a_y = -9.8\ \text{m/s}^2$ |
| Initial velocity | $v_{ix} = v_i \cos\theta$ | $v_{iy} = v_i \sin\theta$ |
| Velocity during | $v_x =$ constant | $v_y$ changes |
| Key equation | $\Delta x = v_{ix} \cdot t$ | $\Delta y = v_{iy}t + \frac{1}{2}a_y t^2$ |

**Convention:** up = positive, right = positive

---

## Key Formulas

**Horizontal (no acceleration):**
$$\Delta x = v_{ix} \cdot t$$

**Vertical (constant $a_y = -9.8\ \text{m/s}^2$):**
$$v_{ix} = v_i \cos\theta \qquad v_{iy} = v_i \sin\theta$$
$$\Delta y = v_{iy}t + \frac{1}{2}a_y t^2$$
$$v_{fy} = v_{iy} + a_y t$$
$$v_{fy}^2 = v_{iy}^2 + 2a_y \Delta y$$

---

## Worked Example 1 — Horizontal Launch

**Problem:** A ball is kicked horizontally at 15 m/s from a cliff 80 m high. Find (a) time to land and (b) horizontal range.

**Setup:** $v_{ix} = 15\ \text{m/s}$, $v_{iy} = 0$, $a_y = -9.8\ \text{m/s}^2$, $\Delta y = -80\ \text{m}$

**(a) Time — use vertical:**
$$-80 = \frac{1}{2}(-9.8)t^2 \implies t \approx \textbf{4.04 s}$$

**(b) Range — use horizontal:**
$$\Delta x = 15 \times 4.04 \approx \textbf{60.6 m}$$

---

## Worked Example 2 — Launched at an Angle

**Problem:** A ball launched at 20 m/s at 30°. Find (a) max height and (b) time of flight.

$$v_{ix} = 20\cos 30° = 17.3\ \text{m/s} \qquad v_{iy} = 20\sin 30° = 10\ \text{m/s}$$

**(a) Max height** (at peak, $v_{fy} = 0$):
$$\Delta y = \frac{-v_{iy}^2}{2a_y} = \frac{-100}{-19.6} \approx \textbf{5.1 m}$$

**(b) Time of flight** (symmetric — lands at same height):
$$t_{up} = \frac{-v_{iy}}{a_y} = \frac{-10}{-9.8} \approx 1.02\ \text{s} \implies t_{total} = \textbf{2.04 s}$$

---

## Three Types of AP Projectile Problems

**Type 1 — Horizontal launch from height**
$v_{iy} = 0$. Solve vertical for time → horizontal for range.

**Type 2 — Launched at angle, returns to same height**
Symmetric. Time up = time down. $v_{fy}$ at landing $= -v_{iy}$.

**Type 3 — Launched at angle, lands at different height**
Set $\Delta y =$ height difference (negative if lower). Solve the quadratic in $t$.

---

## Velocity at Any Point

$$v_x = v_{ix} = \text{constant} \qquad v_y = v_{iy} + a_y t \qquad |v| = \sqrt{v_x^2 + v_y^2}$$

At maximum height: $v_y = 0$ — velocity is purely horizontal ($= v_{ix}$).

---

## AP Exam Traps

### Trap 1: Horizontal velocity is NOT zero at max height
Only **vertical** velocity is zero at the peak. $v_x$ remains constant throughout. Writing $v = 0$ at max height loses points every time.

### Trap 2: Mass doesn't matter
A heavy ball and a light ball launched identically follow the same path. Mass does not appear in projectile equations.

### Trap 3: Air resistance is ignored
Unless the problem explicitly mentions it, assume no air resistance.

### Trap 4: The 45° rule only applies to flat ground
Maximum range at 45° is only valid when the projectile lands at the **same height** it launched from.

### Trap 5: Symmetry only when launch height = landing height
If the ball lands lower than it launched, time up ≠ time down.

---

## Summary

| Quantity | Horizontal | Vertical |
|---|---|---|
| Acceleration | $0$ | $-9.8\ \text{m/s}^2$ |
| Velocity | Constant | Changes |
| Position | Linear | Parabolic |

The path of a projectile is always a **parabola**.

---

## Self-Check Before Practice

1. Ball launched horizontally from 20 m — same landing time as one dropped straight down?
2. At the peak, what is $v_y$? What is $v_x$?
3. Ball at 45° and 10 m/s. Find $v_{ix}$ and $v_{iy}$.

> **Answers:**
> 1. Yes — horizontal motion doesn't affect vertical free fall
> 2. $v_y = 0$; $v_x = v_{ix}$ = unchanged
> 3. $v_{ix} = v_{iy} = 10\cos 45° \approx 7.07\ \text{m/s}$

---

## Connection to Other Lessons

- **Lesson 3:** Free fall is the vertical component of all projectile motion
- **Lesson 4:** Kinematic equations apply separately to $x$ and $y$
- **Unit 2:** Forces explain why gravity accelerates objects downward
$note$;

-- ── Upsert Lesson ─────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id, 'Projectile Motion', '1.E', v_note, 'projectile', 20, 30, 5)
ON CONFLICT (unit_id, order_num) DO UPDATE SET
  title             = EXCLUDED.title,
  ap_topic          = EXCLUDED.ap_topic,
  concept_note      = EXCLUDED.concept_note,
  sim_type          = EXCLUDED.sim_type,
  estimated_minutes = EXCLUDED.estimated_minutes,
  xp_reward         = EXCLUDED.xp_reward;

SELECT id INTO v_lesson_id FROM lessons WHERE unit_id = v_unit_id AND order_num = 5;

-- ── Problems ──────────────────────────────────────────────────────────────────
DELETE FROM problems WHERE lesson_id = v_lesson_id;

INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

(v_lesson_id,
'A projectile is launched horizontally. What is its horizontal acceleration?',
'["9.8 m/s² downward","0 m/s²","9.8 m/s² in the direction of motion","It depends on launch speed"]',
1,
'Horizontal acceleration = 0 for all projectiles (ignoring air resistance). Only gravity acts, and gravity is vertical. The horizontal velocity stays constant throughout the flight.',
1, 'projectile independence'),

(v_lesson_id,
'A ball is launched at 30° above horizontal at 20 m/s. What is the initial vertical velocity?',
'["20 m/s","10 m/s","17.3 m/s","11.5 m/s"]',
1,
'v_iy = v_i × sin θ = 20 × sin 30° = 20 × 0.5 = 10 m/s. The vertical component uses sine; horizontal uses cosine.',
1, 'vector components'),

(v_lesson_id,
'At the highest point of a projectile''s trajectory, which statement is correct?',
'["Both horizontal and vertical velocity are zero","Only vertical velocity is zero","Only horizontal velocity is zero","Speed is at its maximum"]',
1,
'At the peak, only the vertical velocity = 0 (momentarily stopped rising). Horizontal velocity is unchanged throughout — it never goes to zero. Total speed is at its minimum (= v_x) at the peak.',
1, 'projectile at peak'),

(v_lesson_id,
'A ball is launched horizontally at 15 m/s from a 20 m cliff. How long does it take to land? (g = 10 m/s²)',
'["2 s","4 s","1.5 s","3 s"]',
0,
'Use vertical: Δy = ½a_y t² → −20 = ½(−10)t² → t² = 4 → t = 2 s. Horizontal velocity (15 m/s) has no effect on how long gravity takes to pull the ball down 20 m.',
2, 'horizontal launch'),

(v_lesson_id,
'Using the ball from the previous problem (15 m/s horizontal, 20 m cliff, t = 2 s), what is the horizontal range?',
'["30 m","20 m","15 m","60 m"]',
0,
'Δx = v_ix × t = 15 × 2 = 30 m. This is a direct application of horizontal motion with constant velocity.',
1, 'horizontal range'),

(v_lesson_id,
'A ball is launched at 40 m/s at 45°. What are the horizontal and vertical components of initial velocity?',
'["v_ix = v_iy = 28.3 m/s","v_ix = 34.6 m/s, v_iy = 20 m/s","v_ix = 20 m/s, v_iy = 34.6 m/s","v_ix = v_iy = 40 m/s"]',
0,
'At 45°: v_ix = 40 cos 45° = 40 × 0.707 ≈ 28.3 m/s; v_iy = 40 sin 45° = 28.3 m/s. At 45° both components are equal.',
1, 'vector components'),

(v_lesson_id,
'Two balls are released simultaneously from the same height — one dropped straight down, one launched horizontally at 20 m/s. Which hits the ground first?',
'["The dropped ball","The launched ball","They hit at exactly the same time","It depends on the height"]',
2,
'Both experience identical vertical acceleration (gravity). Horizontal motion is independent of vertical motion. They hit at exactly the same time — one of the most counterintuitive results in kinematics, but experimentally verified.',
2, 'projectile independence'),

(v_lesson_id,
'A projectile launched at 60° and one launched at 30° at the same speed from flat ground. How do their ranges compare?',
'["60° has greater range","30° has greater range","They have equal range","Cannot determine without knowing speed"]',
2,
'R = v² sin(2θ) / g. For 60°: sin(120°) = sin(60°). For 30°: sin(60°). They are equal. Complementary launch angles (summing to 90°) always give equal range on flat ground.',
3, 'range symmetry'),

(v_lesson_id,
'[FRQ] A soccer ball is kicked at 25 m/s at 37° above horizontal on flat ground. (a) Find the initial vertical velocity. (b) Find the time to reach maximum height. (c) Find the maximum height. (g = 10 m/s², sin 37° = 0.6, cos 37° = 0.8)',
'["(a) 15 m/s, (b) 1.5 s, (c) 11.25 m","(a) 20 m/s, (b) 2 s, (c) 20 m","(a) 15 m/s, (b) 1.5 s, (c) 22.5 m","(a) 20 m/s, (b) 1.5 s, (c) 11.25 m"]',
0,
'(a) v_iy = 25 × 0.6 = 15 m/s. (b) At peak v_fy = 0: 0 = 15 − 10t → t = 1.5 s. (c) Δy = v_iy·t + ½a_y·t² = 15(1.5) + ½(−10)(2.25) = 22.5 − 11.25 = 11.25 m.',
2, 'angled launch'),

(v_lesson_id,
'[FRQ] A ball is launched at 20 m/s at 53° from flat ground. Find (a) total time of flight and (b) horizontal range. (g = 10 m/s², sin 53° = 0.8, cos 53° = 0.6)',
'["(a) 3.2 s, (b) 38.4 m","(a) 2 s, (b) 24 m","(a) 3.2 s, (b) 24 m","(a) 1.6 s, (b) 38.4 m"]',
0,
'v_iy = 20 × 0.8 = 16 m/s; v_ix = 20 × 0.6 = 12 m/s. (a) At landing Δy = 0: 0 = 16t − 5t² → t(16−5t) = 0 → t = 3.2 s. (b) Δx = v_ix × t = 12 × 3.2 = 38.4 m.',
3, 'full projectile motion');

RAISE NOTICE 'Lesson 5 seeded (id = %)', v_lesson_id;

END $outer$;
