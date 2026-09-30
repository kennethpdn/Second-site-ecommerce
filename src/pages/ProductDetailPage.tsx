import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from '../router.tsx';
import { useStore } from '../context/StoreContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const ProductDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { goBack, navigate } = useRouter();
  const { getProductBySlug, getPackBySlug, produits, avis, config } = useStore();
  const { addItem } = useCart();

  // The item can be either a Pack or a Product
  const pack = getPackBySlug(slug);
  const product = !pack ? getProductBySlug(slug) : undefined;
  const item = pack || product;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedNuance, setSelectedNuance] = useState<string>('Blanc Chaud 3000K Féerique');
  const [selectedSize, setSelectedSize] = useState<'standard' | 'grand'>('standard');
  const [justAdded, setJustAdded] = useState(false);

  // Accordions state
  const [openDetails, setOpenDetails] = useState(true);
  const [openShipping, setOpenShipping] = useState(false);
  const [openReviews, setOpenReviews] = useState(true);

  if (!item) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#EBECEF] text-[#46536B] flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-lg font-bold text-[#0B1B33]">Article introuvable</h2>
        <p className="text-xs text-[#46536B]">
          Ce produit n'est plus actif ou l'adresse est incorrecte.
        </p>
        <button
          onClick={() => navigate('/boutique')}
          className="btn-primary text-xs w-full"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  const isPack = !!pack;
  const images: string[] = (item as any).images || [(item as any).image];
  const currentImage = images[activeImageIndex] || images[0];

  // Base price calculation (adjust for grand size if pack)
  let unitPrice = item.prix;
  if (isPack && selectedSize === 'grand') {
    unitPrice = Math.round(item.prix * 1.37); // +13 000 FCFA for villa format
  }

  const calculatedTotal = unitPrice * quantity;

  // Real verified reviews for this product
  const itemAvis = avis.filter((a) => a.produitId === item.id || a.produitId === item.slug);
  const reviewCount = itemAvis.length;
  const avgRating = reviewCount > 0
    ? (itemAvis.reduce((acc, a) => acc + a.note, 0) / reviewCount).toFixed(1)
    : null;

  // Cross-sells / Frequently bought together
  const crossSells = produits.filter((p) => p.id !== item.id && p.slug !== item.slug).slice(0, 4);

  const handleAddToCart = () => {
    addItem(
      {
        type: isPack ? 'pack' : 'produit',
        id: item.id,
        slug: item.slug,
        nom: `${item.nom}${isPack && selectedSize === 'grand' ? ' (Grand Format Villa)' : ''}`,
        prixUnitaire: unitPrice,
        image: currentImage,
        variante: selectedNuance,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWhatsAppOrder = () => {
    const phone = config.numeroWhatsApp || '2250700000000';
    const message = `Bonjour Éclat Express ! Je souhaite réserver :\n- Article : ${item.nom}\n- Quantité : ${quantity}\n- Option : ${selectedNuance}\n- Montant : ${calculatedTotal.toLocaleString('fr-FR')} FCFA\n\nMerci de confirmer la disponibilité pour livraison express !`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const discountPercent =
    item.prixBarre && item.prixBarre > item.prix
      ? Math.round(((item.prixBarre - item.prix) / item.prixBarre) * 100)
      : null;

  return (
    <>
      <SEOHead
        title={`${item.nom} | Éclat Express`}
        description={
          (item as any).descriptionCourte ||
          (item as any).description ||
          'Décoration féerique pour le 31 décembre livrée en 24h-48h.'
        }
        image={currentImage}
        canonicalPath={`/produit/${item.slug}`}
        type="product"
        product={{
          price: unitPrice,
          currency: 'XOF',
          availability: (item as any).stock > 0 ? 'instock' : 'outofstock',
          category: (item as any).categorieSlug || (isPack ? 'packs' : 'decorations'),
          brand: 'Éclat Express',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
        {/* Top Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex items-center justify-between text-xs text-[#46536B]">
          <button
            onClick={goBack}
            className="flex items-center gap-2 font-bold hover:text-[#0B1B33] transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>{isPack ? 'Retour aux packs' : 'Retour à la boutique'}</span>
          </button>
          <span className="text-[11px] text-[#46536B]">Saint-Sylvestre 2027</span>
        </nav>

        {/* Real 12-Column Responsive Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =================================================================
              LEFT COLUMN: Photo Gallery & Accordions (7 Columns on desktop)
          ================================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image Gallery */}
            <div className="bg-white rounded-2xl border border-[#EBECEF] p-4 shadow-card space-y-3">
              <div className="relative aspect-4/3 w-full bg-[#EBECEF]/40 rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt={`Photo de ${item.nom}`}
                    initial={{ opacity: 0.65 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.65 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {discountPercent && (
                    <span className="badge-urgence text-xs">
                      PROMO -{discountPercent}%
                    </span>
                  )}
                  {item.badge && item.badge !== 'promo' && (
                    <span className="badge-champagne text-xs">
                      <i className="fa-solid fa-sparkles text-[10px] mr-1"></i>
                      {item.badge === 'best-seller' ? 'Best-seller du 31' : item.badge}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-[#0B1B33]/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  <i className="fa-solid fa-camera mr-1 text-[10px]"></i>
                  {activeImageIndex + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#0B1B33] shadow-xs scale-95'
                          : 'border-[#EBECEF] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${item.nom} miniature ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pack Components Inventory (If Pack) */}
            {isPack && (
              <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-4">
                <div>
                  <p className="font-signature text-xl text-[#0B1B33]">Tout ce qu'il vous faut dans 1 seul carton</p>
                  <h2 className="text-xl font-extrabold text-[#0B1B33]">L'inventaire complet du pack</h2>
                </div>

                <div className="divide-y divide-[#EBECEF]">
                  {(item as any).produits?.map((comp: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] text-[#0B1B33] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-[#0B1B33]">{comp.nom}</h3>
                          <p className="text-xs text-[#46536B]">{comp.description}</p>
                        </div>
                      </div>
                      <span className="bg-[#F5F7FA] border border-[#EBECEF] text-[#0B1B33] font-bold text-xs px-2.5 py-1 rounded-md shrink-0">
                        {comp.quantite}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accordions (Details, Shipping, Verified Reviews) */}
            <div className="space-y-3">
              {/* Accordion 1: Details */}
              <div className="bg-white rounded-xl border border-[#EBECEF] overflow-hidden shadow-card">
                <button
                  onClick={() => setOpenDetails(!openDetails)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm text-[#0B1B33]"
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-[#D9C2A3]"></i>
                    <span>Détails &amp; Caractéristiques techniques</span>
                  </span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform ${openDetails ? 'rotate-180' : ''}`}></i>
                </button>
                <AnimatePresence initial={false}>
                  {openDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-[#EBECEF] text-xs text-[#46536B] space-y-2">
                        <p className="leading-relaxed whitespace-pre-line">
                          {(item as any).descriptionLongue || (item as any).description}
                        </p>
                        {(item as any).caracteristiques && (
                          <ul className="space-y-1.5 pt-2">
                            {(item as any).caracteristiques.map((c: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-[#0B1B33]">
                                <i className="fa-solid fa-check text-[#25D366] text-xs"></i>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Shipping */}
              <div className="bg-white rounded-xl border border-[#EBECEF] overflow-hidden shadow-card">
                <button
                  onClick={() => setOpenShipping(!openShipping)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm text-[#0B1B33]"
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-truck-fast text-[#D9C2A3]"></i>
                    <span>Livraison Express, Délais &amp; Retours</span>
                  </span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform ${openShipping ? 'rotate-180' : ''}`}></i>
                </button>
                <AnimatePresence initial={false}>
                  {openShipping && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-[#EBECEF] text-xs text-[#46536B] space-y-2 leading-relaxed">
                        <p>
                          <strong>Délai garanti avant le 31 :</strong> {config.delaiLivraison || '24h à 48h'}.
                        </p>
                        <p>
                          <strong>Zones desservies :</strong> {config.zones || 'Abidjan, Dakar, Cotonou et Lomé'}.
                        </p>
                        <p>
                          <strong>Garantie Sérénité :</strong> {config.retours || '14 jours satisfait ou remboursé'}.
                        </p>
                        <p>
                          <strong>Paiement à réception :</strong> {config.modePaiement || 'Espèces ou Mobile Money à la livraison'}.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 3: Verified Reviews (strictly hidden if empty) */}
              {reviewCount > 0 && (
                <div className="bg-white rounded-xl border border-[#EBECEF] overflow-hidden shadow-card">
                  <button
                    onClick={() => setOpenReviews(!openReviews)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm text-[#0B1B33]"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-star text-[#D9C2A3]"></i>
                      <span>Avis clients vérifiés ({reviewCount})</span>
                    </span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform ${openReviews ? 'rotate-180' : ''}`}></i>
                  </button>
                  <AnimatePresence initial={false}>
                    {openReviews && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-[#EBECEF] divide-y divide-[#EBECEF]">
                          {itemAvis.map((a) => (
                            <div key={a.id} className="py-3 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[#D9C2A3]">
                                  {Array.from({ length: a.note }).map((_, i) => (
                                    <i key={i} className="fa-solid fa-star text-[10px]"></i>
                                  ))}
                                </div>
                                <span className="text-[10px] text-[#46536B]">{a.date}</span>
                              </div>
                              <p className="text-[#0B1B33] italic">"{a.texte}"</p>
                              <p className="font-bold text-[11px] text-[#46536B]">
                                {a.auteur} {a.ville && `— ${a.ville}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================
              RIGHT COLUMN: Sticky Purchasing Panel (5 Columns on desktop)
          ================================================================== */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-5">
              <div className="space-y-2">
                {isPack && (
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D9C2A3] block">
                    Pack prêt-à-célébrer
                  </span>
                )}

                <h1 className="text-2xl font-black text-[#0B1B33] leading-snug">
                  {item.nom}
                </h1>

                <p className="text-xs sm:text-sm text-[#46536B] leading-relaxed">
                  {isPack ? (item as any).description : (item as any).descriptionCourte}
                </p>

                {reviewCount > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <div className="flex items-center text-[#D9C2A3]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-[11px]"></i>
                      ))}
                    </div>
                    <span className="font-bold text-[#0B1B33]">{avgRating}/5</span>
                    <span className="text-[#46536B]">({reviewCount} avis vérifiés)</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="pt-3 border-t border-[#EBECEF] space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#0B1B33] tabular-nums">
                    {unitPrice.toLocaleString('fr-FR')} <span className="text-sm font-semibold">FCFA</span>
                  </span>
                  {item.prixBarre && item.prixBarre > item.prix && (
                    <span className="text-sm text-[#46536B] line-through tabular-nums">
                      {(isPack && selectedSize === 'grand'
                        ? Math.round(item.prixBarre * 1.35)
                        : item.prixBarre
                      ).toLocaleString('fr-FR')}{' '}
                      FCFA
                    </span>
                  )}
                  {discountPercent && (
                    <span className="badge-urgence text-xs">
                      -{discountPercent}% ÉCONOMISÉS
                    </span>
                  )}
                </div>

                {item.stock !== undefined && item.stock < 10 && (
                  <div className="bg-[#C1121F]/10 border border-[#C1121F]/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#C1121F] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#C1121F] animate-ping shrink-0"></span>
                    <span>
                      Plus que {item.stock} {isPack ? 'kits disponibles' : 'articles'} en stock avant le 31 !
                    </span>
                  </div>
                )}
              </div>

              {/* Pack Size Option */}
              {isPack && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B1B33] flex justify-between">
                    <span>1. Format de pièce</span>
                    <span className="text-[10px] text-[#46536B]">
                      {selectedSize === 'standard' ? 'Standard (15-25 m²)' : 'Grand Format Villa (>25 m²)'}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSize('standard')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        selectedSize === 'standard'
                          ? 'border-[#0B1B33] bg-[#0B1B33]/5 ring-1 ring-[#0B1B33] font-bold'
                          : 'border-[#EBECEF] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <p className="font-bold text-[#0B1B33]">Standard</p>
                      <p className="text-[10px] text-[#46536B]">{item.prix.toLocaleString('fr-FR')} F</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSize('grand')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        selectedSize === 'grand'
                          ? 'border-[#0B1B33] bg-[#0B1B33]/5 ring-1 ring-[#0B1B33] font-bold'
                          : 'border-[#EBECEF] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <p className="font-bold text-[#0B1B33]">Grand Villa</p>
                      <p className="text-[10px] text-[#46536B]">{Math.round(item.prix * 1.37).toLocaleString('fr-FR')} F</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Nuance selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B1B33]">
                  {isPack ? '2. Nuance lumineuse' : 'Nuance lumineuse :'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Blanc Chaud 3000K Féerique', dot: 'bg-[#D9C2A3]' },
                    { id: 'Blanc Pur 4000K Cristal', dot: 'bg-blue-200' },
                  ].map((nuance) => (
                    <button
                      key={nuance.id}
                      type="button"
                      onClick={() => setSelectedNuance(nuance.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        selectedNuance === nuance.id
                          ? 'bg-[#0B1B33] text-white border-[#0B1B33] shadow-xs'
                          : 'bg-[#F5F7FA] text-[#0B1B33] border-[#EBECEF]'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${nuance.dot} border border-white shrink-0`}></span>
                      <span className="truncate">{nuance.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTAs */}
              <div className="space-y-3 pt-4 border-t border-[#EBECEF]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1B33]">Quantité :</span>
                  <div className="flex items-center border border-[#EBECEF] rounded-xl bg-white overflow-hidden shadow-xs">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center font-bold text-[#0B1B33] hover:bg-[#F5F7FA]"
                    >
                      -
                    </motion.button>
                    <span className="w-9 text-center text-xs font-bold text-[#0B1B33] tabular-nums">
                      {quantity}
                    </span>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-9 h-9 flex items-center justify-center font-bold text-[#0B1B33] hover:bg-[#F5F7FA]"
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Primary WhatsApp order button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppOrder}
                  className="w-full h-13 bg-[#25D366] hover:bg-[#1fb355] text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center shadow-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Commander sur WhatsApp ({calculatedTotal.toLocaleString('fr-FR')} FCFA)</span>
                  </div>
                  <span className="text-[10px] text-white/90 font-medium">
                    Réponse immédiate • Blocage de réservation en 1 min
                  </span>
                </motion.button>

                {/* Add to selection button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className={`w-full h-12 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs ${
                    justAdded
                      ? 'bg-[#25D366] text-white'
                      : 'bg-[#0B1B33] text-white hover:bg-[#162a4a]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>Ajouté à ma sélection !</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-bag-shopping"></i>
                      <span>Ajouter à ma sélection de fête</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Zero Risk Assurance */}
              <div className="bg-[#D9C2A3]/20 border border-[#D9C2A3]/50 rounded-xl p-4 space-y-1.5 text-xs text-[#0B1B33]">
                <div className="flex items-center gap-2 font-bold">
                  <i className="fa-solid fa-shield-check text-[#0B1B33]"></i>
                  <span>Zéro Paiement d'Avance • Test au Déballage</span>
                </div>
                <p className="text-[11px] text-[#46536B] leading-relaxed">
                  Réglez en cash ou Mobile Money (Wave, Orange Money) après inspection de vos articles avec le livreur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-Sells Section */}
        {crossSells.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#EBECEF]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0B1B33]">
                Fréquemment achetés ensemble
              </h2>
              <span className="text-xs text-[#46536B]">Complétez votre fête</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {crossSells.map((p) => (
                <ProductCard key={p.id} produit={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
