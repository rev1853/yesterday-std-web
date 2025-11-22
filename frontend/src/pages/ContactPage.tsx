import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[200px] pb-[100px] px-[138px]">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-4">
            Get in Touch
          </h1>
          <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-3">
              Email Us
            </h3>
            <p className="font-['Inter'] text-[14px] text-neutral-400 mb-2">
              info@urpictura.com
            </p>
            <p className="font-['Inter'] text-[14px] text-neutral-400">
              support@urpictura.com
            </p>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-3">
              Call Us
            </h3>
            <p className="font-['Inter'] text-[14px] text-neutral-400 mb-2">
              +1 (555) 123-4567
            </p>
            <p className="font-['Inter'] text-[14px] text-neutral-400">
              Mon-Fri 9am-6pm PST
            </p>
          </div>

          <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800 text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-3">
              Visit Us
            </h3>
            <p className="font-['Inter'] text-[14px] text-neutral-400">
              123 Photography Lane<br />
              San Francisco, CA 94102
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-[#1e1e1e] rounded-xl p-8 border-2 border-neutral-800">
            <h2 className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              {submitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="font-['Inter'] text-[14px] text-green-500 text-center">
                    Thank you! Your message has been sent successfully.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800 h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019277577473!2d-122.41941492347478!3d37.77492971300629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Office Hours */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-500" />
                <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px]">
                  Office Hours
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-['Inter'] text-[14px] text-neutral-400">Monday - Friday</span>
                  <span className="font-['Inter'] text-[14px] text-neutral-100">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-['Inter'] text-[14px] text-neutral-400">Saturday</span>
                  <span className="font-['Inter'] text-[14px] text-neutral-100">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-['Inter'] text-[14px] text-neutral-400">Sunday</span>
                  <span className="font-['Inter'] text-[14px] text-neutral-100">Closed</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-neutral-800">
              <h3 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a href="#" className="flex-1 py-3 bg-[#0d0d0d] rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                  <Instagram className="w-5 h-5 text-neutral-100" />
                  <span className="font-['Inter'] text-[14px] text-neutral-100">Instagram</span>
                </a>
                <a href="#" className="flex-1 py-3 bg-[#0d0d0d] rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                  <Facebook className="w-5 h-5 text-neutral-100" />
                  <span className="font-['Inter'] text-[14px] text-neutral-100">Facebook</span>
                </a>
              </div>
              <a href="#" className="w-full mt-3 py-3 bg-[#0d0d0d] rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                <Twitter className="w-5 h-5 text-neutral-100" />
                <span className="font-['Inter'] text-[14px] text-neutral-100">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
