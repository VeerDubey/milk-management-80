import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Mail, 
  MessageSquare,
  Calendar,
  Target,
  Users,
  TrendingUp,
  Settings,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import { MarketingAutomationService } from '@/services/pro/MarketingAutomationService';
import { ChatbotService } from '@/services/pro/ChatbotService';
import { ProLicenseService } from '@/services/pro/ProLicenseService';
import { toast } from '@/hooks/use-toast';

export function AdvancedAutomation() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [chatbotStats, setChatbotStats] = useState<any>(null);
  const [marketingStats, setMarketingStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = () => {
    if (ProLicenseService.hasFeature('marketing_automation')) {
      const campaignData = MarketingAutomationService.getCampaigns();
      setCampaigns(campaignData);
      
      const marketing = MarketingAutomationService.getAnalytics();
      setMarketingStats(marketing);
    }

    if (ProLicenseService.hasFeature('chatbot')) {
      const chatbot = ChatbotService.getChatbotAnalytics();
      setChatbotStats(chatbot);
    }
  };

  const createSampleCampaign = async () => {
    if (!ProLicenseService.hasFeature('marketing_automation')) {
      toast({
        title: "Upgrade Required",
        description: "Marketing Automation requires a Pro license",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await MarketingAutomationService.createCampaign({
        name: 'Welcome New Customers',
        type: 'email',
        segmentId: 'segment_regular',
        template: {
          subject: 'Welcome to Vikas Milk Centre!',
          content: 'Thank you for choosing us for your dairy needs...',
          variables: ['customer_name', 'order_total']
        },
        status: 'draft'
      });

      loadAutomationData();
      toast({
        title: "Campaign Created",
        description: "Your marketing campaign has been created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startChatbotSession = async () => {
    if (!ProLicenseService.hasFeature('chatbot')) {
      toast({
        title: "Upgrade Required",
        description: "AI Chatbot requires a Pro license",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const session = await ChatbotService.createSession('customer_123');
      await ChatbotService.sendMessage(session.id, 'Hello, I need help with my order', 'user');
      
      loadAutomationData();
      toast({
        title: "Chatbot Session Started",
        description: "AI assistant is ready to help customers"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chatbot session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const automationFeatures = [
    {
      id: 'email_marketing',
      title: 'Email Marketing',
      description: 'Automated email campaigns and newsletters',
      icon: Mail,
      action: createSampleCampaign,
      feature: 'marketing_automation',
      metrics: marketingStats ? `${marketingStats.totalCampaigns} campaigns` : '0 campaigns'
    },
    {
      id: 'ai_chatbot',
      title: 'AI Chatbot',
      description: 'Intelligent customer support automation',
      icon: MessageSquare,
      action: startChatbotSession,
      feature: 'chatbot',
      metrics: chatbotStats ? `${chatbotStats.totalSessions} sessions` : '0 sessions'
    },
    {
      id: 'workflow_automation',
      title: 'Workflow Automation',
      description: 'Automate business processes and tasks',
      icon: Settings,
      action: () => {},
      feature: 'workflow_automation',
      metrics: 'Coming soon'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-400" />
            Advanced Automation
          </h2>
          <p className="text-slate-400">Automate marketing, support, and workflows</p>
        </div>
        <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
          Smart Automation
        </Badge>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {automationFeatures.map((feature) => {
          const Icon = feature.icon;
          const hasAccess = ProLicenseService.hasFeature(feature.feature);
          
          return (
            <Card key={feature.id} className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={hasAccess ? 'h-5 w-5 text-purple-400' : 'h-5 w-5 text-slate-400'} />
                  {!hasAccess && (
                    <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                      PRO
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-2">{feature.description}</p>
                <p className="text-slate-500 text-xs mb-4">{feature.metrics}</p>
                
                <Button 
                  onClick={feature.action}
                  disabled={!hasAccess || isLoading}
                  className={hasAccess 
                    ? "w-full bg-purple-600 hover:bg-purple-700" 
                    : "w-full bg-slate-700 text-slate-400 cursor-not-allowed"
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : hasAccess ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </>
                  ) : (
                    'Upgrade Required'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Automation Tabs */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <Tabs defaultValue="campaigns" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="campaigns" className="data-[state=active]:bg-slate-700">
                  Marketing Campaigns
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="data-[state=active]:bg-slate-700">
                  Chatbot Analytics
                </TabsTrigger>
                <TabsTrigger value="workflows" className="data-[state=active]:bg-slate-700">
                  Workflows
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="campaigns" className="mt-6 px-6 pb-6">
              {campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{campaign.name}</h4>
                        <p className="text-slate-400 text-sm">{campaign.type} • {campaign.status}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-white font-medium">{campaign.metrics.sent}</p>
                          <p className="text-slate-400 text-xs">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">{campaign.metrics.opened}</p>
                          <p className="text-slate-400 text-xs">Opened</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No marketing campaigns yet</p>
                  <p className="text-slate-500 text-sm">Create your first automated campaign</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chatbot" className="mt-6 px-6 pb-6">
              {chatbotStats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">{chatbotStats.totalSessions}</p>
                    <p className="text-slate-400 text-sm">Total Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">{chatbotStats.resolvedSessions}</p>
                    <p className="text-slate-400 text-sm">Resolved</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">{Math.round(chatbotStats.resolutionRate)}%</p>
                    <p className="text-slate-400 text-sm">Resolution Rate</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-2xl font-bold text-white">{chatbotStats.avgSatisfaction.toFixed(1)}</p>
                    <p className="text-slate-400 text-sm">Satisfaction</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No chatbot sessions yet</p>
                  <p className="text-slate-500 text-sm">Start your first AI-powered conversation</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="workflows" className="mt-6 px-6 pb-6">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Workflow automation coming soon</p>
                <p className="text-slate-500 text-sm">Advanced business process automation</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}