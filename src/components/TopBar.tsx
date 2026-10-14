import { Navigation, WifiOff } from 'lucide-react';
import { LOCATION_PRESETS, LocationPreset } from '../services/pizzaService';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface TopBarProps {
  isTracking: boolean;
  hasGpsFix: boolean;
  onToggleTracking: () => void;
  onSelectPreset: (preset: LocationPreset) => void;
  currentPresetName: string;
  onNavClick: (filter: string) => void;
}

export function TopBar({
  isTracking,
  hasGpsFix,
  onToggleTracking,
  onSelectPreset,
  currentPresetName,
  onNavClick,
}: TopBarProps) {
  const isOnline = useOnlineStatus();
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 z-40 sticky top-0">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-tight text-white font-display select-none">
          PizzaRadar
        </span>
      </div>

      {/* Zone 2: Nav links with subtle hover underlines */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
        <button
          onClick={() => onNavClick('top_rated')}
          className="hover:text-white transition-colors cursor-pointer text-left py-1 hover:underline underline-offset-4"
        >
          Top Rated
        </button>
        <button
          onClick={() => onNavClick('nearest')}
          className="hover:text-white transition-colors cursor-pointer text-left py-1 hover:underline underline-offset-4"
        >
          Nearest
        </button>
        <button
          onClick={() => onNavClick('wood_fired')}
          className="hover:text-white transition-colors cursor-pointer text-left py-1 hover:underline underline-offset-4"
        >
          Wood-Fired
        </button>
        <button
          onClick={() => onNavClick('detroit')}
          className="hover:text-white transition-colors cursor-pointer text-left py-1 hover:underline underline-offset-4"
        >
          Detroit & Pan
        </button>
      </nav>

      {/* Zone 3: 1-2 Primary Actions (Install button, City selector, GPS Tracker) */}
      <div className="flex items-center gap-2">
        {/* Offline indicator badge if disconnected */}
        {!isOnline && (
          <div
            title="Running in offline mode using cached local storage"
            className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-medium"
          >
            <WifiOff className="w-3 h-3 text-amber-400" />
            <span className="hidden xl:inline">Offline</span>
          </div>
        )}

        {/* PWA Install Button */}
        <PWAInstallButton />
        {/* City preset dropdown */}
        <div className="relative inline-block text-left">
          <select
            value={currentPresetName}
            onChange={(e) => {
              const selected = LOCATION_PRESETS.find((p) => p.name === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="text-xs bg-stone-800/90 text-stone-200 border border-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer transition-colors hover:bg-stone-750"
            aria-label="Select exploration area"
          >
            <option value="Current GPS">📍 Current Location</option>
            {LOCATION_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Live GPS Tracker Button */}
        <button
          onClick={onToggleTracking}
          title={isTracking ? 'GPS Tracking Active' : 'Enable Real-time GPS Tracking'}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            isTracking
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 hover:text-white'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isTracking && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isTracking ? (hasGpsFix ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-stone-500'
              }`}
            ></span>
          </span>
          {isTracking ? (
            <span className="hidden sm:inline">Live Tracking</span>
          ) : (
            <span className="hidden sm:inline">Track Distance</span>
          )}
          <Navigation className={`w-3.5 h-3.5 ${isTracking ? 'text-emerald-400' : 'text-stone-400'}`} />
        </button>
      </div>
    </header>
  );
}
