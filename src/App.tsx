import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ProjectMogai } from './pages/ProjectMogai'
import { ProjectNora } from './pages/ProjectNora'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/mogai" element={<ProjectMogai />} />
      <Route path="/projects/nora" element={<ProjectNora />} />
    </Routes>
  )
}

export default App
