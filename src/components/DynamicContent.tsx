import React, { useState } from 'react';
import { ChevronRight, Eye, Monitor, Check, Play, Gauge, Settings, Shield, Phone, MessageCircle, User, Car, Calendar, MessageSquare, Video, ChevronLeft } from 'lucide-react';
import { ContentBlock, ContentImage, TextStyle } from '../types/content';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

interface DynamicContentProps {
  block: ContentBlock;
  onSubmit?: (formData: any) => void;
  isSubmitted?: boolean;
  formData?: any;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ 
  block, 
  onSubmit, 
  isSubmitted, 
  formData, 
  onInputChange 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollToContacts = () => {
    const element = document.getElementById('contacts');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // Проверяем, является ли блок основным модулем
  const isMainModule = ['can-module', 'analog-module', 'ops-module'].includes(block.id);

  const getTextStyleClasses = (style: TextStyle): string => {
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
      '4xl': 'text-4xl'
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

  const ImageSlider: React.FC<{ images: ContentImage[] }> = ({ images }) => {
    if (images.length === 0) return null;
    
    // Находим главное изображение или берем первое
    const mainImage = images.find(img => img.isMain) || images[0];
    const otherImages = images.filter(img => img.id !== mainImage.id);
    const sortedImages = [mainImage, ...otherImages];
    
    if (images.length === 1) {
      return (
        <img
          src={mainImage.url}
          alt={mainImage.alt}
          className="w-full max-w-2xl h-auto object-contain transform hover:scale-105 transition-transform duration-500"
        />
      );
    }

    return (
      <div className="relative max-w-2xl">
        <img
          src={sortedImages[currentImageIndex].url}
          alt={sortedImages[currentImageIndex].alt}
          className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500"
        />
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sortedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    // Для всех пользовательских блоков используем единый макет
    return (
      <section className="py-6 md:py-16 px-3 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12 items-center">
            <AnimatedSection className="flex flex-col justify-center">
              <div>
                <div className="flex items-center mb-3 md:mb-6">
                  {block.icon && (
                    <div className={`w-8 md:w-16 h-8 md:h-16 border-2 border-${block.color}-400 rounded-xl md:rounded-2xl flex items-center justify-center mr-2 md:mr-4`}>
                      <span className="text-sm md:text-2xl">{block.icon}</span>
                    </div>
                  )}
                  <h2 
                    className={getTextStyleClasses(block.textStyles.title)}
                    style={{ color: block.textStyles.title.color }}
                  >
                    {block.title}
                  </h2>
                </div>
                
                {block.subtitle && (
                  <h3 
                    className={`mb-2 md:mb-4 ${getTextStyleClasses(block.textStyles.subtitle)}`}
                    style={{ color: block.textStyles.subtitle.color }}
                  >
                    {block.subtitle}
                  </h3>
                )}

                {block.description && (
                  <div 
                    className={`mb-2 md:mb-4 ${getTextStyleClasses(block.textStyles.description)}`}
                    style={{ color: block.textStyles.description.color }}
                  >
                    <p>{block.description}</p>
                  </div>
                )}

                {block.content && (
                  <div 
                    className={`mb-4 md:mb-8 ${getTextStyleClasses(block.textStyles.content)}`}
                    style={{ color: block.textStyles.content.color }}
                  >
                    <p>{block.content}</p>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {block.images.length > 0 && (
              <AnimatedSection delay={200}>
                <div className="flex flex-col items-center lg:items-end lg:mr-4 xl:mr-16 mt-6 lg:mt-0">
                  <div className="w-full max-w-md">
                    <div className="relative">
                      {isMainModule && (
                        <div className={`absolute inset-0 ${
                          block.id === 'can-module' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20' :
                          block.id === 'analog-module' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20' :
                          'bg-gradient-to-br from-red-500/20 to-red-600/20'
                        } rounded-2xl md:rounded-3xl blur-2xl md:blur-3xl transform rotate-6`}></div>
                      )}
                      <div className="relative z-10">
                        <div className="scale-90 md:scale-110 origin-center">
                          <ImageSlider images={block.images} />
                        </div>
                      </div>
                    </div>
                    
                    {(block.price || block.ctaText) && (
                      <div className="mt-4 md:mt-6 text-center">
                        {block.price && (
                          <div className={`text-2xl md:text-4xl font-bold mb-3 md:mb-4`} style={{ 
                            color: block.color === 'blue' ? '#22d3ee' : 
                                   block.color === 'yellow' ? '#fbbf24' : 
                                   block.color === 'red' ? '#ef4444' : 
                                   block.color === 'green' ? '#22c55e' : 
                                   block.color === 'purple' ? '#a855f7' : 
                                   block.color === 'teal' ? '#14b8a6' : 
                                   block.color === 'orange' ? '#f97316' : 
                                   block.color === 'pink' ? '#ec4899' : 
                                   block.color === 'indigo' ? '#6366f1' : 
                                   block.color === 'emerald' ? '#10b981' : 
                                   block.color === 'lime' ? '#84cc16' : 
                                   block.color === 'cyan' ? '#06b6d4' : '#22d3ee' 
                          }}>
                            {block.price.includes('₴') ? block.price : `${block.price}₴`}
                          </div>
                        )}
                        {block.ctaText && (
                          <button 
                            onClick={scrollToContacts}
                            className={`px-4 md:px-8 py-3 md:py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm md:text-lg rounded-lg md:rounded-xl transition-all duration-300 w-full md:w-auto ${
                              isMainModule ? 'transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40' : ''
                            }`}
                          >
                            {block.ctaText}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    );
  };

  if (!block.isVisible) return null;

  return (
    <div
      className="relative"
      style={{
        backgroundImage: block.backgroundImage && !block.backgroundImage.startsWith('linear-gradient') && !block.backgroundImage.startsWith('radial-gradient') ? `url(${block.backgroundImage})` : undefined,
        background: block.backgroundImage && (block.backgroundImage.startsWith('linear-gradient') || block.backgroundImage.startsWith('radial-gradient')) ? block.backgroundImage : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {block.backgroundImage && (
        <div className="absolute inset-0 bg-black/40 md:bg-black/60" />
      )}
      {renderContent()}
    </div>
  );
};

export default DynamicContent;