import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ProjectMogai } from './pages/ProjectMogai'
import { ProjectNora } from './pages/ProjectNora'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Home />} />
      <Route path="/mog-ai" element={<ProjectMogai />} />
      <Route path="/nora" element={<ProjectNora />} />
    </Routes>
  )
}

export default App
