import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import api from '../lib/api';
import { Camera, CheckCircle, Users, Star, ArrowRight } from 'lucide-react';

type LandingTestimonial = {
    id: string;
    client_name: string;
    album_title: string;
    rating: number;
    comment: string;
    created_at: string;
};

export default function HomePage() {
    const { albums, user } = useApp();
    const publicAlbums = albums.filter(a => a.status === 'active').slice(0, 6);
    const [testimonials, setTestimonials] = useState<LandingTestimonial[]>([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await api.get('/public/testimonials', { params: { limit: 6 } });
                setTestimonials(data);
            } catch (error) {
                setTestimonials([]);
            }
        };

        fetchTestimonials();
    }, []);

    const features = [
        {
            icon: Camera,
            title: 'For Photographers',
            description: 'Upload albums, generate private invitation links, and manage client selections efficiently.',
            color: 'blue',
        },
        {
            icon: CheckCircle,
            title: 'Easy Selection',
            description: 'Clients can browse albums and select their favorite photos with a simple, intuitive interface.',
            color: 'green',
        },
        {
            icon: Users,
            title: 'Seamless Collaboration',
            description: 'Bridge the gap between photographers and clients with effortless photo selection workflow.',
            color: 'purple',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[720px] mt-[100px] sm:mt-[130px] lg:mt-[175px] overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/75 via-[#0d0d0d]/90 to-[#0d0d0d]" />
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1678798694643-2b8fddcf900f?w=1600&q=80)'
                        }}
                    />
                </div>

                <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-[138px]">
                    <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[64px] lg:text-[94px] leading-[1.08] text-[#f3f3f3] text-center tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-3.2px] lg:tracking-[-4.7px] mb-4 sm:mb-6 max-w-[90%] sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1227px] [text-shadow:rgba(0,0,0,0.5)_0px_8px_24px]">
                        <p className="mb-0">Bridging clients</p>
                        <p>and photographers through effortless photo selection</p>
                    </h1>
                    <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-100 text-center tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px] mb-6 sm:mb-8 max-w-[90%] sm:max-w-[500px] [text-shadow:rgba(0,0,0,0.5)_0px_8px_24px]">
                        Start selecting your best moments, and let your photographer handle the rest.
                    </p>
                    {!user && (
                        <Link
                            to="/login"
                            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] sm:text-[16px] lg:text-[18px] tracking-[-0.7px] sm:tracking-[-0.8px] lg:tracking-[-0.9px] hover:bg-neutral-200 transition-colors flex items-center gap-2 sm:gap-3"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="px-4 sm:px-8 md:px-16 lg:px-[138px] py-12 sm:py-16 md:py-20 lg:py-[100px]">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="font-['Inter'] font-extrabold text-[28px] sm:text-[36px] md:text-[40px] lg:text-[48px] text-white tracking-[-1.4px] sm:tracking-[-1.8px] md:tracking-[-2px] lg:tracking-[-2.4px] mb-3 sm:mb-4">
                        How It Works
                    </h2>
                    <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
                        A simple platform designed for photographers and their clients
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#1e1e1e] rounded-xl p-6 sm:p-7 lg:p-8 border-2 border-neutral-800 hover:border-neutral-700 transition-all group"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 ${feature.color === 'blue' ? 'bg-blue-500/10' :
                                feature.color === 'green' ? 'bg-green-500/10' :
                                    'bg-purple-500/10'
                                }`}>
                                <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${feature.color === 'blue' ? 'text-blue-500' :
                                    feature.color === 'green' ? 'text-green-500' :
                                        'text-purple-500'
                                    }`} />
                            </div>
                            <h3 className="font-['Inter'] font-extrabold text-[18px] sm:text-[20px] lg:text-[24px] text-neutral-100 tracking-[-0.9px] sm:tracking-[-1px] lg:tracking-[-1.2px] mb-2 sm:mb-3">
                                {feature.title}
                            </h3>
                            <p className="font-['Inter'] text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Public Albums Section */}
            <div className="px-4 sm:px-8 md:px-16 lg:px-[138px] py-10 sm:py-12 md:py-16 lg:py-[60px] bg-[#0d0d0d]">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-8 gap-4">
                    <div>
                        <h2 className="font-['Inter'] font-extrabold text-[28px] sm:text-[36px] md:text-[40px] lg:text-[48px] text-white tracking-[-1.4px] sm:tracking-[-1.8px] md:tracking-[-2px] lg:tracking-[-2.4px] mb-2">
                            Featured Albums
                        </h2>
                        <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
                            Explore our latest photography projects
                        </p>
                    </div>
                    {user && (
                        <Link
                            to={user.role === 'client' ? '/client' : user.role === 'creator' ? '/creator' : '/admin'}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium text-[13px] sm:text-[14px] hover:bg-neutral-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            View All Albums
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-[15px] mb-6 sm:mb-8">
                    {publicAlbums.slice(0, 3).map((album) => (
                        <Link
                            key={album.id}
                            to={user ? `/album/${album.id}` : '/login'}
                            className="group relative h-[250px] sm:h-[280px] lg:h-[300px] rounded-[10px] overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundImage: `url(${album.coverImage})` }}
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
                            <div className="absolute inset-0 flex items-end justify-center p-5 sm:p-6 lg:p-[30px]">
                                <div className="text-center">
                                    <p className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-white tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-1">
                                        {album.title}
                                    </p>
                                    {album.description && (
                                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-white/80 mb-2 line-clamp-2">
                                            {album.description}
                                        </p>
                                    )}
                                    <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-white tracking-[-0.6px] sm:tracking-[-0.65px] lg:tracking-[-0.7px] mb-2">
                                        {album.date}
                                    </p>
                                    <p className="font-['Inter'] text-[11px] sm:text-[12px] text-white/80">
                                        By {album.creatorName}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {publicAlbums.length > 3 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-[15px]">
                        {publicAlbums.slice(3, 6).map((album) => (
                            <Link
                                key={album.id}
                                to={user ? `/album/${album.id}` : '/login'}
                                className="group relative h-[250px] sm:h-[280px] lg:h-[300px] rounded-[10px] overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${album.coverImage})` }}
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
                                <div className="absolute inset-0 flex items-end justify-center p-5 sm:p-6 lg:p-[30px]">
                                    <div className="text-center">
                                        <p className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-white tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-1">
                                            {album.title}
                                        </p>
                                        {album.description && (
                                            <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-white/80 mb-2 line-clamp-2">
                                                {album.description}
                                            </p>
                                        )}
                                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-white tracking-[-0.6px] sm:tracking-[-0.65px] lg:tracking-[-0.7px] mb-2">
                                            {album.date}
                                        </p>
                                        <p className="font-['Inter'] text-[11px] sm:text-[12px] text-white/80">
                                            By {album.creatorName}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Testimonials Section */}
            <div className="px-4 sm:px-8 md:px-16 lg:px-[138px] py-12 sm:py-16 md:py-20 lg:py-[100px] bg-[#0d0d0d]">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="font-['Inter'] font-extrabold text-[28px] sm:text-[36px] md:text-[40px] lg:text-[48px] text-white tracking-[-1.4px] sm:tracking-[-1.8px] md:tracking-[-2px] lg:tracking-[-2.4px] mb-3 sm:mb-4">
                        What Our Users Say
                    </h2>
                    <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
                        Trusted by photographers and clients worldwide
                    </p>
                </div>

                {testimonials.length === 0 ? (
                    <div className="bg-[#1e1e1e] rounded-xl p-10 sm:p-12 border-2 border-neutral-800 text-center">
                        <p className="font-['Inter'] text-[14px] sm:text-[16px] text-neutral-400">
                            Reviews will appear here soon.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {testimonials.map((testimonial) => {
                            const name = testimonial.client_name || 'Client';
                            const initials = name.slice(0, 1).toUpperCase();
                            const albumTitle = testimonial.album_title ? `On "${testimonial.album_title}"` : 'Happy client';
                            const rating = Math.max(0, Math.min(5, Math.round(testimonial.rating ?? 0)));

                            return (
                                <div
                                    key={testimonial.id}
                                    className="bg-[#1e1e1e] rounded-xl p-6 sm:p-7 lg:p-8 border-2 border-neutral-800 hover:border-neutral-700 transition-all"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-['Inter'] font-extrabold text-[14px] sm:text-[15px] lg:text-[16px]">
                                            {initials}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-['Inter'] font-extrabold text-[14px] sm:text-[15px] lg:text-[16px] text-neutral-100 tracking-[-0.7px] sm:tracking-[-0.75px] lg:tracking-[-0.8px] mb-1">
                                                {name}
                                            </h4>
                                            <p className="font-['Inter'] text-[11px] sm:text-[12px] text-neutral-400">
                                                {albumTitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 mb-3 sm:mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="font-['Inter'] text-[13px] sm:text-[14px] text-neutral-300 leading-relaxed">
                                        "{testimonial.comment || 'Great experience!'}"
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="px-4 sm:px-8 md:px-16 lg:px-[138px] py-12 sm:py-16 md:py-20 lg:py-[100px]">
                    <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl sm:rounded-2xl p-8 sm:p-12 lg:p-16 border-2 border-neutral-800 text-center">
                        <h2 className="font-['Inter'] font-extrabold text-[28px] sm:text-[36px] md:text-[40px] lg:text-[48px] text-white tracking-[-1.4px] sm:tracking-[-1.8px] md:tracking-[-2px] lg:tracking-[-2.4px] mb-3 sm:mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px] mb-6 sm:mb-8 max-w-[90%] sm:max-w-[500px] md:max-w-[600px] mx-auto">
                            Join thousands of photographers and clients who are already using UrPictura to streamline their photo selection workflow.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] sm:text-[16px] lg:text-[18px] tracking-[-0.7px] sm:tracking-[-0.8px] lg:tracking-[-0.9px] hover:bg-neutral-200 transition-colors"
                        >
                            Sign Up Now
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </Link>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
