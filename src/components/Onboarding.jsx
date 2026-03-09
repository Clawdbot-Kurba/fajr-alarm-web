import React, { useState } from 'react'

const Onboarding = ({ onComplete }) => {
  const [page, setPage] = useState(0)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  const pages = [
    {
      icon: '☀️',
      title: 'Fajr Alarm',
      subtitle: 'Wake up for Fajr with purpose',
      description: 'Never miss Fajr again. Our alarm ensures you\'re truly awake by requiring physical activity to dismiss it.'
    },
    {
      icon: '📍',
      title: 'Location Access',
      subtitle: 'Calculate accurate prayer times',
      description: 'We need your location to calculate Fajr time for your area. Your location is never stored or shared.'
    },
    {
      icon: '📱',
      title: 'Motion Sensors',
      subtitle: 'Verify you\'re truly awake',
      description: 'We use your device\'s sensors to count sit-ups. You must complete the exercise to stop the alarm.'
    },
    {
      icon: '🧘',
      title: 'How It Works',
      subtitle: 'Simple 4-step process',
      description: ''
    }
  ]

  const requestLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          fetchCityName(latitude, longitude)
          setLoading(false)
        },
        (error) => {
          console.error('Location error:', error)
          setLoading(false)
          setLocation({ latitude: 21.3891, longitude: 39.8579 })
        }
      )
    }
  }

  const fetchCityName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      const data = await response.json()
      const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown'
      setLocation(prev => ({ ...prev, city }))
    } catch (e) {
      console.error('Geocoding error:', e)
    }
  }

  const getPrayerTimes = async () => {
    if (!location) return null
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
      )
      const data = await response.json()
      if (data.data?.timings) {
        const fajr = data.data.timings.Fajr
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = tomorrow.toISOString().split('T')[0]
        const resp2 = await fetch(
          `https://api.aladhan.com/v1/timings/${tomorrowStr}?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
        )
        const data2 = await resp2.json()
        return {
          fajrTime: fajr,
          tomorrowFajrTime: data2.data?.timings?.Fajr || fajr
        }
      }
    } catch (e) {
      console.error('Prayer times error:', e)
    }
    return null
  }

  const handleNext = async () => {
    if (page < pages.length - 1) {
      setPage(page + 1)
    } else {
      let locationData = location || { latitude: 21.3891, longitude: 39.8579, city: 'Mecca' }
      const prayerTimes = await getPrayerTimes()
      onComplete({
        ...locationData,
        ...prayerTimes
      })
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="onboarding-icon">{pages[page].icon}</div>
        <h1>{pages[page].title}</h1>
        {pages[page].subtitle && <h2>{pages[page].subtitle}</h2>}
        <p>{pages[page].description}</p>
        
        {page === 1 && (
          <div className="onboarding-buttons" style={{ marginTop: 20 }}>
            {location ? (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40 }}>✅</div>
                <p style={{ color: '#27ae60', marginTop: 8 }}>
                  {location.city || `Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)}`}
                </p>
              </div>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={requestLocation}
                disabled={loading}
              >
                {loading ? 'Getting location...' : 'Enable Location'}
              </button>
            )}
          </div>
        )}

        {page === 3 && (
          <div className="how-it-works">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-text">Fajr time is calculated based on your location</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-text">Alarm rings loudly at Fajr</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-text">Complete your sit-ups to stop it</div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-text">You're awake for Fajr prayer!</div>
            </div>
          </div>
        )}

        <div className="page-indicator">
          {pages.map((_, i) => (
            <div key={i} className={`page-dot ${i === page ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="onboarding-buttons">
        {page > 0 && (
          <button className="btn btn-secondary" onClick={() => setPage(page - 1)}>
            Back
          </button>
        )}
        <button className="btn btn-primary" onClick={handleNext}>
          {page === pages.length - 1 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
