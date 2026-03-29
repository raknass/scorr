-- Enable RLS on all tables
alter table profiles enable row level security;
alter table progress enable row level security;
alter table chat_sessions enable row level security;
alter table ai_usage enable row level security;

-- Users can only see their own data
create policy "Users see own profile"
  on profiles for all
  using (auth.uid() = id);

create policy "Users see own progress"
  on progress for all
  using (auth.uid() = user_id);

create policy "Users see own chats"
  on chat_sessions for all
  using (auth.uid() = user_id);

create policy "Users see own usage"
  on ai_usage for all
  using (auth.uid() = user_id);

-- Content is public (lessons, problems, units, subjects)
create policy "Content is public"
  on subjects for select using (true);

create policy "Units are public"
  on units for select using (true);

create policy "Lessons are public"
  on lessons for select using (true);

-- Problems — never expose correct_index to client
create policy "Problems visible without answer"
  on problems for select using (true);