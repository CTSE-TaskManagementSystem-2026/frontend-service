import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import HeroSection from '@/app/components/HeroSection';
import ServicesSection from '@/app/components/ServicesSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import StatsSection from '@/app/components/StatsSection';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'NEXUS — Microservice Project Management Platform',
  description:
    'A distributed microservice platform for managing projects, tasks, and teams — with real-time analytics and enterprise-grade authentication.',
};

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
