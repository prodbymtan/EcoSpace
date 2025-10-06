'use client'

export default function LoadingSpinner() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="loading-dots mx-auto mb-6">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 font-semibold">Loading NASA Earth Data...</p>
          <p className="text-sm text-gray-500">Connecting to satellite networks</p>
        </div>
      </div>
    </div>
  )
}
