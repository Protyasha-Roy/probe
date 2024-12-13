-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    role TEXT DEFAULT 'free' CHECK (role IN ('free', 'pro', 'admin')),
    roadmaps_created_count INTEGER DEFAULT 0,
    ai_roadmaps_remaining INTEGER DEFAULT 2,
    custom_roadmaps_remaining INTEGER DEFAULT 2
);

-- Roadmaps
CREATE TABLE public.roadmaps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('ai', 'custom')) NOT NULL,
    privacy TEXT DEFAULT 'private' CHECK (privacy IN ('private', 'public')),
    skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    time_commitment_hours INTEGER,
    learning_style TEXT[] CHECK (learning_style <@ ARRAY['books', 'articles', 'video', 'interactive']),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT false
);

-- Sections
CREATE TABLE public.sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completion_percentage INTEGER DEFAULT 0
);

-- Topics
CREATE TABLE public.topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    parent_topic_id UUID REFERENCES public.topics(id),
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_completed BOOLEAN DEFAULT false
);

-- Resources
CREATE TABLE public.resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT CHECK (type IN ('book', 'article', 'video', 'interactive')) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_completed BOOLEAN DEFAULT false
);

-- Payments
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'BDT',
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT UNIQUE,
    roadmap_type TEXT CHECK (roadmap_type IN ('ai', 'custom')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Analytics Events
CREATE TABLE public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    session_id TEXT,
    page_url TEXT
);

-- Feedback Messages
CREATE TABLE public.feedback_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX idx_sections_roadmap_id ON public.sections(roadmap_id);
CREATE INDEX idx_topics_section_id ON public.topics(section_id);
CREATE INDEX idx_resources_topic_id ON public.resources(topic_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_messages ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Roadmaps Policies
CREATE POLICY "Users can view their own roadmaps and public roadmaps"
    ON public.roadmaps
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR 
        privacy = 'public'
    );

CREATE POLICY "Users can create roadmaps"
    ON public.roadmaps
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps"
    ON public.roadmaps
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps"
    ON public.roadmaps
    FOR DELETE
    USING (auth.uid() = user_id);

-- Triggers for completion tracking
CREATE OR REPLACE FUNCTION update_section_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sections
    SET completion_percentage = (
        SELECT COALESCE(ROUND(AVG(CASE WHEN is_completed THEN 100 ELSE 0 END)), 0)
        FROM topics
        WHERE section_id = NEW.section_id
    )
    WHERE id = NEW.section_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER topic_completion_trigger
AFTER UPDATE OF is_completed ON topics
FOR EACH ROW
EXECUTE FUNCTION update_section_completion();

-- Trigger for updating roadmap completion
CREATE OR REPLACE FUNCTION update_roadmap_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE roadmaps
    SET completion_percentage = (
        SELECT COALESCE(ROUND(AVG(completion_percentage)), 0)
        FROM sections
        WHERE roadmap_id = (
            SELECT roadmap_id 
            FROM sections 
            WHERE id = NEW.id
        )
    )
    WHERE id = (
        SELECT roadmap_id 
        FROM sections 
        WHERE id = NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER section_completion_trigger
AFTER UPDATE OF completion_percentage ON sections
FOR EACH ROW
EXECUTE FUNCTION update_roadmap_completion(); 