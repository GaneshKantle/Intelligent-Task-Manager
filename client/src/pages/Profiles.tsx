import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Profile } from "@shared/schema";
import SearchFilterBar from "@/components/search/SearchFilterBar";
import ProfileList from "@/components/profile/ProfileList";
import ProfileDetail from "@/components/profile/ProfileDetail";
import MapComponent from "@/components/map/MapComponent";
import { useToast } from "@/hooks/use-toast";

const Profiles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Fetch profiles
  const {
    data: profiles,
    isLoading,
    error,
    refetch
  } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });
  
  // Update filtered profiles when data, search or filter changes
  useEffect(() => {
    if (!profiles) return;
    
    let result = [...profiles];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(profile => 
        profile.name.toLowerCase().includes(query) ||
        profile.location.toLowerCase().includes(query) ||
        profile.company.toLowerCase().includes(query) ||
        profile.title.toLowerCase().includes(query) ||
        profile.description.toLowerCase().includes(query)
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      result = result.filter(profile => 
        profile.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }
    
    setFilteredProfiles(result);
    
    // Extract unique locations for filter dropdown
    const locations = [...new Set(profiles.map(p => p.location))].sort();
    setUniqueLocations(locations);
  }, [profiles, searchQuery, locationFilter]);
  
  // Handle profile selection
  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
  };
  
  // Handle showing profile on map
  const handleShowOnMap = (profile: Profile) => {
    setSelectedProfile(profile);
    
    // Scroll to map on mobile
    if (window.innerWidth < 1024) {
      const mapContainer = document.getElementById('map-container');
      if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Handle close profile detail
  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle location filter
  const handleFilterByLocation = (location: string) => {
    setLocationFilter(location);
  };
  
  // Handle filter reset
  const handleReset = () => {
    setSearchQuery("");
    setLocationFilter("");
  };
  
  // Handle map load
  const handleMapLoaded = () => {
    setMapLoaded(true);
  };
  
  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search and filter */}
      <SearchFilterBar
        onSearch={handleSearch}
        onFilterByLocation={handleFilterByLocation}
        onReset={handleReset}
        locations={uniqueLocations}
      />
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left panel: Profile list */}
        <div className="w-full lg:w-6/12 xl:w-5/12">
          <ProfileList
            profiles={filteredProfiles}
            isLoading={isLoading}
            error={error as Error}
            onRetry={handleRetry}
            onProfileSelect={handleProfileSelect}
            onShowOnMap={handleShowOnMap}
            selectedProfileId={selectedProfile?.id}
          />
        </div>
        
        {/* Right panel: Map and profile details */}
        <div className="w-full lg:w-6/12 xl:w-7/12" id="map-container">
          <MapComponent
            profiles={filteredProfiles}
            selectedProfile={selectedProfile}
            onMapLoaded={handleMapLoaded}
            isLoading={isLoading || !mapLoaded}
            error={error as Error}
            onRetry={handleRetry}
          />
          
          {selectedProfile && (
            <ProfileDetail
              profile={selectedProfile}
              onClose={handleCloseProfile}
              onShowOnMap={handleShowOnMap}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profiles;
