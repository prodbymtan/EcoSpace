'use client'

import { Users, Heart, Lightbulb, Share2, MessageCircle, BookOpen } from 'lucide-react'
import Image from 'next/image'

interface CommunityInsightsProps {
  location: { lat: number, lng: number, name: string }
}

export default function CommunityInsights({ location }: CommunityInsightsProps) {
  // Mock community data
  const communityData = {
    activeUsers: Math.floor(Math.random() * 500) + 100,
    reports: Math.floor(Math.random() * 50) + 10,
    initiatives: Math.floor(Math.random() * 20) + 5,
    lastActivity: '2 hours ago'
  }

  const recommendations = [
    {
      type: 'health',
      title: 'Health Recommendations',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      items: [
        'Limit outdoor activities during peak pollution hours (10 AM - 4 PM)',
        'Use air purifiers indoors, especially in bedrooms',
        'Consider wearing N95 masks for sensitive individuals',
        'Stay hydrated to help your body cope with pollutants'
      ]
    },
    {
      type: 'action',
      title: 'Community Actions',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      items: [
        'Join the local Clean Air Initiative group',
        'Report pollution sources through the community app',
        'Participate in tree planting events this weekend',
        'Share carpooling opportunities with neighbors'
      ]
    },
    {
      type: 'tips',
      title: 'Environmental Tips',
      icon: Lightbulb,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      items: [
        'Use public transportation or bike when possible',
        'Reduce energy consumption at home',
        'Support local businesses with eco-friendly practices',
        'Plant air-purifying plants in your home'
      ]
    }
  ]

  const recentReports = [
    {
      user: 'Sarah M.',
      time: '1 hour ago',
      type: 'pollution',
      message: 'Noticed increased traffic near the school. Air quality seems worse today.',
      verified: true
    },
    {
      user: 'Mike R.',
      time: '3 hours ago',
      type: 'improvement',
      message: 'Great to see the new bike lanes! Traffic seems lighter this morning.',
      verified: true
    },
    {
      user: 'Lisa K.',
      time: '5 hours ago',
      type: 'event',
      message: 'Community garden planting event this Saturday at 9 AM. All welcome!',
      verified: false
    }
  ]

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
            <h3 className="text-xl font-semibold">Community Insights</h3>
            <p className="text-sm text-gray-600">{location.name} Community</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-nasa-blue">{communityData.activeUsers}</div>
          <div className="text-xs text-gray-500">Active Members</div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-nasa-blue">{communityData.reports}</div>
          <div className="text-xs text-gray-600">Reports</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{communityData.initiatives}</div>
          <div className="text-xs text-gray-600">Initiatives</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{communityData.lastActivity}</div>
          <div className="text-xs text-gray-600">Last Activity</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4 mb-6">
        {recommendations.map((rec, index) => (
          <div key={index} className={`p-4 rounded-lg border ${rec.bgColor}`}>
            <div className="flex items-center space-x-3 mb-3">
              <rec.icon className={`h-5 w-5 ${rec.color}`} />
              <h4 className="font-semibold text-gray-900">{rec.title}</h4>
            </div>
            <ul className="space-y-2">
              {rec.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Recent Community Reports */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Recent Community Reports</h4>
          <button className="text-sm text-nasa-blue hover:text-blue-700 flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>View All</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{report.user}</span>
                  {report.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{report.time}</span>
              </div>
              <p className="text-sm text-gray-700">{report.message}</p>
              <div className="flex items-center space-x-4 mt-2">
                <button className="text-xs text-gray-500 hover:text-nasa-blue flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>Reply</span>
                </button>
                <button className="text-xs text-gray-500 hover:text-nasa-blue flex items-center space-x-1">
                  <Share2 className="h-3 w-3" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Resources */}
      <div className="mt-6 p-4 bg-nasa-blue rounded-lg text-white">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="h-5 w-5" />
          <h4 className="font-semibold">Educational Resources</h4>
        </div>
        <p className="text-sm mb-3">
          Learn more about air quality and how to protect your health and environment.
        </p>
        <div className="flex space-x-3">
          <button className="text-xs bg-white text-nasa-blue px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
            Air Quality Guide
          </button>
          <button className="text-xs bg-white text-nasa-blue px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
            Health Tips
          </button>
          <button className="text-xs bg-white text-nasa-blue px-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
            Community Guide
          </button>
        </div>
      </div>
    </div>
  )
}
