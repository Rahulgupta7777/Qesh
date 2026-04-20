import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BookingModal from '../components/booking/BookingModal';

const Legal = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans selection:bg-brown-900 selection:text-white pb-0">
      <div className="fixed top-0 left-0 right-0 z-50 bg-cream">
        <div className="max-w-360 mx-auto px-6 md:px-10">
          <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={[]}
      />

      <main className="max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20">
        <div className="mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-brown-900 mb-4 tracking-tight">Legal</h1>
          <p className="text-brown-600 text-sm md:text-base">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
        </div>

        <section className="mb-16">
          <h2 className="font-serif text-2xl md:text-3xl text-brown-900 mb-6 tracking-tight font-semibold">Privacy Policy</h2>
          <div className="text-brown-700 space-y-6 text-base md:text-lg leading-relaxed">
             <p>
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information. We only collect information necessary to provide our services, such as your name, contact numbers, and appointment data.
            </p>
            <p>
              We do not sell your personal data to third parties. We use industry-standard security measures to protect your information. 
              <br/><br/>
              Address: Ground Floor, Triaa, Shop No. 33-34, Dhanori-Lohegaon Rd, Dhanori, Pune, Maharashtra 411015
              <br/>
              Contact: qesh.salon@gmail.com / +91 75663 66375
              <br/>
              Website: qesh.in
            </p>
          </div>
        </section>

        <hr className="border-brown-900/10 mb-16" />

        <section className="mb-24">
          <h2 className="font-serif text-2xl md:text-3xl text-brown-900 mb-6 tracking-tight font-semibold">Terms of Service</h2>
          <div className="text-brown-700 space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              By accessing Qesh SALON, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>
            <ul className="list-disc pl-6 space-y-4">
              <li>Appointments are subject to availability. Please arrive on time.</li>
              <li>You must not use our services or platform in any way that causes, or may cause, damage to the salon or impairment of the availability or accessibility of the service.</li>
              <li>We reserve the right to remove any content or terminate accounts at our discretion.</li>
              <li>The platform is provided "as is" without warranties of any kind.</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Legal;
