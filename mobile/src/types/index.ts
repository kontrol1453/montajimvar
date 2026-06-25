export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  premiumUntil?: string;
  city?: string;
  phone?: string;
  createdAt?: string;
}

export interface Company {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  categoryId: number;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  logo?: string;
  whatsapp?: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  ratingAvg: number;
  reviewCount: number;
  category: Category;
  images: CompanyImage[];
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface CompanyImage {
  id: string;
  url: string;
  alt?: string;
  description?: string;
  category?: string;
  isLogo: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: User;
  receiver: User;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface Favorite {
  id: string;
  userId: number;
  companyId: number;
  createdAt: string;
  company: Company;
}

export interface Review {
  id: string;
  profileId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: User;
}

export interface Notification {
  id: string;
  type: 'new_user' | 'new_profile' | 'new_review' | 'new_message' | 'new_payment';
  title: string;
  message?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  badgeLabel?: string;
  badgeColor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}