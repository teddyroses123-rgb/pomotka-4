/*
  # Create backgrounds table for storing gradient backgrounds

  1. New Tables
    - `backgrounds`
      - `id` (text, primary key)
      - `name` (text, название фона)
      - `css_value` (text, CSS значение градиента)
      - `preview_color` (text, цвет для превью)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `backgrounds` table
    - Add policy for public read access
    - Add policy for authenticated users to manage backgrounds

  3. Initial Data
    - Insert default gradient backgrounds
*/

CREATE TABLE IF NOT EXISTS backgrounds (
  id text PRIMARY KEY,
  name text NOT NULL,
  css_value text NOT NULL,
  preview_color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE backgrounds ENABLE ROW LEVEL SECURITY;

-- Public read access for backgrounds
CREATE POLICY "Public read access for backgrounds"
  ON backgrounds
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can manage backgrounds
CREATE POLICY "Authenticated users can manage backgrounds"
  ON backgrounds
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default gradient backgrounds
INSERT INTO backgrounds (id, name, css_value, preview_color) VALUES
  ('gradient-teal', 'Бирюзовый градиент', 'radial-gradient(circle at center, #14b8a6 0%, #0f766e 50%, #134e4a 100%)', '#14b8a6'),
  ('gradient-green', 'Зеленый градиент', 'radial-gradient(circle at center, #22c55e 0%, #16a34a 50%, #15803d 100%)', '#22c55e'),
  ('gradient-orange', 'Оранжево-коричневый градиент', 'radial-gradient(circle at center, #ea580c 0%, #c2410c 50%, #9a3412 100%)', '#ea580c'),
  ('gradient-purple', 'Фиолетовый градиент', 'radial-gradient(circle at center, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)', '#8b5cf6'),
  ('gradient-blue', 'Синий градиент', 'radial-gradient(circle at center, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)', '#3b82f6'),
  ('gradient-pink', 'Розовый градиент', 'radial-gradient(circle at center, #ec4899 0%, #db2777 50%, #be185d 100%)', '#ec4899')
ON CONFLICT (id) DO NOTHING;