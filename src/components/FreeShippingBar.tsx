import React from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext.tsx';
import { useStore } from '../context/StoreContext.tsx';

export const FreeShippingBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { totalAmount, freeShippingRemaining, freeShippingProgress, freeShippingThreshold } = useCart();
  const { config } = useStore();

  const isFree = freeShippingRemaining === 0;

  return (
    <div className="bg-white rounded-xl border border-[#EBECEF] p-4 shadow-card space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0B1B33]">
          <motion.div
            key={isFree ? 'free' : 'not-free'}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-7 h-7 rounded-full bg-[#EBECEF] text-[#0B1B33] flex items-center justify-center shrink-0"
          >
            <i className={`fa-solid ${isFree ? 'fa-circle-check text-[#25D366]' : 'fa-truck-fast text-[#0B1B33]'}`}></i>
          </motion.div>
          <span>
            {isFree ? (
              <strong className="text-[#0B1B33]">Félicitations ! Vous bénéficiez de la livraison offerte !</strong>
            ) : (
              <>
                Plus que <strong className="text-[#0B1B33] underline decoration-[#D9C2A3] decoration-2">{freeShippingRemaining.toLocaleString('fr-FR')} FCFA</strong> pour la livraison offerte !
              </>
            )}
          </span>
        </div>
        <span className="text-xs font-black text-[#0B1B33] tabular-nums shrink-0">
          {freeShippingProgress}%
        </span>
      </div>

      {/* Progress track with smooth motion bar */}
      <div className="w-full bg-[#EBECEF] h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${freeShippingProgress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isFree ? 'bg-[#25D366]' : 'bg-[#0B1B33]'
          }`}
        />
      </div>

      {!compact && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#46536B] pt-0.5 gap-1">
          <span>
            Actuel : <strong className="text-[#0B1B33] tabular-nums">{totalAmount.toLocaleString('fr-FR')} FCFA</strong> • Seuil : <strong className="text-[#0B1B33] tabular-nums">{freeShippingThreshold.toLocaleString('fr-FR')} FCFA</strong>
          </span>
          <span className="text-[10px] text-[#46536B]">
            {config.zones || 'Abidjan, Dakar, Cotonou et Lomé avec remise en mains propres.'}
          </span>
        </div>
      )}
    </div>
  );
};
