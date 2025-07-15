import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMic, FiPlay, FiPause, FiX, FiTrash2, FiAlertTriangle } = FiIcons;

const VoiceRecorder = ({ 
  onRecordingComplete, 
  onRecordingDelete, 
  permissionText,
  isDisabled = false,
  minDuration = 10,
  maxDuration = 30
}) => {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [showPermissionText, setShowPermissionText] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = '';
      }
      
      // Stop any ongoing recording
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      setShowPermissionText(true);
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });
      
      // Create media recorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      // Set up event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        // Create audio blob
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Validate recording length
        if (recordingTime < minDuration) {
          setError(`Recording must be at least ${minDuration} seconds long.`);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        // Set audio blob
        setAudioBlob(blob);
        
        // Pass blob to parent
        onRecordingComplete(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Hide permission text
        setShowPermissionText(false);
      };
      
      // Start recording
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions and try again.');
      setShowPermissionText(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      clearInterval(timerIntervalRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (!audioBlob) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayerRef.current.src = audioUrl;
      
      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioPlayerRef.current.onerror = () => {
        setIsPlaying(false);
        setError('Error playing recording.');
        URL.revokeObjectURL(audioUrl);
      };
      
      audioPlayerRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error playing audio:', err);
          setError('Unable to play recording.');
        });
    }
  };

  // Delete recording
  const deleteRecording = () => {
    if (isPlaying) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    
    setAudioBlob(null);
    setIsPlaying(false);
    onRecordingDelete();
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start">
          <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Recording interface */}
      <div className="relative bg-gray-50 rounded-lg border border-gray-200 p-4">
        {showPermissionText && (
          <div className="absolute inset-0 z-10 bg-primary-50 rounded-lg p-4 overflow-y-auto">
            <h4 className="text-lg font-semibold text-primary-800 mb-4">
              Please read the following text clearly:
            </h4>
            <p className="text-primary-700 text-sm bg-white p-3 rounded-lg border border-primary-100 mb-4">
              {permissionText}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-red-600 text-sm">
                  Recording: {recordingTime}s / {maxDuration}s
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <SafeIcon icon={FiX} className="w-4 h-4 mr-1.5" />
                Stop
              </button>
            </div>
          </div>
        )}

        {isRecording ? (
          <div className="flex justify-center items-center h-32">
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2">
                <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                  <SafeIcon icon={FiMic} className="w-8 h-8 text-white" />
                </div>
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 * (1 - recordingTime / maxDuration)}
                    className="text-red-300"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold">{recordingTime}s</span>
              <span className="text-xs text-gray-500">Recording in progress...</span>
            </div>
          </div>
        ) : audioBlob ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={playRecording}
                className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors mr-4"
              >
                <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-6 h-6" />
              </button>
              <div>
                <div className="text-sm font-medium text-gray-900">Voice Recording</div>
                <div className="text-xs text-gray-500">
                  {recordingTime} seconds • {(audioBlob.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <button
              onClick={deleteRecording}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete recording"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <button
              onClick={startRecording}
              disabled={isDisabled}
              className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <SafeIcon icon={FiMic} className="w-10 h-10" />
            </button>
          </div>
        )}

        {/* Recording visualization when playing */}
        {isPlaying && (
          <div className="mt-4 flex items-center justify-center space-x-1">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary-400 rounded-full"
                animate={{
                  height: [4, 12, 8, 16, 10, 18, 6, 14, 4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.07,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && !audioBlob && (
        <p className="text-xs text-gray-500 text-center">
          Click the microphone to start recording. Speak clearly for {minDuration}-{maxDuration} seconds.
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;