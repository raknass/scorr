-- ============================================================
-- seeds/ap-physics-1/unit-1/lesson-03-acceleration.sql
-- Lesson 3: Acceleration
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
v_note := $note$# Acceleration
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.C**
*Estimated time: 16 minutes | XP reward: 20*

By the end of this lesson you will be able to:
- Define acceleration as the rate of change of velocity
- Calculate average acceleration using the formula
- Interpret velocity-time graphs to find acceleration from slope
- Correctly identify when an object is speeding up vs slowing down
- Understand free fall as a special case of constant acceleration

---

## What Acceleration Really Means

Acceleration is one of the most misunderstood concepts in AP Physics. Most students think acceleration means "speeding up." It doesn't.

**Acceleration is the rate of change of velocity.**

$$a = \frac{\Delta v}{\Delta t} = \frac{v_f - v_i}{t_f - t_i}$$

Since velocity is a vector, acceleration is also a **vector** — it has both magnitude and direction.

An object is accelerating whenever its velocity is **changing** — and velocity can change in two ways:
1. The **speed** changes (getting faster or slower)
2. The **direction** changes (even at constant speed)

This is why a car going around a curve at constant speed is still accelerating — its direction is changing.

---

## Key Formula

$$a = \frac{\Delta v}{\Delta t} = \frac{v_f - v_i}{t_f - t_i}$$

Units: meters per second squared ($\text{m/s}^2$)

---

## Worked Example 1 — Calculating Acceleration

**Problem:** A cyclist starts from rest and reaches 12 m/s in 4 seconds. Find the acceleration.

**Solution:**

- $v_i = 0\ \text{m/s}$, $v_f = 12\ \text{m/s}$, $\Delta t = 4\ \text{s}$

$$a = \frac{v_f - v_i}{\Delta t} = \frac{12 - 0}{4} = +3\ \text{m/s}^2$$

The cyclist accelerates at $3\ \text{m/s}^2$ in the positive direction.

---

## Worked Example 2 — Negative Acceleration

**Problem:** A car moving at 20 m/s east brakes to rest in 5 seconds. Find the acceleration.

**Solution:**

- $v_i = +20\ \text{m/s}$, $v_f = 0$, $\Delta t = 5\ \text{s}$

$$a = \frac{0 - 20}{5} = -4\ \text{m/s}^2$$

The negative sign means acceleration is directed **west** (opposing motion). The car is slowing down.

---

## Speeding Up vs Slowing Down — The Rule

**Speeding up:** velocity and acceleration point in the **same direction**
- Moving right ($+v$) and accelerating right ($+a$) → speeding up
- Moving left ($-v$) and accelerating left ($-a$) → speeding up

**Slowing down:** velocity and acceleration point in **opposite directions**
- Moving right ($+v$) but accelerating left ($-a$) → slowing down
- Moving left ($-v$) but accelerating right ($+a$) → slowing down

> **The sign of acceleration alone does NOT tell you if the object is speeding up or slowing down.** You must compare the signs of both velocity AND acceleration.

---

## Velocity-Time Graphs

On a velocity-time ($v$ vs $t$) graph: **slope = acceleration**

| Graph feature | What it means |
|---|---|
| Positive slope | Acceleration in positive direction |
| Negative slope | Acceleration in negative direction |
| Zero slope (flat line) | Constant velocity, zero acceleration |
| Steep slope | Large acceleration |
| Area under curve | Displacement |

---

## Free Fall — Special Case of Constant Acceleration

When an object falls freely under gravity (no air resistance):

$$a = -g = -9.8\ \text{m/s}^2 \quad \text{(downward, if up = positive)}$$

- Every second, velocity changes by $9.8\ \text{m/s}$ downward
- Applies equally to heavy and light objects
- **Free fall means:** gravity is the **only** force acting. An object thrown upward is still in free fall — gravity acts at $-9.8\ \text{m/s}^2$ the entire time, including at the peak.

---

## Real-World Analogy

The accelerator pedal increases speed — positive acceleration. The brake decreases speed — negative acceleration. But even with the brake pressed, the car moves forward until stopped. Direction of motion (forward) and direction of acceleration (backward) are opposite — that's slowing down.

---

## AP Exam Traps

### Trap 1: "Deceleration" is not an AP Physics term
The AP exam says *negative acceleration* or *acceleration opposite to motion*. Never write "deceleration" on the FRQ.

### Trap 2: Zero velocity ≠ zero acceleration
At the top of a ball's trajectory, $v = 0$ but $a = -9.8\ \text{m/s}^2$. Gravity never turns off.

### Trap 3: Negative acceleration doesn't mean slowing down
If $v = -5\ \text{m/s}$ and $a = -2\ \text{m/s}^2$, the object is **speeding up** (both in same direction).

### Trap 4: Constant acceleration ≠ constant velocity
Constant acceleration means velocity changes at a steady rate. Constant velocity means $a = 0$.

---

## Summary Table

| Situation | Velocity sign | Acceleration sign | Result |
|---|---|---|---|
| Speeding up (right) | + | + | Faster rightward |
| Slowing down (right) | + | − | Slower rightward |
| Speeding up (left) | − | − | Faster leftward |
| Slowing down (left) | − | + | Slower leftward |
| Free fall (up = +) | + then 0 then − | − always | Rises, stops, falls |

---

## Self-Check Before Practice

1. A ball is thrown upward. At the highest point, what is its velocity? Its acceleration?
2. An object has $v = -8\ \text{m/s}$ and $a = -2\ \text{m/s}^2$. Speeding up or slowing down?
3. What does the slope of a velocity-time graph represent?

> **Answers:**
> 1. $v = 0$; $a = -9.8\ \text{m/s}^2$ (gravity still acts)
> 2. Speeding up — both $v$ and $a$ are negative (same direction)
> 3. Acceleration

---

## Connection to Other Lessons

- **Lesson 2:** Acceleration = change in velocity over time — extension of velocity concept
- **Lesson 4:** All 4 kinematic equations assume constant acceleration
- **Lesson 5:** Projectile motion uses $a = -9.8\ \text{m/s}^2$ vertically and $a = 0$ horizontally
$note$;

-- ── Upsert Lesson ─────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id, 'Acceleration', '1.C', v_note, 'acceleration-graph', 16, 20, 3)
ON CONFLICT (unit_id, order_num) DO UPDATE SET
  title             = EXCLUDED.title,
  ap_topic          = EXCLUDED.ap_topic,
  concept_note      = EXCLUDED.concept_note,
  sim_type          = EXCLUDED.sim_type,
  estimated_minutes = EXCLUDED.estimated_minutes,
  xp_reward         = EXCLUDED.xp_reward;

SELECT id INTO v_lesson_id FROM lessons WHERE unit_id = v_unit_id AND order_num = 3;

-- ── Problems ──────────────────────────────────────────────────────────────────
DELETE FROM problems WHERE lesson_id = v_lesson_id;

INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

(v_lesson_id,
'A cyclist starts from rest and reaches 12 m/s in 4 s. What is the acceleration?',
'["3 m/s²","4 m/s²","48 m/s²","0.33 m/s²"]',
0,
'a = Δv/Δt = (12 − 0)/4 = 3 m/s². Starting from rest means v_i = 0.',
1, 'calculating acceleration'),

(v_lesson_id,
'What does the slope of a velocity-time graph represent?',
'["Speed","Displacement","Distance","Acceleration"]',
3,
'Slope of a v-t graph = Δv/Δt = acceleration. The area under a v-t graph = displacement.',
1, 'graph interpretation'),

(v_lesson_id,
'A car moving at −20 m/s slows to −5 m/s in 3 s. What is the acceleration?',
'["−5 m/s²","5 m/s²","−8.3 m/s²","8.3 m/s²"]',
1,
'a = Δv/Δt = (−5 − (−20))/3 = +15/3 = +5 m/s². Even though the car is slowing down, acceleration is positive — velocity became less negative.',
2, 'acceleration direction'),

(v_lesson_id,
'A ball is thrown upward. At the very top of its trajectory, what is its acceleration?',
'["Zero — it momentarily stops","9.8 m/s² upward","9.8 m/s² downward","Cannot be determined"]',
2,
'Gravity always acts downward at 9.8 m/s². At the peak, velocity = 0 but acceleration is still −9.8 m/s² (downward). This is a classic AP misconception.',
2, 'free fall'),

(v_lesson_id,
'An object has velocity = −8 m/s and acceleration = −2 m/s². The object is:',
'["Slowing down","Speeding up","At rest","Moving in the positive direction"]',
1,
'Both velocity and acceleration are negative — they point in the same direction. Same-direction v and a means the object is speeding up (getting faster in the negative direction).',
2, 'speeding up vs slowing down'),

(v_lesson_id,
'What does the area under a velocity-time graph represent?',
'["Acceleration","Force","Displacement","Speed"]',
2,
'Area under a v-t graph = displacement. This is a key AP graph skill. The slope gives acceleration; the area gives displacement.',
1, 'graph interpretation'),

(v_lesson_id,
'A car brakes from +25 m/s to rest in 5 s. What is the acceleration?',
'["−5 m/s²","5 m/s²","−0.2 m/s²","−125 m/s²"]',
0,
'a = (0 − 25)/5 = −5 m/s². Negative because acceleration opposes the direction of motion (decelerating while moving in the positive direction).',
1, 'calculating acceleration'),

(v_lesson_id,
'An object moves in the negative direction and is speeding up. Its acceleration must be:',
'["Positive","Zero","Negative","Either positive or negative"]',
2,
'Speeding up means velocity and acceleration are in the same direction. If the object moves in the negative direction (negative velocity) and speeds up, acceleration must also be negative.',
2, 'speeding up vs slowing down'),

(v_lesson_id,
'[FRQ] A ball is thrown upward at +15 m/s. (a) What is the acceleration throughout the flight? (b) How long does it take to reach the peak? (g = 9.8 m/s²)',
'["(a) −9.8 m/s², (b) 1.53 s","(a) 0 at peak, (b) 1.53 s","(a) −9.8 m/s², (b) 3.06 s","(a) +9.8 m/s², (b) 1.53 s"]',
0,
'(a) Acceleration = −9.8 m/s² throughout — gravity never turns off, even at the peak. (b) At peak, v = 0. Using v = v_i + at: 0 = 15 + (−9.8)t → t = 15/9.8 ≈ 1.53 s.',
2, 'free fall'),

(v_lesson_id,
'[FRQ] A train decelerates uniformly from 30 m/s to 0 in 15 s. (a) Find its acceleration. (b) On a v-t graph, what shape would this produce and what does the area represent?',
'["(a) −2 m/s², (b) straight line sloping down; area = displacement","(a) 2 m/s², (b) curve; area = acceleration","(a) −0.5 m/s², (b) horizontal line; area = velocity","(a) −2 m/s², (b) parabola; area = distance"]',
0,
'(a) a = (0 − 30)/15 = −2 m/s². (b) Uniform (constant) acceleration produces a straight line on a v-t graph. The area under the line (a triangle here) equals the displacement: (1/2)(30)(15) = 225 m.',
3, 'graph interpretation');

RAISE NOTICE 'Lesson 3 seeded (id = %)', v_lesson_id;

END $outer$;
