-- Chạy SQL này trong Supabase SQL Editor

-- Bảng lưu lời chúc
create table if not exists blessings (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Ẩn danh',
  message text not null,
  created_at timestamptz not null default now()
);

-- Bảng lưu xác nhận tham dự
create table if not exists rsvp (
  id uuid primary key default gen_random_uuid(),
  name text,
  attending boolean not null,
  attendee_count integer not null default 1,
  created_at timestamptz not null default now()
);

-- Cho phép insert và select công khai (hoặc chỉ dùng service role key)
-- Nếu dùng service role key thì không cần RLS
alter table blessings enable row level security;
alter table rsvp enable row level security;

-- Policy cho phép insert từ server (service role bypass RLS)
-- Nếu dùng anon key thì cần thêm policy:
-- create policy "allow insert blessings" on blessings for insert with check (true);
-- create policy "allow select blessings" on blessings for select using (true);
-- create policy "allow insert rsvp" on rsvp for insert with check (true);
