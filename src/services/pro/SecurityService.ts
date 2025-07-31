import { SecurityAuditLog, TwoFactorAuth } from '@/types/pro';
import { ProLicenseService } from './ProLicenseService';

export class SecurityService {
  private static auditLogs: SecurityAuditLog[] = [];
  private static twoFactorConfigs: Map<string, TwoFactorAuth> = new Map();

  static async enableTwoFactor(userId: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
    if (!ProLicenseService.hasFeature('advanced_security')) {
      throw new Error('Advanced Security feature not available in current license');
    }

    // Generate secret and backup codes
    const secret = this.generateSecret();
    const backupCodes = this.generateBackupCodes();
    const qrCode = `otpauth://totp/Vikas%20Milk%20Centre?secret=${secret}&issuer=VikasERP`;

    const twoFactorAuth: TwoFactorAuth = {
      userId,
      secret,
      isEnabled: true,
      backupCodes,
    };

    this.twoFactorConfigs.set(userId, twoFactorAuth);
    localStorage.setItem('two_factor_configs', JSON.stringify(Array.from(this.twoFactorConfigs.entries())));

    await this.logSecurityEvent(userId, 'enable_2fa', 'user_settings', true, { method: 'totp' });

    return { secret, qrCode, backupCodes };
  }

  static async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
    const config = this.twoFactorConfigs.get(userId);
    if (!config || !config.isEnabled) {
      return false;
    }

    // Simulate TOTP verification (in real app, use a library like speakeasy)
    const isValid = token.length === 6 && /^\d+$/.test(token);
    
    if (isValid) {
      config.lastUsed = new Date().toISOString();
      this.twoFactorConfigs.set(userId, config);
      localStorage.setItem('two_factor_configs', JSON.stringify(Array.from(this.twoFactorConfigs.entries())));
    }

    await this.logSecurityEvent(userId, 'verify_2fa', 'authentication', isValid, { token_length: token.length });

    return isValid;
  }

  static async logSecurityEvent(
    userId: string,
    action: string,
    resource: string,
    success: boolean,
    details: any = {}
  ): Promise<void> {
    if (!ProLicenseService.hasFeature('advanced_security')) {
      return;
    }

    const auditLog: SecurityAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      resource,
      ipAddress: '127.0.0.1', // In real app, get actual IP
      userAgent: navigator.userAgent,
      success,
      details,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.push(auditLog);
    
    // Keep only last 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }

    localStorage.setItem('security_audit_logs', JSON.stringify(this.auditLogs));
  }

  static getAuditLogs(userId?: string, limit: number = 100): SecurityAuditLog[] {
    const stored = localStorage.getItem('security_audit_logs');
    if (stored) {
      this.auditLogs = JSON.parse(stored);
    }

    let logs = this.auditLogs;
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }

    return logs.slice(-limit).reverse();
  }

  static async encryptData(data: string, userId: string): Promise<string> {
    if (!ProLicenseService.hasFeature('advanced_security')) {
      throw new Error('Advanced Security feature not available in current license');
    }

    // Simple encryption simulation (in real app, use proper encryption)
    const encrypted = btoa(data);
    await this.logSecurityEvent(userId, 'encrypt_data', 'data_protection', true, { data_size: data.length });
    return encrypted;
  }

  static async decryptData(encryptedData: string, userId: string): Promise<string> {
    if (!ProLicenseService.hasFeature('advanced_security')) {
      throw new Error('Advanced Security feature not available in current license');
    }

    try {
      const decrypted = atob(encryptedData);
      await this.logSecurityEvent(userId, 'decrypt_data', 'data_protection', true, { data_size: decrypted.length });
      return decrypted;
    } catch (error) {
      await this.logSecurityEvent(userId, 'decrypt_data', 'data_protection', false, { error: error.message });
      throw error;
    }
  }

  private static generateSecret(): string {
    return Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
  }

  private static generateBackupCodes(): string[] {
    return Array.from({ length: 10 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
  }

  static getTwoFactorConfig(userId: string): TwoFactorAuth | undefined {
    return this.twoFactorConfigs.get(userId);
  }

  static async disableTwoFactor(userId: string): Promise<void> {
    if (this.twoFactorConfigs.has(userId)) {
      this.twoFactorConfigs.delete(userId);
      localStorage.setItem('two_factor_configs', JSON.stringify(Array.from(this.twoFactorConfigs.entries())));
      await this.logSecurityEvent(userId, 'disable_2fa', 'user_settings', true);
    }
  }
}
