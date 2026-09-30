import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../router.tsx';
import { useCart } from '../context/CartContext.tsx';

export const CartDrawer: React.FC = () => {
  const { navigate } = useRouter();
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateQuantity,
    totalCount,
    totalAmount,
    freeShippingRemaining,
    freeShippingProgress,
  } = useCart();

  const isFreeShipping = freeShippingRemaining === 0;
  const shippingFee = isFreeShipping || totalAmount === 0 ? 0 : 2000;
  const grandTotal = totalAmount + shippingFee;

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/commande');
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate('/ma-selection');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0B1B33]/60 backdrop-blur-xs"
            onClick={closeCartDrawer}
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EBECEF] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0B1B33] text-white flex items-center justify-center text-sm shadow-xs">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0B1B33]">Ma sélection</h2>
                  <p className="text-[11px] text-[#46536B]">
                    {totalCount} article{totalCount > 1 ? 's' : ''} • Réservé pour vous
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCartDrawer}
                className="w-8 h-8 rounded-full bg-[#F5F7FA] text-[#46536B] hover:text-[#0B1B33] flex items-center justify-center transition-colors"
                aria-label="Fermer le tiroir"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </motion.button>
            </div>

            {/* Free shipping banner inside drawer */}
            <div className="px-5 py-3 bg-[#F5F7FA] border-b border-[#EBECEF] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#0B1B33]">
                <span>
                  {isFreeShipping ? (
                    <span className="text-[#25D366] flex items-center gap-1">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Livraison express offerte !</span>
                    </span>
                  ) : (
                    <span>Plus que {freeShippingRemaining.toLocaleString('fr-FR')} F pour le port offert</span>
                  )}
                </span>
                <span className="tabular-nums font-black">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-[#EBECEF] h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    isFreeShipping ? 'bg-[#25D366]' : 'bg-[#0B1B33]'
                  }`}
                />
              </div>
            </div>

            {/* Scrollable list of items */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EBECEF]">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <i className="fa-solid fa-bag-shopping text-3xl text-[#C7CCD1]"></i>
                  <p className="text-xs text-[#46536B]">Votre panier est vide.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeCartDrawer();
                      navigate('/packs');
                    }}
                    className="h-10 px-5 bg-[#0B1B33] text-white text-xs font-bold rounded-xl"
                  >
                    Découvrir les packs
                  </motion.button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={`${item.id}-${item.variante || 'def'}`}
                    className="py-3.5 flex gap-3 items-start justify-between"
                  >
                    <img
                      src={item.image}
                      alt={item.nom}
                      className="w-14 h-14 rounded-lg object-cover border border-[#EBECEF] shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-bold text-xs text-[#0B1B33] line-clamp-2 leading-snug">
                          {item.nom}
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id, item.type, item.variante)}
                          className="text-[#46536B] hover:text-[#C1121F] p-1 text-xs"
                          aria-label="Supprimer"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </motion.button>
                      </div>
                      {item.variante && (
                        <p className="text-[10px] text-[#46536B] truncate">{item.variante}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-[#EBECEF] rounded-md bg-white">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => updateQuantity(item.id, item.type, item.quantite - 1, item.variante)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#0B1B33]"
                          >
                            -
                          </motion.button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums">
                            {item.quantite}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => updateQuantity(item.id, item.type, item.quantite + 1, item.variante)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#0B1B33]"
                          >
                            +
                          </motion.button>
                        </div>

                        <span className="font-extrabold text-xs text-[#0B1B33] tabular-nums">
                          {(item.prixUnitaire * item.quantite).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#EBECEF] bg-[#F5F7FA] space-y-3">
                <div className="space-y-1.5 text-xs text-[#46536B]">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="font-bold text-[#0B1B33] tabular-nums">
                      {totalAmount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison express</span>
                    <span className="font-bold text-[#0B1B33] tabular-nums">
                      {isFreeShipping ? 'Offerte' : `${shippingFee.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#EBECEF] flex justify-between text-sm font-black text-[#0B1B33]">
                    <span>Total à régler au livreur</span>
                    <span className="tabular-nums">{grandTotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full h-12 bg-[#0B1B33] hover:bg-[#162a4a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Commander sans avance ({grandTotal.toLocaleString('fr-FR')} FCFA)</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </motion.button>

                <button
                  onClick={handleViewCart}
                  className="w-full text-center text-xs font-bold text-[#46536B] hover:text-[#0B1B33] hover:underline"
                >
                  Voir la page récapitulative complète
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
