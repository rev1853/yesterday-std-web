import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, CheckCircle, Clock, Search, Filter, Grid3x3, List } from 'lucide-react';

export default function ClientDashboard() {
  const { user, albums, submissions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'submitted'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get albums that have invite codes (available to clients)
  const availableAlbums = albums.filter(album => album.inviteCode);
  
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
      
      <div className="pt-[200px] pb-[100px] px-[138px]">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-4">
            Discover Albums
          </h1>
          <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
            Browse and select your favorite photos from available albums
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <Camera className="w-8 h-8 text-blue-500" />
            </div>
            <p className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-1">
              {availableAlbums.length}
            </p>
            <p className="font-['Inter'] text-[14px] text-neutral-400">Available Albums</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-1">
              {mySubmissions.length}
            </p>
            <p className="font-['Inter'] text-[14px] text-neutral-400">Submitted Selections</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-1">
              {mySubmissions.filter(s => s.status === 'pending').length}
            </p>
            <p className="font-['Inter'] text-[14px] text-neutral-400">Pending Review</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums by title, creator, or description..."
                className="w-full pl-12 pr-6 py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-4 rounded-xl font-['Inter'] transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-neutral-100 text-[#0d0d0d]'
                    : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-4 rounded-xl font-['Inter'] transition-colors ${
                  viewMode === 'list'
                    ? 'bg-neutral-100 text-[#0d0d0d]'
                    : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-lg font-['Inter'] font-medium text-[14px] transition-colors ${
                filterStatus === 'all'
                  ? 'bg-neutral-100 text-[#0d0d0d]'
                  : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              All Albums ({availableAlbums.length})
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className={`px-6 py-3 rounded-lg font-['Inter'] font-medium text-[14px] transition-colors ${
                filterStatus === 'available'
                  ? 'bg-neutral-100 text-[#0d0d0d]'
                  : 'bg-[#1e1e1e] border-2 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              Available ({availableAlbums.filter(a => !hasSubmitted(a.id)).length})
            </button>
            <button
              onClick={() => setFilterStatus('submitted')}
              className={`px-6 py-3 rounded-lg font-['Inter'] font-medium text-[14px] transition-colors ${
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
          <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border-2 border-neutral-800">
            <Camera className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
            <p className="font-['Inter'] text-[20px] text-neutral-500 mb-2">
              {searchQuery ? 'No albums found' : 'No albums available yet'}
            </p>
            <p className="font-['Inter'] text-[14px] text-neutral-600">
              {searchQuery ? 'Try a different search term' : 'Your photographer will share albums with you via invitation links'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-6">
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
                    <div className="relative">
                      <div 
                        className="h-[300px] bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundImage: `url(${album.coverImage})` }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {submitted && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 rounded-lg flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-white" />
                          <span className="font-['Inter'] text-[12px] text-white font-medium">
                            Submitted
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-2">
                        {album.title}
                      </h3>
                      <p className="font-['Inter'] text-[14px] text-neutral-400 mb-1">
                        {album.date}
                      </p>
                      <p className="font-['Inter'] text-[12px] text-neutral-500 mb-4">
                        By {album.creatorName}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Camera className="w-4 h-4 text-neutral-500" />
                        <span className="font-['Inter'] text-[12px] text-neutral-500">
                          {album.photos.length} photos
                        </span>
                      </div>
                      {submitted && submission && (
                        <div className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="font-['Inter'] text-[12px] text-green-500">
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
          <div className="space-y-4">
            {filteredAlbums.map((album) => {
              const submitted = hasSubmitted(album.id);
              const submission = mySubmissions.find(sub => sub.albumId === album.id);
              
              return (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="block bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800 hover:border-neutral-600 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-40 h-40 rounded-lg bg-cover bg-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${album.coverImage})` }}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px]">
                          {album.title}
                        </h3>
                        {submitted && (
                          <div className="px-3 py-1 bg-green-500 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-white" />
                            <span className="font-['Inter'] text-[12px] text-white font-medium">
                              Submitted
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="font-['Inter'] text-[16px] text-neutral-400 mb-2">
                        By {album.creatorName} • {album.date}
                      </p>
                      {album.description && (
                        <p className="font-['Inter'] text-[14px] text-neutral-500 mb-4 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-neutral-500">
                          <Camera className="w-4 h-4" />
                          <span className="font-['Inter'] text-[14px]">
                            {album.photos.length} photos available
                          </span>
                        </div>
                        {submitted && submission && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-['Inter'] text-[14px]">
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