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
import ComplianceOfficerGuide from './components/ComplianceOfficerGuide'
import RiskAssessmentTool from './components/RiskAssessmentTool'
import SuspiciousActivityIndicators from './components/SuspiciousActivityIndicators'
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
    // Detect return from Stripe Checkout: /?checkout=success or /?checkout=cancel
    const checkout = params.get('checkout')
    if (checkout === 'success' || checkout === 'cancel') {
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (checkout === 'success') {
      refreshUserAfterCheckout()
    }
  }, [])

  // Stripe's webhook may land a moment after the redirect back, so retry a
  // few times until premium actually shows true (or we give up and just
  // reflect whatever the account currently has).
  const refreshUserAfterCheckout = async (attempt = 0) => {
    const token = localStorage.getItem('aml_token')
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        localStorage.setItem('aml_user', JSON.stringify(data.user))
        if (!data.user.premium && attempt < 4) {
          setTimeout(() => refreshUserAfterCheckout(attempt + 1), 1500)
          return
        }
      }
    } catch { /* ignore */ }
    setView('chat')
  }

  const goHome = (u) => setView(isPremium(u) ? 'chat' : 'training')

  // Users without a role/industry set yet need to go through onboarding
  // before reaching Training or the Assistant — triggered on demand (e.g.
  // "Go to Training") rather than forced immediately on sign-in. Signed-out
  // visitors are sent to sign up first, since onboarding requires a real
  // account (it's saved against the signed-in user).
  const enterApp = (u) => {
    if (!u) { setView('signup'); return }
    if (!u.role) { setView('industryselect'); return }
    goHome(u)
  }

  // Entry point specifically for "open the AI assistant" (nav icon, homepage
  // CTA) — unlike enterApp/goHome, a non-premium user here goes to checkout
  // rather than being silently dropped into Training, since Training isn't
  // what they asked for.
  const enterChat = (u) => {
    if (!u) { setView('signup'); return }
    if (!u.role) { setView('industryselect'); return }
    setView(isPremium(u) ? 'chat' : 'checkout')
  }

  const enterTraining = (u) => {
    if (!u) { setView('signup'); return }
    if (!u.role) { setView('industryselect'); return }
    setView('training')
  }

  const handleSignIn = (userData) => {
    setUser(userData)
    setView('landing')
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

  const handleManageBilling = async () => {
    const token = localStorage.getItem('aml_token')
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/billing/create-portal-session`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok && data.url) window.location.href = data.url
    } catch { /* ignore */ }
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
    onStart: () => user ? enterApp(user) : setView('signup'),
    onStartTrial: () => user ? handleUpgrade() : setView('signup'),
    onSignIn: () => setView('signin'),
    onSignUp: () => setView('signup'),
    onOpenChat: () => enterChat(user),
    onOpenTraining: () => enterTraining(user),
    onSignOut: handleSignOut,
    onOpenSettings: openSettings,
    onOpenAbout: () => setView('about'),
    onOpenContact: () => setView('contact'),
    onOpenAustracEnrolment: () => setView('austracEnrolment'),
    onOpenSmrGuide: () => setView('smrGuide'),
    onOpenComplianceOfficer: () => setView('complianceOfficer'),
    onOpenRiskAssessment: () => setView('riskAssessment'),
    onOpenSuspiciousIndicators: () => setView('suspiciousIndicators'),
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

  if (view === 'complianceOfficer') {
    return (
      <ComplianceOfficerGuide
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'riskAssessment') {
    return (
      <RiskAssessmentTool
        {...navProps}
        user={user}
      />
    )
  }

  if (view === 'suspiciousIndicators') {
    return (
      <SuspiciousActivityIndicators
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
        onManageBilling={handleManageBilling}
      />
    )
  }

  if (view === 'training') {
    return (
      <Training
        {...navProps}
        user={user ? { ...user, premium: isPremium(user) } : user}
        onUpgrade={handleUpgrade}
      />
    )
  }

  if (view === 'chat') {
    return (
      <AMLAssistant
        {...navProps}
        user={user ? { ...user, premium: isPremium(user) } : user}
        onUpgrade={handleUpgrade}
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
