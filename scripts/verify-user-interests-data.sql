-- Verify user_interests table data and structure
SELECT 
    COUNT(*) as total_interests,
    COUNT(DISTINCT user_id) as unique_users,
    MIN(created_at) as earliest_interest,
    MAX(created_at) as latest_interest
FROM public.user_interests;

-- Check for any data quality issues
SELECT 
    'Empty interest names' as issue,
    COUNT(*) as count
FROM public.user_interests 
WHERE interest_name IS NULL OR TRIM(interest_name) = ''

UNION ALL

SELECT 
    'Duplicate user-interest pairs' as issue,
    COUNT(*) - COUNT(DISTINCT (user_id, interest_name)) as count
FROM public.user_interests;

-- Sample of recent interests
SELECT 
    ui.interest_name,
    ui.created_at,
    u.email
FROM public.user_interests ui
JOIN auth.users u ON ui.user_id = u.id
ORDER BY ui.created_at DESC
LIMIT 10;
