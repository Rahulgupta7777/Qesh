import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";

const Navbar = ({ showLogo = false, onOpenBooking }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeBooking, user } = useBooking();
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (!user) {
      onOpenBooking(true);
      return;
    }
    if (activeBooking) {
      navigate("/schedule");
    } else {
      onOpenBooking(false);
    }
  };

  const navLinkClass =
    "text-brown-900 text-base font-normal tracking-[0.5px] px-4 py-2 rounded-full hover:text-brown-700 transition-all duration-300";

  return (
    <nav className="flex justify-between md:justify-center items-center py-4 md:py-6 px-6 md:pr-12 w-full max-w-full z-50">
      {/* Mobile Brand */}
      <Link to="/" className="md:hidden flex items-center gap-2">
        <span className="font-serif text-3xl text-brown-900 tracking-tight">Qesh</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] text-brown-600 neu-chip px-2 py-0.5 rounded-full uppercase">
          1.2
        </span>
      </Link>

      {/* Desktop Menu */}
      <div
        className={`hidden md:flex items-center w-full ${showLogo ? "justify-between" : "justify-center gap-10 lg:gap-16"}`}
      >
        {showLogo && (
          <Link to="/" className="flex items-center gap-3">
            <span className="font-serif text-4xl text-brown-900 tracking-tight leading-none">
              Qesh
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-brown-600 neu-chip px-2 py-1 rounded-full uppercase">
              v1.2
            </span>
          </Link>
        )}

        <div className={`flex items-center ${showLogo ? "gap-3 lg:gap-5" : "gap-8 lg:gap-12"}`}>
          <Link to="/services" className={navLinkClass}>services</Link>
          <Link to="/shop" className={navLinkClass}>shop</Link>
          <Link to="/offers" className={navLinkClass}>offers</Link>
          <Link to="/#locate" className={`${navLinkClass} flex items-center gap-1.5`}>
            <MapPin size={14} className="text-brown-600" /> locate us
          </Link>
          <button
            onClick={handleBookingClick}
            className="neu-btn px-7 py-3 text-base text-brown-900 font-medium tracking-[0.5px] rounded-full"
          >
            {activeBooking ? "My Schedule" : "Schedule Visit"}
          </button>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden neu-btn text-brown-900 p-3 rounded-full"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-cream z-50 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <button
          className="absolute top-6 right-6 neu-btn text-brown-900 p-3 rounded-full"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-12">
          <span className="font-serif text-5xl text-brown-900 tracking-tight">Qesh</span>
          <span className="text-xs font-semibold tracking-[0.2em] text-brown-600 neu-chip px-2.5 py-1 rounded-full uppercase">
            v1.2
          </span>
        </div>

        <div className="flex flex-col gap-5 text-center">
          <Link to="/services" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-2xl font-serif neu-raised-sm px-10 py-3 rounded-full">
            Services
          </Link>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-2xl font-serif neu-raised-sm px-10 py-3 rounded-full">
            Shop
          </Link>
          <Link to="/offers" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-2xl font-serif neu-raised-sm px-10 py-3 rounded-full">
            Offers
          </Link>
          <Link to="/#locate" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-2xl font-serif neu-raised-sm px-10 py-3 rounded-full flex items-center justify-center gap-2">
            <MapPin size={18} /> Locate Us
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleBookingClick();
            }}
            className="mt-4 neu-btn px-10 py-4 text-lg text-brown-900 rounded-full"
          >
            {activeBooking ? "My Schedule" : "Schedule Visit"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
