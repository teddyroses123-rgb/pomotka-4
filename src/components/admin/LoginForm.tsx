import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, X } from 'lucide-react';

interface LoginFormProps {
  onLogin: (success: boolean) => void;
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login with:', credentials.username, credentials.password);

    // Проверяем учетные данные
    if (credentials.username === 'NikolayAdmin' && credentials.password === 'podmotka1122') {
      console.log('Credentials match, logging in...');
      // Сохраняем сессию в localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        username: credentials.username,
        loginTime: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 часа
      }));
      
      setTimeout(() => {
        setIsLoading(false);
        onLogin(true);
      }, 1000);
    } else {
      console.log('Invalid credentials');
      setTimeout(() => {
        setIsLoading(false);
        setError('Неверный логин или пароль');
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md mx-4">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Вхід в адмінку</h2>
          <p className="text-gray-400">Введіть облікові дані для доступу</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Логін
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="Введіть логін"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="Введіть пароль"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">Невірний логін або пароль</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'УВІЙТИ'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Доступ тільки для адміністраторів
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;