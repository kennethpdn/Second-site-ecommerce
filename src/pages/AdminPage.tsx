import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.ts';
import { useStore } from '../context/StoreContext.tsx';
import { Commande, Produit } from '../types.ts';

const ALLOWED_ADMIN_EMAIL = 'lookisato@gmail.com';

export const AdminPage: React.FC = () => {
  const { produits, refreshStore } = useStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingStocks, setEditingStocks] = useState<Record<string, number>>({});
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
      if (user && user.email === ALLOWED_ADMIN_EMAIL) {
        fetchAdminOrders(user);
      }
    });
    return () => unsub();
  }, []);

  const fetchAdminOrders = async (user: User) => {
    setLoadingOrders(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-admin-email': user.email || '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.warn('Failed to load orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ALLOWED_ADMIN_EMAIL) {
        alert(`Accès refusé. L’adresse ${result.user.email} n’est pas autorisée.`);
      }
    } catch (err: any) {
      alert(`Erreur d'authentification : ${err.message}`);
    }
  };

  const handleUpdateStatus = async (numero: string, statut: string) => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/admin/orders/${numero}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-admin-email': currentUser.email || '',
        },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.numero === numero ? { ...o, statut: statut as any } : o))
        );
      }
    } catch (e) {
      console.warn('Error updating order:', e);
    }
  };

  const handleUpdateProduct = async (id: string) => {
    if (!currentUser) return;
    const newStock = editingStocks[id];
    const newPrice = editingPrices[id];

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-admin-email': currentUser.email || '',
        },
        body: JSON.stringify({ stock: newStock, prix: newPrice }),
      });
      if (res.ok) {
        setSaveStatus(`Produit ${id} mis à jour.`);
        await refreshStore();
        setTimeout(() => setSaveStatus(null), 2500);
      }
    } catch (e) {
      console.warn('Error updating product:', e);
    }
  };

  if (loadingAuth) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-[#0B1B33]"></i>
      </div>
    );
  }

  // Not authorized
  if (!currentUser || currentUser.email !== ALLOWED_ADMIN_EMAIL) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#0B1B33] text-white flex items-center justify-center mx-auto text-2xl shadow-md">
          <i className="fa-solid fa-lock"></i>
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-black text-[#0B1B33]">Espace Administration</h1>
          <p className="text-xs text-[#46536B]">
            Réservé exclusivement aux administrateurs de la boutique Éclat Express (
            <code className="text-[#0B1B33] font-bold">{ALLOWED_ADMIN_EMAIL}</code>).
          </p>
        </div>

        {currentUser && (
          <p className="text-xs text-[#C1121F] font-bold">
            Connecté avec : {currentUser.email} (Accès non autorisé)
          </p>
        )}

        <div className="pt-2">
          {!currentUser ? (
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-12 bg-white border border-[#C7CCD1] text-[#0B1B33] font-bold text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-[#F5F7FA] transition-colors shadow-xs"
            >
              <i className="fa-brands fa-google text-red-500"></i>
              <span>Se connecter avec Google</span>
            </button>
          ) : (
            <button
              onClick={() => signOut(auth)}
              className="h-10 px-5 bg-[#C1121F] text-white font-bold text-xs rounded-xl"
            >
              Se déconnecter
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-24">
      {/* Admin header */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Tableau de Bord Propriétaire
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1B33]">
            Gestion Éclat Express
          </h1>
          <p className="text-xs text-[#46536B]">
            Connecté en tant que <strong>{currentUser.email}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAdminOrders(currentUser)}
            className="h-10 px-4 rounded-xl border border-[#EBECEF] text-xs font-bold text-[#0B1B33] hover:bg-[#F5F7FA]"
          >
            <i className="fa-solid fa-arrows-rotate mr-1.5"></i>
            Actualiser
          </button>
          <button
            onClick={() => signOut(auth)}
            className="h-10 px-4 rounded-xl bg-[#F5F7FA] text-[#C1121F] text-xs font-bold hover:bg-red-50"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-green-50 text-green-800 border border-green-200 text-xs font-bold rounded-xl animate-fade-in">
          {saveStatus}
        </div>
      )}

      {/* Orders Management */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#0B1B33] flex items-center gap-2">
            <i className="fa-solid fa-receipt text-[#D9C2A3]"></i>
            <span>Commandes récentes ({orders.length})</span>
          </h2>
        </div>

        {loadingOrders ? (
          <p className="text-xs text-[#46536B]">Chargement des commandes...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-[#46536B] italic">Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EBECEF] text-[#46536B] font-bold">
                  <th className="py-2.5 px-3">Numéro</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Téléphone</th>
                  <th className="py-2.5 px-3">Adresse &amp; Créneau</th>
                  <th className="py-2.5 px-3">Articles</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBECEF]">
                {orders.map((ord) => (
                  <tr key={ord.numero} className="hover:bg-[#F5F7FA]">
                    <td className="py-3 px-3 font-mono font-bold text-[#0B1B33]">{ord.numero}</td>
                    <td className="py-3 px-3 font-semibold text-[#0B1B33]">{ord.nom}</td>
                    <td className="py-3 px-3 font-mono">
                      <a
                        href={`https://wa.me/${ord.telephone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#25D366] font-bold hover:underline"
                      >
                        {ord.telephone}
                      </a>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-[#46536B]">
                      {ord.adresse} ({ord.creneau})
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-[#46536B]">
                        {ord.lignes?.map((l) => `${l.quantite}x ${l.nom}`).join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-[#0B1B33] tabular-nums">
                      {ord.total?.toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={ord.statut}
                        onChange={(e) => handleUpdateStatus(ord.numero, e.target.value)}
                        className={`h-8 px-2 rounded-lg text-xs font-bold border focus:outline-none ${
                          ord.statut === 'nouvelle'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.statut === 'confirmee'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            : ord.statut === 'en_livraison'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : ord.statut === 'livree'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="nouvelle">Nouvelle</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="en_livraison">En livraison</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock & Prices Editor */}
      <div className="bg-white rounded-2xl border border-[#EBECEF] p-6 shadow-card space-y-4">
        <h2 className="text-base font-extrabold text-[#0B1B33] flex items-center gap-2">
          <i className="fa-solid fa-boxes-stacked text-[#D9C2A3]"></i>
          <span>Gestion des Stocks et Prix en Temps Réel</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EBECEF] text-[#46536B] font-bold">
                <th className="py-2.5 px-3">Article</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Stock Actuel</th>
                <th className="py-2.5 px-3">Prix (FCFA)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBECEF]">
              {produits.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F5F7FA]">
                  <td className="py-3 px-3 font-bold text-[#0B1B33]">{prod.nom}</td>
                  <td className="py-3 px-3 text-[#46536B]">{prod.categorieSlug}</td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      defaultValue={prod.stock}
                      onChange={(e) =>
                        setEditingStocks((prev) => ({
                          ...prev,
                          [prod.id]: Number(e.target.value),
                        }))
                      }
                      className="w-20 h-8 px-2 border border-[#EBECEF] rounded-lg text-xs font-bold text-[#0B1B33]"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      defaultValue={prod.prix}
                      step="500"
                      onChange={(e) =>
                        setEditingPrices((prev) => ({
                          ...prev,
                          [prod.id]: Number(e.target.value),
                        }))
                      }
                      className="w-28 h-8 px-2 border border-[#EBECEF] rounded-lg text-xs font-bold text-[#0B1B33]"
                    />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleUpdateProduct(prod.id)}
                      className="h-8 px-3 bg-[#0B1B33] text-white rounded-lg text-xs font-bold hover:bg-[#162a4a]"
                    >
                      Enregistrer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
