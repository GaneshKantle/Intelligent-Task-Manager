import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Profile } from "@shared/schema";
import mapboxgl from "mapbox-gl";

// Mapbox requires a token
// This would typically come from environment variables
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNrd3ZsMnhxdjBrOXEyb3BhMnJtbXJjdGwifQ.csjmfYDr9FHWbBTj_pNxAg";

interface MapComponentProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onMapLoaded: () => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

const MapComponent = ({
  profiles,
  selectedProfile,
  onMapLoaded,
  isLoading,
  error,
  onRetry
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // Initialize map only once
    if (!mapInitialized && mapContainer.current && !error) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [0, 20], // Default center
          zoom: 1
        });
        
        map.current.on('load', () => {
          setMapInitialized(true);
          onMapLoaded();
        });
        
        map.current.addControl(new mapboxgl.NavigationControl());
      } catch (err) {
        console.error("Error initializing map:", err);
      }
    }
    
    return () => {
      // Clean up the map instance when component unmounts
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapInitialized, error, onMapLoaded]);
  
  // Add/update markers when profiles change
  useEffect(() => {
    if (mapInitialized && map.current && profiles.length > 0) {
      // Remove existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      
      // Add new markers for each profile
      const bounds = new mapboxgl.LngLatBounds();
      
      profiles.forEach(profile => {
        const isSelected = selectedProfile && selectedProfile.id === profile.id;
        
        const el = document.createElement('div');
        el.className = isSelected 
          ? 'w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white'
          : 'w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center text-white';
        
        // Create icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-map-marker-alt';
        if (!isSelected) icon.style.fontSize = '12px';
        el.appendChild(icon);
        
        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([profile.longitude, profile.latitude])
          .addTo(map.current!);
        
        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <div class="font-semibold">${profile.name}</div>
              <div class="text-sm text-gray-600">${profile.title}</div>
              <div class="text-sm">${profile.location}</div>
            </div>
          `);
        
        marker.setPopup(popup);
        
        // Add click event to marker
        el.addEventListener('click', () => {
          marker.togglePopup();
        });
        
        // Extend bounds
        bounds.extend([profile.longitude, profile.latitude]);
        
        // Store marker reference
        markers.current.push(marker);
      });
      
      // Fit map to bounds with padding
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    }
  }, [profiles, selectedProfile, mapInitialized]);
  
  // Center map on selected profile
  useEffect(() => {
    if (mapInitialized && map.current && selectedProfile) {
      map.current.easeTo({
        center: [selectedProfile.longitude, selectedProfile.latitude],
        zoom: 12,
        duration: 1000
      });
      
      // Make sure the selected profile marker is visible and animated
      markers.current.forEach(marker => {
        const el = marker.getElement();
        const markerLngLat = marker.getLngLat();
        
        if (
          markerLngLat.lng === selectedProfile.longitude && 
          markerLngLat.lat === selectedProfile.latitude
        ) {
          el.className = 'w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white animate-bounce';
        } else {
          el.className = 'w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center text-white';
        }
      });
    }
  }, [selectedProfile, mapInitialized]);

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden lg:sticky lg:top-24">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900">Location Map</CardTitle>
        <CardDescription className="text-sm text-neutral-600">View profile locations and interact with the map</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-[400px] md:h-[500px] relative">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-neutral-600">Loading map...</p>
              </div>
            </div>
          )}
          
          {/* Map container */}
          <div 
            ref={mapContainer} 
            className="w-full h-full bg-neutral-100"
          />
          
          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <p className="mt-2 text-neutral-700 font-medium">Unable to load map</p>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  There was an error loading the map. Please check your internet connection or try again later.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={onRetry}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapComponent;
