import { Link } from 'react-router-dom'

const MEDIA = [
  {
    src: '/assets/nora/crescentIcon512.png',
    alt: 'Nora crescent icon',
    caption: 'Identity mark',
  },
  {
    src: '/assets/nora/Nora_sfb.png',
    alt: 'Nora product screen',
    caption: 'Primary screen composition',
  },
  {
    src: '/assets/nora/IMG_1362 2.PNG',
    alt: 'Nora mobile screen 1',
    caption: 'Mobile capture 1',
  },
  {
    src: '/assets/nora/IMG_1363 2.PNG',
    alt: 'Nora mobile screen 2',
    caption: 'Mobile capture 2',
  },
  {
    src: '/assets/nora/IMG_1364 2.PNG',
    alt: 'Nora mobile screen 3',
    caption: 'Mobile capture 3',
  },
  {
    src: '/assets/nora/IMG_1365 2.PNG',
    alt: 'Nora mobile screen 4',
    caption: 'Mobile capture 4',
  },
  {
    src: '/assets/nora/IMG_1366 2.PNG',
    alt: 'Nora mobile screen 5',
    caption: 'Mobile capture 5',
  },
  {
    src: '/assets/nora/IMG_1367 2.PNG',
    alt: 'Nora mobile screen 6',
    caption: 'Mobile capture 6',
  },
]

export function ProjectNora() {
  return (
    <div className="detail-page">
      <div className="detail-shell">
        <Link to="/" className="detail-back">
          ← Back to home
        </Link>
        <h1 className="detail-title">Nora</h1>
        <p className="detail-summary">
          Lunar-inspired wellness app focused on healthy baby products and reflective routines. This gallery includes
          every image in your `assets/nora` folder.
        </p>
        <div className="media-grid">
          {MEDIA.map((item) => (
            <figure key={item.src} className="media-card">
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
