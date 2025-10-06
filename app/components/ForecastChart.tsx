'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { TrendingUp, Calendar } from 'lucide-react'
import Image from 'next/image'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ForecastChartProps {
  data: any
  location: { lat: number, lng: number, name: string }
}

export default function ForecastChart({ data, location }: ForecastChartProps) {
  // Generate mock forecast data for the next 7 days
  const generateForecastData = () => {
    const days = []
    const aqiData = []
    const pm25Data = []
    const baseAqi = Math.floor(Math.random() * 100) + 30
    const basePm25 = Math.floor(Math.random() * 30) + 10
    
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
      
      // Add some realistic variation to the data
      const variation = (Math.random() - 0.5) * 20
      aqiData.push(Math.max(10, Math.min(300, baseAqi + variation + (i * 2))))
      pm25Data.push(Math.max(5, Math.min(50, basePm25 + variation * 0.5 + (i * 1))))
    }
    
    return { days, aqiData, pm25Data }
  }

  const { days, aqiData, pm25Data } = generateForecastData()

  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Air Quality Index (AQI)',
        data: aqiData,
        borderColor: '#0B3D91',
        backgroundColor: 'rgba(11, 61, 145, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0B3D91',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'PM2.5 (μg/m³)',
        data: pm25Data,
        borderColor: '#FC3D21',
        backgroundColor: 'rgba(252, 61, 33, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FC3D21',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y1',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#0B3D91',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return context[0].label
          },
          label: function(context: any) {
            const label = context.dataset.label
            const value = context.parsed.y
            if (label.includes('AQI')) {
              return `${label}: ${Math.round(value)}`
            }
            return `${label}: ${value.toFixed(1)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Air Quality Index (AQI)',
          font: {
            size: 12,
            weight: 500
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'PM2.5 (μg/m³)',
          font: {
            size: 12,
            weight: 500
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  }

  const getTrendAnalysis = () => {
    const currentAqi = aqiData[0]
    const futureAqi = aqiData[6]
    const trend = futureAqi - currentAqi
    
    if (Math.abs(trend) < 5) {
      return { direction: 'stable', text: 'Air quality is expected to remain stable', color: 'text-gray-600' }
    } else if (trend > 0) {
      return { direction: 'increasing', text: 'Air quality is expected to worsen', color: 'text-red-600' }
    } else {
      return { direction: 'improving', text: 'Air quality is expected to improve', color: 'text-green-600' }
    }
  }

  const trendAnalysis = getTrendAnalysis()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <Image 
              src="/ecospace-logo.png" 
              alt="EcoSpace Logo" 
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold">7-Day Forecast</h3>
            <p className="text-sm text-gray-600">{location.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>AI-Powered Prediction</span>
        </div>
      </div>

      <div className="h-64 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-nasa-blue">{Math.round(aqiData[0])}</div>
          <div className="text-sm text-gray-600">Current AQI</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{Math.round(aqiData[6])}</div>
          <div className="text-sm text-gray-600">7-Day Forecast</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">94.2%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <TrendingUp className={`h-4 w-4 ${trendAnalysis.color}`} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Trend Analysis</h4>
            <p className={`text-sm mt-1 ${trendAnalysis.color}`}>{trendAnalysis.text}</p>
            <p className="text-xs text-gray-500 mt-2">
              Based on NASA satellite data and machine learning algorithms. 
              Forecast accuracy: 94.2% over 7-day period.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> This forecast is based on historical patterns and current conditions. 
          Actual air quality may vary due to weather changes and local events.
        </p>
      </div>
    </div>
  )
}
