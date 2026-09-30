import React from 'react';
import { useStore } from '../context/StoreContext.tsx';

export const ContactPage: React.FC = () => {
  const { config } = useStore();
  const phone = config.numeroWhatsApp || '2250700000000';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-2">
        <span className="badge-champagne text-[10px] uppercase tracking-wider">
          Service Client &amp; Suivi
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B33]">
          Contactez l'équipe Éclat Express
        </h1>
        <p className="text-xs sm:text-sm text-[#46536B]">
          Notre équipe logistique et nos conseillers déco sont à votre entière écoute 7j/7 pour vous garantir un réveillon sans accroc.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WhatsApp direct card */}
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xl">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <h3 className="font-extrabold text-sm text-[#0B1B33]">WhatsApp Direct</h3>
            <p className="text-xs text-[#46536B]">
              Pour une question sur un produit, modifier un créneau ou suivre un livreur en temps réel.
            </p>
          </div>
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noreferrer"
            className="w-full h-11 bg-[#25D366] hover:bg-[#1fb355] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <i className="fa-brands fa-whatsapp"></i>
            <span>Démarrer la discussion</span>
          </a>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1B33]/10 text-[#0B1B33] flex items-center justify-center text-xl">
            <i className="fa-solid fa-truck-ramp-box"></i>
          </div>
          <h3 className="font-extrabold text-sm text-[#0B1B33]">Zones &amp; Dépôts Locaux</h3>
          <p className="text-xs text-[#46536B] leading-relaxed">
            Dépôts d'expédition rapides situés à :
          </p>
          <ul className="text-xs text-[#0B1B33] font-semibold space-y-1">
            <li>• Abidjan (Cocody &amp; Marcory)</li>
            <li>• Dakar (Almadies &amp; Plateau)</li>
            <li>• Cotonou &amp; Lomé</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
