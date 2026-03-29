# The 4 Kinematic Equations
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.D**
*Estimated time: 18 minutes | XP reward: 20*

---

## What this lesson covers

By the end of this lesson you will be able to:
- State all 4 kinematic equations from memory
- Identify which equation to use based on known and unknown variables
- Solve single-step and multi-step kinematic problems
- Apply the equations to free fall problems
- Check answers using units and reasonableness

---

## The Big Rule — When These Equations Apply

**The 4 kinematic equations ONLY work when acceleration is constant.**

If a problem describes changing acceleration, these equations do not apply. For AP Physics 1, most kinematics problems involve constant acceleration (including free fall where $a = -9.8\ \text{m/s}^2$).

---

## The 4 Equations

These 5 variables appear in kinematic problems:
- $v_i$ = initial velocity (m/s)
- $v_f$ = final velocity (m/s)
- $a$ = acceleration (m/s²) — must be constant
- $t$ = time (s)
- $\Delta x$ = displacement (m)

Each equation uses 4 of the 5 variables and is **missing one**:

| Equation | Missing variable |
|---|---|
| $v_f = v_i + at$ | $\Delta x$ |
| $\Delta x = v_i t + \frac{1}{2}at^2$ | $v_f$ |
| $v_f^2 = v_i^2 + 2a\Delta x$ | $t$ |
| $\Delta x = \frac{1}{2}(v_i + v_f)t$ | $a$ |

---

## How to Pick the Right Equation — Every Time

Follow these 4 steps on every kinematic problem:

1. **List** what you know (given values)
2. **Identify** what you are solving for
3. **Find** which variable is missing (not given, not asked for)
4. **Use** the equation that is also missing that variable

**Example:** You know $v_i$, $a$, and $t$. You want $\Delta x$. The missing variable is $v_f$.
→ Use $\Delta x = v_i t + \frac{1}{2}at^2$ (this equation doesn't contain $v_f$)

---

## Worked Example 1 — Basic Kinematics

**Problem:** A car starts from rest and accelerates at $3\ \text{m/s}^2$ for 6 seconds. How far does it travel?

| Variable | Value |
|---|---|
| $v_i$ | $0\ \text{m/s}$ (starts from rest) |
| $a$ | $3\ \text{m/s}^2$ |
| $t$ | $6\ \text{s}$ |
| $\Delta x$ | ? |
| $v_f$ | **missing** |

Use $\Delta x = v_i t + \frac{1}{2}at^2$:

$$\Delta x = (0)(6) + \frac{1}{2}(3)(6^2) = 0 + \frac{1}{2}(3)(36) = \textbf{54 m}$$

---

## Worked Example 2 — No Time Given

**Problem:** A ball rolling at 8 m/s decelerates at $2\ \text{m/s}^2$. How far does it travel before stopping?

| Variable | Value |
|---|---|
| $v_i$ | $8\ \text{m/s}$ |
| $v_f$ | $0\ \text{m/s}$ (stops) |
| $a$ | $-2\ \text{m/s}^2$ |
| $\Delta x$ | ? |
| $t$ | **missing** |

Use $v_f^2 = v_i^2 + 2a\Delta x$:

$$0 = 64 + 2(-2)\Delta x \implies 4\Delta x = 64 \implies \Delta x = \textbf{16 m}$$

---

## Worked Example 3 — Free Fall

**Problem:** A ball is dropped from a 45 m building. How long does it take to hit the ground?

Let downward = positive. $v_i = 0$, $a = +9.8\ \text{m/s}^2$, $\Delta x = +45\ \text{m}$. Missing: $v_f$.

Use $\Delta x = v_i t + \frac{1}{2}at^2$:

$$45 = 0 + \frac{1}{2}(9.8)t^2 \implies t^2 = \frac{45}{4.9} \approx 9.18 \implies t \approx \textbf{3.03 s}$$

---

## Worked Example 4 — Two-Phase Problem

**Problem:** A car at 20 m/s accelerates at $4\ \text{m/s}^2$ for 3 s, then moves at constant velocity for 5 s. Find total displacement.

**Phase 1 (accelerating):**
$$\Delta x_1 = v_i t + \frac{1}{2}at^2 = 20(3) + \frac{1}{2}(4)(9) = 60 + 18 = 78\ \text{m}$$
$$v_f = v_i + at = 20 + 4(3) = 32\ \text{m/s}$$

**Phase 2 (constant velocity, $a = 0$):**
$$\Delta x_2 = 32 \times 5 = 160\ \text{m}$$

$$\Delta x_{total} = 78 + 160 = \textbf{238 m}$$

---

## The Variable Table — Use This on Every Problem

Before starting any kinematic problem, fill in this table:

```
v_i  = ?
v_f  = ?
a    = ?
t    = ?
Δx   = ?
```

Three filled values → you have enough to solve. The **missing** variable tells you which equation to use.

---

## Real-World Analogy

Think of the 4 equations like tools in a toolbox. Each does the same kind of job (kinematics) but works better in different situations. You don't force a screwdriver when you need a wrench — you pick the right tool for what's available. In physics: look at what variables you have, then pick the equation missing the one you don't have.

---

## AP Exam Traps

### Trap 1: Forgetting to set a sign convention
Always define which direction is positive before solving. If up = positive, $g = -9.8\ \text{m/s}^2$. If down = positive, $g = +9.8\ \text{m/s}^2$. Be consistent throughout.

### Trap 2: Using $\Delta x = \frac{1}{2}(v_i + v_f)t$ incorrectly
This equation requires knowing **both** $v_i$ and $v_f$. If you only know one, use a different equation.

### Trap 3: Multi-phase problems
When motion changes (acceleration stops, object bounces), treat each phase separately. The final velocity of Phase 1 is the initial velocity of Phase 2.

### Trap 4: Word clues for free variables
- "Starts from rest" or "dropped" → $v_i = 0$
- "Comes to rest" or "stops" → $v_f = 0$
- These are values the problem gives you in words — write them in your table.

### Trap 5: Unit conversion
Time must be in **seconds**, velocity in **m/s**, acceleration in **m/s²**, displacement in **m**. If a problem gives km/h, convert first.

---

## Self-Check Before Practice

1. A runner accelerates from 2 m/s to 8 m/s in 3 s. Which equation finds displacement? What is it?
2. What 4 steps do you follow to pick the right equation?
3. An object is thrown downward at 5 m/s (up = positive). What is $v_i$? What is $a$?

> **Answers:**
> 1. $\Delta x = \frac{1}{2}(v_i + v_f)t = \frac{1}{2}(10)(3) = 15\ \text{m}$
> 2. List knowns → identify unknown → find missing variable → pick matching equation
> 3. $v_i = -5\ \text{m/s}$; $a = -9.8\ \text{m/s}^2$

---

## Connection to Other Lessons

- **Lesson 3:** These equations assume constant acceleration — established in the previous lesson
- **Lesson 5:** Projectile motion applies these equations separately to $x$ and $y$ directions
- **Unit 2:** Forces cause acceleration — $F = ma$ links directly to these equations
