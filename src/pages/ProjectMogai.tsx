import { Link } from 'react-router-dom'

const MEDIA = [
  {
    type: 'image' as const,
    src: '/assets/mogai/MOG_screens.png',
    alt: 'MOG AI product screens',
    caption: 'Main product interface composition',
  },
  {
    type: 'image' as const,
    src: '/assets/mogai/MOG_onboarding.png',
    alt: 'MOG AI onboarding screens',
    caption: 'Onboarding and flow setup',
  },
  {
    type: 'image' as const,
    src: '/assets/mogai/ChatGPT Image Feb 10, 2026, 10_28_46 PM.png',
    alt: 'MOG AI visual concept',
    caption: 'Concept render used to shape the visual direction',
  },
  {
    type: 'video' as const,
    src: '/assets/mogai/figure_loop.mp4',
    caption: 'Character/figure interaction loop',
  },
  {
    type: 'video' as const,
    src: '/assets/mogai/female_look_textured.mp4',
    caption: 'Textured look development loop',
  },
]

export function ProjectMogai() {
  return (
    <div className="detail-page">
      <div className="detail-shell">
        <Link to="/" className="detail-back">
          ← Back to home
        </Link>
        <h1 className="detail-title">MOG AI</h1>
        <p className="detail-summary">
          AI-powered platform for avatar creation and virtual try-on. This page uses every original MOG asset in your
          `assets/mogai` folder to keep the case study complete but visually minimal.
        </p>
        <div className="media-grid">
          {MEDIA.map((item) => (
            <figure key={item.src} className="media-card">
              {item.type === 'image' ? (
                <img src={item.src} alt={item.alt} loading="lazy" />
              ) : (
                <video src={item.src} autoPlay muted loop playsInline />
              )}
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
