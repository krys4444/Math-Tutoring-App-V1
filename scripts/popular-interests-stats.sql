-- See which interests are most popular
SELECT 
    interest_name,
    COUNT(*) as user_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT user_id) FROM user_interests), 2) as percentage
FROM user_interests
GROUP BY interest_name
ORDER BY user_count DESC;
