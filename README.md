# AudiobookSmith - AI Audiobook Generator

AudiobookSmith is a professional AI-powered platform that allows authors, educators, and publishers to create high-quality audiobooks without the traditional barriers of cost, complexity, or technical expertise.

## 🔥 Features

- **AI Voice Generation**: Create professional-quality audiobooks with natural-sounding AI voices
- **Voice Cloning**: Clone your own voice or choose from our library of professional voices
- **One-time Payment**: No subscriptions or royalty splits - you own 100% of your audiobook
- **Cloud-based**: Access your projects anywhere, make edits anytime
- **Multiple Formats**: Export in MP3, M4B, and WAV formats
- **Commercial License**: Use your audiobooks commercially on platforms like Audible, Apple Books, and Spotify

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/audiobooksmith.git
cd audiobooksmith
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### GitHub Upload

To upload your project to GitHub, run:

```bash
npm run github
```

Make sure to update the `github-upload.js` file with your GitHub username and email first.

## 🏗️ Project Structure

```
audiobooksmith/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── sections/    # Page sections
│   │   └── ui/          # UI components
│   ├── common/          # Common utilities and components
│   ├── lib/             # External library integrations
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── supabase/            # Supabase migrations
└── ...
```

## 💻 Technology Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Routing**: React Router
- **Backend**: Supabase
- **APIs**: Voice Cloning APIs, Stripe integration
- **Build Tool**: Vite

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Voice API Configuration
REACT_APP_VOICE_API_KEY=your_voice_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any inquiries, please reach out to support@audiobooksmith.com