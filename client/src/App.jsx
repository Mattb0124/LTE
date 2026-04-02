import { Routes, Route } from 'react-router-dom'
import LeadForm from './components/LeadForm'
import Admin from './components/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LeadForm />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
