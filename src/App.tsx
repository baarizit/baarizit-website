import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingContactButtons } from './components/layout/FloatingContactButtons';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/modals/ToastContainer';
import { QuickViewModal } from './components/shop/QuickViewModal';
import { CartDrawer } from './components/shop/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { LiveChatDrawer } from './components/chat/LiveChatDrawer';

// Pages & Section Views
import { HeroSection } from './components/home/HeroSection';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { SpecialOffers } from './components/home/SpecialOffers';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CustomerReviews } from './components/home/CustomerReviews';
import { LocationSection } from './components/home/LocationSection';
import { ContactSection } from './components/home/ContactSection';
import { ShopView } from './components/shop/ShopView';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { PCBuilder } from './components/pc-builder/PCBuilder';
import { ServicesView } from './components/services/ServicesView';
import { CheckoutView } from './components/shop/CheckoutView';
import { CompareView } from './components/shop/CompareView';
import { WishlistView } from './components/shop/WishlistView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AccessDenied } from './components/admin/AccessDenied';
import {
  AboutPage,
  OrderTrackingPage,
  WarrantyPolicyPage,
  TermsPage,
  PrivacyPage,
  SitemapPage,
  DynamicCustomPageView,
} from './components/pages/StaticPages';

const MainContent: React.FC = () => {
  const { activePage } = useStore();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Check if activePage is a custom page route (e.g. "page-emi-policy" or "page-return-guide")
  const isCustomPage = activePage.startsWith('page-') || activePage.startsWith('custom-page-');
  const customPageSlug = isCustomPage ? activePage.replace(/^(page-|custom-page-)/, '') : '';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-20 lg:pb-0">
      <div>
        {activePage === 'home' && (
          <>
            <HeroSection />
            <FeaturedCategories />
            <FeaturedProducts />
            <SpecialOffers />
            <WhyChooseUs />
            <CustomerReviews />
            <LocationSection />
            <ContactSection />
          </>
        )}

        {activePage === 'shop' && <ShopView />}
        {activePage === 'product-detail' && <ProductDetailPage />}
        {activePage === 'pc-builder' && <PCBuilder />}
        {activePage === 'services' && <ServicesView />}
        {activePage === 'checkout' && <CheckoutView />}
        {activePage === 'compare' && <CompareView />}
        {activePage === 'wishlist' && <WishlistView />}
        {activePage === 'admin' && <AdminDashboard />}
        {activePage === 'admin-login' && <AdminLogin />}
        {activePage === 'access-denied' && <AccessDenied />}
        {activePage === 'customer-dashboard' && <CustomerDashboard />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'sitemap-page' && <SitemapPage />}
        {isCustomPage && <DynamicCustomPageView pageSlug={customPageSlug} />}
        {activePage === 'contact' && (
          <div className="py-8">
            <ContactSection />
            <LocationSection />
          </div>
        )}
        {activePage === 'offers' && (
          <div className="py-8">
            <SpecialOffers />
          </div>
        )}
        {activePage === 'order-tracking' && <OrderTrackingPage />}
        {activePage === 'warranty-policy' && <WarrantyPolicyPage />}
        {activePage === 'terms' && <TermsPage />}
        {activePage === 'privacy' && <PrivacyPage />}
      </div>

      <Footer />
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
        <Navbar />
        <MainContent />
        <MobileBottomNav />
        <FloatingContactButtons />
        <LiveChatDrawer />
        <CartDrawer />
        <QuickViewModal />
        <AuthModal />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}
