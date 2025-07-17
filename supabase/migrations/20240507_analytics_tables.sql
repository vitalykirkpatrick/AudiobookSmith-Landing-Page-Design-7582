-- Create analytics tables for AudiobookSmith

-- User events table
CREATE TABLE IF NOT EXISTS user_events_audiobooksmith (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users_audiobooksmith(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project events table
CREATE TABLE IF NOT EXISTS project_events_audiobooksmith (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  project_id UUID,
  user_id UUID REFERENCES users_audiobooksmith(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue events table
CREATE TABLE IF NOT EXISTS revenue_events_audiobooksmith (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  user_id UUID REFERENCES users_audiobooksmith(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics summary table
CREATE TABLE IF NOT EXISTS analytics_audiobooksmith (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_range TEXT NOT NULL,
  total_users INTEGER,
  active_users INTEGER,
  user_growth DECIMAL(5,2),
  retention_rate DECIMAL(5,2),
  total_revenue DECIMAL(10,2),
  revenue_growth DECIMAL(5,2),
  avg_order_value DECIMAL(10,2),
  recurring_revenue DECIMAL(10,2),
  total_projects INTEGER,
  project_growth DECIMAL(5,2),
  avg_processing_time DECIMAL(5,2),
  completion_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events_audiobooksmith(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events_audiobooksmith(created_at);
CREATE INDEX IF NOT EXISTS idx_project_events_type ON project_events_audiobooksmith(event_type);
CREATE INDEX IF NOT EXISTS idx_project_events_created ON project_events_audiobooksmith(created_at);
CREATE INDEX IF NOT EXISTS idx_revenue_events_type ON revenue_events_audiobooksmith(event_type);
CREATE INDEX IF NOT EXISTS idx_revenue_events_created ON revenue_events_audiobooksmith(created_at);

-- Enable RLS
ALTER TABLE user_events_audiobooksmith ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_events_audiobooksmith ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events_audiobooksmith ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_audiobooksmith ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Service role can manage analytics" ON analytics_audiobooksmith
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage events" ON user_events_audiobooksmith
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage project events" ON project_events_audiobooksmith
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage revenue events" ON revenue_events_audiobooksmith
  FOR ALL USING (auth.role() = 'service_role');