export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Anonymous Check-In System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Privacy-preserving attendance tracking with FHEVM technology
        </p>
        <div className="space-x-4">
          <a 
            href="/sessions" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Sessions
          </a>
          <a 
            href="/create" 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Session
          </a>
        </div>
      </div>
    </div>
  );
}
