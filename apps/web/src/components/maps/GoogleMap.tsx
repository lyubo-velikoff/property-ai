import { useCallback, useMemo } from 'react';
import { GoogleMap as GoogleMapComponent, useLoadScript, Marker } from '@react-google-maps/api';

interface GoogleMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

export default function GoogleMap({ center, zoom = 15 }: GoogleMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const options = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
  }), []);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
  }, [center]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-600 dark:text-red-500">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-600 dark:text-gray-400">
        Loading maps...
      </div>
    );
  }

  return (
    <GoogleMapComponent
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={options}
      onLoad={onLoad}
    >
      <Marker position={center} />
    </GoogleMapComponent>
  );
} 
