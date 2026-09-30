import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string[] } }
) {
  const key = params.key.join('/');
  
  if (!key) {
    return new NextResponse('Missing key', { status: 400 });
  }

  const store = getStore('showroom-media');
  
  try {
    const blob = await store.get(key, { type: 'stream' });
    
    if (!blob) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const headers = new Headers();
    // Use metadata if available, otherwise fallback to guessing from extension
    // We didn't store content-type in metadata properly if using standard getStore maybe?
    // Actually we stored it as { metadata: { type: file.type } }
    const metadata = await store.getMetadata(key);
    const contentType = metadata?.metadata?.type || 'image/jpeg';
    
    headers.set('Content-Type', contentType as string);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(blob as any, { headers });
  } catch (err) {
    console.error('Error fetching blob:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
