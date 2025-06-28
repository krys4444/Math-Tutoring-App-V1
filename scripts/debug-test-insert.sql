-- Let's test if we can insert data manually (this will help us debug)
-- First, let's see what users exist
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Test insert into user_interests (replace with actual user ID)
-- First, get current user ID
SELECT auth.uid() as current_user_id;

-- Test insert (only works if you're authenticated)
INSERT INTO public.user_interests (user_id, interest_name) 
VALUES (auth.uid(), 'Test Interest')
ON CONFLICT (user_id, interest_name) DO NOTHING;

-- Check if insert worked
SELECT * FROM public.user_interests WHERE user_id = auth.uid();

-- Clean up test data
DELETE FROM public.user_interests 
WHERE user_id = auth.uid() AND interest_name = 'Test Interest';
