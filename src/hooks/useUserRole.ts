
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type UserRole = 'admin' | 'fleet_admin' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        console.log("No user found, setting role to null");
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching role for user:", user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Default to user role
        } else {
          const role = data?.role || 'user';
          console.log("User role fetched:", role);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isFleetAdmin = userRole === 'fleet_admin' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  console.log("useUserRole state:", { userRole, loading, isFleetAdmin, isAdmin });

  return {
    userRole,
    loading,
    isFleetAdmin,
    isAdmin,
  };
};
