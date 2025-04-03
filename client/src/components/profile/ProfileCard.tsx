import { Profile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, Building } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
  onShowOnMap: (profile: Profile) => void;
  isSelected?: boolean;
}

const ProfileCard = ({ profile, onSelect, onShowOnMap, isSelected = false }: ProfileCardProps) => {
  const handleShowOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowOnMap(profile);
  };

  return (
    <div 
      className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${isSelected ? 'bg-neutral-50' : ''}`}
      onClick={() => onSelect(profile)}
      data-testid={`profile-card-${profile.id}`}
    >
      <div className="flex items-start space-x-4">
        <img 
          src={profile.imageUrl} 
          alt={`${profile.name} profile photo`} 
          className="h-12 w-12 rounded-full object-cover flex-shrink-0" 
          onError={(e) => {
            e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name);
          }}
        />
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-neutral-900 truncate">{profile.name}</h3>
            <Badge variant="neutral" className="text-xs">
              {profile.location}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{profile.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <div className="flex space-x-1">
              <span className="inline-flex items-center text-xs text-neutral-500">
                <Building className="w-3 h-3 mr-1" />
                <span>{profile.company}</span>
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs text-primary hover:bg-primary/10 px-2 py-1"
              onClick={handleShowOnMap}
            >
              <MapPinIcon className="h-3 w-3 mr-1" /> Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
