/**
 * Helper to dynamically update document head metadata based on the active route:
 * - document.title
 * - meta description
 * - canonical link (<link rel="canonical">)
 * - Open Graph tags (og:title, og:description, og:url, og:image, og:type, og:site_name, og:locale)
 * - Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
 * - Product rich metadata (product:price:amount, product:price:currency, product:availability, product:brand)
 * - Schema.org JSON-LD Structured Data
 */

import { useEffect } from 'react';

export interface ProductMetadataOptions {
  price?: number;
  currency?: string;
  availability?: 'instock' | 'outofstock';
  category?: string;
  brand?: string;
}

export interface MetadataOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'product';
  product?: ProductMetadataOptions;
  noindex?: boolean;
}

export interface ProductDetailMetadataInput {
  id?: string;
  slug: string;
  nom: string;
  descriptionCourte?: string;
  descriptionLongue?: string;
  description?: string;
  image?: string;
  images?: string[];
  prix: number;
  prixBarre?: number;
  stock?: number;
  categorieSlug?: string;
  isPack?: boolean;
}

export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&q=80';
export const SITE_NAME = 'Éclat Express';

/**
 * Route-to-metadata dictionary for static routes.
 */
export const ROUTE_METADATA_MAP: Record<string, MetadataOptions> = {
  '/': {
    title: 'Éclat Express | Décorations Réveillon 31 Décembre',
    description:
      'Boutique en ligne festive pour le réveillon du 31 décembre : packs prêts à poser, guirlandes et bougies LED avec livraison express 24h-48h.',
    canonicalPath: '/',
    type: 'website',
  },
  '/packs': {
    title: 'Packs Réveillon Prêts à Poser | Éclat Express',
    description:
      'Découvrez nos 4 packs coordonnés prêts à poser en 20 minutes pour le 31 décembre : salon complet, table 6 personnes, façade et compte à rebours.',
    canonicalPath: '/packs',
    type: 'website',
  },
  '/boutique': {
    title: 'La Boutique de Fête Réveillon | Éclat Express',
    description:
      'Catalogue complet de décorations pour le 31 décembre : guirlandes lumineuses, rideaux cascade, bougies LED et chiffres géants 2027.',
    canonicalPath: '/boutique',
    type: 'website',
  },
  '/promos': {
    title: 'Promotions & Offres Spéciales Réveillon | Éclat Express',
    description:
      'Profitez de nos réductions exclusives sur les guirlandes lumineuses, bougies LED et packs de fête pour le réveillon du 31 décembre.',
    canonicalPath: '/promos',
    type: 'website',
  },
  '/livraison-garantie': {
    title: 'Livraison Garantie avant le 31 Décembre | Éclat Express',
    description:
      'Engagement de livraison express 24h à 48h sur Abidjan, Dakar, Cotonou et Lomé avec suivi en temps réel et inspection au déballage.',
    canonicalPath: '/livraison-garantie',
    type: 'website',
  },
  '/ma-selection': {
    title: 'Ma Sélection de Fête (Panier) | Éclat Express',
    description:
      'Consultez votre sélection de décorations pour le réveillon et finalisez votre commande express avant rupture de stock.',
    canonicalPath: '/ma-selection',
    type: 'website',
  },
  '/commande': {
    title: 'Commande Express Réveillon 31 Décembre | Éclat Express',
    description:
      'Formulaire de commande express sans création de compte. Livraison garantie et paiement sécurisé à la livraison.',
    canonicalPath: '/commande',
    type: 'website',
  },
  '/commande/confirmation': {
    title: 'Confirmation de Commande | Éclat Express',
    description:
      'Merci pour votre commande ! Vos décorations de réveillon sont en cours de préparation.',
    canonicalPath: '/commande/confirmation',
    type: 'website',
    noindex: true,
  },
  '/avis-clients': {
    title: 'Avis Clients Vérifiés | Éclat Express',
    description:
      'Découvrez les témoignages et retours d’expérience vérifiés de nos clients pour la Saint-Sylvestre.',
    canonicalPath: '/avis-clients',
    type: 'website',
  },
  '/professionnels': {
    title: 'Espace Professionnels (Restaurants, Hôtels, Événements) | Éclat Express',
    description:
      'Solutions de décoration sur-mesure pour professionnels : restaurants, discothèques, hôtels et salles de banquet pour le Nouvel An.',
    canonicalPath: '/professionnels',
    type: 'website',
  },
  '/livraison-paiement': {
    title: 'Livraison & Modes de Paiement | Éclat Express',
    description:
      'Informations sur nos zones de livraison, nos créneaux horaires garantis et les modes de règlement acceptés.',
    canonicalPath: '/livraison-paiement',
    type: 'website',
  },
  '/faq': {
    title: 'Questions Fréquentes (FAQ) | Éclat Express',
    description:
      'Toutes les réponses à vos questions sur les délais de livraison, la résistance aux intempéries et l’installation rapide.',
    canonicalPath: '/faq',
    type: 'website',
  },
  '/contact': {
    title: 'Contactez notre Équipe Réveillon | Éclat Express',
    description:
      'Besoin d’aide pour choisir votre décoration de réveillon ? Contactez notre service client 7j/7 par WhatsApp ou téléphone.',
    canonicalPath: '/contact',
    type: 'website',
  },
  '/cgv': {
    title: 'Conditions Générales de Vente | Éclat Express',
    description:
      'Consultez les conditions générales de vente et garanties applicables aux commandes sur Éclat Express.',
    canonicalPath: '/cgv',
    type: 'website',
  },
  '/mentions-legales': {
    title: 'Mentions Légales | Éclat Express',
    description:
      'Mentions légales et informations éditoriales du site Éclat Express.',
    canonicalPath: '/mentions-legales',
    type: 'website',
  },
  '/confidentialite': {
    title: 'Politique de Confidentialité | Éclat Express',
    description:
      'Protection de vos données personnelles et respect de votre vie privée lors de vos commandes.',
    canonicalPath: '/confidentialite',
    type: 'website',
  },
  '/cookies': {
    title: 'Gestion des Cookies | Éclat Express',
    description:
      'Politique d’utilisation des cookies techniques pour le fonctionnement du panier et de la boutique.',
    canonicalPath: '/cookies',
    type: 'website',
  },
  '/admin': {
    title: 'Administration Sécurisée | Éclat Express',
    description:
      'Interface de gestion des commandes et des stocks Éclat Express.',
    canonicalPath: '/admin',
    type: 'website',
    noindex: true,
  },
};

function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function removeMetaTag(selector: string) {
  const element = document.querySelector(selector);
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function setCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function updateJsonLd(schema: object) {
  let script = document.getElementById('eclat-schema-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'eclat-schema-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Builds metadata specifically tailored for a product or pack detail page.
 */
export function getProductMetadata(product: ProductDetailMetadataInput): MetadataOptions {
  const title = `${product.nom} | Éclat Express Réveillon`;
  const desc =
    product.descriptionCourte ||
    product.description ||
    'Décoration féerique pour le 31 décembre livrée en 24h-48h avec Éclat Express.';
  const image =
    (product.images && product.images.length > 0 ? product.images[0] : null) ||
    product.image ||
    DEFAULT_OG_IMAGE;
  const canonicalPath = `/produit/${product.slug}`;
  const isAvailable = (product.stock ?? 1) > 0;

  return {
    title,
    description: desc,
    canonicalPath,
    image,
    type: 'product',
    product: {
      price: product.prix,
      currency: 'XOF',
      availability: isAvailable ? 'instock' : 'outofstock',
      category: product.categorieSlug || (product.isPack ? 'packs' : 'decorations'),
      brand: 'Éclat Express',
    },
  };
}

/**
 * Returns default or calculated metadata for any route path.
 */
export function getMetadataForRoute(
  routePath: string,
  customOptions?: Partial<MetadataOptions>,
  productData?: ProductDetailMetadataInput
): MetadataOptions {
  const cleanPath = routePath.split('?')[0].split('#')[0] || '/';

  if (cleanPath.startsWith('/produit/') && productData) {
    const prodMeta = getProductMetadata(productData);
    return { ...prodMeta, ...customOptions };
  }

  const baseConfig = ROUTE_METADATA_MAP[cleanPath] || {
    title: 'Éclat Express | Décorations Réveillon 31 Décembre',
    description:
      'Boutique en ligne festive pour le réveillon du 31 décembre : packs prêts à poser, guirlandes et bougies LED avec livraison express.',
    canonicalPath: cleanPath,
    type: 'website',
  };

  return {
    ...baseConfig,
    ...customOptions,
    canonicalPath: customOptions?.canonicalPath || baseConfig.canonicalPath || cleanPath,
  };
}

/**
 * Core helper function to dynamically update document head metadata:
 * - Document title
 * - Meta description
 * - Canonical link (<link rel="canonical">)
 * - Open Graph tags (including product pricing, currency, availability)
 * - Twitter Card tags
 * - Schema.org JSON-LD
 */
export function updateHeadMetadata({
  title,
  description,
  canonicalPath,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  product,
  noindex = false,
}: MetadataOptions) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // 1. Page Title
  const formattedTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  document.title = formattedTitle;

  // 2. Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', description);

  // 3. Canonical URL (dynamic resolution based on origin + path)
  const currentPath = canonicalPath || window.location.pathname;
  const canonicalUrl = `${window.location.origin}${currentPath}`;
  setCanonicalLink(canonicalUrl);

  // 4. Open Graph Core Tags
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
  setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'fr_FR');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
  setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', formattedTitle);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);

  // 5. Twitter Card Tags
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', formattedTitle);

  // 6. Robots / Indexing
  if (noindex) {
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
  } else {
    removeMetaTag('meta[name="robots"]');
  }

  // 7. Product-specific Open Graph tags
  if (type === 'product' && product) {
    if (product.price !== undefined) {
      setMetaTag(
        'meta[property="product:price:amount"]',
        'property',
        'product:price:amount',
        String(product.price)
      );
      setMetaTag(
        'meta[property="product:price:currency"]',
        'property',
        'product:price:currency',
        product.currency || 'XOF'
      );
    }
    if (product.availability) {
      setMetaTag(
        'meta[property="product:availability"]',
        'property',
        'product:availability',
        product.availability
      );
    }
    setMetaTag(
      'meta[property="product:brand"]',
      'property',
      'product:brand',
      product.brand || SITE_NAME
    );
    setMetaTag(
      'meta[property="product:condition"]',
      'property',
      'product:condition',
      'new'
    );
  } else {
    removeMetaTag('meta[property="product:price:amount"]');
    removeMetaTag('meta[property="product:price:currency"]');
    removeMetaTag('meta[property="product:availability"]');
    removeMetaTag('meta[property="product:brand"]');
    removeMetaTag('meta[property="product:condition"]');
  }

  // 8. Schema.org JSON-LD Structured Data
  if (type === 'product' && product) {
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: formattedTitle,
      image: [image],
      description: description,
      brand: {
        '@type': 'Brand',
        name: product.brand || SITE_NAME,
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: product.currency || 'XOF',
        price: product.price ?? 0,
        availability:
          product.availability === 'instock'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      },
    };
    updateJsonLd(productSchema);
  } else {
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: window.location.origin,
      description: description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/boutique?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
    updateJsonLd(websiteSchema);
  }
}

/**
 * Helper function to dynamically update document head metadata based on the active route.
 * Automatically resolves the title, description, canonical link, and Open Graph tags.
 */
export function updateHeadMetadataForRoute(
  routePath: string,
  customOptions?: Partial<MetadataOptions>,
  productData?: ProductDetailMetadataInput
) {
  const metadata = getMetadataForRoute(routePath, customOptions, productData);
  updateHeadMetadata(metadata);
  return metadata;
}

/**
 * React hook to automatically sync head metadata based on active route and options.
 */
export function useRouteMetadata(
  routePath: string,
  options?: Partial<MetadataOptions>,
  productData?: ProductDetailMetadataInput
) {
  useEffect(() => {
    updateHeadMetadataForRoute(routePath, options, productData);
  }, [
    routePath,
    options?.title,
    options?.description,
    options?.canonicalPath,
    options?.image,
    options?.type,
    options?.product?.price,
    options?.product?.availability,
    options?.noindex,
    productData?.slug,
    productData?.prix,
    productData?.stock,
  ]);
}

/**
 * React hook to automatically sync head metadata on component rendering.
 */
export function usePageMetadata(options: MetadataOptions) {
  useEffect(() => {
    updateHeadMetadata(options);
  }, [
    options.title,
    options.description,
    options.canonicalPath,
    options.image,
    options.type,
    options.product?.price,
    options.product?.availability,
    options.product?.brand,
    options.noindex,
  ]);
}
