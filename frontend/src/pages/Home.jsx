import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Ambience from '../components/home/Ambience';
import Feedback from '../components/home/Feedback';
import Footer from '../components/layout/Footer';
import BookingModal from '../components/booking/BookingModal';

const Home = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="w-full max-w-full overflow-x-hidden relative">
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                selectedServices={[]}
            />

            <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 relative h-screen flex flex-col snap-start overflow-hidden bg-cream">
                <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
                <div className="w-full h-px bg-beige-300/40 mb-2 md:mb-4"></div>
                <Hero />
            </div>
            <Services />
            <Ambience />
            <Feedback />
            <Footer />
        </div>
    );
};

export default Home;
