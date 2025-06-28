-- Count interests by user
SELECT 
    u.email,
    COUNT(ui.id) as interest_count
FROM auth.users u
LEFT JOIN user_interests ui ON u.id = ui.user_id
GROUP BY u.id, u.email
ORDER BY interest_count DESC;
