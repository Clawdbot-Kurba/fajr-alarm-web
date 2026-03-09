import React from 'react'

const Settings = ({ settings, onSettingsChange, onBack }) => {
  const methods = [
    'Muslim World League',
    'North America',
    'Karachi',
    'Kuwait',
    'Moon Sighting Committee'
  ]

  return (
    <div className="settings">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Settings</h1>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Prayer Time</h3>
        
        <div className="setting-item">
          <label>Calculation Method</label>
          <select 
            value={settings.calculationMethod}
            onChange={(e) => onSettingsChange({ calculationMethod: e.target.value })}
          >
            {methods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Alarm</h3>
        
        <div className="setting-item">
          <label>Vibration</label>
          <div 
            className={`toggle ${settings.vibrationEnabled ? 'active' : ''}`}
            onClick={() => onSettingsChange({ vibrationEnabled: !settings.vibrationEnabled })}
          />
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Exercise</h3>
        
        <div className="setting-item">
          <label>Sit-ups to dismiss</label>
          <span className="setting-value">{settings.sitUpTarget}</span>
        </div>
        
        <div className="slider-container">
          <label>Sit-up Target: {settings.sitUpTarget}</label>
          <input 
            type="range" 
            min="5" 
            max="50" 
            step="5"
            value={settings.sitUpTarget}
            onChange={(e) => onSettingsChange({ sitUpTarget: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="slider-container">
          <label>Motion Sensitivity: {Math.round(settings.motionSensitivity * 100)}%</label>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.1"
            value={settings.motionSensitivity}
            onChange={(e) => onSettingsChange({ motionSensitivity: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>About</h3>
        
        <div className="setting-item">
          <label>Version</label>
          <span className="setting-value">1.0.0</span>
        </div>
      </div>
    </div>
  )
}

export default Settings
