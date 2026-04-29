import { ArrowUpRight, Sparkles, Scissors, Hand, Droplets, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { qeshImg } from '../../utils/pollinations';
import NeuImage from '../ui/NeuImage';

const ServiceCard = ({ service, className }) => (
    <Link
        to="/services"
        className={`relative flex-[1_1_0%] hover:flex-[2_1_0%] transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group overflow-hidden rounded-4xl cursor-pointer min-w-0 neu-raised ${className}`}
    >
        <NeuImage
            src={service.image}
            alt={service.name}
            fallbackIcon={service.fallbackIcon}
            iconSize={48}
            className="absolute inset-0 w-full h-full transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500"></div>

        <div className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-start">
                <span className="font-serif text-white/90 text-xs md:text-sm border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    {service.id}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 bg-white/15 backdrop-blur-md p-2 rounded-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            <div className="relative z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-serif font-light leading-none tracking-tight mb-2">
                    {service.name}
                </h3>
                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden">
                    <p className="text-white/85 font-sans text-xs tracking-wide font-light pt-3 border-t border-white/20 mt-2 leading-relaxed max-w-[95%]">
                        {service.desc}
                    </p>
                </div>
            </div>
        </div>
    </Link>
);

const MobileServiceCard = ({ service }) => (
    <Link to="/services" className="relative group overflow-hidden rounded-4xl cursor-pointer shrink-0 w-[85vw] snap-center h-112.5 neu-raised">
        <NeuImage
            src={service.image}
            alt={service.name}
            fallbackIcon={service.fallbackIcon}
            iconSize={72}
            className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-transparent opacity-75"></div>

        <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <span className="font-serif text-white/90 text-sm border border-white/20 bg-white/5 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center tracking-widest">
                    {service.id}
                </span>
            </div>
            <div>
                <h3 className="text-white text-4xl font-serif font-light leading-none mb-3">
                    {service.name}
                </h3>
                <p className="text-white/85 font-sans text-sm tracking-wide font-light border-t border-white/20 pt-3">
                    {service.desc}
                </p>
            </div>
        </div>
    </Link>
);

const Services = () => {
    const services = {
        facial: {
            id: "01",
            name: "Facial Spa",
            fallbackIcon: Sparkles,
            image: qeshImg("luxury facial spa treatment, relaxed woman lying down with face mask, soft pastel tones", { width: 1000, height: 700, seed: 21 }),
            desc: "Rejuvenating treatments designed to restore your natural glow.",
        },
        hair: {
            id: "02",
            name: "Hair Styling",
            fallbackIcon: Scissors,
            image: qeshImg("elegant salon hair styling close up, flowing glossy hair, soft studio lighting", { width: 1000, height: 700, seed: 22 }),
            desc: "Precision cuts & expert coloring tailored to you.",
        },
        nails: {
            id: "03",
            name: "Nail Care",
            fallbackIcon: Hand,
            image: qeshImg("luxury manicure hands with nude polish, clean minimal salon backdrop", { width: 1000, height: 600, seed: 23 }),
            desc: "Luxurious manicures & pedicures using premium products.",
        },
        wax: {
            id: "04",
            name: "Waxing",
            fallbackIcon: Droplets,
            image: qeshImg("professional salon waxing treatment, smooth skin, clean bright atmosphere", { width: 1000, height: 600, seed: 24 }),
            desc: "Gentle full-body waxing for smooth, radiant skin.",
        },
        lashes: {
            id: "05",
            name: "Lashes",
            fallbackIcon: Eye,
            image: qeshImg("long luxurious eyelash extensions close up macro, soft neutral tones", { width: 1000, height: 600, seed: 25 }),
            desc: "Volume lifts & extensions for captivating eyes.",
        },
    };

    return (
        <section id="services" className="relative w-full bg-cream h-screen flex flex-col justify-center snap-start overflow-hidden">
            <div className="max-w-350 mx-auto px-4 md:px-8 w-full">
                <div className="text-center mb-20">
                    <span className="text-xs font-semibold tracking-[0.3em] text-brown-600 uppercase mb-4 block">
                        Experience the art of refined beauty
                    </span>
                    <h2 className="font-serif text-4xl md:text-6xl text-brown-900 mb-6 tracking-tight">
                        Services We Offer
                    </h2>
                    <div className="w-16 h-px bg-brown-900/30 mx-auto"></div>
                </div>

                <div className="hidden md:flex flex-col gap-4 h-[532px]">
                    <div className="flex w-full gap-4 h-[290px] overflow-hidden">
                        <ServiceCard service={services.facial} className="h-full" />
                        <ServiceCard service={services.hair} className="h-full" />
                    </div>
                    <div className="flex w-full gap-4 h-[226px] overflow-hidden">
                        <ServiceCard service={services.nails} className="h-full" />
                        <ServiceCard service={services.wax} className="h-full" />
                        <ServiceCard service={services.lashes} className="h-full" />
                    </div>
                </div>

                <div className="md:hidden flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                    <MobileServiceCard service={services.facial} />
                    <MobileServiceCard service={services.hair} />
                    <MobileServiceCard service={services.nails} />
                    <MobileServiceCard service={services.wax} />
                    <MobileServiceCard service={services.lashes} />
                </div>
            </div>
        </section>
    );
};

export default Services;
