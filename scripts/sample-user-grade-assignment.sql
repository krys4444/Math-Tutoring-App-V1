-- Sample script to assign a grade to the current authenticated user
-- This is just an example - in practice, users would select their grade through the UI

-- First, let's see what users exist (for reference)
SELECT 'Available users:' as info;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Example: Assign grade 10 (grade_id = 2) to the current authenticated user
-- Note: This will only work if you're authenticated in Supabase
-- In the actual app, this would be done through a form where users select their grade

-- Uncomment the line below to test (only if you're authenticated):
-- INSERT INTO user_grade (user_id, grade_id) VALUES (auth.uid(), 2) ON CONFLICT (user_id) DO UPDATE SET grade_id = 2, updated_at = NOW();

SELECT 'Sample assignment script ready - uncomment the INSERT line to test' as status;
