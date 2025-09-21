import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, Save, Upload, Download, RotateCcw, Settings, Palette, Type, Image, Video, Link, ChevronUp, ChevronDown, Edit3, LogOut, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { ContentBlock, SiteContent, TextStyle, ContentImage } from '../../types/content';
import { defaultContent } from '../../data/defaultContent';
import { logout } from '../../utils/auth';
import { loadBackgroundsFromDatabase } from '../../utils/supabase';
import TextEditor from './TextEditor';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: SiteContent;
  onContentChange: (content: SiteContent) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, content, onContentChange }) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'navigation'>('blocks');
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<Array<{id: string, name: string, css_value: string, preview_color: string}>>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [textEditor, setTextEditor] = useState<{
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    title: string;
    placeholder?: string;
    rows?: number;
  } | null>(null);

  // Load backgrounds from database on component mount
  useEffect(() => {
    const loadBackgrounds = async () => {
      // Используем ваши конкретные градиенты
      const specificBackgrounds = [
        { 
          id: 'teal-gradient', 
          name: 'Бирюзовый градиент', 
          css_value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #00d4aa 70%, #00a693 100%)', 
          preview_color: '#00d4aa' 
        },
        { 
          id: 'green-gradient', 
          name: 'Зеленый градиент', 
          css_value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #00ff88 70%, #00cc66 100%)', 
          preview_color: '#00ff88' 
        },
        { 
          id: 'orange-gradient', 
          name: 'Оранжево-коричневый градиент', 
          css_value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #ff6600 70%, #cc4400 100%)', 
          preview_color: '#ff6600' 
        },
        { 
          id: 'purple-gradient', 
          name: 'Фиолетовый градиент', 
          css_value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #8b5cf6 70%, #7c3aed 100%)', 
          preview_color: '#8b5cf6' 
        },
        { 
          id: 'blue-gradient', 
          name: 'Синий градиент', 
          css_value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #3b82f6 70%, #2563eb 100%)', 
          preview_color: '#3b82f6' 
        },
        { 
          id: 'red-gradient', 
          name: 'Красный градиент', 
          css_value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #ef4444 70%, #dc2626 100%)', 
          preview_color: '#ef4444' 
        }
      ];
      setBackgroundImages(specificBackgrounds);
    };
    loadBackgrounds();
  }, []);

  const galleryImages = [
    'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3846082/pexels-photo-3846082.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://i.ibb.co/Fkyfsw7V/image.png',
    'https://i.ibb.co/BHNJB1ZG/product-image-of-Ana.png'
  ];

  const icons = ['⚙️', '🔧', '🛠️', '📱', '💻', '🚗', '🔌', '📊', '🎯', '⭐', '🔥', '💡'];

  const colors = [
    { name: 'Blue', value: 'blue', color: '#3b82f6' },
    { name: 'Yellow', value: 'yellow', color: '#eab308' },
    { name: 'Red', value: 'red', color: '#ef4444' },
    { name: 'Green', value: 'green', color: '#22c55e' },
    { name: 'Purple', value: 'purple', color: '#a855f7' },
    { name: 'Gray', value: 'gray', color: '#6b7280' },
    { name: 'Orange', value: 'orange', color: '#f97316' },
    { name: 'Pink', value: 'pink', color: '#ec4899' },
    { name: 'Teal', value: 'teal', color: '#14b8a6' },
    { name: 'Indigo', value: 'indigo', color: '#6366f1' },
    { name: 'Lime', value: 'lime', color: '#84cc16' },
    { name: 'Emerald', value: 'emerald', color: '#10b981' },
    { name: 'Cyan', value: 'cyan', color: '#06b6d4' }
  ];

  const fontSizes = [
    { name: 'XS', value: 'xs' },
    { name: 'SM', value: 'sm' },
    { name: 'Base', value: 'base' },
    { name: 'LG', value: 'lg' },
    { name: 'XL', value: 'xl' },
    { name: '2XL', value: '2xl' },
    { name: '3XL', value: '3xl' },
    { name: '4XL', value: '4xl' },
    { name: '5XL', value: '5xl' },
    { name: '6XL', value: '6xl' },
    { name: '7XL', value: '7xl' },
    { name: '8XL', value: '8xl' }
  ];

  const fontFamilies = [
    { name: 'По умолчанию', value: 'default' },
    { name: 'Serif', value: 'serif' },
    { name: 'Mono', value: 'mono' },
    { name: 'Sans', value: 'sans' }
  ];

  const textColors = [
    '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#d1d5db'
  ];

  const openTextEditor = (field: string, value: string, title: string, placeholder?: string, rows?: number) => {
    console.log('🔧 Открываем редактор для поля:', field, 'блок:', editingBlock?.id);
    setTextEditor({
      value,
      onChange: (newValue) => {
        if (editingBlock) {
          console.log('🔄 Обновляем поле:', field, 'новое значение:', newValue);
          console.log('🔄 ИЗМЕНЯЕМ ПОЛЕ:', field, 'НОВОЕ ЗНАЧЕНИЕ:', newValue, 'БЛОК:', editingBlock.id);
          console.log('💾 Сохраняем поле:', field, 'новое значение:', newValue);
          const updatedBlock = { 
            ...editingBlock, 
            [field]: newValue 
          };
          console.log('🔄 Обновленный блок:', updatedBlock.id, updatedBlock.title);
          console.log('🔄 ОБНОВЛЕННЫЙ БЛОК:', updatedBlock);
          
          // Обновляем локальное состояние
          setEditingBlock(updatedBlock);
          
          setEditingBlock(updatedBlock);
          
          const updatedContent = {
            ...content,
            blocks: content.blocks.map(block => 
              block.id === updatedBlock.id ? updatedBlock : block
            ),
            navigation: {
              ...content.navigation,
              items: content.navigation.items.map(item =>
                item.blockId === updatedBlock.id
                  ? { ...item, title: updatedBlock.navTitle || updatedBlock.title }
                  : item
              )
            }
          };
          
          // КРИТИЧЕСКИ ВАЖНО: СОХРАНЯЕМ ИЗМЕНЕНИЯ!
          setEditingBlock(updatedBlock);
          onContentChange(updatedContent);
          
          onContentChange(updatedContent);
          
          onContentChange(updatedContent);
          console.log('✅ Сохранено поле:', field, 'значение:', newValue, 'для блока:', updatedBlock.id);
        }
      },
      onClose: () => setTextEditor(null),
      title,
      placeholder: placeholder || 'Введите текст...',
      rows: rows || 10
    });
  };

  const createNewBlock = () => {
    // Вставляем новый блок между OPS (order 6) и видео (order 50)
    // Находим максимальный order среди пользовательских блоков
    const customBlocks = content.blocks.filter(block => block.type === 'custom');
    const maxCustomOrder = customBlocks.length > 0 ? Math.max(...customBlocks.map(block => block.order)) : 6;
    const insertOrder = Math.max(7, maxCustomOrder + 1);

    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: 'custom',
      title: 'Новый блок',
      subtitle: 'Подзаголовок',
      description: 'Описание блока',
      content: '',
      images: [],
      backgroundImage: 'radial-gradient(circle at center, #00d4aa 0%, #00a693 30%, #006b5d 70%, #003d34 100%)',
      icon: icons[0],
      color: 'blue',
      cardDescription: 'Описание для карточки',
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
          color: '#d1d5db',
          fontSize: 'base',
          fontFamily: 'default',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textDecoration: 'none',
          textAlign: 'left'
        }
      },
      isVisible: true,
      order: insertOrder,
      navTitle: 'Новый блок',
      showInNav: true
    };

    const updatedContent = {
      ...content,
      blocks: [...content.blocks, newBlock],
      navigation: {
        ...content.navigation,
        items: [
          ...content.navigation.items,
          {
            id: `nav-${newBlock.id}`,
            title: newBlock.navTitle || newBlock.title,
            blockId: newBlock.id,
            isVisible: true
          }
        ]
      }
    };

    onContentChange(updatedContent);
    setEditingBlock(newBlock);
  };

  const updateBlock = (updatedBlock: ContentBlock) => {
    console.log('🔄 ОБНОВЛЯЕМ БЛОК:', updatedBlock.id, 'price:', updatedBlock.price, 'ctaText:', updatedBlock.ctaText);
    
    // Обновляем локальное состояние editingBlock
    setEditingBlock(updatedBlock);
    
    // Обновляем основной контент
    
    // ПРИНУДИТЕЛЬНО ОБНОВЛЯЕМ ЛОКАЛЬНОЕ СОСТОЯНИЕ
    setEditingBlock(updatedBlock);
    
    
    // Принудительно обновляем editingBlock для синхронизации
    if (editingBlock && editingBlock.id === updatedBlock.id) {
      setEditingBlock(updatedBlock);
    }
    
    const updatedContent = {
      ...content,
      blocks: content.blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      ),
      navigation: {
        ...content.navigation,
        items: content.navigation.items.map(item =>
          item.blockId === updatedBlock.id
            ? { ...item, title: updatedBlock.navTitle || updatedBlock.title }
            : item
        )
      }
    };
    console.log('🔄 ОБНОВЛЕННЫЙ КОНТЕНТ:', updatedContent.blocks.find(b => b.id === updatedBlock.id));
    onContentChange(updatedContent);
  };

  const deleteBlock = (blockId: string) => {
    const updatedContent = {
      ...content,
      blocks: content.blocks.filter(block => block.id !== blockId),
      navigation: {
        ...content.navigation,
        items: content.navigation.items.filter(item => item.blockId !== blockId)
      }
    };
    onContentChange(updatedContent);
  };

  const updateTextStyle = (blockId: string, styleType: keyof ContentBlock['textStyles'], updates: Partial<TextStyle>) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block) return;

    const updatedBlock = {
      ...block,
      textStyles: {
        ...block.textStyles,
        [styleType]: {
          ...block.textStyles[styleType],
          ...updates
        }
      }
    };

    updateBlock(updatedBlock);
    setEditingBlock(updatedBlock);
  };

  const addImageToBlock = (blockId: string, imageUrl: string) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block) return;

    const newImage: ContentImage = {
      id: `img-${Date.now()}`,
      url: imageUrl,
      alt: 'Uploaded image'
    };

    const updatedBlock = {
      ...block,
      images: [...block.images, newImage]
    };

    updateBlock(updatedBlock);
    setEditingBlock(updatedBlock);
  };

  const removeImageFromBlock = (blockId: string, imageId: string) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block) return;

    const updatedBlock = {
      ...block,
      images: block.images.filter(img => img.id !== imageId)
    };

    updateBlock(updatedBlock);
    setEditingBlock(updatedBlock);
  };

  const handleFileUpload = (file: File, blockId: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      addImageToBlock(blockId, result);
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (editingBlock) {
        setEditingBlock({ ...editingBlock, backgroundImage: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetBlockId: string) => {
    if (!draggedBlock || draggedBlock === targetBlockId) return;

    const draggedIndex = content.blocks.findIndex(b => b.id === draggedBlock);
    const targetIndex = content.blocks.findIndex(b => b.id === targetBlockId);

    const newBlocks = [...content.blocks];
    const [draggedItem] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedItem);

    // Update order
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index + 1
    }));

    onContentChange({
      ...content,
      blocks: updatedBlocks
    });

    setDraggedBlock(null);
  };

  const handleLogout = () => {
    logout();
    onClose();
    window.location.reload();
  };

  const addVideo = (blockId: string) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block) return;

    const newVideo = {
      id: `video-${Date.now()}`,
      title: 'Новое видео',
      url: '',
      thumbnail: ''
    };

    const updatedBlock = {
      ...block,
      videos: [...(block.videos || []), newVideo]
    };

    updateBlock(updatedBlock);
    setEditingBlock(updatedBlock);
  };

  const removeVideo = (blockId: string, videoIndex: number) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block) return;

    const updatedVideos = (block.videos || []).filter((_, index) => index !== videoIndex);
    const updatedBlock = {
      ...block,
      videos: updatedVideos
    };

    updateBlock(updatedBlock);
    setEditingBlock(updatedBlock);
  };

  const handleVideoChange = (blockId: string, videoIndex: number, field: string, value: string) => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block) return;

    const updatedVideos = (block.videos || []).map((video, index) => 
      index === videoIndex ? { ...video, [field]: value } : video
    );

    const updatedBlock = {
      ...block,
      videos: updatedVideos
    };

    updateBlock(updatedBlock);
    setEditingBlock(updatedBlock);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex">
      <div className="w-full max-w-6xl mx-auto bg-gray-900 border border-gray-700 rounded-lg m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Админская панель</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-red-400 hover:text-red-300"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'blocks'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Блоки контента
          </button>
          <button
            onClick={() => setActiveTab('navigation')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'navigation'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Навигация
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Blocks Tab */}
          {activeTab === 'blocks' && (
            <div className="flex-1 flex">
              {/* Blocks List */}
              <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
                <div className="p-4">
                  <button
                    onClick={createNewBlock}
                    className="w-full flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors mb-4"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Добавить блок
                  </button>

                  <button
                    onClick={() => {
                      console.log('🚨 ПРИНУДИТЕЛЬНОЕ ИСПРАВЛЕНИЕ ПОРЯДКА БЛОКОВ');
                      console.log('Текущие блоки:', content.blocks.map(b => ({ id: b.id, title: b.title, order: b.order, type: b.type })));
                      
                      // Найдем блок АБС
                      const absBlock = content.blocks.find(b => 
                        b.title && (b.title.includes('АБС') || b.title.includes('абс') || b.title.includes('Блок АБС'))
                      );
                      if (absBlock) {
                        console.log('🎯 Найден блок АБС:', absBlock.id, absBlock.title, 'текущий order:', absBlock.order);
                      }
                      
                      const reorderedBlocks = content.blocks.map(block => {
                        let newOrder = block.order;
                        
                        // Системные блоки
                        if (block.id === 'hero') return { ...block, order: 1 };
                        else if (block.id === 'features') return { ...block, order: 2 };
                        else if (block.id === 'modules') return { ...block, order: 3 };
                        else if (block.id === 'ops') return { ...block, order: 6 };
                        else if (block.id === 'video') return { ...block, order: 50 };
                        else if (block.id === 'contact') return { ...block, order: 100 };
                        
                        // Пользовательские блоки - размещаем между OPS (6) и видео (50)
                        else if (block.type === 'custom') {
                          // Если это блок АБС, ставим его на позицию 4
                          if (block.title && (block.title.includes('АБС') || block.title.includes('абс') || block.title.includes('Блок АБС'))) {
                            console.log('🔧 Перемещаем блок АБС на позицию 4');
                            return { ...block, order: 4 };
                          }
                          // Остальные пользовательские блоки - между 7 и 49
                          return { ...block, order: Math.max(7, Math.min(49, block.order)) };
                        }
                        
                        return block;
                      });
                      
                      console.log('✅ Новый порядок блоков:', reorderedBlocks.map(b => ({ id: b.id, title: b.title, order: b.order, type: b.type })));
                      
                      onContentChange({
                        ...content,
                        blocks: reorderedBlocks
                      });
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors mb-4"
                  >
                    🚨 Исправить порядок блоков
                  </button>

                  <div className="space-y-2">
                    {content.blocks
                      .sort((a, b) => a.order - b.order)
                      .map((block) => (
                        <div
                          key={block.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            editingBlock?.id === block.id
                              ? 'border-yellow-400 bg-yellow-400/10'
                              : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                          }`}
                          onClick={() => setEditingBlock(block)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white text-sm">
                                {block.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateBlock({ ...block, isVisible: !block.isVisible });
                                }}
                                className="p-1 hover:bg-gray-700 rounded"
                              >
                                {block.isVisible ? (
                                  <Eye className="w-4 h-4 text-green-400" />
                                ) : (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBlock(block.id);
                                }}
                                className="p-1 hover:bg-gray-700 rounded text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {block.subtitle || block.description || 'Нет описания'}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Block Editor */}
              <div className="flex-1 overflow-y-auto">
                {editingBlock ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-4">
                        Редактирование блока: {editingBlock.title}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Основная информация</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Заголовок блока
                            </label>
                            <div 
                              className="relative group cursor-pointer hover:bg-gray-700/50 p-2 rounded border border-gray-600 hover:border-gray-500 transition-colors"
                              onClick={() => openTextEditor('title', editingBlock.title, 'Редактировать заголовок блока')}
                            >
                              <div className="text-white bg-gray-800 p-3 rounded border border-gray-600 min-h-[50px] flex items-center">
                                {editingBlock.title || 'Нажмите для редактирования заголовка...'}
                              </div>
                              <Edit3 className="absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Подзаголовок блока
                            </label>
                            <div 
                              className="relative group cursor-pointer hover:bg-gray-700/50 p-2 rounded border border-gray-600 hover:border-gray-500 transition-colors"
                              onClick={() => openTextEditor('subtitle', editingBlock.subtitle || '', 'Редактировать подзаголовок блока')}
                            >
                              <div className="text-white bg-gray-800 p-3 rounded border border-gray-600 min-h-[50px] flex items-center">
                                {editingBlock.subtitle || 'Нажмите для редактирования подзаголовка...'}
                              </div>
                              <Edit3 className="absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Описание для карточки навигации
                            </label>
                            <div 
                              className="relative group cursor-pointer hover:bg-gray-700/50 p-2 rounded border border-gray-600 hover:border-gray-500 transition-colors"
                              onClick={() => openTextEditor('cardDescription', editingBlock.cardDescription || '', 'Редактировать описание для карточки', 'Краткое описание для навигационной карточки...', 5)}
                            >
                              <div className="text-gray-300 bg-gray-800 p-3 rounded border border-gray-600 min-h-[80px] flex items-start">
                                <div className="flex-1">
                                  {editingBlock.cardDescription ? (
                                    <span>{editingBlock.cardDescription.length > 150 ? `${editingBlock.cardDescription.substring(0, 150)}...` : editingBlock.cardDescription}</span>
                                  ) : (
                                    <span className="text-gray-500">Нажмите для редактирования описания карточки...</span>
                                  )}
                                </div>
                              </div>
                              <Edit3 className="absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Описание блока
                            </label>
                            <div 
                              className="relative group cursor-pointer hover:bg-gray-700/50 p-2 rounded border border-gray-600 hover:border-gray-500 transition-colors"
                              onClick={() => openTextEditor('description', editingBlock.description || '', 'Редактировать описание блока', 'Основное описание блока...', 10)}
                            >
                              <div className="text-gray-300 bg-gray-800 p-3 rounded border border-gray-600 min-h-[120px] flex items-start">
                                <div className="flex-1">
                                  {editingBlock.description ? (
                                    <span>{editingBlock.description.length > 200 ? `${editingBlock.description.substring(0, 200)}...` : editingBlock.description}</span>
                                  ) : (
                                    <span className="text-gray-500">Нажмите для редактирования описания...</span>
                                  )}
                                </div>
                              </div>
                              <Edit3 className="absolute top-2 right-2 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Полное описание блока
                            </label>
                            <div 
                              onClick={() => setTextEditor({
                                value: editingBlock.content || '',
                                onChange: (value) => {
                                  const updatedBlock = { ...editingBlock, content: value };
                                  setEditingBlock(updatedBlock);
                                  updateBlock(updatedBlock);
                                },
                                onClose: () => setTextEditor(null),
                                title: 'Редактировать описание блока',
                                placeholder: 'Введите полное описание блока...',
                                rows: 12
                              })}
                              className="w-full min-h-[100px] px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-pointer hover:border-yellow-400 transition-colors flex items-start justify-between group"
                            >
                              <div className="flex-1">
                                {editingBlock.content ? (
                                  <div className="whitespace-pre-wrap text-sm">
                                    {editingBlock.content.length > 300 
                                      ? `${editingBlock.content.substring(0, 300)}...` 
                                      : editingBlock.content}
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-sm">Нажмите для редактирования полного описания...</div>
                                )}
                              </div>
                              <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors ml-2 flex-shrink-0" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Название в навигации
                            </label>
                            <input
                              type="text"
                              value={editingBlock.navTitle || ''}
                              onChange={(e) => {
                                const updatedBlock = { ...editingBlock, navTitle: e.target.value };
                                setEditingBlock(updatedBlock);
                                
                                // ПРИНУДИТЕЛЬНО ОБНОВЛЯЕМ КОНТЕНТ
                                const updatedContent = {
                                  ...content,
                                  blocks: content.blocks.map(block => 
                                    block.id === updatedBlock.id ? updatedBlock : block
                                  ),
                                  navigation: {
                                    ...content.navigation,
                                    items: content.navigation.items.map(item =>
                                      item.blockId === updatedBlock.id
                                        ? { ...item, title: updatedBlock.navTitle || updatedBlock.title }
                                        : item
                                    )
                                  }
                                };
                                onContentChange(updatedContent);
                              }}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Цвет блока
                            </label>
                            <div className="flex space-x-2">
                              {colors.map((color) => (
                                <button
                                  key={color.value}
                                  onClick={() => {
                                    const updatedBlock = { ...editingBlock, color: color.value as any };
                                    setEditingBlock(updatedBlock);
                                    updateBlock(updatedBlock);
                                  }}
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    editingBlock.color === color.value ? 'border-white' : 'border-gray-600'
                                  }`}
                                  style={{ backgroundColor: color.color }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Management for videos block */}
                      {editingBlock.id === 'videos' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-white">Управление видео</h4>
                            <button
                              onClick={() => {
                                console.log('Добавляем видео к блоку:', editingBlock.id);
                                const newVideo = {
                                  id: `video-${Date.now()}`,
                                  title: 'Новое видео',
                                  url: '',
                                  thumbnail: ''
                                };
                                const updatedBlock = {
                                  ...editingBlock,
                                  videos: [...(editingBlock.videos || []), newVideo]
                                };
                                console.log('Обновленный блок:', updatedBlock);
                                setEditingBlock(updatedBlock);
                                const updatedContent = {
                                  ...content,
                                  blocks: content.blocks.map(b => b.id === editingBlock.id ? updatedBlock : b)
                                };
                                onContentChange(updatedContent);
                              }}
                              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
                            >
                              + Добавить видео
                            </button>
                          </div>

                          {(editingBlock.videos || []).map((video, videoIndex) => (
                            <div key={video.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-white font-medium">Видео {videoIndex + 1}</h5>
                                <button
                                  onClick={() => {
                                    const updatedVideos = (editingBlock.videos || []).filter((_, i) => i !== videoIndex);
                                    const updatedBlock = {
                                      ...editingBlock,
                                      videos: updatedVideos
                                    };
                                    setEditingBlock(updatedBlock);
                                    const updatedContent = {
                                      ...content,
                                      blocks: content.blocks.map(b => b.id === editingBlock.id ? updatedBlock : b)
                                    };
                                    onContentChange(updatedContent);
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
                                >
                                  Удалить
                                </button>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-gray-300 text-sm mb-1">Название видео</label>
                                  <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => {
                                      const updatedVideos = (editingBlock.videos || []).map((v, i) => 
                                        i === videoIndex ? { ...v, title: e.target.value } : v
                                      );
                                      const updatedBlock = {
                                        ...editingBlock,
                                        videos: updatedVideos
                                      };
                                      setEditingBlock(updatedBlock);
                                      const updatedContent = {
                                        ...content,
                                        blocks: content.blocks.map(b => b.id === editingBlock.id ? updatedBlock : b)
                                      };
                                      onContentChange(updatedContent);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                    placeholder="Название видео"
                                  />
                                </div>

                                <div>
                                  <label className="block text-gray-300 text-sm mb-1">Ссылка на видео</label>
                                  <div className="flex gap-2">
                                    <input
                                      type="url"
                                      value={video.url}
                                      onChange={(e) => {
                                        const updatedVideos = (editingBlock.videos || []).map((v, i) => 
                                          i === videoIndex ? { ...v, url: e.target.value } : v
                                        );
                                        const updatedBlock = {
                                          ...editingBlock,
                                          videos: updatedVideos
                                        };
                                        setEditingBlock(updatedBlock);
                                        const updatedContent = {
                                          ...content,
                                          blocks: content.blocks.map(b => b.id === editingBlock.id ? updatedBlock : b)
                                        };
                                        onContentChange(updatedContent);
                                      }}
                                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                      placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {video.url && (
                                      <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                                      >
                                        Открыть
                                      </a>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-gray-300 text-sm mb-1">Превью изображение</label>
                                  <input
                                    type="url"
                                    value={video.thumbnail || ''}
                                    onChange={(e) => {
                                      const updatedVideos = (editingBlock.videos || []).map((v, i) => 
                                        i === videoIndex ? { ...v, thumbnail: e.target.value } : v
                                      );
                                      const updatedBlock = {
                                        ...editingBlock,
                                        videos: updatedVideos
                                      };
                                      setEditingBlock(updatedBlock);
                                      const updatedContent = {
                                        ...content,
                                        blocks: content.blocks.map(b => b.id === editingBlock.id ? updatedBlock : b)
                                      };
                                      onContentChange(updatedContent);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                    placeholder="https://example.com/thumbnail.jpg"
                                  />
                                  {video.thumbnail && (
                                    <img
                                      src={video.thumbnail}
                                      alt="Превью"
                                      className="mt-2 w-32 h-20 object-cover rounded border border-gray-600"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Save Button for videos block */}
                      {editingBlock.id === 'videos' && (
                        <button
                          onClick={() => {
                            console.log('💾 Сохраняем видео блок:', editingBlock.videos);
                            updateBlock(editingBlock);
                          }}
                          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors flex items-center"
                        >
                          <Save className="w-5 h-5 mr-2" />
                          Сохранить видео
                        </button>
                      )}

                      {/* Text Styles */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Стили текста</h4>
                        {Object.entries(editingBlock.textStyles).map(([styleType, style]) => (
                          <div key={styleType} className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                            <h5 className="text-md font-medium text-white mb-3 capitalize">
                              {styleType === 'title' ? 'Заголовок' : 
                               styleType === 'subtitle' ? 'Подзаголовок' :
                               styleType === 'description' ? 'Описание' : 'Контент'}
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {/* Color */}
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Цвет</label>
                                <div className="flex space-x-1">
                                  {textColors.map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => updateTextStyle(editingBlock.id, styleType as any, { color })}
                                      className={`w-6 h-6 rounded border ${
                                        style.color === color ? 'border-white' : 'border-gray-600'
                                      }`}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Font Size */}
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Размер</label>
                                <select
                                  value={style.fontSize}
                                  onChange={(e) => updateTextStyle(editingBlock.id, styleType as any, { fontSize: e.target.value as any })}
                                  className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs"
                                >
                                  {fontSizes.map((size) => (
                                    <option key={size.value} value={size.value}>
                                      {size.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Font Family */}
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Шрифт</label>
                                <select
                                  value={style.fontFamily}
                                  onChange={(e) => updateTextStyle(editingBlock.id, styleType as any, { fontFamily: e.target.value as any })}
                                  className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs"
                                >
                                  {fontFamilies.map((font) => (
                                    <option key={font.value} value={font.value}>
                                      {font.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Text Align */}
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Выравнивание</label>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => updateTextStyle(editingBlock.id, styleType as any, { textAlign: 'left' })}
                                    className={`p-1 rounded ${style.textAlign === 'left' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                                  >
                                    <AlignLeft className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => updateTextStyle(editingBlock.id, styleType as any, { textAlign: 'center' })}
                                    className={`p-1 rounded ${style.textAlign === 'center' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                                  >
                                    <AlignCenter className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => updateTextStyle(editingBlock.id, styleType as any, { textAlign: 'right' })}
                                    className={`p-1 rounded ${style.textAlign === 'right' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'}`}
                                  >
                                    <AlignRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Font Weight, Style, Decoration */}
                              <div className="col-span-2 md:col-span-4">
                                <label className="block text-xs text-gray-400 mb-1">Стиль</label>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => updateTextStyle(editingBlock.id, styleType as any, { 
                                      fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' 
                                    })}
                                    className={`px-2 py-1 rounded text-xs ${
                                      style.fontWeight === 'bold' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                                    }`}
                                  >
                                    <Bold className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => updateTextStyle(editingBlock.id, styleType as any, { 
                                      fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' 
                                    })}
                                    className={`px-2 py-1 rounded text-xs ${
                                      style.fontStyle === 'italic' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                                    }`}
                                  >
                                    <Italic className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => updateTextStyle(editingBlock.id, styleType as any, { 
                                      textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' 
                                    })}
                                    className={`px-2 py-1 rounded text-xs ${
                                      style.textDecoration === 'underline' ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                                    }`}
                                  >
                                    <Underline className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Background & Icon */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Фон и иконка</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Фоновое изображение
                            </label>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {backgroundImages.map((bg, index) => (
                                <button
                                  key={bg.id}
                                  onClick={() => setEditingBlock({ ...editingBlock, backgroundImage: bg.css_value })}
                                  className={`aspect-video rounded-lg border-2 overflow-hidden ${
                                    editingBlock.backgroundImage === bg.css_value ? 'border-yellow-400' : 'border-gray-600'
                                  }`}
                                  title={bg.name}
                                >
                                  <div 
                                    className="w-full h-full" 
                                    style={{ background: bg.css_value }}
                                  />
                                </button>
                              ))}
                            </div>
                            
                            {/* Кнопки для добавления фона */}
                            <div className="space-y-2">
                              <details className="bg-gray-700/50 rounded-lg">
                                <summary className="p-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                                  Добавить свой фон
                                </summary>
                                <div className="p-3 pt-0 space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Вставить ссылку</label>
                                    <input
                                      type="url"
                                      placeholder="https://example.com/image.jpg"
                                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          const input = e.target as HTMLInputElement;
                                          if (input.value) {
                                            const updatedBlock = { ...editingBlock, backgroundImage: input.value };
                                            setEditingBlock(updatedBlock);
                                            updateBlock(updatedBlock);
                                            input.value = '';
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-400 mb-1">Загрузить с устройства</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleBackgroundFileUpload(file);
                                        }
                                      }}
                                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-yellow-500 file:text-black file:font-medium hover:file:bg-yellow-400"
                                    />
                                  </div>
                                </div>
                              </details>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Иконка
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                              {icons.map((icon, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    const updatedBlock = { ...editingBlock, icon };
                                    setEditingBlock(updatedBlock);
                                    updateBlock(updatedBlock);
                                  }}
                                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl ${
                                    editingBlock.icon === icon ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:border-gray-500'
                                  }`}
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Images */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Изображения блока</h4>
                        
                        {/* Current Images */}
                        {editingBlock.images.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Текущие изображения</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {editingBlock.images.map((image) => (
                                <div key={image.id} className="relative group">
                                  <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="w-full aspect-video object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => removeImageFromBlock(editingBlock.id, image.id)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add Images */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-gray-300">Добавить изображения</h5>
                          
                          {/* Gallery Images */}
                          <details className="bg-gray-700/50 rounded-lg">
                            <summary className="p-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                              Выбрать из галереи
                            </summary>
                            <div className="p-3 pt-0">
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {galleryImages.map((imageUrl, index) => (
                                  <button
                                    key={index}
                                    onClick={() => addImageToBlock(editingBlock.id, imageUrl)}
                                    className="aspect-video rounded-lg overflow-hidden border border-gray-600 hover:border-yellow-400 transition-colors"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Gallery ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </details>

                          {/* URL Input */}
                          <details className="bg-gray-700/50 rounded-lg">
                            <summary className="p-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                              Добавить по ссылке
                            </summary>
                            <div className="p-3 pt-0">
                              <input
                                type="url"
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  if (imageUrlInput.trim()) {
                                    addImageToBlock(editingBlock.id, imageUrlInput.trim());
                                    setImageUrlInput('');
                                  }
                                }}
                                className="mt-2 w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
                              >
                                Добавить изображение
                              </button>
                            </div>
                          </details>

                          {/* File Upload */}
                          <details className="bg-gray-700/50 rounded-lg">
                            <summary className="p-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                              Загрузить с устройства
                            </summary>
                            <div className="p-3 pt-0">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  files.forEach(file => handleFileUpload(file, editingBlock.id));
                                }}
                                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-yellow-500 file:text-black file:font-medium hover:file:bg-yellow-400"
                              />
                            </div>
                          </details>

                          {/* Manual Image URLs */}
                          <details className="bg-gray-700/50 rounded-lg">
                            <summary className="p-3 cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                              Редактировать ссылки на изображения
                            </summary>
                            <div className="p-3 pt-0 space-y-2">
                              {Array.from({ length: 6 }, (_, index) => (
                                <div key={index}>
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Изображение {index + 1}
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={editingBlock.images[index]?.url || ''}
                                    onChange={(e) => {
                                      const newImages = [...editingBlock.images];
                                      if (e.target.value) {
                                        if (newImages[index]) {
                                          newImages[index] = { ...newImages[index], url: e.target.value };
                                        } else {
                                          newImages[index] = {
                                            id: `img-${Date.now()}-${index}`,
                                            url: e.target.value,
                                            alt: `Image ${index + 1}`
                                          };
                                        }
                                      } else {
                                        if (newImages[index]) {
                                          newImages.splice(index, 1);
                                        }
                                      }
                                      const updatedBlock = { ...editingBlock, images: newImages };
                                      setEditingBlock(updatedBlock);
                                      updateBlock(updatedBlock);
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                                  />
                                  
                                  {/* File Upload */}
                                  <details className="bg-gray-700/30 rounded">
                                    <summary className="p-2 cursor-pointer text-xs text-gray-400 hover:text-white">
                                      Или загрузить с устройства
                                    </summary>
                                    <div className="p-2 pt-0">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              const result = event.target?.result as string;
                                              const newImages = [...editingBlock.images];
                                              if (newImages[index]) {
                                                newImages[index] = { ...newImages[index], url: result };
                                              } else {
                                                newImages[index] = {
                                                  id: `img-${Date.now()}-${index}`,
                                                  url: result,
                                                  alt: `Image ${index + 1}`
                                                };
                                              }
                                              const updatedBlock = { ...editingBlock, images: newImages };
                                              setEditingBlock(updatedBlock);
                                              updateBlock(updatedBlock);
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-yellow-500 file:text-black file:font-medium hover:file:bg-yellow-400"
                                      />
                                    </div>
                                  </details>

                                  {/* Preview */}
                                  {editingBlock.images[index]?.url && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                                      <div className="w-32 h-20 border border-gray-600 rounded overflow-hidden flex-shrink-0">
                                        <img
                                          src={editingBlock.images[index].url}
                                          alt={`Preview ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            const newImages = [...editingBlock.images];
                                            const currentImage = newImages[index];
                                            newImages.splice(index, 1);
                                            newImages.unshift(currentImage);
                                            const updatedBlock = { ...editingBlock, images: newImages };
                                            setEditingBlock(updatedBlock);
                                            updateBlock(updatedBlock);
                                          }}
                                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
                                          title="Сделать главной"
                                        >
                                          ⭐ Главная
                                        </button>
                                        <button
                                          onClick={() => {
                                            const newImages = editingBlock.images.filter((_, i) => i !== index);
                                            const updatedBlock = { ...editingBlock, images: newImages };
                                            setEditingBlock(updatedBlock);
                                            updateBlock(updatedBlock);
                                          }}
                                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
                                          title="Удалить изображение"
                                        >
                                          🗑️ Удалить
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      </div>

                      {/* Price and CTA */}
                      {(editingBlock.price !== undefined || editingBlock.ctaText !== undefined || editingBlock.type === 'custom' || editingBlock.type === 'detailed') && (
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Цена и кнопка</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Цена
                              </label>
                              <input
                                type="text"
                                value={editingBlock.price || ''}
                                onChange={(e) => {
                                  const updatedBlock = { ...editingBlock, price: e.target.value };
                                  setEditingBlock(updatedBlock);
                                  
                                  // ПРИНУДИТЕЛЬНО ОБНОВЛЯЕМ КОНТЕНТ
                                  const updatedContent = {
                                    ...content,
                                    blocks: content.blocks.map(block => 
                                      block.id === updatedBlock.id ? updatedBlock : block
                                    )
                                  };
                                  onContentChange(updatedContent);
                                }}
                                placeholder={
                                  editingBlock.id === 'can-module' ? '2500' :
                                  editingBlock.id === 'analog-module' ? '1800' :
                                  editingBlock.id === 'ops-module' ? '3200' :
                                  '1500'
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Текст кнопки
                              </label>
                              <input
                                type="text"
                                value={editingBlock.ctaText || ''}
                                onChange={(e) => {
                                  const updatedBlock = { ...editingBlock, ctaText: e.target.value };
                                  setEditingBlock(updatedBlock);
                                  
                                  // ПРИНУДИТЕЛЬНО ОБНОВЛЯЕМ КОНТЕНТ
                                  const updatedContent = {
                                    ...content,
                                    blocks: content.blocks.map(block => 
                                      block.id === updatedBlock.id ? updatedBlock : block
                                    )
                                  };
                                  onContentChange(updatedContent);
                                }}
                                placeholder={
                                  editingBlock.id === 'can-module' ? 'ЗАКАЗАТЬ CAN МОДУЛЬ' :
                                  editingBlock.id === 'analog-module' ? 'ЗАКАЗАТЬ ANALOG МОДУЛЬ' :
                                  editingBlock.id === 'ops-module' ? 'ЗАКАЗАТЬ OPS ЭМУЛЯТОР' :
                                  'ЗАКАЗАТЬ КОНСУЛЬТАЦИЮ'
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      {(editingBlock.type === 'custom' || editingBlock.type === 'detailed') && (
                        <button
                          onClick={() => {
                            updateBlock(editingBlock);
                            setEditingBlock(null);
                          }}
                          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors flex items-center"
                        >
                          <Save className="w-5 h-5 mr-2" />
                          Сохранить изменения
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Выберите блок для редактирования</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Tab */}
          {activeTab === 'navigation' && (
            <div className="flex-1 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Настройки навигации</h3>
              <div className="space-y-4">
                {content.navigation.items.map((item) => (
                  <div key={item.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updatedContent = {
                              ...content,
                              navigation: {
                                ...content.navigation,
                                items: content.navigation.items.map(navItem =>
                                  navItem.id === item.id
                                    ? { ...navItem, title: e.target.value }
                                    : navItem
                                )
                              }
                            };
                            onContentChange(updatedContent);
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updatedContent = {
                            ...content,
                            navigation: {
                              ...content.navigation,
                              items: content.navigation.items.map(navItem =>
                                navItem.id === item.id
                                  ? { ...navItem, isVisible: !navItem.isVisible }
                                  : navItem
                              )
                            }
                          };
                          onContentChange(updatedContent);
                        }}
                        className="ml-4 p-2 hover:bg-gray-700 rounded"
                      >
                        {item.isVisible ? (
                          <Eye className="w-5 h-5 text-green-400" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Editor Modal */}
        {textEditor && (
          <TextEditor
            value={textEditor.value}
            onChange={textEditor.onChange}
            onClose={() => setTextEditor(null)}
            title={textEditor.title}
            placeholder={textEditor.placeholder}
            rows={textEditor.rows}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;