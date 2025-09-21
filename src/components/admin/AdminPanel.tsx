import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  ChevronUp, 
  ChevronDown,
  Type,
  Image as ImageIcon,
  Palette,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Database,
  Sync,
  LogOut,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ContentBlock, SiteContent, TextStyle } from '../../types/content';
import { saveContent, loadContent } from '../../utils/contentStorage';
import { logout, getAdminSession } from '../../utils/auth';
import TextEditor from './TextEditor';

interface AdminPanelProps {
  content: SiteContent;
  onContentChange: (content: SiteContent) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ content, onContentChange, onClose }) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'navigation' | 'settings'>('blocks');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{blockId: string, field: string} | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [adminSession, setAdminSession] = useState(getAdminSession());

  // Автосохранение при изменении контента
  useEffect(() => {
    const handleSave = async () => {
      setSaveStatus('saving');
      try {
        await saveContent(content, false); // Отложенное сохранение
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
      }
    };

    const timeoutId = setTimeout(handleSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [content]);

  // Слушаем события сохранения
  useEffect(() => {
    const handleContentSaved = (event: CustomEvent) => {
      if (event.detail.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    };

    window.addEventListener('contentSaved', handleContentSaved as EventListener);
    return () => window.removeEventListener('contentSaved', handleContentSaved as EventListener);
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const newContent = {
      ...content,
      blocks: content.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    };
    onContentChange(newContent);
  };

  const toggleBlockVisibility = (blockId: string) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (block) {
      updateBlock(blockId, { isVisible: !block.isVisible });
    }
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = content.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const newBlocks = [...content.blocks];
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;

    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[blockIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[blockIndex]];
      
      // Обновляем порядок
      newBlocks.forEach((block, index) => {
        block.order = index + 1;
      });

      onContentChange({
        ...content,
        blocks: newBlocks
      });
    }
  };

  const addNewBlock = () => {
    const newBlock: ContentBlock = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: 'Новый блок',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: {
          color: '#ffffff',
          fontSize: '3xl',
          fontFamily: 'default',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'center'
        },
        subtitle: {
          color: '#d1d5db',
          fontSize: 'xl',
          fontFamily: 'default',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'center'
        },
        description: {
          color: '#d1d5db',
          fontSize: 'base',
          fontFamily: 'default',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left'
        },
        content: {
          color: '#ffffff',
          fontSize: 'base',
          fontFamily: 'default',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left'
        }
      },
      isVisible: true,
      order: content.blocks.length + 1,
      showInNav: false
    };

    onContentChange({
      ...content,
      blocks: [...content.blocks, newBlock]
    });
  };

  const deleteBlock = (blockId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот блок?')) {
      const newBlocks = content.blocks.filter(b => b.id !== blockId);
      // Пересчитываем порядок
      newBlocks.forEach((block, index) => {
        block.order = index + 1;
      });

      onContentChange({
        ...content,
        blocks: newBlocks
      });
    }
  };

  const handleManualSave = async () => {
    setSaveStatus('saving');
    try {
      await saveContent(content, true); // Немедленное сохранение
    } catch (error) {
      console.error('Manual save error:', error);
      setSaveStatus('error');
    }
  };

  const handleLoadFromDatabase = async () => {
    if (confirm('Загрузить контент из базы данных? Несохраненные изменения будут потеряны.')) {
      try {
        const loadedContent = await loadContent();
        onContentChange(loadedContent);
        alert('Контент успешно загружен из базы данных');
      } catch (error) {
        console.error('Load error:', error);
        alert('Ошибка загрузки из базы данных');
      }
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Database className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Сохранение...';
      case 'saved':
        return lastSaved ? `Сохранено ${lastSaved.toLocaleTimeString()}` : 'Сохранено';
      case 'error':
        return 'Ошибка сохранения';
      default:
        return 'Готов к сохранению';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-xl font-bold text-white">Админка</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Info */}
          {adminSession && (
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="flex items-center text-sm text-gray-300 mb-1">
                <User className="w-4 h-4 mr-2" />
                {adminSession.username}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                Вход: {new Date(adminSession.loginTime).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Save Status */}
          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                {getSaveStatusIcon()}
                <span className="ml-2 text-gray-300">{getSaveStatusText()}</span>
              </div>
              <button
                onClick={handleManualSave}
                disabled={saveStatus === 'saving'}
                className="p-1 text-gray-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                title="Принудительное сохранение"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'blocks'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Блоки
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Настройки
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'blocks' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Блоки сайта</h3>
                <button
                  onClick={addNewBlock}
                  className="p-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-colors"
                  title="Добавить блок"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {content.blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <div
                      key={block.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedBlock === block.id
                          ? 'bg-yellow-500/10 border-yellow-500'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBlockVisibility(block.id);
                            }}
                            className="mr-2 text-gray-400 hover:text-white"
                          >
                            {block.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <span className="text-white font-medium">{block.title}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(block.id, 'up');
                            }}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(block.id, 'down');
                            }}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {block.type === 'custom' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {block.type} • Порядок: {block.order}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Настройки</h3>
              
              <button
                onClick={handleLoadFromDatabase}
                className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Database className="w-4 h-4 mr-2" />
                Загрузить из БД
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedBlock && (
          <BlockEditor
            block={content.blocks.find(b => b.id === selectedBlock)!}
            onUpdate={(updates) => updateBlock(selectedBlock, updates)}
            onClose={() => setSelectedBlock(null)}
          />
        )}
        {!selectedBlock && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Выберите блок для редактирования</p>
              <p className="text-sm">Кликните на блок в левой панели</p>
            </div>
          </div>
        )}
      </div>

      {/* Text Editor Modal */}
      {editingField && (
        <TextEditor
          value={(() => {
            const block = content.blocks.find(b => b.id === editingField.blockId);
            return block ? (block as any)[editingField.field] || '' : '';
          })()}
          onChange={(value) => {
            updateBlock(editingField.blockId, { [editingField.field]: value });
            setEditingField(null);
          }}
          onClose={() => setEditingField(null)}
          title={`Редактировать ${editingField.field}`}
        />
      )}
    </div>
  );
};

// Block Editor Component
interface BlockEditorProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onClose: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate, onClose }) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFieldEdit = (field: string, value: string) => {
    onUpdate({ [field]: value });
    setEditingField(null);
  };

  return (
    <div className="flex-1 bg-gray-800 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Редактирование: {block.title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Заголовок
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:border-yellow-400 focus:outline-none"
                />
                <button
                  onClick={() => setEditingField('title')}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-500 border border-l-0 border-gray-600 rounded-r-lg text-gray-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Подзаголовок
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={block.subtitle || ''}
                  onChange={(e) => onUpdate({ subtitle: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:border-yellow-400 focus:outline-none"
                />
                <button
                  onClick={() => setEditingField('subtitle')}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-500 border border-l-0 border-gray-600 rounded-r-lg text-gray-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание
            </label>
            <div className="flex">
              <textarea
                value={block.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={3}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:border-yellow-400 focus:outline-none resize-none"
              />
              <button
                onClick={() => setEditingField('description')}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-500 border border-l-0 border-gray-600 rounded-r-lg text-gray-300 hover:text-white transition-colors self-start"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Контент
            </label>
            <div className="flex">
              <textarea
                value={block.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                rows={6}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:border-yellow-400 focus:outline-none resize-none"
              />
              <button
                onClick={() => setEditingField('content')}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-500 border border-l-0 border-gray-600 rounded-r-lg text-gray-300 hover:text-white transition-colors self-start"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Цвет
              </label>
              <select
                value={block.color || 'blue'}
                onChange={(e) => onUpdate({ color: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
              >
                <option value="blue">Синий</option>
                <option value="yellow">Желтый</option>
                <option value="red">Красный</option>
                <option value="green">Зеленый</option>
                <option value="purple">Фиолетовый</option>
                <option value="orange">Оранжевый</option>
                <option value="pink">Розовый</option>
                <option value="teal">Бирюзовый</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Цена
              </label>
              <input
                type="text"
                value={block.price || ''}
                onChange={(e) => onUpdate({ price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                placeholder="2500₴"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Текст кнопки
              </label>
              <input
                type="text"
                value={block.ctaText || ''}
                onChange={(e) => onUpdate({ ctaText: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                placeholder="ЗАКАЗАТЬ"
              />
            </div>
          </div>

          {/* Visibility and Navigation */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={block.isVisible}
                onChange={(e) => onUpdate({ isVisible: e.target.checked })}
                className="mr-2"
              />
              <span className="text-gray-300">Видимый</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={block.showInNav}
                onChange={(e) => onUpdate({ showInNav: e.target.checked })}
                className="mr-2"
              />
              <span className="text-gray-300">Показывать в навигации</span>
            </label>
          </div>
        </div>
      </div>

      {/* Text Editor Modal */}
      {editingField && (
        <TextEditor
          value={(block as any)[editingField] || ''}
          onChange={(value) => handleFieldEdit(editingField, value)}
          onClose={() => setEditingField(null)}
          title={`Редактировать ${editingField}`}
        />
      )}
    </div>
  );
};

export default AdminPanel;