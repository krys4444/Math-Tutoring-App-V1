export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">There was an error with your authentication. Please try again.</p>
        <a href="/" className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full">
          Return Home
        </a>
      </div>
    </div>
  )
}
