import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/auth/login'
import SignUpForm from './pages/auth/signup'
import Home from './pages/resdient/home'
import Community from './pages/resdient/community'
import HelpPage from './pages/resdient/help'
import CreateHelp from './pages/resdient/forms/createHelp'
import CreatePost from './pages/resdient/forms/createPost'
import Profile from './pages/resdient/profile'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />

            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<Community />} />
            <Route path="/news/:postId" element={<Community />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-help" element={<CreateHelp />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
