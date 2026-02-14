import { useEffect, useRef, useState } from 'react'

const CONTACT_IMAGE_SRC = '/assets/side_profile_upscale.jpg'
const PRESET: {
  fontFamily: string
  colorMode: 'mono' | 'rgb'
  colorPicker: string
  mapMode: string
  contrast: number
  customChars: string
  quality: number
  density: number
  resolution: number
  depth: number
  fontSize: number
} = {
  fontFamily: 'monospace',
  colorMode: 'mono',
  colorPicker: '#003bff',
  mapMode: 'inverted',
  contrast: 50,
  customChars: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  quality: 200,
  density: 100,
  resolution: 3,
  depth: 95,
  fontSize: 130,
}

function luminance(R: number, G: number, B: number) {
  return (0.299 * R + 0.587 * G + 0.114 * B) / 255
}
function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 255, b: 0 }
}
function applyContrast(val: number, pct: number) {
  return pct === 100 ? val : Math.pow(Math.max(0, Math.min(1, val)), 100 / pct)
}
function applyDepth(base: { r: number; g: number; b: number }, lum: number, pct: number) {
  if (pct === 0) return base
  const t = pct / 100
  const b = 0.04 + 0.96 * lum
  const m = 1 - t + t * b
  return { r: Math.round(base.r * m), g: Math.round(base.g * m), b: Math.round(base.b * m) }
}
function sampleCellRgb(data: Uint8ClampedArray, w: number, h: number, x0: number, y0: number, x1: number, y1: number) {
  let r = 0, g = 0, b = 0, c = 0
  const xs = Math.max(0, Math.floor(x0)), xe = Math.min(w, Math.ceil(x1))
  const ys = Math.max(0, Math.floor(y0)), ye = Math.min(h, Math.ceil(y1))
  for (let py = ys; py < ye; py++)
    for (let px = xs; px < xe; px++) {
      const i = (py * w + px) * 4
      r += data[i]; g += data[i + 1]; b += data[i + 2]; c++
    }
  if (c === 0) return { r: 0, g: 0, b: 0, lum: 0 }
  return { r: r / c, g: g / c, b: b / c, lum: luminance(r / c, g / c, b / c) }
}
function sampleCellBrightness(data: Uint8ClampedArray, w: number, h: number, x0: number, y0: number, x1: number, y1: number) {
  let sum = 0, c = 0
  const xs = Math.max(0, Math.floor(x0)), xe = Math.min(w, Math.ceil(x1))
  const ys = Math.max(0, Math.floor(y0)), ye = Math.min(h, Math.ceil(y1))
  for (let py = ys; py < ye; py++)
    for (let px = xs; px < xe; px++) {
      const i = (py * w + px) * 4
      sum += luminance(data[i], data[i + 1], data[i + 2]); c++
    }
  return c > 0 ? sum / c : 0
}
function sampleBrightness(data: Uint8ClampedArray, w: number, h: number, px: number, py: number) {
  const i = (Math.min(py, h - 1) * w + Math.min(px, w - 1)) * 4
  return luminance(data[i], data[i + 1], data[i + 2])
}
function sampleEdge(data: Uint8ClampedArray, w: number, h: number, px: number, py: number) {
  const g = (x: number, y: number) => sampleBrightness(data, w, h, x, y)
  const gx = (-g(px - 1, py - 1) - 2 * g(px - 1, py) - g(px - 1, py + 1) + g(px + 1, py - 1) + 2 * g(px + 1, py) + g(px + 1, py + 1)) / 4
  const gy = (-g(px - 1, py - 1) - 2 * g(px, py - 1) - g(px + 1, py - 1) + g(px - 1, py + 1) + 2 * g(px, py + 1) + g(px + 1, py + 1)) / 4
  return Math.min(1, Math.sqrt(gx * gx + gy * gy) * 3)
}
function getCellValue(data: Uint8ClampedArray, w: number, h: number, x0: number, y0: number, x1: number, y1: number, mapMode: string, contrastPct: number) {
  const cx = Math.floor((x0 + x1) / 2), cy = Math.floor((y0 + y1) / 2)
  let val: number
  if (mapMode === 'brightness') val = sampleCellBrightness(data, w, h, x0, y0, x1, y1)
  else if (mapMode === 'inverted') val = 1 - sampleCellBrightness(data, w, h, x0, y0, x1, y1)
  else if (mapMode === 'edges') val = sampleEdge(data, w, h, cx, cy)
  else val = sampleCellBrightness(data, w, h, x0, y0, x1, y1)
  return applyContrast(val, contrastPct)
}

const CURSOR_RADIUS = 100
const CURSOR_STRENGTH = 0.22
const VELOCITY_DAMPING = 0.9
const DISPLACEMENT_REGEN = 0.97

const LINKS = [
  { label: 'Email', href: 'mailto:cristi.savca@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/cristisavca' },
  { label: 'GitHub', href: 'https://github.com/cristisavca' },
  { label: 'Resume', href: '/assets/resume' },
  { label: 'Resume (txt)', href: '/assets/resume.txt' },
]

export function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sampleRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef({ x: -1000, y: -1000 })
  const velRef = useRef<Float32Array | null>(null)
  const dispRef = useRef<Float32Array | null>(null)
  const rafRef = useRef<number | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = CONTACT_IMAGE_SRC

    img.onload = () => {
      const canvas = canvasRef.current
      const sampleCanvas = sampleRef.current
      const container = containerRef.current
      if (!canvas || !sampleCanvas || !container) return

      const canvasEl = canvas
      const sampleCanvasEl = sampleCanvas
      const containerEl = container

      const ctx = canvasEl.getContext('2d', { willReadFrequently: true })
      const sampleCtx = sampleCanvasEl.getContext('2d', { willReadFrequently: true })
      if (!ctx || !sampleCtx) return
      const drawCtx: CanvasRenderingContext2D = ctx
      const drawSampleCtx: CanvasRenderingContext2D = sampleCtx

      const p = PRESET
      const w = img.naturalWidth
      const h = img.naturalHeight
      const charAspect = 0.52
      const q = p.quality / 100
      const density = p.density / 100
      const sampleSize = Math.max(4, Math.round(14 / q))
      const baseCols = Math.max(10, Math.floor(w / sampleSize))
      const baseRows = Math.max(5, Math.floor(h / (sampleSize * charAspect)))
      const charW = w / baseCols
      const charH = h / baseRows
      const stepX = charW / density
      const stepY = charH / density
      const cols = Math.max(10, Math.floor(w / stepX))
      const rows = Math.max(5, Math.floor(h / stepY))
      const cellW = w / cols
      const cellH = h / rows
      const charSet = (p.customChars || '@%#*+=-:. ').trim()
      const len = Math.max(1, charSet.length)
      const monoRgb = hexToRgb(p.colorPicker)

      sampleCanvasEl.width = w
      sampleCanvasEl.height = h
      drawSampleCtx.drawImage(img, 0, 0)
      const data = drawSampleCtx.getImageData(0, 0, w, h).data
      const cells: { ch: string; r: number; g: number; b: number }[] = []

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x0 = c * cellW
          const y0 = r * cellH
          const x1 = (c + 1) * cellW
          const y1 = (r + 1) * cellH
          const val = getCellValue(data, w, h, x0, y0, x1, y1, p.mapMode, p.contrast)
          const idx = Math.min(Math.floor(val * len), len - 1)
          const ch = charSet[idx]
          const { lum } = sampleCellRgb(data, w, h, x0, y0, x1, y1)
          const cell = { ch, ...applyDepth(monoRgb, lum, p.depth) }
          cells.push(cell)
        }
      }

      const n = cols * rows
      velRef.current = new Float32Array(n * 2)
      dispRef.current = new Float32Array(n * 2)

      function draw() {
        const rect = containerEl.getBoundingClientRect()
        const scale = Math.min(rect.width / w, rect.height / h)
        const renderW = Math.floor(w * scale * p.resolution)
        const renderH = Math.floor(h * scale * p.resolution)
        const cellW2 = renderW / cols
        const cellH2 = renderH / rows
        const baseCellH = renderH / baseRows
        const fontSize = Math.max(4, Math.min(72, Math.round(baseCellH * 0.92 * (p.fontSize ?? 100) / 100)))

        canvasEl.width = renderW
        canvasEl.height = renderH
        canvasEl.style.width = `${w * scale}px`
        canvasEl.style.height = `${h * scale}px`

        const cursor = cursorRef.current
        const vel = velRef.current!
        const disp = dispRef.current!
        const canvasRect = canvasEl.getBoundingClientRect()
        const cursorX = cursor.x - canvasRect.left
        const cursorY = cursor.y - canvasRect.top

        for (let i = 0; i < n; i++) {
          const r = Math.floor(i / cols)
          const c = i % cols
          const cx = (c + 0.5) * cellW2
          const cy = (r + 0.5) * cellH2
          const dx = cursorX - cx
          const dy = cursorY - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CURSOR_RADIUS && dist > 0) {
            const f = (1 - dist / CURSOR_RADIUS) * CURSOR_STRENGTH
            vel[i * 2] += (dx / dist) * f
            vel[i * 2 + 1] += (dy / dist) * f
          }
          vel[i * 2] *= VELOCITY_DAMPING
          vel[i * 2 + 1] *= VELOCITY_DAMPING
          disp[i * 2] += vel[i * 2]
          disp[i * 2 + 1] += vel[i * 2 + 1]
          disp[i * 2] *= DISPLACEMENT_REGEN
          disp[i * 2 + 1] *= DISPLACEMENT_REGEN
        }

        drawCtx.imageSmoothingEnabled = false
        drawCtx.font = `${fontSize}px ${p.fontFamily}`
        drawCtx.textAlign = 'center'
        drawCtx.textBaseline = 'middle'
        drawCtx.fillStyle = '#000'
        drawCtx.fillRect(0, 0, renderW, renderH)

        let i = 0
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cell = cells[i]
            drawCtx.fillStyle = `rgb(${cell.r},${cell.g},${cell.b})`
            drawCtx.fillText(cell.ch, (c + 0.5) * cellW2 + disp[i * 2], (r + 0.5) * cellH2 + disp[i * 2 + 1])
            i++
          }
        }
      }

      function tick() {
        draw()
        rafRef.current = requestAnimationFrame(tick)
      }

      const onMouseMove = (e: MouseEvent) => { cursorRef.current = { x: e.clientX, y: e.clientY } }
      const onMouseLeave = () => { cursorRef.current = { x: -1000, y: -1000 } }

      const wrap = containerEl.querySelector('.ascii-contact-canvas-wrap') as HTMLElement | null
      if (wrap) {
        wrap.addEventListener('mousemove', onMouseMove)
        wrap.addEventListener('mouseleave', onMouseLeave)
      }
      const ro = new ResizeObserver(draw)
      ro.observe(containerEl)
      setReady(true)
      rafRef.current = requestAnimationFrame(tick)

      cleanupRef.current = () => {
        wrap?.removeEventListener('mousemove', onMouseMove)
        wrap?.removeEventListener('mouseleave', onMouseLeave)
        ro.disconnect()
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      }
    }
    return () => { cleanupRef.current?.() }
  }, [])

  return (
    <section id="contact" ref={containerRef} className="section-shell">
      <div className="section-inner">
        <div className="section-header">
          <div>
            <span className="section-kicker">Contact</span>
            <h2 className="section-title">Let&apos;s build something useful.</h2>
          </div>
          <p className="section-note">
            Reach out for engineering roles, collaborations, or product ideas. The portrait below is rendered in
            animated ASCII for the same terminal mood used across the site.
          </p>
        </div>
        <div className="contact-grid">
          <div className="ascii-contact-canvas-wrap">
            <canvas ref={canvasRef} className="contact-ascii" style={{ opacity: ready ? 1 : 0 }} />
            <canvas ref={sampleRef} style={{ position: 'absolute', left: -9999, width: 1, height: 1 }} aria-hidden />
          </div>
          <aside className="contact-panel">
            <p className="section-note">
              Preferred stack: Python, SQL, React, and backend tooling for high-throughput data pipelines.
            </p>
            <div className="contact-links">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') || link.href.startsWith('/assets/') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') || link.href.startsWith('/assets/') ? 'noopener noreferrer' : undefined}
                  className="contact-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
