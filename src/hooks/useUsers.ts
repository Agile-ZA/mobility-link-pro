
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
        return [];
      }
    }
  });
};
