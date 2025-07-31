import { ProSubscription, Company } from '@/types/pro';
import { ConfigManager } from '@/config/AppConfig';

export class ProLicenseService {
  private static subscription: ProSubscription | null = null;
  private static companies: Company[] = [];

  static async validateLicense(licenseKey: string): Promise<boolean> {
    try {
      // Simulate license validation
      const validLicenses = [
        'PRO-2024-VIKAS-MILK-ENTERPRISE',
        'PRO-2024-BASIC-LICENSE',
        'PRO-2024-PREMIUM-UNLIMITED'
      ];

      if (validLicenses.includes(licenseKey)) {
        const config = ConfigManager.getConfig();
        ConfigManager.updateConfig({
          licensing: {
            ...config.licensing,
            licenseKey,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            features: this.getFeaturesForLicense(licenseKey)
          }
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('License validation failed:', error);
      return false;
    }
  }

  static getFeaturesForLicense(licenseKey: string): string[] {
    if (licenseKey.includes('ENTERPRISE')) {
      return [
        'ai_predictions',
        'advanced_security',
        'chatbot',
        'multi_company',
        'api_integration',
        'white_label',
        'inventory_optimization',
        'price_optimization',
        'customer_segmentation',
        'marketing_automation',
        'ecommerce',
        'advanced_reports',
        'real_time_sync',
        'cloud_storage'
      ];
    } else if (licenseKey.includes('PREMIUM')) {
      return [
        'ai_predictions',
        'advanced_security',
        'api_integration',
        'inventory_optimization',
        'customer_segmentation',
        'advanced_reports',
        'real_time_sync',
        'cloud_storage'
      ];
    } else {
      return [
        'advanced_reports',
        'real_time_sync',
        'cloud_storage'
      ];
    }
  }

  static hasFeature(feature: string): boolean {
    const config = ConfigManager.getConfig();
    return config.licensing.features.includes(feature);
  }

  static getSubscription(): ProSubscription | null {
    return this.subscription;
  }

  static async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    const company: Company = {
      id: `company_${Date.now()}`,
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.companies.push(company);
    localStorage.setItem('pro_companies', JSON.stringify(this.companies));
    return company;
  }

  static getCompanies(): Company[] {
    const stored = localStorage.getItem('pro_companies');
    if (stored) {
      this.companies = JSON.parse(stored);
    }
    return this.companies;
  }

  static switchCompany(companyId: string): boolean {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      localStorage.setItem('current_company', companyId);
      return true;
    }
    return false;
  }

  static getCurrentCompany(): Company | null {
    const currentCompanyId = localStorage.getItem('current_company');
    if (currentCompanyId) {
      return this.companies.find(c => c.id === currentCompanyId) || null;
    }
    return this.companies[0] || null;
  }
}