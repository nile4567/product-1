import { Star, MapPin, Footprints, Car, ArrowUpRight, Flame } from 'lucide-react';
import { PizzaShop } from '../types/pizza';
import { formatDistance, formatDuration, calculateWeightedScore } from '../utils/distance';

interface PizzaCardProps {
  shop: PizzaShop;
  isSelected: boolean;
  rankIndex: number;
  onSelect: (shop: PizzaShop) => void;
  onOpenDetails: (shop: PizzaShop) => void;
  onPlotRoute: (shop: PizzaShop) => void;
  distanceUnit: 'miles' | 'km';
}

export function PizzaCard({
  shop,
  isSelected,
  rankIndex,
  onSelect,
  onOpenDetails,
  onPlotRoute,
  distanceUnit,
}: PizzaCardProps) {
  const weightedScore = calculateWeightedScore(shop.rating, shop.userRatingCount);

  return (
    <article
      onClick={() => onSelect(shop)}
      className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'bg-stone-800/90 border-orange-500/70 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/50'
          : 'bg-stone-850/60 border-stone-800/80 hover:bg-stone-800/60 hover:border-stone-700'
      }`}
    >
      <div className="flex gap-3.5">
        {/* Photo / Thumbnail with Fallback */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-stone-800">
          {shop.photoUrl ? (
            <img
              src={shop.photoUrl}
              alt={shop.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 text-stone-500 text-xs text-center p-2">
              <span className="text-xl mb-1">🍕</span>
              <span>Pizza Artisan</span>
            </div>
          )}

          {/* Ranking Index */}
          <div className="absolute top-1.5 left-1.5 bg-stone-900/85 backdrop-blur-sm text-stone-200 text-[11px] font-bold px-1.5 py-0.5 rounded font-mono tabular-nums border border-stone-700/60">
            #{rankIndex + 1}
          </div>

          {shop.woodFired && (
            <div
              title="Wood-fired oven"
              className="absolute bottom-1.5 left-1.5 bg-stone-900/85 backdrop-blur-sm text-orange-400 p-1 rounded border border-stone-700/60"
            >
              <Flame className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-white tracking-tight truncate group-hover:text-orange-400 transition-colors">
                {shop.name}
              </h3>
              <span className="text-xs font-semibold text-stone-400 shrink-0 font-mono">
                {'$'.repeat(shop.priceLevel)}
              </span>
            </div>

            {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
            <div className="flex items-center flex-wrap gap-x-1.5 text-xs text-stone-400 mt-1">
              <div className="flex items-center text-amber-400 font-semibold gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span className="font-mono tabular-nums">{shop.rating.toFixed(1)}</span>
              </div>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="font-mono tabular-nums text-stone-400">
                {shop.userRatingCount.toLocaleString()} reviews
              </span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="text-stone-300 font-mono text-[11px] font-medium text-emerald-400">
                {weightedScore} pts
              </span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-1 text-xs text-stone-400 mt-1.5 truncate">
              <MapPin className="w-3 h-3 shrink-0 text-stone-500" />
              <span className="truncate">{shop.address}</span>
            </div>

            {/* Styles & Specialty highlight */}
            <div className="text-xs text-stone-400 mt-1 truncate">
              <span>{shop.pizzaStyles.slice(0, 2).join(' · ')}</span>
              {shop.specialtyPie && (
                <>
                  <span aria-hidden="true" className="text-stone-600 mx-1">·</span>
                  <span className="text-orange-300/90 italic truncate">{shop.specialtyPie}</span>
                </>
              )}
            </div>
          </div>

          {/* Real-time Distance & Action Bar */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-800/80">
            {/* Real-time Distance Tracking Metrics */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 font-mono tabular-nums font-semibold text-orange-400">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                <span>{formatDistance(shop.distanceMeters, distanceUnit)}</span>
              </div>
              {shop.walkDurationSeconds && (
                <>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <div className="flex items-center gap-1 text-stone-400 font-mono tabular-nums text-[11px]" title="Walking ETA">
                    <Footprints className="w-3 h-3 text-stone-500" />
                    <span>{formatDuration(shop.walkDurationSeconds)}</span>
                  </div>
                </>
              )}
              {shop.durationSeconds && (
                <>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <div className="flex items-center gap-1 text-stone-400 font-mono tabular-nums text-[11px]" title="Drive ETA">
                    <Car className="w-3 h-3 text-stone-500" />
                    <span>{formatDuration(shop.durationSeconds)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onPlotRoute(shop)}
                title="Plot live route to this pizzeria"
                className="px-2.5 py-1 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 hover:border-orange-500/50 transition-colors flex items-center gap-1"
              >
                <span>Route</span>
              </button>
              <button
                onClick={() => onOpenDetails(shop)}
                title="View full menu details & community ratings"
                className="p-1 text-stone-400 hover:text-white hover:bg-stone-750 rounded-md transition-colors"
                aria-label={`View details for ${shop.name}`}
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
