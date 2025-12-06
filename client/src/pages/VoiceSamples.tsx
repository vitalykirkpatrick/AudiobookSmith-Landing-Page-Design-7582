import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Globe, User, Filter, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Voice {
  id: string;
  character: string;
  gender: string;
  age: string;
  accent: string;
  language: string;
  preview_url: string;
  description: string;
  category: string;
  avatar?: string;
  traits?: string[];
  useCaseTags?: string[];
  languageCode?: string;
}

export default function VoiceSamples() {
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedAccent, setSelectedAccent] = useState<string>("all");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch voices with filters
  const { data: voicesData, isLoading } = trpc.voices.filter.useQuery({
    gender: selectedGender === "all" ? undefined : selectedGender,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  // Fetch categories and statistics
  const { data: categoriesData } = trpc.voices.categories.useQuery();
  const { data: statsData } = trpc.voices.statistics.useQuery();

  const voices = voicesData?.voices || [];
  const categories = categoriesData?.categories || [];
  const stats = statsData?.stats;

  // Get unique languages and accents
  const languages = Array.from(new Set(voices.map((v: Voice) => v.language)));
  const accents = Array.from(new Set(voices.map((v: Voice) => v.accent)));

  // Filter voices by language and accent
  const filteredVoices = voices.filter((voice: Voice) => {
    const languageMatch = selectedLanguage === "all" || voice.language === selectedLanguage;
    const accentMatch = selectedAccent === "all" || voice.accent === selectedAccent;
    return languageMatch && accentMatch;
  });

  const handlePlayPause = (voiceId: string, previewUrl: string) => {
    if (playingVoiceId === voiceId) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(previewUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingVoiceId(null);
      setPlayingVoiceId(voiceId);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Logo and Back to Home */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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

            {/* Back to Home */}
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Statistics */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Premium Audiobook Voices
          </h1>
          <p className="text-xl text-center mb-8 text-blue-100">
            Explore our collection of premium AI voices specifically optimized for audiobook narration.
            Find the perfect voice for your genre and bring your story to life.
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <User className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">1,300+</div>
              <div className="text-sm text-blue-100">Unique AI Voices</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">70+</div>
              <div className="text-sm text-blue-100">Languages</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-blue-100">Accents & Variants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Mic className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-blue-100">Curated Premium Voices</div>
            </div>
          </div>

          {/* Feature Boxes */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Native-Quality Narration</h3>
              <p className="text-sm text-blue-100">Advanced AI with natural intonation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">One-Click Language Switching</h3>
              <p className="text-sm text-blue-100">Create international editions easily</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: string) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((lang: string) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAccent} onValueChange={setSelectedAccent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Accents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accents</SelectItem>
                  {accents.map((accent: string) => (
                    <SelectItem key={accent} value={accent}>
                      {accent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-gray-600">
            Showing <span className="font-semibold">{filteredVoices.length}</span> of{" "}
            <span className="font-semibold">{voices.length}</span> curated premium voices
          </div>
        </div>
      </section>

      {/* Choose Your Perfect Voice Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Voice</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Listen to our diverse collection of AI voices, each with unique characteristics and personalities.
            From warm and conversational to authoritative and professional, find the perfect voice to bring
            your audiobook to life.
          </p>
        </div>
      </section>

      {/* Voice Cards Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading voices...</p>
            </div>
          ) : filteredVoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No voices found matching your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVoices.map((voice: Voice) => (
                <div
                  key={voice.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {voice.avatar && (
                          <img
                            src={voice.avatar}
                            alt={voice.character}
                            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold">{voice.character}</h3>
                          <p className="text-sm text-blue-100">
                            {voice.gender} • {voice.age}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded">
                          <Globe className="w-3 h-3" />
                          {voice.languageCode}
                        </div>
                        <div className="bg-white/20 px-2 py-1 rounded text-xs">
                          Premium
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Accent Tags */}
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {voice.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {voice.accent}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {voice.description}
                    </p>

                    {/* Use Case Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {voice.useCaseTags?.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Trait Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {voice.traits?.map((trait: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Play Button */}
                    <Button
                      onClick={() => handlePlayPause(voice.id, voice.preview_url)}
                      className={`w-full ${
                        playingVoiceId === voice.id
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {playingVoiceId === voice.id ? "Pause" : "Play Sample"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section 1: Voice Cloning */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Use Your Own Voice?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Try our voice cloning technology and create your own AI voice clone in minutes. Perfect for
            authors who want to narrate their books with their own voice.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg px-8 py-6">
            <Mic className="w-5 h-5 mr-2" />
            Try Voice Cloning Now
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Free demo available • No credit card required • Enterprise plans include custom voice cloning
          </p>
        </div>
      </section>

      {/* CTA Section 2: Start Audiobook Project */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Audiobook?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your manuscript into a professional audiobook with any of these voices. Our AI-powered
            system delivers studio-quality results in just 24 hours at 85% less cost than traditional production.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg px-8 py-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Your Audiobook Project
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Free sample available • No credit card required • 30-day money-back guarantee
          </p>
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
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
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
