-- Check current user's interests
SELECT 
    ui.id,
    ui.interest_name,
    ui.created_at,
    ui.user_id
FROM user_interests ui
WHERE ui.user_id = auth.uid()
ORDER BY ui.created_at DESC;
