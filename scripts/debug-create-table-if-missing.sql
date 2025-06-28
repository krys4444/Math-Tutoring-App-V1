-- Create user_interests table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_interests') THEN
        CREATE TABLE public.user_interests (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            interest_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own interests" ON public.user_interests
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert their own interests" ON public.user_interests
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete their own interests" ON public.user_interests
            FOR DELETE USING (auth.uid() = user_id);
            
        RAISE NOTICE 'user_interests table created successfully';
    ELSE
        RAISE NOTICE 'user_interests table already exists';
    END IF;
END $$;
