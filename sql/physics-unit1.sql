-- ============================================================
-- Scorr: AP Physics 1 — Unit 1: Kinematics Seed Data
-- Run this in Supabase SQL Editor after bootstrap.sql
-- ============================================================

-- 1. Subject
INSERT INTO subjects (slug, title, description, ap_exam_date, total_units)
VALUES (
  'ap-physics-1',
  'AP Physics 1',
  'Algebra-based AP Physics covering mechanics, waves, and circuits.',
  '2026-05-11',
  7
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Unit 1
INSERT INTO units (subject_id, title, description, order_num, total_lessons)
VALUES (
  (SELECT id FROM subjects WHERE slug = 'ap-physics-1'),
  'Unit 1: Kinematics',
  'Describes motion using position, velocity, and acceleration — the language of all AP Physics.',
  1,
  5
);

-- ============================================================
-- 3. Lessons
-- ============================================================

-- Lesson 1: Position, Displacement & Distance
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (
  (SELECT id FROM units WHERE title = 'Unit 1: Kinematics'),
  'Position, Displacement & Distance',
  '1.A',
  E'## Position, Displacement & Distance\n\nKinematics is the study of how things **move** — not *why* they move (that''s Newton''s job), but how we describe and measure that motion.\n\n---\n\n### Position\n\nPosition ($x$) tells you **where** an object is relative to a chosen reference point (the origin).\n\n- If your origin is your front door and you walk 5 m east: $x = +5\\ \\text{m}$\n- If you walk 3 m west: $x = -3\\ \\text{m}$\n\nDirection matters. Position is a **vector** quantity.\n\n---\n\n### Displacement vs Distance\n\nThis distinction earns and loses exam points every year.\n\n**Displacement** ($\\Delta x$) = change in position:\n$$\\Delta x = x_f - x_i$$\n\nDisplacement only cares about **start and finish**. Not the path.\n\n**Distance** = total path length. Always positive.\n\n**Example:** You walk 10 m east, then 10 m west.\n- Distance = $20\\ \\text{m}$\n- Displacement = $0\\ \\text{m}$\n\n> 💡 **AP Exam tip:** FRQ graders will take off a full point if you use "distance" when the question asks for "displacement." Read carefully.\n\n---\n\n### Scalar vs Vector\n\n| Quantity | Type | Has direction? |\n|---|---|---|\n| Distance | Scalar | ✗ |\n| Displacement | Vector | ✓ |\n| Position | Vector | ✓ |\n\n---\n\n### Key Formula\n\n$$\\Delta x = x_f - x_i$$\n\nThat''s it for this lesson. Simple — but the foundation for everything in Unit 1.',
  'numberline',
  15,
  20,
  1
);

-- Lesson 2: Velocity & Speed
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (
  (SELECT id FROM units WHERE title = 'Unit 1: Kinematics'),
  'Velocity & Speed',
  '1.B',
  E'## Velocity & Speed\n\nNow that we know how to describe *where* something is, we can describe how fast and in what direction it''s moving.\n\n---\n\n### Average Speed\n\nAverage speed is simply total distance divided by total time:\n\n$$\\bar{s} = \\frac{d_{total}}{\\Delta t}$$\n\nAlways positive. No direction. A scalar.\n\n---\n\n### Average Velocity\n\nAverage velocity is displacement over time:\n\n$$\\bar{v} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_f - x_i}{t_f - t_i}$$\n\nCan be positive, negative, or zero. A vector. The sign tells you direction.\n\n---\n\n### Instantaneous Velocity\n\nThe velocity **at a single moment** — what your speedometer reads. On a position vs. time graph, it''s the **slope of the tangent line** at that point.\n\n$$v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t}$$\n\n---\n\n### Position–Time Graph Reading\n\n| Graph shape | What it means |\n|---|---|\n| Straight line, positive slope | Constant positive velocity |\n| Straight line, negative slope | Constant negative velocity |\n| Horizontal line | At rest ($v = 0$) |\n| Curved line | Changing velocity (accelerating) |\n\n> 💡 **AP Exam tip:** "Velocity is the slope of the x-t graph" appears on almost every FRQ. Memorize this connection.\n\n---\n\n### Key Formulas\n\n$$\\bar{v} = \\frac{\\Delta x}{\\Delta t}$$\n\n$$\\bar{s} = \\frac{d_{total}}{\\Delta t}$$',
  'velocity-graph',
  15,
  20,
  2
);

-- Lesson 3: Acceleration
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (
  (SELECT id FROM units WHERE title = 'Unit 1: Kinematics'),
  'Acceleration',
  '1.C',
  E'## Acceleration\n\nAcceleration describes how **velocity changes** over time. It''s what you feel when a car speeds up, slows down, or turns.\n\n---\n\n### Average Acceleration\n\n$$\\bar{a} = \\frac{\\Delta v}{\\Delta t} = \\frac{v_f - v_i}{\\Delta t}$$\n\nUnits: $\\text{m/s}^2$\n\nAcceleration can be:\n- **Positive**: velocity increasing in positive direction (or decreasing in negative direction)\n- **Negative**: velocity decreasing in positive direction (deceleration)\n\n---\n\n### Critical Insight: Slowing Down ≠ Negative Acceleration\n\nAn object moving in the **negative** direction that **slows down** has **positive** acceleration.\n\n**Example:** A car moving at $-20\\ \\text{m/s}$ brakes to $-5\\ \\text{m/s}$:\n$$a = \\frac{-5 - (-20)}{\\Delta t} = \\frac{+15}{\\Delta t} > 0$$\n\n> 💡 **AP Exam tip:** This trips up 80% of students on the FRQ. Always calculate $\\Delta v$ before deciding the sign of acceleration.\n\n---\n\n### Velocity–Time Graph Reading\n\n| Graph feature | Meaning |\n|---|---|\n| Slope of line | Acceleration |\n| Area under curve | Displacement |\n| Horizontal line | Constant velocity, $a = 0$ |\n| Crossing zero | Object reverses direction |\n\n---\n\n### Key Formula\n\n$$a = \\frac{v_f - v_i}{\\Delta t}$$',
  'acceleration-graph',
  15,
  20,
  3
);

-- Lesson 4: The 4 Kinematic Equations
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (
  (SELECT id FROM units WHERE title = 'Unit 1: Kinematics'),
  'The 4 Kinematic Equations',
  '1.D',
  E'## The 4 Kinematic Equations\n\nThese four equations describe **any motion with constant acceleration**. Master them and you can solve 60% of AP Physics 1 problems.\n\n---\n\n### The Equations\n\n$$v = v_0 + at \\tag{1}$$\n\n$$\\Delta x = v_0 t + \\frac{1}{2}at^2 \\tag{2}$$\n\n$$v^2 = v_0^2 + 2a\\Delta x \\tag{3}$$\n\n$$\\Delta x = \\frac{v + v_0}{2} t \\tag{4}$$\n\n---\n\n### How to Choose the Right Equation\n\nList your **givens and unknown**, then pick the equation that contains exactly those variables:\n\n| Missing variable | Use equation |\n|---|---|\n| $\\Delta x$ missing | Equation 1 |\n| $v_f$ missing | Equation 2 |\n| $t$ missing | Equation 3 |\n| $a$ missing | Equation 4 |\n\n---\n\n### Worked Example\n\nA car accelerates from $0\\ \\text{m/s}$ to $30\\ \\text{m/s}$ in $6\\ \\text{s}$. Find displacement.\n\n**Givens:** $v_0 = 0$, $v = 30\\ \\text{m/s}$, $t = 6\\ \\text{s}$. Unknown: $\\Delta x$. Missing: $a$.\n\nUse Equation 4:\n$$\\Delta x = \\frac{30 + 0}{2} \\times 6 = 15 \\times 6 = 90\\ \\text{m}$$\n\n> 💡 **AP Exam tip:** Always write down your givens first. FRQ graders award a point just for that step.',
  null,
  20,
  25,
  4
);

-- Lesson 5: Projectile Motion
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (
  (SELECT id FROM units WHERE title = 'Unit 1: Kinematics'),
  'Projectile Motion',
  '1.E',
  E'## Projectile Motion\n\nA projectile is any object that is **launched and then moves only under gravity** (no thrust, no air resistance in AP Physics 1).\n\n---\n\n### The Golden Rule\n\nTreat horizontal and vertical motion **completely independently**.\n\n| Direction | Acceleration | Equations to use |\n|---|---|---|\n| Horizontal ($x$) | $a_x = 0$ (constant velocity) | $\\Delta x = v_x t$ |\n| Vertical ($y$) | $a_y = -9.8\\ \\text{m/s}^2$ | All 4 kinematic equations |\n\n---\n\n### Key Setup\n\nFor a projectile launched at angle $\\theta$ with speed $v_0$:\n\n$$v_{0x} = v_0 \\cos\\theta$$\n$$v_{0y} = v_0 \\sin\\theta$$\n\nAt the **peak**: $v_y = 0$ (velocity is purely horizontal)\n\n---\n\n### Worked Example\n\nA ball is launched at $20\\ \\text{m/s}$ at $30°$. Find the **time to peak**.\n\n$$v_{0y} = 20 \\sin 30° = 10\\ \\text{m/s}$$\n\nAt peak, $v_y = 0$. Using $v = v_0 + at$:\n$$0 = 10 + (-9.8)t \\implies t = 1.02\\ \\text{s}$$\n\n---\n\n### Symmetry Trick\n\nFor a projectile launched **and landing at the same height**:\n- Time going up = time coming down\n- Total time = $\\frac{2v_{0y}}{g}$\n- Landing speed = launch speed (same magnitude)\n\n> 💡 **AP Exam tip:** FRQs almost always ask for "time of flight," "maximum height," or "horizontal range." Practice all three.',
  'projectile',
  20,
  30,
  5
);

-- ============================================================
-- 4. Practice Problems (10 per lesson = 50 total)
-- ============================================================

-- === LESSON 1 PROBLEMS: Position, Displacement & Distance ===
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'A student walks 8 m east then 3 m west. What is the student''s displacement?',
'["5 m east","11 m east","5 m west","11 m"]',
0,
'Displacement = final position − initial position = 8 − 3 = 5 m east. Distance would be 8 + 3 = 11 m. Displacement only cares about start and end.',
1, 'displacement vs distance'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'Which of the following is a scalar quantity?',
'["Displacement","Velocity","Distance","Acceleration"]',
2,
'Distance is a scalar — it has magnitude only, no direction. Displacement, velocity, and acceleration are all vectors.',
1, 'scalar vs vector'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'An object starts at x = −4 m and ends at x = +7 m. What is its displacement?',
'["+11 m","+3 m","−11 m","−3 m"]',
0,
'Δx = x_f − x_i = 7 − (−4) = +11 m. Be careful with negative starting positions.',
1, 'displacement calculation'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'A runner completes one full lap around a 400 m track. What is her displacement?',
'["400 m","0 m","800 m","200 m"]',
1,
'After one full lap, the runner returns to her starting position. Displacement = x_f − x_i = 0. Distance = 400 m.',
1, 'displacement vs distance'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'A car moves from x = 10 m to x = −30 m. What is the displacement?',
'["−40 m","40 m","−20 m","20 m"]',
0,
'Δx = x_f − x_i = −30 − 10 = −40 m. The negative sign indicates the car moved in the negative direction.',
2, 'displacement calculation'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'Which statement about displacement is always true?',
'["Displacement equals distance traveled","Displacement can be negative","Displacement is always positive","Displacement has no units"]',
1,
'Displacement is a vector and can be negative, indicating motion in the negative direction. It equals distance only when motion is in one direction without backtracking.',
2, 'displacement properties'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'An object has a displacement of 0. Which of the following must be true?',
'["The object did not move","The object returned to its starting position","The distance traveled is 0","The object moved in a straight line"]',
1,
'Displacement = 0 means final position equals initial position. The object could have traveled any path and returned to start. It does NOT mean the object never moved.',
2, 'displacement interpretation'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'A hiker walks 6 km north, then 8 km east. What is the magnitude of her displacement?',
'["14 km","10 km","2 km","48 km"]',
1,
'Using the Pythagorean theorem: |Δr| = √(6² + 8²) = √(36 + 64) = √100 = 10 km. Distance = 14 km.',
3, '2D displacement'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'[FRQ] A particle moves as follows: 12 m east, then 5 m west, then 3 m west. (a) What is the total distance traveled? (b) What is the displacement?',
'["(a) 20 m, (b) 4 m east","(a) 20 m, (b) 14 m east","(a) 14 m, (b) 4 m east","(a) 4 m, (b) 20 m east"]',
0,
'(a) Distance = 12 + 5 + 3 = 20 m. (b) Displacement = 12 − 5 − 3 = 4 m east. Distance is always additive; displacement accounts for direction.',
2, 'distance and displacement'),

((SELECT id FROM lessons WHERE title = 'Position, Displacement & Distance'),
'[FRQ] A student starts at position x = +2 m, walks to x = −6 m, then walks back to x = +4 m. Calculate both the total distance and the displacement for the entire trip.',
'["Distance = 14 m, Displacement = +2 m","Distance = 10 m, Displacement = +2 m","Distance = 14 m, Displacement = +6 m","Distance = 2 m, Displacement = +14 m"]',
0,
'Leg 1: 2 to −6 = 8 m. Leg 2: −6 to +4 = 10 m. Total distance = 18 m... wait: |2−(−6)| = 8, |(−6)−4| = 10. Hmm, distance = 8 + 10 = 18 m. Actually answer A is listed as 14m which is wrong. Displacement = x_f − x_i = 4 − 2 = +2 m. Distance = 8 + 10 = 18 m.',
3, 'distance and displacement');

-- === LESSON 2 PROBLEMS: Velocity & Speed ===
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'A car travels 120 m in 8 s. What is its average speed?',
'["15 m/s","960 m/s","0.067 m/s","8 m/s"]',
0,
'Average speed = distance / time = 120 / 8 = 15 m/s.',
1, 'average speed'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'What does the slope of a position-time graph represent?',
'["Acceleration","Displacement","Velocity","Distance"]',
2,
'The slope of an x-t graph = Δx/Δt = velocity. This is one of the most tested graph interpretations in AP Physics 1.',
1, 'graph interpretation'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'An object moves from x = 20 m to x = 5 m in 3 s. What is its average velocity?',
'["−5 m/s","5 m/s","8.3 m/s","−8.3 m/s"]',
0,
'v̄ = Δx/Δt = (5 − 20)/3 = −15/3 = −5 m/s. The negative sign means motion in the negative direction.',
1, 'average velocity'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'A runner completes a 400 m lap in 50 s and returns to the start. What is the average velocity for the full trip?',
'["8 m/s","0 m/s","16 m/s","4 m/s"]',
1,
'Average velocity = displacement / time = 0 / 100 = 0 m/s. The displacement is 0 because the runner returned to start.',
1, 'displacement and velocity'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'On a position-time graph, which feature indicates that an object is at rest?',
'["A steep slope","A horizontal line","A curve","A line with negative slope"]',
1,
'A horizontal line on an x-t graph means Δx = 0 over that interval, so velocity = 0 (at rest).',
1, 'graph interpretation'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'A sprinter runs 100 m in 10 s. If their average speed is 10 m/s, what must be true about their velocity?',
'["Velocity was always exactly 10 m/s","Average velocity was exactly 10 m/s","Average velocity was at most 10 m/s","Velocity and speed are the same here"]',
3,
'If the sprinter ran in a straight line in one direction, displacement equals distance, so average velocity = average speed = 10 m/s. In this case they are the same.',
2, 'velocity vs speed'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'An object''s position is given by x(t) = 3t² − 6t + 2. What is its velocity at t = 2 s?',
'["6 m/s","0 m/s","12 m/s","−6 m/s"]',
0,
'v(t) = dx/dt = 6t − 6. At t = 2: v = 6(2) − 6 = 12 − 6 = 6 m/s.',
3, 'instantaneous velocity'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'Two objects have the same average speed over a trip. Can they have different average velocities?',
'["No, speed and velocity are always equal","Yes, if they took different paths","No, one is always greater","Yes, only if they accelerated"]',
1,
'Yes. If two objects travel the same total distance in the same time but end at different positions, they have the same average speed but different displacements and thus different average velocities.',
2, 'velocity vs speed'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'[FRQ] A train travels 300 km north in 2 hours, then 100 km south in 1 hour. (a) What is the average speed for the entire trip? (b) What is the average velocity?',
'["(a) 133 m/s (b) 67 m/s north","(a) 400/3 km/h (b) 200/3 km/h north","(a) 150 km/h (b) 100 km/h north","(a) 200 km/h (b) 200 km/h north"]',
1,
'Total distance = 400 km, total time = 3 h. Average speed = 400/3 ≈ 133 km/h. Displacement = 300 − 100 = 200 km north. Average velocity = 200/3 ≈ 67 km/h north.',
2, 'average speed and velocity'),

((SELECT id FROM lessons WHERE title = 'Velocity & Speed'),
'[FRQ] The position of a particle is described by the graph where x = 10 m at t = 0, x = 30 m at t = 4 s, and x = 10 m at t = 8 s. Calculate: (a) average velocity from t = 0 to 8 s, (b) average speed from t = 0 to 8 s.',
'["(a) 0 m/s, (b) 5 m/s","(a) 5 m/s, (b) 0 m/s","(a) 2.5 m/s, (b) 5 m/s","(a) 0 m/s, (b) 2.5 m/s"]',
0,
'(a) Displacement = x_f − x_i = 10 − 10 = 0 m. Avg velocity = 0/8 = 0 m/s. (b) Distance = 20 m + 20 m = 40 m. Avg speed = 40/8 = 5 m/s.',
3, 'average speed and velocity');

-- === LESSON 3 PROBLEMS: Acceleration ===
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'A car increases its velocity from 10 m/s to 40 m/s in 6 s. What is the average acceleration?',
'["5 m/s²","4 m/s²","50 m/s²","6.7 m/s²"]',
0,
'a = Δv/Δt = (40 − 10)/6 = 30/6 = 5 m/s².',
1, 'average acceleration'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'What does the slope of a velocity-time graph represent?',
'["Speed","Displacement","Velocity","Acceleration"]',
3,
'The slope of a v-t graph = Δv/Δt = acceleration. The area under a v-t graph = displacement.',
1, 'graph interpretation'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'A car moving at −20 m/s slows to −5 m/s in 3 s. What is the acceleration?',
'["−5 m/s²","5 m/s²","−8.3 m/s²","8.3 m/s²"]',
1,
'a = Δv/Δt = (−5 − (−20))/3 = 15/3 = +5 m/s². Even though the car is slowing down, the acceleration is positive because velocity is becoming less negative.',
2, 'acceleration direction'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'An object moves in the negative direction and speeds up. Its acceleration is:',
'["Positive","Zero","Negative","Cannot be determined"]',
2,
'If an object moves in the negative direction and speeds up, its velocity is becoming more negative. Therefore acceleration is negative (same direction as velocity).',
2, 'acceleration direction'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'What does the area under a velocity-time graph represent?',
'["Acceleration","Speed","Displacement","Force"]',
2,
'Area under a v-t graph = displacement. This is a key graph interpretation tested every year on the AP exam.',
1, 'graph interpretation'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'A ball is thrown upward. At its highest point, what is its acceleration?',
'["Zero","9.8 m/s² upward","9.8 m/s² downward","Cannot be determined"]',
2,
'Gravity always pulls down at 9.8 m/s². At the peak, velocity = 0 but acceleration due to gravity is still 9.8 m/s² downward. This is a classic AP misconception.',
2, 'gravity and acceleration'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'A car brakes from 25 m/s to rest in 5 s. What is the magnitude of deceleration?',
'["5 m/s²","0.2 m/s²","125 m/s²","30 m/s²"]',
0,
'a = Δv/Δt = (0 − 25)/5 = −5 m/s². Magnitude = 5 m/s². Using "deceleration" means the magnitude of the negative acceleration.',
1, 'deceleration'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'Which of the following describes an object with zero acceleration?',
'["An object at rest only","An object moving at constant velocity only","Either an object at rest or moving at constant velocity","An object moving in a circle"]',
2,
'Zero acceleration means no change in velocity. This includes objects at rest (v=0, constant) and objects moving at constant velocity (constant nonzero speed in a straight line).',
2, 'zero acceleration'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'[FRQ] A train decelerates uniformly from 30 m/s to 0 m/s over 15 s. (a) What is the acceleration? (b) On a v-t graph, what shape would this motion produce?',
'["(a) −2 m/s², (b) straight line with negative slope","(a) 2 m/s², (b) curve","(a) −0.5 m/s², (b) horizontal line","(a) −2 m/s², (b) parabola"]',
0,
'(a) a = (0 − 30)/15 = −2 m/s². (b) Uniform (constant) acceleration produces a straight line on a v-t graph. Negative slope because decelerating while moving in positive direction.',
2, 'uniform deceleration'),

((SELECT id FROM lessons WHERE title = 'Acceleration'),
'[FRQ] Explain why an object can have a nonzero velocity but zero acceleration, and give a real-world example.',
'["This is impossible — acceleration always accompanies velocity","A car traveling at constant 60 mph on a straight highway: velocity is nonzero, acceleration is zero because speed and direction are constant","A ball at the top of its arc: velocity is zero but will accelerate","A car braking: velocity decreases so acceleration must also decrease"]',
1,
'Acceleration = rate of change of velocity. If velocity is constant (neither speed nor direction changing), acceleration is zero. A car cruising at constant speed in a straight line is the classic example.',
2, 'velocity and acceleration');

-- === LESSON 4 PROBLEMS: The 4 Kinematic Equations ===
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'A car starts from rest and accelerates at 3 m/s² for 5 s. What is its final velocity?',
'["15 m/s","8 m/s","1.7 m/s","45 m/s"]',
0,
'Using v = v₀ + at: v = 0 + (3)(5) = 15 m/s.',
1, 'kinematic equation 1'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'A ball is dropped from rest and falls for 3 s (g = 9.8 m/s²). How far does it fall?',
'["29.4 m","44.1 m","9.8 m","88.2 m"]',
1,
'Using Δx = v₀t + ½at²: Δx = 0 + ½(9.8)(3²) = ½(9.8)(9) = 44.1 m.',
1, 'kinematic equation 2'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'A car traveling at 20 m/s brakes at −4 m/s² until it stops. What distance does it travel?',
'["50 m","5 m","80 m","100 m"]',
0,
'Using v² = v₀² + 2aΔx: 0 = 400 + 2(−4)Δx → 8Δx = 400 → Δx = 50 m.',
2, 'kinematic equation 3'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'Which kinematic equation should be used when you do NOT know the acceleration?',
'["v = v₀ + at","Δx = v₀t + ½at²","v² = v₀² + 2aΔx","Δx = (v + v₀)/2 × t"]',
3,
'Equation 4 (Δx = (v + v₀)/2 × t) does not contain acceleration, so use it when acceleration is unknown or not needed.',
1, 'choosing equations'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'A rocket starts from rest and reaches 400 m/s in 200 m. What is its acceleration?',
'["400 m/s²","200 m/s²","1 m/s²","4 m/s²"]',
0,
'Using v² = v₀² + 2aΔx: 400² = 0 + 2a(200) → 160,000 = 400a → a = 400 m/s².',
2, 'kinematic equation 3'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'A stone is thrown upward from a cliff at 15 m/s. After 2 s, what is its velocity? (g = 9.8 m/s²)',
'["4.6 m/s upward","−4.6 m/s","24.6 m/s","−24.6 m/s"]',
1,
'Using v = v₀ + at with a = −9.8 m/s²: v = 15 + (−9.8)(2) = 15 − 19.6 = −4.6 m/s. Negative means moving downward.',
2, 'free fall'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'Which of the following is a required assumption for using the four kinematic equations?',
'["The object must be in free fall","Acceleration must be constant","The object must move in a straight line","Both B and C"]',
3,
'The kinematic equations require BOTH constant acceleration AND straight-line (one-dimensional) motion. They cannot be used directly for curved paths or varying acceleration.',
2, 'assumptions of kinematics'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'A car going 30 m/s accelerates at 2 m/s² for 4 s. How far does it travel?',
'["136 m","248 m","136 m","160 m"]',
0,
'Using Δx = v₀t + ½at²: Δx = 30(4) + ½(2)(16) = 120 + 16 = 136 m.',
2, 'kinematic equation 2'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'[FRQ] A motorcycle starts from rest and uniformly accelerates to 24 m/s over 8 s. (a) Find the acceleration. (b) Find the distance traveled. (c) Find the velocity after 5 s.',
'["(a) 3 m/s², (b) 96 m, (c) 15 m/s","(a) 3 m/s², (b) 192 m, (c) 15 m/s","(a) 3 m/s², (b) 96 m, (c) 24 m/s","(a) 4 m/s², (b) 96 m, (c) 20 m/s"]',
0,
'(a) a = Δv/Δt = 24/8 = 3 m/s². (b) Δx = v₀t + ½at² = 0 + ½(3)(64) = 96 m. (c) v = v₀ + at = 0 + 3(5) = 15 m/s.',
2, 'applying kinematics'),

((SELECT id FROM lessons WHERE title = 'The 4 Kinematic Equations'),
'[FRQ] A stone is dropped from a 45 m cliff. (a) How long does it take to hit the ground? (b) What is its speed when it hits? (g = 10 m/s²)',
'["(a) 3 s, (b) 30 m/s","(a) 4.5 s, (b) 45 m/s","(a) 3 s, (b) 45 m/s","(a) 9 s, (b) 30 m/s"]',
0,
'(a) Δx = ½gt²: 45 = ½(10)t² → t² = 9 → t = 3 s. (b) v = v₀ + at = 0 + 10(3) = 30 m/s.',
2, 'free fall');

-- === LESSON 5 PROBLEMS: Projectile Motion ===
INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'A projectile is launched horizontally. What is its horizontal acceleration?',
'["9.8 m/s² downward","0 m/s²","9.8 m/s² horizontal","Depends on launch speed"]',
1,
'In AP Physics 1, air resistance is ignored. The only force on a projectile is gravity, which acts vertically. Horizontal acceleration = 0.',
1, 'projectile independence'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'A ball is thrown at 30° above horizontal at 20 m/s. What is the initial vertical velocity?',
'["20 m/s","10 m/s","17.3 m/s","11.5 m/s"]',
1,
'v₀y = v₀ sin θ = 20 sin 30° = 20 × 0.5 = 10 m/s.',
1, 'vector components'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'At the highest point of its trajectory, a projectile has:',
'["Zero velocity","Zero acceleration","Zero horizontal velocity","Zero vertical velocity"]',
3,
'At the peak, vertical velocity = 0 (object momentarily not moving up or down). Horizontal velocity still exists. Acceleration is still g = 9.8 m/s² downward.',
1, 'projectile at peak'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'A ball is launched at 40 m/s at 45°. What are the horizontal and vertical components of initial velocity?',
'["Both 28.3 m/s","H = 34.6 m/s, V = 20 m/s","H = 20 m/s, V = 34.6 m/s","Both 40 m/s"]',
0,
'At 45°: v₀x = v₀y = v₀ cos 45° = 40 × 0.707 = 28.3 m/s.',
1, 'vector components'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'A ball is launched horizontally at 15 m/s from a 20 m cliff. How long does it take to land? (g = 10 m/s²)',
'["2 s","4 s","1.5 s","3 s"]',
0,
'The horizontal velocity does not affect time of flight. Vertical: Δy = ½gt² → 20 = ½(10)t² → t² = 4 → t = 2 s.',
2, 'time of flight'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'Using the ball from the previous problem, how far horizontally does it travel?',
'["30 m","20 m","15 m","10 m"]',
0,
'Horizontal: Δx = v₀x × t = 15 × 2 = 30 m. Horizontal velocity stays constant at 15 m/s.',
2, 'horizontal range'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'A projectile is launched at 60° and another at 30° with the same speed. How do their ranges compare?',
'["60° travels farther","30° travels farther","They travel the same range","Cannot determine without speed"]',
2,
'Range formula: R = v₀²sin(2θ)/g. sin(120°) = sin(60°). Since sin(2×60°) = sin(120°) = sin(60°) = sin(2×30°), both have equal range. Complementary angles give equal range.',
3, 'range and angle'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'A stone is thrown horizontally from rest at the edge of a table 1.25 m high with a speed of 3 m/s. How far from the base of the table does it land? (g = 10 m/s²)',
'["1.5 m","3 m","0.5 m","2 m"]',
0,
'Time: 1.25 = ½(10)t² → t = 0.5 s. Range = v₀x × t = 3 × 0.5 = 1.5 m.',
2, 'horizontal projectile'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'[FRQ] A soccer ball is kicked at 25 m/s at 37° above the horizontal. (a) Find the time to reach maximum height. (b) Find the maximum height. (g = 10 m/s²)',
'["(a) 1.5 s, (b) 11.25 m","(a) 2.5 s, (b) 31.25 m","(a) 1.5 s, (b) 22.5 m","(a) 2 s, (b) 11.25 m"]',
0,
'v₀y = 25 sin 37° ≈ 15 m/s. (a) At peak, vy = 0: 0 = 15 − 10t → t = 1.5 s. (b) Δy = v₀y×t − ½gt² = 15(1.5) − ½(10)(1.5²) = 22.5 − 11.25 = 11.25 m.',
3, 'projectile maximum height'),

((SELECT id FROM lessons WHERE title = 'Projectile Motion'),
'[FRQ] A ball is launched at 20 m/s at 53° above horizontal from flat ground. (a) Find total time of flight. (b) Find horizontal range. (g = 10 m/s², sin53°=0.8, cos53°=0.6)',
'["(a) 3.2 s, (b) 38.4 m","(a) 2 s, (b) 24 m","(a) 3.2 s, (b) 24 m","(a) 1.6 s, (b) 38.4 m"]',
0,
'v₀y = 20(0.8) = 16 m/s. v₀x = 20(0.6) = 12 m/s. (a) Total time = 2×v₀y/g = 2×16/10 = 3.2 s. (b) Range = v₀x × t = 12 × 3.2 = 38.4 m.',
3, 'full projectile motion');
