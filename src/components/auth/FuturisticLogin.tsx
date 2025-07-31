
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Eye, EyeOff, Mail, Lock, Shield, Building2, User, Phone,
  Fingerprint, Smartphone, Globe, UserPlus, Zap, Cpu, Brain,
  Scan, Wifi, Signal, Battery, Activity, Sparkles
} from 'lucide-react';

const FuturisticLogin = () => {
  const [email, setEmail] = useState('admin@vikasmilk.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [biometricAuth, setBiometricAuth] = useState(false);
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'admin' as const,
    company: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Simulate biometric authentication
  const handleBiometricAuth = async () => {
    setBiometricAuth(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBiometricAuth(false);
    
    try {
      const success = await login('admin@vikasmilk.com', 'admin123');
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Biometric login failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate signup process
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Account created successfully!');
      setActiveTab('login');
      setEmail(signupData.email);
      setPassword('');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Futuristic background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Scanning lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -skew-x-12 animate-pulse"></div>
      </div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
          <CardHeader className="text-center pb-6 relative">
            <div className="flex justify-center mb-6 relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 relative overflow-hidden">
                <Building2 className="w-10 h-10 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 animate-pulse"></div>
                <Sparkles className="absolute top-1 right-1 w-4 h-4 text-cyan-300 animate-pulse" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Vikas Milk Centre Pro
            </CardTitle>
            <CardDescription className="text-slate-300 text-base flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Next-Gen Dairy Management System
              <Cpu className="w-4 h-4 text-blue-400" />
            </CardDescription>
            
            {/* Status indicators */}
            <div className="flex justify-center gap-4 mt-4">
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                <Brain className="w-3 h-3 mr-1" />
                AI Ready
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
                  <Shield className="h-4 w-4" />
                  Access Portal
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      Neural Link ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@vikasmilk.com"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 h-12 pl-12 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-slate-200 font-medium text-sm flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      Security Code
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter security code"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 h-12 pl-12 pr-12 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 relative overflow-hidden group"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 animate-spin" />
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>Access System</span>
                        </div>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBiometricAuth}
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 h-12 relative overflow-hidden group"
                      disabled={biometricAuth}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {biometricAuth ? (
                        <div className="flex items-center gap-2">
                          <Scan className="w-4 h-4 animate-pulse" />
                          <span>Scanning...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Fingerprint className="w-4 h-4" />
                          <span>Biometric</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200 text-sm flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-400" />
                        Full Name
                      </Label>
                      <Input
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="bg-slate-800/50 border-slate-600 text-white h-10"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200 text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-400" />
                        Phone
                      </Label>
                      <Input
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="bg-slate-800/50 border-slate-600 text-white h-10"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200 text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white h-10"
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200 text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-400" />
                      Company
                    </Label>
                    <Input
                      value={signupData.company}
                      onChange={(e) => setSignupData({...signupData, company: e.target.value})}
                      className="bg-slate-800/50 border-slate-600 text-white h-10"
                      placeholder="Vikas Milk Centre"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200 text-sm">Password</Label>
                      <Input
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="bg-slate-800/50 border-slate-600 text-white h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200 text-sm">Confirm</Label>
                      <Input
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="bg-slate-800/50 border-slate-600 text-white h-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Initialize Account</span>
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo credentials */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Signal className="h-4 w-4 text-cyan-400" />
                  <p className="text-sm text-slate-300 font-medium">System Access Codes</p>
                  <Battery className="h-4 w-4 text-green-400" />
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 space-y-1">
                  <p className="text-xs text-slate-400">
                    <strong className="text-blue-400">Admin Portal:</strong> admin@vikasmilk.com / admin123
                  </p>
                  <p className="text-xs text-slate-400">
                    <strong className="text-purple-400">Employee Access:</strong> employee@vikasmilk.com / emp123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FuturisticLogin;
