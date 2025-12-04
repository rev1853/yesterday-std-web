import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import FullscreenViewer from '../components/FullscreenViewer';
import TestimonialForm from '../components/TestimonialForm';
import TestimonialsList from '../components/TestimonialsList';
import { Check, ArrowLeft, Expand, MessageSquare, Star } from 'lucide-react';
import { formatDate } from '@/utils/date';

export default function AlbumDetail({ overrideAlbumId }: { overrideAlbumId?: string }) {
    const { albumId: paramAlbumId } = useParams();
    const { getAlbum, user, submitSelection, testimonials, addTestimonial, updateTestimonial, submissions } = useApp();
    const navigate = useNavigate();
    const targetAlbumId = overrideAlbumId ?? paramAlbumId ?? '';
    const album = getAlbum(targetAlbumId);
    const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
    const [showSuccess, setShowSuccess] = useState(false);
    const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);

    const existingSubmission = submissions.find(
        s => s.albumId === album?.id && s.clientId === user?.id
    );

    useEffect(() => {
        if (existingSubmission) {
            setSelectedPhotos(new Set(existingSubmission.selectedPhotos));
        }
    }, [existingSubmission]);

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

    const handlePhotoClick = (index: number, photoId: string) => {
        if (isClient) {
            togglePhoto(photoId);
        } else {
            setFullscreenIndex(index);
        }
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
            <div className="fixed top-[120px] sm:top-[150px] lg:top-[200px] left-4 sm:left-8 md:left-16 lg:left-[138px] z-40">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-neutral-100 rounded-xl font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] transition-colors border border-neutral-800 hover:border-neutral-700"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Back
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative h-[300px] sm:h-[450px] md:h-[550px] lg:h-[720px] mt-[100px] sm:mt-[130px] lg:mt-[175px] overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/85" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${album.coverImage})` }}
                    />
                </div>

                <div className="relative h-full flex flex-col items-center justify-center px-4">
                    <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[56px] md:text-[88px] lg:text-[128px] leading-[1.1] text-neutral-100 text-center tracking-[-1.6px] sm:tracking-[-2.8px] md:tracking-[-4.4px] lg:tracking-[-6.4px] mb-2 sm:mb-3 lg:mb-4 [text-shadow:rgba(0,0,0,0.1)_0px_8px_20px]">
                        {album.title}
                    </h1>
                    <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-100 text-center tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px] [text-shadow:rgba(0,0,0,0.1)_0px_8px_20px]">
                        {formatDate(album.date)}
                    </p>
                </div>
            </div>

            {/* Selection Controls */}
            {isClient && (
                <div className="sticky top-[80px] sm:top-[100px] lg:top-[150px] z-40 px-4 sm:px-8 md:px-16 lg:px-[138px] py-4 sm:py-5 lg:py-6 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-neutral-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="font-['Inter']">
                            <span className="text-neutral-100 text-[16px] sm:text-[18px] lg:text-[20px] font-extrabold tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px]">
                                {selectedPhotos.size}
                            </span>
                            <span className="text-neutral-400 text-[13px] sm:text-[14px] lg:text-[16px] ml-2">
                                photos selected
                            </span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedPhotos.size === 0}
                            className="w-full sm:w-auto px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[13px] sm:text-[14px] lg:text-[16px] tracking-[-0.65px] sm:tracking-[-0.7px] lg:tracking-[-0.8px] hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            {existingSubmission ? 'Update Selection' : 'Submit Selection'}
                        </button>
                    </div>
                </div>
            )}

            {/* Photo Gallery - Masonry Layout */}
            <div className="px-4 sm:px-8 md:px-16 lg:px-[137px] py-8 sm:py-10 md:py-12 lg:py-[60px]">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 lg:gap-[15px] space-y-3 sm:space-y-4 lg:space-y-[15px]">
                    {album.photos.map((photo, index) => {
                        const isSelected = selectedPhotos.has(photo.id);
                        const heights = [674, 500, 600, 450, 550, 700, 480, 620];
                        const height = heights[index % heights.length];

                        return (
                            <div
                                key={photo.id}
                                className="break-inside-avoid relative group"
                            >
                                <div className="relative rounded-xl sm:rounded-[12px] lg:rounded-[15px] overflow-hidden">
                                    <img
                                        src={photo.url}
                                        alt=""
                                        className={`w-full h-auto object-cover transition-all duration-300 ${isClient ? 'group-hover:scale-105' : ''
                                            } ${isSelected ? 'scale-95' : ''}`}
                                        style={{ height: `${height}px`, objectFit: 'cover' }}
                                    />

                                    {isClient ? (
                                        <>
                                            <div
                                                className={`absolute inset-0 transition-all duration-300 cursor-pointer ${isSelected
                                                        ? 'bg-blue-500/30 backdrop-blur-[2px]'
                                                        : 'bg-black/0 group-hover:bg-black/20'
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePhoto(photo.id);
                                                }}
                                            />

                                            <div
                                                className={`absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${isSelected
                                                        ? 'bg-blue-500 border-blue-500'
                                                        : 'bg-white/20 border-white backdrop-blur-sm'
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePhoto(photo.id);
                                                }}
                                            >
                                                {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />}
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFullscreenIndex(index);
                                                }}
                                                className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                                                title="View Fullscreen"
                                            >
                                                <Expand className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 cursor-pointer"
                                                onClick={() => setFullscreenIndex(index)}
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div className="p-3 sm:p-4 bg-black/50 backdrop-blur-sm rounded-full">
                                                    <Expand className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
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
                <div className="px-4 sm:px-8 md:px-16 lg:px-[138px] pb-12 sm:pb-16 md:pb-20 lg:pb-[100px]">
                    <div className="max-w-4xl mx-auto">
                        {!showTestimonialForm && existingTestimonial ? (
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 lg:p-8 border-2 border-neutral-800">
                                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-['Inter'] font-extrabold text-[18px] sm:text-[20px] lg:text-[24px] text-neutral-100 tracking-[-0.9px] sm:tracking-[-1px] lg:tracking-[-1.2px] mb-1">
                                                Your Review
                                            </h3>
                                            <div className="flex items-center gap-1 sm:gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= existingTestimonial.rating
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
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0d0d0d] hover:bg-neutral-900 text-neutral-300 border-2 border-neutral-800 hover:border-neutral-700 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] transition-colors shrink-0"
                                    >
                                        Edit Review
                                    </button>
                                </div>
                                {existingTestimonial.comment && (
                                    <p className="font-['Inter'] text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-300 leading-relaxed">
                                        {existingTestimonial.comment}
                                    </p>
                                )}
                            </div>
                        ) : !showTestimonialForm && !existingTestimonial ? (
                            <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 lg:p-8 border-2 border-neutral-800">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-1">
                                                Share Your Experience
                                            </h3>
                                            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">
                                                Help others by leaving a review for this album
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowTestimonialForm(true)}
                                        className="w-full sm:w-auto px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-neutral-100 hover:bg-neutral-200 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[13px] sm:text-[14px] lg:text-[16px] tracking-[-0.65px] sm:tracking-[-0.7px] lg:tracking-[-0.8px] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <div className="px-4 sm:px-8 md:px-16 lg:px-[138px] pb-12 sm:pb-16 md:pb-20 lg:pb-[100px]">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6 sm:mb-8">
                            <h2 className="font-['Inter'] font-extrabold text-[28px] sm:text-[32px] lg:text-[40px] text-neutral-100 tracking-[-1.4px] sm:tracking-[-1.6px] lg:tracking-[-2px] mb-2">
                                Client Reviews
                            </h2>
                            <p className="font-['Inter'] text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-400">
                                See what your clients think about this album
                            </p>
                        </div>
                        <TestimonialsList testimonials={albumTestimonials} albumTitle={album.title} />
                    </div>
                </div>
            )}

            {fullscreenIndex !== null && (
                <FullscreenViewer
                    photos={album.photos}
                    currentIndex={fullscreenIndex}
                    onClose={() => setFullscreenIndex(null)}
                />
            )}

            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-[#1e1e1e] rounded-2xl p-8 sm:p-10 lg:p-12 max-w-md w-full text-center">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                            <Check className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
                        </div>
                        <h3 className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-3 sm:mb-4">
                            Selection Submitted!
                        </h3>
                        <p className="font-['Inter'] text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-400">
                            Your photographer will receive your selection and start editing.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
