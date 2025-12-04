import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatDate } from '@/utils/date';
import { Camera, CheckCircle, Clock, Search, Filter, Grid3x3, List } from 'lucide-react';

export default function ClientDashboard() {
  const { user, albums, submissions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'submitted'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get albums available to clients (invite or public)
  const availableAlbums = albums.filter(album => album.inviteCode || album.isPublic);
  
  // Get client's submissions
  const mySubmissions = submissions.filter(sub => sub.clientId === user?.id);

  // Filter and search albums
  const filteredAlbums = availableAlbums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === 'available') {
      return !mySubmissions.some(sub => sub.albumId === album.id);
    } else if (filterStatus === 'submitted') {
      return mySubmissions.some(sub => sub.albumId === album.id);
    }
    return true;
  });

  const hasSubmitted = (albumId: string) => {
    return mySubmissions.some(sub => sub.albumId === albumId);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
            Discover Albums
          </h1>
          <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
            Browse and select your favorite photos from available albums
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Camera className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
            </div>
            <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
              {availableAlbums.length}
            </p>
            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Available Albums</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500" />
            </div>
            <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
              {mySubmissions.length}
            </p>
            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Submitted Selections</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-500" />
            </div>
            <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
              {mySubmissions.filter(s => s.status === 'pending').length}
            </p>
            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Pending Review</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums..."
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-['Inter'] transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-neutral-100 text-[#0d0d0d]'
                    : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-['Inter'] transition-colors ${
                  viewMode === 'list'
                    ? 'bg-neutral-100 text-[#0d0d0d]'
                    : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] transition-colors ${
                filterStatus === 'all'
                  ? 'bg-neutral-100 text-[#0d0d0d]'
                  : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              All ({availableAlbums.length})
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className={`px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] transition-colors ${
                filterStatus === 'available'
                  ? 'bg-neutral-100 text-[#0d0d0d]'
                  : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              Available ({availableAlbums.filter(a => !hasSubmitted(a.id)).length})
            </button>
            <button
              onClick={() => setFilterStatus('submitted')}
              className={`px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] transition-colors ${
                filterStatus === 'submitted'
                  ? 'bg-neutral-100 text-[#0d0d0d]'
                  : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              Submitted ({mySubmissions.length})
            </button>
          </div>
        </div>

        {/* Albums Grid/List */}
        {filteredAlbums.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-[#1e1e1e] rounded-xl border-2 border-neutral-800 px-4">
            <Camera className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-neutral-700 mx-auto mb-3 sm:mb-4" />
            <p className="font-['Inter'] text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-500 mb-2">
              {searchQuery ? 'No albums found' : 'No albums available yet'}
            </p>
            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-600">
              {searchQuery ? 'Try a different search term' : 'Your photographer will share albums with you via invitation links'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredAlbums.map((album) => {
              const submitted = hasSubmitted(album.id);
              const submission = mySubmissions.find(sub => sub.albumId === album.id);
              
              return (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="group relative"
                >
                  <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800 hover:border-neutral-600 transition-all">
                    <div className="relative overflow-hidden">
                      <div 
                        className="h-[220px] sm:h-[260px] lg:h-[300px] bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${album.coverImage})` }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {submitted && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 bg-green-500 rounded-lg flex items-center gap-1.5 sm:gap-2">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px] text-white font-medium">
                            Submitted
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 lg:p-6">
                      <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-2">
                        {album.title}
                      </h3>
                      {album.description && (
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] text-neutral-400 mb-2 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-1">
                        {formatDate(album.date)}
                      </p>
                      <p className="font-['Inter'] text-[11px] sm:text-[12px] text-neutral-500 mb-3 sm:mb-4">
                        By {album.creatorName}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500" />
                          <span className="font-['Inter'] text-[11px] sm:text-[12px] text-neutral-500">
                            {album.photosCount ?? album.photos.length} photos
                          </span>
                      </div>
                      {submitted && submission && (
                        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px] text-green-500">
                            {submission.selectedPhotos.length} photos selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredAlbums.map((album) => {
              const submitted = hasSubmitted(album.id);
              const submission = mySubmissions.find(sub => sub.albumId === album.id);
              
              return (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="block bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800 hover:border-neutral-600 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 lg:gap-6">
                    <div 
                      className="w-full h-[180px] sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-lg bg-cover bg-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${album.coverImage})` }}
                    />
                    
                    <div className="flex-1 w-full sm:w-auto min-w-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-2 gap-2">
                        <h3 className="font-['Inter'] font-extrabold text-[18px] sm:text-[20px] lg:text-[24px] text-neutral-100 tracking-[-0.9px] sm:tracking-[-1px] lg:tracking-[-1.2px]">
                          {album.title}
                        </h3>
                        {submitted && (
                          <div className="px-2 sm:px-3 py-1 bg-green-500 rounded-lg flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px] text-white font-medium">
                              Submitted
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="font-['Inter'] text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-400 mb-2">
                        By {album.creatorName} • {formatDate(album.date)}
                      </p>
                      {album.description && (
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-500 mb-3 sm:mb-4 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-500">
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px]">
                            {album.photos.length} photos available
                          </span>
                        </div>
                        {submitted && submission && (
                          <div className="flex items-center gap-1.5 sm:gap-2 text-green-500">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px]">
                              {submission.selectedPhotos.length} photos selected
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
