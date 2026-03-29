-- ============================================================
-- seeds/ap-physics-1/unit-1/lesson-02-velocity.sql
-- Lesson 2: Velocity & Speed
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
v_note := $note$# Velocity & Speed
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.B**
*Estimated time: 14 minutes | XP reward: 20*

By the end of this lesson you will be able to:
- Define speed and velocity and state which is scalar and which is vector
- Calculate average speed and average velocity
- Interpret position-time graphs to find velocity from slope
- Distinguish between average and instantaneous velocity

---

## Speed vs Velocity — The Core Distinction

Just like distance vs displacement, speed and velocity are related but fundamentally different. This distinction appears on almost every AP Physics 1 exam.

### Speed ($v_s$)
- How fast an object is moving — total distance per unit time
- Always positive
- A **scalar** quantity — magnitude only, no direction
- Formula: $v_s = \frac{d}{t}$

### Velocity ($v$)
- Rate of change of displacement — not distance
- Can be positive, negative, or zero
- A **vector** quantity — has both magnitude and direction
- Formula: $v = \frac{\Delta x}{\Delta t} = \frac{x_f - x_i}{t_f - t_i}$

---

## Average vs Instantaneous

**Average velocity** is calculated over a time interval — it describes overall motion from start to finish.

$$\bar{v} = \frac{\Delta x}{\Delta t}$$

**Average speed** is calculated over a time interval using total distance.

$$\bar{s} = \frac{d_{total}}{t_{total}}$$

**Instantaneous velocity** is velocity at one specific moment in time. On a position-time graph, this is the slope of the **tangent line** at that point.

---

## Key Formulas

$$\bar{v} = \frac{\Delta x}{\Delta t} = \frac{x_f - x_i}{t_f - t_i}$$

$$\bar{s} = \frac{d_{total}}{t_{total}}$$

Units: meters per second ($\text{m/s}$)

---

## Worked Example 1 — Average Velocity

**Problem:** A car starts at position $x = 2\ \text{m}$ and reaches $x = 26\ \text{m}$ in 4 seconds. Find its average velocity.

**Solution:**

$$\Delta x = x_f - x_i = 26 - 2 = 24\ \text{m}$$
$$\Delta t = 4\ \text{s}$$
$$\bar{v} = \frac{\Delta x}{\Delta t} = \frac{24}{4} = +6\ \text{m/s (forward)}$$

---

## Worked Example 2 — Speed vs Velocity

**Problem:** A runner jogs 100 m east in 20 s, then turns and jogs 60 m west in 12 s. Find:
(a) average speed for the whole trip
(b) average velocity for the whole trip

**Solution:**

- Total distance $= 100 + 60 = 160\ \text{m}$, Total time $= 20 + 12 = 32\ \text{s}$
- Displacement $= 100 - 60 = 40\ \text{m east}$

**(a)** $\bar{s} = \frac{160}{32} = 5\ \text{m/s}$

**(b)** $\bar{v} = \frac{40}{32} = 1.25\ \text{m/s east}$

> Notice: average speed (5 m/s) ≠ magnitude of average velocity (1.25 m/s). This is a classic AP exam result.

---

## Position-Time Graphs — Reading Velocity from Slope

On a position-time ($x$ vs $t$) graph: **slope = velocity**

| Graph feature | What it means |
|---|---|
| Steep positive slope | Fast, moving in positive direction |
| Shallow positive slope | Slow, moving in positive direction |
| Zero slope (flat line) | Object is not moving ($v = 0$) |
| Negative slope | Moving in negative direction |
| Changing slope (curved) | Velocity is changing — acceleration |

The slope of the **tangent line** at any point gives instantaneous velocity.

---

## Real-World Analogy

A **speedometer** reads speed — how fast you're going right now, but not which direction.

A **GPS navigation system** tracks velocity — it knows both your speed and direction. When you back out of a driveway, the GPS registers a negative velocity (backwards) even though your speedometer shows a positive speed.

---

## AP Exam Traps

### Trap 1: Returning to start = zero average velocity
An object that returns to its starting position has $\Delta x = 0$, so average velocity $= 0$. Average speed will still be positive. Many students confuse these.

### Trap 2: $\bar{v} = \frac{v_i + v_f}{2}$ is not always valid
This formula only works when acceleration is **constant**. Never use it for varying acceleration problems without verifying constant acceleration first.

### Trap 3: Speed is never negative
If you calculate a negative speed, you made an error. Speed uses distance (always positive) ÷ time (always positive).

### Trap 4: Downward slope ≠ slowing down
A position-time graph sloping downward means the object is moving in the **negative direction** — it could be at constant velocity. Do not confuse with deceleration.

---

## Scalar vs Vector Summary

| Quantity | Formula | Type |
|---|---|---|
| Speed | $d / t$ | Scalar |
| Velocity | $\Delta x / \Delta t$ | Vector |
| Average speed | $d_{total} / t_{total}$ | Scalar |
| Average velocity | $\Delta x_{total} / \Delta t_{total}$ | Vector |

---

## Self-Check Before Practice

Answer these without looking:

1. A car drives 60 m north in 10 s then 60 m south in 10 s. Average speed? Average velocity?
2. On a position-time graph, what does a horizontal line mean?
3. What is the slope of a position-time graph equal to?

> **Answers:**
> 1. Average speed = 6 m/s; Average velocity = 0 m/s
> 2. Object is stationary — velocity = 0
> 3. Velocity

---

## Connection to Other Lessons

- **Lesson 1:** Velocity uses displacement ($\Delta x$), not distance — same scalar/vector distinction
- **Lesson 3:** When velocity changes over time, that change is acceleration
- **Lesson 4:** Kinematic equations use velocity as a variable throughout
$note$;

-- ── Upsert Lesson ─────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id, 'Velocity & Speed', '1.B', v_note, 'velocity-graph', 14, 20, 2)
ON CONFLICT (unit_id, order_num) DO UPDATE SET
  title             = EXCLUDED.title,
  ap_topic          = EXCLUDED.ap_topic,
  concept_note      = EXCLUDED.concept_note,
  sim_type          = EXCLUDED.sim_type,
  estimated_minutes = EXCLUDED.estimated_minutes,
  xp_reward         = EXCLUDED.xp_reward;

SELECT id INTO v_lesson_id FROM lessons WHERE unit_id = v_unit_id AND order_num = 2;

-- ── Problems ──────────────────────────────────────────────────────────────────
DELETE FROM problems WHERE lesson_id = v_lesson_id;

INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

(v_lesson_id,
'A car travels 120 m in 8 s in a straight line. What is its average velocity?',
'["15 m/s","960 m/s","0.067 m/s","8 m/s"]',
0,
'v̄ = Δx/Δt = 120/8 = 15 m/s. Since the car moves in a straight line, displacement equals distance, so average velocity equals average speed here.',
1, 'average velocity'),

(v_lesson_id,
'What does the slope of a position-time graph represent?',
'["Acceleration","Displacement","Velocity","Distance"]',
2,
'Slope = rise/run = Δx/Δt = velocity. This is one of the most tested graph interpretations on the AP Physics 1 exam.',
1, 'graph interpretation'),

(v_lesson_id,
'An object moves from x = 20 m to x = 5 m in 3 s. What is its average velocity?',
'["−5 m/s","5 m/s","8.3 m/s","−8.3 m/s"]',
0,
'v̄ = Δx/Δt = (5 − 20)/3 = −15/3 = −5 m/s. The negative sign indicates motion in the negative direction.',
1, 'average velocity'),

(v_lesson_id,
'A runner completes a 400 m lap in 80 s and returns to the start. What is the average velocity for the full trip?',
'["5 m/s","0 m/s","10 m/s","2.5 m/s"]',
1,
'Displacement = 0 (returned to exact starting position). Average velocity = Δx/Δt = 0/160 = 0 m/s. Average speed = 400/80 = 5 m/s.',
1, 'average velocity vs speed'),

(v_lesson_id,
'On a position-time graph, a horizontal (flat) line means the object is:',
'["Accelerating","Moving at constant speed","At rest (velocity = 0)","Moving in the negative direction"]',
2,
'A horizontal line means Δx = 0 over that interval. Slope = Δx/Δt = 0, so velocity = 0. The object is stationary.',
1, 'graph interpretation'),

(v_lesson_id,
'A runner jogs 100 m east in 20 s then 60 m west in 12 s. What is the average speed for the entire trip?',
'["1.25 m/s","5 m/s","3.75 m/s","6.25 m/s"]',
1,
'Average speed = total distance / total time = (100 + 60) / (20 + 12) = 160 / 32 = 5 m/s. Note: average velocity = 40/32 = 1.25 m/s east — much less than average speed.',
2, 'average speed vs velocity'),

(v_lesson_id,
'A car starts at x = 2 m and reaches x = 26 m in 4 s. What is its average velocity?',
'["+6 m/s","+28 m/s","+12 m/s","+3 m/s"]',
0,
'Δx = 26 − 2 = 24 m. v̄ = Δx/Δt = 24/4 = +6 m/s.',
1, 'average velocity'),

(v_lesson_id,
'A position-time graph has a negative slope. This means the object is:',
'["Slowing down","Speeding up","Moving in the negative direction","At rest"]',
2,
'Negative slope = negative velocity = moving in the negative direction. The object could be moving at constant speed — slope does not tell you about speeding up or slowing down (that requires a v-t graph).',
2, 'graph interpretation'),

(v_lesson_id,
'[FRQ] A train travels 300 km north in 2 hours, then 100 km south in 1 hour. (a) What is the average speed for the entire trip? (b) What is the average velocity?',
'["(a) 400/3 km/h, (b) 200/3 km/h north","(a) 133 km/h, (b) 133 km/h north","(a) 150 km/h, (b) 67 km/h north","(a) 200 km/h, (b) 200 km/h north"]',
0,
'Total distance = 400 km, total time = 3 h. (a) Average speed = 400/3 ≈ 133 km/h. Displacement = 300 − 100 = 200 km north. (b) Average velocity = 200/3 ≈ 67 km/h north. Speed > |velocity| because of the backtracking.',
2, 'average speed and velocity'),

(v_lesson_id,
'[FRQ] A particle''s position is: x = 10 m at t = 0 s, x = 30 m at t = 4 s, x = 10 m at t = 8 s. Calculate: (a) average velocity from t = 0 to t = 8 s, and (b) average speed from t = 0 to t = 8 s.',
'["(a) 0 m/s, (b) 5 m/s","(a) 5 m/s, (b) 0 m/s","(a) 2.5 m/s, (b) 5 m/s","(a) 0 m/s, (b) 2.5 m/s"]',
0,
'(a) Displacement = x_f − x_i = 10 − 10 = 0 m. Average velocity = 0/8 = 0 m/s. (b) Distance: 0→4s the particle moves 20 m forward; 4→8s it moves 20 m back. Total = 40 m. Average speed = 40/8 = 5 m/s.',
3, 'average speed and velocity');

RAISE NOTICE 'Lesson 2 seeded (id = %)', v_lesson_id;

END $outer$;
