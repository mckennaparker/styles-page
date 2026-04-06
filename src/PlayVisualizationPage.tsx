import { useState, useRef, useEffect } from 'react'
import './PlayVisualizationPage.css'

interface Player {
  id: string
  name: string
  color: string
  keyframes: Keyframe[]
}

interface Keyframe {
  id: string
  timestamp_ms: number
  x_pct: number
  y_pct: number
}

interface InterpolatedFrame {
  time_ms: number
  x: number
  y: number
}

interface PlayVisualizationPageProps {
  onNavigateAnnotator: () => void
  onNavigateStyles: () => void
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

function interpolatePositions(
  keyframes: Keyframe[],
  totalDurationMs: number,
  fps: number = 30
): InterpolatedFrame[] {
  if (keyframes.length === 0) return []
  const sorted = [...keyframes].sort((a, b) => a.timestamp_ms - b.timestamp_ms)
  const frames: InterpolatedFrame[] = []
  const frameMs = 1000 / fps

  for (let t = 0; t <= totalDurationMs; t += frameMs) {
    let before: Keyframe | null = null
    let after: Keyframe | null = null
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].timestamp_ms <= t) before = sorted[i]
      if (sorted[i].timestamp_ms >= t && after === null) after = sorted[i]
    }
    if (!before && !after) continue
    if (!before && after) {
      frames.push({ time_ms: t, x: after.x_pct, y: after.y_pct })
      continue
    }
    if (before && !after) {
      frames.push({ time_ms: t, x: before.x_pct, y: before.y_pct })
      continue
    }
    if (before && after && before === after) {
      frames.push({ time_ms: t, x: before.x_pct, y: before.y_pct })
      continue
    }

    if (!before || !after) continue

    const span = after.timestamp_ms - before.timestamp_ms
    const progress = (t - before.timestamp_ms) / span
    frames.push({
      time_ms: t,
      x: lerp(before.x_pct, after.x_pct, progress),
      y: lerp(before.y_pct, after.y_pct, progress),
    })
  }
  return frames
}

export default function PlayVisualizationPage({
  onNavigateAnnotator,
  onNavigateStyles,
}: PlayVisualizationPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playhead, setPlayhead] = useState(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [videoDurationMs, setVideoDurationMs] = useState(60000) // Default 60 seconds

  // Load players data from localStorage (set by VideoAnnotator)
  useEffect(() => {
    const savedData = localStorage.getItem('videoAnnotatorData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setPlayers(data.players || [])
      setVideoDurationMs(data.videoDurationMs || 60000)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const currentMs = playhead * videoDurationMs

    ctx.clearRect(0, 0, W, H)

    // Draw field with darker base color
    ctx.fillStyle = '#008029'
    ctx.fillRect(0, 0, W, H)

    // Draw field markings
    ctx.strokeStyle = '#3DDB70'
    ctx.lineWidth = 2
    // End zones on the left and right sides
    ctx.beginPath()
    ctx.moveTo(W * 0.1818, -1)
    ctx.lineTo(W * 0.1818, H + 1)
    ctx.moveTo(W * 0.8182, -1)
    ctx.lineTo(W * 0.8182, H + 1)
    // Midfield line
    ctx.moveTo(W / 2, 0)
    ctx.lineTo(W / 2, H)
    ctx.stroke()

    players.forEach((player) => {
      const frames = interpolatePositions(player.keyframes, videoDurationMs)
      if (frames.length === 0) return

      // Draw full path
      ctx.beginPath()
      frames.forEach((f, i) => {
        const px = f.x * W
        const py = f.y * H
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.strokeStyle = player.color + '44'
      ctx.lineWidth = 2
      ctx.stroke()

      // Find current position
      const closest = frames.reduce((best, f) =>
        Math.abs(f.time_ms - currentMs) < Math.abs(best.time_ms - currentMs)
          ? f
          : best,
        frames[0]
      )

      const px = closest.x * W
      const py = closest.y * H
      ctx.beginPath()
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.fillStyle = player.color
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label
      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(player.name.slice(0, 2).toUpperCase(), px, py)
    })
  }, [players, playhead, videoDurationMs])

  return (
    <div className="play-visualization-page">
      <header className="viz-header">
        <h1>Play Visualization</h1>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={onNavigateAnnotator}>
            ← Annotator
          </button>
          <button className="nav-btn" onClick={onNavigateStyles}>
            Styles
          </button>
        </div>
      </header>

      <div className="viz-container">
        <canvas
          ref={canvasRef}
          width={1100}
          height={400}
          className="field-canvas"
        />

        <div className="controls">
          <button
            className="play-btn"
            onClick={() => setPlayhead(Math.max(0, playhead - 0.05))}
          >
            ◀
          </button>
          <div className="time-info">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={playhead}
              onChange={(e) => setPlayhead(parseFloat(e.target.value))}
              className="slider"
            />
            <span className="time-display">
              {Math.round(playhead * videoDurationMs / 1000)}s /{' '}
              {Math.round(videoDurationMs / 1000)}s
            </span>
          </div>
          <button
            className="play-btn"
            onClick={() => setPlayhead(Math.min(1, playhead + 0.05))}
          >
            ▶
          </button>
        </div>

        {players.length === 0 && (
          <div className="no-data">
            <p>No tracking data. Return to Annotator to add players and keyframes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
