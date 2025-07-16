export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-700">Loading Dashboard...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
      </div>
    </div>
  )
}
