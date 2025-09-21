export interface TextStyle {
  color: string;
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontFamily: 'default' | 'serif' | 'mono' | 'sans';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
}

export interface ContentImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isMain?: boolean;
}

export interface ContentBlock {
  id: string;
  type: 'hero' | 'features' | 'modules' | 'detailed' | 'videos' | 'contact' | 'custom';
  title: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images: ContentImage[];
  videos?: Array<{
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
  }>;
  backgroundImage?: string;
  icon?: string;
  color?: 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'gray' | 'orange' | 'pink' | 'teal' | 'indigo' | 'lime' | 'emerald' | 'cyan';
  price?: string;
  ctaText?: string;
  cardDescription?: string;
  textStyles: {
    title: TextStyle;
    subtitle: TextStyle;
    description: TextStyle;
    content: TextStyle;
  };
  isVisible: boolean;
  order: number;
  navTitle?: string;
  showInNav: boolean;
}

export interface SiteContent {
  blocks: ContentBlock[];
  navigation: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      blockId: string;
      isVisible: boolean;
    }>;
  };
}
</parameter>