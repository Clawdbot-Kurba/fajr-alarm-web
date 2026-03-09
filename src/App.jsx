import React, { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import AlarmActive from './components/AlarmActive'
import Settings from './components/Settings'

const App = () => {
  const [screen, setScreen] = useState('onboarding')
  const [settings, setSettings] = useState({
    hasCompletedOnboarding: false,
    city: '',
    latitude: 0,
    longitude: 0,
    fajrTime: null,
    tomorrowFajrTime: null,
    alarmActive: true,
    sitUpTarget: 10,
    calculationMethod: 'North America',
    vibrationEnabled: true,
    motionSensitivity: 0.5
  })

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fajrAlarmSettings')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(prev => ({ ...prev, ...parsed }))
      if (parsed.hasCompletedOnboarding) {
        setScreen('home')
      }
    }
  }, [])

  // Save settings
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('fajrAlarmSettings', JSON.stringify(updated))
  }

  // Get current screen component
  const getScreen = () => {
    switch (screen) {
      case 'onboarding':
        return <Onboarding onComplete={(data) => {
          updateSettings({ ...data, hasCompletedOnboarding: true })
          setScreen('home')
        }} />
      case 'home':
        return <Home 
          settings={settings} 
          onSettingsChange={updateSettings}
          onOpenSettings={() => setScreen('settings')}
          onAlarmTrigger={() => setScreen('alarm')}
        />
      case 'alarm':
        return <AlarmActive 
          settings={settings}
          onComplete={() => {
            setScreen('home')
          }}
        />
      case 'settings':
        return <Settings 
          settings={settings}
          onSettingsChange={updateSettings}
          onBack={() => setScreen('home')}
        />
      default:
        return <Onboarding onComplete={() => {}} />
    }
  }

  return (
    <div className="app-container">
      {getScreen()}
    </div>
  )
}

export default App
