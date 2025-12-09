// Airtable Integration Utility
// Replace with your actual Airtable configuration

const AIRTABLE_CONFIG = {
  baseId: 'YOUR_AIRTABLE_BASE_ID',
  tableId: 'YOUR_TABLE_ID',
  apiKey: 'YOUR_AIRTABLE_API_KEY', // Use environment variables in production
  webhookUrl: 'YOUR_AIRTABLE_WEBHOOK_URL' // Optional: for webhook integration
};

export const submitToAirtable = async (formData) => {
  try {
    // Prepare data for Airtable
    const airtableData = {
      fields: {
        'Name': formData.name,
        'Email': formData.email,
        'Book Title': formData.bookTitle,
        'Genre': formData.bookGenre,
        'Word Count': formData.wordCount,
        'Preferred Voice': formData.preferredVoice,
        'Plan': formData.budget,
        'Content Type': formData.contentType,
        'Sample Text': formData.sampleText || '',
        'Requirements': formData.requirements,
        'Deadline': formData.deadline,
        'Voice Cloning': formData.voiceCloning ? 'Yes' : 'No',
        'Voice Validated': formData.voiceValidated ? 'Yes' : 'No',
        'Transcribed Text': formData.transcribedText || '',
        'Submission Date': new Date().toISOString(),
        'Status': 'New Submission'
      }
    };

    // Method 1: Direct Airtable API (requires API key)
    if (AIRTABLE_CONFIG.apiKey && AIRTABLE_CONFIG.baseId) {
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit to Airtable');
      }

      const result = await response.json();
      return result;
    }

    // Method 2: Webhook (recommended for security)
    if (AIRTABLE_CONFIG.webhookUrl) {
      const response = await fetch(AIRTABLE_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData.fields)
      });

      if (!response.ok) {
        throw new Error('Failed to submit via webhook');
      }

      return await response.json();
    }

    throw new Error('No Airtable configuration found');

  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw error;
  }
};

// Google Sheets Integration (Alternative)
export const submitToGoogleSheets = async (formData) => {
  try {
    // Replace with your Google Sheets Web App URL
    const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL';

    const sheetsData = {
      name: formData.name,
      email: formData.email,
      bookTitle: formData.bookTitle,
      genre: formData.bookGenre,
      wordCount: formData.wordCount,
      preferredVoice: formData.preferredVoice,
      plan: formData.budget,
      contentType: formData.contentType,
      sampleText: formData.sampleText || '',
      requirements: formData.requirements,
      deadline: formData.deadline,
      voiceCloning: formData.voiceCloning,
      voiceValidated: formData.voiceValidated,
      transcribedText: formData.transcribedText || '',
      submissionDate: new Date().toISOString(),
      status: 'New Submission'
    };

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sheetsData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit to Google Sheets');
    }

    return await response.json();

  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
};

// File Upload to AWS S3 or Google Drive
export const uploadFileToStorage = async (file, folder = 'uploads') => {
  try {
    // This is a mock implementation
    // Replace with your actual file upload logic

    // For AWS S3:
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('folder', folder);
    // 
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData
    // });

    // For Google Drive:
    // Use Google Drive API to upload files

    // Mock response
    const mockUrl = `https://storage.example.com/${folder}/${Date.now()}-${file.name}`;
    
    return {
      success: true,
      url: mockUrl,
      filename: file.name,
      size: file.size,
      uploadDate: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Voice transcription service integration
export const transcribeAudio = async (audioFile) => {
  try {
    // This would integrate with a speech-to-text service like:
    // - Google Cloud Speech-to-Text
    // - AWS Transcribe
    // - Azure Speech Services
    // - AssemblyAI

    const formData = new FormData();
    formData.append('audio', audioFile);

    // Mock implementation
    // Replace with actual transcription service
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const result = await response.json();
    return result.transcription;

  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

// Voice validation function
export const validateVoicePermission = (transcribedText, requiredText) => {
  // Simple validation - in production, you'd use more sophisticated matching
  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const normalizedTranscription = normalizeText(transcribedText);
  const normalizedRequired = normalizeText(requiredText);

  // Check for key phrases
  const keyPhrases = [
    'hereby grant audiobooksmith permission',
    'voice recording',
    'ai voice model',
    'manuscript',
    'audiobook',
    'rightful owner'
  ];

  const matchedPhrases = keyPhrases.filter(phrase => 
    normalizedTranscription.includes(phrase)
  );

  // Require at least 4 out of 6 key phrases to be present
  const isValid = matchedPhrases.length >= 4;

  return {
    isValid,
    matchedPhrases,
    confidence: (matchedPhrases.length / keyPhrases.length) * 100
  };
};