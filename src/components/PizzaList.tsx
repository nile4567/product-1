import { Search, SlidersHorizontal, ArrowUpDown, Flame, Star, Clock } from 'lucide-react';
import { PizzaShop, FilterState, SortOption } from '../types/pizza';
import { PizzaCard } from './PizzaCard';

interface PizzaListProps {
  shops: PizzaShop[];
  selectedShop: PizzaShop | null;
  onSelectShop: (shop: PizzaShop) => void;
  onOpenDetails: (shop: PizzaShop) => void;
  onPlotRoute: (shop: PizzaShop) => void;
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  totalFound: number;
}

export function PizzaList({
  shops,
  selectedShop,
  onSelectShop,
  onOpenDetails,
  onPlotRoute,
  filters,
  onUpdateFilters,
  totalFound,
}: PizzaListProps) {
  return (
    <div className="flex flex-col h-full bg-stone-900 border-r border-stone-800 text-stone-100">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-stone-800 space-y-3 shrink-0 bg-stone-900/90 backdrop-blur-md">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search pizza, style (Detroit, Neapolitan), or crust..."
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            className="w-full bg-stone-800/90 border border-stone-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => onUpdateFilters({ minRating: filters.minRating === 4.5 ? 0 : 4.5 })}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
              filters.minRating >= 4.5
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span>4.5+ Stars</span>
          </button>

          <button
            onClick={() => onUpdateFilters({ openOnly: !filters.openOnly })}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
              filters.openOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Open Now</span>
          </button>

          <button
            onClick={() =>
              onUpdateFilters({
                selectedStyle: filters.selectedStyle === 'Wood-fired' ? null : 'Wood-fired',
              })
            }
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
              filters.selectedStyle === 'Wood-fired'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Wood-Fired</span>
          </button>

          <button
            onClick={() =>
              onUpdateFilters({
                selectedStyle: filters.selectedStyle === 'Detroit' ? null : 'Detroit',
              })
            }
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
              filters.selectedStyle === 'Detroit'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800'
            }`}
          >
            <span>Detroit Pan</span>
          </button>

          <button
            onClick={() =>
              onUpdateFilters({
                maxDistanceMiles: filters.maxDistanceMiles === 3 ? 50 : 3,
              })
            }
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
              filters.maxDistanceMiles <= 3
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-800'
            }`}
          >
            <span>Under 3 mi</span>
          </button>
        </div>

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
          <div className="font-mono tabular-nums">
            Showing <b className="text-stone-200">{shops.length}</b> pizzerias
          </div>

          <div className="flex items-center gap-2">
            {/* Distance unit toggle */}
            <div className="flex items-center bg-stone-800 rounded-md p-0.5 border border-stone-700 text-[11px] font-mono">
              <button
                onClick={() => onUpdateFilters({ distanceUnit: 'miles' })}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  filters.distanceUnit === 'miles'
                    ? 'bg-stone-700 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                mi
              </button>
              <button
                onClick={() => onUpdateFilters({ distanceUnit: 'km' })}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  filters.distanceUnit === 'km'
                    ? 'bg-stone-700 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                km
              </button>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={filters.sortBy}
                onChange={(e) => onUpdateFilters({ sortBy: e.target.value as SortOption })}
                className="bg-stone-800/90 text-stone-200 border border-stone-700/80 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                aria-label="Sort pizza shops"
              >
                <option value="weighted_rating">Weighted Index (Best)</option>
                <option value="highest_rating">Highest Stars</option>
                <option value="closest_distance">Closest Distance</option>
                <option value="fastest_route">Fastest ETA</option>
                <option value="most_reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Pizza List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {shops.length > 0 ? (
          shops.map((shop, index) => (
            <PizzaCard
              key={shop.id}
              shop={shop}
              rankIndex={index}
              isSelected={selectedShop?.id === shop.id}
              onSelect={onSelectShop}
              onOpenDetails={onOpenDetails}
              onPlotRoute={onPlotRoute}
              distanceUnit={filters.distanceUnit}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-stone-500 space-y-3">
            <span className="text-4xl">🍕</span>
            <p className="text-sm font-medium text-stone-400">
              No pizza shops match your active filters.
            </p>
            <button
              onClick={() =>
                onUpdateFilters({
                  searchQuery: '',
                  minRating: 0,
                  maxDistanceMiles: 50,
                  openOnly: false,
                  selectedStyle: null,
                })
              }
              className="px-3.5 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
