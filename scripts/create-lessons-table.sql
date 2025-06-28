-- Create lessons table if it doesn't exist
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  body_md TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to lessons" ON lessons;
DROP POLICY IF EXISTS "Allow authenticated users to read lessons" ON lessons;

-- Create a policy to allow only authenticated users to read lessons
CREATE POLICY "Allow authenticated users to read lessons" ON lessons
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Optional: Allow authenticated users to insert lessons (for admin functionality)
CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert lessons" ON lessons
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons(topic);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(order_index);

-- Insert sample data for testing (only if it doesn't exist)
INSERT INTO lessons (topic, body_md, title, description, order_index) VALUES 
(
  'Percentages',
  '# Introduction to Percentages

A **percentage** is a way of expressing a number as a fraction of 100. The word "percent" comes from the Latin "per centum," which means "by the hundred."

## Key Concepts

- A percentage is written with the symbol %
- 50% means 50 out of 100, or 50/100, or 0.5
- 100% represents the whole amount
- Percentages can be greater than 100%

## Converting Between Forms

**Fraction to Percentage:**
- Multiply by 100 and add the % symbol
- Example: 3/4 = 0.75 = 75%

**Decimal to Percentage:**
- Multiply by 100 and add the % symbol  
- Example: 0.25 = 25%

**Percentage to Decimal:**
- Divide by 100
- Example: 30% = 30/100 = 0.3

## Real-World Applications

Percentages are used everywhere:
- Sales discounts (20% off)
- Test scores (85% correct)
- Statistics (60% of people prefer...)
- Interest rates (5% annual interest)

## Practice Problems

1. Convert 0.6 to a percentage
2. What is 25% of 80?
3. If you scored 18 out of 20 on a test, what percentage did you get?

*Remember: Understanding percentages is crucial for many real-world situations!*',
  'Introduction to Percentages',
  'Learn the fundamentals of percentages, conversions, and real-world applications',
  1
) ON CONFLICT DO NOTHING;

-- Confirm table was created
SELECT 'Lessons table created successfully with proper authentication' as status;
