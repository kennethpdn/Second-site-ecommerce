import React from 'react';
import { SEOHead } from '../components/SEOHead.tsx';

export const MentionsLegalesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Mentions Légales | Éclat Express"
        description="Mentions légales, éditeur du site et coordonnées de contact de la boutique Éclat Express."
      />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-4">
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Éditeur du Site
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">
            Mentions Légales
          </h1>
          <p className="text-xs text-[#C1121F] font-bold bg-[#C1121F]/10 p-3 rounded-lg">
            [MENTIONS OBLIGATOIRES — À compléter et à valider avant mise en production définitive]
          </p>

          <div className="prose text-xs sm:text-sm text-[#46536B] space-y-4 leading-relaxed pt-4 border-t border-[#EBECEF]">
            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">1. Éditeur de la Plateforme</h2>
              <p>
                Le site internet <strong>Éclat Express</strong> est édité par la société [Dénomination Sociale à compléter], immatriculée au Registre du Commerce sous le numéro [Numéro RCCM / SIREN à compléter], ayant son siège social situé à [Adresse du siège social à compléter].
              </p>
              <p>
                Directeur de la publication : [Nom du dirigeant à compléter]. Contact email : support@eclatexpress.com. Téléphone / WhatsApp : +225 07 00 00 00 00. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">2. Hébergement Web</h2>
              <p>
                Le site est hébergé sur les infrastructures Cloud sécurisées de Google Cloud Platform (Google Cloud Run / Firestore), 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">3. Propriété Intellectuelle</h2>
              <p>
                L'ensemble des visuels, logos, marques, textes et concepts de packs de fête présents sur ce site sont protégés au titre du droit d'auteur et de la propriété intellectuelle. Toute reproduction non autorisée est formellement prohibée. [À compléter et à valider].
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
