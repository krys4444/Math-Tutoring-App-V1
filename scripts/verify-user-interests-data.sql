-- Check if the user_interests table exists and view its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_interests'
ORDER BY ordinal_position;
