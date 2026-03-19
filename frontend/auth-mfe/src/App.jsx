import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/auth/login'
import SignUpForm from './pages/auth/signup'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
