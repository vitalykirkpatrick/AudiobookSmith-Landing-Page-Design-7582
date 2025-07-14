import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiPause, FiArrowLeft, FiUser, FiGlobe, FiClock, FiMic, FiFilter, FiStar, FiLoader } = FiIcons;
const { BsWaveform } = BsIcons;

// Comprehensive voice data from Unmixr API
const voiceData = [
  {
    uuid: "348c2be4-1bef-4893-ba9d-1f148bccb6ef",
    character: "Davis (Express)",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/e9d18dad-b28c-4cba-b479-b73c684bc5c8.mp3",
    use_cases: ["Audiobook", "Meditation"],
    personality: ["Calm", "Smooth", "Soothing"],
    age: "Adult",
    description: "HD versions of Davis with a soothing, relaxed tone, perfect for calming conversations and easygoing chats.",
    avatar_url: "https://resource.unmixr.com/avatar/ce55af6a-6c82-4f20-ac9a-09166eccb7a0-0.png",
    category: "Non-Fiction",
    accent: "American"
  },
  {
    uuid: "6c44b543-5e9a-446e-871f-7a2047259661",
    character: "Ollie",
    gender: "Male",
    language: "en-GB",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/66f98e7d-c65c-4b1c-8011-f9757c87bea1.mp3",
    use_cases: ["Assistant", "Audiobooks"],
    personality: ["Warm", "Cheerful", "Casual", "Friendly", "Pleasant"],
    age: "Adult",
    description: "A friendly and pleasant voice, perfect for creating a comfortable and approachable atmosphere.",
    avatar_url: "https://resource.unmixr.com/avatar/b6e3efd3-702d-40dc-bd95-d544b7d7e1d8-0.png",
    category: "Fiction",
    accent: "British"
  },
  {
    uuid: "fe12cd34-e946-46d3-a098-55257fd037b1",
    character: "Samuel",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/d2fdbe87-742a-463f-90e6-0b7f74321d15.mp3",
    use_cases: ["Audiobook", "Narration"],
    personality: ["sincere", "warm", "expressive"],
    age: "Adult",
    description: "An expressive voice that feels warm and sincere.",
    avatar_url: "https://resource.unmixr.com/avatar/0ff26c19-4d48-4d28-91ad-490c7c5ead15-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "0e1b1bd1-40c5-42ed-9116-f8560098ea92",
    character: "Lola",
    gender: "Female",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/24b30cc5-72aa-44dc-ad5a-2ce7a3877f56.mp3",
    use_cases: ["Meditation", "Audiobook"],
    personality: ["sincere", "calm", "warm"],
    age: "Adult",
    description: "A calm and sincere voice with a warm, reassuring tone.",
    avatar_url: "https://resource.unmixr.com/avatar/85f7a7e8-b999-4779-90ce-f908d99a421d-0.png",
    category: "Non-Fiction",
    accent: "American"
  },
  {
    uuid: "49e1831a-8fdf-4ad0-a64e-25fb18db75b9",
    character: "Emma2 (Express)",
    gender: "Female",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/0f2ef8ac-5da9-4400-ad89-dcf8c684f30c.mp3",
    use_cases: ["E-learning", "Chat"],
    personality: ["Light-Hearted", "Casual", "Cheerful"],
    age: "Adult",
    description: "HD versions of Emma with a calm, deeper tone, making it ideal for thoughtful conversations and easy chats.",
    avatar_url: "https://resource.unmixr.com/avatar/772e29ff-38a7-4890-a4af-48cb8e05472c-0.png",
    category: "Educational",
    accent: "American"
  },
  {
    uuid: "57f0ec2e-bbb7-460f-92d5-e7277669b985",
    character: "Steffan (Express)",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/90ebe603-6de5-44d6-bca7-f2cb0232ba85.mp3",
    use_cases: ["Assistant", "Narration"],
    personality: ["Mature", "Authentic", "Warm"],
    age: "Adult",
    description: "HD versions of Steffan with a wider range of styles, perfectly suited for audiobook narration and storytelling.",
    avatar_url: "https://resource.unmixr.com/avatar/fb1ba17d-c176-4622-adc5-e9192347c09d-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "75428a81-84ea-474c-839b-638fc37d82e1",
    character: "Andrew2 (Express)",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/8db7cc91-9d0e-45b6-8968-c98fa641fd5c.mp3",
    use_cases: ["Advertisement", "Chat"],
    personality: ["Confident", "Casual", "Warm"],
    age: "Adult",
    description: "HD version of Andrew with a more casual, laid-back tone ideal for friendly conversations.",
    avatar_url: "https://resource.unmixr.com/avatar/3fc94933-da1d-4f42-972a-9508357df453-0.png",
    category: "Business",
    accent: "American"
  },
  {
    uuid: "2ca5e00c-32b2-4133-b269-ee4cc95ac174",
    character: "Ava (Express)",
    gender: "Female",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/f45177b6-db98-479a-b8f7-57a997014d31.mp3",
    use_cases: ["Chat", "News"],
    personality: ["Pleasant", "Friendly", "Caring"],
    age: "Adult",
    description: "HD versions of Ava featuring a bright, versatile voice, engaging for podcasts, storytelling, and conversational chats.",
    avatar_url: "https://resource.unmixr.com/avatar/d93a54b5-ba71-4963-8d48-0f9561300025-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "228246e0-bd3c-4dd5-8780-fed5c7e890e3",
    character: "Luna",
    gender: "Female",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/c7662e89-20d6-4d1e-9b36-bb07567a1626.mp3",
    use_cases: ["Assistant", "Chat"],
    personality: ["Sincere", "Pleasant", "Bright", "Clear", "Friendly", "Warm"],
    age: "Adult",
    description: "A warm, sincere, and pleasant voice that conveys genuine care and trustworthiness in every interaction.",
    avatar_url: "https://resource.unmixr.com/avatar/06cf4927-cec1-4c43-9ab2-3b7604011d2a-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "0be161c1-caea-441d-9112-b9d39c3e26b4",
    character: "Kai",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/1f06fc5a-4906-44e1-8981-10a784584d2c.mp3",
    use_cases: ["Assistant", "Chat"],
    personality: ["Sincere", "Pleasant", "Bright", "Clear", "Friendly", "Warm"],
    age: "Adult",
    description: "A sincere, pleasant, and warm voice, offering a heartfelt and approachable tone to the conversation.",
    avatar_url: "https://resource.unmixr.com/avatar/4f7085cf-73c6-4ba8-8a97-49abca28a8a4-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "7ee09851-5305-4a97-a222-e11bc3f42a15",
    character: "Serena",
    gender: "Female",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/06c2eb8d-9e8d-47ad-9845-59729969faf5.mp3",
    use_cases: ["Podcast", "E-learning"],
    personality: ["formal", "confident", "mature"],
    age: "Adult",
    description: "A mature, formal voice that commands confidence and respect.",
    avatar_url: "https://resource.unmixr.com/avatar/d429c58e-5108-48ef-ba69-e2de383df74b-0.png",
    category: "Business",
    accent: "American"
  },
  {
    uuid: "008f05b0-d477-41c5-b8f4-1bb2815dd06a",
    character: "Gavin",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/c0aa0f97-2e84-44dc-86ba-3bb13e995c68.mp3",
    use_cases: ["Audiobook", "Narration"],
    personality: ["soothing", "calm", "smooth"],
    age: "Adult",
    description: "A generally calm and relaxed voice that can switch between tones seamlessly and be highly expressive when needed.",
    avatar_url: "https://resource.unmixr.com/avatar/b818898c-f43b-48b1-82ac-4a3101c0f193-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "516d27f0-1ab2-41e5-9474-406cd04a51e9",
    character: "Dustin",
    gender: "Male",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/b587878c-39de-4874-9d51-ae382cd445bf.mp3",
    use_cases: ["Podcast", "News"],
    personality: ["youthful", "clear", "thoughtful"],
    age: "Adult",
    description: "A voice good for news and podcasts with a unique timbre.",
    avatar_url: "https://resource.unmixr.com/avatar/27407eeb-3723-4be5-a4b6-3e9ed759120a-0.png",
    category: "News",
    accent: "American"
  },
  {
    uuid: "c5bdcae8-623a-41f2-8a0c-9c2d5f07463c",
    character: "Monica",
    gender: "Female",
    language: "en-US",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/8e706d06-c56d-4785-b4e1-5c995e7bf8e3.mp3",
    use_cases: ["Podcast", "Narration"],
    personality: ["Mature", "Authentic", "Warm"],
    age: "Adult",
    description: "A mature voice that conveys a strong sense of believability, perfect for delivering content in the best possible way",
    avatar_url: "https://resource.unmixr.com/avatar/26be79fa-d62d-4b9d-a925-af59e15e31c4-0.png",
    category: "Fiction",
    accent: "American"
  },
  {
    uuid: "9827708d-c40a-48a4-b8a3-7b878f3e4185",
    character: "Seraphina (Express)",
    gender: "Female",
    language: "de-DE",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/a13a1837-af39-4bcc-9c28-f2eb84eb77e1.mp3",
    use_cases: ["Audiobooks", "Chat"],
    personality: ["Cheerful", "Sincere", "Pleasant", "Warm", "Friendly"],
    age: "Adult",
    description: "HD version of Andrew with tones that feel natural and adaptable, perfect for conversations, podcasts, and chats.",
    avatar_url: "https://resource.unmixr.com/avatar/bc7111e8-ab27-4839-a91d-c8e356d37553-0.png",
    category: "International",
    accent: "German"
  },
  {
    uuid: "66bee233-e917-4ab4-a613-a34ee560e09e",
    character: "Masaru (Express)",
    gender: "Male",
    language: "ja-JP",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/f20ee604-73ff-4ba3-8ccd-db8c0d398d64.mp3",
    use_cases: ["Chat", "Audiobooks"],
    personality: ["Bright", "Warm"],
    age: "Adult",
    description: "HD version of Masaru with a versatile array of tones to enhance conversational experiences and immersive audiobooks.",
    avatar_url: "https://resource.unmixr.com/avatar/b5fefe86-860e-4b13-822e-1e1c50106132-0.png",
    category: "International",
    accent: "Japanese"
  },
  {
    uuid: "c7ebb67f-a5bf-4146-8aff-ea42f2490b78",
    character: "Alessio",
    gender: "Male",
    language: "it-IT",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/c5b14663-3ff7-42ef-a589-538387eae41f.mp3",
    use_cases: ["Assistant", "Audiobooks"],
    personality: ["Cheerful", "Warm", "Gentle", "Cheerful", "Friendly"],
    age: "Adult",
    description: "A cheerful and friendly voice, full of warmth and positive energy for every interaction.",
    avatar_url: "https://resource.unmixr.com/avatar/97c8796d-eb56-4e0d-ab80-21c9d543a0ec-0.png",
    category: "International",
    accent: "Italian"
  },
  {
    uuid: "9d6048f6-eb89-4f9e-b180-7b15c492e505",
    character: "Florian",
    gender: "Male",
    language: "de-DE",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/1049fd2a-1885-4ac9-86af-0118da3cf34b.mp3",
    use_cases: ["Chat", "Audiobooks"],
    personality: ["Cheerful", "Warm"],
    age: "Adult",
    description: "A warm and cheerful voice, perfect for chatting or audiobooks, with great versatility to adapt to any use case and speak clearly for easy understanding.",
    avatar_url: "https://resource.unmixr.com/avatar/f6d0089f-8ae6-4fe8-8823-5ee8b632b510-0.png",
    category: "International",
    accent: "German"
  },
  {
    uuid: "d611d4f4-f080-4245-aa3c-b2c8a078b4e1",
    character: "Xiaochen (Express)",
    gender: "Female",
    language: "zh-CN",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/1db0f37e-66f0-4a00-b7e0-6bbf715bc8ae.mp3",
    use_cases: ["Chat", "Podcast"],
    personality: ["Friendly", "Casual", "Upbeat"],
    age: "YoungAdult",
    description: "HD versions of Xiaochen featuring a friendly, natural tone, ideal for smooth, engaging conversation.",
    avatar_url: "https://resource.unmixr.com/avatar/96afe642-c657-4a3e-95f8-be7dd98ff1f3-0.png",
    category: "International",
    accent: "Chinese"
  },
  {
    uuid: "a7a415f4-96ca-4ecd-9442-a1aba18dd606",
    character: "Thalita",
    gender: "Female",
    language: "pt-BR",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/a50c3a37-b132-4988-9389-ddab0515814f.mp3",
    use_cases: ["Chat", "Audiobooks"],
    personality: ["Confident", "Formal", "Warm", "Cheerful", "Casual"],
    age: "Adult",
    description: "A confident and formal voice, conveying professionalism and authority in every conversation.",
    avatar_url: "https://resource.unmixr.com/avatar/99f5b96c-3285-4da6-9e62-ebaf6cbcd484-0.png",
    category: "International",
    accent: "Brazilian Portuguese"
  },
  {
    uuid: "7a6fdbb2-31c3-48a0-99ff-1b1b7b0572b9",
    character: "Isidora",
    gender: "Female",
    language: "es-ES",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/e5e99fe8-e36e-4d55-843f-6f9e2ca79fea.mp3",
    use_cases: ["Assistant", "Podcast"],
    personality: ["Cheerful", "Friendly", "Warm", "Casual"],
    age: "Adult",
    description: "A cheerful and casual voice, bringing a laid-back and positive vibe to conversations.",
    avatar_url: "https://resource.unmixr.com/avatar/3a7b3c16-26c6-4671-8a64-1b58574ae42f-0.png",
    category: "International",
    accent: "Spanish"
  },
  {
    uuid: "0ec27d77-cee0-4bed-a1cf-9379064bfcd5",
    character: "Xiaoxiao",
    gender: "Female",
    language: "zh-CN",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/b12e58df-d774-476d-b015-1588dd01fbd1.mp3",
    use_cases: ["Chat", "Podcast"],
    personality: ["Warm", "Animated", "Bright"],
    age: "YoungAdult",
    description: "A warm and animated voice with bright tones, perfect for engaging conversations.",
    avatar_url: "https://resource.unmixr.com/avatar/d9b8911a-e817-4222-b84a-8331c86c1f2a-0.png",
    category: "International",
    accent: "Chinese"
  },
  {
    uuid: "6dfa4c53-00b4-4db7-b1c7-b4ab838af2ff",
    character: "Arabella",
    gender: "Female",
    language: "es-ES",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/a60c0c09-b353-42c1-b711-959d44afb5f7.mp3",
    use_cases: ["Chat", "Narration"],
    personality: ["Cheerful", "Friendly", "Casual", "Warm", "Pleasant"],
    age: "Adult",
    description: "A warm and pleasant voice, adding a touch of calm and comfort to any situation.",
    avatar_url: "https://resource.unmixr.com/avatar/3dbd1754-037d-4558-baa3-c8e9466bb5f4-0.png",
    category: "International",
    accent: "Spanish"
  },
  {
    uuid: "88259f72-1df5-453f-bc63-d89264e68498",
    character: "Marcello",
    gender: "Male",
    language: "it-IT",
    quality: "Premium",
    sample_voice_url: "https://resource.unmixr.com/sample_audio/be290304-92d3-4fda-bc23-7df78be47e96.mp3",
    use_cases: ["Assistant", "Narration"],
    personality: ["Cheerful", "Friendly", "Casual", "Warm", "Pleasant"],
    age: "Adult",
    description: "A warm and pleasant voice, offering a soothing and comforting tone to all dialogues.",
    avatar_url: "https://resource.unmixr.com/avatar/73ba3da8-c651-4e29-babf-1fe084da162f-0.png",
    category: "International",
    accent: "Italian"
  }
];

const VoiceCard = ({ voice, isPlaying, onPlay, onPause }) => {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePlayPause = async () => {
    if (!voice.sample_voice_url) return;

    if (isPlaying) {
      onPause();
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const audioSrc = voice.sample_voice_url;
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.onloadeddata = () => {
          setIsLoading(false);
          onPlay(voice.uuid, audioRef.current);
        };
        audioRef.current.onerror = () => {
          setIsLoading(false);
          setError(true);
          console.error('Audio failed to load:', audioSrc);
        };
        audioRef.current.load();
      }
    } catch (err) {
      setIsLoading(false);
      setError(true);
      console.error('Audio playback error:', err);
    }
  };

  const getAgeDisplay = (age) => {
    switch(age) {
      case 'YoungAdult': return 'Young Adult';
      case 'Adult': return 'Adult';
      case 'Mature': return 'Mature';
      default: return age || 'Adult';
    }
  };

  const getRating = () => {
    const baseRating = 4.6;
    const variation = (voice.uuid.charCodeAt(0) % 4) * 0.1;
    return (baseRating + variation).toFixed(1);
  };

  const getLanguageDisplay = () => {
    const langMap = {
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'zh-CN': 'Chinese',
      'es-ES': 'Spanish',
      'ja-JP': 'Japanese',
      'fr-FR': 'French',
      'de-DE': 'German',
      'it-IT': 'Italian',
      'pt-BR': 'Portuguese (BR)'
    };
    return langMap[voice.language] || 'English';
  };

  const handleAvatarError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(voice.character)}&background=6366f1&color=fff&size=80`;
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
      
      {/* Voice Card Header */}
      <div className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              <img
                src={voice.avatar_url}
                alt={voice.character}
                className="w-full h-full object-cover"
                onError={handleAvatarError}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {voice.character}
              </h3>
              <p className="text-sm text-white/80">
                {voice.gender} • {getAgeDisplay(voice.age)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1 text-white/80">
              <SafeIcon icon={FiGlobe} className="w-3 h-3" />
              <span className="text-xs">{getLanguageDisplay()}</span>
            </div>
            <div className="flex items-center space-x-1 text-white/80">
              <SafeIcon icon={FiStar} className="w-3 h-3" />
              <span className="text-xs">{getRating()}</span>
            </div>
            <div className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
              {voice.quality}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Card Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            {voice.category}
          </span>
          {voice.accent && (
            <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {voice.accent}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {voice.description}
        </p>

        {/* Voice Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {voice.personality.slice(0, 3).map((trait, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full"
            >
              {trait}
            </span>
          ))}
          {voice.use_cases.slice(0, 2).map((useCase, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-secondary-50 text-secondary-600 rounded-full"
            >
              {useCase}
            </span>
          ))}
        </div>

        {/* Play Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePlayPause}
            disabled={isLoading || error}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            } ${error ? 'bg-gray-400' : ''}`}
          >
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : error ? (
                <SafeIcon icon={FiMic} className="w-4 h-4" />
              ) : isPlaying ? (
                <SafeIcon icon={FiPause} className="w-4 h-4" />
              ) : (
                <SafeIcon icon={FiPlay} className="w-4 h-4" />
              )}
              <span className="text-sm">
                {isLoading ? 'Loading...' : error ? 'Error' : isPlaying ? 'Pause' : 'Play Sample'}
              </span>
            </div>
          </button>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className="w-3 h-3" />
              <span>~30s</span>
            </span>
          </div>
        </div>

        {/* Audio Waveform Visualization (when playing) */}
        {isPlaying && (
          <div className="flex items-center justify-center space-x-1 py-2 mt-4">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary-400 rounded-full"
                animate={{
                  height: [4, 16, 8, 20, 6, 14, 10, 18, 4, 12],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const VoiceSamplesPage = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAccent, setSelectedAccent] = useState('all');

  const handlePlay = (voiceId, audioElement) => {
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setCurrentlyPlaying(voiceId);
    setCurrentAudio(audioElement);

    audioElement.play().catch(err => {
      console.error('Error playing audio:', err);
      setCurrentlyPlaying(null);
      setCurrentAudio(null);
    });

    audioElement.onended = () => {
      setCurrentlyPlaying(null);
      setCurrentAudio(null);
    };
  };

  const handlePause = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentlyPlaying(null);
    setCurrentAudio(null);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Generate filter options from voice data
  const genderOptions = [
    { value: 'all', label: 'All Genders' },
    ...Array.from(new Set(voiceData.map(v => v.gender))).map(gender => ({
      value: gender,
      label: gender
    }))
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...Array.from(new Set(voiceData.map(v => v.category))).map(category => ({
      value: category,
      label: category
    }))
  ];

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    ...Array.from(new Set(voiceData.map(v => v.language))).map(lang => ({
      value: lang,
      label: lang === 'en-US' ? 'English (US)' : 
             lang === 'en-GB' ? 'English (UK)' :
             lang === 'zh-CN' ? 'Chinese' :
             lang === 'es-ES' ? 'Spanish' :
             lang === 'ja-JP' ? 'Japanese' :
             lang === 'de-DE' ? 'German' :
             lang === 'it-IT' ? 'Italian' :
             lang === 'pt-BR' ? 'Portuguese' : lang
    }))
  ];

  const accentOptions = [
    { value: 'all', label: 'All Accents' },
    ...Array.from(new Set(voiceData.map(v => v.accent).filter(Boolean))).map(accent => ({
      value: accent,
      label: accent
    }))
  ];

  // Filter voices based on selected criteria
  const filteredVoices = voiceData.filter(voice => {
    const genderMatch = selectedGender === 'all' || voice.gender === selectedGender;
    const categoryMatch = selectedCategory === 'all' || voice.category === selectedCategory;
    const languageMatch = selectedLanguage === 'all' || voice.language === selectedLanguage;
    const accentMatch = selectedAccent === 'all' || voice.accent === selectedAccent;
    return genderMatch && categoryMatch && languageMatch && accentMatch;
  });

  const stats = [
    { icon: FiUser, value: voiceData.length, label: 'Premium Voices' },
    { icon: FiGlobe, value: Array.from(new Set(voiceData.map(v => v.language))).length, label: 'Languages' },
    { icon: FiClock, value: '24hrs', label: 'Delivery' },
    { icon: BsWaveform, value: '99.8%', label: 'Quality Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <div className="absolute top-1 left-1 w-2 h-0.5 bg-green-400"></div>
                      <div className="absolute top-1 left-1 w-0.5 h-2 bg-green-400"></div>
                      <div className="absolute top-1 right-1 w-2 h-0.5 bg-blue-400"></div>
                      <div className="absolute top-1 right-1 w-0.5 h-2 bg-blue-400"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-0.5 bg-yellow-400"></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-2 bg-yellow-400"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-0.5 bg-purple-400"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-2 bg-purple-400"></div>
                    </div>
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[10px] font-extrabold text-primary-600">AS</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary-600">Audio</span>
                <span className="text-secondary-600">book</span>
                <span className="text-primary-600">Smith</span>
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Audiobook Voices
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Explore our collection of {voiceData.length}+ professional AI voices specifically optimized for audiobook narration. Find the perfect voice for your genre and bring your story to life.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <SafeIcon icon={stat.icon} className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {/* Gender Filter */}
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Language Filter */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Accent Filter */}
              <select
                value={selectedAccent}
                onChange={(e) => setSelectedAccent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {accentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className="text-gray-600">
              Showing {filteredVoices.length} of {voiceData.length} voices
            </p>
          </div>
        </div>
      </section>

      {/* Voice Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Voice
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Listen to our diverse collection of AI voices, each with unique characteristics and personalities. From warm and conversational to authoritative and professional, find the perfect voice to bring your audiobook to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.uuid}
                voice={voice}
                isPlaying={currentlyPlaying === voice.uuid}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredVoices.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiMic} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No voices found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more options.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Want to Use Your Own Voice?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Try our voice cloning technology and create your own AI voice clone in minutes. Perfect for authors who want to narrate their books with their own voice.
            </p>
            <div className="space-y-4">
              <Link
                to="/voice-cloning"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg mb-4"
              >
                <SafeIcon icon={FiMic} className="w-5 h-5 mr-2" />
                Try Voice Cloning Now
              </Link>
              <p className="text-sm text-gray-500">
                Free demo available • No credit card required • Enterprise plans include custom voice cloning
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ready to Create Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Your Audiobook?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Transform your manuscript into a professional audiobook with any of these voices. Our AI-powered system delivers studio-quality results in just 24 hours at 85% less cost than traditional production.
            </p>
            <div className="space-y-4">
              <Link
                to="/#transform-form"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiMic} className="w-5 h-5 mr-2" />
                Start Your Audiobook Project
              </Link>
              <p className="text-sm text-gray-500">
                Free sample available • No credit card required • 30-day money-back guarantee
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <span className="text-lg font-bold">AudiobookSmith</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 AudiobookSmith. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceSamplesPage;