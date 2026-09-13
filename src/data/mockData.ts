import { Product, Category, Coupon, Order, UserProfile, Banner, ChatMessage, ChatUser, NotificationItem, HomeSection, SupportAdmin, FlashSaleSectionConfig } from '../types';

export const DEFAULT_FLASH_SALE_CONFIG: FlashSaleSectionConfig = {
  id: 'flash_sales_config',
  isActive: true,
  title: 'Günün Flaş Endirimləri',
  subtitle: 'Məhdud sayda stoka malik məhsullar üçün 70%-dək qiymət endirimi!',
  discountPercent: 70,
  discountBadgeText: '70%-dək Endirim',
  hasTimer: true,
  timerMode: 'continuous_daily',
  dailyResetHours: 6,
  timerHours: 5,
  timerMinutes: 42,
  timerSeconds: 18,
  gradientFrom: '#ea580c', // orange-600
  gradientVia: '#dc2626', // red-600
  gradientTo: '#d97706', // amber-600
  backgroundImageUrl: '',
  backgroundOverlayOpacity: 70,
  bannerIcon: 'flame',
  buttons: [
    {
      id: 'btn-1',
      label: '🔥 Flaş Satış',
      tagFilter: 'flash_sale',
      actionType: 'tag_filter',
      order: 1
    },
    {
      id: 'btn-2',
      label: '⭐ Ən Çox Satılanlar',
      tagFilter: 'best_seller',
      actionType: 'tag_filter',
      order: 2
    },
    {
      id: 'btn-3',
      label: '💎 Sənin üçün Seçdik',
      tagFilter: 'for_you',
      actionType: 'tag_filter',
      order: 3
    },
    {
      id: 'btn-4',
      label: 'Bütün Məhsullar →',
      tagFilter: 'all',
      actionType: 'all_products',
      order: 4
    }
  ],
  showProducts: true,
  productSource: 'manual',
  productIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'],
  maxProductsCount: 8
};


export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Elektronika & Qadcetlər',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    productCount: 142,
    badge: '🔥 Ən Çox Satılan'
  },
  {
    id: 'fashion',
    name: 'Geyim',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
    productCount: 205,
    badge: 'KOLLEKSİYA'
  },
  {
    id: 'clothing_kids',
    name: '👦 Uşaq Geyimləri',
    iconName: 'Smile',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&q=80',
    productCount: 45,
    badge: '👦 Uşaq',
    parentId: 'fashion'
  },
  {
    id: 'clothing_girls',
    name: '👧 Qız Geyimləri',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5c1?w=500&q=80',
    productCount: 68,
    badge: '👧 Qız',
    parentId: 'fashion'
  },
  {
    id: 'clothing_men',
    name: '👨 Kişi Geyimləri',
    iconName: 'User',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500&q=80',
    productCount: 92,
    badge: '👨 Kişi',
    parentId: 'fashion'
  },
  {
    id: 'home',
    name: 'Ev & Mətbəx Rahatlığı',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&q=80',
    productCount: 185
  },
  {
    id: 'gaming',
    name: 'Gaming & Aksessuar',
    iconName: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
    productCount: 96,
    badge: '-40% Flaş'
  },
  {
    id: 'beauty',
    name: 'Gözəllik & Baxım',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
    productCount: 130
  },
  {
    id: 'watches',
    name: 'Smart Saatlar & Zinət',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    productCount: 78
  },
  {
    id: 'audio',
    name: 'Qulaqlıqlar & Audio',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    productCount: 64
  },
  {
    id: 'sports',
    name: 'İdman & Səyahət',
    iconName: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80',
    productCount: 88
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'MMZ Pro ANC 3D Simsiz Bluetooth Qulaqlıq',
    subtitle: 'Aktiv Küy Ləğvetmə (ANC), 40 saat batareya ömrü, Hi-Fi Bass',
    description: 'MMZ Pro ANC Qulaqlıqları premium səs keyfiyyəti, dərin bas və kristal təmiz zənglər təmin edir. Yumşaq erqonomik yastıqları ilə gün boyu yorulmadan musiqi dinləyin. 3D Spatial Audio texnologiyası ilə kinoteatr effekti yaradır.',
    price: 49.99,
    oldPrice: 119.99,
    discountPercent: 58,
    category: 'Qulaqlıqlar & Audio',
    categoryId: 'audio',
    rating: 4.9,
    reviewsCount: 342,
    salesCount: 2150,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
    ],
    colors: ['Mat Qara', 'Gümüşü Ağ', 'Kosmik Göy'],
    tags: ['flash_sale', 'top_seller', 'for_you'],
    brand: 'MMZ Acoustics',
    specs: {
      'Bluetooth Versiyası': '5.3 Ultra Low Latency',
      'Batareya Tutumu': '650 mAh (40 saat fasiləsiz)',
      'Şarj Vaxtı': 'USB-C Fast Charge (15 dəqiqə = 5 saat)',
      'Səs Rejimləri': 'ANC, Şəffaflıq (Transparency), Game Mode'
    },
    isFreeDelivery: true,
    recentOrdersCount: 148,
    deliveryDays: 'Bugün və ya 24 saat ərzində',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Elvin Məmmədov',
        rating: 5,
        date: '2 gün əvvəl',
        comment: 'Səsi inanılmaz dərəcədə təmizdir. ANC funksiyası küçə səs-küyünü tam kəsir. Bu qiymətə bazarda tayı-bərabəri yoxdur!',
        verifiedPurchase: true,
        likes: 24
      },
      {
        id: 'rev-2',
        userName: 'Nərgiz Əliyeva',
        rating: 5,
        date: '5 gün əvvəl',
        comment: 'Dizaynı çox zərif və qulağı incitmir. Sürətli kuryer çatdırdı, paketləmə əla idi.',
        verifiedPurchase: true,
        likes: 12
      }
    ]
  },
  {
    id: 'prod-2',
    title: 'MMZ Ultra Watch 9 AMOLED Smart Saat',
    subtitle: 'NFC, Ürək döyüntüsü və qan təzyiqi sensoru, Bluetooth Zəng',
    description: 'Titanium korpus, 2.1 düym ultra parlaq AMOLED ekran və Always-On displey. 100+ idman rejimi, yuxu analizi, zəngləri cavablandırma və suya davamlı IP68 sertifikatı.',
    price: 64.50,
    oldPrice: 155.00,
    discountPercent: 58,
    category: 'Smart Saatlar & Zinət',
    categoryId: 'watches',
    rating: 4.8,
    reviewsCount: 512,
    salesCount: 3890,
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
    ],
    colors: ['Titanium Qara', 'Qızılı Narıncı', 'Gümüşü Silikon'],
    sizes: ['45mm', '49mm'],
    tags: ['flash_sale', 'top_seller', 'trending'],
    brand: 'MMZ Tech',
    specs: {
      'Ekran': '2.1" HD AMOLED (60Hz)',
      'Suya davamlılıq': 'IP68 / 5ATM',
      'Uyğunluq': 'iOS və Android',
      'Batareya': '7-10 gün normal istifadə',
      'Sensorlar': 'SpO2, EKG, Nəbz, Addımölçən'
    },
    isFreeDelivery: true,
    recentOrdersCount: 230,
    deliveryDays: '1 gün',
    reviews: [
      {
        id: 'rev-3',
        userName: 'Rauf Qasımov',
        rating: 5,
        date: 'Dünən',
        comment: 'Ekranın rəngləri superdir, günəş altında da çox aydın görünür. Zənglərdə səs çox yaxşı gedir.',
        verifiedPurchase: true,
        likes: 31
      }
    ]
  },
  {
    id: 'prod-3',
    title: 'Mexaniki RGB Gaming Klaviatura & Mouse Dəsti',
    subtitle: 'Hot-swap Blue Switch, 16.8M RGB İşıqlandırma, Maqnit bilək dayağı',
    description: 'Peşəkar oyunçular və proqramçılar üçün xüsusi hazırlanmış mexaniki klaviatura. Metal panel, fərdiləşdirilə bilən makrolar və ultra həssas 12800 DPI optik mouse ilə tam qələbə hissi!',
    price: 38.90,
    oldPrice: 89.00,
    discountPercent: 56,
    category: 'Gaming & Aksessuar',
    categoryId: 'gaming',
    rating: 4.7,
    reviewsCount: 198,
    salesCount: 1420,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'
    ],
    colors: ['Kiber Qara', 'Ağ Neon', 'Çəhrayı Retro'],
    tags: ['trending', 'top_seller'],
    brand: 'MMZ Predator',
    specs: {
      'Düymə növü': 'Mexaniki Blue/Red Switch',
      'İşıqlandırma': '20+ dinamik RGB rejim',
      'Bağlantı': 'USB Type-C çıxarıla bilən kabel',
      'Klaviatura Dili': 'İngilis / Rus / Lazer həkk'
    },
    isFreeDelivery: true,
    recentOrdersCount: 95,
    deliveryDays: '1-2 gün'
  },
  {
    id: 'prod-4',
    title: 'MMZ Turbo 4K Smart Mini Portativ Proyektor',
    subtitle: 'Android 11 OS, Wi-Fi 6, 180° Fırlanan Baza, Daxili Cinema dinamik',
    description: 'Evinizi və ya açıq havanı əsl kinoteatra çevirin! 4K dəstəyi, avtomatik Keystone fokuslama və telefonla bir toxunuşla ekran paylaşımı.',
    price: 89.90,
    oldPrice: 220.00,
    discountPercent: 59,
    category: 'Elektronika & Qadcetlər',
    categoryId: 'electronics',
    rating: 4.9,
    reviewsCount: 280,
    salesCount: 1840,
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80'
    ],
    colors: ['Ağ Mirvari', 'Tünd Boz'],
    tags: ['flash_sale', 'for_you'],
    brand: 'MMZ Cinema',
    specs: {
      'Ekran Ölçüsü': '30 düymdən 150 düymədək',
      'Parlaqlıq': '8000 Lümen / 260 ANSI',
      'Sistem': 'Daxili YouTube, Netflix, Prime Video',
      'Portlar': 'HDMI, USB, Audio 3.5mm'
    },
    isFreeDelivery: true,
    recentOrdersCount: 164,
    deliveryDays: 'Bugün Çatdırılma'
  },
  {
    id: 'prod-5',
    title: 'Premium Su Keçirməz Laptop Çantası & USB Port',
    subtitle: '15.6 - 16.1 düym dəstəyi, Oğurluğa qarşı gizli cib, Ortopedik arxa',
    description: 'Həm iş, həm də tələbələr üçün ideal çoxfunksiyalı çanta. Çöl hissəsi suya və cızılmaya tam davamlı xüsusi parça ilə örtülmüşdür. Xarici USB şarj çıxışı var.',
    price: 26.99,
    oldPrice: 59.99,
    discountPercent: 55,
    category: 'Dəb & Geyim',
    categoryId: 'fashion',
    rating: 4.8,
    reviewsCount: 420,
    salesCount: 4200,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80'
    ],
    colors: ['Kömür Qara', 'Antrasit Boz', 'Hərbi Yaşıl'],
    sizes: ['15.6 inch', '17.3 inch'],
    tags: ['top_seller', 'for_you'],
    brand: 'MMZ Urban',
    specs: {
      'Material': 'Oxford 900D Suya Davamlı Poliester',
      'Tutum': '25-30 Litr',
      'Çəki': '0.75 kq',
      'Bölmələr': 'Laptop, Planşet, Powerbank, Sənədlər'
    },
    isFreeDelivery: true,
    recentOrdersCount: 88,
    deliveryDays: '1-2 gün'
  },
  {
    id: 'prod-6',
    title: 'Ultrasonik Hava Nəmləndirici & Efir Yağı Difuzoru',
    subtitle: '7 Rəngli LED İşıqlandırma, 500ml Həcm, Səssiz Gecə Rejimi',
    description: 'Evdə və ofisdə havanı təmizləyən və xoş ətir yayan müasir difuzor. Aromaterapiya üçün efir yağları ilə istifadə oluna bilər. Avtomatik sönmə xüsusiyyəti mövcuddur.',
    price: 18.50,
    oldPrice: 45.00,
    discountPercent: 59,
    category: 'Ev & Mətbəx Rahatlığı',
    categoryId: 'home',
    rating: 4.7,
    reviewsCount: 310,
    salesCount: 2900,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80'
    ],
    colors: ['Təbii Taxta', 'Tünd Qoz', 'Bəyaz Mərmər'],
    tags: ['trending', 'for_you', 'new_arrival'],
    brand: 'MMZ Home',
    specs: {
      'Su Çəni': '500 ml',
      'İşləmə Müddəti': '10-12 saat',
      'Səs Səviyyəsi': '< 25 dB Ultra Silent',
      'Taymer': '1H / 3H / 6H / ON'
    },
    isFreeDelivery: false,
    recentOrdersCount: 72,
    deliveryDays: '1-2 gün'
  },
  {
    id: 'prod-7',
    title: 'MMZ MagSafe 3-in-1 Simsiz Sürətli Şarj Stansiyası',
    subtitle: 'iPhone, Apple Watch və AirPods üçün eyni anda 15W Fast Charge',
    description: 'Masanızda naqil qarışıqlığına son qoyun! Qatlanan alüminium gövdə, güclü Neodimium maqnitlər və həddindən artıq qızmadan qorunma çipi ilə təchiz olunub.',
    price: 34.00,
    oldPrice: 75.00,
    discountPercent: 55,
    category: 'Elektronika & Qadcetlər',
    categoryId: 'electronics',
    rating: 4.9,
    reviewsCount: 165,
    salesCount: 1100,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&q=80',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80'
    ],
    colors: ['Kosmik Boz', 'Gümüşü Alüminium'],
    tags: ['new_arrival', 'flash_sale'],
    brand: 'MMZ Power',
    specs: {
      'Maksimum Güc': '15W iPhone + 5W Watch + 5W Pods',
      'Giriş Portu': 'USB-C PD 30W',
      'Qatlama': 'Cib ölçüsünə qədər qatlanır',
      'Təhlükəsizlik': 'FOD, OVP, OTP Mühafizə'
    },
    isFreeDelivery: true,
    recentOrdersCount: 65,
    deliveryDays: '1 gün'
  },
  {
    id: 'prod-8',
    title: 'Professional Salon İon Saç Qurudan & Fen Dəsti',
    subtitle: '110,000 RPM fırçasız motor, Mənfi İon Texnologiyası, 5 Maqnit Başlıq',
    description: 'Saçınızı zədələmədən 3 dəqiqəyə qurutma və mükəmməl forma vermə imkanı. Ağıllı istilik sensoru sayəsində saçın təbii parlaqlığını qoruyur.',
    price: 79.99,
    oldPrice: 195.00,
    discountPercent: 59,
    category: 'Gözəllik & Baxım',
    categoryId: 'beauty',
    rating: 4.9,
    reviewsCount: 620,
    salesCount: 3400,
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      'https://images.unsplash.com/photo-1560043309-3221b19a2dc4?w=800&q=80'
    ],
    colors: ['Fuşya Çəhrayı', 'Qızılı Mavi', 'Mat Qara'],
    tags: ['top_seller', 'flash_sale'],
    brand: 'MMZ Glam',
    specs: {
      'Motor Gücü': '1600W / 110,000 RPM',
      'Başlıqlar': 'Diffuzor, Konsentrator, Düzləşdirici, Dalğa',
      'İstilik Səviyyələri': '4 pilləli temperatur + Soyuq hava zərbəsi',
      'Kabel Uzunluğu': '2.5 metr 360 dərəcə fırlanan'
    },
    isFreeDelivery: true,
    recentOrdersCount: 189,
    deliveryDays: 'Bugün Çatdırılma'
  },
  {
    id: 'prod-9',
    title: 'Uşaqlar Üçün Yumşaq Pambıq İdman Dəsti (Hoodie & Şalvar)',
    subtitle: '100% Təbii Pambıq, Nəfəsalan parça, 3-12 yaş üçün erqonomik kəsim',
    description: 'Uşaqların gündəlik aktivliyi və rahatlığı üçün nəzərdə tutulmuş yüksək keyfiyyətli dəst. Dərini qıcıqlandırmayan yumşaq pambıq toxunuşu, elastik bel və dözümlü tikişlər.',
    price: 24.99,
    oldPrice: 45.0,
    discountPercent: 44,
    category: '👦 Uşaq Geyimləri',
    categoryId: 'clothing_kids',
    rating: 4.9,
    reviewsCount: 112,
    salesCount: 890,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80'
    ],
    colors: ['Mavi', 'Boz', 'Sarı'],
    sizes: ['3-4 yaş', '5-6 yaş', '7-8 yaş', '9-10 yaş', '11-12 yaş'],
    tags: ['new_arrival', 'for_you'],
    brand: 'KidsClub Baku',
    specs: {
      'Material': '100% Təbii Pambıq',
      'Mövsüm': 'Yaz / Payız',
      'Mənşə': 'Türkiyə'
    },
    isFreeDelivery: true,
    recentOrdersCount: 41,
    deliveryDays: '1 gün'
  },
  {
    id: 'prod-10',
    title: 'Qızlar Üçün Zərif Çiçəkli Bahar Donu & Kəmər',
    subtitle: 'Yüngül şifon parça, nəfəsalan astar, 4-14 yaş üçün dəbli dizayn',
    description: 'Xüsusi günlər və gündəlik gəzintilər üçün şıq və zərif qız donu. Yüksək keyfiyyətli parçası rəngini itirmir və rahat hərəkət azadlığı təmin edir.',
    price: 29.99,
    oldPrice: 55.0,
    discountPercent: 45,
    category: '👧 Qız Geyimləri',
    categoryId: 'clothing_girls',
    rating: 4.9,
    reviewsCount: 138,
    salesCount: 1240,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1621452773781-0f992fd1f5c1?w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80'
    ],
    colors: ['Çəhrayı', 'Ağ Gül', 'Açıq Mavi'],
    sizes: ['4-5 yaş', '6-7 yaş', '8-9 yaş', '10-12 yaş'],
    tags: ['best_seller', 'for_you'],
    brand: 'Princess Chic',
    specs: {
      'Material': 'Şifon & Pambıq Astar',
      'Stil': 'Bahar / Yay Kolleksiyası',
      'Mənşə': 'Türkiyə'
    },
    isFreeDelivery: true,
    recentOrdersCount: 56,
    deliveryDays: '1 gün'
  },
  {
    id: 'prod-11',
    title: 'Kişi Üçün Premium Slim Fit Oxford Köynək',
    subtitle: '100% Misir pambığı, asan ütülənən Non-Iron texnologiyası',
    description: 'Həm rəsmi iş görüşləri, həm də gündəlik smart-casual tərz üçün ideal premium kişi köynəyi. Nəfəsalan toxunuş və mükəmməl bədənə oturuş.',
    price: 34.99,
    oldPrice: 69.99,
    discountPercent: 50,
    category: '👨 Kişi Geyimləri',
    categoryId: 'clothing_men',
    rating: 4.9,
    reviewsCount: 230,
    salesCount: 1870,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80'
    ],
    colors: ['Ağ', 'Açıq Mavi', 'Klassik Qara', 'Tünd Göy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['best_seller', 'top_seller'],
    brand: 'MMZ Sartorial',
    specs: {
      'Material': '100% Misir Pambığı (Oxford)',
      'Kəsim': 'Slim Fit',
      'Qol': 'Uzun Qol'
    },
    isFreeDelivery: true,
    recentOrdersCount: 64,
    deliveryDays: '1-2 gün'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'MMZ2026',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 30,
    description: '30 AZN üzəri bütün sifarişlərə 20% xüsusi endirim!',
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    code: 'BAHAR50',
    discountType: 'fixed',
    discountValue: 15,
    minOrderAmount: 60,
    description: '60 AZN üzəri sifarişlərdə dərhal 15 AZN qənaət!',
    expiresAt: '2026-06-30',
    isActive: true
  },
  {
    code: 'TEMU90',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 20,
    description: 'İlk alış-veriş üçün super xoşgəldin kuponu',
    expiresAt: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b-1',
    title: 'BÖYÜK YAZ ENDİRİMİ %70-DƏK',
    subtitle: 'Minlərlə trend məhsul inanılmaz qiymətlərlə səni gözləyir!',
    badge: '⚡ MƏHDUD MÜDDƏTLİ FÜRSƏT',
    buttonText: 'İndi Kəşf Et',
    bgColor: 'from-orange-600 via-amber-500 to-red-600',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&q=80',
    order: 1,
    active: true
  },
  {
    id: 'b-2',
    title: 'PULSUZ ÇATDIRILMA HƏFTƏSİ',
    subtitle: 'Bütün Bakı və rayonlar üzrə 20 AZN-dən yuxarı hər şey qapında pulsuz!',
    badge: '🚚 SÜRƏTLİ KARQO',
    buttonText: 'Səbətə Əlavə Et',
    bgColor: 'from-violet-700 via-indigo-600 to-purple-800',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1000&q=80',
    order: 2,
    active: true
  },
  {
    id: 'b-3',
    title: 'MMZ PRO SERİYASI QADCETLƏR',
    subtitle: '3D Audio və Ağıllı texnologiyalar ilə gələcəyi bu gündən yaşa.',
    badge: '✨ PREMIUM SEÇİM',
    buttonText: 'Məhsullara Bax',
    bgColor: 'from-slate-900 via-zinc-800 to-neutral-900',
    textColor: 'text-white',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
    order: 3,
    active: true
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Mətin Fərhadov',
  email: 'metinferhadov93@gmail.com',
  phone: '+994 50 789 45 12',
  avatar: '/logo.jpg',
  mmzCoins: 0,
  walletBalance: 0,
  memberTier: 'Standart Üzv'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_CHAT_USERS: ChatUser[] = [];
export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_SUPPORT_ADMINS: SupportAdmin[] = [];

export const INITIAL_HOME_SECTIONS: HomeSection[] = [
  {
    id: 'sec-flash-sale',
    title: 'Flash Satış • 90%-dək Endirimlər',
    subtitle: 'Məhdud sayda və son dərəcə sərfəli qiymətlər',
    badgeText: '90%-dək Endirim',
    iconName: 'zap',
    themeColor: 'red_orange',
    isActive: true,
    order: 1,
    showButton: true,
    buttonText: 'Hamısına Bax',
    buttonLink: 'flash_sale',
    hasCountdown: true,
    countdownTitle: 'Bitməsinə qaldı:',
    countdownEndTime: '2026-12-31T23:59:59',
    countdownExpiredAction: 'hide',
    productSource: 'tag',
    productTag: 'flash_sale',
    productIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'],
    maxProductsCount: 6,
    customDiscountPercent: 90
  },
  {
    id: 'sec-daily-deals',
    title: 'Günün Fürsətləri',
    subtitle: 'Bugünə özəl ən çox endirim edilən məhsullar',
    badgeText: 'Günün Təklifi',
    iconName: 'flame',
    themeColor: 'orange_amber',
    isActive: true,
    order: 2,
    showButton: true,
    buttonText: 'Hamısına Bax',
    buttonLink: 'daily_deal',
    hasCountdown: false,
    productSource: 'tag',
    productTag: 'daily_deal',
    productIds: ['prod-7', 'prod-8', 'prod-9', 'prod-10', 'prod-11', 'prod-12'],
    maxProductsCount: 6
  },
  {
    id: 'sec-best-sellers',
    title: 'Ən Çox Satılanlar',
    subtitle: 'Minlərlə alıcı tərəfindən 5 ulduz verilmiş məhsullar',
    badgeText: 'Top Seçim',
    iconName: 'award',
    themeColor: 'amber_yellow',
    isActive: true,
    order: 3,
    showButton: true,
    buttonText: 'Hamısına Bax',
    buttonLink: 'best_seller',
    hasCountdown: false,
    productSource: 'tag',
    productTag: 'best_seller',
    productIds: ['prod-1', 'prod-3', 'prod-5', 'prod-7', 'prod-9', 'prod-11'],
    maxProductsCount: 6
  }
];

export const INITIAL_FOOTER_SETTINGS: import('../types').FooterSettings = {
  brandName: 'MMZ ONLINE',
  brandTagline: 'Premium 3D Marketplace',
  brandDescription: 'Azərbaycanın ən müasir, etibarlı və sürətli 3D onlayn alış-veriş platforması. Minlərlə məhsul, ən aşağı qiymətlər və dərhal çatdırılma!',
  phone: '+994 70 272 11 54',
  phoneRaw: '+994702721154',
  email: 'destekmmzonline.az@gmail.com',
  address: 'Bakı şəhəri, Nəsimi rayonu, Nizami küçəsi 142',
  workHours: 'Hər gün 24/7 Dəstək',
  copyrightText: '© 2026 MMZ ONLINE Marketplace. Bütün hüquqlar qorunur.',
  tiktokUrl: 'https://www.tiktok.com/@mmzonline0',
  instagramUrl: 'https://www.instagram.com/mmz_online2',
  facebookUrl: 'https://www.facebook.com/share/1ctvnddc5Y/'
};

export const INITIAL_FOOTER_LINKS: import('../types').FooterLink[] = [
  // 1. Alış-veriş Bölməsi
  {
    id: 'fl-1',
    columnId: 'shopping',
    label: 'Günün Fürsətləri',
    targetType: 'section',
    targetValue: 'daily_deal',
    badge: '🔥 Fürsət',
    order: 1,
    isActive: true
  },
  {
    id: 'fl-2',
    columnId: 'shopping',
    label: 'Flaş Satışlar',
    targetType: 'tab',
    targetValue: 'flash_sales',
    badge: '⚡ -50%',
    order: 2,
    isActive: true
  },
  {
    id: 'fl-3',
    columnId: 'shopping',
    label: 'Yeni Gələnlər',
    targetType: 'section',
    targetValue: 'new_arrival',
    badge: '✨ Yeni',
    order: 3,
    isActive: true
  },
  {
    id: 'fl-4',
    columnId: 'shopping',
    label: 'Səbətim',
    targetType: 'tab',
    targetValue: 'cart',
    order: 4,
    isActive: true
  },

  // 2. Müştəri Xidməti Bölməsi
  {
    id: 'fl-5',
    columnId: 'customer_service',
    label: 'Sifariş İzləmə',
    targetType: 'tab',
    targetValue: 'orders',
    order: 1,
    isActive: true
  },
  {
    id: 'fl-7',
    columnId: 'customer_service',
    label: 'Tez-tez Verilən Suallar',
    targetType: 'tab',
    targetValue: 'faq',
    order: 2,
    isActive: true
  },

  // 3. MMZ İdarəetmə Bölməsi
  {
    id: 'fl-10',
    columnId: 'management',
    label: '❤️ Sevimlilər Siyahım',
    targetType: 'tab',
    targetValue: 'wishlist',
    order: 1,
    isActive: true
  }
];

export interface FAQItem {
  id: string;
  category: 'delivery' | 'payment' | 'returns' | 'account' | 'coins';
  question: string;
  answer: string;
  popular?: boolean;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'Çatdırılma nə qədər vaxt çəkir və şərtləri nədir?',
    answer: 'Bakı şəhəri daxilində sifarişlər 24 saat ərzində, çox vaxt həmin gün kuryerlə birbaşa qapınıza çatdırılır. 35 AZN və daha yuxarı bütün sifarişlər üçün çatdırılma tamamilə PULSUZDUR! 35 AZN-dən aşağı sifarişlər üçün çatdırılma cəmi 3.50 AZN təşkil edir.',
    popular: true
  },
  {
    id: 'faq-2',
    category: 'payment',
    question: 'Hansı ödəniş üsullarını qəbul edirsiniz?',
    answer: 'MMZ ONLINE platformasında siz Visa, MasterCard, BirKart taksit (2, 3, 6, 12, 18 ay faizsiz), qapıda nağd və ya POS-terminal vasitəsilə kartla, həmçinin MMZ Balansınız və qazandığınız MMZ Coin-lərlə ödəniş edə bilərsiniz.',
    popular: true
  },
  {
    id: 'faq-3',
    category: 'returns',
    question: 'Məhsulu necə və hansı qaydada qaytara bilərəm?',
    answer: 'Aldığınız məhsulu qaydalar çərçivəsində heç bir əlavə çətinlik olmadan dəyişdirə və ya qaytara bilərsiniz. Məhsulun ilkin əmtəə görünüşü, qutusu və qəbzi saxlanılmalıdır. Qaytarma müraciəti etdikdə kuryerimiz gəlib məhsulu qapınızdan təhvil alır və pulunuz 1-3 iş günü ərzində hesabınıza qaytarılır.',
    popular: true
  },
  {
    id: 'faq-4',
    category: 'coins',
    question: 'MMZ Coin nədir və ondan necə istifadə olunur?',
    answer: 'MMZ Coin bizim loyallıq xallarımızdır. Hər tamamlanan sifarişdə, rəy yazdıqda və aksiyalarda iştirak etdikdə balansınıza MMZ Coin toplanır. 100 MMZ Coin = 1 AZN endirim kimi növbəti alış-verişlərinizdə istifadə oluna bilər.',
    popular: false
  },
  {
    id: 'faq-5',
    category: 'delivery',
    question: 'Sifarişimin harda olduğunu necə izləyə bilərəm?',
    answer: 'Saytın və ya mobil tətbiqin yuxarı menyusundan "Sifarişlərim" və ya Footer-dən "Sifariş İzləmə" bölməsinə daxil olaraq real-vaxt rejimində kuryerin hərəkətini və mərhələləri (Ödəniş təsdiqi, Hazırlanır, Kuryerdə, Yoldadır, Çatdırıldı) görə bilərsiniz.',
    popular: true
  },
  {
    id: 'faq-6',
    category: 'account',
    question: 'Dəstək xidməti və canlı çat necə işləyir?',
    answer: 'MMZ Dəstək Sistemi 24/7 rejimində işləyir. Siz həm süni intellektli sürətli köməkçi botumuzdan dərhal cavab ala, həm də "Canlı Dəstəyə Yaz" düyməsinə klikləyərək peşəkar adminlərimizlə canlı yazışa bilərsiniz. Birbaşa zəng üçün: +994 70 272 11 54.',
    popular: true
  }
];

