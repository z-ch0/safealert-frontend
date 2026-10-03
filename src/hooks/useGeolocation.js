import { useState } from "react";

export function useGeolocation() {
  const [error, setError] = useState(null);

  // Returns a Promise, so we can `await` this inside the SOS button
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported by this browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => { setError(err.message); reject(err); },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  return { getLocation, error };
}