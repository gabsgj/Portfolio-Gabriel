/**
 * Cloudflare Pages Function - Ping Tracker
 * Logs ping button clicks to Notion database
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const data = await request.json();
        
        // Get visitor info
        const visitorInfo = {
            browser: data.browser || 'Unknown',
            language: data.language || 'Unknown',
            platform: data.platform || 'Unknown',
            timezone: data.timezone || 'Unknown',
            screenSize: data.screenSize || 'Unknown',
            referrer: data.referrer || 'Direct',
        };

        // Get IP and location from Cloudflare
        const ip = request.headers.get('CF-Connecting-IP') || 'Unknown';
        const country = request.headers.get('CF-IPCountry') || 'Unknown';
        const city = request.cf?.city || 'Unknown';

        // Current timestamp
        const timestamp = new Date().toISOString();

        // Send to Notion
        const notionResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
                parent: { database_id: env.NOTION_DATABASE_ID },
                properties: {
                    'Name': {
                        title: [{ text: { content: `Ping from ${country}` } }]
                    },
                    'Timestamp': {
                        date: { start: timestamp }
                    },
                    'Browser': {
                        rich_text: [{ text: { content: visitorInfo.browser.substring(0, 100) } }]
                    },
                    'Country': {
                        select: { name: country }
                    },
                    'City': {
                        rich_text: [{ text: { content: city } }]
                    },
                    'Platform': {
                        select: { name: visitorInfo.platform }
                    },
                    'Language': {
                        rich_text: [{ text: { content: visitorInfo.language } }]
                    },
                    'Screen': {
                        rich_text: [{ text: { content: visitorInfo.screenSize } }]
                    },
                    'Referrer': {
                        url: visitorInfo.referrer !== 'Direct' ? visitorInfo.referrer : null
                    },
                }
            })
        });

        if (!notionResponse.ok) {
            const error = await notionResponse.text();
            console.error('Notion API error:', error);
            return new Response(JSON.stringify({ success: false, error: 'Notion API error' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true, message: 'Ping logged!' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}

// Handle CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
