import React from 'react';
import { SEOHead } from '../components/SEOHead.tsx';

export const ConfidentialitePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Politique de Confidentialité | Éclat Express"
        description="Engagement d'Éclat Express sur la protection des données personnelles de nos clients et utilisateurs."
      />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-4">
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Protection des Données
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">
            Politique de Confidentialité
          </h1>
          <p className="text-xs text-[#C1121F] font-bold bg-[#C1121F]/10 p-3 rounded-lg">
            [CHARTE DONNÉES PERSONNELLES — À compléter et à valider par le Délégué à la Protection des Données]
          </p>

          <div className="prose text-xs sm:text-sm text-[#46536B] space-y-4 leading-relaxed pt-4 border-t border-[#EBECEF]">
            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">1. Collecte Minimale des Données</h2>
              <p>
                Éclat Express privilégie la commande anonyme sans création de compte. Les seules informations collectées sont votre nom, votre numéro de téléphone et votre adresse de livraison, strictement nécessaires pour acheminer votre commande de réveillon. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">2. Utilisation des Coordonnées</h2>
              <p>
                Votre numéro de téléphone est exclusivement utilisé pour vous transmettre la confirmation par SMS/WhatsApp et permettre au livreur de vous contacter lors de son arrivée. Vos données ne sont jamais cédées ni vendues à des régies publicitaires tierces. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">3. Vos Droits</h2>
              <p>
                Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données personnelles sur simple demande par email à privacy@eclatexpress.com. [À compléter et à valider].
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
