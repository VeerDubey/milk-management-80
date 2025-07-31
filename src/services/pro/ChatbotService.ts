import { ChatbotSession } from '@/types/pro';
import { ProLicenseService } from './ProLicenseService';

export class ChatbotService {
  private static sessions: ChatbotSession[] = [];
  private static knowledgeBase: Map<string, string[]> = new Map();

  static async createSession(customerId?: string, userId?: string): Promise<ChatbotSession> {
    if (!ProLicenseService.hasFeature('chatbot')) {
      throw new Error('Chatbot feature not available in current license');
    }

    const session: ChatbotSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      userId,
      messages: [],
      resolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.sessions.push(session);
    localStorage.setItem('chatbot_sessions', JSON.stringify(this.sessions));

    return session;
  }

  static async sendMessage(sessionId: string, content: string, role: 'user' | 'assistant'): Promise<void> {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    session.messages.push(message);
    session.updatedAt = new Date().toISOString();

    // If user message, generate AI response
    if (role === 'user') {
      const response = await this.generateResponse(content, session);
      if (response) {
        session.messages.push({
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        });
      }
    }

    localStorage.setItem('chatbot_sessions', JSON.stringify(this.sessions));
  }

  private static async generateResponse(userMessage: string, session: ChatbotSession): Promise<string> {
    const message = userMessage.toLowerCase();

    // Intent detection
    if (message.includes('order') || message.includes('purchase')) {
      session.intent = 'order_inquiry';
      return "I can help you with order-related questions. Would you like to check your order status, place a new order, or modify an existing order?";
    }

    if (message.includes('payment') || message.includes('bill') || message.includes('invoice')) {
      session.intent = 'payment_inquiry';
      return "I can assist with payment and billing questions. Would you like to check your payment history, make a payment, or get an invoice?";
    }

    if (message.includes('product') || message.includes('milk') || message.includes('dairy')) {
      session.intent = 'product_inquiry';
      return "I can provide information about our dairy products. What specific product information do you need? We offer fresh milk, yogurt, butter, cheese, and more.";
    }

    if (message.includes('delivery') || message.includes('schedule')) {
      session.intent = 'delivery_inquiry';
      return "I can help with delivery-related questions. Would you like to check your delivery schedule, modify delivery times, or report a delivery issue?";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm here to help you with your dairy business needs. I can assist with orders, payments, product information, and delivery questions. How can I help you today?";
    }

    if (message.includes('thank') || message.includes('bye')) {
      session.resolved = true;
      return "You're welcome! Is there anything else I can help you with today? If not, have a great day!";
    }

    // Default response with suggestions
    return "I understand you need help. I can assist with:\n• Order management and tracking\n• Payment and billing questions\n• Product information\n• Delivery scheduling\n• Account management\n\nCould you please let me know which area you'd like help with?";
  }

  static getSessions(): ChatbotSession[] {
    const stored = localStorage.getItem('chatbot_sessions');
    if (stored) {
      this.sessions = JSON.parse(stored);
    }
    return this.sessions;
  }

  static getSession(sessionId: string): ChatbotSession | undefined {
    return this.sessions.find(s => s.id === sessionId);
  }

  static async resolveSession(sessionId: string, satisfaction?: number): Promise<void> {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.resolved = true;
      session.satisfaction = satisfaction;
      session.updatedAt = new Date().toISOString();
      localStorage.setItem('chatbot_sessions', JSON.stringify(this.sessions));
    }
  }

  static getSessionsByCustomer(customerId: string): ChatbotSession[] {
    return this.sessions.filter(s => s.customerId === customerId);
  }

  static getChatbotAnalytics() {
    const sessions = this.getSessions();
    const totalSessions = sessions.length;
    const resolvedSessions = sessions.filter(s => s.resolved).length;
    const avgSatisfaction = sessions
      .filter(s => s.satisfaction)
      .reduce((sum, s) => sum + (s.satisfaction || 0), 0) / sessions.filter(s => s.satisfaction).length;

    const intentDistribution = sessions.reduce((acc, session) => {
      if (session.intent) {
        acc[session.intent] = (acc[session.intent] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSessions,
      resolvedSessions,
      resolutionRate: totalSessions > 0 ? (resolvedSessions / totalSessions) * 100 : 0,
      avgSatisfaction: isNaN(avgSatisfaction) ? 0 : avgSatisfaction,
      intentDistribution
    };
  }

  static addKnowledge(category: string, responses: string[]): void {
    this.knowledgeBase.set(category, responses);
    localStorage.setItem('chatbot_knowledge', JSON.stringify(Array.from(this.knowledgeBase.entries())));
  }

  static loadKnowledge(): void {
    const stored = localStorage.getItem('chatbot_knowledge');
    if (stored) {
      this.knowledgeBase = new Map(JSON.parse(stored));
    }
  }
}