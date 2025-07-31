import { AIAnalytics, InventoryPrediction, PriceOptimization, CustomerSegment } from '@/types/pro';
import { ProLicenseService } from './ProLicenseService';

export class AIAnalyticsService {
  private static analytics: AIAnalytics[] = [];

  static async generateDemandPrediction(productId: string, historicalData: any[]): Promise<InventoryPrediction | null> {
    if (!ProLicenseService.hasFeature('ai_predictions')) {
      throw new Error('AI Predictions feature not available in current license');
    }

    // Simulate AI demand prediction
    const currentStock = historicalData[historicalData.length - 1]?.stock || 0;
    const avgDemand = historicalData.reduce((sum, data) => sum + (data.sold || 0), 0) / historicalData.length;
    
    const prediction: InventoryPrediction = {
      productId,
      currentStock,
      predictedDemand: Math.round(avgDemand * 1.2), // 20% growth prediction
      recommendedOrder: Math.max(0, Math.round(avgDemand * 1.5) - currentStock),
      confidence: 0.85,
      reasoning: [
        'Historical sales trend analysis',
        'Seasonal pattern recognition',
        'Market demand forecasting'
      ],
      timeframe: 'month'
    };

    // Store analytics record
    const analytics: AIAnalytics = {
      id: `ai_${Date.now()}`,
      type: 'demand_prediction',
      data: prediction,
      insights: prediction.reasoning,
      confidence: prediction.confidence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.analytics.push(analytics);
    localStorage.setItem('ai_analytics', JSON.stringify(this.analytics));

    return prediction;
  }

  static async optimizePrice(productId: string, marketData: any): Promise<PriceOptimization | null> {
    if (!ProLicenseService.hasFeature('price_optimization')) {
      throw new Error('Price Optimization feature not available in current license');
    }

    const currentPrice = marketData.currentPrice || 100;
    const elasticity = 0.8; // Price elasticity simulation
    
    const optimization: PriceOptimization = {
      productId,
      currentPrice,
      suggestedPrice: currentPrice * 1.1, // 10% increase
      expectedImpact: {
        salesVolume: -elasticity * 10, // 8% decrease in volume
        revenue: 2, // 2% revenue increase
        profit: 15 // 15% profit increase
      },
      marketFactors: [
        'Competitor pricing analysis',
        'Demand elasticity calculation',
        'Profit margin optimization'
      ],
      confidence: 0.78
    };

    const analytics: AIAnalytics = {
      id: `ai_${Date.now()}`,
      type: 'price_optimization',
      data: optimization,
      insights: optimization.marketFactors,
      confidence: optimization.confidence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.analytics.push(analytics);
    localStorage.setItem('ai_analytics', JSON.stringify(this.analytics));

    return optimization;
  }

  static async segmentCustomers(customers: any[]): Promise<CustomerSegment[]> {
    if (!ProLicenseService.hasFeature('customer_segmentation')) {
      throw new Error('Customer Segmentation feature not available in current license');
    }

    const segments: CustomerSegment[] = [
      {
        id: 'segment_high_value',
        name: 'High Value Customers',
        criteria: {
          totalPurchases: { min: 10000, max: Infinity },
          averageOrderValue: { min: 1000, max: Infinity }
        },
        customerIds: customers.filter(c => c.totalPurchases >= 10000).map(c => c.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'segment_regular',
        name: 'Regular Customers',
        criteria: {
          totalPurchases: { min: 1000, max: 9999 },
          lastOrderDays: 30
        },
        customerIds: customers.filter(c => c.totalPurchases >= 1000 && c.totalPurchases < 10000).map(c => c.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'segment_at_risk',
        name: 'At Risk Customers',
        criteria: {
          lastOrderDays: 90
        },
        customerIds: customers.filter(c => c.daysSinceLastOrder > 90).map(c => c.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const analytics: AIAnalytics = {
      id: `ai_${Date.now()}`,
      type: 'customer_segmentation',
      data: { segments, totalCustomers: customers.length },
      insights: [
        `${segments[0].customerIds.length} high-value customers identified`,
        `${segments[2].customerIds.length} customers at risk of churn`,
        'Segmentation based on purchase behavior and recency'
      ],
      confidence: 0.82,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.analytics.push(analytics);
    localStorage.setItem('ai_analytics', JSON.stringify(this.analytics));
    localStorage.setItem('customer_segments', JSON.stringify(segments));

    return segments;
  }

  static getAnalytics(): AIAnalytics[] {
    const stored = localStorage.getItem('ai_analytics');
    if (stored) {
      this.analytics = JSON.parse(stored);
    }
    return this.analytics;
  }

  static getAnalyticsById(id: string): AIAnalytics | undefined {
    return this.analytics.find(a => a.id === id);
  }
}