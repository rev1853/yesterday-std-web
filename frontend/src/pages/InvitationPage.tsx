import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { Camera, Lock, ArrowRight } from 'lucide-react';

export default function InvitationPage() {
  const { inviteCode } = useParams();
  const { user, albums, fetchAlbumByInvite } = useApp();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(() => albums.find(a => a.inviteCode === inviteCode));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inviteCode) return;

    if (!user) {
      sessionStorage.setItem('pendingInvite', inviteCode);
      navigate('/login');
      return;
    }

    if (user.role !== 'client') {
      setError('Only clients can access invitation links.');
      return;
    }

    if (album) return;

    setLoading(true);
    fetchAlbumByInvite(inviteCode)
      .then((fetched) => {
        setAlbum(fetched);
        sessionStorage.removeItem('pendingInvite');
      })
      .catch(() => setError('This invitation link is not valid or has expired.'))
      .finally(() => setLoading(false));
  }, [user, inviteCode, navigate, album, fetchAlbumByInvite]);

  const handleAcceptInvitation = () => {
    if (album) {
      navigate(`/album/${album.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[200px] pb-[100px] px-[138px]">
        <div className="max-w-[800px] mx-auto text-center">
          {loading && (
            <p className="font-['Inter'] text-[16px] text-neutral-400">Loading invitation...</p>
          )}

          {!loading && error && (
            <div className="mb-8">
              <Lock className="w-20 h-20 text-neutral-700 mx-auto mb-6" />
              <h1 className="font-['Inter'] font-extrabold text-[48px] text-neutral-100 tracking-[-2.4px] mb-4">
                Invitation Error
              </h1>
              <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && album && (
            <>
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-12 h-12 text-white" />
                </div>
                <h1 className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-4">
                  You're Invited!
                </h1>
                <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
                  {album.creatorName} has shared an album with you
                </p>
              </div>

              <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border-2 border-neutral-800 mb-8">
                <div 
                  className="h-[400px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${album.coverImage})` }}
                />
                <div className="p-8 text-left">
                  <h2 className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-2">
                    {album.title}
                  </h2>
                  <p className="font-['Inter'] text-[16px] text-neutral-400 mb-4">
                    {album.date}
                  </p>
                  {album.description && (
                    <p className="font-['Inter'] text-[16px] text-neutral-300 mb-6">
                      {album.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Camera className="w-5 h-5" />
                    <span className="font-['Inter'] text-[14px]">
                      {album.photos.length} photos to choose from
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAcceptInvitation}
                className="px-12 py-5 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[18px] tracking-[-0.9px] hover:bg-neutral-200 transition-colors flex items-center gap-3 mx-auto"
              >
                View Album & Select Photos
                <ArrowRight className="w-6 h-6" />
              </button>

              <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="font-['Inter'] text-[14px] text-blue-400">
                  💡 Browse the album and select your favorite photos. Your photographer will receive your selection and begin editing!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
