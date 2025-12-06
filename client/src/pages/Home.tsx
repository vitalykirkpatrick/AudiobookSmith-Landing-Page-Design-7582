import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, BookOpen, Zap, Globe, Users, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <img src="/logo.svg" alt="AudiobookSmith" className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-blue-600">Audio</span>
                  <span className="text-purple-600">book</span>
                  <span className="text-blue-600">Smith</span>
                </span>
              </a>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <Link href="/voice-samples">
                <a className="text-gray-700 hover:text-blue-600 transition-colors">
                  Voices Demo
                </a>
              </Link>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">
                FAQ
              </a>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Books into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Professional Audiobooks
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered audiobook generation platform for independent authors, educators, and publishers.
            Create studio-quality audiobooks in 24 hours at 85% less cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/voice-samples">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg px-8 py-6">
                <Mic className="w-5 h-5 mr-2" />
                Explore Voice Samples
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1,300+</div>
              <div className="text-gray-600">AI Voices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">70+</div>
              <div className="text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Accents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24hrs</div>
              <div className="text-gray-600">Delivery Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose AudiobookSmith?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate professional audiobooks in just 24 hours. No more waiting weeks for traditional narration.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">70+ Languages</h3>
              <p className="text-gray-600">
                Reach global audiences with support for over 70 languages and 100+ accents.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1,300+ Voices</h3>
              <p className="text-gray-600">
                Choose from our vast library of premium AI voices or clone your own voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Audiobook?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of authors who have transformed their books into professional audiobooks.
          </p>
          <Link href="/voice-samples">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              <Star className="w-5 h-5 mr-2" />
              Explore Voice Samples
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AudiobookSmith</h3>
              <p className="text-gray-400">
                AI-powered audiobook generation for the modern author.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/voice-samples"><a className="hover:text-white">Voice Samples</a></Link></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 AudiobookSmith. All rights reserved. Powered by Premium AI Voice Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
