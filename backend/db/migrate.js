const db = require('../config/database');

const migrations = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invalidated tokens table (for logout)
CREATE TABLE IF NOT EXISTS invalidated_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invalidated_tokens_token_hash ON invalidated_tokens(token_hash);

-- Media cache table
CREATE TABLE IF NOT EXISTS media_cache (
  id SERIAL PRIMARY KEY,
  anilist_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('anime', 'manga')),
  title JSONB NOT NULL,
  synopsis TEXT,
  genres TEXT[],
  tags JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(anilist_id, media_type)
);

CREATE INDEX IF NOT EXISTS idx_media_cache_anilist_id ON media_cache(anilist_id);
CREATE INDEX IF NOT EXISTS idx_media_cache_type ON media_cache(media_type);
CREATE INDEX IF NOT EXISTS idx_media_cache_title ON media_cache USING gin(title jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_media_cache_genres ON media_cache USING gin(genres);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source_media_id INTEGER NOT NULL,
  target_media_id INTEGER NOT NULL,
  vote_type VARCHAR(4) NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_media_id);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public) WHERE is_public = true;

-- Collection items table
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('anime', 'manga')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, media_id, media_type)
);

CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('anime', 'manga')),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_media ON reviews(media_id, media_type);
`;

async function migrate() {
  console.log('Running database migrations...');
  try {
    const statements = migrations.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await db.query(stmt);
      }
    }
    console.log('All migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

migrate();
