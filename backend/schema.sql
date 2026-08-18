CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL CHECK (plan IN ('daily','weekly','monthly')),
  status TEXT NOT NULL CHECK (status IN ('active','expired','cancelled','pending')),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  provider_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE watch_progress (
  user_id UUID NOT NULL REFERENCES users(id),
  episode_id TEXT NOT NULL,
  seconds_watched INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, episode_id)
);

CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES users(id),
  series_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, series_id)
);

CREATE TABLE ad_unlocks (
  user_id UUID NOT NULL REFERENCES users(id),
  episode_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, episode_id)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  status TEXT NOT NULL CHECK (status IN ('pending','paid','failed','refunded')),
  provider_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_status_idx ON subscriptions(user_id, status);
CREATE INDEX watch_progress_updated_idx ON watch_progress(user_id, updated_at DESC);
