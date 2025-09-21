/*
  # Update RLS policies for site_content table

  1. Security
    - Drop existing policies
    - Create new policy allowing public read access
    - Service role will bypass RLS for writes through Edge Function
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read site content" ON site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON site_content;

-- Allow public read access
CREATE POLICY "Public read access"
  ON site_content
  FOR SELECT
  TO public
  USING (true);

-- Note: Write operations will be handled by Edge Function with service_role key