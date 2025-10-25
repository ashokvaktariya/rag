import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'griffen@canopyadvisory.com',
      password: '12345678',
      email_confirm: true
    })

    if (adminError) {
      console.error('Error creating admin user:', adminError)
      throw adminError
    }

    // Assign admin role
    const { error: adminRoleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: adminUser.user.id,
        role: 'admin'
      })

    if (adminRoleError) {
      console.error('Error assigning admin role:', adminRoleError)
      throw adminRoleError
    }

    // Create regular user
    const { data: regularUser, error: regularError } = await supabaseAdmin.auth.admin.createUser({
      email: 'mc@canopyadvisory.com',
      password: '12345678',
      email_confirm: true
    })

    if (regularError) {
      console.error('Error creating regular user:', regularError)
      throw regularError
    }

    // Assign user role
    const { error: userRoleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: regularUser.user.id,
        role: 'user'
      })

    if (userRoleError) {
      console.error('Error assigning user role:', userRoleError)
      throw userRoleError
    }

    return new Response(
      JSON.stringify({
        message: 'Users created successfully',
        admin: adminUser.user.email,
        user: regularUser.user.email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
