import React, { createContext, useContext, useState, useEffect } from 'react';
import { LigneCommande } from '../types.ts';

interface CartContextType {
  items: LigneCommande[];
  addItem: (item: Omit<LigneCommande, 'quantite'>, quantite?: number) => void;
  removeItem: (id: string, type: 'produit' | 'pack', variante?: string) => void;
  updateQuantity: (id: string, type: 'produit' | 'pack', quantite: number, variante?: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  lastAddedItem: LigneCommande | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'eclat_express_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode; seuilLivraisonOfferte?: number }> = ({
  children,
  seuilLivraisonOfferte = 30000,
}) => {
  const [items, setItems] = useState<LigneCommande[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    return [];
  });

  const [lastAddedItem, setLastAddedItem] = useState<LigneCommande | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addItem = (newItem: Omit<LigneCommande, 'quantite'>, quantite = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === newItem.id && i.type === newItem.type && i.variante === newItem.variante
      );

      let updated: LigneCommande[];
      if (existingIndex > -1) {
        updated = [...prev];
        const newQty = Math.min(20, updated[existingIndex].quantite + quantite);
        updated[existingIndex] = { ...updated[existingIndex], quantite: newQty };
      } else {
        const line: LigneCommande = { ...newItem, quantite: Math.min(20, quantite) };
        updated = [...prev, line];
      }
      setLastAddedItem({ ...newItem, quantite });
      return updated;
    });

    // Auto open side drawer on desktop and mobile when adding
    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string, type: 'produit' | 'pack', variante?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.type === type && (variante ? i.variante === variante : true)))
    );
  };

  const updateQuantity = (id: string, type: 'produit' | 'pack', quantite: number, variante?: string) => {
    if (quantite <= 0) {
      removeItem(id, type, variante);
      return;
    }
    const cleanQty = Math.min(20, Math.max(1, Math.floor(quantite)));
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type && (variante ? i.variante === variante : true)
          ? { ...i, quantite: cleanQty }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear cart storage:', e);
    }
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantite, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.prixUnitaire * item.quantite, 0);

  const freeShippingThreshold = seuilLivraisonOfferte || 30000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - totalAmount);
  const freeShippingProgress = Math.min(
    100,
    Math.round((totalAmount / freeShippingThreshold) * 100)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalAmount,
        freeShippingThreshold,
        freeShippingRemaining,
        freeShippingProgress,
        lastAddedItem,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
