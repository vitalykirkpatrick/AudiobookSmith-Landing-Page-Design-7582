import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CustomVoiceSample {
  id: string;
  category: 'Fiction' | 'Historical' | 'General';
  title: string;
  gender: 'FEMALE' | 'MALE';
  description: string;
  sampleText: string;
  traits: string[];
  voiceName: string;
  accent: string;
  bestFor: string[];
  voiceId: string;
  audioUrl?: string;
}

export function CustomVoiceSamplesSection() {
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const [audioDurations, setAudioDurations] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch custom voice samples with cached or generated audio
  const { data, isLoading } = trpc.customVoices.listWithAudio.useQuery();
  const samples: CustomVoiceSample[] = data?.samples || [];

  const handlePlayPause = (sampleId: string, audioUrl: string | undefined) => {
    if (!audioUrl) {
      console.error("No audio URL available for this sample");
      return;
    }

    if (playingSampleId === sampleId) {
      // Pause current audio
      audioRef.current?.pause();
      setPlayingSampleId(null);
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play new audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setPlayingSampleId(null);
      });

      audio.addEventListener("loadedmetadata", () => {
        setAudioDurations(prev => ({
          ...prev,
          [sampleId]: Math.round(audio.duration)
        }));
      });

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setPlayingSampleId(null);
      });

      setPlayingSampleId(sampleId);
    }
  };

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Try Custom Voice Samples
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Experience our AI-powered text-to-speech technology with these dynamically generated samples.
            Each voice is optimized for specific genres and storytelling styles.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <span className="ml-4 text-white text-lg">Generating custom voice samples...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700 hover:border-blue-500 transition-all"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white">{sample.title}</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {sample.gender}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4">
                    {sample.description}
                  </p>

                  {/* Sample Text Quote */}
                  <div className="bg-gray-900 border-l-4 border-blue-500 p-4 mb-4 rounded">
                    <p className="text-gray-400 italic text-sm">
                      "{sample.sampleText}"
                    </p>
                  </div>

                  {/* Traits */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {sample.traits.map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Voice Info */}
                  <div className="mb-4 pb-4 border-b border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-400 font-semibold">{sample.voiceName}</span>
                      <span className="text-gray-400">{sample.accent}</span>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">BEST FOR</p>
                    <div className="flex flex-wrap gap-2">
                      {sample.bestFor.map((use, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handlePlayPause(sample.id, sample.audioUrl)}
                      disabled={!sample.audioUrl}
                      className={`flex-1 ${
                        playingSampleId === sample.id
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {playingSampleId === sample.id ? (
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        ) : (
                          <path d="M8 5v14l11-7z" />
                        )}
                      </svg>
                      {playingSampleId === sample.id ? "Pause" : "Play Sample"}
                    </Button>
                    {audioDurations[sample.id] && (
                      <span className="text-gray-400 text-sm whitespace-nowrap">
                        {formatDuration(audioDurations[sample.id])}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
