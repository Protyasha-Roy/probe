-- Drop existing policies and table
drop policy if exists "Anyone can submit feedback" on feedback_messages;
drop policy if exists "Users can view their own feedback" on feedback_messages;
drop policy if exists "Admins can update feedback status" on feedback_messages;
drop table if exists public.feedback_messages;

-- Create feedback_messages table
create table public.feedback_messages (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.user_profiles(id) null,
    name text not null,
    email text not null,
    message text not null,
    status text default 'unread' check (status in ('unread', 'read', 'responded')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    responded_at timestamp with time zone
);

-- Enable RLS
alter table public.feedback_messages enable row level security;

-- Create simple policies
create policy "Enable insert access for all users"
    on public.feedback_messages
    for insert
    to public
    with check (true);

create policy "Enable read access for admins"
    on public.feedback_messages
    for select
    to authenticated
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Enable update access for admins"
    on public.feedback_messages
    for update
    to authenticated
    using (
        exists (
            select 1 from public.user_profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Grant necessary permissions
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant insert on public.feedback_messages to anon;
grant insert on public.feedback_messages to authenticated;
grant select, update on public.feedback_messages to authenticated;
  