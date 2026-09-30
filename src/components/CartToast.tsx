import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext.tsx';

export const CartToast: React.FC = () => {
  const { lastAddedItem, openCartDrawer } = useCart();
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(lastAddedItem);

  useEffect(() => {
    if (lastAddedItem) {
      setItem(lastAddedItem);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

  return (
    <AnimatePresence>
      {visible && item && (
        <motion.div
          initial={{ opacity: 0, y: -25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-20 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto bg-[#0B1B33] text-white p-3.5 rounded-2xl shadow-2xl border border-[#D9C2A3]/30 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            {item.image ? (
              <img
                src={item.image}
                alt={item.nom}
                className="w-12 h-12 rounded-xl object-cover shrink-0 bg-white/10 border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-bag-shopping text-[#D9C2A3]"></i>
              </div>
            )}

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#25D366]">
                <i className="fa-solid fa-circle-check text-xs"></i>
                <span>Ajouté à votre sélection</span>
              </div>
              <p className="text-xs font-bold text-white truncate">{item.nom}</p>
              <p className="text-[11px] text-[#D9C2A3] tabular-nums font-semibold">
                {item.prixUnitaire.toLocaleString('fr-FR')} FCFA
                {item.quantite > 1 && ` × ${item.quantite}`}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setVisible(false);
                  openCartDrawer();
                }}
                className="px-3 py-1.5 bg-[#D9C2A3] hover:bg-[#c9b293] text-[#0B1B33] text-[11px] font-extrabold rounded-lg transition-colors shadow-xs"
              >
                Voir
              </motion.button>

              <button
                onClick={() => setVisible(false)}
                className="w-6 h-6 rounded-full hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-xs transition-colors"
                aria-label="Fermer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
