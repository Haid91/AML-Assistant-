import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AMLAssistant from './components/AMLAssistant'
import Training from './components/Training'
import RoleSelect from './components/RoleSelect'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

function App() {
  const [view, setView] = useState('landing')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('aml_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('aml_user') }
    }
  }, [])

  const handleSignIn = (userData) => {
    setUser(userData)
    // Skip role select if they already have a saved role
    const saved = localStorage.getItem('aml_user')
    const parsed = saved ? JSON.parse(saved) : {}
    if (parsed.role) {
      setView('chat')
    } else {
      setView('roleselect')
    }
  }

  const handleRoleSelect = (role) => {
    const updated = { ...user, role }
    setUser(updated)
    localStorage.setItem('aml_user', JSON.stringify(updated))
    setView('chat')
  }

  const handleSignOut = async () => {
    const token = localStorage.getItem('aml_token')
    if (token) {
      try {
        await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch { /* ignore */ }
    }
    localStorage.removeItem('aml_token')
    localStorage.removeItem('aml_user')
    setUser(null)
    setView('landing')
  }

  if (view === 'signin') {
    return (
      <SignIn
        onSignIn={handleSignIn}
        onGoSignUp={() => setView('signup')}
        onGoHome={() => setView('landing')}
      />
    )
  }

  if (view === 'signup') {
    return (
      <SignUp
        onSignUp={handleSignIn}
        onGoSignIn={() => setView('signin')}
        onGoHome={() => setView('landing')}
      />
    )
  }

  if (view === 'roleselect') {
    return (
      <RoleSelect
        user={user}
        onSelectRole={handleRoleSelect}
      />
    )
  }

  if (view === 'training') {
    return (
      <Training
        user={user}
        onBack={() => setView('landing')}
        onSignOut={handleSignOut}
      />
    )
  }

  if (view === 'chat') {
    return (
      <AMLAssistant
        user={user}
        onBack={() => setView('landing')}
        onSignOut={handleSignOut}
        onOpenTraining={() => setView('training')}
      />
    )
  }

  return (
    <LandingPage
      user={user}
      onStart={() => user ? setView('chat') : setView('signup')}
      onSignIn={() => setView('signin')}
      onSignUp={() => setView('signup')}
      onOpenChat={() => setView('chat')}
      onOpenTraining={() => setView('training')}
      onSignOut={handleSignOut}
    />
  )
}

export default App
