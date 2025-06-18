-- Function to save user interests (replaces all existing interests)
CREATE OR REPLACE FUNCTION save_user_interests(interests JSONB)
RETURNS VOID AS $$
BEGIN
  -- Delete existing interests for the user
  DELETE FROM user_interests WHERE user_id = auth.uid();
  
  -- Insert new interests
  INSERT INTO user_interests (user_id, interest_id, interest_name)
  SELECT 
    auth.uid(),
    (interest->>'id')::TEXT,
    (interest->>'name')::TEXT
  FROM jsonb_array_elements(interests) AS interest;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user interests
CREATE OR REPLACE FUNCTION get_user_interests()
RETURNS TABLE(interest_id TEXT, interest_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ui.interest_id, ui.interest_name
  FROM user_interests ui
  WHERE ui.user_id = auth.uid()
  ORDER BY ui.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
