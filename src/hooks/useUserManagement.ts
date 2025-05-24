
import { useUsers, UserWithRole, User } from "@/hooks/useUsers";
import { useUserRoleOperations } from "@/hooks/useUserRoleOperations";
import { useUserSiteOperations } from "@/hooks/useUserSiteOperations";
import { useSites } from "@/hooks/useSites";

export type { User, UserWithRole };

export const useUserManagement = () => {
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { sites, loading: isLoadingSites } = useSites();
  const { assignRole, removeRole, loading: roleLoading } = useUserRoleOperations();
  const { updateUserSite, loading: siteLoading } = useUserSiteOperations();

  const loading = isLoadingUsers || isLoadingSites || roleLoading || siteLoading;

  return {
    users,
    sites,
    loading,
    assignRole,
    removeRole,
    updateUserSite
  };
};
