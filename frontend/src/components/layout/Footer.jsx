import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="locate" className="w-full bg-cream text-brown-900 py-20 px-6 md:px-10 snap-start">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-semibold tracking-[0.3em] text-brown-600 uppercase mb-4 block">
                        Get In Touch
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-brown-900 mb-6 tracking-tight">
                        Locate Us
                    </h2>
                    <div className="neu-chip inline-flex items-center gap-2 px-4 py-1.5 rounded-full mt-2">
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-brown-700 uppercase">Qesh · v1.2</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                    {/* LEFT: Contact Details */}
                    <div className="neu-raised p-8 md:p-12 rounded-3xl flex flex-col justify-center h-full">
                        <h3 className="font-serif text-3xl mb-8 text-brown-900">Ready to transform?</h3>

                        <div className="space-y-7">
                            {/* Address */}
                            <div className="flex items-start gap-5">
                                <div className="neu-raised-sm p-3 rounded-2xl flex-shrink-0">
                                    <MapPin size={22} className="text-brown-700" />
                                </div>
                                <div>
                                    <h4 className="text-brown-700 font-semibold uppercase tracking-wider text-xs mb-2">Visit Us</h4>
                                    <p className="text-brown-800 leading-relaxed max-w-sm">
                                        Ground Floor, Triaa,<br />
                                        Shop No. 33-34, Dhanori-Lohegaon Rd,<br />
                                        Dhanori, Pune, Maharashtra 411015
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-5">
                                <div className="neu-raised-sm p-3 rounded-2xl flex-shrink-0">
                                    <Phone size={22} className="text-brown-700" />
                                </div>
                                <div>
                                    <h4 className="text-brown-700 font-semibold uppercase tracking-wider text-xs mb-2">Call Us</h4>
                                    <p className="text-brown-800 leading-relaxed font-sans">
                                        +91 75663 66375
                                    </p>
                                    <a href="https://qesh.in" target="_blank" rel="noreferrer" className="text-brown-600 text-sm hover:text-brown-900 transition-colors mt-1 inline-block">
                                        qesh.in
                                    </a>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-5">
                                <div className="neu-raised-sm p-3 rounded-2xl flex-shrink-0">
                                    <Clock size={22} className="text-brown-700" />
                                </div>
                                <div>
                                    <h4 className="text-brown-700 font-semibold uppercase tracking-wider text-xs mb-2">Open Hours</h4>
                                    <p className="text-brown-800 leading-relaxed font-sans">
                                        Mon – Sun · 10:00 AM – 9:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="mt-10 pt-6 flex gap-4 items-center">
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=Qesh+Salon+Triaa+Dhanori+Lohegaon+Pune"
                                target="_blank"
                                rel="noreferrer"
                                className="neu-btn px-5 py-2.5 rounded-full text-sm text-brown-900 flex items-center gap-2"
                            >
                                <Navigation size={14} /> Get Directions
                            </a>
                            <a href="#" className="neu-btn p-3 rounded-full">
                                <Instagram size={18} className="text-brown-700" />
                            </a>
                            <a href="#" className="neu-btn p-3 rounded-full">
                                <Facebook size={18} className="text-brown-700" />
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: Map */}
                    <div className="neu-inset p-3 rounded-3xl h-[400px] md:h-auto md:min-h-full">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden min-h-[380px]">
                            <iframe
                                title="Qesh Salon Location"
                                src="https://www.google.com/maps?q=Ground+Floor+Triaa+Shop+No+33-34+Dhanori-Lohegaon+Rd+Dhanori+Pune+Maharashtra+411015&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'contrast(0.95) saturate(0.85)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brown-600">
                    <p>&copy; {new Date().getFullYear()} Qesh Salon · v1.2. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/legal" className="hover:text-brown-900 transition-colors">Legal</Link>
                        <Link to="/legal" className="hover:text-brown-900 transition-colors">Privacy</Link>
                        <Link to="/legal" className="hover:text-brown-900 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
