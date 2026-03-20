import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/auth/login'
import SignUpForm from './pages/auth/signup'
import Home from './pages/resdient/home'
import News from './pages/resdient/news'
import Discussion from './pages/resdient/discussion'
import HelpPage from './pages/resdient/help'
import CreateHelp from './pages/resdient/forms/createHelp'
import CreatePost from './pages/resdient/forms/createPost'
import Profile from './pages/resdient/profile'
import AccountSettings from './pages/resdient/account-settings'

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
            <Route path="/news" element={<News />} />
            <Route path="/dis" element={<Discussion />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/create-help" element={<CreateHelp />} />
            <Route path="/create-post" element={<CreatePost />} />
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
