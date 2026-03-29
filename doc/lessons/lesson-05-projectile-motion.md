# Projectile Motion
**AP Physics 1 — Unit 1: Kinematics | College Board Topic 1.E**
*Estimated time: 20 minutes | XP reward: 20*

---

## What this lesson covers

By the end of this lesson you will be able to:
- State and apply the principle of independence of horizontal and vertical motion
- Identify the acceleration in each direction for a projectile
- Solve for range, time of flight, and maximum height
- Analyze both launched and dropped projectile scenarios
- Interpret projectile motion graphs

---

## The Central Idea — Independence of Motion

**Horizontal and vertical motions are completely independent of each other.**

A projectile (any object in free flight, no thrust) has:
- **Horizontal ($x$):** constant velocity, zero acceleration
- **Vertical ($y$):** constant acceleration due to gravity, $a_y = -9.8\ \text{m/s}^2$

These two motions happen simultaneously but do not affect each other. Solve them separately using the kinematic equations — the one thing connecting them is **time**.

---

## The Famous Demonstration

A ball dropped straight down and a ball fired horizontally from the same height hit the ground **at exactly the same time**.

Why? Both experience the same vertical acceleration (gravity) regardless of horizontal motion. The AP exam tests whether you truly believe this.

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
$$v_{iy} = v_i \sin\theta \qquad v_{ix} = v_i \cos\theta$$
$$\Delta y = v_{iy}t + \frac{1}{2}a_y t^2$$
$$v_{fy} = v_{iy} + a_y t$$
$$v_{fy}^2 = v_{iy}^2 + 2a_y \Delta y$$

---

## Worked Example 1 — Horizontal Launch

**Problem:** A ball is kicked horizontally at 15 m/s from a cliff 80 m high. Find (a) time to land and (b) horizontal range.

**Setup:** $v_{ix} = 15\ \text{m/s}$, $v_{iy} = 0$, $a_y = -9.8\ \text{m/s}^2$, $\Delta y = -80\ \text{m}$

**(a) Time — use vertical:**
$$-80 = 0 + \frac{1}{2}(-9.8)t^2 \implies t^2 = \frac{80}{4.9} \approx 16.33 \implies t \approx \textbf{4.04 s}$$

**(b) Horizontal range:**
$$\Delta x = v_{ix} \cdot t = 15 \times 4.04 \approx \textbf{60.6 m}$$

---

## Worked Example 2 — Launched at an Angle

**Problem:** A ball is launched at 20 m/s at 30° above horizontal. Find (a) maximum height and (b) time of flight.

**Setup:**
$$v_{ix} = 20\cos 30° = 17.3\ \text{m/s} \qquad v_{iy} = 20\sin 30° = 10\ \text{m/s}$$

**(a) Maximum height** — at peak, $v_{fy} = 0$:
$$0 = v_{iy}^2 + 2a_y \Delta y \implies \Delta y = \frac{-100}{2(-9.8)} \approx \textbf{5.1 m}$$

**(b) Time of flight** — time to peak, then double (symmetric):
$$0 = 10 + (-9.8)t \implies t_{up} = 1.02\ \text{s} \implies t_{total} = \textbf{2.04 s}$$

---

## Three Types of Projectile Problems on the AP Exam

**Type 1 — Horizontal launch from height**
$v_{iy} = 0$. Solve vertical for time → use horizontal for range.

**Type 2 — Launched at angle, returns to same height**
Symmetric. Time up = time down. $v_{fy}$ at landing $= -v_{iy}$.

**Type 3 — Launched at angle, lands at different height**
Set $\Delta y =$ height difference (negative if lower). Solve the quadratic in $t$.

---

## Velocity at Any Point

$$v_x = v_{ix} = \text{constant}$$
$$v_y = v_{iy} + a_y t$$
$$|v| = \sqrt{v_x^2 + v_y^2}$$

At maximum height: $v_y = 0$, velocity is purely horizontal $= v_{ix}$.

---

## Real-World Analogy

A basketball free throw is projectile motion. Horizontal velocity carries the ball toward the basket; gravity pulls it down. Launch too flat (small angle) → not enough arc. Launch too steep → can't reach the basket. Optimal angle for maximum range on flat ground is always **45°**.

---

## AP Exam Traps

### Trap 1: Horizontal velocity is NOT zero at max height
Only the **vertical** velocity is zero at the peak. $v_x$ remains constant throughout. Writing $v = 0$ at max height loses points.

### Trap 2: Mass doesn't matter
A heavy ball and a light ball launched identically follow the exact same path. Mass does not appear in projectile equations.

### Trap 3: Air resistance is ignored
Unless explicitly mentioned, assume no air resistance.

### Trap 4: The 45° rule only applies to flat ground
Maximum range at 45° is only true when the projectile lands at the **same height** it launched from.

### Trap 5: Symmetry only when landing height = launch height
If the ball lands lower than it launched, time up ≠ time down — the trajectory is asymmetric.

---

## Summary — What's Constant, What Changes

| Quantity | Horizontal | Vertical |
|---|---|---|
| Acceleration | $0$ | $-9.8\ \text{m/s}^2$ |
| Velocity | Constant | Changes every second |
| Position | Changes linearly | Changes as a parabola |

The path of a projectile is always a **parabola** (y vs x graph).

---

## Self-Check Before Practice

1. A ball launched horizontally from a 20 m cliff — same time to land as one dropped straight down? Why?
2. At the peak of a projectile's path, what is $v_y$? What is $v_x$?
3. Ball launched at 45° at 10 m/s. What are $v_{ix}$ and $v_{iy}$?

> **Answers:**
> 1. Same time — horizontal motion does not affect vertical free fall
> 2. $v_y = 0$; $v_x = v_{ix}$ = unchanged throughout
> 3. $v_{ix} = v_{iy} = 10\cos 45° \approx 7.07\ \text{m/s}$

---

## Connection to Other Lessons

- **Lesson 3:** Free fall is the vertical component of all projectile motion
- **Lesson 4:** Kinematic equations apply separately to $x$ and $y$
- **Unit 2:** Forces explain why gravity accelerates objects downward (Newton's second law)
