```jsx
// Add at the top of the file
const voicePermissionScript = `I, [Your Name], hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties or used for any other commercial purposes without my explicit consent. I confirm that I am the rightful owner of this voice recording and have the authority to grant this permission.`;

// Update the recording UI section
{isRecording ? (
  <div className="absolute inset-0 bg-primary-50 dark:bg-primary-900/50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">
      Please read the following text:
    </h4>
    <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
      {voicePermissionScript}
    </p>
  </div>
) : null}

// Add theme support to the main container
<div className={`min-h-screen ${
  isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'
}`}>

// Update the scroll to pricing function
const scrollToPricing = () => {
  const pricingElement = document.getElementById('pricing');
  if (pricingElement) {
    pricingElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = '/#pricing';
  }
};
```