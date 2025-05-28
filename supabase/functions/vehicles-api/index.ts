import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Set the auth header for the supabase client
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is fleet admin using the existing database function
    const { data: isFleetAdmin, error: roleError } = await supabaseClient
      .rpc('is_fleet_admin', { user_id: user.id });

    if (roleError) {
      console.error('Error checking user role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify user permissions' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!isFleetAdmin) {
      return new Response(
        JSON.stringify({ error: 'Fleet admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Authenticated fleet admin request:', { 
      userId: user.id, 
      email: user.email,
      method: req.method, 
      path: new URL(req.url).pathname 
    });

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const vehicleId = pathSegments[pathSegments.length - 1];

    console.log('API Request:', { method: req.method, path: url.pathname, vehicleId });

    switch (req.method) {
      case 'GET':
        if (vehicleId && vehicleId !== 'vehicles-api') {
          // Get single vehicle by ID
          const { data: vehicle, error } = await supabaseClient
            .from('vehicles')
            .select(`
              *,
              profile:profiles(full_name, email),
              site:sites(name, location)
            `)
            .eq('id', vehicleId)
            .single();

          if (error) {
            console.error('Error fetching vehicle:', error);
            return new Response(
              JSON.stringify({ error: 'Vehicle not found' }),
              { 
                status: 404, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const formattedVehicle = {
            id: vehicle.id,
            registration_number: vehicle.registration_number,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            status: vehicle.status,
            location: vehicle.location,
            mileage: vehicle.mileage,
            operating_hours: vehicle.operating_hours,
            fuel_level: vehicle.fuel_level,
            battery_level: vehicle.battery_level,
            last_inspection: vehicle.last_inspection,
            next_maintenance: vehicle.next_maintenance,
            current_user: vehicle.profile ? {
              name: vehicle.profile.full_name,
              email: vehicle.profile.email
            } : null,
            site: vehicle.site ? {
              name: vehicle.site.name,
              location: vehicle.site.location
            } : null,
            booked_at: vehicle.booked_at,
            created_at: vehicle.created_at,
            updated_at: vehicle.updated_at
          };

          return new Response(
            JSON.stringify(formattedVehicle),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          // Get all vehicles with optional filters
          const status = url.searchParams.get('status');
          const type = url.searchParams.get('type');
          const site_id = url.searchParams.get('site_id');
          const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 100;
          const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : 0;

          let query = supabaseClient
            .from('vehicles')
            .select(`
              *,
              profile:profiles(full_name, email),
              site:sites(name, location)
            `)
            .range(offset, offset + limit - 1);

          if (status) {
            query = query.eq('status', status);
          }
          if (type) {
            query = query.eq('type', type);
          }
          if (site_id) {
            query = query.eq('site_id', site_id);
          }

          const { data: vehicles, error } = await query;

          if (error) {
            console.error('Error fetching vehicles:', error);
            return new Response(
              JSON.stringify({ error: 'Failed to fetch vehicles' }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          const formattedVehicles = vehicles.map(vehicle => ({
            id: vehicle.id,
            registration_number: vehicle.registration_number,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type,
            status: vehicle.status,
            location: vehicle.location,
            mileage: vehicle.mileage,
            operating_hours: vehicle.operating_hours,
            fuel_level: vehicle.fuel_level,
            battery_level: vehicle.battery_level,
            last_inspection: vehicle.last_inspection,
            next_maintenance: vehicle.next_maintenance,
            current_user: vehicle.profile ? {
              name: vehicle.profile.full_name,
              email: vehicle.profile.email
            } : null,
            site: vehicle.site ? {
              name: vehicle.site.name,
              location: vehicle.site.location
            } : null,
            booked_at: vehicle.booked_at,
            created_at: vehicle.created_at,
            updated_at: vehicle.updated_at
          }));

          return new Response(
            JSON.stringify({
              vehicles: formattedVehicles,
              total: formattedVehicles.length,
              limit,
              offset
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

      case 'PUT':
        if (!vehicleId || vehicleId === 'vehicles-api') {
          return new Response(
            JSON.stringify({ error: 'Vehicle ID is required for updates' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const updateData = await req.json();
        console.log('Update request for vehicle:', vehicleId, updateData);

        // Allow updating specific fields only
        const allowedFields = ['status', 'location', 'mileage', 'operating_hours', 'fuel_level', 'battery_level'];
        const filteredData: any = {};
        
        for (const field of allowedFields) {
          if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field];
          }
        }

        if (Object.keys(filteredData).length === 0) {
          return new Response(
            JSON.stringify({ error: 'No valid fields to update' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { data: updatedVehicle, error: updateError } = await supabaseClient
          .from('vehicles')
          .update(filteredData)
          .eq('id', vehicleId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating vehicle:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update vehicle' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ 
            message: 'Vehicle updated successfully', 
            vehicle: updatedVehicle 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { 
            status: 405, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
