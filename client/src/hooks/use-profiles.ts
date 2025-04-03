import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile, InsertProfile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export const useProfiles = () => {
  const queryClient = useQueryClient();
  
  // Get all profiles
  const getAllProfiles = () => {
    return useQuery<Profile[]>({
      queryKey: ["/api/profiles"],
    });
  };
  
  // Get single profile
  const getProfile = (id: number) => {
    return useQuery<Profile>({
      queryKey: [`/api/profiles/${id}`],
      enabled: !!id,
    });
  };
  
  // Create profile
  const createProfile = () => {
    return useMutation({
      mutationFn: async (profile: InsertProfile) => {
        const response = await apiRequest("POST", "/api/profiles", profile);
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      },
    });
  };
  
  // Update profile
  const updateProfile = () => {
    return useMutation({
      mutationFn: async ({ id, profile }: { id: number; profile: Partial<InsertProfile> }) => {
        const response = await apiRequest("PATCH", `/api/profiles/${id}`, profile);
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      },
    });
  };
  
  // Delete profile
  const deleteProfile = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        await apiRequest("DELETE", `/api/profiles/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      },
    });
  };
  
  // Search profiles
  const searchProfiles = (query: string) => {
    return useQuery<Profile[]>({
      queryKey: [`/api/profiles/search?q=${encodeURIComponent(query)}`],
      enabled: !!query,
    });
  };
  
  // Filter profiles by location
  const filterProfilesByLocation = (location: string) => {
    return useQuery<Profile[]>({
      queryKey: [`/api/profiles/filter/location?location=${encodeURIComponent(location)}`],
      enabled: !!location,
    });
  };
  
  return {
    getAllProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    searchProfiles,
    filterProfilesByLocation,
  };
};
