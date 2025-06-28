-- Create user_grade table to store user's grade selection
CREATE TABLE IF NOT EXISTS public.user_grade (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    grade_id INTEGER NOT NULL REFERENCES public.grades(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_grade ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own grade" ON public.user_grade
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grade" ON public.user_grade
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grade" ON public.user_grade
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_grade_updated_at 
    BEFORE UPDATE ON public.user_grade 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
