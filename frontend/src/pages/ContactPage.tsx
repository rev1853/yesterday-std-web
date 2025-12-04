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

            <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
                        Get in Touch
                    </h1>
                    <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px] max-w-3xl mx-auto">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
                    {/* Contact Cards */}
                    <div className="bg-[#1e1e1e] rounded-xl p-6 sm:p-7 lg:p-8 border-2 border-neutral-800 text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                            <Mail className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500" />
                        </div>
                        <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-2 sm:mb-3">
                            Email Us
                        </h3>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-1 sm:mb-2">
                            info@urpictura.com
                        </p>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">
                            support@urpictura.com
                        </p>
                    </div>

                    <div className="bg-[#1e1e1e] rounded-xl p-6 sm:p-7 lg:p-8 border-2 border-neutral-800 text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                            <Phone className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500" />
                        </div>
                        <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-2 sm:mb-3">
                            Call Us
                        </h3>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400 mb-1 sm:mb-2">
                            +62 819-9996-0718
                        </p>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">
                            Everyday 9am-6pm WIB
                        </p>
                    </div>

                    <div className="bg-[#1e1e1e] rounded-xl p-6 sm:p-7 lg:p-8 border-2 border-neutral-800 text-center sm:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                            <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-500" />
                        </div>
                        <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px] mb-2 sm:mb-3">
                            Visit Us
                        </h3>
                        <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-400">
                            Jalan Raya Sempalwadak<br />
                            Bululawang, Kab. Malang
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 lg:gap-8 mb-10 sm:mb-12 lg:mb-16">
                    {/* Contact Form */}
                    <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 lg:p-8 border-2 border-neutral-800">
                        <h2 className="font-['Inter'] font-extrabold text-[22px] sm:text-[26px] lg:text-[32px] text-neutral-100 tracking-[-1.1px] sm:tracking-[-1.3px] lg:tracking-[-1.6px] mb-4 sm:mb-5 lg:mb-6">
                            Send us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                            <div>
                                <label className="block font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-100 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-[14px] sm:text-[15px] text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-100 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-[14px] sm:text-[15px] text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-100 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-[14px] sm:text-[15px] text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] font-medium text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-100 mb-2">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your inquiry..."
                                    rows={6}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d0d0d] border-2 border-neutral-800 rounded-lg text-[14px] sm:text-[15px] text-neutral-100 font-['Inter'] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 sm:py-3.5 lg:py-4 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-extrabold text-[14px] sm:text-[15px] lg:text-[16px] tracking-[-0.7px] sm:tracking-[-0.75px] lg:tracking-[-0.8px] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                Send Message
                            </button>

                            {submitted && (
                                <div className="p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="font-['Inter'] text-[12px] sm:text-[13px] lg:text-[14px] text-green-500 text-center">
                                        Thank you! Your message has been sent successfully.
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Map and Additional Info */}
                    <div className="space-y-6 sm:space-y-7 lg:space-y-8">
                        {/* Map */}
                        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border-2 border-neutral-800 h-[280px] sm:h-[350px] lg:h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1975.2425965763857!2d112.6420494!3d-8.0518883!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6276abbc06bbf%3A0xd210c24059bdef90!2sJl.%20Raya%20Sempalwadak%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1764821557458!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Office Hours */}
                        <div className="bg-[#1e1e1e] rounded-xl p-5 sm:p-6 border-2 border-neutral-800">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                <h3 className="font-['Inter'] font-extrabold text-[16px] sm:text-[18px] lg:text-[20px] text-neutral-100 tracking-[-0.8px] sm:tracking-[-0.9px] lg:tracking-[-1px]">
                                    Office Hours
                                </h3>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between font-['Inter'] text-[13px] sm:text-[14px] text-neutral-300">
                                    <span>Monday - Friday</span>
                                    <span>9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex items-center justify-between font-['Inter'] text-[13px] sm:text-[14px] text-neutral-300">
                                    <span>Saturday</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex items-center justify-between font-['Inter'] text-[13px] sm:text-[14px] text-neutral-300">
                                    <span>Sunday</span>
                                    <span>Closed</span>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-neutral-800">
                                <p className="font-['Inter'] text-[13px] sm:text-[14px] text-neutral-400 mb-3">
                                    Follow us on social media
                                </p>
                                <div className="flex gap-2 sm:gap-3">
                                    <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-100" />
                                    </a>
                                    <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                        <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-100" />
                                    </a>
                                    <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                        <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-100" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
