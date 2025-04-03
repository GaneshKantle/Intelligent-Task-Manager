import { useState } from "react";
import { Profile } from "@shared/schema";
import ProfileCard from "./ProfileCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

interface ProfileListProps {
  profiles: Profile[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onProfileSelect: (profile: Profile) => void;
  onShowOnMap: (profile: Profile) => void;
  selectedProfileId?: number;
}

const ProfileList = ({
  profiles,
  isLoading,
  error,
  onRetry,
  onProfileSelect,
  onShowOnMap,
  selectedProfileId
}: ProfileListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 4;
  
  // Calculate pagination
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(profiles.length / profilesPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold text-neutral-900">Profiles</CardTitle>
        <CardDescription className="text-sm text-neutral-600">
          Click on a profile to view details or use the summary button to locate on map
        </CardDescription>
      </CardHeader>
      
      {/* Loading state */}
      {isLoading && (
        <div className="py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-neutral-600">Loading profiles...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <p className="mt-2 text-neutral-700 font-medium">Unable to load profiles</p>
          <p className="text-sm text-neutral-600">Please try again later or contact support</p>
          <Button 
            className="mt-4" 
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* Profile list */}
      {!isLoading && !error && (
        <>
          <CardContent className="p-0 divide-y divide-neutral-200">
            {currentProfiles.length > 0 ? (
              currentProfiles.map(profile => (
                <ProfileCard 
                  key={profile.id}
                  profile={profile}
                  onSelect={onProfileSelect}
                  onShowOnMap={onShowOnMap}
                  isSelected={profile.id === selectedProfileId}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-neutral-600">No profiles found matching your criteria.</p>
              </div>
            )}
          </CardContent>
          
          {/* Pagination */}
          {profiles.length > 0 && (
            <CardFooter className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-t border-neutral-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-neutral-700">
                    Showing <span className="font-medium">{indexOfFirstProfile + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastProfile, profiles.length)}
                    </span>{" "}
                    of <span className="font-medium">{profiles.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative inline-flex items-center rounded-l-md"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          className="relative inline-flex items-center px-4"
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative inline-flex items-center rounded-r-md"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
};

export default ProfileList;
