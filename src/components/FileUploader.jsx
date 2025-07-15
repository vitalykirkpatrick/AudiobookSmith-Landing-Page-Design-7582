import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiX, FiFile, FiTrash2 } = FiIcons;

const FileUploader = ({
  onFileSelect,
  onFileDelete,
  acceptedTypes = 'audio/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  isDisabled = false
}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setError(null);

    // Validate file type
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please upload an audio file (MP3 or WAV)');
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDelete = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileDelete();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
          <SafeIcon icon={FiX} className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDisabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-primary-500 transition-colors'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isDisabled}
          />
          <div className="space-y-3">
            <SafeIcon
              icon={FiUpload}
              className={`w-12 h-12 mx-auto ${
                isDisabled ? 'text-gray-400' : 'text-gray-400'
              }`}
            />
            <div className="text-sm">
              {isDisabled ? (
                <p className="text-gray-500">
                  Upload disabled while recording is active
                </p>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-600 font-medium hover:text-primary-700"
                  >
                    Click to upload
                  </button>
                  <p className="text-gray-500">or drag and drop</p>
                  <p className="text-gray-500">MP3 or WAV up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <SafeIcon icon={FiFile} className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {file.name}
              </div>
              <div className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
            title="Remove file"
          >
            <SafeIcon icon={FiTrash2} className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUploader;