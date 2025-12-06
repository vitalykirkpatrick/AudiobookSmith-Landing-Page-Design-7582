import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Pause, Globe } from 'lucide-react';

interface Voice {
  id: string;
  category: string;
  character: string;
  gender: string;
  age: string;
  accent: string;
  language: string;
  languageCode?: string;
  preview_url: string;
  description: string;
  avatar?: string;
  traits?: string[];
  useCaseTags?: string[];
}

export default function VoiceSamples() {
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch voices with filters
  const { data: voicesData, isLoading } = trpc.voices.filter.useQuery({
    gender: selectedGender === 'all' ? undefined : selectedGender,
    category: selectedCategory === 'all' ? undefined : selectedCategory
  });

  // Fetch categories
  const { data: categoriesData } = trpc.voices.categories.useQuery();

  // Fetch statistics
  const { data: statsData } = trpc.voices.statistics.useQuery();

  const voices = voicesData?.voices || [];
  const categories = categoriesData?.categories || [];
  const stats = statsData?.stats;

  const handlePlayPause = (voice: Voice) => {
    if (playingVoiceId === voice.id) {
      // Pause current voice
      audioRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      // Play new voice
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.preview_url);
      audioRef.current.play();
      setPlayingVoiceId(voice.id);
      
      // Reset when audio ends
      audioRef.current.onended = () => {
        setPlayingVoiceId(null);
      };
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4">Premium Audiobook Voices</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Professional AI voices for your audiobook narration
          </p>
          
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold">{stats.totalVoices}+</div>
                <div className="text-indigo-100">Unique AI Voices</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold">{stats.languageCount}+</div>
                <div className="text-indigo-100">Languages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold">{stats.accentCount}+</div>
                <div className="text-indigo-100">Accents & Variants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold">Premium</div>
                <div className="text-indigo-100">Quality</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Choose Your Perfect Voice Section */}
      <div className="container py-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Voice</h2>
          <p className="text-lg text-gray-600">
            Listen to our diverse collection of AI voices, each with unique characteristics and personalities. 
            From warm and conversational to authoritative and professional, find the perfect voice to bring your audiobook to life.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: string) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-gray-600">
            <span className="font-semibold text-indigo-600">{voices.length}</span> voices found
          </div>
        </div>

        {/* Voice Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voices.map((voice: Voice) => (
              <div key={voice.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4 flex-1">
                      {voice.avatar && (
                        <img 
                          src={voice.avatar} 
                          alt={voice.character}
                          className="w-16 h-16 rounded-full border-4 border-white/30"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{voice.character}</h3>
                        <p className="text-indigo-100 text-sm">
                          {voice.gender} • {voice.age}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                        <Globe className="w-3 h-3" />
                        <span>{voice.languageCode || 'English (US)'}</span>
                      </div>
                      <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        Premium
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Category and Accent */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {voice.category.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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
                  {voice.useCaseTags && voice.useCaseTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {voice.useCaseTags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Traits */}
                  {voice.traits && voice.traits.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {voice.traits.map((trait, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Play Button with Wave Animation */}
                  <Button
                    onClick={() => handlePlayPause(voice)}
                    className={`w-full relative overflow-hidden ${
                      playingVoiceId === voice.id
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {playingVoiceId === voice.id && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className="w-1 bg-white rounded-full animate-pulse"
                              style={{
                                height: '16px',
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '0.6s'
                              }}
                            />
                          ))}
                        </span>
                      </span>
                    )}
                    <span className={playingVoiceId === voice.id ? 'opacity-0' : ''}>
                      {playingVoiceId === voice.id ? (
                        <>
                          <Pause className="w-4 h-4 mr-2 inline" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 inline" />
                          Play Sample
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {voices.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No voices found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AudiobookSmith</h3>
              <p className="text-gray-400 text-sm">
                Premium AI Voice Technology for professional audiobook narration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Voice Samples</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 AudiobookSmith. All rights reserved. Powered by Premium AI Voice Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
