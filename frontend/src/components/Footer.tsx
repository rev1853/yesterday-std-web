import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-neutral-800">
      <div className="max-w-[1440px] mx-auto px-[138px] py-[80px]">
        <div className="grid grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="h-[68px] w-[61px] bg-neutral-100 rounded-lg flex items-center justify-center mb-6">
              <span className="font-['Inter'] text-[24px] font-black text-[#0d0d0d]">UP</span>
            </div>
            <p className="font-['Inter'] text-[14px] text-neutral-400 mb-6">
              Bridging clients and photographers through effortless photo selection
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-neutral-100" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-neutral-100" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-neutral-100" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5 text-neutral-100" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Inter'] font-extrabold text-[16px] text-neutral-100 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Creators
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Photographers */}
          <div>
            <h4 className="font-['Inter'] font-extrabold text-[16px] text-neutral-100 mb-6">
              For Photographers
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-['Inter'] font-extrabold text-[16px] text-neutral-100 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Inter'] text-[14px] text-neutral-400">
                    info@urpictura.com
                  </p>
                  <p className="font-['Inter'] text-[14px] text-neutral-400">
                    support@urpictura.com
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <p className="font-['Inter'] text-[14px] text-neutral-400">
                  +1 (555) 123-4567
                </p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <p className="font-['Inter'] text-[14px] text-neutral-400">
                  123 Photography Lane<br />
                  San Francisco, CA 94102
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex items-center justify-between">
          <p className="font-['Inter'] text-[12px] text-neutral-500">
            © 2025 UrPictura. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-['Inter'] text-[12px] text-neutral-500 hover:text-neutral-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-['Inter'] text-[12px] text-neutral-500 hover:text-neutral-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="font-['Inter'] text-[12px] text-neutral-500 hover:text-neutral-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
