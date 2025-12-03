import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus, Link2, Download, Eye, Clock, CheckCircle, Calendar, Image as ImageIcon, Users, BarChart3 } from 'lucide-react';

export default function CreatorDashboard() {
    const { user, albums, submissions, generateInviteLink } = useApp();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Get creator's albums
    const myAlbums = albums.filter(album => album.creatorId === user?.id);

    // Get submissions for creator's albums
    const mySubmissions = submissions.filter(sub =>
        myAlbums.some(album => album.id === sub.albumId)
    );

    const handleGenerateLink = async (albumId: string) => {
        const inviteCode = await generateInviteLink(albumId);
        const inviteUrl = `${window.location.origin}/invitation/${inviteCode}`;

        // Try modern clipboard API first, with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(inviteUrl)
                .then(() => {
                    setCopiedCode(albumId);
                    setTimeout(() => setCopiedCode(null), 2000);
                })
                .catch(() => {
                    // Fallback to legacy method
                    fallbackCopyToClipboard(inviteUrl, albumId);
                });
        } else {
            // Use fallback method
            fallbackCopyToClipboard(inviteUrl, albumId);
        }
    };

    const fallbackCopyToClipboard = (text: string, albumId: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            setCopiedCode(albumId);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Show the URL in a prompt as last resort
            prompt('Copy this invitation link:', text);
        } finally {
            document.body.removeChild(textArea);
        }
    };

    const getAlbumSubmissions = (albumId: string) => {
        return submissions.filter(sub => sub.albumId === albumId);
    };

    // Statistics
    const totalPhotos = myAlbums.reduce((acc, album) => acc + album.photos.length, 0);
    const pendingSubmissions = mySubmissions.filter(s => s.status === 'pending').length;
    const completedSubmissions = mySubmissions.filter(s => s.status === 'completed').length;

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            <Navbar />

            <div className="pt-[120px] sm:pt-[150px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
                {/* Header */}
                <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-0">
                    <div>
                        <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] lg:tracking-[-3.2px] mb-2 sm:mb-3 lg:mb-4">
                            Creator Studio
                        </h1>
                        <p className="font-['Inter'] text-[14px] sm:text-[16px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] lg:tracking-[-1px]">
                            Manage your albums and client selections
                        </p>
                    </div>
                    <Link
                        to="/creator/create-album"
                        className="w-full sm:w-auto px-6 sm:px-7 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] sm:text-[15px] lg:text-[16px] tracking-[-0.7px] sm:tracking-[-0.75px] lg:tracking-[-0.8px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Create New Album
                    </Link>
                </div>

                {/* Statistics Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
                    <div className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
                        </div>
                        <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
                            {myAlbums.length}
                        </p>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Total Albums</p>
                    </div>

                    <div className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500" />
                        </div>
                        <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
                            {totalPhotos}
                        </p>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Total Photos</p>
                    </div>

                    <div className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-500" />
                        </div>
                        <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
                            {pendingSubmissions}
                        </p>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Pending Reviews</p>
                    </div>

                    <div className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-500" />
                        </div>
                        <p className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-neutral-100 tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px] mb-1">
                            {mySubmissions.length}
                        </p>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">Total Submissions</p>
                    </div>
                </div>

                {/* Pending Submissions Alert */}
                {pendingSubmissions > 0 && (
                    <div className="mb-8 sm:mb-10 lg:mb-12 bg-neutral-800/50 border-2 border-neutral-700 rounded-xl p-4 sm:p-5 lg:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300 shrink-0 mt-0.5 sm:mt-1" />
                            <div className="flex-1">
                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-2">
                                    {pendingSubmissions} Submission{pendingSubmissions > 1 ? 's' : ''} Awaiting Review
                                </h3>
                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-300 mb-3 sm:mb-4">
                                    You have client selections waiting for your review. Download and start editing!
                                </p>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {mySubmissions
                                        .filter(s => s.status === 'pending')
                                        .map((submission) => {
                                            const album = albums.find(a => a.id === submission.albumId);
                                            if (!album) return null;
                                            return (
                                                <Link
                                                    key={submission.id}
                                                    to={`/creator/submission/${album.id}`}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500 text-[#0d0d0d] rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-yellow-400 transition-colors"
                                                >
                                                    Review {album.title}
                                                </Link>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Albums Section */}
                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 gap-3 sm:gap-0">
                        <h2 className="font-['Inter'] font-extrabold text-[24px] sm:text-[28px] lg:text-[32px] text-white tracking-[-1.2px] sm:tracking-[-1.4px] lg:tracking-[-1.6px]">
                            My Albums
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] transition-colors ${viewMode === 'grid'
                                    ? 'bg-neutral-100 text-[#0d0d0d]'
                                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                    }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] transition-colors ${viewMode === 'list'
                                    ? 'bg-neutral-100 text-[#0d0d0d]'
                                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                    }`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {myAlbums.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 lg:py-20 bg-[#1e1e1e] rounded-xl border-2 border-dashed border-neutral-800 px-4">
                            <Plus className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-neutral-700 mx-auto mb-3 sm:mb-4" />
                            <p className="font-['Inter'] text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-500 mb-3 sm:mb-4">
                                No albums yet
                            </p>
                            <Link
                                to="/creator/create-album"
                                className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-medium text-[13px] sm:text-[14px] hover:bg-neutral-200 transition-colors"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                Create Your First Album
                            </Link>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                            {myAlbums.map((album) => {
                                const albumSubmissions = getAlbumSubmissions(album.id);
                                const pendingCount = albumSubmissions.filter(s => s.status === 'pending').length;

                                return (
                                    <div
                                        key={album.id}
                                        className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800 hover:border-neutral-700 transition-all group"
                                    >
                                        <Link to={`/album/${album.id}`} className="block relative overflow-hidden">
                                            <div
                                                className="h-[200px] sm:h-[220px] lg:h-[250px] bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${album.coverImage})` }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                        </Link>
                                        <div className="p-4 sm:p-5 lg:p-6">
                                            <Link to={`/album/${album.id}`}>
                                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-2 hover:text-neutral-300 transition-colors">
                                                    {album.title}
                                                </h3>
                                            </Link>
                                            {album.description && (
                                                <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-2 line-clamp-2">
                                                    {album.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 text-neutral-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px]">{album.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px]">{album.photosCount ?? album.photos.length} photos</span>
                                                </div>
                                            </div>

                                            {pendingCount > 0 && (
                                                <div className="mb-3 sm:mb-4 px-2 sm:px-3 py-1.5 sm:py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                    <p className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px] text-yellow-500 flex items-center gap-1 sm:gap-2">
                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        {pendingCount} pending submission{pendingCount > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {album.inviteCode ? (
                                                    <button
                                                        onClick={() => handleGenerateLink(album.id)}
                                                        className="w-full py-1.5 sm:py-2 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                    >
                                                        {copiedCode === album.id ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                Link Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                Copy Invite Link
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleGenerateLink(album.id)}
                                                        className="w-full py-1.5 sm:py-2 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                    >
                                                        <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        Generate Invite Link
                                                    </button>
                                                )}

                                                {albumSubmissions.length > 0 && (
                                                    <Link
                                                        to={`/creator/submission/${album.id}`}
                                                        className="w-full py-1.5 sm:py-2 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                                    >
                                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        View Submissions ({albumSubmissions.length})
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {myAlbums.map((album) => {
                                const albumSubmissions = getAlbumSubmissions(album.id);
                                const pendingCount = albumSubmissions.filter(s => s.status === 'pending').length;

                                return (
                                    <div
                                        key={album.id}
                                        className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-neutral-800 hover:border-neutral-700 transition-all"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 lg:gap-6">
                                            <Link to={`/album/${album.id}`} className="shrink-0 w-full sm:w-auto">
                                                <div
                                                    className="w-full h-[180px] sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg bg-cover bg-center hover:scale-105 transition-transform"
                                                    style={{ backgroundImage: `url(${album.coverImage})` }}
                                                />
                                            </Link>

                                            <div className="flex-1 w-full sm:w-auto min-w-0">
                                                <Link to={`/album/${album.id}`}>
                                                    <h3 className="font-['Inter'] font-extrabold text-[18px] sm:text-[20px] lg:text-[24px] text-neutral-100 tracking-[-0.9px] sm:tracking-[-1px] lg:tracking-[-1.2px] mb-2 hover:text-neutral-300 transition-colors">
                                                        {album.title}
                                                    </h3>
                                                </Link>
                                                {album.description && (
                                                    <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-2 line-clamp-2">
                                                        {album.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 mb-2 sm:mb-3 text-neutral-400">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="font-['Inter'] text-[11px] sm:text-[12px] lg:text-[14px]">{album.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="font-['Inter'] text-[11px] sm:text-[12px] lg:text-[14px]">{album.photosCount ?? album.photos.length} photos</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="font-['Inter'] text-[11px] sm:text-[12px] lg:text-[14px]">{albumSubmissions.length} submissions</span>
                                                    </div>
                                                </div>

                                                {pendingCount > 0 && (
                                                    <div className="mb-2 sm:mb-3 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                                        <span className="font-['Inter'] text-[10px] sm:text-[11px] lg:text-[12px] text-yellow-500">
                                                            {pendingCount} pending review{pendingCount > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full sm:w-auto">
                                                {album.inviteCode ? (
                                                    <button
                                                        onClick={() => handleGenerateLink(album.id)}
                                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                                    >
                                                        {copiedCode === album.id ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                Copy Link
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleGenerateLink(album.id)}
                                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                                    >
                                                        <Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        Generate Link
                                                    </button>
                                                )}

                                                {albumSubmissions.length > 0 && (
                                                    <Link
                                                        to={`/creator/submission/${album.id}`}
                                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                                    >
                                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        View ({albumSubmissions.length})
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
