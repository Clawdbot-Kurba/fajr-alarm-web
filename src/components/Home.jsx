import React from 'react'

const Home = ({ settings, onSettingsChange, onOpenSettings, onAlarmTrigger }) => {
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--'
    const [hours, minutes] = timeStr.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  const toggleAlarm = () => {
    onSettingsChange({ alarmActive: !settings.alarmActive })
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Fajr Alarm</h1>
        <button className="settings-btn" onClick={onOpenSettings}>⚙️</button>
      </div>

      <div className="card">
        <div className="card-icon">📍</div>
        <h3>Current Location</h3>
        <div className="value">{settings.city || 'Unknown'}</div>
        <div className="subtext">Prayer times calculated for this location</div>
      </div>

      <div className="card">
        <div className="card-icon">🌅</div>
        <h3>Fajr Time</h3>
        <div className="value">{formatTime(settings.fajrTime)}</div>
        <div className="subtext">Tomorrow: {formatTime(settings.tomorrowFajrTime)}</div>
      </div>

      <div className="card">
        <div className="toggle-container">
          <div>
            <div className="card-icon">⏰</div>
            <h3>Alarm Status</h3>
            <div className="value" style={{ color: settings.alarmActive ? '#27ae60' : '#666' }}>
              {settings.alarmActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          <div 
            className={`toggle ${settings.alarmActive ? 'active' : ''}`} 
            onClick={toggleAlarm}
          />
        </div>
        <div className="subtext">
          {settings.alarmActive 
            ? 'You\'ll be woken up at Fajr' 
            : 'Turn on to receive Fajr alarms'}
        </div>
      </div>

      <div className="card">
        <div className="card-icon">🧘</div>
        <h3>Sit-up Requirement</h3>
        <div className="value">{settings.sitUpTarget} sit-ups</div>
        <div className="subtext">Complete these to stop the alarm</div>
      </div>

      <div className="how-it-works">
        <h2>How it works</h2>
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-text">Alarm rings at Fajr time</div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-text">Complete {settings.sitUpTarget} sit-ups to stop</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-text">Updates automatically when you travel</div>
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: 32 }}
        onClick={onAlarmTrigger}
      >
        🎤 Test Alarm (Demo)
      </button>
    </div>
  )
}

export default Home
