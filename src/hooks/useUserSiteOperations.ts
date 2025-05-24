
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUserSiteOperations = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

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

  const updateUserSite = (userId: string, siteId: string | null) => {
    updateUserSiteMutation.mutate({ userId, siteId });
  };

  return {
    updateUserSite,
    loading
  };
};
