import React from 'react';
import { useRouter } from '../router.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const CartPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    totalCount,
    totalAmount,
    freeShippingRemaining,
    freeShippingProgress,
    freeShippingThreshold,
    addItem,
  } = useCart();
  const { produits } = useStore();

  const isFreeShipping = freeShippingRemaining === 0;
  const shippingFee = isFreeShipping || totalAmount === 0 ? 0 : 2000;
  const finalTotal = totalAmount + shippingFee;

  // Find battery pack cross-sell
  const batteryProduct = produits.find((p) => p.slug.includes('piles') || p.id.includes('piles'));

  return (
    <>
      <SEOHead
        title="Ma Sélection de Fête | Éclat Express"
        description="Vérifiez vos articles et packs de réveillon avant validation. Zéro paiement immédiat, règlement sécurisé à la livraison."
      />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EBECEF] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B33]">
              Ma sélection ({totalCount} article{totalCount > 1 ? 's' : ''})
            </h1>
            <p className="text-xs sm:text-sm text-[#46536B] flex items-center gap-1.5 pt-1">
              <i className="fa-solid fa-sparkles text-[#D9C2A3]"></i>
              <span>Livraison express garantie avant le 31 décembre</span>
            </p>
          </div>
          <span className="badge-champagne text-xs flex items-center gap-1">
            <i className="fa-solid fa-check text-[10px]"></i>
            <span>En stock</span>
          </span>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-12 text-center space-y-4 shadow-card">
            <div className="w-16 h-16 rounded-full bg-[#F5F7FA] text-[#46536B] flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B1B33]">Votre sélection est vide</h2>
              <p className="text-xs text-[#46536B]">
                Choisissez un pack ou des guirlandes pour composer votre réveillon féerique.
              </p>
            </div>
            <button
              onClick={() => navigate('/packs')}
              className="btn-primary text-xs"
            >
              Découvrir les packs réveillon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Items & Cross-sells */}
            <div className="lg:col-span-7 space-y-4">
              {/* Free Delivery Progress */}
              <div className="bg-white rounded-xl border border-[#EBECEF] p-4 shadow-card space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0B1B33]">
                  <span className="flex items-center gap-2">
                    <i className={`fa-solid ${isFreeShipping ? 'fa-check text-[#25D366]' : 'fa-truck-fast text-[#0B1B33]'}`}></i>
                    {isFreeShipping ? (
                      <span>Livraison offerte sur votre commande !</span>
                    ) : (
                      <span>
                        Plus que <strong className="underline decoration-[#D9C2A3] decoration-2">{freeShippingRemaining.toLocaleString('fr-FR')} FCFA</strong> pour la livraison offerte !
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums font-black">{freeShippingProgress}%</span>
                </div>

                <div className="w-full bg-[#EBECEF] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isFreeShipping ? 'bg-[#25D366]' : 'bg-[#0B1B33]'
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-[#46536B] tabular-nums">
                  <span>Actuel : {totalAmount.toLocaleString('fr-FR')} FCFA</span>
                  <span>Seuil : {freeShippingThreshold.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variante || 'default'}`}
                    className="bg-white rounded-xl border border-[#EBECEF] p-4 shadow-card flex gap-4 items-center justify-between"
                  >
                    <div className="relative w-20 h-20 rounded-xl bg-[#F5F7FA] overflow-hidden shrink-0 border border-[#EBECEF]">
                      <img
                        src={item.image}
                        alt={item.nom}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      {item.type === 'pack' && (
                        <span className="absolute top-1 left-1 bg-[#0B1B33] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Pack
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-[#0B1B33] leading-snug line-clamp-2">
                          {item.nom}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id, item.type, item.variante)}
                          className="text-[#46536B] hover:text-[#C1121F] p-1 transition-colors"
                          title="Supprimer l'article"
                          aria-label="Supprimer"
                        >
                          <i className="fa-regular fa-trash-can text-sm"></i>
                        </button>
                      </div>

                      {item.variante && (
                        <p className="text-[11px] text-[#46536B] truncate">
                          {item.variante}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#EBECEF] rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.type, item.quantite - 1, item.variante)
                            }
                            className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#0B1B33] hover:bg-[#F5F7FA]"
                            aria-label="Diminuer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#0B1B33] tabular-nums">
                            {item.quantite}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.type, item.quantite + 1, item.variante)
                            }
                            className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#0B1B33] hover:bg-[#F5F7FA]"
                            aria-label="Augmenter"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-black text-[#0B1B33] tabular-nums">
                          {(item.prixUnitaire * item.quantite).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zero Risk Assurance Banner */}
              <div className="bg-[#D9C2A3]/20 border border-[#D9C2A3]/40 rounded-xl p-4 flex items-center gap-3 text-xs text-[#0B1B33]">
                <i className="fa-solid fa-clipboard-check text-xl text-[#0B1B33] shrink-0"></i>
                <p className="leading-snug">
                  <strong>Zéro paiement immédiat</strong> • Vérification et inspection complète du colis au déballage avec le livreur avant de régler.
                </p>
              </div>

              {/* Indispensable cross-sell */}
              {batteryProduct && !items.some((i) => i.id === batteryProduct.id) && (
                <div className="bg-white rounded-xl border border-[#EBECEF] p-4 shadow-card flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={batteryProduct.images[0]}
                      alt={batteryProduct.nom}
                      loading="lazy"
                      className="w-12 h-12 rounded-lg object-cover border border-[#EBECEF]"
                    />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D9C2A3]">
                        Indispensable réveillon
                      </span>
                      <p className="font-bold text-xs text-[#0B1B33] line-clamp-1">{batteryProduct.nom}</p>
                      <p className="text-xs font-bold text-[#0B1B33] tabular-nums">
                        +{batteryProduct.prix.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      addItem({
                        type: 'produit',
                        id: batteryProduct.id,
                        slug: batteryProduct.slug,
                        nom: batteryProduct.nom,
                        prixUnitaire: batteryProduct.prix,
                        image: batteryProduct.images[0],
                      })
                    }
                    className="h-9 px-4 bg-[#D9C2A3]/40 hover:bg-[#D9C2A3]/60 text-[#0B1B33] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span>Ajouter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Pricing Breakdown & Checkout CTA */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-4">
                <h2 className="text-base font-extrabold text-[#0B1B33] border-b border-[#EBECEF] pb-3">
                  Récapitulatif de votre commande
                </h2>

                <div className="space-y-2 text-xs sm:text-sm text-[#46536B]">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="font-bold text-[#0B1B33] tabular-nums">
                      {totalAmount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>Frais de livraison</span>
                      {isFreeShipping && (
                        <span className="badge-champagne text-[10px] py-0 px-1.5">Offerte</span>
                      )}
                    </div>
                    <span className="font-bold text-[#0B1B33] tabular-nums">
                      {isFreeShipping ? '0 FCFA' : `${shippingFee.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EBECEF] flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-black text-[#0B1B33]">Total à régler</span>
                    <p className="text-[11px] text-[#46536B]">TVA &amp; emballage festif inclus</p>
                  </div>
                  <span className="text-2xl font-black text-[#0B1B33] tabular-nums">
                    {finalTotal.toLocaleString('fr-FR')} <span className="text-xs font-semibold">FCFA</span>
                  </span>
                </div>

                <button
                  onClick={() => navigate('/commande')}
                  className="w-full h-13 bg-[#0B1B33] hover:bg-[#162a4a] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Passer à la commande ({finalTotal.toLocaleString('fr-FR')} FCFA)</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>

                <p className="text-[11px] text-[#46536B] text-center flex items-center justify-center gap-1.5 pt-1">
                  <i className="fa-solid fa-bolt text-[#D9C2A3]"></i>
                  <span>Validation ultra-rapide en 30s • Aucun compte requis</span>
                </p>
              </div>

              {/* 3 Trust points */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[#46536B]">
                <div className="bg-white p-3 rounded-xl border border-[#EBECEF]">
                  <i className="fa-solid fa-money-bill-transfer text-[#0B1B33] text-sm mb-1 block"></i>
                  <span>Espèces ou Wave</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#EBECEF]">
                  <i className="fa-solid fa-truck text-[#0B1B33] text-sm mb-1 block"></i>
                  <span>Livraison 24h-48h</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#EBECEF]">
                  <i className="fa-solid fa-rotate-left text-[#0B1B33] text-sm mb-1 block"></i>
                  <span>Garantie 14j</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
