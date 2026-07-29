import { useEffect, useMemo, useRef, useState } from 'react'

const HERO_VIDEO_SRC = '/assets/1VS0Hpe2Ses6lS-U.mp4'
const ASCII_TOOL_SRC = '/ascii-video-overlay.html'

type ColorChannel = 'rgb' | 'r' | 'g' | 'b'

function CristiSavcaWordmark() {
  return (
    <svg
      aria-hidden="true"
      className="hero-wordmark"
      viewBox="0 0 140.625 22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path
          id="vc-c"
          d="M40.4365 13.9392C40.4223 15.9224 39.5865 18.1748 38.4957 19.3223C37.6458 20.2289 36.0167 21.1497 34.2459 21.2206C31.0444 21.348 28.8061 18.5715 28.027 14.435C27.8711 13.5283 27.7578 12.2959 27.7578 11.0068C27.7578 9.71765 27.857 8.35771 28.0978 7.25275C28.9053 3.61205 30.6335 0.736328 34.3734 0.736328C35.4075 0.736328 36.8525 0.892156 38.2549 2.26627C40.3373 4.16453 40.4365 6.6861 40.4507 7.67773H37.6174C37.5466 6.57277 36.8666 3.82454 33.9767 4.10787C32.631 4.23536 31.5827 5.55281 31.1152 7.21025C30.9169 7.90439 30.7185 9.19351 30.6619 10.596C30.6194 11.9842 30.7185 13.4858 31.1152 14.69C31.5827 16.1066 32.2485 16.9707 32.9709 17.424C33.3393 17.6365 33.7218 17.7499 34.1326 17.7499C34.5292 17.7782 34.9684 17.6932 35.3792 17.5374C37.4333 16.7582 37.4899 14.775 37.6174 13.925H40.4507L40.4365 13.9392Z"
        />
        <path
          id="vc-r"
          d="M71.8579 1.07617H79.8618C81.3067 1.16117 82.7658 2.0678 83.1908 4.19272C83.3891 5.04269 83.6866 6.44513 83.3325 8.1309C82.9783 9.81667 82.3409 10.44 81.3776 11.2191C81.8734 11.6724 82.8225 12.1541 82.9783 13.9249C83.0633 14.7323 83.0917 17.2964 83.12 18.288C83.12 19.393 83.3608 19.6338 83.6725 19.903V20.6254H80.4851C80.2443 20.0305 80.1309 19.4496 80.0884 18.798C80.0459 17.8347 80.0459 16.2764 80.0884 14.8598C80.0459 13.5424 79.3376 12.9049 78.3035 12.9049H74.8186V20.6254H71.8438V1.07617H71.8579ZM74.8328 9.54752H78.8843C79.5785 9.54752 80.8251 8.55589 80.6409 6.62929C80.6409 5.24101 80.1593 4.43355 78.8418 4.43355H74.8328V9.54752Z"
        />
        <path id="vc-i" d="M270.125 0.93457H267.164V20.4697H270.125V0.93457Z" />
        <path
          id="vc-s"
          d="M208.229 6.88449C208.271 5.29788 207.294 3.85294 205.254 3.79627C203.809 3.76794 202.746 4.43375 202.647 6.04869C202.562 7.39447 202.902 7.66363 203.554 8.00361C203.894 8.48526 206.628 9.08024 207.18 9.20773C207.974 9.39189 209.674 9.87354 210.58 11.1343C212.238 13.4859 211.473 18.1324 209.674 19.7048C208.441 20.7815 206.77 21.0506 205.169 21.079C204.432 21.1073 202.69 20.7531 201.627 19.7048C200.338 18.444 199.701 16.5175 199.602 14.6617H202.491C202.491 15.1717 202.605 15.9791 203.101 16.6733C203.752 17.5799 204.815 17.8774 205.806 17.8207C206.798 17.7924 207.719 17.3958 208.101 16.9141C208.739 16.1066 208.88 14.5767 208.158 13.6134C207.209 12.2676 204.361 12.2676 202.506 11.4177C200.947 10.6952 199.658 9.16523 199.899 6.00619C200.14 2.90381 201.797 0.594727 205.311 0.594727C206.09 0.594727 208.767 0.679723 210.184 3.08797C210.934 4.40542 211.133 6.21868 211.019 6.87032H208.229V6.88449Z"
        />
        <path id="vc-t" d="M224.538 0.93457V4.27778H220.33V20.4697H217.355V4.27778H212.992V0.93457H224.538Z" />
        <path
          id="vc-a"
          d="M25.9558 20.6254H22.9243L21.9327 16.7156H16.592L15.5862 20.6254H12.5547L17.5978 1.07617H21.0119L25.9558 20.6113V20.6254ZM17.527 13.3582H21.2244L19.2978 5.77933L17.5128 13.3582H17.527Z"
        />
        <path id="vc-v" d="M9.55423 1.07617L6.39518 15.8231L3.2078 1.07617H0.21875L5.10607 20.6254H7.65597L12.5433 1.07617H9.55423Z" />
        <clipPath id="clip0_18014_630">
          <rect width="140.1" height="22" fill="white" transform="translate(0.21875)" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0_18014_630)">
        <use href="#vc-c" transform="translate(-27.53905)" />
        <use href="#vc-r" transform="translate(-56.60205)" />
        <use href="#vc-i" transform="translate(-237.86765)" />
        <use href="#vc-s" transform="translate(-165.28865)" />
        <use href="#vc-t" transform="translate(-165.28865)" />
        <use href="#vc-i" transform="translate(-205.85865)" />
        <use href="#vc-s" transform="translate(-128.14865)" />
        <use href="#vc-a" transform="translate(72.28865)" />
        <use href="#vc-v" transform="translate(98.037114)" />
        <use href="#vc-c" transform="translate(84.624613)" />
        <use href="#vc-a" transform="translate(114.322617)" />
      </g>
    </svg>
  )
}

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
    <section className="hero" data-channel={colorChannel}>
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
        <h1 className="hero-name" aria-label="Cristi Savca">
          <CristiSavcaWordmark />
          <span className="hero-name-text hero-name-text--fraktur" aria-hidden="true">Cristi Savca</span>
          <span className="hero-name-text hero-name-text--geist" aria-hidden="true">Cristi Savca</span>
          <span className="hero-name-text hero-name-text--instrument" aria-hidden="true">Cristi Savca</span>
        </h1>
      </div>
      <a className="hero-scroll-cue" href="#projects" aria-label="Scroll down">
        <span aria-hidden>↓</span>
      </a>
    </section>
  )
}
