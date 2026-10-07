import { useState, useEffect, useRef, useCallback } from 'react';
import { UserLocation } from '../types/pizza';

const DEFAULT_NYC_LOCATION: UserLocation = {
  lat: 40.718,
  lng: -73.988,
  accuracy: 15,
  timestamp: Date.now(),
  label: 'Default (Lower Manhattan, NYC)',
};

export function useRealTimeLocation() {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_NYC_LOCATION);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [hasGpsFix, setHasGpsFix] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);

  const startGpsTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionError('Geolocation is not supported by your browser.');
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setIsTracking(true);
    setPermissionError(null);

    const successHandler = (position: GeolocationPosition) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
        timestamp: position.timestamp,
        label: 'Live Device GPS',
      });
      setHasGpsFix(true);
      setPermissionError(null);
    };

    const errorHandler = (err: GeolocationPositionError) => {
      if (err.code === err.PERMISSION_DENIED) {
        setPermissionError('Location permission denied. Using selected map area.');
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setPermissionError('GPS position unavailable.');
      } else {
        setPermissionError('GPS acquisition timed out.');
      }
      setIsTracking(false);
    };

    // First do getCurrentPosition for quick fix
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    });

    // Then start watchPosition for real-time continuous tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 2000,
      }
    );
  }, []);

  const stopGpsTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simulationIntervalRef.current !== null) {
      window.clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // Set explicit coordinates (e.g. city selector)
  const setManualLocation = useCallback((lat: number, lng: number, label: string) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simulationIntervalRef.current !== null) {
      window.clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsTracking(false);
    setHasGpsFix(false);
    setUserLocation({
      lat,
      lng,
      accuracy: 10,
      timestamp: Date.now(),
      label,
    });
  }, []);

  // Live simulation: Walk or drive towards a target shop to showcase real-time distance decreasing
  const startSimulatedMovement = useCallback(
    (targetLat: number, targetLng: number, mode: 'walk' | 'drive' = 'walk') => {
      if (simulationIntervalRef.current !== null) {
        window.clearInterval(simulationIntervalRef.current);
      }

      setIsTracking(true);
      setHasGpsFix(true);

      const stepFraction = mode === 'drive' ? 0.04 : 0.015; // move closer each second

      simulationIntervalRef.current = window.setInterval(() => {
        setUserLocation((current) => {
          const dLat = targetLat - current.lat;
          const dLng = targetLng - current.lng;
          const distRemaining = Math.sqrt(dLat * dLat + dLng * dLng);

          if (distRemaining < 0.0001) {
            // Arrived at destination!
            if (simulationIntervalRef.current !== null) {
              window.clearInterval(simulationIntervalRef.current);
              simulationIntervalRef.current = null;
            }
            return {
              ...current,
              lat: targetLat,
              lng: targetLng,
              timestamp: Date.now(),
              label: 'Arrived at Pizza Shop!',
            };
          }

          const nextLat = current.lat + dLat * stepFraction;
          const nextLng = current.lng + dLng * stepFraction;

          return {
            lat: nextLat,
            lng: nextLng,
            accuracy: 8,
            speed: mode === 'drive' ? 10.5 : 1.4,
            timestamp: Date.now(),
            label: `Simulated Live Tracker (${mode === 'drive' ? 'Driving' : 'Walking'})`,
          };
        });
      }, 1000);
    },
    []
  );

  const stopSimulatedMovement = useCallback(() => {
    if (simulationIntervalRef.current !== null) {
      window.clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Attempt auto GPS start on initial mount
    startGpsTracking();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (simulationIntervalRef.current !== null) {
        window.clearInterval(simulationIntervalRef.current);
      }
    };
  }, [startGpsTracking]);

  return {
    userLocation,
    isTracking,
    hasGpsFix,
    permissionError,
    startGpsTracking,
    stopGpsTracking,
    setManualLocation,
    startSimulatedMovement,
    stopSimulatedMovement,
    isSimulating: simulationIntervalRef.current !== null,
  };
}
