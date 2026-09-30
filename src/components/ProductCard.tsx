import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Produit } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useRouter } from '../router.tsx';
import { useStore } from '../context/StoreContext.tsx';

export const ProductCard: React.FC<{ produit: Produit }> = ({ produit }) => {
  const { addItem } = useCart();
  const { navigate } = useRouter();
  const { avis } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  // Compute actual verified reviews for this product
  const productAvis = avis.filter((a) => a.produitId === produit.id || a.produitId === produit.slug);
  const reviewCount = productAvis.length;
  const avgRating = reviewCount > 0
    ? (productAvis.reduce((acc, a) => acc + a.note, 0) / reviewCount).toFixed(1)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      type: 'produit',
      id: produit.id,
      slug: produit.slug,
      nom: produit.nom,
      prixUnitaire: produit.prix,
      image: produit.images[0] || '',
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const discountPercent =
    produit.prixBarre && produit.prixBarre > produit.prix
      ? Math.round(((produit.prixBarre - produit.prix) / produit.prixBarre) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => navigate(`/produit/${produit.slug}`)}
      className="bg-white rounded-xl border border-[#EBECEF] shadow-card hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 w-full bg-[#EBECEF]/40 overflow-hidden">
          <img
            src={produit.images[0]}
            alt={produit.nom}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent && (
              <span className="badge-urgence text-[11px]">
                -{discountPercent}%
              </span>
            )}
            {produit.badge && produit.badge !== 'promo' && (
              <span className="badge-champagne text-[11px] capitalize">
                {produit.badge === 'best-seller' ? 'Best-seller' : produit.badge}
              </span>
            )}
          </div>

          {/* Stock urgency if real stock is low (< 10) */}
          {produit.stock > 0 && produit.stock < 10 && (
            <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold text-[#C1121F] flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F] animate-pulse"></span>
              <span>Plus que {produit.stock} en stock !</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 space-y-1.5">
          {/* Reviews: strictly shown ONLY if real validated reviews exist */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-[#D9C2A3]">
              <i className="fa-solid fa-star text-[11px]"></i>
              <span className="font-bold text-[#0B1B33]">{avgRating}</span>
              <span className="text-[#46536B] text-[11px]">({reviewCount})</span>
            </div>
          )}

          <h3 className="font-bold text-sm text-[#0B1B33] leading-snug line-clamp-2 group-hover:text-[#46536B] transition-colors">
            {produit.nom}
          </h3>

          <p className="text-xs text-[#46536B] line-clamp-1">
            {produit.descriptionCourte}
          </p>
        </div>
      </div>

      {/* Pricing & Add Button */}
      <div className="p-3.5 pt-0 space-y-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-[#0B1B33] tabular-nums">
            {produit.prix.toLocaleString('fr-FR')} <span className="text-xs font-semibold">FCFA</span>
          </span>
          {produit.prixBarre && produit.prixBarre > produit.prix && (
            <span className="text-xs text-[#46536B] line-through tabular-nums">
              {produit.prixBarre.toLocaleString('fr-FR')} FCFA
            </span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          disabled={produit.stock <= 0}
          className={`w-full h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
            produit.stock <= 0
              ? 'bg-[#EBECEF] text-[#46536B] cursor-not-allowed'
              : justAdded
              ? 'bg-[#25D366] text-white'
              : 'bg-[#0B1B33] text-white hover:bg-[#162a4a]'
          }`}
        >
          {produit.stock <= 0 ? (
            <span>Épuisé</span>
          ) : justAdded ? (
            <>
              <i className="fa-solid fa-check"></i>
              <span>Ajouté !</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-bag-shopping text-xs"></i>
              <span>Ajouter</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
