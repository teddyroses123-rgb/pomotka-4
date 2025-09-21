/*
  # Очистка базы данных

  1. Очистка данных
    - Удаляем все записи из site_content
    - Удаляем все записи из content_history
  2. Сброс к начальному состоянию
    - База данных будет пустой
    - Приложение создаст новые записи при первом сохранении
*/

-- Очищаем таблицу с контентом сайта
DELETE FROM site_content WHERE id = 'main';

-- Очищаем историю изменений
DELETE FROM content_history;

-- Сбрасываем счетчик версий (если есть)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'content_version_seq') THEN
    ALTER SEQUENCE content_version_seq RESTART WITH 1;
  END IF;
END $$;