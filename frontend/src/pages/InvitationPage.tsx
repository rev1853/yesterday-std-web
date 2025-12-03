import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AlbumDetail from './AlbumDetail';
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

  // When we have the album and are authorized, render the album detail in-place to keep the invite URL.
  if (!loading && !error && album) {
    return <AlbumDetail overrideAlbumId={album.id} />;
  }

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

          {!loading && !error && !album && (
            <div className="mb-8">
              <Camera className="w-20 h-20 text-neutral-700 mx-auto mb-6" />
              <h1 className="font-['Inter'] font-extrabold text-[48px] text-neutral-100 tracking-[-2.4px] mb-4">
                Invitation
              </h1>
              <p className="font-['Inter'] text-[16px] text-neutral-400">
                No album found for this invitation.
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors"
          >
            <ArrowRight className="w-5 h-5 inline-block mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
