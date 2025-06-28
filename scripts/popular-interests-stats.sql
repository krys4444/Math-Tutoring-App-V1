-- Get popular interests statistics
SELECT 
    interest_name,
    COUNT(*) as user_count,
    COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT user_id) FROM user_interests) as percentage
FROM user_interests
GROUP BY interest_name
ORDER BY user_count DESC
LIMIT 20;

-- Get interests by creation date
SELECT 
    DATE(created_at) as date,
    COUNT(*) as interests_added
FROM user_interests
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;

-- Get user engagement stats
SELECT 
    COUNT(DISTINCT user_id) as total_users_with_interests,
    AVG(interest_count) as avg_interests_per_user,
    MAX(interest_count) as max_interests_per_user
FROM (
    SELECT 
        user_id,
        COUNT(*) as interest_count
    FROM user_interests
    GROUP BY user_id
) user_stats;
