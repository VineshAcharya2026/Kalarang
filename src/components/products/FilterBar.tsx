import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, RefreshCw, X } from 'lucide-react';

interface FilterBarProps {
  selectedOccasions: string[];
  setSelectedOccasions: (occasions: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  availableOccasions: string[];
  availableColors: string[];
  onClearFilters: () => void;
}

export default function FilterBar({
  selectedOccasions,
  setSelectedOccasions,
  selectedColors,
  setSelectedColors,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  availableOccasions,
  availableColors,
  onClearFilters,
}: FilterBarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const toggleOccasion = (occ: string) => {
    if (selectedOccasions.includes(occ)) {
      setSelectedOccasions(selectedOccasions.filter((o) => o !== occ));
    } else {
      setSelectedOccasions([...selectedOccasions, occ]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const FilterSections = () => (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Sorting */}
      <div>
        <h4 className="text-xs font-bold text-[#1C1008] uppercase tracking-wider mb-2.5">
          Sort Catalog
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
        >
          <option value="newest">New Arrivals First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <hr className="border-[#B8860B]/10" />

      {/* Max Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-xs font-bold text-[#7A1C2E]">
            ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="35000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full accent-[#7A1C2E] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>₹500</span>
          <span>₹35,000</span>
        </div>
      </div>

      <hr className="border-[#B8860B]/10" />

      {/* Occasions Checkboxes */}
      <div>
        <h4 className="text-xs font-bold text-[#1C1008] uppercase tracking-wider mb-3">
          Shop by Occasion
        </h4>
        <div className="flex flex-wrap md:flex-col gap-2">
          {availableOccasions.map((occ) => (
            <label
              key={occ}
              className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-700 hover:text-[#7A1C2E] select-none"
            >
              <input
                type="checkbox"
                checked={selectedOccasions.includes(occ)}
                onChange={() => toggleOccasion(occ)}
                className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] accent-[#7A1C2E] h-4 w-4"
              />
              {occ}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-[#B8860B]/10" />

      {/* Colors Filters */}
      <div>
        <h4 className="text-xs font-bold text-[#1C1008] uppercase tracking-wider mb-3">
          Select Color
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableColors.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-[#7A1C2E] text-white border-transparent'
                    : 'bg-[#FDF8F2] text-[#1C1008] border-[#B8860B]/15 hover:border-[#7A1C2E]/50'
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Trigger */}
      {(selectedOccasions.length > 0 || selectedColors.length > 0 || maxPrice < 35000) && (
        <button
          onClick={onClearFilters}
          className="w-full mt-2 border border-[#7A1C2E] text-[#7A1C2E] hover:bg-[#7A1C2E] hover:text-white transition-colors py-2 px-3 rounded text-xs px-3 font-semibold flex items-center justify-center gap-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          Reset All Filters
        </button>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Filter View */}
      <aside id="desktop-filters" className="hidden lg:block w-64 bg-[#FDF8F2] border border-[#B8860B]/15 p-5 rounded-md shadow-sm h-fit">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#B8860B]/10">
          <h3 className="font-serif text-lg font-bold text-[#1C1008] flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-[#B8860B]" /> Filters
          </h3>
        </div>
        <FilterSections />
      </aside>

      {/* Mobile Filter Trigger Button */}
      <div id="mobile-filters-trigger" className="lg:hidden flex justify-between items-center bg-[#FDF8F2] p-3 rounded border border-[#B8860B]/15 mb-4">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="flex items-center gap-2 font-serif text-base font-bold text-[#1C1008] focus:outline-none cursor-pointer"
        >
          <SlidersHorizontal className="h-4.5 w-4.5 text-[#B8860B]" />
          Refine Saree Catalog
        </button>
        <span className="text-xs font-sans text-gray-400">
          {(selectedOccasions.length + selectedColors.length) > 0 
            ? `${selectedOccasions.length + selectedColors.length} Active` 
            : 'All Sarees'}
        </span>
      </div>

      {/* Mobile Filter Drawer Backdrop / Modal */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-[#1C1008]/40" 
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-80 bg-[#FDF8F2] h-full shadow-2xl p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#B8860B]/15">
              <h3 className="font-serif text-xl font-bold text-[#1C1008] flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#B8860B]" /> Refine
              </h3>
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <FilterSections />
          </div>
        </div>
      )}
    </>
  );
}
