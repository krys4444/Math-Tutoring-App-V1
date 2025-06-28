-- Verify the grade table structure and data
SELECT 'Grade table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'grade'
ORDER BY ordinal_position;

SELECT 'Grade table data:' as info;
SELECT * FROM grade ORDER BY grade_id;

-- Verify the user_grade table structure
SELECT 'User_grade table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_grade'
ORDER BY ordinal_position;

-- Check if any users have grades assigned
SELECT 'Current user grade assignments:' as info;
SELECT 
    ug.user_id,
    ug.grade_id,
    g.grade,
    ug.created_at
FROM user_grade ug
JOIN grade g ON ug.grade_id = g.grade_id
ORDER BY ug.created_at DESC;
