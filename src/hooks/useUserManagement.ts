
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/hooks/useUserRole";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role?: UserRole;
}

export interface UserWithRole extends User {
  role: UserRole | null;
}

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, full_name");

        if (profilesError) {
          throw profilesError;
        }

        // Then get all user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id, role");

        if (rolesError) {
          throw rolesError;
        }

        // Map user roles to profiles
        const usersWithRoles: UserWithRole[] = profiles.map(profile => {
          const userRole = userRoles.find(role => role.user_id === profile.id);
          return {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: userRole?.role as UserRole || null
          };
        });
        
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

  const assignRole = (userId: string, role: UserRole) => {
    assignRoleMutation.mutate({ userId, role });
  };

  const removeRole = (userId: string) => {
    removeRoleMutation.mutate(userId);
  };

  return {
    users,
    loading: isLoadingUsers || loading,
    assignRole,
    removeRole
  };
};
