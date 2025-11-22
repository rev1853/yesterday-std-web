import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import FullscreenViewer from '../components/FullscreenViewer';
import TestimonialForm from '../components/TestimonialForm';
import TestimonialsList from '../components/TestimonialsList';
import { Check, ArrowLeft, Expand, MessageSquare, Star } from 'lucide-react';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const { getAlbum, user, submitSelection, testimonials, addTestimonial, updateTestimonial, submissions } = useApp();
  const navigate = useNavigate();
  const album = getAlbum(albumId || '');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Navbar />
        <p className="font-['Inter'] text-neutral-100">Album not found</p>
      </div>
    );
  }

  const togglePhoto = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedPhotos.size === 0) return;
    await submitSelection(album.id, Array.from(selectedPhotos));
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/client');
    }, 2000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isCreator = user?.role === 'creator' && album.creatorId === user.id;
  const isClient = user?.role === 'client';

  const existingTestimonial = testimonials.find(
    t => t.albumId === album.id && t.clientId === user?.id
  );

  const albumTestimonials = testimonials.filter(t => t.albumId === album.id);

  const hasSubmitted = submissions.some(
    s => s.albumId === album.id && s.clientId === user?.id
  );

  const handleTestimonialSubmit = async (rating: number, comment: string) => {
    if (!user) return;

    if (existingTestimonial) {
      await updateTestimonial(existingTestimonial.id, {
        rating,
        comment,
      });
    } else {
      await addTestimonial(album.id, rating, comment);
    }
    setShowTestimonialForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      {/* Back Button */}
      <div className="fixed top-[200px] left-[138px] z-40">
        <button
          onClick={handleBack}
          className="flex items-center gap-3 px-6 py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-neutral-100 rounded-xl font-['Inter'] font-medium text-[16px] transition-colors border border-neutral-800 hover:border-neutral-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[720px] mt-[172px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${album.coverImage})` }}
          />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center">
          <h1 className="font-['Inter'] font-extrabold text-[128px] leading-[141px] text-neutral-100 text-center tracking-[-6.4px] mb-4 [text-shadow:rgba(0,0,0,0.1)_0px_8px_20px]">
            {album.title}
          </h1>
          <p className="font-['Inter'] text-[20px] text-neutral-100 text-center tracking-[-1px] [text-shadow:rgba(0,0,0,0.1)_0px_8px_20px]">
            {album.date}
          </p>
        </div>
      </div>

      {/* Selection Controls */}
      {isClient && (
        <div className="sticky top-[150px] z-40 px-[138px] py-6 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="font-['Inter']">
              <span className="text-neutral-100 text-[20px] font-extrabold tracking-[-1px]">
                {selectedPhotos.size}
              </span>
              <span className="text-neutral-400 text-[16px] ml-2">
                photos selected
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={selectedPhotos.size === 0}
              className="px-8 py-3 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Submit Selection
            </button>
          </div>
        </div>
      )}

      {/* Photo Gallery - Masonry Layout */}
      <div className="px-[137px] py-[60px]">
        <div className="columns-3 gap-[15px] space-y-[15px]">
          {album.photos.map((photo, index) => {
            const isSelected = selectedPhotos.has(photo.id);
            const heights = [674, 500, 600, 450, 550, 700, 480, 620];
            const height = heights[index % heights.length];
            
            return (
              <div
                key={photo.id}
                className="break-inside-avoid relative group"
              >
                <div className="relative rounded-[15px] overflow-hidden">
                  <img
                    src={photo.url}
                    alt=""
                    className={`w-full h-auto object-cover transition-all duration-300 ${
                      isClient ? 'group-hover:scale-105' : ''
                    } ${isSelected ? 'scale-95' : ''}`}
                    style={{ height: `${height}px`, objectFit: 'cover' }}
                  />
                  
                  {isClient ? (
                    <>
                      <div 
                        className={`absolute inset-0 transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-500/30 backdrop-blur-[2px]' 
                            : 'bg-black/0 group-hover:bg-black/20'
                        }`}
                        onClick={() => togglePhoto(photo.id)}
                      />
                      
                      <div 
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-white/20 border-white backdrop-blur-sm'
                        }`}
                        onClick={() => togglePhoto(photo.id)}
                      >
                        {isSelected && <Check className="w-5 h-5 text-white" />}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenIndex(index);
                        }}
                        className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                        title="View Fullscreen"
                      >
                        <Expand className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div 
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 cursor-pointer"
                        onClick={() => setFullscreenIndex(index)}
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="p-4 bg-black/50 backdrop-blur-sm rounded-full">
                          <Expand className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonial Section - Only for clients who have submitted */}
      {isClient && hasSubmitted && (
        <div className="px-[138px] pb-[100px]">
          <div className="max-w-4xl mx-auto">
            {!showTestimonialForm && existingTestimonial ? (
              <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px] mb-1">
                        Your Review
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= existingTestimonial.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTestimonialForm(true)}
                    className="px-4 py-2 bg-[#0d0d0d] hover:bg-neutral-900 text-neutral-300 border-2 border-neutral-800 hover:border-neutral-700 rounded-lg font-['Inter'] font-medium text-[14px] transition-colors"
                  >
                    Edit Review
                  </button>
                </div>
                {existingTestimonial.comment && (
                  <p className="font-['Inter'] text-[16px] text-neutral-300 leading-relaxed">
                    {existingTestimonial.comment}
                  </p>
                )}
              </div>
            ) : !showTestimonialForm && !existingTestimonial ? (
              <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-1">
                        Share Your Experience
                      </h3>
                      <p className="font-['Inter'] text-[14px] text-neutral-400">
                        Help others by leaving a review for this album
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTestimonialForm(true)}
                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Write Review
                  </button>
                </div>
              </div>
            ) : (
              <TestimonialForm
                albumId={album.id}
                onSubmit={handleTestimonialSubmit}
                onCancel={() => setShowTestimonialForm(false)}
                existingTestimonial={existingTestimonial}
              />
            )}
          </div>
        </div>
      )}

      {/* Testimonials Display - For creators to view all reviews */}
      {isCreator && albumTestimonials.length > 0 && (
        <div className="px-[138px] pb-[100px]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="font-['Inter'] font-extrabold text-[40px] text-neutral-100 tracking-[-2px] mb-2">
                Client Reviews
              </h2>
              <p className="font-['Inter'] text-[16px] text-neutral-400">
                See what your clients think about this album
              </p>
            </div>
            <TestimonialsList testimonials={albumTestimonials} albumTitle={album.title} />
          </div>
        </div>
      )}

      {/* Fullscreen Viewer */}
      {fullscreenIndex !== null && (
        <FullscreenViewer
          photos={album.photos}
          currentIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] rounded-2xl p-12 max-w-md text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-4">
              Selection Submitted!
            </h3>
            <p className="font-['Inter'] text-[16px] text-neutral-400">
              Your photographer will receive your selection and start editing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
