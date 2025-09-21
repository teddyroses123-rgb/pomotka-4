import { createClient } from '@supabase/supabase-js';
import { SiteContent } from '../types/content';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables not found');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const saveContentToDatabase = async (content: SiteContent): Promise<boolean> => {
  try {
    console.log('🔄 ПОПЫТКА СОХРАНЕНИЯ В БД...');
    
    const response = await fetch(`${supabaseUrl}/functions/v1/save-content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        adminSecret: 'podmotka1122_admin_secret' // Default admin secret
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ОШИБКА СОХРАНЕНИЯ В БД:', errorText);
      return false;
    }

    const result = await response.json();
    console.log('✅ КОНТЕНТ УСПЕШНО СОХРАНЕН В БАЗУ ДАННЫХ!', result);
    return true;
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА СОХРАНЕНИЯ В БД:', error);
    return false;
  }
};

export const loadContentFromDatabase = async (): Promise<SiteContent | null> => {
  try {
    console.log('🔄 ЗАГРУЗКА ИЗ БД...');
    
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'main')
      .single();

    if (error) {
      console.error('❌ ОШИБКА ЗАГРУЗКИ ИЗ БД:', error);
      return null;
    }

    if (data && data.content) {
      console.log('✅ КОНТЕНТ УСПЕШНО ЗАГРУЖЕН ИЗ БД');
      return data.content as SiteContent;
    }

    console.log('⚠️ НЕТ ДАННЫХ В БД');
    return null;
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ЗАГРУЗКИ ИЗ БД:', error);
    return null;
  }
};