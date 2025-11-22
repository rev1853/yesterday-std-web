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
      <div className="relative h-[720px] mt-[169px] overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/20 via-[#0d0d0d]/60 to-[#0d0d0d]" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80)'
            }}
          />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-[138px]">
          <h1 className="font-['Inter'] font-extrabold text-[94px] leading-[1.08] text-[#f3f3f3] text-center tracking-[-4.7px] mb-6 max-w-[1227px] [text-shadow:rgba(0,0,0,0.3)_0px_8px_20px]">
            <p className="mb-0">Bridging clients</p>
            <p>and photographers through effortless photo selection</p>
          </h1>
          <p className="font-['Inter'] text-[20px] text-neutral-100 text-center tracking-[-1px] mb-8 [text-shadow:rgba(0,0,0,0.3)_0px_8px_20px]">
            Start selecting your best moments, and let your photographer handle the rest.
          </p>
          {!user && (
            <Link
              to="/login"
              className="px-10 py-5 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[18px] tracking-[-0.9px] hover:bg-neutral-200 transition-colors flex items-center gap-3"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-[138px] py-[100px]">
        <div className="text-center mb-16">
          <h2 className="font-['Inter'] font-extrabold text-[48px] text-white tracking-[-2.4px] mb-4">
            How It Works
          </h2>
          <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
            A simple platform designed for photographers and their clients
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800 hover:border-neutral-700 transition-all group"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                feature.color === 'blue' ? 'bg-blue-500/10' :
                feature.color === 'green' ? 'bg-green-500/10' :
                'bg-purple-500/10'
              }`}>
                <feature.icon className={`w-8 h-8 ${
                  feature.color === 'blue' ? 'text-blue-500' :
                  feature.color === 'green' ? 'text-green-500' :
                  'text-purple-500'
                }`} />
              </div>
              <h3 className="font-['Inter'] font-extrabold text-[24px] text-neutral-100 tracking-[-1.2px] mb-3">
                {feature.title}
              </h3>
              <p className="font-['Inter'] text-[16px] text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Public Albums Section */}
      <div className="px-[138px] py-[60px] bg-[#0d0d0d]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-['Inter'] font-extrabold text-[48px] text-white tracking-[-2.4px] mb-2">
              Featured Albums
            </h2>
            <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
              Explore our latest photography projects
            </p>
          </div>
          {user && (
            <Link
              to={user.role === 'client' ? '/client' : user.role === 'creator' ? '/creator' : '/admin'}
              className="px-6 py-3 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              View All Albums
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 gap-[15px] mb-8">
          {publicAlbums.slice(0, 3).map((album) => (
            <Link
              key={album.id}
              to={user ? `/album/${album.id}` : '/login'}
              className="group relative h-[300px] rounded-[10px] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${album.coverImage})` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-end justify-center p-[30px]">
                <div className="text-center">
                  <p className="font-['Inter'] font-extrabold text-[20px] text-white tracking-[-1px] mb-1">
                    {album.title}
                  </p>
                  <p className="font-['Inter'] text-[14px] text-white tracking-[-0.7px] mb-2">
                    {album.date}
                  </p>
                  <p className="font-['Inter'] text-[12px] text-white/80">
                    By {album.creatorName}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {publicAlbums.length > 3 && (
          <div className="grid grid-cols-3 gap-[15px]">
            {publicAlbums.slice(3, 6).map((album) => (
              <Link
                key={album.id}
                to={user ? `/album/${album.id}` : '/login'}
                className="group relative h-[300px] rounded-[10px] overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${album.coverImage})` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-end justify-center p-[30px]">
                  <div className="text-center">
                    <p className="font-['Inter'] font-extrabold text-[20px] text-white tracking-[-1px] mb-1">
                      {album.title}
                    </p>
                    <p className="font-['Inter'] text-[14px] text-white tracking-[-0.7px] mb-2">
                      {album.date}
                    </p>
                    <p className="font-['Inter'] text-[12px] text-white/80">
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
      <div className="px-[138px] py-[100px] bg-[#0d0d0d]">
        <div className="text-center mb-16">
          <h2 className="font-['Inter'] font-extrabold text-[48px] text-white tracking-[-2.4px] mb-4">
            What Our Users Say
          </h2>
          <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
            Trusted by photographers and clients worldwide
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-[#1e1e1e] rounded-xl p-12 border-2 border-neutral-800 text-center">
            <p className="font-['Inter'] text-[18px] text-neutral-400">
              Reviews will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-['Inter'] font-extrabold text-[18px]">
                    {testimonial.client_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-['Inter'] font-extrabold text-[16px] text-neutral-100 tracking-[-0.8px] mb-1">
                      {testimonial.client_name || 'Anonymous'}
                    </h4>
                    <p className="font-['Inter'] text-[12px] text-neutral-400">
                      {testimonial.album_title ? `On "${testimonial.album_title}"` : 'Happy client'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-700'}`}
                    />
                  ))}
                </div>
                
                <p className="font-['Inter'] text-[14px] text-neutral-300 leading-relaxed">
                  "{testimonial.comment || 'Great experience!'}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="px-[138px] py-[100px]">
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl p-16 border-2 border-neutral-800 text-center">
            <h2 className="font-['Inter'] font-extrabold text-[48px] text-white tracking-[-2.4px] mb-4">
              Ready to Get Started?
            </h2>
            <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px] mb-8 max-w-[600px] mx-auto">
              Join thousands of photographers and clients who are already using UrPictura to streamline their photo selection workflow.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[18px] tracking-[-0.9px] hover:bg-neutral-200 transition-colors"
            >
              Sign Up Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
