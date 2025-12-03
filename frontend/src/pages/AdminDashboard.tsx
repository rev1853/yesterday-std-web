import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserManagement from '../components/UserManagement';
import { Users, Camera, Trash2, Shield, User as UserIcon, TrendingUp, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const { users, albums, submissions, updateUser, deleteUser, deleteAlbum } = useApp();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'albums' | 'submissions'>('overview');

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await deleteUser(userId);
        }
    };

    const handleDeleteAlbum = async (albumId: string) => {
        if (confirm('Are you sure you want to delete this album?')) {
            await deleteAlbum(albumId);
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

            <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
                {/* Header */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
                        Platform analytics and content moderation
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-neutral-800 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview'
                            ? 'border-neutral-100 text-neutral-100'
                            : 'border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users'
                            ? 'border-neutral-100 text-neutral-100'
                            : 'border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('albums')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'albums'
                            ? 'border-neutral-100 text-neutral-100'
                            : 'border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        Albums ({albums.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`px-4 sm:px-6 py-2 sm:py-3 font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] border-b-2 transition-colors whitespace-nowrap ${activeTab === 'submissions'
                            ? 'border-neutral-100 text-neutral-100'
                            : 'border-transparent text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        Submissions ({submissions.length})
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                </div>
                                <span className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] block mb-1">
                                    {users.length}
                                </span>
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Total Users</p>
                            </div>

                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <Camera className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500" />
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                </div>
                                <span className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] block mb-1">
                                    {albums.length}
                                </span>
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Total Albums</p>
                            </div>

                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-500" />
                                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                </div>
                                <span className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] block mb-1">
                                    {submissions.length}
                                </span>
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Total Submissions</p>
                            </div>

                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-500" />
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                </div>
                                <span className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] block mb-1">
                                    {pendingSubmissions}
                                </span>
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Pending Reviews</p>
                            </div>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* User Distribution */}
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-4 sm:mb-6">
                                    User Distribution by Role
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={userRoleData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
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
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-4 sm:mb-6">
                                    Album Status Overview
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={albumStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Submission Trends */}
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-4 sm:mb-6">
                                    Submission Trends (6 Months)
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={submissionTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                                        <XAxis dataKey="month" stroke="#a3a3a3" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#a3a3a3" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', borderRadius: '8px' }}
                                            labelStyle={{ color: '#f5f5f5' }}
                                        />
                                        <Line type="monotone" dataKey="submissions" stroke="#8b5cf6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Weekly Activity */}
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-4 sm:mb-6">
                                    Weekly Activity
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                                        <XAxis dataKey="day" stroke="#a3a3a3" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#a3a3a3" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #404040', borderRadius: '8px' }}
                                            labelStyle={{ color: '#f5f5f5' }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Bar dataKey="albums" fill="#22c55e" name="New Albums" />
                                        <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-2">Total Photos</p>
                                <p className="font-['Inter'] font-extrabold text-[22px] sm:text-[24px] lg:text-[28px] text-neutral-100 tracking-[-1.1px] sm:tracking-[-1.2px] lg:tracking-[-1.4px]">
                                    {totalPhotos}
                                </p>
                            </div>
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-2">Avg. Photos per Album</p>
                                <p className="font-['Inter'] font-extrabold text-[22px] sm:text-[24px] lg:text-[28px] text-neutral-100 tracking-[-1.1px] sm:tracking-[-1.2px] lg:tracking-[-1.4px]">
                                    {albums.length > 0 ? Math.round(totalPhotos / albums.length) : 0}
                                </p>
                            </div>
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-2">Active Creators</p>
                                <p className="font-['Inter'] font-extrabold text-[22px] sm:text-[24px] lg:text-[28px] text-neutral-100 tracking-[-1.1px] sm:tracking-[-1.2px] lg:tracking-[-1.4px]">
                                    {users.filter(u => u.role === 'creator').length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <UserManagement />
                )}

                {activeTab === 'albums' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800"
                            >
                                <div
                                    className="h-[180px] sm:h-[200px] bg-cover bg-center"
                                    style={{ backgroundImage: `url(${album.coverImage})` }}
                                />
                                <div className="p-5 sm:p-6">
                                    <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[17px] lg:text-[18px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.85px] lg:tracking-[-0.9px] mb-2">
                                        {album.title}
                                    </h3>
                                    <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-4">
                                        By {album.creatorName}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className={`px-3 py-1 rounded-lg text-[11px] sm:text-[12px] font-['Inter'] ${album.status === 'active'
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
                    <div className="space-y-3 sm:space-y-4">
                        {submissions.map((submission) => {
                            const album = albums.find(a => a.id === submission.albumId);
                            if (!album) return null;

                            return (
                                <div
                                    key={submission.id}
                                    className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
                                        <div
                                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg bg-cover bg-center shrink-0"
                                            style={{ backgroundImage: `url(${album.coverImage})` }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-['Inter'] font-extrabold text-[15px] sm:text-[16px] lg:text-[18px] text-neutral-100 tracking-[-0.75px] sm:tracking-[-0.8px] lg:tracking-[-0.9px] mb-1 truncate">
                                                {album.title}
                                            </h3>
                                            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-1 sm:mb-2">
                                                Submitted by {submission.clientName}
                                            </p>
                                            <p className="font-['Inter'] text-[11px] sm:text-[12px] text-neutral-500">
                                                {submission.selectedPhotos.length} photos selected • {new Date(submission.submittedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] lg:text-[14px] font-['Inter'] shrink-0 ${submission.status === 'pending'
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
