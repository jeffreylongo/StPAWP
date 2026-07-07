const ALLOWED_HOSTS = new Set([
  'calendar.google.com',
  'localendar.com',
  'tampascottishrite.org',
  'tampayorkritebodies.com'
]);

exports.handler = async (event) => {
  try {
    const targetUrl = event.queryStringParameters?.url;

    if (!targetUrl) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Missing url query parameter' })
      };
    }

    const parsed = new URL(targetUrl);
    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
      return {
        statusCode: 403,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Host not allowed' })
      };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'accept': 'text/calendar, text/plain, */*',
        'user-agent': 'StPeteLodge139CalendarProxy/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: `Upstream error: ${response.status}` })
      };
    }

    const text = await response.text();
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/calendar; charset=utf-8',
        'cache-control': 'public, max-age=300'
      },
      body: text
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Proxy request failed' })
    };
  }
};
