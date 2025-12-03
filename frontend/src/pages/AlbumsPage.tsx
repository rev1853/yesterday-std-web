import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Image as ImageIcon, Eye, User } from 'lucide-react';

export default function AlbumsPage() {
  const { albums, users } = useApp();

  const getCreatorName = (creatorId: string) => {
    const creator = users.find(u => u.id === creatorId);
    return creator?.name || 'Unknown Creator';
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
            Albums Gallery
          </h1>
          <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
            Explore beautiful albums created by our talented photographers
          </p>
        </div>

        {/* Albums Grid */}
        {albums.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-[#1e1e1e] rounded-xl border-2 border-dashed border-neutral-800 px-4">
            <ImageIcon className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-neutral-700 mx-auto mb-3 sm:mb-4" />
            <p className="font-['Inter'] text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-500 mb-2">
              No albums yet
            </p>
            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-600">
              Check back soon for amazing photography collections
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {albums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800 hover:border-neutral-700 transition-all group"
              >
                <div className="relative overflow-hidden">
                  <div 
                    className="h-[220px] sm:h-[260px] lg:h-[300px] bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${album.coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Album info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
                    <h3 className="font-['Inter'] font-extrabold text-[18px] sm:text-[20px] lg:text-[24px] text-white tracking-[-0.9px] sm:tracking-[-1px] lg:tracking-[-1.2px] mb-2">
                      {album.title}
                    </h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-300">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px]">
                        {getCreatorName(album.creatorId)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between text-neutral-400">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px]">{album.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px]">{album.photosCount ?? album.photos.length} photos</span>
                    </div>
                  </div>
                  {album.description && (
                    <p className="font-['Inter'] text-[12px] sm:text-[13px] text-neutral-400 mt-3 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  
                  <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-100/5 rounded-lg group-hover:bg-neutral-100/10 transition-colors">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-300" />
                    <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px] text-neutral-300">
                      View Album
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
