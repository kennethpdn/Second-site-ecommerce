export interface Category {
  id: string;
  slug: string;
  nom: string;
  icone: string;
  ordre: number;
}

export interface Produit {
  id: string;
  slug: string;
  nom: string;
  categorieSlug: string;
  prix: number; // Integer in FCFA
  prixBarre?: number | null; // Struck-through price if in promo
  badge?: 'best-seller' | 'nouveau' | 'promo' | null;
  descriptionCourte: string;
  descriptionLongue: string;
  images: string[];
  stock: number;
  livrableAvant31: boolean;
  populaire: boolean;
  actif: boolean;
  caracteristiques?: string[];
  nuances?: string[];
  dimensions?: string[];
  typeEspace?: ('salon' | 'villa' | 'table')[];
}

export interface PackItemRef {
  produitId: string;
  quantite: number;
  nom?: string;
  description?: string;
}

export interface Pack {
  id: string;
  slug: string;
  nom: string;
  description: string;
  prix: number;
  prixBarre?: number | null;
  image: string;
  images?: string[];
  actif: boolean;
  produits: PackItemRef[];
  stock?: number;
  badge?: 'best-seller' | 'nouveau' | 'promo' | null;
  typeEspace?: ('salon' | 'villa' | 'table')[];
}

export interface Avis {
  id: string;
  produitId: string;
  auteur: string;
  ville?: string;
  note: number; // 1 - 5
  texte: string;
  valide: boolean;
  date?: string;
  photoUrl?: string;
}

export interface ConfigSite {
  deadlineCommande: string;
  seuilLivraisonOfferte: number;
  numeroWhatsApp: string;
  delaiLivraison: string;
  zones: string;
  modePaiement: string;
  retours: string;
}

export interface LigneCommande {
  type: 'produit' | 'pack';
  id: string;
  slug: string;
  nom: string;
  prixUnitaire: number;
  quantite: number;
  image?: string;
  variante?: string;
}

export interface Commande {
  id?: string;
  numero: string;
  nom: string;
  telephone: string;
  adresse: string;
  creneau: string;
  notes?: string;
  total: number;
  statut: 'nouvelle' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';
  createdAt: string;
  lignes: LigneCommande[];
}

export interface DemandePro {
  id?: string;
  nom: string;
  societe: string;
  telephone: string;
  message: string;
  createdAt: string;
}
