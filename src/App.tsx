import { useState, useMemo, useEffect, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PizzaShop, FilterState, PizzaReview } from './types/pizza';
import {
  INITIAL_PIZZA_SHOPS,
  LocationPreset,
  searchNearbyPlaces,
} from './services/pizzaService';
import {
  computeDistanceMeters,
  estimateDuration,
  calculateWeightedScore,
} from './utils/distance';
import {
  loadCachedShops,
  persistShops,
  saveReviewForShop,
  persistLocation,
} from './services/storageService';
import { useRealTimeLocation } from './hooks/useRealTimeLocation';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { TopBar } from './components/TopBar';
import { PizzaList } from './components/PizzaList';
import { PizzaMap } from './components/PizzaMap';
import { ShopDetailsModal } from './components/ShopDetailsModal';
import { QuotaBanner } from './components/QuotaBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Map as MapIcon, List as ListIcon, Compass } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function App() {
  const isOnline = useOnlineStatus();
  const {
    userLocation,
    isTracking,
    hasGpsFix,
    startGpsTracking,
    stopGpsTracking,
    setManualLocation,
    startSimulatedMovement,
    stopSimulatedMovement,
    isSimulating,
  } = useRealTimeLocation();

  const [currentPresetName, setCurrentPresetName] = useState<string>('Current GPS');
  const [allShops, setAllShops] = useState<PizzaShop[]>(() => {
    return loadCachedShops(INITIAL_PIZZA_SHOPS).shops;
  });
  const [selectedShop, setSelectedShop] = useState<PizzaShop | null>(null);
  const [activeRouteShop, setActiveRouteShop] = useState<PizzaShop | null>(null);
  const [detailsShop, setDetailsShop] = useState<PizzaShop | null>(null);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // Synchronize pizza shop cache whenever shops update
  useEffect(() => {
    persistShops(allShops);
  }, [allShops]);

  // Synchronize last known location
  useEffect(() => {
    persistLocation(userLocation);
  }, [userLocation]);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    minRating: 0,
    maxDistanceMiles: 50,
    openOnly: false,
    selectedStyle: null,
    priceLevel: null,
    sortBy: 'weighted_rating',
    distanceUnit: 'miles',
  });

  const handleUpdateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  // When user location changes, update real-time distance and estimated times for all shops
  const shopsWithDistances = useMemo(() => {
    return allShops.map((shop) => {
      const distanceMeters = computeDistanceMeters(
        userLocation.lat,
        userLocation.lng,
        shop.lat,
        shop.lng
      );
      const durationSeconds = estimateDuration(distanceMeters, 'drive');
      const walkDurationSeconds = estimateDuration(distanceMeters, 'walk');

      return {
        ...shop,
        distanceMeters,
        durationSeconds,
        walkDurationSeconds,
      };
    });
  }, [allShops, userLocation.lat, userLocation.lng]);

  // Dynamically attempt Google Maps Places API search around current coordinates
  const triggerNearbySearch = useCallback(async (lat: number, lng: number) => {
    try {
      const gmpPlaces = await searchNearbyPlaces(lat, lng, 'pizza');
      if (gmpPlaces && gmpPlaces.length > 0) {
        setAllShops((prev) => {
          // Merge newly fetched places while preserving custom user reviews
          const existingMap = new Map(prev.map((s) => [s.id, s]));
          const combined = [...gmpPlaces];
          combined.forEach((p) => {
            if (existingMap.has(p.id)) {
              const existing = existingMap.get(p.id)!;
              p.userReviews = existing.userReviews;
            }
          });
          return combined;
        });
      }
    } catch {
      // Keep existing curated data on any search failure
    }
  }, []);

  // When preset is selected by user
  const handleSelectPreset = useCallback(
    (preset: LocationPreset) => {
      setCurrentPresetName(preset.name);
      setManualLocation(preset.lat, preset.lng, preset.name);
      triggerNearbySearch(preset.lat, preset.lng);
    },
    [setManualLocation, triggerNearbySearch]
  );

  // Toggle tracking
  const handleToggleTracking = useCallback(() => {
    if (isTracking) {
      stopGpsTracking();
    } else {
      setCurrentPresetName('Current GPS');
      startGpsTracking();
    }
  }, [isTracking, startGpsTracking, stopGpsTracking]);

  // Filter and sort shops
  const filteredAndSortedShops = useMemo(() => {
    let result = [...shopsWithDistances];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.pizzaStyles.some((st) => st.toLowerCase().includes(q)) ||
          s.specialtyPie?.toLowerCase().includes(q)
      );
    }

    // Min rating filter
    if (filters.minRating > 0) {
      result = result.filter((s) => s.rating >= filters.minRating);
    }

    // Max distance filter (in miles)
    if (filters.maxDistanceMiles < 50) {
      const maxMeters = filters.maxDistanceMiles * 1609.344;
      result = result.filter((s) => (s.distanceMeters ?? 0) <= maxMeters);
    }

    // Open now filter
    if (filters.openOnly) {
      result = result.filter((s) => s.isOpen !== false);
    }

    // Pizza style filter
    if (filters.selectedStyle) {
      result = result.filter((s) =>
        s.pizzaStyles.some((st) =>
          st.toLowerCase().includes(filters.selectedStyle!.toLowerCase())
        )
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (filters.sortBy === 'weighted_rating') {
        const scoreA = calculateWeightedScore(a.rating, a.userRatingCount);
        const scoreB = calculateWeightedScore(b.rating, b.userRatingCount);
        return scoreB - scoreA;
      }
      if (filters.sortBy === 'highest_rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'closest_distance') {
        return (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0);
      }
      if (filters.sortBy === 'fastest_route') {
        return (a.durationSeconds ?? 0) - (b.durationSeconds ?? 0);
      }
      if (filters.sortBy === 'most_reviews') {
        return b.userRatingCount - a.userRatingCount;
      }
      return 0;
    });

    return result;
  }, [shopsWithDistances, filters]);

  // Handle route plotting action
  const handlePlotRoute = useCallback((shop: PizzaShop) => {
    setSelectedShop(shop);
    setActiveRouteShop(shop);
    setMobileTab('map');
  }, []);

  // Handle adding user review with offline persistence
  const handleAddReview = useCallback(
    (shopId: string, review: PizzaReview) => {
      // Persist to local storage immediately
      saveReviewForShop(shopId, review, !isOnline);

      setAllShops((prev) =>
        prev.map((shop) => {
          if (shop.id !== shopId) return shop;
          const updatedReviews = [review, ...shop.userReviews];
          const newRating =
            (shop.rating * shop.userRatingCount + review.rating) /
            (shop.userRatingCount + 1);
          return {
            ...shop,
            rating: Math.round(newRating * 10) / 10,
            userRatingCount: shop.userRatingCount + 1,
            userReviews: updatedReviews,
          };
        })
      );
    },
    [isOnline]
  );

  // TopBar Nav clicks
  const handleNavClick = useCallback(
    (action: string) => {
      if (action === 'top_rated') {
        handleUpdateFilters({ sortBy: 'weighted_rating', minRating: 4.5 });
      } else if (action === 'nearest') {
        handleUpdateFilters({ sortBy: 'closest_distance' });
      } else if (action === 'wood_fired') {
        handleUpdateFilters({ selectedStyle: 'Wood-fired' });
      } else if (action === 'detroit') {
        handleUpdateFilters({ selectedStyle: 'Detroit' });
      }
    },
    [handleUpdateFilters]
  );

  return (
    <APIProvider
      apiKey={API_KEY}
      libraries={['places', 'routes', 'geometry', 'marker']}
    >
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-900 text-stone-100">
        {/* GMP Quota Banner */}
        <QuotaBanner />

        {/* Offline Connectivity & Cache Indicator */}
        <OfflineIndicator
          onManualRefresh={() => triggerNearbySearch(userLocation.lat, userLocation.lng)}
        />

        {/* Top Bar Header Contract */}
        <TopBar
          isTracking={isTracking}
          hasGpsFix={hasGpsFix}
          onToggleTracking={handleToggleTracking}
          onSelectPreset={handleSelectPreset}
          currentPresetName={currentPresetName}
          onNavClick={handleNavClick}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 flex flex-col md:flex-row min-h-0 relative">
          {/* Left Column: Master Pizza List */}
          <section
            className={`w-full md:w-[480px] lg:w-[540px] shrink-0 h-full flex flex-col ${
              mobileTab === 'list' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <PizzaList
              shops={filteredAndSortedShops}
              selectedShop={selectedShop}
              onSelectShop={(shop) => {
                setSelectedShop(shop);
                setActiveRouteShop(shop);
              }}
              onOpenDetails={(shop) => setDetailsShop(shop)}
              onPlotRoute={handlePlotRoute}
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              totalFound={filteredAndSortedShops.length}
            />
          </section>

          {/* Right Column: Google Maps Interface */}
          <section
            className={`flex-1 h-full min-h-0 relative ${
              mobileTab === 'map' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <PizzaMap
              shops={filteredAndSortedShops}
              userLocation={userLocation}
              selectedShop={selectedShop}
              activeRouteShop={activeRouteShop}
              onSelectShop={setSelectedShop}
              onPlotRoute={handlePlotRoute}
              onOpenDetails={(shop) => setDetailsShop(shop)}
              isSimulating={isSimulating}
              onStartSimulation={(shop, mode) =>
                startSimulatedMovement(shop.lat, shop.lng, mode)
              }
              onStopSimulation={stopSimulatedMovement}
              distanceUnit={filters.distanceUnit}
            />
          </section>
        </main>

        {/* Mobile View Toggle Button (Under 15% Sticky cap) */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setMobileTab(mobileTab === 'list' ? 'map' : 'list')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-2xl border border-orange-400/50 backdrop-blur-md transition-all cursor-pointer"
          >
            {mobileTab === 'list' ? (
              <>
                <MapIcon className="w-4 h-4" />
                <span>Show Map</span>
              </>
            ) : (
              <>
                <ListIcon className="w-4 h-4" />
                <span>Show List ({filteredAndSortedShops.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Modal: Shop Details & Community Review Form */}
        {detailsShop && (
          <ShopDetailsModal
            shop={
              shopsWithDistances.find((s) => s.id === detailsShop.id) || detailsShop
            }
            onClose={() => setDetailsShop(null)}
            onPlotRoute={handlePlotRoute}
            onAddReview={handleAddReview}
            distanceUnit={filters.distanceUnit}
          />
        )}
      </div>
    </APIProvider>
  );
}
