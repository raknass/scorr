-- ============================================================
-- Scorr: AP Physics 1 — Unit 1: Kinematics Seed Data (SAFE VERSION 2)
-- Uses dollar-quoting for concept notes to avoid backslash escape issues.
-- Idempotent: safe to run multiple times.
-- Run this in Supabase SQL Editor AFTER bootstrap.sql
-- ============================================================

DO $outer$
DECLARE
  v_subject_id UUID;
  v_unit_id    UUID;
  v_l1 UUID; v_l2 UUID; v_l3 UUID; v_l4 UUID; v_l5 UUID;
  v_note1 TEXT; v_note2 TEXT; v_note3 TEXT; v_note4 TEXT; v_note5 TEXT;
BEGIN

-- ── Concept notes (dollar-quoted — backslashes are literal, no escape issues) ─

v_note1 := $note$## Position, Displacement & Distance

Kinematics is the study of how things **move** — not *why* they move (that's Newton's job), but how we describe and measure that motion.

---

### Position

Position ($x$) tells you **where** an object is relative to a chosen reference point (the origin).

- If your origin is your front door and you walk 5 m east: $x = +5\ \text{m}$
- If you walk 3 m west: $x = -3\ \text{m}$

Direction matters. Position is a **vector** quantity.

---

### Displacement vs Distance

This distinction earns and loses exam points every year.

**Displacement** ($\Delta x$) = change in position:
$$\Delta x = x_f - x_i$$

Displacement only cares about **start and finish**. Not the path.

**Distance** = total path length. Always positive.

**Example:** You walk 10 m east, then 10 m west.
- Distance = $20\ \text{m}$
- Displacement = $0\ \text{m}$

> 💡 **AP Exam tip:** FRQ graders will take off a full point if you use "distance" when the question asks for "displacement." Read carefully.

---

### Scalar vs Vector

| Quantity | Type | Has direction? |
|---|---|---|
| Distance | Scalar | ✗ |
| Displacement | Vector | ✓ |
| Position | Vector | ✓ |

---

### Key Formula

$$\Delta x = x_f - x_i$$

That's it for this lesson. Simple — but the foundation for everything in Unit 1.$note$;

v_note2 := $note$## Velocity & Speed

Now that we know how to describe *where* something is, we can describe how fast and in what direction it's moving.

---

### Average Speed

Average speed is simply total distance divided by total time:

$$\bar{s} = \frac{d_{total}}{\Delta t}$$

Always positive. No direction. A scalar.

---

### Average Velocity

Average velocity is displacement over time:

$$\bar{v} = \frac{\Delta x}{\Delta t} = \frac{x_f - x_i}{t_f - t_i}$$

Can be positive, negative, or zero. A vector. The sign tells you direction.

---

### Instantaneous Velocity

The velocity **at a single moment** — what your speedometer reads. On a position vs. time graph, it's the **slope of the tangent line** at that point.

$$v = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t}$$

---

### Position–Time Graph Reading

| Graph shape | What it means |
|---|---|
| Straight line, positive slope | Constant positive velocity |
| Straight line, negative slope | Constant negative velocity |
| Horizontal line | At rest ($v = 0$) |
| Curved line | Changing velocity (accelerating) |

> 💡 **AP Exam tip:** "Velocity is the slope of the x-t graph" appears on almost every FRQ. Memorize this connection.

---

### Key Formulas

$$\bar{v} = \frac{\Delta x}{\Delta t}$$

$$\bar{s} = \frac{d_{total}}{\Delta t}$$
$note$;

v_note3 := $note$## Acceleration

Acceleration describes how **velocity changes** over time. It's what you feel when a car speeds up, slows down, or turns.

---

### Average Acceleration

$$\bar{a} = \frac{\Delta v}{\Delta t} = \frac{v_f - v_i}{\Delta t}$$

Units: $\text{m/s}^2$

Acceleration can be:
- **Positive**: velocity increasing in positive direction (or decreasing in negative direction)
- **Negative**: velocity decreasing in positive direction (deceleration)

---

### Critical Insight: Slowing Down ≠ Negative Acceleration

An object moving in the **negative** direction that **slows down** has **positive** acceleration.

**Example:** A car moving at $-20\ \text{m/s}$ brakes to $-5\ \text{m/s}$:
$$a = \frac{-5 - (-20)}{\Delta t} = \frac{+15}{\Delta t} > 0$$

> 💡 **AP Exam tip:** This trips up 80% of students on the FRQ. Always calculate $\Delta v$ before deciding the sign of acceleration.

---

### Velocity–Time Graph Reading

| Graph feature | Meaning |
|---|---|
| Slope of line | Acceleration |
| Area under curve | Displacement |
| Horizontal line | Constant velocity, $a = 0$ |
| Crossing zero | Object reverses direction |

---

### Key Formula

$$a = \frac{v_f - v_i}{\Delta t}$$
$note$;

v_note4 := $note$## The 4 Kinematic Equations

These four equations describe **any motion with constant acceleration**. Master them and you can solve 60% of AP Physics 1 problems.

---

### The Equations

$$v = v_0 + at \tag{1}$$

$$\Delta x = v_0 t + \frac{1}{2}at^2 \tag{2}$$

$$v^2 = v_0^2 + 2a\Delta x \tag{3}$$

$$\Delta x = \frac{v + v_0}{2} t \tag{4}$$

---

### How to Choose the Right Equation

List your **givens and unknown**, then pick the equation that contains exactly those variables:

| Missing variable | Use equation |
|---|---|
| $\Delta x$ missing | Equation 1 |
| $v_f$ missing | Equation 2 |
| $t$ missing | Equation 3 |
| $a$ missing | Equation 4 |

---

### Worked Example

A car accelerates from $0\ \text{m/s}$ to $30\ \text{m/s}$ in $6\ \text{s}$. Find displacement.

**Givens:** $v_0 = 0$, $v = 30\ \text{m/s}$, $t = 6\ \text{s}$. Unknown: $\Delta x$. Missing: $a$.

Use Equation 4:
$$\Delta x = \frac{30 + 0}{2} \times 6 = 15 \times 6 = 90\ \text{m}$$

> 💡 **AP Exam tip:** Always write down your givens first. FRQ graders award a point just for that step.
$note$;

v_note5 := $note$## Projectile Motion

A projectile is any object that is **launched and then moves only under gravity** (no thrust, no air resistance in AP Physics 1).

---

### The Golden Rule

Treat horizontal and vertical motion **completely independently**.

| Direction | Acceleration | Equations to use |
|---|---|---|
| Horizontal ($x$) | $a_x = 0$ (constant velocity) | $\Delta x = v_x t$ |
| Vertical ($y$) | $a_y = -9.8\ \text{m/s}^2$ | All 4 kinematic equations |

---

### Key Setup

For a projectile launched at angle $\theta$ with speed $v_0$:

$$v_{0x} = v_0 \cos\theta$$
$$v_{0y} = v_0 \sin\theta$$

At the **peak**: $v_y = 0$ (velocity is purely horizontal)

---

### Worked Example

A ball is launched at $20\ \text{m/s}$ at $30°$. Find the **time to peak**.

$$v_{0y} = 20 \sin 30° = 10\ \text{m/s}$$

At peak, $v_y = 0$. Using $v = v_0 + at$:
$$0 = 10 + (-9.8)t \implies t = 1.02\ \text{s}$$

---

### Symmetry Trick

For a projectile launched **and landing at the same height**:
- Time going up = time coming down
- Total time = $\frac{2v_{0y}}{g}$
- Landing speed = launch speed (same magnitude)

> 💡 **AP Exam tip:** FRQs almost always ask for "time of flight," "maximum height," or "horizontal range." Practice all three.
$note$;

-- ── 1. Subject ────────────────────────────────────────────────────────────────
INSERT INTO subjects (slug, title, description, ap_exam_date, total_units)
VALUES ('ap-physics-1','AP Physics 1','Algebra-based AP Physics covering mechanics, waves, and circuits.','2026-05-11',7)
ON CONFLICT (slug) DO NOTHING;

SELECT id INTO v_subject_id FROM subjects WHERE slug = 'ap-physics-1';

-- ── 2. Unit ───────────────────────────────────────────────────────────────────
INSERT INTO units (subject_id, title, description, order_num, total_lessons)
VALUES (v_subject_id,'Unit 1: Kinematics','Describes motion using position, velocity, and acceleration — the language of all AP Physics.',1,5)
ON CONFLICT (subject_id, order_num) DO NOTHING;

SELECT id INTO v_unit_id FROM units WHERE subject_id = v_subject_id AND order_num = 1 LIMIT 1;

-- ── 3. Lessons ────────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id,'Position, Displacement & Distance','1.A', v_note1,'numberline',15,20,1)
ON CONFLICT (unit_id, order_num) DO NOTHING;
SELECT id INTO v_l1 FROM lessons WHERE unit_id = v_unit_id AND order_num = 1 LIMIT 1;

INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id,'Velocity & Speed','1.B', v_note2,'velocity-graph',15,20,2)
ON CONFLICT (unit_id, order_num) DO NOTHING;
SELECT id INTO v_l2 FROM lessons WHERE unit_id = v_unit_id AND order_num = 2 LIMIT 1;

INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id,'Acceleration','1.C', v_note3,'acceleration-graph',15,20,3)
ON CONFLICT (unit_id, order_num) DO NOTHING;
SELECT id INTO v_l3 FROM lessons WHERE unit_id = v_unit_id AND order_num = 3 LIMIT 1;

INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id,'The 4 Kinematic Equations','1.D', v_note4, null,20,25,4)
ON CONFLICT (unit_id, order_num) DO NOTHING;
SELECT id INTO v_l4 FROM lessons WHERE unit_id = v_unit_id AND order_num = 4 LIMIT 1;

INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id,'Projectile Motion','1.E', v_note5,'projectile',20,30,5)
ON CONFLICT (unit_id, order_num) DO NOTHING;
SELECT id INTO v_l5 FROM lessons WHERE unit_id = v_unit_id AND order_num = 5 LIMIT 1;

-- ── 4. Problems (clean then re-insert for idempotency) ───────────────────────
DELETE FROM problems WHERE lesson_id IN (v_l1, v_l2, v_l3, v_l4, v_l5);

-- LESSON 1
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES
(v_l1,'A student walks 8 m east then 3 m west. What is the student''s displacement?','["5 m east","11 m east","5 m west","11 m"]',0,'Displacement = final position − initial position = 8 − 3 = 5 m east. Distance would be 8 + 3 = 11 m.',1,'displacement vs distance'),
(v_l1,'Which of the following is a scalar quantity?','["Displacement","Velocity","Distance","Acceleration"]',2,'Distance is a scalar — magnitude only, no direction. Displacement, velocity, and acceleration are all vectors.',1,'scalar vs vector'),
(v_l1,'An object starts at x = −4 m and ends at x = +7 m. What is its displacement?','["+11 m","+3 m","−11 m","−3 m"]',0,'Δx = x_f − x_i = 7 − (−4) = +11 m. Be careful with negative starting positions.',1,'displacement calculation'),
(v_l1,'A runner completes one full lap around a 400 m track. What is her displacement?','["400 m","0 m","800 m","200 m"]',1,'After one full lap the runner is back at start. Displacement = 0. Distance = 400 m.',1,'displacement vs distance'),
(v_l1,'A car moves from x = 10 m to x = −30 m. What is the displacement?','["−40 m","40 m","−20 m","20 m"]',0,'Δx = −30 − 10 = −40 m. Negative sign means the car moved in the negative direction.',2,'displacement calculation'),
(v_l1,'Which statement about displacement is always true?','["Displacement equals distance traveled","Displacement can be negative","Displacement is always positive","Displacement has no units"]',1,'Displacement is a vector and can be negative. It equals distance only when motion is strictly in one direction.',2,'displacement properties'),
(v_l1,'An object has a displacement of 0. Which must be true?','["The object did not move","The object returned to its starting position","The distance traveled is 0","The object moved in a straight line"]',1,'Displacement = 0 means final position = initial position. The object may have traveled any path and returned.',2,'displacement interpretation'),
(v_l1,'A hiker walks 6 km north then 8 km east. What is the magnitude of her displacement?','["14 km","10 km","2 km","48 km"]',1,'Pythagorean theorem: |Δr| = √(6² + 8²) = √100 = 10 km. Distance = 14 km.',3,'2D displacement'),
(v_l1,'[FRQ] A particle moves 12 m east, then 5 m west, then 3 m west. (a) Total distance? (b) Displacement?','["(a) 20 m, (b) 4 m east","(a) 20 m, (b) 14 m east","(a) 14 m, (b) 4 m east","(a) 4 m, (b) 20 m east"]',0,'(a) Distance = 12 + 5 + 3 = 20 m. (b) Displacement = 12 − 5 − 3 = 4 m east.',2,'distance and displacement'),
(v_l1,'[FRQ] A student starts at x = +2 m, walks to x = −6 m, then back to x = +4 m. Find total distance and displacement.','["Distance = 18 m, Displacement = +2 m","Distance = 10 m, Displacement = +2 m","Distance = 14 m, Displacement = +6 m","Distance = 2 m, Displacement = +14 m"]',0,'Leg 1: |2−(−6)| = 8 m. Leg 2: |(−6)−4| = 10 m. Distance = 18 m. Displacement = 4 − 2 = +2 m.',3,'distance and displacement');

-- LESSON 2
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES
(v_l2,'A car travels 120 m in 8 s. What is its average speed?','["15 m/s","960 m/s","0.067 m/s","8 m/s"]',0,'Average speed = distance / time = 120 / 8 = 15 m/s.',1,'average speed'),
(v_l2,'What does the slope of a position-time graph represent?','["Acceleration","Displacement","Velocity","Distance"]',2,'Slope of an x-t graph = Δx/Δt = velocity. One of the most tested graph interpretations.',1,'graph interpretation'),
(v_l2,'An object moves from x = 20 m to x = 5 m in 3 s. What is its average velocity?','["−5 m/s","5 m/s","8.3 m/s","−8.3 m/s"]',0,'v̄ = Δx/Δt = (5 − 20)/3 = −5 m/s. Negative means motion in the negative direction.',1,'average velocity'),
(v_l2,'A runner completes a 400 m lap in 50 s and returns to the start. Average velocity for the full trip?','["8 m/s","0 m/s","16 m/s","4 m/s"]',1,'Displacement = 0 (returned to start). Average velocity = 0/time = 0 m/s.',1,'displacement and velocity'),
(v_l2,'On a position-time graph, which indicates an object is at rest?','["A steep slope","A horizontal line","A curve","A line with negative slope"]',1,'Horizontal line → Δx = 0 → velocity = 0 = at rest.',1,'graph interpretation'),
(v_l2,'A sprinter runs 100 m in 10 s in a straight line. What must be true?','["Velocity was always 10 m/s","Average velocity equals average speed here","Average velocity was at most 10 m/s","Speed is always greater than velocity"]',1,'Straight line, one direction: displacement = distance. Average velocity = average speed = 10 m/s.',2,'velocity vs speed'),
(v_l2,'An object''s position is x(t) = 3t² − 6t + 2. What is its velocity at t = 2 s?','["6 m/s","0 m/s","12 m/s","−6 m/s"]',0,'v(t) = dx/dt = 6t − 6. At t = 2: v = 12 − 6 = 6 m/s.',3,'instantaneous velocity'),
(v_l2,'Can two objects with the same average speed have different average velocities?','["No, speed and velocity are always equal","Yes, if they took different paths","No, one is always greater","Yes, only if they accelerated"]',1,'Same total distance in same time = same average speed. But different final positions = different displacements = different average velocities.',2,'velocity vs speed'),
(v_l2,'[FRQ] A train travels 300 km north in 2 h, then 100 km south in 1 h. (a) Average speed? (b) Average velocity?','["(a) 133 km/h, (b) 67 km/h north","(a) 400/3 km/h, (b) 200/3 km/h north","(a) 150 km/h, (b) 100 km/h north","(a) 200 km/h, (b) 200 km/h north"]',1,'Total distance = 400 km, total time = 3 h. Speed = 400/3 km/h. Displacement = 200 km north. Velocity = 200/3 km/h north.',2,'average speed and velocity'),
(v_l2,'[FRQ] A particle: x=10 m at t=0, x=30 m at t=4 s, x=10 m at t=8 s. (a) Avg velocity 0→8 s? (b) Avg speed 0→8 s?','["(a) 0 m/s, (b) 5 m/s","(a) 5 m/s, (b) 0 m/s","(a) 2.5 m/s, (b) 5 m/s","(a) 0 m/s, (b) 2.5 m/s"]',0,'(a) Displacement = 10−10 = 0 m. Avg velocity = 0. (b) Distance = 20+20 = 40 m. Avg speed = 40/8 = 5 m/s.',3,'average speed and velocity');

-- LESSON 3
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES
(v_l3,'A car increases velocity from 10 m/s to 40 m/s in 6 s. Average acceleration?','["5 m/s²","4 m/s²","50 m/s²","6.7 m/s²"]',0,'a = Δv/Δt = (40−10)/6 = 5 m/s².',1,'average acceleration'),
(v_l3,'What does the slope of a velocity-time graph represent?','["Speed","Displacement","Velocity","Acceleration"]',3,'Slope of v-t graph = Δv/Δt = acceleration. Area under v-t graph = displacement.',1,'graph interpretation'),
(v_l3,'A car at −20 m/s slows to −5 m/s in 3 s. What is the acceleration?','["−5 m/s²","5 m/s²","−8.3 m/s²","8.3 m/s²"]',1,'a = (−5−(−20))/3 = 15/3 = +5 m/s². Positive because velocity is becoming less negative.',2,'acceleration direction'),
(v_l3,'An object moves in the negative direction and speeds up. Its acceleration is:','["Positive","Zero","Negative","Cannot be determined"]',2,'Speeding up in negative direction → velocity more negative → acceleration is negative (same direction as velocity).',2,'acceleration direction'),
(v_l3,'What does the area under a velocity-time graph represent?','["Acceleration","Speed","Displacement","Force"]',2,'Area under v-t graph = displacement. A key AP graph interpretation.',1,'graph interpretation'),
(v_l3,'A ball is thrown upward. At its highest point, what is its acceleration?','["Zero","9.8 m/s² upward","9.8 m/s² downward","Cannot be determined"]',2,'Gravity always acts downward at 9.8 m/s². Velocity = 0 at peak but acceleration is still 9.8 m/s² downward.',2,'gravity and acceleration'),
(v_l3,'A car brakes from 25 m/s to rest in 5 s. Magnitude of deceleration?','["5 m/s²","0.2 m/s²","125 m/s²","30 m/s²"]',0,'a = (0−25)/5 = −5 m/s². Magnitude = 5 m/s².',1,'deceleration'),
(v_l3,'Which describes an object with zero acceleration?','["An object at rest only","An object moving at constant velocity only","Either an object at rest or moving at constant velocity","An object moving in a circle"]',2,'Zero acceleration = no change in velocity. Includes both at rest (v=0) and constant velocity (nonzero, straight line).',2,'zero acceleration'),
(v_l3,'[FRQ] A train decelerates from 30 m/s to 0 over 15 s. (a) Acceleration? (b) Shape on v-t graph?','["(a) −2 m/s², (b) straight line with negative slope","(a) 2 m/s², (b) curve","(a) −0.5 m/s², (b) horizontal line","(a) −2 m/s², (b) parabola"]',0,'(a) a = (0−30)/15 = −2 m/s². (b) Uniform acceleration → straight line on v-t graph.',2,'uniform deceleration'),
(v_l3,'[FRQ] Can an object have nonzero velocity but zero acceleration? Give an example.','["Impossible","A car at constant 60 mph on a straight highway","A ball at the top of its arc","A braking car"]',1,'Constant velocity (speed and direction unchanged) means zero acceleration. Car cruising at constant speed in a straight line.',2,'velocity and acceleration');

-- LESSON 4
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES
(v_l4,'A car starts from rest and accelerates at 3 m/s² for 5 s. Final velocity?','["15 m/s","8 m/s","1.7 m/s","45 m/s"]',0,'v = v0 + at = 0 + 3(5) = 15 m/s.',1,'kinematic equation 1'),
(v_l4,'A ball dropped from rest falls for 3 s. How far? (g = 9.8 m/s²)','["29.4 m","44.1 m","9.8 m","88.2 m"]',1,'Δx = v0t + (1/2)at² = 0 + (1/2)(9.8)(9) = 44.1 m.',1,'kinematic equation 2'),
(v_l4,'A car at 20 m/s brakes at −4 m/s² until stopped. Distance?','["50 m","5 m","80 m","100 m"]',0,'v² = v0² + 2aΔx: 0 = 400 + 2(−4)Δx → Δx = 50 m.',2,'kinematic equation 3'),
(v_l4,'Which equation to use when acceleration is unknown?','["v = v0 + at","Δx = v0t + (1/2)at²","v² = v0² + 2aΔx","Δx = (v + v0)/2 × t"]',3,'Equation 4 contains no acceleration term — use it when a is unknown or irrelevant.',1,'choosing equations'),
(v_l4,'A rocket starts from rest and reaches 400 m/s in 200 m. Acceleration?','["400 m/s²","200 m/s²","1 m/s²","4 m/s²"]',0,'v² = v0² + 2aΔx: 160000 = 0 + 2a(200) → a = 400 m/s².',2,'kinematic equation 3'),
(v_l4,'A stone is thrown upward at 15 m/s. After 2 s, its velocity? (g = 9.8 m/s²)','["4.6 m/s upward","−4.6 m/s","24.6 m/s","−24.6 m/s"]',1,'v = 15 + (−9.8)(2) = 15 − 19.6 = −4.6 m/s. Negative = moving downward.',2,'free fall'),
(v_l4,'Required assumptions for kinematic equations?','["Object must be in free fall","Acceleration must be constant","Object must move in a straight line","Both B and C"]',3,'Kinematic equations require BOTH constant acceleration AND one-dimensional (straight-line) motion.',2,'assumptions of kinematics'),
(v_l4,'A car going 30 m/s accelerates at 2 m/s² for 4 s. Distance?','["136 m","248 m","126 m","160 m"]',0,'Δx = v0t + (1/2)at² = 30(4) + (1/2)(2)(16) = 120 + 16 = 136 m.',2,'kinematic equation 2'),
(v_l4,'[FRQ] A motorcycle starts from rest, reaches 24 m/s in 8 s. (a) Acceleration? (b) Distance? (c) Velocity at 5 s?','["(a) 3 m/s², (b) 96 m, (c) 15 m/s","(a) 3 m/s², (b) 192 m, (c) 15 m/s","(a) 3 m/s², (b) 96 m, (c) 24 m/s","(a) 4 m/s², (b) 96 m, (c) 20 m/s"]',0,'(a) a = 24/8 = 3 m/s². (b) Δx = (1/2)(3)(64) = 96 m. (c) v = 0 + 3(5) = 15 m/s.',2,'applying kinematics'),
(v_l4,'[FRQ] A stone is dropped from a 45 m cliff. (a) Time to hit ground? (b) Speed at impact? (g = 10 m/s²)','["(a) 3 s, (b) 30 m/s","(a) 4.5 s, (b) 45 m/s","(a) 3 s, (b) 45 m/s","(a) 9 s, (b) 30 m/s"]',0,'(a) 45 = (1/2)(10)t² → t = 3 s. (b) v = 0 + 10(3) = 30 m/s.',2,'free fall');

-- LESSON 5
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES
(v_l5,'A projectile is launched horizontally. What is its horizontal acceleration?','["9.8 m/s² downward","0 m/s²","9.8 m/s² horizontal","Depends on launch speed"]',1,'Only gravity acts on a projectile — vertically. Horizontal acceleration = 0.',1,'projectile independence'),
(v_l5,'A ball is thrown at 30° above horizontal at 20 m/s. Initial vertical velocity?','["20 m/s","10 m/s","17.3 m/s","11.5 m/s"]',1,'v0y = v0 sin θ = 20 sin 30° = 20 × 0.5 = 10 m/s.',1,'vector components'),
(v_l5,'At the highest point of its trajectory, a projectile has:','["Zero velocity","Zero acceleration","Zero horizontal velocity","Zero vertical velocity"]',3,'At peak, vy = 0. Horizontal velocity unchanged. Acceleration still 9.8 m/s² downward.',1,'projectile at peak'),
(v_l5,'A ball launched at 40 m/s at 45°. Both components of initial velocity?','["Both 28.3 m/s","H = 34.6, V = 20 m/s","H = 20, V = 34.6 m/s","Both 40 m/s"]',0,'At 45°: v0x = v0y = 40 × cos 45° = 40 × 0.707 ≈ 28.3 m/s.',1,'vector components'),
(v_l5,'A ball launched horizontally at 15 m/s from a 20 m cliff. Time to land? (g = 10 m/s²)','["2 s","4 s","1.5 s","3 s"]',0,'Vertical: 20 = (1/2)(10)t² → t = 2 s. Horizontal velocity does not affect time.',2,'time of flight'),
(v_l5,'Using the ball from the previous problem, how far horizontally does it travel?','["30 m","20 m","15 m","10 m"]',0,'Δx = v0x × t = 15 × 2 = 30 m.',2,'horizontal range'),
(v_l5,'A projectile at 60° and one at 30° with the same speed. How do ranges compare?','["60° travels farther","30° travels farther","They travel the same range","Cannot determine without speed"]',2,'R = v0² sin(2θ)/g. sin(120°) = sin(60°). Complementary angles give equal range.',3,'range and angle'),
(v_l5,'A stone thrown horizontally at 3 m/s from a 1.25 m table. How far from the base? (g = 10 m/s²)','["1.5 m","3 m","0.5 m","2 m"]',0,'Time: 1.25 = (1/2)(10)t² → t = 0.5 s. Range = 3 × 0.5 = 1.5 m.',2,'horizontal projectile'),
(v_l5,'[FRQ] A soccer ball kicked at 25 m/s at 37°. (a) Time to peak? (b) Max height? (g = 10 m/s²)','["(a) 1.5 s, (b) 11.25 m","(a) 2.5 s, (b) 31.25 m","(a) 1.5 s, (b) 22.5 m","(a) 2 s, (b) 11.25 m"]',0,'v0y = 25 sin 37° ≈ 15 m/s. (a) t = 15/10 = 1.5 s. (b) Δy = 15(1.5) − (1/2)(10)(2.25) = 11.25 m.',3,'projectile maximum height'),
(v_l5,'[FRQ] Ball at 20 m/s at 53° from flat ground. (a) Total time? (b) Horizontal range? (g=10, sin53°=0.8, cos53°=0.6)','["(a) 3.2 s, (b) 38.4 m","(a) 2 s, (b) 24 m","(a) 3.2 s, (b) 24 m","(a) 1.6 s, (b) 38.4 m"]',0,'v0y = 16 m/s, v0x = 12 m/s. (a) t = 2×16/10 = 3.2 s. (b) Range = 12 × 3.2 = 38.4 m.',3,'full projectile motion');

END $outer$;
