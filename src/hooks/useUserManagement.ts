import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/hooks/useUserRole";
import { Site } from "@/types/site";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role?: UserRole;
}

export interface UserWithRole extends User {
  role: UserRole | null;
  site_id: string | null;
  site_name?: string | null;
}

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: sites = [], isLoading: isLoadingSites } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("sites")
          .select("id, name, location");
          
        if (error) throw error;
        return data as Site[];
      } catch (error) {
        console.error("Error fetching sites:", error);
        return [];
      }
    }
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        console.log("Fetching users for user management...");
        
        // Get all profiles (this should include all users who have signed up)
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, full_name, site_id");

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }

        console.log("Profiles fetched:", profiles);

        // Get all user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id, role");

        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          throw rolesError;
        }
        
        console.log("User roles fetched:", userRoles);

        // Get sites
        const { data: siteData, error: sitesError } = await supabase
          .from("sites")
          .select("id, name");
        
        if (sitesError) {
          console.error("Error fetching sites:", sitesError);
          throw sitesError;
        }

        console.log("Sites fetched:", siteData);

        // Map user roles to profiles
        const usersWithRoles: UserWithRole[] = profiles.map(profile => {
          const userRole = userRoles.find(role => role.user_id === profile.id);
          const userSite = siteData.find(site => site.id === profile.site_id);
          
          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: userRole?.role as UserRole || null,
            site_id: profile.site_id,
            site_name: userSite?.name || null
          };
        });
        
        console.log("Final users with roles:", usersWithRoles);
        return usersWithRoles;
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        return [];
      }
    }
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      setLoading(true);
      try {
        // Check if user already has a role
        const { data: existingRole, error: checkError } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          throw checkError;
        }

        if (existingRole) {
          // Update existing role
          const { error: updateError } = await supabase
            .from("user_roles")
            .update({ role })
            .eq("user_id", userId);

          if (updateError) throw updateError;
        } else {
          // Insert new role
          const { error: insertError } = await supabase
            .from("user_roles")
            .insert({ user_id: userId, role });

          if (insertError) throw insertError;
        }

        return { success: true };
      } catch (error) {
        console.error("Error assigning role:", error);
        throw new Error("Failed to assign role");
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user role");
    }
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      setLoading(true);
      try {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId);

        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error("Error removing role:", error);
        throw new Error("Failed to remove role");
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("User role removed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to remove user role");
    }
  });
  
  const updateUserSiteMutation = useMutation({
    mutationFn: async ({ userId, siteId }: { userId: string; siteId: string | null }) => {
      setLoading(true);
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ site_id: siteId })
          .eq("id", userId);

        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error("Error updating user site:", error);
        throw new Error("Failed to update user site");
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("User site updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user site");
    }
  });

  const assignRole = (userId: string, role: UserRole) => {
    assignRoleMutation.mutate({ userId, role });
  };

  const removeRole = (userId: string) => {
    removeRoleMutation.mutate(userId);
  };
  
  const updateUserSite = (userId: string, siteId: string | null) => {
    updateUserSiteMutation.mutate({ userId, siteId });
  };

  return {
    users,
    sites,
    loading: isLoadingUsers || isLoadingSites || loading,
    assignRole,
    removeRole,
    updateUserSite
  };
};
