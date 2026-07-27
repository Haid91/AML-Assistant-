import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AMLAssistant from './components/AMLAssistant'
import Training from './components/Training'
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
