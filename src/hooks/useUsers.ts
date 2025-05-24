
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/hooks/useUserRole";

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

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        console.log("Fetching users for user management...");
        
        // Get all users from auth.users (this will include all registered users)
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error("Error fetching auth users:", authError);
          // Fallback to profiles if auth admin access is not available
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, email, full_name, site_id");

          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
            throw profilesError;
          }

          console.log("Profiles fetched:", profiles);
          
          // Continue with profiles data
          const users = profiles || [];
          
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
          const usersWithRoles: UserWithRole[] = users.map(user => {
            const userRole = userRoles.find(role => role.user_id === user.id);
            const userSite = siteData.find(site => site.id === user.site_id);
            
            return {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              role: userRole?.role as UserRole || null,
              site_id: user.site_id,
              site_name: userSite?.name || null
            };
          });
          
          console.log("Final users with roles:", usersWithRoles);
          return usersWithRoles;
        }

        // If we have auth users, process them
        console.log("Auth users fetched:", authUsers.users);
        
        // Get profiles for these users
        const userIds = authUsers.users.map(user => user.id);
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, full_name, site_id")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
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

        // Combine auth users with profile data
        const usersWithRoles: UserWithRole[] = authUsers.users.map(authUser => {
          const profile = profiles?.find(p => p.id === authUser.id);
          const userRole = userRoles.find(role => role.user_id === authUser.id);
          const userSite = siteData.find(site => site.id === profile?.site_id);
          
          return {
            id: authUser.id,
            email: authUser.email || profile?.email || 'No email',
            full_name: authUser.user_metadata?.full_name || profile?.full_name || null,
            role: userRole?.role as UserRole || null,
            site_id: profile?.site_id || null,
            site_name: userSite?.name || null
          };
        });
        
        console.log("Final users with roles:", usersWithRoles);
        return usersWithRoles;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
