import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { PackCard } from '../components/PackCard.tsx';
import { FilterBottomSheet, FilterState } from '../components/FilterBottomSheet.tsx';
import { SEOHead } from '../components/SEOHead.tsx';

export const BoutiquePage: React.FC = () => {
  const { categories, produits, packs, quizVibe, setQuizVibe } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nouveautes' | 'prix-asc' | 'prix-desc'>('nouveautes');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Read URL query params on mount and URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const q = params.get('q');
    if (cat) setSelectedCat(cat);
    if (q) setSearch(q);
  }, []);

  const [filters, setFilters] = useState<FilterState>(() => ({
    univers: quizVibe
      ? quizVibe === 'chic'
        ? ['table', 'table-bougies']
        : quizVibe === 'festif'
        ? ['packs', 'compte-a-rebours']
        : ['packs', 'guirlandes']
      : [],
    maxBudget: 50000,
    livrableAvant31Only: false,
    typeEspace: [],
  }));

  const resetFilters = () => {
    setFilters({
      univers: [],
      maxBudget: 50000,
      livrableAvant31Only: false,
      typeEspace: [],
    });
    setSelectedCat('all');
    setSearch('');
    setQuizVibe(null);
  };

  // Combine items (packs + products)
  const allItems = useMemo(() => {
    const pks = packs.map((pk) => ({ ...pk, isPack: true as const }));
    const prds = produits.map((pr) => ({ ...pr, isPack: false as const }));
    return [...pks, ...prds];
  }, [packs, produits]);

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // 1. Search text
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = item.nom.toLowerCase().includes(query);
        const matchDesc = item.isPack
          ? item.description.toLowerCase().includes(query)
          : item.descriptionCourte.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // 2. Selected Category Pill
      if (selectedCat !== 'all') {
        if (selectedCat === 'packs') {
          if (!item.isPack) return false;
        } else {
          if (item.isPack) return false;
          if ((item as any).categorieSlug !== selectedCat) return false;
        }
      }

      // 3. Univers multi-filter from bottom sheet
      if (filters.univers.length > 0) {
        let matchUnivers = false;
        for (const u of filters.univers) {
          if (u === 'packs' && item.isPack) matchUnivers = true;
          if (!item.isPack && (item as any).categorieSlug === u) matchUnivers = true;
        }
        if (!matchUnivers) return false;
      }

      // 4. Budget slider
      if (item.prix > filters.maxBudget) return false;

      // 5. Livrable avant 31
      if (filters.livrableAvant31Only) {
        if (!item.isPack && !(item as any).livrableAvant31) return false;
      }

      // 6. Type d'espace
      if (filters.typeEspace.length > 0) {
        const itemEspaces = item.typeEspace || [];
        const match = filters.typeEspace.some((esp) => itemEspaces.includes(esp as any));
        if (!match) return false;
      }

      return true;
    });
  }, [allItems, search, selectedCat, filters]);

  // Sort items
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    if (sortBy === 'prix-asc') {
      list.sort((a, b) => a.prix - b.prix);
    } else if (sortBy === 'prix-desc') {
      list.sort((a, b) => b.prix - a.prix);
    }
    return list;
  }, [filteredItems, sortBy]);

  const activeFilterCount =
    (filters.univers.length > 0 ? 1 : 0) +
    (filters.maxBudget < 50000 ? 1 : 0) +
    (filters.livrableAvant31Only ? 1 : 0) +
    (filters.typeEspace.length > 0 ? 1 : 0);

  return (
    <>
      <SEOHead
        title="La Boutique de Fête Réveillon | Éclat Express"
        description="Catalogue complet de décorations pour le 31 décembre : guirlandes lumineuses, rideaux cascade, bougies LED et chiffres géants 2027."
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
        {/* Header Banner */}
        <div className="space-y-1">
          <span className="badge-champagne text-[10px] uppercase tracking-wider">
            Édition Festive 2027
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1B33] tracking-tight">
            La Boutique de Fête
          </h1>
          <p className="text-xs sm:text-sm text-[#46536B]">
            Tout pour illuminer votre 31 décembre avec élégance et simplicité.
          </p>
        </div>

        {/* Search Bar (Visible on mobile, supplements desktop header search) */}
        <div className="relative md:hidden">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#46536B] text-sm"></i>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une guirlande, un pack, des bougies..."
            className="w-full h-12 pl-11 pr-10 rounded-xl bg-white border border-[#EBECEF] text-xs sm:text-sm text-[#0B1B33] placeholder-[#46536B] focus:outline-none focus:border-[#0B1B33] shadow-card"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EBECEF] text-[#46536B] flex items-center justify-center text-xs"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCat === 'all'
                ? 'bg-[#0B1B33] text-white shadow-xs'
                : 'bg-white text-[#0B1B33] border border-[#EBECEF] hover:bg-[#F5F7FA]'
            }`}
          >
            Tout ({allItems.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCat === cat.slug
                  ? 'bg-[#0B1B33] text-white shadow-xs'
                  : 'bg-white text-[#0B1B33] border border-[#EBECEF] hover:bg-[#F5F7FA]'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Sub-bar: Count, Sort, and Filter Trigger */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EBECEF] text-xs text-[#46536B]">
          <div className="flex items-center gap-1.5 font-bold text-[#0B1B33]">
            <i className="fa-solid fa-sparkles text-[#D9C2A3]"></i>
            <span>
              {sortedItems.length} article{sortedItems.length > 1 ? 's' : ''} trouvé{sortedItems.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 bg-white border border-[#EBECEF] rounded-xl text-xs font-semibold text-[#0B1B33] focus:outline-none"
            >
              <option value="nouveautes">Nouveautés</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={() => setFilterSheetOpen(true)}
              className={`h-10 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                activeFilterCount > 0
                  ? 'bg-[#0B1B33] text-white border-[#0B1B33]'
                  : 'bg-white text-[#0B1B33] border-[#EBECEF] hover:bg-[#F5F7FA]'
              }`}
            >
              <i className="fa-solid fa-sliders"></i>
              <span>Filtres</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#D9C2A3] text-[#0B1B33] w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filters pills */}
        {(activeFilterCount > 0 || search || selectedCat !== 'all' || quizVibe) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#46536B]">Filtres actifs :</span>
            {search && (
              <span className="text-xs bg-[#EBECEF] text-[#0B1B33] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                Recherche: "{search}"
                <button onClick={() => setSearch('')}>✕</button>
              </span>
            )}
            {selectedCat !== 'all' && (
              <span className="text-xs bg-[#EBECEF] text-[#0B1B33] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                Catégorie: {categories.find((c) => c.slug === selectedCat)?.nom || selectedCat}
                <button onClick={() => setSelectedCat('all')}>✕</button>
              </span>
            )}
            {filters.maxBudget < 50000 && (
              <span className="text-xs bg-[#EBECEF] text-[#0B1B33] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                Max {filters.maxBudget.toLocaleString('fr-FR')} F
                <button onClick={() => setFilters((p) => ({ ...p, maxBudget: 50000 }))}>✕</button>
              </span>
            )}
            {filters.livrableAvant31Only && (
              <span className="text-xs bg-[#EBECEF] text-[#0B1B33] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                Livrable avant le 31
                <button onClick={() => setFilters((p) => ({ ...p, livrableAvant31Only: false }))}>✕</button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-[#C1121F] font-bold hover:underline ml-1"
            >
              Tout effacer
            </button>
          </div>
        )}

        {/* Multi-column Products & Packs Grid (4 cols on desktop) */}
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedItems.map((item) =>
              item.isPack ? (
                <PackCard key={item.id} pack={item as any} />
              ) : (
                <ProductCard key={item.id} produit={item as any} />
              )
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#EBECEF] p-12 text-center space-y-4 shadow-card">
            <div className="w-16 h-16 rounded-full bg-[#F5F7FA] text-[#46536B] flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0B1B33]">Aucun article ne correspond</h3>
              <p className="text-xs text-[#46536B] max-w-sm mx-auto">
                Essayez d'ajuster votre budget ou d'élargir vos filtres d'espace.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="h-11 px-6 bg-[#0B1B33] text-white text-xs font-bold rounded-xl hover:bg-[#162a4a] transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Filter Bottom Sheet / Modal */}
        <FilterBottomSheet
          isOpen={filterSheetOpen}
          onClose={() => setFilterSheetOpen(false)}
          filters={filters}
          setFilters={setFilters}
          totalMatches={sortedItems.length}
          onReset={resetFilters}
        />
      </div>
    </>
  );
};
