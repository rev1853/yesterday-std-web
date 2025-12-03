import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContainer';
import Navbar from '../components/Navbar';
import { Upload, X, Plus } from 'lucide-react';

type LocalPhoto = { url: string; file?: File };

export default function CreateAlbum() {
  const { user, addAlbum } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        showToast('error', 'No images found');
        return;
      }
      const newPhotos = imageFiles.map(file => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
      showToast('success', `${fileArray.length} images added successfully!`);
    }
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setPhotos([...photos, { url: photoUrl.trim() }]);
      setPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    const toRemove = photos[index];
    if (toRemove?.file) {
      URL.revokeObjectURL(toRemove.url);
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const newAlbum = {
      title,
      description,
      date,
      coverImage: photos.find(p => !p.file)?.url || '',
      creatorId: user.id,
      creatorName: user.name,
      status: 'active' as const,
      isPublic,
      photos,
    };

    await addAlbum(newAlbum);
    navigate('/albums');
    showToast('success', 'Album created successfully!');
  };

  // Sample photo URLs for quick demo
  const samplePhotos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  ];

  const addSamplePhotos = () => {
    setPhotos(samplePhotos.map(url => ({ url })));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
        <div className="max-w-full sm:max-w-[90%] lg:max-w-[800px] mx-auto">
          <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
            Create New Album
          </h1>
          <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px] mb-8 sm:mb-10 lg:mb-12">
            Upload photos and share with your clients
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 lg:space-y-8">
            <div>
              <label className="block font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-100 mb-2 sm:mb-3">
                Album Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Wedding Day - Sarah & John"
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl px-6 py-4">
              <div>
                <p className="font-['Inter'] font-extrabold text-[16px] text-neutral-100">Public Album</p>
                <p className="font-['Inter'] text-[14px] text-neutral-400">When public, any client can see it without an invite.</p>
              </div>
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 bg-[#0d0d0d]"
                />
                <span className="font-['Inter'] text-[14px] text-neutral-100">Public</span>
              </label>
            </div>

            <div>
              <label className="block font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-100 mb-2 sm:mb-3">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the album..."
                rows={3}
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] focus:outline-none focus:border-neutral-600 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-100 mb-2 sm:mb-3">
                Event Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] focus:outline-none focus:border-neutral-600 transition-colors [color-scheme:dark]"
                required
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-2 sm:mb-3 gap-2 sm:gap-0">
                <label className="block font-['Inter'] font-medium text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-100">
                  Photos ({photos.length})
                </label>
                <button
                  type="button"
                  onClick={addSamplePhotos}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-700 transition-colors"
                >
                  Add Sample Photos
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Enter photo URL..."
                  className="flex-1 px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] focus:outline-none focus:border-neutral-600 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPhoto())}
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-medium text-[13px] sm:text-[14px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add
                </button>
              </div>

              <div className="mb-3 sm:mb-4">
                <label className="w-full cursor-pointer">
                  <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] hover:border-neutral-600 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Select Images from Folder</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mb-3 sm:mb-4">
                <label className="w-full cursor-pointer">
                  <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 font-['Inter'] hover:border-neutral-600 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upload Entire Folder</span>
                  </div>
                  <input
                    type="file"
                    /* @ts-ignore */
                    webkitdirectory=""
                    directory=""
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-[180px] sm:h-[200px] object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-800 rounded-xl p-12 text-center">
                  <Upload className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                  <p className="font-['Inter'] text-[16px] text-neutral-500">
                    No photos added yet
                  </p>
                  <p className="font-['Inter'] text-[14px] text-neutral-600 mt-2">
                    Add photo URLs or use sample photos to get started
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8">
              <button
                type="button"
                onClick={() => navigate('/creator')}
                className="flex-1 py-3 sm:py-4 bg-neutral-800 text-neutral-100 rounded-xl font-['Inter'] font-medium text-[14px] sm:text-[16px] hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={photos.length === 0}
                className="flex-1 py-3 sm:py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] sm:text-[16px] tracking-[-0.7px] sm:tracking-[-0.8px] hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Album
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
