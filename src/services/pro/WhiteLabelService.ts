import { WhiteLabelConfig } from '@/types/pro';
import { ProLicenseService } from './ProLicenseService';

export class WhiteLabelService {
  private static configs: Map<string, WhiteLabelConfig> = new Map();

  static async createConfig(companyId: string, configData: Omit<WhiteLabelConfig, 'companyId'>): Promise<WhiteLabelConfig> {
    if (!ProLicenseService.hasFeature('white_label')) {
      throw new Error('White Label feature not available in current license');
    }

    const config: WhiteLabelConfig = {
      companyId,
      ...configData
    };

    this.configs.set(companyId, config);
    localStorage.setItem('white_label_configs', JSON.stringify(Array.from(this.configs.entries())));

    return config;
  }

  static getConfig(companyId: string): WhiteLabelConfig | undefined {
    const stored = localStorage.getItem('white_label_configs');
    if (stored) {
      this.configs = new Map(JSON.parse(stored));
    }
    return this.configs.get(companyId);
  }

  static async updateConfig(companyId: string, updates: Partial<WhiteLabelConfig>): Promise<void> {
    const existingConfig = this.configs.get(companyId);
    if (existingConfig) {
      const updatedConfig = { ...existingConfig, ...updates };
      this.configs.set(companyId, updatedConfig);
      localStorage.setItem('white_label_configs', JSON.stringify(Array.from(this.configs.entries())));
    }
  }

  static generateCustomCSS(config: WhiteLabelConfig): string {
    const { branding } = config;
    
    return `
/* White Label Custom Styles */
:root {
  --primary: ${this.hexToHsl(branding.primaryColor)};
  --secondary: ${this.hexToHsl(branding.secondaryColor)};
  --brand-font: '${branding.fontFamily}', sans-serif;
}

.brand-logo {
  content: url('${branding.logo}');
}

body {
  font-family: var(--brand-font);
}

.btn-primary {
  background-color: hsl(var(--primary));
}

.btn-secondary {
  background-color: hsl(var(--secondary));
}

.text-primary {
  color: hsl(var(--primary));
}

.bg-primary {
  background-color: hsl(var(--primary));
}

.border-primary {
  border-color: hsl(var(--primary));
}

/* Custom CSS from configuration */
${branding.customCSS || ''}
    `;
  }

  private static hexToHsl(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Find min and max values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    // Convert to HSL format (0-360 for hue, 0-100 for saturation and lightness)
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  static applyBranding(companyId: string): void {
    const config = this.getConfig(companyId);
    if (!config || !config.isActive) {
      return;
    }

    // Apply custom CSS
    const customCSS = this.generateCustomCSS(config);
    let styleElement = document.getElementById('white-label-styles');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'white-label-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = customCSS;

    // Update page title if domain is set
    if (config.domain) {
      document.title = `${config.domain} - ERP System`;
    }
  }

  static removeBranding(companyId: string): void {
    const styleElement = document.getElementById('white-label-styles');
    if (styleElement) {
      styleElement.remove();
    }
  }

  static generateBrandedApp(companyId: string): string {
    const config = this.getConfig(companyId);
    if (!config) {
      throw new Error('White label configuration not found');
    }

    const customCSS = this.generateCustomCSS(config);
    
    // Generate a complete branded HTML application
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.domain || 'Custom ERP'}</title>
    <style>
        ${customCSS}
        
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1));
        }
        
        .header {
            background: hsl(var(--primary));
            color: white;
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .logo {
            height: 40px;
        }
        
        .main-content {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .feature-card {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid hsl(var(--primary));
        }
    </style>
</head>
<body>
    <header class="header">
        <img src="${config.branding.logo}" alt="Logo" class="logo">
        <h1>Custom ERP System</h1>
    </header>
    
    <main class="main-content">
        <h2>Welcome to Your Custom Business Management Solution</h2>
        <p>This is your fully branded ERP system with custom styling and features.</p>
        
        <div class="feature-grid">
            ${config.features.enabled.map(feature => `
                <div class="feature-card">
                    <h3>${this.getFeatureTitle(feature)}</h3>
                    <p>${this.getFeatureDescription(feature)}</p>
                </div>
            `).join('')}
        </div>
    </main>
</body>
</html>
    `;
  }

  private static getFeatureTitle(feature: string): string {
    const titles: Record<string, string> = {
      'ai_predictions': 'AI-Powered Analytics',
      'advanced_security': 'Enterprise Security',
      'chatbot': 'Customer Support Bot',
      'multi_company': 'Multi-Company Management',
      'api_integration': 'API Integrations',
      'inventory_optimization': 'Smart Inventory',
      'customer_segmentation': 'Customer Analytics',
      'marketing_automation': 'Marketing Tools',
      'ecommerce': 'E-Commerce Platform'
    };
    return titles[feature] || feature;
  }

  private static getFeatureDescription(feature: string): string {
    const descriptions: Record<string, string> = {
      'ai_predictions': 'Advanced machine learning algorithms for demand forecasting and business insights.',
      'advanced_security': 'Multi-factor authentication, encryption, and comprehensive audit logging.',
      'chatbot': 'AI-powered customer support with natural language processing capabilities.',
      'multi_company': 'Manage multiple companies and branches from a single unified dashboard.',
      'api_integration': 'Connect with third-party services and automate data synchronization.',
      'inventory_optimization': 'Intelligent inventory management with automated reorder suggestions.',
      'customer_segmentation': 'Advanced customer analytics and targeted marketing capabilities.',
      'marketing_automation': 'Automated email campaigns and customer engagement tools.',
      'ecommerce': 'Built-in online store with payment processing and order management.'
    };
    return descriptions[feature] || 'Advanced business feature for enhanced productivity.';
  }

  static validateFeatureAccess(companyId: string, feature: string): boolean {
    const config = this.getConfig(companyId);
    if (!config || !config.isActive) {
      return false;
    }
    
    return config.features.enabled.includes(feature) && !config.features.disabled.includes(feature);
  }

  static getAllConfigs(): WhiteLabelConfig[] {
    const stored = localStorage.getItem('white_label_configs');
    if (stored) {
      this.configs = new Map(JSON.parse(stored));
    }
    return Array.from(this.configs.values());
  }
}