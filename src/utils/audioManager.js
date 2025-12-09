// Audio Manager for handling multiple audio playback
class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.currentButton = null;
  }

  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentButton) {
        this.currentButton.dataset.playing = 'false';
      }
    }
  }

  playAudio(audioUrl, button) {
    // Stop current audio if playing
    this.stopCurrentAudio();

    // Create new audio instance
    const audio = new Audio(audioUrl);
    
    // Update current audio and button
    this.currentAudio = audio;
    this.currentButton = button;
    
    // Set button state
    button.dataset.playing = 'true';

    // Play audio
    audio.play();

    // Handle audio end
    audio.onended = () => {
      button.dataset.playing = 'false';
      this.currentAudio = null;
      this.currentButton = null;
    };

    // Handle errors
    audio.onerror = () => {
      console.error('Error playing audio:', audioUrl);
      button.dataset.playing = 'false';
      this.currentAudio = null;
      this.currentButton = null;
    };
  }

  togglePlay(audioUrl, button) {
    if (button.dataset.playing === 'true') {
      this.stopCurrentAudio();
    } else {
      this.playAudio(audioUrl, button);
    }
  }
}

export const audioManager = new AudioManager();