-- Create users table for AudiobookSmith
CREATE TABLE IF NOT EXISTS users_audiobooksmith (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  book_title TEXT,
  book_genre TEXT,
  word_count TEXT,
  plan TEXT NOT NULL,
  sample_text TEXT,
  requirements TEXT,
  preferred_voice TEXT,
  payment_status TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE users_audiobooksmith ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users_audiobooksmith 
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');
  
CREATE POLICY "Users can update their own data" ON users_audiobooksmith 
  FOR UPDATE USING (auth.uid() = id OR auth.role() = 'service_role');
  
CREATE POLICY "Users can insert their data" ON users_audiobooksmith 
  FOR INSERT WITH CHECK (true);

-- Create audiobooks table for tracking user audiobooks
CREATE TABLE IF NOT EXISTS audiobooks_audiobooksmith (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_audiobooksmith(id) NOT NULL,
  book_title TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE audiobooks_audiobooksmith ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own audiobooks" ON audiobooks_audiobooksmith 
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
  
CREATE POLICY "Service can insert audiobooks" ON audiobooks_audiobooksmith 
  FOR INSERT WITH CHECK (true);