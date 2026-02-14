import { Link } from 'react-router-dom'

const PROJECTS = [
  {
    name: 'MOG AI',
    href: '/projects/mogai',
    preview: '/assets/mogai/ChatGPT Image Feb 10, 2026, 10_28_46 PM.png',
    description: '3D avatar and virtual try-on product flow with visual generation and interaction loops.',
    meta: 'AI + 3D + Product',
  },
  {
    name: 'Nora',
    href: '/projects/nora',
    preview: '/assets/nora/IMG_1365 2.PNG',
    description: 'Lunar-inspired wellness experience for safer baby product decisions and reflection habits.',
    meta: 'Mobile + Data + UX',
  },
]

export function Projects() {
  return (
    <section id="projects" className="section-shell">
      <div className="section-inner">
        <div className="section-header">
          <div>
            <span className="section-kicker">Selected Work</span>
            <h2 className="section-title">Projects</h2>
          </div>
          <p className="section-note">
            Each case study uses original assets and prototype media to show the product direction, interface quality,
            and system thinking behind the build.
          </p>
        </div>
        <div className="project-grid">
          {PROJECTS.map((project) => (
            <Link key={project.name} to={project.href} className="project-card">
              <img className="project-thumb" src={project.preview} alt={`${project.name} preview`} />
              <h3 className="project-name">{project.name}</h3>
              <p className="project-copy">{project.description}</p>
              <p className="project-meta">{project.meta}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
