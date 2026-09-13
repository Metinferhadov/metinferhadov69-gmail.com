export type OrderStatus =
  | 'payment_pending'     // 1. Ödəniş gözlənilir
  | 'payment_verifying'   // 2. Ödəniş yoxlanılır
  | 'payment_confirmed'   // 3. Ödəniş təsdiqləndi
  | 'preparing'           // 4. Hazırlanır
  | 'handed_to_courier'   // 5. Kuryerə verildi
  | 'on_the_way'          // 6. Yoldadır
  | 'delivered'           // 7. Çatdırıldı
  | 'payment_rejected'    // Ödəniş rədd edildi
  | 'cancelled';          // 8. Ləğv edildi

export interface ProductVariant {
  id: string;
  name: string;
  options: string[]; // e.g. ["Qara", "Gümüşü", "Qızılı"] or ["S", "M", "L", "XL"]
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  likes: number;
  images?: string[];
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  category: string;
  categoryId: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  stock: number;
  images: string[];
  videos?: string[];
  colors?: string[];
  sizes?: string[];
  tags: string[]; // e.g. ["flash_sale", "top_seller", "trending", "new_arrival", "for_you"]
  brand: string;
  specs: { [key: string]: string };
  isFreeDelivery: boolean;
  recentOrdersCount?: number; // e.g. "Son 24 saatda 142 dəfə alınıb"
  deliveryDays: string; // e.g. "1-2 gün"
  createdAt?: string;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  image: string;
  productCount: number;
  badge?: string;
  parentId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

export interface ShippingAddress {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  addressLine: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: string;
  cardHolder: string;
  cardNumberMasked: string;
  cardType: 'visa' | 'mastercard' | 'birkart';
  expiryDate: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customerInfo: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    notes?: string;
  };
  deliveryMethod: 'courier' | 'express' | 'pickup';
  paymentMethod: 'card' | 'birkart' | 'cash_on_delivery' | 'mmz_balance';
  receiptImage?: string;
  couponUsed?: string;
  trackingEvents: {
    status: OrderStatus;
    title: string;
    time: string;
    description: string;
  }[];
}

export interface SupportAdmin {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
  phone?: string;
  status: 'online' | 'offline' | 'busy';
  isActive: boolean;
  rating?: number;
  responseTime?: string;
  specialty?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  productSuggestions?: Product[];
  model?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  phone?: string;
  email?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatUserId?: string;
  adminId?: string; // ID of the support admin handling this chat
  sender: 'user' | 'support' | 'seller' | 'admin';
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  text: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  productPreview?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  timestamp: string;
  createdAt?: string;
  createdTime?: number;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'discount' | 'system' | 'chat';
  linkTarget?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  badge: string;
  buttonText: string;
  bgColor: string;
  textColor?: string;
  imageUrl: string;
  categoryLink?: string;
  order: number;
  active: boolean;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  iconName: string;
  themeColor: string;
  isActive: boolean;
  order: number;
  showButton: boolean;
  buttonText?: string;
  buttonLink?: string;
  hasCountdown: boolean;
  countdownTitle?: string;
  countdownEndTime?: string;
  countdownExpiredAction?: 'hide' | 'show_always';
  productSource: 'manual' | 'tag' | 'all';
  productTag?: string;
  productIds: string[];
  maxProductsCount: number;
  customDiscountPercent?: number;
}

export type UserRole = 'super_admin' | 'admin' | 'customer';

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isActiveAdmin: boolean;
  createdAt: string;
  memberTier?: string;
  mmzCoins?: number;
  walletBalance?: number;
  status?: 'active' | 'inactive';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  mmzCoins: number;
  walletBalance: number;
  memberTier: 'Standart Üzv' | 'Gümüş' | 'Qızıl' | 'VIP Platinum';
  role?: UserRole;
  isActiveAdmin?: boolean;
  address?: string;
  createdAt?: string;
}

export type ActiveTab =
  | 'home'
  | 'categories'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'order_detail'
  | 'product_detail'
  | 'chat'
  | 'profile'
  | 'admin'
  | 'flash_sales'
  | 'wishlist'
  | 'faq'
  | 'returns';

export interface FooterLink {
  id: string;
  columnId: 'shopping' | 'customer_service' | 'management' | 'other';
  label: string;
  iconName?: string;
  targetType: 'tab' | 'url' | 'tel' | 'mail' | 'section';
  targetValue: string;
  requiresAuth?: boolean;
  badge?: string;
  order: number;
  isActive: boolean;
}

export interface FooterSettings {
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  phone: string;
  phoneRaw: string;
  email: string;
  address: string;
  workHours: string;
  copyrightText: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export interface FlashSaleButton {
  id: string;
  label: string;
  tagFilter?: string; // e.g. 'flash_sale', 'top_seller', 'for_you', 'all'
  actionType: 'tag_filter' | 'tab' | 'all_products';
  targetTab?: ActiveTab;
  badge?: string;
  order: number;
}

export interface FlashSaleSectionConfig {
  id: string;
  isActive: boolean; // if false, completely hidden
  title: string;
  subtitle: string;
  discountPercent: number;
  discountBadgeText?: string;
  hasTimer: boolean;
  timerMode: 'continuous_daily' | 'target_datetime';
  dailyResetHours?: number;
  targetEndTime?: string;
  timerHours: number;
  timerMinutes: number;
  timerSeconds: number;
  gradientFrom: string;
  gradientVia?: string;
  gradientTo: string;
  backgroundImageUrl?: string;
  backgroundOverlayOpacity?: number; // 0 to 100
  bannerIcon: 'flame' | 'zap' | 'sparkles' | 'award' | 'gift' | 'percent';
  buttons: FlashSaleButton[];
  showProducts: boolean;
  productSource: 'manual' | 'tag' | 'all_flash';
  productTag?: string;
  productIds: string[];
  maxProductsCount: number;
  updatedAt?: string;
}

