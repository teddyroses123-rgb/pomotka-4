import { SiteContent } from '../types/content';
import { defaultContent } from '../data/defaultContent';
import { saveContentToDatabase, loadContentFromDatabase } from './supabase';

let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DELAY = 1000; // 1 секунда задержки

export const saveContent = async (content: SiteContent, immediate: boolean = false): Promise<void> => {
  try {
    console.log('🌐 СОХРАНЕНИЕ В БД...');
    
    if (immediate) {
      // Немедленное сохранение в БД
      const dbSaved = await saveContentToDatabase(content);
      if (dbSaved) {
        console.log('✅ НЕМЕДЛЕННОЕ сохранение в БД успешно');
        window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: true } }));
      } else {
        console.log('❌ ОШИБКА немедленного сохранения в БД');
        window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false } }));
      }
    } else {
      // Отложенное сохранение в БД с debounce
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      saveTimeout = setTimeout(async () => {
        console.log('🌐 ОТЛОЖЕННОЕ сохранение в БД...');
        const dbSaved = await saveContentToDatabase(content);
        if (dbSaved) {
          console.log('✅ ОТЛОЖЕННОЕ сохранение в БД успешно');
          window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: true } }));
        } else {
          console.log('❌ ОШИБКА отложенного сохранения в БД');
          window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false } }));
        }
      }, SAVE_DELAY);
    }
    
  } catch (error) {
    console.error('❌ Error in saveContent:', error);
    try {
      window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false, error: error.message } }));
    } catch (localError) {
      console.error('🆘 КРИТИЧЕСКАЯ ОШИБКА:', localError);
      window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false, error: localError.message } }));
    }
  }
};

export const loadContent = async (): Promise<SiteContent> => {
  try {
    console.log('🌐 ЗАГРУЗКА ИЗ БД...');
    
    const dbContent = await loadContentFromDatabase();
    if (dbContent) {
      console.log('✅ КОНТЕНТ ЗАГРУЖЕН ИЗ БД');
      const fixedContent = fixBlockOrder(dbContent);
      return fixedContent;
    }
    
    console.log('⚠️ БД ПУСТА - используем дефолтный контент');
    
    const defaultFixedContent = fixBlockOrder(defaultContent);
    console.log('🔄 Сохраняем дефолтный контент в БД...');
    await saveContentToDatabase(defaultFixedContent);
    
    return defaultFixedContent;
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА загрузки из БД:', error);
    throw error; // Пробрасываем ошибку дальше
  }
};

// Функция для исправления порядка блоков
const fixBlockOrder = (content: SiteContent): SiteContent => {
  console.log('🔧 Fixing block order');
  console.log('Current blocks:', (content?.blocks || []).map(b => ({ id: b.id, title: b.title, order: b.order, type: b.type })));
  
  const reorderedBlocks = (content?.blocks || []).map(block => {
    // Системные блоки с фиксированным порядком
    if (block.id === 'hero') return { ...block, order: 1 };
    if (block.id === 'features') return { ...block, order: 2 };
    if (block.id === 'modules') return { ...block, order: 3 };
    if (block.id === 'can-module') return { ...block, order: 4 };
    if (block.id === 'analog-module') return { ...block, order: 5 }; 
    if (block.id === 'ops-module') return { ...block, order: 6 };
    
    // Специальная проверка для блока АБС по названию
    if (block.title && (block.title.includes('АБС') || block.title.includes('абс'))) {
      console.log(`🎯 Found ABS block: "${block.title}" - setting order = 7`);
      return { ...block, order: 7, type: 'custom' };
    }
    
    // Пользовательские блоки - между OPS (6) и видео (50)
    if (block.type === 'custom') {
      const customBlocks = (content?.blocks || []).filter(b => b.type === 'custom');
      const customIndex = customBlocks.findIndex(b => b.id === block.id);
      const newOrder = 7 + customIndex;
      console.log(`📦 Custom block "${block.title}" (${block.id}): ${block.order} -> ${newOrder}`);
      return { ...block, order: newOrder };
    }
    
    // Видео и контакты в конце
    if (block.id === 'videos') return { ...block, order: 50 };
    if (block.id === 'contacts') return { ...block, order: 51 };
    
    // Остальные блоки сохраняют свой порядок
    return block;
  });
  
  console.log('✅ New block order:', reorderedBlocks.map(b => ({ id: b.id, title: b.title, order: b.order, type: b.type })));
  
  return {
    ...content,
    blocks: reorderedBlocks,
    navigation: content?.navigation || defaultContent.navigation
  };
};

export const loadContentSync = (): SiteContent => {
  throw new Error('Синхронная загрузка не поддерживается - используйте loadContent()');
};

export const resetContent = (): SiteContent => {
  throw new Error('Сброс контента не поддерживается - используйте админку');
};

export const exportContent = (): string => {
  throw new Error('Экспорт не поддерживается без загрузки из БД');
};

export const importContent = (jsonString: string): SiteContent => {
  try {
    const content = JSON.parse(jsonString);
    return content;
  } catch (error) {
    console.error('❌ Error importing content:', error);
    throw new Error('Invalid JSON format');
  }
};

export const forceSyncWithDatabase = async (): Promise<boolean> => {
  throw new Error('Принудительная синхронизация не поддерживается');
};

export const loadFromDatabaseAndOverwrite = async (): Promise<SiteContent> => {
  return await loadContent(); // Просто загружаем из БД
};

export const forceRestoreDefaultContent = async (): Promise<SiteContent> => {
  console.log('🔄 Восстановление дефолтного контента...');
  const defaultFixedContent = fixBlockOrder(defaultContent);
  await saveContentToDatabase(defaultFixedContent);
  console.log('✅ Дефолтный контент сохранен в БД');
  return defaultFixedContent;
};