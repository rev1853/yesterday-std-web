import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { Download, Check, ArrowLeft } from 'lucide-react';

export default function SubmissionReview() {
  const { albumId } = useParams();
  const { getAlbum, submissions } = useApp();
  const navigate = useNavigate();
  const album = getAlbum(albumId || '');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Navbar />
        <p className="font-['Inter'] text-neutral-100">Album not found</p>
      </div>
    );
  }

  const albumSubmissions = submissions.filter(sub => sub.albumId === album.id);

  const handleDownload = (submissionId: string) => {
    setSelectedSubmission(submissionId);
    setShowDownloadModal(true);
    // Simulate download
    setTimeout(() => {
      setShowDownloadModal(false);
      setSelectedSubmission(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[200px] pb-[100px] px-[138px]">
        <button
          onClick={() => navigate('/creator')}
          className="flex items-center gap-2 font-['Inter'] text-neutral-400 hover:text-neutral-100 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-12">
          <h1 className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-4">
            {album.title}
          </h1>
          <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
            Review client photo selections
          </p>
        </div>

        {albumSubmissions.length === 0 ? (
          <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border-2 border-neutral-800">
            <p className="font-['Inter'] text-[20px] text-neutral-500">
              No submissions yet for this album
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {albumSubmissions.map((submission) => {
              const selectedPhotos = album.photos.filter(photo => 
                submission.selectedPhotos.includes(photo.id)
              );

              return (
                <div
                  key={submission.id}
                  className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px] mb-2">
                        {submission.clientName}
                      </h3>
                      <p className="font-['Inter'] text-[14px] text-neutral-400">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </p>
                      <p className="font-['Inter'] text-[16px] text-neutral-300 mt-2">
                        {selectedPhotos.length} photos selected
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(submission.id)}
                      className="px-6 py-3 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Selected
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {selectedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group"
                      >
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-[200px] object-cover rounded-xl"
                        />
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] rounded-2xl p-12 max-w-md text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Download className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-4">
              Downloading...
            </h3>
            <p className="font-['Inter'] text-[16px] text-neutral-400">
              Preparing selected photos for download
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
