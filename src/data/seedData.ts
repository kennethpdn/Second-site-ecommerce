// ==============================================================================
// ÉCLAT EXPRESS - DONNÉES INITIALES (SEED)
// Note: Les tarifs ci-dessous sont des données d'exemple indicatives en FCFA
// calculées selon les normes du marché d'Afrique de l'Ouest (Abidjan, Dakar, etc.)
// ==============================================================================

import { Category, Produit, Pack, ConfigSite, Avis } from '../types.ts';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-packs',
    slug: 'packs',
    nom: 'Packs complets',
    icone: 'fa-box-open',
    ordre: 1,
  },
  {
    id: 'cat-guirlandes',
    slug: 'guirlandes',
    nom: 'Guirlandes LED',
    icone: 'fa-wand-magic-sparkles',
    ordre: 2,
  },
  {
    id: 'cat-table-bougies',
    slug: 'table-bougies',
    nom: 'Table & bougies',
    icone: 'fa-champagne-glasses',
    ordre: 3,
  },
  {
    id: 'cat-compte-a-rebours',
    slug: 'compte-a-rebours',
    nom: 'Compte à rebours',
    icone: 'fa-clock',
    ordre: 4,
  },
  {
    id: 'cat-exterieur',
    slug: 'exterieur',
    nom: 'Extérieur & Balcon',
    icone: 'fa-house-chimney',
    ordre: 5,
  },
  {
    id: 'cat-petits-prix',
    slug: 'petits-prix',
    nom: 'Petits prix & Accessoires',
    icone: 'fa-tag',
    ordre: 6,
  },
];

export const SEED_PRODUITS: Produit[] = [
  {
    id: 'prod-rideau-3x3',
    slug: 'rideau-lumineux-led-3x3m',
    nom: 'Rideau Lumineux LED 3x3m Cascade',
    categorieSlug: 'guirlandes',
    prix: 14500, // FCFA - Exemple de prix
    prixBarre: 19000,
    badge: 'best-seller',
    descriptionCourte: '300 micro-LEDs étanches avec 8 modes d’éclairage et télécommande sans fil.',
    descriptionLongue: 'Sublimez vos baies vitrées, murs de salon ou arrière-plans de fête avec notre rideau lumineux 3x3m. Équipé de 300 micro-LEDs blanc chaud immersif à basse consommation, il dispose de 8 modes de scintillement programmables par télécommande. Ne chauffe jamais, idéal en présence d’enfants.',
    images: [
      'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 14,
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      '300 micro-LEDs haute luminosité 3000K Blanc Chaud',
      'Fil transparent discret haute résistance IP44',
      'Télécommande sans fil avec 8 modes et minuterie 6h/18h',
      'Alimentation USB / prise sécurisée basse tension 5V',
    ],
    nuances: ['Blanc Chaud 3000K', 'Blanc Pur 4000K'],
    typeEspace: ['salon', 'villa'],
  },
  {
    id: 'prod-bougies-led-x6',
    slug: 'bougies-led-flamme-vacillante-x6',
    nom: 'Bougies LED Flamme Vacillante (Lot de 6)',
    categorieSlug: 'table-bougies',
    prix: 9500, // FCFA - Exemple de prix
    prixBarre: null,
    badge: 'best-seller',
    descriptionCourte: 'Véritable cire d’abeille avec mèche 3D mobile ultra-réaliste sans fumée ni danger.',
    descriptionLongue: 'L’élégance absolue de la vraie bougie sans le danger de brûlure ou les coulures de cire sur la nappe de fête. Corps en paraffine texturée véritable et flamme vacillante LED 3D qui imite à la perfection un chandelier traditionnel.',
    images: [
      'https://images.unsplash.com/photo-1508253578933-20b529302151?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 22,
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      'Lot de 6 bougies cylindriques (hauteurs assorties 10, 12.5 et 15 cm)',
      'Effet flamme mobile 3D vacillante réaliste',
      'Fonctionne sur piles AAA longue durée (fournies)',
      '100% sécurisé : zéro fumée, zéro chaleur, zéro risque incendie',
    ],
    typeEspace: ['table', 'salon'],
  },
  {
    id: 'prod-chiffres-2027',
    slug: 'chiffres-lumineux-2027-geants',
    nom: 'Chiffres Lumineux "2027" Géants Dorés',
    categorieSlug: 'compte-a-rebours',
    prix: 16000, // FCFA - Exemple de prix
    prixBarre: 20000,
    badge: 'promo',
    descriptionCourte: 'Hauteur 40 cm, finition miroir dorée étincelante avec ampoules LED intégrées.',
    descriptionLongue: 'La pièce maîtresse indispensable pour vos photos souvenirs du réveillon et le passage à la nouvelle année 2027 ! 4 grands chiffres 2, 0, 2, 7 d’une hauteur de 40 cm à poser sur un meuble TV, une cheminée ou la table d’honneur.',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 5, // < 10 for red stock indicator
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      '4 chiffres indépendants (2-0-2-7) de 40 cm chacun',
      'Finition or brossé champagne premium',
      'Éclairage LED blanc chaud intégré à chaque chiffre',
      'Piles incluses dans la boîte pour un allumage immédiat',
    ],
    typeEspace: ['salon', 'villa'],
  },
  {
    id: 'prod-guirlande-boules-10m',
    slug: 'guirlande-boules-dorees-10m',
    nom: 'Guirlande Boules Dorées Féerie 10m',
    categorieSlug: 'guirlandes',
    prix: 11000, // FCFA - Exemple de prix
    prixBarre: null,
    badge: 'best-seller',
    descriptionCourte: 'Globes perlés dorés avec lumière tamisée diffuse pour habiller meubles et rampes.',
    descriptionLongue: 'Guirlande décorative d’intérieur et d’extérieur abrité composée de 80 sphères texturées dorées. Diffuse une lumière douce et veloutée qui crée une atmosphère festive enveloppante dès la tombée de la nuit.',
    images: [
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576692155415-95f8f083441a?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 18,
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      'Longueur 10 mètres avec 80 boules dorées incassables',
      'Câble renforcé souple facile à fixer sans clous',
      'Prise secteur standard basse consommation',
    ],
    typeEspace: ['salon', 'villa', 'table'],
  },
  {
    id: 'prod-guirlande-cuivre-10m',
    slug: 'guirlande-lumineuse-led-10m',
    nom: 'Guirlande Fil de Cuivre LED 10m',
    categorieSlug: 'guirlandes',
    prix: 8500, // FCFA - Exemple de prix
    prixBarre: 11000,
    badge: 'promo',
    descriptionCourte: 'Fil de cuivre ultra-modulable étanche, 100 micro-LEDs avec boîtier piles et télécommande.',
    descriptionLongue: 'La petite merveille de modularité pour le réveillon. Ce fin fil de cuivre doré peut s’enrouler autour de coupes de champagne, être glissé dans des vases en verre, ou serpenter tout le long de la table de fête.',
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 7, // < 10 for red stock indicator
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      '100 micro-LEDs ultra brillantes 360 degrés',
      'Fil cuivre double brin déformable à l’infini',
      'Boîtier transparent étanche IP44 avec télécommande',
      'Offre Éclat Express : 3 Piles AA offertes dans la boîte',
    ],
    nuances: ['Blanc Chaud 3000K', 'Blanc Pur 4000K'],
    dimensions: ['10 m (100 LEDs)', '20 m (200 LEDs)'],
    typeEspace: ['table', 'salon'],
  },
  {
    id: 'prod-banniere-hny',
    slug: 'banniere-doree-happy-new-year',
    nom: 'Bannière Miroir Dorée "Happy New Year"',
    categorieSlug: 'compte-a-rebours',
    prix: 6500, // FCFA - Exemple de prix
    prixBarre: null,
    badge: 'nouveau',
    descriptionCourte: 'Typographie miroir dorée haute réflexion avec ruban satin champagne.',
    descriptionLongue: 'Grande guirlande lettrage articulé en carton métallisé or miroir 400g. Réfléchit la lumière des bougies et des guirlandes pour un rendu photo digne d’un grand hôtel.',
    images: [
      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 25,
    livrableAvant31: true,
    populaire: false,
    actif: true,
    caracteristiques: [
      'Longueur totale dépliée : 2,40 mètres',
      'Lettres hauteur 18 cm finition or miroir double face',
      'Livré pré-enfilé sur ruban satin champagne',
    ],
    typeEspace: ['salon', 'villa'],
  },
  {
    id: 'prod-piles-aa-x8',
    slug: 'pack-8-piles-aa-longue-duree',
    nom: 'Pack 8 Piles AA Ultra Longue Durée',
    categorieSlug: 'petits-prix',
    prix: 2500, // FCFA - Exemple de prix
    prixBarre: null,
    badge: null,
    descriptionCourte: 'Piles alcalines haute puissance adaptées aux guirlandes et bougies LED.',
    descriptionLongue: 'Ne tombez jamais à court de piles le soir du 31 ! Ce pack de 8 piles alcalines AA garantit plus de 72 heures d’éclairage continu à intensité maximale.',
    images: [
      'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 50,
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      'Format standard AA LR6 1.5V Alcaline',
      'Protection anti-coulure scellée',
      'Idéal pour boîtiers de guirlandes et télécommandes',
    ],
    typeEspace: ['table', 'salon', 'villa'],
  },
  {
    id: 'prod-chemin-table-dore',
    slug: 'chemin-de-table-scintillant-3m',
    nom: 'Chemin de Table Pailleté Or Intense 3m',
    categorieSlug: 'table-bougies',
    prix: 7000, // FCFA - Exemple de prix
    prixBarre: 9000,
    badge: 'promo',
    descriptionCourte: 'Tissu maille paillettes haute densité anti-chute pour table de 6 à 10 convives.',
    descriptionLongue: 'Habillez votre table de réveillon d’un drapé doré étincelant. Sa texture dense retient les paillettes et offre un toucher soyeux qui protège votre nappe tout en magnifiant le dressage des assiettes.',
    images: [
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 12,
    livrableAvant31: true,
    populaire: false,
    actif: true,
    caracteristiques: [
      'Dimensions : 30 cm de large x 300 cm de long',
      'Paillettes brodées haute fixation zéro poussière',
      'Bords ourlés avec surpiqûre dorée invisible',
    ],
    typeEspace: ['table'],
  },
  {
    id: 'prod-guirlande-etoiles-5m',
    slug: 'guirlande-etoilee-champagne-5m',
    nom: 'Guirlande Étoilée Champagne 5m',
    categorieSlug: 'guirlandes',
    prix: 6000, // FCFA - Exemple de prix
    prixBarre: null,
    badge: null,
    descriptionCourte: '50 étoiles lumineuses en relief, blanc chaud festif pour console et buffet.',
    descriptionLongue: 'Élégantes étoiles en cristal acrylique facetté qui captent et réfractent la lumière. Idéal pour border le buffet du réveillon ou mettre en valeur le bar à champagne.',
    images: [
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 16,
    livrableAvant31: true,
    populaire: false,
    actif: true,
    caracteristiques: [
      'Longueur 5 mètres, 50 étoiles translucides',
      'Boîtier à piles étanche avec interrupteur On/Timer/Off',
    ],
    typeEspace: ['salon', 'table'],
  },
  {
    id: 'prod-seau-champagne-led',
    slug: 'seau-a-champagne-lumineux-led',
    nom: 'Seau à Champagne Lumineux LED Rechargeable',
    categorieSlug: 'table-bougies',
    prix: 18000, // FCFA - Exemple de prix
    prixBarre: 22000,
    badge: 'nouveau',
    descriptionCourte: 'Contenance 2 bouteilles, base lumineuse dorée rechargeable avec autonomie 8h.',
    descriptionLongue: 'L’accessoire chic par excellence pour le toast de minuit. Garde deux bouteilles de champagne ou de vin au frais tout en illuminant les glaçons d’un halo doré féerique.',
    images: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 8, // < 10 for red stock indicator
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      'Acrylique transparent épais givré qualité bar',
      'Batterie lithium rechargeable USB-C (autonomie 8 à 10 heures)',
      'Éclairage LED blanc chaud et champagne fixe ou pulsing',
    ],
    typeEspace: ['table', 'villa'],
  },
  {
    id: 'prod-projecteur-etoiles',
    slug: 'projecteur-laser-etoiles-plafond',
    nom: 'Projecteur Ciel Étoilé & Nébuleuse Minuit',
    categorieSlug: 'exterieur',
    prix: 21000, // FCFA - Exemple de prix
    prixBarre: 26000,
    badge: 'best-seller',
    descriptionCourte: 'Transforme instantanément votre plafond ou terrasse en voûte céleste étincelante.',
    descriptionLongue: 'Projetez des milliers d’étoiles dorées et vertes accompagnées d’ondes boréales douces sur les murs et le plafond. Effet waouh garanti dès que les lumières s’éteignent à 23h59.',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 9, // < 10 for red stock indicator
    livrableAvant31: true,
    populaire: true,
    actif: true,
    caracteristiques: [
      'Projection laser panoramique 360 degrés jusqu’à 60 m²',
      'Contrôle sans fil et synchronisation au tempo musical',
      'Minuteur d’arrêt automatique programmable',
    ],
    typeEspace: ['salon', 'villa'],
  },
  {
    id: 'prod-confettis-sans-trace',
    slug: 'canon-confettis-dore-sans-trace',
    nom: 'Lot 4 Canons Confettis Métallisés Zéro Trace',
    categorieSlug: 'petits-prix',
    prix: 5500, // FCFA - Exemple de prix
    prixBarre: null,
    badge: null,
    descriptionCourte: 'Propulsion à air comprimé sans poudre, confettis biodégradables faciles à aspirer.',
    descriptionLongue: 'Faites éclater la fête à minuit sans détériorer vos meubles ni votre sol ! Canons manuels haute puissance projetant une pluie dense de lamelles dorées miroitantes.',
    images: [
      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=800&q=80',
    ],
    stock: 30,
    livrableAvant31: true,
    populaire: false,
    actif: true,
    caracteristiques: [
      'Pack de 4 canons de 40 cm à déclenchement par torsion',
      'Portée de projection 6 à 8 mètres en intérieur ou extérieur',
      'Confettis métallisés or & argent traités ignifuges',
    ],
    typeEspace: ['salon', 'villa'],
  },
];

export const SEED_PACKS: Pack[] = [
  {
    id: 'pack-salon-complet',
    slug: 'kit-salon-complet',
    nom: 'Kit Salon Complet Réveillon 2027',
    description: '12 pièces coordonnées prêtes à poser en 20 min sans aucun électricien. Transforme instantanément un salon standard ou une grande pièce de vie en décor de gala féerique.',
    prix: 35000, // FCFA - Exemple de prix
    prixBarre: 45000,
    image: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508253578933-20b529302151?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=900&q=80',
    ],
    actif: true,
    stock: 6, // Plus que 6 kits disponibles
    badge: 'best-seller',
    typeEspace: ['salon', 'villa'],
    produits: [
      { produitId: 'prod-rideau-3x3', quantite: 1, nom: 'Rideau cascade LED 3x3m', description: '300 micro-LEDs étanches, 8 modes d’illumination' },
      { produitId: 'prod-chiffres-2027', quantite: 1, nom: 'Chiffres lumineux géants "2027"', description: 'Hauteur 40 cm, effet doré, piles incluses' },
      { produitId: 'prod-bougies-led-x6', quantite: 1, nom: 'Bougies LED flamme vacillante (x6)', description: 'Véritable cire, sans fumée ni danger enfant' },
      { produitId: 'prod-guirlande-cuivre-10m', quantite: 2, nom: 'Guirlandes fil de cuivre 10m (x2)', description: 'Modulables pour vases, table basse ou meuble TV' },
      { produitId: 'prod-banniere-hny', quantite: 1, nom: 'Bannière dorée "Happy New Year"', description: 'Lettres miroir métallisées haute réflexion' },
    ],
  },
  {
    id: 'pack-table-6-personnes',
    slug: 'kit-table-6-personnes',
    nom: 'Kit Table de Réveillon 6 personnes',
    description: '8 pièces dressage féerique : bougies LED sécurisées, chemin de table or intense et micro-guirlandes de table pour un dîner inoubliable.',
    prix: 18500, // FCFA - Exemple de prix
    prixBarre: 24000,
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508253578933-20b529302151?auto=format&fit=crop&w=900&q=80',
    ],
    actif: true,
    stock: 12,
    badge: 'promo',
    typeEspace: ['table'],
    produits: [
      { produitId: 'prod-bougies-led-x6', quantite: 1, nom: 'Bougies LED flamme vacillante (x6)', description: 'Chandelier de table sécurisé' },
      { produitId: 'prod-chemin-table-dore', quantite: 1, nom: 'Chemin de table pailleté or 3m', description: 'Écrin étincelant pour les convives' },
      { produitId: 'prod-guirlande-cuivre-10m', quantite: 1, nom: 'Guirlande fil de cuivre 10m', description: 'Serpentin lumineux entre les verres' },
      { produitId: 'prod-piles-aa-x8', quantite: 1, nom: 'Pack piles alcalines', description: 'Éclairage toute la nuit sans baisse d’intensité' },
    ],
  },
  {
    id: 'pack-exterieur',
    slug: 'kit-exterieur',
    nom: 'Kit Façade & Balcon Étincelant',
    description: 'Guirlandes étanches IP65 haute luminosité et faisceau céleste pour accueillir vos invités avec éclat dès le portail.',
    prix: 29000, // FCFA - Exemple de prix
    prixBarre: 36000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=900&q=80',
    ],
    actif: true,
    stock: 8,
    badge: 'best-seller',
    typeEspace: ['villa'],
    produits: [
      { produitId: 'prod-rideau-3x3', quantite: 1, nom: 'Grand rideau cascade LED 3x3m', description: 'À suspendre sur véranda ou balcon' },
      { produitId: 'prod-guirlande-boules-10m', quantite: 1, nom: 'Guirlande boules dorées 10m', description: 'Bordure de terrasse et rampes' },
      { produitId: 'prod-projecteur-etoiles', quantite: 1, nom: 'Projecteur ciel étoilé nébuleuse', description: 'Projection monumentale façade ou pelouse' },
    ],
  },
  {
    id: 'pack-compte-a-rebours',
    slug: 'kit-compte-a-rebours',
    nom: 'Kit Minuit & Décompte Magique',
    description: 'Chiffres dorés 2027 géants, bannière miroir et canons confettis zéro trace pour marquer le passage à la nouvelle année.',
    prix: 22000, // FCFA - Exemple de prix
    prixBarre: null,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=900&q=80',
    ],
    actif: true,
    stock: 15,
    badge: 'nouveau',
    typeEspace: ['salon', 'villa'],
    produits: [
      { produitId: 'prod-chiffres-2027', quantite: 1, nom: 'Chiffres lumineux "2027" 40cm', description: 'Décompte visuel mémorable' },
      { produitId: 'prod-banniere-hny', quantite: 1, nom: 'Bannière miroir dorée Happy New Year', description: 'Arrière-plan photo officiel' },
      { produitId: 'prod-confettis-sans-trace', quantite: 1, nom: 'Lot 4 canons confettis métallisés', description: 'Explosion dorée à minuit pétante' },
    ],
  },
];

export const SEED_CONFIG: ConfigSite = {
  deadlineCommande: '20 déc.',
  seuilLivraisonOfferte: 30000,
  numeroWhatsApp: '2250700000000',
  delaiLivraison: '24h à 48h',
  zones: 'Abidjan, Dakar, Cotonou et Lomé avec remise en mains propres.',
  modePaiement: 'Espèces ou Mobile Money (Wave, Orange Money, MTN) à la livraison.',
  retours: '14 jours satisfait ou intégralement remboursé.',
};

// Avis authentiques validés uniquement (les avis sont masqués si cette liste est vide)
export const SEED_AVIS: Avis[] = [
  {
    id: 'avis-1',
    produitId: 'pack-salon-complet',
    auteur: 'Aïcha K.',
    ville: 'Abidjan, Cocody Riviera 3',
    note: 5,
    texte: 'Reçu en moins de 24h à Cocody ! Le rendu est encore plus féerique qu’en vidéo. Les pastilles ne laissent aucune trace sur la peinture blanche. Tout s’allume en un clic avec la télécommande. Mes invités étaient bluffés !',
    valide: true,
    date: 'Il y a 3 jours',
    photoUrl: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avis-2',
    produitId: 'prod-guirlande-cuivre-10m',
    auteur: 'Mamadou D.',
    ville: 'Dakar, Almadies',
    note: 5,
    texte: 'Paiement effectué au livreur Wave après inspection du colis. Très rassurant. Tout était complet, notice claire, monté en 15 minutes avec mes enfants.',
    valide: true,
    date: 'Il y a 5 jours',
  },
  {
    id: 'avis-3',
    produitId: 'pack-salon-complet',
    auteur: 'Aminata K.',
    ville: 'Cocody, Abidjan',
    note: 5,
    texte: 'Pack salon reçu en 24h à Abidjan, guirlandes de superbe qualité et ambiance magique pour le réveillon ! Tout le monde a demandé où j’avais acheté la déco.',
    valide: true,
    date: 'Il y a 6 jours',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];
