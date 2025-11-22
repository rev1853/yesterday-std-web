import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
}

interface FullscreenViewerProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  showDownload?: boolean;
}

export default function FullscreenViewer({ 
  photos, 
  currentIndex: initialIndex, 
  onClose,
  showDownload = false 
}: FullscreenViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photos[currentIndex].url;
    link.download = `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 via-black/50 to-transparent pt-4 pb-12">
        <div className="flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <p className="font-['Inter'] text-neutral-100 text-[16px] font-medium">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="font-['Inter'] text-neutral-100 text-[14px] w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {/* Download Button */}
            {showDownload && (
              <button
                onClick={handleDownload}
                className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-100 rounded-lg transition-colors"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-3 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-100 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="absolute inset-0 flex items-center justify-center p-20">
        <div 
          className="relative max-w-full max-h-full overflow-auto"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          <img
            src={photos[currentIndex].url}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-100 rounded-lg transition-all hover:scale-110"
            title="Previous (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-100 rounded-lg transition-all hover:scale-110"
            title="Next (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-2 p-6 overflow-x-auto">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setZoom(1);
                }}
                className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-neutral-100 scale-110'
                    : 'border-neutral-700 hover:border-neutral-500 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="absolute bottom-24 left-6 z-10">
        <div className="bg-neutral-800/50 rounded-lg p-4 backdrop-blur-sm">
          <p className="font-['Inter'] text-neutral-300 text-[10px] mb-2 font-medium">
            KEYBOARD SHORTCUTS
          </p>
          <div className="space-y-1">
            <p className="font-['Inter'] text-neutral-400 text-[10px]">← → Arrow keys to navigate</p>
            <p className="font-['Inter'] text-neutral-400 text-[10px]">+ - Zoom in/out</p>
            <p className="font-['Inter'] text-neutral-400 text-[10px]">ESC Close viewer</p>
          </div>
        </div>
      </div>
    </div>
  );
}