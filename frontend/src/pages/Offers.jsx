import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { qeshImg } from "../utils/pollinations.js";

const offersHeroBg = qeshImg(
  "luxury spa gift set, wrapped in satin ribbon, candles, dried flowers, warm ambient lighting",
  { width: 1920, height: 800, seed: 51 },
);

const Offers = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.public.getOffers();
        setOffers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col">
        <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
        <div className="w-full h-px bg-beige-300 mb-8 md:mb-12"></div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={[]}
      />

      <div className="max-w-7xl mx-auto px-6 pb-20 pt-0 text-center">
        <div className="relative mb-10 rounded-[2.5rem] neu-raised-lg mx-auto max-w-7xl h-96 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 bg-center bg-cover"
            style={{ backgroundImage: `url("${offersHeroBg}")` }}
          />
          <div aria-hidden className="absolute inset-0 bg-cream/40" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-12">
            <div className="neu-chip inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5">
              <Sparkles size={14} className="text-brown-600" />
              <span className="text-[11px] font-semibold tracking-[0.3em] text-brown-700 uppercase">
                Exclusive Privileges · v1.2
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-brown-900 mb-6 tracking-tight leading-none">
              Curated Offers
            </h1>
            <p className="text-brown-700 max-w-xl mx-auto text-lg font-light leading-relaxed">
              Seasonal delights and exclusive packages designed for your indulgence.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-brown-200 border-t-brown-900 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-serif text-brown-400 animate-pulse">
              Loading Privileges...
            </p>
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="group relative neu-raised rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-flex items-center gap-1.5 neu-pressed text-brown-900 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      {offer.type === "percentage" ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                    </span>
                    {offer.expiryDate && (
                      <span className="text-[10px] font-medium text-brown-600 uppercase tracking-wide neu-chip px-3 py-1 rounded-full">
                        Exp: {new Date(offer.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl text-brown-900 mb-3 leading-tight group-hover:text-brown-700 transition-colors">
                    {offer.title}
                  </h3>

                  <p className="text-brown-500 text-sm mb-8 leading-relaxed flex-grow font-light border-b border-brown-100 pb-4">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-brown-400 font-bold mb-1.5">
                        Code
                      </span>
                      <div
                        onClick={() => handleCopy(offer.code, offer._id)}
                        className="group/code cursor-pointer flex items-center gap-2 font-mono text-lg font-bold text-brown-900 tracking-wider hover:text-brown-700 transition-colors"
                      >
                        {offer.code}
                        <span className="text-[10px] neu-chip px-2 py-1 rounded-full text-brown-600">
                          {copiedId === offer._id ? "COPIED" : "COPY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neu-raised rounded-[2rem] p-12 md:p-20 relative overflow-hidden max-w-3xl mx-auto">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 neu-pressed rounded-full flex items-center justify-center text-brown-600 mb-6">
                <Gift size={32} strokeWidth={1.5} />
              </div>

              <h2 className="font-serif text-3xl text-brown-900 mb-3">
                No Active Privileges
              </h2>

              <p className="text-brown-600 max-w-md mx-auto mb-8 leading-relaxed font-light">
                We are currently curating new exclusive experiences for you.
                Please check back soon.
              </p>

              <Link
                to="/services"
                className="group neu-btn inline-flex items-center gap-2 text-brown-900 px-8 py-3.5 rounded-full font-medium text-sm tracking-wide"
              >
                <Sparkles size={18} />
                Explore Menu
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-20 text-center border-t border-brown-900/5 pt-12">
          <p className="text-xs text-brown-400 font-bold tracking-[0.2em] uppercase mb-4">
            Stay Updated
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brown-900 hover:text-brown-600 transition-colors font-serif text-xl"
          >
            @qesh_official
            <ArrowRight size={16} className="-rotate-45" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Offers;
