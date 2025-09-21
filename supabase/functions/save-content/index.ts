const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Check for required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const adminSecret = Deno.env.get('ADMIN_SECRET');

    if (!supabaseUrl) {
      console.error('Missing SUPABASE_URL environment variable');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Missing SUPABASE_URL' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    if (!supabaseServiceKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    const { content, adminSecret: providedSecret } = requestData;

    // Validate admin secret
    const expectedSecret = adminSecret || 'podmotka1122_admin_secret';
    if (providedSecret !== expectedSecret) {
      console.error('Unauthorized access attempt');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // Validate content
    if (!content) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Content is required' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // Save to Supabase
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    let supabaseResponse;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempting to save to database (attempt ${attempt}/${maxRetries})`);
        
        supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/site_content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            id: 'main',
            content: content,
            updated_at: new Date().toISOString()
          })
        });

        if (supabaseResponse.ok) {
          console.log('Content saved to database successfully');
          break; // Success, exit retry loop
        }

        const errorText = await supabaseResponse.text();
        console.error(`Supabase error (attempt ${attempt}):`, {
          status: supabaseResponse.status,
          statusText: supabaseResponse.statusText,
          body: errorText
        });

        // Check if it's a retryable error (5xx errors, timeouts, etc.)
        const isRetryable = supabaseResponse.status >= 500 || 
                           supabaseResponse.status === 502 || 
                           supabaseResponse.status === 504 || 
                           supabaseResponse.status === 520 || 
                           supabaseResponse.status === 524 ||
                           errorText.includes('statement timeout') ||
                           errorText.includes('57014') ||
                           errorText.includes('timeout') ||
                           errorText.includes('gateway');

        if (isRetryable && attempt < maxRetries) {
          console.log(`Retryable error, waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }

        // Not retryable or max attempts reached
        lastError = { status: supabaseResponse.status, statusText: supabaseResponse.statusText, body: errorText };
        break;
        
      } catch (fetchError) {
        console.error(`Network error (attempt ${attempt}):`, fetchError);
        lastError = fetchError;
        
        if (attempt < maxRetries) {
          console.log(`Network error, waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
    }

    if (!supabaseResponse || !supabaseResponse.ok) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Database error: ${lastError?.status || 'Network Error'} ${lastError?.statusText || 'Connection Failed'}`,
          details: lastError?.body || lastError?.message || 'Unknown error'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    console.log('Content saved successfully after retries');
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      });

  } catch (error) {
    console.error('Unexpected error in save-content function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );
  }
});