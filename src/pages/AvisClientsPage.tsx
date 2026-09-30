import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { useRouter } from '../router.tsx';

export const AvisClientsPage: React.FC = () => {
  const { avis } = useStore();
  const { navigate } = useRouter();

  const validatedAvis = avis.filter((a) => a.valide);

  // Hidden / Redirect if no validated reviews exist
  if (validatedAvis.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-xs text-[#46536B]">Aucun avis vérifié pour le moment.</p>
        <button onClick={() => navigate('/')} className="btn-primary text-xs">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const avgNote = (
    validatedAvis.reduce((acc, a) => acc + a.note, 0) / validatedAvis.length
  ).toFixed(1);

  return (
    <>
      <SEOHead
        title="Avis Clients Vérifiés | Éclat Express"
        description="Consultez les retours d'expérience et témoignages de nos clients ayant décoré leur réveillon du 31 décembre avec Éclat Express."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 sm:p-10 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="badge-champagne text-xs uppercase tracking-wider">
              100% Retours Vérifiés
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0B1B33]">
              Salons de nos Clients &amp; Avis
            </h1>
            <p className="text-xs sm:text-sm text-[#46536B] max-w-lg">
              Photos et témoignages authentiques collectés après remise en mains propres lors des précédents réveillons.
            </p>
          </div>

          <div className="bg-[#F5F7FA] border border-[#EBECEF] rounded-2xl p-6 text-center min-w-[220px]">
            <p className="text-4xl sm:text-5xl font-black text-[#0B1B33] tabular-nums">{avgNote}</p>
            <div className="flex items-center justify-center gap-1 text-[#D9C2A3] text-sm my-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p className="text-xs font-bold text-[#46536B]">{validatedAvis.length} avis clients certifiés</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validatedAvis.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D9C2A3] text-xs">
                    {Array.from({ length: item.note }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-full">
                    Avis certifié
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#0B1B33] italic leading-relaxed">
                  "{item.texte}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#EBECEF] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0B1B33] text-white flex items-center justify-center font-bold text-xs">
                    {item.auteur.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#0B1B33]">{item.auteur}</p>
                    {item.ville && <p className="text-[10px] text-[#46536B]">{item.ville}</p>}
                  </div>
                </div>
                {item.date && <span className="text-[10px] text-[#46536B]">{item.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
