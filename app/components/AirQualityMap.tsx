'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon, LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface AirQualityMapProps {
  onLocationSelect: (location: {lat: number, lng: number, name: string}) => void
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (location: {lat: number, lng: number, name: string}) => void }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      
      // Get location name using reverse geocoding
      try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
        const data = await response.json()
        const locationName = data.locality || data.principalSubdivision || `${lat.toFixed(2)}, ${lng.toFixed(2)}`
        
        onLocationSelect({
          lat,
          lng,
          name: locationName
        })
      } catch (error) {
        console.error('Error getting location name:', error)
        onLocationSelect({
          lat,
          lng,
          name: `${lat.toFixed(2)}, ${lng.toFixed(2)}`
        })
      }
    }
  })
  return null
}

// Sample air quality data for demonstration
const sampleLocations = [
  { lat: 40.7128, lng: -74.0060, name: 'New York City', aqi: 45, quality: 'Good' },
  { lat: 34.0522, lng: -118.2437, name: 'Los Angeles', aqi: 78, quality: 'Moderate' },
  { lat: 51.5074, lng: -0.1278, name: 'London', aqi: 32, quality: 'Good' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo', aqi: 89, quality: 'Moderate' },
  { lat: 39.9042, lng: 116.4074, name: 'Beijing', aqi: 156, quality: 'Unhealthy' },
  { lat: 28.6139, lng: 77.2090, name: 'New Delhi', aqi: 234, quality: 'Very Unhealthy' },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo', aqi: 67, quality: 'Moderate' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney', aqi: 23, quality: 'Good' }
]

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#00E400' // Good
  if (aqi <= 100) return '#FFFF00' // Moderate
  if (aqi <= 150) return '#FF7E00' // Unhealthy for Sensitive
  if (aqi <= 200) return '#FF0000' // Unhealthy
  if (aqi <= 300) return '#8F3F97' // Very Unhealthy
  return '#7E0023' // Hazardous
}

const getAQIIcon = (aqi: number) => {
  const color = getAQIColor(aqi)
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        <text x="12.5" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="${color}">${aqi}</text>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
}

export default function AirQualityMap({ onLocationSelect }: AirQualityMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nasa-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | NASA Earth Observation Data'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapClickHandler onLocationSelect={onLocationSelect} />
      
      {/* Sample air quality markers */}
      {sampleLocations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lng]}
          icon={getAQIIcon(location.aqi)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getAQIColor(location.aqi) }}
                  ></div>
                  <span className="font-medium">AQI: {location.aqi}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{location.quality}</p>
              </div>
              <button
                className="mt-2 px-3 py-1 bg-nasa-blue text-white text-sm rounded hover:bg-blue-700 transition-colors"
                onClick={() => onLocationSelect(location)}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
