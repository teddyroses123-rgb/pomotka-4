import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Eye, Monitor, Check, Play, Gauge, Settings, Shield, Phone, MessageCircle, User, Car, Calendar, MessageSquare, Video, Menu, X } from 'lucide-react';
import AdminPanel from './components/admin/AdminPanel';
import LoginForm from './components/admin/LoginForm';
import DynamicContent from './components/DynamicContent';
import { SiteContent } from './types/content';
import { loadContentSync, saveContent, loadContent } from './utils/contentStorage';
import { checkAdminSession } from './utils/auth';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const ModuleCard: React.FC<{
  title: string;
  description: string;
  color: 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'teal';
  delay: number;
  isLarge?: boolean;
}> = ({ title, description, color, delay, isLarge = false }) => {
  const colorClasses = {
    blue: 'border-cyan-400 hover:border-cyan-300 hover:shadow-cyan-400/20',
    yellow: 'border-yellow-400 hover:border-yellow-300 hover:shadow-yellow-400/20',
    red: 'border-red-400 hover:border-red-300 hover:shadow-red-400/20',
    green: 'border-green-400 hover:border-green-300 hover:shadow-green-400/20',
    purple: 'border-purple-400 hover:border-purple-300 hover:shadow-purple-400/20',
    teal: 'border-teal-400 hover:border-teal-300 hover:shadow-teal-400/20'
  };

  const arrowColors = {
    blue: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    teal: 'text-teal-400'
  };

  const titleColors = {
    blue: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    teal: 'text-teal-400'
  };

  return (
    <AnimatedSection delay={delay} className={isLarge ? 'md:col-span-2 lg:col-span-1' : ''}>
      <div className={`border-2 rounded-lg p-4 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer h-full ${colorClasses[color]} ${isLarge ? 'min-h-[200px]' : 'min-h-[180px]'}`}>
        <h3 className={`text-lg font-bold mb-3 ${titleColors[color]}`}>
          {title}
        </h3>
        <p className="text-gray-300 mb-4 leading-relaxed flex-grow text-sm">{description}</p>
        <div className="flex justify-end mt-auto">
          <ChevronRight className={`w-6 h-6 ${arrowColors[color]} group-hover:translate-x-1 transition-transform duration-300`} />
        </div>
      </div>
    </AnimatedSection>
  );
};

const NavigationCard: React.FC<{
  title: string;
  description: string;
  color: 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'teal' | 'orange' | 'pink' | 'indigo' | 'emerald' | 'lime' | 'cyan';
  delay: number;
  onClick: () => void;
}> = ({ title, description, color, delay, onClick }) => {
  const colorClasses = {
    blue: 'border-cyan-400 hover:border-cyan-300 hover:shadow-cyan-400/20',
    yellow: 'border-yellow-400 hover:border-yellow-300 hover:shadow-yellow-400/20',
    red: 'border-red-400 hover:border-red-300 hover:shadow-red-400/20',
    green: 'border-green-400 hover:border-green-300 hover:shadow-green-400/20',
    purple: 'border-purple-400 hover:border-purple-300 hover:shadow-purple-400/20',
    teal: 'border-teal-400 hover:border-teal-300 hover:shadow-teal-400/20',
    orange: 'border-orange-400 hover:border-orange-300 hover:shadow-orange-400/20',
    pink: 'border-pink-400 hover:border-pink-300 hover:shadow-pink-400/20',
    indigo: 'border-indigo-400 hover:border-indigo-300 hover:shadow-indigo-400/20',
    emerald: 'border-emerald-400 hover:border-emerald-300 hover:shadow-emerald-400/20',
    lime: 'border-lime-400 hover:border-lime-300 hover:shadow-lime-400/20',
    cyan: 'border-cyan-400 hover:border-cyan-300 hover:shadow-cyan-400/20'
  };

  const arrowColors = {
    blue: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    teal: 'text-teal-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    lime: 'text-lime-400',
    cyan: 'text-cyan-400'
  };

  const titleColors = {
    blue: 'text-cyan-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    teal: 'text-teal-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    lime: 'text-lime-400',
    cyan: 'text-cyan-400'
  };

  return (
    <AnimatedSection delay={delay}>
      <div 
        className={`border-2 rounded-lg p-3 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer h-full ${colorClasses[color]} min-h-[140px]`}
        onClick={onClick}
      >
        <h3 className={`text-sm font-bold mb-2 ${titleColors[color]}`}>
          {title}
        </h3>
        <p className="text-gray-300 mb-3 leading-relaxed flex-grow text-xs line-clamp-3">{description}</p>
        <div className="flex justify-end mt-auto">
          <ChevronRight className={`w-4 h-4 ${arrowColors[color]} group-hover:translate-x-1 transition-transform duration-300`} />
        </div>
      </div>
    </AnimatedSection>
  );
};

const VideoCard: React.FC<{
  title: string;
  thumbnail: string;
  videoUrl: string;
  delay: number;
}> = ({ title, thumbnail, videoUrl, delay }) => {
  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return null;
  };

  const embedUrl = getVideoEmbedUrl(videoUrl);
  
  if (embedUrl) {
    return (
      <AnimatedSection delay={delay}>
        <div className="relative rounded-lg overflow-hidden group bg-gray-900/50 backdrop-blur-sm border border-gray-700">
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <h3 className="text-white font-bold text-center">{title}</h3>
          </div>
        </div>
      </AnimatedSection>
    );
  }
  
  return (
    <AnimatedSection delay={delay}>
      <div 
        className="relative rounded-lg overflow-hidden group cursor-pointer bg-gray-900/50 backdrop-blur-sm border border-gray-700"
        onClick={() => window.open(videoUrl, '_blank')}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-bold">{title}</h3>
        </div>
      </div>
    </AnimatedSection>
  );
};

const FeatureIcon: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => (
  <AnimatedSection delay={delay}>
    <div className="text-center group px-2">
      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 border-2 border-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-yellow-300">
        {icon}
      </div>
      <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-2">{title}</h3>
      <p className="text-xs md:text-base text-gray-300 leading-relaxed px-1">{description}</p>
    </div>
  </AnimatedSection>
);

function App() {
  const [content, setContent] = useState<SiteContent>(loadContentSync());
  
  // Функция для получения стилей текста из блока
  const getTextStyleClasses = (blockId: string, styleType: 'title' | 'subtitle' | 'description' | 'content'): string => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block || !block.textStyles || !block.textStyles[styleType]) {
      return '';
    }
    
    const style = block.textStyles[styleType];
    const classes = [];
    
    // Font size
    const sizeMap = {
      'xs': 'text-xs',
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl'
    };
    classes.push(sizeMap[style.fontSize] || 'text-base');

    // Font family
    const fontMap = {
      'default': 'font-sans',
      'serif': 'font-serif',
      'mono': 'font-mono',
      'sans': 'font-sans'
    };
    classes.push(fontMap[style.fontFamily] || 'font-sans');

    // Font weight
    if (style.fontWeight === 'bold') classes.push('font-bold');

    // Font style
    if (style.fontStyle === 'italic') classes.push('italic');

    // Text decoration
    if (style.textDecoration === 'underline') classes.push('underline');

    // Text align
    const alignMap = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right'
    };
    classes.push(alignMap[style.textAlign] || 'text-left');

    return classes.join(' ');
  };
  
  // Функция для получения цвета текста из блока
  const getTextColor = (blockId: string, styleType: 'title' | 'subtitle' | 'description' | 'content'): string => {
    const block = content.blocks.find(b => b.id === blockId);
    if (!block || !block.textStyles || !block.textStyles[styleType]) {
      return '';
    }
    return block.textStyles[styleType].color;
  };

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegramNick: '',
    carBrand: '',
    carModel: '',
    year: '',
    comment: '',
    messenger: 'telegram',
  });
  
  // Загружаем актуальный контент при монтировании компонента
  useEffect(() => {
    const loadLatestContent = async () => {
      try {
        const latestContent = await loadContent();
        setContent(latestContent);
      } catch (error) {
        console.error('Error loading latest content:', error);
      }
    };
    
    loadLatestContent();
  }, []);
  
  // Периодически проверяем обновления контента (каждые 30 секунд)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const latestContent = await loadContent();
        // Сравниваем с текущим контентом и обновляем если есть изменения
        if (JSON.stringify(latestContent) !== JSON.stringify(content)) {
          console.log('Content updated from database');
          setContent(latestContent);
        }
      } catch (error) {
        console.error('Error checking for content updates:', error);
      }
    }, 30000); // 30 секунд
    
    return () => clearInterval(interval);
  }, [content]);
  
  // Save content to localStorage when it changes
  useEffect(() => {
    saveContent(content).catch(console.error);
  }, [content]);

  // Check admin session on component mount
  useEffect(() => {
    setIsAuthenticated(checkAdminSession());
    
    // Слушаем события сохранения контента
    const handleContentSaved = (event: CustomEvent) => {
      const { success, error } = event.detail;
      if (success) {
        setSaveStatus('saved');
        setSaveMessage('Зміни збережено');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveMessage(error || 'Помилка збереження. Дані збережено локально.');
        setTimeout(() => setSaveStatus('idle'), 5000);
      }
    };
    
    window.addEventListener('contentSaved', handleContentSaved as EventListener);
    
    return () => {
      window.removeEventListener('contentSaved', handleContentSaved as EventListener);
    };
  }, []);

  const handleContentChange = async (newContent: SiteContent) => {
    console.log('📝 ИЗМЕНЕНИЕ КОНТЕНТА В APP:', newContent.blocks.map(b => ({ id: b.id, price: b.price, ctaText: b.ctaText })));
    setSaveStatus('saving');
    setSaveMessage('Збереження...');
    setContent(newContent);
    await saveContent(newContent);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendTelegramMessage = async (data: typeof formData) => {
    try {
      console.log('Отправляем данные:', formData);
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase не настроен');
        return false;
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(data)
      });

      console.log('Статус ответа:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка HTTP:', response.status, errorText);
        return false;
      }
      
      const result = await response.json();
      console.log('Результат:', result);
      
      if (result.success) {
        console.log('Сообщение отправлено в Telegram');
        return true;
      } else {
        console.error('Ошибка:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Отправляем форму:', formData);
    
    const success = await sendTelegramMessage(formData);
    
    if (success) {
      console.log('Сообщение успешно отправлено');
    } else {
      console.log('Ошибка при отправке сообщения');
    }

    // Показываем сообщение об успехе в любом случае
    setIsSubmitted(true);
    setFormData({
      name: '',
      phone: '',
      telegramNick: '',
      carBrand: '',
      carModel: '',
      year: '',
      comment: '',
      messenger: 'telegram',
    });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleAdminButtonClick = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (success: boolean) => {
    console.log('Login result:', success);
    if (success) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setIsAdminOpen(true);
    } else {
      console.log('Login failed');
    }
  };

  const visibleNavItems = content.navigation.items.filter(item => item.isVisible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10" />
      
      {/* Save Status Notification - Only for authenticated users */}
      {isAuthenticated && saveStatus !== 'idle' && (
        <div className={`fixed top-20 right-4 z-30 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          saveStatus === 'saved' ? 'bg-green-500 text-white' :
          saveStatus === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saveStatus === 'saved' && <Check className="w-4 h-4" />}
            {saveStatus === 'error' && <X className="w-4 h-4" />}
            <span className="text-sm">{saveMessage}</span>
          </div>
        </div>
      )}

      {/* Top Contact Bar */}
      <div className="relative z-20 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Phone Number */}
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-yellow-400 mr-2" />
              <a 
                href="tel:+380991604786" 
                className="text-white hover:text-yellow-400 transition-colors font-medium"
              >
                099 160 47 86
              </a>
            </div>
            
            {/* Messengers and Video Button */}
            <div className="flex items-center gap-4">
              {/* Mobile Navigation Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.blockId)}
                    className="px-3 py-1 text-sm text-white hover:text-yellow-400 transition-colors font-medium"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <a 
                  href="https://t.me/+380991604786" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 hover:scale-110 transition-transform duration-200"
                  title="Telegram"
                >
                  <img 
                    src="https://i.ibb.co/B2f4hgKq/free-icon-telegram-2111646.png" 
                    alt="Telegram" 
                    className="w-full h-full object-contain"
                  />
                </a>
                <a 
                  href="https://wa.me/380991604786" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-7 h-7 hover:scale-110 transition-transform duration-200"
                  title="WhatsApp"
                >
                  <img 
                    src="https://i.ibb.co/YTJGkwDQ/Whats-App-icon-with-t.png" 
                    alt="WhatsApp" 
                    className="w-full h-full object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.blockId);
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl text-white hover:text-yellow-400 transition-colors font-medium"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection>
            <h1 
              className={`mb-6 leading-tight ${getTextStyleClasses('hero', 'title')}`}
              style={{ color: getTextColor('hero', 'title') || '#ffffff' }}
            >
              {content.blocks.find(b => b.id === 'hero')?.title || 'ПІДМОТКА СПІДОМЕТРА — У ВАШИХ РУКАХ'}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p 
              className={`mb-8 max-w-3xl mx-auto leading-relaxed ${getTextStyleClasses('hero', 'subtitle')}`}
              style={{ color: getTextColor('hero', 'subtitle') || '#d1d5db' }}
            >
              {content.blocks.find(b => b.id === 'hero')?.subtitle || 'Три рішення для точного коригування пробігу. Ніяких зайвих питань.'}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:+380991604786"
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40"
              >
                ЗАМОВИТИ ПРИСТРІЙ
              </a>
              <a 
                href="https://t.me/+380991604786" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg rounded-xl transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contacts');
                }}
              >
                ОТРИМАТИ КОНСУЛЬТАЦІЮ
              </a>
              <button 
                onClick={() => scrollToSection('videos')}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center"
              >
                <Video className="w-5 h-5 mr-2" />
                ВІДЕО
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16 px-3 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            <FeatureIcon
              icon={<Eye className="w-4 h-4 md:w-8 md:h-8 text-yellow-400" />}
              title="СТАРТОВА КОНСУЛЬТАЦІЯ"
              description="Перед тим як почати — слухаємо, аналізуємо, пропонуємо найкраще рішення"
              delay={100}
            />
            <FeatureIcon
              icon={<Monitor className="w-4 h-4 md:w-8 md:h-8 text-yellow-400" />}
              title="ЗВОРОТНІЙ ЗВ'ЯЗОК"
              description="Робота без втручання в штатну проводку автомобіля"
              delay={200}
            />
            <FeatureIcon
              icon={<Shield className="w-4 h-4 md:w-8 md:h-8 text-yellow-400" />}
              title="ІНДИВІДУАЛЬНИЙ ПІДХІД"
              description="Індивідуальна консультація кожного клієнта"
              delay={300}
            />
            <FeatureIcon
              icon={<Gauge className="w-4 h-4 md:w-8 md:h-8 text-yellow-400" />}
              title="ГАРАНТІЯ РЕЗУЛЬТАТУ"
              description="Гарантія на всі виконані роботи та встановлене обладнання"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Основные модули */}
            <NavigationCard
              title={content.blocks.find(b => b.id === 'can-module')?.navTitle || content.blocks.find(b => b.id === 'can-module')?.title || "CAN ПІДМОТКА"}
              description={content.blocks.find(b => b.id === 'can-module')?.cardDescription || content.blocks.find(b => b.id === 'can-module')?.description || "CAN-модуль призначений для корекції показань одометра через штатну CAN-шину автомобіля. Підходить для сучасних авто з цифровою приладовою панеллю."}
              color="blue"
              delay={100}
              onClick={() => scrollToSection('can-module')}
            />
            <NavigationCard
              title={content.blocks.find(b => b.id === 'analog-module')?.navTitle || content.blocks.find(b => b.id === 'analog-module')?.title || "АНАЛОГОВА ПІДМОТКА"}
              description={content.blocks.find(b => b.id === 'analog-module')?.cardDescription || content.blocks.find(b => b.id === 'analog-module')?.description || "Аналогова підмотка — це простий та ефективний пристрій для корекції пробігу в автомобілях з аналоговими спідометрами."}
              color="yellow"
              delay={200}
              onClick={() => scrollToSection('analog-module')}
            />
            <NavigationCard
              title={content.blocks.find(b => b.id === 'ops-module')?.navTitle || content.blocks.find(b => b.id === 'ops-module')?.title || "OPS ЕМУЛЯТОР"}
              description={content.blocks.find(b => b.id === 'ops-module')?.cardDescription || content.blocks.find(b => b.id === 'ops-module')?.description || "У ряді автомобілів Toyota та Lexus може виникати невидалима помилка B1150. Наш емулятор OPS вирішує цю проблему."}
              color="red"
              delay={300}
              onClick={() => scrollToSection('ops-module')}
            />
            
            {/* Динамические карточки для пользовательских блоков */}
            {content.blocks
              .filter(block => block.isVisible && block.type === 'custom')
              .sort((a, b) => a.order - b.order)
              .map((block, index) => (
                <NavigationCard
                  key={block.id}
                  title={block.navTitle || block.title}
                  description={block.cardDescription || block.content || block.description || block.subtitle || 'Опис блоку'}
                  color={block.color as any}
                  delay={400 + index * 100}
                  onClick={() => scrollToSection(block.id)}
                />
              ))}
          </div>
        </div>
      </section>

      {/* CAN Module Detailed Section */}
      <section id="can-module" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <h2 
                  className={`mb-6 ${getTextStyleClasses('can-module', 'title')}`}
                  style={{ color: getTextColor('can-module', 'title') || '#ffffff' }}
                >
                    {content.blocks.find(b => b.id === 'can-module')?.title || 'CAN ПІДМОТКА'}
                  </h2>
                
                <h3 
                  className={`mb-4 ${getTextStyleClasses('can-module', 'subtitle')}`}
                  style={{ color: getTextColor('can-module', 'subtitle') || '#22d3ee' }}
                >
                  {content.blocks.find(b => b.id === 'can-module')?.subtitle || 'CAN-модуль: точне налаштування без втручання'}
                </h3>
                
                <div className="mb-8">
                  <p 
                    className={`mb-4 ${getTextStyleClasses('can-module', 'description')}`}
                    style={{ color: getTextColor('can-module', 'description') || '#d1d5db' }}
                  >
                    {content.blocks.find(b => b.id === 'can-module')?.description || 'CAN-модуль призначений для корекції показань одометра через штатну CAN-шину автомобіля. Пристрій не потребує складного встановлення, не викликає помилок в електроніці та не потребує спеціальних знань — достатньо підключити його до діагностичного роз\'єму OBD-II та увімкнути запалювання. Все інше — автоматизовано.'}
                  </p>
                  <div 
                    className={`whitespace-pre-line ${getTextStyleClasses('can-module', 'content')}`}
                    style={{ color: getTextColor('can-module', 'content') || '#d1d5db' }}
                  >
                    {content.blocks.find(b => b.id === 'can-module')?.content || 'Для автомобілів з аналоговими датчиками швидкості або тахографами доступні альтернативні рішення — аналогові модулі, що працюють за класичною схемою.'}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="flex justify-center lg:justify-end">
                <div className="flex flex-col items-end lg:mr-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-3xl blur-3xl transform rotate-6"></div>
                    <div className="relative z-10">
                      <img
                        src="https://i.ibb.co/Fkyfsw7V/image.png"
                        alt="CAN Module"
                        className="w-full max-w-md h-auto object-contain transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {content.blocks.find(b => b.id === 'can-module')?.price || '2500'}₴
                    </div>
                    <button 
                      onClick={() => scrollToSection('contacts')}
                      className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40"
                    >
                      {content.blocks.find(b => b.id === 'can-module')?.ctaText || 'ЗАМОВИТИ CAN ПІДМОТКУ'}
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Analog Module Detailed Section */}
      <section id="analog-module" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <h2 
                  className={`mb-6 ${getTextStyleClasses('analog-module', 'title')}`}
                  style={{ color: getTextColor('analog-module', 'title') || '#ffffff' }}
                >
                    {content.blocks.find(b => b.id === 'analog-module')?.title || 'АНАЛОГОВА ПІДМОТКА'}
                  </h2>
                
                <h3 
                  className={`mb-4 ${getTextStyleClasses('analog-module', 'subtitle')}`}
                  style={{ color: getTextColor('analog-module', 'subtitle') || '#fbbf24' }}
                >
                  {content.blocks.find(b => b.id === 'analog-module')?.subtitle || 'Аналогова підмотка: надійне рішення для класичних систем'}
                </h3>
                
                <div className="mb-8">
                  <p 
                    className={`mb-4 ${getTextStyleClasses('analog-module', 'description')}`}
                    style={{ color: getTextColor('analog-module', 'description') || '#d1d5db' }}
                  >
                    {content.blocks.find(b => b.id === 'analog-module')?.description || 'Аналогова підмотка — це простий та ефективний пристрій, призначений для корекції пробігу на автомобілях з датчиком швидкості або тахографом. Вона особливо актуальна для техніки, де цифрові рішення неприйнятні, та потрібен прямий вплив на аналогову систему.'}
                  </p>
                  <div 
                    className={`whitespace-pre-line ${getTextStyleClasses('analog-module', 'content')}`}
                    style={{ color: getTextColor('analog-module', 'content') || '#d1d5db' }}
                  >
                    {content.blocks.find(b => b.id === 'analog-module')?.content || 'Пристрій підключається до живлення через стандартний роз\'єм — підключається до 12V або до 24V, що робить його сумісним з легковими та вантажними авто.'}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="flex justify-center lg:justify-end">
                <div className="flex flex-col items-end lg:mr-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-3xl blur-3xl transform rotate-6"></div>
                    <div className="relative z-10">
                      <img
                        src="https://i.ibb.co/BHNJB1ZG/product-image-of-Ana.png"
                        alt="Analog Module"
                        className="w-full max-w-md h-auto object-contain transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {content.blocks.find(b => b.id === 'analog-module')?.price || '1800'}₴
                    </div>
                    <button 
                      onClick={() => scrollToSection('contacts')}
                      className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40"
                    >
                      {content.blocks.find(b => b.id === 'analog-module')?.ctaText || 'ЗАМОВИТИ АНАЛОГОВУ ПІДМОТКУ'}
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* OPS Module Detailed Section */}
      <section id="ops-module" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <h2 
                  className={`mb-6 ${getTextStyleClasses('ops-module', 'title')}`}
                  style={{ color: getTextColor('ops-module', 'title') || '#ffffff' }}
                >
                    {content.blocks.find(b => b.id === 'ops-module')?.title || 'OPS ЕМУЛЯТОР'}
                  </h2>
                
                <h3 
                  className={`mb-4 ${getTextStyleClasses('ops-module', 'subtitle')}`}
                  style={{ color: getTextColor('ops-module', 'subtitle') || '#ef4444' }}
                >
                  {content.blocks.find(b => b.id === 'ops-module')?.subtitle || 'Емулятор OPS: рішення для помилки B1150 та заміни сидінь'}
                </h3>
                
                <div className="mb-8">
                  <p 
                    className={`mb-4 ${getTextStyleClasses('ops-module', 'description')}`}
                    style={{ color: getTextColor('ops-module', 'description') || '#d1d5db' }}
                  >
                    {content.blocks.find(b => b.id === 'ops-module')?.description || 'У ряді автомобілів Toyota та Lexus, оснащених системою визначення присутності пасажира (OPS), може виникати невидалима помилка B1150 в блоці управління подушками безпеки (AIRBAG). Причина — вихід з ладу датчика ваги, вбудованого в пасажирське сидіння.'}
                  </p>
                  <div 
                    className={`whitespace-pre-line ${getTextStyleClasses('ops-module', 'content')}`}
                    style={{ color: getTextColor('ops-module', 'content') || '#d1d5db' }}
                  >
                    {content.blocks.find(b => b.id === 'ops-module')?.content || 'Наш емулятор повністю замінює оригінальний блок OPS (TOYOTA AISIN), встановлений під пасажирським сидінням. Він імітує коректну роботу системи, усуваючи помилку B1150 та відновлюючи функціональність AIRBAG-блока без втручання в заводську проводку.'}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="flex justify-center lg:justify-end">
                <div className="flex flex-col items-end lg:mr-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-3xl blur-3xl transform rotate-6"></div>
                    <div className="relative z-10">
                      <img
                        src="https://i.ibb.co/PZSM6TYD/product-image-of-OPS.png"
                        alt="OPS Module"
                        className="w-full max-w-md h-auto object-contain transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">
                      {content.blocks.find(b => b.id === 'ops-module')?.price || '3200'}₴
                    </div>
                    <button 
                      onClick={() => scrollToSection('contacts')}
                      className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40"
                    >
                      {content.blocks.find(b => b.id === 'ops-module')?.ctaText || 'ЗАМОВИТИ OPS ЕМУЛЯТОР'}
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Dynamic Content Blocks from Admin */}
      {content.blocks
        .filter(block => block.isVisible && block.type === 'custom')
        .sort((a, b) => a.order - b.order)
        .map(block => (
          <div key={block.id} id={block.id}>
            <DynamicContent
              block={block}
            />
          </div>
        ))}

      {/* Videos Section - AFTER custom blocks */}
      <section id="videos" className="py-8 md:py-16 px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8 md:mb-16">
              {content.blocks.find(b => b.id === 'videos')?.title || 'ВІДЕО ОГЛЯДИ'}
            </h2>
          </AnimatedSection>
          {(() => {
            const videosBlock = content.blocks.find(b => b.id === 'videos');
            const videos = videosBlock?.videos || [];
            console.log('🎬 Отображаем видео:', videos);
            
            if (videos.length === 0) {
              return (
                <div className="text-center text-gray-400">
                  <p>Відео не додані</p>
                </div>
              );
            }

            const VideoSection = () => {
              const [showAllVideos, setShowAllVideos] = useState(false);
              const visibleVideos = showAllVideos ? videos : videos.slice(0, 3);
              const hasMoreVideos = videos.length > 3;
              
              return (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {visibleVideos.map((video, index) => (
                      <VideoCard
                        key={video.id}
                        title={video.title}
                        thumbnail={video.thumbnail || 'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        videoUrl={video.url}
                        delay={100 + index * 100}
                      />
                    ))}
                  </div>
                  
                  {hasMoreVideos && (
                    <div className="text-center mt-4 md:mt-8">
                      <button
                        onClick={() => setShowAllVideos(!showAllVideos)}
                        className="px-3 md:px-6 py-2 md:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs md:text-base rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {showAllVideos ? 'Приховати відео' : `Дивитися ще відео (${videos.length - 3})`}
                      </button>
                    </div>
                  )}
                </div>
              );
            };
            
            return <VideoSection />;
          })()}
        </div>
      </section>

      {/* Contact Section - AFTER videos */}
      <section id="contacts" className="py-6 md:py-16 px-3 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            <AnimatedSection>
              <h2 className="text-xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                Потрібна консультація? Ми на зв'язку
              </h2>
              <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto">
                Підберемо рішення під вашу модель — швидко та без зайвих формальностей
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            {/* Contact Info */}
            <AnimatedSection delay={100}>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-6 flex items-center">
                  <Phone className="w-5 md:w-8 h-5 md:h-8 text-yellow-400 mr-2 md:mr-3" />
                  Прямий дзвінок
                </h3>
                
                <div className="mb-4 md:mb-8">
                  <div className="text-xl md:text-3xl font-bold text-yellow-400 mb-2">
                    099 160 47 86
                  </div>
                  <p className="text-gray-300 mb-3 md:mb-6 text-xs md:text-base">
                    Дзвоніть з 9:00 до 21:00 без вихідних
                  </p>
                  
                  <a 
                    href="tel:+380991604786"
                    className="inline-flex items-center justify-center px-3 md:px-8 py-2 md:py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm md:text-lg rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40 w-full md:w-auto"
                  >
                    <Phone className="w-3 md:w-5 h-3 md:h-5 mr-1 md:mr-2" />
                    ПОДЗВОНИТИ
                  </a>
                </div>

                <div className="border-t border-gray-700 pt-3 md:pt-6">
                  <h4 className="text-sm md:text-lg font-bold text-white mb-2 md:mb-4 flex items-center">
                    <MessageCircle className="w-4 md:w-6 h-4 md:h-6 text-yellow-400 mr-2" />
                    Месенджери
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                    <a 
                      href="https://t.me/+380991604786" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-300 text-xs md:text-base"
                    >
                      Telegram
                    </a>
                    <a 
                      href="https://wa.me/380991604786" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 text-xs md:text-base"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={200}>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-6">
                  Форма заявки
                </h3>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1 text-xs">
                        <User className="w-3 h-3 inline mr-1" />
                        Ім'я *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                        placeholder="Ваше ім'я"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1 text-xs">
                        <Phone className="w-3 h-3 inline mr-1" />
                        Номер телефону *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                        placeholder="+380991234567"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1 text-xs">
                        <MessageCircle className="w-3 h-3 inline mr-1" />
                        Нікнейм в Telegram
                      </label>
                      <input
                        type="text"
                        name="telegramNick"
                        value={formData.telegramNick}
                        onChange={handleInputChange}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                        placeholder="@username (необов'язково)"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      <div>
                        <label className="block text-gray-300 font-medium mb-1 text-xs">
                          <Car className="w-3 h-3 inline mr-1" />
                          Марка авто
                        </label>
                        <input
                          type="text"
                          name="carBrand"
                          value={formData.carBrand}
                          onChange={handleInputChange}
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                          placeholder="Toyota, BMW, ВАЗ..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-1 text-xs">
                          Модель
                        </label>
                        <input
                          type="text"
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleInputChange}
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                          placeholder="Camry, X5, Priora..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1 text-xs">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Рік випуску
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        min="1990"
                        max="2025"
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                        placeholder="2020"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1 text-xs">
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        Коментар / завдання
                      </label>
                      <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors resize-none text-xs md:text-sm"
                        placeholder="Опишіть ваше завдання або питання..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1 text-xs">
                        Бажаний месенджер
                      </label>
                      <select
                        name="messenger"
                        value={formData.messenger}
                        onChange={handleInputChange}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none transition-colors text-xs md:text-sm"
                      >
                        <option value="telegram">Telegram</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      * — обов'язкові поля
                    </p>

                    <button
                      type="submit"
                      className="w-full py-2 md:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs md:text-base rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40 mt-3 md:mt-6"
                    >
                      ПРОКОНСУЛЬТУВАТИСЯ
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 md:py-12">
                    <div className="w-10 md:w-16 h-10 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Check className="w-5 md:w-8 h-5 md:h-8 text-white" />
                    </div>
                    <h4 className="text-lg md:text-2xl font-bold text-white mb-2">
                      Дякуємо!
                    </h4>
                    <p className="text-gray-300 text-xs md:text-base">
                      Ваша заявка відправлена! Ми зв'яжемося з вами найближчим часом.
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
          
          {/* Admin Link - moved to bottom after contacts */}
          <div className="text-center mt-8">
            <button
              onClick={handleAdminButtonClick}
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              Адмін
            </button>
          </div>
        </div>
      </section>

      {/* Login Form */}
      {showLogin && (
        <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}

      {/* Admin Panel */}
      {isAuthenticated && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          content={content}
          onContentChange={handleContentChange}
        />
      )}
    </div>
  );
}

export default App;