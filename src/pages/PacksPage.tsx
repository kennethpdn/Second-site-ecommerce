import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { PackCard } from '../components/PackCard.tsx';
import { FreeShippingBar } from '../components/FreeShippingBar.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const PacksPage: React.FC = () => {
  const { packs } = useStore();

  return (
    <>
      <SEOHead
        title="Packs Réveillon Prêts à Poser | Éclat Express"
        description="Découvrez nos 4 packs coordonnés prêts à poser en 20 minutes pour le 31 décembre : salon complet, table 6 personnes, façade et compte à rebours."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-3">
          <span className="badge-champagne text-xs uppercase tracking-wider">
            Formules Clés en Main
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B1B33] tracking-tight">
            Packs Réveillon Prêts à Poser
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B] max-w-3xl leading-relaxed">
            Pensés par des décorateurs d'intérieur professionnels : tous les éléments indispensables sont coordonnés et prêts à être installés en moins de 20 minutes sans outils ni électricien.
          </p>

          {/* 3 Pills */}
          <div className="pt-3 flex flex-wrap gap-2 text-xs text-[#0B1B33] font-semibold">
            <span className="bg-[#F5F7FA] px-3.5 py-2 rounded-xl border border-[#EBECEF] flex items-center gap-2">
              <i className="fa-solid fa-clock text-[#D9C2A3]"></i>
              Pose express en 20 min
            </span>
            <span className="bg-[#F5F7FA] px-3.5 py-2 rounded-xl border border-[#EBECEF] flex items-center gap-2">
              <i className="fa-solid fa-battery-full text-[#D9C2A3]"></i>
              Piles &amp; pastilles murales incluses
            </span>
            <span className="bg-[#F5F7FA] px-3.5 py-2 rounded-xl border border-[#EBECEF] flex items-center gap-2">
              <i className="fa-solid fa-hand-holding-dollar text-[#D9C2A3]"></i>
              Paiement à la livraison après inspection
            </span>
          </div>
        </div>

        {/* Free Shipping Alert */}
        <FreeShippingBar compact />

        {/* Packs Grid: 2 columns on desktop with generous spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} featured />
          ))}
        </div>
      </div>
    </>
  );
};
