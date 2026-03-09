import React, { useState, useEffect } from 'react'

const AlarmActive = ({ settings, onComplete }) => {
  const [count, setCount] = useState(0)
  const [target] = useState(settings.sitUpTarget || 10)
  const [lastDetected, setLastDetected] = useState(false)
  const [audioContext, setAudioContext] = useState(null)

  // Start alarm sound
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      setAudioContext(ctx)
      
      const playAlarm = () => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = 880
        oscillator.type = 'square'
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 1.5)
      }
      
      // Play initial alarm
      playAlarm()
      
      // Repeat every 2 seconds
      const interval = setInterval(playAlarm, 2000)
      
      return () => clearInterval(interval)
    } catch (e) {
      console.log('Audio not supported')
    }
  }, [])

  // Vibrate
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500])
    }
  }, [])

  // Motion detection for sit-ups
  useEffect(() => {
    let state = 'idle'
    let stateStartTime = 0
    let peakPitch = 0

    const handleOrientation = (event) => {
      const pitch = event.beta || 0
      
      switch (state) {
        case 'idle':
          if (pitch > 15 && pitch < 60) {
            state = 'goingUp'
            stateStartTime = Date.now()
            peakPitch = pitch
          }
          break
        case 'goingUp':
          if (pitch > peakPitch) peakPitch = pitch
          if (pitch > 35) {
            state = 'atTop'
            stateStartTime = Date.now()
          }
          if (Date.now() - stateStartTime > 8000) state = 'idle'
          break
        case 'atTop':
          const duration = Date.now() - stateStartTime
          if (duration > 1500 && pitch < 30) {
            state = 'goingDown'
            stateStartTime = Date.now()
          }
          if (duration > 8000) state = 'idle'
          break
        case 'goingDown':
          if (pitch < 20) {
            setCount(prev => {
              const newCount = prev + 1
              setLastDetected(true)
              setTimeout(() => setLastDetected(false), 500)
              return newCount
            })
            state = 'idle'
          }
          if (Date.now() - stateStartTime > 5000) state = 'idle'
          break
      }
    }

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const response = await DeviceOrientationEvent.requestPermission()
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch (e) {
          console.log('Permission denied')
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }
    
    requestPermission()
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  // Check if target reached
  useEffect(() => {
    if (count >= target) {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }, [count, target, onComplete])

  return (
    <div className="alarm-active">
      <h1>WAKE UP!</h1>
      <p className="subtitle">Fajr Time</p>
      
      <div className="counter">
        <div className="count" style={{ 
          transform: lastDetected ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.2s'
        }}>
          {count}
        </div>
        <div className="target">of {target}</div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${Math.min((count / target) * 100, 100)}%` }}
        />
      </div>
      
      <div className="instruction">
        <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
        <div>Complete {target} sit-ups to stop the alarm</div>
        <div style={{ marginTop: 12, opacity: 0.8, fontSize: 14 }}>
          Hold phone on your chest and do sit-ups
        </div>
      </div>
    </div>
  )
}

export default AlarmActive
