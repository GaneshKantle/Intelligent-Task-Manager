import { Profile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPinIcon, 
  Building, 
  X as CloseIcon, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase,
  Linkedin
} from "lucide-react";

interface ProfileDetailProps {
  profile: Profile;
  onClose: () => void;
  onShowOnMap: (profile: Profile) => void;
}

const ProfileDetail = ({ profile, onClose, onShowOnMap }: ProfileDetailProps) => {
  return (
    <div className="border-t border-neutral-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <img 
            src={profile.imageUrl} 
            alt={`${profile.name} profile photo`} 
            className="h-24 w-24 rounded-full object-cover mx-auto md:mx-0"
            onError={(e) => {
              e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name);
            }}
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-xl font-semibold text-neutral-900">{profile.name}</h2>
          <p className="text-neutral-600">{profile.title}</p>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <Badge variant="neutral" className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3" />
              {profile.location}
            </Badge>
            <Badge variant="neutral" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {profile.company}
            </Badge>
            {profile.experience && (
              <Badge variant="neutral" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {profile.experience}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-neutral-900">About</h3>
        <p className="mt-2 text-neutral-600">{profile.description}</p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-neutral-900">Contact Information</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-neutral-500 mr-2" />
            <span className="text-neutral-600">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-neutral-500 mr-2" />
              <span className="text-neutral-600">{profile.phone}</span>
            </div>
          )}
          {profile.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 text-neutral-500 mr-2" />
              <a href={`https://${profile.linkedin}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {profile.linkedin}
              </a>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-neutral-500 mr-2" />
              <a href={`https://${profile.website}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <Button 
          className="inline-flex items-center justify-center"
          onClick={() => onShowOnMap(profile)}
        >
          <MapPinIcon className="h-4 w-4 mr-2" /> Show on Map
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="inline-flex items-center"
            onClick={onClose}
          >
            <CloseIcon className="h-4 w-4 mr-2" /> Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
