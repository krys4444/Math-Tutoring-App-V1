-- View all user interests data
SELECT 
    ui.id,
    ui.user_id,
    ui.interest_id,
    ui.interest_name,
    ui.created_at,
    au.email as user_email
FROM user_interests ui
LEFT JOIN auth.users au ON ui.user_id = au.id
ORDER BY ui.created_at DESC;
