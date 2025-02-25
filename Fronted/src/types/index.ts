export type UserRole = 'student' | 'teacher' | 'alumni';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  interests: string[];
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  topics: string[];
  member_count: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  community_id: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
}