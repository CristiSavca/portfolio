import { useEffect, useMemo, useRef, useState } from 'react'

const HERO_VIDEO_SRC = '/assets/1VS0Hpe2Ses6lS-U.mp4'
const ASCII_TOOL_SRC = '/ascii-video-overlay.html'

type ColorChannel = 'rgb' | 'r' | 'g' | 'b'

export function Hero() {
  const [colorChannel, setColorChannel] = useState<ColorChannel>('rgb')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const embedSrc = useMemo(
    () => `${ASCII_TOOL_SRC}?embed=1&video=${encodeURIComponent(HERO_VIDEO_SRC)}&channel=rgb`,
    [],
  )

  useEffect(() => {
    const post = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'ascii:setColorChannel', channel: colorChannel },
        window.location.origin,
      )
    }

    post()
    const t = window.setTimeout(post, 180)
    return () => window.clearTimeout(t)
  }, [colorChannel])

  const handleFrameLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'ascii:setColorChannel', channel: colorChannel },
      window.location.origin,
    )
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'ascii:refresh' },
      window.location.origin,
    )
  }

  return (
    <section className="hero">
      <iframe
        ref={iframeRef}
        src={embedSrc}
        className="hero-embed-frame"
        title="ASCII background"
        onLoad={handleFrameLoad}
      />
      <div className="hero-controls" role="group" aria-label="ASCII settings">
        <label className="hero-select">
          <span>Color</span>
          <select
            value={colorChannel}
            onChange={(event) => setColorChannel(event.target.value as ColorChannel)}
            aria-label="ASCII color mode"
          >
            <option value="rgb">Per-pixel</option>
            <option value="r">R</option>
            <option value="g">G</option>
            <option value="b">B</option>
          </select>
        </label>
      </div>
      <div className="hero-content">
        <h1 className="hero-name">Cristi Savca</h1>
      </div>
      <a className="hero-scroll-cue" href="#projects" aria-label="Scroll down">
        <span aria-hidden>↓</span>
      </a>
    </section>
  )
}
