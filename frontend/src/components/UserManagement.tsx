import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from './ToastContainer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { UserPlus, Trash2, User, Camera, Shield, Edit } from 'lucide-react';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'creator' | 'client';
}

interface EditingUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'client';
}

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const { showToast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'creator',
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (users.some(u => u.email === formData.email)) {
      showToast('error', 'Email already exists');
      return;
    }

    try {
      await addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      showToast('success', `${formData.role === 'admin' ? 'Admin' : formData.role === 'creator' ? 'Creator' : 'Client'} added successfully`);
      setFormData({ name: '', email: '', password: '', role: 'creator' });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to add user';
      showToast('error', message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;

    if (users.some(u => u.email === editingUser.email && u.id !== editingUser.id)) {
      showToast('error', 'Email already exists');
      return;
    }

    try {
      await updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      showToast('success', 'User updated successfully');
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update user';
      showToast('error', message);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await deleteUser(userId);
        showToast('success', 'User deleted successfully');
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to delete user';
        showToast('error', message);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600"><Shield className="size-3 mr-1" />Admin</Badge>;
      case 'creator':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Camera className="size-3 mr-1" />Creator</Badge>;
      case 'client':
        return <Badge className="bg-green-500 hover:bg-green-600"><User className="size-3 mr-1" />Client</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="size-4 text-red-400" />;
      case 'creator':
        return <Camera className="size-4 text-blue-400" />;
      case 'client':
        return <User className="size-4 text-green-400" />;
      default:
        return <User className="size-4" />;
    }
  };

  // Group users by role
  const admins = users.filter(u => u.role === 'admin');
  const creators = users.filter(u => u.role === 'creator');
  const clients = users.filter(u => u.role === 'client');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-2">
            User Management
          </h2>
          <p className="font-['Inter'] text-[16px] text-neutral-400">
            Manage platform users and add new admins or creators
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-6 py-3 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] tracking-[-0.7px] hover:bg-neutral-200 transition-colors flex items-center gap-2">
              <UserPlus className="size-4" />
              Add Admin/Creator
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e1e] border-neutral-800 text-neutral-100">
            <DialogHeader>
              <DialogTitle className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px]">
                Add New User
              </DialogTitle>
              <DialogDescription className="font-['Inter'] text-[14px] text-neutral-400">
                Create a new admin or creator account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:border-neutral-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:border-neutral-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:border-neutral-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter']">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] border-neutral-800">
                    <SelectItem value="creator" className="text-neutral-100">
                      <div className="flex items-center gap-2">
                        <Camera className="size-4" />
                        Creator
                      </div>
                    </SelectItem>
                    <SelectItem value="admin" className="text-neutral-100">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] tracking-[-0.7px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="size-4" />
                Add User
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="size-5 text-red-400" />
            <h3 className="font-['Inter'] font-medium text-[14px] text-neutral-400">Admins</h3>
          </div>
          <div className="font-['Inter'] font-extrabold text-[48px] text-neutral-100 tracking-[-2.4px]">
            {admins.length}
          </div>
        </div>
        <div className="bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="size-5 text-blue-400" />
            <h3 className="font-['Inter'] font-medium text-[14px] text-neutral-400">Creators</h3>
          </div>
          <div className="font-['Inter'] font-extrabold text-[48px] text-neutral-100 tracking-[-2.4px]">
            {creators.length}
          </div>
        </div>
        <div className="bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="size-5 text-green-400" />
            <h3 className="font-['Inter'] font-medium text-[14px] text-neutral-400">Clients</h3>
          </div>
          <div className="font-['Inter'] font-extrabold text-[48px] text-neutral-100 tracking-[-2.4px]">
            {clients.length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-1">
            All Users
          </h3>
          <p className="font-['Inter'] text-[14px] text-neutral-400">
            Total {users.length} users in the system
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-6 py-4 font-['Inter'] font-medium text-[12px] text-neutral-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 font-['Inter'] font-medium text-[12px] text-neutral-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 font-['Inter'] font-medium text-[12px] text-neutral-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-right px-6 py-4 font-['Inter'] font-medium text-[12px] text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-8 font-['Inter'] text-[14px] text-neutral-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(user.role || '')}
                        <span className="font-['Inter'] font-medium text-[14px] text-neutral-100">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-['Inter'] text-[14px] text-neutral-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role || '')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px]">
              Edit User
            </DialogTitle>
            <DialogDescription className="font-['Inter'] text-[14px] text-neutral-400">
              Update user information
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Full Name</Label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:border-neutral-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Email</Label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="Enter email"
                  className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:border-neutral-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-['Inter'] font-medium text-[14px] text-neutral-100">Role</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value: any) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="bg-[#0d0d0d] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter']">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] border-neutral-800">
                    <SelectItem value="client" className="text-neutral-100">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        Client
                      </div>
                    </SelectItem>
                    <SelectItem value="creator" className="text-neutral-100">
                      <div className="flex items-center gap-2">
                        <Camera className="size-4" />
                        Creator
                      </div>
                    </SelectItem>
                    <SelectItem value="admin" className="text-neutral-100">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 py-3 bg-neutral-800 text-neutral-100 rounded-xl font-['Inter'] font-medium text-[14px] hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] tracking-[-0.7px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="size-4" />
                  Update User
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
