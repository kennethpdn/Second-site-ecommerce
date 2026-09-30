import React from 'react';
import { SEOHead } from '../components/SEOHead.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { useRouter } from '../router.tsx';

export const LivraisonPaiementPage: React.FC = () => {
  const { config } = useStore();
  const { navigate } = useRouter();

  return (
    <>
      <SEOHead
        title="Livraison Express & Moyens de Paiement | Éclat Express"
        description="Découvrez notre fonctionnement : livraison rapide 24h-48h et paiement 100% sécurisé à la réception par Wave, Orange Money ou espèces."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-3">
          <span className="badge-champagne text-xs uppercase tracking-wider">
            Zéro Paiement d'Avance
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B1B33]">
            Livraison &amp; Paiement à Réception
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B] max-w-2xl leading-relaxed">
            Chez Éclat Express, vous commandez en toute confiance. Pas de coordonnées bancaires à renseigner en ligne : vous ne réglez vos articles qu'après les avoir tenus entre vos mains.
          </p>
        </div>

        {/* 2 Big Cards: Paiement & Livraison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Paiement */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#0B1B33] text-white flex items-center justify-center text-xl">
              <i className="fa-solid fa-wallet"></i>
            </div>
            <h2 className="text-xl font-extrabold text-[#0B1B33]">
              Comment se déroule le règlement ?
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#46536B] leading-relaxed">
              <p>
                <strong>1. Lors de la commande :</strong> Vous indiquez simplement vos coordonnées de livraison et votre créneau souhaité. Aucun paiement n'est exigé sur le site web.
              </p>
              <p>
                <strong>2. À l'arrivée du livreur :</strong> Le livreur vous remet le colis scellé. Vous l'ouvrez devant lui et contrôlez la conformité des guirlandes, bougies et accessoires.
              </p>
              <p>
                <strong>3. Règlement sur place :</strong> Une fois satisfait, vous réglez selon votre convenance :
              </p>
              <ul className="space-y-1.5 pl-2 font-bold text-[#0B1B33]">
                <li>• En espèces en mains propres (monnaie exacte appréciée)</li>
                <li>• Par transfert direct Wave</li>
                <li>• Par Orange Money ou MTN Mobile Money</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Livraison */}
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#D9C2A3] text-[#0B1B33] flex items-center justify-center text-xl">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <h2 className="text-xl font-extrabold text-[#0B1B33]">
              Délais &amp; Tarifs d'expédition
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#46536B] leading-relaxed">
              <p>
                <strong>Frais de livraison :</strong> 2 000 FCFA pour les commandes inférieures à 30 000 FCFA.
              </p>
              <p className="bg-[#25D366]/10 p-3 rounded-xl text-[#0B1B33] font-bold">
                ✓ Livraison offerte automatiquement dès 30 000 FCFA d'achats !
              </p>
              <p>
                <strong>Créneaux au choix :</strong>
              </p>
              <ul className="space-y-1 pl-2 text-xs text-[#0B1B33]">
                <li>• Matinée : 09h00 - 13h00</li>
                <li>• Après-midi : 14h00 - 18h00</li>
                <li>• Soirée : 18h00 - 21h00 (idéal après le travail)</li>
              </ul>
              <p>
                <strong>Garantie 14 jours :</strong> Si un article ne vous convient pas, contactez notre service client pour un échange ou un remboursement.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/boutique')}
            className="h-13 px-8 bg-[#0B1B33] text-white font-bold text-xs rounded-xl hover:bg-[#162a4a] transition-all"
          >
            Accéder à la boutique de fête
          </button>
        </div>
      </div>
    </>
  );
};
