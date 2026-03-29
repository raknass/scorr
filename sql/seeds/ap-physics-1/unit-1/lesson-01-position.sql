-- ============================================================
-- seeds/ap-physics-1/unit-1/lesson-01-position.sql
-- Lesson 1: Position, Displacement & Distance
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
v_note := $note$# Position, Displacement & Distance
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.A**

Kinematics is the study of how things move — not *why* they move (that's Newton's job), but how we describe and measure motion.

By the end of this lesson you will be able to:
- Define position, distance, and displacement correctly
- Calculate displacement using $\Delta x = x_f - x_i$
- Explain why distance and displacement are different
- Identify which quantity an AP exam question is asking for

---

## Position ($x$)

Position tells you **where an object is** relative to a chosen reference point called the **origin**.

- Measured in meters (m)
- Can be positive or negative depending on direction
- If your origin is your front door and you walk 5 m east: $x = +5\ \text{m}$
- If you walk 3 m west: $x = -3\ \text{m}$
- Direction matters. Position is a **vector** quantity.

The choice of origin and positive direction is yours — but once chosen, stay consistent throughout the problem.

---

## Distance vs Displacement

This distinction earns and loses exam points every single year.

### Distance ($d$)
- Total length of the path traveled
- Always positive — you cannot travel a negative distance
- Has no direction — it is a **scalar** quantity
- Think of a car odometer — it only goes up, no matter which direction you drive

### Displacement ($\Delta x$)
- Straight-line change in position from start to finish
- Can be positive, negative, or zero
- Has both magnitude and direction — it is a **vector** quantity
- Only cares about start and finish — not the path you took

**Formula:**
$$\Delta x = x_f - x_i$$

Where $x_f$ = final position, $x_i$ = initial position.

---

## Worked Example

**Problem:** A student walks 8 m east from their locker, then turns and walks 3 m west. Find (a) distance traveled and (b) displacement.

**Setup:** Let east = positive. Starting position $x_i = 0$.

- After 8 m east → position = $+8\ \text{m}$
- After 3 m west → position = $+8 - 3 = +5\ \text{m}$

**(a) Distance** = total path = $8 + 3 =$ **11 m**

**(b) Displacement** = $x_f - x_i = 5 - 0 =$ **+5 m (east)**

> Notice: distance (11 m) ≠ displacement (5 m east).

---

## Real-World Analogy

Think about giving someone directions to your house.

"My house is 5 km from the school" — that's **displacement**. Straight-line from start to finish.

But if you follow the roads with turns and detours, you might actually drive 8 km. That's the **distance** — total path traveled.

- **GPS** uses displacement.
- **Your car odometer** measures distance.

---

## AP Exam Traps

### Trap 1: "How far from the starting point?"
This asks for **displacement** — not distance. The phrase "from the starting point" is the signal. Many students write distance here and lose a full point.

### Trap 2: Object returns to start
If an object returns exactly to where it started, **displacement = 0** — no matter how far it traveled.

**Example:** A runner completes one full 400 m lap.
- Distance = 400 m ✓
- Displacement = 0 m ✓

### Trap 3: Forgetting direction on displacement
"5 m" is an **incomplete** answer for displacement on the AP exam.
Write **"5 m east"** (or use a sign: $+5\ \text{m}$). Always include direction for vectors.

---

## Scalar vs Vector Summary

| Quantity | Type | Has direction? |
|---|---|---|
| Distance | Scalar | No |
| Displacement | Vector | Yes |
| Position | Vector | Yes |

---

## Key Formula

$$\Delta x = x_f - x_i$$

---

## Self-Check Before Practice

Answer these without looking:

1. A ball rolls 10 m right then 6 m left. What is the distance? The displacement?
2. Why can displacement be zero while distance is non-zero?
3. An AP question asks "how far did the object travel?" — distance or displacement?

> **Answers:**
> 1. Distance = 16 m, Displacement = +4 m (right)
> 2. When the object returns to or passes its starting position
> 3. Distance

---

That's it for this lesson. Simple — but the foundation for everything in Unit 1.
$note$;

-- ── Upsert Lesson ─────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id, 'Position, Displacement & Distance', '1.A', v_note, 'numberline', 15, 20, 1)
ON CONFLICT (unit_id, order_num) DO UPDATE SET
  title            = EXCLUDED.title,
  ap_topic         = EXCLUDED.ap_topic,
  concept_note     = EXCLUDED.concept_note,
  sim_type         = EXCLUDED.sim_type,
  estimated_minutes = EXCLUDED.estimated_minutes,
  xp_reward        = EXCLUDED.xp_reward;

SELECT id INTO v_lesson_id FROM lessons WHERE unit_id = v_unit_id AND order_num = 1;

-- ── Problems (delete + reinsert for clean update) ─────────────────────────────
DELETE FROM problems WHERE lesson_id = v_lesson_id;

INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

(v_lesson_id,
'A student walks 8 m east then 3 m west. What is the student''s displacement?',
'["5 m east","11 m east","5 m west","11 m"]',
0,
'Displacement = x_f − x_i = (8−3) − 0 = 5 m east. Distance would be 8+3 = 11 m. Displacement only cares about start and end, not path.',
1, 'displacement vs distance'),

(v_lesson_id,
'Which of the following is a scalar quantity?',
'["Displacement","Velocity","Distance","Acceleration"]',
2,
'Distance is a scalar — magnitude only, no direction. Displacement, velocity, and acceleration are all vectors.',
1, 'scalar vs vector'),

(v_lesson_id,
'An object starts at x = −4 m and ends at x = +7 m. What is its displacement?',
'["+11 m","+3 m","−11 m","−3 m"]',
0,
'Δx = x_f − x_i = 7 − (−4) = +11 m. Be careful with negative starting positions.',
1, 'displacement calculation'),

(v_lesson_id,
'A runner completes one full lap around a 400 m track. What is her displacement?',
'["400 m","0 m","800 m","200 m"]',
1,
'After one full lap the runner is back at start. Displacement = x_f − x_i = 0. Distance = 400 m.',
1, 'displacement vs distance'),

(v_lesson_id,
'A car moves from x = 10 m to x = −30 m. What is the displacement?',
'["−40 m","40 m","−20 m","20 m"]',
0,
'Δx = x_f − x_i = −30 − 10 = −40 m. The negative sign means the car moved in the negative direction.',
2, 'displacement calculation'),

(v_lesson_id,
'Which statement about displacement is always true?',
'["Displacement equals distance traveled","Displacement can be negative","Displacement is always positive","Displacement has no units"]',
1,
'Displacement is a vector and can be negative. It equals distance only when motion is in one direction with no backtracking.',
2, 'displacement properties'),

(v_lesson_id,
'An object has a displacement of 0. Which of the following must be true?',
'["The object did not move","The object returned to its starting position","The distance traveled is 0","The object moved in a straight line"]',
1,
'Displacement = 0 means final position = initial position. The object could have traveled any path and returned to start.',
2, 'displacement interpretation'),

(v_lesson_id,
'A hiker walks 6 km north then 8 km east. What is the magnitude of her displacement?',
'["14 km","10 km","2 km","48 km"]',
1,
'Using the Pythagorean theorem: |Δr| = √(6² + 8²) = √100 = 10 km. Distance = 14 km.',
3, '2D displacement'),

(v_lesson_id,
'[FRQ] A particle moves 12 m east, then 5 m west, then 3 m west. (a) Total distance? (b) Displacement?',
'["(a) 20 m, (b) 4 m east","(a) 20 m, (b) 14 m east","(a) 14 m, (b) 4 m east","(a) 4 m, (b) 20 m east"]',
0,
'(a) Distance = 12 + 5 + 3 = 20 m. (b) Displacement = 12 − 5 − 3 = +4 m east. Distance is always additive; displacement tracks direction.',
2, 'distance and displacement'),

(v_lesson_id,
'[FRQ] A student starts at x = +2 m, walks to x = −6 m, then back to x = +4 m. Find total distance and displacement.',
'["Distance = 18 m, Displacement = +2 m","Distance = 10 m, Displacement = +2 m","Distance = 14 m, Displacement = +6 m","Distance = 2 m, Displacement = +14 m"]',
0,
'Leg 1: |2−(−6)| = 8 m. Leg 2: |(−6)−4| = 10 m. Total distance = 18 m. Displacement = x_f − x_i = 4 − 2 = +2 m.',
3, 'distance and displacement');

RAISE NOTICE 'Lesson 1 seeded (id = %)', v_lesson_id;

END $outer$;
