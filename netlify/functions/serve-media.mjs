import { getStore } from '@netlify/blobs';

export async function handler(event) {
  const key = event.queryStringParameters?.key;
  if (!key) {
    return { statusCode: 400, body: 'Missing key' };
  }

  try {
    const store = getStore('media');
    const data = await store.get(key, { type: 'arrayBuffer' });

    if (!data) {
      return { statusCode: 404, body: 'Not found' };
    }

    let contentType = 'application/octet-stream';
    try {
      const meta = await store.getMetadata(key);
      contentType = meta?.metadata?.contentType || contentType;
    } catch {
      /* metadata optional */
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: Buffer.from(data).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('serve-media error:', err);
    return { statusCode: 500, body: 'Failed to load media' };
  }
}
