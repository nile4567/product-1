import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps';
import { PizzaShop, UserLocation } from '../types/pizza';
import {
  Star,
  Navigation,
  Compass,
  LocateFixed,
  Play,
  Square,
  ArrowRight,
  Footprints,
  Car,
  WifiOff,
} from 'lucide-react';
import { formatDistance, formatDuration } from '../utils/distance';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface PizzaMapProps {
  shops: PizzaShop[];
  userLocation: UserLocation;
  selectedShop: PizzaShop | null;
  activeRouteShop: PizzaShop | null;
  onSelectShop: (shop: PizzaShop | null) => void;
  onPlotRoute: (shop: PizzaShop) => void;
  onOpenDetails: (shop: PizzaShop) => void;
  isSimulating: boolean;
  onStartSimulation: (shop: PizzaShop, mode: 'walk' | 'drive') => void;
  onStopSimulation: () => void;
  distanceUnit: 'miles' | 'km';
}

export function PizzaMap({
  shops,
  userLocation,
  selectedShop,
  activeRouteShop,
  onSelectShop,
  onPlotRoute,
  onOpenDetails,
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  distanceUnit,
}: PizzaMapProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const isApiLoaded = useApiIsLoaded();
  const isOnline = useOnlineStatus();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distanceMeters: number;
    durationSeconds: number;
  } | null>(null);

  // Center map on user location
  const handleRecenterUser = useCallback(() => {
    if (map && userLocation) {
      map.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      map.setZoom(15);
    }
  }, [map, userLocation]);

  // Fit all pizza shops in view
  const handleFitAllShops = useCallback(() => {
    if (!map || shops.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
    shops.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(bounds, 60);
  }, [map, shops, userLocation]);

  // Compute and draw modern route using Routes API
  useEffect(() => {
    if (!map) return;

    // Clear previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const targetShop = activeRouteShop || selectedShop;
    if (!targetShop) {
      setRouteInfo(null);
      return;
    }

    const origin = { lat: userLocation.lat, lng: userLocation.lng };
    const destination = { lat: targetShop.lat, lng: targetShop.lng };

    // If Routes library is loaded and Route class exists
    if (routesLib && (routesLib as unknown as { Route?: { computeRoutes?: unknown } }).Route) {
      try {
        const routeRequest = {
          origin,
          destination,
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        };

        const RouteClass = (routesLib as unknown as { Route: { computeRoutes: (req: unknown) => Promise<{ routes: unknown[] }> } }).Route;

        RouteClass.computeRoutes(routeRequest)
          .then((response) => {
            if (response && response.routes && response.routes.length > 0) {
              const primaryRoute = response.routes[0] as {
                createPolylines?: () => google.maps.Polyline[];
                distanceMeters?: number;
                durationMillis?: number;
                viewport?: google.maps.LatLngBounds;
              };

              if (typeof primaryRoute.createPolylines === 'function') {
                const lines = primaryRoute.createPolylines();
                lines.forEach((line) => {
                  line.setOptions({
                    strokeColor: '#f97316',
                    strokeWeight: 5,
                    strokeOpacity: 0.85,
                  });
                  line.setMap(map);
                });
                polylinesRef.current = lines;
              }

              setRouteInfo({
                distanceMeters: primaryRoute.distanceMeters || targetShop.distanceMeters || 0,
                durationSeconds: Math.round((primaryRoute.durationMillis || 0) / 1000),
              });
            } else {
              // Direct polyline fallback
              drawDirectPolyline(origin, destination);
            }
          })
          .catch(() => {
            // Draw direct polyline on API fallback
            drawDirectPolyline(origin, destination);
          });
      } catch {
        drawDirectPolyline(origin, destination);
      }
    } else {
      drawDirectPolyline(origin, destination);
    }

    function drawDirectPolyline(
      orig: { lat: number; lng: number },
      dest: { lat: number; lng: number }
    ) {
      const fallbackPolyline = new google.maps.Polyline({
        path: [orig, dest],
        geodesic: true,
        strokeColor: '#f97316',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        icons: [
          {
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, fillColor: '#f97316', fillOpacity: 1 },
            offset: '50%',
          },
        ],
      });
      fallbackPolyline.setMap(map);
      polylinesRef.current = [fallbackPolyline];

      if (targetShop?.distanceMeters) {
        setRouteInfo({
          distanceMeters: targetShop.distanceMeters,
          durationSeconds: targetShop.durationSeconds || Math.round(targetShop.distanceMeters / 9.8),
        });
      }
    }

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routesLib, activeRouteShop, selectedShop, userLocation.lat, userLocation.lng]);

  if (!isApiLoaded) {
    return (
      <div className="relative w-full h-full min-h-[420px] bg-stone-950 overflow-hidden flex flex-col items-center justify-center p-6 text-stone-200">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {!isOnline ? 'Offline Map Mode' : 'Connecting to Map Network...'}
            </h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              {!isOnline
                ? 'Network map tiles are offline, but all your previously cached pizza shops, ratings, user reviews, and GPS coordinates remain fully accessible.'
                : 'Initializing Google Maps Platform SDK and vector tiles...'}
            </p>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Cached Pizzerias:</span>
              <span className="font-mono font-bold text-emerald-400">{shops.length} cached locally</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Current GPS Fix:</span>
              <span className="font-mono text-orange-400 text-[11px] tabular-nums">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
            {selectedShop && (
              <div className="pt-2 border-t border-stone-800 text-xs">
                <span className="text-stone-400 block mb-1">Active Target:</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{selectedShop.name}</span>
                  <span className="font-mono text-orange-400 font-bold tabular-nums">
                    {formatDistance(selectedShop.distanceMeters, distanceUnit)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {selectedShop && (
            <div className="flex items-center justify-center pt-1">
              <button
                onClick={() => onOpenDetails(selectedShop)}
                className="w-full py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Open Cached Shop Details & Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] bg-stone-950 overflow-hidden">
      <Map
        defaultCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
        defaultZoom={13}
        mapId="DEMO_MAP_ID"
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        {/* User's Live Location Advanced Marker */}
        <AdvancedMarker
          position={{ lat: userLocation.lat, lng: userLocation.lng }}
          title={userLocation.label || 'Your Current Location'}
          zIndex={100}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulsing GPS Radar Ring */}
            <span className="absolute w-10 h-10 bg-orange-500/30 rounded-full animate-ping pointer-events-none"></span>
            <span className="absolute w-6 h-6 bg-orange-500/20 rounded-full pointer-events-none"></span>
            {/* Live Center Beacon */}
            <div className="relative w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        </AdvancedMarker>

        {/* Pizza Shops Advanced Markers */}
        {shops.map((shop, idx) => {
          const isSelected = selectedShop?.id === shop.id;
          const isRouting = activeRouteShop?.id === shop.id;

          return (
            <AdvancedMarker
              key={shop.id}
              position={{ lat: shop.lat, lng: shop.lng }}
              title={shop.name}
              zIndex={isSelected || isRouting ? 50 : 20}
              onClick={() => onSelectShop(shop)}
            >
              <div
                className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold shadow-lg transition-transform duration-200 select-none cursor-pointer border ${
                  isSelected || isRouting
                    ? 'bg-orange-500 text-white border-white scale-110 ring-2 ring-orange-500/50'
                    : 'bg-stone-900/90 text-stone-100 border-stone-700 hover:border-orange-500/70 hover:scale-105'
                }`}
              >
                <span className="text-sm">🍕</span>
                <span className="font-mono tabular-nums text-[11px]">
                  {shop.rating.toFixed(1)}
                </span>
                <span className="text-[10px] opacity-75 font-mono">
                  #{idx + 1}
                </span>
              </div>
            </AdvancedMarker>
          );
        })}

        {/* Selected Shop InfoWindow */}
        {selectedShop && (
          <InfoWindow
            position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
            onCloseClick={() => onSelectShop(null)}
            pixelOffset={[0, -32]}
          >
            <div className="p-1 max-w-[240px] text-stone-900">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-stone-950 leading-tight">
                  {selectedShop.name}
                </h4>
                <span className="text-xs font-mono font-semibold text-stone-600">
                  {'$'.repeat(selectedShop.priceLevel)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                <div className="flex items-center gap-0.5 text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                  <span className="font-mono">{selectedShop.rating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span className="font-mono">
                  {selectedShop.userRatingCount.toLocaleString()} reviews
                </span>
              </div>

              <div className="text-xs text-orange-600 font-mono font-semibold mt-1">
                📍 {formatDistance(selectedShop.distanceMeters, distanceUnit)} away
              </div>

              <p className="text-[11px] text-stone-600 truncate mt-1">
                {selectedShop.address}
              </p>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200">
                <button
                  onClick={() => onPlotRoute(selectedShop)}
                  className="flex-1 px-2 py-1 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors text-center"
                >
                  Live Route
                </button>
                <button
                  onClick={() => onOpenDetails(selectedShop)}
                  className="px-2 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={handleRecenterUser}
          title="Center on my live location"
          className="p-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 rounded-lg shadow-lg border border-stone-700 backdrop-blur-sm transition-colors cursor-pointer"
        >
          <LocateFixed className="w-4 h-4 text-orange-400" />
        </button>
        <button
          onClick={handleFitAllShops}
          title="Fit all pizza shops in view"
          className="p-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 rounded-lg shadow-lg border border-stone-700 backdrop-blur-sm transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4 text-stone-300" />
        </button>
      </div>

      {/* Active Route HUD / Real-Time Tracking Panel */}
      {(activeRouteShop || selectedShop) && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-stone-900/95 backdrop-blur-md border border-stone-700/80 rounded-xl p-3 shadow-xl z-10 text-stone-100">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live GPS Tracking</span>
              </div>
              <h4 className="text-sm font-bold truncate text-white mt-0.5">
                {(activeRouteShop || selectedShop)?.name}
              </h4>
            </div>

            {/* Simulation Controller */}
            <div>
              {isSimulating ? (
                <button
                  onClick={onStopSimulation}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg hover:bg-rose-500/30 transition-colors"
                >
                  <Square className="w-3 h-3 fill-rose-400" />
                  <span>Stop Walk</span>
                </button>
              ) : (
                <button
                  onClick={() => onStartSimulation((activeRouteShop || selectedShop)!, 'walk')}
                  title="Simulate walking step-by-step to test live distance countdown"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3 fill-stone-300" />
                  <span>Simulate Walk</span>
                </button>
              )}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-stone-800 text-xs font-mono">
            <div className="bg-stone-950/50 p-2 rounded-lg border border-stone-800/80">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">
                Live Distance
              </span>
              <span className="text-sm font-bold text-orange-400 tabular-nums">
                {formatDistance(
                  (activeRouteShop || selectedShop)?.distanceMeters,
                  distanceUnit
                )}
              </span>
            </div>
            <div className="bg-stone-950/50 p-2 rounded-lg border border-stone-800/80">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-sans block">
                Estimated Time
              </span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">
                {formatDuration(
                  routeInfo?.durationSeconds ||
                    (activeRouteShop || selectedShop)?.durationSeconds
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
