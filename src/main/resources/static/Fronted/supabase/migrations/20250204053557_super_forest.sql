/*
  # Initial Schema for TechCirculo

  1. New Tables
    - users
      - Extended user profile data
      - Stores role, interests, and other user-specific information
    - communities
      - Community information and metadata
      - Tracks member count and topics
    - posts
      - Discussion forum posts
      - Includes voting system
    - community_members
      - Tracks community membership
    - user_interests
      - Many-to-many relationship between users and interests

  2. Security
    - RLS policies for all tables
    - Role-based access control
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'alumni');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  topics text[] DEFAULT '{}',
  member_count int DEFAULT 0
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES users(id) NOT NULL,
  community_id uuid REFERENCES communities(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  upvotes int DEFAULT 0,
  downvotes int DEFAULT 0
);

-- Create community members table
CREATE TABLE IF NOT EXISTS community_members (
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (community_id, user_id)
);

-- Create interests table
CREATE TABLE IF NOT EXISTS interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user interests table
CREATE TABLE IF NOT EXISTS user_interests (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  interest_id uuid REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read all users
CREATE POLICY "Users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Anyone can read communities
CREATE POLICY "Anyone can read communities"
  ON communities
  FOR SELECT
  TO authenticated
  USING (true);

-- Community creators can update their communities
CREATE POLICY "Creators can update communities"
  ON communities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Anyone can read posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Authors can update their posts
CREATE POLICY "Authors can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Insert initial interests
INSERT INTO interests (name) VALUES
  ('Web Development'),
  ('Mobile Development'),
  ('AI/ML'),
  ('Cybersecurity'),
  ('Cloud Computing'),
  ('DevOps'),
  ('Data Science'),
  ('Blockchain'),
  ('IoT'),
  ('UI/UX Design')
ON CONFLICT DO NOTHING;