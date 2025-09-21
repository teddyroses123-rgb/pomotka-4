import { SiteContent, TextStyle } from '../types/content';

const defaultTextStyle: TextStyle = {
  color: '#ffffff',
  fontSize: 'base',
  fontFamily: 'default',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textAlign: 'left'
};

export const defaultContent: SiteContent = {
  blocks: [
    {
      id: 'hero',
      type: 'hero',
      title: 'ПІДМОТКА СПІДОМЕТРА — У ВАШИХ РУКАХ',
      subtitle: 'Три рішення для точного коригування пробігу. Ніяких зайвих питань.',
      description: '',
      content: '',
      images: [],
      backgroundImage: 'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=1920',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: { ...defaultTextStyle, fontSize: 'xl', color: '#d1d5db', textAlign: 'center' },
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 1,
      showInNav: false
    },
    {
      id: 'features',
      type: 'features',
      title: 'Наші переваги',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '3xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: defaultTextStyle,
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 2,
      showInNav: false
    },
    {
      id: 'modules',
      type: 'modules',
      title: 'Наші модулі',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '3xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: defaultTextStyle,
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 3,
      navTitle: 'Модулі',
      showInNav: true
    },
    {
      id: 'can-module',
      type: 'detailed',
      title: 'CAN ПІДМОТКА',
      subtitle: 'CAN-модуль: точне налаштування без втручання',
      description: 'CAN-модуль призначений для корекції показань одометра через штатну CAN-шину автомобіля. Пристрій не потребує складного встановлення, не викликає помилок в електроніці та не потребує спеціальних знань — достатньо підключити його до діагностичного роз\'єму OBD-II та увімкнути запалювання. Все інше — автоматизовано.',
      content: `Для автомобілів з аналоговими датчиками швидкості або тахографами доступні альтернативні рішення — аналогові модулі, що працюють за класичною схемою.

**Важливо:**
Вартість залежить від марки та моделі авто. При замовленні обов'язково вказуйте:
• Марку автомобіля
• Модель
• Рік випуску
Це необхідно для підтвердження сумісності.

**Підходить для автомобілів:**
• BMW всіх серій (E, F, G серії)
• Mercedes-Benz (W204, W212, W221 та новіші)
• Audi (A4, A6, Q5, Q7 з 2008 року)
• Volkswagen (Passat B7/B8, Tiguan, Touareg)
• Сучасні авто з цифровою приладовою панеллю

Модуль підключається до діагностичного роз'єму OBD-II та працює через CAN-протокол. Не потребує розбирання приладової панелі або втручання в штатну проводку автомобіля.`,
      images: [
        {
          id: 'can-1',
          url: 'https://i.ibb.co/Fkyfsw7V/image.png',
          alt: 'CAN Module'
        }
      ],
      color: 'blue',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold' },
        subtitle: { ...defaultTextStyle, fontSize: '2xl', fontWeight: 'bold', color: '#22d3ee' },
        description: { ...defaultTextStyle, color: '#d1d5db' },
        content: defaultTextStyle
      },
      cardDescription: 'CAN-модуль призначений для корекції показань одометра через штатну CAN-шину автомобіля. Підходить для сучасних авто з цифровою приладовою панеллю.',
      price: '2500',
      ctaText: 'ЗАМОВИТИ CAN ПІДМОТКУ',
      isVisible: true,
      order: 4,
      navTitle: 'CAN',
      showInNav: true
    },
    {
      id: 'analog-module',
      type: 'detailed',
      title: 'АНАЛОГОВА ПІДМОТКА',
      subtitle: 'Аналогова підмотка: надійне рішення для класичних систем',
      description: 'Аналогова підмотка — це простий та ефективний пристрій, призначений для корекції пробігу на автомобілях з датчиком швидкості або тахографом. Вона особливо актуальна для техніки, де цифрові рішення неприйнятні, та потрібен прямий вплив на аналогову систему.',
      content: `Пристрій підключається до живлення через стандартний роз'єм — підключається до 12V або до 24V, що робить його сумісним з легковими та вантажними авто. Залежно від конфігурації автомобіля, з'єднання з сигналами проводки може здійснюватися різними способами. Все продумано для швидкого встановлення без зайвих складнощів.

**Підходить для автомобілів:**
• ВАЗ (Лада) всіх моделей
• ГАЗ (Волга, Газель, Соболь)
• УАЗ (Патріот, Хантер, Буханка)
• Старі іномарки до 2005 року
• Вантажні автомобілі
• Мотоцикли та квадроцикли

**Переваги:**
• Простота встановлення
• Надійність роботи
• Робота з аналоговими спідометрами
• Доступна ціна
• Не потребує програмування
• Універсальність застосування

Пристрій підключається до датчика швидкості або безпосередньо до спідометра. Імітує сигнали датчика швидкості для корекції показань пробігу.`,
      images: [
        {
          id: 'analog-1',
          url: 'https://i.ibb.co/BHNJB1ZG/product-image-of-Ana.png',
          alt: 'Analog Module'
        }
      ],
      color: 'yellow',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold' },
        subtitle: { ...defaultTextStyle, fontSize: '2xl', fontWeight: 'bold', color: '#fbbf24' },
        description: { ...defaultTextStyle, color: '#d1d5db' },
        content: defaultTextStyle
      },
      cardDescription: 'Аналогова підмотка — це простий та ефективний пристрій для корекції пробігу в автомобілях з аналоговими спідометрами.',
      price: '1800',
      ctaText: 'ЗАМОВИТИ АНАЛОГОВУ ПІДМОТКУ',
      isVisible: true,
      order: 5,
      navTitle: 'Аналогова',
      showInNav: true
    },
    {
      id: 'ops-module',
      type: 'detailed',
      title: 'OPS ЕМУЛЯТОР',
      subtitle: 'Емулятор OPS: рішення для помилки B1150 та заміни сидінь',
      description: 'У ряді автомобілів Toyota та Lexus, оснащених системою визначення присутності пасажира (OPS), може виникати невидалима помилка B1150 в блоці управління подушками безпеки (AIRBAG). Причина — вихід з ладу датчика ваги, вбудованого в пасажирське сидіння. Заміна цих датчиків окремо не передбачена: виробник пропонує заміну всього сидіння в зборі, що робить ремонт дорогим та незручним.',
      content: `**Що робить емулятор OPS?**

Наш емулятор повністю замінює оригінальний блок OPS (TOYOTA AISIN), встановлений під пасажирським сидінням. Він імітує коректну роботу системи, усуваючи помилку B1150 та відновлюючи функціональність AIRBAG-блока без втручання в заводську проводку.

**Коли він необхідний?**

• При виході з ладу датчиків ваги в сидінні
• При заміні сидіння на інше (наприклад, від іншої моделі або авто)
• При помилці B1150, яка не видаляється стандартними засобами
• При відсутності блока OPS після переобладнання салону

Емулятор підходить для моделей американського ринку, включаючи Lexus RX 330 / RX 400 / RX 450h, Toyota FJ Cruiser, та інші з аналогічною системою.

**Встановлення**

• Пристрій встановлюється замість штатного блока OPS, який знаходиться під пасажирським сидінням
• Підключення просте та не потребує спеціальних знань — достатньо відключити оригінальний блок (якщо він є) та підключити емулятор
• Фото оригінального блока, який необхідно відключити, можна знайти в розділі нижче

**Консультація**

Перед покупкою ми допоможемо підібрати оптимальне рішення під вашу модель. Уточнимо сумісність, підкажемо щодо підключення та відповімо на всі технічні питання.`,
      images: [
        {
          id: 'ops-1',
          url: 'https://i.ibb.co/PZSM6TYD/product-image-of-OPS.png',
          alt: 'OPS Module'
        }
      ],
      color: 'red',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold' },
        subtitle: { ...defaultTextStyle, fontSize: '2xl', fontWeight: 'bold', color: '#ef4444' },
        description: { ...defaultTextStyle, color: '#d1d5db' },
        content: defaultTextStyle
      },
      cardDescription: 'У ряді автомобілів Toyota та Lexus може виникати невидалима помилка B1150. Наш емулятор OPS вирішує цю проблему.',
      price: '3200',
      ctaText: 'ЗАМОВИТИ OPS ЕМУЛЯТОР',
      isVisible: true,
      order: 6,
      navTitle: 'OPS',
      showInNav: true
    },
    {
      id: 'videos',
      type: 'videos',
      title: 'ВІДЕО ОГЛЯДИ',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      videos: [
        {
          id: 'video-1',
          title: 'CAN модуль в дії',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 'video-2', 
          title: 'OPS емулятор для Toyota',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://images.pexels.com/photos/3846082/pexels-photo-3846082.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: defaultTextStyle,
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 50,
      navTitle: 'Відео',
      showInNav: true
    },
    {
      id: 'contacts',
      type: 'contact',
      title: 'Потрібна консультація? Ми на зв\'язку',
      subtitle: 'Підберемо рішення під вашу модель — швидко та без зайвих формальностей',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: { ...defaultTextStyle, fontSize: 'xl', color: '#d1d5db', textAlign: 'center' },
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 51,
      navTitle: 'Контакти',
      showInNav: true
    }
  ],
  navigation: {
    title: 'Підмотка спідометра',
    items: [
      { id: 'nav-modules', title: 'Модулі', blockId: 'modules', isVisible: true },
      { id: 'nav-can', title: 'CAN', blockId: 'can-module', isVisible: true },
      { id: 'nav-analog', title: 'Аналогова', blockId: 'analog-module', isVisible: true },
      { id: 'nav-ops', title: 'OPS', blockId: 'ops-module', isVisible: true },
      { id: 'nav-videos', title: 'Відео', blockId: 'videos', isVisible: true },
      { id: 'nav-contacts', title: 'Контакти', blockId: 'contacts', isVisible: true }
    ]
  }
};