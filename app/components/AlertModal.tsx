'use client'

import { useState } from 'react'
import { X, AlertTriangle, MapPin, Clock, Users, Heart, Mail, MessageSquare, CheckCircle } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const [showJoinCommunity, setShowJoinCommunity] = useState(false)
  const [showReportIssue, setShowReportIssue] = useState(false)
  const [showGetUpdates, setShowGetUpdates] = useState(false)
  const [email, setEmail] = useState('')
  const [issue, setIssue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const alerts = [
    {
      id: 1,
      type: 'high-pollution',
      title: 'High Pollution Alert',
      location: 'Multiple Regions',
      time: '2 hours ago',
      severity: 'high',
      description: 'Elevated PM2.5 and PM10 levels detected across several urban areas.',
      recommendations: [
        'Limit outdoor activities, especially for sensitive groups',
        'Use air purifiers indoors',
        'Consider wearing N95 masks if going outside',
        'Keep windows closed during peak pollution hours'
      ]
    },
    {
      id: 2,
      type: 'ozone-warning',
      title: 'Ozone Level Warning',
      location: 'Industrial Areas',
      time: '4 hours ago',
      severity: 'medium',
      description: 'Ozone levels approaching unhealthy thresholds in industrial zones.',
      recommendations: [
        'Avoid strenuous outdoor activities',
        'Stay indoors during afternoon hours',
        'Monitor local air quality updates',
        'Use public transportation when possible'
      ]
    },
    {
      id: 3,
      type: 'dust-storm',
      title: 'Dust Storm Advisory',
      location: 'Desert Regions',
      time: '6 hours ago',
      severity: 'medium',
      description: 'Dust storm activity affecting air quality in desert and arid regions.',
      recommendations: [
        'Stay indoors until conditions improve',
        'Use eye protection if going outside',
        'Keep respiratory medications handy',
        'Check weather updates regularly'
      ]
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Air Quality Alerts</h2>
                <p className="text-gray-600">Current environmental warnings and recommendations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid gap-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{alert.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{alert.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{alert.time}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{alert.description}</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Health Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {alert.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Community Resources</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Connect with your local community for additional support and information.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowJoinCommunity(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Join Community</span>
              </button>
              <button 
                onClick={() => setShowReportIssue(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Report Issue</span>
              </button>
              <button 
                onClick={() => setShowGetUpdates(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Get Updates</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Community Modal */}
      {showJoinCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Join EcoSpace Community</h3>
              <button onClick={() => setShowJoinCommunity(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4">
                Join our community to connect with others, share experiences, and stay informed about local air quality initiatives.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Local air quality discussions</p>
                <p>✓ Community health tips</p>
                <p>✓ Environmental initiatives</p>
                <p>✓ Expert Q&A sessions</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setSubmitted(true)
                  setTimeout(() => {
                    setShowJoinCommunity(false)
                    setSubmitted(false)
                  }, 2000)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {submitted ? 'Joining...' : 'Join Now'}
              </button>
              <button 
                onClick={() => setShowJoinCommunity(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showReportIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Report Air Quality Issue</h3>
              <button onClick={() => setShowReportIssue(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the issue:
              </label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Please describe the air quality issue you've observed..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  if (issue.trim()) {
                    setSubmitted(true)
                    setTimeout(() => {
                      setShowReportIssue(false)
                      setIssue('')
                      setSubmitted(false)
                    }, 2000)
                  }
                }}
                disabled={!issue.trim()}
                className="flex-1 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? 'Submitting...' : 'Submit Report'}
              </button>
              <button 
                onClick={() => {
                  setShowReportIssue(false)
                  setIssue('')
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Get Updates Modal */}
      {showGetUpdates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Get Air Quality Updates</h3>
              <button onClick={() => setShowGetUpdates(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">You'll receive:</p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>• Daily air quality reports</p>
                <p>• Pollution alerts and warnings</p>
                <p>• Health recommendations</p>
                <p>• Community updates</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  if (email.trim()) {
                    setSubmitted(true)
                    setTimeout(() => {
                      setShowGetUpdates(false)
                      setEmail('')
                      setSubmitted(false)
                    }, 2000)
                  }
                }}
                disabled={!email.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? 'Subscribing...' : 'Subscribe'}
              </button>
              <button 
                onClick={() => {
                  setShowGetUpdates(false)
                  setEmail('')
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
