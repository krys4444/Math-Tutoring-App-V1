-- Create function to get user interests with metadata
CREATE OR REPLACE FUNCTION get_user_interests_with_stats(user_uuid UUID)
RETURNS TABLE (
    interest_id INTEGER,
    interest_name TEXT,
    created_at TIMESTAMPTZ,
    days_since_added INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ui.id,
        ui.interest_name,
        ui.created_at,
        EXTRACT(DAY FROM NOW() - ui.created_at)::INTEGER as days_since_added
    FROM user_interests ui
    WHERE ui.user_id = user_uuid
    ORDER BY ui.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get popular interests
CREATE OR REPLACE FUNCTION get_popular_interests(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    interest_name TEXT,
    user_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ui.interest_name,
        COUNT(DISTINCT ui.user_id) as user_count
    FROM user_interests ui
    GROUP BY ui.interest_name
    ORDER BY user_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
