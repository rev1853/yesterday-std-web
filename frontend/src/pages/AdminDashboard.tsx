import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Camera, Trash2, Shield, User as UserIcon, TrendingUp, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { users, albums, submissions, updateUser, deleteUser, deleteAlbum } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'albums' | 'submissions'>('overview');

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (confirm('Are you sure you want to delete this album?')) {
      deleteAlbum(albumId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'creator':
        return <Camera className="w-4 h-4" />;
      case 'client':
        return <UserIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  // Analytics Data
  const userRoleData = [
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#ef4444' },
    { name: 'Creators', value: users.filter(u => u.role === 'creator').length, color: '#3b82f6' },
    { name: 'Clients', value: users.filter(u => u.role === 'client').length, color: '#22c55e' },
  ];

  const albumStatusData = [
    { name: 'Active', value: albums.filter(a => a.status === 'active').length, color: '#22c55e' },
    { name: 'Archived', value: albums.filter(a => a.status === 'archived').length, color: '#64748b' },
    { name: 'Pending', value: albums.filter(a => a.status === 'pending').length, color: '#eab308' },
  ];

  const submissionTrendData = [
    { month: 'Oct', submissions: 8 },
    { month: 'Nov', submissions: 12 },
    { month: 'Dec', submissions: 15 },
    { month: 'Jan', submissions: 20 },
    { month: 'Feb', submissions: 18 },
    { month: 'Mar', submissions: 25 },
  ];

  const activityData = [
    { day: 'Mon', albums: 4, users: 2 },
    { day: 'Tue', albums: 3, users: 5 },
    { day: 'Wed', albums: 5, users: 3 },
    { day: 'Thu', albums: 7, users: 4 },
    { day: 'Fri', albums: 6, users: 6 },
    { day: 'Sat', albums: 2, users: 1 },
    { day: 'Sun', albums: 3, users: 2 },
  ];

  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const totalPhotos = albums.reduce((acc, album) => acc + album.photos.length, 0);

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[200px] pb-[100px] px-[138px]">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-4">
            Admin Dashboard
          </h1>
          <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
            Platform analytics and content moderation
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-['Inter'] font-medium text-[16px] border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-neutral-100 text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-['Inter'] font-medium text-[16px] border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-neutral-100 text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-6 py-3 font-['Inter'] font-medium text-[16px] border-b-2 transition-colors ${
              activeTab === 'albums'
                ? 'border-neutral-100 text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Albums ({albums.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 font-['Inter'] font-medium text-[16px] border-b-2 transition-colors ${
              activeTab === 'submissions'
                ? 'border-neutral-100 text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Submissions ({submissions.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <span className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] block mb-1">
                  {users.length}
                </span>
                <p className="font-['Inter'] text-[14px] text-neutral-400">Total Users</p>
              </div>
              
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <Camera className="w-8 h-8 text-green-500" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <span className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] block mb-1">
                  {albums.length}
                </span>
                <p className="font-['Inter'] text-[14px] text-neutral-400">Total Albums</p>
              </div>
              
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] block mb-1">
                  {submissions.length}
                </span>
                <p className="font-['Inter'] text-[14px] text-neutral-400">Total Submissions</p>
              </div>

              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] block mb-1">
                  {pendingSubmissions}
                </span>
                <p className="font-['Inter'] text-[14px] text-neutral-400">Pending Reviews</p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              {/* User Distribution */}
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-6">
                  User Distribution by Role
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', borderRadius: '8px' }}
                      labelStyle={{ color: '#f5f5f5' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Album Status */}
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-6">
                  Album Status Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={albumStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {albumStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', borderRadius: '8px' }}
                      labelStyle={{ color: '#f5f5f5' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              {/* Submission Trends */}
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-6">
                  Submission Trends (6 Months)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={submissionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="month" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', borderRadius: '8px' }}
                      labelStyle={{ color: '#f5f5f5' }}
                    />
                    <Line type="monotone" dataKey="submissions" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Activity */}
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-6">
                  Weekly Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="day" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', borderRadius: '8px' }}
                      labelStyle={{ color: '#f5f5f5' }}
                    />
                    <Legend />
                    <Bar dataKey="albums" fill="#22c55e" name="New Albums" />
                    <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <p className="font-['Inter'] text-[14px] text-neutral-400 mb-2">Total Photos</p>
                <p className="font-['Inter'] font-extrabold text-[28px] text-neutral-100 tracking-[-1.4px]">
                  {totalPhotos}
                </p>
              </div>
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <p className="font-['Inter'] text-[14px] text-neutral-400 mb-2">Avg. Photos per Album</p>
                <p className="font-['Inter'] font-extrabold text-[28px] text-neutral-100 tracking-[-1.4px]">
                  {albums.length > 0 ? Math.round(totalPhotos / albums.length) : 0}
                </p>
              </div>
              <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
                <p className="font-['Inter'] text-[14px] text-neutral-400 mb-2">Active Creators</p>
                <p className="font-['Inter'] font-extrabold text-[28px] text-neutral-100 tracking-[-1.4px]">
                  {users.filter(u => u.role === 'creator').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="font-['Inter'] font-black text-white text-[20px]">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-extrabold text-[18px] text-neutral-100 tracking-[-0.9px]">
                      {user.name}
                    </h3>
                    <p className="font-['Inter'] text-[14px] text-neutral-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    user.role === 'admin' 
                      ? 'bg-red-500/10 text-red-500' 
                      : user.role === 'creator'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {getRoleIcon(user.role || '')}
                    <span className="font-['Inter'] text-[14px] capitalize">
                      {user.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="grid grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800"
              >
                <div 
                  className="h-[200px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${album.coverImage})` }}
                />
                <div className="p-6">
                  <h3 className="font-['Inter'] font-extrabold text-[18px] text-neutral-100 tracking-[-0.9px] mb-2">
                    {album.title}
                  </h3>
                  <p className="font-['Inter'] text-[14px] text-neutral-400 mb-4">
                    By {album.creatorName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-lg text-[12px] font-['Inter'] ${
                      album.status === 'active'
                        ? 'bg-green-500/10 text-green-500'
                        : album.status === 'archived'
                        ? 'bg-neutral-700 text-neutral-400'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {album.status}
                    </div>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const album = albums.find(a => a.id === submission.albumId);
              if (!album) return null;

              return (
                <div
                  key={submission.id}
                  className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${album.coverImage})` }}
                    />
                    <div>
                      <h3 className="font-['Inter'] font-extrabold text-[18px] text-neutral-100 tracking-[-0.9px] mb-1">
                        {album.title}
                      </h3>
                      <p className="font-['Inter'] text-[14px] text-neutral-400 mb-2">
                        Submitted by {submission.clientName}
                      </p>
                      <p className="font-['Inter'] text-[12px] text-neutral-500">
                        {submission.selectedPhotos.length} photos selected • {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-lg text-[14px] font-['Inter'] ${
                    submission.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : submission.status === 'downloaded'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {submission.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}