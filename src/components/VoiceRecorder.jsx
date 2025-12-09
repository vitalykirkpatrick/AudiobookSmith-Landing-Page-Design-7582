import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic, FiPlay, FiPause, FiX, FiTrash2 } = FiIcons;

const VoiceRecorder = ({
  onRecordingComplete,
  onRecordingDelete,
  permissionText,
  isDisabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayer = useRef(new Audio());
  const timerInterval = useRef(null);

  const maxRecordingTime = 30; // seconds

  useEffect(() => {
    return () => {
      clearInterval(timerInterval.current);
      if (audioPlayer.current) {
        audioPlayer.current.pause();
        audioPlayer.current.src = '';
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        onRecordingComplete(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxRecordingTime) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      clearInterval(timerInterval.current);
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (!audioBlob) return;

    if (isPlaying) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioPlayer.current.src = URL.createObjectURL(audioBlob);
      audioPlayer.current.play();
      setIsPlaying(true);

      audioPlayer.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setIsPlaying(false);
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.src = '';
    }
    onRecordingDelete();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
          <SafeIcon icon={FiX} className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Recording Interface */}
      <div className="relative">
        {isRecording ? (
          <div className="bg-white rounded-lg p-6 border-2 border-primary-500">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Please read the following text clearly:
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {permissionText}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-red-500 font-medium">
                  Recording: {recordingTime}s / {maxRecordingTime}s
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
                Stop Recording
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={startRecording}
              disabled={isDisabled || isPlaying}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isDisabled
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              <SafeIcon icon={FiMic} className="w-12 h-12 text-white" />
            </button>
            <p className="mt-2 text-gray-600">
              {isDisabled
                ? 'Recording disabled while file is uploaded'
                : 'Click to start recording'}
            </p>
          </div>
        )}
      </div>

      {/* Recording Playback */}
      {audioBlob && !isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <button
              onClick={playRecording}
              className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
            >
              <SafeIcon
                icon={isPlaying ? FiPause : FiPlay}
                className="w-5 h-5"
              />
            </button>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                Voice Recording
              </div>
              <div className="text-xs text-gray-500">
                {(audioBlob.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>

          <button
            onClick={deleteRecording}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
            title="Delete recording"
          >
            <SafeIcon icon={FiTrash2} className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceRecorder;