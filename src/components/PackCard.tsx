import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pack } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useRouter } from '../router.tsx';

export const PackCard: React.FC<{ pack: Pack; featured?: boolean }> = ({ pack, featured = false }) => {
  const { addItem } = useCart();
  const { navigate } = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      type: 'pack',
      id: pack.id,
      slug: pack.slug,
      nom: pack.nom,
      prixUnitaire: pack.prix,
      image: pack.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const discountPercent =
    pack.prixBarre && pack.prixBarre > pack.prix
      ? Math.round(((pack.prixBarre - pack.prix) / pack.prixBarre) * 100)
      : null;

  const totalPieces = pack.produits.reduce((acc, p) => acc + p.quantite, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => navigate(`/produit/${pack.slug}`)}
      className="bg-white rounded-xl border border-[#EBECEF] shadow-card hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Pack Image with pieces & badges */}
        <div className="relative aspect-4/3 w-full bg-[#EBECEF]/40 overflow-hidden">
          <img
            src={pack.image}
            alt={pack.nom}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent && (
              <span className="badge-urgence text-[11px]">
                PROMO -{discountPercent}%
              </span>
            )}
            {pack.badge && pack.badge !== 'promo' && (
              <span className="badge-champagne text-[11px] capitalize">
                {pack.badge === 'best-seller' ? 'Best-seller' : pack.badge}
              </span>
            )}
          </div>

          {/* Pieces indicator badge */}
          <div className="absolute bottom-2 right-2 bg-[#0B1B33]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 shadow-xs">
            <i className="fa-solid fa-boxes-stacked text-[#D9C2A3]"></i>
            <span>{totalPieces} pièces incluses</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#46536B]">
            <span className="text-[#25D366] font-bold flex items-center gap-1">
              <i className="fa-solid fa-bolt"></i>
              Prêt à poser
            </span>
            <span>•</span>
            <span>Pose en 20 min chrono</span>
          </div>

          <h3 className="font-extrabold text-base text-[#0B1B33] leading-snug group-hover:text-[#46536B] transition-colors">
            {pack.nom}
          </h3>

          <p className="text-xs text-[#46536B] line-clamp-2 leading-relaxed">
            {pack.description}
          </p>

          {/* Included pieces list preview */}
          <div className="pt-2 border-t border-[#EBECEF]/60 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-[#46536B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#EBECEF]">
              Guirlandes + Piles
            </span>
            <span className="text-[10px] text-[#46536B] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#EBECEF]">
              Fixations incluses
            </span>
            <span className="text-[10px] text-[#25D366] font-bold bg-[#25D366]/10 px-2 py-0.5 rounded">
              Zéro outil requis
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add Button */}
      <div className="p-4 pt-0 space-y-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-[#0B1B33] tabular-nums">
            {pack.prix.toLocaleString('fr-FR')} <span className="text-xs font-semibold">FCFA</span>
          </span>
          {pack.prixBarre && pack.prixBarre > pack.prix && (
            <span className="text-xs text-[#46536B] line-through tabular-nums">
              {pack.prixBarre.toLocaleString('fr-FR')} FCFA
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate(`/produit/${pack.slug}`)}
            className="h-11 rounded-xl font-bold text-xs bg-[#F5F7FA] text-[#0B1B33] hover:bg-[#EBECEF] border border-[#EBECEF] flex items-center justify-center transition-colors"
          >
            Détails pack
          </button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
              justAdded
                ? 'bg-[#25D366] text-white'
                : 'bg-[#0B1B33] text-white hover:bg-[#162a4a]'
            }`}
          >
            {justAdded ? (
              <>
                <i className="fa-solid fa-check text-xs"></i>
                <span>Ajouté !</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-cart-plus text-xs"></i>
                <span>Prendre le pack</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
