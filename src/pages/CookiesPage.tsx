import React from 'react';
import { SEOHead } from '../components/SEOHead.tsx';

export const CookiesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Gestion des Cookies & Traçeurs | Éclat Express"
        description="Politique d'utilisation des cookies techniques et de navigation sur la boutique Éclat Express."
      />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-4">
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Vie Privée
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">
            Politique relative aux Cookies
          </h1>
          <p className="text-xs text-[#C1121F] font-bold bg-[#C1121F]/10 p-3 rounded-lg">
            [INFORMATION COOKIES — À compléter et à valider conformément aux réglementations applicables]
          </p>

          <div className="prose text-xs sm:text-sm text-[#46536B] space-y-4 leading-relaxed pt-4 border-t border-[#EBECEF]">
            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">1. Cookies strictement nécessaires</h2>
              <p>
                Le site Éclat Express utilise le stockage local de votre navigateur (localStorage) uniquement pour mémoriser les articles de votre panier d'achat ("Ma sélection") d'une page à l'autre sans vous obliger à créer un compte. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">2. Absence de traçeurs publicitaires intrusifs</h2>
              <p>
                Nous n'installons aucun traqueur tiers à des fins de profilage commercial invasif. Vous pouvez désactiver à tout moment le stockage des cookies depuis les réglages de votre navigateur web. [À compléter et à valider].
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
