import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { Category, Produit, Pack, Avis, ConfigSite } from '../types.ts';
import {
  SEED_CATEGORIES,
  SEED_PRODUITS,
  SEED_PACKS,
  SEED_CONFIG,
  SEED_AVIS,
} from '../data/seedData.ts';

interface StoreContextType {
  categories: Category[];
  produits: Produit[];
  packs: Pack[];
  avis: Avis[];
  config: ConfigSite;
  loading: boolean;
  error: string | null;
  refreshStore: () => Promise<void>;
  getProductBySlug: (slug: string) => Produit | undefined;
  getPackBySlug: (slug: string) => Pack | undefined;
  quizVibe: string | null;
  setQuizVibe: (vibe: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [produits, setProduits] = useState<Produit[]>(SEED_PRODUITS);
  const [packs, setPacks] = useState<Pack[]>(SEED_PACKS);
  const [avis, setAvis] = useState<Avis[]>(SEED_AVIS);
  const [config, setConfig] = useState<ConfigSite>(SEED_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizVibe, setQuizVibe] = useState<string | null>(null);

  const fetchStoreData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Try client Firestore queries first (conform to security rules: actif == true, valide == true)
    let firestoreSuccess = false;
    try {
      const prodsQuery = query(collection(db, 'produits'), where('actif', '==', true));
      const packsQuery = query(collection(db, 'packs'), where('actif', '==', true));
      const avisQuery = query(collection(db, 'avis'), where('valide', '==', true));
      const catsQuery = collection(db, 'categories');
      const configDocRef = doc(db, 'config', 'site');

      const [prodsSnap, packsSnap, avisSnap, catsSnap, configSnap] = await Promise.all([
        getDocs(prodsQuery),
        getDocs(packsQuery),
        getDocs(avisQuery),
        getDocs(catsQuery),
        getDoc(configDocRef),
      ]);

      if (!prodsSnap.empty || !catsSnap.empty) {
        if (!catsSnap.empty) {
          const loadedCats = catsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
          loadedCats.sort((a, b) => a.ordre - b.ordre);
          setCategories(loadedCats);
        }

        if (!prodsSnap.empty) {
          const loadedProds = prodsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Produit));
          setProduits(loadedProds);
        }

        if (!packsSnap.empty) {
          const loadedPacks = packsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Pack));
          setPacks(loadedPacks);
        }

        const loadedAvis = avisSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Avis));
        setAvis(loadedAvis);

        if (configSnap.exists()) {
          setConfig({ ...SEED_CONFIG, ...(configSnap.data() as Partial<ConfigSite>) });
        }

        firestoreSuccess = true;
      }
    } catch (e: any) {
      console.warn('Direct Firestore read encountered error or empty collections:', e.message);
    }

    // Fallback to server /api/catalog if Firestore is empty or permissions restricted in sandbox
    if (!firestoreSuccess) {
      try {
        const res = await fetch('/api/catalog');
        if (res.ok) {
          const data = await res.json();
          if (data.categories?.length) setCategories(data.categories);
          if (data.produits?.length) setProduits(data.produits);
          if (data.packs?.length) setPacks(data.packs);
          if (data.avis) setAvis(data.avis);
          if (data.config) setConfig({ ...SEED_CONFIG, ...data.config });
        }
      } catch (err: any) {
        console.warn('API catalog fetch failed, relying on seed data:', err.message);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  const getProductBySlug = (slug: string) => {
    return produits.find((p) => p.slug === slug || p.id === slug);
  };

  const getPackBySlug = (slug: string) => {
    return packs.find((p) => p.slug === slug || p.id === slug);
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        produits,
        packs,
        avis,
        config,
        loading,
        error,
        refreshStore: fetchStoreData,
        getProductBySlug,
        getPackBySlug,
        quizVibe,
        setQuizVibe,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
