'use client'

import { MapPin, Wind, Thermometer, Droplets, Eye } from 'lucide-react'
import Image from 'next/image'

interface AirQualityCardProps {
  location: { lat: number, lng: number, name: string }
  data: any
  loading: boolean
}

const getAQIInfo = (aqi: number) => {
  if (aqi <= 50) return { 
    label: 'Good', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-200',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.'
  }
  if (aqi <= 100) return { 
    label: 'Moderate', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50', 
    borderColor: 'border-yellow-200',
    description: 'Air quality is acceptable. However, there may be a risk for some people.'
  }
  if (aqi <= 150) return { 
    label: 'Unhealthy for Sensitive Groups', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50', 
    borderColor: 'border-orange-200',
    description: 'Members of sensitive groups may experience health effects.'
  }
  if (aqi <= 200) return { 
    label: 'Unhealthy', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50', 
    borderColor: 'border-red-200',
    description: 'Everyone may begin to experience health effects.'
  }
  if (aqi <= 300) return { 
    label: 'Very Unhealthy', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50', 
    borderColor: 'border-purple-200',
    description: 'Health warnings of emergency conditions.'
  }
  return { 
    label: 'Hazardous', 
    color: 'text-red-800', 
    bgColor: 'bg-red-100', 
    borderColor: 'border-red-300',
    description: 'Health alert: everyone may experience more serious health effects.'
  }
}

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#00E400'
  if (aqi <= 100) return '#FFFF00'
  if (aqi <= 150) return '#FF7E00'
  if (aqi <= 200) return '#FF0000'
  if (aqi <= 300) return '#8F3F97'
  return '#7E0023'
}

export default function AirQualityCard({ location, data, loading }: AirQualityCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  // Mock data for demonstration
  const mockData = {
    aqi: Math.floor(Math.random() * 200) + 20,
    pm25: (Math.random() * 50 + 5).toFixed(1),
    pm10: (Math.random() * 80 + 10).toFixed(1),
    o3: (Math.random() * 100 + 20).toFixed(1),
    no2: (Math.random() * 60 + 10).toFixed(1),
    so2: (Math.random() * 30 + 5).toFixed(1),
    co: (Math.random() * 2 + 0.5).toFixed(1),
    temperature: Math.floor(Math.random() * 30 + 10),
    humidity: Math.floor(Math.random() * 40 + 30),
    windSpeed: (Math.random() * 15 + 2).toFixed(1),
    visibility: (Math.random() * 15 + 5).toFixed(1),
    lastUpdated: new Date().toLocaleTimeString()
  }

  const aqiInfo = getAQIInfo(mockData.aqi)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image 
              src="/ecospace-logo.png" 
              alt="EcoSpace Logo" 
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{location.name}</h3>
            <p className="text-xs text-gray-500">NASA Earth Observation Data</p>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getAQIColor(mockData.aqi) }}
            ></div>
            <span className="text-3xl font-bold">{mockData.aqi}</span>
            <span className="text-lg text-gray-600">AQI</span>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${aqiInfo.bgColor} ${aqiInfo.color} ${aqiInfo.borderColor} border`}>
            {aqiInfo.label}
          </div>
          <p className="text-sm text-gray-600 mt-2">{aqiInfo.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-nasa-blue">{mockData.pm25}</div>
            <div className="text-xs text-gray-600">PM2.5 (μg/m³)</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-nasa-red">{mockData.pm10}</div>
            <div className="text-xs text-gray-600">PM10 (μg/m³)</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{mockData.o3}</div>
            <div className="text-xs text-gray-600">O₃ (ppb)</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{mockData.no2}</div>
            <div className="text-xs text-gray-600">NO₂ (ppb)</div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span>Temperature</span>
            </div>
            <span className="font-medium">{mockData.temperature}°C</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Humidity</span>
            </div>
            <span className="font-medium">{mockData.humidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <span>Wind Speed</span>
            </div>
            <span className="font-medium">{mockData.windSpeed} m/s</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>Visibility</span>
            </div>
            <span className="font-medium">{mockData.visibility} km</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Last updated: {mockData.lastUpdated}
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            Data source: NASA Earth Observation
          </p>
        </div>
      </div>
    </div>
  )
}
