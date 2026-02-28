import Link from "next/link"
import { MapPin, Camera, Share2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-white hover:text-zinc-200 transition-colors">
            SafarX
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-white text-black px-4 py-2 rounded-xl font-medium text-sm hover:bg-zinc-100 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* Beta Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm mb-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
            Now in Private Beta
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Map your journey.
            </span>
            <br />
            <span className="text-white">
              Preserve your memories.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10">
            The premium travel companion that transforms how you capture, organize, and relive every adventure. Built for the modern explorer.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-100 transition-all duration-200 hover:scale-105 shadow-xl">
              Start Your Journey
            </Link>
            
            <Link href="/login" className="flex items-center justify-center bg-transparent border border-zinc-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:border-zinc-500 hover:bg-zinc-900/50 transition-all duration-200">
              Watch Demo
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything you need to capture your adventures
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Premium tools designed for travelers who value both simplicity and power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Interactive Maps
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Visualize your travels with beautiful, interactive maps that bring your journey to life with precise location tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Memory Collection
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Capture and organize your travel memories with rich media support, smart tagging, and intelligent categorization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Story Sharing
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Transform your travels into beautiful, shareable stories with rich media timelines and social features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-semibold text-white mb-4 md:mb-0">
            SafarX
          </div>
          
          <div className="flex items-center space-x-8 text-zinc-400 text-sm">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <span>© 2026 SafarX</span>
          </div>
        </div>
      </footer>
    </div>
  )
}