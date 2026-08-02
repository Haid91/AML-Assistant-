import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AMLAssistant from './components/AMLAssistant'
import Training from './components/Training'
import RoleSelect from './components/RoleSelect'
import IndustrySelect from './components/IndustrySelect'
import SimulationSelect from './components/SimulationSelect'
import Checkout from './components/Checkout'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import AccountSettings from './components/AccountSettings'
import About from './components/About'
import Contact from './components/Contact'
import AustracEnrolment from './components/AustracEnrolment'
import SmrGuide from './components/SmrGuide'
import CostCalculator from './components/CostCalculator'
import SetupGuide from './components/SetupGuide'
import EligibilityCheck from './components/EligibilityCheck'
import ProgramBuilder from './components/ProgramBuilder'
import SectorGuide from './components/SectorGuide'
import { API_URL } from './config'

const OWNER_EMAILS = new Set(['haidershahid3.16@live.com'])

function isPremium(u) {
  return u?.premium || OWNER_EMAILS.has(u?.email?.toLowerCase())
}

function App() {
  const [view, setView] = useState('landing')
  const [previousView, setPreviousView] = useState('landing')
  const [settingsTab, setSettingsTab] = useState('profile')
  const [user, setUser] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedSectorGuide, setSelectedSectorGuide] = useState(null)
  const [resetToken, setResetToken] = useState(null)
  const [scrollTarget, setScrollTarget] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('aml_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('aml_user') }
    }
    // Detect password reset link: /?action=reset&token=...
    const params = new URLSearchParams(window.location.search)
    if (params.get('action') === 'reset' && params.get('token')) {
      setResetToken(params.get('token'))
      setView('resetpassword')
    }
  }, [])

  const goHome = (u) => setView(isPremium(u) ? 'chat' : 'training')

  const handleSignIn = (userData) => {
    setUser(userData)
    const saved = localStorage.getItem('aml_user')
    const parsed = saved ? JSON.parse(saved) : {}
    // New users: go through industry → simulation → role select
    // Returning users with role already set: go straight home
    if (parsed.role) {
      goHome(userData)
    } else {
      setView('industryselect')
    }
  }

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry)
    setView('simulationselect')
  }

  const handleSimulationContinue = () => {
    setView('roleselect')
  }

  const handleRoleSelect = (role) => {
    const updated = { ...user, role, industry: selectedIndustry }
    setUser(updated)
    localStorage.setItem('aml_user', JSON.stringify(updated))
    goHome(updated)
  }

  const handleUpgrade = () => setView('checkout')

  const handleCheckoutSuccess = () => {
    const upgraded = { ...user, premium: true }
    setUser(upgraded)
    localStorage.setItem('aml_user', JSON.stringify(upgraded))
    setView('chat')
  }

  const handleDowngrade = () => {
    const downgraded = { ...user, premium: false }
    setUser(downgraded)
    localStorage.setItem('aml_user', JSON.stringify(downgraded))
  }

  const handleUpdateUser = (partialUser) => {
    const updated = { ...user, ...partialUser }
    setUser(updated)
    localStorage.setItem('aml_user', JSON.stringify(updated))
  }

  const openSettings = (tab = 'profile') => {
    setSettingsTab(tab)
    setPreviousView(view)
    setView('settings')
  }

  const handleSignOut = async () => {
    const token = localStorage.getItem('aml_token')
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
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

  const navigateToSection = (id) => {
    setScrollTarget(id)
    setView('landing')
  }

  const navProps = {
    onGoHome: () => setView('landing'),
    onNavigateSection: navigateToSection,
    onStart: () => user ? goHome(user) : setView('signup'),
    onSignIn: () => setView('signin'),
    onSignUp: () => setView('signup'),
    onOpenChat: () => goHome(user),
    onOpenTraining: () => setView('training'),
    onSignOut: handleSignOut,
    onOpenSettings: openSettings,
    onOpenAbout: () => setView('about'),
    onOpenContact: () => setView('contact'),
    onOpenAustracEnrolment: () => setView('austracEnrolment'),
    onOpenSmrGuide: () => setView('smrGuide'),
    onOpenCost: () => setView('cost'),
    onOpenSetupGuide: () => setView('setupguide'),
    onOpenEligibility: () => setView('eligibility'),
    onOpenProgramBuilder: () => setView('programbuilder'),
  }

  if (view === 'signin') {
    return (
      <SignIn
        onSignIn={handleSignIn}
        onGoSignUp={() => setView('signup')}
        onGoHome={() => setView('landing')}
        onForgotPassword={() => setView('forgotpassword')}
      />
    )
  }

  if (view === 'forgotpassword') {
    return (
      <ForgotPassword
        onGoSignIn={() => setView('signin')}
        onGoHome={() => setView('landing')}
      />
    )
  }

  if (view === 'resetpassword') {
    return (
      <ResetPassword
        token={resetToken}
        onGoSignIn={() => setView('signin')}
        onGoHome={() => setView('landing')}
      />
    )
  }

  if (view === 'about') {
    return (
      <About
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'contact') {
    return (
      <Contact
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'austracEnrolment') {
    return (
      <AustracEnrolment
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'smrGuide') {
    return (
      <SmrGuide
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'cost') {
    return (
      <CostCalculator
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'setupguide') {
    return (
      <SetupGuide
        {...navProps}
        user={user}
        onOpenSectorGuide={(id) => { setSelectedSectorGuide(id); setView('sectorguide') }}
      />
    )
  }

  if (view === 'sectorguide') {
    return (
      <SectorGuide
        {...navProps}
        user={user}
        sector={selectedSectorGuide}
      />
    )
  }

  if (view === 'eligibility') {
    return (
      <EligibilityCheck
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'programbuilder') {
    return (
      <ProgramBuilder
        {...navProps}
        user={user ? { ...user, premium: isPremium(user) } : user}
        onUpgrade={handleUpgrade}
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

  if (view === 'industryselect') {
    return (
      <IndustrySelect
        user={user}
        onSelect={handleIndustrySelect}
      />
    )
  }

  if (view === 'simulationselect') {
    return (
      <SimulationSelect
        user={user}
        industry={selectedIndustry}
        onContinue={handleSimulationContinue}
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

  if (view === 'checkout') {
    return (
      <Checkout
        user={user}
        onBack={() => setView(isPremium(user) ? 'chat' : 'training')}
        onSuccess={handleCheckoutSuccess}
      />
    )
  }

  if (view === 'settings') {
    return (
      <AccountSettings
        user={user ? { ...user, premium: isPremium(user) } : user}
        initialTab={settingsTab}
        onBack={() => setView(previousView)}
        onUpdateUser={handleUpdateUser}
        onUpgrade={handleUpgrade}
        onDowngrade={handleDowngrade}
      />
    )
  }

  if (view === 'training') {
    return (
      <Training
        user={user ? { ...user, premium: isPremium(user) } : user}
        onBack={() => setView('landing')}
        onSignOut={handleSignOut}
        onOpenChat={() => setView('chat')}
        onUpgrade={handleUpgrade}
        onOpenSettings={openSettings}
      />
    )
  }

  if (view === 'chat') {
    return (
      <AMLAssistant
        user={user ? { ...user, premium: isPremium(user) } : user}
        onBack={() => setView('landing')}
        onSignOut={handleSignOut}
        onOpenTraining={() => setView('training')}
        onUpgrade={handleUpgrade}
        onOpenSettings={openSettings}
      />
    )
  }

  return (
    <LandingPage
      {...navProps}
      user={user}
      onOpenSectorGuide={(id) => { setSelectedSectorGuide(id); setView('sectorguide') }}
      scrollTarget={scrollTarget}
      onScrollHandled={() => setScrollTarget(null)}
    />
  )
}

export default App
