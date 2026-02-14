import { useEffect, useRef, useState } from 'react'

const ROLES = [
  {
    title: 'Software Engineer I, Officer',
    period: 'Feb 2025 - Present',
    team: 'Traded Products Calculators ETL Pipeline',
  },
  {
    title: 'Software Engineer I',
    period: 'Feb 2024 - Jan 2025',
    team: 'Regulatory Document Chatbot',
  },
  {
    title: 'Software Engineer Intern',
    period: 'Aug 2023 - Dec 2023',
    team: 'Traded Products ETL Platform',
  },
]

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = Number((entry.target as HTMLElement).dataset.roleIndex)
          setVisible((current) => Math.max(current, idx + 1))
        })
      },
      { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' }
    )

    const cards = section.querySelectorAll('[data-role-index]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="section-shell experience-shell">
      <div className="section-inner">
        <div className="section-header">
          <div>
            <span className="section-kicker">Career</span>
            <h2 className="section-title">Experience</h2>
          </div>
          <p className="section-note">
            I focus on practical software impact: throughput, reliability, and tooling that helps teams move faster
            without compromising correctness.
          </p>
        </div>

        <div className="experience-brand">
          <img className="experience-logo" src="/assets/bofa/bofa.png" alt="Bank of America logo" />
          <span>Bank of America · Enterprise Risk &amp; Finance Technology</span>
        </div>

        <div className="experience-list">
          {ROLES.map((role, idx) => (
            <article
              key={role.title}
              data-role-index={idx}
              className={`experience-card ${visible > idx ? 'is-visible' : ''}`}
            >
              <h3 className="experience-title">{role.title}</h3>
              <p className="experience-team">{role.team}</p>
              <p className="experience-period">{role.period}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
