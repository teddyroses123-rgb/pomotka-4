import { SiteContent } from '../types/content';
import { defaultContent } from '../data/defaultContent';
import { saveContentToDatabase, loadContentFromDatabase } from './supabase';

// Debounce функция для отложенного сохранения
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DELAY = 1000; // 1 секунда задержки

const STORAGE_KEY = 'siteContent';

export const saveContent = async (content: SiteContent, immediate: boolean = false): Promise<void> => {
  try {
    console.log('🌐 СОХРАНЕНИЕ В ГЛОБАЛЬНУЮ БД (приоритет)...');
    
    // ПРИОРИТЕТ: Сохранение в глобальную БД
    if (immediate) {
      // Немедленное сохранение в БД
      const dbSaved = await saveContentToDatabase(content);
      if (dbSaved) {
        console.log('✅ НЕМЕДЛЕННОЕ сохранение в глобальную БД успешно');
        // Бекап в localStorage только после успешного сохранения в БД
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        console.log('💾 Бекап сохранен в localStorage');
        window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: true } }));
      } else {
        console.log('❌ ОШИБКА немедленного сохранения в БД');
        // В случае ошибки БД, сохраняем бекап в localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        console.log('🆘 АВАРИЙНЫЙ бекап в localStorage');
        window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false } }));
      }
    } else {
      // Отложенное сохранение в БД с debounce
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      saveTimeout = setTimeout(async () => {
        console.log('🌐 ОТЛОЖЕННОЕ сохранение в глобальную БД...');
        const dbSaved = await saveContentToDatabase(content);
        if (dbSaved) {
          console.log('✅ ОТЛОЖЕННОЕ сохранение в глобальную БД успешно');
          // Бекап в localStorage только после успешного сохранения в БД
          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          console.log('💾 Бекап сохранен в localStorage');
          window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: true } }));
        } else {
          console.log('❌ ОШИБКА отложенного сохранения в БД');
          // В случае ошибки БД, сохраняем бекап в localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          console.log('🆘 АВАРИЙНЫЙ бекап в localStorage');
          window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false } }));
        }
      }, SAVE_DELAY);
    }
    
  } catch (error) {
    console.error('❌ Error in saveContent:', error);
    // В случае критической ошибки сохраняем бекап в localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      console.log('🆘 КРИТИЧЕСКИЙ бекап в localStorage');
      window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false, error: error.message } }));
    } catch (localError) {
      console.error('🆘 КРИТИЧЕСКАЯ ОШИБКА: Не удалось сохранить даже бекап:', localError);
      window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false, error: localError.message } }));
    }
  }
};

export const loadContent = async (): Promise<SiteContent> => {
  try {
    console.log('🌐 ЗАГРУЗКА ИЗ ГЛОБАЛЬНОЙ БД (приоритет)...');
    
    // ПРИОРИТЕТ: Всегда загружаем из глобальной БД
    const dbContent = await loadContentFromDatabase();
    if (dbContent) {
      console.log('✅ КОНТЕНТ ЗАГРУЖЕН ИЗ ГЛОБАЛЬНОЙ БД');
      const fixedContent = fixBlockOrder(dbContent);
      // Обновляем бекап в localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedContent));
      console.log('💾 Бекап обновлен в localStorage');
      return fixedContent;
    }
    
    console.log('⚠️ ГЛОБАЛЬНАЯ БД ПУСТА - используем дефолтный контент');
    
    // Если БД пуста, используем дефолтный контент и сохраняем в БД
    const defaultFixedContent = fixBlockOrder(defaultContent);
    console.log('🔄 Сохраняем дефолтный контент в глобальную БД...');
    await saveContentToDatabase(defaultFixedContent);
    
    // Создаем бекап в localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFixedContent));
    console.log('💾 Дефолтный контент сохранен как бекап в localStorage');
    
    return defaultFixedContent;
    
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА загрузки из БД:', error);
    
    // ТОЛЬКО В КРИТИЧЕСКОМ СЛУЧАЕ используем бекап из localStorage
    try {
      const backupContent = localStorage.getItem(STORAGE_KEY);
      if (backupContent) {
        console.log('🆘 ИСПОЛЬЗУЕМ БЕКАП ИЗ localStorage (критический режим)');
        const content = JSON.parse(backupContent);
        return fixBlockOrder(content);
      }
    } catch (backupError) {
      console.error('❌ Ошибка загрузки бекапа:', backupError);
    }
    
    // Последний резерв - дефолтный контент
    console.log('🆘 ПОСЛЕДНИЙ РЕЗЕРВ: дефолтный контент');
    const defaultFixedContent = fixBlockOrder(defaultContent);
    
    // Пытаемся создать бекап
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFixedContent));
      console.log('💾 Дефолтный контент сохранен как бекап');
    } catch (storageError) {
      console.error('❌ Не удалось создать бекап:', storageError);
    }
    
    return defaultFixedContent;
  }
};

// Функция для исправления порядка блоков
const fixBlockOrder = (content: SiteContent): SiteContent => {
  console.log('🔧 Fixing block order');
  console.log('Current blocks:', content.blocks.map(b => ({ id: b.id, title: b.title, order: b.order, type: b.type })));
  
  const reorderedBlocks = content.blocks.map(block => {
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
      const customBlocks = content.blocks.filter(b => b.type === 'custom');
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
    blocks: reorderedBlocks
  };
};

export const loadContentSync = (): SiteContent => {
  try {
    // Синхронная загрузка только из бекапа localStorage (для экстренных случаев)
    const backupContent = localStorage.getItem(STORAGE_KEY);
    if (backupContent) {
      console.log('💾 Загружен бекап из localStorage (синхронно)');
      const content = JSON.parse(backupContent);
      return fixBlockOrder(content);
    }
  } catch (error) {
    console.error('❌ Error loading backup sync:', error);
  }
  console.log('📦 Using default content (sync fallback)');
  return fixBlockOrder(defaultContent);
};

export const resetContent = (): SiteContent => {
  // Очищаем бекап в localStorage
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Бекап в localStorage очищен');
  
  // Возвращаем дефолтный контент БЕЗ автоматического сохранения
  const ukrainianContent = fixBlockOrder(defaultContent);
  console.log('📦 Reset to default content');
  
  return ukrainianContent;
};

export const exportContent = (): string => {
  const content = loadContentSync();
  return JSON.stringify(content, null, 2);
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

// Функция для принудительной синхронизации с базой данных
export const forceSyncWithDatabase = async (): Promise<boolean> => {
  try {
    console.log('🔄 Force sync with database...');
    const localContent = loadContentSync();
    const success = await saveContentToDatabase(localContent);
    if (success) {
      console.log('✅ Force sync completed successfully');
      window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: true } }));
    } else {
      console.log('❌ Force sync failed');
      window.dispatchEvent(new CustomEvent('contentSaved', { detail: { success: false } }));
    }
    return success;
  } catch (error) {
    console.error('❌ Error in force sync:', error);
    return false;
  }
};

// Функция для загрузки из базы данных с перезаписью localStorage
export const loadFromDatabaseAndOverwrite = async (): Promise<SiteContent> => {
  try {
    console.log('🔄 Loading from database and overwriting localStorage...');
    const dbContent = await loadContentFromDatabase();
    if (dbContent) {
      const fixedContent = fixBlockOrder(dbContent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedContent));
      console.log('✅ Content loaded from database and saved to localStorage');
      return fixedContent;
    } else {
      console.log('⚠️ No content in database, keeping current localStorage');
      return loadContentSync();
    }
  } catch (error) {
    console.error('❌ Error loading from database:', error);
    return loadContentSync();
  }
};