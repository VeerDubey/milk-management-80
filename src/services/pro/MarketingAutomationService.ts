import { MarketingCampaign, CustomerSegment } from '@/types/pro';
import { ProLicenseService } from './ProLicenseService';

export class MarketingAutomationService {
  private static campaigns: MarketingCampaign[] = [];
  private static templates: Record<string, any> = {};

  static async createCampaign(campaignData: Omit<MarketingCampaign, 'id' | 'createdAt' | 'metrics'>): Promise<MarketingCampaign> {
    if (!ProLicenseService.hasFeature('marketing_automation')) {
      throw new Error('Marketing Automation feature not available in current license');
    }

    const campaign: MarketingCampaign = {
      id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...campaignData,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      createdAt: new Date().toISOString()
    };

    this.campaigns.push(campaign);
    localStorage.setItem('marketing_campaigns', JSON.stringify(this.campaigns));

    return campaign;
  }

  static async sendCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Get segment data
    const segmentData = this.getSegmentData(campaign.segmentId);
    if (!segmentData) {
      throw new Error('Customer segment not found');
    }

    // Simulate sending campaign
    campaign.status = 'running';
    campaign.metrics.sent = segmentData.customerIds.length;

    // Simulate delivery and engagement metrics
    setTimeout(() => {
      campaign.metrics.delivered = Math.floor(campaign.metrics.sent * 0.95); // 95% delivery rate
      campaign.metrics.opened = Math.floor(campaign.metrics.delivered * 0.25); // 25% open rate
      campaign.metrics.clicked = Math.floor(campaign.metrics.opened * 0.08); // 8% click rate
      campaign.metrics.converted = Math.floor(campaign.metrics.clicked * 0.15); // 15% conversion rate
      campaign.status = 'completed';
      
      localStorage.setItem('marketing_campaigns', JSON.stringify(this.campaigns));
    }, 2000);

    localStorage.setItem('marketing_campaigns', JSON.stringify(this.campaigns));
  }

  static getCampaigns(): MarketingCampaign[] {
    const stored = localStorage.getItem('marketing_campaigns');
    if (stored) {
      this.campaigns = JSON.parse(stored);
    }
    return this.campaigns;
  }

  static getCampaign(campaignId: string): MarketingCampaign | undefined {
    return this.campaigns.find(c => c.id === campaignId);
  }

  static async pauseCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign && campaign.status === 'running') {
      campaign.status = 'paused';
      localStorage.setItem('marketing_campaigns', JSON.stringify(this.campaigns));
    }
  }

  static async resumeCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign && campaign.status === 'paused') {
      campaign.status = 'running';
      localStorage.setItem('marketing_campaigns', JSON.stringify(this.campaigns));
    }
  }

  static createTemplate(name: string, type: 'email' | 'sms' | 'push', template: any): void {
    this.templates[`${type}_${name}`] = {
      name,
      type,
      ...template,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('marketing_templates', JSON.stringify(this.templates));
  }

  static getTemplates(type?: 'email' | 'sms' | 'push'): any[] {
    const stored = localStorage.getItem('marketing_templates');
    if (stored) {
      this.templates = JSON.parse(stored);
    }

    const templates = Object.values(this.templates);
    return type ? templates.filter(t => t.type === type) : templates;
  }

  static getTemplate(key: string): any {
    return this.templates[key];
  }

  private static getSegmentData(segmentId: string): CustomerSegment | null {
    const stored = localStorage.getItem('customer_segments');
    if (stored) {
      const segments: CustomerSegment[] = JSON.parse(stored);
      return segments.find(s => s.id === segmentId) || null;
    }
    return null;
  }

  static getAnalytics(): any {
    const campaigns = this.getCampaigns();
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'running').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

    const totalMetrics = campaigns.reduce((acc, campaign) => {
      acc.sent += campaign.metrics.sent;
      acc.delivered += campaign.metrics.delivered;
      acc.opened += campaign.metrics.opened;
      acc.clicked += campaign.metrics.clicked;
      acc.converted += campaign.metrics.converted;
      return acc;
    }, { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 });

    const averageRates = {
      deliveryRate: totalMetrics.sent > 0 ? (totalMetrics.delivered / totalMetrics.sent) * 100 : 0,
      openRate: totalMetrics.delivered > 0 ? (totalMetrics.opened / totalMetrics.delivered) * 100 : 0,
      clickRate: totalMetrics.opened > 0 ? (totalMetrics.clicked / totalMetrics.opened) * 100 : 0,
      conversionRate: totalMetrics.clicked > 0 ? (totalMetrics.converted / totalMetrics.clicked) * 100 : 0
    };

    return {
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      totalMetrics,
      averageRates
    };
  }

  static async scheduleRecurringCampaign(campaignId: string): Promise<void> {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (!campaign || !campaign.schedule) {
      return;
    }

    // In a real implementation, this would integrate with a job scheduler
    console.log(`Scheduling recurring campaign ${campaignId} with frequency: ${campaign.schedule.frequency}`);
  }

  static async automateFollowUp(campaignId: string, triggerEvent: string): Promise<void> {
    // Simulate automated follow-up campaigns based on customer behavior
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      return;
    }

    const followUpCampaign = await this.createCampaign({
      name: `${campaign.name} - Follow Up`,
      type: campaign.type,
      segmentId: campaign.segmentId,
      template: {
        subject: `Follow up: ${campaign.template.subject}`,
        content: 'Thank you for your interest! Here are some additional offers...',
        variables: campaign.template.variables
      },
      status: 'draft'
    });

    console.log(`Created follow-up campaign ${followUpCampaign.id} triggered by ${triggerEvent}`);
  }
}