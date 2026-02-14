import { Hero } from '../components/Hero'
import { Projects } from '../components/Projects'
import { Experience } from '../components/Experience'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <main className="site-home">
      <Hero />
      <Projects />
      <Experience />
      <Contact />
    </main>
  )
}
