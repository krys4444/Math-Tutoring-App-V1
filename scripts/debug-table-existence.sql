-- First, let's check if the table exists at all
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'user_interests'
) as table_exists;

-- Check if tables exist
SELECT 
    table_name,
    table_type,
    is_insertable_into,
    is_typed
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_interests', 'grades', 'user_grade');

-- Check columns for each table
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('user_interests', 'grades', 'user_grade')
ORDER BY table_name, ordinal_position;
