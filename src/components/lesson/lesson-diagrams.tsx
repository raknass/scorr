'use client'

import React from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DiagramKey =
  | 'number-line'
  | 'distance-displacement'
  | 'position-time-graph'
  | 'acceleration-cases'
  | 'projectile-arc'

// ─── Trigger Detection ────────────────────────────────────────────────────────

export function getDiagramForSection(text: string): DiagramKey | null {
  const t = text.toLowerCase()
  if (/^position(\s*\(x\))?$/.test(t.trim())) return 'number-line'
  if (t.includes('distance') && t.includes('displacement')) return 'distance-displacement'
  if (t.includes('speeding') && t.includes('slowing')) return 'acceleration-cases'
  if (t.includes('setting up') && t.includes('projectile')) return 'projectile-arc'
  if ((t.includes('velocity') || t.includes('position')) && t.includes('graph')) return 'position-time-graph'
  return null
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function Wrap({ caption, viewBox, children }: { caption: string; viewBox: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '16px 0 20px' }}>
      <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '12px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
        <svg viewBox={viewBox} width="100%" style={{ display: 'block', maxWidth: '100%' }} role="img" aria-label={caption}>
          {children}
        </svg>
      </div>
      <p style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic', textAlign: 'center', margin: '6px 0 0' }}>
        {caption}
      </p>
    </div>
  )
}

// ─── Arrow Helper ─────────────────────────────────────────────────────────────

function Arrow({ x1, y1, x2, y2, color, width = 2 }: { x1: number; y1: number; x2: number; y2: number; color: string; width?: number }) {
  const dx = x2 - x1; const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len; const uy = dy / len
  const hx = x2 - ux * 9; const hy = y2 - uy * 9
  const px = -uy * 4; const py = ux * 4
  return (
    <>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
    </>
  )
}

// ─── DIAGRAM 1: Number Line ───────────────────────────────────────────────────

function NumberLineDiagram() {
  const yl = 130; const ox = 215; const u = 35
  const px = (n: number) => ox + n * u
  const ticks = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <Wrap caption="Position on a number line — teal = positive (east), gray = negative (west)" viewBox="0 0 600 200">
      <text x="300" y="20" textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">Position (x) — Reference Frame</text>

      {/* Axis line */}
      <line x1="60" y1={yl} x2="548" y2={yl} stroke="#9CA3AF" strokeWidth="2" />
      <Arrow x1={540} y1={yl} x2={558} y2={yl} color="#9CA3AF" />
      <text x="565" y={yl + 4} fontSize="11" fill="#9CA3AF" fontStyle="italic">x</text>

      {/* Ticks + labels */}
      {ticks.map(n => (
        <g key={n}>
          <line x1={px(n)} y1={yl - 6} x2={px(n)} y2={yl + 6} stroke={n === 0 ? '#374151' : '#CBD5E1'} strokeWidth={n === 0 ? 2 : 1} />
          <text x={px(n)} y={yl + 18} textAnchor="middle" fontSize="10" fill={n === 0 ? '#374151' : '#9CA3AF'}>{n}</text>
        </g>
      ))}
      <text x={px(0)} y={yl + 30} textAnchor="middle" fontSize="9" fill="#6B7280">Origin</text>

      {/* Person at +5 — teal */}
      <line x1={px(5)} y1={yl - 6} x2={px(5)} y2={95} stroke="#0D9488" strokeWidth="1.5" strokeDasharray="4,3" />
      <circle cx={px(5)} cy={84} r={11} fill="#E6FFFA" stroke="#0D9488" strokeWidth="2" />
      <text x={px(5)} y={88} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0D9488">+5</text>
      <text x={px(5)} y={62} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0D9488">x = +5 m</text>
      <text x={px(5)} y={74} textAnchor="middle" fontSize="9" fill="#0D9488">(east)</text>

      {/* Person at -3 — gray */}
      <line x1={px(-3)} y1={yl - 6} x2={px(-3)} y2={95} stroke="#6B7280" strokeWidth="1.5" strokeDasharray="4,3" />
      <circle cx={px(-3)} cy={84} r={11} fill="#F9FAFB" stroke="#6B7280" strokeWidth="2" />
      <text x={px(-3)} y={88} textAnchor="middle" fontSize="10" fontWeight="700" fill="#6B7280">−3</text>
      <text x={px(-3)} y={62} textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">x = −3 m</text>
      <text x={px(-3)} y={74} textAnchor="middle" fontSize="9" fill="#6B7280">(west)</text>

      {/* Positive direction label */}
      <text x="460" y={yl - 12} fontSize="9" fill="#0D9488" fontWeight="500">positive direction →</text>
    </Wrap>
  )
}

// ─── DIAGRAM 2: Distance vs Displacement ─────────────────────────────────────

function DistanceDisplacementDiagram() {
  return (
    <Wrap caption="Same journey — different measurements. Distance counts total path; displacement counts net change." viewBox="0 0 600 200">
      <text x="300" y="18" textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">Same journey — different measurements</text>

      {/* Left box */}
      <rect x="10" y="28" width="270" height="162" rx="6" fill="#FFF5F5" stroke="#FECACA" strokeWidth="1" />
      <text x="145" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill="#DC2626">DISTANCE</text>

      {/* Journey: 8m east then 3m back */}
      {/* Forward leg: (40,110)→(200,110) = 8 units (20px/unit) */}
      <Arrow x1={44} y1={105} x2={200} y2={105} color="#DC2626" width={2.5} />
      <text x="122" y={97} textAnchor="middle" fontSize="10" fontWeight="600" fill="#DC2626">8 m →</text>

      {/* Return leg: (200,130)→(140,130) = 3 units */}
      <line x1={200} y1={105} x2={200} y2={128} stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3,2" />
      <Arrow x1={200} y1={128} x2={140} y2={128} color="#EF4444" width={2} />
      <text x="172" y={145} textAnchor="middle" fontSize="10" fill="#EF4444">← 3 m</text>

      {/* Start / End dots */}
      <circle cx={44} cy={105} r={5} fill="#374151" />
      <text x={44} y={168} textAnchor="middle" fontSize="9" fill="#6B7280">Start</text>
      <circle cx={140} cy={128} r={5} fill="#374151" />
      <text x={140} y={168} textAnchor="middle" fontSize="9" fill="#6B7280">Finish</text>

      <text x="145" y="183" textAnchor="middle" fontSize="11" fontWeight="700" fill="#DC2626">Distance = 8 + 3 = 11 m</text>

      {/* Right box */}
      <rect x="320" y="28" width="270" height="162" rx="6" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="1" />
      <text x="455" y="46" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0D9488">DISPLACEMENT</text>

      {/* Single straight arrow start→finish */}
      <circle cx={340} cy={120} r={5} fill="#374151" />
      <Arrow x1={344} y1={120} x2={576} y2={120} color="#0D9488" width={3} />
      <circle cx={578} cy={120} r={5} fill="#0D9488" />
      <text x={340} y={145} fontSize="9" fill="#6B7280">Start</text>
      <text x={556} y={145} textAnchor="middle" fontSize="9" fill="#6B7280">Finish</text>
      <text x="458" y={108} textAnchor="middle" fontSize="10" fontWeight="600" fill="#0D9488">+5 m east</text>

      <text x="455" y="183" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0D9488">Displacement = +5 m</text>
    </Wrap>
  )
}

// ─── DIAGRAM 3: Position-Time Graph ──────────────────────────────────────────

function PositionTimeGraphDiagram() {
  // Axes: x from 60→560 (0→6s, 83.3px/s)  y from 170→20 (0→9m, 16.7px/m)
  const tx = (s: number) => 60 + s * 83.3
  const py = (m: number) => 170 - m * 16.7

  const seg1End = { x: tx(2), y: py(9) }      // (2s, 9m)
  const seg2End = { x: tx(4), y: py(9) }      // (4s, 9m)
  const seg3End = { x: tx(6), y: py(4) }      // (6s, 4m)

  return (
    <Wrap caption="Position-time graph: slope of each segment = velocity at that moment" viewBox="0 0 600 200">
      {/* Axes */}
      <Arrow x1={55} y1={170} x2={570} y2={170} color="#374151" width={2} />
      <Arrow x1={60} y1={175} x2={60} y2={12} color="#374151" width={2} />
      <text x="578" y="174" fontSize="11" fill="#374151" fontStyle="italic">t (s)</text>
      <text x="44" y="14" fontSize="11" fill="#374151" fontStyle="italic">x (m)</text>

      {/* Tick marks */}
      {[2, 4, 6].map(s => (
        <g key={s}>
          <line x1={tx(s)} y1={167} x2={tx(s)} y2={173} stroke="#9CA3AF" strokeWidth="1" />
          <text x={tx(s)} y={182} textAnchor="middle" fontSize="10" fill="#9CA3AF">{s}</text>
        </g>
      ))}
      {[3, 6, 9].map(m => (
        <g key={m}>
          <line x1={57} y1={py(m)} x2={63} y2={py(m)} stroke="#9CA3AF" strokeWidth="1" />
          <text x={52} y={py(m) + 4} textAnchor="end" fontSize="10" fill="#9CA3AF">{m}</text>
        </g>
      ))}

      {/* Faint grid */}
      {[2, 4, 6].map(s => <line key={s} x1={tx(s)} y1={20} x2={tx(s)} y2={170} stroke="#F3F4F6" strokeWidth="1" />)}
      {[3, 6, 9].map(m => <line key={m} x1={60} y1={py(m)} x2={560} y2={py(m)} stroke="#F3F4F6" strokeWidth="1" />)}

      {/* Data line */}
      <polyline
        points={`${tx(0)},${py(0)} ${seg1End.x},${seg1End.y} ${seg2End.x},${seg2End.y} ${seg3End.x},${seg3End.y}`}
        fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinejoin="round"
      />

      {/* Segment labels */}
      <text x="110" y={py(5)} textAnchor="middle" fontSize="9" fill="#0D9488" fontWeight="600">Moving</text>
      <text x="110" y={py(5) + 12} textAnchor="middle" fontSize="9" fill="#0D9488" fontWeight="600">right</text>
      <text x="110" y={py(5) + 24} textAnchor="middle" fontSize="9" fill="#9CA3AF">(v {'>'} 0)</text>

      <text x={tx(3)} y={py(9) - 12} textAnchor="middle" fontSize="9" fill="#6B7280" fontWeight="600">Stopped</text>
      <text x={tx(3)} y={py(9) - 2} textAnchor="middle" fontSize="9" fill="#9CA3AF">(v = 0)</text>

      <text x="500" y={py(6.5)} textAnchor="middle" fontSize="9" fill="#DC2626" fontWeight="600">Moving</text>
      <text x="500" y={py(6.5) + 12} textAnchor="middle" fontSize="9" fill="#DC2626" fontWeight="600">left</text>
      <text x="500" y={py(6.5) + 24} textAnchor="middle" fontSize="9" fill="#9CA3AF">(v {'<'} 0)</text>

      {/* Slope annotation */}
      <text x="90" y={py(7.5)} fontSize="9" fill="#0D9488" fontStyle="italic">slope = v</text>
    </Wrap>
  )
}

// ─── DIAGRAM 4: Acceleration Cases ───────────────────────────────────────────

function AccelerationCasesDiagram() {
  const TEAL = '#0D9488'; const ORANGE = '#F59E0B'
  const GREEN = '#16A34A'; const RED = '#DC2626'

  // Draw velocity + acceleration arrows for each case
  // centers: 75, 225, 375, 525  half-width: 50px
  const cases = [
    { cx: 75,  vDir: 1,  aDir: 1,  result: 'Speeding Up',  resultColor: GREEN, label: 'v → · a →' },
    { cx: 225, vDir: 1,  aDir: -1, result: 'Slowing Down', resultColor: RED,   label: 'v → · a ←' },
    { cx: 375, vDir: -1, aDir: -1, result: 'Speeding Up',  resultColor: GREEN, label: 'v ← · a ←' },
    { cx: 525, vDir: -1, aDir: 1,  result: 'Slowing Down', resultColor: RED,   label: 'v ← · a →' },
  ]

  return (
    <Wrap caption="When v and a point the same direction → speeding up. Opposite directions → slowing down." viewBox="0 0 600 200">
      <text x="300" y="18" textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">Velocity &amp; Acceleration Directions</text>

      {/* Dividers */}
      {[150, 300, 450].map(x => (
        <line key={x} x1={x} y1={25} x2={x} y2={185} stroke="#E5E7EB" strokeWidth="1" />
      ))}

      {cases.map(({ cx, vDir, aDir, result, resultColor, label }) => {
        const x1v = cx - vDir * 48, x2v = cx + vDir * 48
        const x1a = cx - aDir * 48, x2a = cx + aDir * 48
        return (
          <g key={cx}>
            {/* Case label */}
            <text x={cx} y="34" textAnchor="middle" fontSize="10" fill="#6B7280">{label}</text>

            {/* Velocity arrow (teal) */}
            <text x={cx - vDir * 54} y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill={TEAL}>v</text>
            <Arrow x1={x1v} y1={63} x2={x2v} y2={63} color={TEAL} width={2.5} />

            {/* Acceleration arrow (orange) */}
            <text x={cx - aDir * 54} y="102" textAnchor="middle" fontSize="10" fontWeight="700" fill={ORANGE}>a</text>
            <Arrow x1={x1a} y1={95} x2={x2a} y2={95} color={ORANGE} width={2.5} />

            {/* Same / Opposite indicator */}
            <text x={cx} y="126" textAnchor="middle" fontSize="9" fill="#9CA3AF">
              {vDir === aDir ? '(same direction)' : '(opposite)'}
            </text>

            {/* Result badge */}
            <rect x={cx - 45} y="136" width="90" height="22" rx="5"
              fill={result === 'Speeding Up' ? '#F0FDF4' : '#FEF2F2'}
              stroke={resultColor} strokeWidth="1.5" />
            <text x={cx} y="151" textAnchor="middle" fontSize="11" fontWeight="700" fill={resultColor}>
              {result}
            </text>
          </g>
        )
      })}
    </Wrap>
  )
}

// ─── DIAGRAM 5: Projectile Arc ────────────────────────────────────────────────

function ProjectileArcDiagram() {
  const TEAL = '#0D9488'; const NAVY = '#0F172A'; const GRAY = '#9CA3AF'
  const lx = 85; const ly = 165   // launch point
  const rx = 555; const gy = 168  // landing x, ground y

  return (
    <Wrap caption="Projectile motion: horizontal velocity is constant; vertical velocity changes due to gravity." viewBox="0 0 600 200">
      {/* Ground line */}
      <line x1="55" y1={gy} x2={rx + 10} y2={gy} stroke={GRAY} strokeWidth="1.5" />
      {/* Y axis */}
      <Arrow x1={lx} y1={gy} x2={lx} y2={14} color={GRAY} width={1.5} />
      <text x={lx - 8} y="12" fontSize="10" fill={GRAY} fontStyle="italic">y</text>
      <text x={rx + 12} y={gy + 4} fontSize="10" fill={GRAY} fontStyle="italic">x</text>

      {/* Projectile arc (dashed cubic bezier) */}
      <path d={`M ${lx},${ly} C ${lx},28 ${rx},28 ${rx},${ly}`}
        fill="none" stroke="#0D9488" strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round" />

      {/* Launch & landing dots */}
      <circle cx={lx} cy={ly} r={5} fill={NAVY} />
      <circle cx={rx} cy={ly} r={5} fill={NAVY} />
      <text x={lx} y={gy + 14} textAnchor="middle" fontSize="9" fill={GRAY}>Launch</text>
      <text x={rx} y={gy + 14} textAnchor="middle" fontSize="9" fill={GRAY}>Land</text>

      {/* v₀ diagonal arrow */}
      <Arrow x1={lx} y1={ly} x2={lx + 52} y2={ly - 42} color={NAVY} width={2} />
      <text x={lx + 60} y={ly - 44} fontSize="10" fontWeight="700" fill={NAVY}>v₀</text>

      {/* v₀ₓ horizontal component (teal) */}
      <Arrow x1={lx} y1={ly + 8} x2={lx + 52} y2={ly + 8} color={TEAL} width={2} />
      <text x={lx + 26} y={ly + 22} textAnchor="middle" fontSize="9" fill={TEAL} fontWeight="600">v₀cos θ</text>

      {/* v₀ᵧ vertical component (navy) */}
      <Arrow x1={lx - 14} y1={ly} x2={lx - 14} y2={ly - 42} color="#1D4ED8" width={2} />
      <text x={lx - 28} y={ly - 20} textAnchor="end" fontSize="9" fill="#1D4ED8" fontWeight="600">v₀sin θ</text>

      {/* θ angle arc */}
      <path d="M 105,165 A 20 20 0 0 0 94,148" fill="none" stroke={NAVY} strokeWidth="1.5" />
      <text x="112" y="158" fontSize="10" fontStyle="italic" fill={NAVY}>θ</text>

      {/* Peak label (approx midpoint of arc) */}
      <text x="320" y="26" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6B7280">vᵧ = 0</text>
      <text x="320" y="38" textAnchor="middle" fontSize="9" fill="#9CA3AF">vₓ = const</text>
      <Arrow x1={295} y1={42} x2={345} y2={42} color={TEAL} width={1.5} />

      {/* Gravity arrow mid-flight */}
      <Arrow x1={230} y1={95} x2={230} y2={140} color="#EF4444" width={2} />
      <text x="238" y="120" fontSize="9" fill="#EF4444" fontWeight="600">g = 9.8 m/s²</text>
      <text x="238" y="132" fontSize="9" fill="#EF4444">↓</text>
    </Wrap>
  )
}

// ─── Public Dispatcher ────────────────────────────────────────────────────────

export function LessonDiagram({ id }: { id: DiagramKey }) {
  switch (id) {
    case 'number-line':           return <NumberLineDiagram />
    case 'distance-displacement': return <DistanceDisplacementDiagram />
    case 'position-time-graph':   return <PositionTimeGraphDiagram />
    case 'acceleration-cases':    return <AccelerationCasesDiagram />
    case 'projectile-arc':        return <ProjectileArcDiagram />
    default:                      return null
  }
}
