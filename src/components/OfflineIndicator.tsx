import { useState, useEffect } from 'react';
import { WifiOff, Database, CheckCircle2, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getCacheStats } from '../services/storageService';

interface OfflineIndicatorProps {
  onManualRefresh?: () => void;
}

export function OfflineIndicator({ onManualRefresh }: OfflineIndicatorProps) {
  const isOnline = useOnlineStatus();
  const [justCameOnline, setJustCameOnline] = useState(false);
  const [stats, setStats] = useState(getCacheStats());

  useEffect(() => {
    setStats(getCacheStats());
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      // Check if we previously transitioned from offline
      const hadOfflineSession = sessionStorage.getItem('pizzaradar_was_offline');
      if (hadOfflineSession === 'true') {
        setJustCameOnline(true);
        sessionStorage.removeItem('pizzaradar_was_offline');
        const timer = setTimeout(() => setJustCameOnline(false), 4000);
        return () => clearTimeout(timer);
      }
    } else {
      sessionStorage.setItem('pizzaradar_was_offline', 'true');
    }
  }, [isOnline]);

  // When back online, show brief success banner
  if (isOnline && justCameOnline) {
    return (
      <div className="bg-emerald-950/90 border-b border-emerald-800 text-emerald-200 px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50 backdrop-blur-md animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Connection restored! Live Google Maps and Places sync are active.</span>
        </div>
        {onManualRefresh && (
          <button
            onClick={onManualRefresh}
            className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-800/80 hover:bg-emerald-700 px-2 py-0.5 rounded text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync Live Places</span>
          </button>
        )}
      </div>
    );
  }

  // When offline, display prominent helpful offline badge
  if (!isOnline) {
    return (
      <div className="bg-amber-950/95 border-b border-amber-800/90 text-amber-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50 backdrop-blur-md shadow-md animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="font-semibold text-white">Offline Mode Active</span>
          <span className="text-amber-300 hidden sm:inline">·</span>
          <span className="text-amber-200/90">
            Viewing {stats.shopCount} cached pizzerias and saved user reviews.
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300/80">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>Local Storage Active</span>
        </div>
      </div>
    );
  }

  return null;
}
