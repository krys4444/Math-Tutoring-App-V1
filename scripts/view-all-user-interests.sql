-- View all user interests with user information
SELECT 
    ui.id,
    ui.interest_name,
    ui.created_at,
    u.email,
    u.created_at as user_created_at
FROM public.user_interests ui
JOIN auth.users u ON ui.user_id = u.id
ORDER BY ui.created_at DESC;

-- Summary by user
SELECT 
    u.email,
    COUNT(ui.id) as interest_count,
    STRING_AGG(ui.interest_name, ', ' ORDER BY ui.created_at) as interests
FROM auth.users u
LEFT JOIN public.user_interests ui ON u.id = ui.user_id
GROUP BY u.id, u.email
ORDER BY interest_count DESC;
