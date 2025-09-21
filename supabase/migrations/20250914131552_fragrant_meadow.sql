/*
  # Создание таблицы для хранения контента сайта

  1. Новые таблицы
    - `site_content`
      - `id` (text, primary key) - идентификатор контента
      - `content` (jsonb) - JSON с контентом сайта
      - `created_at` (timestamp) - время создания
      - `updated_at` (timestamp) - время последнего обновления

  2. Безопасность
    - Включить RLS для таблицы `site_content`
    - Добавить политику для чтения всем пользователям
    - Добавить политику для записи только аутентифицированным пользователям
*/

CREATE TABLE IF NOT EXISTS site_content (
  id text PRIMARY KEY,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Политика для чтения контента (доступно всем)
CREATE POLICY "Anyone can read site content"
  ON site_content
  FOR SELECT
  USING (true);

-- Политика для записи контента (только для аутентифицированных пользователей)
CREATE POLICY "Authenticated users can update site content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Вставляем начальную запись
INSERT INTO site_content (id, content) 
VALUES ('main', '{}') 
ON CONFLICT (id) DO NOTHING;