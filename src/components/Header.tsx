import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../router.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useStore } from '../context/StoreContext.tsx';

export const Header: React.FC = () => {
  const { path, navigate } = useRouter();
  const { totalCount, openCartDrawer } = useCart();
  const { avis } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const validatedAvisCount = avis.filter((a) => a.valide).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/boutique?q=${encodeURIComponent(headerSearch.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Packs réveillon', to: '/packs' },
    { label: 'Boutique', to: '/boutique' },
    { label: 'Promos', to: '/promos', badge: 'Offres' },
    { label: 'Livraison garantie', to: '/livraison-garantie' },
    ...(validatedAvisCount > 0 ? [{ label: 'Avis clients', to: '/avis-clients' }] : []),
    { label: 'Espace Pro', to: '/professionnels' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBECEF]">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#0B1B33] text-white text-xs py-2 px-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#D9C2A3] animate-pulse">⚡</span>
            <span className="truncate">
              Commandez avant le 20 déc. : <strong className="font-bold text-white">livraison garantie avant le réveillon</strong> sur Abidjan, Dakar, Cotonou et Lomé
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#C7CCD1] shrink-0">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-phone text-[#D9C2A3]"></i>
              <span>Conseil 7j/7</span>
            </span>
            <span className="bg-[#060F1F] text-[#D9C2A3] border border-[#D9C2A3]/30 px-2 py-0.5 rounded font-black tracking-wider uppercase">
              J-92
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar: 1200px container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand Logo */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-[#0B1B33] hover:text-[#46536B] transition-colors"
            aria-label="Menu principal"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </motion.button>

          {/* Logo with 4-point sparkle star */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2.5 group"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-[#0B1B33] text-[#D9C2A3] flex items-center justify-center text-lg shadow-sm"
            >
              ✦
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0B1B33] uppercase leading-none group-hover:text-[#162a4a] transition-colors">
                ÉCLAT EXPRESS
              </span>
              <span className="text-[10px] text-[#46536B] tracking-widest uppercase font-semibold">
                Réveillon Féerique
              </span>
            </div>
          </a>
        </div>

        {/* Center: Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#46536B] text-xs"></i>
            <input
              type="search"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Rechercher une guirlande, un pack, des bougies LED..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#F5F7FA] border border-[#EBECEF] text-xs text-[#0B1B33] placeholder-[#46536B]/70 focus:bg-white focus:outline-none focus:border-[#0B1B33] transition-all"
            />
          </form>
        </div>

        {/* Right actions: WhatsApp, Admin, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://wa.me/2250700000000?text=Bonjour%20%C3%89clat%20Express%20!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#0B1B33] hover:text-[#25D366] transition-colors px-2 py-1"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>Aide</span>
          </a>

          <button
            onClick={() => navigate('/admin')}
            className="p-2 text-[#0B1B33] hover:text-[#46536B] transition-colors hidden sm:block"
            title="Espace gestion"
            aria-label="Administration"
          >
            <i className="fa-solid fa-circle-user text-lg"></i>
          </button>

          {/* Cart Button: Triggers "Ma sélection" Side Drawer */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={openCartDrawer}
            className="h-10 px-3.5 bg-[#0B1B33] text-white hover:bg-[#162a4a] rounded-xl flex items-center gap-2 font-bold text-xs transition-colors shadow-sm"
            aria-label="Ouvrir le panier"
          >
            <i className="fa-solid fa-bag-shopping text-sm"></i>
            <span className="hidden sm:inline">Ma sélection</span>
            <motion.span
              key={totalCount}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="bg-[#D9C2A3] text-[#0B1B33] px-2 py-0.5 rounded-full text-[10px] font-black tabular-nums"
            >
              {totalCount}
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Desktop Secondary Horizontal Navigation Bar */}
      <nav className="hidden lg:block border-t border-[#EBECEF] bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold text-[#0B1B33]">
          <div className="flex items-center gap-7 py-2.5">
            {navLinks.map((link) => {
              const active = path === link.to;
              return (
                <button
                  key={link.to}
                  onClick={() => navigate(link.to)}
                  className={`relative py-1 transition-colors hover:text-[#0B1B33] flex items-center gap-1.5 ${
                    active ? 'text-[#0B1B33] font-black' : 'text-[#46536B]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-[#C1121F] text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B1B33] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#46536B] font-semibold flex items-center gap-2">
            <i className="fa-solid fa-shield-check text-[#0B1B33]"></i>
            <span>Paiement en espèces ou Mobile Money au livreur</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-white border-t border-[#EBECEF] px-4 py-4 space-y-3 shadow-xl overflow-hidden"
          >
            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#46536B] text-xs"></i>
              <input
                type="search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Rechercher sur le site..."
                className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#F5F7FA] border border-[#EBECEF] text-xs text-[#0B1B33] focus:outline-none"
              />
            </form>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => {
                    navigate(link.to);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-left text-xs font-bold transition-colors ${
                    path === link.to ? 'bg-[#0B1B33] text-white' : 'text-[#0B1B33] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-[#D9C2A3] text-[#0B1B33] text-[9px] px-2 py-0.5 rounded font-black">
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
