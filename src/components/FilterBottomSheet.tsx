import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface FilterState {
  univers: string[];
  maxBudget: number;
  livrableAvant31Only: boolean;
  typeEspace: string[];
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  onReset: () => void;
}

export const UNIVERS_OPTIONS = [
  { id: 'packs', label: 'Packs complets' },
  { id: 'guirlandes', label: 'Guirlandes & Rideaux' },
  { id: 'table-bougies', label: 'Bougies LED' },
  { id: 'table', label: 'Déco de Table' },
  { id: 'compte-a-rebours', label: 'Chiffres & Bannières' },
];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  totalMatches,
  onReset,
}) => {
  const toggleUnivers = (id: string) => {
    setFilters((prev) => {
      const exists = prev.univers.includes(id);
      const updated = exists ? prev.univers.filter((u) => u !== id) : [...prev.univers, id];
      return { ...prev, univers: updated };
    });
  };

  const toggleTypeEspace = (type: string) => {
    setFilters((prev) => {
      const exists = prev.typeEspace.includes(type);
      const updated = exists ? prev.typeEspace.filter((t) => t !== type) : [...prev.typeEspace, type];
      return { ...prev, typeEspace: updated };
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0B1B33]/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal / Sheet Content */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col justify-between shadow-2xl z-10 overflow-hidden"
          >
            {/* Grab handle on mobile */}
            <div className="w-12 h-1.5 bg-[#EBECEF] rounded-full mx-auto mt-3 sm:hidden"></div>

            {/* Header */}
            <div className="p-5 border-b border-[#EBECEF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-sliders text-[#0B1B33]"></i>
                <h3 className="font-extrabold text-base text-[#0B1B33]">Filtrer les décorations</h3>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F5F7FA] text-[#46536B] hover:text-[#0B1B33] flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-6">
              {/* Univers de fête */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-[#0B1B33]">Univers de décoration</span>
                <div className="flex flex-wrap gap-2">
                  {UNIVERS_OPTIONS.map((opt) => {
                    const isSelected = filters.univers.includes(opt.id);
                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={opt.id}
                        type="button"
                        onClick={() => toggleUnivers(opt.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-[#0B1B33] text-white border-[#0B1B33] shadow-xs'
                            : 'bg-white text-[#0B1B33] border-[#EBECEF] hover:bg-[#F5F7FA]'
                        }`}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Budget slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-[#0B1B33]">
                  <span>Budget maximum</span>
                  <span className="tabular-nums font-black text-base text-[#0B1B33]">
                    {filters.maxBudget >= 50000
                      ? 'Sans limite'
                      : `${filters.maxBudget.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="5000"
                  value={filters.maxBudget}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxBudget: Number(e.target.value) }))
                  }
                  className="w-full accent-[#0B1B33] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#46536B] font-semibold">
                  <span>5 000 FCFA</span>
                  <span>25 000 FCFA</span>
                  <span>50 000+ FCFA</span>
                </div>
              </div>

              {/* Livraison garantie avant le 31 toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F7FA] border border-[#EBECEF]">
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-[#0B1B33] flex items-center gap-1.5">
                    <i className="fa-solid fa-bolt text-[#D9C2A3]"></i>
                    <span>Livraison express avant le 31 uniquement</span>
                  </p>
                  <p className="text-[11px] text-[#46536B]">
                    Exclut les articles en cours de réapprovisionnement.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      livrableAvant31Only: !prev.livrableAvant31Only,
                    }))
                  }
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    filters.livrableAvant31Only ? 'bg-[#0B1B33]' : 'bg-[#C7CCD1]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      filters.livrableAvant31Only ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Type d'espace */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-[#0B1B33]">Type d'espace</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'salon', label: 'Salon / Appart' },
                    { id: 'villa', label: 'Grande Villa' },
                    { id: 'table', label: 'Table & Dîner' },
                  ].map((esp) => {
                    const isSelected = filters.typeEspace.includes(esp.id);
                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={esp.id}
                        type="button"
                        onClick={() => toggleTypeEspace(esp.id)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-colors ${
                          isSelected
                            ? 'bg-[#0B1B33] text-white border-[#0B1B33]'
                            : 'bg-white text-[#0B1B33] border-[#EBECEF] hover:bg-[#F5F7FA]'
                        }`}
                      >
                        {esp.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-[#EBECEF] bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={onReset}
                className="h-12 px-5 rounded-xl border border-[#EBECEF] text-xs font-bold text-[#0B1B33] hover:bg-[#F5F7FA] transition-colors"
              >
                Effacer
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onClose}
                className="flex-1 h-12 bg-[#0B1B33] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#162a4a] transition-colors shadow-sm"
              >
                <span>Voir les articles</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] tabular-nums">
                  {totalMatches}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
