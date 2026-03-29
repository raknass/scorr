'use client'

import { useEffect, useRef, useState } from 'react'

interface SimulationTabProps {
  simType: string | null
  lessonTitle: string
}

export function SimulationTab({ simType, lessonTitle }: SimulationTabProps) {
  if (!simType) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
        <div className="text-5xl">⚗️</div>
        <h3 className="font-semibold text-slate-700">Simulation coming soon</h3>
        <p className="text-sm text-slate-400 max-w-xs">
          An interactive simulation for &ldquo;{lessonTitle}&rdquo; is in development.
          For now, use the AI Tutor to explore this concept.
        </p>
      </div>
    )
  }

  if (simType === 'numberline') return <NumberLineSim />
  if (simType === 'velocity-graph') return <VelocityGraphSim />
  if (simType === 'acceleration-graph') return <AccelerationGraphSim />
  if (simType === 'projectile') return <ProjectileSim />

  return (
    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
      Simulation &ldquo;{simType}&rdquo; not yet implemented.
    </div>
  )
}

// ─── Number Line Simulation ───────────────────────────────────────────────────
function NumberLineSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [position, setPosition] = useState(0) // x = 0 to 20
  const [startPos] = useState(0)
  const [distance, setDistance] = useState(0)
  const prevPos = useRef(0)
  const totalDist = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const midY = H / 2
    const left = 40, right = W - 40
    const range = 20 // -10 to +10
    const pixPerUnit = (right - left) / range

    const toPixel = (x: number) => left + (x + 10) * pixPerUnit

    ctx.clearRect(0, 0, W, H)

    // Axis line
    ctx.beginPath()
    ctx.moveTo(left, midY)
    ctx.lineTo(right, midY)
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.stroke()

    // Tick marks and labels
    for (let x = -10; x <= 10; x += 2) {
      const px = toPixel(x)
      ctx.beginPath()
      ctx.moveTo(px, midY - 8)
      ctx.lineTo(px, midY + 8)
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = '#64748b'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(String(x), px, midY + 22)
    }
    ctx.fillText('x (m)', right + 20, midY + 4)

    // Origin marker
    ctx.beginPath()
    ctx.moveTo(toPixel(0), midY - 12)
    ctx.lineTo(toPixel(0), midY + 12)
    ctx.strokeStyle = '#0d9488'
    ctx.lineWidth = 2
    ctx.stroke()

    // Displacement arrow
    const startPx = toPixel(startPos)
    const curPx = toPixel(position)
    if (Math.abs(curPx - startPx) > 2) {
      ctx.beginPath()
      ctx.moveTo(startPx, midY - 30)
      ctx.lineTo(curPx, midY - 30)
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2.5
      ctx.stroke()
      // Arrowhead
      const dir = curPx > startPx ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(curPx, midY - 30)
      ctx.lineTo(curPx - dir * 8, midY - 36)
      ctx.lineTo(curPx - dir * 8, midY - 24)
      ctx.fillStyle = '#6366f1'
      ctx.fill()
      ctx.fillStyle = '#6366f1'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Δx = ${(position - startPos).toFixed(1)} m`, (startPx + curPx) / 2, midY - 42)
    }

    // Dot
    ctx.beginPath()
    ctx.arc(toPixel(position), midY, 12, 0, Math.PI * 2)
    ctx.fillStyle = '#0d9488'
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.font = 'bold 10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(position.toFixed(0), toPixel(position), midY + 4)

  }, [position, startPos])

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPos = Number(e.target.value)
    const delta = Math.abs(newPos - prevPos.current)
    totalDist.current += delta
    prevPos.current = newPos
    setDistance(totalDist.current)
    setPosition(newPos)
  }

  return (
    <div className="flex flex-col h-full px-4 py-4 gap-4">
      <div>
        <h3 className="font-semibold text-slate-700 text-sm">Number Line: Position vs Displacement</h3>
        <p className="text-xs text-slate-400 mt-0.5">Drag the slider to move the object and observe displacement vs. distance.</p>
      </div>

      <canvas ref={canvasRef} className="w-full h-32 rounded-xl bg-slate-50 border border-slate-100" />

      <input
        type="range"
        min="-10"
        max="10"
        step="0.5"
        value={position}
        onChange={handleSlider}
        className="w-full accent-teal-600"
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Position', value: `${position.toFixed(1)} m`, color: 'text-teal-600' },
          { label: 'Displacement', value: `${(position - startPos).toFixed(1)} m`, color: 'text-indigo-600' },
          { label: 'Distance', value: `${distance.toFixed(1)} m`, color: 'text-orange-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`font-bold text-sm ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        💡 Notice: when you move right then left, <strong>distance keeps increasing</strong> but displacement can return to 0.
      </p>
    </div>
  )
}

// ─── Velocity Graph Simulation ────────────────────────────────────────────────
function VelocityGraphSim() {
  const [velocity, setVelocity] = useState(5)
  const time = 6

  return (
    <div className="flex flex-col h-full px-4 py-4 gap-4">
      <div>
        <h3 className="font-semibold text-slate-700 text-sm">Velocity-Time Graph</h3>
        <p className="text-xs text-slate-400 mt-0.5">Adjust velocity and observe the x-t and v-t graphs.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* x-t graph */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col">
          <p className="text-xs font-medium text-slate-500 mb-2">Position vs Time (x-t)</p>
          <svg viewBox="0 0 120 80" className="flex-1">
            <line x1="10" y1="70" x2="110" y2="70" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="10" y1="10" x2="10" y2="70" stroke="#cbd5e1" strokeWidth="1.5"/>
            <text x="112" y="73" fontSize="7" fill="#94a3b8">t</text>
            <text x="8" y="8" fontSize="7" fill="#94a3b8">x</text>
            <line
              x1="10" y1="70"
              x2="110" y2={70 - Math.min((velocity / 15) * 55, 55)}
              stroke="#0d9488" strokeWidth="2.5"
            />
          </svg>
          <p className="text-xs text-center text-slate-400 mt-1">slope = v = {velocity} m/s</p>
        </div>

        {/* v-t graph */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col">
          <p className="text-xs font-medium text-slate-500 mb-2">Velocity vs Time (v-t)</p>
          <svg viewBox="0 0 120 80" className="flex-1">
            <line x1="10" y1="70" x2="110" y2="70" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="10" y1="10" x2="10" y2="70" stroke="#cbd5e1" strokeWidth="1.5"/>
            <text x="112" y="73" fontSize="7" fill="#94a3b8">t</text>
            <text x="8" y="8" fontSize="7" fill="#94a3b8">v</text>
            {/* horizontal line = constant velocity */}
            <line
              x1="10" y1={70 - Math.min((velocity / 15) * 55, 55)}
              x2="110" y2={70 - Math.min((velocity / 15) * 55, 55)}
              stroke="#6366f1" strokeWidth="2.5"
            />
            {/* shaded area = displacement */}
            <rect
              x="10"
              y={70 - Math.min((velocity / 15) * 55, 55)}
              width="100"
              height={Math.min((velocity / 15) * 55, 55)}
              fill="#6366f1" fillOpacity="0.15"
            />
          </svg>
          <p className="text-xs text-center text-slate-400 mt-1">area = Δx = {velocity * time} m</p>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500 font-medium">Velocity: {velocity} m/s</label>
        <input
          type="range" min="-10" max="15" step="1" value={velocity}
          onChange={e => setVelocity(Number(e.target.value))}
          className="w-full mt-1 accent-teal-600"
        />
      </div>

      <p className="text-xs text-slate-400 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
        💡 The <span className="text-indigo-600 font-medium">shaded area</span> under the v-t graph equals displacement ({velocity} × {time} = {velocity * time} m).
      </p>
    </div>
  )
}

// ─── Acceleration Graph Simulation ───────────────────────────────────────────
function AccelerationGraphSim() {
  const [v0, setV0] = useState(10)
  const [accel, setAccel] = useState(-2)
  const t = 4
  const vf = v0 + accel * t

  return (
    <div className="flex flex-col h-full px-4 py-4 gap-4">
      <div>
        <h3 className="font-semibold text-slate-700 text-sm">Acceleration & Velocity</h3>
        <p className="text-xs text-slate-400">Adjust initial velocity and acceleration to see how velocity changes.</p>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
        <p className="text-xs font-medium text-slate-500 mb-2">Velocity vs Time (v-t)</p>
        <svg viewBox="0 0 220 100" className="w-full">
          <line x1="20" y1="80" x2="200" y2="80" stroke="#cbd5e1" strokeWidth="1.5"/>
          <line x1="20" y1="10" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="1.5"/>
          <line x1="20" y1="45" x2="200" y2="45" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4"/>
          <text x="202" y="83" fontSize="7" fill="#94a3b8">t(s)</text>
          <text x="18" y="8" fontSize="7" fill="#94a3b8">v</text>
          <text x="14" y="48" fontSize="7" fill="#94a3b8">0</text>

          {/* v-t line */}
          {(() => {
            const yStart = 45 - Math.max(-35, Math.min(35, (v0 / 15) * 35))
            const yEnd = 45 - Math.max(-35, Math.min(35, (vf / 15) * 35))
            return (
              <>
                <line x1="20" y1={yStart} x2="200" y2={yEnd} stroke="#6366f1" strokeWidth="2.5"/>
                <circle cx="20" cy={yStart} r="4" fill="#6366f1"/>
                <circle cx="200" cy={yEnd} r="4" fill="#0d9488"/>
                <text x="8" y={yStart + 3} fontSize="7" fill="#6366f1">{v0}</text>
                <text x="203" y={yEnd + 3} fontSize="7" fill="#0d9488">{vf.toFixed(1)}</text>
              </>
            )
          })()}
          <text x="105" y="95" fontSize="7" fill="#94a3b8" textAnchor="middle">0 → {t} s</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        {[
          { label: 'Initial velocity v₀', value: `${v0} m/s`, color: 'text-indigo-600' },
          { label: 'Acceleration a', value: `${accel} m/s²`, color: accel >= 0 ? 'text-green-600' : 'text-red-500' },
          { label: `Final velocity (t=${t}s)`, value: `${vf.toFixed(1)} m/s`, color: 'text-teal-600' },
          { label: 'Speeding up?', value: (v0 >= 0 && vf > v0) || (v0 < 0 && vf < v0) ? 'Yes' : 'No', color: 'text-slate-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <p className="text-xs text-slate-400">{label}</p>
            <p className={`font-bold text-sm ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">v₀: {v0} m/s</label>
          <input type="range" min="-15" max="15" value={v0} onChange={e => setV0(Number(e.target.value))} className="w-full accent-indigo-500"/>
        </div>
        <div>
          <label className="text-xs text-slate-500">a: {accel} m/s²</label>
          <input type="range" min="-5" max="5" step="0.5" value={accel} onChange={e => setAccel(Number(e.target.value))} className="w-full accent-teal-600"/>
        </div>
      </div>
    </div>
  )
}

// ─── Projectile Motion Simulation ────────────────────────────────────────────
function ProjectileSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [angle, setAngle] = useState(45)
  const [speed, setSpeed] = useState(20)
  const g = 9.8

  const rad = (angle * Math.PI) / 180
  const v0x = speed * Math.cos(rad)
  const v0y = speed * Math.sin(rad)
  const timeOfFlight = (2 * v0y) / g
  const maxHeight = (v0y * v0y) / (2 * g)
  const range = v0x * timeOfFlight

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const pad = 30
    const maxRange = 60 // m, scale
    const maxH = 20    // m, scale

    const toX = (x: number) => pad + (x / maxRange) * (W - 2 * pad)
    const toY = (y: number) => H - pad - (y / maxH) * (H - 2 * pad)

    ctx.clearRect(0, 0, W, H)

    // Ground
    ctx.beginPath()
    ctx.moveTo(pad, toY(0))
    ctx.lineTo(W - pad, toY(0))
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke()

    // Trajectory
    ctx.beginPath()
    ctx.moveTo(toX(0), toY(0))
    let first = true
    for (let t = 0; t <= timeOfFlight; t += timeOfFlight / 80) {
      const x = v0x * t
      const y = v0y * t - 0.5 * g * t * t
      if (x > maxRange || y > maxH * 1.1) continue
      if (first) { ctx.moveTo(toX(x), toY(Math.max(0, y))); first = false }
      else ctx.lineTo(toX(x), toY(Math.max(0, y)))
    }
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke()

    // Peak marker
    const timePeak = v0y / g
    const xPeak = v0x * timePeak
    const yPeak = maxHeight
    if (xPeak <= maxRange && yPeak <= maxH) {
      ctx.beginPath()
      ctx.arc(toX(xPeak), toY(yPeak), 5, 0, Math.PI * 2)
      ctx.fillStyle = '#f59e0b'; ctx.fill()
      ctx.fillStyle = '#78350f'; ctx.font = '10px sans-serif'
      ctx.fillText(`h=${yPeak.toFixed(1)}m`, toX(xPeak) + 7, toY(yPeak))
    }

    // Launch point
    ctx.beginPath()
    ctx.arc(toX(0), toY(0), 6, 0, Math.PI * 2)
    ctx.fillStyle = '#0d9488'; ctx.fill()

    // Landing point
    const xLand = Math.min(range, maxRange)
    ctx.beginPath()
    ctx.arc(toX(xLand), toY(0), 5, 0, Math.PI * 2)
    ctx.fillStyle = '#ef4444'; ctx.fill()

    // Labels
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'
    ctx.fillText('0', pad - 6, toY(0) + 14)
    ctx.fillText(`R=${range.toFixed(1)}m`, toX(xLand) - 20, toY(0) + 14)

  }, [angle, speed, v0x, v0y, timeOfFlight, maxHeight, range])

  return (
    <div className="flex flex-col h-full px-4 py-4 gap-4">
      <div>
        <h3 className="font-semibold text-slate-700 text-sm">Projectile Motion Simulator</h3>
        <p className="text-xs text-slate-400">Adjust launch angle and speed. Watch how the trajectory changes.</p>
      </div>

      <canvas ref={canvasRef} className="w-full h-36 rounded-xl bg-slate-50 border border-slate-100"/>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-500">Angle: {angle}°</label>
          <input type="range" min="5" max="85" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-indigo-500"/>
        </div>
        <div>
          <label className="text-xs text-slate-500">Speed: {speed} m/s</label>
          <input type="range" min="5" max="30" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-teal-600"/>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Max Height', value: `${maxHeight.toFixed(1)} m` },
          { label: 'Time of Flight', value: `${timeOfFlight.toFixed(2)} s` },
          { label: 'Range', value: `${range.toFixed(1)} m` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="font-bold text-sm text-slate-700">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
        💡 Try 45° for maximum range. Try 30° and 60° — they give the <strong>same range</strong>!
      </p>
    </div>
  )
}
