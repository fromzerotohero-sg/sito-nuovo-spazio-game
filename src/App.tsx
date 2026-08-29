import { Routes, Route } from 'react-router'
import CmsPage from './components/cms/CmsPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />}>
        <Route index element={<CmsPage slug="home" />} />
        <Route path="games" element={<CmsPage slug="games" />} />
        <Route path="cabinet" element={<CmsPage slug="cabinet" />} />
        <Route path="monitor" element={<CmsPage slug="monitor" />} />
        <Route path="accessori" element={<CmsPage slug="accessori" />} />
        <Route path="assistenza" element={<CmsPage slug="assistenza" />} />
      </Route>
      <Route path="/" element={<CmsPage slug="home" />} />
      <Route path="/games" element={<CmsPage slug="games" />} />
      <Route path="/cabinet" element={<CmsPage slug="cabinet" />} />
      <Route path="/monitor" element={<CmsPage slug="monitor" />} />
      <Route path="/accessori" element={<CmsPage slug="accessori" />} />
      <Route path="/assistenza" element={<CmsPage slug="assistenza" />} />
    </Routes>
  )
}
