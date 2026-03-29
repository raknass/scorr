-- Subjects (AP Physics 1, AP Chemistry etc)
create table subjects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  ap_exam_date date,
  total_units int default 0,
  created_at timestamptz default now()
);

-- Units (Unit 1: Kinematics etc)
create table units (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects(id) on delete cascade,
  title text not null,
  description text,
  order_num int not null,
  total_lessons int default 0,
  created_at timestamptz default now()
);

-- Lessons
create table lessons (
  id uuid default gen_random_uuid() primary key,
  unit_id uuid references units(id) on delete cascade,
  title text not null,
  ap_topic text,
  concept_note text,
  sim_type text,
  estimated_minutes int default 15,
  xp_reward int default 20,
  order_num int not null,
  created_at timestamptz default now()
);

-- Problems
create table problems (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references lessons(id) on delete cascade,
  question text not null,
  options jsonb,
  correct_index int not null,
  explanation text,
  difficulty int default 1 check (difficulty between 1 and 3),
  concept text,
  created_at timestamptz default now()
);

-- User profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) primary key,
  name text,
  email text,
  plan text default 'free',
  stripe_customer_id text,
  subjects text[] default '{}',
  created_at timestamptz default now()
);

-- Student progress per lesson
create table progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  completed boolean default false,
  score int default 0,
  attempts int default 0,
  xp_earned int default 0,
  weak_concepts text[] default '{}',
  last_seen timestamptz default now(),
  unique(user_id, lesson_id)
);

-- AI chat history per session
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  messages jsonb default '[]',
  created_at timestamptz default now()
);

-- Daily AI usage (for rate limiting)
create table ai_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  date date default current_date,
  question_count int default 0,
  unique(user_id, date)
);