-- Let's test if we can insert data manually (this will help us debug)
-- First, let's see what users exist
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
