import React, { useState } from 'react';
import { X, Type } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  title: string;
  placeholder?: string;
  rows?: number;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  onClose,
  title,
  placeholder = 'Введите текст...',
  rows = 10
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleSave = () => {
    onChange(localValue);
    onClose();
  };

  const handleCancel = () => {
    setLocalValue(value); // Возвращаем исходное значение
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <Type className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder="Введіть текст..."
            rows={rows}
            className="w-full h-full min-h-[400px] px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors resize-none font-mono text-sm leading-relaxed"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;