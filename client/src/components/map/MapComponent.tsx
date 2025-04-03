import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Profile } from "@shared/schema";

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
  const [isMapReady, setIsMapReady] = useState(false);

  // This useEffect simulates map loading since we're not using a real map
  useEffect(() => {
    if (!isMapReady && !error) {
      // Simulate map loading
      const timer = setTimeout(() => {
        setIsMapReady(true);
        onMapLoaded();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isMapReady, error, onMapLoaded]);

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden lg:sticky lg:top-24">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900">Location Map</CardTitle>
        <CardDescription className="text-sm text-neutral-600">View profile locations on the map</CardDescription>
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
          
          {/* Map placeholder */}
          {!error && (
            <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center p-6">
              <div className="text-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mx-auto mb-2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h3 className="text-lg font-semibold mb-1">Map View</h3>
                <p className="text-neutral-600 max-w-md">
                  The interactive map is currently unavailable. This placeholder is shown instead of the Mapbox implementation.
                </p>
              </div>
              
              <div className="w-full max-w-lg border border-neutral-200 rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-medium mb-2">Profile Locations</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {profiles.map((profile) => (
                    <div 
                      key={profile.id}
                      className={`p-2 rounded-md ${selectedProfile && selectedProfile.id === profile.id ? 'bg-primary/10 border border-primary/20' : 'bg-neutral-50'}`}
                    >
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-sm text-neutral-600">{profile.title}</div>
                      <div className="text-sm flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {profile.location}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Coordinates: {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
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
