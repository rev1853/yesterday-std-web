import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import { Download, Check, ArrowLeft } from 'lucide-react';

export default function SubmissionReview() {
  const { albumId } = useParams();
  const { getAlbum, submissions } = useApp();
  const navigate = useNavigate();
  const album = getAlbum(albumId || '');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Navbar />
        <p className="font-['Inter'] text-neutral-100">Album not found</p>
      </div>
    );
  }

  const albumSubmissions = submissions.filter(sub => sub.albumId === album.id);

  const handleDownload = async (submissionId: string) => {
    setSelectedSubmission(submissionId);
    setDownloadError(null);
    setShowDownloadModal(true);
    try {
      const { data } = await api.get(`/submissions/${submissionId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `submission-${submissionId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to download photos';
      setDownloadError(message);
    } finally {
      setShowDownloadModal(false);
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
        <button
          onClick={() => navigate('/creator')}
          className="flex items-center gap-1.5 sm:gap-2 font-['Inter'] text-[13px] sm:text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors mb-6 sm:mb-7 lg:mb-8"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
            {album.title}
          </h1>
          <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
            Review client photo selections
          </p>
        </div>

        {albumSubmissions.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-[#1e1e1e] rounded-xl border-2 border-neutral-800">
            <p className="font-['Inter'] text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-500">
              No submissions yet for this album
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-7 lg:space-y-8">
            {albumSubmissions.map((submission) => {
              const selectedPhotos = album.photos.filter(photo => 
                submission.selectedPhotos.includes(photo.id)
              );

              return (
                <div
                  key={submission.id}
                  className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 lg:p-8 border-2 border-neutral-800"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-5 sm:mb-6 gap-4">
                    <div>
                      <h3 className="font-['Inter'] font-extrabold text-[18px] sm:text-[20px] lg:text-[24px] text-neutral-100 tracking-[-0.9px] sm:tracking-[-1px] lg:tracking-[-1.2px] mb-2">
                        {submission.clientName}
                      </h3>
                      <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </p>
                      <p className="font-['Inter'] text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-300 mt-2">
                        {selectedPhotos.length} photos selected
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(submission.id)}
                      className="w-full sm:w-auto px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[13px] sm:text-[14px] lg:text-[16px] tracking-[-0.65px] sm:tracking-[-0.7px] lg:tracking-[-0.8px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download Selected
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {selectedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group"
                      >
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-[140px] sm:h-[170px] lg:h-[200px] object-cover rounded-xl"
                        />
                        <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1e1e1e] rounded-2xl p-8 sm:p-10 lg:p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6 animate-pulse">
              <Download className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
            </div>
            <h3 className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-3 sm:mb-4">
              Preparing download...
            </h3>
            <p className="font-['Inter'] text-[13px] sm:text-[14px] lg:text-[16px] text-neutral-400">
              We are zipping the selected photos.
            </p>
            {downloadError && (
              <p className="font-['Inter'] text-[12px] text-red-400 mt-3">{downloadError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
