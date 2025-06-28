-- Check if all required tables exist
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_interests', 'grades', 'user_grade')
ORDER BY tablename;

-- Check table structures
\d public.user_interests;
\d public.grades;
\d public.user_grade;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_interests', 'grades', 'user_grade');
