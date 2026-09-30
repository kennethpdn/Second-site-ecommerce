import React, { useState } from 'react';
import { useRouter } from '../router.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

const COUNTRY_CODES = [
  { code: '+225', country: 'Côte d’Ivoire', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

export const CheckoutPage: React.FC = () => {
  const { navigate, goBack } = useRouter();
  const { items, totalAmount, freeShippingRemaining, clearCart } = useCart();
  const { config } = useStore();

  const [nom, setNom] = useState('');
  const [countryCode, setCountryCode] = useState('+225');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adresse, setAdresse] = useState('');
  const [creneau, setCreneau] = useState<'matin' | 'apres-midi' | 'soiree'>('apres-midi');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFreeShipping = freeShippingRemaining === 0;
  const shippingFee = isFreeShipping || totalAmount === 0 ? 0 : 2000;
  const grandTotal = totalAmount + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nom.trim() || nom.trim().length < 2) {
      setErrorMessage('Veuillez saisir votre nom complet.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 6) {
      setErrorMessage('Numéro WhatsApp invalide (minimum 6 chiffres).');
      return;
    }

    if (!adresse.trim() || adresse.trim().length < 4) {
      setErrorMessage('Veuillez indiquer une adresse ou un repère précis pour le livreur.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Votre panier est vide. Veuillez ajouter au moins un article.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      const payload = {
        nom: nom.trim(),
        telephone: fullPhone,
        adresse: adresse.trim(),
        creneau,
        notes: notes.trim(),
        honeypot,
        lignes: items.map((i) => ({
          type: i.type,
          id: i.id,
          nom: i.nom,
          quantite: i.quantite,
          variante: i.variante || null,
        })),
      };

      const response = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande.');
      }

      const orderNumber = data.numero;
      const orderTotal = data.total || grandTotal;

      clearCart();
      navigate(`/commande/confirmation?numero=${encodeURIComponent(orderNumber)}&total=${orderTotal}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(
        err.message ||
          'Une erreur est survenue lors de l’enregistrement de votre commande. Vous pouvez aussi finaliser directement via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppFallback = () => {
    const phone = config.numeroWhatsApp || '2250700000000';
    const linesSummary = items
      .map((i) => `• ${i.quantite}x ${i.nom} (${(i.prixUnitaire * i.quantite).toLocaleString('fr-FR')} FCFA)`)
      .join('\n');
    const msg = `Bonjour Éclat Express ! Je souhaite passer commande express :\nNom : ${nom || 'Client'}\nAdresse : ${adresse || 'À préciser'}\nCréneau : ${creneau}\n\nArticles :\n${linesSummary}\n\nTotal à payer au livreur : ${grandTotal.toLocaleString('fr-FR')} FCFA.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <SEOHead
        title="Commande Express Réveillon | Éclat Express"
        description="Validation express en 30 secondes sans paiement en ligne. Vous ne réglez qu'après réception et inspection de vos décorations."
      />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-36 md:pb-16">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#EBECEF] pb-3">
          <button
            onClick={goBack}
            className="flex items-center gap-2 font-bold text-xs text-[#0B1B33] hover:text-[#46536B]"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Retour à ma sélection</span>
          </button>
          <span className="text-xs text-[#46536B] font-semibold">
            Étape 2/2 • Confirmation express
          </span>
        </div>

        {/* Champagne zero online payment banner */}
        <div className="bg-[#D9C2A3]/25 border border-[#D9C2A3]/50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-white text-[#0B1B33] flex items-center justify-center text-lg shrink-0 shadow-2xs">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="space-y-0.5 text-xs text-[#0B1B33]">
            <h2 className="font-extrabold text-sm sm:text-base">Zéro paiement en ligne requis</h2>
            <p className="text-[#46536B] leading-relaxed">
              Validation immédiate par WhatsApp ou SMS. Vous ne réglez qu'après réception et inspection de vos articles avec le livreur.
            </p>
          </div>
        </div>

        {/* 12-Column Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Form */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="badge-champagne text-[10px] uppercase tracking-wider">
                Règlement au livreur
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">Commande express</h1>
              <p className="text-xs text-[#46536B]">
                Pas de compte à créer. Règlement en mains propres directement auprès du livreur.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden from real users, traps bots) */}
              <input
                type="text"
                name="website_anti_spam"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                aria-hidden="true"
              />

              {/* 1. Nom complet */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1B33] flex justify-between">
                  <span>1. Nom complet</span>
                  <span className="text-[10px] text-[#46536B] font-normal">Requis</span>
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-[#46536B] text-xs"></i>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Aminata Diallo"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-[#EBECEF] text-xs sm:text-sm text-[#0B1B33] focus:outline-none focus:border-[#0B1B33] shadow-card"
                  />
                </div>
              </div>

              {/* 2. Téléphone WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1B33] flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>2. Téléphone WhatsApp</span>
                    <i className="fa-brands fa-whatsapp text-[#25D366]"></i>
                  </span>
                  <span className="text-[10px] text-[#25D366] font-semibold">Confirmation directe</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-12 px-3 bg-white border border-[#EBECEF] rounded-xl text-xs font-bold text-[#0B1B33] focus:outline-none shadow-card shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="07 00 00 00 00"
                    className="flex-1 h-12 px-4 rounded-xl bg-white border border-[#EBECEF] text-xs sm:text-sm text-[#0B1B33] focus:outline-none focus:border-[#0B1B33] shadow-card font-mono"
                  />
                </div>
                <p className="text-[10px] text-[#46536B] flex items-center gap-1">
                  <i className="fa-solid fa-circle-info text-[9px]"></i>
                  <span>Pour vous envoyer la confirmation &amp; le suivi du livreur en temps réel.</span>
                </p>
              </div>

              {/* 3. Adresse de livraison & repère */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1B33] flex justify-between">
                  <span>3. Adresse de livraison &amp; repère précis</span>
                  <span className="text-[10px] text-[#46536B] font-normal">Requis</span>
                </label>
                <div className="relative">
                  <i className="fa-solid fa-location-dot absolute left-3.5 top-3.5 text-[#46536B] text-xs"></i>
                  <textarea
                    required
                    rows={2}
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    placeholder="Ville, quartier, repère ou rue (Ex: Cocody Angré 8ème tranche, après la pharmacie des Grâces)"
                    className="w-full p-3 pl-10 rounded-xl bg-white border border-[#EBECEF] text-xs sm:text-sm text-[#0B1B33] focus:outline-none focus:border-[#0B1B33] shadow-card resize-none"
                  />
                </div>
              </div>

              {/* 4. Créneau de remise en mains propres */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1B33] flex justify-between">
                  <span>4. Créneau de remise en mains propres</span>
                  <span className="text-[10px] text-[#46536B] font-semibold">Aujourd'hui / Demain</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'matin', label: 'Matin', time: '09h - 13h', icon: 'fa-sun' },
                    { id: 'apres-midi', label: 'Après-midi', time: '14h - 18h', icon: 'fa-cloud-sun' },
                    { id: 'soiree', label: 'Soirée', time: '18h - 21h', icon: 'fa-moon' },
                  ].map((cr) => (
                    <button
                      key={cr.id}
                      type="button"
                      onClick={() => setCreneau(cr.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        creneau === cr.id
                          ? 'bg-[#0B1B33] text-white border-[#0B1B33] shadow-xs'
                          : 'bg-white text-[#0B1B33] border-[#EBECEF] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <i className={`fa-solid ${cr.icon} text-xs ${creneau === cr.id ? 'text-[#D9C2A3]' : 'text-[#46536B]'}`}></i>
                      <span className="font-bold text-xs">{cr.label}</span>
                      <span className="text-[10px] opacity-80">{cr.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-[#C1121F]/10 border border-[#C1121F]/30 rounded-xl p-4 text-xs text-[#C1121F] space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppFallback}
                    className="text-xs font-extrabold text-[#0B1B33] underline hover:no-underline flex items-center gap-1.5"
                  >
                    <i className="fa-brands fa-whatsapp text-sm text-[#25D366]"></i>
                    <span>Finaliser ma commande directement par WhatsApp</span>
                  </button>
                </div>
              )}

              {/* Desktop Submit Button (Visible on md and up) */}
              <div className="hidden md:block pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full h-13 bg-[#0B1B33] hover:bg-[#162a4a] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Validation en cours...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-xs text-[#D9C2A3]"></i>
                      <span>Envoyer ma commande ({grandTotal.toLocaleString('fr-FR')} FCFA)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mobile Fixed Sticky Bottom Bar */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EBECEF] p-4 shadow-2xl md:hidden">
                <div className="max-w-xl mx-auto space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[#46536B]">
                      <span>À payer au livreur :</span>
                      <strong className="text-sm font-black text-[#0B1B33] tabular-nums">
                        {grandTotal.toLocaleString('fr-FR')} FCFA
                      </strong>
                    </div>
                    <span className="badge-champagne text-[10px]">0 FCFA maintenant</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full h-12 bg-[#0B1B33] text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Validation en cours...</span>
                    ) : (
                      <span>Envoyer ma commande ({grandTotal.toLocaleString('fr-FR')} FCFA)</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right 5 Columns: Panier Express & Payment Methods */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            {/* Panier Express Card */}
            <div className="bg-white rounded-2xl border border-[#EBECEF] p-5 shadow-card space-y-4">
              <h2 className="font-extrabold text-sm text-[#0B1B33] flex items-center gap-2">
                <i className="fa-solid fa-bag-shopping text-[#D9C2A3]"></i>
                <span>Votre panier express ({items.length} article{items.length > 1 ? 's' : ''})</span>
              </h2>

              <div className="divide-y divide-[#EBECEF] max-h-64 overflow-y-auto">
                {items.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={it.image} alt={it.nom} loading="lazy" className="w-10 h-10 rounded-lg object-cover border border-[#EBECEF]" />
                      <div>
                        <p className="font-bold text-[#0B1B33] line-clamp-1">{it.nom}</p>
                        <p className="text-[11px] text-[#46536B]">Quantité : {it.quantite}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#0B1B33] tabular-nums">
                      {(it.prixUnitaire * it.quantite).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EBECEF] text-xs space-y-1.5 text-[#46536B]">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-bold text-[#0B1B33] tabular-nums">{totalAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison garantie 24h</span>
                  <span className="font-bold text-[#0B1B33] tabular-nums">
                    {isFreeShipping ? 'Offerte' : `${shippingFee.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EBECEF] text-sm font-black text-[#0B1B33]">
                  <span>Total à régler au livreur</span>
                  <span className="tabular-nums">{grandTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            {/* Accepted Payments Card */}
            <div className="bg-white rounded-2xl border border-[#EBECEF] p-5 shadow-card space-y-3">
              <span className="text-xs font-bold text-[#0B1B33] flex items-center gap-2">
                <i className="fa-solid fa-money-check-dollar text-[#D9C2A3]"></i>
                <span>Moyens de règlement sur place</span>
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div className="p-2 rounded-lg bg-[#F5F7FA] border border-[#EBECEF] flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-money-bill-wave text-green-600"></i>
                  <span>Espèces</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F5F7FA] border border-[#EBECEF] flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Wave</span>
                </div>
                <div className="p-2 rounded-lg bg-[#F5F7FA] border border-[#EBECEF] flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span>Orange Money</span>
                </div>
              </div>
              <p className="text-[11px] text-[#46536B] pt-1">
                ✓ Colis ouvert et testé avec vous avant encaissement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
