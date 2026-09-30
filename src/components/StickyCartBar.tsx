import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../router.tsx';
import { useCart } from '../context/CartContext.tsx';

export const StickyCartBar: React.FC = () => {
  const { path, navigate } = useRouter();
  const { totalCount, totalAmount } = useCart();

  const isVisible =
    totalCount > 0 &&
    path !== '/ma-selection' &&
    !path.startsWith('/commande');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1B33] text-white px-4 py-2.5 shadow-2xl border-t border-white/10 md:hidden"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#D9C2A3] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-ping"></span>
                Sélection validée ({totalCount})
              </span>
              <span className="text-base sm:text-lg font-black tracking-tight tabular-nums">
                {totalAmount.toLocaleString('fr-FR')}{' '}
                <span className="text-xs font-normal text-white/70">FCFA</span>
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/ma-selection')}
              className="h-10 sm:h-11 px-5 bg-white text-[#0B1B33] hover:bg-[#F5F7FA] font-extrabold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <span>Commander</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
