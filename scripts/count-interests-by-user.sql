-- Count how many interests each user has
SELECT 
    au.email as user_email,
    COUNT(ui.interest_id) as total_interests,
    STRING_AGG(ui.interest_name, ', ') as interests_list
FROM auth.users au
LEFT JOIN user_interests ui ON au.id = ui.user_id
GROUP BY au.id, au.email
ORDER BY total_interests DESC;
