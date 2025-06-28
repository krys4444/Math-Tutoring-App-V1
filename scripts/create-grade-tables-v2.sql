-- Create the grade table first
CREATE TABLE IF NOT EXISTS grade (
  grade_id INTEGER PRIMARY KEY,
  grade INTEGER NOT NULL UNIQUE
);

-- Insert the grade data
INSERT INTO grade (grade_id, grade) VALUES 
(1, 9),
(2, 10),
(3, 11),
(4, 12)
ON CONFLICT (grade_id) DO NOTHING;

-- Create the user_grade table
CREATE TABLE IF NOT EXISTS user_grade (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  grade_id INTEGER REFERENCES grade(grade_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- Each user can only have one grade
);

-- Enable Row Level Security on both tables
ALTER TABLE grade ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_grade ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to grades" ON grade;
DROP POLICY IF EXISTS "Users can view their own grade" ON user_grade;
DROP POLICY IF EXISTS "Users can insert their own grade" ON user_grade;
DROP POLICY IF EXISTS "Users can update their own grade" ON user_grade;
DROP POLICY IF EXISTS "Users can delete their own grade" ON user_grade;

-- Create policies for grade table (public read access)
CREATE POLICY "Allow public read access to grades" ON grade
  FOR SELECT USING (true);

-- Create policies for user_grade table (users can only access their own grade)
CREATE POLICY "Users can view their own grade" ON user_grade
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grade" ON user_grade
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grade" ON user_grade
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grade" ON user_grade
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_grade_user_id ON user_grade(user_id);
CREATE INDEX IF NOT EXISTS idx_user_grade_grade_id ON user_grade(grade_id);

-- Confirm tables were created successfully
SELECT 'Grade tables created successfully with the following data:' as status;
SELECT 'Grade table:' as table_name, grade_id, grade FROM grade ORDER BY grade_id;
