import React, { useState } from 'react';
import { useRouter } from '../router.tsx';

export const ProfessionnelsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [nom, setNom] = useState('');
  const [societe, setSociete] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!nom || !societe || !telephone || !message) {
      setStatus({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, societe, telephone, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
        setNom('');
        setSociete('');
        setTelephone('');
        setMessage('');
      } else {
        setStatus({ type: 'error', message: data.error || 'Erreur lors de l’envoi.' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Erreur réseau. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-3">
        <span className="badge-champagne text-[10px] uppercase tracking-wider">
          Espace B2B • Réveillons &amp; Événements
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B33]">
          Restaurants, Hôtels, Lounges : Devis Décoration en Gros
        </h1>
        <p className="text-xs sm:text-sm text-[#46536B] leading-relaxed">
          Vous organisez un réveillon prestigieux pour vos clients ? Bénéficiez de remises quantitatives immédiates, d'un accompagnement personnalisé et d'une livraison groupée avant le 28 décembre.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-8 shadow-card space-y-5">
        <h2 className="text-base font-extrabold text-[#0B1B33] flex items-center gap-2">
          <i className="fa-solid fa-file-signature text-[#D9C2A3]"></i>
          <span>Demande de devis express B2B</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B1B33]">Nom et Prénom *</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Jean Kouassi"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EBECEF] text-xs text-[#0B1B33] focus:outline-none focus:border-[#0B1B33]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B1B33]">Établissement / Société *</label>
              <input
                type="text"
                required
                value={societe}
                onChange={(e) => setSociete(e.target.value)}
                placeholder="Ex: Hôtel Palm Club Abidjan"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EBECEF] text-xs text-[#0B1B33] focus:outline-none focus:border-[#0B1B33]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B1B33]">Téléphone WhatsApp direct *</label>
            <input
              type="tel"
              required
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+225 07 00 00 00 00"
              className="w-full h-11 px-3.5 rounded-xl border border-[#EBECEF] text-xs text-[#0B1B33] focus:outline-none focus:border-[#0B1B33]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B1B33]">
              Votre projet (nombre de tables, superficie, articles souhaités) *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Nous avons une salle de 150 convives et une terrasse extérieure. Nous souhaitons 20 kits de table et 6 rideaux lumineux 3x3m..."
              className="w-full p-3.5 rounded-xl border border-[#EBECEF] text-xs text-[#0B1B33] focus:outline-none focus:border-[#0B1B33] resize-none"
            />
          </div>

          {status && (
            <div
              className={`p-4 rounded-xl text-xs font-bold ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0B1B33] hover:bg-[#162a4a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane text-xs text-[#D9C2A3]"></i>}
            <span>Transmettre ma demande de devis pro</span>
          </button>
        </form>
      </div>
    </div>
  );
};
