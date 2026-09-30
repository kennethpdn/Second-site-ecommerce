import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { PackCard } from '../components/PackCard.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { FreeShippingBar } from '../components/FreeShippingBar.tsx';

export const PromosPage: React.FC = () => {
  const { produits, packs } = useStore();

  // Filter only items with a real struck-through price
  const promoProduits = produits.filter((p) => p.prixBarre && p.prixBarre > p.prix);
  const promoPacks = packs.filter((p) => p.prixBarre && p.prixBarre > p.prix);

  return (
    <>
      <SEOHead
        title="Promotions & Offres Spéciales Réveillon"
        description="Profitez de nos réductions exclusives sur les guirlandes lumineuses, bougies LED et packs de fête pour le réveillon du 31 décembre."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="bg-[#C1121F]/10 border border-[#C1121F]/20 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C1121F] text-white text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-fire"></i>
            <span>Ventes Flash Réveillon</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B1B33] tracking-tight">
            Offres &amp; Promotions Exclusives
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B] max-w-2xl leading-relaxed">
            Économisez jusqu'à -25% sur notre sélection festive. Tarifs réduits garantis jusqu'au 20 décembre dans la limite des stocks disponibles.
          </p>
        </div>

        <FreeShippingBar compact />

        {/* Promo Packs */}
        {promoPacks.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-[#0B1B33] flex items-center gap-2">
              <i className="fa-solid fa-box-open text-[#D9C2A3]"></i>
              <span>Packs complets en promotion</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoPacks.map((pack) => (
                <PackCard key={pack.id} pack={pack} featured />
              ))}
            </div>
          </section>
        )}

        {/* Promo Products */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-[#0B1B33] flex items-center gap-2">
            <i className="fa-solid fa-tags text-[#D9C2A3]"></i>
            <span>Articles et guirlandes remisées</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {promoProduits.map((prod) => (
              <ProductCard key={prod.id} produit={prod} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
