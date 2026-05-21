import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import GamesPage from './pages/GamesPage'
import CabinetPage from './pages/CabinetPage'
import MonitorPage from './pages/MonitorPage'
import AccessoriPage from './pages/AccessoriPage'
import AssistenzaPage from './pages/AssistenzaPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/cabinet" element={<CabinetPage />} />
      <Route path="/monitor" element={<MonitorPage />} />
      <Route path="/accessori" element={<AccessoriPage />} />
      <Route path="/assistenza" element={<AssistenzaPage />} />
    </Routes>
  )
}
