import React from 'react';
import { SEOHead } from '../components/SEOHead.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { useRouter } from '../router.tsx';

export const LivraisonGarantiePage: React.FC = () => {
  const { config } = useStore();
  const { navigate } = useRouter();

  return (
    <>
      <SEOHead
        title="Livraison Garantie avant le Réveillon du 31 Décembre"
        description="Engagement de livraison express 24h à 48h sur Abidjan, Dakar, Cotonou et Lomé avec suivi en temps réel et inspection au déballage."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card space-y-3">
          <span className="badge-champagne text-xs uppercase tracking-wider">
            Charte de Fiabilité Éclat Express
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B1B33]">
            Livraison Garantie avant le Réveillon
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B] max-w-2xl leading-relaxed">
            Pour le 31 décembre, chaque minute compte. Nous avons mis en place une organisation logistique dédiée pour que votre intérieur soit illuminé bien avant l'arrivée de vos convives.
          </p>
        </div>

        {/* 4 Pillars Grid (12-column responsive layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-[#EBECEF] p-6 shadow-card space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#0B1B33] text-white flex items-center justify-center text-lg">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <h2 className="font-extrabold text-base text-[#0B1B33]">Délai 24h à 48h</h2>
            <p className="text-xs text-[#46536B] leading-relaxed">
              Expédition le jour même pour toute commande confirmée avant 16h depuis nos dépôts régionaux.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#EBECEF] p-6 shadow-card space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center text-lg">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <h2 className="font-extrabold text-base text-[#0B1B33]">Alertes SMS &amp; WhatsApp</h2>
            <p className="text-xs text-[#46536B] leading-relaxed">
              Notification lors du départ du colis et contact téléphonique direct du livreur 30 min avant le passage.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#EBECEF] p-6 shadow-card space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#D9C2A3] text-[#0B1B33] flex items-center justify-center text-lg">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h2 className="font-extrabold text-base text-[#0B1B33]">Inspection au Déballage</h2>
            <p className="text-xs text-[#46536B] leading-relaxed">
              Vous ouvrez le carton avec le livreur et vérifiez que tout fonctionne avant de régler. Zéro mauvaise surprise.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#EBECEF] p-6 shadow-card space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#060F1F] text-white flex items-center justify-center text-lg">
              <i className="fa-solid fa-rotate-left text-[#D9C2A3]"></i>
            </div>
            <h2 className="font-extrabold text-base text-[#0B1B33]">Garantie Sérénité 14j</h2>
            <p className="text-xs text-[#46536B] leading-relaxed">
              Échange immédiat ou remboursement intégral en cas d'imprévu ou de changement d'avis.
            </p>
          </div>
        </div>

        {/* Zones and FAQ section */}
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="font-extrabold text-lg text-[#0B1B33]">
            Villes et zones de remise en mains propres
          </h2>
          <p className="text-xs sm:text-sm text-[#46536B] leading-relaxed">
            Nos équipes dédiées couvrent les agglomérations suivantes :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-[#0B1B33]">
            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#EBECEF]">
              <p className="text-sm font-black mb-1">🇨🇮 Abidjan</p>
              <p className="text-[#46536B] font-normal text-[11px]">Cocody, Marcory, Plateau, Riviera, Yopougon, Zone 4</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#EBECEF]">
              <p className="text-sm font-black mb-1">🇸🇳 Dakar</p>
              <p className="text-[#46536B] font-normal text-[11px]">Almadies, Plateau, Mermoz, Ouakam, Ngor, Point E</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#EBECEF]">
              <p className="text-sm font-black mb-1">🇧🇯 Cotonou</p>
              <p className="text-[#46536B] font-normal text-[11px]">Haie Vive, Ganhi, Akpakpa, Cadjehoun, Fidjrossè</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#EBECEF]">
              <p className="text-sm font-black mb-1">🇹🇬 Lomé</p>
              <p className="text-[#46536B] font-normal text-[11px]">Nyékonakpoè, Kodjoviakopé, Bè, Tokoin, Hedzranawoé</p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate('/packs')}
              className="h-12 px-8 bg-[#0B1B33] text-white font-bold text-xs rounded-xl hover:bg-[#162a4a] transition-all"
            >
              Commander un pack prêt à poser
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
