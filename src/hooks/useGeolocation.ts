import { useCallback, useState } from "react";
import type { LatLng } from "@/lib/geo";

type GeoStatus = "idle" | "locating" | "granted" | "denied";

/**
 * Lazily requests the browser's geolocation — only when the user taps
 * "use my location", never on page load (better UX and permission hygiene).
 */
export function useGeolocation() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }, []);

  return { position, status, locate };
}
