export interface AIAnalytics {
  id: string;
  type: 'demand_prediction' | 'price_optimization' | 'customer_segmentation';
  data: any;
  insights: string[];
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProSubscription {
  id: string;
  companyId: string;
  tier: 'basic' | 'pro' | 'enterprise';
  features: string[];
  maxUsers: number;
  maxCompanies: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  settings: {
    currency: string;
    timezone: string;
    fiscalYearStart: string;
    theme: any;
  };
  subscription: ProSubscription;
  createdAt: string;
  updatedAt: string;
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'webhook' | 'rest' | 'graphql';
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  isActive: boolean;
  lastSync?: string;
  errorCount: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  criteria: {
    totalPurchases?: { min: number; max: number };
    lastOrderDays?: number;
    averageOrderValue?: { min: number; max: number };
    location?: string[];
    tags?: string[];
  };
  customerIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  segmentId: string;
  template: {
    subject?: string;
    content: string;
    variables: string[];
  };
  schedule?: {
    type: 'immediate' | 'scheduled' | 'recurring';
    datetime?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
}

export interface InventoryPrediction {
  productId: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
  reasoning: string[];
  timeframe: 'week' | 'month' | 'quarter';
}

export interface PriceOptimization {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  expectedImpact: {
    salesVolume: number;
    revenue: number;
    profit: number;
  };
  marketFactors: string[];
  confidence: number;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details: any;
  timestamp: string;
}

export interface TwoFactorAuth {
  userId: string;
  secret: string;
  isEnabled: boolean;
  backupCodes: string[];
  lastUsed?: string;
}

export interface ChatbotSession {
  id: string;
  customerId?: string;
  userId?: string;
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  intent?: string;
  resolved: boolean;
  satisfaction?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ECommerceStore {
  id: string;
  companyId: string;
  name: string;
  domain: string;
  settings: {
    theme: string;
    currency: string;
    paymentMethods: string[];
    shippingZones: any[];
  };
  isActive: boolean;
  createdAt: string;
}

export interface WhiteLabelConfig {
  companyId: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  features: {
    enabled: string[];
    disabled: string[];
  };
  domain?: string;
  isActive: boolean;
}