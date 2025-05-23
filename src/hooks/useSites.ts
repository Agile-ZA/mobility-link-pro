
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Site } from '@/types/site';
import { useAuth } from '@/hooks/useAuth';

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [userSite, setUserSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSites = async () => {
    try {
      setLoading(true);
      
      // Fetch all sites
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('*');

      if (sitesError) throw sitesError;
      setSites(sitesData as Site[]);
      
      // If user is authenticated, fetch their site
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('site_id')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        if (profileData?.site_id) {
          const userSiteData = sitesData?.find(site => site.id === profileData.site_id);
          setUserSite(userSiteData as Site || null);
        } else {
          setUserSite(null);
        }
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserSite = async (siteId: string) => {
    try {
      if (!user) return { success: false, error: 'User not authenticated' };
      
      const { error } = await supabase
        .from('profiles')
        .update({ site_id: siteId })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refresh site data after updating
      await fetchSites();
      return { success: true };
    } catch (error) {
      console.error('Error updating user site:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSites();
  }, [user?.id]);

  return {
    sites,
    userSite,
    loading,
    fetchSites,
    updateUserSite
  };
};
