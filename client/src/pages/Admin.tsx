import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile, insertProfileSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import ProfileForm from "@/components/profile/ProfileForm";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, AlertTriangle, RotateCw } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | undefined>(undefined);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  
  // Fetch profiles
  const {
    data: profiles,
    isLoading,
    error,
    refetch
  } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });
  
  // Create profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async (profile: z.infer<typeof insertProfileSchema>) => {
      const response = await apiRequest("POST", "/api/profiles", profile);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      toast({
        title: "Success",
        description: "Profile created successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, profile }: { id: number; profile: Partial<z.infer<typeof insertProfileSchema>> }) => {
      const response = await apiRequest("PATCH", `/api/profiles/${id}`, profile);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      setIsFormOpen(false);
      setEditingProfile(undefined);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      toast({
        title: "Success",
        description: "Profile deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setProfileToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form open
  const handleOpenForm = (profile?: Profile) => {
    setEditingProfile(profile);
    setIsFormOpen(true);
  };
  
  // Handle form close
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProfile(undefined);
  };
  
  // Handle form submit
  const handleFormSubmit = (profile: z.infer<typeof insertProfileSchema>) => {
    if (editingProfile) {
      updateProfileMutation.mutate({ id: editingProfile.id, profile });
    } else {
      createProfileMutation.mutate(profile);
    }
  };
  
  // Handle delete dialog open
  const handleOpenDeleteDialog = (profile: Profile) => {
    setProfileToDelete(profile);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (profileToDelete) {
      deleteProfileMutation.mutate(profileToDelete.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Admin Panel - Manage Profiles</h2>
          <Button onClick={() => handleOpenForm()}>
            Add New Profile
          </Button>
        </div>
        
        <div className="p-6">
          {/* Error state */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-destructive">Error loading profiles</h3>
                <p className="text-sm text-neutral-600">Please try again or contact support.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => refetch()}
                >
                  <RotateCw className="h-4 w-4 mr-2" /> Try Again
                </Button>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-neutral-600">Loading profiles...</p>
            </div>
          )}
          
          {/* Profile list */}
          {!isLoading && !error && profiles && (
            <div className="border border-neutral-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {profiles.length > 0 ? (
                    profiles.map((profile) => (
                      <tr key={profile.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={profile.imageUrl} 
                                alt={`${profile.name}'s profile`}
                                onError={(e) => {
                                  e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name);
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-900">{profile.name}</div>
                              <div className="text-sm text-neutral-500">{profile.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{profile.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{profile.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80 mr-2"
                            onClick={() => handleOpenForm(profile)}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleOpenDeleteDialog(profile)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-neutral-500">
                        No profiles found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Edit Profile" : "Create New Profile"}
            </DialogTitle>
            <DialogDescription>
              Fill in the profile details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[60vh]">
            <ProfileForm
              profile={editingProfile}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the profile for {profileToDelete?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
