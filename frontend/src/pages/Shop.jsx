import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import Navbar from "../components/layout/Navbar.jsx";
import BookingModal from "../components/booking/BookingModal.jsx";
import { ShoppingBag, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { qeshImg } from "../utils/pollinations.js";

const shopHeroBg = qeshImg(
  "luxury hair care product shelf at a salon, glass bottles, soft warm lighting, editorial still life",
  { width: 1920, height: 900, seed: 41 },
);

const Shop = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const productCategory = product.category || "Uncategorized";
    const matchesCategory =
      selectedCategory === "All" || productCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { addToCart, cart } = useBooking();

  useEffect(() => {
    // Hardcoded products list
    setProducts([
      // L'Oréal Professionnel - Shampoos
      { _id: '1', name: "L'Oréal Professionnel Absolut Repair Shampoo", category: "Shampoos", price: 675, stock: 10, image: "/absolut_repair_shampoo.png", brand: "L'Oréal Professionnel" },
      { _id: '2', name: "L'Oreal Professionnel Vitamino Color Shampoo 300ml", category: "Shampoos", price: 691, stock: 10, image: "/vitamino_color_shampoo.png", brand: "L'Oréal Professionnel" },
      { _id: '3', name: "L'Oreal Professionnel Scalp Advanced Anti-Oiliness Shampoo", category: "Shampoos", price: 880, stock: 10, image: "/loreal_scalp_advanced_oiliness.png", brand: "L'Oréal Professionnel" },
      { _id: '4', name: "L'Oreal Professionnel Scalp Advanced Anti-Dandruff Shampoo", category: "Shampoos", price: 895, stock: 10, image: "/loreal_scalp_advanced_dandruff.png", brand: "L'Oréal Professionnel" },
      { _id: '5', name: "Loreal Density Advance Shampoo", category: "Shampoos", price: 518, stock: 10, image: "/loreal_density_advance.png", brand: "L'Oréal Professionnel" },
      { _id: '6', name: "L'Oreal Professionnel Xtenso Care Shampoo", category: "Shampoos", price: 610, stock: 10, image: "/loreal_xtenso_shampoo.png", brand: "L'Oréal Professionnel" },

      // L'Oréal Professionnel - Conditioners & Masks

      // L'Oréal Professionnel - Serums, Oils & Treatments

      // L'Oréal Professionnel - Styling & Special Products

      // GK Hair (Global Keratin) - Shampoos
      { _id: '22', name: "Moisturizing Shampoo", category: "Shampoos", price: 1200, stock: 10, image: "/gk_moisturizing_shampoo.png", brand: "GK Hair" },
      { _id: '23', name: "Balancing Shampoo", category: "Shampoos", price: 1200, stock: 10, image: "/gk_balancing_shampoo.png", brand: "GK Hair" },
      { _id: '24', name: "Anti-Dandruff Shampoo", category: "Shampoos", price: 1300, stock: 10, image: "/gk_anti_dandruff_shampoo.png", brand: "GK Hair" },

      // GK Hair (Global Keratin) - Conditioners & Masks

      // GK Hair (Global Keratin) - Serums & Leave-Ins
      
      // GK Hair (Global Keratin) - Color & Treatments

      // Schwarzkopf Professional - Shampoos
      { _id: '38', name: "BC Bonacure Repair Rescue Shampoo", category: "Shampoos", price: 950, stock: 10, image: "/bc_repair_rescue_shampoo.png", brand: "Schwarzkopf" },
      { _id: '39', name: "BC Moisture Kick Shampoo", category: "Shampoos", price: 950, stock: 10, image: "/bc_moisture_kick_shampoo.png", brand: "Schwarzkopf" },

      // Schwarzkopf Professional - Conditioners & Masks
      { _id: '43', name: "Keratin Smooth Perfect Mask", category: "Conditioners & Masks", price: 1150, stock: 10, image: "/product_image_replacement.png", brand: "Schwarzkopf" },
      { _id: '44', name: "Color Freeze Treatment", category: "Conditioners & Masks", price: 1150, stock: 10, image: "/color_freeze_treatment.png", brand: "Schwarzkopf" },

      // Schwarzkopf Professional - Hair Color (Salon Use)

      // Schwarzkopf Professional - Styling Range (OSiS+)
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans">
      {/* Navbar Section - Restored Original Structure */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col">
        <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={cart.services}
        selectedProducts={cart.products}
      />

      {/* Hero Section - Neumorphic with Pollinations backdrop */}
      <div className="relative w-full mb-16 pt-12 pb-16 px-6 bg-cream overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 bg-center bg-cover"
          style={{ backgroundImage: `url("${shopHeroBg}")` }}
        />
        <div aria-hidden className="absolute inset-0 bg-cream/60" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="neu-chip inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6">
            <span className="text-[11px] font-semibold tracking-[0.3em] text-brown-700 uppercase">
              Qesh Essentials · v1.2
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brown-900 mb-10 tracking-tight">
            The Shop
          </h1>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <div className="neu-inset rounded-full flex items-center">
              <div className="pl-5">
                <Search className="h-5 w-5 text-brown-500" />
              </div>
              <input
                type="text"
                className="flex-1 pl-3 pr-6 py-4 bg-transparent placeholder-brown-500 text-brown-900 outline-none"
                placeholder="Search for perfection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "neu-pressed text-brown-900"
                    : "neu-btn text-brown-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-cream neu-raised-lg p-4 md:p-6 transition-transform duration-500 ease-in-out ${cart.services.length > 0 || cart.products.length > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-360 mx-auto flex justify-between items-center gap-4">
          <div className="hidden md:block">
            <span className="text-sm font-bold text-brown-900 uppercase tracking-widest block mb-1">
              Your Selection ({cart.services.length + cart.products.length})
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-xl">
              {cart.services.map((s, i) => (
                <span
                  key={`service-${i}`}
                  className="text-sm text-brown-600 bg-brown-50 px-2 py-1 rounded inline-block whitespace-nowrap"
                >
                  {s.name}
                </span>
              ))}
              {cart.products.map((p, i) => (
                <span
                  key={`product-${i}`}
                  className="text-sm text-brown-600 bg-brown-50 px-2 py-1 rounded inline-block whitespace-nowrap"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="md:hidden flex-1">
              <span className="text-sm w-30 font-bold text-brown-900 block">
                {cart.services.length + cart.products.length} Items Selected
              </span>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="neu-btn text-brown-900 px-8 py-4 rounded-full text-base font-medium tracking-wide w-full md:w-auto"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brown-200 border-t-brown-900"></div>
            <p className="mt-4 text-xl font-serif text-brown-400">
              Loading Collection...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group neu-raised rounded-[2rem] p-6 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="h-80 neu-inset rounded-[1.5rem] mb-6 overflow-hidden relative">
                  <img
                    src={qeshImg(
                      `${product.brand || ""} ${product.name} hair care product bottle on clean white background, studio product photography`.trim(),
                      { width: 700, height: 700, seed: (parseInt(product._id, 10) || 1) * 13 },
                    )}
                    alt={product.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Quick Add Button or Badge */}
                  <div className="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 z-20">
                    <button
                      className="neu-btn text-brown-900 p-3 rounded-full"
                      onClick={() => addToCart(product, "product")}
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
                <div className="px-2 flex flex-col flex-grow">
                  {product.category && (
                    <span className="text-xs font-bold tracking-[0.15em] text-brown-400 uppercase mb-2 block">
                      {product.category}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl text-brown-900 mb-3 leading-tight group-hover:text-brown-700 transition-colors">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-brown-100 flex justify-between items-end">
                    <div>
                      <p className="font-serif text-xl text-brown-900">
                        ₹{product.price}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider neu-chip ${
                        product.stock > 0 ? "text-brown-800" : "text-red-700"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center neu-raised rounded-[2rem] max-w-2xl mx-auto">
            <div className="text-brown-200 mb-6 flex justify-center">
              <Search size={64} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif text-brown-900 mb-4">
              {products.length === 0
                ? "Collection Coming Soon"
                : "No matches found"}
            </h3>
            <p className="text-brown-500 mb-8 max-w-md mx-auto leading-relaxed">
              {products.length === 0
                ? "We are currently curating an exclusive selection of professional products for your home care regimen."
                : "We couldn't find any products matching your search criteria. Try a different keyword or category."}
            </p>
            {products.length > 0 ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="neu-btn px-8 py-3 text-brown-900 rounded-full font-medium text-sm tracking-wide"
              >
                Clear Filters
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <Link
                  to="/services"
                  className="group neu-btn inline-flex items-center justify-center gap-2 text-brown-900 px-8 py-3 rounded-full font-medium"
                >
                  Explore Services
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
