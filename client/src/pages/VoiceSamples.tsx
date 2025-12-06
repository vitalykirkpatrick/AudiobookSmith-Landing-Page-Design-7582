import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Pause } from 'lucide-react';

interface Voice {
  id: string;
  category: string;
  character: string;
  gender: string;
  age: string;
  accent: string;
  language: string;
  preview_url: string;
  description: string;
  avatar?: string;
  traits?: string[];
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

      {/* Filters Section */}
      <div className="container py-8">
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
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-4">
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
                        {voice.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-gray-900">{voice.gender}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium text-gray-900">{voice.age}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Accent:</span>
                      <span className="font-medium text-gray-900">{voice.accent}</span>
                    </div>
                  </div>

                  {/* Traits */}
                  {voice.traits && voice.traits.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {voice.traits.map((trait, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Play Button */}
                  <Button
                    onClick={() => handlePlayPause(voice)}
                    className={`w-full ${
                      playingVoiceId === voice.id
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {playingVoiceId === voice.id ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Sample
                      </>
                    )}
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
