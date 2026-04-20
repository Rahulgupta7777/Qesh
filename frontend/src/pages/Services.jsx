import { useState, useEffect } from "react";
import { Check, Plus, Loader2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import api from "../../utils/api.js";
import { qeshImg } from "../utils/pollinations.js";

import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

const ServicesFull = () => {
  const { cart, addToCart, removeFromCart, activeBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const navigate = useNavigate();

  const [categoryImages, setCategoryImages] = useState({});

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 200;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transform Flat API Data to UI Structure (Strict UI Preservation)
  const transformData = (apiData) => {
    const categories = {};

    apiData.forEach((service) => {
      let catId = service.category
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[()]/g, "");
      // Manual overrides to match exact UI IDs if standard normalize fails
      if (service.category === "Nails & Nail Art") catId = "nails";
      if (service.category === "Hair (His)") catId = "hair-his";
      if (service.category === "Hair (Her)") catId = "hair-her";

      if (!categories[catId]) {
        categories[catId] = {
          id: catId,
          category: service.category,
          items: [], // For direct items
          subsections: [], // For grouped items (like subsections in original data)
        };
      }

      if (service.subcategory) {
        let sub = categories[catId].subsections.find(
          (s) => s.title === service.subcategory,
        );
        if (!sub) {
          sub = { title: service.subcategory, items: [] };
          categories[catId].subsections.push(sub);
        }
        sub.items.push(service);
      } else {
        categories[catId].items.push(service);
      }
    });

    return Object.values(categories);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          api.public.getServices(),
          api.public.getCategories()
        ]);

        // Process Categories to create Image Map
        const imageMap = {};
        categoriesRes.data.forEach(cat => {
          let catId = cat.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[()]/g, "");

          // Apply same overrides as services to ensure matching keys
          if (cat.name === "Nails & Nail Art") catId = "nails";
          if (cat.name === "Hair (His)") catId = "hair-his";
          if (cat.name === "Hair (Her)") catId = "hair-her";

          if (cat.image) {
            imageMap[catId] = cat.image;
          }
        });
        setCategoryImages(imageMap);

        const structuredData = transformData(servicesRes.data);

        // Sort based on backend category order
        const sortedCategories = categoriesRes.data;
        structuredData.sort((a, b) => {
          const indexA = sortedCategories.findIndex(c => c.name === a.category);
          const indexB = sortedCategories.findIndex(c => c.name === b.category);
          // If both found, sort by index
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          // Put defined categories first
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });

        setServices(structuredData);
        if (structuredData.length > 0) setActiveCategory(structuredData[0].id);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const service of services) {
        const element = document.getElementById(service.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveCategory(service.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [services, loading]);

  // Toggle Service Selection
  const toggleService = (item, variant = null, priceOverride = null) => {
    const itemName = variant ? `${item.name} (${variant})` : item.name;
    // const serviceId = item._id || item.id;

    if (cart.services.some((s) => s.name === itemName)) {
      const itemToRemove = cart.services.find(s => s.name === itemName);
      removeFromCart(itemToRemove._id || itemToRemove.id, "service");
    } else {
      addToCart({
        ...item,
        name: itemName,
        price: priceOverride || item.price,
      }, "service");
    }
  };

  const isSelected = (item, variant = null) => {
    const itemName = variant ? `${item.name} (${variant})` : item.name;
    return cart.services.some((s) => s.name === itemName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="fixed top-0 left-0 right-0 z-50 bg-cream">
          <div className="max-w-360 mx-auto px-6 md:px-10">
            <Navbar showLogo={true} />
          </div>
        </div>
        <div className="pt-32 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-brown-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans selection:bg-brown-900 selection:text-white pb-0">
      <div className="fixed top-0 left-0 right-0 z-50 bg-cream">
        <div className="max-w-360 mx-auto px-6 md:px-10">
          <Navbar
            showLogo={true}
            onOpenBooking={() => {
              if (activeBooking) {
                navigate("/schedule");
              } else {
                setIsBookingOpen(true);
              }
            }}
          />
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={cart.services}
        selectedProducts={cart.products}
      />

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
                {cart.services.length + cart.products.length} Services Selected
              </span>
            </div>
            <button
              onClick={() => {
                if (activeBooking) {
                  navigate("/schedule");
                } else {
                  setIsBookingOpen(true);
                }
              }}
              className="neu-btn text-brown-900 px-8 py-4 rounded-full text-base font-medium tracking-wide w-full md:w-auto"
            >
              {activeBooking ? "My Schedule" : "Schedule Visit"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-360 mx-auto px-4 md:px-10 flex flex-col md:flex-row gap-12 pt-32 md:pt-36">
        <aside className="hidden md:block w-72 shrink-0">
          <div className="fixed top-32 w-72 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide py-6 pr-4">
            <nav className="flex flex-col gap-1">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => scrollToCategory(service.id)}
                  className={`text-left px-5 py-3 rounded-2xl text-base tracking-wide transition-all duration-300 font-serif flex justify-between items-center group ${
                    activeCategory === service.id
                      ? "neu-pressed text-brown-900 translate-x-2"
                      : "text-brown-600 hover:text-brown-900"
                  }`}
                >
                  {service.category}
                  {activeCategory === service.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brown-700 ml-2"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="md:hidden fixed top-20 left-0 right-0 bg-cream z-40 py-4 px-4 border-b border-brown-900/5 overflow-x-auto scrollbar-hide shadow-sm">
          <div className="flex gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => scrollToCategory(service.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
                  activeCategory === service.id
                    ? "neu-pressed text-brown-900"
                    : "neu-flat text-brown-700"
                }`}
              >
                {service.category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 mt-16 md:mt-0">
          <div className="flex flex-col gap-10">
            {services.map((service) => (
              <section
                key={service.id}
                id={service.id}
                className="scroll-mt-40"
              >
                <div className="mb-10 rounded-3xl relative h-40 md:h-52 neu-raised-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={categoryImages[service.id] || qeshImg(
                      `${service.category} salon service, editorial beauty photography, minimal composition`,
                      { width: 1400, height: 500, seed: 70 + service.id.length },
                    )}
                    alt={service.category}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
                  />
                  <div aria-hidden className="absolute inset-0 bg-black/35" />
                  <h2 className="relative font-serif text-3xl md:text-5xl text-white text-center px-4 tracking-wide drop-shadow-lg">
                    {service.category}
                  </h2>
                </div>

                {service.items && (
                  <div className="divide-y divide-brown-900/10">
                    {service.items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 px-5 rounded-2xl transition-all duration-300 mb-2 ${isSelected(item) ? "neu-pressed" : "neu-flat"}`}
                      >
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-large font-medium text-brown-900 group-hover:translate-x-1 transition-transform">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-xl font-serif text-brown-600">
                            {/* {console.log("Item Price:", item.prices)} */}
                            {(typeof item.prices === "object" && item.prices.male !== item.prices.female)|| (item.price)
                              ? `₹ ${item.prices?.male} / ₹ ${item.prices.female}`
                              : `₹ ${item.prices.male}`}
                          </span>

                          {(item.prices && item.prices.male && item.prices.female) || (typeof item.price === "string" && item.price.includes("/")) ? (
                            <div
                              className={`relative overflow-hidden rounded-full border border-brown-900 group/split w-27.5 h-8.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${
                                isSelected(item, "M") || isSelected(item, "F")
                                  ? "bg-brown-900 border-brown-900"
                                  : "bg-transparent border-brown-900 hover:bg-white"
                              }`}
                            >
                              {/* Default Content: 'Add' */}
                              <div
                                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] font-bold text-xs uppercase tracking-wider ${isSelected(item, "M") || isSelected(item, "F") ? "-translate-y-full opacity-0" : "group-hover/split:-translate-y-full group-hover/split:opacity-0 text-brown-900"}`}
                              >
                                Add <Plus size={14} className="ml-1" />
                              </div>

                              {/* Hover/Selected Content: M | F selection */}
                              <div
                                className={`absolute inset-0 flex items-center justify-between text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSelected(item, "M") || isSelected(item, "F") ? "translate-y-0" : "translate-y-full group-hover/split:translate-y-0"}`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const price = item.prices ? item.prices.male : item.price.split("/")[0].trim();
                                    toggleService(item, "M", price);
                                  }}
                                  className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100 ${isSelected(item, "M") ? "bg-brown-900 text-white hover:bg-brown-800" : "bg-white text-brown-900"}`}
                                >
                                  M{" "}
                                  {isSelected(item, "M") && (
                                    <Check size={10} className="ml-0.5" />
                                  )}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const price = item.prices ? item.prices.female : item.price.split("/")[1]?.trim();
                                    toggleService(item, "F", price);
                                  }}
                                  className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100 ${isSelected(item, "F") ? "bg-brown-900 text-white hover:bg-brown-800" : "bg-white text-brown-900"}`}
                                >
                                  F{" "}
                                  {isSelected(item, "F") && (
                                    <Check size={10} className="ml-0.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleService(item)}
                              className={`px-6 py-2 text-xs tracking-wider uppercase font-bold rounded-full transition-all duration-300 flex items-center gap-2 ${isSelected(item) ? "neu-pressed text-brown-900" : "neu-btn text-brown-900"}`}
                            >
                              {isSelected(item) ? (
                                <>
                                  Added <Check size={14} />
                                </>
                              ) : (
                                <>
                                  Add <Plus size={14} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {service.subsections && (
                  <div className="flex flex-col gap-12 mt-12">
                    {service.subsections.map((sub, idx) => (
                      <div key={idx}>
                        <div className="mb-8 pl-4">
                          <h3 className="font-serif text-2xl text-brown-900 inline-block relative pb-3 font-semibold">
                            {sub.title}
                            <span
                              className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-brown-900 via-brown-900/40 to-transparent rounded-full"
                              style={{ width: "130%" }}
                            ></span>
                          </h3>
                        </div>
                        <div className="divide-y divide-brown-900/10">
                          {sub.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 px-5 rounded-2xl transition-all duration-300 mb-2 ${isSelected(item) ? "neu-pressed" : "neu-flat"}`}
                            >
                              <div className="mb-4 sm:mb-0">
                                <h3 className="text-large font-medium text-brown-900 group-hover:translate-x-1 transition-transform">
                                  {item.name}
                                </h3>
                              </div>
                              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                <span className="text-xl font-serif text-brown-600">
                                  {item.price ? `₹ ${item.price}` : ""}
                                </span>

                                {item.price && item.price.includes("/") ? (
                                  <div
                                    className={`relative overflow-hidden rounded-full border border-brown-900 group/split w-27.5 h-8.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${
                                      isSelected(item, "M") ||
                                      isSelected(item, "F")
                                        ? "bg-brown-900 border-brown-900"
                                        : "bg-transparent border-brown-900 hover:bg-white"
                                    }`}
                                  >
                                    {/* Default Content: 'Add' */}
                                    <div
                                      className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] font-bold text-xs uppercase tracking-wider ${isSelected(item, "M") || isSelected(item, "F") ? "-translate-y-full opacity-0" : "group-hover split:-translate-y-full group-hover/split:opacity-0 text-brown-900"}`}
                                    >
                                      Add <Plus size={14} className="ml-1" />
                                    </div>

                                    {/* Hover/Selected Content: M | F selection */}
                                    <div
                                      className={`absolute inset-0 flex items-center justify-between text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSelected(item, "M") || isSelected(item, "F") ? "translate-y-0" : "translate-y-full group-hover/split:translate-y-0"}`}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleService(
                                            item,
                                            "M",
                                            item.price.split("/")[0].trim(),
                                          );
                                        }}
                                        className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100 ${isSelected(item, "M") ? "bg-brown-900 text-white hover:bg-brown-800" : "bg-white text-brown-900"}`}
                                      >
                                        M{" "}
                                        {isSelected(item, "M") && (
                                          <Check size={10} className="ml-0.5" />
                                        )}
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleService(
                                            item,
                                            "F",
                                            item.price.split("/")[1]?.trim(),
                                          );
                                        }}
                                        className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100 ${isSelected(item, "F") ? "bg-brown-900 text-white hover:bg-brown-800" : "bg-white text-brown-900"}`}
                                      >
                                        F{" "}
                                        {isSelected(item, "F") && (
                                          <Check size={10} className="ml-0.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => toggleService(item)}
                                    className={`px-6 py-2 text-xs tracking-wider uppercase font-bold rounded-full transition-all duration-300 flex items-center gap-2 ${isSelected(item) ? "neu-pressed text-brown-900" : "neu-btn text-brown-900"} `}
                                  >
                                    {isSelected(item) ? (
                                      <>
                                        Added <Check size={14} />
                                      </>
                                    ) : (
                                      <>
                                        Add <Plus size={14} />
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicesFull;
