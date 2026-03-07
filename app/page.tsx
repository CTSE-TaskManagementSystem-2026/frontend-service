import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import HeroSection from '@/app/components/HeroSection';
import ServicesSection from '@/app/components/ServicesSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import StatsSection from '@/app/components/StatsSection';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
