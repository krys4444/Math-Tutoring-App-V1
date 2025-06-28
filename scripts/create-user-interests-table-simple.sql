-- Simple user interests table creation
CREATE TABLE IF NOT EXISTS public.user_interests (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interest_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interests" ON public.user_interests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interests" ON public.user_interests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests" ON public.user_interests
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_created_at ON public.user_interests(created_at);
