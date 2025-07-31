
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Users, Plus, Edit, Trash2, Shield, Key, UserCheck, Search, Lock } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const UserAccess = () => {
  const [permissions] = useState<Permission[]>([
    { id: '1', name: 'View Dashboard', description: 'Access to main dashboard', module: 'Dashboard' },
    { id: '2', name: 'Manage Customers', description: 'Add, edit, delete customers', module: 'Customers' },
    { id: '3', name: 'Manage Products', description: 'Add, edit, delete products', module: 'Products' },
    { id: '4', name: 'Manage Orders', description: 'Create and manage orders', module: 'Orders' },
    { id: '5', name: 'Manage Payments', description: 'Process payments and refunds', module: 'Payments' },
    { id: '6', name: 'Generate Reports', description: 'Access to all reports', module: 'Reports' },
    { id: '7', name: 'Manage Settings', description: 'System configuration access', module: 'Settings' },
    { id: '8', name: 'User Management', description: 'Manage users and roles', module: 'Users' }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8'],
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Business operations access',
      permissions: ['1', '2', '3', '4', '5', '6'],
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Operator',
      description: 'Basic operations access',
      permissions: ['1', '2', '4'],
      isActive: true,
      createdAt: '2024-01-01'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Vikas Sharma',
      email: 'vikas@vikasmilk.com',
      phone: '+91 98765 43210',
      roleId: '1',
      isActive: true,
      lastLogin: '2024-01-20T10:30:00Z',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      email: 'rajesh@vikasmilk.com',
      phone: '+91 98765 43211',
      roleId: '2',
      isActive: true,
      lastLogin: '2024-01-19T14:20:00Z',
      createdAt: '2024-01-05'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
    password: ''
  });

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userFormData }
          : user
      ));
      toast.success('User updated successfully');
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...userFormData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast.success('User created successfully');
    }
    
    setShowUserDialog(false);
    setEditingUser(null);
    setUserFormData({ name: '', email: '', phone: '', roleId: '', password: '' });
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...roleFormData }
          : role
      ));
      toast.success('Role updated successfully');
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...roleFormData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
      toast.success('Role created successfully');
    }
    
    setShowRoleDialog(false);
    setEditingRole(null);
    setRoleFormData({ name: '', description: '', permissions: [] });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      password: ''
    });
    setShowUserDialog(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowRoleDialog(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success('User deleted successfully');
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
    toast.success('Role deleted successfully');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
    toast.success('User status updated');
  };

  const toggleRoleStatus = (id: string) => {
    setRoles(roles.map(role => 
      role.id === id 
        ? { ...role, isActive: !role.isActive }
        : role
    ));
    toast.success('Role status updated');
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'Unknown Role';
  };

  const getPermissionName = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission?.name || 'Unknown Permission';
  };

  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = roleFormData.permissions;
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];
    
    setRoleFormData({ ...roleFormData, permissions: newPermissions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              User Access Management
            </h1>
            <p className="text-slate-300 mt-2">Manage users, roles, and permissions</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'users' && (
              <Button 
                onClick={() => setShowUserDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            )}
            {activeTab === 'roles' && (
              <Button 
                onClick={() => setShowRoleDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.isActive).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Roles</p>
                  <p className="text-2xl font-bold text-white">{roles.length}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'users' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('users')}
                  className="text-slate-300"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Button>
                <Button
                  variant={activeTab === 'roles' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('roles')}
                  className="text-slate-300"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Roles
                </Button>
                <Button
                  variant={activeTab === 'permissions' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('permissions')}
                  className="text-slate-300"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Permissions
                </Button>
              </div>
              
              {activeTab !== 'permissions' && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder={`Search ${activeTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'users' && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Phone</TableHead>
                    <TableHead className="text-slate-300">Role</TableHead>
                    <TableHead className="text-slate-300">Last Login</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{user.name}</TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell className="text-slate-300">{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                          {getRoleName(user.roleId)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.isActive ? "default" : "secondary"}
                          className={user.isActive ? "bg-green-600/20 text-green-300" : "bg-slate-600/20 text-slate-300"}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            className="text-blue-300 border-blue-300 hover:bg-blue-600/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(user.id)}
                            className="text-yellow-300 border-yellow-300 hover:bg-yellow-600/20"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-300 border-red-300 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'roles' && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles ({filteredRoles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Description</TableHead>
                    <TableHead className="text-slate-300">Permissions</TableHead>
                    <TableHead className="text-slate-300">Users</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map(role => (
                    <TableRow key={role.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{role.name}</TableCell>
                      <TableCell className="text-slate-300">{role.description}</TableCell>
                      <TableCell className="text-slate-300">{role.permissions.length} permissions</TableCell>
                      <TableCell className="text-slate-300">
                        {users.filter(u => u.roleId === role.id).length} users
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={role.isActive ? "default" : "secondary"}
                          className={role.isActive ? "bg-green-600/20 text-green-300" : "bg-slate-600/20 text-slate-300"}
                        >
                          {role.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRole(role)}
                            className="text-blue-300 border-blue-300 hover:bg-blue-600/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleRoleStatus(role.id)}
                            className="text-yellow-300 border-yellow-300 hover:bg-yellow-600/20"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-300 border-red-300 hover:bg-red-600/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'permissions' && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5" />
                System Permissions ({permissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Permission</TableHead>
                    <TableHead className="text-slate-300">Description</TableHead>
                    <TableHead className="text-slate-300">Module</TableHead>
                    <TableHead className="text-slate-300">Used in Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map(permission => (
                    <TableRow key={permission.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{permission.name}</TableCell>
                      <TableCell className="text-slate-300">{permission.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                          {permission.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {roles.filter(r => r.permissions.includes(permission.id)).length} roles
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* User Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {editingUser ? 'Update user information' : 'Add a new user to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                <Input
                  id="phone"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="roleId" className="text-slate-300">Role</Label>
                <Select value={userFormData.roleId} onValueChange={(value) => setUserFormData({...userFormData, roleId: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.filter(r => r.isActive).map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div>
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    required
                  />
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowUserDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Role Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {editingRole ? 'Update role information and permissions' : 'Add a new role with specific permissions'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="roleName" className="text-slate-300">Role Name</Label>
                <Input
                  id="roleName"
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="roleDescription" className="text-slate-300">Description</Label>
                <Input
                  id="roleDescription"
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({...roleFormData, description: e.target.value})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-slate-300">Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 max-h-60 overflow-y-auto">
                  {permissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={roleFormData.permissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                      <Label htmlFor={`permission-${permission.id}`} className="text-slate-300 text-sm">
                        {permission.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowRoleDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserAccess;
