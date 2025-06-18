-- Check interests for the currently authenticated user
-- Note: This will only work if you're authenticated in Supabase
SELECT 
    interest_id,
    interest_name,
    created_at
FROM user_interests 
WHERE user_id = auth.uid()
ORDER BY created_at;
