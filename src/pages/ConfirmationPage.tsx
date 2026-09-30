import React, { useState } from 'react';
import { useRouter } from '../router.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const ConfirmationPage: React.FC = () => {
  const { navigate } = useRouter();
  const { config } = useStore();
  const [copied, setCopied] = useState(false);

  // Read URL query params
  const params = new URLSearchParams(window.location.search);
  const numero = params.get('numero') || 'EE-261220-4921';
  const total = Number(params.get('total') || 26500);

  const phone = config.numeroWhatsApp || '2250700000000';
  const messageSummary = `Bonjour Éclat Express ! Je confirme ma commande :\n• Numéro : ${numero}\n• Total à régler : ${total.toLocaleString('fr-FR')} FCFA\n\nMerci de m'informer de l'heure d'arrivée du livreur !`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageSummary)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Commande Éclat Express n° ${numero}\nMontant : ${total.toLocaleString('fr-FR')} FCFA à payer au livreur.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead
        title="Confirmation de Commande | Éclat Express"
        description="Votre commande de décorations de réveillon a bien été enregistrée."
        canonicalPath="/commande/confirmation"
        noindex
      />
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6 pb-24">
      {/* Success Badge & Header */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 text-center space-y-4 shadow-card">
        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto text-3xl animate-bounce">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <div className="space-y-1">
          <span className="badge-champagne text-[11px] uppercase tracking-wider">
            Commande Confirmée avec succès
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">
            Merci pour votre commande !
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B]">
            Votre numéro de référence a été généré. Le stock est réservé et le livreur va préparer votre colis de réveillon.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="bg-[#F5F7FA] border border-[#EBECEF] rounded-xl p-4 space-y-2">
          <p className="text-xs text-[#46536B] font-semibold uppercase tracking-wider">
            Numéro de commande
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#0B1B33] font-mono tracking-wider">
            {numero}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs text-[#46536B]">Total à régler au livreur :</span>
            <strong className="text-sm font-extrabold text-[#0B1B33] tabular-nums">
              {total.toLocaleString('fr-FR')} FCFA
            </strong>
          </div>
        </div>

        {/* WhatsApp Notification CTA */}
        <div className="space-y-2.5 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full h-13 bg-[#25D366] hover:bg-[#1fb355] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Ouvrir sur WhatsApp pour le suivi livreur</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full h-11 bg-white border border-[#EBECEF] hover:bg-[#F5F7FA] text-[#0B1B33] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <i className={`fa-solid ${copied ? 'fa-check text-[#25D366]' : 'fa-copy'}`}></i>
            <span>{copied ? 'Récapitulatif copié !' : 'Copier le récapitulatif'}</span>
          </button>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-4">
        <h2 className="font-extrabold text-sm text-[#0B1B33] flex items-center gap-2">
          <i className="fa-solid fa-list-check text-[#D9C2A3]"></i>
          <span>Prochaines étapes de votre livraison</span>
        </h2>

        <div className="space-y-3 text-xs text-[#46536B]">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#0B1B33] text-white flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <div>
              <p className="font-bold text-[#0B1B33]">Préparation express du colis</p>
              <p className="text-[11px]">Vérification du fonctionnement de toutes les guirlandes et bougies LED.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#0B1B33] text-white flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <p className="font-bold text-[#0B1B33]">Appel du livreur avant passage</p>
              <p className="text-[11px]">Le livreur vous contactera par téléphone ou WhatsApp 30 minutes avant son arrivée.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#0B1B33] text-white flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <div>
              <p className="font-bold text-[#0B1B33]">Inspection &amp; Paiement en mains propres</p>
              <p className="text-[11px]">Déballez et inspectez votre colis avec le livreur avant de régler (Espèces ou Wave/OM).</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full h-11 bg-[#F5F7FA] hover:bg-[#EBECEF] text-[#0B1B33] rounded-xl text-xs font-bold transition-colors mt-2"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
    </>
  );
};
