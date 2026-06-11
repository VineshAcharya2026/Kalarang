import { getStore } from '@netlify/blobs';

export default async (req) => {
  const key = new URL(req.url).searchParams.get('key');
  if (!key) {
    return new Response('Missing key', { status: 400 });
  }

  try {
    const store = getStore('media');
    const data = await store.get(key, { type: 'arrayBuffer' });

    if (!data) {
      return new Response('Not found', { status: 404 });
    }

    let contentType = 'application/octet-stream';
    try {
      const meta = await store.getMetadata(key);
      contentType = meta?.metadata?.contentType || contentType;
    } catch {
      /* optional */
    }

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('serve-media error:', err);
    return new Response('Failed to load media', { status: 500 });
  }
};
