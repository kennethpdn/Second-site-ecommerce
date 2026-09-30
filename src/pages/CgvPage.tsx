import React from 'react';
import { SEOHead } from '../components/SEOHead.tsx';

export const CgvPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Conditions Générales de Vente (CGV) | Éclat Express"
        description="Conditions générales de vente de la boutique en ligne Éclat Express pour les décorations de fêtes et réveillon."
      />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-4">
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Informations Légales
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">
            Conditions Générales de Vente (CGV)
          </h1>
          <p className="text-xs text-[#C1121F] font-bold bg-[#C1121F]/10 p-3 rounded-lg">
            [DOCUMENT TYPE — Textes contractuels à compléter et à valider par le service juridique de l'éditeur]
          </p>

          <div className="prose text-xs sm:text-sm text-[#46536B] space-y-4 leading-relaxed pt-4 border-t border-[#EBECEF]">
            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">Article 1 — Objet et Champ d'application</h2>
              <p>
                Les présentes Conditions Générales de Vente régissent l'ensemble des commandes passées sur le site web <strong>Éclat Express</strong>, spécialisé dans la vente d'articles et packs de décoration festive pour le réveillon du 31 décembre. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">Article 2 — Commandes et Réservation de Stock</h2>
              <p>
                La validation du formulaire de commande en ligne emporte réservation immédiate des produits auprès de nos entrepôts. Le client reçoit une confirmation par message électronique ou WhatsApp comprenant le récapitulatif de sa commande et son numéro unique d'identification. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">Article 3 — Modalités de Paiement</h2>
              <p>
                Aucun paiement n'est exigé au moment de la commande en ligne. Le règlement s'effectue intégralement lors de la remise en mains propres par le livreur, après inspection physique des colis, en espèces ou par solution de Mobile Money autorisée (Wave, Orange Money, MTN). [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">Article 4 — Délais et Frais de Livraison</h2>
              <p>
                Les commandes sont expédiées sous 24 à 48 heures ouvrées sur les zones desservies (Abidjan, Dakar, Cotonou, Lomé). Les frais forfaitaires sont de 2 000 FCFA et sont offerts dès 30 000 FCFA d'achats. [À compléter et à valider].
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base font-bold text-[#0B1B33]">Article 5 — Droit de Rétractation et Retours</h2>
              <p>
                Conformément aux usages du commerce en ligne, l'acheteur dispose d'un délai de 14 jours à compter de la réception de son colis pour exercer son droit de rétractation et demander l'échange ou le remboursement du produit non utilisé et dans son emballage d'origine. [À compléter et à valider].
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
