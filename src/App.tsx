import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RouterProvider, useRouter } from './router.tsx';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { StickyCartBar } from './components/StickyCartBar.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CartToast } from './components/CartToast.tsx';

// Existing & New Pages
import { HomePage } from './pages/HomePage.tsx';
import { BoutiquePage } from './pages/BoutiquePage.tsx';
import { PacksPage } from './pages/PacksPage.tsx';
import { PromosPage } from './pages/PromosPage.tsx';
import { LivraisonGarantiePage } from './pages/LivraisonGarantiePage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { ConfirmationPage } from './pages/ConfirmationPage.tsx';
import { AvisClientsPage } from './pages/AvisClientsPage.tsx';
import { ProfessionnelsPage } from './pages/ProfessionnelsPage.tsx';
import { LivraisonPaiementPage } from './pages/LivraisonPaiementPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { CgvPage } from './pages/CgvPage.tsx';
import { MentionsLegalesPage } from './pages/MentionsLegalesPage.tsx';
import { ConfidentialitePage } from './pages/ConfidentialitePage.tsx';
import { CookiesPage } from './pages/CookiesPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

const AppRoutes: React.FC = () => {
  const { path } = useRouter();
  const { loading } = useStore();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#0B1B33] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#46536B] font-bold">Chargement de la féerie Éclat Express...</p>
      </div>
    );
  }

  // Exact & Prefix Route matching
  if (path === '/' || path === '') {
    return <HomePage />;
  }
  if (path === '/packs') {
    return <PacksPage />;
  }
  if (path === '/boutique' || path.startsWith('/boutique?')) {
    return <BoutiquePage />;
  }
  if (path === '/promos') {
    return <PromosPage />;
  }
  if (path === '/livraison-garantie') {
    return <LivraisonGarantiePage />;
  }
  if (path.startsWith('/produit/')) {
    const slug = path.replace('/produit/', '').split('?')[0];
    return <ProductDetailPage slug={slug} />;
  }
  if (path === '/ma-selection') {
    return <CartPage />;
  }
  if (path === '/commande/confirmation' || path.startsWith('/commande/confirmation?')) {
    return <ConfirmationPage />;
  }
  if (path === '/commande') {
    return <CheckoutPage />;
  }
  if (path === '/avis-clients') {
    return <AvisClientsPage />;
  }
  if (path === '/professionnels') {
    return <ProfessionnelsPage />;
  }
  if (path === '/livraison-paiement') {
    return <LivraisonPaiementPage />;
  }
  if (path === '/faq') {
    return <FaqPage />;
  }
  if (path === '/contact') {
    return <ContactPage />;
  }
  if (path === '/cgv') {
    return <CgvPage />;
  }
  if (path === '/mentions-legales') {
    return <MentionsLegalesPage />;
  }
  if (path === '/confidentialite') {
    return <ConfidentialitePage />;
  }
  if (path === '/cookies') {
    return <CookiesPage />;
  }
  if (path === '/admin') {
    return <AdminPage />;
  }

  // 404 Fallback
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <h1 className="text-4xl font-extrabold text-[#0B1B33]">404</h1>
      <p className="text-xs text-[#46536B]">La page demandée n'existe pas ou a été déplacée.</p>
      <a href="/" className="btn-primary text-xs inline-flex">
        Retour à l'accueil
      </a>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { path } = useRouter();

  return (
    <main className="flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={path.split('?')[0]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <AppRoutes />
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#0B1B33]">
            <Header />
            <MainContent />
            <CartDrawer />
            <StickyCartBar />
            <CartToast />
            <Footer />
          </div>
        </CartProvider>
      </StoreProvider>
    </RouterProvider>
  );
}
