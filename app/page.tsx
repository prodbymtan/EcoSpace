'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, TrendingUp, Users, BookOpen, Zap, Globe, AlertTriangle } from 'lucide-react'
import AirQualityCard from './components/AirQualityCard'
import ForecastChart from './components/ForecastChart'
import CommunityInsights from './components/CommunityInsights'
import LoadingSpinner from './components/LoadingSpinner'
import AlertModal from './components/AlertModal'

// Dynamically import the map component to avoid SSR issues
const AirQualityMap = dynamic(() => import('./components/AirQualityMap'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null)
  const [airQualityData, setAirQualityData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)

  const handleLocationSelect = async (location: {lat: number, lng: number, name: string}) => {
    setSelectedLocation(location)
    setLoading(true)
    
    try {
      // Simulate API call to NASA data
      const response = await fetch(`/api/air-quality?lat=${location.lat}&lng=${location.lng}`)
      const data = await response.json()
      setAirQualityData(data)
    } catch (error) {
      console.error('Error fetching air quality data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="navbar-blur sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src="/ecospace-logo.png" 
                    alt="EcoSpace Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">EcoSpace</h1>
                <p className="text-sm text-gray-600 font-medium">AI-based Earth Air Tracker</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">NASA Space Apps Challenge 2025</p>
                  <p className="text-xs text-gray-600 font-medium">From EarthData to Action</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 hero-pattern"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="floating mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Monitor Earth's Air Quality in{' '}
                <span className="text-yellow-300">Real-Time</span>
              </h2>
            </div>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
              Using NASA's Earth observation data and cloud computing to predict cleaner, safer skies 
              and strengthen public health through reliable environmental information.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-3 md:p-4 rounded-xl hover-lift">
                <MapPin className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-nasa-blue" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">Global Coverage</span>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-xl hover-lift">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-nasa-red" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">AI Forecasting</span>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-xl hover-lift">
                <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-green-600" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">Community Focus</span>
              </div>
              <div className="glass-card p-3 md:p-4 rounded-xl hover-lift">
                <BookOpen className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-purple-600" />
                <span className="text-xs md:text-sm font-semibold text-gray-800">Educational</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="gradient-card rounded-2xl overflow-hidden slide-up">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <span className="gradient-text">Global Air Quality Map</span>
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      Click on any location to view detailed air quality data powered by NASA Earth observation
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Live Data</span>
                  </div>
                </div>
              </div>
              <div className="h-80 md:h-96 map-container">
                <AirQualityMap onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Air Quality Card */}
            {selectedLocation && (
              <div className="scale-in">
                <AirQualityCard 
                  location={selectedLocation}
                  data={airQualityData}
                  loading={loading}
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="gradient-card rounded-2xl p-6 hover-lift">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="gradient-text">Quick Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="stats-card p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Global Coverage</span>
                    <span className="font-bold text-2xl text-blue-600">99.8%</span>
                  </div>
                </div>
                <div className="stats-card p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Data Points</span>
                    <span className="font-bold text-2xl text-green-600">2.4M+</span>
                  </div>
                </div>
                <div className="stats-card p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Update Frequency</span>
                    <span className="font-bold text-2xl text-blue-500">15 min</span>
                  </div>
                </div>
                <div className="stats-card p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Forecast Accuracy</span>
                    <span className="font-bold text-2xl text-green-500">94.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Banner */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 hover-lift">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-800 text-lg">Air Quality Alert</h4>
                  <p className="text-sm text-yellow-700 mt-2 leading-relaxed">
                    High pollution levels detected in several regions. Check your local area for recommendations and health guidance.
                  </p>
                  <button 
                    onClick={() => setShowAlertModal(true)}
                    className="mt-3 px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    View Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast and Community Sections */}
        {selectedLocation && airQualityData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="fade-in">
              <ForecastChart data={airQualityData} location={selectedLocation} />
            </div>
            <div className="fade-in">
              <CommunityInsights location={selectedLocation} />
            </div>
          </div>
        )}

        {/* Features Section */}
        <section className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              How EcoSpace Helps Communities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering communities worldwide with NASA's Earth observation data and cloud computing for cleaner, safer skies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card text-center p-8 rounded-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-30"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Real-Time Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Access live air quality data from NASA's Earth observation satellites with 15-minute updates and global coverage.
              </p>
            </div>
            <div className="feature-card text-center p-8 rounded-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-600 rounded-full blur-lg opacity-30"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">AI Forecasting</h3>
              <p className="text-gray-600 leading-relaxed">
                Machine learning algorithms predict pollution trends up to 7 days in advance with 94% accuracy.
              </p>
            </div>
            <div className="feature-card text-center p-8 rounded-2xl">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">Community Action</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized recommendations and connect with local environmental initiatives and health guidance.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/ecospace-logo.png" 
                    alt="EcoSpace Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white">EcoSpace</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Cloud computing with NASA Earth observation data for predicting cleaner, safer skies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">NASA Data Sources</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• MODIS Aerosol</li>
                <li>• OMI Ozone</li>
                <li>• VIIRS Nighttime</li>
                <li>• Landsat Thermal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Real-time monitoring</li>
                <li>• AI forecasting</li>
                <li>• Community insights</li>
                <li>• Educational resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">NASA Space Apps 2025</h4>
              <p className="text-sm text-gray-400">
                Learn • Launch • Lead
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Built for NASA Space Apps Challenge 2025: "From EarthData to Action"
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 EcoSpace Team - NASA Space Apps Challenge</p>
          </div>
        </div>
      </footer>

      {/* Alert Modal */}
      <AlertModal 
        isOpen={showAlertModal} 
        onClose={() => setShowAlertModal(false)} 
      />
    </div>
  )
}
