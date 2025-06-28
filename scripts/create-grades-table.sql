-- Create grades table with Ontario grade levels
CREATE TABLE IF NOT EXISTS public.grades (
    id SERIAL PRIMARY KEY,
    grade_name VARCHAR(50) NOT NULL UNIQUE,
    grade_level INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Ontario grade levels
INSERT INTO public.grades (grade_name, grade_level, description) VALUES
('Grade 9', 9, 'Grade 9 - Applied and Academic Mathematics'),
('Grade 10', 10, 'Grade 10 - Applied and Academic Mathematics'),
('Grade 11', 11, 'Grade 11 - Functions and Applications'),
('Grade 12', 12, 'Grade 12 - Advanced Functions and Calculus')
ON CONFLICT (grade_name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read grades
CREATE POLICY "Allow all users to read grades" ON public.grades
    FOR SELECT USING (true);
